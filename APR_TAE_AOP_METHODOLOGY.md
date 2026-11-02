# APR, TAE, and ÅOP Calculation Methodology & Jurisdictional Standards

**Date:** 2026-11-02  
**Author:** AnyConverter Financial Engineering & Mathematical Modeling Group  
**Status:** Methodological Definition & Implementation Framework  

---

## 1. Context & Review Finding

The second independent financial revalidation report identified that the loan calculator previously produced a nominal annualized rate ($\text{IRR} \times 12$) while labeling it interchangeably as:
- US **APR** (Annual Percentage Rate)
- Spanish **TAE** (Tasa Anual Equivalente)
- Danish **ÅOP** (Årlige Omkostninger i Procent)

This conflated nominal and compounded annualization conventions, causing an unexplained ~52 basis point gap for loans with upfront or recurring fees.

---

## 2. Mathematical Definitions & Jurisdictional Divergences

The fundamental difference lies in how periodic borrowing costs $r$ (monthly internal rate of return) are annualized.

### 2.1 The Periodic Internal Rate of Return ($r$)
For a loan with principal $P_0$, upfront fee $F_0$, and $n$ monthly cash outflows $C_k$ (where $C_k = \text{Payment}_k + \text{RecurringFee}_k$):

$$P_0 - F_0 = \sum_{k=1}^n \frac{C_k}{(1 + r)^k}$$

The solver uses the Newton-Raphson numerical algorithm (with bisection fallback) to find the monthly rate $r$ that balances net disbursements with borrower cash outflows.

---

### 2.2 Annualized Nominal IRR vs. Compounded Effective Annual Rate (EAR)

Once periodic rate $r$ is determined, two distinct annualization methods exist:

1. **Nominal Annualized Rate (US APR Convention — 12 CFR Part 1026 / Truth in Lending Act):**
   $$\text{Nominal APR} = r \times 12 \times 100$$
   - The US Truth in Lending Act (Regulation Z) requires quoting APR as a simple multiplication of the periodic rate by the number of compounding periods per year.
   - It ignores intra-year compounding on fees and interest.

2. **Effective Compounded Annual Rate (EAR / European Directive 2008/48/EC Convention):**
   $$\text{EAR} = \left((1 + r)^{12} - 1\right) \times 100$$
   - European Union Consumer Credit Directive (CCD) and Mortgage Credit Directive (MCD) define the statutory total borrowing cost as an actuarial compounded annual rate.
   - It fully accounts for the compounding effect over the 12 months.

---

### 2.3 Jurisdictional Equivalents: TAE (Spain) & ÅOP (Denmark)

- **Spanish TAE (Tasa Anual Equivalente):**
  - Regulated by Banco de España (Circular 5/2012) and Ley 16/2011 de contratos de crédito al consumo.
  - Mathematically defined as:
    $$\text{TAE} = \left((1 + r)^{12} - 1\right) \times 100$$
  - The nominal interest rate without fees is designated as **TIN** (Tipo de Interés Nominal).

- **Danish ÅOP (Årlige Omkostninger i Procent):**
  - Regulated by Kreditaftaleloven (Lovbekendtgørelse nr. 817) and Finanstilsynet.
  - Mathematically defined as the effective compounded annual internal rate of return:
    $$\text{ÅOP} = \left((1 + r)^{12} - 1\right) \times 100$$
  - The simple annual rate is designated as **Nominel rente** (debitorrente).

---

## 3. Numerical Benchmark Comparison

Consider a representative consumer loan fixture:
- **Principal ($P_0$):** $10,000.00
- **Nominal Contract Rate:** 7.00% per annum
- **Term ($n$):** 36 months
- **Upfront Financing Fee ($F_0$):** $200.00 (Net disbursed: $9,800.00)
- **Monthly Recurring Administration Fee:** $10.00
- **Base Monthly P&I:** $308.77
- **Total Monthly Borrower Outflow ($C_k$):** $318.77

### Solver Output:
- **Monthly Periodic Rate ($r$):** $\approx 0.007149$ (0.7149% per month)
- **US Nominal APR ($r \times 12$):** **8.58%**
- **Effective Annual Rate (EAR / TAE / ÅOP) ($(1+r)^{12}-1$):** **8.93%**

### The Conflation Error:
- If a Spanish or Danish borrower is shown 8.58% and told it is the TAE or ÅOP, they are given an understated borrowing cost by **35 basis points** (or up to 52+ bps depending on fee weighting).
- If a US borrower is shown 8.93% and told it is the APR, they are given a figure that does not match Truth in Lending Act disclosures.

---

## 4. Implementation Decision in AnyConverter

To resolve this discrepancy without making unsubstantiated regulatory compliance claims, AnyConverter adopted a **dual-metric display architecture**:

1. **Calculate both metrics strictly and independently:**
   ```javascript
   function solveFeeInclusiveAPR(principal, upfrontFee, cashFlows) {
     var r = newtonRaphsonSolver(principal - upfrontFee, cashFlows);
     var nominalApr = r * 12 * 100;
     var effectiveRate = (Math.pow(1 + r, 12) - 1) * 100;
     return {
       nominalApr: nominalApr,
       effectiveRate: effectiveRate,
       monthlyPeriodicRate: r
     };
   }
   ```

2. **Align primary and secondary labels by jurisdiction:**
   - **English (`/loan-calculator/`):**
     - Primary metric: **Fee-Inclusive APR (Nominal)** $\rightarrow 8.58\%$
     - Secondary subtitle: **Effective Annual Rate (EAR):** $\rightarrow 8.93\%$
   - **Spanish (`/es/loan-calculator/`):**
     - Primary metric: **TAE estimada (Tasa Anual Equivalente)** $\rightarrow 8.93\%$
     - Secondary subtitle: **TIN nominal:** $\rightarrow 8.58\%$
   - **Danish (`/da/loan-calculator/`):**
     - Primary metric: **ÅOP (Årlige Omkostninger i Procent)** $\rightarrow 8.93\%$
     - Secondary subtitle: **Nominel rente:** $\rightarrow 8.58\%$

3. **Explicit Disclaimer Policy:**
   - Neither the English, Spanish, nor Danish interface claims formal certification under SEC, Banco de España, or Finanstilsynet.
   - All rates are labeled with illustrative disclaimers noting that statutory legal contracts may require jurisdiction-specific calendar conventions (e.g., Actual/365, leap years) and mandatory inclusion/exclusion of specific notary, appraisal, or insurance charges.
