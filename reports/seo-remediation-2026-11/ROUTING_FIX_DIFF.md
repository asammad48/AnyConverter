# ROUTING_FIX_DIFF — Routing and Redirect Modifications

**Target File:** `_redirects`  
**Date:** 16 November 2026

---

## Exact Git Diff on `_redirects`

```diff
--- a/_redirects
+++ b/_redirects
@@ -1,10 +1,17 @@
 # Canonical path aliases from Search Console cleanup
 /anyconverter_ui_mockup.html / 301
 /high_demand_frontend_tools.html / 301
-/es/world-clock/       /world-clock/              301
-/es/world-clock        /world-clock/              301
-/da/world-clock/       /world-clock/              301
-/da/world-clock        /world-clock/              301
+# Legacy localized paths and aliases
+/da/beregnere/           /da/calculators/          301
+/da/beregnere            /da/calculators/          301
+/da/dato-tid/            /da/date-time/            301
+/da/dato-tid             /da/date-time/            301
+/es/calculadoras/        /es/calculators/          301
+/es/calculadoras         /es/calculators/          301
+/es/fecha-hora/          /es/date-time/            301
+/es/fecha-hora           /es/date-time/            301
+/es/bola-8-magica/       /es/magic-8-ball/         301
+/es/bola-8-magica        /es/magic-8-ball/         301
 /merge-pdf               /pdf-merge/               301
 /combine-pdf             /pdf-merge/               301
 /combine-pdfs            /pdf-merge/               301
@@ -54,6 +61,7 @@
 /es/csv-to-sql            /es/csv-to-sql/           301
 /es/regex-tester          /es/regex-tester/         301
 /es/hash-generator        /es/hash-generator/       301
+/es/world-clock           /es/world-clock/          301
 
 # DA language pages
 /da                       /da/                      301
@@ -67,3 +75,4 @@
 /da/csv-to-sql            /da/csv-to-sql/           301
 /da/regex-tester          /da/regex-tester/         301
 /da/hash-generator        /da/hash-generator/       301
+/da/world-clock           /da/world-clock/          301
```

---

## Verification Evidence
- `/es/world-clock/`: Resolves directly to `es/world-clock/index.html` (HTTP 200). Self canonical: `https://anyconverter.io/es/world-clock/`.
- `/da/world-clock/`: Resolves directly to `da/world-clock/index.html` (HTTP 200). Self canonical: `https://anyconverter.io/da/world-clock/`.
- No redirect chains or loops detected across all 70 rules.
