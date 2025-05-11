# Spring Boot Data Access

## Overview
This guide covers data access in Spring Boot applications, exploring the various approaches and technologies for working with databases. It introduces Spring Data's key concepts, Spring Boot's auto-configuration for data sources, transaction management, and different persistence mechanisms. By the end of this guide, you'll understand how to effectively implement data access layers in Spring Boot applications, following best practices for maintainability, performance, and security.

## Prerequisites
- Basic knowledge of Java and Spring Boot concepts
- Understanding of relational and/or NoSQL database concepts
- Familiarity with SQL query language
- Basic understanding of ORM (Object-Relational Mapping) concepts
- Spring Boot development environment set up

## Learning Objectives
- Configure data sources in Spring Boot applications
- Understand Spring Boot's auto-configuration for data access
- Implement data access layers using Spring JDBC, JPA, and Spring Data
- Configure multiple data sources
- Work with database migrations
- Understand and implement transaction management
- Test data access components
- Optimize database operations for performance

## Table of Contents
1. [Data Access Overview in Spring Boot](#data-access-overview-in-spring-boot)
2. [Configuring Data Sources](#configuring-data-sources)
3. [Working with JDBC in Spring Boot](#working-with-jdbc-in-spring-boot)
4. [Introduction to JPA](#introduction-to-jpa)
5. [Spring Data JPA Basics](#spring-data-jpa-basics)
6. [Transaction Management](#transaction-management)
7. [Database Migrations](#database-migrations)
8. [Working with Multiple Data Sources](#working-with-multiple-data-sources)
9. [Auditing with Spring Data](#auditing-with-spring-data)
10. [Caching for Data Access](#caching-for-data-access)
11. [Performance Optimization](#performance-optimization)
12. [Testing Data Access Layers](#testing-data-access-layers)
13. [Security Considerations](#security-considerations)
14. [Best Practices](#best-practices)

## Data Access Overview in Spring Boot

Spring Boot offers extensive support for data access, building on Spring Framework's data access features while adding auto-configuration and starter dependencies to simplify setup and configuration.

### Spring Data Access Landscape

Spring Boot supports multiple approaches to data access:

1. **Spring JDBC**: For low-level JDBC operations with reduced boilerplate
2. **Spring Data JPA**: For ORM-based access using JPA
3. **Spring Data MongoDB**: For MongoDB document database access
4. **Spring Data Redis**: For Redis key-value store operations
5. **Spring Data Elasticsearch**: For Elasticsearch search operations
6. **Spring Data JDBC**: For JDBC access with simplified mapping
7. **Spring Data R2DBC**: For reactive relational database access

Each approach has its strengths and is suitable for different scenarios.

### Spring Boot's Auto-Configuration

Spring Boot automatically configures your data access layer based on:
- Dependencies on your classpath
- Configuration properties in application.properties/application.yml
- Beans defined in your application context

This auto-configuration typically includes:
- DataSource configuration
- EntityManagerFactory setup (for JPA)
- Transaction manager configuration
- Repository interface detection and implementation
- Connection pooling setup

### Architecture of Data Access in Spring Applications

A typical data access architecture in Spring applications consists of:

1. **Entity Layer**: Domain model objects representing database tables/documents
2. **Repository Layer**: Interfaces defining data access operations
3. **Service Layer**: Business logic using repositories
4. **Controller Layer**: Exposing data operations via APIs

```
Controller → Service → Repository → Entity
```

The repository layer abstracts the underlying data store, allowing services to focus on business logic rather than data access mechanics.

### Performance and Maintenance Considerations

When setting up data access in Spring Boot, consider:

- **Connection Pooling**: Properly sized connection pools
- **N+1 Query Problem**: Fetching relations efficiently
- **Lazy vs. Eager Loading**: Choosing appropriate fetch strategies
- **Batch Processing**: For handling large datasets
- **Caching**: To reduce database load
- **Database Migrations**: For maintaining schema changes

In the following sections, we'll explore these concepts in detail, starting with configuring data sources in Spring Boot.

## Configuring Data Sources

A DataSource is the starting point for database access in a Spring Boot application, representing a connection factory for a database.

### Basic DataSource Configuration

Spring Boot can auto-configure a DataSource based on:
- The presence of a database driver on the classpath
- Configuration in application.properties/application.yml

#### Maven/Gradle Dependencies

For H2 in-memory database (development/testing):

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

For MySQL:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

For PostgreSQL:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### Configuration Properties

**application.properties**:

```properties
# H2 Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# MySQL
# spring.datasource.url=jdbc:mysql://localhost:3306/mydb
# spring.datasource.username=user
# spring.datasource.password=password
# spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# PostgreSQL
# spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
# spring.datasource.username=user
# spring.datasource.password=password
# spring.datasource.driver-class-name=org.postgresql.Driver
```

**application.yml**:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  h2:
    console:
      enabled: true
```

### Connection Pooling

Spring Boot uses HikariCP as the default connection pool. You can configure it with:

```properties
# Connection pool settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.max-lifetime=1800000
```

### Programmatic DataSource Configuration

For more control, you can define a DataSource bean:

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

Or with more specific configurations:

```java
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        config.setUsername("user");
        config.setPassword("password");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        
        return new HikariDataSource(config);
    }
}
```

### Embedded Database Configuration

For development and testing, you can use embedded databases:

```java
@Configuration
public class EmbeddedDataSourceConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .addScript("schema.sql")
                .addScript("data.sql")
                .build();
    }
}
```

### JNDI DataSource Configuration

For application servers that provide JNDI resources:

```properties
spring.datasource.jndi-name=java:comp/env/jdbc/myDataSource
```

### DataSource Initialization

Spring Boot can initialize your database using SQL scripts:

```properties
# Initialize the schema
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql
```

### Testing with Test Containers

For integration tests, TestContainers provides real database instances via Docker:

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.18.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.18.0</version>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest
@Testcontainers
class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void testDatabaseConnection() {
        // Test code
    }
}
```

## Working with JDBC in Spring Boot

While higher-level abstractions like JPA are popular, JDBC remains a powerful option for data access in Spring Boot, especially for:
- Simple applications with straightforward data access needs
- Performance-critical operations requiring fine-grained control
- Legacy database interactions

### Spring JDBC Templates

Spring provides JdbcTemplate to simplify JDBC operations, handling connection management, exception translation, and result set processing:

#### Maven Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

#### Basic JdbcTemplate Usage

```java
@Service
public class ProductService {

    private final JdbcTemplate jdbcTemplate;

    public ProductService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Query for a single object
    public Product findById(Long id) {
        return jdbcTemplate.queryForObject(
                "SELECT id, name, price FROM products WHERE id = ?",
                new Object[]{id},
                (rs, rowNum) -> {
                    Product product = new Product();
                    product.setId(rs.getLong("id"));
                    product.setName(rs.getString("name"));
                    product.setPrice(rs.getBigDecimal("price"));
                    return product;
                });
    }

    // Query for multiple objects
    public List<Product> findAll() {
        return jdbcTemplate.query(
                "SELECT id, name, price FROM products",
                (rs, rowNum) -> {
                    Product product = new Product();
                    product.setId(rs.getLong("id"));
                    product.setName(rs.getString("name"));
                    product.setPrice(rs.getBigDecimal("price"));
                    return product;
                });
    }

    // Insert operation
    public void save(Product product) {
        jdbcTemplate.update(
                "INSERT INTO products (name, price) VALUES (?, ?)",
                product.getName(), product.getPrice());
    }

    // Update operation
    public void update(Product product) {
        jdbcTemplate.update(
                "UPDATE products SET name = ?, price = ? WHERE id = ?",
                product.getName(), product.getPrice(), product.getId());
    }

    // Delete operation
    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
    }
}
```

### Using NamedParameterJdbcTemplate

For more readable SQL statements with named parameters:

```java
@Service
public class ProductNamedParamService {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public ProductNamedParamService(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Product findById(Long id) {
        Map<String, Object> params = Map.of("id", id);
        
        return jdbcTemplate.queryForObject(
                "SELECT id, name, price FROM products WHERE id = :id",
                params,
                (rs, rowNum) -> {
                    Product product = new Product();
                    product.setId(rs.getLong("id"));
                    product.setName(rs.getString("name"));
                    product.setPrice(rs.getBigDecimal("price"));
                    return product;
                });
    }

    public void save(Product product) {
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("name", product.getName())
                .addValue("price", product.getPrice());
                
        jdbcTemplate.update(
                "INSERT INTO products (name, price) VALUES (:name, :price)",
                params);
    }
}
```

### Row Mappers

Extract the mapping logic for reusability:

```java
public class ProductRowMapper implements RowMapper<Product> {
    @Override
    public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
        Product product = new Product();
        product.setId(rs.getLong("id"));
        product.setName(rs.getString("name"));
        product.setPrice(rs.getBigDecimal("price"));
        return product;
    }
}

@Service
public class ProductServiceWithMapper {
    private final JdbcTemplate jdbcTemplate;
    private final ProductRowMapper rowMapper = new ProductRowMapper();

    public ProductServiceWithMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Product> findAll() {
        return jdbcTemplate.query("SELECT id, name, price FROM products", rowMapper);
    }
}
```

### Batch Operations

For efficient bulk operations:

```java
@Service
public class ProductBatchService {
    private final JdbcTemplate jdbcTemplate;

    public ProductBatchService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void batchInsert(List<Product> products) {
        jdbcTemplate.batchUpdate(
                "INSERT INTO products (name, price) VALUES (?, ?)",
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement ps, int i) throws SQLException {
                        Product product = products.get(i);
                        ps.setString(1, product.getName());
                        ps.setBigDecimal(2, product.getPrice());
                    }

                    @Override
                    public int getBatchSize() {
                        return products.size();
                    }
                });
    }
}
```

### Using SimpleJdbcClasses

For simpler JDBC operations:

```java
@Service
public class ProductSimpleJdbcService {
    private final SimpleJdbcInsert simpleJdbcInsert;

    public ProductSimpleJdbcService(DataSource dataSource) {
        this.simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("products")
                .usingGeneratedKeyColumns("id");
    }

    public Long save(Product product) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("name", product.getName());
        parameters.put("price", product.getPrice());
        
        Number key = simpleJdbcInsert.executeAndReturnKey(parameters);
        return key.longValue();
    }
}
```

### Schema Management with JDBC

Manage database schema with SQL scripts:

```properties
# Schema initialization
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql
```

schema.sql:
```sql
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

data.sql:
```sql
INSERT INTO products (name, price) VALUES ('Product 1', 19.99);
INSERT INTO products (name, price) VALUES ('Product 2', 29.99);
```

### Transaction Management with JDBC

For transaction management:

```java
@Service
@Transactional
public class OrderService {
    private final JdbcTemplate jdbcTemplate;

    public OrderService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void placeOrder(Order order) {
        // Create order
        jdbcTemplate.update(
                "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
                order.getCustomerId(), order.getTotalAmount());
        
        // Create order items
        for (OrderItem item : order.getItems()) {
            jdbcTemplate.update(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                    order.getId(), item.getProductId(), item.getQuantity(), item.getPrice());
            
            // Update inventory
            jdbcTemplate.update(
                    "UPDATE inventory SET stock = stock - ? WHERE product_id = ?",
                    item.getQuantity(), item.getProductId());
        }
    }
}
```

### JDBC Best Practices

1. **Use Connection Pooling**: Always configure proper connection pooling
2. **Parameterize Queries**: Avoid SQL injection with prepared statements
3. **Batch Operations**: Use batch updates for multiple operations
4. **Transaction Management**: Properly manage transactions
5. **Handle Exceptions**: Use Spring's exception translation
6. **Close Resources**: Ensure all JDBC resources are properly closed
7. **Pagination**: Implement pagination for large result sets
8. **Avoid Over-fetching**: Only select the columns you need
9. **Use Column Aliases**: For clarity in complex queries
10. **Consider Stored Procedures**: For complex operations

## Introduction to JPA

The Java Persistence API (JPA) provides an object-relational mapping (ORM) approach for Java applications. It allows you to work with relational databases using Java objects, reducing the amount of JDBC code required.

### JPA vs. JDBC

| Aspect | JPA | JDBC |
|--------|-----|------|
| Abstraction Level | High | Low |
| SQL Knowledge Required | Minimal | Extensive |
| Code Volume | Less | More |
| Performance Control | Limited | Detailed |
| Learning Curve | Steeper | Simpler |
| Database Portability | Better | Limited |
| Complex Query Support | Limited | Complete |

### Setting Up JPA in Spring Boot

#### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### JPA Configuration

```properties
# Basic JPA properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Options for `spring.jpa.hibernate.ddl-auto`:
- `none`: No schema initialization
- `validate`: Validate schema, no changes to database
- `update`: Update schema
- `create`: Create schema, dropping existing tables first
- `create-drop`: Create schema on startup, drop on shutdown

### Entity Definition

Entities are Java classes mapped to database tables:

```java
@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Getters and setters
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
```

### Relationships

#### One-to-One

```java
@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private UserProfile profile;
    
    // Getters and setters
}

@Entity
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    
    @OneToOne(mappedBy = "profile")
    private User user;
    
    // Getters and setters
}
```

#### One-to-Many

```java
@Entity
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();
    
    // Getters and setters
}

@Entity
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Getters and setters
}
```

#### Many-to-Many

```java
@Entity
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany
    @JoinTable(
        name = "product_tag",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
    
    // Getters and setters
}

@Entity
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany(mappedBy = "tags")
    private Set<Product> products = new HashSet<>();
    
    // Getters and setters
}
```

### Basic JPA Operations

Using the EntityManager directly:

```java
@Service
public class ProductService {

    @PersistenceContext
    private EntityManager entityManager;
    
    @Transactional
    public void save(Product product) {
        entityManager.persist(product);
    }
    
    @Transactional
    public Product update(Product product) {
        return entityManager.merge(product);
    }
    
    @Transactional
    public void delete(Long id) {
        Product product = entityManager.find(Product.class, id);
        if (product != null) {
            entityManager.remove(product);
        }
    }
    
    public Product findById(Long id) {
        return entityManager.find(Product.class, id);
    }
    
    public List<Product> findAll() {
        return entityManager.createQuery("SELECT p FROM Product p", Product.class)
                .getResultList();
    }
}
```

### JPQL (JPA Query Language)

JPA provides its own query language similar to SQL:

```java
@Service
public class ProductJPQLService {

    @PersistenceContext
    private EntityManager entityManager;
    
    public List<Product> findByNameLike(String name) {
        return entityManager.createQuery(
                "SELECT p FROM Product p WHERE p.name LIKE :name", Product.class)
                .setParameter("name", "%" + name + "%")
                .getResultList();
    }
    
    public List<Product> findByPriceRange(BigDecimal min, BigDecimal max) {
        return entityManager.createQuery(
                "SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max", Product.class)
                .setParameter("min", min)
                .setParameter("max", max)
                .getResultList();
    }
    
    public List<Object[]> findProductCounts() {
        return entityManager.createQuery(
                "SELECT c.name, COUNT(p) FROM Category c JOIN c.products p GROUP BY c.name")
                .getResultList();
    }
}
``` 

## Spring Data JPA Basics

Spring Data JPA simplifies the implementation of JPA-based repositories by abstracting much of the boilerplate code required when working directly with the EntityManager.

### Spring Data JPA Repositories

Spring Data JPA provides interfaces that enable you to define repositories with minimal code:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // That's it! You get CRUD operations for free
}
```

The `JpaRepository` interface provides methods like:
- `save(entity)`: Save or update an entity
- `findById(id)`: Find an entity by ID
- `findAll()`: Get all entities
- `delete(entity)`: Delete an entity
- `count()`: Count total entities
- And more...

### Using the Repository

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> findProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```

### Repository Query Methods

Spring Data JPA can generate queries based on method names:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Find by attribute
    List<Product> findByName(String name);
    
    // Find with multiple conditions
    List<Product> findByNameAndPrice(String name, BigDecimal price);
    
    // Using comparison operators
    List<Product> findByPriceGreaterThan(BigDecimal price);
    
    // Using LIKE
    List<Product> findByNameContaining(String namePart);
    
    // Order results
    List<Product> findByNameContainingOrderByPriceDesc(String namePart);
    
    // Limit results
    List<Product> findTop5ByOrderByCreatedAtDesc();
    
    // Using nested properties
    List<Product> findByCategoryName(String categoryName);
    
    // Using IN operator
    List<Product> findByIdIn(List<Long> ids);
    
    // More advanced expressions
    List<Product> findByNameIgnoreCaseAndPriceBetween(
            String name, BigDecimal minPrice, BigDecimal maxPrice);
}
```

### Custom Queries with @Query

For more complex queries, use the `@Query` annotation:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // JPQL query
    @Query("SELECT p FROM Product p WHERE p.price > ?1 AND p.category.name = ?2")
    List<Product> findExpensiveProductsByCategory(BigDecimal price, String categoryName);
    
    // Using named parameters
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
    
    // Native SQL query
    @Query(value = "SELECT * FROM products WHERE created_at > :date", nativeQuery = true)
    List<Product> findRecentProductsNative(@Param("date") LocalDateTime date);
    
    // Count query
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    long countByCategoryId(@Param("categoryId") Long categoryId);
    
    // Update query
    @Modifying
    @Query("UPDATE Product p SET p.price = p.price * :factor WHERE p.category.id = :categoryId")
    int updatePriceForCategory(@Param("factor") BigDecimal factor, @Param("categoryId") Long categoryId);
}
```

### Paging and Sorting

Spring Data provides built-in support for pagination and sorting:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Method with paging and sorting
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Method with sorting
    List<Product> findByNameContaining(String name, Sort sort);
}
```

Using pagination and sorting:

```java
@Service
public class ProductPageService {
    
    private final ProductRepository productRepository;
    
    public ProductPageService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Page<Product> findProductsByCategoryPaged(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return productRepository.findByCategoryId(categoryId, pageable);
    }
    
    public List<Product> findProductsSorted() {
        // Multiple sort criteria
        Sort sort = Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.asc("name")
        );
        
        return productRepository.findAll(sort);
    }
    
    public Page<Product> findAllProductsPaged(int page, int size, String sortField, String direction) {
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortField));
        return productRepository.findAll(pageable);
    }
}
```

### Specifications

For dynamic queries, use Specifications:

```java
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    // JpaSpecificationExecutor adds methods like findAll(Specification)
}
```

Using Specifications:

```java
@Service
public class ProductSpecificationService {
    
    private final ProductRepository productRepository;
    
    public ProductSpecificationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> findProductsByFilters(
            String name, 
            BigDecimal minPrice, 
            BigDecimal maxPrice, 
            Long categoryId) {
        
        Specification<Product> spec = Specification.where(null);
        
        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                    cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> 
                    cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> 
                    cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }
        
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> 
                    cb.equal(root.get("category").get("id"), categoryId));
        }
        
        return productRepository.findAll(spec);
    }
}
```

### Projection Interfaces

To retrieve only specific fields:

```java
public interface ProductSummary {
    Long getId();
    String getName();
    BigDecimal getPrice();
    
