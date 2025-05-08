# Microservices Resilience Patterns

## Overview
This guide covers various resilience patterns and strategies used in microservices architecture to build robust and fault-tolerant systems.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of distributed systems
- Familiarity with Spring Boot
- Understanding of basic error handling

## Learning Objectives
- Understand different resilience patterns
- Learn how to implement circuit breakers
- Master retry mechanisms
- Implement fallback strategies
- Handle distributed system failures

## Table of Contents
1. [Circuit Breaker Pattern](#circuit-breaker-pattern)
2. [Retry Pattern](#retry-pattern)
3. [Bulkhead Pattern](#bulkhead-pattern)
4. [Fallback Pattern](#fallback-pattern)
5. [Rate Limiting](#rate-limiting)

## Circuit Breaker Pattern

### Overview
The Circuit Breaker pattern prevents cascading failures by failing fast and providing fallback behavior.

### States
1. **Closed** (Normal Operation)
2. **Open** (Failure State)
3. **Half-Open** (Recovery State)

### Implementation with Resilience4j
```java
@Service
public class OrderService {
    @CircuitBreaker(name = "orderService", fallbackMethod = "fallbackMethod")
    public Order getOrder(String orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    public Order fallbackMethod(String orderId, Exception ex) {
        return new Order(orderId, "Fallback Order");
    }
}
```

### Configuration
```yaml
resilience4j.circuitbreaker:
  instances:
    orderService:
      slidingWindowSize: 10
      failureRateThreshold: 50
      waitDurationInOpenState: 5000
      permittedNumberOfCallsInHalfOpenState: 3
```

## Retry Pattern

### Implementation
```java
@Service
public class PaymentService {
    @Retry(name = "paymentService", fallbackMethod = "fallbackPayment")
    public Payment processPayment(String paymentId) {
        return paymentGateway.process(paymentId);
    }

    public Payment fallbackPayment(String paymentId, Exception ex) {
        return new Payment(paymentId, PaymentStatus.FAILED);
    }
}
```

### Configuration
```yaml
resilience4j.retry:
  instances:
    paymentService:
      maxAttempts: 3
      waitDuration: 1s
      exponentialBackoff: true
      exponentialBackoffMultiplier: 2
```

## Bulkhead Pattern

### Thread Pool Bulkhead
```java
@Service
public class UserService {
    @Bulkhead(name = "userService", type = Bulkhead.Type.THREADPOOL)
    public User getUser(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
    }
}
```

### Semaphore Bulkhead
```java
@Service
public class ProductService {
    @Bulkhead(name = "productService", type = Bulkhead.Type.SEMAPHORE)
    public Product getProduct(String productId) {
        return productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException(productId));
    }
}
```

## Fallback Pattern

### Static Fallback
```java
@Service
public class CatalogService {
    private final Cache<String, Product> cache;

    @CircuitBreaker(name = "catalogService", fallbackMethod = "getCachedProduct")
    public Product getProduct(String productId) {
        return productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    private Product getCachedProduct(String productId, Exception ex) {
        return cache.getIfPresent(productId);
    }
}
```

### Dynamic Fallback
```java
@Service
public class RecommendationService {
    @CircuitBreaker(name = "recommendationService", fallbackMethod = "getDefaultRecommendations")
    public List<Product> getRecommendations(String userId) {
        return recommendationEngine.getPersonalizedRecommendations(userId);
    }

    private List<Product> getDefaultRecommendations(String userId, Exception ex) {
        return productRepository.findTopRated();
    }
}
```

## Rate Limiting

### Implementation
```java
@Service
public class APIService {
    @RateLimiter(name = "apiService")
    public Response processRequest(Request request) {
        return processAPIRequest(request);
    }
}
```

### Configuration
```yaml
resilience4j.ratelimiter:
  instances:
    apiService:
      limitForPeriod: 10
      limitRefreshPeriod: 1s
      timeoutDuration: 500ms
```

## Best Practices
1. Implement multiple resilience patterns together
2. Configure appropriate timeouts
3. Use monitoring and alerting
4. Implement proper logging
5. Test failure scenarios
6. Document fallback behaviors
7. Monitor circuit breaker states

## Common Pitfalls
1. Incorrect timeout configurations
2. Missing fallback implementations
3. Poor monitoring
4. Inadequate testing
5. Improper thread pool sizing
6. Missing rate limiting

## Implementation Examples

### Combined Patterns
```java
@Service
public class OrderProcessingService {
    @CircuitBreaker(name = "orderProcessing")
    @Retry(name = "orderProcessing")
    @Bulkhead(name = "orderProcessing")
    @RateLimiter(name = "orderProcessing")
    public Order processOrder(OrderRequest request) {
        return orderProcessor.process(request);
    }
}
```

### Resilience4j Configuration
```java
@Configuration
public class Resilience4jConfig {
    @Bean
    public CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50)
            .waitDurationInOpenState(Duration.ofMillis(1000))
            .slidingWindowSize(2)
            .build();
    }

    @Bean
    public RetryConfig retryConfig() {
        return RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(100))
            .build();
    }
}
```

## Resources for Further Learning
- [Resilience4j Documentation](https://resilience4j.readme.io/)
- [Spring Cloud Circuit Breaker](https://spring.io/projects/spring-cloud-circuitbreaker)
- [Netflix Hystrix Wiki](https://github.com/Netflix/Hystrix/wiki)
- [Microsoft Resilience Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/category/resiliency)

## Practice Exercises
1. Implement Circuit Breaker with custom configurations
2. Create a service with multiple resilience patterns
3. Implement custom fallback strategies
4. Set up monitoring for circuit breakers
5. Test different failure scenarios 