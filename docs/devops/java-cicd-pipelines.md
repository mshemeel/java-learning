# Java CI/CD Pipelines

## Overview
This guide focuses on implementing Continuous Integration and Continuous Deployment (CI/CD) pipelines specifically for Java applications. We'll cover how to automate building, testing, and deploying Java projects using popular CI/CD tools and frameworks, with practical examples and best practices.

## Prerequisites
- Understanding of [CI/CD fundamentals](ci-cd-fundamentals.md)
- Familiarity with Java build tools (Maven or Gradle)
- Basic knowledge of version control systems (preferably Git)
- Familiarity with containerization concepts

## Learning Objectives
- Design efficient CI/CD pipelines for Java applications
- Implement automated testing strategies for Java code
- Configure build automation with Maven and Gradle
- Deploy Java applications using different deployment strategies
- Implement quality gates and code analysis in your pipeline
- Integrate security scanning into your build process

## Java-Specific CI/CD Components

### CI/CD Pipeline Stages for Java Applications

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           Java CI/CD Pipeline Workflow                                │
└───────────────────────────────────────────────────────────────────────────────────────┘
    │            │             │             │             │              │
    ▼            ▼             ▼             ▼             ▼              ▼
┌─────────┐ ┌─────────┐  ┌─────────┐   ┌─────────┐  ┌─────────┐    ┌─────────────┐
│  Code   │ │  Build  │  │  Test   │   │ Quality │  │ Package │    │   Deploy    │
│Checkout │ │(Maven/  │  │(JUnit/  │   │  Gate   │  │ (JAR/   │    │(Kubernetes/ │
│         │ │Gradle)  │  │TestNG)  │   │(SonarQube)│  │WAR/Docker)│    │App Server)│
└─────────┘ └─────────┘  └─────────┘   └─────────┘  └─────────┘    └─────────────┘
                                                                        │
                                                                        ▼
                                                                   ┌─────────────┐
                                                                   │   Verify    │
                                                                   │(Smoke Tests)│
                                                                   └─────────────┘
                                                                        │
                                                                        ▼
                                                                   ┌─────────────┐
                                                                   │  Promote    │
                                                                   │(Staging→Prod)│
                                                                   └─────────────┘
