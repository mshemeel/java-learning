# Infrastructure as Code Templates Repository

This repository contains ready-to-use Infrastructure as Code (IaC) templates for deploying Java applications to various cloud platforms. These templates follow DevOps best practices and provide a solid foundation for your infrastructure automation needs.

## Template Categories

<div class="template-categories">
    <div class="category-card">
        <div class="category-icon">☁️</div>
        <h3>Cloud Platforms</h3>
        <ul>
            <li><a href="#aws-templates">AWS</a></li>
            <li><a href="#azure-templates">Azure</a></li>
            <li><a href="#gcp-templates">GCP</a></li>
        </ul>
    </div>
    
    <div class="category-card">
        <div class="category-icon">🔄</div>
        <h3>Application Types</h3>
        <ul>
            <li><a href="#spring-boot-templates">Spring Boot</a></li>
            <li><a href="#microservices-templates">Microservices</a></li>
            <li><a href="#monolith-templates">Monoliths</a></li>
        </ul>
    </div>
    
    <div class="category-card">
        <div class="category-icon">🛠️</div>
        <h3>IaC Tools</h3>
        <ul>
            <li><a href="#terraform-templates">Terraform</a></li>
            <li><a href="#cloudformation-templates">CloudFormation</a></li>
            <li><a href="#kubernetes-templates">Kubernetes</a></li>
        </ul>
    </div>
    
    <div class="category-card">
        <div class="category-icon">🔐</div>
        <h3>Compliance-Ready</h3>
        <ul>
            <li><a href="#hipaa-templates">HIPAA</a></li>
            <li><a href="#pci-dss-templates">PCI DSS</a></li>
            <li><a href="#gdpr-templates">GDPR</a></li>
        </ul>
    </div>
</div>

## AWS Templates {: #aws-templates}

### Elastic Beanstalk for Java Applications

Deploy Java applications to AWS Elastic Beanstalk with proper auto-scaling, load balancing, and monitoring.

```terraform
module "elastic_beanstalk_java_app" {
  source = "github.com/example/terraform-aws-elastic-beanstalk-java"
  
  application_name = "my-java-app"
  environment_name = "production"
  solution_stack_name = "64bit Amazon Linux 2 v3.4.0 running Corretto 17"
  
  vpc_id = "vpc-12345678"
  public_subnets = ["subnet-12345678", "subnet-87654321"]
  private_subnets = ["subnet-23456789", "subnet-98765432"]
  
  environment_variables = {
    SERVER_PORT = "8080"
    SPRING_PROFILES_ACTIVE = "production"
    JAVA_OPTS = "-Xms512m -Xmx1024m"
  }
  
  autoscaling_min_size = 2
  autoscaling_max_size = 10
  
  enable_enhanced_health_reporting = true
  enable_managed_actions = true
  
  tags = {
    Environment = "production"
    Application = "my-java-app"
  }
}
```

[Download Terraform Module](https://example.com/terraform-aws-elastic-beanstalk-java){ .md-button }

### ECS Fargate for Spring Boot Microservices

Run containerized Spring Boot applications on AWS ECS Fargate with proper networking, security, and observability.

```terraform
module "ecs_fargate_spring_boot" {
  source = "github.com/example/terraform-aws-ecs-fargate-spring-boot"
  
  name_prefix = "api-service"
  vpc_id = "vpc-12345678"
  private_subnets = ["subnet-23456789", "subnet-98765432"]
  public_subnets = ["subnet-12345678", "subnet-87654321"]
  
  container_image = "123456789012.dkr.ecr.us-west-2.amazonaws.com/spring-app:latest"
  container_port = 8080
  desired_count = 2
  
  task_cpu = 1024
  task_memory = 2048
  
  health_check_path = "/actuator/health"
  health_check_grace_period_seconds = 60
  
  environment_variables = {
    SPRING_PROFILES_ACTIVE = "production"
    DATABASE_URL = "jdbc:mysql://db.example.com:3306/mydb"
  }
  
  enable_ecs_exec = true
  enable_container_insights = true
  
  tags = {
    Environment = "production"
    Service = "api"
  }
}
```

[Download Terraform Module](https://example.com/terraform-aws-ecs-fargate-spring-boot){ .md-button }

### RDS PostgreSQL for Java Applications

Set up a production-ready PostgreSQL database on AWS RDS for Java applications.

```terraform
module "rds_postgres_java" {
  source = "github.com/example/terraform-aws-rds-postgres-java"
  
  identifier = "java-app-db"
  engine_version = "13.4"
  
  vpc_id = "vpc-12345678"
  subnet_ids = ["subnet-23456789", "subnet-98765432"]
  
  allocated_storage = 20
  max_allocated_storage = 100
  instance_class = "db.t3.medium"
  
  database_name = "appdb"
  port = 5432
  
  multi_az = true
  backup_retention_period = 7
  backup_window = "03:00-04:00"
  maintenance_window = "Mon:04:30-Mon:05:30"
  
  performance_insights_enabled = true
  monitoring_interval = 60
  
  parameters = [
    {
      name = "shared_buffers"
      value = "{DBInstanceClassMemory/32768}"
    },
    {
      name = "max_connections"
      value = "200"
    }
  ]
  
  tags = {
    Environment = "production"
    Database = "app-main"
  }
}
```

[Download Terraform Module](https://example.com/terraform-aws-rds-postgres-java){ .md-button }

## Azure Templates {: #azure-templates}

### Azure App Service for Java

Deploy Java applications to Azure App Service with appropriate configurations.

```terraform
module "azure_app_service_java" {
  source = "github.com/example/terraform-azure-app-service-java"
  
  name = "java-app"
  resource_group_name = "app-rg"
  location = "East US"
  
  app_service_plan_id = azurerm_app_service_plan.main.id
  
  java_version = "17"
  java_container = "JAVA"
  java_container_version = "17"
  
  https_only = true
  ftps_state = "Disabled"
  
  app_settings = {
    SPRING_PROFILES_ACTIVE = "azure"
    WEBSITES_PORT = "8080"
    JAVA_OPTS = "-Dserver.port=8080 -Xms512m -Xmx1024m"
  }
  
  connection_strings = [
    {
      name = "Database"
      type = "SQLAzure"
      value = "Server=tcp:server.database.windows.net,1433;Database=appdb;User ID=appuser;Password=${var.db_password};Encrypt=true;Connection Timeout=30;"
    }
  ]
  
  tags = {
    Environment = "production"
    Application = "java-app"
  }
}
```

[Download Terraform Module](https://example.com/terraform-azure-app-service-java){ .md-button }

## GCP Templates {: #gcp-templates}

### GKE for Java Microservices

Deploy Java microservices to Google Kubernetes Engine with proper security and scaling configurations.

```terraform
module "gke_java_microservices" {
  source = "github.com/example/terraform-gcp-gke-java"
  
  project_id = "my-project"
  cluster_name = "java-microservices"
  region = "us-central1"
  
  network = "gke-network"
  subnetwork = "gke-subnet"
  
  cluster_secondary_range_name = "pods"
  services_secondary_range_name = "services"
  
  kubernetes_version = "1.22"
  
  node_pools = [
    {
      name = "general-pool"
      machine_type = "e2-standard-4"
      min_count = 2
      max_count = 10
      disk_size_gb = 100
      disk_type = "pd-standard"
      auto_upgrade = true
      auto_repair = true
      preemptible = false
    },
    {
      name = "memory-pool"
      machine_type = "e2-highmem-4"
      min_count = 1
      max_count = 5
      disk_size_gb = 100
      disk_type = "pd-standard"
      auto_upgrade = true
      auto_repair = true
      preemptible = false
    }
  ]
  
  enable_binary_authorization = true
  enable_network_policy = true
  enable_vertical_pod_autoscaling = true
  
  tags = {
    Environment = "production"
    Application = "java-microservices"
  }
}
```

[Download Terraform Module](https://example.com/terraform-gcp-gke-java){ .md-button }

## Template Repositories

The following GitHub repositories contain the complete collection of templates for each category:

<div class="repository-grid">
    <div class="repository-card">
        <h3>Java on AWS</h3>
        <p>Complete collection of AWS templates for Java applications</p>
        <a href="https://github.com/example/terraform-aws-java" target="_blank">
            <button class="md-button md-button--primary">View Repository</button>
        </a>
    </div>
    
    <div class="repository-card">
        <h3>Java on Azure</h3>
        <p>Templates for deploying Java applications to Azure services</p>
        <a href="https://github.com/example/terraform-azure-java" target="_blank">
            <button class="md-button md-button--primary">View Repository</button>
        </a>
    </div>
    
    <div class="repository-card">
        <h3>Java on GCP</h3>
        <p>Infrastructure templates for running Java on Google Cloud</p>
        <a href="https://github.com/example/terraform-gcp-java" target="_blank">
            <button class="md-button md-button--primary">View Repository</button>
        </a>
    </div>
    
    <div class="repository-card">
        <h3>Kubernetes for Java</h3>
        <p>Kubernetes manifests and Helm charts for Java applications</p>
        <a href="https://github.com/example/kubernetes-java-templates" target="_blank">
            <button class="md-button md-button--primary">View Repository</button>
        </a>
    </div>
</div>

## Template Generator

Use our template generator to customize IaC templates for your specific Java application requirements.

<div class="template-generator">
    <form id="iac-generator-form">
        <div class="form-group">
            <label for="cloud-platform">Cloud Platform:</label>
            <select id="cloud-platform">
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="gcp">GCP</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="java-version">Java Version:</label>
            <select id="java-version">
                <option value="8">Java 8</option>
                <option value="11">Java 11</option>
                <option value="17" selected>Java 17</option>
                <option value="21">Java 21</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="app-type">Application Type:</label>
            <select id="app-type">
                <option value="spring-boot">Spring Boot</option>
                <option value="quarkus">Quarkus</option>
                <option value="micronaut">Micronaut</option>
                <option value="jakarta-ee">Jakarta EE</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="deployment-type">Deployment Type:</label>
            <select id="deployment-type">
                <option value="containers">Containers</option>
                <option value="serverless">Serverless</option>
                <option value="vms">Virtual Machines</option>
                <option value="paas">PaaS</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Required Resources:</label>
            <div class="checkbox-group">
                <input type="checkbox" id="database" checked>
                <label for="database">Database</label>
                
                <input type="checkbox" id="cache">
                <label for="cache">Cache</label>
                
                <input type="checkbox" id="message-queue">
                <label for="message-queue">Message Queue</label>
                
                <input type="checkbox" id="cdn">
                <label for="cdn">CDN</label>
                
                <input type="checkbox" id="monitoring" checked>
                <label for="monitoring">Monitoring</label>
            </div>
        </div>
        
        <div class="form-group" id="database-options" style="display:block;">
            <label for="database-type">Database Type:</label>
            <select id="database-type">
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
            </select>
        </div>
        
        <button type="submit" class="md-button md-button--primary">Generate Template</button>
    </form>
    
    <div id="generated-template" class="hidden">
        <h3>Your Custom Template</h3>
        <div class="template-code">
            <pre><code class="hcl"></code></pre>
        </div>
        <button id="download-template" class="md-button">Download Template</button>
    </div>
</div>

## Best Practices

All templates in this repository follow these DevOps best practices:

### Security
- No hardcoded credentials
- Least privilege principle for IAM roles
- Network isolation using private subnets
- Encryption for data at rest and in transit
- Security groups with minimal required access

### Scalability
- Auto-scaling configurations
- Load balancing
- Database read replicas
- Caching layers

### Reliability
- Multi-AZ deployments
- Automated backups
- Health checks and monitoring
- Proper graceful shutdown handling

### Performance
- Right-sized infrastructure components
- Performance-optimized database settings
- CDN for static content
- Cache configurations

### Cost Optimization
- Auto-scaling based on demand
- Instance right-sizing
- Spot instances where appropriate
- Storage tiering

## Contributing

We welcome contributions to these templates! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-template`)
3. Commit your changes (`git commit -m 'Add some amazing template'`)
4. Push to the branch (`git push origin feature/amazing-template`)
5. Create a new Pull Request

Please ensure your templates follow our best practices and include proper documentation.

## Getting Help

If you need assistance with these templates:

- Check the [FAQ](https://example.com/faq)
- Join our [Slack community](https://example.com/slack)
- Open an issue on GitHub
- Contact us at [support@example.com](mailto:support@example.com)

## License

All templates are available under the Apache 2.0 License. 