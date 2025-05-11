# Spring Boot Best Practices

## Overview
This guide compiles essential best practices for Spring Boot application development. It covers project architecture, security considerations, performance optimization, testing strategies, and deployment techniques. Following these practices will help you build robust, maintainable, and efficient Spring Boot applications.

## Prerequisites
- Basic knowledge of Spring Boot
- Understanding of Java development principles
- Familiarity with software development best practices
- Experience building Spring Boot applications

## Learning Objectives
- Implement proper application architecture
- Apply effective coding standards and patterns
- Secure Spring Boot applications properly
- Optimize application performance
- Write effective tests for Spring Boot applications
- Deploy applications following best practices
- Monitor and maintain applications in production

## Table of Contents
1. [Project Structure and Architecture](#project-structure-and-architecture)
2. [Coding Best Practices](#coding-best-practices)
3. [Configuration Management](#configuration-management)
4. [Security Best Practices](#security-best-practices)
5. [Database Access and Data Management](#database-access-and-data-management)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategies](#testing-strategies)
8. [Deployment Considerations](#deployment-considerations)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)

## Project Structure and Architecture

### Package Organization

Structure your application using a domain-driven or feature-based approach rather than a technical layered approach:

```
com.example.myapp/
├── config/             # Global configuration
├── common/             # Shared utilities and components
├── security/           # Security configuration
└── feature/            # Feature-specific packages
    ├── user/           # User-related functionality
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   └── model/
    └── product/        # Product-related functionality
        ├── controller/
        ├── service/
        ├── repository/
        └── model/
```

### Use Proper Layering

Follow a clear separation of concerns with proper layering:

- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Manages data access
- **Model Layer**: Defines entities and DTOs

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    // Business logic methods
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Data access methods
}
```

### Modular Components

Design with modularity in mind:

- Keep components focused on single responsibilities
- Use interfaces for abstractions
- Implement dependency injection
- Create reusable modules

### Avoid Circular Dependencies

Prevent circular dependencies to maintain clean architecture:

- Ensure one-way dependencies between layers
- Use interfaces and dependency inversion
- Reorganize components if necessary

## Coding Best Practices

### Use Constructor Injection

Prefer constructor injection over field injection:

```java
// Good practice
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final PriceCalculator priceCalculator;
    
    public ProductService(ProductRepository productRepository, 
                          PriceCalculator priceCalculator) {
        this.productRepository = productRepository;
        this.priceCalculator = priceCalculator;
    }
}

// Avoid
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private PriceCalculator priceCalculator;
}
```

### Use Immutable Objects

Create immutable DTOs and value objects:

```java
public final class UserDTO {
    private final Long id;
    private final String name;
    private final String email;
    
    public UserDTO(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Only getters, no setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
```

### Effective Error Handling

Implement consistent exception handling:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        logger.error("Resource not found: {}", ex.getMessage());
        return new ResponseEntity<>(new ErrorResponse("NOT_FOUND", ex.getMessage()), 
                                    HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Unexpected error", ex);
        return new ResponseEntity<>(new ErrorResponse("INTERNAL_ERROR", 
                                                     "An unexpected error occurred"), 
                                    HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### Use Lombok Judiciously

Lombok can reduce boilerplate but use it carefully:

```java
@Data               // Provides getters, setters, equals, hashCode, toString
@NoArgsConstructor  // Default constructor
@AllArgsConstructor // Constructor with all attributes
public class Product {
    private Long id;
    private String name;
    private BigDecimal price;
}
```

### Follow API Design Best Practices

Create RESTful APIs that follow conventions:

- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return proper status codes
- Use consistent URL patterns
- Version your APIs (via URL or headers)
- Provide comprehensive documentation with Swagger/OpenAPI

## Configuration Management

### Externalize Configuration

Keep configuration external to your application:

```properties
# application.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

### Use Configuration Properties Classes

Create typed configuration classes:

```java
@ConfigurationProperties(prefix = "app.service")
@Validated
public class ServiceProperties {
    
    @NotNull
    private String apiUrl;
    
    @Min(1)
    @Max(60)
    private int timeout = 30;
    
    // Getters and setters
}
```

### Environment-Specific Profiles

Configure environment-specific settings with profiles:

```yaml
# application-dev.yml
logging:
  level:
    root: DEBUG

# application-prod.yml
logging:
  level:
    root: WARN
```

Activate with:
```bash
java -jar app.jar --spring.profiles.active=prod
```

### Secret Management

Never hardcode secrets:

- Use environment variables
- Use a secrets vault
- Use encrypted properties with jasypt

## Security Best Practices

### Implement Proper Authentication & Authorization

Configure Spring Security correctly:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(withDefaults())
            .csrf().disable(); // Only disable for REST APIs with proper considerations
        
        return http.build();
    }
}
```

### Protect Against Common Vulnerabilities

Implement protections against:

- SQL Injection: Use parameterized queries
- XSS: Ensure proper output encoding
- CSRF: Enable CSRF protection
- Authentication bypass: Implement secure authentication

### Use HTTPS

Configure SSL in production:

```properties
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
server.port=8443
```

### Implement Security Headers

Add security headers:

```java
@Configuration
public class WebSecurityConfig {
    
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
    }
    
    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers()
                .contentSecurityPolicy("script-src 'self'")
                .and()
                .frameOptions().deny()
                .and()
                .xssProtection()
                .and()
                .httpStrictTransportSecurity()
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000);
            
        return http.build();
    }
}
```

### Input Validation

Validate all user inputs:

```java
@PostMapping("/users")
public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRequest userRequest) {
    // Process validated input
}

