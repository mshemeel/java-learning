# Kubernetes Storage

## Overview
This guide covers storage concepts in Kubernetes, including volumes, persistent volumes, storage classes, and best practices for managing application data.

## Prerequisites
- Basic understanding of Kubernetes concepts
- Knowledge of storage systems
- Familiarity with cloud storage
- Understanding of persistence concepts

## Learning Objectives
- Understand Kubernetes storage concepts
- Learn volume management
- Master persistent volumes
- Implement storage classes
- Configure dynamic provisioning

## Table of Contents
1. [Volumes](#volumes)
2. [Persistent Volumes](#persistent-volumes)
3. [Storage Classes](#storage-classes)
4. [Volume Snapshots](#volume-snapshots)
5. [Storage Best Practices](#storage-best-practices)

## Volumes

### EmptyDir Volume
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: test-container
    image: nginx
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### HostPath Volume
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: test-container
    image: nginx
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      path: /data
      type: Directory
```

## Persistent Volumes

### PersistentVolume
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-volume
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  nfs:
    path: /tmp
    server: 172.17.0.2
```

### PersistentVolumeClaim
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
```

### Using PVC in Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-pod
spec:
  containers:
  - name: test-container
    image: nginx
    volumeMounts:
    - mountPath: "/var/www/html"
      name: pv-storage
  volumes:
  - name: pv-storage
    persistentVolumeClaim:
      claimName: pv-claim
```

## Storage Classes

### Basic StorageClass
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
allowVolumeExpansion: true
```

### Dynamic Provisioning
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

## Volume Snapshots

### VolumeSnapshotClass
```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
```

### VolumeSnapshot
```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pv-claim
```

### Restore from Snapshot
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  dataSource:
    name: new-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Storage Best Practices

### Volume Security Context
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-pod
spec:
  securityContext:
    fsGroup: 2000
  containers:
  - name: sec-ctx-container
    image: nginx
    volumeMounts:
    - name: sec-ctx-vol
      mountPath: /data/demo
  volumes:
  - name: sec-ctx-vol
    persistentVolumeClaim:
      claimName: pv-claim
```

### Resource Quotas
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storage-quota
spec:
  hard:
    persistentvolumeclaims: "10"
    requests.storage: "500Gi"
```

## Best Practices
1. Use appropriate storage types
2. Implement proper backup strategies
3. Configure storage classes correctly
4. Monitor storage usage
5. Implement proper access controls
6. Use volume snapshots
7. Plan for scalability

## Common Pitfalls
1. Incorrect storage class selection
2. Poor capacity planning
3. Missing backup strategy
4. Inadequate monitoring
5. Performance issues
6. Security misconfigurations

## Implementation Examples

### Complete Storage Configuration
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-storage
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
reclaimPolicy: Retain
allowVolumeExpansion: true
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-storage
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
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
        image: nginx
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: fast-storage
      resources:
        requests:
          storage: 1Gi
```

### Backup Configuration
```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-aws-snapclass
driver: ebs.csi.aws.com
deletionPolicy: Retain
parameters:
  description: "Daily backup snapshot"
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: volume-snap-1
spec:
  volumeSnapshotClassName: csi-aws-snapclass
  source:
    persistentVolumeClaimName: app-data
```

## Resources for Further Learning
- [Kubernetes Storage Documentation](https://kubernetes.io/docs/concepts/storage/)
- [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- [Volume Snapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)

## Practice Exercises
1. Create and use PersistentVolumes
2. Implement StorageClasses
3. Configure volume snapshots
4. Set up dynamic provisioning
5. Implement backup strategies 