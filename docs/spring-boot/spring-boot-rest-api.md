# Spring Boot RESTful API Development

## Overview
This guide explores how to build RESTful APIs using Spring Boot. It covers the fundamentals of REST architecture, implementing endpoints with Spring MVC's powerful annotations, handling requests and responses, validating input, documenting APIs, implementing HATEOAS, versioning strategies, security considerations, and testing methodologies. By following this guide, you'll learn how to create robust, scalable, and maintainable REST APIs that follow industry best practices.

## Prerequisites
- Basic knowledge of Java and Spring Boot
- Understanding of HTTP protocol fundamentals
- Familiarity with Spring core concepts (from spring-boot-core-concepts.md)
- Basic understanding of JSON and API design principles
- Development environment with Java and Maven/Gradle

## Learning Objectives
- Understand REST architectural principles and constraints
- Implement RESTful endpoints using Spring MVC annotations
- Handle various HTTP methods and status codes appropriately
- Process request parameters, path variables, and request bodies
- Implement proper error handling and validation
- Configure content negotiation and message conversion
- Document APIs using OpenAPI/Swagger
- Implement HATEOAS for truly RESTful services
- Apply API versioning strategies
- Secure REST APIs
- Test REST endpoints effectively

## Table of Contents
1. [REST Fundamentals](#rest-fundamentals)
2. [Setting Up a REST API Project](#setting-up-a-rest-api-project)
3. [Creating REST Controllers](#creating-rest-controllers)
4. [Request Mapping and HTTP Methods](#request-mapping-and-http-methods)
5. [Request and Response Handling](#request-and-response-handling)
6. [Input Validation](#input-validation)
7. [Exception Handling](#exception-handling)
8. [Content Negotiation](#content-negotiation)
9. [API Documentation with OpenAPI/Swagger](#api-documentation-with-openapiswagger)
10. [HATEOAS Implementation](#hateoas-implementation)
11. [API Versioning Strategies](#api-versioning-strategies)
12. [REST API Security](#rest-api-security)
13. [Testing REST APIs](#testing-rest-apis)
14. [Performance Optimization](#performance-optimization)
15. [Best Practices](#best-practices)

## REST Fundamentals

Representational State Transfer (REST) is an architectural style for designing networked applications. It was introduced by Roy Fielding in his 2000 doctoral dissertation and has become the predominant approach for building web APIs.

### What is REST?

REST is not a protocol or standard, but an architectural style that uses simple HTTP protocol for making calls between machines. In REST architecture, a REST Server provides access to resources, and a REST client accesses and modifies these resources using HTTP protocol.

### REST Architectural Constraints

A truly RESTful API adheres to the following six constraints:

1. **Client-Server Architecture**
   - Separation of concerns between client and server
   - Clients are not concerned with data storage
   - Servers are not concerned with user interface
   - Improves portability and scalability

2. **Statelessness**
   - No client context is stored on the server between requests
   - Each request contains all information necessary to serve it
   - Session state is kept entirely on the client
   - Improves visibility, reliability, and scalability

3. **Cacheability**
   - Responses must define themselves as cacheable or non-cacheable
   - Caching eliminates some client-server interactions
   - Improves scalability and performance

4. **Uniform Interface**
   - Resource identification in requests
   - Resource manipulation through representations
   - Self-descriptive messages
   - Hypermedia as the engine of application state (HATEOAS)
   - Simplifies and decouples the architecture

5. **Layered System**
   - Client cannot ordinarily tell if it is connected directly to the end server
   - Intermediate servers can improve scalability
   - Layers can enforce security policies

6. **Code on Demand (optional)**
   - Servers can temporarily extend client functionality by transferring executable code
   - Simplifies clients by reducing the number of features required

### RESTful Resources

In REST, everything is a resource, which is any information that can be named: a document, an image, a service, a collection of resources, etc.

Each resource is identified by a unique identifier, typically a URI in web-based REST systems.

### HTTP Methods and CRUD Operations

REST uses HTTP methods explicitly for resource operations:

| HTTP Method | CRUD Operation | Description |
|-------------|---------------|-------------|
| GET | Read | Retrieve a resource or collection of resources |
| POST | Create | Create a new resource |
| PUT | Update | Update an existing resource completely |
| PATCH | Update | Update an existing resource partially |
| DELETE | Delete | Delete a resource |

### HTTP Status Codes

Proper use of HTTP status codes is an important part of a RESTful API:

| Code Range | Category | Examples |
|------------|----------|----------|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Server Error | 500 Internal Server Error, 503 Service Unavailable |

### Richardson Maturity Model

The Richardson Maturity Model describes the maturity of a RESTful API across four levels:

- **Level 0**: The Swamp of POX (Plain Old XML) - Uses HTTP as a transport protocol for remote interactions, typically with a single endpoint.
- **Level 1**: Resources - Introduces the concept of resources with individual URIs.
- **Level 2**: HTTP Verbs - Uses HTTP methods appropriately.
- **Level 3**: Hypermedia Controls - Implements HATEOAS by providing links to related resources within responses.

### REST vs SOAP

| Feature | REST | SOAP |
|---------|------|------|
| Style | Architectural style | Protocol |
| Data Format | Typically JSON/XML | XML only |
| Bandwidth | Less usage (lightweight) | More usage (XML overhead) |
| Learning Curve | Easy to learn and implement | Steeper learning curve |
| Caching | Can leverage HTTP caching | Requires custom implementation |
| Security | Uses HTTP security features | Built-in security (WS-Security) |
| State | Stateless | Can be stateful or stateless |

### JSON and REST

JavaScript Object Notation (JSON) has become the predominant data format for REST APIs due to its:

- Lightweight nature
- Human-readable format
- Language independence
- Easy parsing in JavaScript and other languages
- Support for common data types (strings, numbers, booleans, arrays, objects, null)

Example JSON representation of a resource:

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 29.99,
  "inStock": true,
  "categories": ["electronics", "gadgets"],
  "details": {
    "description": "Product description",
    "manufacturer": "Manufacturer name"
  }
}
```

### API Design Principles

When designing REST APIs, consider these principles:

1. **Use nouns, not verbs in endpoint paths**
   - Good: `/users`, `/users/123`
   - Avoid: `/getUsers`, `/createUser`

2. **Use plural nouns for collections**
   - `/products` instead of `/product`

3. **Use HTTP methods appropriately**
   - Don't create endpoints like `/deleteUser/123`
   - Instead use: `DELETE /users/123`

4. **Use nested resources for relationships**
   - `/users/123/orders` to get orders for user 123

5. **Use query parameters for filtering, sorting, and pagination**
   - `/products?category=electronics&sort=price&page=2`

6. **Be consistent**
   - Use consistent naming, plural/singular conventions, error formats, etc.

7. **Version your API**
   - `/v1/users`, `/v2/users` or using headers/parameters

## Setting Up a REST API Project

Creating a Spring Boot REST API project is straightforward. You can start with a minimal setup and expand as needed.

### Using Spring Initializr

The quickest way to set up a new Spring Boot REST API project is through the Spring Initializr:

1. Go to [start.spring.io](https://start.spring.io/)
2. Choose your project settings:
   - Project: Maven or Gradle
   - Language: Java
   - Spring Boot version: Latest stable version
   - Group: com.example
   - Artifact: rest-api-demo
   - Packaging: Jar
   - Java version: 17 (or your preferred version)

3. Add the following dependencies:
   - Spring Web
   - Spring Data JPA (if you need database access)
   - H2 Database (for development/testing)
   - Spring Boot DevTools (optional, for development)
   - Validation
   - Lombok (optional, to reduce boilerplate code)

4. Click "Generate" to download the project zip file
5. Extract the zip file and import it into your IDE

### Project Structure

A typical Spring Boot REST API project follows this structure:

```
rest-api-demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── restapidemo/
│   │   │               ├── RestApiDemoApplication.java
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── repository/
│   │   │               ├── model/ or domain/
│   │   │               ├── dto/
│   │   │               ├── exception/
│   │   │               └── config/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── restapidemo/
│                       ├── controller/
│                       └── service/
└── pom.xml or build.gradle
```

### Maven Configuration (pom.xml)

A typical `pom.xml` for a Spring Boot REST API project:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>rest-api-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>rest-api-demo</name>
    <description>Demo project for Spring Boot REST API</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
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
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Gradle Configuration (build.gradle)

A typical `build.gradle` for a Spring Boot REST API project:

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.1.0'
    id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### Application Properties

Configure your application in `src/main/resources/application.properties`:

```properties
# Server configuration
server.port=8080
server.servlet.context-path=/api

# H2 Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate configuration
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true

# Jackson configuration
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

# Logging configuration
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=ERROR
logging.level.com.example=DEBUG
```

Or using YAML in `src/main/resources/application.yml`:

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    show-sql: true
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jackson:
    serialization:
      indent-output: true
    default-property-inclusion: non_null

logging:
  level:
    org.springframework.web: INFO
    org.hibernate: ERROR
    com.example: DEBUG
```

### Main Application Class

The main application class with `@SpringBootApplication` annotation:

```java
package com.example.restapidemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestApiDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestApiDemoApplication.class, args);
    }
}
```

### Domain Model

Let's create a simple domain model for a product entity:

```java
package com.example.restapidemo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private boolean inStock;
}
```

### Repository Interface

Create a repository interface using Spring Data JPA:

```java
package com.example.restapidemo.repository;

import com.example.restapidemo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByInStockTrue();
}
```

With this setup, you're ready to start implementing REST controllers and services for your API. The following sections will guide you through creating controllers, handling requests and responses, validating input, and implementing other important aspects of a robust REST API.

## Creating REST Controllers

In Spring Boot, REST controllers handle HTTP requests and produce responses. They are the entry point to your API and map client requests to your business logic.

### Controller Basics

To create a REST controller, use the `@RestController` annotation, which combines `@Controller` and `@ResponseBody` annotations:

```java
package com.example.restapidemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, REST API!";
    }
}
```

### Understanding Key Annotations

Spring MVC provides several key annotations for building REST controllers:

1. **@RestController**: Marks the class as a REST controller where every method returns a domain object instead of a view
2. **@RequestMapping**: Maps HTTP requests to handler methods
3. **@GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping**: Shortcuts for @RequestMapping with specific HTTP methods
4. **@PathVariable**: Extracts values from the URI path
5. **@RequestParam**: Extracts query parameters
6. **@RequestBody**: Maps the HTTP request body to a domain object
7. **@ResponseStatus**: Specifies the HTTP status code to return

### Building a CRUD Controller

Here's a complete CRUD (Create, Read, Update, Delete) controller for our Product entity:

```java
package com.example.restapidemo.controller;

import com.example.restapidemo.model.Product;
import com.example.restapidemo.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    // Constructor injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET /products - Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAllProducts();
    }

    // GET /products/{id} - Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /products - Create a new product
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // PUT /products/{id} - Update a product completely
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody Product product) {
        
        return productService.findProductById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    return ResponseEntity.ok(productService.saveProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /products/{id} - Update a product partially
    @PatchMapping("/{id}")
    public ResponseEntity<Product> partialUpdateProduct(
            @PathVariable Long id, 
            @RequestBody Product productUpdates) {
        
        return productService.findProductById(id)
                .map(existingProduct -> {
                    // Update only non-null fields
                    if (productUpdates.getName() != null) {
                        existingProduct.setName(productUpdates.getName());
                    }
                    if (productUpdates.getDescription() != null) {
                        existingProduct.setDescription(productUpdates.getDescription());
                    }
                    if (productUpdates.getPrice() != null) {
                        existingProduct.setPrice(productUpdates.getPrice());
                    }
                    // Boolean is a primitive, so it's always updated
                    existingProduct.setInStock(productUpdates.isInStock());
                    
                    return ResponseEntity.ok(productService.saveProduct(existingProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /products/{id} - Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(product -> {
                    productService.deleteProductById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /products/search - Search products by name
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.findProductsByName(name);
    }

    // GET /products/in-stock - Get products in stock
    @GetMapping("/in-stock")
    public List<Product> getProductsInStock() {
        return productService.findProductsInStock();
    }
}
```

### Service Layer

The controller should delegate business logic to a service layer:

```java
package com.example.restapidemo.service;

import com.example.restapidemo.model.Product;
import com.example.restapidemo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> findProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> findProductsInStock() {
        return productRepository.findByInStockTrue();
    }
}
```

### Different Response Types

REST controllers can return various types that Spring automatically converts to HTTP responses:

#### 1. Domain Objects

Spring automatically converts them to JSON (or XML if configured):

```java
@GetMapping("/{id}")
public Product getProduct(@PathVariable Long id) {
    return productService.findProductById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
}
```

#### 2. Collections

Lists, Sets, or Maps are automatically converted to JSON arrays:

```java
@GetMapping
public List<Product> getAllProducts() {
    return productService.findAllProducts();
}
```

#### 3. ResponseEntity

Gives you control over the HTTP response status codes, headers, and body:

```java
@GetMapping("/{id}")
public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
    return productService.findById(id)
            .map(product -> {
                ProductResponseDto dto = productMapper.toDto(product);
                return ResponseEntity.ok()
                        .header("Custom-Header", "Value")
                        .body(dto);
            })
            .orElse(ResponseEntity.notFound().build());
}
```

#### 4. Void with @ResponseStatus

When you don't need to return a body:

```java
@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteProduct(@PathVariable Long id) {
    productService.deleteProductById(id);
}
```

### Organizing Controllers

For larger applications, organize controllers logically:

#### By Resource

Each controller handles operations for a specific resource:

```
com.example.controller
├── ProductController.java
├── CustomerController.java
├── OrderController.java
└── PaymentController.java
```

#### By Functionality

Group controllers by functionality area:

```
com.example.controller
├── admin
│   ├── AdminProductController.java
│   └── AdminUserController.java
├── customer
│   ├── CustomerProductController.java
│   └── CustomerOrderController.java
└── public
    └── PublicProductController.java
```

### Controller Best Practices

1. **Keep controllers thin**: Delegate business logic to services
2. **Use proper HTTP methods**: GET for reading, POST for creating, PUT/PATCH for updating, DELETE for removing
3. **Return appropriate status codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, etc.
4. **Use DTOs for request/response**: Separate your API model from your domain model
5. **Validate input**: Use JSR-380 annotations for validation
6. **Handle exceptions centrally**: Use @ControllerAdvice for global exception handling
7. **Document your API**: Add OpenAPI/Swagger annotations
8. **Use meaningful URI paths**: Follow REST naming conventions
9. **Implement pagination**: For collections that can grow large
10. **Version your API**: Allow for evolution without breaking clients

## Request Mapping and HTTP Methods

Request mapping is a crucial aspect of Spring MVC that links HTTP requests to controller methods. Proper mapping ensures that your API follows RESTful conventions and is intuitive to use.

### Request Mapping Basics

The `@RequestMapping` annotation maps web requests to controller methods. It can be applied at both the class and method levels:

```java
@RestController
@RequestMapping("/api/v1/products")  // Base path for all methods in this controller
public class ProductController {

    @RequestMapping(method = RequestMethod.GET)  // Maps to GET /api/v1/products
    public List<Product> getAllProducts() {
        // ...
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)  // Maps to GET /api/v1/products/{id}
    public Product getProductById(@PathVariable Long id) {
        // ...
    }
}
```

### HTTP Method-Specific Annotations

Spring provides dedicated annotations for each HTTP method, which are more concise and readable than using `@RequestMapping` with a method parameter:

```java
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @GetMapping  // Equivalent to @RequestMapping(method = RequestMethod.GET)
    public List<Product> getAllProducts() {
        // ...
    }

    @GetMapping("/{id}")  // Equivalent to @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Product getProductById(@PathVariable Long id) {
        // ...
    }

    @PostMapping  // Maps to POST /api/v1/products
    public Product createProduct(@RequestBody Product product) {
        // ...
    }

    @PutMapping("/{id}")  // Maps to PUT /api/v1/products/{id}
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        // ...
    }

    @PatchMapping("/{id}")  // Maps to PATCH /api/v1/products/{id}
    public Product partialUpdateProduct(@PathVariable Long id, @RequestBody Product product) {
        // ...
    }

    @DeleteMapping("/{id}")  // Maps to DELETE /api/v1/products/{id}
    public void deleteProduct(@PathVariable Long id) {
        // ...
    }
}
```

### URL Patterns and Path Variables

Path variables are dynamic parts of the URL enclosed in curly braces. They are extracted using the `@PathVariable` annotation:

```java
@GetMapping("/{id}")
public Product getProductById(@PathVariable Long id) {
    // The 'id' parameter is bound to the {id} in the URL
    return productService.findById(id);
}

// Multiple path variables
@GetMapping("/categories/{categoryId}/products/{productId}")
public Product getProductFromCategory(
        @PathVariable Long categoryId, 
        @PathVariable Long productId) {
    return productService.findByCategoryAndId(categoryId, productId);
}

// Custom path variable name
@GetMapping("/users/{userId}/orders/{orderId}")
public Order getOrder(
        @PathVariable("userId") Long userIdentifier, 
        @PathVariable("orderId") Long orderIdentifier) {
    return orderService.findByUserAndOrder(userIdentifier, orderIdentifier);
}
```

### Request Parameters

Query string parameters are accessed with the `@RequestParam` annotation:

```java
// Required parameter - /products/search?name=Laptop
@GetMapping("/search")
public List<Product> searchProducts(@RequestParam String name) {
    return productService.findByName(name);
}

// Optional parameter with default value - /products/filter?minPrice=100&maxPrice=500&inStock=true
@GetMapping("/filter")
public List<Product> filterProducts(
        @RequestParam(defaultValue = "0") BigDecimal minPrice,
        @RequestParam(defaultValue = "10000") BigDecimal maxPrice,
        @RequestParam(defaultValue = "false") boolean inStock) {
    return productService.filterProducts(minPrice, maxPrice, inStock);
}

// Multiple values - /products/byCategories?category=Electronics&category=Computers
@GetMapping("/byCategories")
public List<Product> getProductsByCategories(@RequestParam List<String> category) {
    return productService.findByCategories(category);
}

// Map of params - /products/custom?param1=value1&param2=value2
@GetMapping("/custom")
public List<Product> customSearch(@RequestParam Map<String, String> params) {
    return productService.customSearch(params);
}
```

### Request Headers

Access HTTP headers using the `@RequestHeader` annotation:

```java
@GetMapping("/with-header")
public String withHeader(@RequestHeader("User-Agent") String userAgent) {
    return "Request with User-Agent: " + userAgent;
}

// Optional header
@GetMapping("/optional-header")
public String withOptionalHeader(
        @RequestHeader(value = "Optional-Header", required = false) String optionalHeader) {
    if (optionalHeader != null) {
        return "Header value: " + optionalHeader;
    }
    return "No header provided";
}

// All headers
@GetMapping("/all-headers")
public Map<String, String> getAllHeaders(@RequestHeader Map<String, String> headers) {
    return headers;
}
```

### Consuming and Producing Media Types

Specify what media types your methods can consume and produce:

```java
@PostMapping(
    value = "/upload",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public String uploadFile(@RequestParam("file") MultipartFile file) {
    // Handle file upload
    return "File uploaded: " + file.getOriginalFilename();
}

@GetMapping(
    value = "/{id}",
    produces = MediaType.APPLICATION_JSON_VALUE
)
public Product getProductJson(@PathVariable Long id) {
    return productService.findById(id);
}

@GetMapping(
    value = "/{id}",
    produces = MediaType.APPLICATION_XML_VALUE
)
public Product getProductXml(@PathVariable Long id) {
    return productService.findById(id);
}

// Support multiple media types
@PostMapping(
    consumes = {
        MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE
    },
    produces = MediaType.APPLICATION_JSON_VALUE
)
public Product createProduct(@RequestBody Product product) {
    return productService.save(product);
}
```

### Content Negotiation

Spring Boot supports content negotiation, allowing clients to specify the desired response format:

```java
@GetMapping(
    value = "/{id}",
    produces = {
        MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE
    }
)
public Product getProduct(@PathVariable Long id) {
    return productService.findById(id);
}
```

Clients can request different formats using:
- The `Accept` header: `Accept: application/xml`
- Format extension: `/products/123.xml`
- Query parameter: `/products/123?format=xml`

### Matrix Variables

Matrix variables are name-value pairs embedded in the path segment:

```java
// URL: /products/filter;minPrice=100;maxPrice=500;brand=Samsung,Apple
@GetMapping("/filter")
public List<Product> findProducts(
        @MatrixVariable(defaultValue = "0") int minPrice,
        @MatrixVariable(defaultValue = "10000") int maxPrice,
        @MatrixVariable List<String> brand) {
    return productService.findByPriceAndBrands(minPrice, maxPrice, brand);
}

// Multiple path segments with matrix variables
// URL: /products/price;range=100-500/brand;names=Samsung,Apple
@GetMapping("/products/{priceSegment}/{brandSegment}")
public List<Product> findByPriceAndBrand(
        @MatrixVariable(name = "range", pathVar = "priceSegment") String priceRange,
        @MatrixVariable(name = "names", pathVar = "brandSegment") List<String> brands) {
    // Parse priceRange (e.g., "100-500") and use with brands
    String[] prices = priceRange.split("-");
    int min = Integer.parseInt(prices[0]);
    int max = Integer.parseInt(prices[1]);
    return productService.findByPriceRangeAndBrands(min, max, brands);
}
```

To enable matrix variables, you need to configure a `WebMvcConfigurer`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        urlPathHelper.setRemoveSemicolonContent(false);
        configurer.setUrlPathHelper(urlPathHelper);
    }
}
```

### Handling HTTP Methods

Each HTTP method has a specific purpose in a RESTful API:

#### GET

Used to retrieve information and should be idempotent (multiple identical requests should have the same effect).

```java
@GetMapping
public List<Product> getAllProducts() {
    return productService.findAll();
}

@GetMapping("/{id}")
public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
    return productService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}
```

#### POST

Used to create a new resource. Not idempotent - multiple identical POST requests will create multiple resources.

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Product createProduct(@Valid @RequestBody Product product) {
    return productService.save(product);
}
```

#### PUT

Used to update or replace an existing resource or create it if it doesn't exist. Should be idempotent.

```java
@PutMapping("/{id}")
public ResponseEntity<Product> updateProduct(
        @PathVariable Long id, 
        @Valid @RequestBody Product product) {
    
    product.setId(id);
    Product updatedProduct = productService.update(product);
    
    return ResponseEntity.ok(updatedProduct);
}
```

#### PATCH

Used for partial updates to a resource. May or may not be idempotent.

```java
@PatchMapping("/{id}")
public ResponseEntity<Product> partialUpdateProduct(
        @PathVariable Long id, 
        @RequestBody Map<String, Object> updates) {
    
    Product product = productService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // Apply partial updates
    if (updates.containsKey("name")) {
        product.setName((String) updates.get("name"));
    }
    if (updates.containsKey("price")) {
        product.setPrice(new BigDecimal(updates.get("price").toString()));
    }
    // ... other fields
    
    Product updatedProduct = productService.save(product);
    return ResponseEntity.ok(updatedProduct);
}
```

#### DELETE

Used to delete a resource. Idempotent - multiple DELETE requests to the same resource should have the same effect.

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    boolean deleted = productService.deleteById(id);
    
    if (deleted) {
        return ResponseEntity.noContent().build();
    } else {
        return ResponseEntity.notFound().build();
    }
}
```

### Customizing URL Mappings

Spring MVC provides various ways to customize URL mappings:

#### Regex in Path Variables

```java
@GetMapping("/{id:[0-9]+}")
public Product getProductById(@PathVariable Long id) {
    return productService.findById(id);
}

@GetMapping("/{sku:[A-Z]{2}-[0-9]{6}}")
public Product getProductBySku(@PathVariable String sku) {
    return productService.findBySku(sku);
}
```

#### Ant-Style Path Patterns

```java
@GetMapping("/images/**")
public List<String> getProductImages() {
    return productService.getAllImages();
}

@GetMapping("/public/?")
public String getSingleCharPath(@PathVariable String path) {
    return "Path: " + path;
}

@GetMapping("/*.json")
public String getJsonEndpoint() {
    return "JSON endpoint";
}
```

### Best Practices for Request Mapping

1. **Use proper HTTP methods**: Follow RESTful conventions.
2. **Use meaningful resource paths**: `/users/{id}/orders` is more intuitive than `/get-orders-by-user-id/{id}`.
3. **Keep URLs clean**: Use query parameters for filtering, sorting, and pagination.
4. **Use plural nouns for collections**: `/products` instead of `/product`.
5. **Be consistent with naming**: Choose a convention for case (e.g., kebab-case) and stick to it.
6. **Structure API hierarchically**: Represent resource relationships in the URL structure.
7. **Versioning**: Include API version in the URL or headers.
8. **Use status codes properly**: 200 for success, 201 for creation, 204 for deletion, etc.
9. **Make URLs predictable**: Follow consistent patterns across your API.
10. **Keep URLs relatively short**: Don't go overboard with nested paths.

## Request and Response Handling

Properly handling HTTP requests and responses is crucial for building robust REST APIs. Spring Boot provides powerful tools for processing request data and formatting responses.

### Handling Request Bodies

The `@RequestBody` annotation maps the HTTP request body to a Java object:

```java
@PostMapping
public ResponseEntity<Product> createProduct(@RequestBody Product product) {
    Product savedProduct = productService.save(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
}
```

Spring automatically deserializes the incoming JSON (or XML) to your object using HTTP message converters.

### Data Transfer Objects (DTOs)

It's often better to use dedicated DTOs instead of domain entities for API requests and responses:

```java
// DTO for product creation requests
public class ProductCreateDto {
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    @Positive
    private BigDecimal price;
    
    private boolean inStock;
    
    // Getters and setters
}

// DTO for product responses
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean inStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters
}

@PostMapping
public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductCreateDto productDto) {
    // Convert DTO to entity
    Product product = new Product();
    product.setName(productDto.getName());
    product.setDescription(productDto.getDescription());
    product.setPrice(productDto.getPrice());
    product.setInStock(productDto.isInStock());
    
    // Save entity
    Product savedProduct = productService.save(product);
    
    // Convert entity to response DTO
    ProductResponseDto responseDto = new ProductResponseDto();
    responseDto.setId(savedProduct.getId());
    responseDto.setName(savedProduct.getName());
    responseDto.setDescription(savedProduct.getDescription());
    responseDto.setPrice(savedProduct.getPrice());
    responseDto.setInStock(savedProduct.isInStock());
    responseDto.setCreatedAt(savedProduct.getCreatedAt());
    responseDto.setUpdatedAt(savedProduct.getUpdatedAt());
    
    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
}
```

Using a mapping library like MapStruct or ModelMapper can simplify this conversion:

```java
@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponseDto toDto(Product product);
    Product toEntity(ProductCreateDto dto);
}

@PostMapping
public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductCreateDto productDto) {
    Product product = productMapper.toEntity(productDto);
    Product savedProduct = productService.save(product);
    ProductResponseDto responseDto = productMapper.toDto(savedProduct);
    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
}
```

### ResponseEntity

The `ResponseEntity` class gives you control over HTTP response status codes, headers, and body:

```java
@GetMapping("/{id}")
public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
    return productService.findById(id)
            .map(product -> {
                ProductResponseDto dto = productMapper.toDto(product);
                return ResponseEntity.ok()
                        .header("Custom-Header", "Value")
                        .body(dto);
            })
            .orElse(ResponseEntity.notFound().build());
}

// Returning different status codes
@PostMapping
public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductCreateDto productDto) {
    Product product = productMapper.toEntity(productDto);
    Product savedProduct = productService.save(product);
    ProductResponseDto responseDto = productMapper.toDto(savedProduct);
    
    URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedProduct.getId())
            .toUri();
    
    return ResponseEntity.created(location).body(responseDto);
}

// Conditional responses
@GetMapping("/{id}")
public ResponseEntity<ProductResponseDto> getProductWithETag(
        @PathVariable Long id,
        @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
    
    Optional<Product> productOpt = productService.findById(id);
    
    if (productOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    
    Product product = productOpt.get();
    String eTag = "\"" + product.getVersion() + "\"";
    
    if (eTag.equals(ifNoneMatch)) {
        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
    }
    
    ProductResponseDto dto = productMapper.toDto(product);
    return ResponseEntity.ok()
            .eTag(eTag)
            .body(dto);
}
```

### Customizing Response Status Codes

Besides `ResponseEntity`, you can use `@ResponseStatus` to customize response status codes:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ProductResponseDto createProduct(@Valid @RequestBody ProductCreateDto productDto) {
    Product product = productMapper.toEntity(productDto);
    Product savedProduct = productService.save(product);
    return productMapper.toDto(savedProduct);
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteProduct(@PathVariable Long id) {
    productService.deleteById(id);
}
```

### Response Headers

Adding custom headers to your responses:

```java
@GetMapping("/{id}")
public ResponseEntity<ProductResponseDto> getProductWithHeaders(@PathVariable Long id) {
    return productService.findById(id)
            .map(product -> {
                ProductResponseDto dto = productMapper.toDto(product);
                
                return ResponseEntity.ok()
                        .header("X-Custom-Header", "Value")
                        .header("Cache-Control", "max-age=3600")
                        .lastModified(product.getUpdatedAt().toEpochMilli())
                        .body(dto);
            })
            .orElse(ResponseEntity.notFound().build());
}
```

### Working with File Uploads

Handling file uploads in REST APIs:

```java
@PostMapping("/upload")
public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("Please upload a file");
    }
    
    try {
        // Save the file
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path targetLocation = Paths.get("uploads").resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return ResponseEntity.ok("File uploaded successfully: " + fileName);
    } catch (IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Could not upload file: " + ex.getMessage());
    }
}

// Multiple file upload
@PostMapping("/upload-multiple")
public ResponseEntity<List<String>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
    List<String> uploadedFiles = new ArrayList<>();
    
    for (MultipartFile file : files) {
        if (!file.isEmpty()) {
            try {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                Path targetLocation = Paths.get("uploads").resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                uploadedFiles.add(fileName);
            } catch (IOException ex) {
                // Log exception
            }
        }
    }
    
    return ResponseEntity.ok(uploadedFiles);
}
```

### File Downloads

Handling file downloads in REST APIs:

```java
@GetMapping("/download/{fileName:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
    // Load file as Resource
    Path filePath = Paths.get("uploads").resolve(fileName).normalize();
    Resource resource;
    
    try {
        resource = new UrlResource(filePath.toUri());
        
        if (resource.exists()) {
            // Determine content type
            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    } catch (IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
```

### Streaming Responses

For large responses, streaming can be more efficient:

```java
@GetMapping(value = "/stream", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<StreamingResponseBody> streamData() {
    StreamingResponseBody responseBody = outputStream -> {
        for (int i = 0; i < 1000; i++) {
            Product product = productService.generateRandomProduct();
            String jsonProduct = objectMapper.writeValueAsString(product);
            outputStream.write(jsonProduct.getBytes());
            outputStream.write("\n".getBytes());
            outputStream.flush();
            
            // Simulate processing time
            Thread.sleep(10);
        }
    };
    
    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .body(responseBody);
}
```

### Server-Sent Events (SSE)

For real-time updates to clients:

```java
@GetMapping(value = "/sse-events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamEvents() {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    
    // Save the emitter somewhere to use it to send events
    // For example, in a concurrent map with a UUID as key
    String emitterId = UUID.randomUUID().toString();
    emitterService.addEmitter(emitterId, emitter);
    
    emitter.onCompletion(() -> emitterService.removeEmitter(emitterId));
    emitter.onTimeout(() -> emitterService.removeEmitter(emitterId));
    
    // Send initial events
    try {
        emitter.send(SseEmitter.event()
                .name("INIT")
                .data("Connected"));
    } catch (IOException e) {
        emitter.completeWithError(e);
    }
    
    return emitter;
}

// Service to send events to all connected clients
@Scheduled(fixedRate = 1000)
public void sendEvents() {
    List<Product> products = productService.getRecentProducts();
    emitterService.getAllEmitters().forEach((id, emitter) -> {
        try {
            emitter.send(SseEmitter.event()
                    .name("PRODUCTS_UPDATE")
                    .data(products));
        } catch (IOException e) {
            emitterService.removeEmitter(id);
        }
    });
}
```

### Working with JSON

Customizing JSON serialization/deserialization:

```java
// Using Jackson annotations in DTOs
public class ProductResponseDto {
    private Long id;
    
    private String name;
    
    @JsonProperty("product_description")  // Custom field name in JSON
    private String description;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonInclude(JsonInclude.Include.NON_NULL)  // Skip null values
    private String optionalField;
    
    @JsonIgnore  // Exclude from JSON
    private String internalNote;
    
    // Getters and setters
}
```

Custom serialization with Jackson:

```java
@Bean
public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    
    // Configure dates to be serialized as ISO strings
    mapper.registerModule(new JavaTimeModule());
    mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    
    // Don't fail on unknown properties
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    
    // Exclude null fields
    mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    
    return mapper;
}
```

### Pagination and Sorting

Spring Data provides built-in support for pagination and sorting:

```java
@GetMapping
public ResponseEntity<Page<ProductResponseDto>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {
    
    Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
    
    Page<Product> productPage = productService.findAll(pageable);
    
    Page<ProductResponseDto> dtoPage = productPage.map(productMapper::toDto);
    
    return ResponseEntity.ok(dtoPage);
}
```

Custom response format for pagination:

```java
@GetMapping
public ResponseEntity<Map<String, Object>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    Pageable pageable = PageRequest.of(page, size);
    Page<Product> productPage = productService.findAll(pageable);
    
    List<ProductResponseDto> products = productPage.getContent()
            .stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    
    Map<String, Object> response = new HashMap<>();
    response.put("products", products);
    response.put("currentPage", productPage.getNumber());
    response.put("totalItems", productPage.getTotalElements());
    response.put("totalPages", productPage.getTotalPages());
    response.put("first", productPage.isFirst());
    response.put("last", productPage.isLast());
    response.put("hasNext", productPage.hasNext());
    response.put("hasPrevious", productPage.hasPrevious());
    
    return ResponseEntity.ok(response);
}
```

### Request and Response Best Practices

1. **Use DTOs**: Separate your API models from domain entities
2. **Validate input**: Use JSR-380 annotations for validation
3. **Follow HTTP semantics**: Use appropriate status codes and methods
4. **Provide meaningful error responses**: Include error details and codes
5. **Use pagination**: For collections that can grow large
6. **Include hypermedia links**: Follow HATEOAS principles
7. **Document your API**: Add OpenAPI/Swagger annotations
8. **Use content negotiation**: Support multiple formats if needed
9. **Implement conditional requests**: Use ETags for caching

## Exception Handling

Proper exception handling is crucial for building robust REST APIs. It improves error visibility, enhances API usability, and provides better security. Spring Boot offers several mechanisms for handling exceptions in a consistent and maintainable way.

### Global Exception Handling with @ControllerAdvice

Spring's `@ControllerAdvice` and `@RestControllerAdvice` annotations provide a centralized way to handle exceptions across all controllers:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("status", HttpStatus.NOT_FOUND.toString());
        errorResponse.put("timestamp", new Date().toString());
        return errorResponse;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGenericException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "An unexpected error occurred");
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.toString());
        errorResponse.put("timestamp", new Date().toString());
        errorResponse.put("error", ex.getMessage());
        return errorResponse;
    }
}
```

### Creating Custom Exceptions

Define custom exceptions to represent specific error cases in your application:

```java
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}

public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
```

### Handling Validation Errors

As seen in the previous section, you can handle validation errors in a dedicated method:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ... other exception handlers

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("timestamp", new Date());
        errorResponse.put("errors", errors);
        
        return errorResponse;
    }
}
```

### Handling Request Body Parsing Errors

Handle malformed JSON or XML in request bodies:

```java
@ExceptionHandler(HttpMessageNotReadableException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, String> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", "Malformed request body");
    errorResponse.put("error", ex.getMessage());
    errorResponse.put("status", HttpStatus.BAD_REQUEST.toString());
    return errorResponse;
}
```

### Handling Method Argument Type Mismatch

Handle cases where request parameters have incorrect types:

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, String> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", String.format(
            "The parameter '%s' of value '%s' could not be converted to type '%s'",
            ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName()));
    errorResponse.put("status", HttpStatus.BAD_REQUEST.toString());
    return errorResponse;
}
```

### Handling Missing Path Variables

Handle cases where path variables are missing:

```java
@ExceptionHandler(MissingPathVariableException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, String> handleMissingPathVariable(MissingPathVariableException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", String.format("The path variable '%s' is missing", ex.getVariableName()));
    errorResponse.put("status", HttpStatus.BAD_REQUEST.toString());
    return errorResponse;
}
```

### Handling Missing Request Parameters

Handle cases where required request parameters are missing:

```java
@ExceptionHandler(MissingServletRequestParameterException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, String> handleMissingRequestParameter(MissingServletRequestParameterException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", String.format("The parameter '%s' of type '%s' is required", 
            ex.getParameterName(), ex.getParameterType()));
    errorResponse.put("status", HttpStatus.BAD_REQUEST.toString());
    return errorResponse;
}
```

### Error Response Structure

It's important to have a consistent error response structure. Here's an example of a well-structured error response:

```java
public class ErrorResponse {
    private int status;
    private String message;
    private String path;
    private Date timestamp;
    private Map<String, String> errors;
    
    // Constructors, getters, setters
}

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private HttpServletRequest request;

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
        errorResponse.setMessage(ex.getMessage());
        errorResponse.setPath(request.getRequestURI());
        errorResponse.setTimestamp(new Date());
        return errorResponse;
    }
    
    // Other exception handlers...
}
```

The JSON output for this structure would look like:

```json
{
  "status": 404,
  "message": "Product not found with id: '123'",
  "path": "/api/v1/products/123",
  "timestamp": "2023-07-20T15:30:45.123Z",
  "errors": null
}
```

For validation errors:

```json
{
  "status": 400,
  "message": "Validation failed",
  "path": "/api/v1/products",
  "timestamp": "2023-07-20T15:30:45.123Z",
  "errors": {
    "name": "Product name is required",
    "price": "Price must be positive"
  }
}
```

### Exception Handling Best Practices

1. **Use Custom Exceptions**: Create specific exceptions for different error cases.
2. **Centralize Exception Handling**: Use `@ControllerAdvice` to handle exceptions globally.
3. **Provide Clear Error Messages**: Error messages should be clear and helpful.
4. **Include Error Details**: Include all relevant details (timestamp, path, error code, etc.).
5. **Use Appropriate HTTP Status Codes**: Map exceptions to appropriate HTTP status codes.
6. **Avoid Exposing Sensitive Information**: Don't leak implementation details or stack traces.
7. **Log Exceptions**: Log exceptions properly, especially unexpected ones.
8. **Consistent Response Format**: Maintain a consistent error response format across your API.
9. **Internationalization**: Consider supporting multiple languages for error messages.
10. **Document Error Responses**: Include error responses in your API documentation.

### Examples of Status Code Mappings

Here's a mapping of common exceptions to appropriate HTTP status codes:

| Exception | Status Code | Description |
|-----------|-------------|-------------|
| ResourceNotFoundException | 404 Not Found | Resource doesn't exist |
| BadRequestException | 400 Bad Request | Invalid request parameters or format |
| ValidationException | 400 Bad Request | Input validation failures |
| AccessDeniedException | 403 Forbidden | Authenticated but not authorized |
| AuthenticationException | 401 Unauthorized | Not authenticated |
| ResourceAlreadyExistsException | 409 Conflict | Resource already exists |
| MethodArgumentNotValidException | 400 Bad Request | Bean validation errors |
| HttpMessageNotReadableException | 400 Bad Request | Malformed request body |
| MethodNotAllowedException | 405 Method Not Allowed | HTTP method not supported |
| HttpMediaTypeNotSupportedException | 415 Unsupported Media Type | Unsupported content type |
| HttpMediaTypeNotAcceptableException | 406 Not Acceptable | Cannot generate response in requested format |
| ConcurrencyFailureException | 409 Conflict | Concurrent modification issues |
| RuntimeException | 500 Internal Server Error | Unexpected server errors |

### Creating a Unified Exception Handler

For larger applications, consider creating a more structured exception handling system:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @Autowired
    private MessageSource messageSource;
    
    @Autowired
    private HttpServletRequest request;
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception ex, Locale locale) {
        logger.error("Unexpected error", ex);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "error.unexpected", 
                new Object[]{}, 
                locale, 
                ex);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex, Locale locale) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND, 
                "error.resource.notfound", 
                new Object[]{ex.getResourceName(), ex.getFieldName(), ex.getFieldValue()}, 
                locale, 
                ex);
    }
    
    // Other exception handlers...
    
    private ErrorResponse buildErrorResponse(
            HttpStatus status, 
            String messageKey, 
            Object[] args, 
            Locale locale, 
            Exception ex) {
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatus(status.value());
        errorResponse.setError(status.getReasonPhrase());
        errorResponse.setMessage(messageSource.getMessage(messageKey, args, locale));
        errorResponse.setPath(request.getRequestURI());
        errorResponse.setTimestamp(new Date());
        
        if (ex instanceof MethodArgumentNotValidException) {
            Map<String, String> errors = new HashMap<>();
            ((MethodArgumentNotValidException) ex).getBindingResult().getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            errorResponse.setErrors(errors);
        }
        
        return errorResponse;
    }
}
```

## Content Negotiation

Content negotiation is the process of selecting the best representation for a resource when there are multiple representations available. In REST APIs, it allows clients to request resources in the format they prefer, such as JSON, XML, or custom media types.

### Media Types

Common media types used in REST APIs:

| Media Type | Description | Common Use |
|------------|-------------|------------|
| `application/json` | JSON format | Most widely used format for modern APIs |
| `application/xml` | XML format | Still used in enterprise systems |
| `application/x-www-form-urlencoded` | Form data | Common for HTML form submissions |
| `multipart/form-data` | File uploads with form data | Used for file uploads |
| `text/plain` | Plain text | Simple text responses |
| `text/html` | HTML format | Rendering HTML pages |
| `application/pdf` | PDF document | Document download |
| `application/octet-stream` | Binary data | Generic binary data |
| `application/vnd.api+json` | JSON:API specification | Standardized JSON format |
| `application/hal+json` | HAL specification | Hypermedia-enabled JSON |

### Content Negotiation Strategies

Spring Boot supports several content negotiation strategies:

1. **HTTP Headers**: Using the `Accept` header
2. **Path Extensions**: Using file extensions like `.json`, `.xml`
3. **Query Parameters**: Using parameters like `?format=json`

### Configuring Content Negotiation

Configure content negotiation in your application:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)          // Enable parameter strategy
            .parameterName("format")        // Parameter name (e.g., ?format=json)
            .ignoreAcceptHeader(false)      // Don't ignore Accept header
            .useRegisteredExtensionsOnly(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .mediaType("pdf", MediaType.APPLICATION_PDF);
    }
}
```

With YAML configuration in `application.yml`:

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true
      parameter-name: format
      media-types:
        json: application/json
        xml: application/xml
        pdf: application/pdf
      default-content-type: application/json
```

### Supporting Multiple Formats in Controllers

Controllers can respond with different formats:

```java
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    
    // Constructor...
    
    @GetMapping(value = "/{id}", 
                produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public Product getProduct(@PathVariable Long id) {
        return productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }
}
```

### Custom Media Types

You can define custom media types for specialized responses:

```java
// Custom media type constants
public final class CustomMediaTypes {
    public static final String APPLICATION_JSON_V1_VALUE = "application/vnd.myapp.v1+json";
    public static final String APPLICATION_JSON_V2_VALUE = "application/vnd.myapp.v2+json";
    
    public static final MediaType APPLICATION_JSON_V1 = MediaType.valueOf(APPLICATION_JSON_V1_VALUE);
    public static final MediaType APPLICATION_JSON_V2 = MediaType.valueOf(APPLICATION_JSON_V2_VALUE);
}

// Controller with custom media types
@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping(value = "/{id}", produces = CustomMediaTypes.APPLICATION_JSON_V1_VALUE)
    public ProductV1Dto getProductV1(@PathVariable Long id) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return productMapperV1.toDto(product);
    }
    
    @GetMapping(value = "/{id}", produces = CustomMediaTypes.APPLICATION_JSON_V2_VALUE)
    public ProductV2Dto getProductV2(@PathVariable Long id) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return productMapperV2.toDto(product);
    }
}
```

### Message Converters

Spring uses message converters to convert between HTTP requests/responses and Java objects. The most common converters are:

1. `MappingJackson2HttpMessageConverter` - Converts JSON to/from Java objects
2. `MappingJackson2XmlHttpMessageConverter` - Converts XML to/from Java objects
3. `StringHttpMessageConverter` - Converts plain text
4. `ByteArrayHttpMessageConverter` - Converts byte arrays

You can customize these converters or add your own:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Customize existing converters
        converters.forEach(converter -> {
            if (converter instanceof MappingJackson2HttpMessageConverter) {
                MappingJackson2HttpMessageConverter jsonConverter = (MappingJackson2HttpMessageConverter) converter;
                ObjectMapper objectMapper = jsonConverter.getObjectMapper();
                objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                objectMapper.registerModule(new JavaTimeModule());
            }
        });
        
        // Add custom converter
        converters.add(new CsvHttpMessageConverter());
    }
}
```

### Accept Header Handling

The `Accept` header specifies which media types are acceptable for the response:

- `Accept: application/json` - Client accepts only JSON
- `Accept: application/xml` - Client accepts only XML
- `Accept: application/json, application/xml` - Client accepts JSON or XML (JSON preferred)
- `Accept: application/json;q=0.5, application/xml;q=0.8` - Client accepts JSON or XML (XML preferred)

Spring handles this automatically based on your controller's `produces` attribute and configured message converters.

### Content Type Header for Requests

For requests with a body, clients should specify the `Content-Type` header to indicate the format of the data they're sending:

- `Content-Type: application/json` - Request body is in JSON format
- `Content-Type: application/xml` - Request body is in XML format
- `Content-Type: multipart/form-data` - Request body is form data with file uploads

Spring uses this header to determine which message converter to use for parsing the request body.

### JSON Configuration

Customize JSON serialization/deserialization with Jackson:

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Don't include null values in JSON output
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        
        // Use ISO-8601 format for dates
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Don't fail on unknown properties
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Use camelCase for property names (default in Java)
        // For snake_case, uncomment:
        // objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        
        return mapper;
    }
}
```

### XML Configuration

Configure XML serialization/deserialization:

```java
@Configuration
public class XmlConfig {

    @Bean
    public Jackson2ObjectMapperBuilder jacksonXmlBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.indentOutput(true);
        builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        builder.modules(new JavaTimeModule());
        builder.defaultUseWrapper(false);  // Don't wrap collections
        return builder;
    }

    @Bean
    public XmlMapper xmlMapper(Jackson2ObjectMapperBuilder jacksonXmlBuilder) {
        XmlMapper xmlMapper = jacksonXmlBuilder.createXmlMapper(true).build();
        xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return xmlMapper;
    }
}
```

### Response Format Selection Order

Spring Boot determines the response format in this order:

1. Format parameter in the URL if enabled (e.g., `?format=json`)
2. Path extension if enabled (e.g., `/products/123.json`)
3. `Accept` header in the request
4. Default content type configured in the application

### Handling Unsupported Media Types

When a client requests a media type that your API doesn't support, Spring Boot returns a 406 Not Acceptable status. You can customize this behavior:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public Map<String, String> handleMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Unsupported media type");
        response.put("message", "This API supports only application/json and application/xml");
        response.put("supported_types", "application/json, application/xml");
        return response;
    }
}
```

### Content Negotiation Best Practices

1. **Use JSON as Default**: JSON is the most widely used format for modern APIs.
2. **Support Multiple Formats**: Consider supporting both JSON and XML for broader compatibility.
3. **Use Standard Headers**: Prefer Accept/Content-Type headers over URL parameters for format selection.
4. **Document Supported Formats**: Clearly document which formats your API supports.
5. **Consistent Media Types**: Use consistent media types across your API.
6. **Test Different Formats**: Test your API with different content negotiation methods.
7. **Meaningful Error Messages**: Return helpful error messages for unsupported formats.
8. **Avoid Path Extensions**: Path extensions (e.g., `.json`) are being deprecated in modern APIs.
9. **Use Version-Specific Media Types**: For versioning, consider using custom media types.
10. **Keep Default Configuration**: Spring Boot's default content negotiation configuration works well for most cases.

## API Documentation with OpenAPI/Swagger

Good API documentation is essential for developers using your API. OpenAPI (formerly known as Swagger) is a specification for documenting REST APIs that Spring Boot can easily integrate with.

### Introduction to OpenAPI

OpenAPI is a specification for machine-readable API documentation files that describe RESTful APIs. It allows both humans and computers to understand the capabilities of a service without direct access to its implementation or source code.

### Adding SpringDoc OpenAPI to Your Project

To add OpenAPI documentation to your Spring Boot application, use the SpringDoc OpenAPI library:

```xml
<!-- For Maven -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

```gradle
// For Gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'
```

This dependency provides:
- OpenAPI 3 specification generation
- Swagger UI integration
- Spring Boot integration

### Basic Configuration

Once added, SpringDoc automatically generates an OpenAPI specification for your API. Access the documentation at:

- OpenAPI JSON: `/v3/api-docs`
- OpenAPI YAML: `/v3/api-docs.yaml`
- Swagger UI: `/swagger-ui.html`

You can customize the OpenAPI configuration using `application.properties`:

```properties
# OpenAPI properties
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true

# API info
springdoc.info.title=Product API
springdoc.info.description=Spring Boot REST API for Product Management
springdoc.info.version=1.0.0
springdoc.info.termsOfService=http://example.com/terms/
springdoc.info.contact.name=API Support
springdoc.info.contact.url=https://example.com/support
springdoc.info.contact.email=support@example.com
springdoc.info.license.name=Apache 2.0
springdoc.info.license.url=https://www.apache.org/licenses/LICENSE-2.0.html
```

### Java Configuration

For more control, configure OpenAPI using a configuration class:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product API")
                        .description("Spring Boot REST API for Product Management")
                        .version("1.0.0")
                        .termsOfService("http://example.com/terms/")
                        .contact(new Contact()
                                .name("API Support")
                                .url("https://example.com/support")
                                .email("support@example.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .externalDocs(new ExternalDocumentation()
                        .description("Product API Documentation")
                        .url("https://example.com/docs"));
    }
}
```

### Documenting Controllers

Use OpenAPI annotations to document your controllers:

```java
@RestController
@RequestMapping("/products")
@Tag(name = "Product Management", description = "API endpoints for product management")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(
        summary = "Get all products",
        description = "Returns a list of all products with pagination support",
        responses = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved products",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = ProductResponseDto.class))
                    )),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    ))
        }
    )
    public Page<ProductResponseDto> getAllProducts(
            @Parameter(description = "Page number (zero-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort field", example = "name")
            @RequestParam(defaultValue = "id") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        
        Page<Product> productPage = productService.findAll(pageable);
        
        Page<ProductResponseDto> dtoPage = productPage.map(productMapper::toDto);
        
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get product by ID",
        description = "Returns a single product by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ProductResponseDto.class)
                    )),
            @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    ))
        }
    )
    public ResponseEntity<ProductResponseDto> getProductById(
            @Parameter(description = "Product ID", example = "1", required = true)
            @PathVariable Long id) {
        
        return productService.findById(id)
                .map(product -> ResponseEntity.ok(productMapper.toDto(product)))
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    @PostMapping
    @Operation(
        summary = "Create new product",
        description = "Creates a new product with the provided information",
        responses = {
            @ApiResponse(responseCode = "201", description = "Product created successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ProductResponseDto.class)
                    )),
            @ApiResponse(responseCode = "400", description = "Invalid product data",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    ))
        }
    )
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    public ResponseEntity<ProductResponseDto> createProduct(
            @Parameter(description = "Product details", required = true)
            @Valid @RequestBody ProductCreateDto productDto) {
        
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productService.save(product);
        ProductResponseDto responseDto = productMapper.toDto(savedProduct);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedProduct.getId())
                .toUri();
        
        return ResponseEntity.created(location).body(responseDto);
    }

    // Other methods...
}
```

### Documenting Data Models

Add documentation to your data models:

```java
@Schema(description = "Product creation request")
public class ProductCreateDto {
    
    @Schema(description = "Product name", example = "Smartphone", required = true)
    @NotBlank
    private String name;
    
    @Schema(description = "Product description", example = "Latest smartphone model with advanced features")
    private String description;
    
    @Schema(description = "Product price", example = "799.99", required = true)
    @NotNull
    @Positive
    private BigDecimal price;
    
    @Schema(description = "Whether the product is in stock", example = "true", defaultValue = "false")
    private boolean inStock;
    
    // Getters and setters
}

@Schema(description = "Product response")
public class ProductResponseDto {
    
    @Schema(description = "Product ID", example = "1")
    private Long id;
    
    @Schema(description = "Product name", example = "Smartphone")
    private String name;
    
    @Schema(description = "Product description", example = "Latest smartphone model with advanced features")
    private String description;
    
    @Schema(description = "Product price", example = "799.99")
    private BigDecimal price;
    
    @Schema(description = "Whether the product is in stock", example = "true")
    private boolean inStock;
    
    @Schema(description = "Creation timestamp", example = "2023-07-20T15:30:45.123Z")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2023-07-20T16:45:12.456Z")
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

### Global API Information

Set up global API information:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
            .components(new Components()
                    .addSecuritySchemes("bearerAuth", new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")))
            .info(new Info()
                    .title("Product API")
                    .description("Spring Boot REST API for Product Management")
                    .version("1.0.0")
                    .contact(new Contact()
                            .name("API Support")
                            .url("https://example.com/support")
                            .email("support@example.com"))
                    .license(new License()
                            .name("Apache 2.0")
                            .url("https://www.apache.org/licenses/LICENSE-2.0")))
            .externalDocs(new ExternalDocumentation()
                    .description("Product API Documentation")
                    .url("https://example.com/docs"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
}
```

### Server Information

Define server information:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
            // Other configuration...
            .servers(List.of(
                    new Server()
                            .url("https://api.example.com")
                            .description("Production server"),
                    new Server()
                            .url("https://staging-api.example.com")
                            .description("Staging server"),
                    new Server()
                            .url("http://localhost:8080")
                            .description("Development server")
            ));
}
```

### Security Documentation

Document security requirements:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
            .components(new Components()
                    .addSecuritySchemes("bearerAuth", new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("JWT token authentication"))
                    .addSecuritySchemes("basicAuth", new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("basic")
                            .description("Basic authentication")))
            // Other configuration...
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
}
```

For method-level security:

```java
@DeleteMapping("/{id}")
@Operation(
    summary = "Delete product",
    description = "Deletes a product by its ID. Requires admin role.",
    security = @SecurityRequirement(name = "bearerAuth"),
    responses = {
        @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires admin role")
    }
)
public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    // ...
}
```

### Tags for Grouping

Use tags to group API endpoints:

```java
@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Product management endpoints")
public class ProductController {
    // ...
}

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {
    // ...
}
```

And in the OpenAPI configuration:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
            // Other configuration...
            .tags(List.of(
                    new Tag().name("Products").description("Product management endpoints"),
                    new Tag().name("Orders").description("Order management endpoints"),
                    new Tag().name("Authentication").description("Authentication endpoints")
            ));
}
```

### Customizing the Swagger UI

Configure the Swagger UI appearance:

```java
@Bean
public SwaggerUiConfigParameters swaggerUiConfigParameters() {
    return new SwaggerUiConfigParameters()
            .displayOperationId(false)
            .defaultModelsExpandDepth(1)
            .defaultModelExpandDepth(1)
            .defaultModelRendering(ModelRendering.EXAMPLE)
            .displayRequestDuration(true)
            .docExpansion(DocExpansion.NONE)
            .filter("")
            .maxDisplayedTags(null)
            .operationsSorter(OperationsSorter.ALPHA)
            .showExtensions(false)
            .showCommonExtensions(false)
            .tagsSorter(TagsSorter.ALPHA)
            .supportedSubmitMethods(UiConfiguration.Constants.DEFAULT_SUBMIT_METHODS)
            .validatorUrl(null);
}
```

### Controlling What Gets Documented

You can control which endpoints are documented:

```java
@Bean
public GroupedOpenApi publicApi() {
    return GroupedOpenApi.builder()
            .group("public-api")
            .pathsToMatch("/api/v1/public/**")
            .build();
}

@Bean
public GroupedOpenApi adminApi() {
    return GroupedOpenApi.builder()
            .group("admin-api")
            .pathsToMatch("/api/v1/admin/**")
            .build();
}
```

Or exclude specific paths:

```java
@Bean
public GroupedOpenApi productApi() {
    return GroupedOpenApi.builder()
            .group("product-api")
            .pathsToMatch("/api/v1/**")
            .pathsToExclude("/api/v1/admin/**")
            .build();
}
```

### OpenAPI/Swagger Best Practices

1. **Document Everything**: All endpoints, parameters, request bodies, and responses.
2. **Use Meaningful Examples**: Provide realistic examples in your documentation.
3. **Group Related Endpoints**: Use tags to group related endpoints.
4. **Document Security Requirements**: Clearly explain authentication and authorization requirements.
5. **Include Error Responses**: Document all possible error responses and codes.
6. **Keep Documentation Updated**: Update the documentation when you change the API.
7. **Use Descriptive Operation IDs**: These can be used for client code generation.
8. **Validate Your Specification**: Ensure your OpenAPI specification is valid.
9. **Disable in Production**: Consider disabling Swagger UI in production environments.
10. **Use Markdown in Descriptions**: Enhance your descriptions with Markdown formatting.

## HATEOAS Implementation

HATEOAS (Hypermedia as the Engine of Application State) is a constraint of the REST architectural style that keeps a RESTful service truly RESTful. It allows clients to navigate APIs dynamically by including hypermedia links in responses.

### What is HATEOAS?

HATEOAS makes your API self-descriptive and discoverable. Instead of clients having hard-coded knowledge of API endpoints, the API responses include hypermedia links that guide clients on what they can do next.

A typical HATEOAS response includes:
- Resource data (like product information)
- Links to related resources (like related products)
- Links to actions that can be performed on the resource (like update or delete)

### Spring HATEOAS

To implement HATEOAS in a Spring Boot application, use the Spring HATEOAS library:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>
```

### Basic Link Creation

Spring HATEOAS provides classes for creating links:

```java
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public EntityModel<Product> getProduct(@PathVariable Long id) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        // Create links
        Link selfLink = linkTo(methodOn(ProductController.class).getProduct(id)).withSelfRel();
        Link allProductsLink = linkTo(methodOn(ProductController.class).getAllProducts(null, null)).withRel("products");
        
        // Return the resource with links
        return EntityModel.of(product, selfLink, allProductsLink);
    }
    
    @GetMapping
    public CollectionModel<EntityModel<Product>> getAllProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        
        List<Product> products = productService.findAll();
        
        List<EntityModel<Product>> productResources = products.stream()
                .map(product -> EntityModel.of(product,
                        linkTo(methodOn(ProductController.class).getProduct(product.getId())).withSelfRel(),
                        linkTo(methodOn(ProductController.class).getAllProducts(null, null)).withRel("products")))
                .collect(Collectors.toList());
        
        Link selfLink = linkTo(methodOn(ProductController.class).getAllProducts(page, size)).withSelfRel();
        
        return CollectionModel.of(productResources, selfLink);
    }
}
```

### Creating Custom Resource Classes

For more complex APIs, create dedicated resource classes:

```java
@Relation(collectionRelation = "products", itemRelation = "product")
public class ProductModel extends RepresentationModel<ProductModel> {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean inStock;
    
    // Constructors, getters, setters...
}

@RestController
@RequestMapping("/products")
public class ProductController {
    
    private final ProductService productService;
    private final ProductModelAssembler productModelAssembler;
    
    public ProductController(ProductService productService, ProductModelAssembler productModelAssembler) {
        this.productService = productService;
        this.productModelAssembler = productModelAssembler;
    }
    
    @GetMapping("/{id}")
    public ProductModel getProduct(@PathVariable Long id) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        return productModelAssembler.toModel(product);
    }
    
    @GetMapping
    public CollectionModel<ProductModel> getAllProducts() {
        List<Product> products = productService.findAll();
        return productModelAssembler.toCollectionModel(products);
    }
}
```

### Resource Assemblers

Resource assemblers convert domain objects to resource models with links:

```java
@Component
public class ProductModelAssembler implements RepresentationModelAssembler<Product, ProductModel> {
    
    @Override
    public ProductModel toModel(Product product) {
        ProductModel productModel = new ProductModel();
        productModel.setId(product.getId());
        productModel.setName(product.getName());
        productModel.setDescription(product.getDescription());
        productModel.setPrice(product.getPrice());
        productModel.setInStock(product.isInStock());
        
        // Add links
        productModel.add(linkTo(methodOn(ProductController.class).getProduct(product.getId())).withSelfRel());
        productModel.add(linkTo(methodOn(ProductController.class).getAllProducts()).withRel("products"));
        
        // Conditional links based on resource state
        if (product.isInStock()) {
            productModel.add(linkTo(methodOn(OrderController.class).createOrder(null))
                    .withRel("order"));
        }
        
        return productModel;
    }
    
    @Override
    public CollectionModel<ProductModel> toCollectionModel(Iterable<? extends Product> products) {
        List<ProductModel> productModels = StreamSupport.stream(products.spliterator(), false)
                .map(this::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(productModels,
                linkTo(methodOn(ProductController.class).getAllProducts()).withSelfRel());
    }
}
```

### Conditional Links

Add links conditionally based on the resource state or user permissions:

```java
@Component
public class ProductModelAssembler implements RepresentationModelAssembler<Product, ProductModel> {
    
    private final SecurityService securityService;
    
    public ProductModelAssembler(SecurityService securityService) {
        this.securityService = securityService;
    }
    
    @Override
    public ProductModel toModel(Product product) {
        ProductModel productModel = // ... create model
        
        // Always add self link
        productModel.add(linkTo(methodOn(ProductController.class).getProduct(product.getId())).withSelfRel());
        
        // Only add edit/delete links if user has permission
        if (securityService.canEditProduct(product)) {
            productModel.add(linkTo(methodOn(ProductController.class).updateProduct(product.getId(), null))
                    .withRel("update"));
        }
        
        if (securityService.canDeleteProduct(product)) {
            productModel.add(linkTo(methodOn(ProductController.class).deleteProduct(product.getId()))
                    .withRel("delete"));
        }
        
        // Add category link
        if (product.getCategory() != null) {
            productModel.add(linkTo(methodOn(CategoryController.class).getCategory(product.getCategory().getId()))
                    .withRel("category"));
        }
        
        return productModel;
    }
}
```

### Pagination with HATEOAS

Combine pagination with HATEOAS:

```java
@GetMapping
public PagedModel<EntityModel<Product>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
    Page<Product> productPage = productService.findAll(pageable);
    
    // Convert products to entity models with links
    List<EntityModel<Product>> productModels = productPage.getContent().stream()
            .map(product -> EntityModel.of(product,
                    linkTo(methodOn(ProductController.class).getProduct(product.getId())).withSelfRel()))
            .collect(Collectors.toList());
    
    // Create page metadata
    PagedModel.PageMetadata pageMetadata = new PagedModel.PageMetadata(
            productPage.getSize(),
            productPage.getNumber(),
            productPage.getTotalElements(),
            productPage.getTotalPages());
    
    // Create links for paged response
    Link selfLink = linkTo(methodOn(ProductController.class).getAllProducts(page, size)).withSelfRel();
    
    Link firstLink = linkTo(methodOn(ProductController.class).getAllProducts(0, size)).withRel(IanaLinkRelations.FIRST);
    Link lastLink = linkTo(methodOn(ProductController.class).getAllProducts(productPage.getTotalPages() - 1, size)).withRel(IanaLinkRelations.LAST);
    
    Link nextLink = productPage.hasNext() ?
            linkTo(methodOn(ProductController.class).getAllProducts(page + 1, size)).withRel(IanaLinkRelations.NEXT) :
            null;
    
    Link prevLink = productPage.hasPrevious() ?
            linkTo(methodOn(ProductController.class).getAllProducts(page - 1, size)).withRel(IanaLinkRelations.PREV) :
            null;
    
    // Build and return the paged model
    PagedModel<EntityModel<Product>> pagedModel = PagedModel.of(
            productModels,
            pageMetadata,
            selfLink,
            firstLink,
            lastLink);
    
    if (nextLink != null) pagedModel.add(nextLink);
    if (prevLink != null) pagedModel.add(prevLink);
    
    return pagedModel;
}
```

### Affordances

Affordances represent available actions on a resource:

```java
@GetMapping("/{id}")
public EntityModel<Product> getProduct(@PathVariable Long id) {
    Product product = productService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    
    // Create affordances
    Link selfLink = linkTo(methodOn(ProductController.class).getProduct(id)).withSelfRel();
    
    // Add affordance for updating the product
    Affordance updateAffordance = afford(methodOn(ProductController.class).updateProduct(id, null));
    selfLink = selfLink.andAffordance(updateAffordance);
    
    // Add affordance for deleting the product
    Affordance deleteAffordance = afford(methodOn(ProductController.class).deleteProduct(id));
    selfLink = selfLink.andAffordance(deleteAffordance);
    
    return EntityModel.of(product, selfLink);
}
```

### Profiles and Documentation

Use profiles to link to documentation about resources:

```java
@GetMapping("/{id}")
public EntityModel<Product> getProduct(@PathVariable Long id) {
    Product product = productService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    
    Link selfLink = linkTo(methodOn(ProductController.class).getProduct(id)).withSelfRel();
    Link profileLink = Link.of("https://example.com/docs/api/products").withRel("profile");
    
    return EntityModel.of(product, selfLink, profileLink);
}
```

### Hypermedia Types

Spring HATEOAS supports different hypermedia types:

1. **HAL (Hypertext Application Language)** - Default format
2. **HAL-FORMS** - HAL with form support
3. **Collection+JSON** - Collection representation
4. **UBER (Uniform Basis for Exchanging Representations)** - Alternate hypermedia format

Configure the hypermedia type:

```java
@Configuration
public class HypermediaConfig {

    @Bean
    public HypermediaMappingInformation hypermediaMappingInformation() {
        // Use HAL as default but support other formats
        return new HalConfiguration()
                .withMediaType(MediaTypes.HAL_JSON)
                .withMediaType(MediaTypes.HAL_FORMS_JSON);
    }
}
```

### HATEOAS Response Examples

Here's an example of a HAL response for a single product:

```json
{
  "id": 1,
  "name": "Smartphone",
}
```

## API Versioning Strategies

API versioning is essential for evolving your API without breaking existing client applications. There are several approaches to versioning REST APIs in Spring Boot.

### Why Version APIs?

1. **Backward Compatibility**: Allows existing clients to continue functioning
2. **Evolving Features**: Enables adding new features or changing existing ones
3. **Deprecation Strategy**: Provides a pathway for phasing out old functionality
4. **Client Migration**: Gives clients time to migrate to newer versions

### Common Versioning Strategies

#### 1. URI Path Versioning

Include the version in the URI path:

```
/v1/products
/v2/products
```

Implementation in Spring Boot:

```java
@RestController
@RequestMapping("/v1/products")
public class ProductV1Controller {
    
    @GetMapping("/{id}")
    public ProductV1Dto getProduct(@PathVariable Long id) {
        // Return v1 representation
    }
}

@RestController
@RequestMapping("/v2/products")
public class ProductV2Controller {
    
    @GetMapping("/{id}")
    public ProductV2Dto getProduct(@PathVariable Long id) {
        // Return v2 representation with new fields
    }
}
```

**Pros:**
- Simple to implement and understand
- Explicit and visible in the URL
- Easy to route and document
- Works with caching

**Cons:**
- URLs change as the API evolves
- URI should ideally represent the resource, not the API version

#### 2. Request Parameter Versioning

Specify the version as a query parameter:

```
/products?version=1
/products?version=2
```

Implementation:

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @GetMapping(value = "/{id}", params = "version=1")
    public ProductV1Dto getProductV1(@PathVariable Long id) {
        // Return v1 representation
    }
    
    @GetMapping(value = "/{id}", params = "version=2")
    public ProductV2Dto getProductV2(@PathVariable Long id) {
        // Return v2 representation
    }
}
```

**Pros:**
- Keeps the resource URI clean
- Easy to implement
- Default version possible by omitting the parameter

**Cons:**
- Harder to route at the infrastructure level
- Might be missed in documentation
- Can cause confusion with other query parameters

#### 3. HTTP Header Versioning

Use a custom HTTP header to specify the version:

```
X-API-Version: 1
X-API-Version: 2
```

Implementation:

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @GetMapping(value = "/{id}", headers = "X-API-Version=1")
    public ProductV1Dto getProductV1(@PathVariable Long id) {
        // Return v1 representation
    }
    
    @GetMapping(value = "/{id}", headers = "X-API-Version=2")
    public ProductV2Dto getProductV2(@PathVariable Long id) {
        // Return v2 representation
    }
}
```

**Pros:**
- Keeps the resource URI clean
- Separates versioning concerns from the URI
- Can be standardized across APIs

**Cons:**
- Less visible, harder to test
- May not work well with caching
- Custom headers might be stripped by proxies

#### 4. Media Type Versioning (Content Negotiation)

Use the `Accept` header with a versioned media type:

```
Accept: application/vnd.company.app-v1+json
Accept: application/vnd.company.app-v2+json
```

Implementation:

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @GetMapping(value = "/{id}", produces = "application/vnd.company.app-v1+json")
    public ProductV1Dto getProductV1(@PathVariable Long id) {
        // Return v1 representation
    }
    
    @GetMapping(value = "/{id}", produces = "application/vnd.company.app-v2+json")
    public ProductV2Dto getProductV2(@PathVariable Long id) {
        // Return v2 representation
    }
}
```

**Pros:**
- Follows HTTP content negotiation principles
- Keeps the resource URI clean
- Formal approach to versioning API representations

**Cons:**
- More complex to implement and test
- Custom media types are less widely understood
- May require special client configuration

### Combining Strategies

You can combine multiple versioning strategies:

```java
@RestController
public class ProductController {
    
    // URI versioning
    @GetMapping("/v1/products/{id}")
    public ProductV1Dto getProductByUri(@PathVariable Long id) {
        // V1 implementation
    }
    
    // Parameter versioning
    @GetMapping(value = "/products/{id}", params = "version=1")
    public ProductV1Dto getProductByParam(@PathVariable Long id) {
        // V1 implementation
    }
    
    // Header versioning
    @GetMapping(value = "/products/{id}", headers = "X-API-Version=1")
    public ProductV1Dto getProductByHeader(@PathVariable Long id) {
        // V1 implementation
    }
    
    // Media type versioning
    @GetMapping(value = "/products/{id}", produces = "application/vnd.company.app-v1+json")
    public ProductV1Dto getProductByMediaType(@PathVariable Long id) {
        // V1 implementation
    }
}
```

### Handling Multiple Versions with a Single Controller

For simpler APIs, you can handle versioning in a single controller:

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    private final ProductService productService;
    private final ProductV1Mapper productV1Mapper;
    private final ProductV2Mapper productV2Mapper;
    
    // Constructor injection...
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(
            @PathVariable Long id,
            @RequestHeader(value = "X-API-Version", defaultValue = "1") Integer apiVersion) {
        
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        if (apiVersion == 1) {
            ProductV1Dto dto = productV1Mapper.toDto(product);
            return ResponseEntity.ok(dto);
        } else if (apiVersion == 2) {
            ProductV2Dto dto = productV2Mapper.toDto(product);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.badRequest().body("Unsupported API version: " + apiVersion);
        }