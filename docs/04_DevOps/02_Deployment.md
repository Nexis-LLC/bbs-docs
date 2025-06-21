# Deployment Guide: Kubernetes, Helm & ArgoCD

This document details the **deployment workflow** using **free tools** and follows best practices for reliability and repeatability.

---

## 1. Kubernetes Cluster Setup

### Local Development

* **Kind** (Kubernetes in Docker): lightweight, single-node cluster:

  ```bash
  kind create cluster --name bus-booking --config kind-config.yaml
  ```
* **k3s**: minimal Kubernetes distribution:

  ```bash
  curl -sfL https://get.k3s.io | sh -
  ```

### Cloud (Free Tier)

* **Google Kubernetes Engine (GKE Autopilot)**: free credits for new accounts.
* **Azure Kubernetes Service (AKS)**: free tier options.

---

## 2. Helm Charts Structure

Create a chart per service under `helm/`:

```
helm/                       # root
└── bus-booking/            # chart for Booking Service
    ├── Chart.yaml          # chart metadata
    ├── values.yaml         # default values
    ├── values-staging.yaml # overrides for staging
    ├── values-prod.yaml    # overrides for production
    └── templates/          # Kubernetes manifests templates
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        └── _helpers.tpl    # helper functions
```

### Key Parameters in `values.yaml`

* `image.repository` & `image.tag` (e.g. `ghcr.io/org/bus-booking:SHA`)
* `replicaCount` (e.g. `2` for staging, `5` for production)
* `resources.requests` & `resources.limits` (CPU/memory)
* `env` variables (database URL, Redis URL, API keys)

---

## 3. GitHub Actions Workflow

Automate build → test → image push:

```yaml
# .github/workflows/deploy.yml
ame: Build & Deploy
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Java
        uses: actions/setup-java@v3
        with: java-version: '17'
      - name: Build JAR
        run: mvn package -DskipTests
      - name: Build & Push Docker image
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.sha }}
            ghcr.io/${{ github.repository }}:latest
```

---

## 4. Helm Upgrade & Rollback

### Deploy to Cluster

```bash
helm upgrade --install bus-booking helm/bus-booking \
  --values helm/bus-booking/values-prod.yaml \
  --set image.tag=${GITHUB_SHA}
```

### Rollback

deployment

```bash
helm rollback bus-booking <revision>
```

---

## 5. GitOps with ArgoCD

### App-of-Apps Pattern

Store an ArgoCD root application in Git:

```yaml
# argocd-root-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
spec:
  project: default
  source:
    repoURL: https://github.com/org/repo.git
    path: helm
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

ArgoCD will deploy each service chart under `helm/` automatically.

---

* Document Version: 1.0
* Date: 2025-06-21
* Author: ArturChernets
