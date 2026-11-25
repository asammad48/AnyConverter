/**
 * AnyConverter Creative Studio — AI Provider Adapter Interface & Adapters
 * File 09 Implementation: Pluggable Browser Adapters for BYOK AI Generation
 *
 * Core Security & Operational Principles:
 * - Strict AiProviderAdapter contract.
 * - Explicit user pre-approval required before submission (no unapproved spending).
 * - Header-based authentication (x-goog-api-key / Bearer) — ZERO API keys in URLs/query params (B07).
 * - Rigorous credential redaction in all telemetry, logs, and error messages (B07).
 * - Genuine authenticated read-only connection validation without consuming paid inference (B08).
 * - Production journeys strictly reject mock clients (B08).
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
   * Helper to redact sensitive API keys from strings and error messages
   */
  function redactSecrets(message, secret) {
    if (!message) return '';
    let sanitized = String(message);
    if (secret && typeof secret === 'string' && secret.length > 4) {
      sanitized = sanitized.split(secret).join('[REDACTED_API_KEY]');
    }
    // Pattern match standard Google / HF / OpenAI keys
    sanitized = sanitized.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_GEMINI_KEY]');
    sanitized = sanitized.replace(/hf_[0-9A-Za-z]{30,}/g, '[REDACTED_HF_TOKEN]');
    sanitized = sanitized.replace(/sk-[0-9A-Za-z]{30,}/g, '[REDACTED_API_KEY]');
    return sanitized;
  }

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
   * Uses header-based authorization (`x-goog-api-key`) — NEVER URL query string (B07).
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
      const validation = await this.validateConnection();
      return { connected: validation.valid, providerId: this.id, status: validation.status };
    }

    /**
     * Non-chargeable validation via official GET /v1beta/models/{modelId} endpoint
     */
    async validateConnection() {
      if (!this.apiKey) {
        return { valid: false, status: 'NO_KEY', error: 'No API key configured.' };
      }

      if (this.options.skipNetworkValidation) {
        return { valid: false, status: 'UNVERIFIED', message: 'Network validation skipped by option' };
      }

      try {
        const fetchFn = this.options.fetcher || (typeof globalThis !== 'undefined' ? globalThis.fetch : null);
        if (!fetchFn) {
          return { valid: false, status: 'UNVERIFIED', message: 'No fetcher available' };
        }

        // Query read-only metadata endpoint without spending generation tokens
        const url = `${this.apiEndpoint}/models/${this.modelId}`;
        const res = await fetchFn(url, {
          method: 'GET',
          headers: {
            'x-goog-api-key': this.apiKey
          }
        });

        if (res.status === 200) {
          return { valid: true, status: 'AUTHENTICATED', modelId: this.modelId };
        }
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          const errBody = await res.text().catch(() => '');
          return {
            valid: false,
            status: 'AUTH_FAILED',
            error: redactSecrets(`Gemini API authorization rejected (HTTP ${res.status}): ${errBody}`, this.apiKey)
          };
        }
        return { valid: false, status: 'UNVERIFIED', error: `Gemini API returned HTTP ${res.status}` };
      } catch (e) {
        return { valid: false, status: 'NETWORK_ERROR', error: redactSecrets(e.message, this.apiKey) };
      }
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
      // Production journeys strictly reject mock clients (B08)
      if (this.options.productionJourney && this.options._mockClient) {
        throw new Error('MOCK_CLIENT_DISALLOWED: Mock generation clients are strictly forbidden in production journeys.');
      }

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

      // Execute mock client in unit tests only
      if (this.options._mockClient) {
        job.status = 'COMPLETED';
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
        // Header authorization: ZERO API key in URL query parameter (B07)
        const url = `${this.apiEndpoint}/models/${this.modelId}:predict`;
        const payload = {
          instances: [{ prompt: request.prompt }],
          parameters: {
            sampleCount: request.count || 1,
            aspectRatio: request.aspectRatio || '16:9'
          }
        };

        const fetchFn = this.options.fetcher || globalThis.fetch;
        const res = await fetchFn(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          },
          body: JSON.stringify(payload),
          signal: abortController.signal
        });

        if (!res.ok) {
          const errBody = await res.text().catch(() => '');
          job.status = 'FAILED';
          job.error = redactSecrets(`Gemini API returned status ${res.status}: ${errBody}`, this.apiKey);
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
          job.error = redactSecrets(err.message, this.apiKey);
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
   * Uses Bearer header authorization with strict redaction.
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

    async validateConnection() {
      if (!this.apiKey) {
        return { valid: false, status: 'NO_KEY', error: 'No Hugging Face token configured.' };
      }
      if (this.options.skipNetworkValidation) {
        return { valid: false, status: 'UNVERIFIED', message: 'Network validation skipped by option' };
      }
      try {
        const fetchFn = this.options.fetcher || (typeof globalThis !== 'undefined' ? globalThis.fetch : null);
        if (!fetchFn) return { valid: false, status: 'UNVERIFIED', message: 'No fetcher' };

        const res = await fetchFn('https://huggingface.co/api/whoami-v2', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
        if (res.status === 200) {
          return { valid: true, status: 'AUTHENTICATED' };
        }
        return { valid: false, status: 'AUTH_FAILED', error: `Hugging Face token rejected (status ${res.status})` };
      } catch (e) {
        return { valid: false, status: 'NETWORK_ERROR', error: redactSecrets(e.message, this.apiKey) };
      }
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
      if (this.options.productionJourney && this.options._mockClient) {
        throw new Error('MOCK_CLIENT_DISALLOWED: Mock generation clients are strictly forbidden in production journeys.');
      }

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
        const fetchFn = this.options.fetcher || globalThis.fetch;
        const res = await fetchFn(url, {
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
          job.error = redactSecrets(`Hugging Face returned status ${res.status}`, this.apiKey);
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
          job.error = redactSecrets(err.message, this.apiKey);
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
    HuggingFaceProviderAdapter,
    redactSecrets
  };
}));
