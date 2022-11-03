# defines what values to output once the infrustruture is deployed

output "endpoint_url" {
  description = "Evergreen hostname on elastic beanstalk"
  value       = aws_elastic_beanstalk_environment.this.cname
}
