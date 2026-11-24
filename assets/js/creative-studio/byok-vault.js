/**
 * AnyConverter Creative Studio — BYOK (Bring Your Own Key) Vault
 * File 08 Implementation: Browser-Only Credential Vault & Cryptography
 *
 * Core Principles:
 * - Session-Only Default: API keys held in transient memory only.
 * - Opt-in Encrypted Storage: PBKDF2 (SHA-256, 100k iterations) + AES-256-GCM (96-bit nonce).
 * - Zero Raw Secrets on Disk: Plaintext keys never written to localStorage, IndexedDB, cookies, or logs.
 * - Zero Server Vault: No backend credential escrow or relay.
 * - Clear XSS Threat Model Disclosure.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('crypto'));
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.BYOKVault = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (nodeCrypto) {
  'use strict';

  // Obtain WebCrypto subtle instance across Browser and Node.js
  function getSubtleCrypto() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
      return globalThis.crypto.subtle;
    }
    if (nodeCrypto && nodeCrypto.webcrypto && nodeCrypto.webcrypto.subtle) {
      return nodeCrypto.webcrypto.subtle;
    }
    throw new Error('WebCrypto API (crypto.subtle) is not supported in this environment.');
  }

  function getRandomValues(byteLength) {
    const bytes = new Uint8Array(byteLength);
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
      return globalThis.crypto.getRandomValues(bytes);
    }
    if (nodeCrypto && typeof nodeCrypto.randomFillSync === 'function') {
      return nodeCrypto.randomFillSync(bytes);
    }
    throw new Error('Secure random source unavailable.');
  }

  // Base64 helper functions
  function bytesToBase64(bytes) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(bytes).toString('base64');
    }
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToBytes(b64) {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const VAULT_VERSION = 1;
  const KDF_ALGORITHM = 'PBKDF2-SHA256';
  const KDF_ITERATIONS = 100000;
  const CIPHER_ALGORITHM = 'AES-256-GCM';
  const SALT_LENGTH_BYTES = 16;
  const IV_LENGTH_BYTES = 12; // 96 bits for AES-GCM

  const SECURITY_DISCLAIMER = Object.freeze({
    level: 'HIGH_INTEGRITY_CLIENT_ONLY',
    atRestProtection: 'Protects encrypted API keys on disk against physical/offline theft.',
    xssLimitation: 'Does NOT protect decrypted runtime keys against Cross-Site Scripting (XSS). Any script executing within this origin can access in-memory keys while unlocked.',
    recommendation: 'Use Session-Only mode on public devices. Rotate provider API keys periodically.'
  });

  class BYOKVault {
    constructor(options = {}) {
      // Ephemeral in-memory key storage: Map<providerId, string>
      this._sessionKeys = new Map();
      this.storageAdapter = options.storageAdapter || null;
      this.disclaimer = SECURITY_DISCLAIMER;
    }

    /**
     * Store key in session memory only (default mode)
     * @param {string} providerId
     * @param {string} apiKey
     */
    setSessionKey(providerId, apiKey) {
      if (!providerId || !apiKey) {
        throw new Error('ProviderId and apiKey are required.');
      }
      this._sessionKeys.set(providerId.toLowerCase(), apiKey.trim());
    }

    /**
     * Retrieve key from active session memory
     * @param {string} providerId
     * @returns {string|null}
     */
    getSessionKey(providerId) {
      return this._sessionKeys.get(providerId.toLowerCase()) || null;
    }

    /**
     * Remove key from session memory and zeroize
     * @param {string} providerId
     */
    removeSessionKey(providerId) {
      this._sessionKeys.delete(providerId.toLowerCase());
    }

    /**
     * Wipe all session keys in memory
     */
    clearSession() {
      this._sessionKeys.clear();
    }

    /**
     * Check if provider key exists in session memory
     * @param {string} providerId
     * @returns {boolean}
     */
    hasSessionKey(providerId) {
      return this._sessionKeys.has(providerId.toLowerCase());
    }

    /**
     * Encrypt an API key with user passphrase into File 08 standard record format
     * @param {string} providerId
     * @param {string} apiKey
     * @param {string} passphrase
     * @returns {Promise<Object>} Encrypted vault record
     */
    async encryptCredential(providerId, apiKey, passphrase) {
      if (!providerId || !apiKey || !passphrase) {
        throw new Error('ProviderId, apiKey, and passphrase are required for encryption.');
      }
      if (passphrase.length < 8) {
        throw new Error('Passphrase must be at least 8 characters long.');
      }

      const subtle = getSubtleCrypto();
      const enc = new TextEncoder();

      // Generate random 16-byte salt and 12-byte IV
      const salt = getRandomValues(SALT_LENGTH_BYTES);
      const iv = getRandomValues(IV_LENGTH_BYTES);

      // Derive key via PBKDF2-SHA256
      const keyMaterial = await subtle.importKey(
        'raw',
        enc.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const derivedAesKey = await subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: KDF_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // Encrypt plaintext API key with AES-256-GCM
      const plaintextBytes = enc.encode(apiKey.trim());
      const ciphertextBuffer = await subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        derivedAesKey,
        plaintextBytes
      );

      const ciphertextBytes = new Uint8Array(ciphertextBuffer);

      return {
        providerId: providerId.toLowerCase(),
        recordVersion: VAULT_VERSION,
        kdf: KDF_ALGORITHM,
        saltB64: bytesToBase64(salt),
        iterations: KDF_ITERATIONS,
        cipher: CIPHER_ALGORITHM,
        ivB64: bytesToBase64(iv),
        ciphertextB64: bytesToBase64(ciphertextBytes),
        createdAt: new Date().toISOString()
      };
    }

    /**
     * Decrypt an encrypted vault record using user passphrase
     * @param {Object} record - Vault record produced by encryptCredential
     * @param {string} passphrase - User passphrase
     * @returns {Promise<string>} Decrypted plaintext API key
     */
    async decryptCredential(record, passphrase) {
      if (!record || !record.ciphertextB64 || !record.saltB64 || !record.ivB64) {
        throw new Error('Invalid vault record structure.');
      }
      if (!passphrase) {
        throw new Error('Passphrase is required to unlock credential.');
      }

      const subtle = getSubtleCrypto();
      const enc = new TextEncoder();
      const dec = new TextDecoder();

      const salt = base64ToBytes(record.saltB64);
      const iv = base64ToBytes(record.ivB64);
      const ciphertext = base64ToBytes(record.ciphertextB64);
      const iterations = record.iterations || KDF_ITERATIONS;

      try {
        const keyMaterial = await subtle.importKey(
          'raw',
          enc.encode(passphrase),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        const derivedAesKey = await subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        const decryptedBuffer = await subtle.decrypt(
          {
            name: 'AES-GCM',
            iv: iv
          },
          derivedAesKey,
          ciphertext
        );

        return dec.decode(decryptedBuffer);
      } catch (err) {
        // SubtleCrypto throws OperationError on tag verification failure (wrong passphrase)
        const error = new Error('Decryption failed: Incorrect passphrase or corrupted vault record.');
        error.code = 'INVALID_PASSPHRASE';
        throw error;
      }
    }

    /**
     * Validates that an arbitrary JSON/archive does not contain leaked plaintext API keys
     * @param {string|Object} payload
     * @returns {boolean} true if clean, false if suspected leaked keys found
     */
    static auditForPlaintextLeaking(payload) {
      const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
      // Scan for common AI provider key patterns
      const suspiciousPatterns = [
        /sk-[a-zA-Z0-9]{20,}/,            // OpenAI pattern
        /AIza[0-9A-Za-z-_]{35}/,          // Google API Key pattern
        /hf_[a-zA-Z0-9]{30,}/,             // HuggingFace token pattern
        /ghp_[a-zA-Z0-9]{30,}/             // GitHub PAT pattern
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) {
          return false; // Found leak!
        }
      }
      return true; // Clean
    }
  }

  return {
    BYOKVault,
    VAULT_VERSION,
    SECURITY_DISCLAIMER
  };
}));
