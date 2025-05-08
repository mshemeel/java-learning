# Software Development Principles

## Table of Contents
1. [SOLID Principles](#solid-principles)
2. [ACID Properties](#acid-properties)
3. [12-Factor Methodology](#12-factor-methodology)
4. [Real-World Scenarios](#real-world-scenarios)

## SOLID Principles

### Overview
SOLID is an acronym for five design principles intended to make object-oriented designs more understandable, flexible, and maintainable.

### 1. Single Responsibility Principle (SRP)
A class should have only one reason to change.

```java
// Bad Example
class UserManager {
    public void saveUser(User user) {
        // Save user to database
    }
    
    public void sendEmail(User user) {
        // Send email to user
    }
}

// Good Example
class UserRepository {
    public void saveUser(User user) {
        // Save user to database
    }
}

class EmailService {
    public void sendEmail(User user) {
        // Send email to user
    }
}
```

### 2. Open/Closed Principle (OCP)
Software entities should be open for extension but closed for modification.

```java
// Bad Example
class Rectangle {
    public double width;
    public double height;
}

class AreaCalculator {
    public double calculateArea(Rectangle rectangle) {
        return rectangle.width * rectangle.height;
    }
    // Need to modify this class for each new shape
}

// Good Example
interface Shape {
    double calculateArea();
}

class Rectangle implements Shape {
    private double width;
    private double height;
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}

class Circle implements Shape {
    private double radius;
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

```java
// Bad Example
class Bird {
    public void fly() {
        // Flying implementation
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly");
    }
}

// Good Example
interface FlyingBird {
    void fly();
}

interface SwimmingBird {
    void swim();
}

class Sparrow implements FlyingBird {
    @Override
    public void fly() {
        // Flying implementation
    }
}

class Penguin implements SwimmingBird {
    @Override
    public void swim() {
        // Swimming implementation
    }
}
```

### 4. Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they do not use.

```java
// Bad Example
interface Worker {
    void work();
    void eat();
    void sleep();
}

// Good Example
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class Human implements Workable, Eatable, Sleepable {
    @Override
    public void work() {
        // Working implementation
    }
    
    @Override
    public void eat() {
        // Eating implementation
    }
    
    @Override
    public void sleep() {
        // Sleeping implementation
    }
}
```

### 5. Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions.

```java
// Bad Example
class EmailNotifier {
    public void sendEmail(String message) {
        // Send email implementation
    }
}

class NotificationService {
    private EmailNotifier emailNotifier = new EmailNotifier();
    
    public void notify(String message) {
        emailNotifier.sendEmail(message);
    }
}

// Good Example
interface NotificationSender {
    void send(String message);
}

class EmailNotifier implements NotificationSender {
    @Override
    public void send(String message) {
        // Send email implementation
    }
}

class SMSNotifier implements NotificationSender {
    @Override
    public void send(String message) {
        // Send SMS implementation
    }
}

class NotificationService {
    private NotificationSender notificationSender;
    
    public NotificationService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }
    
    public void notify(String message) {
        notificationSender.send(message);
    }
}
```

## ACID Properties

### Overview
ACID is an acronym that stands for Atomicity, Consistency, Isolation, and Durability. These properties ensure reliable processing of database transactions.

### 1. Atomicity
A transaction must be treated as a single, indivisible unit of work. Either all operations complete successfully or none of them do.

```java
@Transactional
public void transferMoney(Account from, Account to, BigDecimal amount) {
    try {
        from.withdraw(amount);
        to.deposit(amount);
    } catch (Exception e) {
        // Transaction will be rolled back automatically
        throw new TransactionException("Transfer failed", e);
    }
}
```

### 2. Consistency
A transaction must bring the database from one valid state to another valid state, maintaining all invariants.

```java
@Entity
public class BankAccount {
    @Id
    private Long id;
    private BigDecimal balance;
    
    @PreUpdate
    public void validateBalance() {
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Balance cannot be negative");
        }
    }
}
```

### 3. Isolation
Concurrent transactions must not affect each other. Each transaction should appear to execute in isolation.

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void updateBalance(Long accountId, BigDecimal amount) {
    Account account = accountRepository.findById(accountId)
        .orElseThrow(() -> new AccountNotFoundException(accountId));
    account.setBalance(account.getBalance().add(amount));
    accountRepository.save(account);
}
```

### 4. Durability
Once a transaction is committed, its changes must persist even in the case of system failures.

```java
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Transactional
    public void processTransaction(Transaction transaction) {
        // Process transaction
        transactionRepository.save(transaction);
        // After successful commit, changes are permanent
    }
}
```

## 12-Factor Methodology

### Overview
The 12-Factor methodology is a set of best practices for building modern, scalable, maintainable software-as-a-service applications.

### 1. Codebase
One codebase tracked in revision control, many deploys.

```java
// Example project structure
my-application/
  ├── .git/
  ├── src/
  ├── config/
  ├── Dockerfile
  └── README.md
```

### 2. Dependencies
Explicitly declare and isolate dependencies.

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.0</version>
    </dependency>
</dependencies>
```

### 3. Config
Store config in the environment.

```java
@Configuration
public class AppConfig {
    @Value("${DATABASE_URL}")
    private String databaseUrl;
    
    @Value("${API_KEY}")
    private String apiKey;
}
```

### 4. Backing Services
Treat backing services as attached resources.

```java
@Configuration
public class DatabaseConfig {
    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url(System.getenv("DATABASE_URL"))
            .username(System.getenv("DATABASE_USER"))
            .password(System.getenv("DATABASE_PASSWORD"))
            .build();
    }
}
```

### 5. Build, Release, Run
Strictly separate build and run stages.

```dockerfile
# Dockerfile
FROM maven:3.8.4-openjdk-17 AS build
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk-slim
COPY --from=build /target/app.jar app.jar
CMD ["java", "-jar", "app.jar"]
```

### 6. Processes
Execute the app as one or more stateless processes.

```java
@RestController
@SessionAttributes // Avoid using session state
public class StatelessController {
    @GetMapping("/api/data")
    public ResponseEntity<?> getData(@RequestParam String id) {
        // Process request without storing state
        return ResponseEntity.ok(processData(id));
    }
}
```

### 7. Port Binding
Export services via port binding.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// application.properties
server.port=${PORT:8080}
```

### 8. Concurrency
Scale out via the process model.

```java
@EnableAsync
@Configuration
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(500);
        return executor;
    }
}
```

### 9. Disposability
Maximize robustness with fast startup and graceful shutdown.

```java
@Component
public class GracefulShutdown {
    @PreDestroy
    public void onShutdown() {
        // Clean up resources
        // Close connections
        // Finish processing
    }
}
```

### 10. Dev/Prod Parity
Keep development, staging, and production as similar as possible.

```java
@Profile("dev")
@Configuration
public class DevConfig {
    // Development-specific configuration
}

@Profile("prod")
@Configuration
public class ProdConfig {
    // Production-specific configuration
}
```

### 11. Logs
Treat logs as event streams.

```java
@Slf4j
@Service
public class LoggingService {
    public void logEvent(String event) {
        log.info("Event occurred: {}", event);
        // Logs are written to stdout/stderr
    }
}
```

### 12. Admin Processes
Run admin/management tasks as one-off processes.

```java
@Component
public class DatabaseMigration {
    @Scheduled(fixedRate = 86400000) // Run once per day
    public void performMigration() {
        // Execute database migration
    }
}
```

## Real-World Scenarios

### SOLID Principles in Action

#### 1. Single Responsibility Principle (SRP)
**Scenario: E-commerce Order Processing**
```java
// Bad Design: OrderProcessor handling multiple responsibilities
public class OrderProcessor {
    public void processOrder(Order order) {
        // Validate order
        validateOrder(order);
        
        // Calculate total
        calculateTotal(order);
        
        // Process payment
        processPayment(order);
        
        // Update inventory
        updateInventory(order);
        
        // Send confirmation email
        sendConfirmationEmail(order);
        
        // Generate invoice
        generateInvoice(order);
    }
}

// Good Design: Separate classes for each responsibility
public class OrderValidator {
    public void validateOrder(Order order) {
        // Validate order details, stock availability, etc.
    }
}

public class PaymentProcessor {
    public void processPayment(Order order) {
        // Handle payment processing
    }
}

public class InventoryManager {
    public void updateInventory(Order order) {
        // Update product inventory
    }
}

public class EmailService {
    public void sendConfirmationEmail(Order order) {
        // Send order confirmation
    }
}

public class InvoiceGenerator {
    public void generateInvoice(Order order) {
        // Generate invoice
    }
}

// Orchestrator
public class OrderService {
    private final OrderValidator validator;
    private final PaymentProcessor paymentProcessor;
    private final InventoryManager inventoryManager;
    private final EmailService emailService;
    private final InvoiceGenerator invoiceGenerator;

    public void processOrder(Order order) {
        validator.validateOrder(order);
        paymentProcessor.processPayment(order);
        inventoryManager.updateInventory(order);
        emailService.sendConfirmationEmail(order);
        invoiceGenerator.generateInvoice(order);
    }
}
```

#### 2. Open/Closed Principle (OCP)
**Scenario: Payment Gateway Integration**
```java
// Bad Design: Modifying existing code for new payment methods
public class PaymentProcessor {
    public void processPayment(String type, double amount) {
        if (type.equals("CREDIT_CARD")) {
            processCreditCard(amount);
        } else if (type.equals("PAYPAL")) {
            processPayPal(amount);
        }
        // Need to modify this class for each new payment method
    }
}

// Good Design: Extensible payment processing
public interface PaymentMethod {
    void processPayment(double amount);
}

public class CreditCardPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process credit card payment
    }
}

public class PayPalPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process PayPal payment
    }
}

public class CryptoPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process cryptocurrency payment
    }
}

public class PaymentProcessor {
    public void processPayment(PaymentMethod paymentMethod, double amount) {
        paymentMethod.processPayment(amount);
    }
}
```

#### 3. Liskov Substitution Principle (LSP)
**Scenario: Document Processing System**
```java
// Bad Design: Breaking LSP
public abstract class Document {
    abstract void save();
    abstract void print();
}

public class PDFDocument extends Document {
    @Override
    void save() {
        // Save PDF
    }
    
    @Override
    void print() {
        // Print PDF
    }
}

public class ReadOnlyDocument extends Document {
    @Override
    void save() {
        throw new UnsupportedOperationException("Cannot save read-only document");
    }
    
    @Override
    void print() {
        // Print document
    }
}

// Good Design: Proper abstraction
public interface Printable {
    void print();
}

public interface Saveable {
    void save();
}

public class PDFDocument implements Printable, Saveable {
    @Override
    public void print() {
        // Print PDF
    }
    
    @Override
    public void save() {
        // Save PDF
    }
}

public class ReadOnlyDocument implements Printable {
    @Override
    public void print() {
        // Print document
    }
}
```

### ACID Properties in Action

#### Real-World Banking Scenario
```java
@Service
@Transactional
public class BankingService {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    // Atomicity Example: Fund Transfer
    public void transferFunds(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        Account fromAccount = accountRepository.findById(fromAccountId)
            .orElseThrow(() -> new AccountNotFoundException(fromAccountId));
        Account toAccount = accountRepository.findById(toAccountId)
            .orElseThrow(() -> new AccountNotFoundException(toAccountId));
            
        // Both operations must succeed or both must fail
        fromAccount.withdraw(amount);
        toAccount.deposit(amount);
        
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        // Record transaction
        Transaction transaction = new Transaction(fromAccount, toAccount, amount);
        transactionRepository.save(transaction);
    }
    
    // Consistency Example: Account Balance Check
    @PreUpdate
    @PrePersist
    public void validateAccountState(Account account) {
        if (account.getBalance().compareTo(BigDecimal.ZERO) < 0 && 
            !account.isOverdraftAllowed()) {
            throw new InsufficientFundsException("Negative balance not allowed");
        }
    }
    
    // Isolation Example: Concurrent Withdrawals
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void processLargeWithdrawal(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new AccountNotFoundException(accountId));
            
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds");
        }
        
        account.withdraw(amount);
        accountRepository.save(account);
    }
    
    // Durability Example: Transaction Logging
    public void logTransaction(Transaction transaction) {
        // First, persist to database
        transactionRepository.save(transaction);
        
        // Then, write to audit log
        auditLogger.logTransaction(transaction);
        
        // Finally, notify monitoring system
        monitoringService.notifyTransactionProcessed(transaction);
    }
}
```

### 12-Factor Methodology in Action

#### Real-World Microservice Example
```java
// 1. Codebase - Version-controlled microservice
@SpringBootApplication
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}

// 2. Dependencies - Explicit dependencies in build file
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web:2.7.0'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa:2.7.0'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client:3.1.0'
}

// 3. Config - Environment-based configuration
@Configuration
public class PaymentConfig {
    @Value("${STRIPE_API_KEY}")
    private String stripeApiKey;
    
    @Value("${PAYMENT_PROCESSING_TIMEOUT}")
    private int processingTimeout;
    
    @Bean
    public Stripe stripeClient() {
        return new Stripe(stripeApiKey);
    }
}

// 4. Backing Services - Database and external service configuration
@Configuration
public class DatabaseConfig {
    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url(System.getenv("DATABASE_URL"))
            .username(System.getenv("DATABASE_USER"))
            .password(System.getenv("DATABASE_PASSWORD"))
            .build();
    }
}

// 5. Build, Release, Run - Containerized deployment
// Dockerfile
FROM gradle:7.4.2-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

FROM openjdk:17-slim
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]

// 6. Processes - Stateless service
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
}

// 7. Port Binding - Self-contained service
server.port=${PORT:8080}
spring.application.name=payment-service

// 8. Concurrency - Scalable processing
@Service
public class PaymentProcessor {
    @Async
    public CompletableFuture<PaymentResult> processPaymentAsync(
            Payment payment) {
        return CompletableFuture.supplyAsync(() -> {
            // Process payment
            return new PaymentResult();
        });
    }
}

// 9. Disposability - Graceful shutdown
@Component
public class PaymentServiceShutdown {
    @PreDestroy
    public void onShutdown() {
        // Complete pending transactions
        // Close database connections
        // Clean up resources
    }
}

// 10. Dev/Prod Parity - Environment-specific configurations
@Configuration
@Profile("dev")
public class DevConfig {
    @Bean
    public PaymentGateway paymentGateway() {
        return new MockPaymentGateway();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    @Bean
    public PaymentGateway paymentGateway() {
        return new StripePaymentGateway();
    }
}

// 11. Logs - Centralized logging
@Aspect
@Component
public class PaymentLogging {
    private static final Logger logger = 
        LoggerFactory.getLogger(PaymentLogging.class);
    
    @Around("execution(* com.example.payment.service.*.*(..))")
    public Object logPaymentOperation(ProceedingJoinPoint joinPoint) 
            throws Throwable {
        logger.info("Payment operation started: {}", 
            joinPoint.getSignature().getName());
        try {
            Object result = joinPoint.proceed();
            logger.info("Payment operation completed successfully");
            return result;
        } catch (Exception e) {
            logger.error("Payment operation failed", e);
            throw e;
        }
    }
}

// 12. Admin Processes - Maintenance tasks
@Component
public class PaymentMaintenanceTasks {
    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM daily
    public void cleanupFailedPayments() {
        // Clean up failed payments
    }
    
    @Scheduled(cron = "0 0 0 * * 0") // Run weekly
    public void generatePaymentReports() {
        // Generate weekly payment reports
    }
}
```

## Best Practices Summary

1. Follow SOLID principles for maintainable object-oriented design
2. Ensure ACID properties in database transactions
3. Apply 12-factor methodology for modern application development
4. Use appropriate tools and frameworks that support these principles
5. Regularly review and refactor code to maintain adherence to these principles
6. Document decisions and trade-offs when deviating from these principles
7. Train team members on these principles and their practical applications 