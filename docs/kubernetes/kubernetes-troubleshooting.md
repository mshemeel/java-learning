# Kubernetes Troubleshooting

## Overview
This guide covers troubleshooting techniques in Kubernetes, including debugging applications, cluster issues, and common problems with their solutions.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of kubectl commands
- Familiarity with logging and monitoring
- Understanding of networking concepts

## Learning Objectives
- Understand troubleshooting methodology
- Learn debugging techniques
- Master log analysis
- Implement monitoring solutions
- Resolve common issues

## Table of Contents
1. [Pod Issues](#pod-issues)
2. [Node Problems](#node-problems)
3. [Networking Issues](#networking-issues)
4. [Storage Problems](#storage-problems)
5. [Cluster Issues](#cluster-issues)

## Pod Issues

### Debugging Pods
```bash
# Get pod status
kubectl get pod <pod-name> -n <namespace>

# Get pod details
kubectl describe pod <pod-name> -n <namespace>

# Get pod logs
kubectl logs <pod-name> -n <namespace>

# Get previous pod logs
kubectl logs <pod-name> -n <namespace> --previous

# Get container logs in multi-container pod
kubectl logs <pod-name> -c <container-name> -n <namespace>

# Execute commands in pod
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh
```

### Common Pod States
```yaml
# Pod stuck in Pending
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

# Pod in CrashLoopBackOff
apiVersion: v1
kind: Pod
metadata:
  name: liveness-pod
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
```

## Node Problems

### Node Debugging
```bash
# Check node status
kubectl get nodes

# Get node details
kubectl describe node <node-name>

# Get node metrics
kubectl top node

# Check node logs
journalctl -u kubelet

# Check node conditions
kubectl get nodes -o json | jq '.items[].status.conditions[]'
```

### Node Maintenance
```yaml
# Drain node
kubectl drain <node-name> --ignore-daemonsets

# Cordon node
kubectl cordon <node-name>

# Uncordon node
kubectl uncordon <node-name>
```

## Networking Issues

### Network Debugging
```bash
# Test service DNS
kubectl run -it --rm --restart=Never busybox --image=busybox -- nslookup kubernetes.default

# Check service endpoints
kubectl get endpoints <service-name>

# Test network connectivity
kubectl run -it --rm --restart=Never busybox --image=busybox -- wget -O- http://service-name:port

# Check network policies
kubectl get networkpolicies --all-namespaces
```

### Service Debugging
```yaml
# Debug service connectivity
apiVersion: v1
kind: Pod
metadata:
  name: debug-pod
spec:
  containers:
  - name: debug
    image: nicolaka/netshoot
    command: ['sh', '-c', 'while true; do sleep 3600; done']
```

## Storage Problems

### Storage Debugging
```bash
# Check PV status
kubectl get pv

# Check PVC status
kubectl get pvc

# Check storage class
kubectl get storageclass

# Describe storage issues
kubectl describe pv <pv-name>
kubectl describe pvc <pvc-name>
```

### Storage Cleanup
```yaml
# Force delete PVC
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}'

# Force delete PV
kubectl patch pv <pv-name> -p '{"metadata":{"finalizers":null}}'
```

## Cluster Issues

### Cluster Debugging
```bash
# Check cluster components
kubectl get componentstatuses

# Check control plane pods
kubectl get pods -n kube-system

# Check cluster events
kubectl get events --all-namespaces

# Check API server logs
kubectl logs -n kube-system kube-apiserver-<node-name>
```

### Control Plane Recovery
```yaml
# Backup etcd
ETCDCTL_API=3 etcdctl snapshot save snapshot.db

# Restore etcd
ETCDCTL_API=3 etcdctl snapshot restore snapshot.db
```

## Best Practices

### Logging Best Practices
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: logging-pod
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: logs
      mountPath: /var/log
  volumes:
  - name: logs
    emptyDir: {}
```

### Monitoring Setup
```yaml
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
```

## Common Issues and Solutions

### Application Issues
1. Pod won't start
   - Check image name and tag
   - Verify resource requests and limits
   - Check pull secrets
   - Examine node capacity

2. Container crashes
   - Check application logs
   - Verify health checks
   - Check resource usage
   - Examine dependencies

### Networking Issues
1. Service not accessible
   - Verify service selector
   - Check endpoint creation
   - Test pod connectivity
   - Examine network policies

2. Ingress problems
   - Check ingress controller
   - Verify TLS configuration
   - Examine service backend
   - Check DNS resolution

### Storage Issues
1. PVC stuck in pending
   - Check storage class
   - Verify PV availability
   - Examine storage provider
   - Check capacity

2. Volume mount failures
   - Check mount permissions
   - Verify volume paths
   - Examine node issues
   - Check filesystem type

## Troubleshooting Tools

### Debug Container
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: debug-tools
spec:
  containers:
  - name: debug
    image: nicolaka/netshoot
    command:
    - sleep
    - "3600"
    securityContext:
      privileged: true
```

### Network Debug
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: network-debug
spec:
  containers:
  - name: network-tools
    image: praqma/network-multitool
    command:
    - sleep
    - "3600"
```

## Resources for Further Learning
- [Kubernetes Troubleshooting Guide](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/)
- [Debug Running Pods](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/)
- [Debug Services](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/)
- [Cluster Troubleshooting](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/)

## Practice Exercises
1. Debug failing pods
2. Troubleshoot service connectivity
3. Resolve storage issues
4. Fix networking problems
5. Recover from cluster issues 