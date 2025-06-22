# 5.2. Error Handling

## 1. Overview

Effective and standardized error handling ensures that clients can reliably interpret and respond to API failures. This document outlines the error structure, categorization, and handling approach for both RESTful and gRPC APIs in the **Bus Ticket Booking System**.

---

## 2. REST API Error Format

All error responses in REST APIs follow a consistent JSON structure:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "value",
    "...": "..."
  }
}
```

### 2.1. Fields

- **error** (string): Human-readable error message.
- **code** (string): Machine-readable error code in uppercase snake_case.
- **details** (object, optional): Field-specific validation errors or contextual metadata.

### 2.2. Example

```json
{
  "error": "Invalid request payload",
  "code": "INVALID_INPUT",
  "details": {
    "seatId": "Seat already booked"
  }
}
```

---

## 3. Common REST Error Codes

| HTTP Status | Error Code             | Description                                      |
|-------------|------------------------|--------------------------------------------------|
| 400         | `INVALID_INPUT`        | Malformed or semantically invalid request body   |
| 401         | `UNAUTHORIZED`         | Missing or invalid authentication token          |
| 403         | `FORBIDDEN`            | Insufficient permissions for requested action    |
| 404         | `NOT_FOUND`            | Requested resource does not exist                |
| 409         | `CONFLICT`             | Business logic conflict (e.g., already cancelled)|
| 422         | `VALIDATION_FAILED`    | Input passes schema but fails business rules     |
| 500         | `INTERNAL_ERROR`       | Unexpected server-side error                     |

---

## 4. gRPC Error Handling

In gRPC, errors are returned using status codes and metadata. The structure follows Google’s [`Status`](https://grpc.github.io/grpc/core/md_doc_statuscodes.html) model.

### 4.1. Mapping to HTTP

| gRPC Code          | Equivalent HTTP | Typical Use Case                                |
|--------------------|------------------|--------------------------------------------------|
| `INVALID_ARGUMENT` | 400              | Invalid request input                            |
| `UNAUTHENTICATED`  | 401              | Missing/invalid credentials                      |
| `PERMISSION_DENIED`| 403              | Not authorized                                   |
| `NOT_FOUND`        | 404              | Resource does not exist                          |
| `ALREADY_EXISTS`   | 409              | Duplicate resource or logical conflict           |
| `INTERNAL`         | 500              | Server-side processing failure                   |

### 4.2. Error Payload (via `google.rpc.Status`)

```proto
message Status {
  int32 code = 1;
  string message = 2;
  repeated google.protobuf.Any details = 3;
}
```

---

## 5. Guidelines for API Developers

- Always return specific, actionable error messages.
- Use appropriate status codes and avoid 200 responses for failed operations.
- For validation errors, include the field name and issue in the `details` object.
- Mask sensitive system errors from clients (log detailed info server-side only).
- Avoid exposing internal stack traces or database errors in responses.

---

## 6. Error Logging and Monitoring

All error responses (4xx and 5xx) are:

- Logged centrally via the logging service (e.g., ELK stack).
- Tagged with correlation/request IDs for traceability.
- Monitored via alerts for abnormal error rate patterns.

---

* Document Version: 1.0
* Date: 2025-06-22
* Author: ArturChernets
