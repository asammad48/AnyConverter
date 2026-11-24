/**
 * AnyConverter Creative Studio — Browser-Only Auth Provider
 * File 08 Implementation: Google Identity Services (GIS) Token Model
 *
 * Immutable Principles:
 * - Guest/Local by default: zero AnyConverter user accounts or server sessions.
 * - GIS Browser Token Model: accesses only user-authorized Drive files (`drive.file` scope).
 * - Short-lived in-memory tokens only: NEVER written to localStorage, sessionStorage,
 *   cookies, IndexedDB, or .acstudio archive files.
 * - Distinction between authorize and authenticate: user authorizes Drive file access,
 *   they are not "logging in" to AnyConverter.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.AuthProvider = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const GOOGLE_DRIVE_FILE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
  const GOOGLE_REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke';

  class AuthProvider {
    constructor(options = {}) {
      this.clientId = options.clientId || null;
      this.scopes = options.scopes || [GOOGLE_DRIVE_FILE_SCOPE];
      
      // Private in-memory token state (never persisted)
      this._token = null;
      this._expiresAt = 0;
      this._tokenType = 'Bearer';
      this._userEmail = null;
      this._listeners = new Set();
      this._tokenClient = null;
    }

    /**
     * Initialize the Google Token Client
     * @param {Object} config - { clientId, scopes }
     */
    init(config = {}) {
      if (config.clientId) this.clientId = config.clientId;
      if (config.scopes) this.scopes = config.scopes;

      if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
        this._tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: this.scopes.join(' '),
          callback: (response) => this._handleTokenResponse(response)
        });
      }
    }

    /**
     * Request Drive authorization via Google GIS popup
     * @param {Object} options - { prompt: '' | 'consent' | 'select_account' }
     * @returns {Promise<string>} Short-lived access token
     */
    async authorizeDrive(options = {}) {
      if (!this.clientId) {
        throw new Error('Google OAuth Client ID is required for Drive authorization.');
      }

      // Check if current in-memory token is still valid with 60s safety buffer
      if (this.isAuthorized()) {
        return this._token;
      }

      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        return new Promise((resolve, reject) => {
          try {
            if (!this._tokenClient) {
              this.init();
            }

            // Set one-time resolver callback
            const originalCallback = this._tokenClient.callback;
            this._tokenClient.callback = (response) => {
              this._tokenClient.callback = originalCallback;
              if (response.error) {
                const err = new Error(`Google Authorization Failed: ${response.error_description || response.error}`);
                err.code = response.error;
                reject(err);
                return;
              }
              const token = this._handleTokenResponse(response);
              resolve(token);
            };

            this._tokenClient.requestAccessToken({
              prompt: options.prompt || ''
            });
          } catch (err) {
            reject(err);
          }
        });
      } else {
        // Mock / headless test environment
        if (options._mockToken) {
          const expiresIn = options.expiresIn || 3600;
          this._setTokenState(options._mockToken, expiresIn, options.userEmail || 'user@example.com');
          return this._token;
        }
        throw new Error('Google Identity Services SDK is not loaded in current environment.');
      }
    }

    /**
     * Handles incoming GIS token response
     * @private
     */
    _handleTokenResponse(response) {
      if (!response || !response.access_token) {
        throw new Error('Invalid token response from Google Identity Services.');
      }

      // Enforce requested scope verification: drive.file only
      const grantedScopes = (response.scope || '').split(' ');
      const hasDriveFileScope = grantedScopes.some(s => s === GOOGLE_DRIVE_FILE_SCOPE);
      if (!hasDriveFileScope && response.scope) {
        this.revoke();
        throw new Error(`Insufficient scope granted. Required: ${GOOGLE_DRIVE_FILE_SCOPE}`);
      }

      const expiresIn = parseInt(response.expires_in, 10) || 3599;
      this._setTokenState(response.access_token, expiresIn, response.email || null);
      return this._token;
    }

    /**
     * Sets internal in-memory token state
     * @private
     */
    _setTokenState(accessToken, expiresInSeconds, email = null) {
      this._token = accessToken;
      this._expiresAt = Date.now() + (expiresInSeconds * 1000);
      this._userEmail = email;
      this._notifyListeners({ status: 'AUTHORIZED', email: this._userEmail, expiresAt: this._expiresAt });
    }

    /**
     * Returns valid in-memory access token, or null if expired or missing
     * @returns {string|null}
     */
    getAccessToken() {
      if (!this.isAuthorized()) {
        return null;
      }
      return this._token;
    }

    /**
     * Checks if current authorization is active and not within 60s expiration window
     * @returns {boolean}
     */
    isAuthorized() {
      if (!this._token) return false;
      const bufferMs = 60 * 1000; // 60s renewal buffer
      return (Date.now() + bufferMs) < this._expiresAt;
    }

    /**
     * Returns active account indicator without revealing credentials
     * @returns {Object}
     */
    getActiveAccount() {
      return {
        authorized: this.isAuthorized(),
        email: this._userEmail ? this._maskEmail(this._userEmail) : null,
        expiresInSeconds: Math.max(0, Math.round((this._expiresAt - Date.now()) / 1000)),
        scopes: [...this.scopes]
      };
    }

    /**
     * Masks email for privacy (e.g. u***@example.com)
     * @private
     */
    _maskEmail(email) {
      if (!email || !email.includes('@')) return null;
      const [user, domain] = email.split('@');
      const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
      return `${maskedUser}@${domain}`;
    }

    /**
     * Revoke Drive authorization and zero out memory
     */
    async revoke() {
      const currentToken = this._token;
      
      // Zero out in-memory state immediately
      this._token = null;
      this._expiresAt = 0;
      this._userEmail = null;

      // Call Google revocation if token was active
      if (currentToken && typeof fetch !== 'undefined') {
        try {
          await fetch(`${GOOGLE_REVOKE_ENDPOINT}?token=${encodeURIComponent(currentToken)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            mode: 'cors'
          });
        } catch (_) {
          // Best effort network revocation
        }
      }

      this._notifyListeners({ status: 'REVOKED' });
    }

    /**
     * Subscribe to auth status changes
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    onAuthStateChanged(callback) {
      if (typeof callback === 'function') {
        this._listeners.add(callback);
      }
      return () => this._listeners.delete(callback);
    }

    /**
     * @private
     */
    _notifyListeners(event) {
      for (const listener of this._listeners) {
        try {
          listener(event);
        } catch (err) {
          console.error('[AuthProvider] Error in auth listener callback:', err);
        }
      }
    }
  }

  return {
    AuthProvider,
    GOOGLE_DRIVE_FILE_SCOPE
  };
}));
