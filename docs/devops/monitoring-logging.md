# Monitoring & Logging

## Overview
This guide introduces monitoring and logging concepts, tools, and implementation strategies for Java applications. Effective monitoring and logging are essential for maintaining application health, troubleshooting issues, and ensuring optimal performance in production environments.

## Prerequisites
- Basic understanding of Java application architecture
- Familiarity with microservices concepts (for distributed tracing sections)
- General knowledge of cloud or on-premises infrastructure
- Understanding of basic DevOps principles

## Learning Objectives
- Understand core monitoring and logging concepts for Java applications
- Learn how to implement effective logging strategies
- Master metrics collection and visualization techniques
- Implement distributed tracing for microservice architectures
- Configure alerts and notifications for proactive issue detection
- Apply best practices for Java application observability
- Understand how to build effective dashboards for application visibility

## Monitoring Fundamentals

### What is Monitoring?
Monitoring is the practice of collecting, analyzing, and using data about your application's performance, health, and usage patterns. Effective monitoring enables you to:

1. Detect and diagnose problems before they impact users
2. Understand application behavior under various conditions
3. Plan capacity and resource allocation
4. Validate the success of deployments and changes
5. Make data-driven decisions for improvements

### The Three Pillars of Observability

```
┌───────────────────────────────────────────────────┐
│                   Observability                   │
└───────────────────────────────────────────────────┘
                     │       │       │
           ┌─────────┘       │       └─────────┐
           │                 │                 │
           ▼                 ▼                 ▼
┌───────────────────┐ ┌─────────────────┐ ┌───────────────────┐
│       Logs        │ │     Metrics     │ │      Traces       │
│                   │ │                 │ │                   │
│ Detailed records  │ │ Numeric samples │ │ Request paths     │
│ of events         │ │ of data points  │ │ across services   │
└───────────────────┘ └─────────────────┘ └───────────────────┘
```

#### 1. Logs
Text records of events that happen in your system, providing detailed context about what happened at a specific time.

#### 2. Metrics
Numeric measurements collected at regular intervals, representing system behavior or performance over time.

#### 3. Traces
Records of requests as they flow through distributed systems, showing the path and timing of service interactions.

## Logging for Java Applications

### Logging Frameworks
Java offers several mature logging frameworks:

#### SLF4J with Logback
The most common modern choice:

```xml
<!-- Maven dependencies -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.36</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.11</version>
</dependency>
```

Usage example:
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public User findUserById(Long id) {
        logger.debug("Looking up user with ID: {}", id);
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
            logger.info("Found user: {}", user.getUsername());
            return user;
        } catch (Exception e) {
            logger.error("Error finding user with ID: {}", id, e);
            throw e;
        }
    }
}
```

#### Log4j2
Another popular option with high performance:

```xml
<!-- Maven dependencies -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.17.2</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.2</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.17.2</version>
</dependency>
```

### Logging Configuration
Proper logging configuration is essential for both development and production environments.

#### Logback Configuration Example
```xml
<!-- logback.xml -->
<configuration>
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>
  
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/application.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>logs/application-%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
      <totalSizeCap>3GB</totalSizeCap>
    </rollingPolicy>
    <encoder>
      <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>
  
  <!-- JSON appender for production environments -->
  <appender name="JSON" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/application.json</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>logs/application-%d{yyyy-MM-dd}.json</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
  </appender>

  <!-- Log levels by package -->
  <logger name="com.example.app" level="INFO" />
  <logger name="com.example.app.security" level="DEBUG" />
  
  <!-- External libraries -->
  <logger name="org.springframework" level="WARN" />
  <logger name="org.hibernate" level="WARN" />
  
  <root level="INFO">
    <appender-ref ref="CONSOLE" />
    <appender-ref ref="FILE" />
    <!-- Use in production -->
    <!-- <appender-ref ref="JSON" /> -->
  </root>
</configuration>
```

#### Log4j2 Configuration Example
```xml
<!-- log4j2.xml -->
<Configuration status="WARN">
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
    <RollingFile name="RollingFile" fileName="logs/application.log"
                 filePattern="logs/application-%d{MM-dd-yyyy}-%i.log">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
      <Policies>
        <TimeBasedTriggeringPolicy />
        <SizeBasedTriggeringPolicy size="10 MB"/>
      </Policies>
      <DefaultRolloverStrategy max="10"/>
    </RollingFile>
  </Appenders>
  <Loggers>
    <Logger name="com.example.app" level="info" additivity="false">
      <AppenderRef ref="Console"/>
      <AppenderRef ref="RollingFile"/>
    </Logger>
    <Root level="warn">
      <AppenderRef ref="Console"/>
      <AppenderRef ref="RollingFile"/>
    </Root>
  </Loggers>
</Configuration>
```

### Structured Logging
For better searchability and analysis, structured logging formats like JSON are recommended:

Using Logstash encoder with Logback:
```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.2</version>
</dependency>
```

Adding context information:
```java
MDC.put("userId", user.getId().toString());
MDC.put("requestId", requestId);
logger.info("User profile updated");
MDC.clear();
```

### Centralized Logging
In production environments, logs should be collected centrally:

#### ELK Stack (Elasticsearch, Logstash, Kibana)
A popular combination for log collection, storage, and visualization:

```yaml
# docker-compose.yml for ELK Stack
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
      
  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5000:5000/tcp"
      - "5000:5000/udp"
      - "9600:9600"
    depends_on:
      - elasticsearch
      
  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

With Logstash configuration:
```
# logstash.conf
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [logger_name] =~ "com.example.app" {
    mutate {
      add_tag => [ "application" ]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "java-application-%{+YYYY.MM.dd}"
  }
}
```

#### Loki with Grafana
A lightweight alternative focused on logs:

```yaml
# docker-compose.yml for Loki + Grafana
version: '3.8'
services:
  loki:
    image: grafana/loki:2.6.1
    ports:
      - "3100:3100"
    volumes:
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml
      
  grafana:
    image: grafana/grafana:9.3.2
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - loki

volumes:
  loki-data:
  grafana-data:
```

## Metrics Collection for Java Applications

### Key Metrics to Monitor

#### JVM Metrics
- Memory usage (heap and non-heap)
- Garbage collection frequency and duration
- Thread count and state
- Class loading
- CPU usage

#### Application Metrics
- Request rates
- Response times
- Error rates
- Active sessions
- Business-specific metrics (orders processed, user registrations, etc.)

#### System Metrics
- Host CPU, memory, disk usage
- Network I/O
- Container metrics if applicable

#### Database Metrics
- Connection pool usage
- Query execution time
- Transaction rates
- Cache hit/miss ratio

### Metrics Collection Tools

#### Micrometer
Micrometer provides a vendor-neutral metrics collection facade:

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <version>1.9.3</version>
</dependency>
```

For Spring Boot applications:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=prometheus,health,info,metrics
management.metrics.export.prometheus.enabled=true
management.endpoint.health.show-details=always
```

Custom metrics example:
```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

@Service
public class OrderService {
    private final Counter orderCounter;
    private final Timer orderProcessingTimer;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = registry.counter("orders.created");
        this.orderProcessingTimer = registry.timer("orders.processing.time");
    }
    
    public Order createOrder(OrderRequest request) {
        return orderProcessingTimer.record(() -> {
            Order order = processOrder(request);
            orderCounter.increment();
            return order;
        });
    }
}
```

#### Prometheus
Prometheus is a popular time-series database and monitoring system:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['app:8080']
```

Docker Compose setup:
```yaml
services:
  app:
    image: myapp:latest
    ports:
      - "8080:8080"
      
  prometheus:
    image: prom/prometheus:v2.40.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command: 
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      
volumes:
  prometheus-data:
```

#### Grafana
Grafana provides visualization for metrics:

```yaml
services:
  grafana:
    image: grafana/grafana:9.3.2
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  grafana-data:
```

Example Grafana dashboard configuration for a Java application:
```json
{
  "panels": [
    {
      "title": "JVM Memory Usage",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "sum(jvm_memory_used_bytes{application=\"$application\",instance=\"$instance\",area=\"heap\"})",
          "legendFormat": "Heap Used"
        },
        {
          "expr": "sum(jvm_memory_committed_bytes{application=\"$application\",instance=\"$instance\",area=\"heap\"})",
          "legendFormat": "Heap Committed"
        },
        {
          "expr": "sum(jvm_memory_max_bytes{application=\"$application\",instance=\"$instance\",area=\"heap\"})",
          "legendFormat": "Heap Max"
        }
      ]
    },
    {
      "title": "HTTP Request Rate",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "sum(rate(http_server_requests_seconds_count{application=\"$application\",instance=\"$instance\"}[1m]))",
          "legendFormat": "Requests/sec"
        }
      ]
    }
  ]
}
```

## Distributed Tracing for Java Applications

### What is Distributed Tracing?
Distributed tracing tracks requests as they flow through microservices, providing context for troubleshooting and performance optimization.

### OpenTelemetry
OpenTelemetry is an observability framework that combines tracing, metrics, and logs:

```xml
<!-- Maven dependencies -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
    <version>1.19.0</version>
</dependency>
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-sdk</artifactId>
    <version>1.19.0</version>
</dependency>
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
    <version>1.19.0</version>
</dependency>
```

For Spring Boot applications:
```xml
<dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-spring-boot-starter</artifactId>
    <version>1.19.0-alpha</version>
</dependency>
```

Manual instrumentation example:
```java
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;

@Service
public class PaymentService {
    private final Tracer tracer;
    private final BankService bankService;
    
    public PaymentService(Tracer tracer, BankService bankService) {
        this.tracer = tracer;
        this.bankService = bankService;
    }
    
    public void processPayment(Payment payment) {
        Span span = tracer.spanBuilder("processPayment")
            .setAttribute("payment.id", payment.getId())
            .setAttribute("payment.amount", payment.getAmount())
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            validatePayment(payment);
            
            Span bankSpan = tracer.spanBuilder("bankTransfer").startSpan();
            try (Scope bankScope = bankSpan.makeCurrent()) {
                bankService.transfer(payment);
            } finally {
                bankSpan.end();
            }
        } finally {
            span.end();
        }
    }
}
```

### Jaeger
Jaeger is a popular distributed tracing system:

```yaml
# docker-compose.yml with Jaeger
services:
  jaeger:
    image: jaegertracing/all-in-one:1.39
    ports:
      - "16686:16686"  # UI
      - "14250:14250"  # gRPC
      - "14268:14268"  # HTTP Collector
```

Spring Boot configuration:
```yaml
# application.yml
opentelemetry:
  traces:
    exporter: jaeger
  metrics:
    exporter: prometheus
  jaeger:
    endpoint: http://jaeger:14250
```

## Alert Management

### Alerting Best Practices
Effective alerts should be:
1. **Actionable**: Alert on symptoms that require human intervention
2. **Precise**: Avoid alert fatigue by minimizing false positives
3. **Relevant**: Direct alerts to the right team
4. **Clear**: Include sufficient context to understand and resolve the issue

### Alert Configuration in Prometheus

```yaml
# alertmanager.yml
route:
  group_by: ['alertname', 'service', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'email'
  routes:
  - match:
      severity: critical
    receiver: 'pager'

receivers:
- name: 'email'
  email_configs:
  - to: 'team@example.com'
    
- name: 'pager'
  pagerduty_configs:
  - service_key: '<pagerduty-key>'
```

Alert rules:
```yaml
# alert-rules.yml
groups:
- name: java-application
  rules:
  - alert: HighMemoryUsage
    expr: (sum(jvm_memory_used_bytes{area="heap"}) / sum(jvm_memory_max_bytes{area="heap"})) * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage (instance {{ $labels.instance }})"
      description: "Memory usage is above 85% for 5 minutes\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: HighErrorRate
    expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100 > 5
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High HTTP error rate (instance {{ $labels.instance }})"
      description: "HTTP 5xx error rate is above 5% for 2 minutes\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

## Monitoring and Logging Architecture

### Complete Observability Stack

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                 Application                                   │
│                                                                               │
│  ┌───────────┐   ┌───────────┐   ┌───────────────────────┐   ┌────────────┐   │
│  │   Logs    │   │  Metrics  │   │   Distributed Traces  │   │   Health   │   │
│  │ (Logback) │   │(Micrometer)│   │    (OpenTelemetry)   │   │  Checks   │   │
│  └─────┬─────┘   └─────┬─────┘   └──────────┬────────────┘   └────────────┘   │
└───────────────────────────────────────────────────────────────────────────────┘
          │               │                    │                    
          ▼               ▼                    ▼                    
┌───────────────┐ ┌──────────────┐  ┌──────────────────┐           
│  Log Storage  │ │ Time Series  │  │   Trace Storage  │           
│ (Elasticsearch)│ │    (Prometheus)│  │    (Jaeger)     │           
└───────┬───────┘ └───────┬──────┘  └────────┬─────────┘           
        │                 │                   │                     
        └─────────────────┼───────────────────┘                     
                          ▼                                         
                   ┌─────────────┐                                  
                   │  Dashboard  │                                  
                   │  (Grafana)  │                                  
                   └─────┬───────┘                                  
                         │                                          
                         ▼                                          
                  ┌──────────────┐                                  
                  │  Alerting    │                                  
                  │(AlertManager)│                                  
                  └──────────────┘                                  
```

### Monitoring in Kubernetes

For Java applications in Kubernetes, additional tools like Prometheus Operator and Loki help:

```yaml
# Prometheus Operator ServiceMonitor for a Spring Boot app
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: spring-app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: spring-boot-app
  endpoints:
  - port: web
    path: /actuator/prometheus
    interval: 15s
```

## Java Application Health Checks

### Spring Boot Actuator
Spring Boot Actuator provides built-in health endpoints:

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```

Custom health indicator:
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
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("SELECT 1");
                return Health.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("status", "Available")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}
```

### Kubernetes Probes
Configure Kubernetes probes for Java applications:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-boot-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: spring-boot-app:1.0.0
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
```

## Best Practices for Monitoring Java Applications

### 1. Define Service Level Objectives (SLOs)
Establish clear SLOs for your application, like:
- 99.9% availability
- 95% of requests complete in under 300ms
- Error rate below 0.1%

### 2. Use the RED Method
Monitor key metrics for every service:
- **R**ate: Requests per second
- **E**rror rate: Failed requests per second
- **D**uration: Distribution of request latencies

### 3. Implement the USE Method
For resources, monitor:
- **U**tilization: Average time resource was busy
- **S**aturation: Amount of work queued
- **E**rrors: Error events count

### 4. Structured Logging
Always use structured logging with consistent format and fields:
- Include contextual information (request ID, user ID)
- Use appropriate log levels
- Include timestamps and source information

### 5. Centralize Everything
Ensure all logs, metrics, and traces are collected centrally for:
- Correlation analysis
- Historical trending
- Anomaly detection

### 6. Right-size Retention
Balance retention needs against storage costs:
- High-resolution metrics: 2 weeks
- Aggregated metrics: 1 year+
- Critical application logs: 90 days
- Detailed debug logs: 7-14 days

### 7. Use Application Performance Monitoring (APM)
Consider APM solutions for deeper insights:
- Elastic APM
- New Relic
- Dynatrace
- AppDynamics
- DataDog

## Next Steps

Once you understand monitoring and logging fundamentals, explore these related topics:

- [DevOps Tools Overview](devops-tools-overview.md)
- [Java App Monitoring](java-app-monitoring.md)
- [Docker Fundamentals](docker-fundamentals.md)
- [Infrastructure as Code](infrastructure-as-code.md)

## References and Resources

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [ELK Stack Documentation](https://www.elastic.co/guide/index.html)
- [SLO Book by Google](https://sre.google/workbook/implementing-slos/)
- [Logging Best Practices](https://www.scalyr.com/blog/logging-best-practices/)
- [Spring Boot Observability](https://spring.io/blog/2022/10/12/observability-with-spring-boot-3) 