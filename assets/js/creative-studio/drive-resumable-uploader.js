/**
 * AnyConverter Creative Studio — Phase 10: Resumable Chunked Upload Engine
 * Implements Google Drive v3 Resumable Upload protocol for large assets and project packages (>5MB).
 * Enforces 256KB-aligned chunk boundaries, exponential backoff retries,
 * network disconnect recovery, token-expiration pause/resume, and QuotaExceeded detection.
 */

const UPLOADER_CONSTANTS = {
  CHUNK_ALIGNMENT: 256 * 1024, // 262,144 bytes (Drive required chunk multiple)
  DEFAULT_CHUNK_SIZE: 512 * 1024, // 512KB default chunk
  RESUMABLE_THRESHOLD: 5 * 1024 * 1024, // 5MB threshold
  MAX_RETRIES_PER_CHUNK: 3,
  BASE_BACKOFF_MS: 500,
  UPLOAD_INIT_URL: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable'
};

const UPLOADER_STATUS = {
  IDLE: 'IDLE',
  INITIATING: 'INITIATING',
  UPLOADING: 'UPLOADING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED'
};

class DriveResumableUploader {
  /**
   * @param {Object} options
   * @param {Object} options.driveAdapter - Authenticated DriveSyncAdapter
   * @param {number} [options.chunkSize] - Multiple of 256KB
   * @param {Function} [options.fetcher] - Custom fetch
   */
  constructor(options = {}) {
    this.driveAdapter = options.driveAdapter || null;
    this.fetcher = options.fetcher || (this.driveAdapter ? this.driveAdapter.fetcher : globalThis.fetch);
    this.chunkSize = options.chunkSize || UPLOADER_CONSTANTS.DEFAULT_CHUNK_SIZE;

    // Validate chunk alignment
    if (this.chunkSize % UPLOADER_CONSTANTS.CHUNK_ALIGNMENT !== 0) {
      throw new Error(`CHUNK_ALIGNMENT_ERROR: Chunk size ${this.chunkSize} must be a multiple of 256KB (262,144 bytes)`);
    }

    this.status = UPLOADER_STATUS.IDLE;
    this.sessionUri = null;
    this.bytesUploaded = 0;
    this.totalBytes = 0;
    this.payloadBuffer = null;
    this.fileName = null;
    this.mimeType = null;
    this.onProgress = options.onProgress || null;
    this.onTokenExpired = options.onTokenExpired || (this.driveAdapter ? this.driveAdapter._onTokenExpiredCallback : null);
    this._isPaused = false;
    this._isAborted = false;
  }

  /**
   * Sleep helper with jitter
   * @param {number} ms
   */
  _sleep(ms) {
    const jitter = Math.floor(Math.random() * 50);
    return new Promise(resolve => setTimeout(resolve, ms + jitter));
  }

  /**
   * Initiate resumable session with Google Drive
   * POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable
   */
  async _initiateSession(metadata, parents = []) {
    this.status = UPLOADER_STATUS.INITIATING;
    const token = this.driveAdapter.getAuthToken();

    const metaPayload = Object.assign({}, metadata);
    if (parents.length > 0) {
      metaPayload.parents = parents;
    }

    const res = await this.fetcher(UPLOADER_CONSTANTS.UPLOAD_INIT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': this.mimeType || 'application/octet-stream',
        'X-Upload-Content-Length': String(this.totalBytes)
      },
      body: JSON.stringify(metaPayload)
    });

    if (res.status === 401) {
      const err = new Error('TOKEN_EXPIRED: Token expired during session initialization');
      err.code = 'TOKEN_EXPIRED';
      err.status = 401;
      throw err;
    }

    if (res.status === 403) {
      const text = await res.text();
      if (text.includes('quotaExceeded') || text.includes('storageQuotaExceeded')) {
        const err = new Error('QUOTA_EXCEEDED: Google Drive storage quota full during upload initiation');
        err.code = 'QUOTA_EXCEEDED';
        err.status = 403;
        throw err;
      }
      const err = new Error(`FORBIDDEN_403: ${text}`);
      err.code = 'FORBIDDEN';
      err.status = 403;
      throw err;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`SESSION_INIT_FAILED: ${res.status} ${errText}`);
    }

    const sessionUri = res.headers.get('location') || res.headers.get('Location');
    if (!sessionUri) {
      throw new Error('NO_LOCATION_HEADER: Google Drive did not return resumable session Location header');
    }

    this.sessionUri = sessionUri;
    return sessionUri;
  }

  /**
   * Query Drive for current upload status and accepted bytes
   * PUT sessionUri with Content-Range: bytes * / totalBytes
   * @returns {Promise<number>} Next byte offset to upload
   */
  async queryStatus() {
    if (!this.sessionUri) {
      throw new Error('NO_ACTIVE_SESSION: Cannot query upload status without session URI');
    }

    const token = this.driveAdapter ? this.driveAdapter._token : null;
    const headers = {
      'Content-Range': `bytes */${this.totalBytes}`
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await this.fetcher(this.sessionUri, {
      method: 'PUT',
      headers
    });

    if (res.status === 308) {
      const range = res.headers.get('range') || res.headers.get('Range');
      if (range) {
        // Example: 'bytes=0-524287'
        const match = range.match(/bytes=(\d+)-(\d+)/);
        if (match) {
          const nextOffset = parseInt(match[2], 10) + 1;
          this.bytesUploaded = nextOffset;
          return nextOffset;
        }
      }
      return 0;
    }

    if (res.status === 200 || res.status === 201) {
      this.bytesUploaded = this.totalBytes;
      this.status = UPLOADER_STATUS.COMPLETED;
      return this.totalBytes;
    }

    if (res.status === 401) {
      const err = new Error('TOKEN_EXPIRED');
      err.code = 'TOKEN_EXPIRED';
      err.status = 401;
      throw err;
    }

    if (res.status === 403) {
      const text = await res.text();
      if (text.includes('quotaExceeded')) {
        const err = new Error('QUOTA_EXCEEDED');
        err.code = 'QUOTA_EXCEEDED';
        throw err;
      }
    }

    return this.bytesUploaded;
  }

  /**
   * Pause upload session
   */
  pause() {
    this._isPaused = true;
    this.status = UPLOADER_STATUS.PAUSED;
  }

  /**
   * Resume upload session
   * @param {Object} [params]
   * @param {string} [params.newAuthToken] - Fresh OAuth token if prior expired
   */
  async resume(params = {}) {
    if (params.newAuthToken && this.driveAdapter) {
      this.driveAdapter.setAuthToken(params.newAuthToken);
    }
    this._isPaused = false;
    this.status = UPLOADER_STATUS.UPLOADING;

    // Inquire current accepted byte offset from Drive
    const nextOffset = await this.queryStatus();
    return this._uploadChunks(nextOffset);
  }

  /**
   * Start resumable upload
   * @param {Object} params
   * @param {Buffer|Uint8Array} params.payload
   * @param {string} params.name - File name
   * @param {string} [params.mimeType='application/octet-stream']
   * @param {Array<string>} [params.parents]
   * @param {Function} [params.onProgress] - ({ bytesUploaded, totalBytes, percentage, chunkIndex, totalChunks }) => void
   * @param {Function} [params.onTokenExpired] - async () => void
   * @param {string} [params.sessionUri] - Resume existing session
   * @returns {Promise<Object>} Completed Drive file metadata
   */
  async startUpload(params = {}) {
    const {
      payload,
      name,
      mimeType = 'application/octet-stream',
      parents = [],
      onProgress = null,
      onTokenExpired = null,
      sessionUri = null
    } = params;

    if (!payload) {
      throw new Error('PAYLOAD_REQUIRED: Must provide binary payload for resumable upload');
    }

    this.payloadBuffer = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
    this.totalBytes = this.payloadBuffer.length;
    this.fileName = name;
    this.mimeType = mimeType;
    if (onProgress) this.onProgress = onProgress;
    if (onTokenExpired) this.onTokenExpired = onTokenExpired;
    this._isPaused = false;
    this._isAborted = false;

    if (sessionUri) {
      this.sessionUri = sessionUri;
      const offset = await this.queryStatus();
      return this._uploadChunks(offset);
    }

    // Initiate new resumable upload session
    await this._initiateSession({ name, mimeType }, parents);
    return this._uploadChunks(0);
  }

  /**
   * Upload chunks sequentially from startOffset
   * @param {number} startOffset
   * @returns {Promise<Object>}
   */
  async _uploadChunks(startOffset = 0) {
    this.status = UPLOADER_STATUS.UPLOADING;
    let offset = startOffset;
    const totalChunks = Math.ceil(this.totalBytes / this.chunkSize);

    while (offset < this.totalBytes) {
      if (this._isPaused) {
        this.status = UPLOADER_STATUS.PAUSED;
        return { status: UPLOADER_STATUS.PAUSED, sessionUri: this.sessionUri, bytesUploaded: offset, totalBytes: this.totalBytes };
      }

      if (this._isAborted) {
        this.status = UPLOADER_STATUS.ABORTED;
        throw new Error('UPLOAD_ABORTED');
      }

      const end = Math.min(offset + this.chunkSize, this.totalBytes);
      const chunk = this.payloadBuffer.subarray(offset, end);
      const chunkLength = end - offset;
      const chunkIndex = Math.floor(offset / this.chunkSize) + 1;

      let retries = 0;
      let chunkSuccess = false;
      let lastError = null;

      while (retries <= UPLOADER_CONSTANTS.MAX_RETRIES_PER_CHUNK && !chunkSuccess) {
        try {
          const token = this.driveAdapter ? this.driveAdapter._token : null;
          const headers = {
            'Content-Length': String(chunkLength),
            'Content-Range': `bytes ${offset}-${end - 1}/${this.totalBytes}`,
            'Content-Type': this.mimeType || 'application/octet-stream'
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await this.fetcher(this.sessionUri, {
            method: 'PUT',
            headers,
            body: chunk
          });

          // HTTP 308 Resume Incomplete: chunk received, proceed
          if (res.status === 308) {
            offset = end;
            this.bytesUploaded = offset;
            chunkSuccess = true;

            if (this.onProgress) {
              const percentage = Math.round((offset / this.totalBytes) * 100);
              this.onProgress({
                bytesUploaded: offset,
                totalBytes: this.totalBytes,
                percentage,
                chunkIndex,
                totalChunks
              });
            }
            break;
          }

          // HTTP 200 or 201: Upload Complete!
          if (res.status === 200 || res.status === 201) {
            this.bytesUploaded = this.totalBytes;
            this.status = UPLOADER_STATUS.COMPLETED;
            chunkSuccess = true;

            if (this.onProgress) {
              this.onProgress({
                bytesUploaded: this.totalBytes,
                totalBytes: this.totalBytes,
                percentage: 100,
                chunkIndex,
                totalChunks
              });
            }

            const data = await res.json();
            return {
              status: UPLOADER_STATUS.COMPLETED,
              fileId: data.id,
              name: data.name || this.fileName,
              sizeBytes: this.totalBytes,
              metadata: data
            };
          }

          // HTTP 401: Token expired mid-transfer!
          if (res.status === 401) {
            this.pause();
            if (this.onTokenExpired) {
              await this.onTokenExpired();
            }
            const err = new Error('TOKEN_EXPIRED_MID_TRANSFER: Token expired during chunk upload');
            err.code = 'TOKEN_EXPIRED';
            err.status = 401;
            err.sessionUri = this.sessionUri;
            err.bytesUploaded = offset;
            throw err;
          }

          // HTTP 403: Quota Exceeded or forbidden
          if (res.status === 403) {
            const body = await res.text();
            this.status = UPLOADER_STATUS.FAILED;
            if (body.includes('quotaExceeded') || body.includes('storageQuotaExceeded')) {
              const err = new Error('QUOTA_EXCEEDED: User Google Drive storage quota full. Suggest local .acstudio export.');
              err.code = 'QUOTA_EXCEEDED';
              err.status = 403;
              throw err;
            }
            const err = new Error(`FORBIDDEN_403: ${body}`);
            err.code = 'FORBIDDEN';
            err.status = 403;
            throw err;
          }

          // 5xx / transient error: retry with exponential backoff
          if (res.status >= 500) {
            retries++;
            if (retries > UPLOADER_CONSTANTS.MAX_RETRIES_PER_CHUNK) {
              throw new Error(`CHUNK_RETRY_LIMIT_EXCEEDED: Server returned ${res.status} repeatedly`);
            }
            const backoff = UPLOADER_CONSTANTS.BASE_BACKOFF_MS * Math.pow(2, retries - 1);
            await this._sleep(backoff);
            continue;
          }

          const errText = await res.text();
          throw new Error(`UNEXPECTED_CHUNK_RESPONSE: ${res.status} ${errText}`);
        } catch (err) {
          if (err.code === 'TOKEN_EXPIRED' || err.code === 'QUOTA_EXCEEDED' || this._isPaused) {
            throw err;
          }
          lastError = err;
          retries++;
          if (retries > UPLOADER_CONSTANTS.MAX_RETRIES_PER_CHUNK) {
            this.status = UPLOADER_STATUS.FAILED;
            throw new Error(`CHUNK_UPLOAD_FAILED after ${retries} attempts: ${lastError.message}`);
          }
          const backoff = UPLOADER_CONSTANTS.BASE_BACKOFF_MS * Math.pow(2, retries - 1);
          await this._sleep(backoff);
        }
      }
    }

    this.status = UPLOADER_STATUS.COMPLETED;
    return {
      status: UPLOADER_STATUS.COMPLETED,
      bytesUploaded: this.bytesUploaded,
      totalBytes: this.totalBytes
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UPLOADER_CONSTANTS,
    UPLOADER_STATUS,
    DriveResumableUploader
  };
} else if (typeof window !== 'undefined') {
  window.DriveResumableUploader = DriveResumableUploader;
  window.UPLOADER_CONSTANTS = UPLOADER_CONSTANTS;
  window.UPLOADER_STATUS = UPLOADER_STATUS;
}
