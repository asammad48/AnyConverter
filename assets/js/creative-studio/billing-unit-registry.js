/**
 * AnyConverter Creative Studio — Phase 12: Billing Unit Registry & Pricing Manifest
 * Maps diverse provider resource units (Text Tokens, Video Seconds, Image Count, GPU Minutes, Voice Characters).
 * Enforces dated source tracking, prevents calling every resource a "token", and forbids fake $0 estimates.
 */

const BILLING_UNIT = {
  TEXT_TOKENS: 'TEXT_TOKENS',             // Input/output tokens (LLM prompt/completion)
  IMAGE_COUNT: 'IMAGE_COUNT',             // Output images or megapixels
  VIDEO_SECONDS: 'VIDEO_SECONDS',         // Rendered video footage duration
  VIDEO_CREDITS: 'VIDEO_CREDITS',         // Proprietary provider credit points
  GPU_MINUTES: 'GPU_MINUTES',             // Cloud GPU allocation time (Colab/RunPod)
  VOICE_CHARACTERS: 'VOICE_CHARACTERS',   // Text-to-speech characters
  INFERENCE_REQUESTS: 'INFERENCE_REQUESTS', // Per-call charge
  FREE_TIER: 'FREE_TIER',                 // Zero-cost rate-limited tier
  MANUAL_NOTEBOOK: 'MANUAL_NOTEBOOK'      // User-supplied GPU hardware
};

const DEFAULT_PRICING_MANIFEST = {
  manifestVersion: '1.0.0',
  manifestAsOfDate: '2026-11-20',
  sourceDocumentation: 'https://anyconverter.io/docs/creative-studio/pricing-sources.md',
  models: {
    'google-gemini-1.5-flash': {
      modelId: 'google-gemini-1.5-flash',
      provider: 'google',
      billingUnit: BILLING_UNIT.TEXT_TOKENS,
      unitPriceUsd: 0.000075 / 1000, // $0.075 per 1M tokens
      outputPriceUsd: 0.00030 / 1000,
      priceKnown: true,
      freeTierAvailable: true,
      freeTierRpmLimit: 15,
      sourceUrl: 'https://ai.google.dev/pricing',
      asOfDate: '2026-11-20',
      maxClipSeconds: null
    },
    'google-imagen-3': {
      modelId: 'google-imagen-3',
      provider: 'google',
      billingUnit: BILLING_UNIT.IMAGE_COUNT,
      unitPriceUsd: 0.03, // $0.03 per image
      priceKnown: true,
      freeTierAvailable: false,
      sourceUrl: 'https://ai.google.dev/pricing',
      asOfDate: '2026-11-20',
      maxClipSeconds: null
    },
    'huggingface-flux-schnell': {
      modelId: 'huggingface-flux-schnell',
      provider: 'huggingface',
      billingUnit: BILLING_UNIT.FREE_TIER,
      unitPriceUsd: 0.0,
      priceKnown: true,
      freeTierAvailable: true,
      sourceUrl: 'https://huggingface.co/docs/api-inference',
      asOfDate: '2026-11-20',
      maxClipSeconds: null
    },
    'stable-video-diffusion-colab': {
      modelId: 'stable-video-diffusion-colab',
      provider: 'community-notebook',
      billingUnit: BILLING_UNIT.MANUAL_NOTEBOOK,
      unitPriceUsd: 0.0, // Direct compute provided by user's personal Colab session
      priceKnown: true,
      freeTierAvailable: true,
      sourceUrl: 'https://github.com/stability-ai/generative-models',
      asOfDate: '2026-11-20',
      maxClipSeconds: 5 // SVD generates 25 frames ~ 4-5 seconds
    },
    'generic-commercial-video-model': {
      modelId: 'generic-commercial-video-model',
      provider: 'third-party-commercial',
      billingUnit: BILLING_UNIT.VIDEO_SECONDS,
      unitPriceUsd: 0.20, // $0.20 per generated video second
      priceKnown: true,
      freeTierAvailable: false,
      sourceUrl: 'https://example.com/pricing',
      asOfDate: '2026-11-20',
      maxClipSeconds: 5
    },
    'openai-sora-preview': {
      modelId: 'openai-sora-preview',
      provider: 'openai',
      billingUnit: BILLING_UNIT.VIDEO_SECONDS,
      unitPriceUsd: null, // Unknown / unverified
      priceKnown: false,
      freeTierAvailable: false,
      sourceUrl: 'https://openai.com/pricing',
      asOfDate: '2026-11-20',
      maxClipSeconds: 5
    },
    'elevenlabs-voice-tts': {
      modelId: 'elevenlabs-voice-tts',
      provider: 'elevenlabs',
      billingUnit: BILLING_UNIT.VOICE_CHARACTERS,
      unitPriceUsd: 0.30 / 1000, // $0.30 per 1,000 characters
      priceKnown: true,
      freeTierAvailable: true,
      sourceUrl: 'https://elevenlabs.io/pricing',
      asOfDate: '2026-11-20',
      maxClipSeconds: null
    }
  }
};

