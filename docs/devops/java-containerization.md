# Java Containerization

## Overview
This guide provides detailed instructions and best practices for containerizing Java applications. Containerization enables consistent deployment across different environments, improves scalability, and simplifies dependency management. We'll explore various techniques for packaging Java applications into containers with a focus on optimizing for production environments.

## Prerequisites
- Basic understanding of [Docker fundamentals](docker-fundamentals.md)
- Familiarity with Java application development
- Understanding of Java build tools (Maven or Gradle)
- Basic knowledge of container orchestration concepts

## Learning Objectives
- Understand containerization strategies specific to Java applications
- Learn how to optimize Java containers for production
- Create efficient Dockerfiles for different types of Java applications
- Configure JVM settings appropriately for containerized environments
- Implement multi-stage builds for smaller, more secure Java containers
- Package Java applications using various approaches (JAR, WAR, exploded)
- Implement container best practices for Java microservices

## Java and Containers

### Why Containerize Java Applications?
Java applications benefit from containerization in several ways:

1. **Environment consistency**: Eliminate "works on my machine" problems
2. **Dependency isolation**: Package application and dependencies together
3. **Resource efficiency**: Control memory, CPU, and other resource allocations
4. **Faster startup**: Optimize for cloud-native environments
5. **Improved scalability**: Scale containers independently
6. **Simplified deployment**: Deploy the same container across environments

### Java Container Considerations

Java applications have unique containerization requirements:

1. **JVM memory management**: Properly configure heap settings
2. **CPU awareness**: Ensure proper CPU allocation and awareness
3. **JVM ergonomics**: Address how the JVM behaves in constrained environments
4. **Container-aware JDKs**: Use JDK versions that recognize container limits
5. **Application startup time**: Optimize for faster container initialization

## Java Container Base Images

### Choosing the Right Base Image

Several options exist for Java base images, each with different tradeoffs:

| Base Image | Size | Benefits | Use Cases |
|------------|------|----------|-----------|
| eclipse-temurin | ~300-500MB | Official Java images with good support | General purpose |
| amazoncorretto | ~300-500MB | AWS-optimized JDK with long-term support | AWS deployments |
| adoptopenjdk | ~300-500MB | Community-supported images | General purpose |
| distroless | ~180MB | Minimal attack surface, smaller size | Security-focused apps |
| alpine-based | ~120-200MB | Smaller image size | Resource-constrained environments |
| custom JRE | ~80-150MB | Smallest possible size with jlink | Production microservices |

### JDK vs JRE Base Images

```
┌──────────────────────────────────────────────────┐
│                     JDK Image                    │
│ ┌──────────────┬───────────────┬──────────────┐  │
│ │  Java Runtime│  Development  │    Debug     │  │
│ │  Environment │     Tools     │    Tools     │  │
│ └──────────────┴───────────────┴──────────────┘  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────┐
│          JRE Image           │
│ ┌──────────────────────────┐ │
│ │      Java Runtime        │ │
│ │      Environment         │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

Use JDK images for build stages, and JRE images for runtime to reduce image size and attack surface.

## Creating Efficient Java Dockerfiles

### Basic Java Application Dockerfile

A simple Dockerfile for a Spring Boot application:

```dockerfile
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY target/myapp.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Multi-Stage Build for Java Applications

Multi-stage builds significantly reduce image size by separating build and runtime environments:

```dockerfile
# Build stage
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies separately (better caching)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### For Gradle Projects

```dockerfile
# Build stage
FROM gradle:7.5-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
# Download dependencies separately (better caching)
RUN gradle dependencies
COPY src ./src
RUN gradle build -x test

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Exploded JAR Approach

This approach can improve startup time by reducing IO operations:

```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/dependency/BOOT-INF/lib /app/lib
COPY --from=build /app/target/dependency/META-INF /app/META-INF
COPY --from=build /app/target/dependency/BOOT-INF/classes /app

EXPOSE 8080
ENTRYPOINT ["java", "-cp", "/app:/app/lib/*", "com.example.Application"]
```

