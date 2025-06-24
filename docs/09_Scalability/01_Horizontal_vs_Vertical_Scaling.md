# Horizontal vs Vertical Scaling

This document explains the key differences, trade-offs, and recommendations for horizontal and vertical scaling, specifically within a Spring Boot + Kubernetes microservice architecture.

---

## Vertical Scaling (Scale-Up)

**Definition:** Increase the capacity (CPU, RAM, IOPS) of a single machine or container.

### Advantages
- Easier to implement (especially for legacy systems).
- Useful for single-node databases or monoliths.
- Requires fewer nodes = lower overhead in networking.

### Disadvantages
- Hardware limits: can't scale indefinitely.
- Downtime required for upgrades.
- Cost grows non-linearly with power.

### Spring Boot Context:
Vertical scaling might be useful for legacy Spring Boot monoliths or stateful components like a PostgreSQL master node.

---

## Horizontal Scaling (Scale-Out)

**Definition:** Add more instances (pods, containers, servers) to handle more load.

### Advantages
- Near-infinite scalability in Kubernetes.
- Redundancy & fault tolerance.
- Easier to autoscale and load balance.

### Disadvantages
- More complex orchestration (requires service discovery, coordination).
- Stateful workloads require externalizing state.

### Spring Boot Context:
Stateless Spring Boot microservices are ideal for horizontal scaling. Use:
- Kubernetes Deployments + HorizontalPodAutoscaler
- Spring Cloud LoadBalancer / Eureka if needed

---

## Practical Recommendations

| Component        | Scaling Strategy     | Notes |
|------------------|----------------------|-------|
| Spring Boot App  | Horizontal           | Stateless, autoscale with metrics |
| PostgreSQL       | Vertical + Read Replicas | Master node scales vertically |
| Redis            | Horizontal           | Use clustering, partitioning |
| Kafka            | Horizontal           | Partition-based scaling |
| REST APIs        | Horizontal           | Behind ingress with load balancing |

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets
