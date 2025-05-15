# Jenkins for Java

## Overview
This guide provides a comprehensive overview of using Jenkins for Java application build, test, and deployment automation. Jenkins is a leading open-source automation server that integrates seamlessly with Java ecosystems, offering powerful capabilities for continuous integration and continuous delivery of Java applications.

## Prerequisites
- Basic understanding of [CI/CD fundamentals](ci-cd-fundamentals.md)
- Familiarity with Java build tools (Maven or Gradle)
- Basic knowledge of version control systems (Git)
- General understanding of Java application structure

## Learning Objectives
- Install and configure Jenkins for Java application development
- Set up Jenkins pipelines for Java projects
- Configure Java-specific build tools and plugins in Jenkins
- Implement test automation for Java applications
- Deploy Java applications using Jenkins
- Integrate code quality tools into Jenkins pipelines
- Implement advanced Jenkins pipeline patterns for Java projects

## Jenkins Installation and Setup

### Installing Jenkins
Jenkins can be installed on various platforms. Here's how to install Jenkins with Java support:

```bash
# Install Jenkins on Ubuntu
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Configuring Java in Jenkins
Once Jenkins is installed, configure it to use the right JDK versions:

1. Navigate to "Manage Jenkins" > "Global Tool Configuration"
2. In the JDK section, click "Add JDK"
3. Fill in the details:
   - Name: `JDK 17`
   - Check "Install automatically" (or specify path to manual installation)
   - Select installation from Oracle or adoptium.net

### Essential Jenkins Plugins for Java Development

Install these essential plugins for Java development:

- **Maven Integration**: For integrating Maven builds
- **Gradle Plugin**: For Gradle build integration
- **JUnit Plugin**: For test result reporting
- **JaCoCo Plugin**: For code coverage reports
- **SonarQube Scanner**: For code quality analysis
- **Docker Pipeline**: For containerization of Java apps
- **Pipeline**: For implementing pipeline as code
- **Blue Ocean**: For improved visualization of pipelines

Installation steps:
1. Go to "Manage Jenkins" > "Manage Plugins"
2. Navigate to the "Available" tab
3. Search for the plugins listed above
4. Check the plugins you want to install
5. Click "Install without restart" or "Download now and install after restart"

## Configuring Build Tools

### Maven Configuration

Configure Maven in Jenkins for Java builds:

1. Go to "Manage Jenkins" > "Global Tool Configuration"
2. In the Maven section, click "Add Maven"
3. Fill in:
   - Name: `Maven 3.8.6`
   - Check "Install automatically"
   - Select version "3.8.6" (or your preferred version)
4. Save the configuration

### Gradle Configuration

Configure Gradle similarly:

1. Go to "Manage Jenkins" > "Global Tool Configuration"
2. In the Gradle section, click "Add Gradle"
3. Fill in:
   - Name: `Gradle 7.5.1`
   - Check "Install automatically"
   - Select version "7.5.1" (or your preferred version)
4. Save the configuration

## Jenkins Pipeline for Java Projects

### Basic Jenkinsfile for Java Maven Project

Here's a basic Jenkinsfile for a Java Maven project:

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.6'
        jdk 'JDK 17'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Advanced Jenkinsfile with Code Quality and Deployment

A more advanced pipeline with code quality checks and deployment:

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.6'
        jdk 'JDK 17'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: 'target/jacoco.exec',
                        classPattern: 'target/classes',
                        sourcePattern: 'src/main/java',
                        exclusionPattern: 'src/test*'
                    )
                }
            }
        }
        
        stage('Code Analysis') {
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
        
        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def appVersion = sh(script: 'mvn help:evaluate -Dexpression=project.version -q -DforceStdout', returnStdout: true).trim()
                    docker.build("my-java-app:${appVersion}", ".")
                }
            }
        }
        
        stage('Deploy to Dev') {
            steps {
                script {
                    // Deploy to dev environment
                    sh 'echo "Deploying to dev environment..."'
                    // Add deployment commands here
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'mvn failsafe:integration-test'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?'
                script {
                    // Deploy to production environment
                    sh 'echo "Deploying to production environment..."'
                    // Add production deployment commands here
                }
            }
        }
    }
    
    post {
        success {
            // Notify on success
            echo 'Build succeeded!'
        }
        failure {
            // Notify on failure
            echo 'Build failed!'
        }
        always {
            cleanWs()
        }
    }
}
```