```

## CI/CD Tools for Java Applications

### Jenkins for Java Applications
Jenkins is one of the most popular CI/CD tools for Java applications due to its flexibility and extensive plugin ecosystem.

#### Setting Up a Jenkins Pipeline for Java Projects

Create a Jenkinsfile at the root of your project:

```groovy
pipeline {
    agent any
    
    tools {
        // Define the Maven and JDK versions to use
        maven 'Maven 3.8.6'
        jdk 'JDK 17'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Get code from the repository
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                // Build with Maven
                sh 'mvn -B clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                // Run unit tests
                sh 'mvn test'
            }
            post {
                // Collect test reports regardless of build status
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Code Analysis') {
            steps {
                // Run SonarQube analysis
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                // Wait for SonarQube quality gate
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Package') {
            steps {
                // Package application
                sh 'mvn -B -DskipTests package'
                
                // Archive JAR/WAR files
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
            }
        }
        
        stage('Build Docker Image') {
            steps {
                // Build Docker image
                sh 'docker build -t myapp:${BUILD_NUMBER} .'
                
                // Tag as latest
                sh 'docker tag myapp:${BUILD_NUMBER} myapp:latest'
            }
        }
        
        stage('Deploy to Dev') {
            steps {
                // Deploy to development environment
                sh 'kubectl apply -f kubernetes/dev/'
                
                // Update image in deployment
                sh 'kubectl set image deployment/myapp-deployment myapp=myapp:${BUILD_NUMBER} -n dev'
            }
        }
        
        stage('Integration Tests') {
            steps {
                // Run integration tests against dev environment
                sh 'mvn failsafe:integration-test'
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                // Deploy to staging environment
                sh 'kubectl apply -f kubernetes/staging/'
                sh 'kubectl set image deployment/myapp-deployment myapp=myapp:${BUILD_NUMBER} -n staging'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                // Manual approval step before production deployment
                input message: 'Deploy to production?'
                
                // Deploy to production environment
                sh 'kubectl apply -f kubernetes/production/'
                sh 'kubectl set image deployment/myapp-deployment myapp=myapp:${BUILD_NUMBER} -n production'
            }
        }
    }
    
    post {
        success {
            // Actions on successful build
            echo 'Build succeeded!'
            emailext (
                subject: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build completed successfully: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        failure {
            // Actions on failed build
            echo 'Build failed!'
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build failed: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        always {
            // Clean up workspace
            cleanWs()
        }
    }
}
```

#### Essential Jenkins Plugins for Java Projects

- **Maven Integration**: For Maven build integration
- **Gradle**: For Gradle build integration
- **JUnit**: For test result visualization
- **JaCoCo**: For code coverage reporting
- **SonarQube Scanner**: For code quality analysis
- **Docker**: For container build and publish
- **Kubernetes CLI**: For Kubernetes deployments
- **Pipeline**: For pipeline as code support
- **Blue Ocean**: For improved visualization

### GitHub Actions for Java

GitHub Actions provides seamless integration with GitHub repositories and offers many advantages for Java projects.

#### Basic GitHub Actions Workflow for Java

Create a file at `.github/workflows/java-ci.yml`:

```yaml
name: Java CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Set up JDK
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
        
    - name: Build with Maven
      run: mvn -B clean package
      
    - name: Run tests
      run: mvn test
      
    - name: Upload test results
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: target/surefire-reports/
        
    - name: Analyze with SonarCloud
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      run: mvn -B verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar
      
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: ${{ github.event_name != 'pull_request' }}
        tags: |
          mycompany/myapp:latest
          mycompany/myapp:${{ github.sha }}
        
  deploy-dev:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Configure Kubernetes context
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - name: Deploy to development
      run: |
        kubectl apply -f kubernetes/dev/
        kubectl set image deployment/myapp-deployment myapp=mycompany/myapp:${{ github.sha }} -n dev
        
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/myapp-deployment -n dev
        
  deploy-prod:
    needs: [build, deploy-dev]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://myapp.example.com
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Configure Kubernetes context
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - name: Deploy to production
      run: |
        kubectl apply -f kubernetes/production/
        kubectl set image deployment/myapp-deployment myapp=mycompany/myapp:${{ github.sha }} -n production
        
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/myapp-deployment -n production
```

### GitLab CI/CD for Java

GitLab CI/CD offers integrated capabilities for Java project pipelines directly within the GitLab platform.

#### Example .gitlab-ci.yml for Java Applications

```yaml
image: maven:3.8-openjdk-17

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .m2/repository

stages:
  - build
  - test
  - analyze
  - package
  - deploy

build:
  stage: build
  script:
    - mvn compile

test:
  stage: test
  script:
    - mvn test
  artifacts:
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml

code_quality:
  stage: analyze
  script:
    - mvn sonar:sonar
  only:
    - main
    - develop
    - merge_requests

create_jar:
  stage: package
  script:
    - mvn package -DskipTests
  artifacts:
    paths:
      - target/*.jar

build_docker:
  stage: package
  image: docker:20
  services:
    - docker:20-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
  only:
    - main
    - develop

deploy_dev:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context dev
    - kubectl apply -f kubernetes/dev/
    - kubectl set image deployment/myapp-deployment myapp=$DOCKER_IMAGE -n dev
    - kubectl rollout status deployment/myapp-deployment -n dev
  environment:
    name: development
    url: https://dev.myapp.example.com
  only:
    - develop

deploy_prod:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context prod
    - kubectl apply -f kubernetes/production/
    - kubectl set image deployment/myapp-deployment myapp=$DOCKER_IMAGE -n production
    - kubectl rollout status deployment/myapp-deployment -n production
  environment:
    name: production
    url: https://myapp.example.com
  when: manual
  only:
    - main
```

## Build Tool Integration

### Maven in CI/CD Pipelines

Maven is widely used for Java builds in CI/CD pipelines due to its declarative approach and convention over configuration philosophy.

#### Maven Project Configuration for CI/CD

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-java-app</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <sonar.projectKey>my-project</sonar.projectKey>
        <sonar.organization>my-organization</sonar.organization>
        <sonar.host.url>https://sonarcloud.io</sonar.host.url>
        <jacoco.version>0.8.8</jacoco.version>
    </properties>
    
    <dependencies>
        <!-- Project dependencies -->
    </dependencies>
    
    <build>
        <plugins>
            <!-- Compiler plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.10.1</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
            
            <!-- Surefire for unit tests -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0-M7</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                    </includes>
                </configuration>
            </plugin>
            
            <!-- Failsafe for integration tests -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-failsafe-plugin</artifactId>
                <version>3.0.0-M7</version>
                <configuration>
                    <includes>
                        <include>**/*IT.java</include>
                    </includes>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>integration-test</goal>
                            <goal>verify</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            
            <!-- JaCoCo for code coverage -->
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>${jacoco.version}</version>
                <executions>
                    <execution>
                        <id>prepare-agent</id>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>check</id>
                        <goals>
                            <goal>check</goal>
                        </goals>
                        <configuration>
                            <rules>
                                <rule>
                                    <element>BUNDLE</element>
                                    <limits>
                                        <limit>
                                            <counter>INSTRUCTION</counter>
                                            <value>COVEREDRATIO</value>
                                            <minimum>0.80</minimum>
                                        </limit>
                                    </limits>
                                </rule>
                            </rules>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            
            <!-- Spring Boot plugin (if using Spring) -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.7.5</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            
            <!-- Jib for containerization (alternative to Dockerfile) -->
            <plugin>
                <groupId>com.google.cloud.tools</groupId>
                <artifactId>jib-maven-plugin</artifactId>
                <version>3.3.1</version>
                <configuration>
                    <from>
                        <image>eclipse-temurin:17-jre-alpine</image>
                    </from>
                    <to>
                        <image>myregistry/myapp:${project.version}</image>
                        <tags>
                            <tag>latest</tag>
                        </tags>
                    </to>
                    <container>
                        <jvmFlags>
                            <jvmFlag>-Xms512m</jvmFlag>
                            <jvmFlag>-Xmx512m</jvmFlag>
                        </jvmFlags>
                        <ports>
                            <port>8080</port>
                        </ports>
                    </container>
                </configuration>
            </plugin>
        </plugins>
    </build>
    
    <profiles>
        <!-- Profile for CI environments -->
        <profile>
            <id>ci</id>
            <properties>
                <maven.test.skip>false</maven.test.skip>
                <maven.javadoc.skip>true</maven.javadoc.skip>
            </properties>
        </profile>
        
        <!-- Profile for production builds -->
        <profile>
            <id>production</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-enforcer-plugin</artifactId>
                        <version>3.1.0</version>
                        <executions>
                            <execution>
                                <id>enforce-versions</id>
                                <goals>
                                    <goal>enforce</goal>
                                </goals>
                                <configuration>
                                    <rules>
                                        <requireJavaVersion>
                                            <version>[17,)</version>
                                        </requireJavaVersion>
                                        <requireMavenVersion>
                                            <version>[3.6.0,)</version>
                                        </requireMavenVersion>
                                    </rules>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

### Gradle in CI/CD Pipelines

Gradle offers flexibility and performance benefits for Java builds in CI/CD environments.

#### Sample build.gradle for CI/CD

```groovy
plugins {
    id 'java'
    id 'jacoco'
    id 'org.springframework.boot' version '2.7.5'
    id 'io.spring.dependency-management' version '1.0.15.RELEASE'
    id 'org.sonarqube' version '3.5.0.2730'
    id 'com.google.cloud.tools.jib' version '3.3.1'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    // Project dependencies
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.9.1'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.9.1'
}

test {
    useJUnitPlatform()
    finalizedBy jacocoTestReport
}

// Code coverage configuration
jacoco {
    toolVersion = "0.8.8"
}

jacocoTestReport {
    reports {
        xml.required = true
        html.required = true
    }
}

// Code quality gate
jacocoTestCoverageVerification {
    violationRules {
        rule {
            limit {
                minimum = 0.8
            }
        }
    }
}

// Configure SonarQube
sonarqube {
    properties {
        property 'sonar.projectKey', 'my-project'
        property 'sonar.organization', 'my-organization'
        property 'sonar.host.url', 'https://sonarcloud.io'
    }
}

// Configure Jib for containerization
jib {
    from {
        image = 'eclipse-temurin:17-jre-alpine'
    }
    to {
        image = 'myregistry/myapp'
        tags = ['latest', project.version]
    }
    container {
        jvmFlags = ['-Xms512m', '-Xmx512m']
        ports = ['8080']
    }
}

// CI profile
if (project.hasProperty('ci')) {
    tasks.withType(JavaCompile) {
        options.fork = true
        options.incremental = false
    }
}

// Task for integration tests
task integrationTest(type: Test) {
    description = 'Runs integration tests.'
    group = 'verification'
    
    testClassesDirs = sourceSets.test.output.classesDirs
    classpath = sourceSets.test.runtimeClasspath
    
    useJUnitPlatform {
        includeTags 'integration'
    }
    
    shouldRunAfter test
}

check.dependsOn integrationTest
```

## Testing in Java CI/CD Pipelines

### Test Automation Strategy

A comprehensive testing strategy for Java applications includes:

1. **Unit tests**: Test individual components in isolation
2. **Integration tests**: Test component interactions
3. **End-to-end tests**: Test complete application flows
4. **Performance tests**: Assess application performance

#### Test Organization

```
src/
├── main/java/
│   └── com/example/app/
│       ├── controllers/
│       ├── services/
│       └── repositories/
└── test/java/
    └── com/example/app/
        ├── unit/
        │   ├── controllers/
        │   ├── services/
        │   └── repositories/
        ├── integration/
        │   ├── api/
        │   └── persistence/
        └── e2e/
            └── scenarios/
```

### Parallel Test Execution

Running tests in parallel can significantly speed up the CI/CD pipeline.

#### Maven Configuration for Parallel Tests

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.0.0-M7</version>
    <configuration>
        <parallel>classes</parallel>
        <threadCount>4</threadCount>
        <perCoreThreadCount>true</perCoreThreadCount>
    </configuration>
</plugin>
```

#### Gradle Configuration for Parallel Tests

```groovy
test {
    maxParallelForks = Runtime.runtime.availableProcessors().intdiv(2) ?: 1
}
```

### Test Containers for Integration Testing

TestContainers provides lightweight, throwaway instances of databases, message brokers, or web browsers for integration testing.

```java
@Testcontainers
@SpringBootTest
class DatabaseIntegrationTest {

    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldSaveAndRetrieveUser() {
        // Test using real Postgres database
        User user = new User("test@example.com", "Test User");
        userRepository.save(user);
        
        Optional<User> retrieved = userRepository.findById(user.getId());
        assertTrue(retrieved.isPresent());
        assertEquals("Test User", retrieved.get().getName());
    }
}
```

## Quality Gates in Java CI/CD Pipelines

### SonarQube Integration

SonarQube provides code quality and security analysis for Java applications.

#### SonarQube Quality Gate Configuration

Create a quality gate in SonarQube that fails the build if:
- Code coverage is below 80%
- More than 5 critical issues found
- Technical debt ratio above 5%

Jenkins integration with SonarQube quality gate:
```groovy
stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {
            sh 'mvn sonar:sonar'
        }
    }
}

stage('Quality Gate') {
    steps {
        timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
        }
    }
}
```

### OWASP Dependency-Check

Security scanning for Java dependencies.

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>7.3.0</version>
    <configuration>
        <failBuildOnCVSS>7</failBuildOnCVSS>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

## Deployment Strategies for Java Applications

### Blue-Green Deployment

Blue-green deployment involves maintaining two identical production environments, only one of which handles production traffic at any time.

```yaml
# Kubernetes implementation of blue-green deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 0  # Initially zero replicas
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: myapp:1.1.0  # New version
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
    version: blue  # Initially pointing to blue
  ports:
  - port: 80
    targetPort: 8080
