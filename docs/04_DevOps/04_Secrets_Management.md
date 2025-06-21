# Secrets Management: SOPS & Sealed Secrets

This document outlines **free** and **secure** approaches to storing and deploying secrets in Kubernetes.

---

## 1. SOPS (Secret OPerationS)

### Overview

* Encrypt YAML files in Git using a public GPG key. Decrypt only at deploy time.

### Setup

1. **Generate GPG key** (if not existing):

   ```bash
   gpg --full-generate-key
   ```
2. **Encrypt a secret**:

   ```bash
   sops --encrypt --pgp <GPG_KEY_ID> secret-values.yaml > secret-values.enc.yaml
   ```
3. **Commit** the encrypted file (`.enc.yaml`) to Git (safe to share).

### Usage in CI/CD

* **GitHub Actions** step to decrypt:

  ```yaml
  - name: Decrypt secrets
    run: |
      gpg --import private.key
      sops --decrypt secret-values.enc.yaml > secret-values.yaml
  ```
* Use `secret-values.yaml` as `helm --values` input.

---

## 2. Sealed Secrets (Bitnami)

### Overview

* Kubernetes controller that decrypts `SealedSecret` objects into native `Secret` at runtime.
* Uses cluster-only private key, so sealed secrets are safe in Git.

### Installation

```bash
kubectl apply -f \
  https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.17.5/controller.yaml
```

### Workflow

1. **Create plain secret**:

   ```bash
   kubectl create secret generic db-creds \
     --from-literal=username=admin \
     --from-literal=password=s3cr3t \
     --dry-run=client -o yaml > secret.yaml
   ```
2. **Seal it**:

   ```bash
   kubeseal < secret.yaml > sealedsecret.yaml
   ```
3. **Commit** `sealedsecret.yaml` to Git.
4. **ArgoCD** or manual `kubectl apply -f sealedsecret.yaml` will create the real `Secret` in the cluster.

---

## 3. Best Practices

* **Rotate keys**: Regularly rotate GPG keys and SealedSecrets controller keys.
* **Audit logs**: Enable audit logging in Kubernetes to track secret access.
* **Least privilege**: Limit which namespaces/service accounts can decrypt secrets.

---

* Document Version: 1.0
* Date: 2025-06-21
* Author: ArturChernets
