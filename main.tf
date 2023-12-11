variable "aws_access_key" {}
variable "aws_secret_key" {}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
}


###################################################
# ECR Repository
###################################################

resource "aws_ecr_repository" "ecr_nest_fiap" {
  name                 = "apl-pedido-back"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}


