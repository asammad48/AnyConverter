/**
 * Test Suite for @anyconverter/math
 * Tests all percentage, financial amortization, and date difference calculations.
 */
'use strict';

const assert = require('assert');
const math = require('../index.js');

const {
  percentOf,
  percentageWhatIs,
  percentageChange,
  percentageAdd,
  percentageSubtract,
  percentageDifference,
  reversePercentage,
  marginFromMarkup,
  markupFromMargin,
  calculateLoanPayment,
  calculateEar,
  calculateNominalApr,
  calculateAmortizationSchedule,
  calculateCompoundInterest,
  calculateSavingsGoal,
  isLeapYear,
  daysInMonth,
  calculateDateDifference,
  addDays
} = math;

console.log('====================================================');
console.log('   RUNNING @anyconverter/math UNIT TEST SUITE       ');
console.log('====================================================\n');

let total = 0;
let passed = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [TEST ${total}] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [TEST ${total} FAILED] ${desc}`);
    console.error(`    ${err.stack || err.message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// 1. Percentage Arithmetic Tests
// -------------------------------------------------------------
console.log('--- 1. Percentage Arithmetic ---');

it('percentOf: calculates percentage of total accurately', () => {
  assert.strictEqual(percentOf(20, 100), 20);
  assert.strictEqual(percentOf(15, 200), 30);
  assert.strictEqual(percentOf(0, 500), 0);
  assert.strictEqual(percentOf(100, 42.5), 42.5);
  assert.strictEqual(percentOf(250, 10), 25);
  assert.throws(() => percentOf('invalid', 10), TypeError);
});

it('percentageWhatIs: computes what percentage X is of Y', () => {
  assert.strictEqual(percentageWhatIs(25, 100), 25);
  assert.strictEqual(percentageWhatIs(50, 200), 25);
  assert.strictEqual(percentageWhatIs(75, 50), 150);
  assert.strictEqual(percentageWhatIs(0, 100), 0);
  assert.strictEqual(percentageWhatIs(10, 0), 0, 'Safely returns 0 when total is zero');
  assert.throws(() => percentageWhatIs(10, null), TypeError);
});

it('percentageChange: computes directional change percentage', () => {
  assert.strictEqual(percentageChange(100, 150), 50);
  assert.strictEqual(percentageChange(100, 50), -50);
  assert.strictEqual(percentageChange(50, 50), 0);
  assert.strictEqual(percentageChange(0, 0), 0);
  assert.strictEqual(percentageChange(0, 100), Infinity);
  assert.strictEqual(percentageChange(-50, -25), 50);
  assert.throws(() => percentageChange(undefined, 10), TypeError);
});

it('percentageAdd and percentageSubtract: increases/decreases base by percentage', () => {
  assert.strictEqual(percentageAdd(100, 20), 120);
  assert.strictEqual(percentageAdd(50, 10), 55);
  assert.strictEqual(percentageSubtract(100, 20), 80);
  assert.strictEqual(percentageSubtract(200, 50), 100);
  assert.strictEqual(percentageSubtract(100, 100), 0);
});

it('percentageDifference: calculates symmetric relative difference', () => {
  assert.strictEqual(percentageDifference(100, 100), 0);
  // |10 - 20| / 15 * 100 = 66.6666...%
  const diff = percentageDifference(10, 20);
  assert(Math.abs(diff - 66.6666) < 0.001);
  assert.strictEqual(percentageDifference(10, 20), percentageDifference(20, 10), 'Symmetric property');
});

it('reversePercentage: recovers original base prior to addition', () => {
  // $120 total with 20% VAT -> base is $100
  assert.strictEqual(reversePercentage(120, 20), 100);
  // $107 total with 7% tax -> base is $100
  assert.strictEqual(reversePercentage(107, 7), 100);
  assert.throws(() => reversePercentage(100, -100), Error);
});

it('marginFromMarkup and markupFromMargin: reciprocal conversion', () => {
  // 25% markup on cost -> 20% gross margin on revenue
  const margin = marginFromMarkup(25);
  assert.strictEqual(margin, 20);

  // 20% gross margin -> 25% markup
  const markup = markupFromMargin(20);
  assert.strictEqual(markup, 25);

  // 100% markup (double price) -> 50% margin
  assert.strictEqual(marginFromMarkup(100), 50);
  assert.strictEqual(markupFromMargin(50), 100);
});

// -------------------------------------------------------------
// 2. Financial Math & Amortization Tests
// -------------------------------------------------------------
console.log('\n--- 2. Financial Math & Loan Amortization ---');

it('calculateLoanPayment: computes exact standard amortization payment (EMI)', () => {
  // $300,000 mortgage at 6% annual over 30 years (360 months) -> $1,798.65
  const payment = calculateLoanPayment(300000, 6, 360, 12);
  assert(Math.abs(payment - 1798.65) < 0.05, `Expected ~1798.65, got ${payment.toFixed(2)}`);

  // $10,000 auto loan at 5% over 3 years (36 months) -> $299.71
  const autoPayment = calculateLoanPayment(10000, 5, 36, 12);
  assert(Math.abs(autoPayment - 299.71) < 0.05, `Expected ~299.71, got ${autoPayment.toFixed(2)}`);

  // 0% interest loan -> exact linear division
  const zeroInt = calculateLoanPayment(12000, 0, 12, 12);
  assert.strictEqual(zeroInt, 1000);
});

it('calculateEar & calculateNominalApr: converts between nominal APR and EAR', () => {
  // 12% nominal compounded monthly: (1 + 0.01)^12 - 1 = 12.6825%
  const ear = calculateEar(12, 12);
  assert(Math.abs(ear - 12.6825) < 0.001, `Expected ~12.6825, got ${ear}`);

  // Nominal APR
  assert.strictEqual(calculateNominalApr(1, 12), 12);
});

it('calculateAmortizationSchedule: builds complete balanced schedule', () => {
  const sched = calculateAmortizationSchedule({
    principal: 100000,
    annualRatePct: 6,
    termMonths: 120, // 10 years
    frequency: 12,
    upfrontFee: 1500
  });

  assert.strictEqual(sched.periods.length, 120, '120 monthly periods');
  assert.strictEqual(sched.annualSummary.length, 10, '10 annual summaries');

  // Verify principal fully retired
  const finalPeriod = sched.periods[sched.periods.length - 1];
  assert.strictEqual(finalPeriod.remainingBalance, 0, 'Final remaining balance is 0');

  // Verify total principal paid equals initial principal
  assert(Math.abs(sched.totalPrincipal - 100000) < 0.05, 'Total principal matches');

  // Verify fee inclusive total
  assert.strictEqual(sched.totalPaidWithFees, sched.totalPaid + 1500);
});

it('calculateAmortizationSchedule: extra payments shorten term and reduce total interest', () => {
  const base = calculateAmortizationSchedule({
    principal: 200000,
    annualRatePct: 7,
    termMonths: 360,
    extraMonthly: 0
  });

  const accelerated = calculateAmortizationSchedule({
    principal: 200000,
    annualRatePct: 7,
    termMonths: 360,
    extraMonthly: 300
  });

  assert(accelerated.actualPeriods < base.actualPeriods, 'Accelerated loan finishes in fewer periods');
  assert(accelerated.totalInterest < base.totalInterest, 'Extra payments reduce total interest');
});

it('calculateCompoundInterest: computes multi-frequency compound growth', () => {
  const params = { principal: 10000, annualRatePct: 8, years: 10, contribution: 100 };
  const daily = calculateCompoundInterest({ ...params, compoundFreq: 365 });
  const monthly = calculateCompoundInterest({ ...params, compoundFreq: 12 });
  const annual = calculateCompoundInterest({ ...params, compoundFreq: 1 });

  assert(daily.finalNominal > monthly.finalNominal, 'Daily compounding > Monthly');
  assert(monthly.finalNominal > annual.finalNominal, 'Monthly compounding > Annual');

  // Zero interest returns linear principal sum
  const zeroRes = calculateCompoundInterest({ principal: 5000, annualRatePct: 0, years: 5, compoundFreq: 12, contribution: 200 });
  const expectedTotal = 5000 + (200 * 60);
  assert.strictEqual(zeroRes.finalNominal, expectedTotal);
  assert.strictEqual(zeroRes.totalInterest, 0);
});

it('calculateSavingsGoal: solves required contribution to reach future value', () => {
  const goal = 50000;
  const initial = 5000;
  const years = 5;
  const rate = 6;
  const freq = 12;

  const goalRes = calculateSavingsGoal(goal, initial, years, rate, freq, 'end');
  assert(goalRes.requiredMonthly > 0);

  // Validate by plugging back into calculateCompoundInterest
  const verify = calculateCompoundInterest({
    principal: initial,
    annualRatePct: rate,
    years: years,
    compoundFreq: freq,
    contribution: goalRes.requiredPeriodic,
    contribTiming: 'end'
  });

  assert(Math.abs(verify.finalNominal - goal) < 1.0, `Engine arrives at goal ($50,000). Got ${verify.finalNominal.toFixed(2)}`);
});

// -------------------------------------------------------------
// 3. Date & Calendar Math Tests
// -------------------------------------------------------------
console.log('\n--- 3. Date & Calendar Math ---');

it('isLeapYear: validates leap year rules accurately', () => {
  assert.strictEqual(isLeapYear(2024), true, '2024 is divisible by 4');
  assert.strictEqual(isLeapYear(2023), false, '2023 is not leap');
  assert.strictEqual(isLeapYear(2000), true, '2000 is divisible by 400');
  assert.strictEqual(isLeapYear(1900), false, '1900 is divisible by 100 but not 400');
  assert.strictEqual(isLeapYear(2100), false, '2100 is not leap');
  assert.throws(() => isLeapYear('bad'), TypeError);
});

it('daysInMonth: returns exact days for every month including February leap years', () => {
  assert.strictEqual(daysInMonth(2024, 2), 29, 'Feb 2024 has 29 days');
  assert.strictEqual(daysInMonth(2023, 2), 28, 'Feb 2023 has 28 days');
  assert.strictEqual(daysInMonth(2024, 1), 31, 'Jan has 31 days');
  assert.strictEqual(daysInMonth(2024, 4), 30, 'Apr has 30 days');
  assert.strictEqual(daysInMonth(2024, 12), 31, 'Dec has 31 days');
});

it('calculateDateDifference: computes calendar differences across year and month boundaries', () => {
  const diff = calculateDateDifference('2020-01-15', '2024-03-20');
  assert.strictEqual(diff.years, 4);
  assert.strictEqual(diff.months, 2);
  assert.strictEqual(diff.days, 5);
  assert.strictEqual(diff.isNegative, false);
  assert(diff.totalDays > 1500);

  // Inverted dates flag isNegative: true
  const inverted = calculateDateDifference('2024-03-20', '2020-01-15');
  assert.strictEqual(inverted.years, 4);
  assert.strictEqual(inverted.months, 2);
  assert.strictEqual(inverted.days, 5);
  assert.strictEqual(inverted.isNegative, true);

  // Same day difference
  const same = calculateDateDifference('2024-05-10', '2024-05-10');
  assert.strictEqual(same.years, 0);
  assert.strictEqual(same.months, 0);
  assert.strictEqual(same.days, 0);
  assert.strictEqual(same.totalDays, 0);
});

it('addDays: shifts date by positive or negative offset', () => {
  const start = new Date('2024-02-27T00:00:00Z');
  const shifted = addDays(start, 3);
  assert.strictEqual(shifted.getUTCDate(), 1, 'Feb 27 + 3 days in leap year 2024 -> March 1');
  assert.strictEqual(shifted.getUTCMonth(), 2); // 0-indexed month 2 = March

  const shiftedBack = addDays(shifted, -3);
  assert.strictEqual(shiftedBack.getUTCDate(), 27);
});

console.log('\n====================================================');
console.log(`Results: ${passed}/${total} unit tests passed.`);
if (passed === total) {
  console.log('STATUS: @anyconverter/math TEST SUITE PASSED (100%).');
  process.exit(0);
} else {
  console.error('STATUS: FAILURES DETECTED IN @anyconverter/math.');
  process.exit(1);
}
