terraform {
  required_version = ">= 1.1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.6.0"
    }
    null = {
      version = "~> 3.0.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.2.0"
    }

  }
  cloud {
    organization = "example-org-76fbff"

    workspaces {
      name = "ever-green-backend"
    }
  }
}


provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current_identity" {}

data "aws_iam_policy_document" "assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "permissions" {
  statement {
    actions = [
      "cloudwatch:PutMetricData",
      "ec2:DescribeInstanceStatus",
      "ec2messages:*",
    ]
    resources = ["*"]
  }
}


locals {
  account_id          = data.aws_caller_identity.current_identity.account_id
  prefix              = "ever-green"
  ecr_repository_name = "${local.prefix}-image-repo"
  build_imge_tag      = "latest"
  achive_path         = "${path.module}/eb_app.zip"
}


resource "aws_s3_bucket" "eb_app" {
  bucket = "${local.prefix}-ebapp"
  # acl    = "private"
  force_destroy = true

  # server_side_encryption_configuration {
  #   rule {
  #     apply_server_side_encryption_by_default {
  #       sse_algorithm = "AES256"
  #     }
  #   }
  # }

}

resource "aws_s3_object" "eb_app" {
  bucket = aws_s3_bucket.eb_app.id
  key    = filesha1(local.achive_path)
  source = local.achive_path
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.eb_app.id
  versioning_configuration {
    status = "Enabled"
  }
}
resource "aws_iam_instance_profile" "this" {
  name = "event-driven-ec2-profile"
  role = aws_iam_role.this.name
}

resource "aws_iam_role" "this" {
  assume_role_policy = data.aws_iam_policy_document.assume_policy.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier",
    "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds"
  ]

  inline_policy {
    name   = "eb-application-permissions"
    policy = data.aws_iam_policy_document.permissions.json
  }
}


resource "aws_elastic_beanstalk_application" "this" {
  name        = var.app_name
  description = var.app_description
}

resource "aws_elastic_beanstalk_application_version" "this" {
  name        = "${local.ecr_repository_name}-${local.build_imge_tag}"
  application = aws_elastic_beanstalk_application.this.name
  description = "application version created by terraform"
  bucket      = aws_s3_bucket.eb_app.id
  key         = aws_s3_object.eb_app.id
}

resource "aws_elastic_beanstalk_environment" "this" {
  name                = "${var.app_name}-env"
  application         = aws_elastic_beanstalk_application.this.name
  solution_stack_name = "64bit Amazon Linux 2 v5.5.0 running Node.js 16"
  version_label       = aws_elastic_beanstalk_application_version.this.name
  cname_prefix        = "${local.prefix}-app"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.this.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = var.instance_type
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = var.max_instance_count
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBScheme"
    value     = "internet facing"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "MatcherHTTPCode"
    value     = 200
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/docs"
  }

}
