# Chaos Engineering

## Overview
This guide explores chaos engineering principles and practices for Java applications. Chaos engineering is the discipline of experimenting on a system to build confidence in its capability to withstand turbulent conditions in production. We'll cover how to implement chaos experiments specifically for Java applications, microservices, and cloud-native architectures.

## Prerequisites
- Understanding of [monitoring and logging](monitoring-logging.md)
- Familiarity with [Java deployment strategies](java-deployment-strategies.md)
- Basic knowledge of containerization and Kubernetes
- Experience with Spring Boot or Java EE applications

## Learning Objectives
- Understand chaos engineering principles and benefits
- Design and execute controlled chaos experiments for Java applications
- Implement chaos engineering tools in Java environments
- Monitor and analyze system behavior during chaos experiments
- Apply chaos engineering to microservices architectures
- Create a chaos engineering culture in development teams

## Chaos Engineering Fundamentals

### What is Chaos Engineering?

Chaos engineering is the practice of deliberately introducing controlled failure into a system to test its resilience and identify weaknesses before they cause real outages.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Chaos Engineering Process                        │
└─────────────────────────────────────────────────────────────────────┘
       │                │                  │                 │
       ▼                ▼                  ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  ┌─────────────┐
│ Define      │  │ Hypothesize │  │ Run Controlled  │  │ Analyze     │
│ Steady State│  │ about Chaos │  │ Experiments     │  │ Results     │
└─────────────┘  └─────────────┘  └─────────────────┘  └─────────────┘
```

### Core Principles

1. **Start in a Known State**: Define what normal system behavior looks like before introducing chaos.
2. **Hypothesize about Outcomes**: Form a hypothesis about how the system will respond to a specific failure.
3. **Introduce Controlled Experiments**: Simulate real-world failures in a controlled environment.
4. **Minimize Blast Radius**: Start small and gradually increase the scope of experiments.
5. **Run Experiments in Production**: Eventually, test in production environments to uncover real issues.

### Benefits for Java Applications

- **Increased Resilience**: Identify and fix weaknesses before they cause production incidents
- **Improved Recovery**: Test and optimize recovery mechanisms
- **Reduced MTTR**: Decrease mean time to recovery when failures occur
- **System Understanding**: Develop deeper knowledge of system behavior under stress
- **Confidence in System**: Build confidence in the ability to handle unexpected failures

## Designing Chaos Experiments for Java Applications

### Experiment Structure

A well-designed chaos experiment follows this structure:

1. **Define Steady State**: Determine what "normal" behavior looks like (response times, throughput, etc.)
2. **Create a Hypothesis**: Form a hypothesis about how the system will behave under specific conditions
3. **Introduce Variables**: Inject failure or unusual conditions
4. **Observe Results**: Monitor system behavior during the experiment
5. **Analyze Outcome**: Compare results against the hypothesis and baseline
6. **Remediate Issues**: Fix any weaknesses identified
7. **Iterate**: Refine and repeat experiments

### Common Chaos Scenarios for Java Applications

1. **Resource Exhaustion**:
   - Memory leaks and heap exhaustion
   - Thread pool saturation
   - Connection pool depletion
   - CPU spikes
   - Disk space filling up

2. **Network Failures**:
   - Service dependency failures
   - Network latency and packet loss
   - DNS resolution failures
   - Load balancer failures

3. **State Mutations**:
   - Database corruption
   - Inconsistent cache states
   - Stale configuration
   - Corrupted messages in queues

4. **Time and Clock Issues**:
   - Clock skew between services
   - Leap second bugs
   - Timezone handling issues

## Chaos Engineering Tools for Java

### Chaos Monkey for Spring Boot

Chaos Monkey for Spring Boot (CM4SB) is an implementation of the Chaos Monkey pattern for Spring Boot applications.

#### Installation

Add the dependency to your Maven `pom.xml`:

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>chaos-monkey-spring-boot</artifactId>
    <version>2.6.1</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### Configuration

Enable Chaos Monkey in your `application.yml`:

```yaml
chaos:
  monkey:
    enabled: true
    watcher:
      component: false
      controller: true
      repository: true
      rest-controller: true
      service: true
    assaults:
      level: 3
      latencyActive: true
      latencyRangeStart: 1000
      latencyRangeEnd: 3000
      exceptionsActive: false
      killApplicationActive: false
      memoryActive: false

management:
  endpoint:
    chaosmonkey:
      enabled: true
  endpoints:
    web:
      exposure:
        include: health,info,chaosmonkey
```

#### Using Chaos Monkey at Runtime

Activate specific assaults via the REST API:

```bash
# Enable latency assault
curl -X POST \
  http://localhost:8080/actuator/chaosmonkey/assaults \
  -H 'Content-Type: application/json' \
  -d '{
    "latencyActive": true,
    "latencyRangeStart": 2000,
    "latencyRangeEnd": 5000,
    "level": 3
}'

# Enable exception assault
curl -X POST \
  http://localhost:8080/actuator/chaosmonkey/assaults \
  -H 'Content-Type: application/json' \
  -d '{
    "exceptionsActive": true,
    "exception": {
        "type": "java.io.IOException",
        "message": "Chaos Monkey - RuntimeException"
    },
    "level": 1
}'
```

### Chaos Toolkit

Chaos Toolkit is a general-purpose chaos engineering tool that can be used with Java applications.

#### Installation

```bash
pip install chaostoolkit
pip install chaostoolkit-spring
```

#### Creating an Experiment

Define your experiment in JSON format:

```json
{
    "version": "1.0.0",
    "title": "Spring Boot Service Resilience",
    "description": "Test the resilience of a Spring Boot service when its dependencies fail",
    "tags": ["spring", "java", "resilience"],
    "steady-state-hypothesis": {
        "title": "Services are all available and healthy",
        "probes": [
            {
                "type": "probe",
                "name": "service-health",
                "tolerance": true,
                "provider": {
                    "type": "http",
                    "url": "http://localhost:8080/actuator/health",
                    "timeout": 3
                }
            }
        ]
    },
    "method": [
        {
            "type": "action",
            "name": "terminate-dependency",
            "provider": {
                "type": "process",
                "path": "docker",
                "arguments": ["stop", "dependency-service"]
            },
            "pauses": {
                "after": 5
            }
        }
    ],
    "rollbacks": [
        {
            "type": "action",
            "name": "restart-dependency",
            "provider": {
                "type": "process",
                "path": "docker",
                "arguments": ["start", "dependency-service"]
            }
        }
    ]
}
```

#### Running an Experiment

```bash
chaos run experiment.json
```

### Litmus Chaos

Litmus is a chaos engineering platform for Kubernetes, suitable for orchestrating chaos experiments on Java applications deployed to Kubernetes.

#### Installation

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/litmus-operator-v1.13.0.yaml
```

#### Pod Chaos Experiment

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: spring-app-chaos
  namespace: default
spec:
  appinfo:
    appns: 'default'
    applabel: 'app=spring-app'
    appkind: 'deployment'
  chaosServiceAccount: litmus-admin
  monitoring: true
  jobCleanUpPolicy: 'delete'
  annotationCheck: 'false'
  engineState: 'active'
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: '30'
            - name: CHAOS_INTERVAL
              value: '10'
            - name: FORCE
              value: 'true'
