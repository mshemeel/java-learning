# Monitoring Java Microservices

## Overview
This tutorial walks through implementing comprehensive monitoring for Java microservices. We'll cover setting up metrics collection, distributed tracing, log aggregation, and alerts to gain full observability into your microservices architecture.

## Prerequisites
- Basic understanding of [monitoring and logging](../monitoring-logging.md)
- Experience with Java microservices
- Familiarity with Spring Boot (examples use Spring Boot)
- Docker and Docker Compose installed
- Kubernetes knowledge (for advanced sections)

## Learning Objectives
- Implement metrics collection in Java microservices
- Set up distributed tracing across service boundaries
- Configure centralized logging
- Create dashboards for monitoring microservices health
- Implement alerts for proactive issue detection
- Understand microservices-specific monitoring challenges
- Use the Prometheus and Grafana monitoring stack

## Monitoring Architecture Overview

A comprehensive monitoring solution for Java microservices includes:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Microservices Monitoring Architecture            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
    ┌───────────────┬─────────────┴─────────────┬───────────────┐
    │               │                           │               │
    ▼               ▼                           ▼               ▼
┌──────────┐   ┌──────────┐                ┌──────────┐   ┌──────────┐
│ Metrics  │   │   Logs   │                │  Traces  │   │  Alerts  │
│Collection│   │Aggregation│                │Collection│   │& Dashboards│
└──────────┘   └──────────┘                └──────────┘   └──────────┘
    │               │                           │               │
    │               │                           │               │
    ▼               ▼                           ▼               ▼
┌──────────┐   ┌──────────┐                ┌──────────┐   ┌──────────┐
│Prometheus │   │ELK Stack │                │  Jaeger  │   │ Grafana  │
│           │   │          │                │          │   │          │
└──────────┘   └──────────┘                └──────────┘   └──────────┘
```

## Setting Up the Monitoring Infrastructure

### Step 1: Create Docker Compose Configuration

Create a `docker-compose.yml` file to set up your monitoring infrastructure:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.43.0
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:9.5.2
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      - prometheus

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.7.0
    container_name: elasticsearch
    environment:
      - xpack.security.enabled=false
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    restart: unless-stopped

  logstash:
    image: docker.elastic.co/logstash/logstash:8.7.0
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - "5044:5044"
      - "5000:5000/tcp"
      - "5000:5000/udp"
      - "9600:9600"
    environment:
      LS_JAVA_OPTS: "-Xmx256m -Xms256m"
    restart: unless-stopped
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.7.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    restart: unless-stopped
    depends_on:
      - elasticsearch

  jaeger:
    image: jaegertracing/all-in-one:1.45
    container_name: jaeger
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
  elasticsearch_data:
```

### Step 2: Configure Prometheus

Create a `prometheus/prometheus.yml` file:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'spring-boot-apps'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['host.docker.internal:8080', 'host.docker.internal:8081', 'host.docker.internal:8082']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Step 3: Configure Logstash

Create a `logstash/pipeline/logstash.conf` file:

```
input {
  tcp {
    port => 5000
    codec => json_lines
  }
}

filter {
  if [type] == "java-app" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} \[%{DATA:service},%{DATA:traceId},%{DATA:spanId}\] %{DATA:pid} --- \[%{DATA:thread}\] %{DATA:logger} : %{GREEDYDATA:message}" }
    }
    date {
      match => [ "timestamp", "yyyy-MM-dd HH:mm:ss.SSS" ]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "microservices-%{+YYYY.MM.dd}"
  }
}
```

Create a `logstash/config/logstash.yml` file:

```yaml
http.host: "0.0.0.0"
path.config: /usr/share/logstash/pipeline
monitoring.elasticsearch.hosts: ["http://elasticsearch:9200"]
```

### Step 4: Set Up Grafana Dashboards

Create a basic Grafana datasource provisioning file at `grafana/provisioning/datasources/datasource.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
  - name: Elasticsearch
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "microservices-*"
    isDefault: false
    editable: false
    jsonData:
      timeField: "@timestamp"
      esVersion: 8.7.0
```

### Step 5: Start the Monitoring Stack

```bash
docker-compose up -d
```

## Instrumenting Java Microservices

### Metrics Collection with Micrometer and Prometheus

#### Step 1: Add Dependencies to Your Spring Boot Application

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    
    <!-- Micrometer Prometheus Registry -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</dependencies>
```

#### Step 2: Configure Spring Boot Application

Update your `application.yml` file:

```yaml
spring:
  application:
    name: order-service  # Replace with your service name

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  metrics:
    tags:
      application: ${spring.application.name}
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
  endpoint:
    health:
      show-details: always
```

#### Step 3: Add Custom Metrics

Create a `MetricsConfig.java` file to add custom metrics:

```java
package com.example.orderservice.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public Counter orderCreatedCounter(MeterRegistry registry) {
        return Counter.builder("orders.created")
                .description("Number of orders created")
                .register(registry);
    }
    
    @Bean
    public Counter orderFailedCounter(MeterRegistry registry) {
        return Counter.builder("orders.failed")
                .description("Number of failed order creations")
                .register(registry);
    }
    
    @Bean
    public Timer orderProcessingTimer(MeterRegistry registry) {
        return Timer.builder("orders.processing.time")
                .description("Time taken to process orders")
                .register(registry);
    }
}
```

#### Step 4: Use the Custom Metrics in Your Service

```java
package com.example.orderservice.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    
    private final Counter orderCreatedCounter;
    private final Counter orderFailedCounter;
    private final Timer orderProcessingTimer;
    
    public OrderService(
            Counter orderCreatedCounter,
            Counter orderFailedCounter,
            Timer orderProcessingTimer) {
        this.orderCreatedCounter = orderCreatedCounter;
        this.orderFailedCounter = orderFailedCounter;
        this.orderProcessingTimer = orderProcessingTimer;
    }
    
    public Order createOrder(OrderRequest request) {
        return orderProcessingTimer.record(() -> {
            try {
                // Order creation logic here
                Order newOrder = // ...
                
                // Increment success counter
                orderCreatedCounter.increment();
                
                return newOrder;
            } catch (Exception e) {
                // Increment failure counter
                orderFailedCounter.increment();
                throw e;
            }
        });
    }
}
```

## Distributed Tracing with Spring Cloud Sleuth and Jaeger

### Step 1: Add Dependencies

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- Spring Cloud Sleuth -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
    
    <!-- Zipkin Reporter -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-sleuth-zipkin</artifactId>
    </dependency>
</dependencies>
```

### Step 2: Configure Tracing

Update your `application.yml`:

```yaml
spring:
  application:
    name: order-service
  sleuth:
    sampler:
      probability: 1.0  # Sample 100% of requests in development
  zipkin:
    base-url: http://localhost:9411
    sender:
      type: web
```

### Step 3: Instrument RestTemplate for Tracing

Create a configuration class:

```java
package com.example.orderservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

Spring Cloud Sleuth will automatically instrument the RestTemplate to propagate trace context.

### Step 4: Add Trace Information to Logs

Update your `logback-spring.xml` configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %5p [${spring.application.name},%X{traceId:-},%X{spanId:-}] ${PID} --- [%t] %-40.40logger{39} : %m%n</pattern>
            <charset>utf8</charset>
        </encoder>
    </appender>
    
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>localhost:5000</destination>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"service":"${spring.application.name}"}</customFields>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="LOGSTASH"/>
    </root>
</configuration>
```

To use this configuration, add the Logstash encoder dependency:

```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.3</version>
</dependency>
```

## Creating Useful Dashboards in Grafana

### JVM Metrics Dashboard

Import this dashboard JSON into Grafana:

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": null,
  "links": [],
  "panels": [
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "Prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 2,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "jvm_memory_used_bytes{application=\"$application\", area=\"heap\"}",
          "legendFormat": "{{id}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "JVM Heap Memory Usage",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "bytes",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "Prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 4,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "rate(jvm_gc_pause_seconds_sum{application=\"$application\"}[1m])",
          "legendFormat": "{{action}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "GC Pause Time (1m rate)",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "s",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "Prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 8
      },
      "hiddenSeries": false,
      "id": 6,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "jvm_threads_states_threads{application=\"$application\"}",
          "legendFormat": "{{state}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "JVM Thread States",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "Prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 8
      },
      "hiddenSeries": false,
      "id": 8,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{application=\"$application\"}[5m])) by (le, uri))",
          "legendFormat": "{{uri}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "HTTP Request Duration (95th percentile)",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "s",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    }
  ],
  "refresh": "10s",
  "schemaVersion": 22,
  "style": "dark",
  "tags": [],
  "templating": {
    "list": [
      {
        "allValue": null,
        "current": {
          "selected": false,
          "text": "order-service",
          "value": "order-service"
        },
        "datasource": "Prometheus",
        "definition": "label_values(application)",
        "hide": 0,
        "includeAll": false,
        "label": null,
        "multi": false,
        "name": "application",
        "options": [],
        "query": "label_values(application)",
        "refresh": 1,
        "regex": "",
        "skipUrlSync": false,
        "sort": 0,
        "tagValuesQuery": "",
        "tags": [],
        "tagsQuery": "",
        "type": "query",
        "useTags": false
      }
    ]
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {
    "refresh_intervals": [
      "5s",
      "10s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d"
    ]
  },
  "timezone": "",
  "title": "Java Microservices Dashboard",
  "uid": "java-microservices",
  "variables": {
    "list": []
  },
  "version": 1
}
```

## Setting Up Alerts

### Prometheus Alert Rules

Create a `prometheus/alert.rules.yml` file:

```yaml
groups:
  - name: JavaAppAlerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[1m])) / sum(rate(http_server_requests_seconds_count[1m])) * 100 > 5
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High HTTP error rate"
          description: "Error rate is {{ $value }}% (> 5%) for service {{ $labels.application }}"

      - alert: SlowResponses
        expr: histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le, application)) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response times"
          description: "95th percentile of request duration is {{ $value }}s (> 0.5s) for service {{ $labels.application }}"

      - alert: HighCpuUsage
        expr: process_cpu_usage{application=~".+"} > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value | humanizePercentage }} for service {{ $labels.application }}"

      - alert: HighMemoryUsage
        expr: sum(jvm_memory_used_bytes{area="heap"}) by (application) / sum(jvm_memory_max_bytes{area="heap"}) by (application) > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }} for service {{ $labels.application }}"
```

Update your `prometheus.yml` to include the alert rules:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - alert.rules.yml

scrape_configs:
  # ... (previous configurations)
```

### Configure AlertManager (Optional)

Create a `prometheus/alertmanager.yml` file:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'application']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
  receiver: 'slack'
  routes:
  - match:
      severity: critical
    receiver: 'pagerduty'

receivers:
- name: 'slack'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
    channel: '#alerts'
    send_resolved: true
    title: "{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}"
    text: "{{ range .Alerts }}{{ .Annotations.description }}\n{{ end }}"

- name: 'pagerduty'
  pagerduty_configs:
  - service_key: YOUR_PAGERDUTY_SERVICE_KEY
    description: "{{ .GroupLabels.application }} - {{ .CommonAnnotations.summary }}"
    client: "AlertManager"
    client_url: "{{ template \"pagerduty.default.client_url\" . }}"
    details:
      summary: "{{ .CommonAnnotations.description }}"
```

Add AlertManager to your Docker Compose configuration:

```yaml
alertmanager:
  image: prom/alertmanager:v0.25.0
  container_name: alertmanager
  volumes:
    - ./prometheus/alertmanager.yml:/etc/alertmanager/alertmanager.yml
  command:
    - '--config.file=/etc/alertmanager/alertmanager.yml'
    - '--storage.path=/alertmanager'
  ports:
    - "9093:9093"
  restart: unless-stopped
```

Update Prometheus configuration to connect to AlertManager:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093

rule_files:
  - alert.rules.yml

scrape_configs:
  # ... (previous configurations)
```

## Advanced Monitoring Topics

### Monitoring Resilience4j Circuit Breakers

Add Resilience4j to your project:

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
    <version>1.7.1</version>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-micrometer</artifactId>
    <version>1.7.1</version>
</dependency>
```

Configure Resilience4j in `application.yml`:

```yaml
resilience4j:
  circuitbreaker:
    configs:
      default:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
    instances:
      paymentService:
        baseConfig: default
  micrometer:
    enabled: true
```

### Monitoring Spring Cloud Gateway

For API Gateway monitoring, add these metrics:

```yaml
spring:
  cloud:
    gateway:
      metrics:
        enabled: true
```

Add a Grafana dashboard for Gateway metrics:

```json
{
  "panels": [
    {
      "title": "Gateway Request Rate",
      "targets": [
        {
          "expr": "sum(rate(spring_cloud_gateway_requests_seconds_count[1m])) by (routeId)"
        }
      ]
    },
    {
      "title": "Gateway Request Duration (95th Percentile)",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(spring_cloud_gateway_requests_seconds_bucket[1m])) by (routeId, le))"
        }
      ]
    }
  ]
}
```

## Best Practices for Microservices Monitoring

1. **Use Consistent Service Names**: Name services consistently in metrics and logs.
2. **Propagate Trace IDs**: Ensure trace IDs flow through all services.
3. **Set Appropriate Sampling Rates**: Use 100% sampling in dev/test, lower in production.
4. **Monitor Key Business Metrics**: Track business-level metrics, not just technical ones.
5. **Implement Health Checks**: Use Spring Boot Actuator health endpoints.
6. **Create Service Dashboards**: Create dashboards focused on each service.
7. **Set Appropriate Alerts**: Alert on symptoms, not causes, to reduce alert fatigue.
8. **Implement Log Correlation**: Correlate logs with traces and metrics.
9. **Use Tags Consistently**: Apply consistent tags to metrics for easier querying.
10. **Monitor Dependencies**: Track the health of dependencies (databases, queues, etc.).

## Conclusion

In this tutorial, we've set up comprehensive monitoring for Java microservices using:
1. Prometheus and Grafana for metrics collection and visualization
2. Spring Cloud Sleuth and Jaeger for distributed tracing
3. ELK Stack for centralized logging
4. AlertManager for proactive alerts

This monitoring stack provides full observability into your microservices architecture, helping you identify issues quickly, understand system behavior, and maintain high availability and performance.

## References

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Spring Cloud Sleuth Documentation](https://spring.io/projects/spring-cloud-sleuth)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/latest/)
- [ELK Stack Documentation](https://www.elastic.co/guide/index.html)
- [Resilience4j Documentation](https://resilience4j.readme.io/docs) 