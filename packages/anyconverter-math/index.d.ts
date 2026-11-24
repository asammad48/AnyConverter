/**
 * TypeScript Type Definitions for @anyconverter/math
 *
 * @license MIT
 */

export interface AmortizationScheduleOptions {
  principal: number;
  annualRatePct: number;
  termMonths: number;
  frequency?: number;
  extraMonthly?: number;
  upfrontFee?: number;
}

export interface AmortizationPeriod {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface AnnualSummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endingBalance: number;
}

export interface AmortizationResult {
  regularPayment: number;
  actualPaymentWithExtra: number;
  totalInterest: number;
  totalPrincipal: number;
  totalPaid: number;
  totalPaidWithFees: number;
  actualPeriods: number;
  nominalApr: number;
  effectiveEar: number;
  periods: AmortizationPeriod[];
  annualSummary: AnnualSummary[];
}

export interface CompoundInterestOptions {
  principal: number;
  annualRatePct: number;
  years: number;
  compoundFreq?: number;
  contribution?: number;
  contribTiming?: 'begin' | 'end';
}

export interface AnnualBreakdownItem {
  year: number;
  endingBalance: number;
  yearInterest: number;
  yearContributions: number;
}

export interface CompoundInterestResult {
  finalNominal: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  effectiveEar: number;
  annualBreakdown: AnnualBreakdownItem[];
}

export interface SavingsGoalResult {
  requiredPeriodic: number;
  requiredMonthly: number;
  targetReachedWithoutContributions: boolean;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  isNegative: boolean;
}

// Percentage Arithmetic
export function percentOf(percentage: number, total: number): number;
export function percentageWhatIs(partial: number, total: number): number;
export function percentageChange(oldValue: number, newValue: number): number;
export function percentageAdd(value: number, percentage: number): number;
export function percentageSubtract(value: number, percentage: number): number;
export function percentageDifference(a: number, b: number): number;
export function reversePercentage(finalValue: number, percentageRate: number): number;
export function marginFromMarkup(markupPct: number): number;
export function markupFromMargin(marginPct: number): number;

// Financial Math & Loan Amortization
export function calculateLoanPayment(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  frequency?: number
): number;

export function calculateEar(
  annualRatePct: number,
  compoundFreq?: number
): number;

export function calculateNominalApr(
  periodicRate: number,
  periodsPerYear?: number
): number;

export function calculateAmortizationSchedule(
  options: AmortizationScheduleOptions
): AmortizationResult;

export function calculateCompoundInterest(
  options: CompoundInterestOptions
): CompoundInterestResult;

export function calculateSavingsGoal(
  targetGoal: number,
  initialPrincipal: number,
  years: number,
  annualRatePct: number,
  compoundFreq?: number,
  contribTiming?: 'begin' | 'end'
): SavingsGoalResult;

// Date & Calendar Math
export function isLeapYear(year: number): boolean;
export function daysInMonth(year: number, month: number): number;
export function calculateDateDifference(
  startDate: Date | string | number,
  endDate: Date | string | number
): DateDifferenceResult;
export function addDays(date: Date | string | number, days: number): Date;

declare const math: {
  percentOf: typeof percentOf;
  percentageWhatIs: typeof percentageWhatIs;
  percentageChange: typeof percentageChange;
  percentageAdd: typeof percentageAdd;
  percentageSubtract: typeof percentageSubtract;
  percentageDifference: typeof percentageDifference;
  reversePercentage: typeof reversePercentage;
  marginFromMarkup: typeof marginFromMarkup;
  markupFromMargin: typeof markupFromMargin;
  calculateLoanPayment: typeof calculateLoanPayment;
  calculateEar: typeof calculateEar;
  calculateNominalApr: typeof calculateNominalApr;
  calculateAmortizationSchedule: typeof calculateAmortizationSchedule;
  calculateCompoundInterest: typeof calculateCompoundInterest;
  calculateSavingsGoal: typeof calculateSavingsGoal;
  isLeapYear: typeof isLeapYear;
  daysInMonth: typeof daysInMonth;
  calculateDateDifference: typeof calculateDateDifference;
  addDays: typeof addDays;
  default: typeof math;
};

export default math;
