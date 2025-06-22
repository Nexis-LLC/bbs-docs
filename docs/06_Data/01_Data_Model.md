# Data Model: Logical Schema

This document defines the **logical data model** for the Bus Ticket Booking System, including ER diagrams and schemas.

---

## 1. Entity Relationship Diagram

```plaintext
[User] 1—* [Booking] *—1 [Route]
           1                  1
           |                  |
           1                  *
         [Payment]         [Seat]
```

---

## 2. Table Definitions

### `users`

| Column       | Type         | Constraints              |
| ------------ | ------------ | ------------------------ |
| id           | UUID         | PK                       |
| email        | VARCHAR(255) | UNIQUE, NOT NULL         |
| password     | VARCHAR(255) | NOT NULL                 |
| role         | VARCHAR(50)  | DEFAULT 'USER'           |
| created_at   | TIMESTAMPTZ  | DEFAULT now()            |

### `routes`

| Column        | Type         | Constraints |
| ------------- | ------------ | ----------- |
| id            | UUID         | PK          |
| origin        | VARCHAR(100) | NOT NULL    |
| destination   | VARCHAR(100) | NOT NULL    |
| departure     | TIMESTAMPTZ  | NOT NULL    |
| arrival       | TIMESTAMPTZ  | NOT NULL    |

### `seats`

| Column     | Type        | Constraints                 |
| ---------- | ----------- | --------------------------- |
| id         | UUID        | PK                          |
| route_id   | UUID        | FK → `routes(id)`, NOT NULL |
| number     | VARCHAR(10) | NOT NULL                    |
| locked     | BOOLEAN     | DEFAULT false               |

### `bookings`

| Column       | Type        | Constraints                                         |
| ------------ | ----------- | --------------------------------------------------- |
| id           | UUID        | PK                                                  |
| user_id      | UUID        | FK → `users(id)`, NOT NULL                          |
| route_id     | UUID        | FK → `routes(id)`, NOT NULL                         |
| seat_id      | UUID        | FK → `seats(id)`, NOT NULL                          |
| state        | VARCHAR(20) | CHECK (state IN (...)), NOT NULL, DEFAULT 'PENDING' |
| created_at   | TIMESTAMPTZ | DEFAULT now()                                       |

### `payments`

| Column       | Type          | Constraints                                          |
| ------------ | ------------- | ---------------------------------------------------- |
| id           | UUID          | PK                                                   |
| booking_id   | UUID          | FK → `bookings(id)`, NOT NULL                        |
| amount       | NUMERIC(10,2) | NOT NULL                                             |
| status       | VARCHAR(20)   | CHECK (status IN (...)), NOT NULL, DEFAULT 'PENDING' |
| gateway_id   | VARCHAR(255)  | External payment reference                           |
| created_at   | TIMESTAMPTZ   | DEFAULT now()                                        |

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets