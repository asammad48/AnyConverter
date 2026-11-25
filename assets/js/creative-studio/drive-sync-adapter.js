/**
 * AnyConverter Creative Studio — Phase 10: Google Drive Sync Adapter
 * Pure client-side browser integration with official Google Drive v3 REST API.
 * Follows GIS token model, minimal `drive.file` scope, zero-backend architecture (G-01),
 * zero AnyConverter storage costs (G-02/G-03), and zero persistent token leaks.
 *
 * Security & Browser Hardening:
 * - Native Blob / Uint8Array / TextEncoder (zero Node Buffer dependency in browser).
 * - Bearer Token Host Allowlist: Only www.googleapis.com / upload endpoints are permitted.
 * - Redirect security: Authorization header is never forwarded to external hosts.
 * - Public Client ID with explicit OWNER_CONFIG_REQUIRED status when unconfigured.
 */

var nodeCrypto = typeof require !== 'undefined' ? require('crypto') : null;
var AcStudioArchiveClass = typeof require !== 'undefined'
  ? require('./archive.js').AcStudioArchive
  : (typeof window !== 'undefined' ? window.AcStudioArchive : null);

const DRIVE_CONSTANTS = {
  API_BASE: 'https://www.googleapis.com/drive/v3',
  UPLOAD_BASE: 'https://www.googleapis.com/upload/drive/v3',
  SCOPE: 'https://www.googleapis.com/auth/drive.file',
  APP_FOLDER_NAME: 'AnyConverter Creative Studio',
  PROJECT_PACKAGE_EXT: '.acstudio',
  MIME_FOLDER: 'application/vnd.google-apps.folder',
  MIME_JSON: 'application/json',
  MIME_ZIP: 'application/zip',
  MIME_MP4: 'video/mp4'
};

class DriveSyncAdapter {
  /**
   * @param {Object} options
   * @param {string} [options.clientId] - Public Google OAuth Client ID
   * @param {Function} [options.fetcher] - Custom fetch function for tests or polyfill
   */
  constructor(options = {}) {
    this.clientId = options.clientId || null;
    this.fetcher = options.fetcher || (typeof globalThis !== 'undefined' ? globalThis.fetch : null);
    this._token = null; // Stored STRICTLY in memory. Never in localStorage/cookies.
    this._tokenExpiresAt = 0;
    this._tokenClient = null;
    this._appFolderId = null;
    this._onTokenExpiredCallback = null;
    this._archive = new (AcStudioArchiveClass || (typeof window !== 'undefined' && window.AcStudioArchive) || Object)();
  }

  /**
   * Register callback for when Google token expires
   * @param {Function} callback
   */
  onTokenExpired(callback) {
    this._onTokenExpiredCallback = callback;
  }

