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
    PORT = var.port
    # azure exposed container port
    WEBSITES_PORT            = var.port
    NEXT_PUBLIC_GITHUB_TOKEN = var.github_token_scope_read_org
    CLIENT_ID                = var.client_id
    CLIENT_SECRET            = var.client_secret
    # write permission allowed on /home
    DYNAMIC_CACHE_PATH = "/home/dynamicCache.json"

    # in case org has changed we don't to read old org data
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
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
