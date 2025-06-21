## ADR 004: Saga Pattern for Distributed Transactions (Over Two‑Phase Commit)

**Context:**  
Booking + Payment + Seat Inventory updates span multiple services and databases. Two‑phase commit is heavyweight and brittle in microservices.

**Decision:**  
Implement a **Saga orchestration** using Kafka events and idempotent compensating actions.

**Consequences:**
- **Pros:**
    - Loosely coupled services, asynchronous flows, better failure isolation.
    - Avoids global locks or blocking transactions across services.
- **Cons:**
    - Added complexity in defining compensating actions.
    - Harder to reason about end‑to‑end state; requires careful monitoring and retry logic.

---