public class UserRequest {
    
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$")
    private String password;
    
    // Getters and setters
}
```

## Database Access and Data Management

### Use JPA Repositories Correctly

Follow best practices for Spring Data JPA:

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.price < :maxPrice AND p.active = true")
    List<Product> findActiveBelowPrice(@Param("maxPrice") BigDecimal maxPrice);
    
    @Modifying
    @Query("UPDATE Product p SET p.active = false WHERE p.id = :id")
    void deactivate(@Param("id") Long id);
}
```

### Database Migrations

Use a database migration tool:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Structure migration scripts:

```sql
-- V1__Initial_schema.sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL
);

-- V2__Add_user_details.sql
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

### Use Transactions Appropriately

Implement transaction management:

```java
@Service
@Transactional(readOnly = true)
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    
    public OrderService(OrderRepository orderRepository, PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.paymentService = paymentService;
    }
    
    @Transactional
    public Order placeOrder(OrderRequest request) {
        // Create order
        Order order = new Order();
        // Set order details
        order = orderRepository.save(order);
        
        // Process payment
        paymentService.processPayment(order);
        
        return order;
    }
}
```

### Connection Pooling

Configure connection pooling properly:

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.connection-timeout=20000
```

## Performance Optimization

### Implement Caching

Use Spring's caching abstraction:

```java
@Configuration
@EnableCaching
public class CachingConfig {
    
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("products"),
            new ConcurrentMapCache("categories")
        ));
        return cacheManager;
    }
}

@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        // This will be cached
        return productRepository.findById(id).orElseThrow();
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public void updateProduct(Product product) {
        productRepository.save(product);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearCache() {
        // Clears the entire cache
    }
}
```

### Use Async Processing

Implement asynchronous processing for long-running tasks:

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        executor.setThreadNamePrefix("AsyncTask-");
        return executor;
    }
}

@Service
public class EmailService {
    
    @Async("taskExecutor")
    public CompletableFuture<Void> sendEmail(String to, String subject, String content) {
        // Send email asynchronously
        // ...
        return CompletableFuture.completedFuture(null);
    }
}
```

### Pagination and Efficient Querying

Implement pagination for large result sets:

```java
@GetMapping("/products")
public Page<ProductDTO> getProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id") String sortBy) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    return productRepository.findAll(pageable).map(productMapper::toDto);
}
```

Use projection for partial data retrieval:

```java
public interface ProductSummary {
    Long getId();
    String getName();
    BigDecimal getPrice();
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<ProductSummary> findAllBy();
}
```

### Optimize JPA

Tune JPA for performance:

```properties
# Batch processing
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Second-level cache
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
spring.jpa.properties.hibernate.javax.cache.provider=org.ehcache.jsr107.EhcacheCachingProvider
```

## Testing Strategies

### Unit Testing

Write effective unit tests:

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTests {

    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    @Test
    void shouldReturnProductWhenExists() {
        // Arrange
        Product product = new Product(1L, "Test Product", BigDecimal.TEN);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        
        // Act
        Product result = productService.getProduct(1L);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Product");
        verify(productRepository).findById(1L);
    }
    
    @Test
    void shouldThrowExceptionWhenProductNotFound() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> productService.getProduct(1L))
                .isInstanceOf(NotFoundException.class);
    }
}
```

### Integration Testing

Implement integration tests:

```java
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProductIntegrationTests {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;
    
    @Test
    void shouldSaveAndRetrieveProduct() {
        // Arrange
        Product product = new Product();
        product.setName("Integration Test Product");
        product.setPrice(BigDecimal.valueOf(29.99));
        
        // Act
        Product saved = productRepository.save(product);
        Product retrieved = productService.getProduct(saved.getId());
        
        // Assert
        assertThat(retrieved).isNotNull();
        assertThat(retrieved.getName()).isEqualTo("Integration Test Product");
    }
}
```

### Test Slices

Use test slices for focused testing:

```java
@WebMvcTest(ProductController.class)
class ProductControllerTests {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProductService productService;
    
    @Test
    void shouldReturnProductWhenExists() throws Exception {
        // Arrange
        ProductDTO product = new ProductDTO(1L, "Test Product", BigDecimal.TEN);
        when(productService.getProductDto(1L)).thenReturn(product);
        
        // Act & Assert
        mockMvc.perform(get("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.price").value(10));
    }
}

@DataJpaTest
class ProductRepositoryTests {

    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void shouldFindProductsByCategory() {
        // Arrange
        Product product1 = new Product();
        product1.setName("Product 1");
        product1.setCategory("Electronics");
        productRepository.save(product1);
        
        Product product2 = new Product();
        product2.setName("Product 2");
        product2.setCategory("Books");
        productRepository.save(product2);
        
        // Act
        List<Product> electronics = productRepository.findByCategory("Electronics");
        
        // Assert
        assertThat(electronics).hasSize(1);
        assertThat(electronics.get(0).getName()).isEqualTo("Product 1");
    }
}
```

## Deployment Considerations

### Use Profiles for Different Environments

Configure environment-specific settings:

```properties
# application-dev.properties
logging.level.org.springframework=DEBUG
spring.datasource.url=jdbc:h2:mem:devdb

# application-prod.properties
logging.level.org.springframework=WARN
spring.datasource.url=${JDBC_DATABASE_URL}
```

### Implement Health Checks

Add comprehensive health checks:

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    
    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT 1");
            ps.executeQuery();
            return Health.up()
                    .withDetail("database", conn.getMetaData().getDatabaseProductName())
                    .withDetail("version", conn.getMetaData().getDatabaseProductVersion())
                    .build();
        } catch (SQLException e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

### Configure Actuator for Production

Set up Actuator properly:

```properties
# Enable specific endpoints
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized
management.health.probes.enabled=true

# Enable Kubernetes probes
management.endpoint.health.group.readiness.include=readinessState,db
management.endpoint.health.group.liveness.include=livenessState
```

### Implement Graceful Shutdown

Configure graceful application shutdown:

```properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=20s
```

## Monitoring and Maintenance

### Configure Comprehensive Logging

Set up appropriate logging:

```properties
# File logging
logging.file.name=/var/log/myapp.log
logging.file.max-size=10MB
logging.file.max-history=10

# Log levels
logging.level.root=INFO
logging.level.org.springframework.web=WARN
logging.level.com.example.myapp=DEBUG

# JSON format for cloud
logging.pattern.console={"time":"%d","level":"%p","thread":"%t","class":"%logger{40}","message":"%m"}%n
```

### Implement Metrics Collection

Add custom metrics:

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final MeterRegistry meterRegistry;
    
    public ProductController(ProductService productService, MeterRegistry meterRegistry) {
        this.productService = productService;
        this.meterRegistry = meterRegistry;
    }
    
    @GetMapping("/{id}")
    public ProductDTO getProduct(@PathVariable Long id) {
        meterRegistry.counter("product.access", "id", id.toString()).increment();
        return productService.getProductDto(id);
    }
}
```

### Implement Circuit Breakers

Use circuit breakers for external service calls:

```java
@Service
public class ExternalServiceClient {

    private final RestTemplate restTemplate;
    
    // Constructor
    
    @CircuitBreaker(name = "externalService", fallbackMethod = "getDefaultData")
    public ApiResponse getData(String id) {
        return restTemplate.getForObject("/api/data/{id}", ApiResponse.class, id);
    }
    
    public ApiResponse getDefaultData(String id, Exception e) {
        return new ApiResponse("Default data for " + id);
    }
}
```

## Common Pitfalls to Avoid

### Bean Initialization Issues

Avoid circular dependencies:

```java
// Problem
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA;
}

// Solution
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Service
public class ServiceB {
    // Use a different pattern or refactor to eliminate circular dependency
}
```

### N+1 Query Problem

Avoid the N+1 query anti-pattern:

```java
// Problem
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    // This causes N additional queries
    List<OrderItem> items = order.getItems();
}

// Solution
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items")
    List<Order> findAllWithItems();
}

List<Order> orders = orderRepository.findAllWithItems();
```

### Excessive Memory Usage

Avoid loading large datasets into memory:

```java
// Problem
List<User> allUsers = userRepository.findAll(); // Might load millions of records

// Solution
Pageable pageable = PageRequest.of(0, 100);
Page<User> userPage = userRepository.findAll(pageable);

// Process first page
processUsers(userPage.getContent());

// Process subsequent pages if needed
while (userPage.hasNext()) {
    pageable = userPage.nextPageable();
    userPage = userRepository.findAll(pageable);
    processUsers(userPage.getContent());
}
```

### Missing Error Handling

Always handle exceptions properly:

```java
// Problem
public User getUser(Long id) {
    return userRepository.findById(id).get(); // NoSuchElementException if not found
}

// Solution
public User getUser(Long id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
}
```

### Security Misconfigurations

Avoid common security pitfalls:

```java
// Problem - disabled CSRF without proper alternative
http.csrf().disable();

// Solution - only disable if you have good reason and implement alternatives
http
    .csrf().disable() // Only if using token-based auth with proper practices
    .headers(headers -> headers
        .contentSecurityPolicy("default-src 'self'")
        .frameOptions().deny()
    )
    .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    );
```

## Summary

This guide covered essential best practices for Spring Boot development:

- Organize your project with a proper architecture
- Follow coding practices that enhance maintainability
- Implement proper configuration management
- Apply security best practices to protect your application
- Optimize database access and data management
- Implement performance optimizations
- Write effective tests using Spring Boot's testing facilities
- Follow deployment best practices
- Implement proper monitoring and maintenance
- Avoid common pitfalls

Following these practices will help you build robust, maintainable, and efficient Spring Boot applications that are secure and perform well in production.

## Further Reading

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/index.html)
- [Spring Boot Production-Ready Features](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Spring Boot Testing Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/) 