## Spring Boot-Specific Configuration

### Building and Testing Spring Boot Applications

For Spring Boot applications, add this section to your Jenkinsfile:

```groovy
stage('Build Spring Boot Application') {
    steps {
        sh 'mvn spring-boot:run -Dspring-boot.run.fork=true -Dspring-boot.run.jvmArguments="-Dserver.port=8081"'
        sh 'mvn spring-boot:stop'
    }
}
```

### Building Executable JARs and Docker Images

For Spring Boot's executable JAR deployment:

```groovy
stage('Package Spring Boot App') {
    steps {
        sh 'mvn package spring-boot:repackage -DskipTests'
        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
        
        script {
            def appVersion = sh(script: 'mvn help:evaluate -Dexpression=project.version -q -DforceStdout', returnStdout: true).trim()
            docker.build("spring-app:${appVersion}", ".")
        }
    }
}
```

Example Dockerfile for Spring Boot:

```dockerfile
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Distributed Builds with Jenkins Agents

### Setting Up Java Build Agents

For larger Java projects, multiple build agents improve performance:

1. Go to "Manage Jenkins" > "Manage Nodes and Clouds"
2. Click "New Node"
3. Enter a node name and select "Permanent Agent"
4. Configure the node:
   - Number of executors: `2`
   - Remote root directory: `/var/jenkins`
   - Labels: `java maven`
   - Launch method: Choose appropriate option
   - Configure launch method details

Then in your Jenkinsfile:

```groovy
pipeline {
    agent {
        label 'java maven'
    }
    
    // Pipeline stages
}
```

## Maven Repository Integration

### Configuring Artifact Repositories

Integrate with artifact repositories like Nexus or Artifactory:

1. Add repository credentials to Jenkins:
   - Go to "Manage Jenkins" > "Manage Credentials"
   - Add username/password credentials for your repository

2. Add this to your Jenkinsfile:

```groovy
stage('Publish to Artifact Repository') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
            sh '''
            mvn deploy \
              -Dmaven.test.skip=true \
              -DaltDeploymentRepository=nexus::default::http://nexus-url/repository/maven-releases/ \
              -DrepositoryId=nexus \
              -Dnexus.username=$NEXUS_USER \
              -Dnexus.password=$NEXUS_PASS
            '''
        }
    }
}
```

## Testing Strategies in Jenkins

### Unit Test Integration

Configure JUnit reporting:

```groovy
stage('Unit Tests') {
    steps {
        sh 'mvn test'
    }
    post {
        always {
            junit '**/target/surefire-reports/*.xml'
        }
    }
}
```

### Integration Testing

Set up integration tests:

```groovy
stage('Integration Tests') {
    steps {
        sh 'mvn failsafe:integration-test'
    }
    post {
        always {
            junit '**/target/failsafe-reports/*.xml'
        }
    }
}
```

### Test Reporting and Dashboards

Use the JUnit and TestNG plugins to generate test reports.

Configure test result trends:

1. Go to your project
2. Click "Configure"
3. Enable "Publish JUnit test result report"
4. Set "Test report XMLs" to `**/target/surefire-reports/*.xml, **/target/failsafe-reports/*.xml`

## Security in Jenkins Pipelines

### Managing Java Credentials

Store Java-related credentials securely:

```groovy
withCredentials([
    usernamePassword(credentialsId: 'database-creds', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS'),
    file(credentialsId: 'keystore', variable: 'KEYSTORE_FILE')
]) {
    sh 'java -jar app.jar --spring.datasource.username=$DB_USER --spring.datasource.password=$DB_PASS --server.ssl.key-store=$KEYSTORE_FILE'
}
```

### Dependency Scanning

Scan Java dependencies for vulnerabilities:

```groovy
stage('Dependency Check') {
    steps {
        sh 'mvn org.owasp:dependency-check-maven:check'
    }
    post {
        always {
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'target/dependency-check-report',
                reportFiles: 'dependency-check-report.html',
                reportName: 'Dependency Check Report'
            ])
        }
    }
}
```

## Java Performance Testing

Set up performance testing with JMeter:

```groovy
stage('Performance Tests') {
    steps {
        sh 'mvn verify -Pperformance'
    }
    post {
        always {
            perfReport sourceDataFiles: 'target/jmeter/results/*.jtl'
        }
    }
}
```

Maven profile for JMeter:

```xml
<profile>
    <id>performance</id>
    <build>
        <plugins>
            <plugin>
                <groupId>com.lazerycode.jmeter</groupId>
                <artifactId>jmeter-maven-plugin</artifactId>
                <version>3.5.0</version>
                <executions>
                    <execution>
                        <id>jmeter-tests</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>jmeter</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <testFilesDirectory>${project.basedir}/src/test/jmeter</testFilesDirectory>
                    <resultsDirectory>${project.build.directory}/jmeter/results</resultsDirectory>
                </configuration>
            </plugin>
        </plugins>
    </build>
</profile>
```

## Best Practices for Jenkins with Java

### Pipeline Structure
- Use declarative pipelines for clarity
- Structure stages logically following the build lifecycle
- Implement proper error handling for Java builds
- Use shared libraries for common Java build patterns

### Performance Optimization
- Use Jenkins Pipeline caching for Maven/Gradle repositories
- Parallelize test execution where possible
- Use ephemeral agents with pre-configured Java environments
- Implement incremental builds for large Java projects

### Shared Libraries
Create shared pipeline libraries for common Java build steps:

```groovy
// vars/javaBuilder.groovy
def call(Map config) {
    def jdkVersion = config.jdkVersion ?: '17'
    def mavenGoals = config.mavenGoals ?: 'clean verify'
    
    sh "echo 'Building with JDK ${jdkVersion}'"
    sh "mvn ${mavenGoals}"
}
```

Usage in Jenkinsfile:

```groovy
@Library('my-jenkins-shared-library') _

pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                javaBuilder jdkVersion: '17', mavenGoals: 'clean package'
            }
        }
    }
}
```

## Troubleshooting Common Jenkins Issues in Java Projects

### Maven/Gradle Build Failures
- Check Java version compatibility
- Validate Maven/Gradle wrapper configuration
- Review dependency management for conflicts
- Ensure correct tools configuration in Jenkins

### Memory Issues
For Java applications with memory problems:

```groovy
stage('Run with Memory Settings') {
    steps {
        sh 'MAVEN_OPTS="-Xmx1024m -XX:MaxMetaspaceSize=512m" mvn verify'
    }
}
```

### Test Failures
- Configure proper test reporting
- Set up test result visualization
- Implement retry logic for flaky tests:

```groovy
retry(3) {
    sh 'mvn test'
}
```

## Conclusion
Jenkins provides a robust platform for automating Java application builds and deployments. By following the practices outlined in this guide, you can establish effective CI/CD pipelines for your Java projects, leading to more reliable builds, faster feedback, and more efficient delivery of your applications.

## References
- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [Jenkins for Java Projects](https://www.jenkins.io/solutions/java/)
- [Maven Jenkins Plugin](https://plugins.jenkins.io/maven-plugin/)
- [JUnit Jenkins Plugin](https://plugins.jenkins.io/junit/)
- [JaCoCo Plugin](https://plugins.jenkins.io/jacoco/)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/) 