#!/bin/bash

# yarn build
# yarn push

SHA=$(docker inspect --format='{{index .RepoDigests 0}}' twelventi  | perl -wnE'say /sha256.*/g')

cat ./infra/terraform.tfvars | sed -e "s/docker_image_sha = \"\(.*\)\"/docker_image_sha = \"${SHA}\"/g" | tee ./infra/terraform.tfvars

cd infra 
terraform apply