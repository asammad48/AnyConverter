# @anyconverter/math

Zero-dependency, pure calculation utilities for financial amortization, percentage arithmetic, and exact calendar date differences.

Extracted directly from production calculation engines on [AnyConverter.io](https://anyconverter.io).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

## Features

- ⚡ **Zero runtime dependencies:** Tiny footprint, fast execution in Node.js and modern browsers.
- 📐 **Percentage arithmetic:** Simple and multi-step percentage change, difference, margin/markup, and reverse percentage recovery.
- 💰 **Financial amortization:** Loan EMI calculation, full monthly/annual amortization schedules, extra principal acceleration, Effective Annual Rate (EAR), nominal APR, and compound interest.
- 🎯 **Goal solving:** Savings goal solvers computing required periodic deposits to reach future capital goals.
- 📅 **Exact calendar date arithmetic:** Gregorian calendar calculations factoring in month lengths and leap years.
- 🛡️ **TypeScript ready:** Ships with complete `.d.ts` type declarations.

---

## Installation

```bash
npm install @anyconverter/math
```

*Or with yarn / pnpm:*

```bash
pnpm add @anyconverter/math
```

---

## Quickstart

### CommonJS
```javascript
const {
  percentOf,
  percentageChange,
  calculateLoanPayment,
  calculateAmortizationSchedule,
  calculateCompoundInterest,
  calculateDateDifference
} = require('@anyconverter/math');
```

### ES Modules / TypeScript
```typescript
import {
  percentOf,
  percentageChange,
  calculateLoanPayment,
  calculateAmortizationSchedule,
  calculateCompoundInterest,
  calculateDateDifference
} from '@anyconverter/math';
```

---

## API Reference & Examples

### 1. Percentage Arithmetic

#### `percentOf(percentage, total)`
Calculates what $X\%$ of $Y$ is.
```javascript
percentOf(15, 200); // => 30
```

#### `percentageWhatIs(partial, total)`
Calculates what percentage $X$ is of $Y$.
```javascript
percentageWhatIs(25, 100); // => 25
```

#### `percentageChange(oldValue, newValue)`
Calculates directional percentage change from an old value to a new value.
```javascript
percentageChange(100, 150); // => +50 (%)
percentageChange(100, 75);  // => -25 (%)
```

#### `reversePercentage(finalValue, percentageRate)`
Recovers the original base amount before a percentage was added (e.g. VAT or sales tax).
```javascript
// $120 total with 20% VAT applied -> base is $100
reversePercentage(120, 20); // => 100
```

#### `marginFromMarkup(markupPct)` & `markupFromMargin(marginPct)`
Converts between cost markup and gross profit margin.
```javascript
marginFromMarkup(25); // => 20 (% gross margin)
markupFromMargin(20); // => 25 (% markup on cost)
```

Live online tool: [AnyConverter Percentage Calculator](https://anyconverter.io/percentage-calculator/)

---

### 2. Loan Amortization & Financial Engines

#### `calculateLoanPayment(principal, annualRatePct, termMonths, frequency = 12)`
Calculates periodic loan payment (EMI) on a reducing balance schedule.
$$\text{Payment} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
```javascript
// $300,000 mortgage at 6% annual over 30 years (360 months)
const monthlyPayment = calculateLoanPayment(300000, 6, 360, 12);
// => 1798.65
```

#### `calculateEar(annualRatePct, compoundFreq = 12)`
Calculates Effective Annual Rate (EAR) accounting for compounding intervals.
```javascript
// 12% nominal APR compounded monthly
calculateEar(12, 12); // => 12.6825 (%)
```

#### `calculateAmortizationSchedule(options)`
Generates full monthly schedule, annual summaries, total interest, and fee-inclusive totals.
```javascript
const schedule = calculateAmortizationSchedule({
  principal: 100000,
  annualRatePct: 6.5,
  termMonths: 120, // 10 years
  extraMonthly: 150 // optional accelerated prepayments
});

console.log(schedule.totalInterest); // Total interest incurred
console.log(schedule.actualPeriods); // Shortened payoff period count
console.log(schedule.annualSummary); // Year-by-year principal/interest breakdown
```

Live online tools:
- [AnyConverter Loan Calculator](https://anyconverter.io/loan-calculator/)
- [AnyConverter Mortgage Calculator](https://anyconverter.io/mortgage-calculator/)
- [AnyConverter Compound Interest Calculator](https://anyconverter.io/compound-interest-calculator/)

---

### 3. Date & Calendar Arithmetic

#### `calculateDateDifference(startDate, endDate)`
Calculates exact calendar difference factoring in varying month lengths and leap years.
```javascript
const diff = calculateDateDifference('2020-01-15', '2024-03-20');
// => { years: 4, months: 2, days: 5, totalDays: 1526, isNegative: false }
```

#### `isLeapYear(year)`
```javascript
isLeapYear(2024); // => true
isLeapYear(2023); // => false
```

Live online tool: [AnyConverter Age & Date Calculator](https://anyconverter.io/age-calculator/)

---

## Testing

Run the built-in unit test suite:

```bash
npm test
```

---

## License

MIT © [AnyConverter Team](https://anyconverter.io)
