# Authorization (RBAC)

This document describes **authorization** within the backend using Role-Based Access Control (RBAC).

---

## 1. Role-Based Access Control

- **Roles** are managed in Keycloak and mapped to Spring Security authorities.
- **Role Hierarchy** (optional): `ADMIN` > `USER`.

---

## 2. Spring Security Configuration

```java
@EnableWebSecurity
public class AuthorizationConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .authorizeHttpRequests(auth -> auth
            .requestMatchers("/health", "/docs/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/bookings/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
          )
          .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

---

## 3. Method-Level Security

- Enable with `@EnableGlobalMethodSecurity(prePostEnabled = true)`
- Annotate service methods:

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(UUID userId) { ... }

@PreAuthorize("hasRole('USER')")
public Booking getBooking(UUID bookingId) { ... }
```

---

## 4. Keycloak Role Mapping

- In Keycloak, assign roles to users or groups
- Token contains `realm_access.roles` claim
- Spring Security auto-converts roles to `ROLE_*` authorities

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets
