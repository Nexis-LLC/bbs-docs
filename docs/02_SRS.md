# Software Requirements Specification (SRS)
## Bus Ticket Booking System

---

**1. Introduction**

**1.1 Purpose**

This document rigorously outlines the functional and non-functional requirements for a **Real-Time High-Load Bus Ticket Booking System**. The system is engineered to concurrently serve **over 10,000 users** with stringent performance targets: **sub-second end-to-end latency (p99)**, a minimum **99.99% monthly uptime**, and a firm commitment to **zero overbooking**. This specification serves as the definitive guide for the development, testing, and deployment of the system.

**1.2 Scope**

The system will provide the following core capabilities:

- **Real-time seat inventory management:** Accurate and up-to-the-second tracking of seat availability.
- **Secure payments:** Integration with PayPal for processing online transactions.
- **Automated scaling:** Dynamic adjustment of resources to handle varying loads.
- **Fault tolerance:** Mechanisms to ensure system resilience and minimize downtime.
- **Centralized observability:** Comprehensive monitoring and logging for system health and performance analysis.

**Explicitly Excluded from Scope:**

- **Multi-region active-active deployment:** Distribution of the system across multiple geographically dispersed data centers for enhanced availability.
- **AI-driven demand forecasting:** Predictive analytics to anticipate future booking trends and optimize resource allocation.

---

**2. System Overview**

**2.1 Key Features**

1.  **Real-Time Seat Booking:** Ensures atomic reservation of seats utilizing optimistic locking mechanisms to maintain data consistency under high concurrency.
2.  **Resilient Payments:** Implements idempotent payment transactions through PayPal integration, preventing duplicate charges and ensuring reliable processing.
3.  **Horizontal Autoscaling:** Leverages Kubernetes to automatically scale the number of application instances based on demand.
4.  **Comprehensive Observability:** Integrates a robust observability stack including:
    * **Logs:** ELK (Elasticsearch, Logstash, Kibana) for centralized log aggregation and analysis.
    * **Metrics:** Prometheus and Grafana for collecting and visualizing key performance indicators.
    * **Tracing:** Zipkin for distributed transaction tracing to identify performance bottlenecks.

**2.2 User Roles**

| **Role** | **Description** |
| :--------------- | :---------------------------------------------------------------------------- |
| **Traveler** | End-user who can browse routes, view seat availability, book seats, make online payments, and manage their tickets. |
| **Bus Operator** | System user responsible for managing bus routes, defining seat configurations, setting pricing, and viewing booking statistics. |
| **Administrator** | System operator with privileges to monitor overall system health, configure security policies, and manage user roles and permissions. |

---

**3. Functional Requirements**

**3.1 Seat Reservation**

| **ID** | **Requirement** | **Priority** | **Notes** |
| :------ | :---------------------------------------------------------------------------- | :----------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **FR1** | Travelers shall be able to reserve seats in real-time via a low-latency gRPC API. | **High** | The gRPC API should be designed for high performance and efficiency to handle concurrent booking requests.                             |
| **FR2** | The system shall maintain a near real-time cache of seat inventory in Redis with a Time-To-Live (TTL) of 5 seconds to minimize direct load on the PostgreSQL database. | **High** | The caching strategy should balance data freshness with read performance. Consider cache invalidation strategies for critical updates. |
| **FR3** | The system shall prevent overbooking of seats using PostgreSQL row-level locks to ensure data integrity during concurrent reservations. | **Critical** | Row-level locks should be implemented efficiently to minimize contention and impact on overall performance.                                 |

**3.2 Payment Processing**

| **ID** | **Requirement** | **Priority** | **Notes** |
| :------ | :---------------------------------------------------------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR4** | Travelers shall be able to make payments securely via PayPal. All payment transactions must be idempotent, with idempotency keys stored in Redis to prevent duplicate charges. | **High** | The PayPal integration should adhere to security best practices. Idempotency keys should have an appropriate expiration policy.                                                              |
| **FR5** | In the event of a failed payment, the system shall automatically initiate a refund process using the Saga pattern to ensure eventual consistency across involved services (e.g., booking and payment). | **Medium** | The Saga pattern implementation should handle potential compensation transactions and failure scenarios gracefully. Define clear steps and error handling within the Saga. |

**3.3 System Administration**

| **ID** | **Requirement** | **Priority** | **Notes** |
| :------ | :---------------------------------------------------------------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR6** | Administrators shall be able to manage Role-Based Access Control (RBAC) roles and permissions for system users through integration with Keycloak using OAuth2/OIDC protocols. | **High** | Keycloak integration should be seamless and secure. Define the specific roles and their associated permissions.                                                                                               |
| **FR7** | Administrators shall have the ability to monitor key system metrics (e.g., API latency, Kafka consumer lag, CPU/memory utilization) in Grafana to gain insights into system performance and health. | **Medium** | Define the specific metrics that need to be monitored and the thresholds for alerts. Grafana dashboards should be intuitive and provide actionable information.                                      |

---

**4. Non-Functional Requirements**

**4.1 Performance**

| **ID** | **Requirement** | **Metric** | **Notes** |
| :------- | :---------------------------------------------------------------------------- | :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR1** | The 99th percentile (p99) of the API response time for seat reservation and payment initiation endpoints shall be less than 300 milliseconds under a sustained load of 500 requests per second per application pod. | **p99 < 300ms @ 500 req/sec/pod** | Performance testing should be conducted under realistic load conditions to validate this requirement.                                      |
| **NFR2** | End-to-end latency for seat inventory updates propagated via Kafka shall be less than 1 second under normal operating conditions. | **E2E Latency < 1s** | This includes the time taken for an update to be produced, transmitted, and consumed by relevant services.                                                 |

**4.2 Scalability**

| **ID** | **Requirement** | **Metric** | **Notes** |
| :------- | :---------------------------------------------------------------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR3** | The system shall be capable of automatically scaling horizontally from a baseline of 5 pods to a maximum of 50 pods based on CPU utilization and Kafka consumer lag metrics, utilizing KEDA (Kubernetes Event-driven Autoscaling). | **Scale from 5 to 50 pods** | Define the specific CPU utilization and Kafka lag thresholds that trigger scaling events. Ensure that the scaling process is efficient and does not negatively impact performance during scaling operations. |

**4.3 Reliability**

| **ID** | **Requirement** | **Metric** | **Notes** |
| :------- | :---------------------------------------------------------------------------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR4** | The system shall achieve a monthly uptime of at least 99.99%, allowing for a maximum of approximately 4.3 minutes of unscheduled downtime per month. | **Uptime ≥ 99.99% (≤ 4.3 mins downtime/month)** | Implement robust monitoring, alerting, and automated recovery mechanisms to meet this stringent availability target. Consider redundancy at various levels.                                                                 |
| **NFR5** | In the event of a pod failure, the Kubernetes orchestration platform shall automatically restart the failed pod within 30 seconds to minimize service disruption. | **Auto-restart within 30s** | Configure appropriate liveness and readiness probes for the Kubernetes pods to enable timely detection and recovery from failures.                                                                                                |

**4.4 Security**

| **ID** | **Requirement** | **Implementation** | **Notes** |
| :------- | :---------------------------------------------------------------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR6** | All internal and external APIs shall enforce JWT (JSON Web Token) validation for authentication and authorization, leveraging Keycloak as the identity provider and adhering to OAuth2/OIDC flows. | **JWT Validation (Keycloak/OAuth2/OIDC)** | Secure all API endpoints to prevent unauthorized access. Implement proper token generation, signing, and verification mechanisms. Regularly review and update security configurations.                                                                                                |
| **NFR7** | All sensitive secrets, including database passwords and third-party API keys, shall be securely encrypted at rest using SOPS (Secrets OPerationS) and managed as Kubernetes Secrets. | **SOPS + Kubernetes Secrets** | Implement a secure workflow for managing and accessing secrets. Ensure that secrets are never hardcoded in the application code or configuration files. Regularly rotate sensitive secrets as a security best practice. |

---

**5. External Interfaces**

**5.1 User Interfaces**

-   **Traveler Web/Mobile Application:** Provides a user-friendly interface for browsing bus routes, viewing interactive seat maps (built with React.js), filling out booking details, and completing payments through an integrated PayPal SDK.
-   **Administrator Dashboard:** A web-based interface (built with Grafana) for visualizing system metrics and dashboards, and Kibana for searching and analyzing aggregated logs.

**5.2 APIs**

-   **gRPC Endpoints:** High-performance, low-latency endpoints for core functionalities such as real-time seat reservation and initiating payment transactions.
-   **REST APIs:** Standardized HTTP-based endpoints for administrative operations, including user management and bus route configuration.

**5.3 Data Storage**

-   **PostgreSQL:** A relational database management system providing ACID (Atomicity, Consistency, Isolation, Durability) compliant transactions for managing core booking data and ensuring data integrity.
-   **Redis:** An in-memory data store used as a high-speed cache for seat availability information and for storing idempotency keys to ensure reliable payment processing.
-   **Kafka:** A distributed event streaming platform used as the backbone for asynchronous communication of seat updates and payment events between different services.

---

**6. System Constraints**

-   **Budget:** The project aims to minimize the use of paid third-party tools. As an example, Sealed Secrets will be preferred over HashiCorp Vault for managing secrets in Kubernetes.
-   **Deployment Environment:** The initial deployment will be within a single cloud region (either AWS or GCP) to manage complexity during the initial phase.
-   **Compliance Requirements:** The system must adhere to GDPR regulations for handling personal data of EU users and comply with PCI-DSS standards for processing payment information.

---

**7. Assumptions & Dependencies**

-   **Assumption 1:** The PayPal API will maintain a minimum availability of 99.95%.
-   **Dependency 1:** A fully managed Kubernetes cluster (e.g., AWS EKS or Google GKE) will be provisioned and maintained by the cloud provider.
-   **Dependency 2:** A properly configured and accessible Keycloak server will be available for identity and access management.

---

* Document Version: 1.0
* Date: 2025-06-19
* Author: ArturChernets