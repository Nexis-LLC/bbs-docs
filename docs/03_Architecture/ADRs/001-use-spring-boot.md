## ADR 001: Use Java & Spring Boot for Microservices

**Context:**  
We need a mature, performant, and battle‑tested framework for building multiple domain‑driven microservices (Booking, Payment, Seat, User, etc.). Teams are familiar with JVM ecosystems.

**Decision:**  
Adopt **Java 21** and **Spring Boot** (with Spring Cloud for service discovery, configuration, and gateway) as our primary application framework.

**Consequences:**
- **Pros:**
    - Excellent ecosystem (Spring Cloud, Spring Security, Spring Data).
    - Strong community support, rich libraries, long‑term stability.
    - Native integration with monitoring (Micrometer) and tracing (Spring Cloud Sleuth / Zipkin).
- **Cons:**
    - Higher memory footprint than Go/Node.
    - Slightly longer startup times.

---