```

## Java-Specific Chaos Techniques

### JVM Chaos

1. **Memory Exhaustion**:
   ```java
   @Component
   public class MemoryChaos {
       private final List<byte[]> leakyList = new ArrayList<>();
       
       @Scheduled(fixedRate = 1000)
       public void consumeMemory() {
           if (ChaosToggle.isActive("memory-leak")) {
               // Each array is 1MB
               leakyList.add(new byte[1024 * 1024]);
               log.info("Current memory waste: {}MB", leakyList.size());
           }
       }
   }
   ```

2. **Thread Pool Saturation**:
   ```java
   @Component
   public class ThreadChaos {
       @Autowired
       private ThreadPoolTaskExecutor executor;
       
       public void saturateThreadPool() {
           if (ChaosToggle.isActive("thread-saturation")) {
               int threadCount = executor.getMaxPoolSize();
               for (int i = 0; i < threadCount; i++) {
                   executor.execute(() -> {
                       try {
                           // Block a thread for a long time
                           Thread.sleep(300000);
                       } catch (InterruptedException e) {
                           Thread.currentThread().interrupt();
                       }
                   });
               }
           }
       }
   }
   ```

3. **CPU Spike Generation**:
   ```java
   @Component
   public class CpuChaos {
       private volatile boolean active = false;
       
       @PostConstruct
       public void init() {
           new Thread(this::consumeCpu).start();
       }
       
       public void enableChaos() {
           active = true;
       }
       
       public void disableChaos() {
           active = false;
       }
       
       private void consumeCpu() {
           while (true) {
               if (active) {
                   // Busy loop to consume CPU
                   for (int i = 0; i < 1000000; i++) {
                       Math.sin(Math.random());
                   }
               } else {
                   try {
                       Thread.sleep(100);
                   } catch (InterruptedException e) {
                       Thread.currentThread().interrupt();
                   }
               }
           }
       }
   }
   ```

### Database Chaos

1. **Connection Pool Exhaustion**:
   ```java
   @Component
   public class DbConnectionChaos {
       @Autowired
       private DataSource dataSource;
       
       private final List<Connection> heldConnections = new ArrayList<>();
       
       public void exhaustConnectionPool() throws SQLException {
           if (ChaosToggle.isActive("db-connection-leak")) {
               // Get the connection pool size
               int maxConnections = 20; // Example value, actual value depends on your configuration
               
               // Hold connections without releasing
               for (int i = 0; i < maxConnections; i++) {
                   try {
                       Connection conn = dataSource.getConnection();
                       heldConnections.add(conn);
                       log.info("Holding connection {}", i);
                   } catch (SQLException e) {
                       log.info("Connection pool exhausted after {} connections", i);
                       break;
                   }
               }
           }
       }
       
       public void releaseConnections() {
           for (Connection conn : heldConnections) {
               try {
                   conn.close();
               } catch (SQLException e) {
                   log.error("Error closing connection", e);
               }
           }
           heldConnections.clear();
       }
   }
   ```

2. **Slow Query Simulation**:
   ```sql
   -- PostgreSQL slow query
   CREATE OR REPLACE FUNCTION chaos_slow_query()
   RETURNS void AS $$
   BEGIN
     IF (SELECT value FROM chaos_toggles WHERE key = 'slow-query') THEN
       PERFORM pg_sleep(3);
     END IF;
   END;
   $$ LANGUAGE plpgsql;

   -- Then use it in your queries
   SELECT chaos_slow_query(), * FROM users WHERE id = ?;
   ```

### External Dependency Chaos

1. **Failing External Service Calls**:
   ```java
   @Component
   public class RestTemplateChaosInterceptor implements ClientHttpRequestInterceptor {
       @Override
       public ClientHttpResponse intercept(HttpRequest request, byte[] body, 
                                          ClientHttpRequestExecution execution) throws IOException {
           if (ChaosToggle.isActive("external-service-failure")) {
               String host = request.getURI().getHost();
               if (host.equals("external-api.example.com")) {
                   // Simulate a service failure
                   return new MockClientHttpResponse(
                       "Service unavailable".getBytes(),
                       HttpStatus.SERVICE_UNAVAILABLE
                   );
               }
           }
           
           if (ChaosToggle.isActive("external-service-latency")) {
               try {
                   // Introduce artificial latency
                   Thread.sleep(3000);
               } catch (InterruptedException e) {
                   Thread.currentThread().interrupt();
               }
           }
           
           return execution.execute(request, body);
       }
   }
   ```

2. **Feign Client Chaos**:
   ```java
   @Configuration
   public class FeignChaosFallbackFactory {
       @Bean
       public FallbackFactory<UserServiceClient> userServiceFallbackFactory() {
           return throwable -> new UserServiceClient() {
               @Override
               public User getUserById(Long id) {
                   if (ChaosToggle.isActive("user-service-failure")) {
                       throw new RuntimeException("Chaos-induced failure");
                   }
                   // Normal fallback behavior
                   return new User(id, "Fallback User", "fallback@example.com");
               }
           };
       }
   }
   ```

## Monitoring During Chaos Experiments

### Key Metrics to Monitor

During chaos experiments, monitor these key Java-specific metrics:

1. **JVM Metrics**:
   - Heap memory usage (used, committed, max)
   - Garbage collection frequency and duration
   - Thread count and states
   - Class loading

2. **Application Metrics**:
   - Response times (average, p95, p99)
   - Error rates
   - Request throughput
   - Request success rate

3. **Resource Metrics**:
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O

4. **Business Metrics**:
   - Transaction success rate
   - Order completion rate
   - User session duration
   - Conversion rates

### Setting Up Prometheus and Grafana

Add Micrometer to your Spring Boot application:

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

Configure metrics in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,prometheus,metrics
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
```

### Creating a Chaos Dashboard

Sample Grafana dashboard configuration for monitoring during chaos experiments:

```json
{
  "annotations": {
    "list": [
      {
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      },
      {
        "datasource": "Prometheus",
        "enable": true,
        "expr": "chaos_experiment_state{state=\"started\"}",
        "iconColor": "rgba(255, 96, 96, 1)",
        "name": "Chaos Experiments Started",
        "titleFormat": "Chaos Started: {{description}}",
        "tagKeys": "experiment"
      },
      {
        "datasource": "Prometheus",
        "enable": true,
        "expr": "chaos_experiment_state{state=\"finished\"}",
        "iconColor": "rgba(0, 200, 0, 1)",
        "name": "Chaos Experiments Finished",
        "titleFormat": "Chaos Ended: {{description}}",
        "tagKeys": "experiment"
      }
    ]
  },
  "panels": [
    {
      "title": "JVM Memory Usage",
      "type": "graph",
      "targets": [
        {
          "expr": "sum(jvm_memory_used_bytes{area=\"heap\"})",
          "legendFormat": "Heap Used"
        },
        {
          "expr": "sum(jvm_memory_committed_bytes{area=\"heap\"})",
          "legendFormat": "Heap Committed"
        }
      ]
    },
    {
      "title": "HTTP Response Time (95th percentile)",
      "type": "graph",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[1m])) by (le))",
          "legendFormat": "P95 Response Time"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "sum(rate(http_server_requests_seconds_count{status=~\"5..\"}[1m])) / sum(rate(http_server_requests_seconds_count[1m])) * 100",
          "legendFormat": "Error Rate %"
        }
      ]
    },
    {
      "title": "Thread States",
      "type": "graph",
      "targets": [
        {
          "expr": "jvm_threads_states_threads{state=\"runnable\"}",
          "legendFormat": "Runnable"
        },
        {
          "expr": "jvm_threads_states_threads{state=\"blocked\"}",
          "legendFormat": "Blocked"
        },
        {
          "expr": "jvm_threads_states_threads{state=\"waiting\"}",
          "legendFormat": "Waiting"
        }
      ]
    }
  ]
}
```

## Chaos Engineering for Java Microservices

### Service Mesh Chaos

Using Istio to introduce network chaos:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: payment-service-chaos
spec:
  hosts:
  - payment-service
  http:
  - fault:
      abort:
        percentage:
          value: 25
        httpStatus: 500
    route:
    - destination:
        host: payment-service
```

Introducing latency with Istio:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: order-service-chaos
spec:
  hosts:
  - order-service
  http:
  - fault:
      delay:
        percentage:
          value: 50
        fixedDelay: 3s
    route:
    - destination:
        host: order-service
```

### Testing Resilience Patterns

1. **Circuit Breaker Testing**:
   
   Monitor circuit breaker state during failure injection:
   
   ```java
   @RestController
   public class CircuitBreakerMetricsController {
       @Autowired
       private CircuitBreakerRegistry circuitBreakerRegistry;
       
       @GetMapping("/actuator/circuitbreakers")
       public Map<String, Map<String, Object>> getCircuitBreakerStatus() {
           Map<String, Map<String, Object>> result = new HashMap<>();
           
           circuitBreakerRegistry.getAllCircuitBreakers().forEach(cb -> {
               Map<String, Object> details = new HashMap<>();
               CircuitBreaker.State state = cb.getState();
               CircuitBreaker.Metrics metrics = cb.getMetrics();
               
               details.put("state", state.toString());
               details.put("failureRate", metrics.getFailureRate());
               details.put("slowCallRate", metrics.getSlowCallRate());
               details.put("numberOfFailedCalls", metrics.getNumberOfFailedCalls());
               details.put("numberOfSlowCalls", metrics.getNumberOfSlowCalls());
               details.put("numberOfSuccessfulCalls", metrics.getNumberOfSuccessfulCalls());
               
               result.put(cb.getName(), details);
           });
           
           return result;
       }
   }
   ```

2. **Bulkhead Pattern Testing**:
   
   Create a chaos experiment to verify that failures in one service don't affect others:
   
   ```java
   @Service
   public class BulkheadChaosService {
       @Autowired
       private ThreadPoolBulkhead orderThreadPoolBulkhead;
       
       public void saturateBulkhead() {
           if (ChaosToggle.isActive("bulkhead-saturation")) {
               // Submit many tasks to saturate the bulkhead
               for (int i = 0; i < 1000; i++) {
                   try {
                       orderThreadPoolBulkhead.submit(() -> {
                           try {
                               // Task that takes a long time
                               Thread.sleep(60000);
                               return "Task completed";
                           } catch (InterruptedException e) {
                               Thread.currentThread().interrupt();
                               return "Task interrupted";
                           }
                       });
                   } catch (Exception e) {
                       log.info("Bulkhead rejected task: {}", e.getMessage());
                   }
               }
           }
       }
   }
   ```

