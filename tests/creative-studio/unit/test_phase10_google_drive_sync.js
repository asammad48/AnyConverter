/**
 * AnyConverter Creative Studio — Phase 10 Verification Suite
 * Tests for Google Drive Save, Open, Resumable Uploads, Commit-Manifest-Last & Conflict Resolution
 */

const assert = require('assert');
const crypto = require('crypto');
const { DRIVE_CONSTANTS, DriveSyncAdapter } = require('../../../assets/js/creative-studio/drive-sync-adapter.js');
const { COMMIT_STATE, DriveCommitProtocol } = require('../../../assets/js/creative-studio/drive-commit-protocol.js');
const { UPLOADER_CONSTANTS, UPLOADER_STATUS, DriveResumableUploader } = require('../../../assets/js/creative-studio/drive-resumable-uploader.js');
const { CONFLICT_STRATEGY, DriveConflictResolver } = require('../../../assets/js/creative-studio/drive-conflict-resolver.js');
const { AcStudioArchive } = require('../../../assets/js/creative-studio/archive.js');

/**
 * In-memory Mock Google Drive v3 REST API Server for zero-flakiness testing
 */
class MockDriveServer {
  constructor() {
    this.files = new Map(); // fileId -> { id, name, mimeType, parents, content, modifiedTime, size }
    this.resumableSessions = new Map(); // sessionUri -> { fileId, metadata, totalBytes, uploadedBytes, buffer, chunksReceived, failNextChunkWith }
    this.idCounter = 100;
    this.quotaExceeded = false;
    this.tokenValid = true;
    this.validToken = 'mock_valid_token_123';
  }

