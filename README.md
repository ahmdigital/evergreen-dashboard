# 🌲 Evergreen Dashboard

[![Build](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/build.yml)
[![Docker](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/docker.yml)
[![Terraform azure](https://github.com/ahm-monash/evergreen/actions/workflows/terraform_azure.yml/badge.svg)](https://github.com/ahm-monash/evergreen/actions/workflows/terraform_azure.yml)


This Evergreen Dashboard tracks how outdated your GitHub organisation internal and external dependencies are.

It crawls your GitHub organisation and keeps track of which npm dependencies you are using.
It then checks with npm public registry whether your npm dependencies are outdated.

It can also listen to [GitHub webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) `push` and `repositories` events, which allows the dashboard to silently update the cache results.

- [🌲 Evergreen Dashboard](#-evergreen-dashboard)
  - [Setup Instructions](#setup-instructions)
    - [Running pre-commit hooks manually](#running-pre-commit-hooks-manually)
    - [Skipping pre-commit hooks](#skipping-pre-commit-hooks)
    - [ENV](#env)
    - [Authentication](#authentication)
    - [GitHub webhooks](#github-webhooks)
    - [Configuration](#configuration)
    - [Running](#running)
      - [Docker-compose](#docker-compose)
    - [Querying Internal Endpoints](#querying-internal-endpoints)
  - [Deploying](#deploying)
    - [Standalone](#standalone)
    - [Docker](#docker)
    - [Provisioning the infrastructure from terraform cli](#provisioning-the-infrastructure-from-terraform-cli)
      - [Azure App Service](#azure-app-service)
      - [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
  - [Contributing](#contributing)

## Setup Instructions

Before you commit, please configure pre-commit with:

`pre-commit install`

### Running pre-commit hooks manually

`pre-commit run --all-files`

### Skipping pre-commit hooks

Please avoid doing this at all cost.

`git commit -n -m "Your commit message"`

The `-n` allows you to skip git hooks.

### ENV

Make sure you have the following variables in `.env` file.

```
EVERGREEN_GITHUB_TOKEN= GitHub token that has full repo scope and admin:org-read:org
NEXT_PUBLIC_TARGET_ORGANISATION= The target GitHub organisation to track
GITHUB_WEBHOOK_IS_ENABLED=false Whether webhook are setup for the target organisation
REQUIRE_AUTHENTICATION=true Whether authentication is enabled
DYNAMIC_CACHE_DIR= A directory with write privileges
CLIENT_SECRET= GitHub Oauth client secret
NEXT_PUBLIC_CLIENT_ID= GitHub client ID
NEXT_PUBLIC_REDIRECT_URI=http://example.com/signin/
```

The `EVERGREEN_GITHUB_TOKEN` is needed to query GitHub API and access private repositories

The `DYNAMIC_CACHE_DIR` is only required if the environment only allows you to write to a specific path/directory.

If `REQUIRE_AUTHENTICATION` is set to `false`, then the last three variables are not needed.

### Authentication

*Note this is only required if you want to enable GitHub authentication*

Setup GitHub [OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) and make sure to record your client ID and secret.

When authenticating, we ask for the following privileges:
* full `repo` scope, used to query GitHub API and access private repositories
* admin:org-read:org, used to validate whether the user is part of the organisation.

### GitHub webhooks

Go to your webhook `https://github.com/organizations/EXAMPLE_ORG/settings/hooks` and setup a webhook with the following settings:
* Payload URL: `YOUR_HOSTNAME/api/payload`
* Content type: `application/json`
* Secret: `None`
* SSL verification: `Enable`
* Let me select individual events
  * `pushes`
  * `repositories`

### Configuration

Use the file [config.json](./config.json) to customise the dashboard based on your need.

### Running

In the root directory for the project, run the following to install the necessary dependencies:

```bash
npm install
```

Setup a `.env` file with the environment variables populated, the run the crawler with.

```bash
npm run dev
```

Then go to [http://localhost:3000](http://localhost:3000)

#### Docker-compose

Running as a docker container

`docker-compose up --build`

### Querying Internal Endpoints

If GitHub webhook are setup for the target organisation`/api/payload` endpoint

This Dashboard can listen to GitHub `push` and `repositories` events.

Refer to GitHub documentations for examples of [push](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push) and [repositories](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#repository) events.

To test the `/api/payload` locally using `curl`:

```bash
curl -X POST 'http://localhost:3000/api/payload' \
-H 'x-github-delivery: $(date +%s)'
-H 'X-GitHub-Event: push' \
-H 'Content-Type: application/json' \
-d @pathto/push.sample.json
```

## Deploying

Setup a `.env` file with the environment variables populated, refer to [env section](#env).

If using authentication, then refer to [Authentication section](#authentication)

### Standalone

Update the configs to your liking, then:

1. `npm ci`
2. `npm run build`
3. `npm start`

### Docker

Docker images come with default [configs](config.json),it can not be altered unless a new image is built.

`docker run --rm -it --env-file .env -p 3000:3000 mtempty/evergreendashboard`

### Provisioning the infrastructure from terraform cli

This uses Terraform cloud(source of truth) to maintain the state of the infrastructure, Please make sure to setup environment variables correctly

#### Azure App Service

A [docker](#docker) container is used to deploy to App Service.

1. `terraform init`
2. `docker-compose build`
3. `docker tag evergreendashboard:latest <DOCKERHUB_ACCOUNT_NAME>/evergreendashboard:latest`
4. Change the local docker variable in the main.tf
5. `terraform apply`, it will ask you to accept the configuration, enter `yes` once you have read the plan
6. Wait until terraform finishes applying the plan, once it's done it will output the hostname in the terminal

#### AWS Elastic Beanstalk

A [standalone](#standalone) app gets deployed to Elastic Beanstalk:

1. `terraform init`
2. `bash bootstrap.sh`, currently works on linux, if on other OSs, simply zip the required files(refer to `bootstrap.sh`)
3. `terraform apply`, it will ask you to accept the configuration, enter `yes` once you have read the plan
4. Wait until terraform finishes applying the plan, once it's done it will output the hostname in the terminal


## Contributing

Contributions are most welcome!

Before opening a PR:

- Make sure that there isn't an active PR already open which makes the same changes
- Make sure to check if there are issues related to your PR
- Make sure that your branch name follows `{name}/{description}`
