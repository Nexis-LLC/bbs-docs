# Circuit Breakers & Retries

This document describes how to implement circuit breakers and retry policies to enhance service resilience in Spring Boot microservices.

---

## 1. Overview

Circuit breakers prevent a system from repeatedly trying a failing service, while retries offer a second chance for transient failures. Together, they guard against resource exhaustion and cascading failures.

---

## 2. Retry Strategy

### Spring Retry (with annotations)

```java
@Retryable(
  value = { HttpServerErrorException.class },
  maxAttempts = 3,
  backoff = @Backoff(delay = 2000, multiplier = 2)
)
public String callPaymentService() {
    return restTemplate.getForObject(PAYMENT_URL, String.class);
}
```

### RetryTemplate (Programmatic)

```java
RetryTemplate retryTemplate = new RetryTemplate();
// configure policy...
String result = retryTemplate.execute(ctx -> externalService.call());
```

---

## 3. Circuit Breaker Strategy

### Resilience4j

Add dependency:

```xml
<dependency>
  <groupId>io.github.resilience4j</groupId>
  <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

Configuration:

```yaml
resilience4j.circuitbreaker.instances.paymentService:
  registerHealthIndicator: true
  slidingWindowSize: 10
  failureRateThreshold: 50
  waitDurationInOpenState: 10s
  permittedNumberOfCallsInHalfOpenState: 3
```

Annotation-based usage:

```java
@CircuitBreaker(name = "paymentService", fallbackMethod = "fallback")
public String callPayment() {
    return webClient.get().uri("/pay").retrieve().bodyToMono(String.class).block();
}
```

Fallback method:

```java
public String fallback(Throwable t) {
    return "Payment service unavailable. Please try later.";
}
```

---

## 4. Metrics and Observability

- Use Micrometer + Prometheus to monitor circuit breaker states.
- Trigger alerts on high failure rates.

---

## 5. Best Practices

- Combine circuit breakers with **timeouts** and **bulkheads**.
- Separate circuit breaker configs per external dependency.
- Avoid retry storms (apply jitter and limits).

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets