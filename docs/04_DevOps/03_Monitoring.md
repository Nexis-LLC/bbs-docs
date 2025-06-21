# Monitoring Guide: Prometheus, Grafana & OpenSearch

This document describes the monitoring stack using **free, open-source tools** to ensure visibility and alerting for your deployment.

---

## 1. Metrics Collection with Prometheus

### Installation via Helm

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus
```

### Service Discovery

Annotate service pods to expose metrics:

```yaml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/path: "/actuator/prometheus"
    prometheus.io/port: "8080"
```

### Key Metrics to Track

* **API Latency**: HTTP request duration (p95/p99)
* **Error Rate**: 4xx/5xx per minute
* **Kafka Consumer Lag**: to monitor event processing
* **Pod Health**: CPU/memory usage, restart count

---

## 2. Dashboards with Grafana

### Installation via Helm

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
```

### Dashboard Setup

* Import **official** Prometheus dashboard (ID: 1860)
* Import **Kafka** overview dashboard (ID: 7607)
* Custom panels:

    * P99 latency (histogram\_quantile)
    * Error budget burn rate (alerts per minute)

---

## 3. Log Aggregation with OpenSearch

### Installation via Helm

```bash
helm repo add opensearch https://opensearch-project.github.io/helm-charts
helm install opensearch opensearch/opensearch
helm install dashboards opensearch/opensearch-dashboards
```

### Filebeat DaemonSet

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: filebeat
spec:
  selector:
    matchLabels:
      app: filebeat
  template:
    metadata:
      labels:
        app: filebeat
    spec:
      containers:
      - name: filebeat
        image: docker.elastic.co/beats/filebeat:7.17.0
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
```

### Key Log Queries

* **Error logs**: `level:ERROR` in last 5m
* **Slow requests**: HTTP duration > 1s
* **Kafka errors**: consumer group failures

---

* Document Version: 1.0
* Date: 2025-06-21
* Author: ArturChernets