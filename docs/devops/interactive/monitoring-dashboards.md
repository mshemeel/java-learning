# Monitoring Dashboard Templates

This page provides ready-to-use monitoring dashboard templates for Java applications. These templates can be imported into popular monitoring tools like Grafana, Prometheus, and Datadog to provide immediate visibility into your Java applications' performance and health.

## Dashboard Categories

<div class="dashboard-categories">
    <div class="category-card">
        <h3>JVM Metrics</h3>
        <p>Monitor Java Virtual Machine performance, memory usage, and garbage collection</p>
        <a href="#jvm-dashboards">View Dashboards</a>
    </div>
    
    <div class="category-card">
        <h3>Application Metrics</h3>
        <p>Monitor application-specific metrics like request rates, errors, and response times</p>
        <a href="#application-dashboards">View Dashboards</a>
    </div>
    
    <div class="category-card">
        <h3>Database Performance</h3>
        <p>Monitor database connections, query performance, and overall health</p>
        <a href="#database-dashboards">View Dashboards</a>
    </div>
    
    <div class="category-card">
        <h3>Microservices</h3>
        <p>Monitor service interactions, distributed traces, and system health</p>
        <a href="#microservices-dashboards">View Dashboards</a>
    </div>
</div>

## JVM Metrics Dashboards {: #jvm-dashboards}

### Java Virtual Machine Overview

This dashboard provides a comprehensive view of JVM performance metrics, including memory usage, garbage collection, and thread states.

![JVM Dashboard Preview](../assets/images/jvm-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Heap Memory Usage (Used vs. Max)</li>
            <li>Non-Heap Memory Usage</li>
            <li>Garbage Collection Frequency and Duration</li>
            <li>Thread Count by State</li>
            <li>CPU Usage</li>
            <li>Classloading Statistics</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="jvm-overview">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="prometheus" data-dashboard="jvm-overview">
            <img src="../assets/images/prometheus-logo.svg" alt="Prometheus">
            <span>Prometheus</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="datadog" data-dashboard="jvm-overview">
            <img src="../assets/images/datadog-logo.svg" alt="Datadog">
            <span>Datadog</span>
        </a>
    </div>
</div>

<div class="dashboard-code-snippet">
    <div class="code-tabs">
        <button class="tab-btn active" data-tab="grafana-jvm">Grafana</button>
        <button class="tab-btn" data-tab="prometheus-jvm">Prometheus</button>
        <button class="tab-btn" data-tab="datadog-jvm">Datadog</button>
    </div>
    
    <div class="tab-content" id="grafana-jvm">
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
  "id": 1,
  "links": [],
  "panels": [
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": null,
      "fieldConfig": {
        "defaults": {
          "custom": {}
        },
        "overrides": []
      },
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
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "7.2.0",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "jvm_memory_used_bytes{area=\"heap\"}",
          "interval": "",
          "legendFormat": "{{instance}} - {{id}}",
          "refId": "A"
        },
        {
          "expr": "jvm_memory_max_bytes{area=\"heap\"}",
          "interval": "",
          "legendFormat": "{{instance}} - {{id}} (Max)",
          "refId": "B"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "JVM Heap Memory",
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
      "datasource": null,
      "fieldConfig": {
        "defaults": {
          "custom": {}
        },
        "overrides": []
      },
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
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "7.2.0",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "rate(jvm_gc_collection_seconds_sum[1m])",
          "interval": "",
          "legendFormat": "{{instance}} - {{gc}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "GC Collection Time (1m rate)",
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
  "schemaVersion": 26,
  "style": "dark",
  "tags": [
    "java",
    "jvm",
    "micrometer"
  ],
  "templating": {
    "list": []
  },
  "time": {
    "from": "now-3h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "JVM Metrics Dashboard",
  "uid": "java-jvm-metrics",
  "version": 1
}
```
    </div>
    
    <div class="tab-content hidden" id="prometheus-jvm">
```yaml
groups:
- name: JVMAlerts
  rules:
  - alert: HighHeapUsage
    expr: (jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100) > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High heap memory usage (instance {{ $labels.instance }})"
      description: "JVM heap memory usage is above 85% for 5 minutes\n  VALUE = {{ $value }}%"
  
  - alert: LongGCPause
    expr: rate(jvm_gc_collection_seconds_sum[1m]) > 0.5
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Long garbage collection pauses (instance {{ $labels.instance }})"
      description: "GC pause time is taking more than 0.5s per minute\n  VALUE = {{ $value }}s"
```
    </div>
    
    <div class="tab-content hidden" id="datadog-jvm">
```json
{
  "title": "JVM Overview",
  "description": "Dashboard for monitoring JVM metrics",
  "widgets": [
    {
      "id": 123456,
      "definition": {
        "type": "timeseries",
        "requests": [
          {
            "q": "avg:jvm.heap_memory{*} by {host}",
            "display_type": "line"
          },
          {
            "q": "avg:jvm.heap_memory_max{*} by {host}",
            "display_type": "line"
          }
        ],
        "title": "JVM Heap Memory",
        "show_legend": true
      }
    }
  ],
  "template_variables": [],
  "layout_type": "ordered",
  "notify_list": []
}
```
    </div>
</div>

### Garbage Collection Performance

This specialized dashboard focuses on garbage collection performance, helping you identify GC-related performance issues.

![GC Dashboard Preview](../assets/images/gc-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>GC Collection Counts</li>
            <li>GC Collection Times</li>
            <li>Memory Pool Sizes Before/After GC</li>
            <li>Allocation Rates</li>
            <li>Promotion Rates</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="gc-performance">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="prometheus" data-dashboard="gc-performance">
            <img src="../assets/images/prometheus-logo.svg" alt="Prometheus">
            <span>Prometheus</span>
        </a>
    </div>
</div>

## Application Metrics Dashboards {: #application-dashboards}

### Spring Boot Application Dashboard

A comprehensive dashboard for monitoring Spring Boot applications, including HTTP metrics, caches, and system resources.

![Spring Boot Dashboard Preview](../assets/images/spring-boot-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Request Rate, Errors, Duration (RED)</li>
            <li>Endpoint Latency Distribution</li>
            <li>System Resources (CPU, Memory)</li>
            <li>Tomcat Thread Pool Usage</li>
            <li>Cache Hit Rates</li>
            <li>Client HTTP Requests</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="spring-boot">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="datadog" data-dashboard="spring-boot">
            <img src="../assets/images/datadog-logo.svg" alt="Datadog">
            <span>Datadog</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="newrelic" data-dashboard="spring-boot">
            <img src="../assets/images/newrelic-logo.svg" alt="New Relic">
            <span>New Relic</span>
        </a>
    </div>
</div>

### Java API Performance Dashboard

A dashboard focused on API performance for Java applications, with detailed endpoint metrics and SLA tracking.

![API Dashboard Preview](../assets/images/api-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Endpoint Response Times (P50, P90, P99)</li>
            <li>Request Throughput by Endpoint</li>
            <li>Error Rates and Status Codes</li>
            <li>SLA Compliance</li>
            <li>Active Sessions</li>
            <li>Rate Limiting Metrics</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="java-api">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="datadog" data-dashboard="java-api">
            <img src="../assets/images/datadog-logo.svg" alt="Datadog">
            <span>Datadog</span>
        </a>
    </div>
</div>

## Database Dashboards {: #database-dashboards}

### JDBC Connection Pool Dashboard

Monitor database connection pools in Java applications to optimize resource usage and identify connection leaks.

![JDBC Dashboard Preview](../assets/images/jdbc-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Active/Idle Connections</li>
            <li>Connection Acquisition Time</li>
            <li>Pool Saturation</li>
            <li>Connection Timeouts</li>
            <li>Query Execution Time</li>
            <li>Transaction Duration</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="jdbc-pool">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="prometheus" data-dashboard="jdbc-pool">
            <img src="../assets/images/prometheus-logo.svg" alt="Prometheus">
            <span>Prometheus</span>
        </a>
    </div>
</div>

### Hibernate ORM Dashboard

Monitor Hibernate ORM performance metrics to optimize database interaction in Java applications.

![Hibernate Dashboard Preview](../assets/images/hibernate-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Session Metrics</li>
            <li>Entity Cache Hit Rates</li>
            <li>Query Cache Performance</li>
            <li>Transaction Metrics</li>
            <li>Statement Execution Count</li>
            <li>2nd Level Cache Statistics</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="hibernate">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
    </div>
</div>

## Microservices Dashboards {: #microservices-dashboards}

### Microservices Overview Dashboard

A comprehensive view of microservices health and interactions in a Java microservices architecture.

![Microservices Dashboard Preview](../assets/images/microservices-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Service Health Status</li>
            <li>Inter-service Communication</li>
            <li>Error Rates by Service</li>
            <li>Latency Between Services</li>
            <li>Circuit Breaker States</li>
            <li>Request Tracing</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="microservices-overview">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
        <a href="#" class="dashboard-download-btn" data-format="datadog" data-dashboard="microservices-overview">
            <img src="../assets/images/datadog-logo.svg" alt="Datadog">
            <span>Datadog</span>
        </a>
    </div>
</div>

### Circuit Breaker Dashboard

Monitor circuit breakers in Java microservices using libraries like Resilience4j or Hystrix.

![Circuit Breaker Dashboard Preview](../assets/images/circuit-breaker-dashboard-preview.png)

<div class="dashboard-details">
    <div class="dashboard-info">
        <h4>Metrics Included</h4>
        <ul>
            <li>Circuit State (Open/Closed/Half-Open)</li>
            <li>Success/Failure Rates</li>
            <li>Slow Call Percentage</li>
            <li>Request Volume</li>
            <li>Circuit Transitions</li>
            <li>Failure Rate Threshold</li>
        </ul>
    </div>
    
    <div class="dashboard-download">
        <h4>Available For</h4>
        <a href="#" class="dashboard-download-btn" data-format="grafana" data-dashboard="circuit-breaker">
            <img src="../assets/images/grafana-logo.svg" alt="Grafana">
            <span>Grafana</span>
        </a>
    </div>
</div>

## Custom Dashboard Generator

Use our dashboard generator to create custom monitoring dashboards tailored to your Java application's needs.

<div class="dashboard-generator">
    <h3>Dashboard Generator</h3>
    
    <form id="dashboard-generator-form">
        <div class="form-group">
            <label for="dashboard-name">Dashboard Name:</label>
            <input type="text" id="dashboard-name" placeholder="My Java Application Dashboard">
        </div>
        
        <div class="form-group">
            <label for="platform">Monitoring Platform:</label>
            <select id="platform">
                <option value="grafana">Grafana</option>
                <option value="prometheus">Prometheus</option>
                <option value="datadog">Datadog</option>
                <option value="newrelic">New Relic</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Include Metric Categories:</label>
            <div class="checkbox-group">
                <input type="checkbox" id="jvm-metrics" checked>
                <label for="jvm-metrics">JVM Metrics</label>
                
                <input type="checkbox" id="app-metrics" checked>
                <label for="app-metrics">Application Metrics</label>
                
                <input type="checkbox" id="db-metrics">
                <label for="db-metrics">Database Metrics</label>
                
                <input type="checkbox" id="trace-metrics">
                <label for="trace-metrics">Distributed Tracing</label>
                
                <input type="checkbox" id="system-metrics" checked>
                <label for="system-metrics">System Metrics</label>
            </div>
        </div>
        
        <div class="form-group">
            <label for="framework">Application Framework:</label>
            <select id="framework">
                <option value="spring-boot">Spring Boot</option>
                <option value="quarkus">Quarkus</option>
                <option value="micronaut">Micronaut</option>
                <option value="jakarta-ee">Jakarta EE</option>
                <option value="generic">Generic Java</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="template-style">Dashboard Style:</label>
            <select id="template-style">
                <option value="detailed">Detailed (Many Panels)</option>
                <option value="concise">Concise (Key Metrics Only)</option>
                <option value="alerting">Alert-Focused</option>
            </select>
        </div>
        
        <button type="submit" class="md-button md-button--primary">Generate Dashboard</button>
    </form>
    
    <div id="generated-dashboard" class="hidden">
        <h3>Your Custom Dashboard</h3>
        <div class="dashboard-preview">
            <img src="" alt="Dashboard Preview" id="dashboard-preview-img">
        </div>
        <div class="dashboard-json">
            <pre><code class="json"></code></pre>
        </div>
        <button id="download-dashboard" class="md-button">Download Dashboard</button>
    </div>
</div>

## Setting Up Alert Rules

Each dashboard template includes recommended alert rules to help you proactively monitor your Java applications.

<div class="alert-rules">
    <h3>Common Alert Rules for Java Applications</h3>
    
    <div class="rule-card">
        <h4>High JVM Heap Usage</h4>
        <p>Alerts when heap memory usage exceeds 85% for 5 minutes.</p>
        <div class="rule-details">
            <p><strong>Severity:</strong> Warning</p>
            <p><strong>Resolution:</strong> Check for memory leaks, increase heap size, or optimize application memory usage.</p>
        </div>
    </div>
    
    <div class="rule-card">
        <h4>High GC Pause Time</h4>
        <p>Alerts when garbage collection pause time exceeds 500ms per minute.</p>
        <div class="rule-details">
            <p><strong>Severity:</strong> Warning</p>
            <p><strong>Resolution:</strong> Tune GC parameters, investigate memory usage patterns, or consider GC algorithm change.</p>
        </div>
    </div>
    
    <div class="rule-card">
        <h4>High Error Rate</h4>
        <p>Alerts when HTTP error rate (5xx responses) exceeds 5% over 3 minutes.</p>
        <div class="rule-details">
            <p><strong>Severity:</strong> Critical</p>
            <p><strong>Resolution:</strong> Check application logs, review recent deployments, or verify downstream service health.</p>
        </div>
    </div>
    
    <div class="rule-card">
        <h4>Slow Response Time</h4>
        <p>Alerts when 95th percentile response time exceeds defined SLA (e.g., 500ms) for 5 minutes.</p>
        <div class="rule-details">
            <p><strong>Severity:</strong> Warning</p>
            <p><strong>Resolution:</strong> Profile application, check database queries, or verify system resources.</p>
        </div>
    </div>
</div>

## Dashboard Customization Tips

Here are some best practices for customizing these dashboard templates for your specific needs:

1. **Focus on Critical Metrics**: Start with key metrics that impact your users and business, then add more detailed panels as needed.

2. **Group Related Metrics**: Organize your dashboard into logical sections (JVM, application, database, etc.) for easier navigation.

3. **Use Consistent Naming**: Maintain consistent metric naming and labeling conventions across all dashboards.

4. **Add Context**: Include documentation links, runbooks, or description text to help users understand each panel.

5. **Set Appropriate Time Ranges**: Configure default time ranges that make sense for your metrics (e.g., 6 hours for application metrics, 24 hours for system metrics).

6. **Configure Alerting Thresholds**: Set alert thresholds based on your specific application's normal behavior and SLAs.

7. **Use Variables**: Leverage dashboard variables for environment, service, or instance selection to make dashboards reusable.

8. **Regular Review**: Schedule regular reviews of your dashboards to ensure they remain relevant as your application evolves.

## Implementation Notes

To use these dashboard templates, you'll need to:

1. **Instrument Your Application**: Ensure your Java application is properly instrumented to expose metrics:
   - For Spring Boot, add the Micrometer and Actuator dependencies
   - For other frameworks, use the appropriate instrumentation libraries

2. **Set Up Metric Collection**: Configure your monitoring system to collect metrics from your application:
   - For Prometheus, configure scraping endpoints
   - For Datadog, install and configure the agent
   - For other systems, follow their specific setup instructions

3. **Import Dashboard**: Import the dashboard template into your monitoring system:
   - For Grafana, use the Import Dashboard feature and paste the JSON
   - For other systems, follow their dashboard import procedure

4. **Customize**: Adjust the dashboard to match your specific metrics, naming conventions, and requirements

## JavaScript Implementation Note

The dashboard download and preview functionality requires JavaScript:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard template selector
    document.querySelectorAll('.dashboard-download-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const format = this.dataset.format;
            const dashboard = this.dataset.dashboard;
            downloadDashboard(format, dashboard);
        });
    });
    
    // Tab switcher for code snippets
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Get the tab ID
            const tabId = this.dataset.tab;
            
            // Remove active class from all buttons and hide all content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked button and show corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
    
    // Dashboard generator
    document.getElementById('dashboard-generator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        generateCustomDashboard();
    });
});

function downloadDashboard(format, dashboard) {
    // In a real implementation, this would fetch and download the dashboard template
    console.log(`Downloading ${dashboard} dashboard for ${format}`);
    
    // For demonstration purposes, we'll just show an alert
    alert(`Dashboard ${dashboard} would now download in ${format} format`);
}

function generateCustomDashboard() {
    // Get form values
    const name = document.getElementById('dashboard-name').value;
    const platform = document.getElementById('platform').value;
    const framework = document.getElementById('framework').value;
    const style = document.getElementById('template-style').value;
    
    // For demonstration purposes, just show the result area with placeholder
    document.getElementById('generated-dashboard').classList.remove('hidden');
    document.querySelector('#generated-dashboard code').textContent = 
        `Generated ${style} dashboard for ${framework} on ${platform} named "${name}"`;
    
    // In a real implementation, this would generate an actual dashboard configuration
}
``` 