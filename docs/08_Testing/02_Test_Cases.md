# Testing Cases

This document outlines core functional and edge test cases across services.

---

## 1. User Service

| ID   | Test Description                  | Type     |
| ---- | --------------------------------- | -------- |
| U001 | Register with valid email/pass   | Unit     |
| U002 | Register with existing email     | Unit     |
| U003 | Login with correct credentials   | Unit     |
| U004 | Login with wrong password        | Unit     |
| U005 | JWT token expiration             | Unit     |

---

## 2. Booking Service

| ID   | Test Description                              | Type           |
| ---- | --------------------------------------------- | -------------- |
| B001 | Book seat on available route                  | Integration    |
| B002 | Book same seat twice                          | Integration    |
| B003 | Booking timeout (no payment in 15 mins)       | Unit + E2E     |
| B004 | Cancel confirmed booking                      | Integration    |
| B005 | Retry failed booking                          | Unit           |

---

## 3. Payment Service

| ID   | Test Description                     | Type        |
| ---- | ------------------------------------ | ----------- |
| P001 | Initiate payment and succeed         | E2E         |
| P002 | Payment fails due to gateway timeout | Integration |
| P003 | Refund confirmed payment             | Integration |
| P004 | Invalid booking ID on payment        | Unit        |

---

## 4. Notifications

| ID   | Test Description                         | Type       |
| ---- | ---------------------------------------- | ---------- |
| N001 | Email sent on booking confirmation       | Integration |
| N002 | SMS fallback when email fails            | Integration |
| N003 | Handle external API outage gracefully    | Unit        |

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets