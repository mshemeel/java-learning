# DevSecOps for Java

## Overview
This guide covers DevSecOps practices specifically tailored for Java applications. DevSecOps integrates security throughout the software development lifecycle (SDLC), creating a culture where security is everyone's responsibility. We'll explore tools, techniques, and best practices for implementing security at every stage of Java application development and deployment.

## Prerequisites
- Understanding of [CI/CD fundamentals](ci-cd-fundamentals.md)
- Familiarity with Java development and build tools
- Basic knowledge of [containerization](docker-fundamentals.md)
- Understanding of application security concepts

## Learning Objectives
- Understand the principles of DevSecOps in Java development
- Implement security scanning in Java build pipelines
- Identify and fix common security vulnerabilities in Java code
- Secure Java application configuration and dependencies
- Implement container security for Java applications
- Set up runtime protection for Java deployments
- Automate security testing in CI/CD pipelines

## DevSecOps Principles for Java Applications

### Shifting Security Left

DevSecOps emphasizes "shifting security left" in the development lifecycle:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                        Java DevSecOps Pipeline                                 │
└───────────────────────────────────────────────────────────────────────────────┘
    │            │             │             │             │             │
    ▼            ▼             ▼             ▼             ▼             ▼
┌─────────┐ ┌─────────┐  ┌─────────┐   ┌─────────┐  ┌─────────┐   ┌─────────────┐
│   Plan   │ │   Code  │  │  Build  │   │   Test  │  │ Release │   │   Deploy    │
│          │ │         │  │         │   │         │  │         │   │             │
└─────────┘ └─────────┘  └─────────┘   └─────────┘  └─────────┘   └─────────────┘
    │            │             │             │             │             │
    ▼            ▼             ▼             ▼             ▼             ▼
┌─────────┐ ┌─────────┐  ┌─────────┐   ┌─────────┐  ┌─────────┐   ┌─────────────┐
│ Threat   │ │ Secure  │  │SAST, SCA│   │ DAST,   │  │Container│   │Runtime      │
│ Modeling │ │ Coding  │  │ & SBOM  │   │ IAST    │  │Security │   │Protection   │
└─────────┘ └─────────┘  └─────────┘   └─────────┘  └─────────┘   └─────────────┘
```

### Security as Code

DevSecOps treats security as code, automating security checks and enforcement through:

- Infrastructure as Code (IaC) security scanning
- Policy as Code with tools like Open Policy Agent
- Compliance as Code for regulatory requirements

### Key Benefits for Java Development

- **Early Detection**: Identify vulnerabilities before they reach production
- **Developer Enablement**: Provide developers with security tools and knowledge
- **Consistency**: Apply the same security standards across all environments
- **Compliance**: Meet regulatory requirements through automated checks
- **Speed**: Accelerate development by fixing security issues earlier

## Secure Coding Practices for Java

### Java-Specific Secure Coding Guidelines

1. **Input Validation**:
   ```java
   // UNSAFE - SQL Injection vulnerability
   String query = "SELECT * FROM users WHERE username = '" + username + "'";

   // SAFE - Using Prepared Statements
   String query = "SELECT * FROM users WHERE username = ?";
   PreparedStatement stmt = connection.prepareStatement(query);
   stmt.setString(1, username);
   ```

2. **Output Encoding**:
   ```java
   // UNSAFE - XSS vulnerability
   response.getWriter().println("<p>Welcome, " + username + "</p>");

   // SAFE - Using encoding
   response.getWriter().println("<p>Welcome, " + 
       StringEscapeUtils.escapeHtml4(username) + "</p>");
   ```

3. **Secure Authentication**:
   ```java
   // UNSAFE - Weak password hashing
   String hashedPassword = DigestUtils.md5Hex(password);

   // SAFE - Strong password hashing with Argon2
   String hashedPassword = Argon2Factory.create()
       .hash(10, 65536, 1, password.toCharArray());
   ```

4. **Secure Session Management**:
   ```java
   // Configure secure session attributes
   @Configuration
   public class SessionConfig {
       @Bean
       public CookieSerializer cookieSerializer() {
           DefaultCookieSerializer serializer = new DefaultCookieSerializer();
           serializer.setCookieName("SESSIONID");
           serializer.setCookiePath("/");
           serializer.setCookieMaxAge(3600);
           serializer.setCookieHttpOnly(true);
           serializer.setCookieSecure(true); // HTTPS only
           serializer.setSameSite("Lax");
           return serializer;
       }
   }
   ```

5. **Access Control**:
   ```java
   // Spring Security configuration example
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig {
       @Bean
       public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
           http
               .authorizeHttpRequests((authz) -> authz
                   .requestMatchers("/api/public/**").permitAll()
                   .requestMatchers("/api/user/**").hasRole("USER")
                   .requestMatchers("/api/admin/**").hasRole("ADMIN")
                   .anyRequest().authenticated()
               )
               .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
               .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
           return http.build();
       }
   }
   ```

6. **Secure File Handling**:
   ```java
   // UNSAFE - Path traversal vulnerability
   File file = new File(basePath + userProvidedFilename);

   // SAFE - Validate and normalize path
   Path requestedPath = Paths.get(basePath, userProvidedFilename).normalize();
   if (!requestedPath.startsWith(Paths.get(basePath).normalize())) {
       throw new SecurityException("Path traversal attempt detected");
   }
   ```

7. **Java Cryptography**:
   ```java
   // UNSAFE - Using weak encryption
   Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");

   // SAFE - Using strong encryption
   Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
   SecureRandom random = new SecureRandom();
   byte[] iv = new byte[12]; // 96 bits
   random.nextBytes(iv);
   GCMParameterSpec spec = new GCMParameterSpec(128, iv);
   cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);
   ```

### Java Security Frameworks and Libraries

- **Spring Security**: Comprehensive security framework for Java applications
- **OWASP Java Encoder**: For proper output encoding
- **Java JWT (jjwt)**: For secure token-based authentication
- **Passay**: For password policy enforcement
- **Bouncy Castle**: For cryptographic operations

## Security Testing in Java CI/CD Pipelines

### Static Application Security Testing (SAST)

SAST analyzes your source code to find security vulnerabilities.

#### SpotBugs with Find Security Bugs

Maven configuration:
```xml
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <version>4.7.3.0</version>
    <dependencies>
        <dependency>
            <groupId>com.h3xstream.findsecbugs</groupId>
            <artifactId>findsecbugs-plugin</artifactId>
            <version>1.12.0</version>
        </dependency>
    </dependencies>
    <configuration>
        <plugins>
            <plugin>
                <groupId>com.h3xstream.findsecbugs</groupId>
                <artifactId>findsecbugs-plugin</artifactId>
                <version>1.12.0</version>
            </plugin>
        </plugins>
    </configuration>
