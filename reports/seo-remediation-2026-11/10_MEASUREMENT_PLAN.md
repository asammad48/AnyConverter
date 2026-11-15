# 10_MEASUREMENT_PLAN — Empirical Monitoring & Verification Controls

**Property:** `sc-domain:anyconverter.io`  
**Baseline Date:** 16 November 2026  
**Review Intervals:** 7-Day Diagnostic Check (2026-11-23) & 28-Day Finalized Review (2026-12-14)

---

## 1. Verified Baseline Metrics (As of 2026-11-08 Finalized GSC Data)

| Measurement Group | 28-Day Baseline (Oct 12 – Nov 08) | 7-Day Baseline (Nov 02 – Nov 08) | Primary Monitoring Metric |
|---|---:|---:|---|
| **Property Overall** | 201 imp / 2 clicks | 41 imp / 2 clicks | Total organic clicks, impressions, CTR |
| **`/ip-address-lookup/`** | 2 imp / 0 clicks | 0 imp / 0 clicks | SERP presence for `ip address lookup` |
| **`/da/loan-calculator/`** | 59 imp / 1 click | 9 imp / 0 clicks | Position on `lånberegner` (baseline pos 5.4) |
| **`/da/mortgage-calculator/`** | 86 imp / 0 clicks | 14 imp / 0 clicks | Position on `realkreditberegner` (baseline pos 9.9) |
| **`/es/sticky-notes/`** | 50 imp / 1 click | 8 imp / 0 clicks | Position on `notas adhesivas online` (baseline pos 11.3) |
| **`/sticky-notes/`** | 37 imp / 0 clicks | 5 imp / 0 clicks | Position on `online sticky notes` (baseline pos 16.9) |
| **`/da/todo-list/`** | 33 imp / 0 clicks | 4 imp / 0 clicks | Position on `opgaveliste` (baseline pos 19.2) |
| **Repaired World Clocks** | 0 impressions (redirected) | 0 impressions | Transition from `"Page with redirect"` to `200 OK` indexed |

---

## 2. Measurement Cadence & Review Criteria

### Interval 1: 7-Day Diagnostic Check (T + 7 Days)
- **Primary Goal:** Verify crawl stability and technical health.
- **Actions:**
  1. Inspect GSC URL Inspection for `/es/world-clock/` and `/da/world-clock/` to confirm Googlebot observes HTTP 200 rather than 301.
  2. Verify Cloudflare Edge logs for zero 5xx errors or unexpected redirect chains.
  3. Confirm that no newly introduced robots or noindex regressions occurred.
- **Rule:** Do not draw ranking conclusions from 7-day samples. 7-day data is exclusively diagnostic.

### Interval 2: 28-Day Finalized Evaluation (T + 28 Days)
- **Primary Goal:** Evaluate genuine crawl uptake and index coverage progression.
- **Actions:**
  1. Compare the first finalized 28-day window post-deployment against the 28-day baseline (201 impressions / 2 clicks).
  2. Re-run `reports/seo/run_url_inspection_audit.js` across the 40-URL sample to measure the transition rate from `NOT_INDEXED_UNKNOWN` / `Discovered` into `INDEXED`.
  3. Evaluate CTR and position shifts on target Danish and Spanish terms (`lånberegner`, `realkreditberegner`, `notas adhesivas online`).

---

## 3. Methodological Cautions

1. **No Algorithmic Guarantees:** Google's crawling, indexing, and ranking algorithms are independent external systems. Technical fixes ensure compliance and discoverability, but cannot guarantee top rankings or immediate indexing.
2. **Avoid Reacting to Micro-Fluctuations:** Day-to-day impressions in low-volume niches (e.g. 5 vs. 12 impressions) represent standard sampling variance in Google Search Console, not trend shifts. Only finalized 28-day blocks provide statistically meaningful signals.
