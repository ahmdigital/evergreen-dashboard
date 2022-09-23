terraform {
  required_version = ">= 1.1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.19.0"
    }
  }
  cloud {
    organization = "example-org-76fbff"

    workspaces {
      name = "evergreen-azure"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  # this should use semantic versioning, otherwise it will
  # not trigger doployment when a new 'latest' image is pushed
  build_imge_tag = "latest"
  docker_image   = "docker.io/mtempty/evergreendashboard"
}

resource "azurerm_resource_group" "this" {
  name     = var.app_name
  location = var.location
}

resource "azurerm_service_plan" "this" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_name            = var.instance_type.sku_name
  os_type             = var.instance_type.os_type
}

resource "azurerm_linux_web_app" "this" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_service_plan.this.location
  service_plan_id     = azurerm_service_plan.this.id
  app_settings = {
    PORT                     = var.port
    WEBSITES_PORT            = var.port
    EVERGREEN_GITHUB_TOKEN   = var.github_token_scope_read_org
    NEXT_PUBLIC_CLIENT_ID    = var.client_id
    NEXT_PUBLIC_REDIRECT_URI = var.redirect_uri
    CLIENT_SECRET            = var.client_secret
    DYNAMIC_CACHE_PATH       = var.dynamic_cache_path

    # The documentation not very clear on write permission of /home
    # Also, in case org has changed, old org data must be deleted
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = true
  }
  site_config {
    application_stack {
      docker_image     = local.docker_image
      docker_image_tag = local.build_imge_tag
    }
    always_on         = var.instance_type.sku_name != "F1" ? true : false
    health_check_path = "/"
    http2_enabled     = true
  }
}
