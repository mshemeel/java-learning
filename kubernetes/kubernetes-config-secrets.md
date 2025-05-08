# Kubernetes Configuration and Secrets

## Overview
This guide covers configuration management and secrets handling in Kubernetes, including ConfigMaps, Secrets, and best practices for managing application configuration.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of YAML configuration
- Familiarity with security concepts
- Understanding of environment variables

## Learning Objectives
- Understand ConfigMaps and Secrets
- Learn configuration management
- Master secrets handling
- Implement secure practices
- Configure applications properly

## Table of Contents
1. [ConfigMaps](#configmaps)
2. [Secrets](#secrets)
3. [Environment Variables](#environment-variables)
4. [Volume Mounts](#volume-mounts)
5. [Security Best Practices](#security-best-practices)

## ConfigMaps

### Basic ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://db:5432"
  api_endpoint: "http://api.example.com"
  app.properties: |
    environment=production
    log.level=info
    max.connections=100
```

### Using ConfigMap in Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - configMapRef:
        name: app-config
```

### ConfigMap as Volume
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

## Secrets

### Basic Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db_password: base64encodedpassword
  api_key: base64encodedapikey
```

### Using Secrets in Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: db_password
```

### TLS Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: base64encodedcert
  tls.key: base64encodedkey
```

## Environment Variables

### Direct Environment Variables
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: ENVIRONMENT
      value: "production"
    - name: LOG_LEVEL
      value: "info"
```

### Mixed Configuration Sources
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DATABASE_URL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_url
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: api_key
```

## Volume Mounts

### ConfigMap Volume Mount
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
      readOnly: true
  volumes:
  - name: config-volume
    configMap:
      name: app-config
      items:
      - key: app.properties
        path: application.properties
```

### Secret Volume Mount
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    volumeMounts:
    - name: secrets-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secrets-volume
    secret:
      secretName: app-secrets
```

## Security Best Practices

### Secret Encryption
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
metadata:
  name: encryption-config
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <base64-encoded-key>
    - identity: {}
```

### Pod Security Context
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
```

## Best Practices
1. Use appropriate configuration methods
2. Implement proper secret management
3. Follow least privilege principle
4. Encrypt sensitive data
5. Regular secret rotation
6. Implement proper access controls
7. Monitor configuration changes

## Common Pitfalls
1. Hardcoding secrets
2. Insufficient access controls
3. Poor secret rotation
4. Insecure secret storage
5. Missing encryption
6. Configuration sprawl

## Implementation Examples

### Complete Configuration Example
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yaml: |
    server:
      port: 8080
    database:
      url: jdbc:postgresql://db:5432/myapp
      pool:
        max-size: 20
        idle-timeout: 300000
    logging:
      level:
        root: INFO
        com.example: DEBUG
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db-password: base64encodedpassword
  api-key: base64encodedapikey
  jwt-secret: base64encodedjwtsecret
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
        image: myapp:1.0
        env:
        - name: SPRING_CONFIG_LOCATION
          value: /etc/config/application.yaml
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
          readOnly: true
        - name: secrets-volume
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: app-config
      - name: secrets-volume
        secret:
          secretName: app-secrets
```

## Resources for Further Learning
- [Kubernetes ConfigMaps Documentation](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Kubernetes Secrets Documentation](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Encryption at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)

## Practice Exercises
1. Create and use ConfigMaps
2. Implement secret management
3. Configure environment variables
4. Set up volume mounts
5. Implement security best practices 