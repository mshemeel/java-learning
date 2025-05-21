# Spring Data MongoDB

## Overview
This guide explores Spring Data MongoDB, a part of the Spring Data family that makes it easy to implement MongoDB-based repositories. Spring Data MongoDB simplifies data access by reducing boilerplate code and providing powerful abstractions for MongoDB operations. It helps developers create repository implementations automatically, write sophisticated queries with minimal code, and focus on business logic rather than data access infrastructure.

## Prerequisites
- Basic knowledge of Java and Spring Boot
- Understanding of NoSQL databases and MongoDB concepts
- Familiarity with MongoDB query operations
- Development environment with Spring Boot set up

## Learning Objectives
- Understand the core concepts and benefits of Spring Data MongoDB
- Configure Spring Data MongoDB in Spring Boot applications
- Create and use MongoDB repositories
- Define domain models with document annotations
- Implement basic and advanced MongoDB queries
- Work with MongoDB aggregation framework
- Manage relationships in MongoDB
- Implement geospatial queries
- Optimize MongoDB operations for performance

## Table of Contents
1. [Introduction to Spring Data MongoDB](#introduction-to-spring-data-mongodb)
2. [Setting Up Spring Data MongoDB](#setting-up-spring-data-mongodb)
3. [Document Mapping](#document-mapping)
4. [MongoDB Repositories](#mongodb-repositories)
5. [Query Methods](#query-methods)
6. [Custom Queries](#custom-queries)
7. [MongoDB Template](#mongodb-template)
8. [Aggregation Framework](#aggregation-framework)
9. [Collection Relationships and Joins](#collection-relationships-and-joins)
10. [Indexing](#indexing)
11. [Geospatial Queries](#geospatial-queries)
12. [GridFS for Large Files](#gridfs-for-large-files)
13. [Change Streams](#change-streams)
14. [Transactions](#transactions)
15. [Testing Spring Data MongoDB](#testing-spring-data-mongodb)

## Introduction to Spring Data MongoDB

Spring Data MongoDB is a library that simplifies the development of MongoDB-based data access layers. It removes most of the boilerplate code required when working with MongoDB.

### What is Spring Data MongoDB?

Spring Data MongoDB is part of the larger Spring Data family, which aims to provide a familiar and consistent Spring-based programming model for data access while retaining the special traits of the underlying data store.

Spring Data MongoDB specifically focuses on adding enhanced support for MongoDB-based data access layers. It makes it easier to build Spring-powered applications that use MongoDB by:

- Reducing boilerplate code for repository implementations
- Providing powerful repository and custom object-mapping abstractions
- Dynamically generating queries from method names
- Supporting integration with custom repositories
- Simplifying MongoDB-specific operations

### Key Benefits of Spring Data MongoDB

1. **Reduced Boilerplate**: Implement repositories with minimal code
2. **Consistent API**: Standard CRUD operations across repositories
3. **Method Name Queries**: Create queries by defining method names
4. **MongoDB Template**: Easy access to MongoDB-specific operations
5. **Automatic Object Mapping**: Conversion between Java objects and BSON documents
6. **Custom Queries**: Simple integration of MongoDB Query Language
7. **Aggregation Framework Support**: Fluent API for MongoDB aggregations
8. **Geospatial Queries**: Support for location-based queries
9. **GridFS Support**: Store and retrieve large files
10. **Reactive Support**: Reactive programming model for MongoDB operations

## Setting Up Spring Data MongoDB

### Maven Dependencies

To use Spring Data MongoDB in a Spring Boot application, add the following dependencies:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

For reactive MongoDB support:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
</dependency>
```

### Basic Configuration

Spring Boot provides auto-configuration for Spring Data MongoDB. Configure it in `application.properties` or `application.yml`:

**application.properties**:
```properties
# MongoDB Configuration
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=mydb
# Optional authentication
spring.data.mongodb.username=user
spring.data.mongodb.password=password
```

**application.yml**:
```yaml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: mydb
      # Optional authentication
      username: user
      password: password
```

### MongoDB URI Configuration

Alternatively, use a MongoDB connection string:

```properties
spring.data.mongodb.uri=mongodb://user:password@localhost:27017/mydb
```

### Custom MongoDB Configuration

For more control, define a custom MongoDB configuration:

```java
@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "mydb";
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    @Override
    protected void configureClientSettings(MongoClientSettings.Builder builder) {
        builder.applyToClusterSettings(settings -> {
            settings.hosts(List.of(new ServerAddress("localhost", 27017)));
        })
        .applyToConnectionPoolSettings(settings -> {
            settings.maxConnectionIdleTime(10000, TimeUnit.MILLISECONDS);
            settings.maxSize(100);
        });
    }
}
```

## Document Mapping

In Spring Data MongoDB, Java classes are mapped to MongoDB documents using annotations.

### Basic Document Class

```java
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    @Field("price_amount")
    private BigDecimal price;
    
    private boolean inStock;
    
    @CreatedDate
    private Date createdAt;
    
    @LastModifiedDate
    private Date lastModified;
    
    // Constructors, getters, setters, etc.
}
```

### Document Annotations

- `@Document`: Marks the class as a domain object to be persisted to MongoDB
- `@Id`: Designates the identifier field
- `@Field`: Customizes the field name in the document
- `@Indexed`: Creates an index on the field
- `@CompoundIndex`: Creates a compound index
- `@DBRef`: References another document
- `@Transient`: Marks a field to be ignored
- `@CreatedDate`, `@LastModifiedDate`: For auditing

### Embedded Documents

```java
@Document(collection = "customers")
public class Customer {
    
    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    @Field("shipping_address")
    private Address shippingAddress;
    
    @Field("billing_address")
    private Address billingAddress;
    
    // Getters, setters, etc.
}

public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    
    // Getters, setters, etc.
}
```

### Document References

```java
@Document(collection = "orders")
public class Order {
    
    @Id
    private String id;
    
    private String orderNumber;
    
    @DBRef
    private Customer customer;
    
    private List<OrderItem> items = new ArrayList<>();
    
    private OrderStatus status;
    
    private Date orderDate;
    
    // Getters, setters, etc.
}

public class OrderItem {
    private String productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
    
    // Getters, setters, etc.
}

public enum OrderStatus {
    PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}
```

### Customizing Mapping

For more control over document mapping:

```java
@Configuration
public class MongoCustomConversions extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "mydb";
    }

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new DateToZonedDateTimeConverter());
        converters.add(new ZonedDateTimeToDateConverter());
        return new MongoCustomConversions(converters);
    }
    
    class DateToZonedDateTimeConverter implements Converter<Date, ZonedDateTime> {
        @Override
        public ZonedDateTime convert(Date source) {
            return source == null ? null : ZonedDateTime.ofInstant(source.toInstant(), ZoneId.systemDefault());
        }
    }
    
    class ZonedDateTimeToDateConverter implements Converter<ZonedDateTime, Date> {
        @Override
        public Date convert(ZonedDateTime source) {
            return source == null ? null : Date.from(source.toInstant());
        }
    }
}
```

## MongoDB Repositories

Spring Data MongoDB provides repositories that offer methods for common MongoDB operations.

### Basic Repository

```java
public interface ProductRepository extends MongoRepository<Product, String> {
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
    
    public Optional<Product> findProductById(String id) {
        return productRepository.findById(id);
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
```

## Query Methods

Spring Data MongoDB can automatically generate query implementations based on method names.

### Method Name Syntax

```java
public interface ProductRepository extends MongoRepository<Product, String> {
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
    
    // Null handling
    List<Product> findByDescriptionIsNull();
    List<Product> findByDescriptionIsNotNull();
    
    // Limiting results
    Product findFirstByOrderByCreatedAtDesc();
    List<Product> findTop5ByOrderByPriceDesc();
    
    // Nested properties
    List<Product> findByShippingAddressCity(String city);
    
    // Boolean checks
    List<Product> findByInStockTrue();
    List<Product> findByInStockFalse();
    
    // Existence queries
    boolean existsByName(String name);
    
    // Count queries
    long countByCategoryId(String categoryId);
    
    // Delete queries
    void deleteByName(String name);
}
```

## Custom Queries

For more complex queries, use the `@Query` annotation with MongoDB Query Language.

### Basic MongoDB Queries

```java
public interface ProductRepository extends MongoRepository<Product, String> {
    
    @Query("{ 'price': { $gt: ?0 }, 'category.name': ?1 }")
    List<Product> findExpensiveProductsByCategory(BigDecimal price, String categoryName);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Product> searchByName(String keyword);
    
    @Query("{ 'tags': { $in: [ ?0 ] } }")
    List<Product> findByTagName(String tagName);
}
```

### Using Field Projection

Return only specific fields:

```java
public interface ProductRepository extends MongoRepository<Product, String> {
    
    @Query(value = "{ 'category.id': ?0 }", fields = "{ 'name': 1, 'price': 1 }")
    List<Product> findProductSummaryByCategory(String categoryId);
}
```

### Using Sort and Limit

```java
public interface ProductRepository extends MongoRepository<Product, String> {
    
    @Query(value = "{ 'inStock': true }", sort = "{ 'price': -1 }")
    List<Product> findInStockProductsSortedByPriceDesc();
    
    @Query(value = "{ 'price': { $gt: ?0 } }", sort = "{ 'createdAt': -1 }")
    List<Product> findExpensiveProductsOrderByCreatedDesc(BigDecimal minPrice, Pageable pageable);
}
```

## MongoDB Template

MongoTemplate provides direct access to MongoDB operations for cases where repositories are not sufficient.

### Basic MongoTemplate Usage

```java
@Service
public class ProductService {
    
    private final MongoTemplate mongoTemplate;
    
    public ProductService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public Product findById(String id) {
        return mongoTemplate.findById(id, Product.class);
    }
    
    public List<Product> findAll() {
        return mongoTemplate.findAll(Product.class);
    }
    
    public Product save(Product product) {
        return mongoTemplate.save(product);
    }
    
    public void delete(Product product) {
        mongoTemplate.remove(product);
    }
    
    public List<Product> findByNameStartsWith(String prefix) {
        Query query = new Query(Criteria.where("name").regex("^" + prefix));
        return mongoTemplate.find(query, Product.class);
    }
    
    public List<Product> findExpensiveProducts(BigDecimal minPrice) {
        Query query = new Query(Criteria.where("price").gt(minPrice))
                .with(Sort.by(Sort.Direction.DESC, "price"));
        return mongoTemplate.find(query, Product.class);
    }
    
    public void updateProductStock(String id, boolean inStock) {
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update().set("inStock", inStock);
        mongoTemplate.updateFirst(query, update, Product.class);
    }
}
```

### Complex Queries with Criteria

```java
@Service
public class ProductSearchService {
    
    private final MongoTemplate mongoTemplate;
    
    public ProductSearchService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<Product> searchProducts(
            String nameKeyword, 
            List<String> categories,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock) {
        
        Criteria criteria = new Criteria();
        
        // Add conditions based on provided parameters
        if (nameKeyword != null && !nameKeyword.isEmpty()) {
            criteria.and("name").regex(nameKeyword, "i");
        }
        
        if (categories != null && !categories.isEmpty()) {
            criteria.and("category.id").in(categories);
        }
        
        if (minPrice != null) {
            criteria.and("price").gte(minPrice);
        }
        
        if (maxPrice != null) {
            criteria.and("price").lte(maxPrice);
        }
        
        if (inStock != null) {
            criteria.and("inStock").is(inStock);
        }
        
        Query query = new Query(criteria);
        
        // Add sorting
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        
        return mongoTemplate.find(query, Product.class);
    }
}
```

## Aggregation Framework

Spring Data MongoDB provides a fluent API for MongoDB's powerful aggregation framework.

### Basic Aggregation

```java
@Service
public class SalesAnalyticsService {
    
    private final MongoTemplate mongoTemplate;
    
    public SalesAnalyticsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<CategorySales> getCategorySales() {
        TypedAggregation<Order> aggregation = Aggregation.newAggregation(
                Order.class,
                Aggregation.unwind("items"),
                Aggregation.group("items.category")
                        .sum("items.quantity").as("totalQuantity")
                        .sum(Aggregation.multiply("items.price", "items.quantity")).as("totalSales"),
                Aggregation.project()
                        .and("_id").as("category")
                        .and("totalQuantity").as("quantity")
                        .and("totalSales").as("sales"),
                Aggregation.sort(Sort.Direction.DESC, "sales")
        );
        
        AggregationResults<CategorySales> results = mongoTemplate.aggregate(
                aggregation, CategorySales.class);
                
        return results.getMappedResults();
    }
    
    public static class CategorySales {
        private String category;
        private int quantity;
        private BigDecimal sales;
        
        // Getters and setters
    }
}
```

### Advanced Aggregation

```java
@Service
public class CustomerInsightsService {
    
    private final MongoTemplate mongoTemplate;
    
    public CustomerInsightsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<CustomerSpending> getTopCustomers(int limit) {
        TypedAggregation<Order> aggregation = Aggregation.newAggregation(
                Order.class,
                Aggregation.match(Criteria.where("status").is("DELIVERED")),
                Aggregation.group("customer")
                        .count().as("orderCount")
                        .sum("totalAmount").as("totalSpent")
                        .max("orderDate").as("lastOrderDate"),
                Aggregation.lookup("customers", "_id", "_id", "customerDetails"),
                Aggregation.unwind("customerDetails"),
                Aggregation.project()
                        .and("customerDetails.name").as("name")
                        .and("customerDetails.email").as("email")
                        .and("orderCount").as("orders")
                        .and("totalSpent").as("spent")
                        .and("lastOrderDate").as("lastOrder"),
                Aggregation.sort(Sort.Direction.DESC, "spent"),
                Aggregation.limit(limit)
        );
        
        AggregationResults<CustomerSpending> results = mongoTemplate.aggregate(
                aggregation, CustomerSpending.class);
                
        return results.getMappedResults();
    }
    
    public static class CustomerSpending {
        private String name;
        private String email;
        private int orders;
        private BigDecimal spent;
        private Date lastOrder;
        
        // Getters and setters
    }
}
```

## Collection Relationships and Joins

MongoDB is a document-oriented database that does not support traditional SQL-style joins. However, Spring Data MongoDB provides several ways to work with related data across collections.

### Using $lookup Aggregation (MongoDB's Left Join)

The most common way to join collections in MongoDB is using the `$lookup` aggregation stage, which performs a left outer join to another collection.

```java
@Service
public class OrderAnalyticsService {
    
    private final MongoTemplate mongoTemplate;
    
    public OrderAnalyticsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<OrderWithCustomer> getOrdersWithCustomerInfo() {
        TypedAggregation<Order> aggregation = Aggregation.newAggregation(
                Order.class,
                // Match only processing orders (optional filter)
                Aggregation.match(Criteria.where("status").is(OrderStatus.PROCESSING)),
                // Join with customers collection
                Aggregation.lookup("customers", "customerId", "_id", "customerData"),
                // Unwind the joined array (since lookup returns an array)
                Aggregation.unwind("customerData", true),
                // Project the fields we want
                Aggregation.project()
                        .and("id").as("orderId")
                        .and("orderNumber").as("orderNumber")
                        .and("orderDate").as("orderDate")
                        .and("status").as("status")
                        .and("customerData.name").as("customerName")
                        .and("customerData.email").as("customerEmail")
                        .and("items").as("items")
        );
        
        AggregationResults<OrderWithCustomer> results = mongoTemplate.aggregate(
                aggregation, OrderWithCustomer.class);
        
        return results.getMappedResults();
    }
    
    public static class OrderWithCustomer {
        private String orderId;
        private String orderNumber;
        private Date orderDate;
        private OrderStatus status;
        private String customerName;
        private String customerEmail;
        private List<OrderItem> items;
        
        // Getters and setters
    }
}
```

### Using DBRef for Manual Joins

Another approach is to use `@DBRef` annotations and manual fetching:

```java
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String orderNumber;
    
    @DBRef
    private Customer customer;
    
    private List<OrderItem> items;
    private OrderStatus status;
    
    // Getters, setters, etc.
}

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    public List<Order> findOrdersWithCustomers() {
        // DBRef fields are lazily loaded when accessed
        List<Order> orders = orderRepository.findAll();
        
        // Trigger loading of customer data
        orders.forEach(order -> {
            if (order.getCustomer() != null) {
                // Access customer properties to trigger loading
                String customerName = order.getCustomer().getName();
            }
        });
        
        return orders;
    }
}
```

### Multiple Collection Joins with $lookup

Joining more than two collections is also possible with multiple `$lookup` stages:

```java
@Service
public class OrderReportService {
    
    private final MongoTemplate mongoTemplate;
    
    public OrderReportService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<CompleteOrderInfo> getCompleteOrderInfo() {
        TypedAggregation<Order> aggregation = Aggregation.newAggregation(
                Order.class,
                // First lookup - join with customers
                Aggregation.lookup("customers", "customerId", "_id", "customerData"),
                Aggregation.unwind("customerData", true),
                
                // Unwind order items to work with each item separately
                Aggregation.unwind("items"),
                
                // Second lookup - join with products
                Aggregation.lookup("products", "items.productId", "_id", "productData"),
                Aggregation.unwind("productData", true),
                
                // Group back to order level
                Aggregation.group("_id")
                        .first("orderNumber").as("orderNumber")
                        .first("orderDate").as("orderDate")
                        .first("status").as("status")
                        .first("customerData").as("customer")
                        .push(Aggregation.bind("product", "productData")
                             .and("quantity", "items.quantity")
                             .and("price", "items.price")
                        ).as("orderItems"),
                
                // Final projection
                Aggregation.project()
                        .and("_id").as("orderId")
                        .and("orderNumber").as("orderNumber")
                        .and("orderDate").as("orderDate")
                        .and("status").as("status")
                        .and("customer.name").as("customerName")
                        .and("customer.email").as("customerEmail")
                        .and("orderItems").as("items")
        );
        
        AggregationResults<CompleteOrderInfo> results = mongoTemplate.aggregate(
                aggregation, CompleteOrderInfo.class);
        
        return results.getMappedResults();
    }
    
    public static class CompleteOrderInfo {
        private String orderId;
        private String orderNumber;
        private Date orderDate;
        private OrderStatus status;
        private String customerName;
        private String customerEmail;
        private List<EnrichedOrderItem> items;
        
        // Getters and setters
    }
    
    public static class EnrichedOrderItem {
        private Product product;
        private int quantity;
        private BigDecimal price;
        
        // Getters and setters
    }
}
```

### Programmatic Collection Joins

For more control, you can join collections programmatically:

```java
@Service
public class ProductCategoryService {
    
    private final MongoTemplate mongoTemplate;
    
    public ProductCategoryService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<ProductWithCategory> getProductsWithCategories() {
        // Step 1: Get all products
        List<Product> products = mongoTemplate.findAll(Product.class);
        
        // Step 2: Extract all category IDs
        Set<String> categoryIds = products.stream()
                .map(Product::getCategoryId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // Step 3: Find all relevant categories
        List<Category> categories = mongoTemplate.find(
                Query.query(Criteria.where("_id").in(categoryIds)), 
                Category.class);
        
        // Step 4: Create lookup map for efficient joining
        Map<String, Category> categoryMap = categories.stream()
                .collect(Collectors.toMap(Category::getId, Function.identity()));
        
        // Step 5: Join the data
        return products.stream()
                .map(product -> {
                    ProductWithCategory result = new ProductWithCategory();
                    result.setId(product.getId());
                    result.setName(product.getName());
                    result.setPrice(product.getPrice());
                    
                    // Join with category
                    if (product.getCategoryId() != null) {
                        Category category = categoryMap.get(product.getCategoryId());
                        if (category != null) {
                            result.setCategoryName(category.getName());
                            result.setCategoryDescription(category.getDescription());
                        }
                    }
                    
                    return result;
                })
                .collect(Collectors.toList());
    }
    
    public static class ProductWithCategory {
        private String id;
        private String name;
        private BigDecimal price;
        private String categoryName;
        private String categoryDescription;
        
        // Getters and setters
    }
}
```

### Embedding vs. Referencing in MongoDB

When designing MongoDB data models, consider these relationship patterns:

1. **Embedding (Denormalization)**: Include related data in the same document
   - Best for one-to-few relationships
   - Good for data that is queried together frequently
   - Example: Order with embedded line items

2. **Referencing (Normalization)**: Store references between documents
   - Best for one-to-many or many-to-many relationships
   - Good when related data is large or changes frequently
   - Example: Order referencing a Customer by ID

```java
// Example of embedding approach
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String orderNumber;
    private Date orderDate;
    
    // Embedded customer information
    private CustomerInfo customer;
    
    // Embedded order items
    private List<OrderItem> items;
    
    // Other fields...
}

public class CustomerInfo {
    private String name;
    private String email;
    private String phone;
    
    // Getters, setters, etc.
}

// Example of referencing approach
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String orderNumber;
    private Date orderDate;
    
    // Reference to customer
    private String customerId;
    
    // References to products in order items
    private List<OrderItem> items;
    
    // Other fields...
}

public class OrderItem {
    private String productId;  // Reference to product
    private int quantity;
    private BigDecimal price;
    
    // Getters, setters, etc.
}
```

## Indexing

Adding indexes to MongoDB collections improves query performance.

### Indexing with Annotations

```java
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    private String description;
    
    @Indexed(direction = IndexDirection.DESCENDING)
    private BigDecimal price;
    
    @Indexed
    private boolean inStock;
    
    @Indexed(expireAfterSeconds = 86400)
    private Date createdAt;
    
    // Other fields, getters, setters, etc.
}

@Document(collection = "customers")
@CompoundIndexes({
    @CompoundIndex(name = "email_city", def = "{'email': 1, 'shippingAddress.city': 1}")
})
public class Customer {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String name;
    
    private Address shippingAddress;
    
    // Other fields, getters, setters, etc.
}
```

### Creating Indexes Programmatically

```java
@Component
public class MongoIndexInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final MongoTemplate mongoTemplate;
    
    public MongoIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // Create text index
        mongoTemplate.indexOps(Product.class)
                .ensureIndex(new TextIndexDefinition.TextIndexDefinitionBuilder()
                        .onField("name")
                        .onField("description")
                        .build());
        
        // Create geospatial index
        mongoTemplate.indexOps("stores")
                .ensureIndex(new GeospatialIndex("location"));
                
        // Create compound index
        mongoTemplate.indexOps(Order.class)
                .ensureIndex(new Index()
                        .on("customer", Sort.Direction.ASC)
                        .on("orderDate", Sort.Direction.DESC));
    }
}
```

## Geospatial Queries

MongoDB supports geospatial queries for location-based applications.

### Geospatial Document

```java
@Document(collection = "stores")
public class Store {
    
    @Id
    private String id;
    
    private String name;
    
    private String address;
    
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;
    
    // Getters, setters, etc.
}
```

### Geospatial Repositories

```java
public interface StoreRepository extends MongoRepository<Store, String> {
    
    // Find stores near a point within a distance (in meters)
    List<Store> findByLocationNear(Point location, Distance distance);
    
    // Find stores within a circle
    List<Store> findByLocationWithin(Circle circle);
    
    // Find stores within a polygon
    List<Store> findByLocationWithin(Polygon polygon);
}
```

### Geospatial MongoTemplate Queries

```java
@Service
public class StoreLocatorService {
    
    private final MongoTemplate mongoTemplate;
    
    public StoreLocatorService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public List<Store> findStoresNearLocation(double latitude, double longitude, double maxDistance) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(maxDistance, Metrics.KILOMETERS);
        
        Query query = new Query(Criteria.where("location").nearSphere(point).maxDistance(distance));
        return mongoTemplate.find(query, Store.class);
    }
    
    public List<Store> findStoresWithinBox(double lowerLeftX, double lowerLeftY, 
                                         double upperRightX, double upperRightY) {
        Box box = new Box(new Point(lowerLeftX, lowerLeftY), new Point(upperRightX, upperRightY));
        
        Query query = new Query(Criteria.where("location").within(box));
        return mongoTemplate.find(query, Store.class);
    }
}
```

## GridFS for Large Files

MongoDB GridFS is used for storing large files such as images, videos, and PDFs.

### GridFS Operations

```java
@Service
public class FileStorageService {
    
    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;
    
    public FileStorageService(GridFsTemplate gridFsTemplate, GridFsOperations gridFsOperations) {
        this.gridFsTemplate = gridFsTemplate;
        this.gridFsOperations = gridFsOperations;
    }
    
    public String storeFile(String filename, InputStream content, String contentType) {
        DBObject metadata = new BasicDBObject();
        metadata.put("contentType", contentType);
        
        ObjectId fileId = gridFsTemplate.store(content, filename, contentType, metadata);
        return fileId.toString();
    }
    
    public GridFSFile getFile(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
    }
    
    public GridFsResource getResource(String id) {
        GridFSFile file = getFile(id);
        if (file == null) {
            return null;
        }
        return gridFsOperations.getResource(file);
    }
    
    public void deleteFile(String id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(id))));
    }
    
    public List<GridFSFile> findAllFiles() {
        return gridFsTemplate.find(new Query()).into(new ArrayList<>());
    }
}
```

### Using GridFS in a Controller

```java
@RestController
@RequestMapping("/api/files")
public class FileController {
    
    private final FileStorageService fileStorageService;
    
    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }
    
    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = fileStorageService.storeFile(
                    file.getOriginalFilename(),
                    file.getInputStream(),
                    file.getContentType()
            );
            return ResponseEntity.ok(fileId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        GridFsResource resource = fileStorageService.getResource(id);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        fileStorageService.deleteFile(id);
        return ResponseEntity.ok().build();
    }
}
```

## Change Streams

MongoDB change streams allow applications to watch for changes in the database.

### Simple Change Stream Example

```java
@Service
public class ProductChangeListener {
    
    private final MongoTemplate mongoTemplate;
    private final Logger logger = LoggerFactory.getLogger(ProductChangeListener.class);
    
    public ProductChangeListener(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    @PostConstruct
    public void startListening() {
        Executors.newSingleThreadExecutor().submit(() -> {
            ChangeStreamOptions options = ChangeStreamOptions.builder()
                    .returnFullDocumentOnUpdate()
                    .build();
            
            try (MongoCursor<ChangeStreamDocument<Document>> cursor = mongoTemplate
                    .getCollection("products")
                    .watch()
                    .fullDocument(FullDocument.UPDATE_LOOKUP)
                    .iterator()) {
                
                while (cursor.hasNext()) {
                    ChangeStreamDocument<Document> next = cursor.next();
                    Document fullDocument = next.getFullDocument();
                    
                    if (fullDocument != null) {
                        logger.info("Change detected: {}", fullDocument.toJson());
                        
                        // Process the change
                        OperationType operationType = next.getOperationType();
                        switch (operationType) {
                            case INSERT:
                                handleInsert(fullDocument);
                                break;
                            case UPDATE:
                                handleUpdate(fullDocument, next.getUpdateDescription());
                                break;
                            case DELETE:
                                handleDelete(next.getDocumentKey());
                                break;
                        }
                    }
                }
            }
        });
    }
    
    private void handleInsert(Document document) {
        // Process insert
    }
    
    private void handleUpdate(Document document, UpdateDescription updateDescription) {
        // Process update
    }
    
    private void handleDelete(BsonDocument documentKey) {
        // Process delete
    }
}
```

## Transactions

MongoDB supports multi-document transactions (from version 4.0).

### Transaction Example

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final MongoTemplate mongoTemplate;
    private final MongoTransactionManager transactionManager;
    
    public Order createOrder(OrderRequest request) {
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        
        return transactionTemplate.execute(status -> {
            try {
                // Create order
                Order order = new Order();
                order.setCustomerId(request.getCustomerId());
                order.setOrderDate(new Date());
                order.setStatus(OrderStatus.PENDING);
                order.setItems(mapOrderItems(request.getItems()));
                order.calculateTotal();
                
                mongoTemplate.save(order);
                
                // Update inventory
                for (OrderItem item : order.getItems()) {
                    Query query = new Query(Criteria.where("_id").is(item.getProductId()));
                    Update update = new Update().inc("stockQuantity", -item.getQuantity());
                    UpdateResult result = mongoTemplate.updateFirst(query, update, "products");
                    
                    if (result.getModifiedCount() == 0) {
                        throw new RuntimeException("Product not found or insufficient stock");
                    }
                }
                
                // Create payment record
                Payment payment = new Payment();
                payment.setOrderId(order.getId());
                payment.setAmount(order.getTotal());
                payment.setStatus(PaymentStatus.PENDING);
                
                mongoTemplate.save(payment);
                
                return order;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw e;
            }
        });
    }
    
    private List<OrderItem> mapOrderItems(List<OrderItemRequest> items) {
        // Map order items from request
        return items.stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(item.getProductId());
                    orderItem.setQuantity(item.getQuantity());
                    
                    // Get product details
                    Product product = mongoTemplate.findById(item.getProductId(), Product.class);
                    orderItem.setProductName(product.getName());
                    orderItem.setPrice(product.getPrice());
                    
                    return orderItem;
                })
                .collect(Collectors.toList());
    }
}
```

## Testing Spring Data MongoDB

Testing MongoDB repositories with embedded MongoDB.

### Maven Dependencies

```xml
<dependency>
    <groupId>de.flapdoodle.embed</groupId>
    <artifactId>de.flapdoodle.embed.mongo</artifactId>
    <scope>test</scope>
</dependency>
```

### Repository Test

```java
@DataMongoTest
class ProductRepositoryTest {
    
    @Autowired
    private ProductRepository productRepository;
    
    @BeforeEach
    void setup() {
        productRepository.deleteAll();
        
        // Create test data
        Product product1 = new Product();
        product1.setName("Test Product 1");
        product1.setPrice(new BigDecimal("19.99"));
        product1.setInStock(true);
        
        Product product2 = new Product();
        product2.setName("Test Product 2");
        product2.setPrice(new BigDecimal("29.99"));
        product2.setInStock(false);
        
        productRepository.saveAll(List.of(product1, product2));
    }
    
    @Test
    void findByName_ShouldReturnProduct() {
        List<Product> products = productRepository.findByName("Test Product 1");
        
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Test Product 1");
    }
    
    @Test
    void findByInStockTrue_ShouldReturnInStockProducts() {
        List<Product> products = productRepository.findByInStockTrue();
        
        assertThat(products).hasSize(1);
        assertThat(products.get(0).isInStock()).isTrue();
    }
    
    @Test
    void findByPriceGreaterThan_ShouldReturnExpensiveProducts() {
        List<Product> products = productRepository.findByPriceGreaterThan(new BigDecimal("20.00"));
        
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Test Product 2");
    }
}
```

### MongoTemplate Test

```java
@SpringBootTest
class ProductServiceTest {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private ProductService productService;
    
    @BeforeEach
    void setup() {
        mongoTemplate.dropCollection(Product.class);
        
        // Create test data
        Product product1 = new Product();
        product1.setName("Test Product 1");
        product1.setPrice(new BigDecimal("19.99"));
        product1.setInStock(true);
        
        Product product2 = new Product();
        product2.setName("Test Product 2");
        product2.setPrice(new BigDecimal("29.99"));
        product2.setInStock(false);
        
        mongoTemplate.insertAll(List.of(product1, product2));
    }
    
    @Test
    void searchProducts_ShouldReturnMatchingProducts() {
        List<Product> products = productService.searchProducts(
                "Test", null, new BigDecimal("25.00"), null, null);
        
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Test Product 2");
    }
    
    @Test
    void updateProductStock_ShouldChangeStockStatus() {
        Product product = mongoTemplate.findOne(
                Query.query(Criteria.where("name").is("Test Product 1")), 
                Product.class);
        
        productService.updateProductStock(product.getId(), false);
        
        Product updatedProduct = mongoTemplate.findById(product.getId(), Product.class);
        assertThat(updatedProduct.isInStock()).isFalse();
    }
}
```

### Test with TestContainers

For testing with a real MongoDB instance:

```java
@SpringBootTest
@Testcontainers
class ProductServiceIntegrationTest {
    
    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.4.6");
    
    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private ProductService productService;
    
    // Test methods
}
``` 