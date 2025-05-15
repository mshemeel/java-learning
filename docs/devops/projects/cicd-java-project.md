# CI/CD Pipeline for Java Projects

## Overview
This tutorial demonstrates how to build a comprehensive CI/CD pipeline for a Java application using GitHub Actions. We'll walk through the entire process from initial setup to automated deployment, ensuring high-quality code and reliable releases.

## Prerequisites
- GitHub account
- Basic understanding of [CI/CD fundamentals](../ci-cd-fundamentals.md)
- Java development experience
- Maven or Gradle knowledge
- Docker basics (for containerization)

## Learning Objectives
- Set up a complete CI/CD pipeline for a Java application
- Implement automated testing, code quality, and security scanning
- Configure containerized deployments
- Implement environment promotions (dev, staging, production)
- Monitor pipeline health and performance

## Project Setup

### Sample Application Structure
We'll use a simple Spring Boot application with the following structure:

```
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       └── model/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│       └── java/
│           └── com/example/demo/
│               ├── DemoApplicationTests.java
│               ├── controller/
│               ├── service/
│               └── repository/
├── pom.xml
├── Dockerfile
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── README.md
```

## CI/CD Pipeline Implementation

### Step 1: Creating the GitHub Actions Workflow File

First, let's create our CI/CD workflow file in `.github/workflows/ci-cd.yml`:

```yaml
name: Java CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

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
        run: mvn -B package --file pom.xml
      
      - name: Run Tests
        run: mvn test
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-jar
          path: target/*.jar
          retention-days: 5

  code-quality:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      
      - name: SpotBugs Check
        run: mvn com.github.spotbugs:spotbugs-maven-plugin:check
      
      - name: OWASP Dependency Check
        run: mvn org.owasp:dependency-check-maven:check

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: app-jar
          path: target
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: my-java-app:${{ github.sha }}
          load: true
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: my-java-app:${{ github.sha }}
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'

  deploy-dev:
    needs: [code-quality, security]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: development
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: app-jar
          path: target
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myorg/java-app:dev-${{ github.sha }}
      
      - name: Deploy to Dev Environment
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEV_HOST }}
          username: ${{ secrets.DEV_USERNAME }}
          key: ${{ secrets.DEV_SSH_KEY }}
          script: |
            docker pull myorg/java-app:dev-${{ github.sha }}
            docker stop java-app || true
            docker rm java-app || true
            docker run -d --name java-app -p 8080:8080 myorg/java-app:dev-${{ github.sha }}

  deploy-prod:
    needs: deploy-dev
    runs-on: ubuntu-latest
    environment: 
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.24.0'
      
      - name: Set Kubernetes context
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
      
      - name: Deploy to Kubernetes
        run: |
          # Update image tag in deployment manifest
          sed -i 's|image: myorg/java-app:.*|image: myorg/java-app:dev-${{ github.sha }}|' k8s/deployment.yaml
          
          # Apply the configuration
          kubectl apply -f k8s/deployment.yaml
          kubectl apply -f k8s/service.yaml
          
          # Wait for deployment to complete
          kubectl rollout status deployment/java-app
```

### Step 2: Creating a Dockerfile

Create a Dockerfile for containerizing the Java application:

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user to run the application
RUN addgroup -S javauser && adduser -S -G javauser javauser

# Set ownership of the application directory
RUN chown -R javauser:javauser /app

# Switch to non-root user
USER javauser

# Copy the JAR file (will be built by the CI pipeline)
COPY --chown=javauser:javauser target/*.jar app.jar

# Configure JVM options for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom"

# Expose the application port
EXPOSE 8080

# Run the application with proper JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Step 3: Creating Kubernetes Deployment Files

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-app
  labels:
    app: java-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: java-app
  template:
    metadata:
      labels:
        app: java-app
    spec:
      containers:
      - name: java-app
        image: myorg/java-app:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 15
```

Create `k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: java-app
spec:
  selector:
    app: java-app
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: java-app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - example.com
    secretName: java-app-tls
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: java-app
            port:
              number: 80
```

## Pipeline Breakdown

Let's explain each part of our CI/CD pipeline:

### Build and Test
- Checks out the code
- Sets up JDK 17
- Builds the application with Maven
- Runs unit and integration tests
- Uploads the build artifacts for later stages

### Code Quality
- Analyzes code with SonarQube for code quality issues
- Runs SpotBugs to find potential bugs
- Performs OWASP dependency check for vulnerable libraries

### Security
- Builds a Docker image
- Scans the image for vulnerabilities with Trivy
- Fails the pipeline if critical or high vulnerabilities are found

### Deploy to Development
- Triggers only on merges to the main branch
- Builds and pushes the Docker image to Docker Hub
- Deploys the application to the development environment
- Uses SSH to connect to the server and run the application

### Deploy to Production
- Requires successful deployment to development
- Uses a manual approval step (environment protection rule)
- Deploys to Kubernetes using kubectl
- Updates the deployment manifest with the new image tag
- Applies the configuration and waits for the rollout to complete

## Setting Up Secrets

To make this pipeline work, you need to set up the following secrets in your GitHub repository:

- `SONAR_TOKEN`: Authentication token for SonarQube
- `SONAR_HOST_URL`: URL of your SonarQube instance
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `DEV_HOST`: Hostname/IP of the development server
- `DEV_USERNAME`: Username for SSH access to the development server
- `DEV_SSH_KEY`: SSH private key for the development server
- `KUBE_CONFIG`: Kubernetes configuration file for production deployment

## Enhancing the Pipeline

### Adding Automated Testing Reports

Add JUnit test reporting to the build job:

```yaml
- name: Run Tests
  run: mvn test

- name: Publish Test Report
  uses: mikepenz/action-junit-report@v3
  if: always()
  with:
    report_paths: '**/target/surefire-reports/TEST-*.xml'
```

### Adding Code Coverage

Add JaCoCo code coverage to the build job:

```yaml
- name: Build with Maven and generate coverage
  run: mvn -B verify -Pcoverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    fail_ci_if_error: true
```

Add this profile to your `pom.xml`:

```xml
<profiles>
  <profile>
    <id>coverage</id>
    <build>
      <plugins>
        <plugin>
          <groupId>org.jacoco</groupId>
          <artifactId>jacoco-maven-plugin</artifactId>
          <version>0.8.8</version>
          <executions>
            <execution>
              <goals>
                <goal>prepare-agent</goal>
              </goals>
            </execution>
            <execution>
              <id>report</id>
              <phase>verify</phase>
              <goals>
                <goal>report</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
      </plugins>
    </build>
  </profile>
</profiles>
```

### Adding Performance Testing

Add a performance testing job to the pipeline:

```yaml
performance-test:
  needs: deploy-dev
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Install k6
      run: |
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Run performance tests
      run: k6 run performance-tests/load-test.js
    
    - name: Upload performance test results
      uses: actions/upload-artifact@v3
      with:
        name: performance-results
        path: performance-results.json
```

## Monitoring the Pipeline

To monitor your CI/CD pipeline, consider implementing:

1. **GitHub Actions Dashboard**: View pipeline runs directly in GitHub
2. **Status Badges**: Add a status badge to your README to show pipeline status
3. **Notifications**: Set up notifications for failed pipelines through Slack, email, etc.
4. **Pipeline Metrics**: Track metrics like:
   - Pipeline duration
   - Success/failure rate
   - Test coverage trends
   - Number of deployments

## Conclusion

In this tutorial, we've built a comprehensive CI/CD pipeline for a Java application that:

- Automates building, testing, and deployment
- Ensures code quality and security
- Deploys to multiple environments with approval gates
- Provides visibility into the deployment process

This pipeline follows modern DevOps best practices, including infrastructure as code, automated testing, and security scanning. By implementing a pipeline like this, you can significantly improve the quality and reliability of your Java applications while speeding up the development process.

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SpotBugs Documentation](https://spotbugs.github.io/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/) 