<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | 4.6.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 4.6.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_elastic_beanstalk_application.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/elastic_beanstalk_application) | resource |
| [aws_elastic_beanstalk_application_version.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/elastic_beanstalk_application_version) | resource |
| [aws_elastic_beanstalk_environment.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/elastic_beanstalk_environment) | resource |
| [aws_iam_instance_profile.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/iam_role) | resource |
| [aws_s3_bucket.eb_app](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_versioning.this](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/s3_bucket_versioning) | resource |
| [aws_s3_object.eb_app](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/resources/s3_object) | resource |
| [aws_caller_identity.current_identity](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.assume_policy](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.permissions](https://registry.terraform.io/providers/hashicorp/aws/4.6.0/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_app_description"></a> [app\_description](#input\_app\_description) | n/a | `string` | `"Monitoring Github orgnisation dependencies"` | no |
| <a name="input_app_name"></a> [app\_name](#input\_app\_name) | n/a | `string` | `"ever-green"` | no |
| <a name="input_client_id"></a> [client\_id](#input\_client\_id) | Github evergreen dashboard oauth Oauth client id | `string` | n/a | yes |
| <a name="input_client_secret"></a> [client\_secret](#input\_client\_secret) | Github evergreen dashboard Oauth app client secret | `string` | n/a | yes |
| <a name="input_dynamic_cache_directory"></a> [dynamic\_cache\_directory](#input\_dynamic\_cache\_directory) | where should files be written to | `string` | `"/home/"` | no |
| <a name="input_evergreen_github_token_scope_read_org"></a> [evergreen\_github\_token\_scope\_read\_org](#input\_evergreen\_github\_token\_scope\_read\_org) | Github token that has full repo scope and admin:org-read:org | `string` | n/a | yes |
| <a name="input_github_webhook_is_enabled"></a> [github\_webhook\_is\_enabled](#input\_github\_webhook\_is\_enabled) | Whether Github organisation webhook is enabled | `string` | `"false"` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | EC2 instance type | `string` | `"t2.micro"` | no |
| <a name="input_max_instance_count"></a> [max\_instance\_count](#input\_max\_instance\_count) | Max instance count in auto scaling group | `number` | `1` | no |
| <a name="input_redirect_uri"></a> [redirect\_uri](#input\_redirect\_uri) | Oauth app redirect uri | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | Amazon region | `string` | `"ap-southeast-2"` | no |
| <a name="input_require_authentication"></a> [require\_authentication](#input\_require\_authentication) | Whether Github authentication is required to access the dashboard | `string` | `"false"` | no |
| <a name="input_target_organisation"></a> [target\_organisation](#input\_target\_organisation) | The name of the Github organisation that is tracked | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_endpoint_url"></a> [endpoint\_url](#output\_endpoint\_url) | Evergreen hostname on elastic beanstalk |
<!-- END_TF_DOCS -->
