terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_ebs_volume" "ebsvolumedemo" {
  availability_zone = "${var.region}a"
  size              = 40
}

resource "aws_s3_bucket" "customerdata" {
  bucket = "customer-data-demo"
  
  tags = merge(var.default_tags, {
    name = "customer_data_${var.environment}"
  })
}

resource "aws_iam_account_password_policy" "strict" {
  #minimum_password_length        = 8
  #require_lowercase_characters   = true
  #require_numbers                = true
  #require_uppercase_characters   = true
  #require_symbols                = true
  #allow_users_to_change_password = true
  max_password_age = 365
  #password_reuse_prevention      = 12
}
