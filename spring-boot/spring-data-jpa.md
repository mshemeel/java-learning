# Spring Data JPA

## Overview
This guide explores Spring Data JPA, a part of the larger Spring Data family that makes it easy to implement JPA-based repositories. Spring Data JPA simplifies data access by reducing boilerplate code and providing powerful abstractions over JPA. It helps developers create repository implementations automatically, write sophisticated queries with minimal code, and focus on business logic rather than data access infrastructure.

## Prerequisites
- Basic knowledge of Java and Spring Boot
- Understanding of relational databases and SQL
- Familiarity with JPA concepts (entities, entity manager, JPQL)
- Development environment with Spring Boot set up

## Learning Objectives
- Understand the core concepts and benefits of Spring Data JPA
- Configure Spring Data JPA in Spring Boot applications
- Create and use Spring Data repositories
- Define custom query methods using method naming conventions
- Write custom queries with @Query annotation
- Implement pagination and sorting
- Define entity relationships properly
- Use specifications for dynamic queries
- Implement auditing with Spring Data JPA
- Optimize JPA for performance

## Table of Contents
1. [Introduction to Spring Data JPA](#introduction-to-spring-data-jpa)
2. [Setting Up Spring Data JPA](#setting-up-spring-data-jpa)
3. [Core Concepts](#core-concepts)
4. [Creating Repositories](#creating-repositories)
5. [Query Methods](#query-methods)
6. [Custom Queries with @Query](#custom-queries-with-query)
7. [Pagination and Sorting](#pagination-and-sorting)
8. [Specifications for Dynamic Queries](#specifications-for-dynamic-queries)
9. [Projections](#projections)
10. [Custom Repository Implementations](#custom-repository-implementations)
11. [Auditing](#auditing)
12. [Entity Relationships Best Practices](#entity-relationships-best-practices)
13. [Performance Optimization](#performance-optimization)
14. [Testing Spring Data JPA Repositories](#testing-spring-data-jpa-repositories)

## Introduction to Spring Data JPA

Spring Data JPA is a library that simplifies the development of JPA-based data access layers. It removes most of the boilerplate code required when working with JPA.

### What is Spring Data JPA?

Spring Data JPA is part of the larger Spring Data family, which aims to provide a familiar and consistent Spring-based programming model for data access while retaining the special traits of the underlying data store.

Spring Data JPA specifically focuses on adding enhanced support for JPA-based data access layers. It makes it easier to build Spring-powered applications that use data access technologies by:

- Reducing boilerplate code for repository implementations
- Providing powerful repository and custom object-mapping abstractions
- Dynamically generating queries from method names
- Supporting integration with custom repositories
- Allowing easy implementation of pagination and sorting

### Spring Data JPA vs. Plain JPA

Let's compare using Spring Data JPA with traditional JPA approaches:

**Traditional JPA Approach:**

```java
@Repository
public class ProductRepositoryImpl implements ProductRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Product findById(Long id) {
        return entityManager.find(Product.class, id);
    }
    
    @Override
    public List<Product> findAll() {
        return entityManager.createQuery("SELECT p FROM Product p", Product.class)
                .getResultList();
    }
    
    @Override
    public Product save(Product product) {
        if (product.getId() == null) {
            entityManager.persist(product);
            return product;
        } else {
            return entityManager.merge(product);
        }
    }
    
    @Override
    public void delete(Product product) {
        entityManager.remove(
                product.getId() != null ? 
                entityManager.find(Product.class, product.getId()) : 
                product
        );
    }
    
    @Override
    public List<Product> findByNameContaining(String name) {
        return entityManager.createQuery(
                "SELECT p FROM Product p WHERE p.name LIKE :name", 
                Product.class)
                .setParameter("name", "%" + name + "%")
                .getResultList();
    }
}
```

**Spring Data JPA Approach:**

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Finder method automatically implemented by Spring Data JPA
    List<Product> findByNameContaining(String name);
}
```

The Spring Data JPA approach results in significantly less code while providing the same functionality.

### Key Benefits of Spring Data JPA

1. **Reduced Boilerplate**: Implement repositories with minimal code
2. **Consistent API**: Standard CRUD operations across repositories
3. **Method Name Queries**: Create queries by defining method names
4. **Pagination and Sorting**: Built-in support for paged results
5. **Custom Queries**: Easy integration of custom JPQL and native SQL
6. **Type Safety**: Compile-time checking of queries
7. **Auditing**: Built-in support for entity auditing
8. **Integration**: Seamless integration with Spring Framework
9. **Specifications**: Type-safe query building for dynamic conditions
10. **Projections**: Return specific fields instead of complete entities

### Architecture of Spring Data JPA

Spring Data JPA fits into the Spring application architecture as follows:

```
Controller → Service → Repository (Spring Data JPA) → Entity Manager → Database
```

The key components are:

- **Repositories**: Interfaces that define data access methods
- **Entities**: JPA-annotated classes representing database tables
- **Repository Implementations**: Generated dynamically by Spring Data JPA
- **Entity Manager**: JPA component managed by Spring that handles database operations

## Setting Up Spring Data JPA

### Maven Dependencies

To use Spring Data JPA in a Spring Boot application, add the following dependencies:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Database driver (e.g., H2 for development) -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Or MySQL -->
<!-- 
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
-->

<!-- Or PostgreSQL -->
<!-- 
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
-->
```

### Basic Configuration

Spring Boot provides auto-configuration for Spring Data JPA. Configure it in `application.properties` or `application.yml`:

**application.properties**:
```properties
# DataSource Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
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
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### Configuring JPA Repositories

Enable JPA repositories by adding `@EnableJpaRepositories` to your configuration class:

```java
@Configuration
@EnableJpaRepositories(basePackages = "com.example.demo.repository")
@EntityScan(basePackages = "com.example.demo.model")
public class JpaConfig {
    // Additional configuration if needed
}
```

In Spring Boot, this is usually not necessary as `@SpringBootApplication` activates `@EnableJpaRepositories` automatically.

### Entity Class Example

Create JPA entities that represent database tables:

```java
@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "in_stock")
    private boolean inStock;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Constructors, getters, setters, equals, hashCode
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

## Core Concepts

Spring Data JPA is built around several core concepts that work together to simplify database access.

### Repositories

Repositories are interfaces that declare query methods. Spring Data JPA provides several repository interfaces:

1. **CrudRepository**: Basic CRUD operations
2. **PagingAndSortingRepository**: CRUD + pagination and sorting
3. **JpaRepository**: JPA-specific methods + CRUD + pagination and sorting

The hierarchy is as follows:
```
Repository (marker interface)
↑
CrudRepository
↑
PagingAndSortingRepository
↑
JpaRepository
```

### Domain Class

The domain class is the entity that the repository manages. It's specified as a generic type parameter:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Product: domain class
    // Long: ID type
}
```

### Query Methods

Query methods are methods declared in repository interfaces. Spring Data JPA generates the implementation based on the method name:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByName(String name);
    List<Product> findByPriceGreaterThan(BigDecimal price);
    Product findFirstByOrderByCreatedAtDesc();
    boolean existsByName(String name);
}
```

### Query Derivation

Spring Data JPA parses method names to derive queries:

1. Introductory clause: `find`, `get`, `read`, `query`, `search`, `stream`, `count`, `exists`, `delete`
2. Optional subject: `By`, `First`, `Top`, `Distinct`
3. Property expressions: `Name`, `PriceGreaterThan`, `CategoryName`
4. Operators: `And`, `Or`, `Between`, `LessThan`, `GreaterThan`, etc.
5. Ordering: `OrderBy[Property]Asc/Desc`

### Base Repository Methods

JpaRepository provides these methods out of the box:

```java
// From CrudRepository
<S extends T> S save(S entity);
<S extends T> Iterable<S> saveAll(Iterable<S> entities);
Optional<T> findById(ID id);
boolean existsById(ID id);
Iterable<T> findAll();
Iterable<T> findAllById(Iterable<ID> ids);
long count();
void deleteById(ID id);
void delete(T entity);
void deleteAllById(Iterable<? extends ID> ids);
void deleteAll(Iterable<? extends T> entities);
void deleteAll();

// From PagingAndSortingRepository
Iterable<T> findAll(Sort sort);
Page<T> findAll(Pageable pageable);

// From JpaRepository
void flush();
<S extends T> S saveAndFlush(S entity);
<S extends T> List<S> saveAllAndFlush(Iterable<S> entities);
void deleteAllInBatch(Iterable<T> entities);
void deleteAllByIdInBatch(Iterable<ID> ids);
void deleteAllInBatch();
T getOne(ID id);
T getById(ID id);
<S extends T> List<S> findAll(Example<S> example);
<S extends T> List<S> findAll(Example<S> example, Sort sort);
```

## Creating Repositories

Creating a Spring Data JPA repository is as simple as defining an interface:

### Basic Repository

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // That's it! You get CRUD operations for free
}
```

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

### Custom Base Repositories

You can define your own base repository interface:

```java
@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {
    Optional<T> findByIdAndActiveTrue(ID id);
    List<T> findAllByActiveTrue();
    // Other common methods
}

public interface ProductRepository extends BaseRepository<Product, Long> {
    // Specific product methods
}

public interface CategoryRepository extends BaseRepository<Category, Long> {
    // Specific category methods
}
```

Implement the custom base repository:

```java
public class BaseRepositoryImpl<T, ID> extends SimpleJpaRepository<T, ID> implements BaseRepository<T, ID> {
    
    private final EntityManager entityManager;
    private final JpaEntityInformation<T, ?> entityInformation;
    
    public BaseRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
        this.entityInformation = entityInformation;
    }
    
    @Override
    public Optional<T> findByIdAndActiveTrue(ID id) {
        // Implementation using Criteria API
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = builder.createQuery(getDomainClass());
        Root<T> root = query.from(getDomainClass());
        
        Predicate idPredicate = builder.equal(root.get("id"), id);
        Predicate activePredicate = builder.equal(root.get("active"), true);
        
        query.where(builder.and(idPredicate, activePredicate));
        
        try {
            T entity = entityManager.createQuery(query).getSingleResult();
            return Optional.of(entity);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }
    
    @Override
    public List<T> findAllByActiveTrue() {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = builder.createQuery(getDomainClass());
        Root<T> root = query.from(getDomainClass());
        
        query.where(builder.equal(root.get("active"), true));
        
        return entityManager.createQuery(query).getResultList();
    }
}
```

Configure Spring to use your custom repository base class:

```java
@Configuration
@EnableJpaRepositories(
    basePackages = "com.example.demo.repository",
    repositoryBaseClass = BaseRepositoryImpl.class
)
public class JpaConfig {
    // Config here
}
```

## Query Methods

Spring Data JPA can automatically generate query implementations based on method names.

### Method Name Syntax

The general format follows:
```
find[Limit][By][Property][Condition][OrderBy][Property][Direction]
```

Examples:
```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Simple property conditions
    List<Product> findByName(String name);
    List<Product> findByNameAndPrice(String name, BigDecimal price);
    List<Product> findByNameOrDescription(String name, String description);
    
    // Comparisons
    List<Product> findByPriceGreaterThan(BigDecimal price);
    List<Product> findByPriceLessThanEqual(BigDecimal price);
    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);
    
    // String operations
    List<Product> findByNameContaining(String namePart);
    List<Product> findByNameStartingWith(String prefix);
    List<Product> findByNameEndingWith(String suffix);
    List<Product> findByNameIgnoreCase(String name);
    
    // Collection operations
    List<Product> findByTagsIn(List<String> tags);
    List<Product> findByTagsNotIn(List<String> tags);
    
    // Null handling
    List<Product> findByDescriptionIsNull();
    List<Product> findByDescriptionIsNotNull();
    
    // Limiting results
    Product findFirstByOrderByCreatedAtDesc();
    List<Product> findTop5ByOrderByPriceDesc();
    
    // Nested properties
    List<Product> findByCategoryName(String categoryName);
    List<Product> findByCategory_NameAndCategory_Active(String name, boolean active);
    
    // Boolean checks
    List<Product> findByInStockTrue();
    List<Product> findByInStockFalse();
    
    // Sorting
    List<Product> findByNameContainingOrderByPriceAsc(String namePart);
    List<Product> findByInStockTrueOrderByCreatedAtDesc();
    
    // Existence queries
    boolean existsByName(String name);
    
    // Count queries
    long countByCategory_Id(Long categoryId);
    
    // Delete queries
    void deleteByName(String name);
}
```

### Supported Keywords

Here are the keywords supported for query method names:

| Keyword | Sample | JPQL |
|---------|--------|------|
| And | findByNameAndPrice | where x.name = ?1 and x.price = ?2 |
| Or | findByNameOrPrice | where x.name = ?1 or x.price = ?2 |
| Is, Equals | findByName, findByNameIs, findByNameEquals | where x.name = ?1 |
| Between | findByPriceBetween | where x.price between ?1 and ?2 |
| LessThan | findByPriceLessThan | where x.price < ?1 |
| LessThanEqual | findByPriceLessThanEqual | where x.price <= ?1 |
| GreaterThan | findByPriceGreaterThan | where x.price > ?1 |
| GreaterThanEqual | findByPriceGreaterThanEqual | where x.price >= ?1 |
| After | findByCreatedAtAfter | where x.createdAt > ?1 |
| Before | findByCreatedAtBefore | where x.createdAt < ?1 |
| IsNull | findByDescriptionIsNull | where x.description is null |
| IsNotNull, NotNull | findByDescriptionIsNotNull | where x.description is not null |
| Like | findByNameLike | where x.name like ?1 |
| NotLike | findByNameNotLike | where x.name not like ?1 |
| StartingWith | findByNameStartingWith | where x.name like ?1 (parameter bound with appended %) |
| EndingWith | findByNameEndingWith | where x.name like ?1 (parameter bound with prepended %) |
| Containing | findByNameContaining | where x.name like ?1 (parameter bound with % on both sides) |
| OrderBy | findByNameOrderByPriceDesc | where x.name = ?1 order by x.price desc |
| Not | findByNameNot | where x.name <> ?1 |
| In | findByNameIn | where x.name in ?1 |
| NotIn | findByNameNotIn | where x.name not in ?1 |
| True | findByActiveTrue | where x.active = true |
| False | findByActiveFalse | where x.active = false |
| IgnoreCase | findByNameIgnoreCase | where UPPER(x.name) = UPPER(?1) | 
```

## Custom Queries with @Query

When query method names become too complex or verbose, you can use the `@Query` annotation to define queries explicitly.

### Basic JPQL Queries

JPQL (Java Persistence Query Language) is a query language similar to SQL but operates on entities rather than database tables:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.price > ?1 AND p.category.name = ?2")
    List<Product> findExpensiveProductsByCategory(BigDecimal price, String categoryName);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1%")
    List<Product> searchByName(String keyword);
    
    @Query("SELECT p FROM Product p JOIN p.tags t WHERE t.name = ?1")
    List<Product> findByTagName(String tagName);
}
```

### Named Parameters

Named parameters make queries more readable:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.price > :minPrice AND p.category.name = :category")
    List<Product> findExpensiveProductsByCategory(
            @Param("minPrice") BigDecimal price, 
            @Param("category") String categoryName);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR p.name LIKE %:name%) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    List<Product> findByNameAndCategory(
            @Param("name") String name, 
            @Param("categoryId") Long categoryId);
}
```

### Native SQL Queries

For database-specific features or complex queries:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query(value = "SELECT * FROM products WHERE YEAR(created_at) = :year", nativeQuery = true)
    List<Product> findProductsCreatedInYear(@Param("year") int year);
    
    @Query(value = "SELECT p.* FROM products p " +
                  "JOIN product_tag pt ON p.id = pt.product_id " +
                  "JOIN tags t ON pt.tag_id = t.id " +
                  "WHERE t.name = :tagName", nativeQuery = true)
    List<Product> findByTagNameNative(@Param("tagName") String tagName);
    
    @Query(value = "SELECT DISTINCT p.* FROM products p " +
                  "JOIN order_items oi ON p.id = oi.product_id " +
                  "GROUP BY p.id " +
                  "HAVING COUNT(oi.id) > :minOrders " +
                  "ORDER BY COUNT(oi.id) DESC", nativeQuery = true)
    List<Product> findPopularProducts(@Param("minOrders") int minOrders);
}
```

### Returning Specific Columns

Return specific columns instead of full entities:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p.id, p.name, p.price FROM Product p WHERE p.category.id = :categoryId")
    List<Object[]> findProductSummaryByCategory(@Param("categoryId") Long categoryId);
    
    @Query("SELECT new com.example.demo.dto.ProductSummary(p.id, p.name, p.price) " +
           "FROM Product p WHERE p.category.id = :categoryId")
    List<ProductSummary> findProductDtoByCategory(@Param("categoryId") Long categoryId);
}
```

For the DTO approach, create a corresponding class:

```java
public class ProductSummary {
    private Long id;
    private String name;
    private BigDecimal price;
    
    // Constructor matching the query projection
    public ProductSummary(Long id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    // Getters
}
```

### Modifying Queries

For update and delete operations:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Modifying
    @Query("UPDATE Product p SET p.price = p.price * :factor WHERE p.category.id = :categoryId")
    int updatePricesByCategory(@Param("factor") BigDecimal factor, @Param("categoryId") Long categoryId);
    
    @Modifying
    @Query("DELETE FROM Product p WHERE p.createdAt < :date")
    int deleteProductsCreatedBefore(@Param("date") LocalDateTime date);
    
    @Modifying
    @Query("UPDATE Product p SET p.inStock = false WHERE p.id IN " +
           "(SELECT oi.product.id FROM OrderItem oi GROUP BY oi.product.id " +
           "HAVING SUM(oi.quantity) > (SELECT i.quantity FROM Inventory i WHERE i.product.id = oi.product.id))")
    int markOutOfStockProducts();
}
```

When using `@Modifying`, always add `@Transactional` to the service method:

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    @Transactional
    public int updateProductPrices(Long categoryId, BigDecimal factor) {
        return productRepository.updatePricesByCategory(factor, categoryId);
    }
    
    @Transactional
    public int cleanupOldProducts(int monthsOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(monthsOld);
        return productRepository.deleteProductsCreatedBefore(cutoffDate);
    }
}
```

### Query Techniques

#### Pagination with @Query

Combine custom queries with pagination:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryWithPagination(
            @Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query(value = "SELECT * FROM products WHERE price > :minPrice",
           countQuery = "SELECT COUNT(*) FROM products WHERE price > :minPrice",
           nativeQuery = true)
    Page<Product> findExpensiveProductsWithPagination(
            @Param("minPrice") BigDecimal minPrice, Pageable pageable);
}
```

#### Dynamic Conditions

Create dynamic queries with JPQL:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR p.name LIKE %:name%) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:inStock IS NULL OR p.inStock = :inStock)")
    List<Product> findByFilters(
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock);
}
```

#### Using SpEL Expressions

Spring Expression Language can make queries more dynamic:

```java
@Entity
public class Product {
    // Fields
    
    public static final String FIND_BY_EXPENSIVE = "SELECT p FROM Product p WHERE p.price > :price";
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("#{T(com.example.demo.model.Product).FIND_BY_EXPENSIVE}")
    List<Product> findExpensiveProducts(@Param("price") BigDecimal price);
    
    @Query("SELECT p FROM #{#entityName} p WHERE p.inStock = :inStock")
    List<Product> findByInStock(@Param("inStock") boolean inStock);
}
```

### Best Practices for Custom Queries

1. **Use Named Parameters**: They're more readable and less error-prone than indexed parameters
2. **Create DTOs for Projections**: When you need specific fields, create DTOs rather than using Object[]
3. **Provide Count Queries**: For paginated native queries, specify a count query
4. **Validate Queries at Startup**: Set `spring.jpa.properties.hibernate.query.fail_on_pagination_over_collection_fetch=true`
5. **Avoid N+1 Problems**: Use join fetch for related entities
6. **Test Your Queries**: Write tests to ensure queries work correctly
7. **Consider Query Readability**: Balance between method name queries and @Query for complex cases
8. **Use Native Queries Wisely**: Only when you need database-specific features
9. **Document Complex Queries**: Add comments explaining complex query logic
10. **Keep Queries in Repositories**: Don't spread queries across services or controllers

## Pagination and Sorting

Spring Data JPA provides robust support for pagination and sorting, which is essential for handling large datasets efficiently.

### Basic Pagination

Using `Pageable` to paginate results:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Method with pagination
    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);
    
    // Method with pagination and additional conditions
    Page<Product> findByNameContainingAndInStockTrue(String name, Pageable pageable);
}
```

Using pagination in a service:

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Page<Product> findProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategory_Id(categoryId, pageable);
    }
    
    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingAndInStockTrue(keyword, pageable);
    }
}
```

In a controller:

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDTO>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Product> products = productService.findProductsByCategory(categoryId, page, size);
        Page<ProductDTO> productDTOs = products.map(this::convertToDTO);
        
        return ResponseEntity.ok(productDTOs);
    }
    
    private ProductDTO convertToDTO(Product product) {
        // Conversion logic
        return new ProductDTO(/* ... */);
    }
}
```

### Sorting

Adding sorting to queries:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Method with sorting
    List<Product> findByCategory_Id(Long categoryId, Sort sort);
    
    // Method with pagination and sorting
    Page<Product> findByInStockTrue(Pageable pageable);
}
```

Using sorting in a service:

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> findProductsByCategorySorted(Long categoryId, String sortField, String direction) {
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Sort sort = Sort.by(dir, sortField);
        return productRepository.findByCategory_Id(categoryId, sort);
    }
    
    public List<Product> findProductsWithMultipleSortCriteria() {
        Sort sort = Sort.by(
                Sort.Order.desc("inStock"),
                Sort.Order.asc("name")
        );
        
        return productRepository.findAll(sort);
    }
    
    public Page<Product> findAvailableProductsPaged(int page, int size, String sortField) {
        Pageable pageable = PageRequest.of(
                page, size, Sort.by(Sort.Direction.ASC, sortField));
        
        return productRepository.findByInStockTrue(pageable);
    }
}
```

### Handling Page Results

The `Page` interface provides useful metadata:

```java
@Service
public class ProductAnalyticsService {
    
    private final ProductRepository productRepository;
    
    public ProductAnalyticsService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Map<String, Object> getProductStatistics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("content", productPage.getContent());
        stats.put("currentPage", productPage.getNumber());
        stats.put("totalItems", productPage.getTotalElements());
        stats.put("totalPages", productPage.getTotalPages());
        stats.put("isFirst", productPage.isFirst());
        stats.put("isLast", productPage.isLast());
        stats.put("hasNext", productPage.hasNext());
        stats.put("hasPrevious", productPage.hasPrevious());
        
        return stats;
    }
}
```

### Slice Instead of Page

When you don't need total counts:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Returns Slice instead of Page (more efficient for large datasets)
    Slice<Product> findByNameContaining(String name, Pageable pageable);
}
```

Using a slice:

```java
@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Slice<Product> findProductsWithEfficient Pagination(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContaining(name, pageable);
    }
    
    public boolean hasMoreProducts(String name, int page, int size) {
        Slice<Product> slice = findProductsWithEfficientPagination(name, page, size);
        return slice.hasNext();
    }
}
```

### Customizing Pagination Responses

For API responses, customize the pagination data:

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Page<Product> productPage = productService.findAllProductsPaged(
                page, size, sortBy, direction);
        
        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", productDTOs);
        response.put("pagination", createPaginationMap(productPage));
        
        return ResponseEntity.ok(response);
    }
    
    private Map<String, Object> createPaginationMap(Page<?> page) {
        Map<String, Object> pageData = new HashMap<>();
        pageData.put("currentPage", page.getNumber());
        pageData.put("totalPages", page.getTotalPages());
        pageData.put("totalElements", page.getTotalElements());
        pageData.put("size", page.getSize());
        
        // Add links for HATEOAS-style navigation
        Map<String, String> links = new HashMap<>();
        if (page.hasNext()) {
            links.put("next", "/api/products?page=" + (page.getNumber() + 1));
        }
        if (page.hasPrevious()) {
            links.put("prev", "/api/products?page=" + (page.getNumber() - 1));
        }
        links.put("first", "/api/products?page=0");
        links.put("last", "/api/products?page=" + (page.getTotalPages() - 1));
        
        pageData.put("links", links);
        return pageData;
    }
    
    private ProductDTO convertToDTO(Product product) {
        // Conversion logic
        return new ProductDTO(/* ... */);
    }
}
```

### Pagination and Sorting Best Practices

1. **Always Use Pagination for Large Data Sets**: Avoid fetching all records
2. **Provide Reasonable Defaults**: Set sensible default values for page size and sort order
3. **Limit Maximum Page Size**: Prevent performance issues with huge page requests
4. **Use Index on Sorted Fields**: Create database indexes on commonly sorted columns
5. **Consider Slice for Large Tables**: Use Slice instead of Page when count queries are expensive
6. **Combine with Projections**: Return only needed fields to improve performance
7. **Include Pagination Metadata**: Return page information to clients for navigation
8. **Validate User Input**: Sanitize and validate pagination parameters
9. **Handle Empty Results**: Return empty pages rather than errors for out-of-bounds requests
10. **Test Edge Cases**: Test first page, last page, and boundary conditions