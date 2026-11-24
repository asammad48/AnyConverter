/**
 * AnyConverter Creative Studio — Phase 12: Request Deduplication & Budget Guard Engine
 * Prevents accidental double submits with deterministic fingerprint caching,
 * pauses and saves partial work on 429/403 rate limits without cost leaks,
 * and maintains local-only auditable telemetry of generation spend and savings.
 */

const crypto = typeof require !== 'undefined' ? require('crypto') : null;

class BudgetGuard {
  constructor(options = {}) {
    this.inFlightJobs = new Map(); // fingerprint -> promise or timestamp
    this.completedCache = new Map(); // fingerprint -> assetResult
    this.cacheTtlMs = options.cacheTtlMs || 30 * 60 * 1000; // 30 minutes cache
    this.telemetry = new BudgetTelemetry();
  }

  /**
   * Compute deterministic prompt fingerprint
   * @param {Object} requestParams
   * @param {string} requestParams.modelId
   * @param {string} requestParams.prompt
   * @param {Array<string>} [requestParams.referenceAssetIds]
   * @param {Object} [requestParams.parameters]
   * @returns {string} Hex hash string
   */
  computeFingerprint(requestParams = {}) {
    const model = requestParams.modelId || 'default-model';
    const prompt = (requestParams.prompt || '').trim();
    const refs = Array.isArray(requestParams.referenceAssetIds)
      ? [...requestParams.referenceAssetIds].sort().join(',')
      : '';
    const paramsStr = JSON.stringify(requestParams.parameters || {});

    const raw = `${model}::${prompt}::refs:[${refs}]::params:${paramsStr}`;

    if (crypto && crypto.createHash) {
      return crypto.createHash('sha256').update(raw).digest('hex');
    }
    // Simple fallback hash if crypto not available
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }

  /**
   * Submit job through guard: checks cache and in-flight deduplication
   * @param {Object} jobParams
   * @param {Function} executor - async () => result
   * @returns {Promise<Object>} Output result
   */
  async submitGuardedJob(jobParams, executor) {
    const fingerprint = this.computeFingerprint(jobParams);

    // 1. Check completed cache (reuse existing result if identical)
    if (this.completedCache.has(fingerprint)) {
      const cached = this.completedCache.get(fingerprint);
      this.telemetry.recordAssetReused({
        durationSeconds: jobParams.durationSeconds || 5,
        estimatedSavedUsd: jobParams.estimatedCostUsd || 1.00
      });
      return {
        cached: true,
        assetId: cached.assetId,
        fingerprint,
        message: 'Reused previously generated identical asset without cost deduction.'
      };
    }

    // 2. Check in-flight duplicate submission
    if (this.inFlightJobs.has(fingerprint)) {
      const err = new Error('DUPLICATE_IN_FLIGHT_JOB: An identical generation request is already running. Duplicate submission blocked to prevent accidental double charge.');
      err.code = 'DUPLICATE_IN_FLIGHT_JOB';
      err.fingerprint = fingerprint;
      throw err;
    }

    // 3. Mark in-flight and execute
    this.inFlightJobs.set(fingerprint, Date.now());
    this.telemetry.recordJobSubmission({
      modelId: jobParams.modelId,
      costUsd: jobParams.estimatedCostUsd || 0
    });

    try {
      const result = await executor();
      // Store in completed cache
      this.completedCache.set(fingerprint, {
        assetId: result.assetId || result.id,
        completedAt: Date.now()
      });

      this.telemetry.recordJobSuccess({
        durationSeconds: jobParams.durationSeconds || 5,
        costUsd: jobParams.estimatedCostUsd || 0
      });

      return Object.assign({}, result, { cached: false, fingerprint });
    } catch (err) {
      this.telemetry.recordJobFailure({
        code: err.code || 'UNKNOWN_ERROR',
        reason: err.message
      });
      throw err;
    } finally {
      this.inFlightJobs.delete(fingerprint);
    }
  }

  /**
   * Execute a batch queue with automatic 429 rate limit pausing and partial progress preservation
   * @param {Array<Object>} jobItems - Array of job definition objects
   * @param {Function} itemExecutor - async (item) => result
   * @returns {Promise<{ completed: Array<Object>, pending: Array<Object>, rateLimited: boolean }>}
   */
  async processBatchWithRateLimitGuard(jobItems = [], itemExecutor) {
    const completed = [];
    const pending = [...jobItems];
    let rateLimited = false;

    while (pending.length > 0) {
      const currentItem = pending[0];
      try {
        const res = await this.submitGuardedJob(currentItem, () => itemExecutor(currentItem));
        completed.push({ item: currentItem, result: res });
        pending.shift(); // Remove successfully processed item
      } catch (err) {
        if (err.status === 429 || err.code === 'RATE_LIMIT_EXCEEDED' || (err.message && err.message.includes('429'))) {
          rateLimited = true;
          // Crucial: preserve already completed work!
          break;
        }
        // Non-rate limit error: fail item or throw
        throw err;
      }
    }

    return {
      completed,
      pending, // Unexecuted items preserved for later resume
      rateLimited,
      completedCount: completed.length,
      pendingCount: pending.length
    };
  }
}

/**
 * Local-only auditable budget telemetry recorder
 * Zero network traffic, zero external analytics.
 */
class BudgetTelemetry {
  constructor() {
    this.submissions = 0;
    this.successes = 0;
    this.failures = 0;
    this.reusedCount = 0;
    this.totalGeneratedSeconds = 0;
    this.totalSavedSeconds = 0;
    this.estimatedTotalSpentUsd = 0;
    this.estimatedTotalSavedUsd = 0;
    this.userCancellations = 0;
    this.history = [];
  }

  recordJobSubmission(meta = {}) {
    this.submissions++;
    this.history.push({ type: 'SUBMISSION', time: new Date().toISOString(), meta });
  }

  recordJobSuccess(meta = {}) {
    this.successes++;
    this.totalGeneratedSeconds += meta.durationSeconds || 0;
    this.estimatedTotalSpentUsd += meta.costUsd || 0;
    this.history.push({ type: 'SUCCESS', time: new Date().toISOString(), meta });
  }

  recordJobFailure(meta = {}) {
    this.failures++;
    this.history.push({ type: 'FAILURE', time: new Date().toISOString(), meta });
  }

  recordAssetReused(meta = {}) {
    this.reusedCount++;
    this.totalSavedSeconds += meta.durationSeconds || 0;
    this.estimatedTotalSavedUsd += meta.estimatedSavedUsd || 0;
    this.history.push({ type: 'ASSET_REUSED', time: new Date().toISOString(), meta });
  }

  recordUserCancellation() {
    this.userCancellations++;
    this.history.push({ type: 'CANCELLATION', time: new Date().toISOString() });
  }

  getSummary() {
    return {
      submissions: this.submissions,
      successes: this.successes,
      failures: this.failures,
      reusedCount: this.reusedCount,
      totalGeneratedSeconds: this.totalGeneratedSeconds,
      totalSavedSeconds: this.totalSavedSeconds,
      estimatedTotalSpentUsd: parseFloat(this.estimatedTotalSpentUsd.toFixed(2)),
      estimatedTotalSavedUsd: parseFloat(this.estimatedTotalSavedUsd.toFixed(2)),
      userCancellations: this.userCancellations
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BudgetGuard,
    BudgetTelemetry
  };
} else if (typeof window !== 'undefined') {
  window.BudgetGuard = BudgetGuard;
  window.BudgetTelemetry = BudgetTelemetry;
}
