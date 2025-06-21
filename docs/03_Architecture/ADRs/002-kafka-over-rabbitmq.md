## ADR 002: Kafka for Event Streaming (Over RabbitMQ)

**Context:**  
We require high‑throughput, durable, ordered event streaming for seat inventory updates, payment status events, and saga orchestration.

**Decision:**  
Use **Apache Kafka** as our event backbone, with Confluent Schema Registry & Avro for schema governance.

**Consequences:**
- **Pros:**
    - Extremely high throughput (millions of messages/sec).
    - Native support for consumer groups, partitioning, exactly‑once semantics (idempotent producers).
    - Mature ecosystem: MirrorMaker 2.0 for DR, stream processing options (Kafka Streams).
- **Cons:**
    - Operational complexity: KRaft, cluster sizing, retention policies.
    - Slightly higher learning curve vs. RabbitMQ.

---