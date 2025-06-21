## ADR 005: PostgreSQL as Primary Data Store (Over NoSQL)

**Context:**  
Booking data requires ACID transactions, strong consistency (no overbooking), and relational queries (joins for reporting).

**Decision:**  
Use **PostgreSQL** (managed via Patroni + etcd for HA) as the system of record for all transactional data.

**Consequences:**
- **Pros:**
    - Proven ACID guarantees, rich SQL features, row‑level locking for optimistic concurrency.
    - Easy integration with Liquibase for schema migrations.
- **Cons:**
    - Scaling write throughput requires vertical scaling or sharding strategies.
    - Requires operational overhead for HA (Patroni) and backups (PITR).

---