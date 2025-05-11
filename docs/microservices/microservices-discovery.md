# Service Discovery in Microservices

## Overview
This guide covers service discovery patterns and implementations in microservices architecture, including both client-side and server-side discovery patterns.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of load balancing concepts
- Familiarity with distributed systems
- Basic understanding of DNS

## Learning Objectives
- Understand service discovery patterns
- Learn different service discovery implementations
- Master service registration and deregistration
- Implement health checks
- Handle service discovery failures

## Table of Contents
1. [Service Discovery Patterns](#service-discovery-patterns)
2. [Service Registry](#service-registry)
3. [Implementation Approaches](#implementation-approaches)
4. [Health Checking](#health-checking)
5. [Best Practices](#best-practices)

## Service Discovery Patterns

### 1. Client-Side Discovery
- Direct service lookup
- Client-side load balancing
- Service instance selection
- Benefits and drawbacks

### 2. Server-Side Discovery
- Load balancer-based routing
- DNS-based routing
- Proxy-based routing
- Benefits and drawbacks

### 3. Hybrid Approaches
- Combined client and server discovery
- Edge service patterns
- Service mesh approaches

## Service Registry

### Components
1. **Service Registration**
   - Instance registration
   - Metadata management
   - Registration renewal

2. **Service Deregistration**
   - Graceful shutdown
   - Instance removal
   - Cleanup processes

3. **Health Checks**
   - Health check endpoints
   - Timeout configurations
   - Failure detection

### Popular Implementations

#### 1. Netflix Eureka
```java
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceRegistryApplication.class, args);
    }
}
```

#### 2. Consul
```yaml
service:
  name: user-service
  port: 8080
  checks:
    - http: http://localhost:8080/health
      interval: 10s
```

#### 3. Zookeeper
```java
@Configuration
public class ZookeeperConfig {
    @Bean
    public CuratorFramework curatorFramework() {
        return CuratorFrameworkFactory.newClient(
            "zookeeper:2181",
            new ExponentialBackoffRetry(1000, 3));
    }
}
```

## Implementation Approaches

### 1. Spring Cloud Netflix
```java
@SpringBootApplication
@EnableDiscoveryClient
public class ServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceApplication.class, args);
    }
}
```

### 2. Kubernetes Service Discovery
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### 3. Consul Service Discovery
```java
@Configuration
public class ConsulConfig {
    @Bean
    public ConsulClient consulClient() {
        return new ConsulClient("localhost", 8500);
    }
}
```

## Health Checking

### 1. Implementation
```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<HealthStatus> checkHealth() {
        return ResponseEntity.ok(new HealthStatus("UP"));
    }
}
```

### 2. Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health
  health:
    show-details: always
```

## Best Practices
1. Implement proper health checks
2. Use appropriate timeouts
3. Handle failure scenarios gracefully
4. Implement circuit breakers
5. Monitor service registry
6. Implement proper security
7. Use appropriate caching strategies

## Common Pitfalls
1. Insufficient health checks
2. Poor timeout configurations
3. Missing security measures
4. Inadequate monitoring
5. Poor cache invalidation
6. Missing fallback mechanisms

## Implementation Examples

### Service Registration with Eureka
```java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    @Value("${server.port}")
    private int serverPort;

    @Value("${spring.application.name}")
    private String applicationName;

    @Bean
    public EurekaInstanceConfigBean eurekaInstanceConfig() {
        EurekaInstanceConfigBean config = new EurekaInstanceConfigBean();
        config.setNonSecurePort(serverPort);
        config.setAppname(applicationName);
        return config;
    }
}
```

### Service Discovery with Ribbon
```java
@Configuration
@RibbonClient(name = "user-service")
public class RibbonConfig {
    @Bean
    public IRule ribbonRule() {
        return new WeightedResponseTimeRule();
    }
}
```

## Resources for Further Learning
- [Spring Cloud Netflix](https://spring.io/projects/spring-cloud-netflix)
- [Consul Documentation](https://www.consul.io/docs)
- [Kubernetes Service Discovery](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Apache Zookeeper](https://zookeeper.apache.org/)

## Practice Exercises
1. Set up Eureka server and register a client
2. Implement service discovery with Consul
3. Create Kubernetes services and deployments
4. Implement custom health checks
5. Set up service discovery with load balancing 