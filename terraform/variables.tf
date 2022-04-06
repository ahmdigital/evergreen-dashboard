# varaibles can change at runtime

variable "region" {
    description = "Amazon region"
    type = string
    default = "ap-southeast-2"
}

variable "app_name" {
    type = string
    default = "ever-green"
}

variable "app_description" {
    type = string
    default = "Monitorign Github orgnization health"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "max_instance_count" {
  type        = number
  description = "Max instance count in auto scaling group"
  default     = 2
}
