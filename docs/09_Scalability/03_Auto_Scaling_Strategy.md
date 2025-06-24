# Auto Scaling Strategy

This guide defines how to implement efficient, metric-driven autoscaling for Spring Boot microservices running on Kubernetes.

---

## Tooling Used

- **Horizontal Pod Autoscaler (HPA)**
- **Prometheus Adapter**
- **Spring Boot Actuator**
- **Custom Metrics via Micrometer**

---

## Setup HPA with Custom Metrics

### Step 1: Expose Metrics
```xml
<!-- pom.xml -->
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

`application.yml`:
```yaml
management:
  endpoints:
    web.exposure.include: "*"
  metrics:
    export:
      prometheus:
        enabled: true
```

---

### Step 2: Create HPA Based on CPU or Custom Metric
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: booking-service
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: booking-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Best Practices

- Use both CPU and custom metrics (e.g., request count).
- Tune thresholds with real-world traffic patterns.
- Enable Kubernetes vertical pod autoscaler (VPA) for critical jobs.

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets
