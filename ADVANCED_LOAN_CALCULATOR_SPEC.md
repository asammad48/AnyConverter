# Advanced Loan Calculator & EMI Engine — Technical Specification

**System Component:** `loan-calculator`  
**Version:** 2.0.0  
**Architectural Paradigm:** Client-side Progressive Disclosure (Beginner Mode & Advanced Engineering Mode)  
**Standard Compliance:** Consumer Financial Protection Bureau (CFPB) TILA Reg Z, SBP Master Guidelines, ISO 31-0.

---

## 1. Architectural Philosophy & UX Design

The Loan & EMI Calculator is engineered around two complementary user modalities:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOAN CALCULATOR UX MODES                        │
├───────────────────────────────────┬────────────────────────────────────┤
│           BEGINNER MODE           │           ADVANCED MODE            │
│  - 4 core inputs                  │  - Floating Benchmark (KIBOR/SOFR) │
│  - Big stat cards (EMI, Interest) │  - Flat vs Reducing Balance        │
│  - First-Year Summary & Payoff    │  - Upfront & Recurring Fees        │
│  - Plain-language explanations    │  - Extra Prepayments & Payoff Gain │
│  - Interactive Presets (Auto/Home)│  - Scenario Comparison (Loan A/B)  │
│                                   │  - Full Annual & Monthly Amortize  │
│                                   │  - One-click CSV Export            │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Core Mathematical Formulas & Logic

### 2.1 Reducing-Balance Fixed Rate Amortization (Standard EMI)
Given:
- Principal: $P$
- Annual Interest Rate (%): $R_{\text{annual}}$
- Periodic Rate: $r = \frac{R_{\text{annual}}}{100 \times m}$ where $m$ is repayments per year (12 for monthly, 26 for bi-weekly, 52 for weekly).
- Total periods: $n = \text{years} \times m$ or direct count.

Periodic Payment ($M$):
$$M = \begin{cases} \frac{P}{n} & \text{if } r = 0 \\ P \times \frac{r(1+r)^n}{(1+r)^n - 1} & \text{if } r > 0 \end{cases}$$

For month $k \in [1, n]$:
- Interest component: $I_k = B_{k-1} \times r$
- Principal component: $C_k = M - I_k$
- Closing balance: $B_k = B_{k-1} - C_k$
- In the final period $n$: $C_n = B_{n-1}$ and $M_n = C_n + I_n$ (strictly eliminating floating-point dust).

### 2.2 Flat-Rate Interest (Clearly Delineated)
In certain auto finance or informal credit products, interest is charged on the original principal for the entire duration:
$$\text{Total Interest}_{\text{flat}} = P \times \left(\frac{R_{\text{annual}}}{100}\right) \times \left(\frac{n}{m}\right)$$
$$\text{Periodic Installment}_{\text{flat}} = \frac{P + \text{Total Interest}_{\text{flat}}}{n}$$
$$\text{Effective APR}_{\text{flat}} \approx \frac{2 \times m \times \text{Total Interest}}{P \times (n + 1)}$$
*Note:* The calculator explicitly flags to the user that a $10\%$ flat rate represents an effective reducing rate of approximately $18\%$, preventing deceptive borrowing traps.

### 2.3 Fee Modeling & Effective APR
- Upfront Processing Fee ($F_{\text{upfront}}$): Can be specified as a fixed dollar amount or percentage of loan amount ($P \times f_{\%}$).
- Recurring Fee ($F_{\text{recurring}}$): Added to each installment cycle.
- Total Financing Cost:
  $$\text{Total Cost} = \sum_{k=1}^n M_k + F_{\text{upfront}} + \sum_{k=1}^n F_{\text{recurring}}$$

### 2.4 Extra Payments & Prepayment Recalculation
Users can inject:
- Extra Monthly Payment ($\Delta M$): Added directly to principal reduction each cycle.
- One-time Lump Sum Prepayment at Month $T_{\text{lump}}$ ($L$): Reduces $B_{T_{\text{lump}}}$.
- Two Recalculation Policies:
  1. **Shorten Term (Default & Most Popular):** Keep installment $M$ constant; loan terminates earlier at $n^* < n$.
  2. **Reduce Installment:** Keep original maturity date $n$; recalculate lower installment $M^*$ over remaining balance.

---

## 3. Annual Amortization Table Specification

The table provides high-level clarity with deep inspection capabilities:

| Year | Opening Balance | Total Payments | Principal Repaid | Interest Paid | Fees | Closing Balance | Drilldown |
|---|---|---|---|---|---|---|---|
| Year 1 | $100,000.00 | $23,199.36 | $17,988.42 | $5,210.94 | $0.00 | $82,011.58 | [Expand 12 Mo ▾] |
| Year 2 | $82,011.58 | $23,199.36 | $19,006.12 | $4,193.24 | $0.00 | $63,005.46 | [Expand 12 Mo ▾] |

When the user clicks on any year row, an embedded sub-table slides open with the exact month-by-month figures for that specific year:
- Month index (e.g. Month 13 to Month 24)
- Payment date (e.g. Nov 2027)
- Scheduled payment
- Principal
- Interest
- Ending balance

### Strict Reconciliation Guarantee:
At every row:
$$\text{Opening Balance} - \text{Principal} = \text{Closing Balance}$$
$$\text{Total Payments} = \text{Principal} + \text{Interest} + \text{Fees}$$

---

## 4. First-Year Metrics Specification

Mandatory prominently highlighted statistics:
1. **First-Month Breakdown:** Principal vs Interest of the very first check.
2. **Year 1 Total Outflow:** Total cash paid during months 1–12.
3. **Year 1 Principal Retired:** How much debt was actually eliminated.
4. **Year 1 Interest Cost:** How much pure borrowing fee was paid in Year 1.
5. **Year 1 Ending Balance:** Remaining principal balance when entering Year 2.
6. **Payoff Date:** Month and Year of the final scheduled installment.

---

## 5. Loan Comparison Engine (Loan A vs Loan B)

Users can toggle the **Comparison Mode** to contrast two distinct borrowing scenarios:
- **Scenario A:** e.g., 30-year loan at 6.50% with 0 upfront points.
- **Scenario B:** e.g., 15-year loan at 5.75% with 1% upfront fee, OR 30-year loan with $200/mo extra payment.

Comparison Outputs:
- Difference in Monthly Payment ($\Delta M$)
- Difference in Year 1 Cash Outflow
- Difference in Total Lifetime Interest ($\Delta I_{\text{lifetime}}$)
- Difference in Debt Freedom Date (Months/Years Saved)

---

## 6. Client-Side CSV Export Specification

A button labeled **"Download CSV Schedule"** generates a standard comma-separated text file entirely in JavaScript:
- Headers: `Year,Month,PaymentDate,OpeningBalance,Payment,Principal,Interest,Fees,ClosingBalance`
- Formatted without currency symbols for spreadsheet compatibility.
- Instant download via `URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))`.