3. **Retry Pattern Testing**:
   
   Verify retry behavior with intermittent failures:
   
   ```java
   @Configuration
   public class RetryableChaosConfig {
       @Bean
       public RetryRegistry retryRegistry() {
           return RetryRegistry.of(RetryConfig.custom()
               .maxAttempts(3)
               .waitDuration(Duration.ofMillis(500))
               .build());
       }
       
       @Bean
       public Retry chaosRetry(RetryRegistry retryRegistry) {
           return retryRegistry.retry("chaosRetry", RetryConfig.custom()
               .maxAttempts(5)
               .waitDuration(Duration.ofMillis(200))
               .build());
       }
   }
   
   @Service
   public class RetryableChaosService {
       @Autowired
       private Retry chaosRetry;
       
       public String performWithRetry() {
           return Retry.decorateSupplier(chaosRetry, () -> {
               if (ChaosToggle.isActive("intermittent-failure") && 
                   Math.random() < 0.7) { // 70% failure rate
                   throw new RuntimeException("Chaos-induced failure");
               }
               return "Operation successful";
           }).get();
       }
   }
   ```

## Building a Chaos Engineering Culture

### Getting Started with Chaos Engineering

1. **Start Small**:
   - Begin with non-production environments
   - Focus on individual components
   - Run experiments during off-peak hours
   - Limit the "blast radius" of experiments

2. **Define Clear Objectives**:
   - Identify specific resilience goals
   - Align chaos experiments with business priorities
   - Focus on critical paths in your application

3. **Build a Gameday Culture**:
   - Schedule regular chaos engineering sessions
   - Involve cross-functional teams
   - Document findings and action items
   - Celebrate learning and improvements

### Chaos Engineering Maturity Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                 Chaos Engineering Maturity Levels                    │
└─────────────────────────────────────────────────────────────────────┘
    │                 │                   │                  │
    ▼                 ▼                   ▼                  ▼
┌──────────┐    ┌──────────┐       ┌──────────┐       ┌──────────┐
│ Level 1  │    │ Level 2  │       │ Level 3  │       │ Level 4  │
│          │    │          │       │          │       │          │
│ Manual   │    │ Automated│       │ CI/CD    │       │ Production│
│ Chaos    │    │ Chaos    │       │ Integrated│      │ Chaos    │
└──────────┘    └──────────┘       └──────────┘       └──────────┘
```

1. **Level 1: Manual Chaos**
   - Ad-hoc experiments
   - Manual failure injection
   - Limited scope

2. **Level 2: Automated Chaos**
   - Reproducible experiments
   - Scheduled chaos experiments
   - Broader test coverage

3. **Level 3: CI/CD Integration**
   - Chaos tests in CI/CD pipeline
   - Automated verification of results
   - Chaos as a quality gate

4. **Level 4: Production Chaos**
   - Regular production experiments
   - Continuous verification
   - Comprehensive resilience testing

### Establishing a Chaos Engineering Program

1. **Create a Chaos Engineering Team**:
   - Identify champions across teams
   - Allocate dedicated time for chaos engineering
   - Provide training and resources

2. **Define Chaos Principles**:
   - Document your approach to chaos engineering
   - Set boundaries and safety measures
   - Establish communication protocols

3. **Build a Chaos Engineering Backlog**:
   - Prioritize experiments based on risk
   - Target known weak points
   - Track progress and results

4. **Measure and Communicate Success**:
   - Track improvements in system resilience
   - Share learnings across teams
   - Demonstrate business value

## Conclusion

Chaos engineering is a powerful approach to building more resilient Java applications by proactively identifying weaknesses through controlled experiments. By deliberately introducing failures in a controlled manner, you can verify that your system can withstand turbulent conditions and recover gracefully.

For Java applications, especially those using microservices architectures, chaos engineering helps verify that resilience patterns like circuit breakers, bulkheads, and retries work as expected under real-world failure conditions. By establishing a chaos engineering practice in your organization, you can build more reliable systems that better serve your users even when things go wrong.

## References

- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Chaos Monkey for Spring Boot](https://codecentric.github.io/chaos-monkey-spring-boot/)
- [Chaos Toolkit Documentation](https://chaostoolkit.org/reference/usage/run/)
- [LitmusChaos Documentation](https://docs.litmuschaos.io/)
- [Resilience4j Documentation](https://resilience4j.readme.io/)
- [Istio Fault Injection](https://istio.io/latest/docs/tasks/traffic-management/fault-injection/)
- [Site Reliability Engineering: How Google Runs Production Systems](https://sre.google/sre-book/testing-reliability/)
- [Chaos Engineering: System Resiliency in Practice](https://www.oreilly.com/library/view/chaos-engineering/9781492043867/) 