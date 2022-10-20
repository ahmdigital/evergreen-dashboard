# 🌲 Evergreen Dashboard

[![Build](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml)
[![Docker](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml)
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

## Internal Endpoints

```
curl -X POST 'http://localhost:3000/api/payload' \
-H 'x-github-delivery: $(date +%s)'
-H 'X-GitHub-Event: push' \
-H 'Content-Type: application/json' \
-d @pathto/push.sample.json
```

## Running

### ENV

Make sure you have the following requirements in `.env`

```
EVERGREEN_GITHUB_TOKEN=
NEXT_PUBLIC_TARGET_ORGANISATION=
GITHUB_WEBHOOK_IS_ENABLED=false
REQUIRE_AUTHENTICATION=true
DYNAMIC_CACHE_DIR=
CLIENT_SECRET=
NEXT_PUBLIC_CLIENT_ID=
NEXT_PUBLIC_REDIRECT_URI=http://example.com/signin/
```

`DYNAMIC_CACHE_DIR` is only required if the environment only allows you to write to a specific path/directory.

If `REQUIRE_AUTHENTICATION` is set to `false`, then the last three variables are not needed.

### (Authentication only)

Setup github [OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) to be used for authentication.

When authenticating, we ask for `repo` scope, to validate whether the user is part of the organisation.

<!-- ### Custom configuration

Use the file `custom-config.json` to customise the app based on your need.

Please refer to `custom-config.sample` for guidance. -->

### Standalone

1. `npm run build`
2. `npm start`


### Docker

`docker-compose up --build`

### Provisioning the infrastructure from terraform cli

It uses Terraform cloud(source of truth) to maintain the state of the infrastructure, Please make sure to setup environment variables correctly

#### Azure App Service

A docker container is used to deploy to App Service.

1. `terraform init`
2. `docker-compose build`
3. `docker tag evergreendashboard:latest <DOCKERHUB_ACCOUNT_NAME>/evergreendashboard:latest`
4. Change the local docker variable in the main.tf
5. `terraform apply`, it will ask you to accept the configuration, enter `yes` once you have read the plan
6. Wait until terraform finishes applying the plan, once it's done it will output the url of the website

#### AWS Elastic Beanstalk

A standalone app gets deployed to Elastic Beanstalk:

1. `terraform init`
2. `bash bootstrap.sh`, currently works on linux, if on other OSs, simply zip the required files(refer to `bootstrap.sh`)
3. `terraform apply`, it will ask you to accept the configuration, enter `yes` once you have read the plan
4. Wait until terraform finishes applying the plan, once it's done it will output the url of the website
