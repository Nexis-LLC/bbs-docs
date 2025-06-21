# CI/CD Pipeline Design

This document outlines the **GitHub Actions** and **ArgoCD**-based CI/CD pipeline for the Bus Ticket Booking System. The pipeline is designed to meet standards for reliability, security, and developer productivity.

---

## Table of Contents

1. [CI (Continuous Integration)](#ci-continuous-integration)

    * Linting & Static Analysis
    * Unit & Integration Testing
    * Dependency Scanning
    * Build & Containerization
    * Artifact Publishing
2. [CD (Continuous Delivery) & GitOps](#cd-continuous-delivery--gitops)

    * Git Branching Strategy
    * Deployment Manifests & Helm Charts
    * ArgoCD Application Definitions
    * Promotion & Rollback Policies
3. [Security & Compliance](#security--compliance)
4. [Observability & Notifications](#observability--notifications)
5. [Best Practices](#best-practices)

---

## CI (Continuous Integration)

The GitHub Actions workflow (`.github/workflows/ci.yml`) is triggered on every pull request and push to `main`.

### 1. Linting & Static Analysis

* **Spring Boot Projects**: Use [Checkstyle](https://checkstyle.org/) and [SpotBugs](https://spotbugs.github.io/).
* **Workflow Step**:

  ```yaml
  - name: Check code style
    uses: actions/setup-java@v3
    with:
      distribution: 'temurin'
      java-version: '21'
  - run: mvn verify -Pcheckstyle,spotbugs
  ```

### 2. Unit & Integration Testing

* **Unit Tests**: JUnit 5 + Mockito.
* **Integration Tests**: Testcontainers for PostgreSQL, Redis, Kafka.
* **Coverage Gate**: Minimum 80% line coverage enforced.
* **Workflow Step**:

  ```yaml
  - name: Run tests
    run: mvn test
  - name: Enforce coverage
    run: mvn jacoco:check
  ```

### 3. Dependency Scanning

* **Dependabot**: Automated pull requests for dependency upgrades.
* **OSS Security**: Use [GitHub’s `reviewdog`](https://github.com/reviewdog/reviewdog) integration with [Snyk CLI](https://snyk.io/docs/using-snyk/cli).
* **Workflow Step**:

  ```yaml
  - name: Run Snyk scan
    uses: snyk/actions/java@master
    with:
      args: test --severity-threshold=high
  ```

### 4. Build & Containerization

* **Build Artifacts**: `mvn package` produces JARs.
* **Container Image**: Build with [Docker Buildx](https://docs.docker.com/engine/reference/commandline/buildx/) for multi-arch support.
* **Tagged Images**: `${{ github.sha }}` for PRs; semantic version tags for `main`.
* **Workflow Step**:

  ```yaml
  - name: Build and push Docker image
    uses: docker/build-push-action@v3
    with:
      context: .
      push: true
      tags: |
        ghcr.io/${{ github.repository }}:${{ github.sha }}
        ghcr.io/${{ github.repository }}:latest
  ```

### 5. Artifact Publishing

* **Container Registry**: GitHub Container Registry (GHCR).
* **Immutable Artifacts**: Images are immutable; `latest` tag points to newest stable.

---

## CD (Continuous Delivery) & GitOps

We use **ArgoCD** for declarative deployments. All Kubernetes manifests and Helm charts live in the `infrastructure/` directory and are driven by Git.

### 1. Git Branching Strategy

* **`main`**: Production-ready manifests.
* **`develop`**: Staging environment.
* **Feature branches**: PR → CI → merge to `develop` → ArgoCD sync to staging.

### 2. Deployment Manifests & Helm Charts

* **Helm Charts**: One chart per microservice with values files for each environment.
* **Parameterization**: `image.tag`, `replicaCount`, `resources.requests/limits`.

### 3. ArgoCD Application Definitions

* **App-of-Apps** pattern\*\*: Root `argocd-root-app.yaml` references child apps for each service.
* **Sync Policy**: Automated sync with self-heal; manual overrides for production.

### 4. Promotion & Rollback Policies

* **Staged Rollout**: Canary deployments via ArgoCD Rollout plugin (Blue/Green or Canary).
* **Automated Rollback**: If health checks or SLO metrics breach thresholds, auto-rollback to previous healthy revision.

---

## Security & Compliance

* **Secrets Management**: SOPS-encrypted YAML stored in Git; decrypted by ArgoCD Sealed Secrets controller.
* **Least Privilege**: Service accounts with minimal RBAC for CI runner and ArgoCD.
* **Signing**: Image signing with Cosign to enforce supply chain security.

---

## Observability & Notifications

* **Build Status**: GitHub Checks API for pass/fail.
* **Slack/Teams Alerts**: CI failures notify `#ci-cd` channel via [actions-slack](https://github.com/rtCamp/action-slack).
* **ArgoCD Health**: ArgoCD sends alerts on sync failures via Webhook to PagerDuty.

---

## Best Practices

* **Idempotent Workflows**: Retries safe; pipeline steps idempotent.
* **Speed & Feedback**: PR checks complete within 5 minutes.
* **Traceability**: Every deployment tied to a Git commit, PR, and Jira ticket via commit message.
* **Scalability**: Self-hosted runners scale on-demand using Kubernetes.
* **Documentation**: All workflows documented in `CI_CD.md`, inline YAML comments, and repo README.

---

* Document Version: 1.0
* Date: 2025-06-21
* Author: ArturChernets
