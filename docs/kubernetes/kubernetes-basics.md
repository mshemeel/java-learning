# Kubernetes Basics

## Overview
This guide introduces the fundamental concepts of Kubernetes, its architecture, and basic components for container orchestration.

## Prerequisites
- Basic understanding of containers and Docker
- Familiarity with command-line operations
- Basic knowledge of YAML
- Understanding of distributed systems concepts

## Learning Objectives
- Understand Kubernetes architecture
- Learn core Kubernetes concepts
- Master basic kubectl commands
- Implement basic deployments
- Understand pod lifecycle

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Architecture](#architecture)
3. [Basic Components](#basic-components)
4. [kubectl Commands](#kubectl-commands)
5. [Pod Management](#pod-management)

## Core Concepts

### What is Kubernetes?
Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.

### Key Features
1. Container Orchestration
2. Self-healing
3. Automatic scaling
4. Load balancing
5. Rolling updates
6. Service discovery
7. Configuration management

## Architecture

### Control Plane Components
1. **kube-apiserver**: API server that exposes the Kubernetes API
2. **etcd**: Consistent and highly-available key-value store
3. **kube-scheduler**: Assigns nodes to newly created pods
4. **kube-controller-manager**: Runs controller processes
5. **cloud-controller-manager**: Integrates with cloud provider APIs

### Node Components
1. **kubelet**: Ensures containers are running in a pod
2. **kube-proxy**: Maintains network rules on nodes
3. **Container Runtime**: Software responsible for running containers

## Basic Components

### Pods
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

### ReplicaSets
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
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
```

### Deployments
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
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

## kubectl Commands

### Basic Commands
```bash
# Get information about cluster components
kubectl get nodes
kubectl get pods
kubectl get services

# Create resources
kubectl create -f deployment.yaml

# Apply configuration
kubectl apply -f config.yaml

# Delete resources
kubectl delete pod nginx-pod
```

### Common Operations
```bash
# Port forwarding
kubectl port-forward pod/nginx-pod 8080:80

# Get pod logs
kubectl logs nginx-pod

# Execute command in pod
kubectl exec -it nginx-pod -- /bin/bash

# Scale deployment
kubectl scale deployment nginx-deployment --replicas=5
```

## Pod Management

### Pod Lifecycle
1. **Pending**: Pod accepted but containers not running
2. **Running**: Pod bound to node, all containers running
3. **Succeeded**: All containers terminated successfully
4. **Failed**: All containers terminated, at least one failed
5. **Unknown**: Pod state cannot be obtained

### Health Checks
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
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
```

## Best Practices
1. Use declarative configuration
2. Implement proper labels and selectors
3. Set resource requests and limits
4. Use namespaces for organization
5. Implement proper health checks
6. Use configuration management
7. Follow security best practices

## Common Pitfalls
1. Not setting resource limits
2. Poor label management
3. Missing health checks
4. Inadequate monitoring
5. Poor security practices
6. Insufficient logging

## Implementation Examples

### Complete Pod Configuration
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web
    environment: production
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
      value: "production"
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

## Resources for Further Learning
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes GitHub Repository](https://github.com/kubernetes/kubernetes)
- [Kubernetes Patterns](https://k8spatterns.io/)
- [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)

## Practice Exercises
1. Create a basic pod configuration
2. Deploy a multi-container pod
3. Implement health checks
4. Scale a deployment
5. Configure pod resources 