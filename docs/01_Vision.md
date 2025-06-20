# Vision Document: Bus Ticket Booking System
Scalable, Reliable, and Cost-Efficient Booking for Modern Transit

---

## 1. Introduction
The **Real-Time Bus Ticket Booking System** is a high-performance platform designed to handle **10,000+ concurrent bookings** with sub-second latency and 99.99% uptime. Built on a pragmatic tech stack (Java/Spring Boot, Kafka, Kubernetes), it eliminates overbooking risks, simplifies payment integration, and ensures fault tolerance for mid-sized operators and enterprises.

---

## 2. Problem Statement

**Current Industry Pain Points:**
- **Peak Load Failures:** Systems crash during holidays or flash sales.
- **Complex Integrations:** Fragmented payment and auth systems.
- **Manual Scaling:** Inefficient resource usage during off-peak hours.
- **Limited Observability:** No unified logs or metrics for rapid debugging.

**Our Solution:**
- **Horizontal scaling** with Kubernetes (HPA/KEDA).
- **Event-driven resilience** via Kafka and idempotent gRPC APIs.
- **Unified security** with Keycloak (OAuth2/OIDC) and RBAC.
- **Cost-effective observability** using ELK + Prometheus/Grafana.

---

## 3. Vision Statement

> "To empower bus operators with a battle-tested, scalable booking platform that balances performance and simplicity where every seat is reserved atomically, every payment is guaranteed, and every failure is recoverable within seconds."

---

## 4. Key Objectives

| **Objective**       | **Metric**                              |
|---------------------|-----------------------------------------|
| **Scalability**     | 500 bookings/sec per Kubernetes pod     |
| **Latency**         | 300ms API response (p99)               |
| **Reliability**     | 99.99% uptime; 30s pod auto-recovery    |
| **Cost Efficiency** | 40% lower cloud costs vs. legacy systems |

---

## 5. Target Audience

| **Segment**       | **Needs Addressed**                                        |
|-------------------|------------------------------------------------------------|
| **Travelers**     | Instant bookings, real-time seat maps, PayPal integration. |
| **Bus Operators** | Centralized seat inventory, fraud alerts (Redis rate limits). |
| **DevOps**        | Kubernetes-driven scaling, ArgoCD rollbacks, Grafana dashboards. |

---

## 6. Core Features

### 6.1. Real-Time Seat Management
- **Optimistic Locking:** PostgreSQL transactions with row-level locks.
- **Redis Caching:** Seat availability cached with TTL to reduce DB load.
- **gRPC Services:** Low-latency seat holds and releases.

### 6.2. Resilient Payment Flow
- **PayPal Integration:** Idempotent API keys stored in Redis to prevent duplicates.
- **Saga Pattern:** Compensating transactions for refunds on partial failures.

### 6.3. Proactive Monitoring
- **ELK Stack:** Centralized logs for rapid incident diagnosis.
- **Prometheus/Grafana:** Real-time metrics (API latency, Kafka lag).
- **Zipkin:** Distributed tracing for gRPC/Kafka flows.

---

## 7. Technical Strategy

### 7.1. Architecture
- **Microservices:** Spring Boot (Java 21) + Spring Cloud, Eureka for service discovery.
- **Event Streaming:** Kafka for seat-inventory updates and payment triggers.
- **CI/CD:** GitHub Actions + GHCR + ArgoCD (GitOps).

### 7.2. Data Layer
- **PostgreSQL:** ACID-compliant transactions for bookings.
- **Liquibase:** Version-controlled schema migrations.
- **Redis:** Cache for seat maps and payment idempotency keys.

### 7.3. Security
- **Keycloak:** OAuth2/OIDC with JWT tokens and LDAP integration.
- **Secrets:** SOPS + Kubernetes Secrets (avoiding Vault costs).

### 7.4. Deployment
- **Kubernetes:** Helm-managed pods with HPA/KEDA autoscaling (CPU/Kafka metrics).
- **Observability:**
    - **Logs:** Filebeat + Elasticsearch + Kibana.
    - **Metrics:** Prometheus exporters + Grafana dashboards.
    - **Traces:** Zipkin for gRPC/Kafka interactions.

---

## 8. Non-Functional Requirements

