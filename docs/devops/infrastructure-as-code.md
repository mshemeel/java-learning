# Infrastructure as Code (IaC)

## Overview
This guide introduces Infrastructure as Code (IaC) principles, tools, and best practices specifically focused on Java application deployment. IaC treats infrastructure configuration as software, allowing you to version, test, and automate your infrastructure setup, leading to more reliable and consistent environments.

## Prerequisites
- Basic understanding of cloud computing concepts
- Familiarity with basic system administration
- Knowledge of software development lifecycle
- Basic understanding of Java deployment requirements

## Learning Objectives
- Understand the principles and benefits of Infrastructure as Code
- Learn how to use popular IaC tools for Java application infrastructure
- Develop skills to create reproducible and version-controlled infrastructure
- Implement infrastructure testing and validation techniques
- Integrate IaC into CI/CD pipelines for Java applications
- Apply best practices for secure and maintainable infrastructure code

## What is Infrastructure as Code?

Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure through machine-readable definition files rather than physical hardware configuration or interactive configuration tools. IaC enables you to:

1. Define infrastructure components in code files
2. Version control your infrastructure definitions
3. Automate infrastructure provisioning and updates
4. Create consistent environments across development, testing, and production
5. Apply software development practices to infrastructure management

```
Traditional vs. IaC Approach:

┌───────────────────┐      ┌───────────────────┐
│  Traditional      │      │  IaC Approach     │
│  Approach         │      │                   │
└───────────────────┘      └───────────────────┘
        │                           │
        ▼                           ▼
┌───────────────────┐      ┌───────────────────┐
│ Manual Server     │      │ Code-based        │
│ Configuration     │      │ Configuration     │
└───────────────────┘      └───────────────────┘
        │                           │
        ▼                           ▼
┌───────────────────┐      ┌───────────────────┐
│ No Version        │      │ Version           │
│ Control           │      │ Controlled        │
└───────────────────┘      └───────────────────┘
        │                           │
        ▼                           ▼
┌───────────────────┐      ┌───────────────────┐
│ Configuration     │      │ Testable          │
│ Drift             │      │ Infrastructure    │
└───────────────────┘      └───────────────────┘
        │                           │
        ▼                           ▼
┌───────────────────┐      ┌───────────────────┐
│ Slow, Error-prone │      │ Fast, Reliable    │
│ Provisioning      │      │ Provisioning      │
└───────────────────┘      └───────────────────┘
```

## Benefits of IaC

### Speed and Efficiency
- Rapidly provision complete environments
- Reduce manual configuration time
- Enable quick infrastructure updates

### Consistency and Standardization
- Eliminate environment inconsistencies
- Ensure all environments follow best practices
- Reduce "works on my machine" problems

### Risk Reduction
- Prevent configuration drift
- Test infrastructure changes before applying
- Roll back to previous configurations easily

### Cost Management
- Optimize resource usage
- Avoid over-provisioning
- Track infrastructure changes and costs

### Collaboration
- Share infrastructure code across teams
- Apply code reviews to infrastructure changes
- Document infrastructure through code

## IaC Tools for Java Applications

### Terraform
Terraform is a popular infrastructure provisioning tool that works with multiple cloud providers.

#### Example: Provisioning AWS Infrastructure for a Java Application

```hcl
# Define provider
provider "aws" {
  region = "us-west-2"
}

# Create VPC
resource "aws_vpc" "java_app_vpc" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "java-app-vpc"
    Environment = "production"
  }
}

# Create subnet
resource "aws_subnet" "java_app_subnet" {
  vpc_id     = aws_vpc.java_app_vpc.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "java-app-subnet"
  }
}

# Create security group
resource "aws_security_group" "java_app_sg" {
  name        = "java-app-sg"
  description = "Allow TLS inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.java_app_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create EC2 instance for Java application
resource "aws_instance" "java_app_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.java_app_subnet.id
  security_groups = [aws_security_group.java_app_sg.id]
  
  user_data = <<-EOF
              #!/bin/bash
              amazon-linux-extras install java-openjdk11
              yum install -y java-11-openjdk
              mkdir -p /opt/java-app
              
              # Create a systemd service for Java application
              cat > /etc/systemd/system/java-app.service << 'EOT'
              [Unit]
              Description=Java Application Service
              After=network.target
              
              [Service]
              User=ec2-user
              WorkingDirectory=/opt/java-app
              ExecStart=/usr/bin/java -jar /opt/java-app/app.jar
              SuccessExitStatus=143
              TimeoutStopSec=10
              Restart=on-failure
              RestartSec=5
              
              [Install]
              WantedBy=multi-user.target
              EOT
              
              systemctl daemon-reload
              systemctl enable java-app.service
              EOF
  
  tags = {
    Name = "java-app-server"
  }
}

# Output the public IP of the EC2 instance
output "java_app_server_public_ip" {
  value = aws_instance.java_app_server.public_ip
}
```

### Ansible
Ansible excels at configuration management and application deployment, making it ideal for configuring servers running Java applications.

#### Example: Deploying a Spring Boot Application with Ansible

```yaml
---
# playbook.yml
- name: Deploy Spring Boot application
  hosts: java_servers
  become: yes
  vars:
    app_name: spring-boot-app
    app_version: 1.0.0
    java_version: 11
    app_dir: /opt/spring-boot
    app_user: appuser
    app_group: appgroup
    
  tasks:
    - name: Install Java
      package:
        name: "java-{{ java_version }}-openjdk"
        state: present
        
    - name: Create application user
      user:
        name: "{{ app_user }}"
        group: "{{ app_group }}"
        system: yes
        state: present
        
    - name: Create application directory
      file:
        path: "{{ app_dir }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0755'
        
    - name: Download Spring Boot application
      get_url:
        url: "https://artifacts.example.com/{{ app_name }}-{{ app_version }}.jar"
        dest: "{{ app_dir }}/{{ app_name }}.jar"
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0500'
      notify: restart application
        
    - name: Create application service
      template:
        src: templates/spring-boot.service.j2
        dest: /etc/systemd/system/{{ app_name }}.service
      notify: restart application
      
    - name: Create application properties
      template:
        src: templates/application.properties.j2
        dest: "{{ app_dir }}/application.properties"
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0400'
      notify: restart application
      
    - name: Ensure application service is enabled
      systemd:
        name: "{{ app_name }}"
        enabled: yes
        daemon_reload: yes
        
  handlers:
    - name: restart application
      systemd:
        name: "{{ app_name }}"
        state: restarted
```

With a corresponding service template file:

```
# templates/spring-boot.service.j2
[Unit]
Description={{ app_name }} service
After=network.target

[Service]
User={{ app_user }}
Group={{ app_group }}
WorkingDirectory={{ app_dir }}
ExecStart=/usr/bin/java -jar {{ app_dir }}/{{ app_name }}.jar --spring.config.location=file:{{ app_dir }}/application.properties
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Kubernetes Manifests
For containerized Java applications, Kubernetes manifests provide infrastructure definitions for container orchestration.

#### Example: Deploying a Java Microservice on Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-microservice
  namespace: application
spec:
  replicas: 3
  selector:
    matchLabels:
      app: java-microservice
  template:
    metadata:
      labels:
        app: java-microservice
    spec:
      containers:
      - name: java-microservice
        image: company/java-microservice:1.0.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "200m"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 15
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: java-microservice-config
              key: db.host
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: java-microservice-secrets
              key: db-user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: java-microservice-secrets
              key: db-password
        volumeMounts:
        - name: config-volume
          mountPath: /opt/app/config
      volumes:
      - name: config-volume
        configMap:
          name: java-microservice-config
          items:
          - key: application.properties
            path: application.properties
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: java-microservice
  namespace: application
spec:
  selector:
    app: java-microservice
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: java-microservice-config
  namespace: application
data:
  db.host: "db.example.com"
  application.properties: |
    server.port=8080
    management.endpoints.web.exposure.include=health,info,metrics
    spring.application.name=java-microservice
    logging.level.root=INFO
    spring.datasource.driver-class-name=org.postgresql.Driver
    spring.datasource.url=jdbc:postgresql://${DB_HOST}:5432/mydb
```

### AWS CloudFormation
CloudFormation is AWS's native IaC tool, ideal for AWS-specific infrastructure.

#### Example: Java Application Infrastructure on AWS

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Java application infrastructure stack'

Parameters:
  Environment:
    Description: Environment type
    Default: Production
    Type: String
    AllowedValues:
      - Development
      - Testing
      - Staging
      - Production
  JavaVersion:
    Description: Java version
    Default: 11
    Type: Number

Resources:
  JavaAppVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-vpc

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref JavaAppVPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-public-subnet-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref JavaAppVPC
      AvailabilityZone: !Select [1, !GetAZs '']
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-public-subnet-2

  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-alb

  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP/HTTPS
      VpcId: !Ref JavaAppVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  JavaAppAutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: 2
      MaxSize: 6
      DesiredCapacity: 2
      LaunchTemplate:
        LaunchTemplateId: !Ref JavaAppLaunchTemplate
        Version: !GetAtt JavaAppLaunchTemplate.LatestVersionNumber
      VPCZoneIdentifier:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      TargetGroupARNs:
        - !Ref JavaAppTargetGroup
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-asg
          PropagateAtLaunch: true
          
  JavaAppLaunchTemplate:
    Type: AWS::EC2::LaunchTemplate
    Properties:
      LaunchTemplateName: !Sub ${AWS::StackName}-launch-template
      VersionDescription: Initial version
      LaunchTemplateData:
        ImageId: ami-0c55b159cbfafe1f0
        InstanceType: t2.medium
        SecurityGroupIds:
          - !Ref JavaAppSecurityGroup
        UserData:
          Fn::Base64: !Sub |
            #!/bin/bash -xe
            yum update -y
            amazon-linux-extras install java-openjdk${JavaVersion} -y
            mkdir -p /opt/java-app
            aws s3 cp s3://my-app-bucket/app.jar /opt/java-app/
            cat > /etc/systemd/system/java-app.service << 'EOT'
            [Unit]
            Description=Java Application Service
            After=network.target
            
            [Service]
            WorkingDirectory=/opt/java-app
            ExecStart=/usr/bin/java -jar /opt/java-app/app.jar
            SuccessExitStatus=143
            TimeoutStopSec=10
            Restart=on-failure
            RestartSec=5
            
            [Install]
            WantedBy=multi-user.target
            EOT
            
            systemctl daemon-reload
            systemctl enable java-app.service
            systemctl start java-app.service

  JavaAppSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow access to Java application
      VpcId: !Ref JavaAppVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 8080
          ToPort: 8080
          SourceSecurityGroupId: !Ref ALBSecurityGroup
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 10.0.0.0/16

  JavaAppTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      VpcId: !Ref JavaAppVPC
      Port: 8080
      Protocol: HTTP
      HealthCheckPath: /actuator/health
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 5
      TargetType: instance
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-tg

  ALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref JavaAppTargetGroup
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 80
      Protocol: HTTP

Outputs:
  LoadBalancerDNS:
    Description: DNS name of the Application Load Balancer
    Value: !GetAtt ApplicationLoadBalancer.DNSName
```

## IaC Best Practices for Java Applications

### 1. Modularize Infrastructure Code
Structure your infrastructure code into reusable modules:

```hcl
# Terraform example
module "java_app_cluster" {
  source = "./modules/java-cluster"
  
  app_name = "customer-service"
  instance_type = "t2.medium"
  min_instances = 2
  max_instances = 5
  java_version = "11"
}
```

### 2. Parameterize Your Infrastructure
Make your infrastructure code flexible with parameters:

```yaml
# Ansible example with variables
- hosts: all
  vars:
    heap_size: "{{ environment == 'production' and '4G' or '1G' }}"
    
  tasks:
    - name: Set Java options
      template:
        src: java_opts.j2
        dest: "/etc/default/java_opts"
      vars:
        java_opts: "-Xms{{ heap_size }} -Xmx{{ heap_size }}"
```

### 3. Implement Environment Parity
Use the same code for all environments with configuration differences:

```hcl
# Terraform example with environment-specific configurations
locals {
  env_config = {
    dev = {
      instance_type = "t2.small"
      min_size      = 1
      max_size      = 2
    }
    prod = {
      instance_type = "t2.large"
      min_size      = 3
      max_size      = 10
    }
  }
  
  # Use configuration for the current environment
  config = local.env_config[var.environment]
}

resource "aws_instance" "java_server" {
  instance_type = local.config.instance_type
  # Other configuration...
}
```

### 4. Version Your Infrastructure Code
Track infrastructure changes in version control:

```bash
# Git workflow for infrastructure changes
git checkout -b feature/add-redis-cache
# Make changes to infrastructure code
git add terraform/
git commit -m "Add Redis cache for session storage"
git push origin feature/add-redis-cache
# Create pull request for code review
```

### 5. Test Your Infrastructure Code
Implement testing for infrastructure code:

```bash
# Terraform testing with Terratest
go test -v ./test/
```

Example test file:

```go
package test

import (
	"testing"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestJavaAppInfrastructure(t *testing.T) {
	terraformOptions := &terraform.Options{
		TerraformDir: "../modules/java-app",
		Vars: map[string]interface{}{
			"environment": "test",
		},
	}

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	// Validate outputs
	albDnsName := terraform.Output(t, terraformOptions, "alb_dns_name")
	assert.NotEmpty(t, albDnsName)
	
	// Test other infrastructure properties
}
```

### 6. Implement Security as Code
Include security configurations in your infrastructure code:

```hcl
# Terraform security group example
resource "aws_security_group" "java_app_sg" {
  # Basic configuration...

  # No direct SSH access from public internet
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]  # Only internal network
  }

  # HTTPS only for public access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Explicit egress rules
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### 7. Document Your Infrastructure
Include documentation within your infrastructure code:

```yaml
# Ansible with documentation comments
---
# This playbook configures JVM options for optimal performance in
# production environments for Java 11 applications.
# 
# Variables:
#   - app_heap_size: JVM heap size (default: 2G)
#   - app_metaspace_size: Metaspace size (default: 256M)
#   - app_gc_type: Garbage collector type (default: G1GC)
#
# Usage:
#   ansible-playbook -i inventory jvm-tuning.yml -e "app_heap_size=4G"

- name: Configure JVM options
  hosts: java_servers
  become: yes
  vars:
    app_heap_size: "2G"
    app_metaspace_size: "256M"
    app_gc_type: "G1GC"
    
  tasks:
    # Task definitions...
```

## Integrating IaC into CI/CD Pipelines

### Example: Terraform in a CI/CD Pipeline

```yaml
# GitHub Actions workflow example
name: Infrastructure CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'terraform/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        
      - name: Terraform Format
        run: terraform fmt -check -recursive
        
      - name: Terraform Init
        run: terraform init -backend=false
        working-directory: ./terraform
        
      - name: Terraform Validate
        run: terraform validate
        working-directory: ./terraform
  
  plan:
    needs: validate
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform
        
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: ./terraform
        
      - name: Upload Terraform Plan
        uses: actions/upload-artifact@v3
        with:
          name: tfplan
          path: ./terraform/tfplan
          
  apply:
    needs: plan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform
        
      - name: Terraform Apply
        run: terraform apply -auto-approve
        working-directory: ./terraform
```

## Common Java-Specific Infrastructure Requirements

### JVM Configuration
Configure JVM options for optimal performance:

```hcl
# Terraform user data example for EC2
resource "aws_instance" "java_app" {
  # Basic configuration...
  
  user_data = <<-EOF
    #!/bin/bash
    cat > /etc/default/java <<EOT
    JAVA_OPTS="-Xms2048m -Xmx2048m -XX:MetaspaceSize=512m -XX:+UseG1GC -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/java/heap_dump.hprof"
    EOT
    
    mkdir -p /var/log/java
    chmod 755 /var/log/java
  EOF
}
```

### Database Configuration
Provision and configure databases for Java applications:

```yaml
# Kubernetes Database ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: spring-datasource-config
data:
  application-db.properties: |
    spring.datasource.url=jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}
    spring.datasource.username=${DB_USER}
    spring.datasource.password=${DB_PASSWORD}
    spring.datasource.hikari.maximum-pool-size=10
    spring.datasource.hikari.minimum-idle=5
    spring.datasource.hikari.idle-timeout=30000
    spring.jpa.hibernate.ddl-auto=validate
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Application Load Balancing
Configure load balancers for Java applications:

```hcl
# Terraform AWS ALB configuration
resource "aws_lb" "java_app_lb" {
  name               = "java-app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = var.public_subnets
  
  enable_deletion_protection = true
  
  access_logs {
    bucket  = aws_s3_bucket.lb_logs.bucket
    prefix  = "java-app-lb"
    enabled = true
  }
}

resource "aws_lb_listener" "java_app_listener" {
  load_balancer_arn = aws_lb.java_app_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.java_app_tg.arn
  }
}

resource "aws_lb_target_group" "java_app_tg" {
  name     = "java-app-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/actuator/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }
}
```

### Monitoring and Logging Infrastructure
Set up monitoring for Java applications:

```yaml
# Ansible playbook for configuring Prometheus Java Agent
- name: Configure Prometheus JMX exporter
  hosts: java_servers
  become: yes
  vars:
    jmx_exporter_version: "0.16.1"
    jmx_exporter_port: 9404
    
  tasks:
    - name: Download JMX exporter JAR
      get_url:
        url: "https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/{{ jmx_exporter_version }}/jmx_prometheus_javaagent-{{ jmx_exporter_version }}.jar"
        dest: "/opt/monitoring/jmx_prometheus_javaagent.jar"
        mode: '0644'
        
    - name: Create JMX exporter config
      template:
        src: jmx_exporter_config.yml.j2
        dest: "/opt/monitoring/jmx_exporter_config.yml"
        mode: '0644'
      
    - name: Configure Java service to use JMX exporter
      lineinfile:
        path: /etc/systemd/system/java-app.service
        regexp: '^ExecStart='
        line: 'ExecStart=/usr/bin/java -javaagent:/opt/monitoring/jmx_prometheus_javaagent.jar={{ jmx_exporter_port }}:/opt/monitoring/jmx_exporter_config.yml -jar /opt/java-app/app.jar'
      notify: restart java-app
      
  handlers:
    - name: restart java-app
      systemd:
        name: java-app
        state: restarted
        daemon_reload: yes
```

## Next Steps

Once you understand Infrastructure as Code, explore these related topics:

- [Docker Fundamentals](docker-fundamentals.md)
- [CI/CD Fundamentals](ci-cd-fundamentals.md)
- [Monitoring & Logging](monitoring-logging.md)
- [Jenkins for Java](jenkins-for-java.md)

## References and Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Infrastructure as Code by Kief Morris](https://infrastructure-as-code.com/)
- [Terraform: Up & Running by Yevgeniy Brikman](https://www.terraformupandrunning.com/)
- [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) 