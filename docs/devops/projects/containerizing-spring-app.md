# Containerizing a Spring Boot Application

## Overview
This tutorial walks through the process of containerizing a Spring Boot application using Docker. We'll cover best practices for creating efficient, secure Docker images for Java applications and how to optimize them for production environments.

## Prerequisites
- Basic understanding of [Docker fundamentals](../docker-fundamentals.md)
- Java development experience
- Spring Boot knowledge
- Docker installed on your machine
- Git (for source code management)

## Learning Objectives
- Create a Docker container for a Spring Boot application
- Implement best practices for Java containerization
- Optimize container size and startup time
- Configure container for production readiness
- Implement multi-stage builds
- Test and debug containerized Spring applications

## Getting Started with Spring Boot Containerization

### Step 1: Creating a Sample Spring Boot Application

First, let's create a simple Spring Boot application or use an existing one. Here's a basic Spring Boot REST API:

```java
// src/main/java/com/example/demo/DemoApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

```java
// src/main/java/com/example/demo/controller/HelloController.java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HelloController {
    
    @GetMapping("/")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from Docker container!");
        response.put("timestamp", System.currentTimeMillis());
        response.put("java.version", System.getProperty("java.version"));
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        return status;
    }
}
```

Make sure you have a proper `pom.xml` file for a Spring Boot application:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>spring-docker-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-docker-demo</name>
    <description>Demo project for Spring Boot with Docker</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <layers>
                        <enabled>true</enabled>
                    </layers>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Configure Spring Boot Actuator in `application.properties`:

```properties
# src/main/resources/application.properties
server.port=8080

# Actuator configuration
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.probes.enabled=true
management.health.livenessState.enabled=true
management.health.readinessState.enabled=true

# Application info
spring.application.name=spring-docker-demo
```

### Step 2: Creating a Basic Dockerfile

Create a `Dockerfile` in the root of your project:

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 3: Building and Running the Container

First, build your Spring Boot application:

```bash
./mvnw clean package
```

Then build the Docker image:

```bash
docker build -t spring-docker-demo:latest .
```

Run the container:

```bash
docker run -p 8080:8080 spring-docker-demo:latest
```

Test your application:

```bash
curl http://localhost:8080
```

You should see a JSON response with the message "Hello from Docker container!" along with timestamp and Java version information.

## Optimizing Your Docker Image

### Step 4: Implementing a Multi-stage Build

Modify your Dockerfile to use multi-stage builds, which keep the final image smaller by building in one container and copying only the necessary artifacts to the final image:

```dockerfile
# Build stage
FROM maven:3.9.2-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies separately to leverage Docker cache
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Configure JVM options for containerized environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

Build the optimized image:

```bash
docker build -t spring-docker-demo:optimized .
```

### Step 5: Using Spring Boot Layer Tools for Faster Builds

Spring Boot 2.3.0+ includes layer tools that allow Docker to cache dependencies separately from application code. This speeds up rebuilds.

We already enabled layers in our `pom.xml` with:

```xml
<configuration>
    <layers>
        <enabled>true</enabled>
    </layers>
</configuration>
```

Now, let's update our Dockerfile to use these layers:

```dockerfile
# Build stage
FROM maven:3.9.2-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Extract layers stage
FROM eclipse-temurin:17-jre-alpine AS extract
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -S spring && adduser -S spring -G spring

# Set permissions
RUN mkdir -p /app/spring && chown -R spring:spring /app
USER spring:spring

# Copy layers in order from least frequently changed to most frequently changed
COPY --from=extract --chown=spring:spring /app/dependencies/ ./
COPY --from=extract --chown=spring:spring /app/spring-boot-loader/ ./
COPY --from=extract --chown=spring:spring /app/snapshot-dependencies/ ./
COPY --from=extract --chown=spring:spring /app/application/ ./

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.JarLauncher"]
```

Build the layered image:

```bash
docker build -t spring-docker-demo:layered .
```

## Configuring for Production Readiness

### Step 6: Adding Health Checks

Docker health checks ensure that your container is running properly:

```dockerfile
# Final layer of the optimized Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -q -O- http://localhost:8080/actuator/health | grep UP || exit 1
```

### Step 7: Environment Variables and Externalized Configuration

Update your Dockerfile to better support environment-specific configuration:

```dockerfile
# Final stage of optimized Dockerfile with env vars
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -Dserver.port=$SERVER_PORT org.springframework.boot.loader.JarLauncher"]
```

Run with environment-specific configuration:

```bash
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e SERVER_PORT=8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/mydatabase \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  spring-docker-demo:layered
```

### Step 8: Creating a Docker Compose Configuration

Create a `docker-compose.yml` file for running your application with dependencies:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SERVER_PORT=8080
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/mydatabase
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=secret
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "wget", "-q", "-O-", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 30s
  
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=mydatabase
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

Start your application with Docker Compose:

```bash
docker-compose up -d
```

## Security Best Practices

### Step 9: Securing Your Container

1. **Use Specific Versions**: Always use specific versions of base images, not `latest`.
2. **Scan for Vulnerabilities**: Regularly scan your images.
3. **Minimize Image Size**: Smaller images have fewer vulnerabilities.
4. **Use Non-Root Users**: Run as a non-privileged user (we already did this).
5. **Remove Build Tools**: Don't include compilers and build tools in the final image.

Example of running a vulnerability scan:

```bash
# Using Trivy scanner
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image spring-docker-demo:layered
```

## Debugging Containerized Spring Boot Applications

### Step 10: Setting Up Remote Debugging

Modify your Dockerfile to enable remote debugging when needed:

```dockerfile
# Add this to your ENTRYPOINT in development mode
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 org.springframework.boot.loader.JarLauncher"]
```

Run the container with debug port exposed:

```bash
docker run -p 8080:8080 -p 5005:5005 \
  -e JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom" \
  --name spring-debug \
  spring-docker-demo:layered
```

Then connect your IDE to port 5005 for remote debugging.

### Step 11: Accessing Container Logs

View container logs:

```bash
docker logs -f spring-debug
```

Enter a running container for troubleshooting:

```bash
docker exec -it spring-debug /bin/sh
```

## Performance Tuning

### Step 12: JVM Tuning for Containers

Fine-tune JVM settings for optimal container performance:

```dockerfile
ENV JAVA_OPTS="-XX:+UseContainerSupport \
                -XX:MaxRAMPercentage=75.0 \
                -XX:InitialRAMPercentage=50.0 \
                -XX:+UseG1GC \
                -XX:MaxGCPauseMillis=200 \
                -XX:+UseStringDeduplication \
                -Djava.security.egd=file:/dev/urandom \
                -Dserver.tomcat.max-threads=50 \
                -Dspring.main.lazy-initialization=true"
```

### Step 13: Application Startup Optimization

1. Add Spring Native support for faster startup (if applicable).
2. Enable lazy initialization for non-critical beans:

```properties
# application.properties
spring.main.lazy-initialization=true
spring.jpa.properties.hibernate.temp.use_jdbc_metadata_defaults=false
```

## Production Deployment Considerations

### Step 14: Tagging and Versioning

Use proper tagging for your Docker images:

```bash
# Tag with version
docker tag spring-docker-demo:layered myrepo/spring-docker-demo:1.0.0

# Tag with environment
docker tag spring-docker-demo:layered myrepo/spring-docker-demo:production-1.0.0

# Push to a registry
docker push myrepo/spring-docker-demo:1.0.0
docker push myrepo/spring-docker-demo:production-1.0.0
```

### Step 15: Container Orchestration Readiness

Prepare your application for Kubernetes with proper `application.yaml` configuration:

```yaml
# src/main/resources/application.yaml
spring:
  application:
    name: spring-docker-demo
  lifecycle:
    timeout-per-shutdown-phase: 30s

server:
  port: 8080
  shutdown: graceful

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      probes:
        enabled: true
      show-details: always
      group:
        readiness:
          include: db, diskSpace
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```

## Conclusion

In this tutorial, we've covered:
1. Creating a basic Docker image for a Spring Boot application
2. Optimizing the image using multi-stage builds and layer tools
3. Configuring the container for production readiness
4. Implementing security best practices
5. Setting up debugging and monitoring
6. Tuning the container for optimal performance

Following these practices will help you create efficient, secure, and production-ready containers for your Spring Boot applications, making them easier to deploy and manage in various environments.

## References

- [Spring Boot Docker Documentation](https://spring.io/guides/topicals/spring-boot-docker/)
- [Docker Documentation](https://docs.docker.com/)
- [Eclipse Temurin Docker Images](https://hub.docker.com/_/eclipse-temurin)
- [Spring Boot Layer Tools](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#container-images.dockerfiles.layering)
- [JVM in Containers](https://www.eclipse.org/openj9/docs/xxusecontainersupport/)
- [Spring Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html) 