To prepare for this approach:
```bash
mkdir -p target/dependency
(cd target/dependency; jar -xf ../myapp.jar)
```

### Custom JRE with jlink

Create a minimal JRE containing only required modules:

```dockerfile
# Build stage
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# JRE creation stage
FROM eclipse-temurin:17 AS jre-build
WORKDIR /jre-build
# Determine modules needed (example)
RUN jdeps --print-module-deps --ignore-missing-deps /app/target/myapp.jar > modules.info
# Create custom JRE
RUN jlink --add-modules $(cat modules.info),jdk.crypto.ec \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output jre

# Runtime stage
FROM debian:buster-slim
WORKDIR /app
COPY --from=jre-build /jre-build/jre /opt/jre
COPY --from=build /app/target/myapp.jar app.jar
ENV PATH="/opt/jre/bin:${PATH}"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Optimizing JVM Settings for Containers

### Container-Aware JVM Configuration

Java 11+ is container-aware by default. For Java 8, explicit flags are needed:

```dockerfile
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "app.jar"]
```

### Memory Configuration

Configure JVM heap settings appropriately:

```dockerfile
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
```

This sets the heap to 75% of the container's memory limit, leaving room for off-heap memory.

### CPU Configuration

JVM can be configured to respect container CPU limits:

```dockerfile
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:ActiveProcessorCount=$(nproc)", \
  "-jar", "app.jar"]
```

### GC Selection for Containers

Different GC algorithms are suitable for different container scenarios:

```dockerfile
# For throughput-focused applications
ENTRYPOINT ["java", "-XX:+UseParallelGC", "-jar", "app.jar"]

# For latency-sensitive applications
ENTRYPOINT ["java", "-XX:+UseG1GC", "-jar", "app.jar"]

# For small heap sizes and minimal pauses (Java 11+)
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]
```

### Java Application Type-Specific Settings

#### For Spring Boot Applications
```dockerfile
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Dspring.profiles.active=production", \
  "-Dserver.port=8080", \
  "-jar", "app.jar"]
```

#### For Quarkus Applications
```dockerfile
FROM quay.io/quarkus/quarkus-micro-image:1.0
WORKDIR /app
COPY --from=build /app/target/*-runner /app/application
EXPOSE 8080
ENTRYPOINT ["./application", "-Dquarkus.http.host=0.0.0.0"]
```

#### For Micronaut Applications
```dockerfile
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-Dmicronaut.environments=prod", \
  "-jar", "app.jar"]
```

### Environment Variables vs. Java System Properties

Use environment variables for configuration:

```dockerfile
ENV DB_URL=jdbc:postgresql://db:5432/myapp
ENV DB_USER=user
ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT java $JAVA_OPTS -Dspring.datasource.url=$DB_URL -jar app.jar
```

Better approach using an entrypoint script (`entrypoint.sh`):

```bash
#!/bin/sh
java $JAVA_OPTS \
  -Dspring.datasource.url=${DB_URL} \
  -Dspring.datasource.username=${DB_USER} \
  -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-production} \
  -jar app.jar
```

```dockerfile
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
```

## Advanced Java Containerization Techniques

### Layered JAR Files (Spring Boot 2.3+)

Spring Boot 2.3+ supports layered JARs for improved Docker caching:

```dockerfile
FROM eclipse-temurin:17-jre as builder
WORKDIR /app
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

In your `pom.xml`:
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

### Buildpacks for Java Apps

Cloud Native Buildpacks automate the creation of optimized containers:

```bash
# Using the pack CLI
pack build myapp --builder gcr.io/buildpacks/builder:v1 --path .

# Using Spring Boot 2.3+
./mvnw spring-boot:build-image

# Using Gradle
./gradlew bootBuildImage
```

### Jib for Java Containerization

Jib builds optimized Docker images for Java applications without a Dockerfile:

Maven configuration:
```xml
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <to>
            <image>registry/myapp:${project.version}</image>
        </to>
        <container>
            <jvmFlags>
                <jvmFlag>-XX:+UseContainerSupport</jvmFlag>
                <jvmFlag>-XX:MaxRAMPercentage=75.0</jvmFlag>
            </jvmFlags>
            <ports>
                <port>8080</port>
            </ports>
            <format>OCI</format>
        </container>
    </configuration>
</plugin>
```

Build with:
```bash
mvn compile jib:build
```

Gradle configuration:
```groovy
plugins {
    id 'com.google.cloud.tools.jib' version '3.3.1'
}

jib {
    from {
        image = 'eclipse-temurin:17-jre-alpine'
    }
    to {
        image = 'registry/myapp:${version}'
    }
    container {
        jvmFlags = ['-XX:+UseContainerSupport', '-XX:MaxRAMPercentage=75.0']
        ports = ['8080']
    }
}
```

Build with:
```bash
./gradlew jib
```

## Java Application Types and Container Patterns

### Microservice Container Pattern

```
┌─────────────────────────────────────┐
│             Container               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Java Application      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────┐                    │
│  │     JRE     │                    │
│  └─────────────┘                    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     Minimal OS Layer        │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Sidecar Container Pattern

```
┌───────────────────────────────────────────────┐
│                     Pod                       │
│                                               │
│  ┌─────────────────┐    ┌─────────────────┐   │
│  │  Java Service   │    │    Sidecar      │   │
│  │                 │    │  (e.g., log     │   │
│  │                 │    │   collection)    │   │
│  └────────┬────────┘    └────────┬────────┘   │
│           │                      │            │
│           └──────────────────────┘            │
│             Shared Volume/IPC                 │
└───────────────────────────────────────────────┘
```

### Init Container Pattern

```
┌─────────────────────────────────────────────────────────┐
│                         Pod                             │
│                                                         │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ Init Container  │          │  Java Service   │       │
│  │ (DB migration,  │─────────▶│                 │       │
│  │  setup, etc.)   │          │                 │       │
│  └─────────────────┘          └─────────────────┘       │
│    Runs to completion           Starts after init        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Security Considerations for Java Containers

### Running as Non-Root User

Best practice is to run containers as a non-root user:

```dockerfile
FROM eclipse-temurin:17-jre-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory and ownership
WORKDIR /app
COPY --chown=appuser:appgroup target/myapp.jar /app/app.jar

# Switch to non-root user
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Read-Only File System

Enable read-only file system for better security:

```dockerfile
# Ensure temporary directories exist with proper permissions
RUN mkdir -p /tmp/app/logs && \
    chown -R appuser:appgroup /tmp/app
    
USER appuser

VOLUME ["/tmp/app/logs"]
ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp/app", "-jar", "app.jar"]
```

When running:
```bash
docker run --read-only --tmpfs /tmp/app:rw,exec myapp:latest
```

### Container Security Scanning

Integrate vulnerability scanning:

```bash
# Trivy example
trivy image myapp:latest

# Clair example
clair-scanner --ip $(hostname -i) myapp:latest
```

## Java-Specific Docker Compose Examples

### Development Environment

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
      - "5005:5005"  # Remote debugging port
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
    volumes:
      - ./src:/app/src  # Hot reloading
    depends_on:
      - db
      
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  db-data:
```

### Testing Environment

```yaml
version: '3.8'
services:
  app:
    image: myapp:${TAG:-latest}
    environment:
      - SPRING_PROFILES_ACTIVE=test
      - DB_URL=jdbc:postgresql://db:5432/testdb
    depends_on:
      - db
    
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
      
  tests:
    image: maven:3.8-openjdk-17
    working_dir: /app
    volumes:
      - .:/app
    command: mvn verify
    depends_on:
      - app
```

## Monitoring Java Applications in Containers

### Exposing JMX Metrics

```dockerfile
ENTRYPOINT ["java", \
  "-Dcom.sun.management.jmxremote", \
  "-Dcom.sun.management.jmxremote.port=9010", \
  "-Dcom.sun.management.jmxremote.rmi.port=9010", \
  "-Dcom.sun.management.jmxremote.local.only=false", \
  "-Dcom.sun.management.jmxremote.authenticate=false", \
  "-Dcom.sun.management.jmxremote.ssl=false", \
  "-Djava.rmi.server.hostname=0.0.0.0", \
  "-jar", "app.jar"]
```

### Spring Boot Actuator with Prometheus

```dockerfile
# Expose metrics endpoint
EXPOSE 8080 8081

ENTRYPOINT ["java", \
  "-Dmanagement.server.port=8081", \
  "-Dmanagement.endpoints.web.exposure.include=health,info,metrics,prometheus", \
  "-jar", "app.jar"]
```

Prometheus configuration:
```yaml
scrape_configs:
  - job_name: 'java-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['app:8081']
```

## Best Practices for Java Containerization

1. **Use specific JDK/JRE versions** rather than `latest` tags for reproducibility

2. **Implement proper health checks** for container orchestration:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s \
     CMD curl -f http://localhost:8080/actuator/health || exit 1
   ```

3. **Cache dependencies separately** to optimize build times

4. **Use environment variables** for configuration rather than hardcoded values

5. **Implement proper signal handling** to ensure graceful shutdown:
   ```dockerfile
   ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
   ```

6. **Optimize image size** using multi-stage builds and minimal base images

7. **Configure appropriate memory limits** for both container and JVM

8. **Use container-specific JVM settings** to ensure proper resource allocation

9. **Implement liveness and readiness probes** when using Kubernetes:
   ```yaml
   livenessProbe:
     httpGet:
       path: /actuator/health/liveness
       port: 8080
     initialDelaySeconds: 60
     periodSeconds: 10
   readinessProbe:
     httpGet:
       path: /actuator/health/readiness
       port: 8080
     initialDelaySeconds: 30
     periodSeconds: 5
   ```

10. **Log to stdout/stderr** rather than to files for container compatibility

## Performance Tuning for Java Containers

### Startup Time Optimization

1. **Class Data Sharing (CDS)**:
   ```dockerfile
   # Create CDS archive
   RUN java -Xshare:dump -jar app.jar --thin.dryrun && \
       java -XX:DumpLoadedClassList=classes.lst -jar app.jar --thin.dryrun && \
       java -Xshare:dump -XX:SharedClassListFile=classes.lst -XX:SharedArchiveFile=app-cds.jsa
   
   # Use CDS archive at runtime
   ENTRYPOINT ["java", "-Xshare:on", "-XX:SharedArchiveFile=app-cds.jsa", "-jar", "app.jar"]
   ```

2. **Tiered compilation**:
   ```dockerfile
   ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-jar", "app.jar"]
   ```

3. **AOT Compilation (Java 9+)**:
   ```dockerfile
   RUN jlink --add-modules java.base,... --output jre
   RUN jaotc --output classes.so --jar app.jar
   ENTRYPOINT ["java", "-XX:AOTLibrary=./classes.so", "-jar", "app.jar"]
   ```

### Resource Constraints

1. **Heap size limits**:
   ```dockerfile
   ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]
   ```

2. **CPU sets**:
   ```yaml
   # In docker-compose.yml or Kubernetes manifest
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

## Next Steps

To continue learning about DevOps practices for Java applications, explore:

- [Java App Monitoring](java-app-monitoring.md)
- [Java CI/CD Pipelines](java-cicd-pipelines.md)
- [Java Deployment Strategies](java-deployment-strategies.md)
- Sample project: [Containerizing Spring App](projects/containerizing-spring-app.md)

## References and Resources

- [Docker Java Documentation](https://docs.docker.com/language/java/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Java and Docker - JVM Memory Settings](https://www.eclipse.org/openj9/docs/xxusecontainersupport/)
- [JDK Container Awareness](https://blogs.oracle.com/java/post/java-se-support-for-docker-cpu-and-memory-limits)
- [Eclipse Temurin Images](https://hub.docker.com/_/eclipse-temurin)
- [Jib Documentation](https://github.com/GoogleContainerTools/jib) 