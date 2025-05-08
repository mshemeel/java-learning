# Kubernetes Services

## Overview
This guide covers Kubernetes services, including different service types, networking configurations, and load balancing strategies.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of networking basics
- Familiarity with load balancing concepts
- Understanding of DNS and service discovery

## Learning Objectives
- Understand service types
- Learn service configuration
- Master service networking
- Implement load balancing
- Configure service discovery

## Table of Contents
1. [Service Types](#service-types)
2. [Service Configuration](#service-configuration)
3. [Load Balancing](#load-balancing)
4. [Service Discovery](#service-discovery)
5. [Network Policies](#network-policies)

## Service Types

### ClusterIP Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### NodePort Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: NodePort
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080
```

### LoadBalancer Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### ExternalName Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  type: ExternalName
  externalName: api.external-service.com
```

## Service Configuration

### Basic Service Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
  labels:
    app: myapp
spec:
  selector:
    app: myapp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

### Multi-Port Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: multi-port-service
spec:
  selector:
    app: myapp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
```

## Load Balancing

### Internal Load Balancing
```yaml
apiVersion: v1
kind: Service
metadata:
  name: internal-lb
  annotations:
    cloud.google.com/load-balancer-type: "Internal"
spec:
  type: LoadBalancer
  selector:
    app: internal-app
  ports:
    - port: 80
      targetPort: 8080
```

### External Load Balancing
```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
spec:
  type: LoadBalancer
  selector:
    app: external-app
  ports:
    - port: 80
      targetPort: 8080
```

## Service Discovery

### DNS Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: default
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### Headless Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-service
spec:
  clusterIP: None
  selector:
    app: stateful-app
  ports:
    - port: 80
      targetPort: 8080
```

## Network Policies

### Basic Network Policy
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

### Namespace Network Policy
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: namespace-policy
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              environment: production
```

## Best Practices
1. Use appropriate service types
2. Implement proper load balancing
3. Configure health checks
4. Use meaningful DNS names
5. Implement network policies
6. Monitor service performance
7. Configure proper timeouts

## Common Pitfalls
1. Incorrect service type selection
2. Poor load balancing configuration
3. Missing network policies
4. Inadequate monitoring
5. DNS misconfiguration
6. Security misconfigurations

## Implementation Examples

### Complete Service Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
  labels:
    app: web
    environment: production
  annotations:
    prometheus.io/scrape: 'true'
    prometheus.io/port: '9090'
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
    - name: metrics
      protocol: TCP
      port: 9090
      targetPort: 9090
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
  loadBalancerSourceRanges:
    - 10.0.0.0/8
  externalTrafficPolicy: Local
```

### Service with Network Policy
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
        - namespaceSelector:
            matchLabels:
              environment: production
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
```

## Resources for Further Learning
- [Kubernetes Services Documentation](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Network Policies Documentation](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Service Load Balancing](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)

## Practice Exercises
1. Create different types of services
2. Implement load balancing
3. Configure network policies
4. Set up service discovery
5. Test service connectivity 