</plugin>
```

#### SonarQube for Java

Maven configuration:
```xml
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.9.1.2184</version>
</plugin>
```

Jenkins pipeline integration:
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

### Software Composition Analysis (SCA)

SCA identifies vulnerabilities in third-party components and dependencies.

#### OWASP Dependency Check

Maven configuration:
```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>7.4.4</version>
    <configuration>
        <formats>
            <format>HTML</format>
            <format>XML</format>
            <format>JSON</format>
        </formats>
        <failBuildOnCVSS>7</failBuildOnCVSS>
    </configuration>
</plugin>
```

Jenkins pipeline integration:
```groovy
stage('Dependency Check') {
    steps {
        sh 'mvn org.owasp:dependency-check-maven:check'
    }
    post {
        always {
            dependencyCheckPublisher pattern: 'target/dependency-check-report.xml'
        }
    }
}
```

#### Snyk for Java Dependencies

GitHub Actions integration:
```yaml
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/maven@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

### Dynamic Application Security Testing (DAST)

DAST tests running applications by simulating attacks.

#### OWASP ZAP Integration

Jenkins pipeline:
```groovy
stage('DAST Scanning') {
    steps {
        sh '''
            docker run -t owasp/zap2docker-stable zap-baseline.py \
                -t https://target-application-url \
                -r zap-report.html
        '''
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true, 
                keepAll: true, 
                reportDir: '.', 
                reportFiles: 'zap-report.html', 
                reportName: 'ZAP Report'
            ])
        }
    }
}
```

### Interactive Application Security Testing (IAST)

IAST analyzes code during runtime, detecting vulnerabilities as the application runs.

#### Contrast Security integration with Spring Boot:

Add the Contrast agent to your Java application:
```bash
java -javaagent:/path/to/contrast.jar \
     -Dcontrast.server.name=MyServer \
     -Dcontrast.server.environment=development \
     -jar myapplication.jar
```

