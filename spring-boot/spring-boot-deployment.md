# Spring Boot Deployment

## Overview
This guide covers the various deployment options for Spring Boot applications, from traditional JAR/WAR deployments to containerization with Docker and deployment on cloud platforms. It also addresses production considerations such as monitoring, scaling, and security. By understanding these deployment methods and best practices, you'll be able to deploy your Spring Boot applications reliably in various environments.

## Prerequisites
- Basic knowledge of Spring Boot application development
- Understanding of Java build tools (Maven/Gradle)
- Familiarity with basic DevOps concepts
- Basic command-line knowledge

## Learning Objectives
- Understand the different deployment options for Spring Boot applications
- Package applications as executable JARs and WARs
- Deploy Spring Boot applications to traditional servers
- Containerize applications with Docker
- Deploy to various cloud platforms (AWS, Azure, GCP)
- Implement proper production configuration
- Set up monitoring and health checks
- Scale Spring Boot applications
- Ensure secure deployments
- Implement CI/CD pipelines for Spring Boot

## Table of Contents
1. [Packaging Spring Boot Applications](#packaging-spring-boot-applications)
2. [Traditional Deployment Options](#traditional-deployment-options)
3. [Containerization with Docker](#containerization-with-docker)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [Production Configuration](#production-configuration)
6. [Monitoring and Management](#monitoring-and-management)
7. [Scaling Strategies](#scaling-strategies)
8. [Security in Production](#security-in-production)
9. [Continuous Integration and Delivery](#continuous-integration-and-delivery)
10. [Deployment Best Practices](#deployment-best-practices)

## Packaging Spring Boot Applications

Spring Boot applications can be packaged in multiple ways depending on the deployment target.

### Executable JAR Files

The default and recommended way to package a Spring Boot application is as an executable JAR file, also known as a "fat JAR" or "uber JAR".

#### Maven Configuration

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

Build the JAR with:

```bash
mvn clean package
```

This creates an executable JAR in the `target` directory.

#### Gradle Configuration

```groovy
plugins {
    id 'org.springframework.boot' version '3.0.0'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'java'
}

// Other configurations...

bootJar {
    archiveBaseName = 'myapp'
    archiveVersion = '0.1.0'
}
```

Build the JAR with:

```bash
./gradlew bootJar
```

This creates an executable JAR in the `build/libs` directory.

#### Running the JAR

Run the packaged application with:

```bash
java -jar myapp.jar
```

You can override Spring Boot properties at runtime:

```bash
java -jar myapp.jar --server.port=8081 --spring.profiles.active=prod
```

### WAR Deployment

For deploying to traditional servlet containers, you can package your Spring Boot application as a WAR file.

#### Maven Configuration

```xml
<packaging>war</packaging>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

#### Configuring the Application

Extend `SpringBootServletInitializer` to support WAR deployment:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MyApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(MyApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

#### Building the WAR

```bash
mvn clean package
```

### Layered JARs

Spring Boot 2.3+ supports creating layered JARs to optimize Docker image builds:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <layers>
            <enabled>true</enabled>
        </layers>
    </configuration>
</plugin>
```

Extract layers with:

```bash
java -Djarmode=layertools -jar myapp.jar extract
```

This creates directories for dependencies, spring-boot-loader, snapshot-dependencies, and application code.

## Traditional Deployment Options

Spring Boot applications can be deployed to various traditional environments.

### Standalone Deployment

The simplest deployment method is running the application as a standalone JAR:

```bash
java -jar myapp.jar
```

For production, consider creating a system service:

#### Systemd Service (Linux)

Create a file `/etc/systemd/system/myapp.service`:

```
[Unit]
Description=My Spring Boot Application
After=syslog.target network.target

[Service]
User=myapp
ExecStart=/usr/bin/java -jar /path/to/myapp.jar
SuccessExitStatus=143
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable myapp
sudo systemctl start myapp
```

### Servlet Containers

Deploy WAR files to traditional servlet containers:

#### Tomcat Deployment

1. Build your WAR file: `mvn clean package`
2. Copy the WAR to Tomcat's `webapps` directory
3. Start Tomcat: `catalina.sh run` or `startup.sh`

#### Jetty Deployment

1. Build your WAR file: `mvn clean package`
2. Copy the WAR to Jetty's `webapps` directory
3. Start Jetty: `java -jar start.jar`

#### Wildfly/JBoss Deployment

1. Build your WAR file: `mvn clean package`
2. Copy the WAR to the `deployments` directory
3. Start the server: `standalone.sh`

### Application Servers

For JEE application servers, ensure you've configured your application properly as a WAR and included the necessary JEE dependencies.

## Containerization with Docker

Containerizing Spring Boot applications with Docker provides consistent deployment across environments.

### Basic Dockerfile

```dockerfile
FROM eclipse-temurin:17-jdk
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run the Docker image:

```bash
docker build -t myapp .
docker run -p 8080:8080 myapp
```

### Optimized Dockerfile

A more optimized Dockerfile using the layered JAR approach:

```dockerfile
FROM eclipse-temurin:17-jdk as builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

### Using Spring Boot's Layered JARs

Even more optimized using Spring Boot's layered JARs:

```dockerfile
FROM eclipse-temurin:17-jdk as builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre as extractor
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=extractor /app/dependencies/ ./
COPY --from=extractor /app/spring-boot-loader/ ./
COPY --from=extractor /app/snapshot-dependencies/ ./
COPY --from=extractor /app/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

### Docker Compose

For multi-container deployments, use Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=secret
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=mydb
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

Run with:

```bash
docker-compose up -d
```

## Cloud Platform Deployment

Spring Boot applications can be deployed to various cloud platforms.

### AWS Deployment

#### AWS Elastic Beanstalk

1. Package your application as a JAR or WAR
2. Create a new Elastic Beanstalk application and environment
3. Upload your application package
4. Configure environment properties

Using the AWS CLI:

```bash
aws elasticbeanstalk create-application --application-name my-spring-app
aws elasticbeanstalk create-environment --application-name my-spring-app --environment-name my-env --solution-stack-name "64bit Amazon Linux 2 v3.2.8 running Corretto 17" --option-settings file://env-config.json
aws elasticbeanstalk upload-application-version --application-name my-spring-app --version-label v1 --source-bundle S3Bucket="my-bucket",S3Key="myapp.jar"
aws elasticbeanstalk update-environment --environment-name my-env --version-label v1
```

#### AWS ECS/EKS

For containerized deployments, use Amazon ECS or EKS:

1. Build and push your Docker image to Amazon ECR
2. Create an ECS task definition
3. Create an ECS service

```bash
# Push to ECR
aws ecr create-repository --repository-name my-spring-app
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag my-spring-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/my-spring-app:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/my-spring-app:latest

# Create task definition and service using the AWS console or CloudFormation
```

### Azure Deployment

#### Azure App Service

1. Package your application as a JAR
2. Create an Azure App Service
3. Deploy using Azure CLI or the Azure portal

```bash
az webapp up --name my-spring-app --resource-group my-resource-group --runtime "JAVA|17-java17" --sku B1
```

#### Azure Container Instances

For containerized deployments:

```bash
az acr create --name myregistry --resource-group my-resource-group --sku Basic
az acr login --name myregistry
docker tag my-spring-app:latest myregistry.azurecr.io/my-spring-app:latest
docker push myregistry.azurecr.io/my-spring-app:latest

az container create --resource-group my-resource-group --name my-spring-app --image myregistry.azurecr.io/my-spring-app:latest --registry-username <username> --registry-password <password> --ports 8080 --dns-name-label my-spring-app
```

### Google Cloud Platform

#### Google App Engine

1. Create an `app.yaml` file:

```yaml
runtime: java17
instance_class: F2
```

2. Deploy using the Google Cloud SDK:

```bash
gcloud app deploy
```

#### Google Cloud Run

For containerized deployments:

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/<project-id>/my-spring-app

# Deploy to Cloud Run
gcloud run deploy my-spring-app --image gcr.io/<project-id>/my-spring-app --platform managed --allow-unauthenticated
```

### Heroku Deployment

1. Create a `Procfile` in your project root:

```
web: java -jar target/*.jar
```

2. Deploy using the Heroku CLI:

```bash
heroku create my-spring-app
git push heroku main
```

### Platform as a Service (PaaS) Considerations

When deploying to PaaS environments:

1. Externalize configuration
2. Handle dynamic port assignments
3. Configure logging appropriately
4. Consider stateless design for horizontal scaling
5. Use managed services for databases, caching, etc.

## Production Configuration

Proper configuration is essential for production deployments.

### Externalized Configuration

Store configuration outside your application:

```properties
# application-prod.properties
spring.datasource.url=${JDBC_DATABASE_URL}
spring.datasource.username=${JDBC_DATABASE_USERNAME}
spring.datasource.password=${JDBC_DATABASE_PASSWORD}
```

Use environment variables, configuration servers, or Kubernetes ConfigMaps/Secrets.

### JVM Tuning

Optimize the JVM for production:

```bash
java -Xms512m -Xmx1024m -XX:+UseG1GC -jar myapp.jar
```

Key JVM parameters:
- `-Xms`: Initial heap size
- `-Xmx`: Maximum heap size
- `-XX:+UseG1GC`: Use the G1 garbage collector
- `-XX:+HeapDumpOnOutOfMemoryError`: Create a heap dump on OOM errors
- `-XX:+PrintGCDetails`: Print GC information (if needed for debugging)

### Application Performance Tuning

Optimize your application:

```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# Tomcat tuning
server.tomcat.max-threads=200
server.tomcat.min-spare-threads=20

# Caching
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterAccess=600s
```

### Logging Configuration

Configure logging for production:

```properties
# Log to file
logging.file.name=/var/log/myapp.log
logging.file.max-size=10MB
logging.file.max-history=10

# Log level
logging.level.root=INFO
logging.level.org.springframework.web=WARN
logging.level.org.hibernate=ERROR

# JSON format for cloud environments
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

Consider using a centralized logging system like ELK (Elasticsearch, Logstash, Kibana) or using a cloud-based solution.

## Monitoring and Management

Spring Boot provides built-in tools for monitoring and management.

### Spring Boot Actuator

Add Actuator for production monitoring:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure Actuator endpoints:

```properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized
management.health.probes.enabled=true
```

### Health Checks

Configure health checks for container orchestration:

```properties
management.health.livenessstate.enabled=true
management.health.readinessstate.enabled=true
management.endpoint.health.probes.enabled=true
management.endpoint.health.group.liveness.include=livenessState
management.endpoint.health.group.readiness.include=readinessState,db,redis
```

Access with:
- `/actuator/health/liveness`
- `/actuator/health/readiness`

### Metrics Collection

Integrate with metrics systems:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```properties
management.metrics.export.prometheus.enabled=true
management.metrics.distribution.percentiles-histogram.http.server.requests=true
```

### Application Performance Monitoring (APM)

Integrate with APM tools:

#### New Relic

```xml
<dependency>
    <groupId>com.newrelic.agent.java</groupId>
    <artifactId>newrelic-agent</artifactId>
    <version>7.11.1</version>
    <scope>provided</scope>
</dependency>
```

Run with:

```bash
java -javaagent:/path/to/newrelic.jar -jar myapp.jar
```

#### Datadog

```bash
java -javaagent:/path/to/dd-java-agent.jar -Ddd.service=my-spring-app -Ddd.env=production -jar myapp.jar
```

### Monitoring Dashboards

Set up dashboards using Grafana, Prometheus, or cloud-native monitoring solutions:

1. Deploy Prometheus and Grafana
2. Configure Prometheus to scrape metrics from your Spring Boot application
3. Import Spring Boot dashboard templates in Grafana

## Scaling Strategies

Scale your Spring Boot applications to handle increased load.

### Horizontal Scaling

Run multiple instances of your application behind a load balancer:

1. Ensure your application is stateless
2. Use distributed session management if needed:

```xml
<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
</dependency>
```

```properties
spring.session.store-type=redis
spring.redis.host=redis-host
spring.redis.port=6379
```

3. Configure load balancing (e.g., with Nginx, cloud load balancers, or Kubernetes services)

### Vertical Scaling

Increase resources for your application:

1. Allocate more memory:

```bash
java -Xms1G -Xmx2G -jar myapp.jar
```

2. Increase CPU allocation in containerized environments:

```yaml
# Kubernetes example
resources:
  requests:
    memory: "1Gi"
    cpu: "0.5"
  limits:
    memory: "2Gi"
    cpu: "1"
```

### Caching Strategies

Implement caching to reduce load:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCacheNames(Arrays.asList("users", "products"));
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(Duration.ofMinutes(10)));
        return cacheManager;
    }
}
```

Use caching in services:

```java
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        // Expensive operation to fetch product
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public void updateProduct(Product product) {
        // Update product
    }
}
```

### Asynchronous Processing

Handle long-running tasks asynchronously:

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        executor.setThreadNamePrefix("MyExecutor-");
        executor.initialize();
        return executor;
    }
}
```

Use in services:

```java
@Service
public class EmailService {
    
    @Async
    public CompletableFuture<Void> sendEmail(String to, String subject, String content) {
        // Send email
        return CompletableFuture.completedFuture(null);
    }
}
```

### Message Queues

Offload work to message queues:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
@Service
public class OrderService {
    
    private final RabbitTemplate rabbitTemplate;
    
    public OrderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    public void processOrder(Order order) {
        // Process order
        rabbitTemplate.convertAndSend("orders", order);
    }
}

@Component
public class OrderProcessor {
    
    @RabbitListener(queues = "orders")
    public void processOrder(Order order) {
        // Process order asynchronously
    }
}
```

## Security in Production

Secure your Spring Boot application in production.

### HTTPS Configuration

Configure HTTPS:

```properties
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=your-password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
server.port=8443
```

### Security Headers

Add security headers:

```java
@Configuration
public class WebSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers()
                .contentSecurityPolicy("default-src 'self'; script-src 'self'")
                .and()
                .xssProtection()
                .and()
                .frameOptions().deny()
                .and()
                .httpStrictTransportSecurity().maxAgeInSeconds(31536000)
                .and()
            // Other security configurations
            ;
        return http.build();
    }
}
```

### Authentication and Authorization

Configure Spring Security properly:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/admin/**").hasRole("ADMIN")
            )
            .formLogin(formLogin -> formLogin
                .loginPage("/login")
                .permitAll()
            )
            .rememberMe(rememberMe -> rememberMe
                .key("uniqueAndSecret")
                .tokenValiditySeconds(86400)
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
            );
        return http.build();
    }
    
    // User details service, password encoder, etc.
}
```

### Secrets Management

Never hardcode secrets in your application:

1. Use environment variables
2. Use a vault service like HashiCorp Vault
3. Use cloud-specific secrets management (AWS Secrets Manager, GCP Secret Manager, etc.)

```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

### Dependency Scanning

Regularly scan for vulnerabilities:

1. Use tools like OWASP Dependency Check or Snyk
2. Configure in your build system:

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>7.1.1</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

## Continuous Integration and Delivery

Implement CI/CD pipelines for automated testing and deployment.

### GitHub Actions Example

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
    
    - name: Build with Maven
      run: mvn clean verify
    
    - name: Run tests
      run: mvn test
    
    - name: Build Docker image
      run: |
        docker build -t myapp:latest .
        docker tag myapp:latest username/myapp:latest
    
    - name: Push to Docker Hub
      if: github.event_name != 'pull_request'
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        docker push username/myapp:latest
    
    - name: Deploy to production
      if: github.event_name != 'pull_request'
      run: |
        # Deploy script or use a cloud provider's CLI
```

### Jenkins Pipeline Example

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp:${BUILD_NUMBER} .'
                sh 'docker tag myapp:${BUILD_NUMBER} myapp:latest'
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u username --password-stdin'
                    sh 'docker push username/myapp:latest'
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh 'kubectl apply -f kubernetes/staging/'
            }
        }
        
        stage('Deploy to Production') {
            input {
                message "Deploy to production?"
                ok "Yes"
            }
            steps {
                sh 'kubectl apply -f kubernetes/production/'
            }
        }
    }
}
```

### Automated Testing

Include various test types in your pipeline:

1. Unit tests
2. Integration tests
3. Performance tests
4. Security tests
5. End-to-end tests

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Blue-Green Deployment

Implement blue-green deployments for zero-downtime updates:

1. Deploy new version alongside the existing version
2. Route a small percentage of traffic to the new version
3. Monitor for issues
4. Gradually increase traffic to the new version
5. When confident, switch all traffic to the new version
6. Terminate the old version

This is easily implemented in Kubernetes, AWS, or other cloud platforms.

## Deployment Best Practices

### Zero-Downtime Deployment

Ensure your application supports zero-downtime deployment:

1. Make your application stateless
2. Use distributed session management
3. Implement graceful shutdown:

```properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=20s
```

### Deployment Checklist

Before deploying to production:

1. ✅ Secure all endpoints with HTTPS
2. ✅ Configure proper logging
3. ✅ Set up monitoring and alerting
4. ✅ Implement health checks
5. ✅ Configure appropriate resource limits
6. ✅ Secure sensitive configuration
7. ✅ Test your deployment process
8. ✅ Implement backup and restore procedures
9. ✅ Document the deployment process
10. ✅ Set up automated rollback procedures

### Environment-Specific Configuration

Use Spring profiles for environment-specific configuration:

```properties
# application-dev.properties
logging.level.root=DEBUG

# application-prod.properties
logging.level.root=INFO
```

Activate with:

```bash
java -jar myapp.jar --spring.profiles.active=prod
```

### Managing Database Migrations

Use Flyway or Liquibase for database migrations:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```properties
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

Create migration scripts:

```sql
-- V1__Initial_schema.sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL
);

-- V2__Add_columns.sql
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

### Configuration Management

Manage configuration safely:

1. Use a configuration server (Spring Cloud Config)
2. Use Kubernetes ConfigMaps and Secrets
3. Use environment variables for sensitive information
4. Never hardcode secrets in your code

### Backup and Restore

Implement backup and restore procedures:

1. Database backups
2. Configuration backups
3. Regular testing of recovery procedures
4. Document restore procedures

## Summary

Spring Boot offers numerous deployment options to fit various needs:

- Executable JARs for standalone deployment
- WAR files for traditional servlet containers
- Containerization with Docker for cloud-native deployments
- Cloud platform deployment (AWS, Azure, GCP)

For a successful production deployment, remember to:

- Properly configure the application for production
- Set up comprehensive monitoring and health checks
- Implement appropriate scaling strategies
- Ensure security at all levels
- Automate the deployment process with CI/CD

By following these practices, you can reliably deploy and operate Spring Boot applications in production environments.

## Further Reading

- [Spring Boot Production-Ready Features](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Spring Cloud for Cloud-Native Applications](https://spring.io/projects/spring-cloud)
- [The Twelve-Factor App](https://12factor.net/)
- [AWS Spring Boot Deployment](https://aws.amazon.com/blogs/devops/deploying-a-spring-boot-application-on-aws-using-aws-elastic-beanstalk/)
- [Azure Spring Boot Deployment](https://learn.microsoft.com/en-us/azure/app-service/quickstart-java) 