```

Jenkins stage for blue-green deployment:
```groovy
stage('Deploy Green Environment') {
    steps {
        // Scale up green deployment with new version
        sh 'kubectl scale deployment myapp-green --replicas=3'
        
        // Wait for green deployment to be ready
        sh 'kubectl rollout status deployment/myapp-green'
        
        // Run smoke tests against green environment
        sh './smoke-test.sh $(kubectl get service myapp-green-test -o jsonpath="{.status.loadBalancer.ingress[0].ip}")'
        
        // Switch traffic to green deployment
        sh 'kubectl patch service myapp-service -p \'{"spec":{"selector":{"version":"green"}}}\''
        
        // Scale down blue deployment
        sh 'kubectl scale deployment myapp-blue --replicas=0'
    }
}
```

### Canary Deployment

Canary deployment involves gradually routing traffic to the new version.

```yaml
# Kubernetes implementation of canary deployment
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "20"
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-new
            port:
              number: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress-main
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-stable
            port:
              number: 80
```

## CI/CD Pipeline Notifications

### Slack Integration

Jenkins pipeline with Slack notifications:
```groovy
post {
    success {
        slackSend channel: '#deployments',
                  color: 'good',
                  message: "Build succeeded: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
    }
    failure {
        slackSend channel: '#deployments',
                  color: 'danger',
                  message: "Build failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
    }
}
```

GitHub Actions with Slack notifications:
```yaml
- name: Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow,job,took
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