Maven configuration:
```xml
<plugin>
    <groupId>com.contrastsecurity</groupId>
    <artifactId>contrast-maven-plugin</artifactId>
    <version>2.8</version>
    <executions>
        <execution>
            <id>verify-contrast</id>
            <phase>verify</phase>
            <goals>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <apiKey>your_api_key</apiKey>
        <serviceKey>your_service_key</serviceKey>
        <apiUrl>https://app.contrastsecurity.com/Contrast</apiUrl>
        <orgUuid>your_org_id</orgUuid>
        <appName>MyApp</appName>
        <serverName>MyServer</serverName>
        <minSeverity>Medium</minSeverity>
    </configuration>
</plugin>
```

## Software Bill of Materials (SBOM) for Java

A Software Bill of Materials (SBOM) catalogs all components in your application.

### Generating SBOM with CycloneDX

Maven configuration:
```xml
<plugin>
    <groupId>org.cyclonedx</groupId>
    <artifactId>cyclonedx-maven-plugin</artifactId>
    <version>2.7.4</version>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>makeAggregateBom</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <projectType>application</projectType>
        <schemaVersion>1.4</schemaVersion>
        <includeBomSerialNumber>true</includeBomSerialNumber>
        <includeCompileScope>true</includeCompileScope>
        <includeProvidedScope>true</includeProvidedScope>
        <includeRuntimeScope>true</includeRuntimeScope>
        <includeSystemScope>true</includeSystemScope>
        <includeTestScope>false</includeTestScope>
        <includeLicenseText>false</includeLicenseText>
        <outputFormat>all</outputFormat>
    </configuration>
</plugin>
```

Jenkins pipeline integration:
```groovy
stage('Generate SBOM') {
    steps {
        sh 'mvn org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom'
        archiveArtifacts artifacts: 'target/bom.json', fingerprint: true
    }
}
```

## Secure Java Configuration Management

### Externalized Configuration with Spring Boot

```java
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {
    private String apiKey;
    private boolean enableSecureMode;
    private List<String> authorizedDomains;

    // Getters and setters
}
```

Secure configuration in properties files:
```properties
# Don't store sensitive values directly in properties files
app.security.api-key=${API_KEY:default_dev_key}
app.security.enable-secure-mode=true
app.security.authorized-domains=example.com,trusted-domain.org
```

### Managing Secrets with Vault

Setup HashiCorp Vault for Spring Boot applications:

Maven dependency:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
```

Configuration in `bootstrap.yml`:
```yaml
spring:
  cloud:
    vault:
      host: vault.example.com
      port: 8200
      scheme: https
      authentication: TOKEN
      token: ${VAULT_TOKEN}
      kv:
        enabled: true
        backend: secret
        default-context: application
        profiles:
          - development
          - production
```

Accessing secrets in code:
```java
@Autowired
private VaultOperations vaultOperations;

public String getDatabasePassword() {
    VaultResponse response = vaultOperations.read("secret/database");
    return (String) response.getData().get("password");
}
```

## Container Security for Java Applications

### Secure Docker Images for Java

Best practices for Java Docker images:

```dockerfile
# Use a specific version of a minimal JRE image
FROM eclipse-temurin:17-jre-alpine

# Create a non-root user to run the application
RUN addgroup -S javauser && adduser -S -G javauser javauser

# Set working directory owned by non-root user
WORKDIR /app
RUN chown -R javauser:javauser /app

# Copy the application JAR file
COPY --chown=javauser:javauser target/app.jar app.jar

# Configure JVM options for security
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/urandom"

# Expose only necessary ports
EXPOSE 8080

# Switch to non-root user
USER javauser

# Set the entrypoint
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Container Scanning

Scan Docker images for vulnerabilities:

```groovy
stage('Container Security Scan') {
    steps {
        sh 'docker build -t myapp:${BUILD_ID} .'
        
        // Trivy scan
        sh '''
            docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v $PWD:/output \
            aquasec/trivy image \
            --format json \
            --output /output/trivy-report.json \
            --severity HIGH,CRITICAL \
            myapp:${BUILD_ID}
        '''
    }
    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
        }
    }
}
```

### Runtime Container Security

Enforcing security policies with Open Policy Agent (OPA) and Gatekeeper:

```yaml
# Example Gatekeeper policy to require non-root user
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequireNonRootUser
metadata:
  name: require-non-root-user
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    namespaces:
      - "default"
      - "java-apps"
  parameters:
    runAsUser:
      rule: "must not be root"
```

## Runtime Protection for Java Applications

### Java Security Manager

Configure the Java Security Manager with custom policies:

```
// java.policy
grant codeBase "file:/app/application.jar" {
    permission java.net.SocketPermission "localhost:8000-9000", "connect,resolve";
    permission java.io.FilePermission "/app/data/-", "read,write";
    permission java.util.PropertyPermission "user.home", "read";
};
```

Start the application with Security Manager:
```bash
java -Djava.security.manager -Djava.security.policy=/path/to/java.policy -jar app.jar
```

### Runtime Application Self-Protection (RASP)

Integrate RASP with Spring Boot:

```xml
<dependency>
    <groupId>com.example.security</groupId>
    <artifactId>rasp-agent</artifactId>
    <version>1.2.3</version>
</dependency>
```

Java agent configuration:
```bash
java -javaagent:/path/to/rasp-agent.jar \
     -Drasp.config.file=/path/to/rasp-config.yaml \
     -jar myapplication.jar
```

### Implementing Rate Limiting

Using Spring Cloud Gateway for rate limiting:

```java
@Configuration
public class RateLimiterConfig {
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            Optional.ofNullable(exchange.getRequest().getHeaders().getFirst("X-API-KEY"))
                   .orElse("anonymous")
        );
    }
}
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: protected-api
          uri: http://localhost:8081
          predicates:
            - Path=/api/**
          filters:
            - name: RequestRateLimiter
              args:
                key-resolver: "#{@userKeyResolver}"
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

## Security Monitoring and Incident Response

### Logging for Security Events

Configure Log4j2 securely:

```xml
<Configuration status="WARN">
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
    <RollingFile name="SecurityEvents" 
                 fileName="logs/security.log"
                 filePattern="logs/security-%d{yyyy-MM-dd}-%i.log.gz">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
      <Policies>
        <SizeBasedTriggeringPolicy size="10 MB"/>
      </Policies>
      <DefaultRolloverStrategy max="20"/>
    </RollingFile>
  </Appenders>
  <Loggers>
    <Logger name="org.springframework.security" level="info" additivity="false">
      <AppenderRef ref="SecurityEvents"/>
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="com.example.security" level="debug" additivity="false">
      <AppenderRef ref="SecurityEvents"/>
      <AppenderRef ref="Console"/>
    </Logger>
    <Root level="error">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

Security event logging in code:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SecurityEventLogger {
    private static final Logger securityLogger = LoggerFactory.getLogger("com.example.security");
    
    public void logAuthenticationSuccess(String username) {
        securityLogger.info("Authentication success for user: {}", username);
    }
    
    public void logAuthenticationFailure(String username, String reason) {
        securityLogger.warn("Authentication failure for user: {}. Reason: {}", username, reason);
    }
    
    public void logAuthorizationFailure(String username, String resource) {
        securityLogger.warn("Authorization failure for user: {} attempting to access: {}", 
                           username, resource);
    }
    
    public void logSecurityEvent(String eventType, Map<String, Object> details) {
        securityLogger.info("Security event: {}. Details: {}", eventType, details);
    }
}
```

### Integrating with Security Information and Event Management (SIEM)

Forward Java application logs to a SIEM system using Logstash:

```yaml
# logstash.conf
input {
  file {
    path => "/path/to/logs/security.log"
    type => "security_log"
    start_position => "beginning"
  }
}

filter {
  if [type] == "security_log" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} \[%{NOTSPACE:thread}\] %{LOGLEVEL:log_level} %{JAVACLASS:logger} - %{GREEDYDATA:message}" }
    }
    date {
      match => [ "timestamp", "yyyy-MM-dd HH:mm:ss,SSS" ]
      target => "@timestamp"
    }
    if [message] =~ "Authentication failure" {
      mutate {
        add_tag => [ "authentication_failure" ]
      }
    }
  }
}

output {
  if [type] == "security_log" {
    elasticsearch {
      hosts => ["elasticsearch:9200"]
      index => "java-security-logs-%{+YYYY.MM.dd}"
    }
  }
}
```

## DevSecOps Tools and Integrations for Java

### Security Tools Matrix for Java Applications

| Category | Tool | Purpose | Integration |
|----------|------|---------|------------|
| SAST | SonarQube | Static code analysis | Maven, Gradle, Jenkins, GitHub Actions |
| SAST | SpotBugs + FindSecBugs | Java-specific security bugs | Maven, Gradle, Jenkins |
| SCA | OWASP Dependency Check | Detect vulnerable dependencies | Maven, Gradle, Jenkins |
| SCA | Snyk | Dependency scanning | CLI, Maven, Gradle, GitHub |
| DAST | OWASP ZAP | Dynamic security testing | Jenkins, GitLab CI, Docker |
| IAST | Contrast Security | Runtime security testing | JVM agent, Maven |
| Container | Trivy | Image scanning | CLI, CI/CD, Kubernetes |
| Container | Clair | Image vulnerability scanning | CI/CD, Registry integration |
| Runtime | Spring Security | Application security framework | Spring Boot |
| Runtime | OpenRASP | RASP protection | JVM agent |
| Secrets | HashiCorp Vault | Secrets management | Spring Cloud Vault |
| Compliance | InSpec | Compliance as code | CLI, CI/CD |

### GitHub Security Features for Java

Configure security scanning with GitHub:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Build with Maven
        run: mvn -B compile
        
      - name: Run SpotBugs
        run: mvn spotbugs:check
        
      - name: Run OWASP Dependency Check
        run: mvn org.owasp:dependency-check-maven:check
        
      - name: Upload dependency check report
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: target/dependency-check-report.html
          
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myorg/java-app:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## Implementing DevSecOps in Java Projects

### Security Requirements and Threat Modeling

Create security user stories in your backlog:

```
As a security engineer, I want to ensure that all user inputs are validated
to prevent injection attacks.

Acceptance Criteria:
- All controller endpoints validate input parameters
- Special characters are properly sanitized
- Invalid inputs return appropriate error messages without leaking information
- Unit tests verify validation logic
```

Use a threat modeling template for Java applications:

```markdown
## Threat Model: User Authentication Service

### Assets
- User credentials
- Session tokens
- Personal user data

### Entry Points
- /api/auth/login endpoint
- /api/auth/register endpoint
- Password reset functionality

### Threats
1. **Brute Force Attacks**
   - Implement account lockout after failed attempts
   - Use CAPTCHA for login attempts

2. **Credential Interception**
   - Use HTTPS for all communications
   - Implement HTTP Strict Transport Security

3. **Session Hijacking**
   - Use secure, HttpOnly, SameSite cookies
   - Regenerate session IDs after authentication

4. **SQL Injection in Login Form**
   - Use parameterized queries
   - Implement input validation

### Security Controls
- Spring Security configuration
- Rate limiting on auth endpoints
- Password entropy requirements
- Multi-factor authentication for admin accounts
```

### Security Champions Program

Establish security champions within development teams:

1. **Identify Champions**: Select developers interested in security
2. **Train Champions**: Provide specialized Java security training
3. **Define Responsibilities**:
   - Code review for security issues
   - Security testing integration
   - Security documentation
   - Knowledge sharing sessions
4. **Support Champions**:
   - Allocate time for security activities
   - Provide access to security tools and resources
   - Regular meetings with security team

### Security Gates in CI/CD

Implement quality gates that prevent insecure code from being deployed:

```groovy
pipeline {
    agent any
    
    stages {
        // ... build stages ...
        
        stage('Security Gates') {
            parallel {
                stage('SAST Gate') {
                    steps {
                        sh 'mvn spotbugs:check'
                    }
                }
                
                stage('SCA Gate') {
                    steps {
                        sh 'mvn org.owasp:dependency-check-maven:check'
                        script {
                            def vulnerabilities = readFile('target/dependency-check-report.xml')
                            if (vulnerabilities.contains('severity="HIGH"') || 
                                vulnerabilities.contains('severity="CRITICAL"')) {
                                error "High or critical vulnerabilities found!"
                            }
                        }
                    }
                }
                
                stage('Secrets Scan') {
                    steps {
                        sh 'git secrets --scan'
                    }
                }
            }
        }
        
        // ... deployment stages ...
    }
}
```

## Conclusion

Implementing DevSecOps in Java applications requires a combination of secure coding practices, automated security testing, and runtime protection measures. By integrating security throughout the SDLC and treating security requirements as first-class citizens, development teams can build robust, secure Java applications while maintaining development velocity.

The tools, practices, and patterns described in this guide provide a starting point for embedding security into your Java development workflow, creating a DevSecOps culture that produces more secure applications.

## References

- [OWASP Java Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/index.html)
- [NIST Secure Software Development Framework](https://csrc.nist.gov/Projects/ssdf)
- [OWASP Top 10 for Java](https://owasp.org/www-project-top-ten/)
- [SANS Software Security](https://www.sans.org/software-security/)
- [DevSecOps: Injecting Security into DevOps](https://www.redhat.com/en/topics/devops/what-is-devsecops)
- [CycloneDX SBOM Specification](https://cyclonedx.org/)
- [Contrast Security Java Agent](https://docs.contrastsecurity.com/en/java.html)
- [HashiCorp Vault Documentation](https://www.vaultproject.io/docs) 