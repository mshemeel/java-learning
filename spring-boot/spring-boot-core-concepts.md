# Spring Boot Core Concepts

## Overview
Spring Boot Core Concepts delves into the fundamental principles and mechanisms that power the Spring Boot framework. Understanding these core concepts is essential for effectively developing robust applications with Spring Boot. This guide explores the architecture behind Spring Boot's "convention over configuration" approach, including auto-configuration, dependency injection, the application context, and the component model that makes Spring Boot both powerful and easy to use.

## Prerequisites
- Basic Java programming knowledge
- Familiarity with build tools (Maven/Gradle)
- Understanding of Spring Boot basics (from spring-boot-starter.md)
- Basic knowledge of object-oriented programming principles
- Familiarity with annotations in Java

## Learning Objectives
- Understand Spring's Inversion of Control (IoC) and Dependency Injection (DI) principles
- Master the Spring application context and bean lifecycle
- Comprehend Spring Boot's auto-configuration mechanism
- Learn how to use and customize Spring Boot's starters
- Understand the component scan process and component model
- Explore conditional configuration in Spring Boot
- Grasp externalized configuration and property binding
- Implement proper application event handling
- Configure and use different bean scopes
- Apply the Spring Expression Language (SpEL)

## Table of Contents
1. [Inversion of Control and Dependency Injection](#inversion-of-control-and-dependency-injection)
2. [Spring Application Context](#spring-application-context)
3. [Bean Lifecycle](#bean-lifecycle)
4. [Component Scanning](#component-scanning)
5. [Auto-Configuration Mechanism](#auto-configuration-mechanism)
6. [Conditional Configuration](#conditional-configuration)
7. [Externalized Configuration](#externalized-configuration)
8. [Spring Boot Starters](#spring-boot-starters)
9. [Application Events](#application-events)
10. [Bean Scopes](#bean-scopes)
11. [Spring Expression Language (SpEL)](#spring-expression-language)
12. [AOP in Spring Boot](#aop-in-spring-boot)

## Inversion of Control and Dependency Injection

Inversion of Control (IoC) and Dependency Injection (DI) are foundational concepts in Spring that enable loose coupling and better testability.

### Inversion of Control

IoC is a design principle where the control flow of a program is inverted: instead of the programmer controlling the flow, the framework controls it. In Spring, IoC means the framework manages object creation and lifecycle rather than the application code.

**Traditional Approach vs. IoC:**

```java
// Traditional approach - we control object creation
public class TraditionalService {
    private Database database;
    
    public TraditionalService() {
        this.database = new MySQLDatabase(); // Hard-coded dependency
    }
    
    public void processData() {
        database.query();
    }
}

// IoC approach - framework manages object creation
public class IoCService {
    private Database database; // Dependency declared but not created
    
    public IoCService(Database database) {
        this.database = database; // Injected by the framework
    }
    
    public void processData() {
        database.query();
    }
}
```

### Dependency Injection

DI is a technique where dependencies are provided to objects rather than the objects creating their dependencies. Spring supports three main types of dependency injection:

#### 1. Constructor Injection (Recommended)

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Dependencies injected via constructor
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

Benefits:
- Promotes immutability (fields can be final)
- Makes dependencies explicit
- Ensures required dependencies are provided
- Better for testing

#### 2. Setter Injection

```java
@Service
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    // Dependencies injected via setters
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

Benefits:
- Useful for optional dependencies
- Allows for reconfiguration after construction
- Avoids circular dependency issues

#### 3. Field Injection (Not Recommended for Production)

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public void registerUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

Limitations:
- Makes testing harder (can't easily inject mocks)
- Hides dependencies
- Prevents final fields (immutability)

### Spring IoC Container

The Spring IoC container is responsible for:
1. Creating beans
2. Wiring dependencies
3. Managing bean lifecycles
4. Providing beans when requested

Spring provides two main types of IoC containers:

1. **BeanFactory**: The basic container providing DI and bean management
2. **ApplicationContext**: Enhanced container with enterprise features (extends BeanFactory)

### Bean Definitions

Beans are the objects managed by the Spring IoC container. They can be defined through:

#### Java Configuration (Preferred)

```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserRepository userRepository() {
        return new JpaUserRepository();
    }
    
    @Bean
    public EmailService emailService() {
        return new SmtpEmailService();
    }
    
    @Bean
    public UserService userService(UserRepository userRepository, EmailService emailService) {
        return new UserService(userRepository, emailService);
    }
}
```

#### XML Configuration (Legacy)

```xml
<beans>
    <bean id="userRepository" class="com.example.JpaUserRepository"/>
    
    <bean id="emailService" class="com.example.SmtpEmailService"/>
    
    <bean id="userService" class="com.example.UserService">
        <constructor-arg ref="userRepository"/>
        <constructor-arg ref="emailService"/>
    </bean>
</beans>
```

#### Component Scanning with Annotations

```java
@SpringBootApplication // Includes @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Repository
public class JpaUserRepository implements UserRepository {
    // Implementation
}

@Service
public class SmtpEmailService implements EmailService {
    // Implementation
}

@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Constructor injection
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}
```

### Benefits of IoC and DI

1. **Loose coupling**: Components depend on abstractions, not implementations
2. **Testability**: Dependencies can be easily mocked or stubbed
3. **Modularity**: Components can be developed and tested in isolation
4. **Flexibility**: Implementations can be swapped without changing client code
5. **Maintainability**: Reduces boilerplate code and centralizes configuration

## Spring Application Context

The Application Context is the central interface within a Spring application that provides configuration information to the application. It represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the beans.

### Types of Application Contexts

Spring provides several implementations of the ApplicationContext interface:

1. **AnnotationConfigApplicationContext**: For Java-based configurations
   ```java
   ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
   ```

2. **ClassPathXmlApplicationContext**: For XML configurations on the classpath
   ```java
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   ```

3. **FileSystemXmlApplicationContext**: For XML configurations in the file system
   ```java
   ApplicationContext context = new FileSystemXmlApplicationContext("config/beans.xml");
   ```

4. **WebApplicationContext**: For web applications

5. **SpringApplication.run()**: In Spring Boot applications
   ```java
   ApplicationContext context = SpringApplication.run(Application.class, args);
   ```

### Retrieving Beans

You can retrieve beans from the Application Context in several ways:

```java
// By type
UserService userService = context.getBean(UserService.class);

// By name
UserService userService = (UserService) context.getBean("userService");

// By name and type
UserService userService = context.getBean("customUserService", UserService.class);

// With generics when multiple beans of the same type exist
@Autowired
@Qualifier("jpaUserRepository")
private UserRepository userRepository;
```

### Application Context Hierarchy

Application contexts can be organized in a parent-child hierarchy:

```java
// Create parent context
ApplicationContext parent = new AnnotationConfigApplicationContext(ParentConfig.class);

// Create child context
AnnotationConfigApplicationContext child = new AnnotationConfigApplicationContext();
child.setParent(parent);
child.register(ChildConfig.class);
child.refresh();
```

In a hierarchy:
- Child contexts can see beans in parent contexts
- Parent contexts cannot see beans in child contexts
- Child beans can override parent beans

### Context Features

The ApplicationContext provides several enterprise features beyond basic IoC:

1. **Internationalization (i18n)**
   ```java
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   String message = context.getMessage("greeting", null, "Default greeting", Locale.ENGLISH);
   ```

2. **Event Publication**
   ```java
   // Publishing events
   context.publishEvent(new CustomEvent(this, "Something happened"));
   
   // Listening to events
   @EventListener
   public void handleContextStart(ContextStartedEvent event) {
        System.out.println("Context started at " + new Date());
   }
   ```

3. **Resource Access**
   ```java
   Resource resource = context.getResource("classpath:data.txt");
   InputStream is = resource.getInputStream();
   ```

4. **Environment Access**
   ```java
   Environment env = context.getEnvironment();
   String property = env.getProperty("app.name");
   ```

### Spring Boot Application Context

In Spring Boot, the application context is created by `SpringApplication.run()`:

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(Application.class, args);
        
        // Inspect context beans
        System.out.println("Bean count: " + context.getBeanDefinitionCount());
        
        // List all beans
        String[] beanNames = context.getBeanDefinitionNames();
        Arrays.sort(beanNames);
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }
    }
}
```

Spring Boot creates a special `AnnotationConfigServletWebServerApplicationContext` for web applications that includes:
- Auto-configuration
- Component scanning
- Embedded web server
- Property source configuration

## Bean Lifecycle

Understanding the lifecycle of Spring beans is crucial for proper resource management and initialization.

### Bean Lifecycle Phases

1. **Instantiation**: Spring creates an instance of the bean
2. **Populate Properties**: Dependencies are injected
3. **BeanNameAware**: `setBeanName()` method called if implemented
4. **BeanFactoryAware**: `setBeanFactory()` method called if implemented
5. **ApplicationContextAware**: `setApplicationContext()` method called if implemented
6. **PreInitialization**: `@PostConstruct` methods called
7. **InitializingBean**: `afterPropertiesSet()` method called if implemented
8. **Custom Init Method**: Method specified by `initMethod` attribute called
9. **Bean is Ready**: Bean is ready for use
10. **PreDestruction**: `@PreDestroy` methods called
11. **DisposableBean**: `destroy()` method called if implemented
12. **Custom Destroy Method**: Method specified by `destroyMethod` attribute called

### Lifecycle Callback Methods

Several approaches exist for hooking into bean lifecycle events:

#### Using Annotations (@PostConstruct and @PreDestroy)

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @PostConstruct
    public void init() {
        System.out.println("UserService initialized");
        // Perform any initialization logic
    }
    
    @PreDestroy
    public void cleanup() {
        System.out.println("UserService being destroyed");
        // Release resources, close connections, etc.
    }
}
```

#### Implementing Lifecycle Interfaces

```java
@Service
public class DatabaseService implements InitializingBean, DisposableBean {
    
    private Connection connection;
    
    @Override
    public void afterPropertiesSet() throws Exception {
        // Called after properties are set
        System.out.println("Initializing database connection");
        connection = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass");
    }
    
    @Override
    public void destroy() throws Exception {
        // Called before bean is destroyed
        System.out.println("Closing database connection");
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}
```

#### Using @Bean Annotation Attributes

```java
@Configuration
public class AppConfig {
    
    @Bean(initMethod = "init", destroyMethod = "close")
    public DatabaseConnection databaseConnection() {
        return new DatabaseConnection("jdbc:mysql://localhost/db", "user", "pass");
    }
}

public class DatabaseConnection {
    // No Spring-specific imports needed
    
    private String url;
    private String username;
    private String password;
    private Connection connection;
    
    public DatabaseConnection(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }
    
    public void init() throws SQLException {
        System.out.println("Initializing connection");
        connection = DriverManager.getConnection(url, username, password);
    }
    
    public void close() throws SQLException {
        System.out.println("Closing connection");
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}
```

### Startup and Shutdown Hooks

For application-wide initialization and cleanup:

```java
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
        
        // Add shutdown hook
        context.registerShutdownHook();
    }
    
    @Bean
    public ApplicationListener<ContextRefreshedEvent> startupListener() {
        return event -> {
            System.out.println("Application context refreshed, application is ready!");
        };
    }
    
    @Bean
    public ApplicationListener<ContextClosedEvent> shutdownListener() {
        return event -> {
            System.out.println("Application context is closing, performing cleanup!");
        };
    }
}
```

### Bean Post Processors

Bean post processors allow you to intercept the initialization process:

```java
@Component
public class CustomBeanPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof AuditableBean) {
            System.out.println("Before initialization of bean with name: " + beanName);
        }
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof AuditableBean) {
            System.out.println("After initialization of bean with name: " + beanName);
            // Could return a proxy here
        }
        return bean;
    }
}
```

### Lazy Initialization

By default, Spring initializes singleton beans eagerly (at context startup). You can change this behavior:

```java
// Lazy-initialize a specific bean
@Bean
@Lazy
public ExpensiveService expensiveService() {
    return new ExpensiveService();
}

// Lazy-initialize all beans
@SpringBootApplication
@Lazy
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// In application.properties
spring.main.lazy-initialization=true
```

### Lifecycle Best Practices

1. **Prefer Constructor Injection**: For required dependencies
2. **Use @PostConstruct for Initialization**: Cleaner than interface implementations
3. **Clean Up Resources**: Always release resources in @PreDestroy methods
4. **Keep Initialization Fast**: Long initialization delays application startup
5. **Handle Exceptions**: Properly handle exceptions in lifecycle methods
6. **Test Lifecycle Methods**: Ensure proper initialization and cleanup in tests

## Component Scanning

Component scanning is a key feature in Spring Boot that allows you to automatically discover and register beans.

### Component Scanning Mechanism

Spring Boot uses the `@ComponentScan` annotation to scan for components in the package structure.

### Exclusions

You can exclude certain packages or classes from being scanned using the `@ComponentScan` annotation's `excludeFilters` attribute.

### Bean Definitions

Beans are defined in the scanned components. For example, if a class is annotated with `@Service`, it will be registered as a bean.

## Auto-Configuration Mechanism

Auto-configuration is a key feature in Spring Boot that allows you to configure your application based on dependencies and settings.

### Auto-Configuration Mechanism

Spring Boot uses the `@EnableAutoConfiguration` annotation to enable auto-configuration. It scans for beans and applies configuration based on the dependencies and settings.

### Exclusions

You can exclude certain auto-configurations using the `@EnableAutoConfiguration` annotation's `exclude` attribute.

### Bean Definitions

Beans are defined in the auto-configured components. For example, if a class is annotated with `@Configuration`, it will be registered as a bean.

## Conditional Configuration

Conditional configuration allows you to configure your application based on certain conditions.

### Conditional Configuration Mechanism

Spring Boot uses the `@Conditional` annotation to enable conditional configuration.

### Exclusions

You can exclude certain conditional configurations using the `@Conditional` annotation's `unless` attribute.

### Bean Definitions

Beans are defined in the conditional components. For example, if a class is annotated with `@Conditional`, it will be registered as a bean.

## Externalized Configuration

Externalized configuration allows you to configure your application based on external sources.

### Externalized Configuration Mechanism

Spring Boot uses the `@ConfigurationProperties` annotation to enable externalized configuration.

### Exclusions

You can exclude certain externalized configurations using the `@ConfigurationProperties` annotation's `ignoreInvalidFields` attribute.

### Bean Definitions

Beans are defined in the externalized components. For example, if a class is annotated with `@ConfigurationProperties`, it will be registered as a bean.

## Spring Boot Starters

Spring Boot Starters are a way to quickly start a project with a specific set of dependencies.

### Spring Boot Starter Mechanism

Spring Boot uses the `@SpringBootApplication` annotation to enable Spring Boot applications.

### Exclusions

You can exclude certain starters using the `@SpringBootApplication` annotation's `exclude` attribute.

### Bean Definitions

Beans are defined in the starter components. For example, if a class is annotated with `@SpringBootApplication`, it will be registered as a bean.

## Application Events

Application events allow you to handle events in your application.

### Application Event Mechanism

Spring Boot uses the `@EventListener` annotation to enable application events.

### Exclusions

You can exclude certain events using the `@EventListener` annotation's `condition` attribute.

### Bean Definitions

Beans are defined in the event listeners. For example, if a class is annotated with `@EventListener`, it will be registered as a bean.

## Bean Scopes

Bean scopes allow you to control the lifecycle and scope of beans.

### Bean Scope Mechanism

Spring Boot uses the `@Scope` annotation to enable bean scopes.

### Exclusions

You can exclude certain scopes using the `@Scope` annotation's `value` attribute.

### Bean Definitions

Beans are defined in the scoped components. For example, if a class is annotated with `@Scope`, it will be registered as a bean.

## Spring Expression Language (SpEL)

Spring Expression Language (SpEL) allows you to evaluate expressions in your application.

### SpEL Mechanism

Spring Boot uses the `@Value` annotation to enable SpEL expressions.

### Exclusions

You can exclude certain expressions using the `@Value` annotation's `value` attribute.

### Bean Definitions

Beans are defined in the SpEL components. For example, if a class is annotated with `@Value`, it will be registered as a bean.

## AOP in Spring Boot

Aspect-Oriented Programming (AOP) allows you to separate cross-cutting concerns from your application code.

### AOP Mechanism

Spring Boot uses the `@EnableAspectJAutoProxy` annotation to enable AOP.

### Exclusions

You can exclude certain aspects using the `@EnableAspectJAutoProxy` annotation's `proxyTargetClass` attribute.

### Bean Definitions

Beans are defined in the AOP components. For example, if a class is annotated with `@EnableAspectJAutoProxy`, it will be registered as a bean. 