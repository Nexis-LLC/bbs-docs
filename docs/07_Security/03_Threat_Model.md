# Threat Model

This document presents the **threat model** for the Bus Ticket Booking System, identifying assets, threat agents, and mitigations.

---

## 1. Assets

- **User Data**: Personal and booking information
- **Payment Data**: Transaction records
- **Credentials**: JWT tokens, OAuth secrets
- **Infrastructure**: Databases, message brokers

---

## 2. Threat Agents

- **External Attackers**: Internet-based adversaries
- **Malicious Insiders**: Compromised credentials
- **Third-Party Services**: Compromise or misconfiguration of Keycloak, DB

---

## 3. Threat Scenarios & Mitigations

| Threat                                   | Impact                   | Mitigation                                              |
|------------------------------------------|--------------------------|---------------------------------------------------------|
| JWT token theft                          | Unauthorized access      | Use HTTPS, short-lived tokens, rotate signing keys      |
| SQL Injection                            | Data leakage/corruption  | Use JPA/Hibernate with parameterized queries            |
| Secret leakage                           | Full system compromise   | SOPS + Sealed Secrets, strict RBAC, audit logging      |
| DDoS on booking endpoints                | Denial of service        | Rate limiting, autoscaling, WAF                         |
| Misconfigured roles in Keycloak          | Privilege escalation     | Periodic role audits, least-privilege principle        |

---

## 4. Risk Ranking

- **High**: Token theft, privilege escalation
- **Medium**: DDoS, database overload
- **Low**: Third-party outage, network latency

---

## 5. Continuous Review

- Update threat model every quarter or after major changes
- Conduct security reviews and penetration tests

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets
