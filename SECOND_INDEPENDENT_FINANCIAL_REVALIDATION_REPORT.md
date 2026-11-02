# SECOND INDEPENDENT FINANCIAL REVALIDATION REPORT

**Date:** 2026-11-02
**Mode:** Strict read-only (no source, test, Git, Cloudflare or deployed-asset modifications).
**Scope:** Independent re-verification of repairs claimed in `FINANCIAL_DEFECT_REPAIR_LOG.md`, `INVOICE_RECONCILIATION_REPORT.md`, `KIBOR_RATE_DISCLOSURE_REVIEW.md`, `FINANCIAL_PRODUCTION_TEST_EVIDENCE.md` against the previously-identified defects in `INDEPENDENT_FINANCIAL_ENHANCEMENT_VALIDATION_REPORT.md`.

---

## 0. Verdict

> **FAIL — FIXES REQUIRED**

Multiple previously-flagged defects remain, several claimed repairs are not actually implemented in the shipped code, and a new **CRITICAL regression** has been introduced in the Compound Interest savings-goal solver.

---

## 1. Git State

| Item | Value |
|---|---|
| Branch | `feat/tool-enhancements-bulk-barcode-financial-ux` |
| HEAD | `4e930d67e251a3adade6eead5491337af4540c3d` |
| Latest commit | `4e930d6  Sitewide multilingual QA pass: new hubs, privacy wording, DA/ES fixes, cache bump` |
| Working tree | Repair changes **uncommitted** (modified + untracked), as expected per handoff |

**Modified (unstaged):**
`.ai-memory/DECISIONS.md`, `.ai-memory/HANDOFF.md`, `.ai-memory/STATE.json`, `.claude/settings.local.json`,
`assets/js/tools/compound-interest-calculator.js`, `assets/js/tools/currency-converter.js`,
`assets/js/tools/invoice-generator.js`, `assets/js/tools/loan-calculator.js`,
`assets/js/tools/mortgage-calculator.js`, `assets/js/tools/tip-calculator.js`,
`da/invoice-generator/index.html`, `es/compound-interest-calculator/index.html`,
`es/currency-converter/index.html`, `es/index.html`, `es/invoice-generator/index.html`,
`es/loan-calculator/index.html`, `es/mortgage-calculator/index.html`,
`invoice-generator/index.html`, `tests/run_all_tests.js`

**Untracked:** `ADVANCED_LOAN_CALCULATOR_SPEC.md`, `FINANCIAL_CALCULATION_TEST_REPORT.md`, `FINANCIAL_DEFECT_REPAIR_LOG.md`, `FINANCIAL_ENHANCEMENT_IMPLEMENTATION_LOG.md`, `FINANCIAL_FEATURE_GAP_MATRIX.json`, `FINANCIAL_MULTILINGUAL_SEO_REPORT.md`, `FINANCIAL_PRODUCTION_TEST_EVIDENCE.md`, `FINANCIAL_TOOLS_COMPLETE_AUDIT.md`, `INVOICE_RECONCILIATION_REPORT.md`, `KIBOR_INTEGRATION_RESEARCH.md`, `KIBOR_RATE_DISCLOSURE_REVIEW.md`, `MORTGAGE_ADVANCED_SCENARIOS.md`, `NEXT_FINANCIAL_INDEPENDENT_AUDIT.md`, `tests/test_financial_calculations_suite.js`.

Working tree preserved — no files modified, deleted or renamed by this audit.

---

## 2. Methodology & Limitations

- Independent static code review by four parallel audit agents, cross-checked against the referenced repair reports.
- Independent closed-form numerical reference calculations for compound interest, loan amortization, APR, and FX cross-rates.
- Automated test execution: `node tests/run_all_tests.js` (18/18 PASS) and `node tests/test_financial_calculations_suite.js` (16/16 PASS). Green test counts are not conclusive — see §9.
- **Browser-level dynamic verification (Playwright / Chrome DevTools) was NOT performed** in this pass. Behaviours gated on live DOM events (actual click dispatch, PDF binary rendering, print CSS cascade, keyboard focus, fetch soft-error UI paths) are flagged in the per-section notes. The handoff requested browser testing; absence of a provisioned headless harness in this environment is itself a release blocker and is counted below.

---

## 3. Defect-by-defect status

### 3.1 Invoice Generator

| ID (prior report) | Area | Repair claim | Independent status | Severity |
|---|---|---|---|---|
| I1 | Button ID standardization EN/ES/DA | FIXED | **VERIFIED** — identical `btn-inv-add-row`, `btn-inv-pdf`, `btn-inv-print` across all three locales. | — |
| I2 | Dual-ID without duplicate listeners | FIXED | **VERIFIED** — `invoice-generator.js:419, 437, 443` use `getElementById(new) \|\| getElementById(legacy)` short-circuit; single bind. | — |
| I3 | Discount & Shipping summary rows + math | FIXED | **VERIFIED** — `#inv-discount-row`, `#inv-shipping-row` render across EN/ES/DA; math `Subtotal − Discount + Tax(net) + Shipping` matches canonical formula at `invoice-generator.js:162–178`. | — |
| I4 | PDF includes Discount & Shipping lines | FIXED | **VERIFIED** — `invoice-generator.js:377–391` conditionally renders. | — |
| **I5 (new)** | Unicode / non-ASCII characters in PDF | Repair log claims "fallback sanitization prevents PDF generation crashes while preserving alphanumeric legibility" | **NOT IMPLEMENTED.** `invoice-generator.js:288–413` uses only `helvetica`, **no sanitization code anywhere**. Danish `æ ø å kr.`, Spanish `ñ á í ó ú ¿ ¡`, Euro `€`, and GBP `£` render as `?` / mojibake in jsPDF. DA locale especially exposed (default UI label itself is `Udskriv faktura`). | **MAJOR** |
| **I6 (new)** | `Intl.NumberFormat` locale formatting in PDF | Reconciliation report §2.3 claims per-locale formatting (`en-US`, `es-ES`, `da-DK`) | **NOT IMPLEMENTED.** Production code uses `(n).toFixed(2)` throughout (lines 181, 188, 195, 202, 209, 374, 379, 384, 389, 398). Spanish/Danish users see `1455.00` instead of `1.455,00`. | MINOR |
| **I7 (new)** | Negative qty/rate clamping | n/a | Qty/rate not clamped; subtotal row can display negative figure. `Math.max(0, …)` only guards downstream tax base. | MINOR |
| **I8 (new)** | PDF total label spacing | n/a | `T.tax + ' (' + taxPct + '%)'` produces `"Tax: (8.25%)"` with colon before parenthetical; DA `"Total til betaling:"` + right-aligned amount may crowd at x≈185. Not visually verified. | MINOR |

### 3.2 Compound Interest Calculator

| ID | Repair claim | Independent status | Severity |
|---|---|---|---|
| C1 | Compounding dropdown functional | FIXED | **VERIFIED.** `assets/js/tools/compound-interest-calculator.js:211–215` uses `periodicRate = (1 + rNom/n)^(n/12) − 1`. Independent reference values at P=10 000, r=7 %, 10 y, no deposits: daily (n=365) **$20 136.18**, monthly **$20 096.61**, annual **$19 671.51**. Code reproduces within rounding tolerance. |
| C2/C3 | Savings-goal solver respects compounding + contribution timing | FIXED | **BROKEN — NEW REGRESSION.** `compound-interest-calculator.js:553` and `:560` reference undeclared identifiers `compoundFreq` and `contribTiming`; enclosing function `executeCompoundCalculation` (line 493) declares them as `freq` and `timing`. File is in `'use strict'` mode (line 9). **Throws `ReferenceError` the moment a user enters a positive `#ci-goal`.** Required-monthly-contribution output and `{init}` placeholder substitution never execute. | **CRITICAL** |
| C4 | Inflation, zero rate, ordinary vs. annuity-due | n/a | Ordinary / annuity-due branch at `:231–239` is correct; zero-rate guard `rNom > 0` works; EAR formula `(1 + r/n)^n − 1` at `:264` correct. | — |

### 3.3 Loan Calculator & APR

| ID | Repair claim | Independent status | Severity |
|---|---|---|---|
| L2 | Recurring monthly fees included in Total Repayment | FIXED | **VERIFIED.** `loan-calculator.js:454–475`: `totalFees` accumulates upfront + per-period, `totalBorrowerOutlay = totalPaid + totalFees`. |
| L3/L4 | Fee-inclusive APR | FIXED | **VERIFIED structurally.** `solveFeeInclusiveAPR` (lines 309–334) solves Newton-Raphson on `netDisbursed = Σ CF_t / (1 + r)^t`, `netDisbursed = principal − upfrontFee`, `CF_t = payment + recurringFee`. Independent reference at $10 000 / 7 % / 36 mo + $200 upfront + $10/mo: EMI = **$308.77**, netDisbursed = $9 800, implied monthly rate ≈ 0.00876, **nominal APR ≈ 10.51 %**. Repair log cites 10.55 % — 4 bps delta attributable to rounding in amortization loop. Acceptable. |
| **L-APR (new)** | APR label vs. convention mismatch | not acknowledged | **DEFECT.** Solver returns a **nominal annual rate** (`r × 12 × 100`, line 333) but ES label is **"TAE / Tasa efectiva"** (`:147`) and DA label is **"ÅOP / Effektiv rente"** (`:229`). TAE under Spanish Circular 5/2012 and ÅOP under Danish Forbrugeraftaleloven §13 are statutorily **effective** rates (compounded + fee-inclusive). For the fixture above: nominal 10.51 % vs true EAR `(1 + 0.00876)^12 − 1 = 11.03 %` — **~52 bps understatement under local legal definition**. EN "Effective APR" label is also loose but tolerable under US TILA. | **HIGH** |
| L5 | Floating-rate 0.5 % floor | not addressed | Still undisclosed to user (`loan-calculator.js:880`). | LOW |
| L-flat | Flat-rate prepayment UX | FIXED | Disclosure template at line 66 warns prepaying does not reduce flat interest; math (line 390–391) applies flat interest on original principal — consistent with disclosure. Accept as "disclose, not fix". | — |

### 3.4 KIBOR Benchmark

| Area | Status | Evidence |
|---|---|---|
| Tenor labels | FIXED | `loan-calculator.js:35–38, 563–566` — no `(~13.75 %)` suffixes. |
| SBP official link | PASS | `loan-calculator.js:592` → `https://www.sbp.org.pk/ecodata/kibor_index.asp`, `rel="noopener noreferrer"`. Present once in shared HTML, inherited by all locales. |
| Offer-side wording | PASS | EN:34, ES:116, DA:198. |
| Bank margin, repricing, custom scenarios | PASS | Spread input `#ac-spread-rate`, repricing toggle `#ac-repricing-wrap`, additive combination verified. |
| **Silent stale-rate application on tenor change** | **NOT FIXED** | `<option value>` still carries hardcoded `13.25` / `13.50` / `13.75` / `14.00`. On tenor change (`:791–798`) the handler writes `tenor + spread` to `#loan-rate` without observation date or "verify against SBP" prompt. Stale values moved from `<option>` text to `<option value>` — **cosmetically remediated only**. Current (Oct-2026) SBP Offer-side is ≈ 12.5 %, so defaults are ~100 bps high. | **HIGH** |
| ES/DA disclaimers | PASS | SBP/FMAP attribution, Offer-side convention, educational framing all present. |

### 3.5 Currency Converter

