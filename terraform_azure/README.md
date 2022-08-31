<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.1.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~> 3.19.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 3.19.1 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_linux_web_app.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app) | resource |
| [azurerm_resource_group.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_service_plan.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_app_description"></a> [app\_description](#input\_app\_description) | n/a | `string` | `"Monitoring Github orgnization dependencies"` | no |
| <a name="input_app_name"></a> [app\_name](#input\_app\_name) | n/a | `string` | `"evergreendashboard"` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | Stock Keeping Unit type and the operating system | <pre>object({<br>    sku_name = string<br>    os_type  = string<br>  })</pre> | <pre>{<br>  "os_type": "Linux",<br>  "sku_name": "B1"<br>}</pre> | no |
| <a name="input_location"></a> [location](#input\_location) | Azure location | `string` | `"Australia Southeast"` | no |
| <a name="input_max_instance_count"></a> [max\_instance\_count](#input\_max\_instance\_count) | Max instance count in auto scaling group | `number` | `1` | no |
| <a name="input_port"></a> [port](#input\_port) | application port number | `number` | `3000` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_web_app_default_hostname"></a> [web\_app\_default\_hostname](#output\_web\_app\_default\_hostname) | Web application default hostname |
<!-- END_TF_DOCS -->