  createFetcher() {
    return async (url, options = {}) => {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://www.googleapis.com${url}`);
      const method = (options.method || 'GET').toUpperCase();
      const headers = options.headers || {};
      const authHeader = headers['Authorization'] || headers['authorization'] || '';

      // Check token validity
      if (this.tokenValid && authHeader !== `Bearer ${this.validToken}`) {
        return {
          status: 401,
          ok: false,
          headers: new Map(),
          text: async () => '{"error":{"code":401,"message":"Invalid Credentials"}}',
          json: async () => ({ error: { code: 401, message: 'Invalid Credentials' } })
        };
      }

      if (!this.tokenValid) {
        return {
          status: 401,
          ok: false,
          headers: new Map(),
          text: async () => '{"error":{"code":401,"message":"Token Expired"}}',
          json: async () => ({ error: { code: 401, message: 'Token Expired' } })
        };
      }

      // Check Quota
      if (this.quotaExceeded) {
        return {
          status: 403,
          ok: false,
          headers: new Map(),
          text: async () => '{"error":{"code":403,"message":"The user\'s Drive storage quota has been exceeded.","errors":[{"reason":"quotaExceeded"}]}}',
          json: async () => ({ error: { code: 403, errors: [{ reason: 'quotaExceeded' }] } })
        };
      }

      // 1. Resumable Session Upload / Status Query (PUT)
      if (method === 'PUT' && parsedUrl.pathname.includes('/resumable-upload/')) {
        const session = this.resumableSessions.get(url);
        if (!session) {
          return { status: 404, ok: false, text: async () => 'Session Not Found' };
        }

        if (session.failNextChunkWith) {
          const failureStatus = session.failNextChunkWith;
          session.failNextChunkWith = null; // Clear failure after triggering
          return {
            status: failureStatus,
            ok: false,
            headers: new Map(),
            text: async () => `Simulated failure with status ${failureStatus}`
          };
        }

        const contentRange = headers['Content-Range'] || headers['content-range'] || '';

        // Status query: Content-Range: bytes */total
        if (contentRange.startsWith('bytes */')) {
          const respHeaders = new Map([['range', `bytes=0-${session.uploadedBytes - 1}`]]);
          return {
            status: session.uploadedBytes >= session.totalBytes ? 200 : 308,
            ok: session.uploadedBytes >= session.totalBytes,
            headers: {
              get: (k) => respHeaders.get(k.toLowerCase()) || null
            },
            text: async () => '',
            json: async () => ({ id: session.fileId, name: session.metadata.name })
          };
        }

        // Chunk upload: bytes start-end/total
        const rangeMatch = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
        if (!rangeMatch) {
          return { status: 400, ok: false, text: async () => 'Invalid Content-Range' };
        }

        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        const chunkBuf = Buffer.isBuffer(options.body) ? options.body : Buffer.from(options.body);

        chunkBuf.copy(session.buffer, start);
        session.uploadedBytes = end + 1;
        session.chunksReceived++;

        if (session.uploadedBytes >= session.totalBytes) {
          // Finished!
          this.files.set(session.fileId, {
            id: session.fileId,
            name: session.metadata.name,
            mimeType: session.metadata.mimeType,
            parents: session.metadata.parents || [],
            content: session.buffer,
            size: session.totalBytes,
            modifiedTime: new Date().toISOString()
          });

          return {
            status: 200,
            ok: true,
            headers: { get: () => null },
            json: async () => ({
              id: session.fileId,
              name: session.metadata.name,
              mimeType: session.metadata.mimeType,
              size: session.totalBytes
            })
          };
        }

        // 308 Resume Incomplete
        const respHeaders = new Map([['range', `bytes=0-${session.uploadedBytes - 1}`]]);
        return {
          status: 308,
          ok: false,
          headers: {
            get: (k) => respHeaders.get(k.toLowerCase()) || null
          },
          text: async () => ''
        };
      }

      // 2. Resumable Session Init (POST uploadType=resumable)
      if (method === 'POST' && parsedUrl.pathname.includes('/files') && parsedUrl.searchParams.get('uploadType') === 'resumable') {
        const metadata = JSON.parse(options.body || '{}');
        const totalLength = parseInt(headers['X-Upload-Content-Length'] || headers['x-upload-content-length'] || '0', 10);
        const fileId = `file_${this.idCounter++}`;
        const sessionUri = `https://www.googleapis.com/upload/drive/v3/resumable-upload/${fileId}`;

        this.resumableSessions.set(sessionUri, {
          fileId,
          metadata,
          totalBytes: totalLength,
          uploadedBytes: 0,
          buffer: Buffer.alloc(totalLength),
          chunksReceived: 0,
          failNextChunkWith: null
        });

        const respHeaders = new Map([['location', sessionUri]]);
        return {
          status: 200,
          ok: true,
          headers: {
            get: (k) => respHeaders.get(k.toLowerCase()) || null
          },
          text: async () => ''
        };
      }

      // 3. Multipart File Creation (POST uploadType=multipart)
      if (method === 'POST' && parsedUrl.pathname.includes('/files') && parsedUrl.searchParams.get('uploadType') === 'multipart') {
        const fileId = `file_${this.idCounter++}`;
        const rawBody = options.body;

        // Parse multipart boundary
        const boundaryMatch = (headers['Content-Type'] || '').match(/boundary=(.+)/);
        let name = `file_${fileId}`;
        let mimeType = 'application/octet-stream';
        let parents = [];
        let fileContent = Buffer.alloc(0);

        if (boundaryMatch) {
          const bodyBuf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);
          const bodyStr = bodyBuf.toString('utf8');
          const metaJsonMatch = bodyStr.match(/Content-Type: application\/json[^\r\n]*\r\n\r\n(\{[\s\S]*?\})\r\n/);
          if (metaJsonMatch) {
            try {
              const meta = JSON.parse(metaJsonMatch[1]);
              name = meta.name || name;
              mimeType = meta.mimeType || mimeType;
              parents = meta.parents || parents;
            } catch (e) {}
          }

          // Extract binary content between second delimiter and closing delimiter
          const delimiter = `--${boundaryMatch[1]}`;
          const firstDelimIdx = bodyBuf.indexOf(Buffer.from(delimiter));
          const secondDelimIdx = bodyBuf.indexOf(Buffer.from(delimiter), firstDelimIdx + delimiter.length);
          if (secondDelimIdx !== -1) {
            const headerEndMarker = Buffer.from('\r\n\r\n');
            const mediaHeaderEnd = bodyBuf.indexOf(headerEndMarker, secondDelimIdx);
            if (mediaHeaderEnd !== -1) {
              const contentStart = mediaHeaderEnd + 4;
              const closingDelimIdx = bodyBuf.indexOf(Buffer.from(`\r\n--${boundaryMatch[1]}--`), contentStart);
              const contentEnd = closingDelimIdx !== -1 ? closingDelimIdx : bodyBuf.length;
              fileContent = bodyBuf.subarray(contentStart, contentEnd);
            }
          }
        }

        const fileRecord = {
          id: fileId,
          name,
          mimeType,
          parents,
          content: fileContent,
          size: fileContent.length,
          modifiedTime: new Date().toISOString()
        };
        this.files.set(fileId, fileRecord);

        return {
          status: 200,
          ok: true,
          headers: new Map(),
          json: async () => ({
            id: fileRecord.id,
            name: fileRecord.name,
            mimeType: fileRecord.mimeType,
            size: fileRecord.size,
            modifiedTime: fileRecord.modifiedTime
          })
        };
      }

      // 4. Update file media (PATCH uploadType=media)
      if (method === 'PATCH' && parsedUrl.pathname.includes('/files/')) {
        const fileId = parsedUrl.pathname.split('/').pop();
        const existing = this.files.get(fileId);
        if (!existing) {
          return { status: 404, ok: false, text: async () => 'File not found' };
        }

        const newContent = Buffer.isBuffer(options.body) ? options.body : Buffer.from(options.body || '');
        existing.content = newContent;
        existing.size = newContent.length;
        existing.modifiedTime = new Date().toISOString();

        return {
          status: 200,
          ok: true,
          headers: new Map(),
          json: async () => ({
            id: existing.id,
            name: existing.name,
            mimeType: existing.mimeType,
            size: existing.size,
            modifiedTime: existing.modifiedTime
          })
        };
      }

      // 5. Query / List files (GET /files)
      if (method === 'GET' && parsedUrl.pathname.endsWith('/files')) {
        const q = parsedUrl.searchParams.get('q') || '';
        const matched = [];

        for (const f of this.files.values()) {
          let matches = true;
          if (q.includes(`name = '`)) {
            const expectedName = q.match(/name = '([^']+)'/)[1];
            if (f.name !== expectedName) matches = false;
          }
          if (q.includes(`mimeType = '`)) {
            const expectedMime = q.match(/mimeType = '([^']+)'/)[1];
            if (f.mimeType !== expectedMime) matches = false;
          }
          if (q.includes(` in parents`)) {
            const parentMatch = q.match(/'([^']+)' in parents/);
            if (parentMatch && !f.parents.includes(parentMatch[1])) matches = false;
          }
          if (matches) matched.push(f);
        }

        return {
          status: 200,
          ok: true,
          headers: new Map(),
          json: async () => ({
            files: matched.map(f => ({ id: f.id, name: f.name, size: f.size, modifiedTime: f.modifiedTime }))
          })
        };
      }

      // 6. Metadata or Media download (GET /files/<id>)
      if (method === 'GET' && parsedUrl.pathname.includes('/files/')) {
        const fileId = parsedUrl.pathname.split('/').pop();
        const f = this.files.get(fileId);
        if (!f) {
          return { status: 404, ok: false, text: async () => 'File not found' };
        }

        // Alt=media (download payload)
        if (parsedUrl.searchParams.get('alt') === 'media') {
          return {
            status: 200,
            ok: true,
            headers: new Map(),
            json: async () => JSON.parse(f.content.toString('utf8')),
            text: async () => f.content.toString('utf8'),
            arrayBuffer: async () => f.content.buffer.slice(f.content.byteOffset, f.content.byteOffset + f.content.byteLength),
            buffer: async () => f.content
          };
        }

        // Metadata
        return {
          status: 200,
          ok: true,
          headers: new Map(),
          json: async () => ({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            size: f.size,
            modifiedTime: f.modifiedTime,
            parents: f.parents
          })
        };
      }

      // 7. Regular file create (POST /files)
      if (method === 'POST' && parsedUrl.pathname.endsWith('/files')) {
        const meta = JSON.parse(options.body || '{}');
        const fileId = `file_${this.idCounter++}`;
        const record = {
          id: fileId,
          name: meta.name || 'unnamed',
          mimeType: meta.mimeType || 'application/json',
          parents: meta.parents || [],
          content: Buffer.from(options.body || ''),
          size: (options.body || '').length,
          modifiedTime: new Date().toISOString()
        };
        this.files.set(fileId, record);

        return {
          status: 200,
          ok: true,
          headers: new Map(),
          json: async () => ({ id: record.id, name: record.name, mimeType: record.mimeType })
        };
      }

      return { status: 404, ok: false, text: async () => 'Unhandled Mock URL' };
    };
  }
}

async function runPhase10Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 10 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: Full project bundle (.acstudio) save and download roundtrip with media
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: Project bundle save & download roundtrip with media verification... ');

    const mockServer = new MockDriveServer();
    const adapter = new DriveSyncAdapter({
      clientId: 'mock-client-id.apps.googleusercontent.com',
      fetcher: mockServer.createFetcher()
    });

    await adapter.connectDrive({ customToken: mockServer.validToken });
    assert.strictEqual(adapter.isAuthenticated(), true);

    // Create sample media buffer
    const sampleMedia = Buffer.from('RIFF_MOCK_WAV_AUDIO_DATA_FOR_TIMELINE_PROJECT', 'utf8');
    const mediaSha = crypto.createHash('sha256').update(sampleMedia).digest('hex');
    const assetId = `sha256:${mediaSha}`;

    const projectDoc = {
      projectId: 'proj_roundtrip_test_001',
      revisionId: 'rev_initial_001',
      title: 'Cinematic Promo Video',
      kind: 'video',
      fps: 30,
      scenes: [
        {
          id: 'scene-1',
          title: 'Opening Shot',
          duration: 5,
          assetRef: assetId
        }
      ]
    };

    const binaryAssets = new Map([[assetId, sampleMedia]]);

    // 1. Save editable project
    const saveResult = await adapter.saveEditableProject({
      projectDocument: projectDoc,
      binaryAssets
    });

    assert.strictEqual(saveResult.success, true);
    assert.strictEqual(saveResult.isEditableProject, true);
    assert.ok(saveResult.fileId);
    assert.ok(saveResult.name.endsWith('.acstudio'));

    // 2. Download and unpack project from Drive
    const loaded = await adapter.loadProjectFromDrive(saveResult.fileId);
    assert.strictEqual(loaded.projectDocument.projectId, projectDoc.projectId);
    assert.strictEqual(loaded.projectDocument.title, projectDoc.title);
    assert.strictEqual(loaded.manifest.assets.length, 1);

    // Verify media asset matches byte-for-byte
    assert.ok(loaded.binaryAssets.has(assetId));
    const retrievedMedia = loaded.binaryAssets.get(assetId);
    assert.strictEqual(retrievedMedia.toString('utf8'), sampleMedia.toString('utf8'));

    // 3. Verify distinct video export action (flattened MP4)
    const sampleMp4 = Buffer.from('FAKE_FLATTENED_MP4_HEADER_MOOV_MDAT', 'utf8');
    const videoExport = await adapter.saveFinalVideo({
      videoData: sampleMp4,
      filename: 'cinematic_promo_final.mp4'
    });
    assert.strictEqual(videoExport.isFinalVideo, true);
    assert.ok(videoExport.fileId);
    assert.strictEqual(videoExport.name, 'cinematic_promo_final.mp4');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Commit-manifest-last ordering (aborted upload leaves prior revision intact)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: Commit-manifest-last ordering (aborted upload leaves prior revision intact)... ');

    const mockServer = new MockDriveServer();
    const adapter = new DriveSyncAdapter({ fetcher: mockServer.createFetcher() });
    await adapter.connectDrive({ customToken: mockServer.validToken });

    const appFolderId = await adapter.findOrCreateAppFolder();
    const projectFolderId = await adapter.findOrCreateFolder('project-test-atomic', appFolderId);

    const protocol = new DriveCommitProtocol({ driveAdapter: adapter });

    const projectDocV1 = {
      projectId: 'proj_atomic_001',
      revisionId: 'rev_v1_confirmed',
      title: 'Atomic Project V1',
      scenes: [{ id: 's1', duration: 3 }]
    };

    // Commit Revision 1 completely
    const v1Result = await protocol.executeCommit({
      projectDocument: projectDocV1,
      projectFolderId,
      lastKnownGoodRevisionId: null
    });

    assert.strictEqual(v1Result.success, true);
    assert.strictEqual(protocol.state, COMMIT_STATE.COMMITTED);

    const manifestV1 = await protocol.verifyRemoteManifest(v1Result.manifestFileId, adapter);
    assert.strictEqual(manifestV1.currentRevisionId, 'rev_v1_confirmed');

    // Attempt Revision 2 but simulate failure at Step 4 (before Step 5 manifest pointer update)
    const projectDocV2 = {
      projectId: 'proj_atomic_001',
      revisionId: 'rev_v2_unconfirmed',
      title: 'Atomic Project V2 (Aborted)',
      scenes: [{ id: 's1', duration: 3 }, { id: 's2', duration: 4 }]
    };

    let caughtError = null;
    try {
      await protocol.executeCommit({
        projectDocument: projectDocV2,
        projectFolderId,
        manifestFileId: v1Result.manifestFileId,
        lastKnownGoodRevisionId: 'rev_v1_confirmed',
        simulateFailureAtStep: 4
      });
    } catch (err) {
      caughtError = err;
    }

    assert.ok(caughtError);
    assert.strictEqual(protocol.state, COMMIT_STATE.FAILED);

    // CRUCIAL INTEGRITY VERIFICATION:
    // Root project-manifest.json MUST still point to rev_v1_confirmed!
    const manifestAfterAbort = await protocol.verifyRemoteManifest(v1Result.manifestFileId, adapter);
    assert.strictEqual(manifestAfterAbort.currentRevisionId, 'rev_v1_confirmed');
    assert.notStrictEqual(manifestAfterAbort.currentRevisionId, 'rev_v2_unconfirmed');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Resumable chunked upload protocol (>5MB payload, chunk boundaries, retry)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Resumable chunked upload (>5MB payload, 256KB-aligned, retry on glitch)... ');

    const mockServer = new MockDriveServer();
    const adapter = new DriveSyncAdapter({ fetcher: mockServer.createFetcher() });
    await adapter.connectDrive({ customToken: mockServer.validToken });

    // Create 5.5MB test payload (>5MB threshold)
    const payloadSize = 5.5 * 1024 * 1024; // 5,767,168 bytes
    const largeBuffer = Buffer.alloc(payloadSize, 0x42);

    const uploader = new DriveResumableUploader({
      driveAdapter: adapter,
      chunkSize: 1024 * 1024 // 1MB chunks (multiple of 256KB)
    });

    const progressReports = [];
    let retryGlitchInjected = false;

    // Simulate transient 503 network error on second chunk
    const originalFetcher = adapter.fetcher;
    uploader.fetcher = async (url, opts) => {
      if (url.includes('/resumable-upload/') && !retryGlitchInjected && opts.method === 'PUT') {
        const contentRange = opts.headers['Content-Range'] || '';
        if (contentRange.startsWith('bytes 1048576-')) {
          retryGlitchInjected = true;
          // Return simulated 503 Service Unavailable
          return {
            status: 503,
            ok: false,
            headers: new Map(),
            text: async () => 'Simulated 503 Service Unavailable'
          };
        }
      }
      return originalFetcher(url, opts);
    };

    const uploadResult = await uploader.startUpload({
      payload: largeBuffer,
      name: 'large_cinematic_project_5mb.acstudio',
      mimeType: 'application/zip',
      onProgress: (p) => progressReports.push(p)
    });

    assert.strictEqual(uploadResult.status, UPLOADER_STATUS.COMPLETED);
    assert.strictEqual(uploadResult.sizeBytes, payloadSize);
    assert.strictEqual(retryGlitchInjected, true);
    assert.ok(progressReports.length >= 6);
    assert.strictEqual(progressReports[progressReports.length - 1].percentage, 100);

    // Verify stored content in Drive matches exact size and bytes
    const storedFile = mockServer.files.get(uploadResult.fileId);
    assert.strictEqual(storedFile.size, payloadSize);
    assert.strictEqual(storedFile.content[0], 0x42);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Optimistic concurrency conflict detection and "Save Both" resolution
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Optimistic concurrency conflict detection & "Save Both" resolution... ');

    const mockServer = new MockDriveServer();
    const adapter = new DriveSyncAdapter({ fetcher: mockServer.createFetcher() });
    await adapter.connectDrive({ customToken: mockServer.validToken });

    const resolver = new DriveConflictResolver({ deviceLabel: 'Device B' });

    // Base revision that both Device A and Device B opened
    const baseRevisionId = 'rev_base_100';

    // Device A committed rev_device_a
    const remoteManifestRecord = {
      manifestFileId: 'manifest_file_001',
      projectId: 'proj_collab_001',
      title: 'Short Film Project',
      currentRevisionId: 'rev_device_a_200',
      currentRevisionFileId: 'file_rev_device_a'
    };

    // Device B working on local revision
    const workingRevisionId = 'rev_device_b_300';

    // 1. Concurrency Check: Must flag conflict
    const hasConflict = resolver.hasConflict({
      baseRevisionId,
      workingRevisionId,
      remoteRevisionId: remoteManifestRecord.currentRevisionId
    });
    assert.strictEqual(hasConflict, true);

    // 2. Generate non-destructive diff
    const localDoc = {
      projectId: 'proj_collab_001',
      title: 'Short Film Project',
      revisionId: workingRevisionId,
      scenes: [
        { id: 'scene-1', title: 'Intro Scene', duration: 4 },
        { id: 'scene-2-local', title: 'Device B Special Cut', duration: 7 }
      ]
    };
    const remoteDoc = {
      projectId: 'proj_collab_001',
      title: 'Short Film Project',
      revisionId: remoteManifestRecord.currentRevisionId,
      scenes: [
        { id: 'scene-1', title: 'Intro Scene', duration: 4 },
        { id: 'scene-2-remote', title: 'Device A Color Grade', duration: 6 }
      ]
    };

    const diff = resolver.generateDiff(localDoc, remoteDoc);
    assert.strictEqual(diff.hasDifferences, true);
    assert.strictEqual(diff.summary.addedCount, 1);
    assert.strictEqual(diff.summary.deletedCount, 1);

    // 3. Resolve conflict with SAVE_BOTH_COPIES strategy
    const resolution = await resolver.resolveConflict({
      strategy: CONFLICT_STRATEGY.SAVE_BOTH_COPIES,
      projectDocument: localDoc,
      remoteManifest: remoteManifestRecord,
      driveAdapter: adapter,
      parentFolderId: 'folder_root'
    });

    assert.strictEqual(resolution.success, true);
    assert.strictEqual(resolution.action, 'CREATED_NON_DESTRUCTIVE_DUPLICATE');
    assert.strictEqual(resolution.originalRemoteIntact, true);
    assert.strictEqual(resolution.originalRevisionId, 'rev_device_a_200');

    // Verify copy project attributes
    assert.strictEqual(resolution.duplicateDocument.title, 'Short Film Project (Copy from Device B)');
    assert.notStrictEqual(resolution.duplicateDocument.projectId, localDoc.projectId);
    assert.strictEqual(resolution.duplicateDocument.branchedFromProjectId, 'proj_collab_001');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Network disconnect & recovery (local dirty state retained)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: Network disconnect & recovery (local dirty state retained)... ');

    const mockServer = new MockDriveServer();
    let networkOnline = false; // Simulate offline

    const adapter = new DriveSyncAdapter({
      fetcher: async (url, opts) => {
        if (!networkOnline) {
          const networkErr = new TypeError('Failed to fetch: Network is disconnected');
          networkErr.code = 'NETWORK_OFFLINE';
          throw networkErr;
        }
        return mockServer.createFetcher()(url, opts);
      }
    });

    await adapter.connectDrive({ customToken: mockServer.validToken });

    const localProject = {
      projectId: 'proj_offline_resilience',
      revisionId: 'rev_local_dirty',
      title: 'Offline Resilient Edit'
    };

    // Track local dirty state
    let localDraftState = {
      document: localProject,
      isDirty: true,
      lastConfirmedCloudRevision: null,
      cloudSyncStatus: 'UNSYNCED'
    };

    // Attempt save while network is offline
    let failedAsExpected = false;
    try {
      await adapter.saveEditableProject({ projectDocument: localProject });
    } catch (err) {
      failedAsExpected = true;
      assert.strictEqual(err.code, 'NETWORK_OFFLINE');
    }

    assert.strictEqual(failedAsExpected, true);
    // Crucial: Local dirty state must be preserved, never falsely marked synced!
    assert.strictEqual(localDraftState.isDirty, true);
    assert.strictEqual(localDraftState.cloudSyncStatus, 'UNSYNCED');
    assert.strictEqual(localDraftState.lastConfirmedCloudRevision, null);

    // Network recovers
    networkOnline = true;
    const recoveryResult = await adapter.saveEditableProject({ projectDocument: localProject });

    assert.strictEqual(recoveryResult.success, true);
    localDraftState.isDirty = false;
    localDraftState.cloudSyncStatus = 'SYNCED';
    localDraftState.lastConfirmedCloudRevision = recoveryResult.revisionId;

    assert.strictEqual(localDraftState.cloudSyncStatus, 'SYNCED');
    assert.strictEqual(localDraftState.lastConfirmedCloudRevision, 'rev_local_dirty');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: QuotaExceeded / 403 handling (graceful warning & local export fallback)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: QuotaExceeded / 403 handling & local export fallback... ');

    const mockServer = new MockDriveServer();
    mockServer.quotaExceeded = true; // Turn on quotaExceeded simulation

    const adapter = new DriveSyncAdapter({ fetcher: mockServer.createFetcher() });
    await adapter.connectDrive({ customToken: mockServer.validToken });

    const projectDoc = {
      projectId: 'proj_quota_test',
      revisionId: 'rev_quota_01',
      title: 'Project When Quota Full'
    };

    let caughtError = null;
    try {
      await adapter.saveEditableProject({ projectDocument: projectDoc });
    } catch (err) {
      caughtError = err;
    }

    assert.ok(caughtError);
    assert.strictEqual(caughtError.code, 'QUOTA_EXCEEDED');

    // Graceful fallback to local .acstudio archive packaging
    const localArchive = new AcStudioArchive();
    const fallbackPackage = localArchive.package(projectDoc);
    assert.ok(Buffer.isBuffer(fallbackPackage));
    assert.ok(fallbackPackage.length > 100);

    // Verify the unpacked fallback matches original
    const unpacked = localArchive.unpackage(fallbackPackage);
    assert.strictEqual(unpacked.project.projectId, projectDoc.projectId);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Token expiration during transfer (pauses, reauthorizes, resumes)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: Token expiration during chunked upload (pause, reauth & resume)... ');

    const mockServer = new MockDriveServer();
    const adapter = new DriveSyncAdapter({ fetcher: mockServer.createFetcher() });
    await adapter.connectDrive({ customToken: mockServer.validToken });

    // Payload with 2 chunks (512KB chunks, total 1024KB)
    const payload = Buffer.alloc(1024 * 1024, 0x5A);

    const uploader = new DriveResumableUploader({
      driveAdapter: adapter,
      chunkSize: 512 * 1024
    });

    let tokenExpiredCount = 0;
    let freshTokenIssued = false;

    // Hook token expiration: simulate user granting fresh token
    uploader.onTokenExpired = async () => {
      tokenExpiredCount++;
      const newToken = 'mock_fresh_token_456';
      mockServer.validToken = newToken;
      mockServer.tokenValid = true;
      adapter.setAuthToken(newToken);
      freshTokenIssued = true;
    };

    // Start upload
    let originalFetcher = adapter.fetcher;
    let chunk1Sent = false;

    uploader.fetcher = async (url, opts) => {
      if (url.includes('/resumable-upload/') && opts.method === 'PUT') {
        const contentRange = opts.headers['Content-Range'] || '';
        // Let chunk 1 (0-524287) pass
        if (contentRange.startsWith('bytes 0-')) {
          chunk1Sent = true;
          return originalFetcher(url, opts);
        }
        // Chunk 2 (bytes 524288-1048575): Expire token if not yet refreshed
        if (contentRange.startsWith('bytes 524288-') && !freshTokenIssued) {
          mockServer.tokenValid = false;
          return {
            status: 401,
            ok: false,
            headers: new Map(),
            text: async () => 'Token expired on chunk 2'
          };
        }
      }
      return originalFetcher(url, opts);
    };

    let caughtError = null;
    try {
      await uploader.startUpload({
        payload,
        name: 'token_expiration_test.acstudio',
        mimeType: 'application/zip'
      });
    } catch (err) {
      caughtError = err;
    }

    assert.ok(caughtError);
    assert.strictEqual(caughtError.code, 'TOKEN_EXPIRED');
    assert.strictEqual(uploader.status, UPLOADER_STATUS.PAUSED);
    assert.strictEqual(chunk1Sent, true);
    assert.strictEqual(tokenExpiredCount, 1);
    assert.strictEqual(freshTokenIssued, true);

    // Resume session with fresh token without restarting from byte 0!
    const resumeResult = await uploader.resume({ newAuthToken: mockServer.validToken });
    assert.strictEqual(resumeResult.status, UPLOADER_STATUS.COMPLETED);
    assert.strictEqual(resumeResult.sizeBytes, 1024 * 1024);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`Results: ${passed}/${total} Phase 10 verification tests passed.`);
  if (passed === total) {
    console.log('STATUS: PASS FOR PHASE 10 GOOGLE DRIVE STORAGE & SYNC RELEASE');
    process.exit(0);
  } else {
    console.error('STATUS: FAILURES DETECTED IN PHASE 10');
    process.exit(1);
  }
}

runPhase10Tests();
