# Microservices Deployment

## Overview
This guide covers various deployment strategies and patterns for microservices architecture, including containerization, orchestration, and continuous deployment practices.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of Docker and Kubernetes
- Familiarity with CI/CD concepts
- Understanding of cloud platforms

## Learning Objectives
- Understand different deployment strategies
- Learn containerization best practices
- Master Kubernetes deployments
- Implement CI/CD pipelines
- Handle configuration management

## Table of Contents
1. [Containerization](#containerization)
2. [Kubernetes Deployment](#kubernetes-deployment)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Configuration Management](#configuration-management)
5. [Deployment Strategies](#deployment-strategies)

## Containerization

### Dockerfile Example
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  user-service:
    build: ./user-service
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=userdb
```

## Kubernetes Deployment

### Basic Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Service Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

### ConfigMap and Secrets
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: user-service-config
data:
  application.yaml: |
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/userdb
        
---
apiVersion: v1
kind: Secret
metadata:
  name: user-service-secrets
type: Opaque
data:
  db-password: base64encodedpassword
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK
      uses: actions/setup-java@v2
      with:
        java-version: '17'
        
    - name: Build with Maven
      run: mvn clean package
      
    - name: Build Docker image
      run: docker build -t user-service:${{ github.sha }} .
      
    - name: Push to Registry
      run: |
        docker tag user-service:${{ github.sha }} registry/user-service:${{ github.sha }}
        docker push registry/user-service:${{ github.sha }}
        
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/user-service \
          user-service=registry/user-service:${{ github.sha }}
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t user-service:${BUILD_NUMBER} .'
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/
                    kubectl set image deployment/user-service \
                        user-service=user-service:${BUILD_NUMBER}
                '''
            }
        }
    }
}
```

## Configuration Management

### Spring Cloud Config
```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/org/config-repo
          searchPaths: '{application}'
```

### Kubernetes ConfigMap Mounting
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  template:
    spec:
      containers:
      - name: user-service
        volumeMounts:
        - name: config-volume
          mountPath: /config
      volumes:
      - name: config-volume
        configMap:
          name: user-service-config
```

## Deployment Strategies

### Blue-Green Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-blue
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: user-service
        version: blue
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-green
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: user-service
        version: green
```

### Canary Deployment
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
  - user-service
  http:
  - route:
    - destination:
        host: user-service
        subset: v1
      weight: 90
    - destination:
        host: user-service
        subset: v2
      weight: 10
```

## Best Practices
1. Use immutable containers
2. Implement proper health checks
3. Use configuration management
4. Implement automated rollbacks
5. Monitor deployments
6. Use proper resource limits
7. Implement proper logging

## Common Pitfalls
1. Missing health checks
2. Poor resource management
3. Inadequate monitoring
4. Missing rollback strategies
5. Configuration mismanagement
6. Insufficient testing

## Implementation Examples

### Complete Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: user-service
        image: user-service:1.0.0
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: db-password
```

### Helm Chart Structure
```
user-service/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
└── charts/
```

## Resources for Further Learning
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

## Practice Exercises
1. Create a complete Kubernetes deployment
2. Implement blue-green deployment
3. Set up a CI/CD pipeline
4. Configure monitoring for deployments
5. Implement automated rollbacks 