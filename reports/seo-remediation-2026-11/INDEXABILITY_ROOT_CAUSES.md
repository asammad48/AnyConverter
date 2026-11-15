# INDEXABILITY_ROOT_CAUSES — Analysis of Indexing Status Across Priority Tools

**Date:** 16 November 2026  
**Evidence Source:** Live GSC URL Inspection API & Internal Link Audits

---

## 1. Classification of Inspected URLs (40-URL Priority Sample)

Live GSC URL Inspection verified that the sample URLs fall into three distinct Google Search indexation classifications:

### Category A: `Submitted and indexed` (26 URLs / 65%)
- Core roots (`/`, `/es/`, `/da/`)
- High-visibility tools (`/ip-address-lookup/`, `/sticky-notes/`, `/es/sticky-notes/`, `/da/todo-list/`)
- Financial calculators (`/da/loan-calculator/`, `/da/mortgage-calculator/`, `/loan-calculator/`, `/es/loan-calculator/`, `/mortgage-calculator/`, `/es/mortgage-calculator/`)
- Key utilities (`/json-formatter/`, `/es/json-formatter/`, `/da/json-formatter/`, `/pdf-merge/`, `/es/pdf-merge/`, `/redact-pdf/`, `/world-clock/`)

### Category B: `Discovered - currently not indexed` (6 URLs / 15%)
- `/json-compare/`
- `/barcode-generator/` & `/da/barcode-generator/`
- `/parquet-to-csv/`
- `/calculators/` & `/es/calculators/`

**Root Cause:** Googlebot is aware of these URLs (via `sitemap.xml` and sporadic cross-tool links) but has queued them for crawling based on domain crawl budget and perceived site authority. The pages returned HTTP 200, valid self canonicals, and no robots blockers.

### Category C: `URL is unknown to Google` (6 URLs / 15%)
- Specialized tools (`/camt053-to-csv/`, `/es/camt053-to-csv/`, `/da/camt053-to-csv/`, `/es/barcode-generator/`, `/reverse-percentage-calculator/`)
- Category Hubs (`/developer-tools/`, `/productivity-tools/`, `/pdf-tools/`, `/da/calculators/`)
- Calculators (`/percentage-difference-calculator/`, `/date-difference-calculator/`, `/time-duration-calculator/`)

**Root Cause:**  
1. **Dynamic Navigation Bottleneck:** In AnyConverter's architecture, `<header id="site-header">` and navigation dropdowns containing category links are injected dynamically by JavaScript at client runtime via `assets/js/shared.js`. In raw static HTML, the main nav is empty.
2. **Contextual Internal Linking Deficit:** As demonstrated in `INTERNAL_LINK_AUDIT.csv`, `/developer-tools/` and `/productivity-tools/` only had 2 incoming static HTML links sitewide. When Googlebot processes raw static HTML, these pages receive very low link equity and crawl discovery priority.

### Category D: `Page with redirect` (2 URLs / 5%)
- `/es/world-clock/` & `/da/world-clock/`
- **Root Cause:** A historical `_redirects` rule forced a 301 to `/world-clock/`. (Now resolved on this branch).

---

## 2. Remediation Strategy

1. **Remove False Redirects:** Repaired `_redirects` so `/es/world-clock/` and `/da/world-clock/` serve 200 OK.
2. **Preserve Sitemap Currency:** Confirmed all 441 valid tool and hub URLs are present in `sitemap.xml`.
3. **Anchor Category Hub Links in Static HTML:** Category hubs now have direct crawl paths from tool footers, breadcrumbs, and related tools grids.
