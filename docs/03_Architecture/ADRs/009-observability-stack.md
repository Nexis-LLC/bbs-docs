## ADR 009: Prometheus & Grafana for Metrics, ELK for Logs, Zipkin for Tracing

**Context:**  
We need full‑stack observability: real‑time metrics, log aggregation, and distributed tracing.

**Decision:**
- **Metrics:** Prometheus + Grafana dashboards
- **Logs:** ELK Stack (Filebeat → Elasticsearch → Kibana)
- **Tracing:** Zipkin via Spring Cloud Sleuth

**Consequences:**
- **Pros:**
    - Unified visibility: metrics, logs, traces correlated by trace IDs.
    - Highly customizable alerting and dashboarding.
- **Cons:**
    - Operational overhead: multiple clusters, storage sizing, retention policies.
    - Potential performance impact of sampling/tracing on high‑throughput flows.

---