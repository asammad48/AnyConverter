# Protocol & Checklist for the Next Independent Financial Audit

**Audit Target:** AnyConverter Financial and Calculation Engines  
**Target Branch:** `feat/tool-enhancements-bulk-barcode-financial-ux`  
**Scope of Review:** Mathematics, Precision, Browser DOM Performance, Multilingual Parity (EN, ES, DA), Pakistan KIBOR Conventions, and Accessibility.

---

## 1. Scope & Objective for Independent Auditors

The following instructions are prepared for the independent auditor conducting the subsequent evaluation of AnyConverter's enhanced financial calculators. 

The audit must independently confirm that:
1. All financial calculations reconcile with zero floating-point accumulation drift over long durations (up to 30 years / 360 months).
2. The user experience strictly separates Beginner Mode (simplicity, plain language, big numbers) from Advanced Mode (deep inputs, schedules, scenarios) through progressive disclosure.
3. No external network dependencies or paid APIs were introduced.
4. All client-side privacy guarantees remain intact (zero financial numbers transmitted to servers).
5. All 18 automated repository test suites pass cleanly.

---

## 2. Independent Step-by-Step Verification Checklist

### 2.1 Automated Test Execution
Run the complete repository gate:
```bash
node tests/run_all_tests.js
```
*Expected Outcome:* All 18 suites pass, including `Financial Calculations & Amortization Suite`.

Run the dedicated financial calculations suite individually:
```bash
node tests/test_financial_calculations_suite.js
```
*Expected Outcome:* All 10 test categories log clean `PASS` confirmations.

---

### 2.2 Mathematical Reconciliation Audits
Execute independent manual or programmatic checks on the following identities:

1. **Balance Conservation Identity:**
   Inspect `schedule[k]`:
   $$\text{schedule}[k].\text{openingBalance} - \text{schedule}[k].\text{principal} = \text{schedule}[k].\text{closingBalance}$$
   Must hold to the exact penny for every single month across both reducing-balance loans and mortgages.

2. **Cash Flow Conservation Identity:**
   $$\text{schedule}[k].\text{payment} = \text{schedule}[k].\text{principal} + \text{schedule}[k].\text{interest} + \text{schedule}[k].\text{fees}$$

3. **Contractual Terminal Period Absorption:**
   Verify that month $n$ (e.g. Month 60 for 5-year loan, Month 360 for 30-year mortgage) has a closing balance of exactly $\$0.00$ and does not generate a synthetic month $n+1$.

---

### 2.3 Pakistan KIBOR Floating-Rate Verification
In `loan-calculator`:
1. Switch to **Advanced Options**.
2. Select **Interest Calculation Method** -> **Floating Benchmark (e.g. KIBOR / SOFR)**.
3. Confirm that:
   - Benchmark defaults to 6-Month KIBOR Offer side (~13.75%).
   - Bank Spread defaults to +2.00% (resulting in 15.75% initial rate).
   - The prominent notice is displayed: *"KIBOR Offer side standard for Pakistan retail & commercial lending. Projections are hypothetical educational simulations."*
   - Selecting future rate path **Benchmark Rises (+1.50% in Yr 2, +2.50% in Yr 3)** correctly increases subsequent installments on Month 13 and Month 25 without breaking amortization.

---

### 2.4 Mortgage PITI & LTV Verification
In `mortgage-calculator`:
1. Enter: Home Price $= \$400,000$, Down Payment $= \$40,000$ (10% down).
2. Confirm:
   - LTV displays `90.0%` with high LTV warning badge.
   - PMI estimate is automatically calculated and incorporated into monthly escrow.
3. Update Down Payment to $\$80,000$ (20% down).
   - LTV updates to `80.0%` with `Prime (No PMI Required)` green badge.
   - Monthly payment adjusts to exclude PMI.
4. Verify Term Comparison Matrix:
   - 10, 15, 20, 30-year options are compared side-by-side with exact lifetime interest savings.

---

### 2.5 Compound Interest Timing Verification
In `compound-interest-calculator`:
1. Test $\$10,000$ starting balance, 7% annual return, 10 years, $\$500$/month deposit.
2. Under Advanced Options, toggle Deposit Timing:
   - **End of Period (Ordinary):** Final balance $\approx \$106,639$.
   - **Beginning of Period (Annuity Due):** Final balance $\approx \$107,143$.
   - Verify that Annuity Due earns more interest than Ordinary Annuity due to immediate compounding.
3. Verify that Real Purchasing Power (inflation-adjusted) is displayed and is lower than the nominal balance when inflation $> 0$.

---

### 2.6 Cross-Viewport & Browser Performance
Inspect tools in Chrome DevTools or Playwright at:
- **Mobile Viewport (375px × 667px):** Verify no horizontal layout blowout; inputs stack neatly; drilldown tables scroll within their containers.
- **Tablet Viewport (768px × 1024px):** Verify grid responsiveness and touch target sizes ($\ge 44\text{px}$).
- **Desktop Viewport (1280px × 800px):** Verify full 3-column stats layout and side-by-side comparison tables.

---

### 2.7 Multilingual & Diacritics Quality
Inspect localized pages:
- Danish: `/da/loan-calculator/`, `/da/mortgage-calculator/`, `/da/compound-interest-calculator/`
  - Verify currency is DKK (`kr.`), number format uses Danish comma/period, and diacritics (å, æ, ø) are fully intact.
- Spanish: `/es/loan-calculator/`, `/es/mortgage-calculator/`, `/es/compound-interest-calculator/`
  - Verify currency is EUR (`€`), Spanish number format, and diacritics (á, é, í, ó, ú, ñ) are fully intact.
- English: `/loan-calculator/`, `/mortgage-calculator/`, `/compound-interest-calculator/`
  - Verify currency defaults to USD (`$`) with option to switch to GBP, PKR, INR, CAD, AUD.

---

## 3. Residual Risks & Ongoing Monitoring

1. **Client Browser Clock & Date Arithmetic:**
   Start dates use the user's local browser date. Month offsets rely on standard JavaScript `Date(year, monthIndex, 1)`. Edge cases around leap years or daylight saving time do not affect monthly periodicity because day count is anchored on day 1.
2. **Third-Party Exchange Rate API Availability:**
   `currency-converter` connects to `open.er-api.com`. If network requests fail, the tool gracefully falls back to displaying cached or baseline exchange rates with a descriptive message rather than crashing.
3. **Print Styles:**
   The print stylesheets collapse unexpanded accordions and suppress advertisements so that printed amortization summaries and invoices produce clean, professional hard copies.
