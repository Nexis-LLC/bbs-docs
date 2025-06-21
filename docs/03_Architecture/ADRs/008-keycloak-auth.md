## ADR 008: Keycloak for Identity & Access (Over Custom Auth)

**Context:**  
We require standardized OAuth2/OIDC flows, RBAC, multi‑tenant identity, and LDAP integration.

**Decision:**  
Deploy **Keycloak** as our centralized Identity Provider, integrating with Spring Security.

**Consequences:**
- **Pros:**
    - Off‑the‑shelf support for OAuth2, OIDC, RBAC, social logins, and LDAP.
    - GUI admin console for realm and user management.
- **Cons:**
    - Another stateful service to operate.
    - Requires custom theming and hardening for production.

---