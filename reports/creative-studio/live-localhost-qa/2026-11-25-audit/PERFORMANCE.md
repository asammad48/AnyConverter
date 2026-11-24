# AnyConverter Creative Studio — Performance & Runtime Audit

**Audit Run ID:** `2026-11-25-audit`  
**Execution Environment:** Chromium 1248 on Windows 11 Enterprise (AMD64 / Direct3D 11 / ANGLE)

---

## 1. Measured Performance Metrics

| Metric | Measured Baseline | Target Threshold | Compliance Status | Observational Notes |
|---|:---:|:---:|:---:|---|
| **Homepage TTFB (Localhost)** | 1.8 ms | $\le 50\text{ ms}$ | **PASS** | High throughput static file server. |
| **Homepage DOMContentLoaded** | 185 ms | $\le 800\text{ ms}$ | **PASS** | Verified via Playwright execution trace. |
| **Homepage Total Nav Links** | 440 links | N/A | **PASS** | 128 existing tools with reciprocal lang links. |
| **Creative Studio Route Load Time** | N/A (404) | $\le 1000\text{ ms}$ | **FAIL / BLOCKED** | Route returns 404 (0ms render time, no UI mounted). |
| **Studio Total JS Assets Size (on disk)** | 272 KB | $\le 500\text{ KB}$ | **PASS (Size)** | 39 JS files totaling 272,319 bytes unminified. |
| **Browser VideoEncoder Hardware Support** | Supported (`true`) | Hardware Required | **PASS (Hardware)** | Chromium reports `typeof VideoEncoder !== 'undefined'`. |
| **Browser Web Audio API Support** | Supported (`true`) | Hardware Required | **PASS (Hardware)** | AudioContext available. |
| **Browser OffscreenCanvas Support** | Supported (`true`) | Required | **PASS (Hardware)** | Worker rendering capability available. |
| **Web NFC Desktop Support** | Unsupported (`false`) | Required on Mobile | **DEGRADED (Desktop)** | Desktop Chromium lacks `NDEFReader`. |
| **In-Memory RenderAdapter Loop Time** | 0.8 ms (60 frames) | $\le 100\text{ ms}$ | **ARTIFICIAL** | Instantaneous because `render()` does not encode actual video frames. |
| **True 1080p Video Encoding Speed** | Not measurable | $\ge 15\text{ fps}$ | **BLOCKED** | VideoEncoder pipeline not wired to media container. |

---

## 2. Resource Transfer & Memory Footprint

- **Static Assets Directory:** `assets/js/creative-studio/`
- **Total File Count:** 39 JavaScript source files.
- **Combined Size:** 272 KB unminified.
- **Runtime Memory Overhead:** Negligible on existing tools. Script execution is completely isolated from existing tools like `/json-formatter/` (verified zero cross-tool leakage).
- **Core Web Vitals Impact on Existing Site:**
  - Homepage LCP: Unaffected (Creative Studio code is not bundled into `assets/js/shared.js`).
  - Existing tool latency: Normal (e.g. `/json-formatter/` loads in < 250ms).
