/**
 * AnyConverter Creative Studio — AI Provider Capability Registry
 * File 09 Implementation: Capability Registry & Policy Enforcement
 *
 * Immutable Principles:
 * - Live capability registry tracking official public-client support and browser CORS.
 * - Zero AnyConverter inference bill: user-supplied keys/quota only (BYOK).
 * - Distinguish direct browser execution from manual reproducible notebooks.
 * - No false claims or unverified marketing promises.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.ProviderCapabilityRegistry = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TASK_TYPE = Object.freeze({
    TEXT_TO_IMAGE: 'text_to_image',
    IMAGE_TO_IMAGE: 'image_to_image',
    TEXT_TO_VIDEO: 'text_to_video',
    IMAGE_TO_VIDEO: 'image_to_video',
    INPAINTING: 'inpainting',
    SPEECH: 'speech'
  });

  const PROVIDER_STATUS = Object.freeze({
    SUPPORTED: 'supported',
    MANUAL_ONLY: 'manual-only',
    UNVERIFIED: 'unverified',
    PROHIBITED: 'prohibited'
  });

  const REGISTRY_ENTRIES = [
    {
      providerId: 'google-gemini',
      name: 'Google Gemini & Imagen 3',
      status: PROVIDER_STATUS.SUPPORTED,
      models: [
        {
          id: 'imagen-3.0-generate-002',
          tasks: [TASK_TYPE.TEXT_TO_IMAGE],
          maxResolution: '1024x1024',
          aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
          pricingUnit: 'per_image',
          estimatedCostUsd: 0.03,
          freeQuotaInfo: 'Google Cloud Free Tier / Developer API monthly quota'
        },
        {
          id: 'gemini-2.0-flash',
          tasks: [TASK_TYPE.TEXT_TO_IMAGE, TASK_TYPE.SPEECH],
          maxResolution: '1024x1024',
          aspectRatios: ['1:1', '16:9', '9:16'],
          pricingUnit: 'per_request',
          estimatedCostUsd: 0.005,
          freeQuotaInfo: 'Free tier up to 15 RPM for experimental/developer accounts'
        }
      ],
      userAuthType: 'API_KEY_OR_OAUTH',
      browserCorsPermitted: true,
      streamingSupported: false,
      license: 'Google Generative AI Terms of Service',
      documentationUrl: 'https://ai.google.dev/docs'
    },
    {
      providerId: 'huggingface-inference',
      name: 'Hugging Face Serverless Inference',
      status: PROVIDER_STATUS.SUPPORTED,
      models: [
        {
          id: 'black-forest-labs/FLUX.1-schnell',
          tasks: [TASK_TYPE.TEXT_TO_IMAGE],
          maxResolution: '1024x1024',
          aspectRatios: ['1:1', '16:9', '9:16'],
          pricingUnit: 'serverless_quota',
          estimatedCostUsd: 0.00,
          freeQuotaInfo: 'Free rate-limited tier under user HF user token'
        },
        {
          id: 'stabilityai/stable-diffusion-xl-base-1.0',
          tasks: [TASK_TYPE.TEXT_TO_IMAGE, TASK_TYPE.INPAINTING],
          maxResolution: '1024x1024',
          aspectRatios: ['1:1', '16:9'],
          pricingUnit: 'serverless_quota',
          estimatedCostUsd: 0.00,
          freeQuotaInfo: 'Free tier subject to community inference load'
        }
      ],
      userAuthType: 'HF_USER_TOKEN',
      browserCorsPermitted: true,
      streamingSupported: false,
      license: 'Open Weights / Apache 2.0 / Flux Non-Commercial / Commercial depending on model',
      documentationUrl: 'https://huggingface.co/docs/api-inference'
    },
    {
      providerId: 'stable-video-diffusion',
      name: 'Stable Video Diffusion (SVD / AnimateDiff)',
      status: PROVIDER_STATUS.MANUAL_ONLY,
      models: [
        {
          id: 'stabilityai/stable-video-diffusion-img2vid-xt',
          tasks: [TASK_TYPE.IMAGE_TO_VIDEO],
          maxDurationSeconds: 4,
          fps: 14,
          maxResolution: '1024x576',
          pricingUnit: 'self_hosted_gpu',
          estimatedCostUsd: 0.00,
          freeQuotaInfo: 'Requires 16GB+ VRAM GPU via Colab/Kaggle or local hardware'
        }
      ],
      userAuthType: 'NONE_LOCAL_OR_NOTEBOOK',
      browserCorsPermitted: false,
      streamingSupported: false,
      license: 'Stability AI Community License',
      notebookTemplate: 'notebooks/svd_img2vid_colab.ipynb',
      documentationUrl: 'https://github.com/Stability-AI/generative-models'
    },
    {
      providerId: 'openai-sora-dalle',
      name: 'OpenAI (DALL-E 3 / Sora)',
      status: PROVIDER_STATUS.MANUAL_ONLY,
      models: [
        {
          id: 'dall-e-3',
          tasks: [TASK_TYPE.TEXT_TO_IMAGE],
          maxResolution: '1024x1024',
          pricingUnit: 'per_image',
          estimatedCostUsd: 0.040
        }
      ],
      userAuthType: 'SERVER_KEY_REQUIRED',
      browserCorsPermitted: true, // Technical CORS exists, but OpenAI forbids public client API keys
      streamingSupported: false,
      license: 'OpenAI Terms of Use (Confidential Client Required)',
      reasonManualOnly: 'OpenAI terms prohibit exposing secret API keys in public browser clients. Use reproducible notebook or server runner.'
    },
    {
      providerId: 'third-party-cors-proxy',
      name: 'Public CORS Relay / Proxy',
      status: PROVIDER_STATUS.PROHIBITED,
      models: [],
      browserCorsPermitted: false,
      reasonProhibited: 'Relaying user credentials through unvetted third-party proxy servers violates security and anti-theft principles.'
    }
  ];

  class ProviderCapabilityRegistry {
    constructor(entries = REGISTRY_ENTRIES) {
      this.entries = entries;
    }

    /**
     * Get all registered providers
     * @returns {Array<Object>}
     */
    getAllProviders() {
      return [...this.entries];
    }

    /**
     * Get provider by ID
     * @param {string} providerId
     * @returns {Object|null}
     */
    getProvider(providerId) {
      if (!providerId) return null;
      return this.entries.find(e => e.providerId.toLowerCase() === providerId.toLowerCase()) || null;
    }

    /**
     * Find supported models for a specific task
     * @param {string} taskType - e.g. TASK_TYPE.TEXT_TO_IMAGE
     * @param {boolean} browserOnly - if true, returns only direct browser-capable models
     * @returns {Array<Object>} List of models with provider metadata
     */
    findModelsForTask(taskType, browserOnly = true) {
      const results = [];
      for (const provider of this.entries) {
        if (browserOnly && provider.status !== PROVIDER_STATUS.SUPPORTED) {
          continue;
        }
        for (const model of provider.models) {
          if (model.tasks && model.tasks.includes(taskType)) {
            results.push({
              providerId: provider.providerId,
              providerName: provider.name,
              providerStatus: provider.status,
              browserCors: provider.browserCorsPermitted,
              userAuthType: provider.userAuthType,
              model: { ...model }
            });
          }
        }
      }
      return results;
    }

    /**
     * Estimates job cost and duration based on registry data
     * @param {string} providerId
     * @param {string} modelId
     * @param {Object} params - { count, resolution, durationSeconds }
     * @returns {Object}
     */
    estimateCost(providerId, modelId, params = {}) {
      const provider = this.getProvider(providerId);
      if (!provider) {
        return { estimatedCostUsd: 0, pricingUnit: 'unknown', warning: 'Unknown provider' };
      }
      const model = provider.models.find(m => m.id.toLowerCase() === (modelId || '').toLowerCase());
      if (!model) {
        return { estimatedCostUsd: 0, pricingUnit: 'unknown', warning: 'Unknown model' };
      }

      const count = params.count || 1;
      const unitCost = model.estimatedCostUsd || 0;
      const totalEstimated = unitCost * count;

      return {
        providerId: provider.providerId,
        modelId: model.id,
        pricingUnit: model.pricingUnit,
        unitCostUsd: unitCost,
        itemCount: count,
        totalEstimatedCostUsd: parseFloat(totalEstimated.toFixed(4)),
        freeQuotaInfo: model.freeQuotaInfo || null,
        browserCors: provider.browserCorsPermitted
      };
    }
  }

  return {
    TASK_TYPE,
    PROVIDER_STATUS,
    ProviderCapabilityRegistry,
    REGISTRY_ENTRIES
  };
}));