## Best Practices for Java CI/CD Pipelines

1. **Use Maven/Gradle Wrappers**: Ensure build consistency across environments using `mvnw` or `gradlew`

2. **Cache Dependencies**: Speed up builds by caching Maven/Gradle dependencies

3. **Implement Proper Versioning**: Use semantic versioning for artifacts and container images

4. **Pin Dependencies**: Specify exact versions to ensure reproducible builds

5. **Optimize JVM Parameters**: Configure JVM settings for faster builds:
   ```bash
   export MAVEN_OPTS="-Xmx2g -XX:+TieredCompilation -XX:TieredStopAtLevel=1"
   ```

6. **Implement Proper Test Segregation**: Separate unit, integration, and end-to-end tests

7. **Keep Sensitive Data Secure**: Use secrets management for credentials and tokens

8. **Implement Feature Flags**: Decouple deployment from feature release

9. **Build Once, Deploy Multiple Times**: Create artifacts once and promote them through environments

10. **Set Up Monitoring and Alerting**: Monitor pipeline health and performance

## Next Steps

To continue learning about DevOps practices for Java applications, explore:

- [Java Containerization](java-containerization.md)
- [Java App Monitoring](java-app-monitoring.md)
- [Jenkins for Java](jenkins-for-java.md)
- [Java Deployment Strategies](java-deployment-strategies.md)
- [DevSecOps for Java](devsecops-for-java.md)

## References and Resources

- [Jenkins Java Pipeline Examples](https://www.jenkins.io/doc/pipeline/examples/)
- [GitHub Actions for Java CI](https://docs.github.com/en/actions/language-and-framework-guides/building-and-testing-java-with-maven)
- [Spring Boot CI/CD Best Practices](https://spring.io/guides/topicals/spring-boot-docker)
- [Google Cloud - CI/CD for Java Applications](https://cloud.google.com/java/docs/ci-cd)
- [SonarQube Java Analysis](https://docs.sonarqube.org/latest/analyzing-source-code/languages/java/)
- [Maven CI Friendly Versions](https://maven.apache.org/maven-ci-friendly.html)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/) 