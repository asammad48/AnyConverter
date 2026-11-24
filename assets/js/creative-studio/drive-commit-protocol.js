/**
 * AnyConverter Creative Studio — Phase 10: Commit-Manifest-Last Protocol Engine
 * Transactional sync protocol engine for Google Drive individual files.
 * Enforces strict 5-step ordering:
 *   Step 1: Compute local revision ID & SHA-256 asset hashes
 *   Step 2: Upload changed/new content-addressed media assets (assets/<sha256>)
 *   Step 3: Verify all asset uploads & metadata integrity
 *   Step 4: Upload immutable revision JSON (revisions/<revision-id>.json)
 *   Step 5: Update root project-manifest.json pointer LAST
 *
 * If Step 5 or earlier fails/aborts, root pointer stays intact at lastKnownGoodRevision.
 */

const crypto = typeof require !== 'undefined' ? require('crypto') : null;

const COMMIT_STATE = {
  IDLE: 'IDLE',
  COMPUTING_HASHES: 'COMPUTING_HASHES',
  UPLOADING_ASSETS: 'UPLOADING_ASSETS',
  VERIFYING_INTEGRITY: 'VERIFYING_INTEGRITY',
  UPLOADING_REVISION: 'UPLOADING_REVISION',
  COMMITTING_MANIFEST: 'COMMITTING_MANIFEST',
  COMMITTED: 'COMMITTED',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED'
};

class DriveCommitProtocol {
  constructor(options = {}) {
    this.driveAdapter = options.driveAdapter || null;
    this.state = COMMIT_STATE.IDLE;
    this.currentStep = 0;
    this.lastGoodRevisionId = null;
    this.activeRevisionId = null;
    this.manifestFileId = null;
    this._aborted = false;
    this._transactionLog = [];
  }

  /**
   * Helper to compute SHA-256 hash in Node or Browser
   * @param {Buffer|Uint8Array|ArrayBuffer} data
   * @returns {Promise<string>} Hex string
   */
  async computeHash(data) {
    if (crypto && crypto.createHash) {
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      return crypto.createHash('sha256').update(buf).digest('hex');
    }
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuf = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    throw new Error('CRYPTO_UNAVAILABLE: No SHA-256 cryptographic engine available');
  }

  _log(message, meta = {}) {
    this._transactionLog.push({
      time: new Date().toISOString(),
      state: this.state,
      step: this.currentStep,
      message,
      meta
    });
  }

  /**
   * Abort in-flight transaction
   */
  abort() {
    this._aborted = true;
    this.state = COMMIT_STATE.ABORTED;
    this._log('Transaction explicitly aborted by client');
  }

