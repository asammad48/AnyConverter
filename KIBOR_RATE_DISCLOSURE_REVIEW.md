# KIBOR RATE DISCLOSURE & BENCHMARK REVIEW — ANYCONVERTER

**Domain:** Loan & Consumer Financing Engine (`/loan-calculator/`, `/es/loan-calculator/`, `/da/loan-calculator/`)  
**Production Script:** `assets/js/tools/loan-calculator.js`  
**Status:** FULL AUDIT REMEDIATION COMPLETED  
**Date:** November 2026  

---

## 1. Regulatory Context & Sovereign Authoritative Source

### Benchmark Authority
- **Primary Source:** State Bank of Pakistan (SBP) / Financial Market Association of Pakistan (FMAP).
- **Official Portal:** `https://www.sbp.org.pk/ecodata/kibor_index.asp`
- **Definition:** Karachi Interbank Offered Rate (KIBOR) represents the average interest rate at which banks in Pakistan offer unsecured funds to other banks in the wholesale interbank money market.

### Applicable Side Convention: Offer vs. Bid
- **Offer Rate:** The rate at which funds are offered. Under State Bank of Pakistan regulations and standard Pakistani banking practice (for auto loans, consumer personal loans, and home mortgages), **the KIBOR Offer rate** is the binding statutory floating benchmark to which bank spreads are added.
- **Bid Rate:** The rate at which banks bid for funds (used predominantly in interbank placements, not retail lending).
- **AnyConverter Compliance:** The calculation engine exclusively utilizes the **Offer side** convention for all lending simulations, consistent with SBP Guidelines for Consumer Financing.

---

## 2. Defects Identified & Remediation

### 2.1 Removal of Stale Hardcoded Rates in Tenor Dropdown
- **Defect:** In prior iterations, dropdown options were rendered with hardcoded percentages embedded in their labels:
  - `1-Month KIBOR (~13.25%)`
  - `3-Month KIBOR (~13.50%)`
  - `6-Month KIBOR (~13.75%)`
  - `12-Month KIBOR (~14.00%)`
  These static percentages become misleading and stale as market fixings change over time.
- **Remediation:**
  - Removed all percentage approximations from the dropdown option labels across all supported locales:
    - **EN:** `1-Month Tenor (Monthly Reset)`, `3-Month Tenor (Quarterly Reset)`, `6-Month Tenor (Semi-Annual Reset)`, `12-Month Tenor (Annual Reset)`.
    - **ES:** `Plazo 1 Mes (Revisión mensual)`, `Plazo 3 Meses (Revisión trimestral)`, `Plazo 6 Meses (Revisión semestral)`, `Plazo 12 Meses (Revisión anual)`.
    - **DA:** `1 Måned (Månedlig regulering)`, `3 Måneder (Kvartalsvis regulering)`, `6 Måneder (Halvårlig regulering)`, `12 Måneder (Årlig regulering)`.
  - The benchmark rate input field (`#loan-rate`) remains completely visible and editable by the user to enter their specific sanction letter rate.

### 2.2 SBP Official Source & Observation Transparency
- **Defect:** Users were not provided with a transparent reference link to verify current market fixings, creating potential ambiguity between educational projections and live market quotes.
- **Remediation:**
  - Added an official link directly to the State Bank of Pakistan KIBOR archive within the `#ac-kibor-alert` banner:
    ```html
    <div id="ac-kibor-alert">
      <strong>Notice:</strong> KIBOR (Karachi Interbank Offered Rate) Offer side is the official benchmark published by the State Bank of Pakistan (SBP) / FMAP for retail and consumer lending. Projections are indicative educational simulations. Benchmark rate field is user-editable.
      <a href="https://www.sbp.org.pk/ecodata/kibor_index.asp" target="_blank" rel="noopener noreferrer">SBP Official KIBOR Data ↗</a>
    </div>
    ```

### 2.3 Multilingual Transparency Parity
- Verified that English, Spanish, and Danish versions convey identical regulatory and educational disclaimers, eliminating discrepancies where non-English users previously saw abbreviated messages without source attribution.

---

## 3. Mathematical Repricing & Cash Flow Mechanics

When floating benchmark mode is active, the engine recalculates installments at every repricing reset date ($f_{\text{repricing}} \in \{3, 6, 12\}$ months):

$$r_{\text{benchmark}}(m) = r_{\text{base}} + \Delta_{\text{scenario}}(m)$$

$$r_{\text{contract}}(m) = r_{\text{benchmark}}(m) + \text{Bank Spread}$$

$$\text{Installment}(m) = \text{Balance}(m-1) \times \frac{r_{\text{periodic}}(1 + r_{\text{periodic}})^{N_{\text{rem}}}}{(1 + r_{\text{periodic}})^{N_{\text{rem}}} - 1}$$

Where:
- $r_{\text{periodic}} = r_{\text{contract}} / 12 / 100$
- $N_{\text{rem}} = \text{termMonths} - m + 1$

This ensures that rate adjustments maintain an exact amortizing payoff by the contractual maturity date without creating unintended negative amortization or balance balloons.
