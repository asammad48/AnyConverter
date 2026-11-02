# INVOICE RECONCILIATION REPORT — ANYCONVERTER

**Tool:** Invoice Generator (`/invoice-generator/`, `/es/invoice-generator/`, `/da/invoice-generator/`)  
**Production Script:** `assets/js/tools/invoice-generator.js`  
**Status:** FULLY RECONCILED & VALIDATED  
**Date:** November 2026  

---

## 1. Accounting Formula & Reconciliation Rule

The on-screen invoice summary, printed document (`window.print()`), and downloaded PDF export (`jspdf`) must maintain exact mathematical parity down to the lowest currency unit (cents).

### Canonical Formula

$$\text{Item Total}_i = \text{round}_2(\text{Quantity}_i \times \text{Unit Price}_i)$$

$$\text{Subtotal} = \sum_{i=1}^N \text{Item Total}_i$$

$$\text{Invoice Discount} = \begin{cases} 
\text{round}_2\left(\text{Subtotal} \times \frac{\text{Discount Rate}}{100}\right) & \text{if percentage mode} \\
\min(\text{Subtotal}, \text{Fixed Discount Amount}) & \text{if fixed mode}
\end{cases}$$

$$\text{Net Taxable Base} = \max(0, \text{Subtotal} - \text{Invoice Discount})$$

$$\text{Tax Amount} = \text{round}_2\left(\text{Net Taxable Base} \times \frac{\text{Tax Rate}}{100}\right)$$

$$\text{Grand Total (Total Due)} = \text{Net Taxable Base} + \text{Tax Amount} + \text{Shipping}$$

$$= \text{Subtotal} - \text{Invoice Discount} + \text{Tax Amount} + \text{Shipping}$$

---

## 2. Defects Remediated

### 2.1 Element ID Mismatches & Missing Controls
- **Defect:** In previous versions, HTML elements possessed IDs like `btn-inv-add-row` and `btn-inv-pdf`, whereas script handlers looked for `inv-add-row` and `btn-download-pdf`. Furthermore, advertised print capabilities had no connected UI button.
- **Remediation:**
  - Standardized HTML across all three locales (`en`, `es`, `da`):
    - Add Row Button: `<button id="btn-inv-add-row">`
    - Print Button: `<button id="btn-inv-print">`
    - PDF Download Button: `<button id="btn-inv-pdf">`
  - In `assets/js/tools/invoice-generator.js`, event listeners bind to both modern and legacy IDs with null-guards:
    ```javascript
    var addBtn = document.getElementById('btn-inv-add-row') || document.getElementById('inv-add-row');
    if (addBtn) addBtn.addEventListener('click', addRow);
    ```

### 2.2 Missing Summary Rows (Discount & Shipping)
- **Defect:** The summary card in the UI previously only showed `Subtotal`, `Tax`, and `Total Due`. When a user entered a $50 discount or $25 shipping fee, the Grand Total changed without displaying the intermediate breakdown, creating borrower/accountant confusion.
- **Remediation:**
  - Added dedicated dynamic rows to `#inv-summary-table`:
    - `#inv-discount-row`: Displays `-$XX.XX` when discount > 0 (hidden when 0).
    - `#inv-shipping-row`: Displays `+$XX.XX` when shipping > 0 (hidden when 0).
  - Synchronized jsPDF coordinate generation to conditionally render Discount and Shipping rows between Subtotal and Grand Total, matching the on-screen card.

### 2.3 Rounding & Number Formatting Policy
- All monetary amounts use standard half-up arithmetic rounding to 2 decimal places:
  $$\text{round}_2(x) = \frac{\text{Math.round}(x \times 100)}{100}$$
- Output formatting utilizes `Intl.NumberFormat` with the active currency locale (`en-US`, `es-ES`, `da-DK`), respecting comma vs period decimal conventions.

---

## 3. Numerical Reference Verification Test Case

### Test Scenario Fixture
- **Line Item 1:** 5 units × $120.00 = $600.00
- **Line Item 2:** 2 units × $350.00 = $700.00
- **Line Item 3:** 10 units × $15.50 = $155.00
- **Invoice Discount:** 10% on Subtotal
- **Tax Rate:** 8.25%
- **Shipping Fee:** $45.00

### Step-by-Step Mathematical Reconciliation

| Accounting Metric | Calculation | Exact Value |
|---|---|---|
| **Subtotal** | $\$600.00 + \$700.00 + \$155.00$ | **$1,455.00** |
| **Invoice Discount (10%)** | $\text{round}_2(\$1,455.00 \times 0.10)$ | **-$145.50** |
| **Net Taxable Subtotal** | $\$1,455.00 - \$145.50$ | **$1,309.50** |
| **Tax Amount (8.25%)** | $\text{round}_2(\$1,309.50 \times 0.0825) = \text{round}_2(108.03375)$ | **+$108.03** |
| **Shipping & Handling** | Fixed input | **+$45.00** |
| **Grand Total (Total Due)** | $\$1,309.50 + \$108.03 + \$45.00$ | **$1,462.53** |

### Display Parity Check
- On-Screen UI Card: `$1,455.00 - $145.50 + $108.03 + $45.00 = $1,462.53` (PASS)
- Browser Print View (`@media print`): Identical table structure and values (PASS)
- Downloaded PDF (`jspdf`): Identical summary lines, right-aligned monetary values (PASS)

---

## 4. Unicode & Character Set Policy

- **Web UI & Browser Print:** Full native UTF-8 support for all international characters, diacritics (e.g. `€`, `kr.`, `£`, `Rs`, `á`, `é`, `í`, `ó`, `ú`, `ñ`, `æ`, `ø`, `å`), and non-Latin scripts.
- **jsPDF Export Note:** Default jsPDF core font (Helvetica) supports standard Latin-1 ASCII and basic Western European glyphs. When non-standard unicode characters are present, fallback sanitization prevents PDF generation crashes while preserving alphanumeric legibility.
