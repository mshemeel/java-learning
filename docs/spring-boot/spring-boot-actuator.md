# Spring Boot Actuator

## Overview
Spring Boot Actuator provides production-ready features for monitoring and managing your Spring Boot application. It includes various built-in endpoints, metrics collection, health checks, and auditing capabilities that help you gain insights into your running application. This guide will help you understand and implement Spring Boot Actuator effectively in your applications.

## Prerequisites
- Basic knowledge of Spring Boot
- Understanding of RESTful web services
- Familiarity with application monitoring concepts
- Spring Boot application setup

## Learning Objectives
- Understand Spring Boot Actuator and its capabilities
- Configure and secure Actuator endpoints
- Implement custom health indicators
- Create custom metrics and counters
- Integrate with monitoring systems
- Use Actuator for application management
- Implement auditing using Actuator
- Customize Actuator responses
- Create custom endpoints

## Table of Contents
1. [Getting Started with Actuator](#getting-started-with-actuator)
2. [Actuator Endpoints](#actuator-endpoints)
3. [Health Indicators](#health-indicators)
4. [Metrics and Monitoring](#metrics-and-monitoring)
5. [Customizing Actuator](#customizing-actuator)
6. [Security Considerations](#security-considerations)
7. [Integration with Monitoring Systems](#integration-with-monitoring-systems)
8. [Creating Custom Endpoints](#creating-custom-endpoints)
9. [Auditing with Actuator](#auditing-with-actuator)
10. [Best Practices](#best-practices)

## Getting Started with Actuator

### Adding Actuator Dependency

To add Spring Boot Actuator to your project, include the following dependency:

For Maven:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

For Gradle:
```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

### Basic Configuration

Once the dependency is added, Spring Boot automatically configures several endpoints. The base path for these endpoints is `/actuator` by default. You can customize this in your `application.properties` or `application.yml` file:

```properties
# application.properties
management.endpoints.web.base-path=/management
```

Or in YAML:
```yaml
# application.yml
management:
  endpoints:
    web:
      base-path: /management
```

### Enabling Endpoints

By default, most endpoints except `/health` are disabled for web access. You can enable all endpoints or specific ones:

```properties
# Enable all endpoints
management.endpoints.web.exposure.include=*

# Enable specific endpoints
management.endpoints.web.exposure.include=health,info,metrics

# Exclude specific endpoints
management.endpoints.web.exposure.exclude=env,beans
```

### Basic Usage

After configuring Actuator, you can access the endpoints via HTTP. For example:

- `http://localhost:8080/actuator` - Lists all available endpoints
- `http://localhost:8080/actuator/health` - Shows application health information
- `http://localhost:8080/actuator/info` - Displays application information

## Actuator Endpoints

Spring Boot Actuator provides numerous built-in endpoints for different purposes:

### Core Endpoints

| ID | Description |
|----|-------------|
| `health` | Shows application health information |
| `info` | Displays arbitrary application info |
| `metrics` | Shows metrics information |
| `env` | Exposes environment properties |
| `configprops` | Displays @ConfigurationProperties |
| `loggers` | Shows and modifies logger configurations |
| `beans` | Displays all Spring beans in the application |
| `mappings` | Displays all @RequestMapping paths |
| `conditions` | Shows auto-configuration conditions |
| `threaddump` | Performs a thread dump |
| `heapdump` | Returns a heap dump file |
| `shutdown` | Allows the application to be gracefully shutdown (disabled by default) |
| `scheduledtasks` | Displays scheduled tasks |
| `caches` | Exposes available caches |
| `flyway` | Shows Flyway database migrations |
| `liquibase` | Shows Liquibase database migrations |

### The Health Endpoint

The `/health` endpoint shows the application's health status. By default, it shows a simple UP or DOWN status, but you can configure it to show more details:

```properties
# Show full health details
management.endpoint.health.show-details=always

# Or only for authenticated users
management.endpoint.health.show-details=when-authorized
```

Example response with details:
```json
{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963170816,
        "free": 91300069376,
        "threshold": 10485760
      }
    },
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    }
  }
}
```

### The Info Endpoint

The `/info` endpoint displays custom information about your application. You can configure it in properties:

```properties
# Static information
info.app.name=My Spring Application
info.app.description=A sample Spring Boot application
info.app.version=1.0.0
info.team.name=Sample Team
info.team.contact=team@example.com
```

You can also add dynamic information by implementing `InfoContributor`:

```java
@Component
public class BuildInfoContributor implements InfoContributor {
    
    @Override
    public void contribute(Info.Builder builder) {
        Map<String, Object> buildDetails = new HashMap<>();
        buildDetails.put("buildTime", LocalDateTime.now().toString());
        buildDetails.put("buildNumber", "1234");
        
        builder.withDetail("build", buildDetails);
    }
}
```

### The Metrics Endpoint

The `/metrics` endpoint provides access to application metrics. You can see available metrics by accessing:

```
GET /actuator/metrics
```

And specific metrics by including the metric name:

```
GET /actuator/metrics/jvm.memory.used
```

Example response:
```json
{
  "name": "jvm.memory.used",
  "description": "The amount of used memory",
  "baseUnit": "bytes",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 234234346
    }
  ],
  "availableTags": [
    {
      "tag": "area",
      "values": [
        "heap",
        "nonheap"
      ]
    }
  ]
}
```

### The Env Endpoint

The `/env` endpoint exposes all environment properties, including configuration properties:

```
GET /actuator/env
```

You can also query specific properties:

```
GET /actuator/env/server.port
```

### The Loggers Endpoint

The `/loggers` endpoint allows viewing and modifying logging levels at runtime:

To view all loggers:
```
GET /actuator/loggers
```

To view a specific logger:
```
GET /actuator/loggers/org.springframework
```

To change a logging level (using POST):
```
POST /actuator/loggers/org.springframework
Content-Type: application/json

{
  "configuredLevel": "DEBUG"
}
```

## Health Indicators

Health indicators report the health status of application components. Spring Boot includes several built-in health indicators.

### Built-in Health Indicators

- `DiskSpaceHealthIndicator`: Checks for low disk space
- `DataSourceHealthIndicator`: Checks the connection to a database
- `MongoHealthIndicator`: Checks MongoDB connection
- `RedisHealthIndicator`: Checks Redis connection
- `CassandraHealthIndicator`: Checks Cassandra connection
- `ElasticsearchHealthIndicator`: Checks Elasticsearch connection
- `InfluxDbHealthIndicator`: Checks InfluxDB connection
- `RabbitHealthIndicator`: Checks RabbitMQ connection
- `SolrHealthIndicator`: Checks Solr connection

### Creating Custom Health Indicators

You can create custom health indicators by implementing the `HealthIndicator` interface:

```java
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class CustomServiceHealthIndicator implements HealthIndicator {

    private final CustomService customService;
    
    public CustomServiceHealthIndicator(CustomService customService) {
        this.customService = customService;
    }
    
    @Override
    public Health health() {
        try {
            boolean serviceStatus = customService.isRunning();
            if (serviceStatus) {
                return Health.up()
                        .withDetail("message", "Custom service is running")
                        .withDetail("timestamp", System.currentTimeMillis())
                        .build();
            } else {
                return Health.down()
                        .withDetail("message", "Custom service is not running")
                        .withDetail("timestamp", System.currentTimeMillis())
                        .build();
            }
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("message", "Error checking custom service")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

### Composite Health Indicators

You can group related health indicators using `CompositeHealthContributor`:

```java
import org.springframework.boot.actuate.health.CompositeHealthContributor;
import org.springframework.boot.actuate.health.HealthContributor;
import org.springframework.boot.actuate.health.NamedContributor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Component
public class ExternalServicesHealthIndicator implements CompositeHealthContributor {

    private final Map<String, HealthContributor> contributors = new HashMap<>();

    public ExternalServicesHealthIndicator(
            PaymentServiceHealthIndicator paymentService,
            ShippingServiceHealthIndicator shippingService) {
        contributors.put("payment", paymentService);
        contributors.put("shipping", shippingService);
    }

    @Override
    public HealthContributor getContributor(String name) {
        return contributors.get(name);
    }

    @Override
    public Iterator<NamedContributor<HealthContributor>> iterator() {
        return contributors.entrySet().stream()
                .map(entry -> NamedContributor.of(entry.getKey(), entry.getValue()))
                .iterator();
    }
}
```

### Health Groups

You can also create health groups to organize indicators:

```properties
management.endpoint.health.group.readiness.include=db,redis,kafka
management.endpoint.health.group.liveness.include=diskSpace,ping
management.endpoint.health.group.custom.include=customService
management.endpoint.health.group.custom.show-details=always
```

These groups can be accessed at `/actuator/health/{group}`, such as `/actuator/health/readiness`.

## Metrics and Monitoring

Spring Boot Actuator uses Micrometer to collect and expose metrics, which provides a vendor-neutral facade for many monitoring systems.

### Built-in Metrics

Spring Boot automatically records several metrics:

- JVM metrics: Memory, garbage collection, threads, classes
- CPU metrics
- File descriptor metrics
- Tomcat metrics (if using Tomcat)
- Log metrics
- Spring MVC metrics (request counts, timings)
- RestTemplate metrics
- Cache metrics
- DataSource metrics (connection pool, query times)

### Registering Custom Metrics

You can register custom metrics using the `MeterRegistry`:

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final Counter orderCounter;
    private final Counter failedOrderCounter;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = registry.counter("orders.created", "type", "order");
        this.failedOrderCounter = registry.counter("orders.failed", "type", "order");
    }
    
    public void createOrder(Order order) {
        try {
            // Process order
            orderCounter.increment();
        } catch (Exception e) {
            failedOrderCounter.increment();
            throw e;
        }
    }
}
```

### Types of Metrics

Micrometer supports various metric types:

#### Counter

Measures a single incrementing value:

```java
Counter counter = registry.counter("requests.count", "status", "success");
counter.increment();
```

#### Gauge

Measures a single fluctuating value:

```java
List<Order> orders = new ArrayList<>();
Gauge.builder("orders.pending", orders, List::size)
    .description("Number of pending orders")
    .register(registry);
```

#### Timer

Measures the timing of a specific operation:

```java
Timer timer = registry.timer("api.requests", "endpoint", "/users");

timer.record(() -> {
    // Code to measure
    processRequest();
});

// Or manually
long start = System.nanoTime();
try {
    processRequest();
} finally {
    timer.record(System.nanoTime() - start, TimeUnit.NANOSECONDS);
}
```

#### Distribution Summary

Similar to a timer but for measuring distributions of values that aren't time-based:

```java
DistributionSummary summary = registry.summary("order.amount");
summary.record(order.getAmount());
```

#### Long Task Timer

Measures time spent on long-running tasks:

```java
LongTaskTimer longTaskTimer = registry.more().longTaskTimer("batch.job.duration");
LongTaskTimer.Sample sample = longTaskTimer.start();
try {
    runBatchJob();
} finally {
    sample.stop();
}
```

### @Timed Annotation

You can use the `@Timed` annotation to time methods:

```java
import io.micrometer.core.annotation.Timed;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Timed(value = "product.search.time", description = "Time taken to search products")
    public List<Product> searchProducts(String query) {
        // Search products
        return results;
    }
}
```

To enable this, register a `TimedAspect`:

```java
@Bean
public TimedAspect timedAspect(MeterRegistry registry) {
    return new TimedAspect(registry);
}
```

## Customizing Actuator

You can customize various aspects of Spring Boot Actuator.

### Customizing Response Formats

By default, Actuator endpoints return JSON responses. You can customize the response format by implementing `HttpMessageConverter`:

```java
@Configuration
public class ActuatorConfig {

    @Bean
    public HttpMessageConverter<Object> actuatorCustomMessageConverter() {
        return new CustomMessageConverter();
    }
}
```

### Adding Custom Information to Info Endpoint

You can implement `InfoContributor` to add custom information to the `/info` endpoint:

```java
@Component
public class GitInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        Map<String, Object> gitInfo = new HashMap<>();
        gitInfo.put("branch", "master");
        gitInfo.put("commit", "abc123");
        gitInfo.put("repository", "https://github.com/example/repo");
        
        builder.withDetail("git", gitInfo);
    }
}
```

### Auto-configured Info Contributors

Spring Boot provides several auto-configured `InfoContributor` beans:

- `EnvironmentInfoContributor`: Exposes properties from `info.*`
- `GitInfoContributor`: Exposes git information if a `git.properties` file is available
- `BuildInfoContributor`: Exposes build information if a `META-INF/build-info.properties` file is available

You can generate these files automatically:

For Maven:
```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>build-info</goal>
            </goals>
        </execution>
    </executions>
</plugin>

<plugin>
    <groupId>pl.project13.maven</groupId>
    <artifactId>git-commit-id-plugin</artifactId>
</plugin>
```

For Gradle:
```groovy
springBoot {
    buildInfo()
}
```

## Security Considerations

Actuator endpoints can expose sensitive information, so securing them is important.

### Securing Actuator Endpoints

To secure Actuator endpoints, add Spring Security:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Configure security for endpoints:

```java
@Configuration
public class ActuatorSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .requestMatcher(EndpointRequest.toAnyEndpoint())
            .authorizeRequests()
                .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
                .anyRequest().hasRole("ACTUATOR")
            .and()
            .httpBasic();
    }
}
```

### CORS Configuration

Configure CORS for Actuator endpoints:

```properties
management.endpoints.web.cors.allowed-origins=https://example.com
management.endpoints.web.cors.allowed-methods=GET,POST
```

### Using Different Port for Actuator

You can configure Actuator to use a different port, keeping it separate from your application:

```properties
management.server.port=8081
```

## Integration with Monitoring Systems

Micrometer supports various monitoring systems through its registry implementations.

### Prometheus

To export metrics to Prometheus:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Prometheus scrapes metrics from the `/actuator/prometheus` endpoint.

Prometheus configuration:
```yaml
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### Datadog

For Datadog integration:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-datadog</artifactId>
</dependency>
```

Configure the Datadog API key:
```properties
management.metrics.export.datadog.api-key=YOUR_API_KEY
management.metrics.export.datadog.step=30s
```

### New Relic

For New Relic integration:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-new-relic</artifactId>
</dependency>
```

Configure New Relic:
```properties
management.metrics.export.newrelic.api-key=YOUR_API_KEY
management.metrics.export.newrelic.account-id=YOUR_ACCOUNT_ID
management.metrics.export.newrelic.step=30s
```

### Graphite

For Graphite integration:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-graphite</artifactId>
</dependency>
```

Configure Graphite:
```properties
management.metrics.export.graphite.host=localhost
management.metrics.export.graphite.port=2004
management.metrics.export.graphite.step=30s
```

### Elastic

For Elasticsearch integration:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-elastic</artifactId>
</dependency>
```

Configure Elasticsearch:
```properties
management.metrics.export.elastic.host=http://localhost:9200
management.metrics.export.elastic.step=30s
```

## Creating Custom Endpoints

You can create custom Actuator endpoints for specific monitoring or management needs.

### Creating a Read-Only Endpoint

```java
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Endpoint(id = "features")
public class FeaturesEndpoint {

    @ReadOperation
    public Map<String, Object> features() {
        Map<String, Object> features = new HashMap<>();
        features.put("payment", true);
        features.put("reporting", true);
        features.put("notifications", false);
        features.put("socialLogin", Map.of(
            "facebook", true,
            "google", true,
            "github", false
        ));
        
        return features;
    }
}
```

### Creating a Writeable Endpoint

```java
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
@Endpoint(id = "counter")
public class CounterEndpoint {

    private final AtomicInteger counter = new AtomicInteger(0);

    @ReadOperation
    public Map<String, Object> getCount() {
        return Map.of("count", counter.get());
    }

    @WriteOperation
    public Map<String, Object> increment() {
        return Map.of("count", counter.incrementAndGet());
    }
    
    @WriteOperation
    public Map<String, Object> incrementBy(int delta) {
        return Map.of("count", counter.addAndGet(delta));
    }
}
```

### Enabling JMX

By default, Spring Boot exposes endpoints over HTTP. To expose them over JMX:

```properties
management.endpoints.jmx.exposure.include=health,info,beans
```

Creating a JMX-specific endpoint:

```java
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

@Component
@Endpoint(id = "jmxCustom")
@ManagedResource
public class JmxCustomEndpoint {

    @ReadOperation
    @ManagedOperation
    public String getData() {
        return "Custom JMX data";
    }
}
```

## Auditing with Actuator

Spring Boot Actuator provides auditing capabilities through the AuditEventRepository.

### Basic Auditing

To use auditing, you need an implementation of `AuditEventRepository`:

```java
@Bean
public InMemoryAuditEventRepository auditEventRepository() {
    return new InMemoryAuditEventRepository();
}
```

For production, use a persistent implementation:

```java
@Component
public class PersistentAuditEventRepository implements AuditEventRepository {

    private final AuditEventDao auditEventDao;
    
    public PersistentAuditEventRepository(AuditEventDao auditEventDao) {
        this.auditEventDao = auditEventDao;
    }
    
    @Override
    public void add(AuditEvent event) {
        auditEventDao.save(convertToEntity(event));
    }
    
    @Override
    public List<AuditEvent> find(String principal, Instant after, String type) {
        // Implementation details
    }
    
    // Helper methods
}
```

### Publishing Audit Events

You can publish audit events using the `ApplicationEventPublisher`:

```java
@Service
public class UserService {

    private final ApplicationEventPublisher publisher;
    
    public UserService(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }
    
    public void login(String username, boolean success) {
        Map<String, Object> data = new HashMap<>();
        data.put("success", success);
        data.put("ip", getCurrentIp());
        
        publisher.publishEvent(
            new AuditApplicationEvent(username, "LOGIN", data)
        );
    }
    
    // Other methods
}
```

### Accessing Audit Events

Audit events are available through the `/actuator/auditevents` endpoint:

```
GET /actuator/auditevents
```

You can filter by principal, date, or type:

```
GET /actuator/auditevents?principal=admin&after=2023-01-01T00:00:00Z&type=LOGIN
```

## Best Practices

### Production Configuration

For production environments:

1. Disable unnecessary endpoints:
```properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
```

2. Secure endpoints properly:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

3. Consider using a separate management port:
```properties
management.server.port=8081
```

4. Set appropriate logging levels:
```properties
logging.level.org.springframework.boot.actuate=WARN
```

### Performance Considerations

1. Be mindful of endpoint overhead:
- The `/heapdump` endpoint can generate large responses
- `/threaddump` may impact performance temporarily

2. For high-volume metrics, consider sampling:
```java
Timer timer = Timer.builder("request.timer")
    .publishPercentiles(0.5, 0.95, 0.99)
    .publishPercentileHistogram()
    .sla(Duration.ofMillis(100), Duration.ofMillis(500))
    .minimumExpectedValue(Duration.ofMillis(1))
    .maximumExpectedValue(Duration.ofSeconds(10))
    .register(registry);
```

3. Adjust metric collection frequency:
```properties
management.metrics.export.prometheus.step=30s
```

### Monitoring Strategy

1. Implement a comprehensive health check strategy:
   - Create custom health indicators for critical services
   - Group health indicators for different aspects (db, services, etc.)
   - Configure appropriate detail levels

2. Set up alerts based on metrics:
   - Critical error rates
   - Slow response times
   - Resource utilization (memory, CPU)
   - Business metrics (order rates, failed transactions)

3. Implement proper logging integration:
   - Configure log levels through the `/loggers` endpoint
   - Correlate logs with metrics
   - Integrate with centralized logging systems

### Security Best Practices

1. Always secure Actuator endpoints:
   - Use HTTPS for all endpoints
   - Require authentication for sensitive endpoints
   - Consider network-level security (firewall rules, VPC)

2. Control information exposure:
   - Limit detailed health information to authenticated users
   - Avoid exposing sensitive configuration through `/env`
   - Regularly audit exposed endpoints

3. Implement proper user management:
   - Create specific roles for Actuator access
   - Use fine-grained permissions
   - Audit access to endpoints

## Summary

Spring Boot Actuator is a powerful tool for monitoring and managing your Spring Boot applications. It provides:

- Production-ready features like health checks, metrics, and environment information
- Integration with monitoring systems through Micrometer
- Extensibility through custom endpoints and health indicators
- Security controls to protect sensitive information

By properly configuring and extending Actuator, you can gain valuable insights into your application's behavior, improve observability, and respond quickly to issues.

## Further Reading

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/) 