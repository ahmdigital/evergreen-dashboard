# 🌲 Evergreen Dashboard

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

1. `terraform init`
2. `bash bootstrap.sh`, currently works on linux, if on other OSs simply zip the required files(refer to `bootstrap.sh`)
3. `terraform apply`, it will ask you to accept the configuration, type `yes`
