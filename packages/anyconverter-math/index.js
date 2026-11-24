/**
 * @anyconverter/math — Pure Calculation Utilities
 * Zero-dependency math, financial amortization, and date computation engine.
 * Tested and extracted from AnyConverter.io production tools.
 *
 * @license MIT
 */
'use strict';

// ============================================================================
// 1. Percentage Arithmetic
// ============================================================================

/**
 * Calculates what X% of Y is.
 * Formula: (percentage / 100) * total
 *
 * @param {number} percentage - The percentage rate (e.g. 15 for 15%)
 * @param {number} total - The base number
 * @returns {number} The calculated part
 */
function percentOf(percentage, total) {
  if (typeof percentage !== 'number' || typeof total !== 'number' || isNaN(percentage) || isNaN(total)) {
    throw new TypeError('percentOf: parameters must be valid numbers');
  }
  return (percentage / 100) * total;
}

/**
 * Calculates what percentage X is of Y.
 * Formula: (partial / total) * 100
 *
 * @param {number} partial - The partial value
 * @param {number} total - The total reference value
 * @returns {number} The calculated percentage rate
 */
function percentageWhatIs(partial, total) {
  if (typeof partial !== 'number' || typeof total !== 'number' || isNaN(partial) || isNaN(total)) {
    throw new TypeError('percentageWhatIs: parameters must be valid numbers');
  }
  if (total === 0) return 0;
  return (partial / total) * 100;
}

/**
 * Calculates percentage change from an old value to a new value.
 * Formula: ((newValue - oldValue) / |oldValue|) * 100
 *
 * @param {number} oldValue - Starting baseline value
 * @param {number} newValue - Ending value
 * @returns {number} Signed percentage change (+ for increase, - for decrease)
 */
function percentageChange(oldValue, newValue) {
  if (typeof oldValue !== 'number' || typeof newValue !== 'number' || isNaN(oldValue) || isNaN(newValue)) {
    throw new TypeError('percentageChange: parameters must be valid numbers');
  }
  if (oldValue === 0) {
    if (newValue === 0) return 0;
    return newValue > 0 ? Infinity : -Infinity;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Increases a base value by a given percentage.
 * Formula: value * (1 + percentage / 100)
 *
 * @param {number} value - Base value
 * @param {number} percentage - Percentage to add
 * @returns {number} The increased value
 */
function percentageAdd(value, percentage) {
  if (typeof value !== 'number' || typeof percentage !== 'number' || isNaN(value) || isNaN(percentage)) {
    throw new TypeError('percentageAdd: parameters must be valid numbers');
  }
  return value + (value * percentage) / 100;
}

/**
 * Decreases a base value by a given percentage.
 * Formula: value - (value * percentage) / 100
 *
 * @param {number} value - Base value
 * @param {number} percentage - Percentage to subtract
 * @returns {number} The decreased value
 */
function percentageSubtract(value, percentage) {
  if (typeof value !== 'number' || typeof percentage !== 'number' || isNaN(value) || isNaN(percentage)) {
    throw new TypeError('percentageSubtract: parameters must be valid numbers');
  }
  return value - (value * percentage) / 100;
}

/**
 * Calculates symmetric relative difference between two positive numbers.
 * Formula: (|a - b| / ((a + b) / 2)) * 100
 *
 * @param {number} a - First value
 * @param {number} b - Second value
 * @returns {number} Percentage difference
 */
function percentageDifference(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    throw new TypeError('percentageDifference: parameters must be valid numbers');
  }
  var avg = (Math.abs(a) + Math.abs(b)) / 2;
  if (avg === 0) return 0;
  return (Math.abs(a - b) / avg) * 100;
}

/**
 * Reverse calculates original base before a percentage was added (e.g. VAT/sales tax extraction).
 * Formula: finalValue / (1 + percentageRate / 100)
 *
 * @param {number} finalValue - Total value including percentage
 * @param {number} percentageRate - The applied rate
 * @returns {number} Base value prior to addition
 */
function reversePercentage(finalValue, percentageRate) {
  if (typeof finalValue !== 'number' || typeof percentageRate !== 'number' || isNaN(finalValue) || isNaN(percentageRate)) {
    throw new TypeError('reversePercentage: parameters must be valid numbers');
  }
  var divisor = 1 + percentageRate / 100;
  if (divisor === 0) throw new Error('reversePercentage: division by zero (-100% rate)');
  return finalValue / divisor;
}

/**
 * Converts markup percentage into gross margin percentage.
 * Formula: (markup / (100 + markup)) * 100
 *
 * @param {number} markupPct - Markup on cost (%)
 * @returns {number} Profit margin on revenue (%)
 */
function marginFromMarkup(markupPct) {
  if (typeof markupPct !== 'number' || isNaN(markupPct)) {
    throw new TypeError('marginFromMarkup: parameter must be a valid number');
  }
  return (markupPct / (100 + markupPct)) * 100;
}

/**
 * Converts gross margin percentage into markup percentage.
 * Formula: (margin / (100 - margin)) * 100
 *
 * @param {number} marginPct - Profit margin on revenue (%)
 * @returns {number} Required markup on cost (%)
 */
function markupFromMargin(marginPct) {
  if (typeof marginPct !== 'number' || isNaN(marginPct)) {
    throw new TypeError('markupFromMargin: parameter must be a valid number');
  }
  if (marginPct >= 100) throw new Error('markupFromMargin: margin percentage must be less than 100%');
  return (marginPct / (100 - marginPct)) * 100;
}

// ============================================================================
// 2. Financial Math & Loan Amortization
// ============================================================================

/**
 * Computes standard periodic amortization payment (EMI) on a reducing balance loan.
 * Formula: P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
 *
 * @param {number} principal - Loan principal amount
 * @param {number} annualRatePct - Annual nominal interest rate (e.g. 7.5 for 7.5%)
 * @param {number} termMonths - Total duration in months
 * @param {number} [frequency=12] - Payments per year (12=monthly, 26=bi-weekly, 52=weekly)
 * @returns {number} Periodic payment amount
 */
function calculateLoanPayment(principal, annualRatePct, termMonths, frequency) {
  frequency = frequency || 12;
  if (principal <= 0 || termMonths <= 0) return 0;
  var periods = termMonths * (frequency / 12);
  var r = (annualRatePct / 100) / frequency;

  if (r === 0) {
    return principal / periods;
  }

  var factor = Math.pow(1 + r, periods);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Calculates Effective Annual Rate (EAR) from nominal rate and compounding frequency.
 * Formula: (1 + r/n)^n - 1
 *
 * @param {number} annualRatePct - Nominal annual percentage rate (e.g. 10.55 for 10.55%)
 * @param {number} [compoundFreq=12] - Compounding periods per year
 * @returns {number} Effective Annual Rate expressed as percentage (e.g. 11.08)
 */
function calculateEar(annualRatePct, compoundFreq) {
  compoundFreq = compoundFreq || 12;
  var r = (annualRatePct / 100) / compoundFreq;
  var ear = Math.pow(1 + r, compoundFreq) - 1;
  return ear * 100;
}

/**
 * Calculates nominal annual percentage rate from periodic rate.
 * Formula: periodicRate * periodsPerYear
 *
 * @param {number} periodicRate - Rate per single period
 * @param {number} [periodsPerYear=12] - Periods per year
 * @returns {number} Nominal annual APR
 */
function calculateNominalApr(periodicRate, periodsPerYear) {
  periodsPerYear = periodsPerYear || 12;
  return periodicRate * periodsPerYear;
}

/**
 * Generates a full loan amortization schedule with monthly records and annual summaries.
 *
 * @param {Object} options
 * @param {number} options.principal - Initial principal
 * @param {number} options.annualRatePct - Annual interest rate (%)
 * @param {number} options.termMonths - Duration in months
 * @param {number} [options.frequency=12] - Payments per year (12 default)
 * @param {number} [options.extraMonthly=0] - Additional principal payment per period
 * @param {number} [options.upfrontFee=0] - Processing fee added to fee-inclusive APR
 * @returns {Object} Complete schedule and summary totals
 */
function calculateAmortizationSchedule(options) {
  var principal = Number(options.principal) || 0;
  var annualRatePct = Number(options.annualRatePct) || 0;
  var termMonths = Number(options.termMonths) || 0;
  var frequency = Number(options.frequency) || 12;
  var extraMonthly = Number(options.extraMonthly) || 0;
  var upfrontFee = Number(options.upfrontFee) || 0;

  var regularPayment = calculateLoanPayment(principal, annualRatePct, termMonths, frequency);
  var totalPeriods = termMonths * (frequency / 12);
  var periodicRate = (annualRatePct / 100) / frequency;

  var balance = principal;
  var totalInterest = 0;
  var totalPrincipal = 0;
  var periods = [];
  var annualSummary = [];
  var currentYear = 1;
  var yearInterest = 0;
  var yearPrincipal = 0;

  for (var period = 1; period <= totalPeriods && balance > 0.005; period++) {
    var interest = balance * periodicRate;
    var maxPrincipalPayment = balance;
    var basePrincipal = Math.min(regularPayment - interest, maxPrincipalPayment);
    if (basePrincipal < 0) basePrincipal = 0;

    var extra = Math.min(extraMonthly, maxPrincipalPayment - basePrincipal);
    var principalPaid = basePrincipal + extra;
    var payment = interest + principalPaid;

    balance -= principalPaid;
    if (balance < 0.005) balance = 0;

    totalInterest += interest;
    totalPrincipal += principalPaid;
    yearInterest += interest;
    yearPrincipal += principalPaid;

    periods.push({
      period: period,
      payment: payment,
      principal: principalPaid,
      interest: interest,
      remainingBalance: balance
    });

    if (period % frequency === 0 || balance === 0 || period === totalPeriods) {
      annualSummary.push({
        year: currentYear,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        totalPaid: yearPrincipal + yearInterest,
        endingBalance: balance
      });
      currentYear++;
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  var totalPaid = totalPrincipal + totalInterest;
  var effectiveEar = calculateEar(annualRatePct, frequency);

  return {
    regularPayment: regularPayment,
    actualPaymentWithExtra: regularPayment + extraMonthly,
    totalInterest: totalInterest,
    totalPrincipal: totalPrincipal,
    totalPaid: totalPaid,
    totalPaidWithFees: totalPaid + upfrontFee,
    actualPeriods: periods.length,
    nominalApr: annualRatePct,
    effectiveEar: effectiveEar,
    periods: periods,
    annualSummary: annualSummary
  };
}

/**
 * Calculates compound interest growth with periodic deposits and inflation adjustments.
 *
 * @param {Object} options
 * @param {number} options.principal - Initial deposit
 * @param {number} options.annualRatePct - Annual interest rate (%)
 * @param {number} options.years - Investment horizon in years
 * @param {number} [options.compoundFreq=12] - Compounding frequency per year
 * @param {number} [options.contribution=0] - Periodic regular contribution
 * @param {string} [options.contribTiming='end'] - 'end' (ordinary annuity) or 'begin' (annuity due)
 * @returns {Object} Future value and annual progression
 */
function calculateCompoundInterest(options) {
  var principal = Number(options.principal) || 0;
  var annualRatePct = Number(options.annualRatePct) || 0;
  var years = Number(options.years) || 0;
  var compoundFreq = Number(options.compoundFreq) || 12;
  var contribution = Number(options.contribution) || 0;
  var contribTiming = options.contribTiming === 'begin' ? 'begin' : 'end';

  var r = (annualRatePct / 100) / compoundFreq;
  var totalPeriods = years * compoundFreq;

  var currentBalance = principal;
  var totalContributions = 0;
  var annualBreakdown = [];

  var yearInterest = 0;
  var yearContrib = 0;

  for (var period = 1; period <= totalPeriods; period++) {
    var periodInterest = 0;
    if (contribTiming === 'begin') {
      currentBalance += contribution;
      totalContributions += contribution;
      yearContrib += contribution;
      periodInterest = currentBalance * r;
      currentBalance += periodInterest;
    } else {
      periodInterest = currentBalance * r;
      currentBalance += periodInterest;
      currentBalance += contribution;
      totalContributions += contribution;
      yearContrib += contribution;
    }

    yearInterest += periodInterest;

    if (period % compoundFreq === 0) {
      annualBreakdown.push({
        year: period / compoundFreq,
        endingBalance: currentBalance,
        yearInterest: yearInterest,
        yearContributions: yearContrib
      });
      yearInterest = 0;
      yearContrib = 0;
    }
  }

  var totalPrincipalInvested = principal + totalContributions;
  var totalInterestEarned = currentBalance - totalPrincipalInvested;

  return {
    finalNominal: currentBalance,
    totalPrincipal: totalPrincipalInvested,
    totalContributions: totalContributions,
    totalInterest: totalInterestEarned,
    effectiveEar: calculateEar(annualRatePct, compoundFreq),
    annualBreakdown: annualBreakdown
  };
}

/**
 * Computes exact monthly contribution needed to reach a targeted savings goal.
 *
 * @param {number} targetGoal - Target future value
 * @param {number} initialPrincipal - Starting capital
 * @param {number} years - Horizon in years
 * @param {number} annualRatePct - Annual interest rate (%)
 * @param {number} [compoundFreq=12] - Compounding intervals per year
 * @param {string} [contribTiming='end'] - 'end' or 'begin'
 * @returns {Object} Required contribution per period
 */
function calculateSavingsGoal(targetGoal, initialPrincipal, years, annualRatePct, compoundFreq, contribTiming) {
  compoundFreq = compoundFreq || 12;
  contribTiming = contribTiming === 'begin' ? 'begin' : 'end';

  var r = (annualRatePct / 100) / compoundFreq;
  var n = years * compoundFreq;

  if (n <= 0) return { requiredPeriodic: 0, requiredMonthly: 0 };

  var initialFv = initialPrincipal * Math.pow(1 + r, n);
  var remainingGoal = targetGoal - initialFv;

  if (remainingGoal <= 0) {
    return { requiredPeriodic: 0, requiredMonthly: 0, targetReachedWithoutContributions: true };
  }

  var annuityFactor;
  if (r === 0) {
    annuityFactor = n;
  } else {
    var baseAnnuity = (Math.pow(1 + r, n) - 1) / r;
    annuityFactor = contribTiming === 'begin' ? baseAnnuity * (1 + r) : baseAnnuity;
  }

  var requiredPeriodic = remainingGoal / annuityFactor;
  var requiredMonthly = requiredPeriodic * (compoundFreq / 12);

  return {
    requiredPeriodic: requiredPeriodic,
    requiredMonthly: requiredMonthly,
    targetReachedWithoutContributions: false
  };
}

// ============================================================================
// 3. Date & Calendar Arithmetic
// ============================================================================

/**
 * Checks whether a given Gregorian year is a leap year.
 * Rule: Year is leap if divisible by 4, unless divisible by 100 but not 400.
 *
 * @param {number} year - Four-digit year (e.g. 2024)
 * @returns {boolean} True if leap year, false otherwise
 */
function isLeapYear(year) {
  if (typeof year !== 'number' || isNaN(year)) {
    throw new TypeError('isLeapYear: year must be a valid number');
  }
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns exact days in a given Gregorian month (1 to 12).
 * Correctly accounts for February 29 in leap years.
 *
 * @param {number} year - Calendar year
 * @param {number} month - Month (1 = January ... 12 = December)
 * @returns {number} Days in month (28, 29, 30, or 31)
 */
function daysInMonth(year, month) {
  if (typeof year !== 'number' || typeof month !== 'number' || isNaN(year) || isNaN(month)) {
    throw new TypeError('daysInMonth: year and month must be valid numbers');
  }
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Calculates exact calendar difference between two dates in years, months, days, and total days.
 * Correctly handles calendar month day counts and leap year boundaries.
 *
 * @param {Date|string|number} startDate - Starting date
 * @param {Date|string|number} endDate - Ending date
 * @returns {Object} { years, months, days, totalDays, isNegative }
 */
function calculateDateDifference(startDate, endDate) {
  var d1 = new Date(startDate);
  var d2 = new Date(endDate);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new TypeError('calculateDateDifference: invalid date argument');
  }

  var isNegative = d2.getTime() < d1.getTime();
  var start = isNegative ? d2 : d1;
  var end = isNegative ? d1 : d2;

  var y1 = start.getUTCFullYear();
  var m1 = start.getUTCMonth() + 1;
  var day1 = start.getUTCDate();

  var y2 = end.getUTCFullYear();
  var m2 = end.getUTCMonth() + 1;
  var day2 = end.getUTCDate();

  var years = y2 - y1;
  var months = m2 - m1;
  var days = day2 - day1;

  if (days < 0) {
    // Borrow days from previous month
    var prevMonth = m2 - 1;
    var prevYear = y2;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }
    var dim = daysInMonth(prevYear, prevMonth);
    days += dim;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  var msPerDay = 1000 * 60 * 60 * 24;
  var utcStart = Date.UTC(y1, m1 - 1, day1);
  var utcEnd = Date.UTC(y2, m2 - 1, day2);
  var totalDays = Math.round((utcEnd - utcStart) / msPerDay);

  return {
    years: years,
    months: months,
    days: days,
    totalDays: totalDays,
    isNegative: isNegative
  };
}

/**
 * Returns a new Date object shifted by N days.
 *
 * @param {Date|string|number} date - Baseline date
 * @param {number} days - Number of days to add (or subtract if negative)
 * @returns {Date} New shifted date
 */
function addDays(date, days) {
  var d = new Date(date);
  if (isNaN(d.getTime()) || typeof days !== 'number' || isNaN(days)) {
    throw new TypeError('addDays: invalid date or days parameter');
  }
  var res = new Date(d.getTime());
  res.setUTCDate(res.getUTCDate() + days);
  return res;
}

// ============================================================================
// Exports (Dual CJS & ESM Compatibility)
// ============================================================================

var api = {
  // Percentage Arithmetic
  percentOf: percentOf,
  percentageWhatIs: percentageWhatIs,
  percentageChange: percentageChange,
  percentageAdd: percentageAdd,
  percentageSubtract: percentageSubtract,
  percentageDifference: percentageDifference,
  reversePercentage: reversePercentage,
  marginFromMarkup: marginFromMarkup,
  markupFromMargin: markupFromMargin,

  // Financial Math & Amortization
  calculateLoanPayment: calculateLoanPayment,
  calculateEar: calculateEar,
  calculateNominalApr: calculateNominalApr,
  calculateAmortizationSchedule: calculateAmortizationSchedule,
  calculateCompoundInterest: calculateCompoundInterest,
  calculateSavingsGoal: calculateSavingsGoal,

  // Date & Calendar Math
  isLeapYear: isLeapYear,
  daysInMonth: daysInMonth,
  calculateDateDifference: calculateDateDifference,
  addDays: addDays
};

// Default export reference
api.default = api;

module.exports = api;
