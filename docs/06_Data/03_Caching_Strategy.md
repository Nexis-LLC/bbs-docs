# Caching Strategy: Redis & App-level

This document outlines the **caching layers** and patterns to optimize performance while ensuring data consistency.

---

## 1. Cache Layers

1. **Redis Read Cache**

    - Stores seat availability for quick `CheckAvailability` responses.
    - **TTL**: 10 seconds to limit staleness.
    - **Key**: `seat:{seat_id}` → `{ "available": true/false }`.

2. **Application-Level Cache**

    - Local in‑memory cache (e.g., Caffeine, Guava) for hot routes.
    - **TTL**: 1 minute; **Max Size**: 1000 entries.

---

## 2. Caching Patterns

### 2.1. Cache-Aside Pattern

```plaintext
Application:
  on request:
    value = cache.get(key)
    if value == null:
      value = database.read(key)
      cache.put(key, value, TTL)
    return value
```

### 2.2. Cache Stampede Protection

- **Mutex Lock**: Use Redis `SETNX` to lock on cache miss.
- **Request Coalescing**: Use fallback TTL for stale responses.

---

## 3. Consistency & Invalidation

- **Eviction**: LRU policy with TTL and size limits.
- **Invalidation**: On seat lock/unlock, delete `seat:{seat_id}` key.
- **Write-Through**: Cache updated after DB transaction commit.

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets