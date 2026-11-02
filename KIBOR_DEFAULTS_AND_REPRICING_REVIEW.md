# KIBOR Defaults and Floating Benchmark Repricing Review

**Date:** 2026-11-02  
**Tool:** Loan Calculator (`assets/js/tools/loan-calculator.js`)  
**Scope:** Floating Benchmark (KIBOR / SOFR / EURIBOR / CIBOR) Architecture  
**Status:** Remediated & Verified  

---

## 1. Review Finding & Defect Description

In the previous iteration, hardcoded interest rates (such as `11.25%`, `11.50%`, `11.85%`, `12.10%`) were removed from visible dropdown label text, but the corresponding `<option value="...">` attributes remained populated with those exact obsolete values. Consequently, when a user selected a tenor (such as 3-Month or 6-Month), the event listener silently extracted the option's value and injected the hardcoded stale percentage into the loan calculation engine.

---

## 2. Remediation Architecture

### 2.1 Elimination of Stale Values
All hardcoded interest rates were purged from option values. The selector was refactored into a structural tenor key selector:

```html
<select id="ac-kibor-tenor">
  <option value="1m">1-Month Tenor (Monthly Reset)</option>
  <option value="3m">3-Month Tenor (Quarterly Reset)</option>
  <option value="6m" selected>6-Month Tenor (Semi-Annual Reset)</option>
  <option value="12m">12-Month Tenor (Annual Reset)</option>
  <option value="custom">Custom Benchmark Rate</option>
</select>
```

### 2.2 Independent Benchmark Rate Input
An explicit, user-editable numeric input (`#ac-benchmark-rate`) was introduced. Selecting a tenor changes the repricing interval rather than dictating an arbitrary rate.
- **Default value:** `6.00%`
- **Labeling:** Explicitly designated as a **"Hypothetical Educational Baseline"**
- **Bank Margin / Spread Input (`#ac-spread`):** Allows adding bank margin (e.g. +2.00%) to benchmark rate.

### 2.3 Transparent Statutory Source Disclosure
An amber informational alert box (`#ac-kibor-alert`) appears whenever the floating rate mode is activated:
> **Notice:** Variable benchmarks (such as KIBOR Offer-side published by the Financial Market Association of Pakistan / State Bank of Pakistan, or SOFR/EURIBOR) fluctuate daily with financial markets. All benchmark defaults here are strictly hypothetical educational baselines. Verify the current fixing directly at the official source before making credit commitments. [SBP Official KIBOR ↗](https://www.sbp.org.pk/ecodata/kibor_index.asp)

### 2.4 Multilingual Alignment (EN, ES, DA)
The substantive disclosures were translated and matched in Spanish and Danish:
- **Spanish (`es`):** Explains that variable indices (such as Euribor or KIBOR) fluctuate daily, all pre-filled numbers are hypothetical educational examples, and official fixings from Banco de España or SBP must be consulted.
- **Danish (`da`):** Explains that variable benchmarks (such as CIBOR, EURIBOR, or KIBOR) vary daily, all standard values are educational models, and official fixings from Finanstilsynet or central banks must be checked.

---

## 3. Repricing Schedule Modeling

The calculation engine maps each tenor key to a contractual repricing cycle:
- `1m`: Reset every 1 month
- `3m`: Reset every 3 months (quarterly)
- `6m`: Reset every 6 months (semi-annually)
- `12m`: Reset every 12 months (annually)

Under floating rate contracts, the baseline calculation evaluates the initial amortization schedule over Year 1 and across the full loan term assuming the current initial benchmark fixing, while noting that future payments will adjust upon each repricing date according to market movements.

---

## 4. Verification Evidence

1. **Static AST & String Audit:**
   - Zero occurrences of `11.25`, `11.50`, `11.85`, or `12.10` in `assets/js/tools/loan-calculator.js`.
2. **Browser Interactivity Audit (`tests/browser_e2e_financial_suite.js`):**
   - Tenor selector options verified: `["1m", "3m", "6m", "12m", "custom"]`.
   - Tested selecting different tenors in Chrome Headless: verify that the interest rate is not overwritten and calculations maintain the user-entered rate.
   - Tested user editing of `#ac-benchmark-rate` and verified schedule updates dynamically.
