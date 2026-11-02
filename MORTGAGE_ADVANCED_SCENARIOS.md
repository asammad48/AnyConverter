# Mortgage Calculator Advanced Scenarios & PITI Technical Specification

**System Component:** `mortgage-calculator`  
**Version:** 2.0.0  
**Architectural Scope:** Comprehensive Real Estate Lending, PITI Breakdown, LTV Monitoring & Affordability

---

## 1. Comprehensive Input Architecture

The enhanced Mortgage Calculator supports both beginner homebuyers and advanced real estate investors.

### 1.1 Core Inputs:
- **Home Purchase Price:** $P_{\text{home}}$
- **Down Payment:** Entered either as a percentage ($D_{\%}$) or monetary amount ($D_{\$}$). Editing one instantly updates the other ($D_{\$} = P_{\text{home}} \times \frac{D_{\%}}{100}$).
- **Loan Amount (Principal):** $P = P_{\text{home}} - D_{\$}$
- **Loan Term:** 10, 15, 20, 25, 30 years (with custom year option).
- **Annual Interest Rate:** $R_{\text{annual}}$ (%)
- **Start Date:** Month & Year.

### 1.2 Advanced Real Estate Holding Costs (PITI & Escrow):
- **Property Tax:** Annual dollar amount or annual percentage of home value (Default: 1.2% / year).
- **Homeowners Insurance:** Annual premium (Default: $1,200 / year).
- **Private Mortgage Insurance (PMI):** Automatic detection based on LTV. If $\text{LTV} > 80\%$, standard PMI rate (e.g. 0.75% annually) applies to principal until the loan balance amortizes to $78\%$ or $80\%$ of original purchase price, at which point PMI drops off.
- **HOA / Condo / Maintenance Fees:** Monthly dollar amount.
- **Extra Monthly Principal:** Accelerated debt reduction.

---

## 2. Mathematical Formulations

### 2.1 Loan-to-Value (LTV) Ratio:
$$\text{LTV} = \frac{P_{\text{home}} - D_{\$}}{P_{\text{home}}} \times 100\%$$
- If $\text{LTV} \le 80\%$: Conventional prime status. No PMI required.
- If $\text{LTV} > 80\%$: High-LTV status. System activates PMI warning and estimates monthly PMI surcharge.

### 2.2 PITI Monthly Breakdown:
$$\text{Total Monthly Housing Cost} = \text{P\&I} + T_{\text{monthly}} + I_{\text{monthly}} + \text{PMI}_{\text{monthly}} + \text{HOA}_{\text{monthly}}$$
Where:
- $\text{P\&I} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$
- $T_{\text{monthly}} = \frac{\text{Annual Property Tax}}{12}$
- $I_{\text{monthly}} = \frac{\text{Annual Insurance}}{12}$
- $\text{PMI}_{\text{monthly}} = \begin{cases} \frac{B_k \times \text{PMI}_{\%}}{12} & \text{if } B_k > 0.80 \times P_{\text{home}} \\ 0 & \text{otherwise} \end{cases}$

---

## 3. Mandatory Year 1 and Lifetime Deliverables

### 3.1 Year 1 Summary Statistics:
- **Total Paid During Year 1:** Sum of all 12 installments (P&I plus taxes, insurance, HOA).
- **Principal Retired in Year 1:** Exact reduction in mortgage balance.
- **Interest Paid in Year 1:** Total borrowing cost paid to the lender in Year 1.
- **Taxes & Insurance Paid in Year 1:** Total escrow contributions.
- **Mortgage Balance After 12 Months:** Exact remaining principal.

### 3.2 Visual Analytics:
A clean, responsive visual stack illustrating the composition of the monthly payment:
- **Principal:** Green `#10b981`
- **Interest:** Crimson `#ef4444`
- **Taxes:** Amber `#f59e0b`
- **Insurance & HOA:** Indigo `#6366f1`

---

## 4. Term Comparison Matrix (10 vs 15 vs 20 vs 30 Years)

An interactive matrix compares identical loan principals across standard horizons:

| Term | Monthly P&I | Total Interest Paid | Total Loan Cost | Payoff Year | Monthly Difference |
|---|---|---|---|---|---|
| **10 Years** | $3,372.83 | $104,739.73 | $404,739.73 | 2036 | +$1,476.24 |
| **15 Years** | $2,613.32 | $170,398.08 | $470,398.08 | 2041 | +$716.73 |
| **20 Years** | $2,236.71 | $236,810.02 | $536,810.02 | 2046 | +$340.12 |
| **30 Years (Base)** | **$1,896.59** | **$382,773.74** | **$682,773.74** | **2056** | **Baseline** |

*Key Insight:* Choosing a 15-year mortgage over a 30-year mortgage increases monthly payment by $716.73 but saves a staggering **$212,375.66** in lifetime interest and frees the homebuyer 15 years sooner.

---

## 5. Home Affordability & DTI Guidance (Educational)

### 5.1 The Standard 28/36 Rule:
- **Front-End Ratio ($\le 28\%$):** Total monthly housing payment (PITI + HOA) should not exceed 28% of gross pre-tax household monthly income.
- **Back-End Ratio ($\le 36\%-43\%$):** Total monthly debt obligations (Housing + Auto + Student Loans + Credit Card minimums) should not exceed 36% (conservative) to 43% (conventional conforming limit) of gross monthly income.

### 5.2 Legal & Financial Non-Binding Disclaimer:
> *"Affordability estimates are strictly educational mathematical guidelines and do not constitute loan qualification, pre-approval, or a guarantee of credit extension by any financial institution. Actual underwriting requirements vary based on credit score, assets, employment history, and lender regulations."*
