# 09_GIT_CHANGE_INVENTORY — Exact Working Tree Inventory & Staging Scope

**Branch:** `feat/seo-remediation-and-technical-repair`  
**Date:** 16 November 2026  
**Status:** Working tree cleanly scoped, zero unapproved commits, zero pushes.

---

## 1. Production Code & Routing Files (Modified)

These files contain verified fixes directly improving search engine indexing, routing reciprocity, and on-page usability:

| File Path | Description of Changes |
|---|---|
| `_redirects` | Removed cross-locale 301 redirects for `/es/world-clock/` and `/da/world-clock/`. Added trailing slash normalization for `/es/world-clock` and `/da/world-clock`. Added 10 one-hop 301 redirects for legacy renamed localized paths (`/da/beregnere/`, `/da/dato-tid/`, `/es/calculadoras/`, `/es/fecha-hora/`, `/es/bola-8-magica/`). |
| `da/loan-calculator/index.html` | Updated title & meta description to cover `lånberegner` & `låneberegner`. Replaced thin August boilerplate with native Danish explanation of annuitetslån, nominel rente vs. ÅOP. |
| `da/mortgage-calculator/index.html` | Updated title to `Realkreditberegner & Boliglånsberegner Online Gratis`. Removed Anglicized text. Added Danish mortgage explanations (kapital/rente, bidragssats, afdragsfrihed) without false claims. |
| `es/sticky-notes/index.html` | Updated title, meta description, and social tags. Restored proper Spanish orthography (inverted question marks `¿`, accents `automático`, `Añadir nota`, `Características`). Highlighted 100% localStorage privacy. |
| `sticky-notes/index.html` | Refined title and meta description for clean search intent. Emphasized private local saving and JSON/TXT backups. |
| `da/todo-list/index.html` | Updated title and meta description. Cleaned up duplicate sections with natural Danish copy. |
| `ip-address-lookup/index.html` | Refined title and meta description to support both "What is my IP" and "Look up an external IP" search intents. |

---

## 2. Tooling and Audit Scripts (Added under `reports/seo/`)

Reusable, deterministic Node.js verification tools isolated from production assets:

| Tool Path | Purpose |
|---|---|
| `reports/seo/validate_gsc_pipeline.js` | Reproducible GSC API extraction with automated assertions preventing zero-period reporting bugs. |
| `reports/seo/extract_all_dimensions.js` | Full-dimensional GSC extraction across query, page, country, and device. |
| `reports/seo/run_url_inspection_audit.js` | Live GSC URL Inspection API runner evaluating indexability for 40 priority URLs. |
| `reports/seo/audit_internal_links.js` | Sitewide internal link crawler auditing incoming contextual links. |
| `reports/seo/run_sitewide_seo_tests.js` | Sitewide verification of canonical tags, hreflang reciprocity, and redirect destinations across 475 HTML files. |

---

## 3. Verified Audit Deliverables (Added under `reports/seo-remediation-2026-11/`)

1. `00_EXECUTIVE_DIAGNOSIS.md`
2. `01_GSC_PROVENANCE_AND_RECONCILIATION.md`
3. `02_IP_LOOKUP_COLLAPSE_ANALYSIS.md`
4. `03_INDEXABILITY_VERIFICATION.csv`
5. `04_TECHNICAL_DEFECT_REGISTER.md`
6. `05_REDIRECT_HREFLANG_CANONICAL_TESTS.md`
7. `06_GSC_KEYWORDS_EN_ES_DA.csv`
8. `07_PRIORITIZED_PAGE_FIXES.md`
9. `08_TEST_RESULTS_AND_SCREENSHOTS.md`
10. `09_GIT_CHANGE_INVENTORY.md`
11. `10_MEASUREMENT_PLAN.md`
12. `11_RELEASE_DECISION.md`
- Supporting CSVs & JSON: `detailed_gsc_analysis.json`, `collapse_reconstruction.json`, `GSC_DAILY_TRAFFIC_BREAKDOWN.csv`, `GSC_PAGE_PERFORMANCE.csv`, `GSC_KEYWORD_OPPORTUNITIES.csv`, `TOP_100_EXISTING_QUERIES.csv`, `EN_KEYWORD_PRIORITY.csv`, `ES_KEYWORD_PRIORITY.csv`, `DA_KEYWORD_PRIORITY.csv`, `INDEXING_STATUS_RECHECK.csv`, `INTERNAL_LINK_AUDIT.csv`, `REDIRECT_VERIFICATION.csv`, `HREFLANG_CANONICAL_AUDIT.csv`, `url_inspection_raw.json`.

---

## 4. Proposed Staging Exclusions

The following untracked or local files MUST NOT be staged or committed:
- Service account credential JSON (`anyconverterio-*.json`)
- `.env` and local environment files
- `.vs/` or local IDE states
- Prompt instruction markdown files (`ANTIGRAVITY_FULL_SEO_REPAIR_PROMPT.md`, `ANYCONVERTER_COMPLETE_SEO_AUDIT.md`) unless explicitly requested by user.
