# Spring Boot Configuration

## Overview
This guide covers the various ways to configure Spring Boot applications. Spring Boot provides a flexible configuration system that allows you to externalize configuration, use profiles for environment-specific settings, and customize nearly every aspect of your application. Understanding these configuration mechanisms is essential for building robust and adaptable Spring Boot applications.

## Prerequisites
- Basic knowledge of Spring Boot
- Familiarity with Java
- Understanding of application properties and environment variables
- Experience with Spring Boot application structure

## Learning Objectives
- Understand Spring Boot's configuration hierarchy
- Master application properties and YAML configuration
- Use configuration properties classes
- Work with profiles for different environments
- Externalize configuration for production deployments
- Override default configuration
- Secure sensitive configuration values
- Implement dynamic configuration updates
- Create custom property sources
- Debug configuration-related issues

## Table of Contents
1. [Configuration Fundamentals](#configuration-fundamentals)
2. [Property Sources and Hierarchy](#property-sources-and-hierarchy)
3. [Configuration File Formats](#configuration-file-formats)
4. [Type-safe Configuration Properties](#type-safe-configuration-properties)
5. [Profiles](#profiles)
6. [Externalized Configuration](#externalized-configuration)
7. [Environment-Specific Configuration](#environment-specific-configuration)
8. [Dynamic Configuration](#dynamic-configuration)
9. [Configuration Security](#configuration-security)
10. [Configuration Best Practices](#configuration-best-practices)

## Configuration Fundamentals

Spring Boot prioritizes convention over configuration, providing sensible defaults that can be overridden as needed. This approach minimizes the configuration required while maintaining flexibility.

### Basic Configuration

The simplest way to configure a Spring Boot application is through `application.properties` or `application.yml` files placed in the classpath:

```properties
# application.properties
server.port=8080
spring.application.name=my-application
```

or in YAML format:

```yaml
# application.yml
server:
  port: 8080
spring:
  application:
    name: my-application
```

### Accessing Configuration Properties

You can access these properties in your code using the `@Value` annotation:

```java
@RestController
public class HelloController {

    @Value("${spring.application.name}")
    private String applicationName;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from " + applicationName;
    }
}
```

Or through the `Environment` interface:

```java
@RestController
public class HelloController {

    private final Environment environment;

    public HelloController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from " + environment.getProperty("spring.application.name");
    }
}
```

## Property Sources and Hierarchy

Spring Boot considers multiple property sources in a well-defined order, giving you flexibility in how you configure your application.

### Property Source Order

Property sources are considered in the following order (from highest to lowest precedence):

1. Command-line arguments
2. Java System properties (`System.getProperties()`)
3. OS environment variables
4. Profile-specific application properties outside of packaged jar (`application-{profile}.properties/yml`)
5. Profile-specific application properties packaged inside jar (`application-{profile}.properties/yml`)
6. Application properties outside of packaged jar (`application.properties/yml`)
7. Application properties packaged inside jar (`application.properties/yml`)
8. `@PropertySource` annotations on your `@Configuration` classes
9. Default properties from `SpringApplication.setDefaultProperties`

This means that properties defined in earlier sources (e.g., command-line) will override those defined in later sources (e.g., packaged properties files).

### Command Line Properties

You can set properties via command line:

```bash
java -jar myapp.jar --server.port=9000
```

### System Properties

System properties can be set on the command line:

```bash
java -Dserver.port=9000 -jar myapp.jar
```

### Environment Variables

Spring Boot converts environment variables to properties. For example, `SERVER_PORT` environment variable maps to `server.port` property:

```bash
export SERVER_PORT=9000
java -jar myapp.jar
```

### @PropertySource Annotation

You can add custom property sources using the `@PropertySource` annotation:

```java
@Configuration
@PropertySource("classpath:custom.properties")
public class AppConfig {
    // ...
}
```

## Configuration File Formats

Spring Boot supports different configuration file formats, with properties and YAML being the most common.

### Properties Format

Properties files use key-value pairs:

```properties
# Simple properties
server.port=9000
spring.application.name=my-app

# Lists
my.list.values=value1,value2,value3

# Maps
my.map.values.key1=value1
my.map.values.key2=value2
```

### YAML Format

YAML provides a more structured format:

```yaml
# Simple properties
server:
  port: 9000
spring:
  application:
    name: my-app

# Lists
my:
  list:
    values:
      - value1
      - value2
      - value3

# Maps
  map:
    values:
      key1: value1
      key2: value2
```

YAML also supports more complex structures and is often preferred for its readability:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: user
    password: pass
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

To use YAML, include the SnakeYAML library in your dependencies:

```xml
<dependency>
    <groupId>org.yaml</groupId>
    <artifactId>snakeyaml</artifactId>
</dependency>
```

This is usually included automatically with `spring-boot-starter`.

### Multi-document Files

YAML supports multiple documents in a single file, which can be useful for different profiles:

```yaml
# Default profile
spring:
  application:
    name: my-application
server:
  port: 8080
---
# Development profile
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:testdb
---
# Production profile
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://localhost/prod
```

## Type-safe Configuration Properties

Instead of using `@Value` annotations throughout your code, Spring Boot encourages the use of strongly-typed configuration properties classes.

### @ConfigurationProperties

The `@ConfigurationProperties` annotation binds external properties to a Java class:

```java
@Configuration
@ConfigurationProperties(prefix = "app.service")
public class ServiceProperties {

    private boolean enabled;
    private String apiUrl;
    private int timeout;
    
    // Getters and setters
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public String getApiUrl() {
        return apiUrl;
    }
    
    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }
    
    public int getTimeout() {
        return timeout;
    }
    
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
}
```

This class can be configured through properties:

```properties
app.service.enabled=true
app.service.api-url=https://api.example.com
app.service.timeout=30
```

To use this configuration class:

```java
@Service
public class MyService {

    private final ServiceProperties properties;
    
    public MyService(ServiceProperties properties) {
        this.properties = properties;
    }
    
    public void doSomething() {
        if (properties.isEnabled()) {
            // Use properties.getApiUrl() and properties.getTimeout()
        }
    }
}
```

### Enabling @ConfigurationProperties

To use `@ConfigurationProperties`, you need to enable it:

```java
@SpringBootApplication
@ConfigurationPropertiesScan // Scans for @ConfigurationProperties classes
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

Or you can explicitly register a configuration properties bean:

```java
@Configuration
@EnableConfigurationProperties(ServiceProperties.class)
public class AppConfig {
    // ...
}
```

### Nested Properties

Configuration properties can have nested structures:

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Service service = new Service();
    private final Security security = new Security();
    
    public Service getService() {
        return service;
    }
    
    public Security getSecurity() {
        return security;
    }
    
    public static class Service {
        private String url;
        private int timeout;
        
        // Getters and setters
    }
    
    public static class Security {
        private boolean enabled;
        private String tokenSecret;
        
        // Getters and setters
    }
}
```

Configure with:

```properties
app.service.url=https://example.com/api
app.service.timeout=60
app.security.enabled=true
app.security.token-secret=abc123
```

### Validation

You can validate configuration properties using JSR-303 Bean Validation:

```java
@ConfigurationProperties(prefix = "app.service")
@Validated
public class ServiceProperties {

    @NotNull
    @Pattern(regexp = "^https?://.*")
    private String apiUrl;
    
    @Min(1000)
    @Max(10000)
    private int timeout;
    
    // Getters and setters
}
```

Add the validation dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Property Conversion

Spring Boot automatically converts properties to the appropriate types. For complex types like `Duration` or `DataSize`, you can use appropriate suffixes:

```properties
app.service.timeout=10s  # 10 seconds
app.service.max-size=10MB  # 10 megabytes
```

In your configuration class:

```java
@ConfigurationProperties(prefix = "app.service")
public class ServiceProperties {

    private Duration timeout;
    private DataSize maxSize;
    
    // Getters and setters
}
```

## Profiles

Profiles are a core feature of Spring Boot that allow different configurations for different environments.

### Basic Profile Configuration

Define profile-specific properties in files named `application-{profile}.properties` or `application-{profile}.yml`:

```properties
# application-dev.properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:testdb

# application-prod.properties
server.port=80
spring.datasource.url=jdbc:mysql://localhost/prod
```

### Activating Profiles

You can activate profiles in several ways:

1. Using the `spring.profiles.active` property:

```properties
# application.properties
spring.profiles.active=dev
```

2. Using the command line:

```bash
java -jar myapp.jar --spring.profiles.active=dev
```

3. Using environment variables:

```bash
export SPRING_PROFILES_ACTIVE=dev
java -jar myapp.jar
```

4. Programmatically:

```java
SpringApplication app = new SpringApplication(MyApplication.class);
app.setAdditionalProfiles("dev");
app.run(args);
```

### Profile Groups

Spring Boot 2.4+ supports profile groups to activate multiple profiles at once:

```properties
spring.profiles.group.production=prod,monitoring,management
```

When you activate the `production` profile, it automatically activates `prod`, `monitoring`, and `management` profiles.

### Profile-specific Beans

You can define beans that are only created when a specific profile is active:

```java
@Configuration
public class AppConfig {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        // Return an H2 in-memory database
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        // Return a production database
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost/prod");
        config.setUsername("root");
        config.setPassword("password");
        return new HikariDataSource(config);
    }
}
```

You can also apply profiles at the class level:

```java
@Configuration
@Profile("dev")
public class DevConfig {
    // Dev-specific beans
}

@Configuration
@Profile("prod")
public class ProdConfig {
    // Prod-specific beans
}
```

### Default Profile

If no profile is explicitly activated, Spring Boot uses the "default" profile. You can provide configuration for this profile in `application-default.properties`.

## Externalized Configuration

Externalizing configuration is crucial for the Twelve-Factor App methodology, allowing applications to be deployed to different environments without code changes.

### Config Server

For large applications, consider using Spring Cloud Config Server:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

### Kubernetes ConfigMaps and Secrets

When deploying to Kubernetes, use ConfigMaps and Secrets:

```yaml
# application.yml
spring:
  config:
    import: "optional:configtree:/etc/config/"
```

Mount your ConfigMap or Secret to `/etc/config/`.

### Environment Variables

For containerized environments, environment variables are often the preferred way to configure applications:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-service:3306/mydb
SPRING_DATASOURCE_USERNAME=myuser
SPRING_DATASOURCE_PASSWORD=mypassword
```

Spring Boot will automatically convert these to the appropriate properties.

### Config Data Imports

Spring Boot 2.4+ supports importing configuration from various sources:

```properties
spring.config.import=optional:configserver:http://config-server:8888
```

## Environment-Specific Configuration

Different environments often require different configurations.

### Development Environment

For development, prioritize ease of use:

```properties
# application-dev.properties
logging.level.root=DEBUG
spring.h2.console.enabled=true
spring.jpa.show-sql=true
```

### Testing Environment

For testing, focus on isolation and reproducibility:

```properties
# application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.liquibase.enabled=false
spring.flyway.enabled=false
```

### Production Environment

For production, prioritize security, performance, and robustness:

```properties
# application-prod.properties
logging.level.root=WARN
server.tomcat.max-threads=200
spring.jpa.hibernate.ddl-auto=validate
management.endpoints.web.exposure.include=health,info,metrics
```

## Dynamic Configuration

Some applications need to update their configuration without restarting.

### @RefreshScope

Spring Cloud's `@RefreshScope` enables dynamic config updates:

```java
@RestController
@RefreshScope
public class MessageController {

    @Value("${message:Hello default}")
    private String message;
    
    @GetMapping("/message")
    public String getMessage() {
        return message;
    }
}
```

With Spring Cloud Config, you can trigger a refresh via actuator:

```bash
curl -X POST http://localhost:8080/actuator/refresh
```

### Configuration Changes at Runtime

For custom behavior on configuration changes:

```java
@Component
public class ConfigChangeListener {

    @EventListener
    public void handleConfigChange(EnvironmentChangeEvent event) {
        for (String key : event.getKeys()) {
            // Handle changes to specific properties
            if (key.equals("app.feature.enabled")) {
                // Update feature flag status
            }
        }
    }
}
```

## Configuration Security

Securing sensitive configuration is critical for production applications.

### Encrypting Properties

Spring Cloud Config Server can encrypt sensitive properties:

```properties
spring.datasource.password={cipher}AQCGMXJDkb2iOPTxjCDvHDQchUAe0HVihiQa3BXrTwzwmGlV...
```

### Using Vault for Secrets

HashiCorp Vault is a secure option for managing secrets:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
```

```properties
spring.cloud.vault.token=your-vault-token
spring.cloud.vault.scheme=http
spring.cloud.vault.host=localhost
spring.cloud.vault.port=8200
```

### Masking Sensitive Properties

Prevent sensitive properties from being logged:

```java
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyApplication.class);
        app.setDefaultProperties(Collections.singletonMap("spring.config.additional-location", 
            "optional:file:./config/"));
        System.setProperty("spring.config.hide-on-startup", "true");
        app.run(args);
    }
}
```

## Configuration Best Practices

### Use Configuration Properties Classes

Favor `@ConfigurationProperties` over `@Value` for better maintainability and type safety.

### Keep Default Configuration Reasonable

Default values should be sensible so applications work out of the box for development.

### Document Configuration Properties

Document each property's purpose and acceptable values:

```java
@ConfigurationProperties(prefix = "app.service")
@ConfigurationPropertiesMetadata(
    description = "Configures the API service client"
)
public class ServiceProperties {

    /**
     * Base URL for the API service.
     * Must be a valid URL starting with http:// or https://
     */
    @NotNull
    @Pattern(regexp = "^https?://.*")
    private String apiUrl;
    
    /**
     * Timeout in seconds for API requests.
     * Must be between 1 and 60.
     */
    @Min(1)
    @Max(60)
    private int timeout = 30;
    
    // Getters and setters
}
```

You can generate documentation using the `spring-boot-configuration-processor`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

### Validate Configuration at Startup

Fail fast if the configuration is invalid:

```java
@SpringBootApplication
public class MyApplication implements ApplicationRunner {

    private final ServiceProperties serviceProperties;
    
    public MyApplication(ServiceProperties serviceProperties) {
        this.serviceProperties = serviceProperties;
    }
    
    @Override
    public void run(ApplicationArguments args) {
        // Validate critical configuration
        if (serviceProperties.getApiUrl() == null || 
            !serviceProperties.getApiUrl().startsWith("https://")) {
            throw new IllegalStateException("API URL must be HTTPS for production!");
        }
    }
    
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### Use Profiles Effectively

- Keep profiles focused on specific environments or features
- Use profile groups for related profiles
- Consider the default profile for local development

### Externalize Secrets

- Never commit secrets to source control
- Use environment variables or a secrets management system
- Consider Spring Cloud Config or Vault for centralized configuration

### Test Configuration

Write tests for your configuration to catch issues early:

```java
@SpringBootTest
@ActiveProfiles("test")
class ServicePropertiesTests {

    @Autowired
    private ServiceProperties serviceProperties;
    
    @Test
    void defaultTimeoutShouldBeThirtySeconds() {
        assertEquals(30, serviceProperties.getTimeout());
    }
    
    @Test
    void apiUrlShouldBeConfigured() {
        assertNotNull(serviceProperties.getApiUrl());
        assertTrue(serviceProperties.getApiUrl().startsWith("http"));
    }
}
```

### Use Appropriate Property Sources

- Use application properties for defaults and common settings
- Use profile-specific properties for environment-specific values
- Use command-line arguments for overrides in specific deployments

## Summary

Spring Boot's configuration system offers a powerful and flexible way to configure your applications:

- Multiple file formats support structured configuration
- Property sources hierarchy provides clear precedence rules
- Type-safe configuration with `@ConfigurationProperties`
- Profiles for environment-specific configurations
- Built-in support for externalized configuration
- Integration with various secrets management systems
- Dynamic configuration updates for certain scenarios

By mastering these configuration options, you can build applications that are easy to develop, test, and deploy across different environments.

## Further Reading

- [Spring Boot Configuration Properties Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
- [Externalized Configuration Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Spring Cloud Config Documentation](https://cloud.spring.io/spring-cloud-config/reference/html/)
- [Twelve-Factor App Methodology](https://12factor.net/)
- [Spring Boot Profiles Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles) 