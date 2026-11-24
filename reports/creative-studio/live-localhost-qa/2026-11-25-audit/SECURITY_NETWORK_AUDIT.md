# AnyConverter Creative Studio — Security & Network Privacy Audit

**Audit Run ID:** `2026-11-25-audit`  
**Governance Invariants Checked:** Rule G-01 (Zero Backend), Rule G-02 (Zero Storage Costs), Rule G-03 (Zero Commercial Licensing Overhead), Zero Secret Leakage.

---

## 1. Network Boundary & Origin Request Inventory

- **Local Development Server:** `http://127.0.0.1:3000`
- **Application Server Requests:** 0 (Zero backend calls observed).
- **External Network Traffic:**
  - Zero telemetry or analytics pings sent to unauthorized endpoints during localhost probe.
  - Zero user project media uploaded to any server.
  - No secret credentials transmitted over query strings or headers.
- **Third-Party CORS Proxy Audit:**
  - Inspected `ai-provider-adapter.js` and `auth-provider.js`: Third-party CORS reverse proxies (e.g. `cors-anywhere`) are strictly classified as `UNSAFE` and rejected, in compliance with security guidelines.

---

## 2. Storage & Credential Handling Audit

- **Browser Storage Inspection (`localStorage`, `sessionStorage`, `IndexedDB`):**
  - No raw API keys, OAuth tokens, or unhashed passwords found stored in plaintext.
  - `byok-vault.js` implements PBKDF2 key derivation (100,000 iterations) and AES-256-GCM encryption for client-side secret storage.
- **Threat Model Finding (ADR Caveat):**
  - While client-side encryption protects keys stored on disk against offline inspection, any script executing in the same origin after vault unlock has access to in-memory keys. Session-only key storage remains the recommended posture for untrusted workstations.
- **Archive File Inspection:**
  - Exported `.acstudio` archives contain strict `security.containsSecrets = false` verification metadata.

---

## 3. Compliance Summary

| Security Boundary | Specification Invariant | Observed Reality | Status |
|---|---|---|:---:|
| **Zero Backend (G-01)** | Pure static hosting, 0 servers | Pure static HTML/JS files served | **COMPLIANT** |
| **Zero AnyConverter Storage (G-02)** | No AWS S3 / Cloudflare R2 | No server-side buckets referenced | **COMPLIANT** |
| **Zero Secret Leak** | No raw credentials stored | Ephemeral memory & encrypted vault | **COMPLIANT** |
| **Browser Runtime Safety** | Modern browser APIs only | `archive.js` uses Node `require()` | **DEFECT (Runtime Crash)** |
| **QR Code Integrity** | Compliant standards | QR uses pseudo-random bit hashing | **DEFECT (Invalid Format)** |
