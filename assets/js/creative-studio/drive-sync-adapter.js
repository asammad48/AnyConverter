/**
 * AnyConverter Creative Studio — Phase 10: Google Drive Sync Adapter
 * Pure client-side browser integration with official Google Drive v3 REST API.
 * Follows GIS token model, minimal `drive.file` scope, zero-backend architecture (G-01),
 * zero AnyConverter storage costs (G-02/G-03), and zero persistent token leaks.
 */

const crypto = typeof require !== 'undefined' ? require('crypto') : null;
const { AcStudioArchive } = typeof require !== 'undefined'
  ? require('./archive.js')
  : (typeof window !== 'undefined' ? window : {});

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
    this._archive = new AcStudioArchive();
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

    throw new Error('GIS_UNAVAILABLE: Google Identity Services library is not loaded or missing clientId');
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
   * @param {string} url - Full URL or relative endpoint
   * @param {Object} [options]
   * @returns {Promise<Response>}
   */
  async authorizedFetch(url, options = {}) {
    if (!this._token) {
      throw new Error('TOKEN_ABSENT: No Google OAuth access token present in memory');
    }

    const headers = Object.assign({}, options.headers || {}, {
      'Authorization': `Bearer ${this._token}`
    });

    const fullUrl = url.startsWith('http') ? url : `${DRIVE_CONSTANTS.API_BASE}${url}`;
    const response = await this.fetcher(fullUrl, Object.assign({}, options, { headers }));

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
   * @param {Object} fileParams
   * @param {string} fileParams.name
   * @param {Array<string>} [fileParams.parents]
   * @param {string} fileParams.mimeType
   * @param {string|Buffer|Uint8Array} fileParams.content
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

    let multipartBody;
    if (typeof content === 'string') {
      multipartBody = `${metadataPart}${mediaHeader}${content}${closeDelimiter}`;
    } else {
      // Binary content (Buffer or Uint8Array)
      const part1 = Buffer.from(metadataPart + mediaHeader, 'utf8');
      const part2 = Buffer.isBuffer(content) ? content : Buffer.from(content);
      const part3 = Buffer.from(closeDelimiter, 'utf8');
      multipartBody = Buffer.concat([part1, part2, part3]);
    }

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
   * @param {Object} updateParams
   * @param {string} updateParams.fileId
   * @param {string} [updateParams.mimeType='application/json']
   * @param {string|Buffer} updateParams.content
   * @returns {Promise<Object>} Updated file metadata
   */
  async updateFile(updateParams) {
    const { fileId, mimeType = DRIVE_CONSTANTS.MIME_JSON, content } = updateParams;
    const body = Buffer.isBuffer(content) || typeof content === 'string'
      ? content
      : (typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content));

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
      return Buffer.from(arrayBuf);
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
   * Distinct Action: Save Final Video (Flattened MP4 Export)
   * Does NOT replace the editable project; saves standalone viewable video file.
   * @param {Object} params
   * @param {Buffer|Blob|Uint8Array} params.videoData - Flattened MP4 binary
   * @param {string} [params.filename]
   * @param {string} [params.remoteFolderId]
   * @returns {Promise<{ success: boolean, fileId: string, name: string, isFinalVideo: true }>}
   */
  async saveFinalVideo(params = {}) {
    const { videoData, filename = 'exported_video.mp4', remoteFolderId } = params;
    if (!videoData) {
      throw new Error('MISSING_VIDEO_DATA: Cannot save video without binary payload');
    }

    const folderId = remoteFolderId || (await this.findOrCreateAppFolder());
    const buf = Buffer.isBuffer(videoData) ? videoData : Buffer.from(videoData);

    const resultFile = await this.createFile({
      name: filename,
      parents: [folderId],
      mimeType: DRIVE_CONSTANTS.MIME_MP4,
      content: buf
    });

    return {
      success: true,
      fileId: resultFile.id,
      name: filename,
      sizeBytes: buf.length,
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
    const parsed = JSON.parse(contentBuffer.toString('utf8'));
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
} else if (typeof window !== 'undefined') {
  window.DriveSyncAdapter = DriveSyncAdapter;
  window.DRIVE_CONSTANTS = DRIVE_CONSTANTS;
}
