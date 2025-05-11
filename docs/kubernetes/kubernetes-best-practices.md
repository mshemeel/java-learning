# Kubernetes Best Practices

## Overview
This guide covers best practices for running Kubernetes in production, including security, scalability, reliability, and operational excellence.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of container orchestration
- Familiarity with DevOps practices
- Understanding of cloud-native principles

## Learning Objectives
- Understand Kubernetes best practices
- Learn security hardening
- Master scalability patterns
- Implement reliability measures
- Configure operational excellence

## Table of Contents
1. [Security Best Practices](#security-best-practices)
2. [Scalability Best Practices](#scalability-best-practices)
3. [Reliability Best Practices](#reliability-best-practices)
4. [Operational Best Practices](#operational-best-practices)
5. [Resource Management](#resource-management)

## Security Best Practices

### Pod Security Context
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: secure-container
    image: nginx
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### RBAC Configuration
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: minimal-access
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: minimal-access-binding
subjects:
- kind: ServiceAccount
  name: app-service-account
roleRef:
  kind: Role
  name: minimal-access
  apiGroup: rbac.authorization.k8s.io
```

## Scalability Best Practices

### Horizontal Pod Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### Resource Requests and Limits
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Reliability Best Practices

### Liveness and Readiness Probes
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: probe-pod
spec:
  containers:
  - name: app
    image: nginx
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 3
      periodSeconds: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

### Pod Disruption Budget
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: web
```

## Operational Best Practices

### Resource Quotas
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 4Gi
    limits.cpu: "8"
    limits.memory: 8Gi
```

### Limit Ranges
```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - default:
      memory: 256Mi
      cpu: 500m
    defaultRequest:
      memory: 128Mi
      cpu: 250m
    type: Container
```

## Resource Management

### Namespace Configuration
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    name: production
    environment: prod
```

### Resource Labels and Annotations
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
    environment: production
    team: frontend
  annotations:
    description: "Web application deployment"
    contact: "team@example.com"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
```

## Implementation Examples

### Complete Production Setup
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-app
  labels:
    app: production
    environment: prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: production
  template:
    metadata:
      labels:
        app: production
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: app
        image: nginx:1.21
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: production-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: production
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: production-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: production-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### Monitoring and Logging Setup
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-monitor
spec:
  selector:
    matchLabels:
      app: production
  endpoints:
  - port: metrics
---
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
```

## Best Practices Checklist

### Security
1. Enable RBAC
2. Use Pod Security Contexts
3. Implement Network Policies
4. Secure Secrets Management
5. Regular Security Updates
6. Image Scanning
7. Audit Logging

### Scalability
1. Use HPA
2. Set Resource Requests/Limits
3. Implement Load Balancing
4. Use Node Autoscaling
5. Optimize Performance
6. Cache Effectively
7. Use CDN

### Reliability
1. Use Health Checks
2. Implement PodDisruptionBudgets
3. Set Up Monitoring
4. Configure Logging
5. Backup Critical Data
6. Disaster Recovery Plan
7. High Availability Setup

### Operations
1. Use Resource Quotas
2. Implement Limit Ranges
3. Label Resources
4. Document Everything
5. Automate Deployments
6. Monitor Costs
7. Regular Maintenance

## Resources for Further Learning
- [Kubernetes Production Best Practices](https://kubernetes.io/docs/setup/best-practices/)
- [Security Best Practices](https://kubernetes.io/docs/concepts/security/overview/)
- [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [High Availability](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)

## Practice Exercises
1. Implement security best practices
2. Configure scalability features
3. Set up reliability measures
4. Establish operational procedures
5. Create production checklist 