  /**
   * Authenticate with Google Identity Services (GIS) Token Model
   * Requests minimal `drive.file` scope.
   * @param {Object} [params]
   * @param {string} [params.clientId]
   * @param {string} [params.customToken] - Direct token injection for tests or mocked auth
   * @param {number} [params.expiresInSeconds=3600]
   * @returns {Promise<{ success: boolean, token: string }>}
   */
  async connectDrive(params = {}) {
    if (params.clientId) {
      this.clientId = params.clientId;
    }

    // Direct token injection (e.g. test harness)
    if (params.customToken) {
      this._token = params.customToken;
      this._tokenExpiresAt = Date.now() + ((params.expiresInSeconds || 3600) * 1000);
      return { success: true, token: this._token };
    }

    if (!this.clientId) {
      const err = new Error('OWNER_CONFIG_REQUIRED: Google OAuth Client ID is not configured. The site owner must create an OAuth 2.0 Web Client ID in Google Cloud Console and set the Client ID in Studio settings.');
      err.code = 'OWNER_CONFIG_REQUIRED';
      err.status = 'OWNER_CONFIG_REQUIRED';
      throw err;
    }

    // Browser Google Identity Services (GIS) flow
    if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
      return new Promise((resolve, reject) => {
        try {
          this._tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: DRIVE_CONSTANTS.SCOPE,
            callback: (response) => {
              if (response.error) {
                reject(new Error(`GIS_AUTH_ERROR: ${response.error}`));
                return;
              }
              this._token = response.access_token;
              const expiresIn = parseInt(response.expires_in, 10) || 3600;
              this._tokenExpiresAt = Date.now() + (expiresIn * 1000);
              resolve({ success: true, token: this._token });
            }
          });
          this._tokenClient.requestAccessToken({ prompt: params.prompt || '' });
        } catch (err) {
          reject(new Error(`GIS_INIT_FAILURE: ${err.message}`));
        }
      });
    }

    throw new Error('GIS_UNAVAILABLE: Google Identity Services library is not loaded');
  }

  /**
   * Explicitly disconnect Drive session and purge token from memory
   */
  disconnectDrive() {
    this._token = null;
    this._tokenExpiresAt = 0;
    this._appFolderId = null;
    // Local IndexedDB drafts are intentionally preserved!
    return { success: true, message: 'Drive session disconnected. Memory token purged. Local drafts preserved.' };
  }

  /**
   * Check if client has a valid, non-expired in-memory token
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(this._token && Date.now() < this._tokenExpiresAt);
  }

  /**
   * Get active token or throw if expired
   * @returns {string}
   */
  getAuthToken() {
    if (!this.isAuthenticated()) {
      throw new Error('TOKEN_EXPIRED_OR_ABSENT: Google Drive is not connected or token expired');
    }
    return this._token;
  }

  /**
   * Set or update token manually (used during reauthorization without restart)
   * @param {string} token
   * @param {number} expiresInSeconds
   */
  setAuthToken(token, expiresInSeconds = 3600) {
    this._token = token;
    this._tokenExpiresAt = Date.now() + (expiresInSeconds * 1000);
  }

  /**
   * Execute an authorized request against Google Drive API
   * Enforces security allowlist on destination host and path prefix.
   * @param {string} url - Full URL or relative endpoint
   * @param {Object} [options]
   * @returns {Promise<Response>}
   */
  async authorizedFetch(url, options = {}) {
    if (!this._token) {
      throw new Error('TOKEN_ABSENT: No Google OAuth access token present in memory');
    }

    const fullUrl = url.startsWith('http') ? url : `${DRIVE_CONSTANTS.API_BASE}${url}`;
    let parsedUrl;
    try {
      parsedUrl = new URL(fullUrl);
    } catch (e) {
      throw new Error(`INVALID_DRIVE_URL: ${e.message}`);
    }

    // Security Hardening (B06): Only allow official Google Drive API endpoints
    const ALLOWED_HOSTS = ['www.googleapis.com'];
    if (parsedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      throw new Error(`SECURITY_VIOLATION: Google Drive request to unauthorized host/protocol: ${parsedUrl.origin}`);
    }

    const ALLOWED_PATH_PREFIXES = ['/drive/v3/', '/upload/drive/v3/'];
    if (!ALLOWED_PATH_PREFIXES.some(prefix => parsedUrl.pathname.startsWith(prefix))) {
      throw new Error(`SECURITY_VIOLATION: Google Drive request to unauthorized path: ${parsedUrl.pathname}`);
    }

    const headers = Object.assign({}, options.headers || {}, {
      'Authorization': `Bearer ${this._token}`
    });

    const response = await this.fetcher(fullUrl, Object.assign({}, options, { headers, redirect: 'error' }));

    // Handle Token Expiry
    if (response.status === 401) {
      if (this._onTokenExpiredCallback) {
        await this._onTokenExpiredCallback();
      }
      const err = new Error('UNAUTHORIZED: Google Drive access token expired or revoked');
      err.code = 'TOKEN_EXPIRED';
      err.status = 401;
      throw err;
    }

    // Handle Quota Exceeded / 403 Forbidden
    if (response.status === 403) {
      let bodyText = '';
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = '';
      }
      if (bodyText.includes('quotaExceeded') || bodyText.includes('storageQuotaExceeded')) {
        const err = new Error('QUOTA_EXCEEDED: User Google Drive storage quota is full. Suggest local .acstudio export.');
        err.code = 'QUOTA_EXCEEDED';
        err.status = 403;
        err.body = bodyText;
        throw err;
      }
      const err = new Error(`FORBIDDEN_403: Google Drive access forbidden: ${bodyText}`);
      err.code = 'FORBIDDEN';
      err.status = 403;
      err.body = bodyText;
      throw err;
    }

    return response;
  }

  /**
   * Find or create the root 'AnyConverter Creative Studio' application folder
   * @param {string} [folderName=APP_FOLDER_NAME]
   * @returns {Promise<string>} Folder ID
   */
  async findOrCreateAppFolder(folderName = DRIVE_CONSTANTS.APP_FOLDER_NAME) {
    if (this._appFolderId) {
      return this._appFolderId;
    }

    const q = `mimeType = '${DRIVE_CONSTANTS.MIME_FOLDER}' and name = '${folderName}' and trashed = false`;
    const listRes = await this.authorizedFetch(`/files?q=${encodeURIComponent(q)}&fields=files(id,name)`);
    const listData = await listRes.json();

    if (listData.files && listData.files.length > 0) {
      this._appFolderId = listData.files[0].id;
      return this._appFolderId;
    }

    // Create application folder
    const createRes = await this.authorizedFetch('/files', {
      method: 'POST',
      headers: { 'Content-Type': DRIVE_CONSTANTS.MIME_JSON },
      body: JSON.stringify({
        name: folderName,
        mimeType: DRIVE_CONSTANTS.MIME_FOLDER
      })
    });
    const createData = await createRes.json();
    this._appFolderId = createData.id;
    return this._appFolderId;
  }

  /**
   * Find or create a subfolder within a parent folder
   * @param {string} folderName
   * @param {string} parentFolderId
   * @returns {Promise<string>} Folder ID
   */
  async findOrCreateFolder(folderName, parentFolderId) {
    const q = `mimeType = '${DRIVE_CONSTANTS.MIME_FOLDER}' and name = '${folderName}' and '${parentFolderId}' in parents and trashed = false`;
    const listRes = await this.authorizedFetch(`/files?q=${encodeURIComponent(q)}&fields=files(id,name)`);
    const listData = await listRes.json();

    if (listData.files && listData.files.length > 0) {
      return listData.files[0].id;
    }

    const createRes = await this.authorizedFetch('/files', {
      method: 'POST',
      headers: { 'Content-Type': DRIVE_CONSTANTS.MIME_JSON },
      body: JSON.stringify({
        name: folderName,
        mimeType: DRIVE_CONSTANTS.MIME_FOLDER,
        parents: [parentFolderId]
      })
    });
    const createData = await createRes.json();
    return createData.id;
  }

  /**
   * Create a file in Google Drive via multipart upload
   * Browser-safe: uses TextEncoder, Blob, Uint8Array (no mandatory Buffer)
   * @param {Object} fileParams
   * @param {string} fileParams.name
   * @param {Array<string>} [fileParams.parents]
   * @param {string} fileParams.mimeType
   * @param {string|Buffer|Uint8Array|Blob} fileParams.content
   * @returns {Promise<Object>} Created file metadata
   */
  async createFile(fileParams) {
    const { name, parents = [], mimeType, content } = fileParams;
    const metadata = { name, mimeType };
    if (parents.length > 0) {
      metadata.parents = parents;
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
    const mediaHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

    const encoder = new TextEncoder();
    const part1Bytes = encoder.encode(metadataPart + mediaHeader);
    const part3Bytes = encoder.encode(closeDelimiter);

    let contentBytes;
    if (typeof content === 'string') {
      contentBytes = encoder.encode(content);
    } else if (content instanceof Uint8Array) {
      contentBytes = content;
    } else if (content instanceof ArrayBuffer) {
      contentBytes = new Uint8Array(content);
    } else if (typeof Blob !== 'undefined' && content instanceof Blob) {
      // If Blob, read as ArrayBuffer or use Uint8Array
      contentBytes = new Uint8Array(await content.arrayBuffer());
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(content)) {
      contentBytes = new Uint8Array(content.buffer, content.byteOffset, content.byteLength);
    } else {
      contentBytes = encoder.encode(String(content));
    }

    const totalLen = part1Bytes.length + contentBytes.length + part3Bytes.length;
    const multipartBody = new Uint8Array(totalLen);
    multipartBody.set(part1Bytes, 0);
    multipartBody.set(contentBytes, part1Bytes.length);
    multipartBody.set(part3Bytes, part1Bytes.length + contentBytes.length);

    const res = await this.authorizedFetch(`${DRIVE_CONSTANTS.UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,md5Checksum,modifiedTime`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`DRIVE_CREATE_FILE_FAILED: ${res.status} ${errText}`);
    }

    return await res.json();
  }

  /**
   * Update existing file content and/or metadata
   * Browser-safe: accepts String, Uint8Array, Blob, ArrayBuffer, or Buffer
   * @param {Object} updateParams
   * @param {string} updateParams.fileId
   * @param {string} [updateParams.mimeType='application/json']
   * @param {string|Buffer|Uint8Array|Blob} updateParams.content
   * @returns {Promise<Object>} Updated file metadata
   */
  async updateFile(updateParams) {
    const { fileId, mimeType = DRIVE_CONSTANTS.MIME_JSON, content } = updateParams;
    let body;
    if (typeof content === 'string') {
      body = content;
    } else if (content instanceof Uint8Array || content instanceof ArrayBuffer) {
      body = content;
    } else if (typeof Blob !== 'undefined' && content instanceof Blob) {
      body = content;
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(content)) {
      body = new Uint8Array(content.buffer, content.byteOffset, content.byteLength);
    } else if (typeof content === 'object') {
      body = JSON.stringify(content, null, 2);
    } else {
      body = String(content);
    }

    const res = await this.authorizedFetch(`${DRIVE_CONSTANTS.UPLOAD_BASE}/files/${fileId}?uploadType=media&fields=id,name,mimeType,size,md5Checksum,modifiedTime`, {
      method: 'PATCH',
      headers: {
        'Content-Type': mimeType
      },
      body
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`DRIVE_UPDATE_FILE_FAILED: ${res.status} ${errText}`);
    }

    return await res.json();
  }

  /**
   * Get file metadata
   * @param {string} fileId
   * @param {string} [fields='id,name,mimeType,size,md5Checksum,modifiedTime,parents']
   * @returns {Promise<Object>}
   */
  async getFileMetadata(fileId, fields = 'id,name,mimeType,size,md5Checksum,modifiedTime,parents') {
    const res = await this.authorizedFetch(`/files/${fileId}?fields=${fields}`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`DRIVE_GET_METADATA_FAILED: ${res.status} ${errText}`);
    }
    return await res.json();
  }

  /**
   * Download file content from Google Drive
   * @param {string} fileId
   * @param {'json'|'text'|'buffer'|'blob'} [responseType='json']
   * @returns {Promise<any>}
   */
  async getFileContent(fileId, responseType = 'json') {
    const res = await this.authorizedFetch(`/files/${fileId}?alt=media`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`DRIVE_DOWNLOAD_FAILED: ${res.status} ${errText}`);
    }

    if (responseType === 'json') {
      return await res.json();
    }
    if (responseType === 'text') {
      return await res.text();
    }
    if (responseType === 'buffer') {
      if (typeof res.buffer === 'function') {
        return await res.buffer();
      }
      const arrayBuf = await res.arrayBuffer();
      if (typeof Buffer !== 'undefined' && Buffer.from) {
        return Buffer.from(arrayBuf);
      }
      return new Uint8Array(arrayBuf);
    }
    if (responseType === 'blob') {
      return await res.blob();
    }
    return await res.arrayBuffer();
  }

  /**
   * Distinct Action: Save Editable Project
   * Packages project manifest, scenes, source media, timeline state, and references.
   * Can save as a complete standalone .acstudio bundle or folder structure.
   * @param {Object} params
   * @param {Object} params.projectDocument
   * @param {Map<string, Buffer>|Object} [params.binaryAssets]
   * @param {string} [params.remoteFolderId]
   * @param {string} [params.existingFileId]
   * @returns {Promise<{ success: boolean, fileId: string, name: string, sizeBytes: number, isEditableProject: true }>}
   */
  async saveEditableProject(params = {}) {
    const { projectDocument, binaryAssets = {}, remoteFolderId, existingFileId } = params;
    if (!projectDocument || !projectDocument.projectId) {
      throw new Error('INVALID_PROJECT_DOCUMENT: Cannot save project without valid projectId');
    }

    const folderId = remoteFolderId || (await this.findOrCreateAppFolder());
    const safeTitle = (projectDocument.title || 'Untitled_Project').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeTitle}${DRIVE_CONSTANTS.PROJECT_PACKAGE_EXT}`;

    // Package into .acstudio ZIP buffer
    const packageBuffer = this._archive.package(projectDocument, binaryAssets);

    let resultFile;
    if (existingFileId) {
      resultFile = await this.updateFile({
        fileId: existingFileId,
        mimeType: DRIVE_CONSTANTS.MIME_ZIP,
        content: packageBuffer
      });
    } else {
      resultFile = await this.createFile({
        name: fileName,
        parents: [folderId],
        mimeType: DRIVE_CONSTANTS.MIME_ZIP,
        content: packageBuffer
      });
    }

    return {
      success: true,
      fileId: resultFile.id,
      name: fileName,
      sizeBytes: packageBuffer.length,
      revisionId: projectDocument.revisionId,
      modifiedTime: resultFile.modifiedTime,
      isEditableProject: true
    };
  }

  /**
   * Distinct Action: Save Final Video (Flattened MP4/WebM Export)
   * Does NOT replace the editable project; saves standalone viewable video file.
   * @param {Object} params
   * @param {Buffer|Blob|Uint8Array} params.videoData - Flattened video binary
   * @param {string} [params.filename]
   * @param {string} [params.remoteFolderId]
   * @returns {Promise<{ success: boolean, fileId: string, name: string, sizeBytes: number, isFinalVideo: true }>}
   */
  async saveFinalVideo(params = {}) {
    const { videoData, filename = 'exported_video.mp4', remoteFolderId } = params;
    if (!videoData) {
      throw new Error('MISSING_VIDEO_DATA: Cannot save video without binary payload');
    }

    const folderId = remoteFolderId || (await this.findOrCreateAppFolder());
    let payload;
    let sizeBytes = 0;

    if (typeof Blob !== 'undefined' && videoData instanceof Blob) {
      payload = videoData;
      sizeBytes = videoData.size;
    } else if (videoData instanceof Uint8Array || videoData instanceof ArrayBuffer) {
      payload = videoData;
      sizeBytes = videoData.byteLength;
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(videoData)) {
      payload = new Uint8Array(videoData.buffer, videoData.byteOffset, videoData.byteLength);
      sizeBytes = videoData.length;
    } else {
      const bytes = new TextEncoder().encode(String(videoData));
      payload = bytes;
      sizeBytes = bytes.length;
    }

    const mimeType = filename.endsWith('.webm') ? 'video/webm' : DRIVE_CONSTANTS.MIME_MP4;

    const resultFile = await this.createFile({
      name: filename,
      parents: [folderId],
      mimeType,
      content: payload
    });

    return {
      success: true,
      fileId: resultFile.id,
      name: filename,
      sizeBytes: sizeBytes,
      isFinalVideo: true
    };
  }

  /**
   * Load and unpack an editable project from Google Drive
   * @param {string} fileId
   * @returns {Promise<{ projectDocument: Object, binaryAssets: Map<string, Buffer>, manifest: Object }>}
   */
  async loadProjectFromDrive(fileId) {
    if (!fileId) {
      throw new Error('FILE_ID_REQUIRED: Must provide Drive fileId to load project');
    }

    const meta = await this.getFileMetadata(fileId);
    const contentBuffer = await this.getFileContent(fileId, 'buffer');

    if (meta.name && meta.name.endsWith(DRIVE_CONSTANTS.PROJECT_PACKAGE_EXT)) {
      const unpacked = this._archive.unpackage(contentBuffer);
      return {
        projectDocument: unpacked.project,
        binaryAssets: unpacked.assets,
        manifest: unpacked.manifest,
        sourceFileId: fileId
      };
    }

    // Direct JSON file
    const textDecoder = new TextDecoder('utf-8');
    const parsed = JSON.parse(typeof contentBuffer === 'string' ? contentBuffer : textDecoder.decode(contentBuffer));
    return {
      projectDocument: parsed,
      binaryAssets: new Map(),
      manifest: { projectId: parsed.projectId, revisionId: parsed.revisionId },
      sourceFileId: fileId
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DRIVE_CONSTANTS,
    DriveSyncAdapter
  };
}
if (typeof window !== 'undefined') {
  window.DriveSyncAdapter = DriveSyncAdapter;
  window.DRIVE_CONSTANTS = DRIVE_CONSTANTS;
}