| **Category**     | **Requirement**                             | **How We Achieve It**                |
|------------------|---------------------------------------------|--------------------------------------|
| **Scalability**  | Auto-scale from 5 to 50 pods based on load. | KEDA + Kafka consumer lag.           |
| **Recovery**     |  30s pod restart; 5 min regional failover.  | Kubernetes self-healing.             |
| **Security**     | RBAC via Keycloak; encrypted secrets.       | SOPS + Kubernetes Sealed Secrets.    |

---

## 10. Service Level Objectives, Agreements & Error Budgets

| **Measure**                   | **Target**                                                                                                         | **Rationale**                                                              |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **SLA (Customer-Facing)**     | 99.99% monthly uptime                                                                                              | Guarantees mission-critical availability (~4.38 min downtime per month).  |
| **SLO (Engineering-Facing)**  | - 95th percentile API latency 300ms - 99th percentile availability + 99.9%                                         | Drives internal performance targets while aligning with SLA.             |
| **Error Budget**              | 0.1% monthly error budget                                                                                          | ~43.2 minutes of allowable downtime or degraded performance.              |
| **Burn Rate Policies**        | - Pause non-critical deploys when >50% budget consumed in 14 days<br/>- Emergency rollback if >75% budget consumed | Ensures SLA compliance and controlled release cadence.                   |

---

## 11. Load-Testing & Resilience Scenarios

We validate system behavior under realistic traffic patterns using **k6** and **Gatling**:

| **Scenario**    | **Description**                                      | **Key Metrics**                               |
|-----------------|------------------------------------------------------|-----------------------------------------------|
| **Soak Test**   | 24h at 200 req/sec (20% above peak)                  | Memory/CPU leak detection; sustained latency  |
| **Spike Test**  | Sudden jump from 50 to 500 req/sec in 30s            | Autoscaling response time; error rate         |
| **Stress Test** | Ramp to 1,000 req/sec until failure                  | Maximum throughput; bottleneck analysis       |
| **Chaos Test**  | Randomly terminate 1-2 pods every 10 min during soak | Recovery time; error budget burn rate         |

---

## 12. Failover & Retry Mechanisms

**PostgreSQL & Redis**
- **Active-Passive Postgres** with automatic failover via **Patroni + etcd**
- **HikariCP** health checks route connections to healthy primary/replica
- **Retry Policy:** Exponential backoff on transient errors (max 5 retries, 200ms - 3s)

**Kafka Event Streaming**
- **Idempotent Producers** for exactly-once writes
- **Consumer Offset Management:** Commit post-processing; dead-letter `failed-events` topic
- **Cooperative Rebalancing** to minimize partition thrash
- **Cross-region DR** via MirrorMaker 2.0

---

## 13. Rate-Limiting & DDoS Protection

- **Spring Cloud Gateway** enforces token-bucket limits per tenant:
    - 100 req/min for free tier
    - 1,000 req/min for enterprise tier
- **Distributed Rate Store:** Redis cluster with Lua scripts
- **WAF Integration:** AWS WAF or Cloudflare managed rules for SQLi/XSS protection
- **Global Throttling:** CDN edge caching + geofencing rules for burst attacks

---

## 14. Caching Strategy

| **Layer**            | **Purpose**                                  | **TTL / Eviction**             | **Fallback**                               |
|----------------------|----------------------------------------------|--------------------------------|--------------------------------------------|
| **Redis Read Cache** | Seat availability lookups                    | 5s TTL, LRU eviction           | On miss Postgres read with row lock        |
| **App-Level Cache**  | Idempotency keys, rate counters              | 1h sliding window              | Persist to Redis if local cache unavailable |
| **Stale-If-Error**   | Serve slightly out-of-date seat map if Redis down | Serve stale up to 30s      | Trigger background cache refresh           |

- **Stampede Protection:** Redlock mutex per key
- **Write-Through & Write-Behind:** Idempotency writes sync; booking events async update cache

---

## 15. Kafka Schema Evolution & Governance

- **Confluent Schema Registry** enforces backward/forward compatibility
- **Avro** serialization with explicit version fields
- **Contract-First Development:** Shared Avro definitions in central Git repo
- **Automated CI Checks:**
    - `avro-tools test` against live registry
    - Canary deployment via dedicated topic + compatibility tests

---

## 16. Conclusion

This comprehensive platform not only meets its functional goals but also adheres to standards ensuring robust performance, seamless scalability, and enterprise-level reliability without over-engineering or excessive cost.

---

* Document Version: 1.0
* Date: 2025-06-19
* Author: ArturChernets
