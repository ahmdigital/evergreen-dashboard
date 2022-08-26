# varaibles can change at runtime

variable "port" {
  type        = number
  description = "application port number"
  default     = 3000
}

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

variable "max_instance_count" {
  type        = number
  description = "Max instance count in auto scaling group"
  default     = 1
}
