# External Service Resilience

This document outlines best practices to improve resilience and reliability when communicating with external services (e.g., PayPal, third-party APIs) in a Java Spring Boot environment.

---

## 1. Overview

Modern microservices often rely on external systems such as payment gateways, identity providers, or third-party APIs. These systems may fail or exhibit latency issues. Proper resilience strategies protect internal systems from cascading failures.

---

## 2. Common External Failures

- **Network timeouts** or DNS resolution issues
- **Rate limiting** or **throttling**
- **API schema changes**
- **Unavailability** (downtime or maintenance)
- **Slow responses** or high latency

---

## 3. Resilience Strategies

### 3.1 Timeout Configuration

- Use `RestTemplate`/`WebClient` with well-defined connection/read timeouts.
- Prevent hanging threads.

```java
WebClient.builder()
  .baseUrl("https://api.paypal.com")
  .clientConnector(new ReactorClientHttpConnector(
      HttpClient.create()
          .responseTimeout(Duration.ofSeconds(5))
  ))
  .build();
```

### 3.2 Retries (with Backoff)

- Use `RetryTemplate` or `resilience4j-retry` with exponential backoff.
- Avoid infinite retries — use `maxAttempts`.

```yaml
resilience4j.retry.instances.paypalRetry:
  maxAttempts: 3
  waitDuration: 2s
  exponentialBackoff:
    multiplier: 2.0
```

### 3.3 Circuit Breakers

- Prevent overload and cascading failures (see detailed file).
- Fallback to cached or default responses.

### 3.4 Isolation (Bulkheads)

- Use separate thread pools or queues for external service calls.

### 3.5 Monitoring & Alerts

- Set up alerts for elevated error rates or slow responses.
- Use tools like Prometheus + Grafana or ELK.

---

## 4. Fallback Scenarios

- Return default data (e.g., "Payment pending").
- Queue for retry or escalate to manual review.
- Log errors with correlation IDs.

---

## 5. Best Practices

- Validate third-party contracts with **contract tests**.
- Simulate outages using **chaos engineering**.
- Use **API gateways** to apply policies centrally.

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets