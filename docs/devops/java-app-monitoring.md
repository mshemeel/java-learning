# Java App Monitoring

## Overview
This guide focuses on monitoring Java applications in production environments. Effective monitoring is essential for maintaining application health, troubleshooting issues, and ensuring optimal performance. We'll cover Java-specific monitoring approaches, tools, and best practices with practical implementation examples.

## Prerequisites
- Understanding of [monitoring fundamentals](monitoring-logging.md)
- Familiarity with Java application architecture
- Basic knowledge of Spring Boot (for Actuator sections)
- Understanding of containerization concepts (for containerized monitoring)

## Learning Objectives
- Implement comprehensive monitoring for JVM-based applications
- Configure and use Spring Boot Actuator for application insights
- Set up Micrometer metrics collection for Java applications
- Understand and monitor key JVM metrics
- Implement distributed tracing for Java microservices
- Design effective alerting strategies for Java applications
- Integrate with major monitoring platforms (Prometheus, Grafana, etc.)

## JVM Monitoring Fundamentals

### Critical JVM Metrics to Monitor

The JVM provides numerous metrics that offer insights into application health and performance:

```
┌──────────────────────────────────────────────────────────────────┐
│                       JVM Monitoring Areas                        │
└──────────────────────────────────────────────────────────────────┘
         │              │               │               │
         ▼              ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Memory   │  │   Threads   │  │     GC      │  │   Classes   │
│             │  │             │  │             │  │             │
│ • Heap      │  │ • Count     │  │ • GC Cycles │  │ • Loaded    │
│ • Non-heap  │  │ • Runnable  │  │ • GC Time   │  │ • Unloaded  │
│ • Pools     │  │ • Blocked   │  │ • GC Types  │  │ • Compiled  │
│ • Buffer    │  │ • Waiting   │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
         │              │               │               │
         └──────────────┴───────────────┴───────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │  Application Metrics      │
                     │                           │
                     │ • HTTP Requests           │
                     │ • Response Times          │
                     │ • Database Operations     │
                     │ • External Service Calls  │
                     └───────────────────────────┘
```

#### Memory Metrics
- **Heap Memory Usage**: Total, used, and max heap memory
- **Non-Heap Memory**: Metaspace, code cache, compressed class space
- **Memory Pools**: Eden space, survivor spaces, old generation
- **Direct Buffers**: Off-heap memory used for I/O operations
- **Memory Pressure**: Frequency of GC events

#### Thread Metrics
- **Thread Count**: Total number of live threads
- **Thread States**: Number of threads in each state (runnable, blocked, waiting)
- **Deadlocked Threads**: Detection of potential deadlocks
- **Thread CPU Time**: CPU time consumed by individual threads

#### Garbage Collection Metrics
- **GC Events**: Frequency of garbage collection cycles
- **GC Duration**: Time spent in garbage collection
- **GC Types**: Minor vs. major collections
- **Memory Reclaimed**: Amount of memory freed by each GC event
- **Promotion Rate**: Rate of objects moving to the old generation

#### Class Loading Metrics
- **Loaded Classes**: Number of classes currently loaded
- **Total Classes**: Total number of classes loaded since startup
- **Unloaded Classes**: Number of classes unloaded

## Tools for JVM Monitoring

### Java Mission Control (JMC) and Flight Recorder (JFR)

JMC and JFR provide detailed insights into JVM performance with minimal overhead:

```bash
# Enable JFR in your Java application
java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=recording.jfr MyApplication
```

Flight Recorder event configuration:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration version="2.0">
  <event name="jdk.GarbageCollection">
    <setting name="enabled">true</setting>
    <setting name="threshold">0 ms</setting>
  </event>
  <event name="jdk.ThreadAllocationStatistics">
    <setting name="enabled">true</setting>
    <setting name="period">1000 ms</setting>
  </event>
</configuration>
```

### VisualVM

VisualVM provides a visual interface for monitoring and profiling Java applications:

```bash
# Launch VisualVM and connect to a local Java process
visualvm --openjmx localhost:9010
```

### JConsole

JConsole is a simpler monitoring tool included with the JDK:

```bash
# Enable JMX remote monitoring in your Java application
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.local.only=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -Dcom.sun.management.jmxremote.ssl=false \
     -jar myapp.jar

# Connect with JConsole
jconsole localhost:9010
```

## Spring Boot Actuator

Spring Boot Actuator provides production-ready features for monitoring Spring applications.

### Basic Configuration

Add Actuator to your Spring Boot application:

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure Actuator endpoints in `application.properties` or `application.yml`:

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers,threaddump,heapdump,env
  endpoint:
    health:
      show-details: always
    metrics:
      enabled: true
    prometheus:
      enabled: true
```

### Key Actuator Endpoints

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/actuator/health` | Application health status | Check if the application is healthy |
| `/actuator/metrics` | Application and JVM metrics | Access specific metrics |
| `/actuator/prometheus` | Prometheus format metrics | Integration with Prometheus |
| `/actuator/info` | Application information | Custom application info |
| `/actuator/loggers` | View and modify logger levels | Change log levels at runtime |
| `/actuator/threaddump` | Thread dump | Debug thread issues |
| `/actuator/heapdump` | Heap dump file | Debug memory issues |
| `/actuator/env` | Environment properties | View configuration |

### Custom Health Indicators

Create a custom health indicator to check specific components:

```java
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    
    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement ps = conn.prepareStatement("SELECT 1")) {
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next() && rs.getInt(1) == 1) {
                        return Health.up()
                                .withDetail("database", "PostgreSQL")
                                .withDetail("status", "Available")
                                .build();
                    }
                }
            }
            return Health.down()
                    .withDetail("error", "Database query failed")
                    .build();
        } catch (SQLException e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

### Custom Info Contributors

Add custom information to the `/actuator/info` endpoint:

```java
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class BuildInfoContributor implements InfoContributor {
    
    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("build", Map.of(
            "version", "1.2.3",
            "timestamp", "2023-06-15T12:00:00Z",
            "commit", "abc123"
        ));
    }
}
```

## Micrometer with Spring Boot

Micrometer provides a vendor-neutral metrics collection facade that supports multiple monitoring systems.

### Basic Configuration

Add Micrometer and Prometheus registry to your Spring Boot application:

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

### Custom Metrics with Micrometer

Create custom metrics with Micrometer:

```java
import io.micrometer.core.instrument.*;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final MeterRegistry registry;
    private final Counter orderCounter;
    private final Timer orderProcessingTimer;
    private final DistributionSummary orderSizeSummary;
    
    public OrderService(MeterRegistry registry) {
        this.registry = registry;
        this.orderCounter = registry.counter("orders.created", "type", "standard");
        this.orderProcessingTimer = registry.timer("orders.processing.time");
        this.orderSizeSummary = registry.summary("orders.size");
        
        // Register a gauge to track pending orders
        Gauge.builder("orders.pending", orderQueue, Queue::size)
                .description("Number of pending orders")
                .register(registry);
    }
    
    public Order createOrder(OrderRequest request) {
        return orderProcessingTimer.record(() -> {
            // Order processing logic
            Order order = processOrder(request);
            
            // Update metrics
            orderCounter.increment();
            orderSizeSummary.record(order.getItems().size());
            
            return order;
        });
    }
    
    // Handle different types of orders with tags
    public Order createPriorityOrder(OrderRequest request) {
        Counter priorityOrderCounter = registry.counter("orders.created", "type", "priority");
        priorityOrderCounter.increment();
        
        // Rest of the logic
        // ...
    }
}
```

### Common Micrometer Metric Types

| Type | Use Case | Example |
|------|----------|---------|
| Counter | Incrementing count | Number of requests, errors |
| Gauge | Current value | Active connections, queue size |
| Timer | Duration of events | Request latency, method execution time |
| DistributionSummary | Distribution of values | Request size, response size |
| LongTaskTimer | Long-running tasks | Batch job duration |
| FunctionCounter | Function-calculated counter | Cache hit count from a method |
| FunctionTimer | Function-calculated timer | Average execution time |

### Dimensional Metrics with Tags

Tags (or dimensions) provide additional context to metrics:

```java
// Register a timer with multiple tags
Timer requestTimer = registry.timer("http.requests",
                             "method", request.getMethod(),
                             "status", String.valueOf(response.getStatus()),
                             "uri", request.getRequestURI());

// Record the timing
requestTimer.record(Duration.ofMillis(processingTime));
```

## Prometheus and Grafana for Java Applications

### Prometheus Configuration

Configure Prometheus to scrape metrics from your Java application:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['app:8080']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'app-1'
```

Docker Compose setup for Prometheus and Java app:

```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    ports:
      - "8080:8080"
      
  prometheus:
    image: prom/prometheus:v2.42.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
```

### Grafana Dashboards for Java Applications

Set up Grafana with Prometheus data source:

```yaml
version: '3.8'
services:
  grafana:
    image: grafana/grafana:9.4.3
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./dashboards:/etc/grafana/provisioning/dashboards
      - ./datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus

volumes:
  grafana-data:
```

Datasource configuration (`./datasources/prometheus.yml`):

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

### Essential JVM Dashboard Panels

A comprehensive Grafana dashboard for Java applications should include:

1. **Memory Metrics**:
   ```
   sum(jvm_memory_used_bytes{application="$application", area="heap"}) / sum(jvm_memory_max_bytes{application="$application", area="heap"}) * 100
   ```

2. **Garbage Collection**:
   ```
   rate(jvm_gc_pause_seconds_sum{application="$application"}[1m])
   ```

3. **Thread States**:
   ```
   jvm_threads_states_threads{application="$application"}
   ```

4. **HTTP Requests**:
   ```
   sum(rate(http_server_requests_seconds_count{application="$application"}[1m])) by (status)
   ```

5. **Response Time**:
   ```
   histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{application="$application"}[1m])) by (le))
   ```

6. **Database Connection Pool**:
   ```
   hikaricp_connections_active{application="$application"}
   ```

7. **JVM CPU Usage**:
   ```
   process_cpu_usage{application="$application"}
   ```

## Distributed Tracing for Java Microservices

### Spring Cloud Sleuth with Zipkin

Configure distributed tracing with Spring Cloud Sleuth and Zipkin:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
```

Configuration in `application.yml`:

```yaml
spring:
  application:
    name: order-service
  sleuth:
    sampler:
      probability: 1.0  # Sample 100% of requests in development
  zipkin:
    base-url: http://zipkin:9411
```

### OpenTelemetry for Java

Configure OpenTelemetry for distributed tracing:

```xml
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
<dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-instrumentation-annotations</artifactId>
    <version>1.19.0-alpha</version>
</dependency>
```

Java code for manual instrumentation:

```java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import io.opentelemetry.instrumentation.annotations.WithSpan;

@Service
public class OrderProcessor {
    private final Tracer tracer = GlobalOpenTelemetry.getTracer("order-processor");
    
    public void processOrder(Order order) {
        // Create a span
        Span span = tracer.spanBuilder("processOrder")
            .setAttribute("order.id", order.getId())
            .setAttribute("customer.id", order.getCustomerId())
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            // Processing logic
            validateOrder(order);
            checkInventory(order);
            processPayment(order);
        } catch (Exception e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, e.getMessage());
            throw e;
        } finally {
            span.end();
        }
    }
    
    // Automatic instrumentation with annotations
    @WithSpan("validateOrder")
    private void validateOrder(Order order) {
        Span.current().setAttribute("order.items", order.getItems().size());
        // Validation logic
    }
}
```

### Jaeger for Trace Visualization

Docker Compose setup for Jaeger:

```yaml
services:
  jaeger:
    image: jaegertracing/all-in-one:1.39
    ports:
      - "16686:16686"  # UI
      - "14268:14268"  # HTTP collector
      - "14250:14250"  # gRPC collector
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
```

## Application Performance Monitoring (APM) Tools

### Elastic APM for Java

Configure Elastic APM for Java applications:

```xml
<dependency>
    <groupId>co.elastic.apm</groupId>
    <artifactId>apm-agent-api</artifactId>
    <version>1.36.0</version>
</dependency>
```

Agent setup:

```bash
java -javaagent:/path/to/elastic-apm-agent-1.36.0.jar \
     -Delastic.apm.service_name=my-application \
     -Delastic.apm.server_url=http://localhost:8200 \
     -Delastic.apm.environment=production \
     -Delastic.apm.application_packages=com.example \
     -jar myapp.jar
```

### New Relic for Java

New Relic Java agent setup:

```bash
java -javaagent:/path/to/newrelic.jar \
     -jar myapp.jar
```

`newrelic.yml` configuration:

```yaml
common: &default_settings
  license_key: 'your_license_key'
  app_name: My Java Application
  distributed_tracing:
    enabled: true
  
  transaction_tracer:
    enabled: true
    transaction_threshold: apdex_f
    
  error_collector:
    enabled: true
    
  browser_monitoring:
    auto_instrument: true
```

### Datadog APM for Java

Datadog agent setup:

```bash
java -javaagent:/path/to/dd-java-agent.jar \
     -Ddd.service=my-service \
     -Ddd.env=production \
     -Ddd.profiling.enabled=true \
     -jar myapp.jar
```

## Health Checks and Readiness Probes

### Spring Boot Health Indicators

Configure comprehensive health checks in Spring Boot:

```java
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {
    
    private final RestTemplate restTemplate;
    private final String serviceUrl;
    
    public ExternalServiceHealthIndicator(RestTemplate restTemplate, 
                                          @Value("${service.url}") String serviceUrl) {
        this.restTemplate = restTemplate;
        this.serviceUrl = serviceUrl;
    }
    
    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                serviceUrl + "/health", String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                    .withDetail("status", response.getStatusCode())
                    .withDetail("response", response.getBody())
                    .build();
            } else {
                return Health.down()
                    .withDetail("status", response.getStatusCode())
                    .withDetail("response", response.getBody())
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

### Kubernetes Probes for Java Applications

Configure Kubernetes liveness and readiness probes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: my-java-app:1.0
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
          failureThreshold: 12  # Allow 1 minute (12 * 5s) for startup
```

## Alerting Strategies for Java Applications

### Prometheus Alerting Rules

Configure Prometheus alerting rules for Java applications:

```yaml
# alert-rules.yml
groups:
- name: java-app-alerts
  rules:
  - alert: HighMemoryUsage
    expr: sum(jvm_memory_used_bytes{area="heap"}) / sum(jvm_memory_max_bytes{area="heap"}) * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High JVM memory usage ({{ $value }}%)"
      description: "JVM memory usage is above 85% for 5 minutes."
      
  - alert: GarbageCollectionTime
    expr: rate(jvm_gc_pause_seconds_sum[1m]) > 0.5
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High GC time ({{ $value }}s per second)"
      description: "JVM is spending more than 50% of its time in garbage collection."
      
  - alert: HighCpuUsage
    expr: process_cpu_usage > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage ({{ $value }})"
      description: "Java process is using more than 80% CPU for 5 minutes."
      
  - alert: HighErrorRate
    expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[1m])) / sum(rate(http_server_requests_seconds_count[1m])) * 100 > 5
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "High error rate ({{ $value }}%)"
      description: "Error rate is above 5% for 1 minute."
      
  - alert: SlowResponses
    expr: histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le)) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Slow responses (95th percentile > 1s)"
      description: "95% of requests are taking more than 1 second to complete."
      
  - alert: InstanceDown
    expr: up{job="spring-boot-app"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Instance {{ $labels.instance }} down"
      description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute."
      
  - alert: DeadlockedThreads
    expr: jvm_threads_deadlocked > 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Deadlocked threads detected ({{ $value }})"
      description: "There are {{ $value }} deadlocked threads in the JVM."
```

### Setting Up AlertManager

AlertManager configuration for routing and notifications:

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'

