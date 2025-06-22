# 5.1. API Contracts

## 1. Introduction to API Contracts

API Contracts serve as the definitive agreement between service consumers and providers, outlining the precise format, behavior, and expectations of each API endpoint. In the Bus Ticket Booking System, well-defined API contracts are crucial for enabling seamless integration, facilitating parallel development, and ensuring forward and backward compatibility as services evolve.

We utilize a contract-first approach, where API definitions are the primary source of truth, from which client stubs and server skeletons can be automatically generated. This minimizes discrepancies and promotes robust interoperability.

## 2. API Design Principles

Our API design adheres to the following principles:

* **Consistency:** Standardized naming conventions, error structures, and data types across all APIs.
* **Clarity:** Intuitive and self-describing endpoints and data models.
* **Completeness:** Contracts fully specify all possible inputs, outputs, and behaviors, including edge cases.
* **Evolvability:** Designed to support backward and forward compatibility, minimizing breaking changes.
* **Efficiency:** Optimized for performance, minimizing payload size and unnecessary network calls.
* **Security:** Incorporates authentication, authorization, and data integrity considerations from the ground up.

## 3. Types of APIs

The Bus Ticket Booking System exposes two primary types of APIs:

### 3.1. RESTful APIs

* **Purpose:** Primarily for external clients (e.g., web frontend, mobile apps) requiring easy integration via HTTP.
* **Format:** JSON over HTTP/1.1 or HTTP/2.
* **Versioning:** URI-based versioning (e.g., `/v1/bookings`). Changes that are not backward compatible will increment the major version. Minor updates (backward compatible additions) will be deployed without version change.
* **Authentication:** OAuth2/OIDC via Keycloak for user authentication and authorization.
* **Examples:**
    * **Booking Management:** `POST /v1/bookings`, `GET /v1/bookings/{id}`, `PUT /v1/bookings/{id}/cancel`
    * **Search and Inventory:** `GET /v1/routes`, `GET /v1/routes/{id}/availability`
    * **User Profiles:** `GET /v1/users/{id}`

### 3.2. gRPC APIs (Internal)

* **Purpose:** Primarily for inter-service communication within the microservices architecture. Provides high performance, efficient serialization (Protobuf), and strong type-checking.
* **Format:** Protobuf over HTTP/2.
* **Versioning:** Handled via Protobuf package names (e.g., `package com.example.bookings.v1;`). Major changes increment the package version. Backward compatibility is enforced via Schema Registry.
* **Authentication:** mTLS (Mutual TLS) for service-to-service authentication and JWT token propagation for user context.
* **Examples:**
    * **Seat Reservation Service:** `ReserveSeats`, `ReleaseSeats`
    * **Payment Gateway Integration:** `ProcessPayment`, `RefundPayment`
    * **Notification Service:** `SendEmailNotification`, `SendSMSNotification`

## 4. Contract Management and Governance

API contracts are managed as follows:

* **Centralized Repository:** All `.proto` files (for gRPC) and OpenAPI (Swagger) specifications (for REST) are maintained in a dedicated `api-contracts` Git repository.
* **Contract-First Development:** Development teams create or update contracts first, then generate code (stubs, skeletons) using tools like Protoc and OpenAPI Generator.
* **Automated Validation:** CI/CD pipelines include automated checks to:
    * Validate `.proto` files against Confluent Schema Registry for backward/forward compatibility.
    * Validate OpenAPI specifications for correctness and adherence to style guides.
    * Run integration tests against generated interfaces.
* **Documentation Generation:** Contracts are used to automatically generate up-to-date API documentation (e.g., Swagger UI, Docusaurus pages).

## 5. Security Considerations in API Contracts

API contracts explicitly define security-related parameters:

* **Authentication Mechanisms:** Specifies expected headers (e.g., `Authorization: Bearer <JWT>`).
* **Authorization Scopes/Roles:** Defines the required OAuth2 scopes or user roles for accessing specific endpoints/methods.
* **Input Validation:** Specifies data types, constraints, and regular expressions for all input fields to prevent injection attacks and ensure data integrity.
* **Sensitive Data Handling:** Clearly marks sensitive fields (e.g., PII, payment info) and outlines their encryption/masking requirements.

---

* Document Version: 1.0
* Date: 2025-06-22
* Author: ArturChernets
