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
| <a name="input_app_description"></a> [app\_description](#input\_app\_description) | n/a | `string` | `"Monitoring Github orgnisation dependencies"` | no |
| <a name="input_app_name"></a> [app\_name](#input\_app\_name) | Also used as the subdomain if deployed on azure as is, may conflict if left unchanged | `string` | `"evergreendashboard"` | no |
| <a name="input_client_id"></a> [client\_id](#input\_client\_id) | Github evergreen dashboard oauth Oauth client id | `string` | n/a | yes |
| <a name="input_client_secret"></a> [client\_secret](#input\_client\_secret) | Github evergreen dashboard Oauth app client secret | `string` | n/a | yes |
| <a name="input_dynamic_cache_directory"></a> [dynamic\_cache\_directory](#input\_dynamic\_cache\_directory) | Azure web app custom container only allows write permission on /home | `string` | `"/home/"` | no |
| <a name="input_github_token_scope_read_org"></a> [github\_token\_scope\_read\_org](#input\_github\_token\_scope\_read\_org) | Github token that has full repo scope and admin:org-read:org | `string` | n/a | yes |
| <a name="input_github_webhook_is_enabled"></a> [github\_webhook\_is\_enabled](#input\_github\_webhook\_is\_enabled) | Whether Github organisation webhook is enabled | `string` | `"false"` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | Stock Keeping Unit type and the operating system | <pre>object({<br>    sku_name = string<br>    os_type  = string<br>  })</pre> | <pre>{<br>  "os_type": "Linux",<br>  "sku_name": "F1"<br>}</pre> | no |
| <a name="input_location"></a> [location](#input\_location) | Azure location | `string` | `"Australia Southeast"` | no |
| <a name="input_port"></a> [port](#input\_port) | Application port number, azure web app defines port using WEBSITES\_PORT | `string` | `"3000"` | no |
| <a name="input_redirect_uri"></a> [redirect\_uri](#input\_redirect\_uri) | Oauth app redirect uri | `string` | n/a | yes |
| <a name="input_require_authentication"></a> [require\_authentication](#input\_require\_authentication) | Whether Github authentication is required to access the dashboard | `string` | `"false"` | no |
| <a name="input_target_organisation"></a> [target\_organisation](#input\_target\_organisation) | The name of the Github organisation that is tracked | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_web_app_default_hostname"></a> [web\_app\_default\_hostname](#output\_web\_app\_default\_hostname) | Web application default hostname |
<!-- END_TF_DOCS -->
