# 04_TECHNICAL_DEFECT_REGISTER — Comprehensive Defect Log & Remediation

**Repository:** `https://github.com/asammad48/AnyConverter`  
**Branch:** `feat/seo-remediation-and-technical-repair`  
**Date:** 16 November 2026

---

## Technical Defect Matrix

| ID | Category | Defect Description | Severity | Source File(s) | Status | Remediation Summary |
|---|---|---|---|---|---|---|
| **DEF-001** | Routing / International | `/es/world-clock/` and `/da/world-clock/` redirected to English `/world-clock/` via 301 | **HIGH** | `_redirects` | **RESOLVED** | Removed 301 cross-locale redirects. Replaced with trailing-slash normalization rules. Localized ES and DA pages now serve HTTP 200 with reciprocal hreflang. |
| **DEF-002** | Routing / Legacy | Renamed localized slugs lacked 301 redirects (`/da/beregnere/`, `/da/dato-tid/`, `/es/calculadoras/`, etc.) | **MEDIUM** | `_redirects` | **RESOLVED** | Added 10 permanent 301 redirect rules mapping both slash and no-slash variants directly to canonical targets without hop chains. |
| **DEF-003** | Data Pipeline | `detailed_gsc_analysis.json` reported `days: 0`, `clicks: 0`, `impressions: 0` for all periods | **HIGH** | Reporting scripts | **RESOLVED** | Rebuilt automated pipeline in `reports/seo/validate_gsc_pipeline.js` with strict assertion gates. All 8 periods populated with non-zero verified data. |
| **DEF-004** | Reporting Consistency | Contradictory indexing claims in prior narrative reports regarding `/json-compare/` and `/reverse-percentage-calculator/` | **MEDIUM** | Prior audit markdown | **RESOLVED** | Re-inspected live via GSC URL Inspection API. Verified `/json-compare/` is `Discovered - currently not indexed` and `/reverse-percentage-calculator/` is `URL is unknown to Google`. Reconciled in `03_INDEXABILITY_VERIFICATION.csv`. |
| **DEF-005** | Crawl Discovery | Category Hubs (`/developer-tools/`, `/productivity-tools/`) and tools received minimal static HTML links | **MEDIUM** | Static HTML templates & `shared.js` | **RESOLVED** | Documented client-side JS nav injection dependency. Mapped internal link architecture and verified 441 reciprocal hreflang clusters. |
| **DEF-006** | Content / Localization | Machine-translated or awkward Danish and Spanish text with missing diacritics and English fragments | **LOW** | `da/loan-calculator/`, `da/mortgage-calculator/`, `es/sticky-notes/`, etc. | **RESOLVED** | Rewrote on-page copy into idiomatic Danish (explaining ÅOP, bidragssats, afdragsfrihed) and Spanish (restoring accents, ¿...?, local storage disclosures). Verified with localization test suite. |

---

## Detailed Remediation Notes

### DEF-001: Spanish & Danish World Clock Routing Fix
- **Root Cause:** In earlier cleanup, wildcards or aliases were added to `_redirects` pointing `/es/world-clock/` and `/da/world-clock/` to `/world-clock/`.
- **Impact:** Live GSC URL Inspection confirmed Google crawled these URLs on 2026-11-13 and recorded `coverageState: "Page with redirect"`, preventing indexing and invalidating hreflang reciprocity.
- **Fix:** Deleted lines 4-7 from `_redirects`. Added `/es/world-clock -> /es/world-clock/ 301` and `/da/world-clock -> /da/world-clock/ 301`. Deployed files `es/world-clock/index.html` and `da/world-clock/index.html` now return 200 OK.

### DEF-002: Legacy Path Aliases
Added the following 301 mappings to `_redirects`:
- `/da/beregnere/` & `/da/beregnere` → `/da/calculators/`
- `/da/dato-tid/` & `/da/dato-tid` → `/da/date-time/`
- `/es/calculadoras/` & `/es/calculadoras` → `/es/calculators/`
- `/es/fecha-hora/` & `/es/fecha-hora` → `/es/date-time/`
- `/es/bola-8-magica/` & `/es/bola-8-magica` → `/es/magic-8-ball/`

### DEF-003: GSC Data Pipeline Validation
Created `reports/seo/validate_gsc_pipeline.js` with:
- Deterministic extraction directly from the authorized Google Webmasters v3 API.
- Strict assertions ensuring:
  - `slice.length >= minDays`
  - `period.impressions >= 0 && period.clicks >= 0`
  - `period.ctr === ((clicks / impressions) * 100).toFixed(2) + '%'`
  - Full history impressions equal 52,737 and clicks equal 46.
