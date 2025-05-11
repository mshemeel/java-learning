# Spring Boot: Getting Started

## Overview
Spring Boot is a powerful framework within the Spring ecosystem that simplifies Java application development by providing a convention-over-configuration approach. It eliminates much of the boilerplate code and configuration required in traditional Spring applications, allowing developers to focus on business logic. Spring Boot combines the extensive functionality of the Spring Framework with opinionated defaults, embedded servers, and auto-configuration to create standalone, production-grade applications with minimal effort.

## Prerequisites
- Basic Java programming knowledge
- Understanding of object-oriented programming concepts
- Familiarity with build tools (Maven/Gradle)
- Basic knowledge of web application concepts
- Understanding of dependency injection and inversion of control principles

## Learning Objectives
- Understand the core features and benefits of Spring Boot
- Set up a Spring Boot development environment
- Create and run a simple Spring Boot application
- Explore Spring Boot project structure and conventions
- Configure Spring Boot applications using properties and YAML
- Understand Spring Boot starters and auto-configuration
- Implement basic RESTful APIs using Spring Boot
- Use Spring Boot DevTools for development productivity
- Package Spring Boot applications for deployment
- Troubleshoot common Spring Boot issues

## Table of Contents
1. [Introduction to Spring Boot](#introduction-to-spring-boot)
2. [Setting Up Development Environment](#setting-up-development-environment)
3. [Creating Your First Spring Boot Application](#creating-your-first-spring-boot-application)
4. [Spring Boot Project Structure](#spring-boot-project-structure)
5. [Spring Boot Starters](#spring-boot-starters)
6. [Auto-Configuration](#auto-configuration)
7. [Configuration Properties](#configuration-properties)
8. [Building a Simple REST API](#building-a-simple-rest-api)
9. [Spring Boot DevTools](#spring-boot-devtools)
10. [Packaging and Running Spring Boot Applications](#packaging-and-running-spring-boot-applications)
11. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
12. [Next Steps](#next-steps)

## Introduction to Spring Boot

### What is Spring Boot?
Spring Boot is a project within the Spring ecosystem designed to simplify the development process of Spring applications. It takes an opinionated view of the Spring platform and third-party libraries, allowing developers to get started with minimal configuration.

### Key Features and Benefits

#### 1. Opinionated Defaults
Spring Boot provides sensible defaults for application configuration, eliminating the need for extensive XML configuration or boilerplate code.

```java
// Traditional Spring configuration required XML files or Java config classes
@Configuration
@EnableWebMvc
@ComponentScan("com.example")
public class AppConfig {
    // Various bean definitions and configurations
}

// With Spring Boot, minimal or no explicit configuration is needed
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 2. Standalone Applications
Spring Boot applications can be run as standalone JAR files with an embedded server, eliminating the need for external application servers.

#### 3. Auto-Configuration
Spring Boot automatically configures your application based on the dependencies on the classpath, reducing boilerplate configuration.

#### 4. Spring Boot Starters
Curated sets of dependencies that simplify the build configuration and provide specific functionality.

#### 5. Production-Ready Features
Built-in metrics, health checks, and externalized configuration for production environments.

### Spring Boot vs. Traditional Spring Framework

| Feature | Traditional Spring | Spring Boot |
|---------|-------------------|-------------|
| Configuration | Extensive XML or Java configuration | Minimal, auto-configured |
| Dependencies | Manual dependency management | Starter dependencies with compatible versions |
| Deployment | WAR files deployed to app servers | Standalone JAR with embedded server |
| Boilerplate | Significant setup code required | Minimized with sensible defaults |
| Server | External application server required | Embedded server (Tomcat, Jetty, Undertow) |
| Production | Manual configuration of monitoring | Built-in actuator with metrics, health checks |

### Spring Boot Version History

Spring Boot follows semantic versioning (MAJOR.MINOR.PATCH):

- **Spring Boot 1.0** (2014): Initial release
- **Spring Boot 1.5**: Improved DevTools, Actuator enhancements
- **Spring Boot 2.0** (2018): Upgraded to Spring Framework 5, Java 8 baseline
- **Spring Boot 2.3**: Improved Docker support, graceful shutdown
- **Spring Boot 2.4**: Configuration data refactoring
- **Spring Boot 2.7**: Current maintenance release
- **Spring Boot 3.0** (2022): Java 17 baseline, Spring Framework 6, Jakarta EE

## Setting Up Development Environment

A proper development environment is essential for efficient Spring Boot development.

### Required Software

1. **Java Development Kit (JDK)**
   - Spring Boot 3.x requires Java 17 or higher
   - Spring Boot 2.x requires Java 8 or higher

2. **Build Tool**
   - Maven (3.6+) or Gradle (7.0+)

3. **Integrated Development Environment (IDE)**
   - Spring Tool Suite (Eclipse-based, tailored for Spring)
   - IntelliJ IDEA
   - Visual Studio Code with Spring Boot extensions

4. **Other Optional Tools**
   - Postman/Insomnia for API testing
   - Git for version control
   - Docker for containerization

### Installation Steps

#### Installing JDK

1. Download JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
2. Set JAVA_HOME environment variable:

```bash
# Linux/macOS
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH

# Windows
set JAVA_HOME=C:\path\to\jdk
set PATH=%JAVA_HOME%\bin;%PATH%
```

3. Verify installation:

```bash
java -version
```

#### Installing Maven

1. Download Maven from [Apache Maven website](https://maven.apache.org/download.cgi)
2. Extract to a directory
3. Set environment variables:

```bash
# Linux/macOS
export M2_HOME=/path/to/maven
export PATH=$M2_HOME/bin:$PATH

# Windows
set M2_HOME=C:\path\to\maven
set PATH=%M2_HOME%\bin;%PATH%
```

4. Verify installation:

```bash
mvn -version
```

#### Installing Gradle

1. Download from [Gradle website](https://gradle.org/install/)
2. Extract to a directory
3. Set environment variables:

```bash
# Linux/macOS
export GRADLE_HOME=/path/to/gradle
export PATH=$GRADLE_HOME/bin:$PATH

# Windows
set GRADLE_HOME=C:\path\to\gradle
set PATH=%GRADLE_HOME%\bin;%PATH%
```

4. Verify installation:

```bash
gradle -version
```

### IDE Setup

#### Spring Tool Suite (STS)

1. Download from [Spring website](https://spring.io/tools)
2. Install by extracting the archive
3. Run the executable

#### IntelliJ IDEA

1. Download from [JetBrains website](https://www.jetbrains.com/idea/download/)
2. Install and run
3. Install Spring plugins:
   - Go to Preferences/Settings → Plugins
   - Search and install "Spring Boot" and "Spring Initializr"

#### Visual Studio Code

1. Install VS Code from [official website](https://code.visualstudio.com/)
2. Install extensions:
   - Spring Boot Extension Pack
   - Java Extension Pack

## Creating Your First Spring Boot Application

Let's create a simple "Hello World" Spring Boot application using different methods.

### Using Spring Initializr Web Interface

1. Navigate to [start.spring.io](https://start.spring.io)
2. Configure your project:
   - Project: Maven/Gradle
   - Language: Java
   - Spring Boot version: Select latest stable
   - Group: com.example
   - Artifact: demo
   - Dependencies: Spring Web
3. Click "Generate" to download the project zip
4. Extract and import into your IDE

### Using Spring Boot CLI

1. Install Spring Boot CLI:

```bash
# Using SDKMAN
sdk install springboot

# Using Homebrew (macOS)
brew tap spring-io/tap
brew install spring-boot
```

2. Create an application:

```bash
spring init --dependencies=web,jpa my-project
```

### Using IDE

#### Spring Tool Suite

1. File → New → Spring Starter Project
2. Configure project details
3. Select dependencies
4. Click Finish

#### IntelliJ IDEA

1. File → New → Project
2. Select Spring Initializr
3. Configure project details
4. Select dependencies
5. Click Next/Finish

### Project Structure Overview

After generating the project, you'll see a structure like:

```
my-project/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── demo/
│   │   │               └── DemoApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── demo/
│                       └── DemoApplicationTests.java
│
├── pom.xml (or build.gradle)
└── README.md
```

### Writing a Hello World Controller

Add a simple REST controller:

```java
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

### Running the Application

#### From IDE

1. Find the main application class with `@SpringBootApplication` annotation
2. Right-click and select "Run"

#### From Command Line

Using Maven:
```bash
./mvnw spring-boot:run
```

Using Gradle:
```bash
./gradlew bootRun
```

#### Testing the Application

Open a web browser or use curl:
```bash
curl http://localhost:8080/hello
```

You should see the output: `Hello, Spring Boot!`

### Understanding the Main Application Class

```java
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

The `@SpringBootApplication` annotation combines:
- `@Configuration`: Tags the class as a source of bean definitions
- `@EnableAutoConfiguration`: Tells Spring Boot to start adding beans based on classpath
- `@ComponentScan`: Tells Spring to scan for components in the current package and subpackages 

## Spring Boot Project Structure

Understanding the standard Spring Boot project structure helps developers navigate and organize their applications efficiently.

### Default Directory Structure

```
my-project/
│
├── src/
│   ├── main/
│   │   ├── java/         # Java source code
│   │   ├── resources/    # Configuration files and resources
│   │   │   ├── static/   # Static web resources (CSS, JS, images)
│   │   │   ├── templates/  # Template files (Thymeleaf, FreeMarker, etc.)
│   │   │   └── application.properties/yml  # Application configuration
│   │   └── webapp/       # Traditional web application resources (rarely used in Boot)
│   │
│   └── test/
│       ├── java/         # Test code
│       └── resources/    # Test configuration and resources
│
├── target/ or build/     # Compiled output (auto-generated)
├── pom.xml or build.gradle  # Build configuration
└── README.md, .gitignore, etc.
```

### Key Directories and Files

#### Source Code
- **src/main/java**: Contains application code organized by package
- **src/test/java**: Contains test code mirroring the main package structure

#### Resources
- **src/main/resources/application.properties**: Configuration properties
- **src/main/resources/application.yml**: YAML alternative to properties
- **src/main/resources/static**: Static web assets served from root path
- **src/main/resources/templates**: Template files for view rendering
- **src/main/resources/META-INF**: Custom metadata like additional spring.factories

#### Build Files
- **pom.xml**: Maven project configuration
- **build.gradle**: Gradle project configuration

### Best Practices for Project Organization

#### Package Structure

Several popular conventions exist:

1. **Package by Layer**
```
com.example.demo/
├── controller/
├── service/
├── repository/
├── model/ or domain/
└── config/
```

2. **Package by Feature**
```
com.example.demo/
├── user/
│   ├── UserController.java
│   ├── UserService.java
│   ├── User.java
│   └── UserRepository.java
├── product/
│   ├── ProductController.java
│   └── ...
└── common/
```

3. **Hexagonal Architecture**
```
com.example.demo/
├── domain/
│   ├── model/
│   └── service/
├── application/
│   └── service/
└── infrastructure/
    ├── repository/
    ├── controller/
    └── config/
```

#### Configuration Classes

Best practice is to organize configuration classes in a clear manner:

```java
// Web MVC configuration
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    // Web-specific configuration
}

// Security configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // Security-specific configuration
}

// Database configuration
@Configuration
@EnableJpaRepositories
public class DatabaseConfig {
    // Database-specific beans and properties
}
```

#### Multi-Module Projects

For larger applications, consider a multi-module structure:

```
my-application/
├── my-application-core/       # Domain model and business logic
├── my-application-api/        # API controllers and DTOs
├── my-application-service/    # Service implementations
├── my-application-repository/ # Data access layer
└── my-application-web/        # Web UI if applicable
```

## Spring Boot Starters

Spring Boot Starters are dependency descriptors designed to simplify dependency management by bundling related dependencies into single artifacts.

### What Are Starters?

Starters are carefully curated collections of dependencies that:
- Simplify build configuration
- Ensure compatible dependency versions
- Provide auto-configuration
- Follow a consistent naming convention: `spring-boot-starter-*`

### Common Starters

#### Web Applications
- **spring-boot-starter-web**: For building web applications including RESTful applications using Spring MVC
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  ```

- **spring-boot-starter-webflux**: For building reactive web applications
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>
  ```

#### Data Access
- **spring-boot-starter-data-jpa**: For using Spring Data JPA with Hibernate
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  ```

- **spring-boot-starter-data-mongodb**: For working with MongoDB
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-mongodb</artifactId>
  </dependency>
  ```

#### Security
- **spring-boot-starter-security**: For adding Spring Security
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  ```

#### Testing
- **spring-boot-starter-test**: For testing Spring Boot applications
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
  </dependency>
  ```

#### Templating Engines
- **spring-boot-starter-thymeleaf**: For using Thymeleaf template engine
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
  ```

#### Monitoring
- **spring-boot-starter-actuator**: For adding production-ready features
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

### Creating Custom Starters

You can create custom starters for Muhammed Shemeel to standardize dependency management and configurations.

#### Naming Convention
Custom starters should follow the naming convention:
- `acme-spring-boot-starter`: For a starter owned by Acme company
- Avoid using `spring-boot` as your starter prefix, as it's reserved for official starters

#### Structure of a Custom Starter
A typical custom starter consists of two modules:
1. The autoconfigure module containing the auto-configuration code
2. The starter module that provides a dependency to the autoconfigure module and additional dependencies

```
acme-spring-boot/
├── acme-spring-boot-autoconfigure/  # Auto-configuration code
└── acme-spring-boot-starter/        # Starter POM with dependencies
```

#### Example: Creating a Simple Custom Starter

1. **Create autoconfigure module:**

```java
@Configuration
@ConditionalOnClass(AcmeService.class)
@EnableConfigurationProperties(AcmeProperties.class)
public class AcmeAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public AcmeService acmeService(AcmeProperties properties) {
        return new AcmeService(properties.getPrefix(), properties.getSuffix());
    }
}
```

2. **Create a properties class:**

```java
@ConfigurationProperties("acme")
public class AcmeProperties {
    
    private String prefix = "Hello";
    private String suffix = "World";
    
    // Getters and setters
}
```

3. **Register the auto-configuration in META-INF/spring.factories:**

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.acme.autoconfigure.AcmeAutoConfiguration
```

4. **Create starter POM:**

```xml
<dependencies>
    <dependency>
        <groupId>com.example.acme</groupId>
        <artifactId>acme-spring-boot-autoconfigure</artifactId>
        <version>${project.version}</version>
    </dependency>
    <!-- Other dependencies the starter provides -->
</dependencies>
```

## Auto-Configuration

Auto-configuration is a key feature of Spring Boot that automatically configures your application based on the dependencies you have added to your project.

### How Auto-Configuration Works

1. Spring Boot looks for auto-configuration classes in your classpath
2. Each auto-configuration class has conditions that determine if it should be applied
3. If conditions are met, the auto-configuration is applied, providing predefined beans and settings

The mechanism uses the following key components:

- **@EnableAutoConfiguration**: Usually part of @SpringBootApplication, enables the auto-configuration mechanism
- **spring.factories**: Files in META-INF containing lists of auto-configuration classes
- **@Conditional annotations**: Control when auto-configurations are applied

### Conditional Annotations

Spring Boot uses various conditions to determine when to apply auto-configurations:

- **@ConditionalOnClass**: Applies when specific classes are present
  ```java
  @ConditionalOnClass(DataSource.class)
  ```

- **@ConditionalOnMissingClass**: Applies when specific classes are not present
  ```java
  @ConditionalOnMissingClass("org.springframework.data.mongodb.MongoDbFactory")
  ```

- **@ConditionalOnBean**: Applies when specific beans exist
  ```java
  @ConditionalOnBean(name = "dataSource")
  ```

- **@ConditionalOnMissingBean**: Applies when specific beans don't exist
  ```java
  @ConditionalOnMissingBean(JpaTransactionManager.class)
  ```

- **@ConditionalOnProperty**: Applies based on a configuration property
  ```java
  @ConditionalOnProperty(prefix="spring.h2", name="console.enabled", havingValue="true")
  ```

- **@ConditionalOnResource**: Applies when specific resources are available
  ```java
  @ConditionalOnResource(resources = "classpath:schema.sql")
  ```

### Auto-Configuration Example

Let's look at how H2 console auto-configuration works:

```java
@Configuration
@ConditionalOnClass(WebServlet.class)
@ConditionalOnProperty(prefix = "spring.h2.console", name = "enabled", havingValue = "true")
@ConditionalOnWebApplication(type = Type.SERVLET)
public class H2ConsoleAutoConfiguration {

    @Bean
    public ServletRegistrationBean<WebServlet> h2Console() {
        ServletRegistrationBean<WebServlet> registration = new ServletRegistrationBean<>(
                new WebServlet(), "/h2-console/*");
        registration.addInitParameter("webAllowOthers", "true");
        return registration;
    }
}
```

This auto-configuration:
1. Only applies if the WebServlet class is on the classpath
2. Only applies if `spring.h2.console.enabled=true` is set
3. Only applies to servlet web applications
4. Registers the H2 console servlet at the `/h2-console` path

### Viewing Auto-Configuration Report

To understand which auto-configurations are being applied or not:

1. **Enable debug logging:**

```properties
# In application.properties
debug=true
```

2. **Examine the startup log:**

```
=========================
AUTO-CONFIGURATION REPORT
=========================

Positive matches:
-----------------
   DataSourceAutoConfiguration matched:
      - @ConditionalOnClass found required class 'javax.sql.DataSource' (OnClassCondition)

Negative matches:
-----------------
   MongoAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.MongoClient' (OnClassCondition)
```

3. **Use Spring Boot Actuator:**

```
GET /actuator/conditions
```

### Customizing Auto-Configuration

There are several ways to customize auto-configuration behavior:

1. **Property Customization:**
```properties
# Set server port
server.port=8081

# Customize database connection
spring.datasource.url=jdbc:mysql://localhost/mydb
spring.datasource.username=user
spring.datasource.password=secret
```

2. **Bean Overriding:**
```java
@Bean
public DataSource dataSource() {
    // Custom implementation that will be used instead of auto-configured one
    return new MyCustomDataSource();
}
```

3. **Exclude Auto-Configurations:**
```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Application {
    // ...
}
```

4. **Profile-Specific Auto-Configuration:**
```java
@Profile("development")
@Configuration
public class DevDataSourceConfig {
    // Development-specific beans
}

@Profile("production")
@Configuration
public class ProdDataSourceConfig {
    // Production-specific beans
}
```

### Auto-Configuration Order

Auto-configurations have an implicit ordering based on their dependencies. You can also explicitly control ordering using:

- **@AutoConfigureBefore:** Apply before specific auto-configurations
  ```java
  @AutoConfigureBefore(JpaRepositoriesAutoConfiguration.class)
  ```

- **@AutoConfigureAfter:** Apply after specific auto-configurations
  ```java
  @AutoConfigureAfter(DataSourceAutoConfiguration.class)
  ```

- **@AutoConfigureOrder:** Set an absolute ordering
  ```java
  @AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
  ```

## Configuration Properties

Spring Boot provides a powerful mechanism to externalize configuration, allowing you to work with the same application code in different environments.

### Property Sources

Spring Boot loads properties from multiple sources in the following order of precedence (highest to lowest):

1. Command-line arguments
2. JNDI attributes from `java:comp/env`
3. Java System properties (`System.getProperties()`)
4. OS environment variables
5. Profile-specific properties (`application-{profile}.properties`)
6. Application properties (`application.properties` or `application.yml`)
7. `@PropertySource` annotations on your `@Configuration` classes
8. Default properties (`SpringApplication.setDefaultProperties`)

### Property File Locations

Spring Boot searches for `application.properties` or `application.yml` files in the following locations (decreasing priority):

1. A `/config` subdirectory of the current directory
2. The current directory
3. A classpath `/config` package
4. The classpath root

### Using Properties Files

The most common way to configure a Spring Boot application is through properties files.

#### application.properties
```properties
# Server configuration
server.port=8080
server.servlet.context-path=/api

# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password

# Logging configuration
logging.level.root=INFO
logging.level.org.springframework.web=DEBUG
```

#### application.yml
YAML offers a more structured, human-readable alternative:
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password

logging:
  level:
    root: INFO
    org.springframework.web: DEBUG
```

### Accessing Properties

There are several ways to access configuration properties in your code:

#### 1. Using @Value annotation
```java
@RestController
public class GreetingController {

    @Value("${greeting.message}")
    private String greetingMessage;

    @GetMapping("/greeting")
    public String getGreeting() {
        return greetingMessage;
    }
}
```

#### 2. Using Environment object
```java
@RestController
public class GreetingController {

    @Autowired
    private Environment environment;

    @GetMapping("/greeting")
    public String getGreeting() {
        return environment.getProperty("greeting.message");
    }
}
```

#### 3. Using @ConfigurationProperties
This approach is especially useful for binding a group of related properties:

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name;
    private String description;
    private Map<String, String> settings = new HashMap<>();

    // Getters and setters...
}
```

```properties
# In application.properties
app.name=My Application
app.description=A Spring Boot application
app.settings.timeout=30s
app.settings.maxConnections=100
```

Usage:
```java
@RestController
public class AppController {

    @Autowired
    private AppProperties appProperties;

    @GetMapping("/app-info")
    public AppProperties getAppInfo() {
        return appProperties;
    }
}
```

### Profiles

Profiles allow you to define environment-specific configurations:

#### Defining Profile-Specific Properties

Create property files named `application-{profile}.properties` or `application-{profile}.yml`:

```
application-dev.properties
application-prod.properties
application-test.properties
```

#### Activating Profiles

1. **In application.properties:**
```properties
spring.profiles.active=dev
```

2. **Command line:**
```bash
java -jar app.jar --spring.profiles.active=prod
```

3. **Environment variable:**
```bash
export SPRING_PROFILES_ACTIVE=prod
```

4. **Programmatically:**
```java
SpringApplication app = new SpringApplication(MyApp.class);
app.setAdditionalProfiles("prod");
app.run(args);
```

#### Profile-Specific Beans

```java
@Configuration
public class AppConfig {

    @Profile("dev")
    @Bean
    public DataSource devDataSource() {
        // Development datasource configuration
    }

    @Profile("prod")
    @Bean
    public DataSource prodDataSource() {
        // Production datasource configuration
    }
}
```

### Type-Safe Configuration Properties

Spring Boot provides a powerful type-safe configuration mechanism using `@ConfigurationProperties`:

#### Define a configuration class:

```java
@ConfigurationProperties(prefix = "mail")
@Validated
public class MailProperties {

    @NotNull
    private String host;
    
    @Min(1025)
    @Max(65536)
    private int port = 25;
    
    @NotEmpty
    private String from;
    
    private String username;
    private String password;
    private Map<String, String> additionalHeaders = new HashMap<>();

    // Getters and setters...
}
```

#### Enable configuration properties:

```java
@SpringBootApplication
@EnableConfigurationProperties(MailProperties.class)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### Properties file:

```properties
mail.host=smtp.example.com
mail.port=587
mail.from=no-reply@example.com
mail.username=admin
mail.password=secret
mail.additional-headers.redelivery=true
mail.additional-headers.secure=true
```

#### Use the properties:

```java
@Service
public class EmailService {

    private final MailProperties mailProperties;
    
    public EmailService(MailProperties mailProperties) {
        this.mailProperties = mailProperties;
    }
    
    public void sendEmail(String to, String subject, String content) {
        // Use mailProperties to configure email sending
        System.out.println("Sending email via " + mailProperties.getHost() + ":" + mailProperties.getPort());
    }
}
```

### Property Encryption

For sensitive configuration values, consider using encrypted properties:

1. **Using jasypt-spring-boot:**

```xml
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.4</version>
</dependency>
```

2. **Configure in properties:**

```properties
jasypt.encryptor.password=your-secret-key

# Encrypted property (ENC() format)
spring.datasource.password=ENC(encrypted-password-here)
```

## Building a Simple REST API

Let's build a simple REST API for managing a collection of books.

### Project Setup

First, create a Spring Boot project with the necessary dependencies:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### Domain Model

Create a Book class:

```java
package com.example.bookapi.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Objects;

public class Book {

    private Long id;
    
    @NotBlank
    @Size(min = 1, max = 100)
    private String title;
    
    @NotBlank
    @Size(min = 1, max = 100)
    private String author;
    
    @NotNull
    @PastOrPresent
    private LocalDate publishedDate;
    
    private String isbn;

    // Constructors
    
    public Book() {
    }
    
    public Book(Long id, String title, String author, LocalDate publishedDate, String isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
        this.isbn = isbn;
    }
    
    // Getters and setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public LocalDate getPublishedDate() {
        return publishedDate;
    }
    
    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }
    
    public String getIsbn() {
        return isbn;
    }
    
    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
    
    // equals and hashCode
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Book book = (Book) o;
        return Objects.equals(id, book.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### Service Layer

Create a service to manage the books:

```java
package com.example.bookapi.service;

import com.example.bookapi.model.Book;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class BookService {

    private final Map<Long, Book> books = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    
    public List<Book> findAll() {
        return new ArrayList<>(books.values());
    }
    
    public Book findById(Long id) {
        return books.get(id);
    }
    
    public Book create(Book book) {
        Long id = idGenerator.getAndIncrement();
        book.setId(id);
        books.put(id, book);
        return book;
    }
    
    public Book update(Long id, Book book) {
        if (!books.containsKey(id)) {
            return null;
        }
        book.setId(id);
        books.put(id, book);
        return book;
    }
    
    public boolean delete(Long id) {
        return books.remove(id) != null;
    }
}
```

### Controller Layer

Create a REST controller:

```java
package com.example.bookapi.controller;

import com.example.bookapi.model.Book;
import com.example.bookapi.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book createBook(@Valid @RequestBody Book book) {
        return bookService.create(book);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        Book updatedBook = bookService.update(id, book);
        if (updatedBook == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBook);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        boolean deleted = bookService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
```

### Error Handling

Add a global exception handler:

```java
package com.example.bookapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
```

### Testing the API

Now you can test your API with tools like Postman or curl:

```bash
# Get all books
curl http://localhost:8080/api/books

# Create a book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Spring Boot in Action","author":"Craig Walls","publishedDate":"2016-01-30","isbn":"1617292540"}'

# Get a specific book
curl http://localhost:8080/api/books/1

# Update a book
curl -X PUT http://localhost:8080/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Spring Boot in Action (2nd Edition)","author":"Craig Walls","publishedDate":"2018-10-15","isbn":"1617292540"}'

# Delete a book
curl -X DELETE http://localhost:8080/api/books/1
```

### OpenAPI Documentation

You can add OpenAPI documentation to your API:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.2</version>
</dependency>
```

Configure OpenAPI:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Book API")
                        .version("1.0")
                        .description("A simple Book API")
                        .termsOfService("http://swagger.io/terms/")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
```

Access the documentation at: http://localhost:8080/swagger-ui.html

## Spring Boot DevTools

Spring Boot Developer Tools (DevTools) provides development-time features to enhance the developer experience.

### DevTools Features

1. **Automatic restart**
   - Restarts the application when classpath changes
   - Uses two classloaders to improve restart time:
     - Base classloader for libraries that don't change
     - Restart classloader for your code that changes frequently

2. **LiveReload integration**
   - Triggers browser refresh when resources change
   - Works with various resource types (HTML, CSS, JS)

3. **Property defaults**
   - Disables template caching during development
   - Enables debug logging for web applications

4. **Developer tools remote applications**
   - Remote debug capabilities
   - Remote update capabilities

### Adding DevTools

Include the DevTools dependency in your project:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Automatic Restart

DevTools monitors the classpath for changes and automatically restarts your application when they occur.

#### Excluding Resources

Configure resources that shouldn't trigger restart:

```properties
spring.devtools.restart.exclude=static/**,public/**
```

Or add additional paths to exclude:

```properties
spring.devtools.restart.additional-exclude=static/**,public/**
```

#### Watching Additional Paths

Add resources from locations not on the classpath:

```properties
spring.devtools.restart.additional-paths=scripts/,data/
```

#### Disabling Restart

Disable restart completely:

```properties
spring.devtools.restart.enabled=false
```

Or programmatically:

```java
public static void main(String[] args) {
    System.setProperty("spring.devtools.restart.enabled", "false");
    SpringApplication.run(MyApp.class, args);
}
```

### LiveReload

DevTools includes a LiveReload server that triggers a browser refresh when resources change.

#### Enabling/Disabling LiveReload

```properties
spring.devtools.livereload.enabled=true
```

#### LiveReload Browser Extension

Install the LiveReload browser extension for your browser:
- Chrome: [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox: [LiveReload](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension/)

### Global Settings

Configure global DevTools settings by creating a file at:
`~/.spring-boot-devtools.properties`

For example:
```properties
spring.devtools.restart.quiet-period=1000
spring.devtools.restart.poll-interval=2000
```

### Remote Development

DevTools supports remote application development:

1. **Configure the remote application:**

```properties
spring.devtools.remote.secret=mysecret
```

2. **Build with DevTools:**

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludeDevtools>false</excludeDevtools>
            </configuration>
        </plugin>
    </plugins>
</build>
```

3. **Connect from your local machine:**

```bash
$ java -jar spring-boot-devtools.jar -Dspring.devtools.remote.secret=mysecret https://myapp.example.com
```

### Best Practices for Using DevTools

1. **Keep it for development only:**
   - Set `<optional>true>` in Maven dependency
   - DevTools automatically disables itself in production

2. **Use with IDE integration:**
   - IntelliJ IDEA: Enable "Build project automatically" and "compiler.automake.allow.when.app.running"
   - Eclipse: Automatic building is enabled by default

3. **Customize restart behavior:**
   - Exclude static assets to avoid unnecessary restarts
   - Configure proper poll intervals for your development environment

4. **Integrate with browser tools:**
   - Use LiveReload with browser extensions
   - Integrate with browser developer tools for better debugging 

## Packaging and Running Spring Boot Applications

Spring Boot provides multiple ways to package and run your applications, making it easy to deploy in various environments.

### JAR vs WAR Packaging

Spring Boot applications can be packaged as executable JAR files or traditional WAR files:

#### Executable JAR (recommended)

Pros:
- Self-contained (embedded server)
- Easy to deploy and run
- Simplified dependency management
- Better for microservices and cloud deployments

```xml
<packaging>jar</packaging>
```

#### WAR packaging

Pros:
- Compatible with external application servers
- Easier migration path for existing web applications
- Multiple applications can share server resources

```xml
<packaging>war</packaging>
```

For WAR deployment, extend `SpringBootServletInitializer`:

```java
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Building with Maven

Build a Spring Boot application with Maven:

```bash
# Build JAR
mvn clean package

# Skip tests
mvn clean package -DskipTests

# Build and run
mvn spring-boot:run
```

Spring Boot Maven Plugin configuration:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
                <layers>
                    <enabled>true</enabled>
                </layers>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Building with Gradle

Build a Spring Boot application with Gradle:

```bash
# Build JAR
./gradlew build

# Skip tests
./gradlew build -x test

# Build and run
./gradlew bootRun
```

Spring Boot Gradle Plugin configuration:

```gradle
plugins {
    id 'org.springframework.boot' version '3.0.0'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'java'
}

bootJar {
    layered {
        enabled = true
    }
}
```

### Running Spring Boot Applications

Multiple ways to run a Spring Boot application:

#### From IDE
Click "Run" on the main application class with `@SpringBootApplication` annotation.

#### From Maven
```bash
mvn spring-boot:run
```

#### From Gradle
```bash
./gradlew bootRun
```

#### From JAR
```bash
java -jar target/myapplication-0.0.1-SNAPSHOT.jar
```

#### With specific profile
```bash
java -jar myapplication.jar --spring.profiles.active=prod
```

#### With custom properties
```bash
java -jar myapplication.jar --server.port=8081
```

### Docker Containerization

Spring Boot applications work well in containers:

#### Basic Dockerfile
```dockerfile
FROM eclipse-temurin:17-jdk
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

#### Optimized Dockerfile using layers
```dockerfile
FROM eclipse-temurin:17-jdk as builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
VOLUME /tmp
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

#### Building and running Docker container
```bash
# Build the image
docker build -t myapp .

# Run the container
docker run -p 8080:8080 myapp
```

#### Using Spring Boot's built-in layering
Spring Boot 2.3+ supports efficient Docker layers:

```bash
# Extract the layers
java -Djarmode=layertools -jar target/myapplication.jar extract

# Create a layered Dockerfile
FROM eclipse-temurin:17-jre as builder
WORKDIR application
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:17-jre
WORKDIR application
COPY --from=builder application/dependencies/ ./
COPY --from=builder application/spring-boot-loader/ ./
COPY --from=builder application/snapshot-dependencies/ ./
COPY --from=builder application/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

### Cloud Deployment

Spring Boot applications can be easily deployed to cloud platforms:

#### Heroku
Create a `Procfile`:
```
web: java -Dserver.port=$PORT $JAVA_OPTS -jar target/*.jar
```

Deploy to Heroku:
```bash
heroku create
git push heroku main
```

#### AWS Elastic Beanstalk
Package as a JAR and upload through the Elastic Beanstalk console or CLI:
```bash
eb init
eb create
eb deploy
```

#### Kubernetes
Create a Kubernetes deployment file:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-boot-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spring-boot-app
  template:
    metadata:
      labels:
        app: spring-boot-app
    spec:
      containers:
      - name: spring-boot-app
        image: myapp:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
```

Deploy to Kubernetes:
```bash
kubectl apply -f deployment.yaml
```

### Executable JAR Structure

Spring Boot's executable JAR is structured as:

```
my-application.jar
├── META-INF
│   ├── MANIFEST.MF
│   └── maven/...
├── BOOT-INF
│   ├── classes/          # Application classes
│   │   └── com/example/...
│   └── lib/              # Dependencies
│       └── *.jar
└── org/springframework/boot/loader/  # JAR loader classes
```

The `MANIFEST.MF` includes a `Main-Class` attribute pointing to Spring Boot's launcher:
```
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.example.MyApplication
```

## Common Issues and Troubleshooting

When working with Spring Boot, you may encounter common issues. Here's how to troubleshoot them.

### Application Startup Issues

#### Port Already in Use
```
Web server failed to start. Port 8080 was already in use.
```

Solutions:
- Kill the process using the port: `lsof -i :8080`, then `kill -9 <PID>`
- Change the port in `application.properties`: `server.port=8081`
- Use a random port: `server.port=0`

#### Bean Creation Exception
```
Error creating bean with name 'entityManagerFactory'
```

Solutions:
- Check database configuration properties
- Ensure the database is running and accessible
- Verify entity mappings are correct

#### Bean Definition Overriding
```
The bean 'dataSource', defined in class path resource [...] could not be registered.
```

Solutions:
- Enable bean overriding: `spring.main.allow-bean-definition-overriding=true`
- Remove duplicate bean definitions
- Use different bean names

### Database Connectivity Issues

#### Connection Issues
```
Failed to obtain JDBC Connection; nested exception is...
```

Solutions:
- Verify database server is running
- Check connection URL, username, and password
- Test connection using a database client
- Ensure database driver is on classpath

#### Hibernate Schema Issues
```
Schema-validation: wrong column type encountered...
```

Solutions:
- Use `spring.jpa.hibernate.ddl-auto=update` during development
- Create database migration scripts with Flyway or Liquibase
- Validate entity mappings against database schema

### Configuration Problems

#### Property Binding Issues
```
Binding to target org.springframework.boot.autoconfigure.web.ServerProperties failed
```

Solutions:
- Check property types and formats
- Use appropriate conversion if needed
- Verify property names match the expected format

#### YAML Format Issues
```
while parsing a block mapping ... expected <block end>, but found ...
```

Solutions:
- Validate YAML syntax (proper indentation)
- Use a YAML linter
- Try switching to properties format

### Memory and Performance Issues

#### OutOfMemoryError
```
java.lang.OutOfMemoryError: Java heap space
```

Solutions:
- Increase heap size: `java -Xmx512m -jar app.jar`
- Optimize memory usage in application
- Add profiling to identify memory leaks

#### Slow Startup
Solutions:
- Use Spring Boot 2.3+ for improved startup time
- Consider lazy initialization: `spring.main.lazy-initialization=true`
- Use Spring Native for compilation to native code
- Profile the startup to identify bottlenecks

### Testing Issues

#### Context Loading Issues
```
Failed to load ApplicationContext for test class
```

Solutions:
- Check test configuration
- Ensure all required beans can be created in test context
- Use `@MockBean` or `@SpyBean` for external dependencies
- Simplify test context with `@WebMvcTest` or `@DataJpaTest`

#### Transaction Rollback Issues
```
Transaction silently rolled back because it has been marked as rollback-only
```

Solutions:
- Check transaction boundaries
- Ensure transaction managers are properly configured
- Use `@Transactional` appropriately in tests

### Debugging Techniques

#### Enable Debug Logging
```properties
# In application.properties
debug=true
logging.level.org.springframework=DEBUG
logging.level.com.mycompany=TRACE
```

#### Use Actuator Endpoints
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access endpoints:
- `/actuator/health` - Application health
- `/actuator/beans` - All beans in the application
- `/actuator/conditions` - Auto-configuration report
- `/actuator/env` - Configuration properties

#### Remote Debugging
```bash
java -jar -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8000 app.jar
```

Connect your IDE to port 8000.

#### Analyzing Application Events
```java
@Component
public class ApplicationEventLogger {
    
    private static final Logger logger = LoggerFactory.getLogger(ApplicationEventLogger.class);
    
    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event) {
        logger.info("Context refreshed event received");
    }
    
    @EventListener
    public void handleContextStart(ContextStartedEvent event) {
        logger.info("Context started event received");
    }
    
    @EventListener
    public void handleContextStop(ContextStoppedEvent event) {
        logger.info("Context stopped event received");
    }
}
```

### Common Pitfalls and Solutions

#### Circular Dependencies
```
The dependencies of some of the beans in the application context form a cycle
```

Solutions:
- Refactor to eliminate the circular dependency
- Use `@Lazy` annotation on one of the beans
- Inject `ApplicationContext` and get beans manually (last resort)

#### Missing Bean Errors
```
No qualifying bean of type [com.example.MyService] found for dependency
```

Solutions:
- Ensure component scanning includes the package
- Add missing `@Component`, `@Service`, etc. annotations
- Check if the bean is imported correctly
- Verify configuration classes have necessary annotations

#### Application Context Not Starting
```
Application run failed ... Failed to start bean 'documentationPluginsBootstrapper'
```

Solutions:
- Check if all required dependencies are available
- Look for exceptions during bean initialization
- Remove or fix conflicting dependencies
- Check for incompatible library versions

## Next Steps

After mastering the basics of Spring Boot, here are some next steps to enhance your skills:

### Advanced Spring Boot Topics

1. **Spring Boot Actuator**
   - Learn how to monitor and manage your application
   - Customize health checks and metrics
   - Create custom actuator endpoints
   - Integrate with monitoring systems

2. **Spring Boot Security**
   - Implement authentication and authorization
   - Configure HTTPS and CSRF protection
   - Integrate with OAuth2 and JWT
   - Implement method-level security

3. **Data Access with Spring Boot**
   - Work with different databases (SQL and NoSQL)
   - Implement caching strategies
   - Use Spring Data repositories
   - Create database migrations with Flyway or Liquibase

4. **Testing Spring Boot Applications**
   - Write unit and integration tests
   - Use testing slices (@WebMvcTest, @DataJpaTest)
   - Implement test configurations
   - Test security and REST APIs

5. **Microservices with Spring Boot**
   - Build microservice architectures
   - Implement service discovery
   - Use Spring Cloud for distributed systems
   - Implement circuit breakers and resilience patterns

### Recommended Project Ideas

1. **RESTful API Service**
   - Build a complete REST API
   - Implement HATEOAS
   - Add API documentation with OpenAPI
   - Implement pagination and filtering

2. **Web Application**
   - Create a Spring MVC application
   - Use Thymeleaf or another template engine
   - Implement form validation
   - Add user authentication

3. **Real-time Application**
   - Use WebSockets or Server-Sent Events
   - Build a chat application
   - Create a real-time dashboard
   - Implement notification systems

4. **Batch Processing Application**
   - Use Spring Batch for large data processing
   - Implement job monitoring
   - Schedule batch jobs
   - Handle error scenarios

5. **Event-Driven Application**
   - Use Spring Integration or Spring Cloud Stream
   - Integrate with message brokers (RabbitMQ, Kafka)
   - Implement event sourcing
   - Create asynchronous processing flows

### Learning Resources

#### Books
- "Spring Boot in Action" by Craig Walls
- "Learning Spring Boot 2.0" by Greg L. Turnquist
- "Cloud Native Java" by Josh Long and Kenny Bastani
- "Spring Microservices in Action" by John Carnell

#### Online Courses
- [Spring Framework 5: Beginner to Guru](https://www.udemy.com/course/spring-framework-5-beginner-to-guru/)
- [Spring & Hibernate for Beginners](https://www.udemy.com/course/spring-hibernate-tutorial/)
- [Building Microservices with Spring Boot](https://www.pluralsight.com/courses/spring-boot-building-microservices)

#### Websites and Documentation
- [Spring Boot Official Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Guides](https://spring.io/guides)
- [Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)
- [Spring Boot GitHub Repository](https://github.com/spring-projects/spring-boot)

#### Community and Support
- [Spring Community Forums](https://community.spring.io/)
- [Stack Overflow Spring Boot questions](https://stackoverflow.com/questions/tagged/spring-boot)
- [Spring Boot Gitter](https://gitter.im/spring-projects/spring-boot)

### Practice Exercises

1. **Create a Book Management API**
   - Implement CRUD operations
   - Add validation
   - Implement pagination and sorting
   - Add search functionality

2. **Build a Weather Application**
   - Integrate with external weather API
   - Cache results
   - Schedule updates
   - Implement error handling

3. **Develop a Task Management System**
   - Create user registration and login
   - Implement task creation and assignment
   - Add deadline notifications
   - Create task dashboards

4. **Create a File Upload Service**
   - Handle file uploads and downloads
   - Implement file validation
   - Store file metadata
   - Integrate with cloud storage

5. **Build a RESTful Blog Service**
   - Implement post CRUD operations
   - Add comment functionality
   - Implement user authentication
   - Create API documentation 