# API Gateway in Microservices

## Overview
This guide covers the API Gateway pattern in microservices architecture, including implementation approaches, best practices, and common patterns.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of Spring Cloud Gateway
- Familiarity with routing concepts
- Understanding of authentication and authorization

## Learning Objectives
- Understand API Gateway pattern
- Learn different gateway implementations
- Master routing and filtering
- Implement security at gateway level
- Handle cross-cutting concerns

## Table of Contents
1. [API Gateway Pattern](#api-gateway-pattern)
2. [Implementation Approaches](#implementation-approaches)
3. [Security](#security)
4. [Cross-Cutting Concerns](#cross-cutting-concerns)
5. [Best Practices](#best-practices)

## API Gateway Pattern

### Core Functions
1. **Routing**
2. **Authentication**
3. **SSL Termination**
4. **Load Balancing**
5. **Monitoring**
6. **Rate Limiting**
7. **Circuit Breaking**

### Implementation with Spring Cloud Gateway

#### Basic Configuration
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user_service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
```

#### Java Configuration
```java
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_service", r -> r
                .path("/api/users/**")
                .filters(f -> f.stripPrefix(1))
                .uri("lb://user-service"))
            .build();
    }
}
```

## Implementation Approaches

### 1. Spring Cloud Gateway
```java
@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

### 2. Custom Filters
```java
@Component
public class CustomGatewayFilter implements GatewayFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getRequest().mutate()
            .header("X-Custom-Header", "custom-value");
        return chain.filter(exchange);
    }
}
```

### 3. Global Filters
```java
@Component
public class LoggingGlobalFilter implements GlobalFilter {
    private static final Logger log = LoggerFactory.getLogger(LoggingGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Path requested: {}", exchange.getRequest().getPath());
        return chain.filter(exchange);
    }
}
```

## Security

### JWT Authentication
```java
@Component
public class JwtAuthenticationFilter implements GatewayFilter {
    private final JwtTokenProvider tokenProvider;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = extractToken(exchange.getRequest());
        if (tokenProvider.validateToken(token)) {
            return chain.filter(exchange);
        }
        return Mono.error(new UnauthorizedException("Invalid token"));
    }
}
```

### Rate Limiting
```java
@Configuration
public class RateLimitConfig {
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getHeaders().getFirst("X-User-Id"));
    }
}
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
```

## Cross-Cutting Concerns

### Circuit Breaker
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user_service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceBreaker
                fallbackUri: forward:/fallback
```

### Request/Response Transformation
```java
@Component
public class TransformationFilter implements GatewayFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange.mutate()
            .request(exchange.getRequest().mutate()
                .header("X-Transformed", "true")
                .build())
            .build());
    }
}
```

### Logging and Monitoring
```java
@Component
public class MetricsFilter implements GlobalFilter {
    private final MeterRegistry meterRegistry;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();
        return chain.filter(exchange)
            .doFinally(signalType -> {
                long duration = System.currentTimeMillis() - startTime;
                meterRegistry.timer("gateway.request.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
            });
    }
}
```

## Best Practices
1. Implement proper security measures
2. Use circuit breakers for downstream services
3. Implement rate limiting
4. Monitor gateway performance
5. Handle errors gracefully
6. Implement proper logging
7. Use appropriate caching strategies

## Common Pitfalls
1. Insufficient security measures
2. Poor error handling
3. Missing rate limiting
4. Inadequate monitoring
5. Poor performance
6. Improper routing configuration

## Implementation Examples

### Complete Gateway Configuration
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user_service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: userServiceBreaker
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
        - id: order_service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: Retry
              args:
                retries: 3
                statuses: BAD_GATEWAY
```

### Error Handling
```java
@Component
public class GlobalErrorHandler implements ErrorWebExceptionHandler {
    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        return exchange.getResponse().writeWith(Mono.just(
            exchange.getResponse().bufferFactory().wrap(
                ex.getMessage().getBytes())));
    }
}
```

## Resources for Further Learning
- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [Netflix Zuul Wiki](https://github.com/Netflix/zuul/wiki)
- [Kong Gateway Documentation](https://docs.konghq.com/)
- [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)

## Practice Exercises
1. Set up Spring Cloud Gateway with service discovery
2. Implement custom filters
3. Configure rate limiting
4. Set up circuit breakers
5. Implement JWT authentication 