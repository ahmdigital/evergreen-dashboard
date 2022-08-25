# varaibles can change at runtime

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

variable "port" {
  type        = number
  description = "application port number"
  default     = 3000
}
