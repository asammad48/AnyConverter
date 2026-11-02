# Financial Browser End-to-End Test Results

**Date:** 2026-11-02  
**Test Harness:** Playwright (`node_modules/playwright`)  
**Browser Engine:** Google Chrome Headless (`C:/Program Files/Google/Chrome/Application/chrome.exe`)  
**Execution Script:** `tests/browser_e2e_financial_suite.js`  
**Total Scenarios:** 32  
**Passed:** 32  
**Failed:** 0  
**Status:** 100% PASS  

---

## 1. Test Architecture & Environment

Browser execution was conducted against a live local HTTP server serving the production codebase from root on port `5005`. Playwright launched a clean Chrome instance with a 1280x900 viewport.

All console messages, unhandled exceptions (`pageerror`), and network aborts were monitored throughout execution.

---

## 2. Detailed Execution Results by Tool

### 2.1 Compound Interest Calculator & Goal Solver

| ID | Test Scenario | Language | Status | Dynamic Evidence / Output |
|---|---|---|---|---|
| CI-01 | Positive savings goal input & calculation | EN | PASS | Result: "To reach $100,000.00 in 10 years at 7.0%, you need an initial deposit of $49,759.63 or a monthly contribution of $461.64." |
| CI-02 | Compounding frequency switch (Daily 365/yr) | EN | PASS | Successfully recalculated goal without `ReferenceError`. Output updated dynamically. |
| CI-03 | Deposit timing switch (Annuity Due / Beginning) | EN | PASS | Recalculated goal with annuity due factor. No exceptions. |
| CI-04 | Zero savings goal ($0) boundary check | EN | PASS | Goal alert message cleanly hidden from DOM. |
| CI-05 | Localized Spanish goal calculation | ES | PASS | Result: "Para alcanzar €50.000,00 en 10 años al 7.0%, necesitas un depósito inicial de €24.879,81 o una aportación mensual de €172,77." |
| CI-06 | Localized Danish goal calculation | DA | PASS | Result: "For at nå 500.000,00 kr. om 10 år ved 7.0% i afkast, kræves et startbeløb på 248.798,13 kr. eller en månedlig opsparing på 2.772,65 kr.." |
| CI-07 | Console Error Audit across CI journeys | All | PASS | Zero unhandled console errors or page exceptions. |

---

### 2.2 Mortgage Calculator & PMI / LTV Controls

| ID | Test Scenario | Language | Status | Dynamic Evidence / Output |
|---|---|---|---|---|
| MC-01 | Down payment dollar input syncs percentage | EN | PASS | Typing $40,000 on $400,000 property price sets `#mort-down-pct` to `10.0%`. |
| MC-02 | Down payment percentage syncs dollar input | EN | PASS | Typing 15.0% updates `#mort-down` to `$60,000`. |
| MC-03 | PMI milestone date output ($LTV > 80\%$) | EN | PASS | Milestone date rendered: `Jun 2031` (Month 66 when balance reaches 80% LTV). |
| MC-04 | PMI disabled at 0% rate | EN | PASS | Setting `#mort-pmi` to `0` removes PMI escrow and hides `#ac-mort-pmi-milestone-wrap`. |
| MC-05 | 20% down payment eliminates PMI from start | EN | PASS | At 20% down ($LTV = 80\%$), milestone container is hidden from month 1. |
| MC-06 | Spanish statutory jurisdiction disclaimer | ES | PASS | Text verified: "Estimación ilustrativa según valor inicial y amortización. En España u otras jurisdicciones europeas..." |
| MC-07 | Danish statutory jurisdiction disclaimer | DA | PASS | Text verified: "Vejledende beregning. I Danmark og Europa gælder automatiske ophørsregler ikke for bidragssats..." |
| MC-08 | Console Error Audit across MC journeys | All | PASS | Zero unhandled console errors or page exceptions. |

---

### 2.3 Currency Converter Resilience & Fallback

