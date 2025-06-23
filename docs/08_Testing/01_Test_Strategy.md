# Testing Strategy

This document defines the overall testing strategy for the Bus Ticket Booking Platform, covering unit, integration, E2E, and contract testing layers.

---

## 1. Goals

- Ensure system correctness and reliability across services
- Detect regressions quickly during development and CI
- Validate external service integrations (e.g., payments, notifications)

---

## 2. Testing Pyramid

```text
                [E2E Tests]       - Selenium + REST Assured
              ----------------
            [Integration Tests]  - TestContainers + MockServer
          --------------------
        [Unit Tests]             - JUnit + Mockito
      ------------------------
```

---

## 3. Test Types

### 3.1 Unit Tests

- **Framework**: JUnit 5 + Mockito
- **Scope**: Individual classes, no DB or network
- **Example**: Validate seat availability logic

### 3.2 Integration Tests

- **Framework**: JUnit + SpringBootTest + TestContainers
- **Scope**: Persistence (Postgres), messaging (Kafka), external APIs (Payment)
- **Isolation**: One container per service

### 3.3 Contract Tests

- **Tool**: Pact (consumer/provider)
- **Use case**: Validate API contracts between Booking & Payment service
- **CI/CD Step**: Provider verification before deployment

### 3.4 End-to-End Tests

- **Tools**: REST Assured, Selenium (optional)
- **Scope**: Full booking flow (search → book → pay → confirm)

---

## 4. Tooling

- **JUnit 5**: Primary test runner
- **Mockito**: Mocking dependencies
- **TestContainers**: Real containers for DB, Kafka, Redis
- **Pact**: API contract testing
- **Allure Report**: Unified reporting

---

## 5. Coverage

- **Target**: 85%+ statement coverage
- **Blocked builds** if < 60%
- **Exclusions**: DTOs, Configs

---

## 6. Best Practices

- Write meaningful test names and descriptions
- Use `@DisplayName`, `@Nested` classes
- Keep unit tests fast (< 100ms)
- Prefer constructor injection for better testability

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets