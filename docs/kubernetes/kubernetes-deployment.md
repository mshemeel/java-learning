# Kubernetes Deployments

## Overview
This guide covers deployment strategies, configurations, and best practices for managing application deployments in Kubernetes.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of kubectl commands
- Familiarity with YAML configuration
- Understanding of container lifecycle

## Learning Objectives
- Understand deployment strategies
- Learn deployment configuration
- Master rolling updates
- Implement deployment patterns
- Handle deployment rollbacks

## Table of Contents
1. [Deployment Basics](#deployment-basics)
2. [Deployment Strategies](#deployment-strategies)
3. [Configuration Management](#configuration-management)
4. [Rolling Updates](#rolling-updates)
5. [Rollback Management](#rollback-management)

## Deployment Basics

### Basic Deployment Structure
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Deployment Components
1. **metadata**: Name and labels for the deployment
2. **spec.replicas**: Number of desired pods
3. **spec.selector**: How the deployment finds pods to manage
4. **spec.template**: Pod template specification

## Deployment Strategies

### Rolling Update
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Blue-Green Deployment
```yaml
# Blue deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  template:
    metadata:
      labels:
        app: myapp
        version: blue

---
# Green deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
spec:
  template:
    metadata:
      labels:
        app: myapp
        version: green
```

### Canary Deployment
```yaml
# Main deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-main
spec:
  replicas: 9
  template:
    metadata:
      labels:
        app: myapp
        version: stable

---
# Canary deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: myapp
        version: canary
```

## Configuration Management

### Environment Variables
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  template:
    spec:
      containers:
      - name: app
        image: myapp:1.0
        env:
        - name: DATABASE_URL
          value: "postgresql://db:5432"
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
```

### ConfigMaps
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    environment=production
    log.level=info
    
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  template:
    spec:
      containers:
      - name: app
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config
```

## Rolling Updates

### Update Strategy
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 5
```

### Commands for Updates
```bash
# Update image
kubectl set image deployment/app-deployment app=myapp:2.0

# Check rollout status
kubectl rollout status deployment/app-deployment

# Pause rollout
kubectl rollout pause deployment/app-deployment

# Resume rollout
kubectl rollout resume deployment/app-deployment
```

## Rollback Management

### Rollback Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  revisionHistoryLimit: 10
```

### Rollback Commands
```bash
# View rollout history
kubectl rollout history deployment/app-deployment

# Rollback to previous version
kubectl rollout undo deployment/app-deployment

# Rollback to specific revision
kubectl rollout undo deployment/app-deployment --to-revision=2
```

## Best Practices
1. Use declarative configuration
2. Implement proper health checks
3. Set resource limits
4. Use meaningful labels
5. Configure proper update strategy
6. Maintain revision history
7. Implement proper monitoring

## Common Pitfalls
1. Insufficient health checks
2. Poor resource management
3. Missing rollback strategy
4. Inadequate monitoring
5. Poor version control
6. Insufficient testing

## Implementation Examples

### Complete Deployment Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
    environment: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web-app
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: environment
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-key
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config
```

## Resources for Further Learning
- [Kubernetes Deployments Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#deployment-strategies)
- [Rolling Update Configuration](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)
- [Deployment Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

## Practice Exercises
1. Create a basic deployment
2. Implement rolling updates
3. Configure blue-green deployment
4. Set up canary deployment
5. Manage deployment rollbacks 