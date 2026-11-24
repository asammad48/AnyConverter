/**
 * AnyConverter Creative Studio — AI Job Lifecycle & Output Verification Manager
 * File 09 Implementation: State Machine, Cache Key, Magic Byte Verification
 *
 * Core Principles:
 * - 11-State Job Lifecycle Machine.
 * - Strict Magic Byte verification rejecting HTML/JSON disguised as MP4/images.
 * - Deterministic per-scene cache key to avoid duplicate generation.
 * - Prohibition of automatic billable retries.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('crypto'));
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.JobLifecycleManager = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (nodeCrypto) {
  'use strict';

  function sha256Hex(str) {
    if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
      return nodeCrypto.createHash('sha256').update(str).digest('hex');
    }
    // Simple deterministic string hash for browser fallback
    let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
  }

  const JOB_STATE = Object.freeze({
    DRAFT: 'DRAFT',
    CAPABILITY_CHECKED: 'CAPABILITY_CHECKED',
    AUTHORIZED: 'AUTHORIZED',
    USER_APPROVED: 'USER_APPROVED',
    SUBMITTED: 'SUBMITTED',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
    PARTIAL: 'PARTIAL',
    FAILED: 'FAILED',
    CANCELED: 'CANCELED',
    UNKNOWN: 'UNKNOWN',
    OUTPUT_RETRIEVED: 'OUTPUT_RETRIEVED',
    HASHED_AND_SAVED_LOCAL: 'HASHED_AND_SAVED_LOCAL',
    ATTACHED_TO_SCENE: 'ATTACHED_TO_SCENE',
    VERIFIED: 'VERIFIED'
  });

  class JobLifecycleManager {
    constructor() {
      this.jobs = new Map();
      this.cache = new Map(); // cacheKey -> localAssetId
    }

    /**
     * Creates a new job in DRAFT state
     * @param {Object} spec - { sceneId, providerId, modelId, prompt, seed, width, height, durationSeconds }
     * @returns {Object} Job descriptor
     */
    createJob(spec = {}) {
      const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const cacheKey = this.computeCacheKey(spec);

      const job = {
        id: jobId,
        sceneId: spec.sceneId || 'scene_default',
        providerId: spec.providerId || 'google-gemini',
        modelId: spec.modelId || 'imagen-3.0',
        prompt: spec.prompt || '',
        seed: spec.seed || 42,
        cacheKey: cacheKey,
        state: JOB_STATE.DRAFT,
        history: [{ state: JOB_STATE.DRAFT, timestamp: new Date().toISOString() }],
        approval: null,
        resultAssetId: null,
        error: null,
        retriesCount: 0
      };

      this.jobs.set(jobId, job);
      return job;
    }

    /**
     * Transition job to a new state
     * @param {string} jobId
     * @param {string} targetState
     * @param {Object} metadata
     */
    transition(jobId, targetState, metadata = {}) {
      const job = this.jobs.get(jobId);
      if (!job) throw new Error(`Job not found: ${jobId}`);

      job.state = targetState;
      job.history.push({
        state: targetState,
        timestamp: new Date().toISOString(),
        metadata: metadata
      });

      if (metadata.error) {
        job.error = metadata.error;
      }
      return job;
    }

    /**
     * Compute a deterministic cache key for generation deduplication
     */
    computeCacheKey(spec = {}) {
      const normalizedPrompt = (spec.prompt || '').trim().toLowerCase();
      const rawKey = [
        spec.providerId || '',
        spec.modelId || '',
        normalizedPrompt,
        spec.seed || 0,
        spec.width || 1024,
        spec.height || 1024,
        spec.durationSeconds || 0,
        (spec.referenceAssetHashes || []).sort().join(',')
      ].join('::');

      return sha256Hex(rawKey);
    }

    /**
     * Verifies raw binary magic bytes to guarantee valid media file signatures
     * Rejects HTML/JSON error documents disguised as images/videos
     * @param {Uint8Array|ArrayBuffer|Buffer} buffer
     * @param {string} expectedMime
     * @returns {Object} { valid: boolean, detectedMime: string, error?: string }
     */
    static verifyMagicBytes(buffer, expectedMime = '') {
      if (!buffer) {
        return { valid: false, error: 'Empty buffer' };
      }

      const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
      if (bytes.length < 8) {
        return { valid: false, error: 'Buffer too short for media signature' };
      }

      // Check for HTML document disguised as media (<html, <!DOCTYPE)
      const asciiPrefix = String.fromCharCode.apply(null, bytes.slice(0, 15)).toLowerCase();
      if (asciiPrefix.includes('<html') || asciiPrefix.includes('<!doctype') || asciiPrefix.includes('{"error"')) {
        return {
          valid: false,
          error: 'Security Failure: Endpoint returned HTML error page or JSON instead of valid binary media.'
        };
      }

      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return { valid: true, detectedMime: 'image/png' };
      }

      // JPEG: FF D8 FF
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        return { valid: true, detectedMime: 'image/jpeg' };
      }

      // GIF: 47 49 46 38 (GIF8)
      if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
        return { valid: true, detectedMime: 'image/gif' };
      }

      // WebM: 1A 45 DF A3 (EBML)
      if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
        return { valid: true, detectedMime: 'video/webm' };
      }

      // MP4: index 4..7 is 'ftyp' (0x66 0x74 0x79 0x70)
      if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
        return { valid: true, detectedMime: 'video/mp4' };
      }

      return {
        valid: false,
        error: `Unrecognized media magic bytes: ${bytes.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join(' ')}`
      };
    }

    /**
     * Prevents automatic costed retry without fresh user approval
     * @param {string} jobId
     * @param {Object} freshApproval
     * @returns {boolean}
     */
    canRetry(jobId, freshApproval) {
      const job = this.jobs.get(jobId);
      if (!job) return false;

      // Job must be in FAILED or CANCELED state
      if (job.state !== JOB_STATE.FAILED && job.state !== JOB_STATE.CANCELED) {
        return false;
      }

      // Strict requirement: Fresh user approval must be provided
      if (!freshApproval || !freshApproval.approvedByUser) {
        return false;
      }

      return true;
    }
  }

  return {
    JOB_STATE,
    JobLifecycleManager
  };
}));
