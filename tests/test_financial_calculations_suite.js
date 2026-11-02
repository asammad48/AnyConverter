#!/usr/bin/env node
/**
 * AnyConverter — Production Financial Verification Suite
 * Directly executes and validates the production engine files:
 * - assets/js/tools/compound-interest-calculator.js
 * - assets/js/tools/loan-calculator.js
 * - assets/js/tools/mortgage-calculator.js
 * - assets/js/tools/invoice-generator.js
 * - assets/js/tools/currency-converter.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   PRODUCTION FINANCIAL ENGINES VERIFICATION SUITE   ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.stack || err.message}`);
  }
}

// -------------------------------------------------------------
// 1. COMPOUND INTEREST CALCULATOR & GOAL SOLVER
// -------------------------------------------------------------
console.log('\n1. COMPOUND INTEREST CALCULATOR & GOAL SOLVER:');

const compoundModule = require('../assets/js/tools/compound-interest-calculator.js');
const { calculateCompoundEngine, calculateSavingsGoal } = compoundModule;

runTest('Compounding Frequency directly alters future value: Daily > Monthly > Quarterly > Annual', () => {
  const baseParams = { principal: 10000, contribution: 200, years: 10, rate: 7.0, contribTiming: 'end' };
  const daily = calculateCompoundEngine({ ...baseParams, compoundFreq: 365 });
  const monthly = calculateCompoundEngine({ ...baseParams, compoundFreq: 12 });
  const quarterly = calculateCompoundEngine({ ...baseParams, compoundFreq: 4 });
  const annual = calculateCompoundEngine({ ...baseParams, compoundFreq: 1 });

  assert(daily.finalNominal > monthly.finalNominal, 'Daily > Monthly');
  assert(monthly.finalNominal > quarterly.finalNominal, 'Monthly > Quarterly');
  assert(quarterly.finalNominal > annual.finalNominal, 'Quarterly > Annual');
});

runTest('Annuity Due (Begin of period) yields strictly more than Ordinary Annuity (End of period)', () => {
  const endPeriod = calculateCompoundEngine({ principal: 5000, contribution: 500, years: 5, rate: 8.0, compoundFreq: 12, contribTiming: 'end' });
  const beginPeriod = calculateCompoundEngine({ principal: 5000, contribution: 500, years: 5, rate: 8.0, compoundFreq: 12, contribTiming: 'begin' });

  assert(beginPeriod.finalNominal > endPeriod.finalNominal, 'Begin of month compounding > End of month');
});

runTest('Zero interest rate edge case returns exact sum of principal and contributions', () => {
  const res = calculateCompoundEngine({ principal: 12345, contribution: 250, years: 4, rate: 0.0, compoundFreq: 12, contribTiming: 'end' });
  const expected = 12345 + (250 * 48);
  assert.strictEqual(res.finalNominal, expected, 'Zero interest returns exact linear total');
  assert.strictEqual(res.totalInterest, 0, 'Zero interest earned');
});

runTest('Savings Goal Solver: Computes exact monthly contribution needed for positive goal', () => {
  // Goal: $100,000 in 10 years at 7% monthly compounding with $10,000 initial
  const goal = 100000;
  const initial = 10000;
  const years = 10;
  const rate = 7;
  const freq = 12;

  const goalRes = calculateSavingsGoal(goal, initial, years, rate, freq, 'end');
  assert(goalRes && goalRes.requiredMonthly > 0, 'Required monthly contribution is positive');

  // Verify by plugging back into calculateCompoundEngine
  const verifyRes = calculateCompoundEngine({
    principal: initial,
    contribution: goalRes.requiredMonthly,
    years: years,
    rate: rate,
    compoundFreq: freq,
    contribTiming: 'end'
  });

  assert(Math.abs(verifyRes.finalNominal - goal) < 1.0, `Engine arrives at goal ($100,000). Got ${verifyRes.finalNominal.toFixed(2)}`);
});

runTest('Savings Goal Solver: Annuity Due requires lower monthly deposit than Ordinary Annuity', () => {
  const goal = 50000;
  const initial = 5000;
  const years = 5;
  const rate = 6;
  const freq = 12;

  const reqEnd = calculateSavingsGoal(goal, initial, years, rate, freq, 'end');
  const reqBegin = calculateSavingsGoal(goal, initial, years, rate, freq, 'begin');

  assert(reqBegin.requiredMonthly < reqEnd.requiredMonthly, `Annuity due monthly (${reqBegin.requiredMonthly.toFixed(2)}) is lower than ordinary annuity (${reqEnd.requiredMonthly.toFixed(2)})`);
});

runTest('Savings Goal Solver: Returns requiredMonthly 0 when existing principal already exceeds goal', () => {
  const req = calculateSavingsGoal(50000, 60000, 10, 5, 12, 'end');
  assert(req && req.requiredMonthly === 0, 'No contributions needed when principal exceeds target');
});

runTest('Savings Goal Solver: Handles zero goal, impossible targets, and zero rate gracefully without throwing', () => {
  assert.strictEqual(calculateSavingsGoal(0, 5000, 10, 5, 12, 'end'), null);
  assert.strictEqual(calculateSavingsGoal(-1000, 5000, 10, 5, 12, 'end'), null);
  
  // Zero interest: $12,000 needed in 10 years starting with 0 -> $100/mo
  const reqZeroRate = calculateSavingsGoal(12000, 0, 10, 0, 12, 'end');
  assert(reqZeroRate && Math.round(reqZeroRate.requiredMonthly) === 100, 'Linear goal division at 0% interest');
});


// -------------------------------------------------------------
// 2. LOAN CALCULATOR ENGINE & APR / TAE / ÅOP TESTS
// -------------------------------------------------------------
console.log('\n2. LOAN CALCULATOR:');

const loanModule = require('../assets/js/tools/loan-calculator.js');
const { calculateAmortizationEngine, solveFeeInclusiveAPR } = loanModule;

runTest('Monthly recurring fees are fully included in Total Repayment outlay', () => {
  const principal = 10000;
  const rate = 6;
  const termMonths = 12;
  const recurringFee = 25; // $25/mo
  const upfrontFee = 100;

  const res = calculateAmortizationEngine({
    principal,
    rate,
    termMonths,
    rateType: 'reducing',
    recurringFee,
    upfrontFee
  });

  const expectedTotalFees = upfrontFee + recurringFee * 12; // 100 + 300 = 400
  assert.strictEqual(res.totalFees, expectedTotalFees, 'Total fees accurately sums upfront and recurring');
  assert.strictEqual(res.totalPayment, res.totalScheduledPrincipalInterest + expectedTotalFees, 'Total payment includes all fees');
  assert(res.totalPayment > res.totalScheduledPrincipalInterest, 'Borrower total outlay is strictly greater than pure P&I');
});

runTest('Fee-inclusive APR solver computes accurate nominal APR and effective rate (EAR/TAE/ÅOP)', () => {
  const principal = 10000;
  const rate = 7.0;
  const termMonths = 36;
  const upfrontFee = 200;
  const recurringFee = 10;

  const res = calculateAmortizationEngine({
    principal,
    rate,
    termMonths,
    rateType: 'reducing',
    upfrontFee,
    recurringFee
  });

  // Nominal APR = r * 12 * 100; Effective Rate (EAR/TAE/ÅOP) = ((1+r)^12 - 1) * 100
  assert(res.nominalApr > rate, `Nominal APR (${res.nominalApr.toFixed(2)}%) reflects fees above 7% nominal`);
  assert(res.effectiveRate > res.nominalApr, `Effective compounded EAR (${res.effectiveRate.toFixed(2)}%) > Nominal APR (${res.nominalApr.toFixed(2)}%)`);
  
  // Test solveFeeInclusiveAPR directly
  const cashFlows = res.schedule.map(s => s.payment + s.fees);
  const solved = solveFeeInclusiveAPR(principal, upfrontFee, cashFlows);
  assert(Math.abs(solved.nominalApr - res.nominalApr) < 0.001, 'solveFeeInclusiveAPR matches engine nominalApr');
  assert(Math.abs(solved.effectiveRate - res.effectiveRate) < 0.001, 'solveFeeInclusiveAPR matches engine effectiveRate');
});

runTest('Zero-fee reducing loan APR matches nominal annual rate exactly', () => {
  const res = calculateAmortizationEngine({
    principal: 20000,
    rate: 6.5,
    termMonths: 60,
    rateType: 'reducing',
    upfrontFee: 0,
    recurringFee: 0
  });

  assert(Math.abs(res.effectiveApr - 6.5) < 0.05, `Zero-fee loan APR (${res.effectiveApr.toFixed(2)}%) matches 6.5% nominal`);
});

runTest('KIBOR tenor selector contains clean tenor keys and no hardcoded stale percentages', () => {
  const loanCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools', 'loan-calculator.js'), 'utf8');
  assert(!loanCode.includes('value="11.25"'), 'No stale 11.25% in code');
  assert(!loanCode.includes('value="11.50"'), 'No stale 11.50% in code');
  assert(!loanCode.includes('value="11.85"'), 'No stale 11.85% in code');
  assert(!loanCode.includes('value="12.10"'), 'No stale 12.10% in code');
  assert(loanCode.includes('value="1m"') && loanCode.includes('value="3m"') && loanCode.includes('value="6m"') && loanCode.includes('value="12m"'), 'Tenor options use clean keys');
  assert(loanCode.includes('id="ac-benchmark-rate"'), 'Editable benchmark rate input exists');
});


// -------------------------------------------------------------
// 3. MORTGAGE CALCULATOR & PMI / LTV TESTS
// -------------------------------------------------------------
console.log('\n3. MORTGAGE CALCULATOR:');

const mortModule = require('../assets/js/tools/mortgage-calculator.js');
const { calculateMortgageEngine } = mortModule;

runTest('Configurable PMI rate is respected; setting pmiRate=0 removes PMI even when LTV > 80%', () => {
  const price = 500000;
  const down = 50000; // 10% down -> LTV = 90%

  const resWithPmi = calculateMortgageEngine({ price, down, rate: 6.5, years: 30, pmiRate: 0.75 });
  const resNoPmi = calculateMortgageEngine({ price, down, rate: 6.5, years: 30, pmiRate: 0.0 });

  assert(resWithPmi.firstMonth.escrow > resNoPmi.firstMonth.escrow, 'PMI adds monthly cost when pmiRate > 0');
  assert.strictEqual(resNoPmi.pmiEndDate, null, 'No PMI termination date when pmiRate is 0%');
});

runTest('PMI automatically cancels when loan balance reaches 80% LTV milestone', () => {
  const price = 300000;
  const down = 30000; // 10% down -> LTV = 90%

  const res = calculateMortgageEngine({ price, down, rate: 6.0, years: 30, pmiRate: 0.8 });

  assert(res.ltv === 90, 'LTV is 90%');
  assert(res.pmiEndMonth > 0 && res.pmiEndMonth < res.schedule.length, 'PMI cancels before the 30-year term ends');
  
  const monthBefore = res.schedule[res.pmiEndMonth - 1];
  const monthAfter = res.schedule[res.pmiEndMonth];
  assert(monthBefore.escrow > monthAfter.escrow, 'Escrow payment drops after PMI milestone is crossed');
});

runTest('Down payment 20% (LTV <= 80%) requires zero PMI from month 1', () => {
  const res = calculateMortgageEngine({ price: 400000, down: 80000, rate: 6.5, years: 30, pmiRate: 0.75 });
  assert.strictEqual(res.ltv, 80, 'LTV is exactly 80%');
  assert.strictEqual(res.pmiEndDate, null, 'No PMI applies to prime 80% LTV mortgage');
});

runTest('Mortgage source code contains all required DOM controls and disclaimer container', () => {
  const mortCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools', 'mortgage-calculator.js'), 'utf8');
  assert(mortCode.includes('id="mort-pmi"'), 'mort-pmi control present');
  assert(mortCode.includes('id="mort-down-pct"'), 'mort-down-pct control present');
  assert(mortCode.includes('id="ac-mort-pmi-milestone-wrap"'), 'ac-mort-pmi-milestone-wrap present');
  assert(mortCode.includes('id="ac-mort-pmi-date"'), 'ac-mort-pmi-date present');
});


// -------------------------------------------------------------
// 4. INVOICE GENERATOR RECONCILIATION & UNICODE TESTS
// -------------------------------------------------------------
console.log('\n4. INVOICE GENERATOR:');

const invoiceModule = require('../assets/js/tools/invoice-generator.js');
const { formatLocaleMoney, sanitizePdfText } = invoiceModule;

runTest('Invoice Unicode sanitization: Preserves Danish æ, ø, å and Spanish á, é, í, ó, ú, ñ and symbols', () => {
  const danishText = 'Rådgivning & regnskabsføring på Færøerne: æ, ø, å, Æ, Ø, Å — 100 kr.';
  const spanishText = 'Facturación de diseño gráfico y consultoría: á, é, í, ó, ú, ñ — 50 €';
  
  const sanitizedDa = sanitizePdfText(danishText);
  const sanitizedEs = sanitizePdfText(spanishText);

  assert(sanitizedDa.includes('æ') && sanitizedDa.includes('ø') && sanitizedDa.includes('å'), 'Danish chars preserved');
  assert(sanitizedEs.includes('á') && sanitizedEs.includes('é') && sanitizedEs.includes('í') && sanitizedEs.includes('ñ'), 'Spanish chars preserved');
});

runTest('Locale-aware currency formatting formats correctly across en, es, and da', () => {
  const enFmt = formatLocaleMoney(12345.67, 'en');
  const esFmt = formatLocaleMoney(12345.67, 'es');
  const daFmt = formatLocaleMoney(12345.67, 'da');

  assert(enFmt.includes('12,345.67'), 'English format includes comma thousands separator and period decimal');
  assert(esFmt.includes(',') && esFmt.includes('.'), 'Spanish format uses comma decimal separator and period thousands');
  assert(daFmt.includes(',') && (daFmt.includes('.') || daFmt.includes(' ')), 'Danish format uses comma decimal separator');
});


// -------------------------------------------------------------
// 5. CURRENCY CONVERTER RESILIENCE & CACHE TESTS
// -------------------------------------------------------------
console.log('\n5. CURRENCY CONVERTER:');

const ccModule = require('../assets/js/tools/currency-converter.js');
const { calculateFxConversion } = ccModule;

runTest('Currency calculation math: Converted = Amount * (ToRate / FromRate)', () => {
  const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, DKK: 6.87 };
  const res = calculateFxConversion(100, 'USD', 'EUR', 'USD', rates);
  assert(res && Math.abs(res.result - 92.0) < 0.0001, '100 USD = 92 EUR');
  assert(res && Math.abs(res.rate - 0.92) < 0.0001, 'Unit rate 0.92');

  const gbpToDkk = calculateFxConversion(50, 'GBP', 'DKK', 'USD', rates);
  const expected = 50 * (6.87 / 0.79);
  assert(Math.abs(gbpToDkk.result - expected) < 0.0001, 'Cross-currency conversion accurate');
});

runTest('Baseline hardcoded rates table completely removed from currency-converter.js', () => {
  const ccCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools', 'currency-converter.js'), 'utf8');
  assert(!ccCode.includes('BASELINE_RATES'), 'BASELINE_RATES table deleted');
  assert(ccCode.includes('Current exchange rate unavailable'), 'Safe error message present');
  assert(ccCode.includes('ac_fx_rates_cache_v2'), 'Safe cache key present');
});


// -------------------------------------------------------------
// 6. LOCALIZATION INTEGRITY
// -------------------------------------------------------------
console.log('\n6. LOCALIZATION INTEGRITY:');

runTest('Spanish mortgage page contains correct diacritics (amortización, práctica)', () => {
  const esMortHtml = fs.readFileSync(path.join(__dirname, '..', 'es', 'mortgage-calculator', 'index.html'), 'utf8');
  assert(esMortHtml.includes('amortización con una calculadora práctica'), 'Spanish mortgage page contains accented amortización and práctica');
  assert(!esMortHtml.includes('amortizacion con una calculadora practica'), 'No unaccented forms remain on Spanish mortgage page');
});

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round(passedTests/totalTests*100)}%)`);
console.log('====================================================\n');

if (passedTests < totalTests) {
  process.exit(1);
}
