# Kubernetes Networking

## Overview
This guide covers networking concepts in Kubernetes, including services, ingress controllers, network policies, and DNS configuration.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of networking principles
- Familiarity with load balancing
- Understanding of DNS

## Learning Objectives
- Understand Kubernetes networking
- Learn service types
- Master ingress configuration
- Implement network policies
- Configure DNS

## Table of Contents
1. [Services](#services)
2. [Ingress](#ingress)
3. [Network Policies](#network-policies)
4. [DNS Configuration](#dns-configuration)
5. [Load Balancing](#load-balancing)

## Services

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
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      nodePort: 30080
```

### LoadBalancer Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## Ingress

### Basic Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

### TLS Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  tls:
  - hosts:
    - secure.example.com
    secretName: tls-secret
  rules:
  - host: secure.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: secure-service
            port:
              number: 443
```

### Path-based Routing
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-ingress
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-v1-service
            port:
              number: 80
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: api-v2-service
            port:
              number: 80
```

## Network Policies

### Default Deny Policy
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

### Allow Specific Traffic
```yaml
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

## DNS Configuration

### CoreDNS ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           upstream
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

### Custom DNS Entry
```yaml
apiVersion: v1
kind: Service
metadata:
  name: custom-dns
  annotations:
    external-dns.alpha.kubernetes.io/hostname: custom.example.com
spec:
  type: ExternalName
  externalName: service.namespace.svc.cluster.local
```

## Load Balancing

### External Load Balancer
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
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

### Internal Load Balancer
```yaml
apiVersion: v1
kind: Service
metadata:
  name: internal-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
spec:
  type: LoadBalancer
  selector:
    app: internal-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

## Best Practices
1. Use appropriate service types
2. Implement ingress controllers
3. Configure network policies
4. Optimize DNS settings
5. Use load balancing effectively
6. Monitor network performance
7. Implement security measures

## Common Pitfalls
1. Incorrect service configuration
2. Missing network policies
3. DNS resolution issues
4. Load balancer misconfiguration
5. Poor ingress routing
6. Network performance issues

## Implementation Examples

### Complete Networking Stack
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-network-policy
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: backend
    ports:
    - protocol: TCP
      port: 8080
```

### Service Mesh Configuration
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: web-vs
spec:
  hosts:
  - "example.com"
  gateways:
  - web-gateway
  http:
  - match:
    - uri:
        prefix: /v1
    route:
    - destination:
        host: web-service-v1
        port:
          number: 80
  - match:
    - uri:
        prefix: /v2
    route:
    - destination:
        host: web-service-v2
        port:
          number: 80
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: web-dr
spec:
  host: web-service
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

## Resources for Further Learning
- [Kubernetes Networking](https://kubernetes.io/docs/concepts/services-networking/)
- [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)

## Practice Exercises
1. Configure different service types
2. Set up ingress controllers
3. Implement network policies
4. Configure DNS settings
5. Set up load balancing 