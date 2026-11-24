# Risk Register — AnyConverter Creative Studio (Phase 02)

**Audit Date:** 2026-11-24  
**Author:** Lead Systems Architect / Antigravity Agent  
**Review Frequency:** Pre-release of every phase (Files 02–14)  

---

| Risk ID | Category | Description | Severity | Likelihood | Mitigation Strategy | Owner | Status |
|---|---|---|:---:|:---:|---|---|:---:|
| **RSK-01** | **Legal / Licensing** | Remotion Automators commercial licensing requires $480–$2,400+/year fee for multi-user web products. | **CRITICAL** | **HIGH** | Gated behind `RenderAdapter`. Default to zero-cost, MIT-compliant Native Canvas + WebCodecs + Web Audio engine. | Lead Architect | **MITIGATED** |
| **RSK-02** | **Data Loss** | Operating systems or users clearing browser site data may evict IndexedDB/OPFS projects. | **HIGH** | **HIGH** | Request `navigator.storage.persist()`; enforce `.acstudio` portable ZIP as immutable source of truth; prominent UI backup prompts. | Lead Architect | **DESIGNED** |
| **RSK-03** | **Security** | Third-party AI provider keys or Google OAuth tokens leaked via XSS, logs, URL params, or git. | **CRITICAL** | **MEDIUM** | In-memory token storage by default; optional PBKDF2+AES-GCM IndexedDB vault; strict CSP; no analytics/ads on studio routes. | Security Lead | **DESIGNED** |
| **RSK-04** | **Provider Policy** | Provider forbids direct client-side browser requests via strict CORS or requires server-side client secrets. | **HIGH** | **HIGH** | `ProviderCapabilityRegistry` identifies browser-incompatible models and gates them to `MANUAL NOTEBOOK ONLY`; zero insecure CORS proxies. | Lead Architect | **DESIGNED** |
| **RSK-05** | **Platform Abuse** | Automated scraping or orchestration of free Kaggle/Colab runtimes violates provider Terms of Service. | **HIGH** | **HIGH** | Public unattended automation disabled; provide standalone versioned `.ipynb` files for interactive user-driven runs. | Lead Architect | **MITIGATED** |
| **RSK-06** | **Hardware Limits** | Low-end mobile devices crash due to high memory usage during 1080p video composition or WebGL rendering. | **HIGH** | **MEDIUM** | Preflight capability checks; downscaled proxy preview canvas; WebGL context loss recovery; progressive frame encoding. | Frontend Lead | **DESIGNED** |
| **RSK-07** | **SEO / Regressions** | Bundling build dependencies damages existing 441 static pages, increases load times, or breaks hreflang/canonical links. | **CRITICAL** | **LOW** | Creative Studio is strictly isolated to `/creative-studio/`; existing 482 HTML files, `assets/css/style.css`, and vanilla JS remain untouched. | SEO Lead | **CONTROLLED** |
| **RSK-08** | **Drive Desync** | Network drops mid-upload to Google Drive leaving corrupt or unreferenced media assets. | **MEDIUM** | **MEDIUM** | Commit-manifest-last protocol: media uploaded first, manifest pointer updated last; incomplete transactions never corrupt the previous revision. | Backend-less Lead | **DESIGNED** |
