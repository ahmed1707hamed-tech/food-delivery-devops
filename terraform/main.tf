module "vpc" {
  source = "./modules/vpc"
}

module "ec2" {
  source = "./modules/ec2"

  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.vpc.security_group_id

  instance_type = var.instance_type
  key_name      = var.key_name
}