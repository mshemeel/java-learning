# Java Deployment Strategies

## Overview
This guide covers modern deployment strategies specifically for Java applications. Proper deployment strategies can significantly reduce downtime, minimize deployment risks, and improve the reliability of your Java applications. We'll explore different deployment approaches from simple deployments to advanced strategies like canary and blue-green deployments.

## Prerequisites
- Understanding of [CI/CD fundamentals](ci-cd-fundamentals.md)
- Familiarity with Java application packaging (JAR, WAR, etc.)
- Basic knowledge of container concepts
- Understanding of basic deployment concepts

## Learning Objectives
- Understand different deployment strategies for Java applications
- Implement zero-downtime deployments for Java applications
- Configure blue-green deployments for Java services
- Implement canary deployments for Java microservices
- Set up proper rollback mechanisms
- Integrate deployment strategies with CI/CD pipelines
- Monitor deployments for successful outcomes

## Traditional Java Deployment vs. Modern Approaches

### Traditional Deployment
Traditional Java deployment methods typically involve:

1. Taking the application offline
2. Deploying the new version (WAR/EAR to an application server)
3. Restarting the server or application
4. Bringing the application back online

This approach results in downtime and can be risky if the new version has issues.

### Modern Deployment Strategies
Modern approaches focus on:

- Minimizing or eliminating downtime
- Reducing deployment risk through gradual rollouts
- Enabling quick rollbacks if issues are detected
- Automating deployment processes
- Providing better monitoring and validation

## Deployment Strategy Overview

```
┌───────────────────────────────────────────────────────────┐
│              Java Deployment Strategies                    │
└───────────────────────────────────────────────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Rolling Update │ │   Blue-Green    │ │     Canary      │
│                 │ │                 │ │                 │
│ • Update one    │ │ • Maintain two  │ │ • Route small % │
│   instance at   │ │   identical     │ │   of traffic to │
│   a time        │ │ • Switch traffic│ │   new version   │
│ • Gradual       │ │   all at once   │ │ • Gradually     │
│   transition    │ │   all at once   │ │   increase %    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
                  ┌───────────────────────┐
                  │  Support Strategies   │
                  │                       │
                  │ • Feature Toggles     │
                  │ • A/B Testing         │
                  │ • Shadow Deployments  │
                  └───────────────────────┘
```

## Rolling Update Deployment

### Overview
Rolling updates involve gradually replacing instances of the old version with new ones. This strategy works well for applications deployed across multiple servers or containers.

### Implementation for Java Applications

#### Using Kubernetes for Rolling Updates

```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-application
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # How many pods can be created above desired number
      maxUnavailable: 1  # How many pods can be unavailable during update
  selector:
    matchLabels:
      app: java-application
  template:
    metadata:
      labels:
        app: java-application
    spec:
      containers:
      - name: java-application
        image: registry/java-application:1.2.3
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
```

Apply the deployment:
```bash
kubectl apply -f kubernetes-deployment.yaml
```

Update the image:
```bash
kubectl set image deployment/java-application java-application=registry/java-application:1.2.4
```

#### Spring Boot with Multiple Instances

For Spring Boot applications without Kubernetes:

1. Set up a load balancer (like NGINX or HAProxy) in front of multiple instances
2. Deploy and verify the new version on one instance
3. Once healthy, proceed with other instances one by one

```bash
# Example script for rolling update across multiple servers
for server in app-server-1 app-server-2 app-server-3 app-server-4; do
  echo "Updating $server..."
  # Take server out of load balancer
  ssh lb-server "sed -i '/$server/s/^/#/' /etc/nginx/conf.d/lb.conf && nginx -s reload"
  
  # Deploy new version
  scp app.jar $server:/opt/application/
  ssh $server "systemctl restart java-application"
  
  # Wait for health check to pass
  until $(curl --output /dev/null --silent --head --fail http://$server:8080/actuator/health); do
    echo "Waiting for application to become healthy..."
    sleep 5
  done
  
  # Add server back to load balancer
  ssh lb-server "sed -i '/$server/s/^#//' /etc/nginx/conf.d/lb.conf && nginx -s reload"
  
  echo "$server updated successfully"
  sleep 10  # Wait before moving to next server
done
```

### Advantages
- Minimal to zero downtime
- Gradual rollout minimizes impact of bugs
- No need for additional infrastructure

### Disadvantages
- Updates can take longer to complete
- Database schema changes can be challenging
- No instant rollback capability

## Blue-Green Deployment

### Overview
Blue-Green deployment maintains two identical environments: one running the current version (Blue) and another for the new version (Green). After verifying the Green environment, traffic is switched from Blue to Green all at once.

### Implementation for Java Applications

#### Using AWS Elastic Beanstalk

AWS Elastic Beanstalk supports blue-green deployments for Java applications:

```bash
# Create a new environment for the green deployment
aws elasticbeanstalk create-environment \
  --application-name MyJavaApp \
  --environment-name MyJavaApp-green \
  --solution-stack-name "64bit Amazon Linux 2 v3.2.8 running Corretto 11" \
  --option-settings file://env-config.json

# Deploy the new version to the green environment
aws elasticbeanstalk update-environment \
  --environment-name MyJavaApp-green \
  --version-label v1.2.3

# Swap URLs after green environment is ready
aws elasticbeanstalk swap-environment-cnames \
  --source-environment-name MyJavaApp-blue \
  --destination-environment-name MyJavaApp-green
```

#### Using Spring Cloud with Eureka

For microservices with Spring Cloud:

1. Deploy the new version with a new service ID (`service-v2` alongside `service-v1`)
2. Register both versions with Eureka
3. Update the API Gateway to route to the new version
4. Decommission the old version after confirming stability

```java
// API Gateway route configuration
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        // Route to new version
        .route("service-route", r -> r.path("/api/service/**")
            .filters(f -> f.rewritePath("/api/service/(?<segment>.*)", "/${segment}"))
            .uri("lb://service-v2"))
        .build();
}
```

#### Using Docker and NGINX

```bash
# Build and start the new version
docker build -t myapp:v2 .
docker run -d --name myapp-green -p 8081:8080 myapp:v2

# Wait for the new version to start up and pass health checks
until $(curl --output /dev/null --silent --head --fail http://localhost:8081/actuator/health); do
  echo "Waiting for green deployment to become healthy..."
  sleep 5
done

# Update NGINX config to point to the new version
cat > /etc/nginx/conf.d/myapp.conf << EOF
upstream myapp {
  server localhost:8081;
}
EOF

# Reload NGINX
nginx -s reload

# Stop the old version after confirming stability
docker stop myapp-blue
docker rm myapp-blue
```

### Advantages
- Instant switch between versions
- Complete testing of new version before exposure to users
- Simple rollback by reverting to the previous environment
- No partial deployment state

### Disadvantages
- Requires twice the infrastructure
- Database schema changes require additional strategies
- Resource intensive

## Canary Deployment

### Overview
Canary deployment involves routing a small percentage of traffic to the new version initially, then gradually increasing the percentage as confidence in the new version grows.

### Implementation for Java Applications

#### Using Kubernetes with Istio

Istio makes it easy to implement canary deployments on Kubernetes:

