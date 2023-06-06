# twelventi-dot-com
the twelventi.com website


# Steps for building and pushing a new package (until I get a CI working)

1. Run `yarn build` and `yarn push` from the root of the repo (to build and push the docker container to GCP artifact registry)

2. Swap the `docker_image_sha` in the tf vars file

3. Run `terraform apply` (or to be safer, run terraform plan --out, and apply from the plan)
