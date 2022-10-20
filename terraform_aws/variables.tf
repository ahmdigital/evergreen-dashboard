# varaibles can change at runtime

variable "region" {
  description = "Amazon region"
  type        = string
  default     = "ap-southeast-2"
}

variable "evergreen_github_token_scope_read_org" {
  type        = string
  description = "Github token that has full repo scope and admin:org-read:org"
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

variable "github_webhook_is_enabled" {
  type        = string
  description = "Whether Github organisation webhook is enabled"
  sensitive   = true
  default     = "false"
}

variable "dynamic_cache_directory" {
  type        = string
  description = "where should files be written to"
  sensitive   = false
  default     = "/home/"
}

variable "app_name" {
  type      = string
  sensitive = false
  default   = "ever-green"
}

variable "app_description" {
  type      = string
  sensitive = false
  default   = "Monitoring Github orgnisation dependencies"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "max_instance_count" {
  type        = number
  description = "Max instance count in auto scaling group"
  default     = 1
}
