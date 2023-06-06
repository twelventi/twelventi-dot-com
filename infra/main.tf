#terraform 1.4.5
terraform {
  required_version = ">= 0.14"

  required_providers {
    # Cloud Run support was added on 3.3.0
    google = ">= 3.3"
  }
}

variable "project_name" {
  type        = string
  description = "GCP Project Name"
}

variable "web_domain" {
  type        = string
  description = "Location where the web app will be deployed"
}

variable "location" {
  type        = string
  default     = "us-east1"
  description = "Cloud Location for GCP"
}

variable "google_creds_file" {
  type        = string
  default     = ""
  description = "Google Credentials File"
}

variable "docker_image_sha" {
  type        = string
  default     = "sha256:120fd0ed75593f6065430cfe9721f59054fd62a4626bbd9105a894456d0f51c5"
  description = "Docker Image Sha"
}

provider "google" {
  credentials = file(var.google_creds_file)
  project     = var.project_name
}

# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

resource "google_artifact_registry_repository" "my-repo" {
  location      = var.location
  repository_id = "${var.project_name}-repository"
  description   = "Twelventi Repository"
  format        = "DOCKER"

}

## Create a bucket to store the terraform state
resource "google_storage_bucket" "default" {
  name          = "tf-state-bucket-twelventi"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

# #https://cloud.google.com/docs/terraform/resource-management/store-state
terraform {
  backend "gcs" {
    bucket = "tf-state-bucket-twelventi"
    prefix = "terraform/state"
  }
}


# Deploy image to Cloud Run
resource "google_cloud_run_service" "app" {
  name     = "${var.project_name}-app"
  location = var.location
  template {
    spec {
      service_account_name = "terraform-db-mac@twelventi.iam.gserviceaccount.com"
      containers {
        image = "us-east1-docker.pkg.dev/${var.project_name}/${google_artifact_registry_repository.my-repo.repository_id}/app@${var.docker_image_sha}"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]

}

# Create public access
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Enable public access on Cloud Run service
resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.app.location
  project     = google_cloud_run_service.app.project
  service     = google_cloud_run_service.app.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

# Return service URL
output "url" {
  value = google_cloud_run_service.app.status[0].url
}

# note -> this still requires you point this domain at your app 
# from your DNS provider (unless the domain is owned by google cloud api)
# also note, google cloud domains are DIFFERENT from domains owned at
# domains.google.com ... those can't be managed by terraform/google cloud
resource "google_cloud_run_domain_mapping" "app" {
  name     = var.web_domain
  location = var.location
  metadata {
    namespace = var.project_name
  }
  spec {
    route_name = google_cloud_run_service.app.name
  }
}

resource "google_cloud_run_domain_mapping" "wwwapp" {
  name     = "www.${var.web_domain}"
  location = var.location
  metadata {
    namespace = var.project_name
  }
  spec {
    route_name = google_cloud_run_service.app.name
  }
}