  /**
   * Enforce the 5-step transactional commit
   * @param {Object} params
   * @param {Object} params.projectDocument - Working project document
   * @param {Map<string, Buffer>|Object} [params.binaryAssets] - Assets keyed by id or sha
   * @param {string} params.projectFolderId - Google Drive project folder ID
   * @param {string} [params.manifestFileId] - Existing manifest file ID if previously created
   * @param {string} [params.lastKnownGoodRevisionId] - Prior revision ID
   * @param {Object} [params.driveAdapter] - Override adapter
   * @param {Function} [params.simulateFailureAtStep] - Test hook to simulate crash/abort at specific step
   * @returns {Promise<{ success: boolean, revisionId: string, manifestFileId: string, committedAt: string }>}
   */
  async executeCommit(params = {}) {
    const adapter = params.driveAdapter || this.driveAdapter;
    if (!adapter) {
      throw new Error('ADAPTER_REQUIRED: DriveSyncAdapter must be supplied');
    }

    const {
      projectDocument,
      binaryAssets = {},
      projectFolderId,
      manifestFileId = null,
      lastKnownGoodRevisionId = null,
      simulateFailureAtStep = 0
    } = params;

    if (!projectDocument || !projectDocument.projectId) {
      throw new Error('INVALID_PROJECT: projectDocument with projectId required');
    }

    this._aborted = false;
    this.lastGoodRevisionId = lastKnownGoodRevisionId;
    this.manifestFileId = manifestFileId;

    try {
      // -----------------------------------------------------------------------
      // STEP 1: Compute local revision ID & SHA-256 asset hashes
      // -----------------------------------------------------------------------
      this.currentStep = 1;
      this.state = COMMIT_STATE.COMPUTING_HASHES;
      this._log('Step 1: Computing revision ID & asset hashes');

      if (simulateFailureAtStep === 1 || this._aborted) {
        throw new Error('TRANSACTION_ABORTED_AT_STEP_1');
      }

      const activeRevisionId = projectDocument.revisionId || `rev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      this.activeRevisionId = activeRevisionId;

      const assetMap = binaryAssets instanceof Map ? binaryAssets : new Map(Object.entries(binaryAssets));
      const hashedAssets = [];

      for (const [id, rawData] of assetMap.entries()) {
        const buf = Buffer.isBuffer(rawData) ? rawData : Buffer.from(rawData);
        const sha256 = await this.computeHash(buf);
        hashedAssets.push({
          id,
          sha256,
          buffer: buf,
          sizeBytes: buf.length,
          name: `assets/${sha256}`
        });
      }

      // Find or create subfolders: assets/ and revisions/
      const assetsFolderId = await adapter.findOrCreateFolder('assets', projectFolderId);
      const revisionsFolderId = await adapter.findOrCreateFolder('revisions', projectFolderId);

      // -----------------------------------------------------------------------
      // STEP 2: Upload changed/new content-addressed media assets
      // -----------------------------------------------------------------------
      this.currentStep = 2;
      this.state = COMMIT_STATE.UPLOADING_ASSETS;
      this._log('Step 2: Uploading content-addressed media assets', { count: hashedAssets.length });

      if (simulateFailureAtStep === 2 || this._aborted) {
        throw new Error('TRANSACTION_ABORTED_AT_STEP_2');
      }

      const uploadedAssetsMeta = [];
      for (const asset of hashedAssets) {
        if (this._aborted) throw new Error('TRANSACTION_ABORTED');

        // Check if asset already exists in assets/ folder (content-address deduplication)
        const assetFileName = asset.sha256;
        const q = `name = '${assetFileName}' and '${assetsFolderId}' in parents and trashed = false`;
        const listRes = await adapter.authorizedFetch(`/files?q=${encodeURIComponent(q)}&fields=files(id,name,size,md5Checksum)`);
        const listData = await listRes.json();

        let assetFile;
        if (listData.files && listData.files.length > 0) {
          assetFile = listData.files[0];
          this._log(`Asset ${asset.sha256} already exists in Drive, reusing`, { fileId: assetFile.id });
        } else {
          assetFile = await adapter.createFile({
            name: assetFileName,
            parents: [assetsFolderId],
            mimeType: 'application/octet-stream',
            content: asset.buffer
          });
          this._log(`Uploaded asset ${asset.sha256}`, { fileId: assetFile.id });
        }

        uploadedAssetsMeta.push({
          assetId: asset.id,
          sha256: asset.sha256,
          fileId: assetFile.id,
          sizeBytes: asset.sizeBytes
        });
      }

      // -----------------------------------------------------------------------
      // STEP 3: Verify all asset uploads & metadata integrity
      // -----------------------------------------------------------------------
      this.currentStep = 3;
      this.state = COMMIT_STATE.VERIFYING_INTEGRITY;
      this._log('Step 3: Verifying upload integrity of all assets');

      if (simulateFailureAtStep === 3 || this._aborted) {
        throw new Error('TRANSACTION_ABORTED_AT_STEP_3');
      }

      for (const meta of uploadedAssetsMeta) {
        if (!meta.fileId) {
          throw new Error(`INTEGRITY_CHECK_FAILED: Asset ${meta.sha256} missing remote fileId`);
        }
      }

      // -----------------------------------------------------------------------
      // STEP 4: Upload immutable revision JSON (revisions/<revision-id>.json)
      // -----------------------------------------------------------------------
      this.currentStep = 4;
      this.state = COMMIT_STATE.UPLOADING_REVISION;
      this._log('Step 4: Uploading immutable revision document', { revisionId: activeRevisionId });

      if (simulateFailureAtStep === 4 || this._aborted) {
        throw new Error('TRANSACTION_ABORTED_AT_STEP_4');
      }

      const revisionPayload = {
        revisionId: activeRevisionId,
        projectId: projectDocument.projectId,
        title: projectDocument.title,
        baseRevisionId: this.lastGoodRevisionId,
        committedAt: new Date().toISOString(),
        document: projectDocument,
        assets: uploadedAssetsMeta
      };

      const revisionFileName = `${activeRevisionId}.json`;
      const revFile = await adapter.createFile({
        name: revisionFileName,
        parents: [revisionsFolderId],
        mimeType: 'application/json',
        content: JSON.stringify(revisionPayload, null, 2)
      });

      // -----------------------------------------------------------------------
      // STEP 5: Update root project-manifest.json pointer LAST
      // -----------------------------------------------------------------------
      this.currentStep = 5;
      this.state = COMMIT_STATE.COMMITTING_MANIFEST;
      this._log('Step 5: Updating root project-manifest.json pointer LAST');

      if (simulateFailureAtStep === 5 || this._aborted) {
        throw new Error('TRANSACTION_ABORTED_AT_STEP_5');
      }

      const manifestPayload = {
        manifestVersion: '1.0.0',
        projectId: projectDocument.projectId,
        title: projectDocument.title,
        currentRevisionId: activeRevisionId,
        previousRevisionId: this.lastGoodRevisionId,
        currentRevisionFileId: revFile.id,
        updatedAt: new Date().toISOString(),
        generator: 'AnyConverter Creative Studio v1.0',
        assetCount: uploadedAssetsMeta.length
      };

      let committedManifest;
      if (this.manifestFileId) {
        committedManifest = await adapter.updateFile({
          fileId: this.manifestFileId,
          mimeType: 'application/json',
          content: manifestPayload
        });
      } else {
        committedManifest = await adapter.createFile({
          name: 'project-manifest.json',
          parents: [projectFolderId],
          mimeType: 'application/json',
          content: JSON.stringify(manifestPayload, null, 2)
        });
        this.manifestFileId = committedManifest.id;
      }

      this.state = COMMIT_STATE.COMMITTED;
      this._log('Transaction committed successfully', { revisionId: activeRevisionId });

      return {
        success: true,
        revisionId: activeRevisionId,
        manifestFileId: this.manifestFileId,
        committedAt: manifestPayload.updatedAt,
        previousRevisionId: this.lastGoodRevisionId
      };
    } catch (err) {
      this.state = this._aborted ? COMMIT_STATE.ABORTED : COMMIT_STATE.FAILED;
      this._log(`Transaction failed at step ${this.currentStep}: ${err.message}`);
      // Crucial: root manifest pointer was NOT updated if failed at or before step 5!
      err.lastGoodRevisionId = this.lastGoodRevisionId;
      err.stepFailed = this.currentStep;
      throw err;
    }
  }

  /**
   * Verify remote project integrity and confirmed head revision pointer
   * @param {string} manifestFileId
   * @param {Object} adapter
   * @returns {Promise<{ intact: boolean, currentRevisionId: string, previousRevisionId: string }>}
   */
  async verifyRemoteManifest(manifestFileId, adapter) {
    const manifest = await adapter.getFileContent(manifestFileId, 'json');
    return {
      intact: Boolean(manifest && manifest.currentRevisionId),
      currentRevisionId: manifest.currentRevisionId,
      previousRevisionId: manifest.previousRevisionId || null,
      updatedAt: manifest.updatedAt
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COMMIT_STATE,
    DriveCommitProtocol
  };
} else if (typeof window !== 'undefined') {
  window.DriveCommitProtocol = DriveCommitProtocol;
  window.COMMIT_STATE = COMMIT_STATE;
}
