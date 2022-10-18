# varaibles can change at runtime

variable "github_token_scope_read_org" {
  type        = string
  description = "Github token that has a scope read organisation repositories"
  sensitive   = true
}

variable "client_id" {
  type        = string
  description = "Github evergreen dashboard oauth Oauth client id"
  sensitive   = false
}

variable "client_secret" {
  type        = string
  description = "Github evergreen dashboard Oauth app client secret"
  sensitive   = true
}

variable "require_authentication" {
  type        = string
  description = "Whether Github authentication is required to access the dashboard"
  sensitive   = false
  default     = "false"
}

variable "target_organisation" {
  type        = string
  description = "The name of the Github organisation that is tracked"
  sensitive   = false
}

variable "redirect_uri" {
  type        = string
  description = "Oauth app redirect uri"
  sensitive   = false
}

variable "port" {
  type        = string
  description = "Application port number, azure web app defines port using WEBSITES_PORT"
  sensitive   = false
  default     = "3000"
}

variable "github_webhook_is_enabled" {
  type        = string
  description = "Whether Github organisation webhook is enabled"
  sensitive   = true
  default     = "false"
}

variable "dynamic_cache_directory" {
  type        = string
  description = "Azure web app custom container only allows write permission on /home"
  sensitive   = false
  default     = "/home/"
}

variable "app_name" {
  type        = string
  description = "Also used as the subdomain if deployed on azure as is, may conflict if left unchanged"
  sensitive   = false
  default     = "evergreendashboard"
}

variable "app_description" {
  type      = string
  sensitive = false
  default   = "Monitoring Github orgnisation dependencies"
}

variable "location" {
  description = "Azure location"
  type        = string
  sensitive   = false
  default     = "Australia Southeast"
}

variable "instance_type" {
  type = object({
    sku_name = string
    os_type  = string
  })
  description = "Stock Keeping Unit type and the operating system"
  sensitive   = false
  default = {
    sku_name = "B1"
    os_type  = "Linux"
  }
}