| ID | Test Scenario | Language | Status | Dynamic Evidence / Output |
|---|---|---|---|---|
| CC-01 | Offline mode with no cache | EN | PASS | Network aborted, cache empty. `#cc-result-input` is blank (`""`). |
| CC-02 | Red warning banner on rate unavailability | EN | PASS | Banner: "✕ Current exchange rate unavailable. Live market rates could not be retrieved and no verified cached rates are available." |
| CC-03 | Safe cache fallback with timestamp | EN | PASS | Amber banner: "⚠ Offline: Using previously cached rates from Mon, 02 Nov 2026 00:00:01 +0000 (source: open.er-api.com)..." |
| CC-04 | Accurate conversion using cached rates | EN | PASS | 100 USD at cached rate 0.85 EUR produces exactly `85.0000` EUR. |
| CC-05 | Online recovery and live rate retrieval | EN | PASS | Unrouted network, page reloaded. Banner updated with live mid-market timestamp from API. |
| CC-06 | Console Error Audit across CC journeys | All | PASS | Zero unhandled application console errors or page exceptions. |

---

### 2.4 Loan Calculator & KIBOR / APR / TAE / ÅOP

| ID | Test Scenario | Language | Status | Dynamic Evidence / Output |
|---|---|---|---|---|
| LC-01 | Switch to floating benchmark rate | EN | PASS | `#ac-kibor-alert` displays official SBP notice and reference link. |
| LC-02 | KIBOR tenor options inspection | EN | PASS | Option values verified: `["1m", "3m", "6m", "12m", "custom"]`. Zero hardcoded percentages. |
| LC-03 | Benchmark rate input interactivity | EN | PASS | `#ac-benchmark-rate` is user-editable with educational default label. |
| LC-04 | Fee-inclusive APR & EAR output (English) | EN | PASS | Fixture: $10,000 / 7% / 36 mo / $200 upfront / $10/mo recurring. Output: `8.58% (EAR: 8.93%)`. |
| LC-05 | TAE & TIN output (Spanish) | ES | PASS | Fixture identical. Output: `8.93% (TIN: 8.58%)`. TAE is statutory primary. |
| LC-06 | ÅOP & Nominel rente output (Danish) | DA | PASS | Fixture identical. Output: `8.93% (Nominel: 8.58%)`. ÅOP is statutory primary. |
| LC-07 | Console Error Audit across LC journeys | All | PASS | Zero unhandled console errors or page exceptions. |

---

### 2.5 Invoice Generator & Unicode PDF Export

| ID | Test Scenario | Language | Status | Dynamic Evidence / Output |
|---|---|---|---|---|
| IG-01 | Line item input & arithmetic reconciliation | EN | PASS | Line: 5 x $200 = $1,000. Discount $50, Tax 10% ($95), Shipping $25. Total Due: `$1,070.00`. |
| IG-02 | Negative quantity clamping | EN | PASS | Entering quantity `-2` is clamped to 0 in calculation engine; Subtotal remains `$0.00`. |
| IG-03 | Unicode text input (Danish & Spanish) | EN | PASS | Successfully populated: "Grønbæk & Peña Consultoría S.L.", "Mærsk & Cañellas Rådgivning Århus", "æ, ø, å, á, é, í, ó, ú, ñ". |
| IG-04 | Client-side jsPDF export execution | EN | PASS | Triggered Download PDF; jsPDF executed and created document blob with Unicode text without errors. |
| IG-05 | Console Error Audit across IG journeys | All | PASS | Zero unhandled console errors or page exceptions. |

---

## 3. Console & Network Log Audit

During the complete 32-scenario suite run, Playwright logged:
- **Unhandled Page Errors (`pageerror`):** 0
- **Unhandled Application Errors (`console.error`):** 0
- **Syntax / Reference Errors:** 0
- **Failed DOM Queries:** 0

All 32 end-to-end tests completed with exit code 0.
