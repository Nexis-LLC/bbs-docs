# Cache and Queue Scaling

Guidelines for horizontally scaling cache and queue systems used in high-load Java Spring Boot systems.

---

## Cache (Redis)

### Scaling Options:
- **Clustering**: Partition keys across Redis nodes.
- **Read Replicas**: For heavy read scenarios.
- **Eviction Policy**: Set `maxmemory-policy` wisely.

### Spring Boot Integration:
```yaml
spring:
  cache:
    type: redis
  redis:
    host: redis-cluster
```

Use Spring Cache abstraction with RedisTemplate or Lettuce client.

---

## Message Queues (Kafka / RabbitMQ)

### Kafka Scaling:

| Dimension | Strategy                    |
|----------|-----------------------------|
| Producer | Increase batch size, acks   |
| Broker   | Add brokers, balance load   |
| Consumer | Increase partitions         |

> Spring Boot integrates via `spring-kafka`.

### RabbitMQ Scaling:
- Use quorum queues for HA.
- Separate workloads via routing keys.
- Horizontal scale via federation / sharding plugin.

---

## Tips

- Redis: `INFO stats`, eviction rate, latency.
- Kafka: lag per partition, consumer group metrics.
- Alert on queue length and retry spikes.

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets
