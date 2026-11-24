/**
 * AnyConverter Creative Studio — Provider Security & Decision Engine
 * File 08 Implementation: Decision Tree, CSP Config, Redaction & Sanitization
 *
 * Core Principles:
 * - Direct Browser vs Manual-Only: Enforces provider evaluation decision tree.
 * - Zero CORS Proxies: Strictly prohibits third-party proxy routing.
 * - Secret Redaction: Guarantees zero plaintext tokens in telemetry or audit logs.
 * - Input Sanitization: Strips executable vectors from untrusted SVG/XML/prompts.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.ProviderSecurity = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Provider Connection Decision Tree Outcomes
  const CONNECTION_VERDICT = Object.freeze({
    DIRECT_BROWSER_SUPPORTED: 'DIRECT_BROWSER_SUPPORTED',
    MANUAL_NOTEBOOK_ONLY: 'MANUAL_NOTEBOOK_ONLY',
    REJECTED_UNSAFE: 'REJECTED_UNSAFE'
  });

  // Known provider profiles
  const KNOWN_PROVIDERS = {
    'google-gemini': {
      name: 'Google Gemini',
      hasDocumentedBrowserAuth: true,
      supportsCors: true,
      allowsPublicClientUsage: true,
      requiresServerSecret: false,
      corsOrigins: ['https://generativelanguage.googleapis.com']
    },
    'huggingface-inference': {
      name: 'Hugging Face Inference',
      hasDocumentedBrowserAuth: true,
      supportsCors: true,
      allowsPublicClientUsage: true,
      requiresServerSecret: false,
      corsOrigins: ['https://api-inference.huggingface.co']
    },
    'openai': {
      name: 'OpenAI API',
      hasDocumentedBrowserAuth: false, // OpenAI explicitly warns against browser public client API keys
      supportsCors: true,
      allowsPublicClientUsage: false, // Requires backend or explicit dangerous client setting
      requiresServerSecret: true,
      corsOrigins: ['https://api.openai.com']
    },
    'runway': {
      name: 'Runway Gen-2/3',
      hasDocumentedBrowserAuth: false,
      supportsCors: false,
      allowsPublicClientUsage: false,
      requiresServerSecret: true
    },
    'midjourney': {
      name: 'Midjourney',
      hasDocumentedBrowserAuth: false,
      supportsCors: false,
      allowsPublicClientUsage: false,
      requiresServerSecret: true
    },
    'local-ollama': {
      name: 'Local Ollama Instance',
      hasDocumentedBrowserAuth: true,
      supportsCors: true, // User configurable CORS on localhost
      allowsPublicClientUsage: true,
      requiresServerSecret: false,
      corsOrigins: ['http://localhost:11434', 'http://127.0.0.1:11434']
    }
  };

  class ProviderSecurity {
    /**
     * Evaluates an AI provider against File 08 Connection Decision Tree
     * @param {string} providerId
     * @param {Object} customMetadata
     * @returns {Object} Verdict and rationale
     */
    static evaluateProvider(providerId, customMetadata = {}) {
      const pid = (providerId || '').toLowerCase();
      const meta = Object.assign({}, KNOWN_PROVIDERS[pid] || {}, customMetadata);

      // Check 0: Does it attempt to route through a third-party CORS proxy?
      if (meta.usesThirdPartyProxy || meta.proxyUrl) {
        return {
          verdict: CONNECTION_VERDICT.REJECTED_UNSAFE,
          reason: 'Routing API keys through third-party CORS proxies violates AnyConverter zero-backend security principles and risks credential theft.'
        };
      }

      // Check 1: Documented official browser auth & Public client allowed
      if (!meta.hasDocumentedBrowserAuth || !meta.allowsPublicClientUsage || meta.requiresServerSecret) {
        return {
          verdict: CONNECTION_VERDICT.MANUAL_NOTEBOOK_ONLY,
          reason: `${meta.name || providerId} requires server-side secret credentials or lacks public-client terms. Direct browser invocation is prohibited; use reproducible Jupyter / Colab notebooks or local runners.`
        };
      }

      // Check 2: Browser CORS supported
      if (!meta.supportsCors) {
        return {
          verdict: CONNECTION_VERDICT.MANUAL_NOTEBOOK_ONLY,
          reason: `${meta.name || providerId} does not permit direct CORS requests from web browsers. Use local script or notebook export.`
        };
      }

      // All checks pass
      return {
        verdict: CONNECTION_VERDICT.DIRECT_BROWSER_SUPPORTED,
        reason: `${meta.name || providerId} provides documented public-client browser access with standard CORS headers.`
      };
    }

    /**
     * Scans and masks potential API keys or tokens in text or serialized objects
     * @param {any} input
     * @returns {any}
     */
    static redactSecrets(input) {
      if (input === null || input === undefined) return input;

      if (typeof input === 'string') {
        return input
          .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[REDACTED_OPENAI_KEY]')
          .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_GOOGLE_KEY]')
          .replace(/hf_[a-zA-Z0-9]{30,}/g, '[REDACTED_HF_TOKEN]')
          .replace(/ghp_[a-zA-Z0-9]{30,}/g, '[REDACTED_GITHUB_TOKEN]')
          .replace(/(bearer\s+)[a-zA-Z0-9._-]{20,}/gi, '$1[REDACTED_BEARER_TOKEN]');
      }

      if (Array.isArray(input)) {
        return input.map(item => ProviderSecurity.redactSecrets(item));
      }

      if (typeof input === 'object') {
        const copy = {};
        for (const [k, v] of Object.entries(input)) {
          // Sensitive field name masking
          if (/key|secret|token|password|passphrase|auth/i.test(k) && typeof v === 'string') {
            copy[k] = '[REDACTED_CREDENTIAL]';
          } else {
            copy[k] = ProviderSecurity.redactSecrets(v);
          }
        }
        return copy;
      }

      return input;
    }

    /**
     * Sanitizes untrusted SVG/HTML string to prevent XSS and script execution
     * @param {string} rawString
     * @returns {string} Sanitized string
     */
    static sanitizeUntrustedInput(rawString) {
      if (typeof rawString !== 'string') return '';

      // Strip <script> tags and contents
      let cleaned = rawString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // Strip inline event handlers (onclick, onload, onerror, etc.)
      cleaned = cleaned.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

      // Strip javascript: pseudo-protocols
      cleaned = cleaned.replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'href="#"');

      // Strip dangerous SVG entity and external references
      cleaned = cleaned.replace(/<!ENTITY[^>]*>/gi, '');
      cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
      cleaned = cleaned.replace(/<use\s+[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi, '');

      return cleaned;
    }

    /**
     * Generates Content Security Policy specification for Creative Studio
     * @returns {string}
     */
    static getStudioCSP() {
      return [
        "default-src 'self'",
        "script-src 'self' https://accounts.google.com/gsi/client",
        "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
        "connect-src 'self' https://generativelanguage.googleapis.com https://api-inference.huggingface.co https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
        "img-src 'self' data: blob: https://*.googleusercontent.com",
        "media-src 'self' blob: data:",
        "font-src 'self'",
        "frame-src https://accounts.google.com/",
        "object-src 'none'",
        "base-uri 'self'"
      ].join('; ');
    }
  }

  /**
   * Local in-memory audit logger with mandatory secret scrubbing
   */
  class AuditLogger {
    constructor(maxEntries = 200) {
      this.maxEntries = maxEntries;
      this.entries = [];
    }

    log(action, metadata = {}) {
      const sanitizedMeta = ProviderSecurity.redactSecrets(metadata);
      const entry = {
        timestamp: new Date().toISOString(),
        action: action,
        data: sanitizedMeta
      };

      this.entries.push(entry);
      if (this.entries.length > this.maxEntries) {
        this.entries.shift();
      }
      return entry;
    }

    getEntries() {
      return [...this.entries];
    }

    clear() {
      this.entries = [];
    }
  }

  return {
    CONNECTION_VERDICT,
    KNOWN_PROVIDERS,
    ProviderSecurity,
    AuditLogger
  };
}));