    // Computed attribute
    @Value("#{target.name + ' - $' + target.price}")
    String getNameWithPrice();
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<ProductSummary> findByCategory_Name(String categoryName);
    
    // Dynamically choose between projections
    <T> List<T> findByPriceGreaterThan(BigDecimal price, Class<T> type);
}
```

Using projections:

```java
@Service
public class ProductProjectionService {
    
    private final ProductRepository productRepository;
    
    public ProductProjectionService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<ProductSummary> findProductSummariesByCategory(String categoryName) {
        return productRepository.findByCategory_Name(categoryName);
    }
    
    public List<ProductSummary> findExpensiveProductSummaries(BigDecimal minPrice) {
        return productRepository.findByPriceGreaterThan(minPrice, ProductSummary.class);
    }
}
```

### Custom Repository Implementations

For methods that can't be expressed with query methods or `@Query`:

```java
// Define custom functionality
public interface CustomProductRepository {
    List<Product> findBySalesStats(int minSales, double ratingThreshold);
}

// Main repository interface
public interface ProductRepository extends 
        JpaRepository<Product, Long>, 
        CustomProductRepository {
    // Regular Spring Data JPA methods
}

// Implementation
@Repository
public class CustomProductRepositoryImpl implements CustomProductRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Product> findBySalesStats(int minSales, double ratingThreshold) {
        // Complex query using criteria API
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> product = query.from(Product.class);
        
