/**
 * AnyConverter Creative Studio — Phase 12: Preflight Budget Planner & Workload Estimator
 * Calculates accurate duration breakdowns (AI seconds vs. Native seconds),
 * enforces clip-length ceil division to prevent call undercounts,
 * and produces actionable shortfall mitigation recommendations.
 */

const { BILLING_UNIT, BillingUnitRegistry } = typeof require !== 'undefined'
  ? require('./billing-unit-registry.js')
  : (typeof window !== 'undefined' ? window : {});

const BUDGET_STATUS = {
  FEASIBLE_VERIFIED_CREDITS: 'FEASIBLE_VERIFIED_CREDITS',
  FITS_ESTIMATED_BUDGET: 'FITS_ESTIMATED_BUDGET',
  BUDGET_SHORTFALL: 'BUDGET_SHORTFALL',
  PROVIDER_QUOTA_UNKNOWN: 'PROVIDER_QUOTA_UNKNOWN',
  FREE_TIER_ELIGIBLE: 'FREE_TIER_ELIGIBLE',
  UNSUPPORTED: 'UNSUPPORTED'
};

class PreflightBudgetPlanner {
  /**
   * @param {Object} [options]
   * @param {Object} [options.registry] - BillingUnitRegistry
   */
  constructor(options = {}) {
    this.registry = options.registry || new BillingUnitRegistry();
  }

  /**
   * Calculate generation workload and budget feasibility for a storyboard or project plan
   * @param {Object} planInput
   * @param {number} [planInput.totalDurationSeconds=300]
   * @param {Array<Object>} planInput.shots - Array of { durationSeconds, type: 'ai'|'native', modelId }
   * @param {string} planInput.defaultModelId - Model for AI shots
   * @param {number} [planInput.userBudgetUsd] - Optional user budget in USD
   * @param {number} [planInput.retryContingency=0.20] - E.g. 0.20 for 20% retry reserve
   * @param {Object} [planInput.verifiedBalance] - Optional verified provider balance { verified: boolean, balanceUsd: number }
   * @returns {Object} Comprehensive preflight budget report
   */
  evaluatePlan(planInput = {}) {
    const totalDurationSeconds = planInput.totalDurationSeconds || 0;
    const shots = Array.isArray(planInput.shots) ? planInput.shots : [];
    const defaultModel = planInput.defaultModelId || 'generic-commercial-video-model';
    const retryContingency = planInput.retryContingency !== undefined ? planInput.retryContingency : 0.20;
    const userBudgetUsd = planInput.userBudgetUsd !== undefined ? planInput.userBudgetUsd : null;
    const verifiedBalance = planInput.verifiedBalance || { verified: false, balanceUsd: null };

    const pricing = this.registry.getModelPricing(defaultModel);
    const maxClipSec = pricing && pricing.maxClipSeconds ? pricing.maxClipSeconds : 5;

    let aiGeneratedSeconds = 0;
    let nativeSeconds = 0;
    let requiredGenerationCalls = 0;

    for (const shot of shots) {
      const dur = shot.durationSeconds || 0;
      const isAi = shot.type === 'ai' || (!shot.type && shot.modelId);
      if (isAi) {
        aiGeneratedSeconds += dur;
        // Accurate call count: ceil(shot_seconds / model_max_clip_seconds)
        const callsForShot = Math.ceil(dur / maxClipSec);
        requiredGenerationCalls += callsForShot;
      } else {
        nativeSeconds += dur;
      }
    }

    // In case no shots were specified, use duration share if provided
    if (shots.length === 0 && totalDurationSeconds > 0) {
      const aiShare = planInput.aiSharePercentage !== undefined ? planInput.aiSharePercentage : 100;
      aiGeneratedSeconds = (totalDurationSeconds * aiShare) / 100;
      nativeSeconds = totalDurationSeconds - aiGeneratedSeconds;
      requiredGenerationCalls = Math.ceil(aiGeneratedSeconds / maxClipSec);
    }

    // Determine billing quantity
    let billableUnits = 0;
    if (pricing.billingUnit === BILLING_UNIT.VIDEO_SECONDS) {
      billableUnits = aiGeneratedSeconds;
    } else if (pricing.billingUnit === BILLING_UNIT.IMAGE_COUNT || pricing.billingUnit === BILLING_UNIT.INFERENCE_REQUESTS) {
      billableUnits = requiredGenerationCalls;
    } else if (pricing.billingUnit === BILLING_UNIT.FREE_TIER || pricing.billingUnit === BILLING_UNIT.MANUAL_NOTEBOOK) {
      billableUnits = 0;
    } else {
      billableUnits = requiredGenerationCalls;
    }

    // Cost calculation
    const baseCostResult = this.registry.calculateCost(defaultModel, billableUnits);
    let totalPlannedSpend = null;
    let retryReserveUsd = null;

    if (baseCostResult.known && baseCostResult.estimatedCostUsd !== null) {
      retryReserveUsd = parseFloat((baseCostResult.estimatedCostUsd * retryContingency).toFixed(4));
      totalPlannedSpend = parseFloat((baseCostResult.estimatedCostUsd + retryReserveUsd).toFixed(4));
    }

    // Decision Logic
    let status = BUDGET_STATUS.PROVIDER_QUOTA_UNKNOWN;
    const mitigations = [];

    if (pricing.billingUnit === BILLING_UNIT.FREE_TIER || pricing.billingUnit === BILLING_UNIT.MANUAL_NOTEBOOK) {
      status = BUDGET_STATUS.FREE_TIER_ELIGIBLE;
    } else if (verifiedBalance.verified && verifiedBalance.balanceUsd !== null) {
      if (totalPlannedSpend !== null && verifiedBalance.balanceUsd >= totalPlannedSpend) {
        status = BUDGET_STATUS.FEASIBLE_VERIFIED_CREDITS;
      } else {
        status = BUDGET_STATUS.BUDGET_SHORTFALL;
      }
    } else if (totalPlannedSpend !== null && userBudgetUsd !== null) {
      if (totalPlannedSpend <= userBudgetUsd) {
        status = BUDGET_STATUS.FITS_ESTIMATED_BUDGET;
      } else {
        status = BUDGET_STATUS.BUDGET_SHORTFALL;
      }
    } else if (!baseCostResult.known) {
      status = BUDGET_STATUS.PROVIDER_QUOTA_UNKNOWN;
    }

    // Formulate actionable mitigation options if shortfall occurs
    if (status === BUDGET_STATUS.BUDGET_SHORTFALL) {
      const deficit = totalPlannedSpend !== null && userBudgetUsd !== null
        ? parseFloat((totalPlannedSpend - userBudgetUsd).toFixed(2))
        : 0;

      mitigations.push({
        action: 'REDUCE_AI_FOOTAGE',
        description: `Replace approximately ${Math.ceil(aiGeneratedSeconds * 0.3)}s of AI shots with native text cards, graphics, or sprite animations to fit your budget.`,
        suggestedAiSeconds: Math.floor(aiGeneratedSeconds * 0.7)
      });

      if (retryContingency > 0.05) {
        mitigations.push({
          action: 'LOWER_RETRY_CONTINGENCY',
          description: `Reduce retry contingency from ${(retryContingency * 100).toFixed(0)}% to 5% to save $${((retryReserveUsd || 0) * 0.75).toFixed(2)}.`,
          suggestedContingency: 0.05
        });
      }

      mitigations.push({
        action: 'SWITCH_TO_FREE_NOTEBOOK',
        description: 'Generate video clips for free using your personal Google Colab / Kaggle GPU session with the SVD notebook generator.'
      });
    }

    return {
      status,
      plannedDurationSeconds: totalDurationSeconds || (aiGeneratedSeconds + nativeSeconds),
      aiGeneratedSeconds,
      nativeOrImportedSeconds: nativeSeconds,
      requiredGenerationCalls,
      modelMaxClipSeconds: maxClipSec,
      modelId: defaultModel,
      billingUnit: pricing.billingUnit,
      baseEstimateUsd: baseCostResult.estimatedCostUsd,
      retryContingencyPercentage: retryContingency * 100,
      retryReserveUsd,
      totalPlannedSpendUsd: totalPlannedSpend,
      userBudgetUsd,
      priceKnown: baseCostResult.known,
      costLabel: baseCostResult.label,
      mitigations,
      disclaimer: 'AnyConverter collects zero payments and operates zero server-side inference. All charges and quota deductions occur directly under your own personal provider API account.'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BUDGET_STATUS,
    PreflightBudgetPlanner
  };
} else if (typeof window !== 'undefined') {
  window.PreflightBudgetPlanner = PreflightBudgetPlanner;
  window.BUDGET_STATUS = BUDGET_STATUS;
}
