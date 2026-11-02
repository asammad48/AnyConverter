# Invoice PDF Unicode and Layout Test Report

**Date:** 2026-11-02  
**Tool:** Invoice Generator (`assets/js/tools/invoice-generator.js`, `invoice-generator/index.html`)  
**Scope:** Unicode glyph support, multi-currency layout, negative value guarding, and cross-channel financial reconciliation  
**Status:** Verified across Unit and Real Chrome Browser Tests  

---

## 1. Scope & Objective

The second independent financial revalidation report identified defects in client-side PDF invoice export when handling European diacritics, localized currency symbols, and multi-currency formatting under standard jsPDF Helvetica encoding.

This test audit verified:
1. **Danish Diacritics:** `æ, ø, å, Æ, Ø, Å`
2. **Spanish Diacritics:** `á, é, í, ó, ú, ñ, Á, É, Í, Ó, Ú, Ñ, ¿, ¡`
3. **Currency Symbols:** `€, £, $, kr., SEK, NOK, CHF`
4. **Field Coverage:** Business name (`inv-from`), Client name (`inv-to`), Line item descriptions, Notes, Payment terms, Subtotals, Discounts, Taxes, Shipping, and Total Due.
5. **Arithmetic Reconciliation:** Ensuring Screen Summary, Print View, and PDF Export produce identical numeric results.
6. **Input Guarding:** Ensuring negative quantities and rates cannot corrupt invoice totals.

---

## 2. Technical Solution: Unicode Sanitization & Normalization

Standard jsPDF bundled with default core fonts (Helvetica, Times, Courier) utilizes WinAnsiEncoding (Windows-1252 / ISO-8859-1). When non-normalized UTF-8 multi-byte sequences or high-order Unicode code points (such as typographic smart quotes `“ ”`, em-dashes `—`, ellipsis `…`, or non-breaking spaces `\u00A0`) are passed to `doc.text()`, jsPDF either crashes or renders replacement character mojibake.

To ensure reliable client-side PDF generation without introducing heavy unlicensed external font files, `assets/js/tools/invoice-generator.js` implemented `sanitizePdfText()`:

```javascript
function sanitizePdfText(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/[^\x00-\x7F\u00A0-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u20AC]/g, '?');
}
```

### Supported Character Range:
- **Danish:** `æ` (\u00E6), `ø` (\u00F8), `å` (\u00E5), `Æ` (\u00C6), `Ø` (\u00D8), `Å` (\u00C5) $\rightarrow$ Fully preserved in Latin-1 / WinAnsi range.
- **Spanish:** `á, é, í, ó, ú, ñ, Á, É, Í, Ó, Ú, Ñ, ¿, ¡` $\rightarrow$ Fully preserved in Latin-1 range.
- **Currencies:** `€` (\u20AC), `£` (\u00A3), `$`, `kr.` $\rightarrow$ Supported directly.
- **Punctuation:** Smart quotes, dashes, and ellipses are cleanly transformed into ASCII equivalents, preventing rendering errors.

---

## 3. Financial Reconciliation Matrix

A standardized multi-variable billing scenario was executed across all three channels:

### Scenario Inputs:
- **Line Item 1:** 5 hours @ $200.00 / hr = $1,000.00
- **Line Item 2 (Zero test):** 0 units @ $50.00 = $0.00
- **Line Item 3 (Negative guard):** -2 units @ $100.00 $\rightarrow$ Clamped to 0
- **Subtotal:** $1,000.00
- **Fixed Discount:** $50.00 (Taxable subtotal: $950.00)
- **Sales Tax Rate:** 10.0% ($95.00)
- **Shipping & Handling:** $25.00
- **Expected Total Due:** $1,070.00 ($1,000.00 - $50.00 + $95.00 + $25.00)

### Reconciliation Comparison:

| Output Surface | Subtotal | Discount | Tax Amount | Shipping | Total Due | Status |
|---|---|---|---|---|---|---|
| **Screen Summary (DOM)** | $1,000.00 | -$50.00 | $95.00 | $25.00 | $1,070.00 | MATCH |
| **Print Preview (CSS media)** | $1,000.00 | -$50.00 | $95.00 | $25.00 | $1,070.00 | MATCH |
| **PDF Document Export (jsPDF)** | $1,000.00 | -$50.00 | $95.00 | $25.00 | $1,070.00 | MATCH |

---

## 4. Locale-Aware Formatting

Number formatting respects the active route while maintaining floating-point precision in the underlying calculation engine:
- **English (`en`):** `1,070.00` (comma thousands separator, dot decimal)
- **Spanish (`es`):** `1.070,00` (period thousands separator, comma decimal)
- **Danish (`da`):** `1.070,00` (period thousands separator, comma decimal)

---

## 5. End-to-End Test Evidence

- **Automated Node Test (`tests/test_financial_calculations_suite.js`):**
  - Unicode sanitization string tests: PASS.
  - Multi-locale currency formatting tests (`en`, `es`, `da`): PASS.
- **Browser Playwright E2E Test (`tests/browser_e2e_financial_suite.js`):**
  - Injected strings containing full Danish and Spanish alphabets: PASS.
  - Negative quantity input verified clamped to 0: PASS.
  - jsPDF export button click and document rendering: PASS with 0 console errors.
