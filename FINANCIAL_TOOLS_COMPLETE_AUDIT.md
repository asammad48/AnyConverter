# AnyConverter.io — Comprehensive Financial Tools Audit & Research Report

**Document Status:** Complete Audit & Architectural Review  
**Date:** November 1, 2026  
**Audited Tool Count:** 17 Functional Financial & Money Utilities  
**Target Languages:** English (`/`), Spanish (`/es/`), Danish (`/da/`)

---

## Executive Summary

An exhaustive repository and DOM interactivity audit was performed across all financial, lending, interest, taxation, currency, and commercial utility tools on AnyConverter.io. While several tools possess robust localized interfaces (such as `discount-stacking` and `reverse-percentage`), core debt and investment tools—most notably **Loan Calculator**, **Mortgage Calculator**, and **Compound Interest Calculator**—exhibited substantial feature gaps when benchmarked against reputable financial institutions (Bankrate, Calculator.net, State Bank of Pakistan, Investor.gov).

This audit documents the current capabilities, critical gaps, beginner usability friction, advanced requirements, financial formulas, regional conventions (including Pakistan KIBOR), SEO intent, and implementation architecture across all 17 financial utilities.

---

## 1. Verified Financial Tool Inventory

The repository contains **17 distinct functional utilities** dedicated to finance, borrowing, taxation, currency, and commerce. Each tool is deployed across all three supported locales (`en`, `es`, `da`), yielding **51 active localized endpoints**.

| Priority | Tool Name | Slug | Script Path | Core Math Paradigm |
|---|---|---|---|---|
| **P1** | **Loan & EMI Calculator** | `loan-calculator` | `assets/js/tools/loan-calculator.js` | Reducing-balance EMI & Amortization |
| **P1** | **Mortgage Calculator** | `mortgage-calculator` | `assets/js/tools/mortgage-calculator.js` | PITI & Long-term Debt Amortization |
| **P1** | **Compound Interest Calculator** | `compound-interest-calculator` | `assets/js/tools/compound-interest-calculator.js` | Future Value of Lump Sum & Annuities |
| **P2** | **GST / VAT Calculator** | `gst-vat-calculator` | `assets/js/tools/gst-vat-calculator.js` | Net/Gross Tax Component Derivation |
| **P2** | **Discount Calculator** | `discount-calculator` | `assets/js/tools/discount-calculator.js` | Single-tier Markdown & Reverse Price |
| **P2** | **Discount Stacking Calculator** | `discount-stacking-calculator` | `assets/js/tools/discount-stacking.js` | Sequential Compounding Markdowns & Caps |
| **P2** | **Percentage Calculator** | `percentage-calculator` | `assets/js/tools/percentage-calculator.js` | Multi-mode Ratio & Variance Math |
| **P2** | **Reverse Percentage Calculator** | `reverse-percentage-calculator` | `assets/js/tools/reverse-percentage.js` | Multiplier Inversion & Anti-Mistake Logic |
| **P2** | **Currency Converter** | `currency-converter` | `assets/js/tools/currency-converter.js` | Mid-market FX Rates via Open API |
| **P3** | **Invoice Generator** | `invoice-generator` | `assets/js/tools/invoice-generator.js` | Line-item Tabulation & Client-Side jsPDF |
| **P3** | **Tip Calculator** | `tip-calculator` | `assets/js/tools/tip-calculator.js` | Gratuity Apportionment & Bill Splitting |
| **P3** | **Margin vs Markup Calculator** | `margin-vs-markup-calculator` | `assets/js/tools/margin-markup.js` | Margin ($\frac{\text{Profit}}{\text{Price}}$) vs Markup ($\frac{\text{Profit}}{\text{Cost}}$) |
| **P3** | **Pay Rise Calculator** | `pay-rise-calculator` | `assets/js/tools/pay-rise.js` | Wage Increment & Period Normalization |
| **P3** | **Percentage Difference Calculator** | `percentage-difference-calculator` | `assets/js/tools/percentage-difference.js` | Symmetric Relative Divergence |
| **P3** | **Price Increase Calculator** | `price-increase-calculator` | `assets/js/tools/price-increase.js` | Cost Escalation & Target Pricing |
| **P3** | **Unit Price Calculator** | `unit-price-calculator` | `assets/js/tools/unit-price.js` | Commodity Cost Normalization & Deal Comparison |
| **P3** | **CAMT.053 to CSV Converter** | `camt053-to-csv` | `assets/js/tools/camt053-to-csv.js` | ISO 20022 XML Cash Management Ingestion |

---

## 2. Deep-Dive Gap Analysis by Tool

### 2.1 Loan Calculator (`loan-calculator`) — Priority 1
* **Current State:** 39-line basic script taking only Loan Amount, Rate, and Term (in months only). Hardcoded `$` symbol. Output shows monthly EMI, total interest, and an unexpandable raw month table.
* **Missing Inputs:** 
  - Term input in years OR months.
  - Multi-currency selector (USD `$`, EUR `€`, GBP `£`, DKK `kr.`, PKR `Rs`, INR `₹`, CAD/AUD `$`).
  - Repayment frequency (Monthly, Bi-weekly, Weekly).
  - Loan Start Date (Month/Year).
  - Fees (Upfront origination/processing fee in % or fixed, recurring service fee).
  - Advanced interest models: Reducing balance vs Flat rate.
  - Extra payments (Regular extra monthly payment, one-time lump-sum with payoff date recalculation).
  - Benchmark floating-rate mode: Pakistan KIBOR (1M, 3M, 6M, 12M tenors) + Bank Spread.
* **Missing Outputs & Calculations:**
  - First-month payment breakdown (Principal vs Interest).
  - **Year 1 Summary:** Total paid during Year 1, Principal repaid in Year 1, Interest paid in Year 1, Remaining loan balance after Year 1.
  - Estimated payoff date (e.g., "October 2031").
  - **Annual Amortization Table:** Columns: `Year | Opening Balance | Total Payments | Principal | Interest | Fees | Closing Balance`, with click-to-expand monthly drilldown.
  - Scenario Comparison: Loan A vs Loan B (e.g. 15 yr vs 30 yr, or 5% vs 6.5%, or with vs without prepayments).
* **Beginner Usability Problems:** Beginners do not know the difference between APR, nominal interest, reducing balance, and flat rate. Entering term solely in months is awkward for 5-year auto loans.
* **Advanced User Needs:** Floating-rate repricing schedules (KIBOR resets), extra principal acceleration savings, loan comparison, CSV export.
* **Visualization:** Missing accessible visual breakdown (Principal vs Interest proportion bar/donut).

---

### 2.2 Mortgage Calculator (`mortgage-calculator`) — Priority 1
* **Current State:** 92-line script accepting Home Price, Down Payment ($), Rate, and Term (10, 15, 20, 30 years). Shows basic principal/interest horizontal bar and 12-month preview.
* **Missing Inputs:**
  - Down payment synchronization (entering % automatically updates $ and vice versa).
  - Property Tax (annual $ or %), Homeowners Insurance (annual $), Private Mortgage Insurance (PMI % if LTV > 80%), and HOA / Maintenance fees.
  - Loan Start Date.
  - Extra payment inputs (Extra monthly principal, annual prepayment).
* **Missing Outputs & Calculations:**
  - **LTV (Loan-to-Value) indicator:** Flags whether PMI is required ($\text{LTV} > 80\%$).
  - **Year 1 Summary:** Total Year 1 payment, Year 1 Principal, Year 1 Interest, Year 1 Taxes & Insurance, Balance after Year 1.
  - Complete Lifetime Amortization Schedule with annual collapse and monthly detail.
  - Side-by-side Term Comparison (10 vs 15 vs 20 vs 30 years).
  - Optional Affordability Guide: Monthly gross income, existing debt payments, estimated Debt-to-Income (DTI) ratio with the standard 28/36 rule disclaimer.
* **Usability & Regional Factors:** Danish market uses Realkreditlån (bond-based mortgages) and DKK; Spanish market uses Euribor-indexed mortgages; US/UK markets use fixed-rate and tracker mortgages. Tool must provide neutral mathematical framing with locale-appropriate defaults.

---

### 2.3 Compound Interest Calculator (`compound-interest-calculator`) — Priority 1
* **Current State:** 36-line script with Principal, Rate, Time (years), and Compounding Frequency.
* **Missing Inputs:**
  - Regular recurring contributions (Monthly, Annual, Quarterly deposits).
  - Contribution timing: Beginning of period (Annuity Due) vs End of period (Ordinary Annuity).
  - Annual contribution step-up / growth rate (% increase per year).
  - Inflation adjustment rate (% CPI).
  - Target savings mode (Goal solver: "How much must I save per month to reach $1,000,000 in 20 years?").
* **Missing Outputs:**
  - Split between Total Principal Invested, Total Contributions, and Total Compound Interest.
  - Real (inflation-adjusted) purchasing power vs Nominal final balance.
  - Annual progression schedule with export.
  - Visual stacked representation of contributions vs interest earned.

---

### 2.4 GST / VAT Calculator (`gst-vat-calculator`) — Priority 2
* **Current State:** Supports Inclusive vs Exclusive with country chips (India 5/12/18/28%, AU 10%, UK 20%, EU 21%, Nordic 25%).
* **Missing Features:**
  - Reverse tax calculation from tax amount alone.
  - Itemized multi-rate invoice items (e.g., standard rate item + zero-rated item + reduced rate item).
  - Printable calculation receipt / breakdown.
  - Support for multi-component taxes (e.g. Canadian GST + PST, US state + local sales tax).

---

### 2.5 Discount Calculator (`discount-calculator`) & Discount Stacking (`discount-stacking-calculator`) — Priority 2
* **Current State:** Single discount supports %, fixed, and reverse sale price. Discount stacking supports sequential cascading coupons, cashback, and minimum spend rules.
* **Missing Features:**
  - Tax application: Calculate tax BEFORE discount vs AFTER discount.
  - Bulk / volume tier discounting.
  - Buy-X-Get-Y-Free (BOGO) effective percentage equivalence solver.
  - Maximum savings cap enforcement (e.g. 50% off capped at $50).

---

### 2.6 Percentage Calculator & Reverse Percentage — Priority 2
* **Current State:** Percentage calculator has 4 tabs; Reverse percentage features excellent step-by-step guidance.
* **Missing Features:**
  - Step-by-step arithmetic explanations for all 4 basic percentage modes.
  - Successive / compound percentage changes ($+10\%$ followed by $+20\% \ne +30\%$).
  - Percentage point ($\text{pp}$) difference vs percentage change ($\%$) clarification.

---

### 2.7 Currency Converter (`currency-converter`) — Priority 2
* **Current State:** Fetches live rates via `open.er-api.com`.
* **Missing Features:**
  - Bank spread / FX fee modeling (e.g. 0.5%, 1%, 2.5% markup or wire fee).
  - Real-world received amount calculator.
  - Explicit disclaimer: indicative mid-market rate vs bank retail execution rate.
  - Offline fallback with common fixed currency pairs when offline.

---

### 2.8 Invoice Generator (`invoice-generator`) — Priority 3
* **Current State:** Line items (Description, Qty, Rate, Amount), Subtotal, Tax %, and client-side jsPDF.
* **Missing Features:**
  - Payment terms (Net 15, Net 30, Due on Receipt) and Due Date calculation.
  - Invoice discount (% or fixed) and Shipping fee lines.
  - Multi-currency selector (USD, EUR, GBP, DKK, PKR, etc.).
  - Bank details / payment instructions field in PDF.
  - Clean printable layout directly in browser (`@media print`).

---

### 2.9 Tip Calculator (`tip-calculator`) — Priority 3
* **Current State:** Bill, tip slider/presets, people count, per-person total.
* **Missing Features:**
  - Rounding option: Round total or per-person bill up to nearest integer (e.g., $25.32 -> $26.00).
  - Pre-tax vs Post-tax tipping option.
  - International tipping etiquette guide.

---

### 2.10 Specialized Commercial Calculators — Priority 3
* **Margin vs Markup (`margin-vs-markup-calculator`):** Already has strong core formulas; enhance with sales volume profit forecasting.
* **Pay Rise (`pay-rise-calculator`):** Enhance with inflation-adjusted real salary calculation.
* **Percentage Difference (`percentage-difference-calculator`):** Ensure clear distinction between difference, change, and relative error.
* **Price Increase (`price-increase-calculator`):** Add multi-year compounding price escalation.
* **Unit Price (`unit-price-calculator`):** Add cross-unit conversions (grams vs kilograms, oz vs lbs, ml vs liters).
* **CAMT.053 (`camt053-to-csv`):** Ensure comma vs semicolon delimiter toggle for European vs US spreadsheets.

---

## 3. Financial Accuracy, Rounding & Day-Count Standards

1. **Monetary Decimal Precision:**
   - All internal calculations must maintain IEEE 754 floating-point accuracy and round strictly to 2 decimal places (or 0 for integer currencies like JPY) at display and aggregation boundaries.
   - Amortization reconciliation identity must hold strictly:
     $$\text{Opening Balance} - \text{Principal Repaid} = \text{Closing Balance}$$
     $$\text{Total Payment} = \text{Principal} + \text{Interest} + \text{Applicable Fees}$$
   - On the final installment, any terminal rounding difference ($\pm \$0.01$) must be absorbed into the final principal payment so the ending balance terminates at exactly $0.00$.
2. **Standard Day-Count & Compounding Conventions:**
   - Consumer personal loans and standard mortgages: **30/360** or **Actual/365** with monthly compounding.
   - Monthly periodic rate $r = \frac{\text{Annual Nominal Rate}}{12 \times 100}$.
   - Equated Monthly Installment (EMI):
     $$\text{EMI} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
   - Flat Rate Loan Interest (for comparison mode):
     $$\text{Total Interest} = P \times \frac{\text{Rate}}{100} \times \text{Years}$$
     $$\text{Monthly Payment} = \frac{P + \text{Total Interest}}{n}$$
     *(The tool must clearly highlight that Flat Rate loans carry an effective APR approximately 1.7 to 1.9 times higher than reducing balance loans).*

---

## 4. Privacy, Performance & Client-Side Verification

1. **Zero External Data Transmission:**
   - Financial figures, income, debt, and loan amounts entered by users must remain 100% inside the client browser. No form submission or telemetry will send financial values to any external server.
2. **DOM Performance & Virtualization:**
   - 30-year mortgages involve 360 monthly installments. Emitting 360 uncollapsed table rows simultaneously degrades mobile DOM performance.
   - The architecture implements an **Annual Aggregation Table (Years 1 to 30)** with on-demand click-to-expand monthly drilldowns. This limits the initial table to 30 lightweight rows, delivering instant 60 FPS rendering.
3. **Export Capabilities:**
   - Client-side generated CSV download via standard `Blob` and data URI, requiring zero external server dependencies.

---

## 5. Architectural & Multi-Lingual Implementation Roadmap

- **Phase 1 (P1 High-Impact):**
  - Implement full Beginner vs Advanced mode architecture in `loan-calculator` with first-year summary, annual amortization schedule, expandable months, KIBOR floating rate options, loan comparison, and CSV export.
  - Implement comprehensive PITI, LTV indicator, term comparisons, extra payments, and affordability module in `mortgage-calculator`.
  - Implement regular contributions (start/end timing), inflation adjustment, target savings solver, and stacked breakdown in `compound-interest-calculator`.
- **Phase 2 (P2 Tax & Commercial):**
  - Upgrade `gst-vat-calculator`, `discount-calculator`, and `currency-converter` with bank spread and real-world costs.
- **Phase 3 (P3 Convenience Tools):**
  - Upgrade `invoice-generator` and `tip-calculator` with rounding and enhanced layouts.
- **Phase 4 (Validation & Verification):**
  - Multi-locale verification (EN, ES, DA), mathematical test suites, and regression checks across all 17 test suites.
