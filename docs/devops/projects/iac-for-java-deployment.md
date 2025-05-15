# Infrastructure as Code for Java Deployments

## Overview
This tutorial demonstrates how to implement Infrastructure as Code (IaC) for deploying Java applications. We'll cover using Terraform to provision cloud resources and various deployment tools to manage Java applications in a cloud environment.

## Prerequisites
- Basic understanding of [infrastructure as code](../infrastructure-as-code.md)
- Familiarity with cloud services (AWS used in examples)
- Experience with Java application packaging
- Knowledge of containerization basics
- AWS account (for examples)
- Terraform installed locally

## Learning Objectives
- Understand IaC principles for Java application deployments
- Implement Terraform for cloud resource provisioning
- Configure application deployment automation
- Implement environment-specific configurations
- Set up database provisioning and configuration
- Create reusable infrastructure modules
- Implement best practices for security and compliance

## Setting Up the Project Structure

A well-organized IaC project structure helps maintain clarity and separation of concerns:

```
project-root/
├── terraform/
│   ├── modules/
│   │   ├── networking/
│   │   ├── database/
│   │   ├── app_cluster/
│   │   └── monitoring/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   └── scripts/
├── app/
│   └── ... (Java application source)
├── scripts/
│   └── deploy.sh
└── README.md
```

## Implementing Core Infrastructure with Terraform

### Step 1: Create a Base Networking Module

Create the file `terraform/modules/networking/main.tf`:

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-public-subnet-${count.index + 1}"
    Environment = var.environment
    Tier        = "Public"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + length(var.availability_zones))
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "${var.environment}-private-subnet-${count.index + 1}"
    Environment = var.environment
    Tier        = "Private"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-igw"
    Environment = var.environment
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-public-route-table"
    Environment = var.environment
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
```

Create `terraform/modules/networking/outputs.tf`:

```hcl
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
```

### Step 2: Create a Database Module

Create the file `terraform/modules/database/main.tf`:

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where the database will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the database subnet group"
  type        = list(string)
}

variable "engine" {
  description = "Database engine (e.g., mysql, postgres)"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Database engine version"
  type        = string
  default     = "13.4"
}

variable "instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "username" {
  description = "Master username for the database"
  type        = string
  sensitive   = true
}

variable "password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}

resource "aws_security_group" "db" {
  name        = "${var.environment}-db-sg"
  description = "Allow traffic to/from the database"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # Only allow access from within the VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-db-sg"
    Environment = var.environment
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier              = "${var.environment}-db"
  engine                  = var.engine
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  storage_type            = "gp2"
  db_name                 = var.db_name
  username                = var.username
  password                = var.password
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.db.id]
  backup_retention_period = var.environment == "production" ? 7 : 1
  skip_final_snapshot     = var.environment != "production"
  multi_az                = var.environment == "production"
  
  tags = {
    Name        = "${var.environment}-db"
    Environment = var.environment
  }
}
```

Create `terraform/modules/database/outputs.tf`:

```hcl
output "db_instance_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "db_instance_name" {
  value = aws_db_instance.main.db_name
}

output "db_instance_username" {
  value     = aws_db_instance.main.username
  sensitive = true
}

output "db_security_group_id" {
  value = aws_security_group.db.id
}
```

### Step 3: Create an App Cluster Module

Create `terraform/modules/app_cluster/main.tf`:

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ECS service"
  type        = list(string)
}

variable "app_image" {
  description = "Docker image for the Java application"
  type        = string
}

variable "app_port" {
  description = "Port exposed by the Docker image"
  type        = number
  default     = 8080
}

variable "app_count" {
  description = "Number of app containers to run"
  type        = number
  default     = 2
}

variable "db_host" {
  description = "Database host endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

resource "aws_security_group" "app" {
  name        = "${var.environment}-app-sg"
  description = "Allow inbound traffic to the app"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-app-sg"
    Environment = var.environment
  }
}

resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-cluster"
  
  setting {
    name  = "containerInsights"
    value = var.environment == "production" ? "enabled" : "disabled"
  }
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.environment}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.app_image
      essential = true
      
      portMappings = [
        {
          containerPort = var.app_port
          hostPort      = var.app_port
        }
      ]
      
      environment = [
        {
          name  = "SPRING_DATASOURCE_URL"
          value = "jdbc:postgresql://${var.db_host}:5432/${var.db_name}"
        },
        {
          name  = "SPRING_DATASOURCE_USERNAME"
          value = var.db_username
        },
        {
          name  = "SPRING_DATASOURCE_PASSWORD"
          value = var.db_password
        },
        {
          name  = "SPRING_PROFILES_ACTIVE"
          value = var.environment
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.environment}-app"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.environment}-ecs-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.environment}-ecs-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.environment}-app"
  retention_in_days = var.environment == "production" ? 30 : 7
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_lb" "main" {
  name               = "${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app.id]
  subnets            = var.subnet_ids
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${var.environment}-target-group"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    path                = "/actuator/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_ecs_service" "app" {
  name            = "${var.environment}-app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"
  
  network_configuration {
    security_groups  = [aws_security_group.app.id]
    subnets          = var.subnet_ids
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = var.app_port
  }
  
  depends_on = [
    aws_lb_listener.http
  ]
  
  tags = {
    Environment = var.environment
  }
}
```

Create `terraform/modules/app_cluster/outputs.tf`:

```hcl
output "ecs_cluster_id" {
  value = aws_ecs_cluster.main.id
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "app_security_group_id" {
  value = aws_security_group.app.id
}
```

### Step 4: Create Environment-Specific Configurations

Create `terraform/environments/dev/main.tf`:

```hcl
provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "java-app/dev/terraform.tfstate"
    region = "us-east-1"
  }
}

locals {
  environment = "dev"
  
  availability_zones = [
    "us-east-1a",
    "us-east-1b"
  ]
  
  app_image = "your-ecr-repo/java-app:latest"
  
  app_count = 1  # Fewer instances for dev
}

# Create the network
module "networking" {
  source = "../../modules/networking"
  
  environment        = local.environment
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = local.availability_zones
}

# Create the database
module "database" {
  source = "../../modules/database"
  
  environment     = local.environment
  vpc_id          = module.networking.vpc_id
  subnet_ids      = module.networking.private_subnet_ids
  engine          = "postgres"
  engine_version  = "13.4"
  instance_class  = "db.t3.small"  # Smaller instance for dev
  db_name         = "java_app"
  username        = "app_user"
  password        = "YourSecurePasswordHere"  # Use AWS Secrets Manager in real implementations
}

# Create the app cluster
module "app_cluster" {
  source = "../../modules/app_cluster"
  
  environment = local.environment
  vpc_id      = module.networking.vpc_id
  subnet_ids  = module.networking.public_subnet_ids
  app_image   = local.app_image
  app_count   = local.app_count
  db_host     = module.database.db_instance_endpoint
  db_name     = module.database.db_instance_name
  db_username = module.database.db_instance_username
  db_password = "YourSecurePasswordHere"  # Use AWS Secrets Manager in real implementations
}

# Outputs
output "alb_dns_name" {
  value = module.app_cluster.alb_dns_name
  description = "The DNS name of the load balancer"
}
```

Create similar files for staging and production environments with appropriate changes:

- For staging: Increase resources slightly (app_count = 2, instance_class = "db.t3.medium")
- For production: Use more resources (app_count = 4, instance_class = "db.m5.large", multi-az = true)

## Implementing CI/CD Integration

### Step 1: Create a Build and Deployment Pipeline Script

Create a `scripts/deploy.sh` script that integrates with your CI/CD system:

```bash
#!/bin/bash
set -eo pipefail

# Get parameters
ENVIRONMENT=$1
IMAGE_TAG=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$IMAGE_TAG" ]; then
  echo "Usage: deploy.sh <environment> <image_tag>"
  exit 1
fi

# Validate environment
if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "Invalid environment. Must be dev, staging, or production."
  exit 1
fi

# Set AWS region
AWS_REGION="us-east-1"

# Build and push Docker image
echo "Building and pushing Docker image..."
docker build -t "your-ecr-repo/java-app:$IMAGE_TAG" ./app
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin your-ecr-repo
docker push "your-ecr-repo/java-app:$IMAGE_TAG"

# Update Terraform variables
echo "Updating Terraform variables..."
cd terraform/environments/$ENVIRONMENT

# Update the app_image variable in locals
sed -i "s|app_image = \".*\"|app_image = \"your-ecr-repo/java-app:$IMAGE_TAG\"|g" main.tf

# Apply Terraform changes
echo "Applying Terraform changes..."
terraform init
terraform apply -auto-approve

# Get the new service and cluster names from Terraform output
ECS_CLUSTER=$(terraform output -raw ecs_cluster_id)
ECS_SERVICE=$(terraform output -raw ecs_service_name)

# Force new deployment to update the containers
echo "Force new deployment..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

echo "Deployment to $ENVIRONMENT complete!"
```

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main
      - develop
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - staging
          - production

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Build with Maven
      run: mvn -B package --file pom.xml
      
    - name: Set environment based on branch
      if: github.event_name == 'push'
      run: |
        if [[ $GITHUB_REF == "refs/heads/main" ]]; then
          echo "ENVIRONMENT=production" >> $GITHUB_ENV
        elif [[ $GITHUB_REF == "refs/heads/develop" ]]; then
          echo "ENVIRONMENT=staging" >> $GITHUB_ENV
        else
          echo "ENVIRONMENT=dev" >> $GITHUB_ENV
        fi
        
    - name: Set environment from input
      if: github.event_name == 'workflow_dispatch'
      run: echo "ENVIRONMENT=${{ github.event.inputs.environment }}" >> $GITHUB_ENV
        
    - name: Set image tag
      run: echo "IMAGE_TAG=${GITHUB_SHA::8}" >> $GITHUB_ENV
      
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
        
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      
    - name: Deploy
      run: |
        bash scripts/deploy.sh ${{ env.ENVIRONMENT }} ${{ env.IMAGE_TAG }}
```

## Advanced Configurations

### Using AWS Secrets Manager for Sensitive Values

Create a Terraform module to manage secrets:

```hcl
# terraform/modules/secrets/main.tf
variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.environment}/db-credentials"
  description = "Database credentials for ${var.environment} environment"
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "app_user"
    password = var.db_password
  })
}

output "secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}
```

Then modify the app_cluster module to use these secrets:

```hcl
# Add to app_cluster/main.tf
variable "db_credentials_secret_arn" {
  description = "ARN of the secrets manager secret containing DB credentials"
  type        = string
}

# Add permissions to the ECS task role
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.environment}-secrets-access"
  description = "Allow access to DB credentials secret"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "secretsmanager:GetSecretValue"
        Effect   = "Allow"
        Resource = var.db_credentials_secret_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "secrets_access" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

# Update container definitions to use AWS Secrets Manager
resource "aws_ecs_task_definition" "app" {
  # ...
  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.app_image
      essential = true
      
      # ...
      
      secrets = [
        {
          name      = "SPRING_DATASOURCE_USERNAME"
          valueFrom = "${var.db_credentials_secret_arn}:username::"
        },
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "${var.db_credentials_secret_arn}:password::"
        }
      ]
      
      # ...
    }
  ])
  # ...
}
```

## Java Application Configuration

### Configuring the Spring Boot Application for Different Environments

Create environment-specific application properties files:

```
# app/src/main/resources/application.yml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/java_app}
    username: ${SPRING_DATASOURCE_USERNAME:postgres}
    password: ${SPRING_DATASOURCE_PASSWORD:postgres}
    hikari:
      connection-timeout: 20000
      maximum-pool-size: 5
  jpa:
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  liquibase:
    change-log: classpath:db/changelog/db.changelog-master.xml

server:
  port: ${SERVER_PORT:8080}

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true

logging:
  level:
    root: INFO
    com.example: INFO
    org.hibernate: WARN
```

Create environment-specific configuration files:

```
# app/src/main/resources/application-dev.yml
spring:
  jpa:
    show-sql: true
    
logging:
  level:
    com.example: DEBUG
```

```
# app/src/main/resources/application-production.yml
spring:
  jpa:
    show-sql: false
    
server:
  tomcat:
    max-threads: 200
    
logging:
  level:
    root: WARN
    com.example: INFO
```

## Best Practices for Java Deployments with IaC

1. **Use Immutable Infrastructure**: Create new instances rather than modifying existing ones.
2. **Implement Blue-Green Deployments**: Set up zero-downtime deployments.
3. **Version All Components**: Version your infrastructure code, application, and database schema.
4. **Automate Everything**: Automate build, test, deployment, and monitoring.
5. **Use Infrastructure as Code for All Environments**: Apply the same IaC approach to all environments.
6. **Implement Proper Secrets Management**: Never store secrets in code.
7. **Monitor and Log Everything**: Set up comprehensive monitoring and logging.
8. **Use Feature Flags**: Implement feature flags for controlled rollouts.
9. **Implement Database Migration Automation**: Use tools like Liquibase or Flyway.
10. **Keep Environments as Similar as Possible**: Minimize differences between environments.

## Conclusion

In this tutorial, we've demonstrated how to implement Infrastructure as Code for Java application deployments using:

1. **Terraform** for provisioning cloud resources
2. **AWS ECS** for running containerized Java applications
3. **RDS** for database provisioning
4. **GitHub Actions** for CI/CD integration
5. **AWS Secrets Manager** for secure credentials management

This approach provides several benefits:
- Consistent, repeatable deployments
- Version-controlled infrastructure
- Separation of concerns
- Environment-specific configurations
- Automated deployment processes

By adopting these practices, you can build a robust, reliable deployment pipeline for your Java applications, enabling faster development cycles and more reliable operations.

## References

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Liquibase Documentation](https://docs.liquibase.com/)
- [Infrastructure as Code: Managing AWS With Terraform](https://www.terraform-best-practices.com/)
- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 