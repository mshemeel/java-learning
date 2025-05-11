# Microservices Monitoring

## Overview
This guide covers monitoring strategies, tools, and implementation approaches for microservices architecture, including metrics collection, logging, tracing, and alerting.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of Spring Boot Actuator
- Familiarity with monitoring tools
- Understanding of distributed systems

## Learning Objectives
- Understand microservices monitoring patterns
- Learn metrics collection and visualization
- Master distributed tracing
- Implement centralized logging
- Set up effective alerting

## Table of Contents
1. [Metrics Collection](#metrics-collection)
2. [Distributed Tracing](#distributed-tracing)
3. [Centralized Logging](#centralized-logging)
4. [Health Checks](#health-checks)
5. [Alerting](#alerting)

## Metrics Collection

### Spring Boot Actuator Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: ${spring.application.name}
```

### Prometheus Configuration
```yaml
scrape_configs:
  - job_name: 'spring-actuator'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:8080']
```

### Custom Metrics
```java
@Component
public class CustomMetricsService {
    private final MeterRegistry registry;
    
    public CustomMetricsService(MeterRegistry registry) {
        this.registry = registry;
    }
    
    public void recordOrderProcessingTime(long timeInMs) {
        registry.timer("order.processing.time")
            .record(timeInMs, TimeUnit.MILLISECONDS);
    }
    
    public void incrementOrderCounter() {
        registry.counter("order.processed").increment();
    }
}
```

## Distributed Tracing

### Sleuth Configuration
```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://localhost:9411
```

### Trace Implementation
```java
@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    @Autowired
    private Tracer tracer;
    
    public Order processOrder(OrderRequest request) {
        Span span = tracer.currentSpan();
        span.tag("orderId", request.getOrderId());
        
        log.info("Processing order: {}", request.getOrderId());
        // Process order
        return order;
    }
}
```

## Centralized Logging

### Logback Configuration
```xml
<configuration>
    <appender name="ELK" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>localhost:5000</destination>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"app":"${springApplicationName}"}</customFields>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="ELK" />
    </root>
</configuration>
```

### Structured Logging
```java
@Slf4j
@Service
public class PaymentService {
    public void processPayment(Payment payment) {
        log.info("Processing payment: {}", payment.getId(),
            kv("paymentId", payment.getId()),
            kv("amount", payment.getAmount()),
            kv("status", payment.getStatus()));
    }
}
```

## Health Checks

### Custom Health Indicator
```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    private final DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT 1");
            ps.executeQuery();
            return Health.up()
                .withDetail("database", "PostgreSQL")
                .withDetail("status", "Connected")
                .build();
        } catch (SQLException ex) {
            return Health.down()
                .withDetail("error", ex.getMessage())
                .build();
        }
    }
}
```

### Composite Health Check
```java
@Configuration
public class HealthCheckConfig {
    @Bean
    public CompositeHealthContributor healthContributor(
            DatabaseHealthIndicator dbHealth,
            CacheHealthIndicator cacheHealth) {
        Map<String, HealthIndicator> indicators = new HashMap<>();
        indicators.put("database", dbHealth);
        indicators.put("cache", cacheHealth);
        return CompositeHealthContributor.fromMap(indicators);
    }
}
```

## Alerting

### Alert Configuration
```yaml
alerting:
  rules:
    - alert: HighErrorRate
      expr: rate(http_server_requests_seconds_count{status="5xx"}[5m]) > 0.1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: High error rate detected
        description: "Service {{ $labels.service }} has high error rate"
```

### Alert Manager Configuration
```yaml
route:
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'team-emails'

receivers:
  - name: 'team-emails'
    email_configs:
      - to: 'team@example.com'
```

## Best Practices
1. Implement comprehensive metrics collection
2. Use distributed tracing for request flows
3. Centralize logs with proper context
4. Implement meaningful health checks
5. Set up proper alerting thresholds
6. Monitor system resources
7. Implement proper dashboard visualization

## Common Pitfalls
1. Insufficient monitoring coverage
2. Poor log aggregation
3. Missing important metrics
4. Inadequate alerting
5. Resource-heavy monitoring
6. Poor visualization

## Implementation Examples

### Complete Monitoring Setup
```java
@Configuration
public class MonitoringConfig {
    @Bean
    public MeterRegistry meterRegistry() {
        CompositeMeterRegistry registry = new CompositeMeterRegistry();
        registry.config()
            .commonTags("application", "${spring.application.name}");
        return registry;
    }
    
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
```

### Metrics Aspect
```java
@Aspect
@Component
public class MetricsAspect {
    private final MeterRegistry registry;
    
    @Around("@annotation(Timed)")
    public Object timeMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        Timer.Sample sample = Timer.start(registry);
        try {
            return joinPoint.proceed();
        } finally {
            sample.stop(Timer.builder("method.execution.time")
                .tag("class", joinPoint.getSignature().getDeclaringTypeName())
                .tag("method", joinPoint.getSignature().getName())
                .register(registry));
        }
    }
}
```

## Resources for Further Learning
- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [ELK Stack Documentation](https://www.elastic.co/guide/index.html)

## Practice Exercises
1. Set up Spring Boot Actuator with custom metrics
2. Implement distributed tracing with Sleuth and Zipkin
3. Configure centralized logging with ELK stack
4. Create custom health indicators
5. Set up Prometheus and Grafana dashboards 