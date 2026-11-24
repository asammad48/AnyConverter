/**
 * AnyConverter Creative Studio — AI Provider Adapter Interface & Adapters
 * File 09 Implementation: Pluggable Browser Adapters for BYOK AI Generation
 *
 * Core Principles:
 * - Strict AiProviderAdapter contract.
 * - Explicit user pre-approval required before submission (no unapproved spending).
 * - Direct client-side invocation for browser-authorized APIs.
 * - AbortController cancellation support.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.AiProviderAdapter = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Base AiProviderAdapter Contract
   */
  class BaseAiProviderAdapter {
    constructor(id, options = {}) {
      this.id = id;
      this.options = options;
      this.activeJobs = new Map();
      this.apiKey = options.apiKey || null;
    }

    async capabilities() {
      throw new Error('capabilities() must be implemented by subclass');
    }

    async connectInteractive() {
      throw new Error('connectInteractive() must be implemented by subclass');
    }

    async validateConnection() {
      throw new Error('validateConnection() must be implemented by subclass');
    }

    async estimate(request) {
      throw new Error('estimate() must be implemented by subclass');
    }

    /**
     * Submit an approved generation job.
     * MUST refuse submission without explicit user approval.
     */
    async submitApprovedJob(request, approval) {
      this._assertExplicitApproval(request, approval);
      return this._executeJob(request, approval);
    }

    async poll(job) {
      throw new Error('poll() must be implemented by subclass');
    }

    async fetchResults(job) {
      throw new Error('fetchResults() must be implemented by subclass');
    }

    async cancel(job) {
      if (job && job.abortController) {
        job.abortController.abort();
        job.status = 'CANCELED';
        return { canceled: true, jobId: job.id };
      }
      return { canceled: false, jobId: job ? job.id : null };
    }

    async disconnect() {
      this.apiKey = null;
      this.activeJobs.clear();
    }

    /**
     * Asserts that explicit user approval record exists and is valid
     * @protected
     */
    _assertExplicitApproval(request, approval) {
      if (!approval || typeof approval !== 'object') {
        const err = new Error('Submission Refused: Missing explicit user approval record.');
        err.code = 'APPROVAL_REQUIRED';
        throw err;
      }
      if (!approval.approvedByUser) {
        const err = new Error('Submission Refused: User has not confirmed approval for this generation request.');
        err.code = 'USER_APPROVAL_NOT_GRANTED';
        throw err;
      }
      if (typeof approval.maxApprovedRequests !== 'number' || approval.maxApprovedRequests < 1) {
        const err = new Error('Submission Refused: User approval must bound maximum chargeable requests (maxApprovedRequests >= 1).');
        err.code = 'INVALID_APPROVAL_BOUNDS';
        throw err;
      }
    }

    async _executeJob(request, approval) {
      throw new Error('_executeJob() must be implemented by subclass');
    }
  }

  /**
   * Google Gemini / Imagen 3 Adapter
   */
  class GeminiProviderAdapter extends BaseAiProviderAdapter {
    constructor(options = {}) {
      super('google-gemini', options);
      this.modelId = options.modelId || 'imagen-3.0-generate-002';
      this.apiEndpoint = options.apiEndpoint || 'https://generativelanguage.googleapis.com/v1beta';
    }

    async capabilities() {
      return {
        id: this.id,
        modelId: this.modelId,
        supportedTasks: ['text_to_image'],
        browserCors: true,
        formats: ['image/jpeg', 'image/png'],
        maxResolution: '1024x1024'
      };
    }

    async connectInteractive() {
      if (!this.apiKey) {
        return { connected: false, message: 'API key required' };
      }
      return { connected: true, providerId: this.id };
    }

    async validateConnection() {
      if (!this.apiKey) {
        return { valid: false, error: 'No API key configured.' };
      }
      return { valid: true };
    }

    async estimate(request) {
      const count = request.count || 1;
      const unitCost = 0.03;
      return {
        providerId: this.id,
        modelId: this.modelId,
        estimatedCostUsd: parseFloat((unitCost * count).toFixed(4)),
        unit: 'per_image',
        itemCount: count,
        estimatedDurationSeconds: 4 * count
      };
    }

    async _executeJob(request, approval) {
      const jobId = 'gemini-job-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
      const abortController = new AbortController();

      const job = {
        id: jobId,
        providerId: this.id,
        modelId: this.modelId,
        status: 'SUBMITTED',
        request: { ...request },
        approval: { ...approval },
        abortController: abortController,
        createdAt: new Date().toISOString(),
        outputBlobs: []
      };

      this.activeJobs.set(jobId, job);

      // Execute request (real network call or simulated test client)
      if (this.options._mockClient) {
        job.status = 'COMPLETED';
        // 1x1 transparent PNG mock payload
        const sampleBase64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        job.outputBlobs = [{
          mimeType: 'image/png',
          base64: sampleBase64Png,
          width: 1024,
          height: 1024,
          prompt: request.prompt
        }];
        return job;
      }

      try {
        job.status = 'RUNNING';
        const url = `${this.apiEndpoint}/models/${this.modelId}:predict?key=${encodeURIComponent(this.apiKey)}`;
        const payload = {
          instances: [{ prompt: request.prompt }],
          parameters: {
            sampleCount: request.count || 1,
            aspectRatio: request.aspectRatio || '16:9'
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: abortController.signal
        });

        if (!res.ok) {
          const errBody = await res.text();
          job.status = 'FAILED';
          job.error = `Gemini API returned status ${res.status}: ${errBody}`;
          return job;
        }

        const data = await res.json();
        job.status = 'COMPLETED';
        if (data.predictions) {
          job.outputBlobs = data.predictions.map(p => ({
            mimeType: p.mimeType || 'image/png',
            base64: p.bytesBase64Encoded,
            prompt: request.prompt
          }));
        }
        return job;
      } catch (err) {
        if (err.name === 'AbortError') {
          job.status = 'CANCELED';
        } else {
          job.status = 'FAILED';
          job.error = err.message;
        }
        return job;
      }
    }

    async poll(job) {
      const live = this.activeJobs.get(job.id);
      return {
        jobId: job.id,
        status: live ? live.status : 'UNKNOWN',
        error: live ? live.error : null
      };
    }

    async fetchResults(job) {
      const live = this.activeJobs.get(job.id);
      if (!live || live.status !== 'COMPLETED') {
        throw new Error(`Cannot fetch results for job ${job.id} in state ${live ? live.status : 'NOT_FOUND'}`);
      }
      return live.outputBlobs || [];
    }
  }

  /**
   * Hugging Face Inference API Adapter
   */
  class HuggingFaceProviderAdapter extends BaseAiProviderAdapter {
    constructor(options = {}) {
      super('huggingface-inference', options);
      this.modelId = options.modelId || 'black-forest-labs/FLUX.1-schnell';
      this.apiEndpoint = options.apiEndpoint || 'https://api-inference.huggingface.co/models';
    }

    async capabilities() {
      return {
        id: this.id,
        modelId: this.modelId,
        supportedTasks: ['text_to_image'],
        browserCors: true,
        pricingUnit: 'serverless_quota'
      };
    }

    async estimate(request) {
      return {
        providerId: this.id,
        modelId: this.modelId,
        estimatedCostUsd: 0.00,
        unit: 'user_hf_quota',
        itemCount: request.count || 1,
        estimatedDurationSeconds: 8
      };
    }

    async _executeJob(request, approval) {
      const jobId = 'hf-job-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
      const abortController = new AbortController();

      const job = {
        id: jobId,
        providerId: this.id,
        modelId: this.modelId,
        status: 'SUBMITTED',
        request: { ...request },
        approval: { ...approval },
        abortController: abortController,
        createdAt: new Date().toISOString(),
        outputBlobs: []
      };

      this.activeJobs.set(jobId, job);

      if (this.options._mockClient) {
        job.status = 'COMPLETED';
        const sampleBase64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        job.outputBlobs = [{
          mimeType: 'image/png',
          base64: sampleBase64Png,
          prompt: request.prompt
        }];
        return job;
      }

      try {
        job.status = 'RUNNING';
        const url = `${this.apiEndpoint}/${this.modelId}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ inputs: request.prompt }),
          signal: abortController.signal
        });

        if (!res.ok) {
          job.status = 'FAILED';
          job.error = `Hugging Face returned status ${res.status}`;
          return job;
        }

        const blob = await res.blob();
        job.status = 'COMPLETED';
        job.outputBlobs = [{
          mimeType: blob.type || 'image/jpeg',
          blob: blob,
          prompt: request.prompt
        }];
        return job;
      } catch (err) {
        if (err.name === 'AbortError') {
          job.status = 'CANCELED';
        } else {
          job.status = 'FAILED';
          job.error = err.message;
        }
        return job;
      }
    }

    async poll(job) {
      const live = this.activeJobs.get(job.id);
      return {
        jobId: job.id,
        status: live ? live.status : 'UNKNOWN'
      };
    }

    async fetchResults(job) {
      const live = this.activeJobs.get(job.id);
      if (!live || live.status !== 'COMPLETED') {
        throw new Error('Job not completed');
      }
      return live.outputBlobs;
    }
  }

  return {
    BaseAiProviderAdapter,
    GeminiProviderAdapter,
    HuggingFaceProviderAdapter
  };
}));
