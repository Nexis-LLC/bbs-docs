## ADR 003: gRPC for Inter‑Service Communication (Over REST)

**Context:**  
Internal service‑to‑service calls (e.g. Booking → Seat, Booking → Payment) require low latency, strong typing, and bi‑directional streaming for seat‑hold workflows.

**Decision:**  
Adopt **gRPC** with Protocol Buffers for all internal RPCs. Expose REST only at the API Gateway boundary.

**Consequences:**
- **Pros:**
    - Faster serialization (Protobuf vs. JSON).
    - Built‑in streaming and deadlines.
    - Auto‑generated client/server stubs increase consistency.
- **Cons:**
    - Requires gateway translation layer for public HTTP APIs.
    - Additional operational tooling for load‑balancing gRPC (Envoy or Spring Cloud Gateway plugins).

---