route:
  group_by: ['alertname', 'job', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'team-emails'
  routes:
  - match:
      severity: critical
    receiver: 'pager-duty'
    continue: true
  - match:
      severity: warning
    receiver: 'slack-notifications'
    continue: true

receivers:
- name: 'team-emails'
  email_configs:
  - to: 'team@example.com'
    send_resolved: true
    
- name: 'pager-duty'
  pagerduty_configs:
  - service_key: '<pagerduty-service-key>'
    
- name: 'slack-notifications'
  slack_configs:
  - channel: '#alerts'
    send_resolved: true
    title: "{{ .GroupLabels.alertname }}"
    text: "{{ range .Alerts }}{{ .Annotations.description }}\n{{ end }}"
```

## Operational Dashboards for Java Applications

### Essential Dashboard Panels

A comprehensive operational dashboard for Java applications should include:

1. **Application Health**: Overall health status and component health

2. **Traffic**: Request rate, response status codes, and response times

3. **Resource Usage**: CPU, memory, disk I/O, and network usage

4. **JVM Metrics**: Heap memory, GC activity, thread count, and class loading

5. **Business Metrics**: Key business indicators relevant to your application

### Designing Effective Dashboards

Follow these principles for effective dashboards:

1. **Use the RED method** for service monitoring:
   - **R**ate: Requests per second
   - **E**rror rate: Percentage of failing requests
   - **D**uration: Distribution of response times

2. **Use the USE method** for resources:
   - **U**tilization: Percentage time the resource is busy
   - **S**aturation: Amount of queued work
   - **E**rrors: Error events

3. **Create hierarchical dashboards**:
   - Level 1: High-level system view (traffic, error rates, latency)
   - Level 2: Service-level view (per-service metrics)
   - Level 3: Component-level view (database, caching, external services)
   - Level 4: Instance-level view (JVM metrics, host metrics)

## Performance Testing with Monitoring

### JMeter Integration

Configure JMeter for load testing with monitoring:

```xml
<!-- Backend Listener for Prometheus/Grafana -->
<BackendListener guiclass="BackendListenerGui" testclass="BackendListener" testname="Prometheus Backend Listener">
  <elementProp name="arguments" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments">
    <collectionProp name="Arguments.arguments">
      <elementProp name="graphiteMetricsSender" elementType="Argument">
        <stringProp name="Argument.name">graphiteMetricsSender</stringProp>
        <stringProp name="Argument.value">org.apache.jmeter.visualizers.backend.graphite.TextGraphiteMetricsSender</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="graphiteHost" elementType="Argument">
        <stringProp name="Argument.name">graphiteHost</stringProp>
        <stringProp name="Argument.value">localhost</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="graphitePort" elementType="Argument">
        <stringProp name="Argument.name">graphitePort</stringProp>
        <stringProp name="Argument.value">2003</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="rootMetricsPrefix" elementType="Argument">
        <stringProp name="Argument.name">rootMetricsPrefix</stringProp>
        <stringProp name="Argument.value">jmeter.</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="summaryOnly" elementType="Argument">
        <stringProp name="Argument.name">summaryOnly</stringProp>
        <stringProp name="Argument.value">false</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="samplersList" elementType="Argument">
        <stringProp name="Argument.name">samplersList</stringProp>
        <stringProp name="Argument.value">.*</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
      <elementProp name="percentiles" elementType="Argument">
        <stringProp name="Argument.name">percentiles</stringProp>
        <stringProp name="Argument.value">90;95;99</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
  <stringProp name="classname">org.apache.jmeter.visualizers.backend.graphite.GraphiteBackendListenerClient</stringProp>
</BackendListener>
```

### Gatling Integration

Gatling simulation with metrics recording:

```scala
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class JavaAppLoadSimulation extends Simulation {
  
  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
  
  val scn = scenario("Load Test")
    .exec(
      http("Home Page")
        .get("/")
        .check(status.is(200))
    )
    .pause(1)
    .exec(
      http("Get Products")
        .get("/api/products")
        .check(status.is(200))
    )
    .pause(2)
    .exec(
      http("Create Order")
        .post("/api/orders")
        .body(StringBody("""{"productId":1,"quantity":1}"""))
        .check(status.is(201))
    )
  
  setUp(
    scn.inject(
      rampUsers(10).during(10.seconds),
      constantUsersPerSec(20).during(1.minute),
      rampUsersPerSec(20).to(50).during(2.minutes)
    )
  ).protocols(httpProtocol)
   .assertions(
     global.responseTime.percentile3.lt(1000),
     global.successfulRequests.percent.gt(95)
   )
}
```

## Best Practices for Java Application Monitoring

1. **Monitor both JVM and application metrics**
   - JVM metrics provide infrastructure insights
   - Application metrics provide business insights

2. **Use standardized metric naming conventions**
   - Follow a consistent naming scheme (e.g., `application.module.metric`)
   - Use tags to provide dimensions for filtering and grouping

3. **Set appropriate sampling rates**
   - High cardinality metrics can cause performance issues
   - Use sampling for high-volume metrics in production

4. **Implement correlation IDs**
   - Add a unique ID to track requests across services
   - Include correlation IDs in logs and traces

5. **Establish meaningful SLOs (Service Level Objectives)**
   - Define clear, measurable targets for your application
   - Base alerts on SLO violations, not just raw metrics

6. **Minimize monitoring overhead**
   - Be selective about what metrics to collect
   - Use asynchronous and batch reporting when possible

7. **Implement proper log aggregation**
   - Centralize logs from all services
   - Structure logs for better searchability and correlation

8. **Leverage business metrics**
   - Track metrics that matter to your business
   - Correlate technical metrics with business outcomes

9. **Monitor downstream dependencies**
   - Track performance and availability of external services
   - Implement circuit breakers for resilience

10. **Document monitoring setup**
    - Keep a record of what metrics are collected and why
    - Document alerting thresholds and resolution procedures

## Next Steps

To continue learning about Java DevOps practices, explore:

- [Jenkins for Java](jenkins-for-java.md)
- [Java Containerization](java-containerization.md)
- [Java Deployment Strategies](java-deployment-strategies.md)
- [CI/CD Pipelines for Java](java-cicd-pipelines.md)
- [Sample Project: Monitoring Java Microservices](projects/monitoring-java-microservices.md)

## References and Resources

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus JVM Client](https://github.com/prometheus/client_java)
- [Grafana Java Dashboards](https://grafana.com/grafana/dashboards/?search=java)
- [OpenTelemetry Java Documentation](https://opentelemetry.io/docs/instrumentation/java/)
- [Java Flight Recorder Documentation](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm)
- [Elastic APM Java Agent](https://www.elastic.co/guide/en/apm/agent/java/current/index.html) 