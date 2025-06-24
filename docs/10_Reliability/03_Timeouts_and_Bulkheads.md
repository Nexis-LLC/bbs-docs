# Timeouts and Bulkheads

This document describes best practices for implementing **timeouts**, **bulkheads**, and **fault isolation** to improve service resilience in a Spring Boot microservice architecture.

---

## Overview

Modern distributed systems are vulnerable to cascading failures. Implementing **timeouts**, **bulkheads**, and **isolation strategies** helps prevent systemic outages by ensuring that failures in one component do not overwhelm others.

This document is focused on:

- **Timeouts**: To prevent thread blocking from long operations.
- **Bulkheads**: To isolate failures and limit concurrency.
- **Isolation patterns**: To ensure high availability and resilience under load.

---

## 1. Timeout Strategy

### 1.1 HTTP Client (RestTemplate/WebClient)

Use `WebClient` (or `RestTemplate`) with proper timeout configurations.

#### WebClient Example:

```java
@Bean
public WebClient webClient() {
    return WebClient.builder()
        .clientConnector(new ReactorClientHttpConnector(
            HttpClient.create()
                .responseTimeout(Duration.ofSeconds(3))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 1000)
        ))
        .build();
}
```

### 1.2 Feign Clients

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 1000
        readTimeout: 3000
```

### 1.3 Database

Use connection and query timeouts in the connection pool:

```properties
spring.datasource.hikari.connection-timeout=3000
spring.datasource.hikari.validation-timeout=1000
```

---

## 2. Bulkhead Patterns

### 2.1 Thread Pool Isolation

Using [Resilience4j Bulkhead](https://resilience4j.readme.io/docs/bulkhead).

```java
@Bulkhead(name = "externalService", type = Bulkhead.Type.THREADPOOL)
public String callExternalService() {
    return externalApi.call();
}
```

Configure the pool in `application.yml`:

```yaml
resilience4j.bulkhead:
  instances:
    externalService:
      maxConcurrentCalls: 10
      maxWaitDuration: 500ms
```

### 2.2 Semaphore Bulkhead

Limits concurrent executions using semaphores:

```java
@Bulkhead(name = "limitedService", type = Bulkhead.Type.SEMAPHORE)
public String callLimitedService() {
    return anotherCall();
}
```

---

## 3. Isolation Techniques

### 3.1 Circuit Breakers

Combine bulkheads with circuit breakers (see `Resilience4j`):

```java
@CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
@Bulkhead(name = "externalApi", type = Bulkhead.Type.THREADPOOL)
public String fetchData() {
    return externalService.get();
}
```

### 3.2 Async Isolation

Use async patterns to release calling threads:

```java
@Async
public CompletableFuture<String> fetchData() {
    return CompletableFuture.completedFuture(externalApi.get());
}
```

---

## 4. Best Practices

- Always configure timeouts for **external API calls**, **DB queries**, and **message brokers**.
- Use **Resilience4j** or **Spring Cloud Circuit Breaker** for bulkhead and timeout patterns.
- Use **separate thread pools** for each external dependency.
- Apply **fallback methods** to gracefully degrade service.

---

## 5. Monitoring

- Monitor timeout exceptions, rejected calls, and fallback invocations via **Micrometer**.
- Alert on sustained circuit breaker open states or thread pool exhaustion.

---

* Document Version: 1.0
* Date: 2025-06-24
* Author: ArturChernets