| Area | Status | Evidence |
|---|---|---|
| `BASELINE_RATES` provenance | **UNDOCUMENTED** | `currency-converter.js:4–9` — 21 USD-base ratios. **No source citation, no observation date, no comment.** Values plausible for 2024–2026 window. Repair log rates this MEDIUM. | **CRITICAL** |
| User disclosure on fallback | PARTIAL | Line 53 shows `"Using offline benchmark reference rates (live network feed unavailable). Real-time rates update automatically when online."` No date, no "do not use for transactions" badge, no visual difference in `#cc-result-input` precision between live and fallback paths. User who misses one line of helper text sees a numerically fresh-looking output. |
| Soft-error path (API returns 200 with `data.result !== 'success'`) | **BROKEN** | `currency-converter.js:38` — `if (data.result === 'success') { … }` has **no `else`**. `rates` stays `null`, `rate-info` stuck on `"Loading mid-market rates…"`, `convert()` early-returns silently. User sees no result and no error. | **HIGH** |
| Base currency forcing in fallback | OBSERVABLE | Line 50 forces `base = 'USD'` in fallback regardless of user's selected "From" currency — cross-rate math works, UI dropdown may show divergent state with no indication. | MEDIUM |
| Timeout / malformed JSON | NEEDS LIVE TEST | Only the `.catch` branch is covered. Soft-error above is uncovered. |

### 3.6 Mortgage Calculator

| ID | Repair claim | Independent status | Severity |
|---|---|---|---|
| **MR1** | `<input id="mort-pmi">` added to Advanced Escrow panel | **UNIMPLEMENTED.** `mortgage-calculator.js:711` reads `document.getElementById('mort-pmi')` — no corresponding `<input>` rendered in template (lines 476–518). Falls through to hardcoded `0.75` %. PMI control still **cannot be changed by user**. | **CRITICAL** |
| **MR2** | `#ac-mort-pmi-milestone-wrap` + `#ac-mort-pmi-date` added | **UNIMPLEMENTED.** Code references at `:738–739`; DOM nodes never rendered (`:528–614`). Dead code; termination milestone invisible to user. | **CRITICAL** |
| **MR3** | Bidirectional down-payment $ ↔ % sync | **UNIMPLEMENTED.** No `#mort-down-pct` input exists; only read-only badge `#ac-down-pct-badge` (`:456`). Price→down and down→badge handlers (`:651, :659`) update the badge; **no reverse path**. One-directional only. | **CRITICAL** |
| MR4 | PMI test passes | FALSE CONFIDENCE | `test_financial_calculations_suite.js:302–311` calls `mortEngineFn({pmiRate: 0})` directly, bypassing mount. Green test hides MR1. | HIGH |
| MR5 | PMI auto-cancellation at 80 % of original price | **US-ONLY, APPLIED GLOBALLY** | `:286, :322, :403` — US HPA statute (12 USC §4902) applied unconditionally to EUR, DKK, GBP, PKR, INR. Danish Realkredit `bidragssats` persists for life of loan; ES has no PMI; UK uses one-off HLC. | HIGH |
| MR6 | 28/36 DTI thresholds | **US-ONLY, APPLIED GLOBALLY** | `:793` hardcodes `frontDti ≤ 28 && backDti ≤ 36`. DA copy mentions `gældsfaktor` (DK norm ≤ 3.5× annual income) but engine still applies 28/36 and shows the badge. | HIGH |
| MR7 | ES/DA copy strings | **US thresholds in localized text** | `:38, :111, :187` — `dtiStatusGood` strings literally include "≤ 28 % / ≤ 36 %" in all three locales. | HIGH |
| MR8 | PKR/INR support | MISSING | `CURRENCIES` (`:239–245`) includes USD/EUR/DKK/GBP/CAD/AUD; no PKR, no INR. Audit cannot execute those scenarios because they are not selectable. | MEDIUM |
| MR9 | "Total Loan Cost" semantics | MIS-FRAMED | `:412` `totalCost = principal + totalInterest + down`. Excludes escrow/taxes/insurance/HOA/PMI despite UI framing it next to PITI. | MEDIUM |
| MR10 | Monthly-rate convention | US-ONLY | `annualRate/100/12` applied globally; ES/DK commonly use `(1+r)^(1/12) − 1`. | MEDIUM |
| MR11 | Default PMI 0.75 % | US midpoint | `:286`, applied in all locales. | LOW |
| MR12/MR13 | PMI translated to ES "Seguro hipotecario" / DA "Låneforsikring" | TERMINOLOGY INCORRECT | Spanish mortgages do not use PMI; "Låneforsikring" is not a Realkredit term. Dead labels (unreachable because MR1). | MEDIUM |
| MR14 | "28/36 rule" referenced in EN as universal | WORDING ISSUE | `:38` — no US-only qualifier. | LOW |
| MR15 | "Inspect individual years" hardcoded English | i18n MISS | `:594` — not localized; ES/DA users see English. | LOW |

**Spanish diacritics:** PASS in mortgage context. `es/mortgage-calculator/index.html:7, 17, 26` have correct `amortización`, `práctica`; propagation into `es/index.html:520`, `es/loan-calculator/index.html:159`, `es/currency-converter/index.html:160`, `es/compound-interest-calculator/index.html:169` confirmed. Note: `es/index.html` still contains unaccented `practicos`, `tamano`, `deteccion` etc. in other (non-financial) tool cards — out of scope for this pass but documents an incomplete diacritic sweep.

---

## 4. Test suite coverage quality

Both suites report **PASS** (`run_all_tests.js` 18/18, `test_financial_calculations_suite.js` 16/16). The green banner is **not a safety signal** for this release:

| ID | Severity | Issue |
|---|---|---|
| TS1 | HIGH | Engines are regex-extracted from production files and executed in a stripped VM sandbox — IIFE wrappers, event bindings, DOM mount and i18n glue are skipped. Tests exercise pure math only. |
| **TS2** | **CRITICAL** | No DOM-level test for mortgage PMI/down-payment UI. Would have caught MR1/MR2/MR3 (dead `getElementById` IDs). |
| TS3 | HIGH | Invoice test (`:342–372`): sandbox `classList`, `querySelectorAll` are no-ops; buttons/handlers/`recalc()` never fire. Asserts `doesNotThrow` + element existence, not reconciliation. |
| TS4 / TS10 | HIGH | Currency test (`:382–395`) only asserts `doesNotThrow` on `vm.runInContext`; `fetch` stub rejects but result is never awaited or inspected. The §3.5 soft-error (missing `else` on line 38) would still pass. |
| TS5 | HIGH | No negative/invalid-input tests (NaN principal, zero term, down > price, pmiRate > 20 %, rate > 100 %, LTV > 100 %). |
| TS6 | MEDIUM | Flat-rate APR assertion is a **range** (13.0 %–16.0 %), not pinned. Masks drift. Independent reference: flat 8 %/36 mo on 10 000 ⇒ implied reducing APR ≈ 14.59 %. |
| TS7 | MEDIUM | Fee-inclusive APR assertion is tautological (`effectiveApr > rate`); 10.55 % value in repair log is not pinned. |
| TS8 | MEDIUM | Invoice "reconciliation" test asserts node existence, never `Subtotal − Discount + Tax + Shipping === Total`. |
| TS9 | MEDIUM | No real PDF content assertions. I5 (Unicode) and I4 (PDF discount/shipping lines) would not be caught. |
| TS11 | LOW | Inflation test uses `expectedReal = res.finalNominal / 1.03^10` — circular (derived from engine's own output). |
| TS12 | LOW | ES diacritic test checks one phrase only, not the propagated 4 card snippets or the ES mortgage FAQ. |
| TS13 | LOW | `run_all_tests.js` wraps the suite as a single PASS/FAIL. |

---

## 5. New regressions introduced in this repair cycle

1. **Compound Interest savings-goal solver** (`compound-interest-calculator.js:553, 560`) — `ReferenceError` on any positive `#ci-goal` under `'use strict'`. **CRITICAL**. Was functional (if arithmetically wrong) in prior report; now throws.
2. **Mortgage PMI / Down-payment controls** (`mortgage-calculator.js:711, 738–739`; template `:476–518`) — repair log claims inputs were added, but code reads IDs that are never rendered. The *engine* now accepts `pmiRate` parameter; the *UI* never surfaces it. Net user-visible effect: identical to pre-repair state. **CRITICAL**.
3. **KIBOR tenor dropdown values** — label cleanup moved stale numbers from `<option>` text into `<option value>` attributes, where they are silently auto-applied to `#loan-rate` on tenor change. Pre-repair the staleness was at least visible. **HIGH**.
4. **Repair-log overstatement — invoice Unicode / `Intl.NumberFormat`** — documentation drift; no functional regression but creates false release confidence. **MAJOR**.

---

## 6. Remaining blockers for release

| # | File:Line | Minimal corrective action |
|---|---|---|
| B1 | `assets/js/tools/compound-interest-calculator.js:553, 560` | Rename `compoundFreq` → `freq`, `contribTiming` → `timing` (or destructure result object before use). |
| B2 | `invoice-generator/index.html` (and es/, da/) + `assets/js/tools/invoice-generator.js:288–413` | Either (a) embed a Unicode-capable font in jsPDF (e.g. Roboto / Noto via `addFont`) **or** (b) implement the sanitization promised in the reconciliation report AND strip the "Unicode supported" claim from docs. |
| B3 | `assets/js/tools/mortgage-calculator.js` template `:476–518` & `:528–614` | Render the missing `<input id="mort-pmi">`, `#ac-mort-pmi-milestone-wrap`, `#ac-mort-pmi-date`, and a real `#mort-down-pct` input with bidirectional sync. |
| B4 | `assets/js/tools/mortgage-calculator.js:286, 322, 403, 793` + locale strings `:38, :111, :187` | Gate PMI/HPA 80 % termination and 28/36 DTI by locale, or add explicit "Assumptions: US" disclosures. |
| B5 | `assets/js/tools/currency-converter.js:4–9` | Add `BASELINE_RATES_ASOF` date constant; render in fallback banner; add visible "STALE — do not use for transactions" badge on the result field in fallback mode. |
| B6 | `assets/js/tools/currency-converter.js:38` | Add `else` branch to surface API soft-errors (200 with `data.result !== 'success'`). |
| B7 | `assets/js/tools/loan-calculator.js:333` + locale labels `:147 (TAE)`, `:229 (ÅOP)` | Either compute true EAR for ES/DA presentation, or relabel to "TIN / Nominel rente" to match the nominal annualization currently returned. |
| B8 | `assets/js/tools/loan-calculator.js:562–567, 791–805` | Change `<option value>` to tenor keys; render observation-date-stamped indicative value only after an explicit "Load indicative KIBOR (as of YYYY-MM-DD)" action. |
| B9 | `tests/test_financial_calculations_suite.js` | Add jsdom DOM-mount tests (would catch B1 and B3); pin APR expected values; add negative-input / boundary tests; add PDF content assertions; add real offline-fetch assertion for currency. |
| B10 | Browser verification | Execute the invoice, compound-interest, loan, mortgage and currency flows in Playwright or Chrome DevTools before sign-off; current audit evidence is static-analysis only. |

---

## 7. Preserved functionality / out-of-scope

- Barcode Generator: **not modified** in this cycle; bulk-barcode enhancements remain a separate incomplete workstream per `.ai-memory/HANDOFF.md`. No evidence to the contrary surfaced.
- Tip Calculator: modified in the working tree but outside the finance revalidation scope; not re-verified here.
- SEO / release gates: not re-run in this audit; prior release gate (`0e92a00`) was green on the previous HEAD, not on this uncommitted tree.

---

## 8. Final Verdict

### **FAIL — FIXES REQUIRED**

Three CRITICAL unresolved items (compound-interest goal solver `ReferenceError`; mortgage PMI/down-payment UI entirely absent; currency `BASELINE_RATES` undated with silent soft-error path), two HIGH items (APR/TAE/ÅOP label mismatch; KIBOR stale values silently auto-applied), plus multiple MAJOR/MEDIUM items. Test suite reports PASS but materially under-covers the UI paths where the critical defects live.

Do **not** merge, deploy, or publish to Cloudflare until B1–B10 are addressed and re-verified by browser-level testing.

---

*This report is strictly observational. No source files, tests, Git history, Cloudflare configuration, or deployed assets were modified. Working tree preserved exactly as received.*