class BillingUnitRegistry {
  constructor(customManifest = null) {
    this.manifest = customManifest || JSON.parse(JSON.stringify(DEFAULT_PRICING_MANIFEST));
  }

  /**
   * Look up pricing and unit information for a model
   * @param {string} modelId
   * @returns {Object|null} Pricing record
   */
  getModelPricing(modelId) {
    const record = this.manifest.models[modelId];
    if (!record) {
      return {
        modelId,
        billingUnit: BILLING_UNIT.INFERENCE_REQUESTS,
        unitPriceUsd: null,
        priceKnown: false,
        asOfDate: this.manifest.manifestAsOfDate,
        reason: 'UNREGISTERED_MODEL: No documented pricing in manifest'
      };
    }
    return record;
  }

  /**
   * Register or override pricing for a specific model
   * @param {string} modelId
   * @param {Object} record
   */
  registerModelPricing(modelId, record = {}) {
    if (!record.billingUnit) {
      throw new Error('BILLING_UNIT_REQUIRED: Must provide explicit BillingUnit');
    }
    this.manifest.models[modelId] = Object.assign({
      modelId,
      asOfDate: new Date().toISOString().split('T')[0],
      priceKnown: record.unitPriceUsd !== null && record.unitPriceUsd !== undefined
    }, record);
  }

  /**
   * Estimate cost for requested units
   * @param {string} modelId
   * @param {number} units
   * @returns {{ known: boolean, estimatedCostUsd: number|null, label: string, billingUnit: string, asOfDate: string }}
   */
  calculateCost(modelId, units = 0) {
    const pricing = this.getModelPricing(modelId);

    if (!pricing || !pricing.priceKnown || pricing.unitPriceUsd === null) {
      return {
        known: false,
        estimatedCostUsd: null,
        label: `Cost estimate not available for ${modelId} (Checked ${pricing ? pricing.asOfDate : this.manifest.manifestAsOfDate}). Please confirm directly in your provider account.`,
        billingUnit: pricing ? pricing.billingUnit : 'UNKNOWN',
        asOfDate: pricing ? pricing.asOfDate : this.manifest.manifestAsOfDate
      };
    }

    const estimatedCostUsd = parseFloat((units * pricing.unitPriceUsd).toFixed(4));
    return {
      known: true,
      estimatedCostUsd,
      label: `$${estimatedCostUsd.toFixed(2)} USD (Estimated at $${pricing.unitPriceUsd} per ${pricing.billingUnit}, checked ${pricing.asOfDate})`,
      billingUnit: pricing.billingUnit,
      asOfDate: pricing.asOfDate
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BILLING_UNIT,
    DEFAULT_PRICING_MANIFEST,
    BillingUnitRegistry
  };
} else if (typeof window !== 'undefined') {
  window.BillingUnitRegistry = BillingUnitRegistry;
  window.BILLING_UNIT = BILLING_UNIT;
  window.DEFAULT_PRICING_MANIFEST = DEFAULT_PRICING_MANIFEST;
}
