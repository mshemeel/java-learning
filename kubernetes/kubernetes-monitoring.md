# Kubernetes Monitoring

## Overview
This guide covers monitoring strategies in Kubernetes, including metrics collection, logging, tracing, and best practices for monitoring cluster and application health.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of monitoring concepts
- Familiarity with Prometheus and Grafana
- Understanding of logging systems

## Learning Objectives
- Understand monitoring concepts
- Learn metrics collection
- Master logging strategies
- Implement tracing
- Configure alerts

## Table of Contents
1. [Metrics Collection](#metrics-collection)
2. [Logging](#logging)
3. [Distributed Tracing](#distributed-tracing)
4. [Alerting](#alerting)
5. [Monitoring Tools](#monitoring-tools)

## Metrics Collection

### Prometheus Configuration
```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false
```

### Service Monitor
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-monitor
  labels:
    team: frontend
spec:
  selector:
    matchLabels:
      app: web
  endpoints:
  - port: metrics
    interval: 15s
```

### Metrics Endpoint
```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
  annotations:
    prometheus.io/scrape: 'true'
    prometheus.io/port: '9090'
spec:
  selector:
    app: web
  ports:
  - name: metrics
    port: 9090
    targetPort: metrics
```

## Logging

### Fluentd Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch-logging
      port 9200
      logstash_format true
      logstash_prefix k8s
    </match>
```

### Elasticsearch Configuration
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: elasticsearch:7.9.3
        env:
        - name: discovery.type
          value: single-node
        ports:
        - containerPort: 9200
          name: http
        - containerPort: 9300
          name: transport
```

## Distributed Tracing

### Jaeger Configuration
```yaml
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: jaeger
spec:
  strategy: production
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: http://elasticsearch:9200
  ingress:
    enabled: true
```

### OpenTelemetry Configuration
```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: otel
spec:
  config: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
    processors:
      batch:
    exporters:
      jaeger:
        endpoint: jaeger-collector:14250
        tls:
          insecure: true
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [batch]
          exporters: [jaeger]
```

## Alerting

### Alert Manager Configuration
```yaml
apiVersion: monitoring.coreos.com/v1
kind: AlertmanagerConfig
metadata:
  name: alert-config
spec:
  route:
    receiver: 'slack'
    group_by: ['alertname', 'cluster', 'service']
  receivers:
  - name: 'slack'
    slack_configs:
    - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
      channel: '#alerts'
      send_resolved: true
```

### Alert Rules
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: prometheus-rules
spec:
  groups:
  - name: node
    rules:
    - alert: HighCPUUsage
      expr: node_cpu_usage_percentage > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        description: CPU usage is above 80% for 5 minutes
```

## Monitoring Tools

### Grafana Dashboard
```yaml
apiVersion: integreatly.org/v1alpha1
kind: GrafanaDashboard
metadata:
  name: kubernetes-dashboard
spec:
  json: |
    {
      "dashboard": {
        "id": null,
        "title": "Kubernetes Cluster Monitoring",
        "panels": [
          {
            "title": "CPU Usage",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)"
              }
            ]
          }
        ]
      }
    }
```

### Prometheus Operator
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus-operator
  template:
    metadata:
      labels:
        app: prometheus-operator
    spec:
      containers:
      - name: prometheus-operator
        image: quay.io/prometheus-operator/prometheus-operator:v0.50.0
        args:
        - --kubelet-service=kube-system/kubelet
        - --config-reloader-image=jimmidyson/configmap-reload:v0.5.0
```

## Best Practices
1. Implement comprehensive monitoring
2. Configure proper log retention
3. Set up distributed tracing
4. Implement meaningful alerts
5. Use appropriate monitoring tools
6. Monitor cluster health
7. Implement proper dashboards

## Common Pitfalls
1. Insufficient monitoring coverage
2. Poor log management
3. Missing alerts
4. Inadequate resource monitoring
5. Poor visualization
6. Alert fatigue

## Implementation Examples

### Complete Monitoring Stack
```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend
  resources:
    requests:
      memory: 400Mi
  alerting:
    alertmanagers:
    - name: alertmanager-main
      namespace: monitoring
      port: web
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-monitor
spec:
  selector:
    matchLabels:
      app: web
  endpoints:
  - port: metrics
    interval: 15s
---
apiVersion: monitoring.coreos.com/v1
kind: AlertmanagerConfig
metadata:
  name: alert-config
spec:
  route:
    receiver: 'slack'
    group_by: ['alertname', 'cluster', 'service']
  receivers:
  - name: 'slack'
    slack_configs:
    - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
      channel: '#alerts'
```

### Logging Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
      </parse>
    </source>
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch-logging
      port 9200
      logstash_format true
    </match>
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1.12.0-debian-elasticsearch7-1.1
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: config
          mountPath: /fluentd/etc
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: config
        configMap:
          name: fluentd-config
```

## Resources for Further Learning
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Jaeger Tracing](https://www.jaegertracing.io/docs/)
- [ELK Stack on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-overview.html)

## Practice Exercises
1. Set up Prometheus monitoring
2. Configure logging with ELK stack
3. Implement distributed tracing
4. Create Grafana dashboards
5. Configure alerting rules 