```yaml
# Deploy both versions
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-app-v1
spec:
  replicas: 9
  selector:
    matchLabels:
      app: java-app
      version: v1
  template:
    metadata:
      labels:
        app: java-app
        version: v1
    spec:
      containers:
      - name: java-app
        image: registry/java-app:1.0.0
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: java-app-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: java-app
      version: v2
  template:
    metadata:
      labels:
        app: java-app
        version: v2
    spec:
      containers:
      - name: java-app
        image: registry/java-app:2.0.0
---
# Virtual service to control traffic split
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: java-app
spec:
  hosts:
  - java-app
  http:
  - route:
    - destination:
        host: java-app
        subset: v1
      weight: 90
    - destination:
        host: java-app
        subset: v2
      weight: 10
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: java-app
spec:
  host: java-app
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

To increase the canary percentage:

```bash
# Update the virtual service to increase traffic to v2
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: java-app
spec:
  hosts:
  - java-app
  http:
  - route:
    - destination:
        host: java-app
        subset: v1
      weight: 75
    - destination:
        host: java-app
        subset: v2
      weight: 25
EOF
```

#### Using Spring Cloud Gateway

With Spring Cloud Gateway, you can implement canary routing:

```java
@Configuration
public class CanaryConfig {
    
    @Bean
    public RouteLocator canaryRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("canary_route", r -> r.path("/api/**")
                .filters(f -> f.filter((exchange, chain) -> {
                    // Implement canary logic - route 10% of traffic to v2
                    if (Math.random() < 0.1) {
                        // Route to v2
                        ServerHttpRequest req = exchange.getRequest().mutate()
                            .header("X-Version", "v2")
                            .build();
                        return chain.filter(exchange.mutate().request(req).build());
                    }
                    // Route to v1
                    ServerHttpRequest req = exchange.getRequest().mutate()
                        .header("X-Version", "v1")
                        .build();
                    return chain.filter(exchange.mutate().request(req).build());
                }))
                .uri("lb://my-service"))
            .build();
    }
}
```

### Advantages
- Reduced risk by limiting potential impact of issues
- Real user testing with limited exposure
- Ability to monitor performance and errors before full rollout
- Easy rollback by routing all traffic back to the old version

### Disadvantages
- More complex to set up compared to other strategies
- Requires monitoring and traffic management capabilities
- Multiple versions running simultaneously can complicate debugging

## Feature Toggle Deployment

### Overview
Feature toggles allow you to deploy code to production but control its activation through configuration rather than deployment. This strategy works well with Java applications to enable or disable features at runtime.

### Implementation for Java Applications

#### Using a Feature Toggle Library

Spring Boot with Togglz:

```xml
<!-- Add Togglz dependency -->
<dependency>
    <groupId>org.togglz</groupId>
    <artifactId>togglz-spring-boot-starter</artifactId>
    <version>3.1.0</version>
</dependency>
<dependency>
    <groupId>org.togglz</groupId>
    <artifactId>togglz-console</artifactId>
    <version>3.1.0</version>
</dependency>
```

Configure feature flags:

```java
import org.togglz.core.Feature;
import org.togglz.core.annotation.EnabledByDefault;
import org.togglz.core.annotation.Label;

public enum Features implements Feature {
    
    @EnabledByDefault
    @Label("Old Payment Processing")
    OLD_PAYMENT_PROCESSING,
    
    @Label("New Payment Processing")
    NEW_PAYMENT_PROCESSING,
    
    @Label("Enhanced Reporting")
    ENHANCED_REPORTING
}
```

Use in code:

```java
@Service
public class PaymentService {
    
    @Autowired
    private FeatureManager featureManager;
    
    public void processPayment(Payment payment) {
        if (featureManager.isActive(Features.NEW_PAYMENT_PROCESSING)) {
            // New implementation
            processPaymentV2(payment);
        } else {
            // Old implementation
            processPaymentV1(payment);
        }
    }
    
    private void processPaymentV1(Payment payment) {
        // Old payment processing logic
    }
    
    private void processPaymentV2(Payment payment) {
        // New payment processing logic
    }
}
```

Configure togglz in application.properties:

```properties
# Togglz configuration
togglz.feature-enums=com.example.myapp.Features
togglz.console.enabled=true
togglz.console.path=/togglz-console
togglz.console.secured=true
togglz.console.use-management-port=false
```

### Advantages
- Decouples deployment from feature release
- Allows gradual rollout to specific users or groups
- Enables easy rollback by disabling problematic features
- Facilitates A/B testing

### Disadvantages
- Can lead to code complexity if overused
- Technical debt if toggles aren't removed after full rollout
- Requires additional testing for all toggle combinations

## Shadow Deployment

### Overview
Shadow deployment involves deploying the new version alongside the existing one, but sending production traffic to both versions while only using the response from the old version. This allows testing the new version with real traffic without affecting users.

### Implementation for Java Applications

#### Using Spring Cloud Gateway

```java
@Configuration
public class ShadowDeploymentConfig {
    
    @Bean
    public RouteLocator shadowRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("shadow_route", r -> r.path("/api/**")
                .filters(f -> f.filter((exchange, chain) -> {
                    // Clone the request
                    ServerWebExchange primaryExchange = exchange.mutate().build();
                    ServerWebExchange shadowExchange = exchange.mutate().build();
                    
                    // Send to primary service (v1)
                    Mono<Void> primaryResponse = chain.filter(primaryExchange);
                    
                    // Send to shadow service (v2) but discard the result
                    Mono<Void> shadowResponse = WebClient.create()
                        .method(exchange.getRequest().getMethod())
                        .uri("http://service-v2" + exchange.getRequest().getPath())
                        .headers(headers -> headers.addAll(exchange.getRequest().getHeaders()))
                        .body(BodyInserters.fromDataBuffers(exchange.getRequest().getBody()))
                        .exchange()
                        .then();
                    
                    // Only wait for primary response to return to user
                    // Shadow request happens in parallel but result is ignored
                    return Mono.when(shadowResponse).then(primaryResponse);
                }))
                .uri("lb://service-v1"))
            .build();
    }
}
```

#### Using Istio Mirror Traffic

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: java-service
spec:
  hosts:
  - java-service
  http:
  - route:
    - destination:
        host: java-service-v1
      weight: 100
    mirror:
      host: java-service-v2
    mirrorPercentage:
      value: 100.0
```

### Advantages
- Zero impact on users
- Tests with real production traffic
- Comprehensive testing before exposing to users
- Can compare performance between versions

### Disadvantages
- Doubles the load on backend systems
- Requires handling duplicate transactions for non-idempotent operations
- Complex to implement correctly

## Handling Database Changes with Java Deployments

Database changes must be carefully coordinated with application deployments to avoid issues.

### Using Liquibase or Flyway

Database migration tools like Liquibase or Flyway work well with Java applications:

```xml
<!-- Flyway Maven dependency -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>8.5.13</version>
</dependency>
```

Create migrations in `src/main/resources/db/migration`:

```sql
-- V1__Initial_schema.sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- V2__Add_user_status.sql
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';
```

Configure in application.properties:

```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

### Using Expand and Contract Pattern

For backward compatibility during deployments:

1. **Expand**: Add new structures without removing old ones
2. **Migrate**: Move to the new structures gradually
3. **Contract**: Remove old structures when no longer needed

Example with a Java service:

```java
// Step 1: Add new column but keep using old one
ALTER TABLE users ADD COLUMN full_name VARCHAR(200);

// Service code handles both formats
@Entity
public class User {
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "full_name")
    private String fullName;
    
    // During save, fill both formats
    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateFullName();
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateFullName();
    }
    
    private void updateFullName() {
        if (firstName != null && lastName != null) {
            this.fullName = firstName + " " + lastName;
        }
    }
}

// Step 2: Later, migrate existing data
UPDATE users SET full_name = CONCAT(first_name, ' ', last_name) WHERE full_name IS NULL;

// Step 3: Finally, remove old columns
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;
```

## Monitoring Deployments

### Key Metrics to Monitor During Java Deployments

- **Response Time**: Track changes in response time after deployment
- **Error Rates**: Monitor for increased error rates
- **JVM Metrics**: Memory usage, garbage collection, thread counts
- **Business Metrics**: Conversion rates, user engagement, etc.
- **Database Performance**: Query times, connection pool usage

### Using Spring Boot Actuator and Micrometer

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

Configure in application.properties:

```properties
# Expose all actuator endpoints
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always

# Enable prometheus endpoint
management.metrics.export.prometheus.enabled=true
```

### Setting Up Alerts for Deployment Issues

Configure alerts in Prometheus:

```yaml
groups:
- name: JavaDeploymentAlerts
  rules:
  - alert: HighErrorRate
    expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) > 0.05
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected after deployment"
      description: "Error rate is above 5% for the last 2 minutes. Possible deployment issue."
      
  - alert: SlowResponseTime
    expr: histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le, service)) > 0.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Slow response times after deployment"
      description: "95th percentile response time is above 500ms for the last 5 minutes."
      
  - alert: MemoryPressure
    expr: sum(jvm_memory_used_bytes{area="heap"}) / sum(jvm_memory_max_bytes{area="heap"}) > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "JVM memory pressure"
      description: "JVM heap usage is above 85% for the last 5 minutes."
```

## Rollback Strategies for Java Applications

### Planning for Rollbacks

Always have a rollback plan ready before deployment:

1. **Keep Previous Artifacts**: Maintain previous JAR/WAR files
2. **Database Rollbacks**: Have scripts ready to revert database changes
3. **Version Registry**: Record deployed versions in a central registry
4. **Traffic Routing**: Be able to route traffic back to previous versions

### Implementing Automated Rollbacks

In Jenkins Pipeline:

```groovy
stage('Deploy') {
    steps {
        script {
            try {
                // Deploy new version
                sh 'kubectl apply -f kubernetes/deployment.yaml'
                
                // Monitor for errors for 5 minutes
                sh '''
                ERRORS=$(curl -s http://monitoring.example.com/api/v1/query?query=sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))&time=$(date +%s) | jq '.data.result[0].value[1]')
                if (( $(echo "$ERRORS > 0.05" | bc -l) )); then
                    echo "Error rate too high! Rolling back..."
                    exit 1
                fi
                '''
            } catch (Exception e) {
                // Automatic rollback on failure
                sh 'kubectl rollout undo deployment/java-application'
                error "Deployment failed, rolled back: ${e.message}"
            }
        }
    }
}
```

In Kubernetes:

```bash
# Monitor and rollback if needed
kubectl rollout status deployment/java-application --timeout=5m || kubectl rollout undo deployment/java-application
```

## Deployment Checklist for Java Applications

### Pre-Deployment
- [ ] Run comprehensive test suite
- [ ] Validate backward compatibility
- [ ] Check database migrations
- [ ] Create deployment plan document
- [ ] Ensure monitoring is in place
- [ ] Perform load testing if significant changes
- [ ] Prepare rollback plan

### During Deployment
- [ ] Monitor error rates in real-time
- [ ] Watch application logs
- [ ] Monitor JVM metrics
- [ ] Check database performance
- [ ] Alert team members of deployment status

### Post-Deployment
- [ ] Verify application functionality
- [ ] Run smoke tests
- [ ] Check performance metrics
- [ ] Monitor for any unexpected behavior
- [ ] Update documentation if needed
- [ ] Log deployment in change management system

## Conclusion
Choosing the right deployment strategy for your Java application depends on your specific requirements, infrastructure, and risk tolerance. Modern deployment strategies can significantly reduce the risk and downtime associated with deployments, leading to more reliable and resilient Java applications. By implementing proper monitoring and rollback mechanisms, you can further ensure the success of your deployment process.

## References
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Togglz Feature Flags](https://www.togglz.org/)
- [Flyway Database Migrations](https://flywaydb.org/)
- [Liquibase Database Migrations](https://www.liquibase.org/)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) 