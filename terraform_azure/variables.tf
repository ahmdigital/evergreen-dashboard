# varaibles can change at runtime

variable "github_token_scope_read_org" {
  type        = string
  description = "Github token that has a scope read organistaion repositories"
  sensitive   = true
}

variable "client_id" {
  type        = string
  description = "Github evergreen oauth app client id"
  sensitive   = true
}

variable "client_secret" {
  type        = string
  description = "Github evergreen oauth app client secret"
  sensitive   = true
}

variable "port" {
  type        = string
  description = "application port number, azure web app defines port using WEBSITES_PORT"
  default     = "3000"
}

variable "dynamic_cache_path" {
  type        = string
  description = "Azure ewb app custom container only allows write permission on /home"
  default     = "/home/dynamicCache.json"
}

variable "app_name" {
  type    = string
  default = "evergreendashboard"
}

variable "app_description" {
  type    = string
  default = "Monitoring Github orgnization dependencies"
}

variable "location" {
  description = "Azure location"
  type        = string
  default     = "Australia Southeast"
}

variable "instance_type" {
  type = object({
    sku_name = string
    os_type  = string
  })
  description = "Stock Keeping Unit type and the operating system"
  default = {
    sku_name = "B1"
    os_type  = "Linux"
  }
}
