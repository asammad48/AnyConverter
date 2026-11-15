# 05_REDIRECT_HREFLANG_CANONICAL_TESTS — Sitewide Verification & Test Results

**Date:** 16 November 2026  
**Execution Script:** `reports/seo/run_sitewide_seo_tests.js`  
**Scope:** Sitewide (475 HTML files, 441 Sitemap URLs, 70 `_redirects` Rules)

---

## 1. Test Summary

| Test Domain | Target Scope | Pass Count | Fail / Warn Count | Status | Evidence File |
|---|---|---:|---:|---|---|
| **Redirect Destinations** | 70 rules in `_redirects` | 70 | 0 | **PASS** | `REDIRECT_VERIFICATION.csv` |
| **Hreflang Reciprocity** | 441 production localized pages | 441 | 0 | **PASS** | `HREFLANG_CANONICAL_AUDIT.csv` |
| **Canonical Alignment** | 441 production localized pages | 441 | 0 | **PASS** | `HREFLANG_CANONICAL_AUDIT.csv` |
| **x-default Mapping** | 147 multilingual clusters | 147 | 0 | **PASS** | `HREFLANG_CANONICAL_AUDIT.csv` |
| **Legacy Slug Mappings** | 5 renamed localized routes | 10 (slash + no-slash) | 0 | **PASS** | `REDIRECT_VERIFICATION.csv` |

---

## 2. Redirect Rules Verification

All 70 rules in `_redirects` were audited against the physical filesystem to ensure target destinations exist and prevent 404 or redirect-loop regressions:

### Key Routing Fixes
1. **Removal of Cross-Language 301s:**
   ```diff
   - /es/world-clock/       /world-clock/              301
   - /es/world-clock        /world-clock/              301
   - /da/world-clock/       /world-clock/              301
   - /da/world-clock        /world-clock/              301
   ```
2. **Trailing Slash Normalization Added:**
   ```apache
   /es/world-clock          /es/world-clock/           301
   /da/world-clock          /da/world-clock/           301
   ```
3. **Legacy Renamed Localized Aliases Added:**
   ```apache
   /da/beregnere/           /da/calculators/           301
   /da/beregnere            /da/calculators/           301
   /da/dato-tid/            /da/date-time/             301
   /da/dato-tid             /da/date-time/             301
   /es/calculadoras/        /es/calculators/           301
   /es/calculadoras         /es/calculators/           301
   /es/fecha-hora/          /es/date-time/             301
   /es/fecha-hora           /es/date-time/             301
   /es/bola-8-magica/       /es/magic-8-ball/          301
   /es/bola-8-magica        /es/magic-8-ball/          301
   ```

---

## 3. Hreflang and Canonical Graph Analysis

Across the 147 canonical tool clusters (441 URLs total):
- **Reciprocal Alternates:** Every English page declares `<link rel="alternate" hreflang="es" ...>`, `<link rel="alternate" hreflang="da" ...>`, `<link rel="alternate" hreflang="en" ...>`, and `<link rel="alternate" hreflang="x-default" ...>`. The Spanish and Danish counterparts return strictly reciprocal tags pointing back to the English root and sister locales.
- **Self-Referential Canonicals:** Every page features a self-referential canonical URL ending with a standardized trailing slash matching its `sitemap.xml` entry.
- **Status:** **100% COMPLIANT**.