        // Join to sales statistics
        Join<Product, SalesStatistics> stats = product.join("salesStatistics");
        
        // Build predicates
        Predicate salesPredicate = cb.greaterThanOrEqualTo(stats.get("totalSales"), minSales);
        Predicate ratingPredicate = cb.greaterThanOrEqualTo(stats.get("averageRating"), ratingThreshold);
        
        // Combine predicates and execute
        query.where(cb.and(salesPredicate, ratingPredicate));
        return entityManager.createQuery(query).getResultList();
    }
}
```

### Auditing with Spring Data

Track entity creation and modification:

```java
@Configuration
@EnableJpaAuditing
public class AuditingConfig {
    
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }
}

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;
    
    // Getters
}

@Entity
public class Product extends Auditable {
    // Product fields
}
```

### Event Listeners

React to entity lifecycle events:

```java
@Entity
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String status;
    
    // Other fields
    
    @PrePersist
    public void onPrePersist() {
        if (status == null) {
            status = "PENDING";
        }
    }
    
    @PostPersist
    public void onPostPersist() {
        System.out.println("Order created with ID: " + id);
    }
    
    @PreUpdate
    public void onPreUpdate() {
        // Logic before update
    }
    
    @PostUpdate
    public void onPostUpdate() {
        // Logic after update
    }
    
    @PreRemove
    public void onPreRemove() {
        // Logic before removal
    }
    
    @PostRemove
    public void onPostRemove() {
        // Logic after removal
    }
    
    @PostLoad
    public void onPostLoad() {
        // Logic after entity is loaded
    }
}
```

### Entity Graphs

To solve the N+1 query problem with lazy loading:

```java
@Entity
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;
    
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Set<Review> reviews;
    
    // Named entity graph
    @NamedEntityGraph(
        name = "Product.withCategoryAndReviews",
        attributeNodes = {
            @NamedAttributeNode("category"),
            @NamedAttributeNode("reviews")
        }
    )
    
    // Getters and setters
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Use predefined entity graph
    @EntityGraph(value = "Product.withCategoryAndReviews")
    List<Product> findAll();
    
    // Define ad-hoc entity graph
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findById(Long id);
    
    // Use different fetch modes
    @EntityGraph(value = "Product.withCategoryAndReviews", type = EntityGraph.EntityGraphType.LOAD)
    List<Product> findByNameContaining(String name);
}
```

### Spring Data JPA Best Practices

1. **Use DTOs**: Avoid returning entities directly from controllers to prevent serialization issues
2. **Pagination**: Always use pagination for large result sets
3. **Batch Processing**: Use batch operations for bulk database operations
4. **Avoid N+1 Queries**: Use entity graphs or fetch joins for related entities
5. **Eager vs. Lazy Loading**: Choose appropriate fetch strategies
6. **Minimize Locking**: Be cautious with pessimistic locking
7. **Transactional Management**: Use appropriate transaction boundaries
8. **Cache Wisely**: Configure second-level cache for read-heavy entities
9. **Projection Over Full Entities**: Use projections when you don't need all fields
10. **Query Method Naming**: Follow the Spring Data naming conventions

## Transaction Management

Transactions ensure that database operations are executed reliably, following the ACID properties (Atomicity, Consistency, Isolation, Durability).

### Declarative Transaction Management

Spring's declarative transaction management using `@Transactional`:

```java
@Service
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    
    // Constructor
    
    // Inherits transaction from class-level annotation
    public Order createOrder(OrderRequest request) {
        // Check inventory
        for (OrderItemRequest item : request.getItems()) {
            Inventory inventory = inventoryRepository.findByProductId(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not in inventory"));
                    
            if (inventory.getQuantity() < item.getQuantity()) {
                throw new InsufficientInventoryException("Not enough inventory");
            }
        }
        
        // Create order
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setStatus("PENDING");
        
        Set<OrderItem> items = request.getItems().stream()
                .map(this::createOrderItem)
                .collect(Collectors.toSet());
                
        order.setItems(items);
        order.calculateTotal();
        
        Order savedOrder = orderRepository.save(order);
        
        // Update inventory
        for (OrderItemRequest item : request.getItems()) {
            inventoryRepository.decrementQuantity(item.getProductId(), item.getQuantity());
        }
        
        return savedOrder;
    }
    
    // Override class-level transaction settings
    @Transactional(readOnly = true)
    public Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));
    }
    
    // Custom transaction attributes
    @Transactional(timeout = 5, propagation = Propagation.REQUIRES_NEW)
    public void processPayment(Long orderId, PaymentRequest paymentRequest) {
        // Process payment...
    }
    
    private OrderItem createOrderItem(OrderItemRequest itemRequest) {
        Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
                
        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(itemRequest.getQuantity());
        item.setPrice(product.getPrice());
        
        return item;
    }
}
```

### Transaction Attributes

The `@Transactional` annotation supports several attributes:

- **propagation**: How transactions relate to each other
  - `REQUIRED`: Use current transaction or create new one (default)
  - `REQUIRES_NEW`: Always create a new transaction
  - `SUPPORTS`: Use current transaction if exists, otherwise non-transactional
  - `NOT_SUPPORTED`: Execute non-transactionally
  - `MANDATORY`: Must run within existing transaction
  - `NEVER`: Must not run within a transaction
  - `NESTED`: Execute within nested transaction if one exists

- **isolation**: Transaction isolation level
  - `DEFAULT`: Database default
  - `READ_UNCOMMITTED`: Dirty reads, non-repeatable reads, phantom reads possible
  - `READ_COMMITTED`: Dirty reads prevented, non-repeatable reads and phantom reads possible
  - `REPEATABLE_READ`: Dirty reads and non-repeatable reads prevented, phantom reads possible
  - `SERIALIZABLE`: All concurrency issues prevented but lowest concurrency

- **timeout**: Transaction timeout (seconds)
- **readOnly**: Hint to optimize read-only transactions
- **rollbackFor**: Exception types that trigger rollback
- **noRollbackFor**: Exception types that don't trigger rollback

### Programmatic Transaction Management

For more control, use programmatic transaction management:

```java
@Service
public class ManualTransactionService {
    
