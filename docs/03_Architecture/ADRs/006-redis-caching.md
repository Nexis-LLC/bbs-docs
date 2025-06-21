## ADR 006: Redis for Caching & Idempotency (Over In‑Memory Only)

**Context:**  
We need a low‑latency cache for seat‑map lookups and a shared store for idempotency keys across pods.

**Decision:**  
Deploy a **Redis** cluster (with TTL, LRU eviction) for read cache and idempotency, leveraging Redlock for stampede protection.

**Consequences:**
- **Pros:**
    - Sub‑millisecond reads/writes, TTL controls staleness.
    - Centralized idempotency store shared by all instances.
- **Cons:**
    - Single additional datastore to operate and monitor.
    - Potential for cache‑miss thundering without proper mutexing.

---