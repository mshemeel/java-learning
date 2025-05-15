# Docker Fundamentals

## Overview
This guide introduces Docker containerization concepts, best practices, and implementation strategies for Java applications. Docker provides a standardized way to package, distribute, and run applications in isolated environments called containers, making deployment consistent across different environments.

## Prerequisites
- Basic understanding of Linux commands
- Familiarity with Java applications and their deployment
- Basic understanding of networking concepts
- Knowledge of software development lifecycle

## Learning Objectives
- Understand Docker architecture and core concepts
- Learn how to containerize Java applications
- Develop skills to create efficient Dockerfiles
- Implement multi-container applications with Docker Compose
- Apply best practices for Java application containerization
- Understand Docker networking, volumes, and resource management
- Implement container security best practices

## What is Docker?

Docker is a platform that enables developers to build, package, and run applications in isolated containers. Containers package an application with all its dependencies, libraries, and configuration files, ensuring that it runs the same way regardless of the environment.

```
Docker Architecture:

┌─────────────────────────────────────────────┐
│                Docker Host                  │
│                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   │
│  │Container│   │Container│   │Container│   │
│  │    1    │   │    2    │   │    3    │   │
│  └─────────┘   └─────────┘   └─────────┘   │
│        │            │             │        │
│        v            v             v        │
│  ┌─────────────────────────────────────┐   │
│  │           Docker Engine             │   │
│  └─────────────────────────────────────┘   │
│                    │                       │
└────────────────────┼───────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────┐
│             Operating System                │
└─────────────────────────────────────────────┘
```

## Key Docker Concepts

### Images
A Docker image is a lightweight, standalone, executable software package that includes everything needed to run an application - code, runtime, libraries, environment variables, and configuration files.

### Containers
A container is a running instance of a Docker image. Containers are isolated from one another and from the host system, but can communicate with each other through well-defined channels.

### Dockerfile
A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. It automates the process of creating a Docker image.

### Registry
A Docker registry stores Docker images. Docker Hub is a public registry that anyone can use, and Docker is configured to look for images on Docker Hub by default.

### Docker Compose
Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file to configure application services.

## Docker Installation and Setup

### Installing Docker
For most operating systems, Docker Desktop provides the easiest installation experience:

- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

### Verifying Installation
After installation, confirm Docker is working correctly:

```bash
docker --version
docker run hello-world
```

## Containerizing Java Applications

### Basic Java Dockerfile
A simple Dockerfile for a Java application using a JAR file:

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/myapp.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

### Multi-stage Build for Java Applications
Multi-stage builds keep your final image lean by separating build and runtime environments:

```dockerfile
# Build stage
FROM maven:3.8.6-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies separately (for better layer caching)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Containerizing a Spring Boot Application
Spring Boot applications can be easily containerized:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.myapp.MyApplication"]
```

### Optimizing Spring Boot Container Images
Spring Boot 2.3.0+ includes built-in support for building optimized Docker images:

```bash
# Using Spring Boot's build-image goal
./mvnw spring-boot:build-image
```

Or by adding configuration to your `pom.xml`:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <image>
                    <name>${project.artifactId}:${project.version}</name>
                    <env>
                        <BP_JVM_VERSION>17</BP_JVM_VERSION>
                    </env>
                </image>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## Building and Running Docker Containers

### Building an Image
```bash
docker build -t myapp:1.0 .
```

### Running a Container
```bash
docker run -p 8080:8080 myapp:1.0
```

### Common Docker Commands
```bash
# List all containers
docker ps -a

# List all images
docker images

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_id>

# View container logs
docker logs <container_id>

# Execute a command inside a running container
docker exec -it <container_id> /bin/bash
```

## Docker Compose for Multi-Container Applications

Docker Compose simplifies managing multi-container applications. Here's an example for a Spring Boot application with a PostgreSQL database:

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=password
    depends_on:
      - db
    networks:
      - app-network
      
  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
    
volumes:
  postgres-data:
```

Running with Docker Compose:
```bash
docker-compose up -d
```

## Docker Best Practices for Java Applications

### 1. Use Official Base Images
Start with official, well-maintained base images:
```dockerfile
FROM eclipse-temurin:17-jre-alpine
```

### 2. Optimize Image Size
Keep images small to improve performance:

- Use Alpine-based images where possible
- Remove unnecessary files
- Clean package caches

```dockerfile
FROM maven:3.8.6-alpine AS build
# ... build steps ...
RUN mvn clean package -DskipTests \
    && rm -rf /root/.m2/repository

FROM eclipse-temurin:17-jre-alpine
# ... runtime steps ...
```

### 3. Layer Caching Strategy
Order Dockerfile instructions from least to most frequently changing to maximize layer caching:

```dockerfile
# These layers change less frequently
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# These layers change more frequently
COPY src ./src
RUN ./mvnw package -DskipTests
```

### 4. JVM Memory Configuration
Configure container-aware memory settings:

```dockerfile
CMD ["java", \
     "-XX:+UseContainerSupport", \
     "-XX:MaxRAMPercentage=75.0", \
     "-jar", "app.jar"]
```

### 5. Use Non-Root User
Run containers with a non-root user for security:

```dockerfile
FROM openjdk:17-jdk-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
# ... rest of Dockerfile ...
```

### 6. Graceful Shutdown
Handle SIGTERM signals properly:

```dockerfile
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", \
     "-XX:+UseContainerSupport", \
     "-XX:MaxRAMPercentage=75.0", \
     "-jar", "app.jar"]
```

For Spring Boot applications, ensure proper shutdown configuration:

```properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s
```

### 7. Health Checks
Include container health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

### 8. Proper Logging Configuration
Configure applications to log to stdout/stderr:

```properties
# application.properties
logging.file.name=
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} %highlight(%-5level) %cyan(%logger{15}) - %msg%n
```

## Advanced Docker Features for Java Applications

### Docker Networking
Create custom networks for container communication:

```bash
# Create a network
docker network create myapp-network

# Run containers on the network
docker run --network=myapp-network --name=app myapp:1.0
docker run --network=myapp-network --name=db postgres:14
```

### Docker Volumes
Persist data beyond container lifecycle:

```bash
# Create a named volume
docker volume create postgres-data

# Use the volume with a container
docker run -v postgres-data:/var/lib/postgresql/data postgres:14
```

### Resource Limits
Control container resource usage:

```bash
docker run --memory=1g --cpus=2 myapp:1.0
```

## Security Best Practices

### 1. Scan Images for Vulnerabilities

Use tools like Trivy, Clair, or Docker Scan:

```bash
docker scan myapp:1.0
```

### 2. Use Fixed Image Tags

Avoid using the `latest` tag for production:

```dockerfile
FROM openjdk:17.0.2-jdk-slim
```

### 3. Minimize Base Image Size

Choose minimal base images to reduce attack surface:

```dockerfile
FROM eclipse-temurin:17-jre-alpine
```

### 4. Run as Non-Root

As shown earlier, always run containers as non-root users.

### 5. Implement Content Trust

Sign and verify images:

```bash
export DOCKER_CONTENT_TRUST=1
docker push mycompany/myapp:1.0
```

### 6. Limit Capabilities

Restrict container capabilities:

```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp:1.0
```

## Java-Specific Docker Optimizations

### JVM Memory in Containers
Modern JVMs (Java 8u191+ and Java 11+) are container-aware, but explicit configuration is recommended:

```dockerfile
CMD ["java", \
     "-XX:InitialRAMPercentage=50.0", \
     "-XX:MaxRAMPercentage=70.0", \
     "-XX:+UseG1GC", \
     "-jar", "app.jar"]
```

### Using JLink for Smaller JVM Images
Create custom, optimized JVMs with jlink:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder

RUN jlink \
    --add-modules java.base,java.logging,java.sql,java.desktop,java.management,java.naming,java.security.jgss,java.instrument \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /javaruntime

FROM alpine:3.16
ENV JAVA_HOME=/opt/java
ENV PATH "${JAVA_HOME}/bin:${PATH}"

COPY --from=builder /javaruntime $JAVA_HOME
COPY target/myapp.jar /app.jar

CMD ["java", "-jar", "/app.jar"]
```

### Spring Boot Layered JARs
Use Spring Boot's layered JARs for faster rebuilds:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /app
COPY target/myapp.jar .
RUN java -Djarmode=layertools -jar myapp.jar extract

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy layers in order of least to most likely to change
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

## Common Containerization Challenges for Java Applications

### 1. Container Memory Limits vs. JVM Heap Size
Issue: JVM may not respect container memory limits
Solution: Use container-aware JVM flags:
```
-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
```

### 2. Slow Startup Times
Issue: Java applications can have slow startup times
Solutions:
- Use Spring Boot's lazy initialization
- Consider frameworks like Quarkus or Micronaut for faster startup
- Explore GraalVM native images for Java apps

```properties
# application.properties
spring.main.lazy-initialization=true
```

### 3. Large Image Sizes
Issue: Java applications can result in large Docker images
Solutions:
- Use multi-stage builds
- Implement jlink for custom JVMs
- Use Alpine-based images

### 4. Application Configuration
Issue: Hard-coded configuration in Docker images
Solution: Externalize configuration using environment variables:

```yaml
# docker-compose.yml
environment:
  - SPRING_PROFILES_ACTIVE=prod
  - JAVA_OPTS=-Xmx512m -Xms256m
```

## Docker with CI/CD for Java Applications

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

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
          
      - name: Build with Maven
        run: mvn -B package --file pom.xml
        
      - name: Build Docker image
        run: docker build -t mycompany/myapp:latest -t mycompany/myapp:${GITHUB_SHA::7} .
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
          
      - name: Push Docker image
        run: |
          docker push mycompany/myapp:latest
          docker push mycompany/myapp:${GITHUB_SHA::7}
```

### Jenkins Pipeline Example
```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.6'
        jdk 'JDK 17'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t mycompany/myapp:latest .'
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub', variable: 'DOCKER_HUB_CREDS')]) {
                    sh 'echo $DOCKER_HUB_CREDS | docker login -u mycompany --password-stdin'
                    sh 'docker push mycompany/myapp:latest'
                    sh 'docker push mycompany/myapp:${BUILD_NUMBER}'
                }
            }
        }
    }
}
```

## Next Steps

Once you understand Docker fundamentals, explore these related topics:

- [CI/CD Fundamentals](ci-cd-fundamentals.md)
- [Infrastructure as Code](infrastructure-as-code.md)
- [Monitoring & Logging](monitoring-logging.md)
- [Java Containerization](java-containerization.md)

## References and Resources

- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Docker Documentation](https://spring.io/guides/topicals/spring-boot-docker/)
- [Eclipse Temurin Docker Images](https://hub.docker.com/_/eclipse-temurin)
- [Docker for Java Developers](https://www.docker.com/blog/docker-for-java-developers/)
- [Effective Docker for Java Developers](https://developer.okta.com/blog/2020/06/24/docker-for-java-developers)
- [Docker Java Image Best Practices](https://snyk.io/blog/best-practices-to-build-java-containers-with-docker/)
- [Optimizing Spring Boot for Docker](https://www.baeldung.com/spring-boot-docker-images) 