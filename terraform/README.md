<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.1.0 |
| <a name="requirement_archive"></a> [archive](#requirement\_archive) | 2.2.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | 4.6.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | ~> 3.0.0 |

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
| <a name="input_app_description"></a> [app\_description](#input\_app\_description) | n/a | `string` | `"Monitorign Github orgnization health"` | no |
| <a name="input_app_name"></a> [app\_name](#input\_app\_name) | n/a | `string` | `"ever-green"` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | EC2 instance type | `string` | `"t2.micro"` | no |
| <a name="input_max_instance_count"></a> [max\_instance\_count](#input\_max\_instance\_count) | Max instance count in auto scaling group | `number` | `2` | no |
| <a name="input_region"></a> [region](#input\_region) | Amazon region | `string` | `"ap-southeast-2"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_endpoint_url"></a> [endpoint\_url](#output\_endpoint\_url) | Ever green endpoint to the elastic beanstalk environment |
<!-- END_TF_DOCS -->