    private final PlatformTransactionManager transactionManager;
    private final OrderRepository orderRepository;
    
    public ManualTransactionService(
            PlatformTransactionManager transactionManager,
            OrderRepository orderRepository) {
        this.transactionManager = transactionManager;
        this.orderRepository = orderRepository;
    }
    
    public void processOrdersInBatch(List<OrderRequest> orderRequests) {
        TransactionDefinition definition = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(definition);
        
        try {
            for (OrderRequest request : orderRequests) {
                // Process each order
                Order order = createOrder(request);
                if (!validateOrder(order)) {
                    // If any order is invalid, roll back all
                    transactionManager.rollback(status);
                    return;
                }
            }
            
            // If all successful, commit
            transactionManager.commit(status);
        } catch (Exception e) {
            // Any exception causes rollback
            transactionManager.rollback(status);
            throw e;
        }
    }
    
    private Order createOrder(OrderRequest request) {
        // Create and save order...
        return new Order();
    }
    
    private boolean validateOrder(Order order) {
        // Validate order
        return true;
    }
}
```

### Transaction Template

For a middle ground between declarative and programmatic approaches:

```java
@Service
public class TransactionTemplateService {
    
    private final TransactionTemplate transactionTemplate;
    private final OrderRepository orderRepository;
    
    public TransactionTemplateService(
            PlatformTransactionManager transactionManager,
            OrderRepository orderRepository) {
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.orderRepository = orderRepository;
    }
    
    public Order createOrderWithTemplate(OrderRequest request) {
        return transactionTemplate.execute(status -> {
            try {
                Order order = new Order();
                // Set order properties
                
                // Save the order
                Order savedOrder = orderRepository.save(order);
                
                // Update inventory and other operations
                
                return savedOrder;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw e;
            }
        });
    }
    
    public List<Order> findOrdersWithReadOnlyTransaction(Long customerId) {
        TransactionTemplate readOnlyTx = new TransactionTemplate(transactionTemplate);
        readOnlyTx.setReadOnly(true);
        
        return readOnlyTx.execute(status -> 
                orderRepository.findByCustomerId(customerId));
    }
}
```

### Distributed Transactions

For operations spanning multiple databases:

```java
@Configuration
@EnableTransactionManagement
public class DistributedTransactionConfig {
    
    @Bean
    public PlatformTransactionManager transactionManager() {
        return new JtaTransactionManager();
    }
}

@Service
@Transactional
public class DistributedService {
    
    private final MainRepository mainRepository;
    private final AuditRepository auditRepository; // In different database
    
    // Both operations will be part of the same distributed transaction
    public void performDistributedOperation(Data data) {
        mainRepository.save(data);
        auditRepository.saveAuditLog("Data saved: " + data.getId());
    }
}
```

### Transaction Best Practices

1. **Keep Transactions Short**: Long-running transactions can lead to lock contention
2. **Use Appropriate Isolation Level**: Higher isolation levels reduce concurrency
3. **Consider Read-Only Transactions**: Mark read-only operations for performance
4. **Watch Transaction Boundaries**: Be aware of where transactions start and end
5. **Handle Exceptions Properly**: Understand which exceptions trigger rollback
6. **Be Careful with Self-Invocation**: Calls within same class bypass transaction proxy
7. **Avoid Unnecessary Transactions**: Don't use transactions for simple operations
8. **Test Transaction Boundaries**: Verify rollback behavior functions correctly
9. **Be Cautious with Distributed Transactions**: They can significantly impact performance
10. **Monitor Transaction Performance**: Watch transaction times and locking in production
