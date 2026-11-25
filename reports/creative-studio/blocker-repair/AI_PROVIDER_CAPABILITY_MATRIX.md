# AI PROVIDER CAPABILITY & SECURITY MATRIX

**Date:** 25 November 2026  
**Status:** HARDENED & ENFORCED — Zero Secrets in URLs/Logs, Zero Mock Success in Production

---

## 1. Provider Integration Policy & Guidelines

Under AnyConverter Rule G-01 and G-02:
1. **Zero AnyConverter-Funded Inference:** All AI generation requires user-supplied BYOK (Bring Your Own Key) credentials.
2. **Explicit User Approval Gate:** Every generation request requires user confirmation with a bounded maximum call count (`maxApprovedRequests >= 1`).
3. **No Third-Party CORS Proxies:** Unofficial third-party CORS proxies are strictly prohibited. Models without browser CORS support are accessible exclusively via self-contained Jupyter notebook (`.ipynb`) exports.
4. **Header Authentication Only (B07):** API keys are submitted via HTTP headers (`x-goog-api-key` / `Authorization: Bearer`), never in URL query strings.
5. **No Production Mocks (B08):** Mock generation clients returning 1x1 images are strictly prohibited in production journeys.

---

## 2. Provider Capability & Support Matrix

| Provider ID | Model ID | Official Direct Browser CORS | Auth Mechanism | Non-Chargeable Connection Validation | Cost Unit | Production Status |
|---|---|---|---|---|---|---|
| `google-gemini` | `imagen-3.0-generate-002` | **YES** | Header `x-goog-api-key` | GET `/v1beta/models/{modelId}` | ~$0.03 / image (est) | **HARDENED** (Requires User Key) |
| `huggingface-inference` | `black-forest-labs/FLUX.1-schnell` | **YES** | Header `Authorization: Bearer` | GET `https://huggingface.co/api/whoami-v2` | User serverless quota | **HARDENED** (Requires User Token) |
| `stable-video-diffusion` | `stabilityai/stable-video-diffusion-img2vid` | **NO** (No browser CORS) | N/A (Notebook generation) | Local environment probe | Self-hosted GPU | **NOTEBOOK ONLY** (Local/Colab) |
| `third-party-cors-proxy` | *Any* | **PROHIBITED** | N/A | Blocked by policy | N/A | **STRICTLY BLOCKED** |

---

## 3. Credential Redaction & Security Hardening

- **Scrubber Function:** `redactSecrets()` sanitizes any string containing user API keys or standard key patterns (`AIza...`, `hf_...`, `sk-...`).
- **Telemetry & Error Channels:** Network errors, aborted requests, and debug logs pass through `redactSecrets()` prior to presentation to the user or console.
- **BYOK Vault Storage:** Keys are kept strictly in transient memory or encrypted locally with user-supplied passphrases using PBKDF2 (100,000 iterations) + AES-GCM (256-bit).

---

## 4. Current Operational Verdict

| Workflow | Status | Remarks |
|---|---|---|
| Native Offline Storyboard / Wizard | **READY (100% Zero-Cost)** | Operates completely without AI credentials |
| Jupyter Notebook Export (`.ipynb`) | **READY** | Free local execution with Colab / local GPU |
| BYOK Live Generation Pipeline | **BLOCKED_EXTERNAL** | Awaiting user-provided disposable test API key |
