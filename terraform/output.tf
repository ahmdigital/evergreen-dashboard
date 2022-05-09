# defines what values to output once the infrustruture is deployed

output "endpoint_url" {
  description = "Ever green endpoint to the elastic beanstalk environment"
  value       = aws_elastic_beanstalk_environment.this.cname
}
