# 🌲 Evergreen Dashboard

[![Docker](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml)
[![Build](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml)
[![Terraform azure](https://github.com/ahm-monash/evergreen/actions/workflows/terraform_azure.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/terraform_azure.yml)

## Repository Setup

Before you commit, please configure pre-commit with:

`pre-commit install`

### Running pre-commit hooks manually

`pre-commit run --all-files`

### Skipping pre-commit hooks

Please avoid doing this at all cost.

`git commit -n -m "Your commit message"`

The `-n` allows you to skip git hooks.

### ENV

```
NEXT_PUBLIC_GITHUB_TOKEN=
CLIENT_id=
CLIENT_SECRET=
```
## Provisioning the infrastructure locally

Make sure you have terraform installed, to deploy follow these steps:

### AWS Beanstalk

1. `terraform init`
2. `bash bootstrap.sh`, currently works on linux, if on other OSs simply zip the required files(refer to `bootstrap.sh`)
3. `terraform apply`, it will ask you to accept the configuration, type `yes` once you have read the plan
4. Wait until terraform finishes applying the plan, once it's done it will output the url of the website

### Azure web app

Because azure web app was not executing the build command, a docker container was used instead

1. `terraform init`
2. `docker-compose build`
3. `docker tag evergreendashboard:latest <DOCKERHUB_ACCOUNT_NAME>/evergreendashboard:latest`
4. Change the local variable in the
5. `terraform apply`, it will ask you to accept the configuration, type `yes` once you have read the plan
6. Wait until terraform finishes applying the plan, once it's done it will output the url of the website
