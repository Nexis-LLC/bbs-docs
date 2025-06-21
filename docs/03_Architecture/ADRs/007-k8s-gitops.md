## ADR 007: Kubernetes + GitOps (ArgoCD & Helm) for Deployment

**Context:**  
We need repeatable, standardized, and auditable deployments with easy rollbacks and autoscaling.

**Decision:**  
Use **Kubernetes** for orchestration, **Helm** charts for templating, and **ArgoCD** for continuous deployment via GitOps.

**Consequences:**
- **Pros:**
    - Declarative infra-as-code, Git‑driven audit trail.
    - Easy rollbacks by reverting Git commits.
    - Native HPA/KEDA autoscaling on CPU and Kafka lag.
- **Cons:**
    - Learning curve for Helm templating best practices.
    - ArgoCD operator maintenance and cluster permissions.

---