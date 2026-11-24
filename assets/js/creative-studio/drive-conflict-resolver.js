/**
 * AnyConverter Creative Studio — Phase 10: Optimistic Concurrency & Conflict Resolver
 * Tracks baseRevision, workingRevision, and remoteRevision.
 * Prevents silent overwriting when concurrent devices edit the same project.
 * Supports strategies:
 *   1. OPEN_REMOTE (discard local, restore remote)
 *   2. KEEP_LOCAL_AS_NEW_REVISION (overwrite remote with working revision)
 *   3. SAVE_BOTH_COPIES (create non-destructive duplicate "${title} (Copy from Device B)")
 * Provides non-destructive scene/asset diff generator.
 */

const crypto = typeof require !== 'undefined' ? require('crypto') : null;

const CONFLICT_STRATEGY = {
  OPEN_REMOTE: 'OPEN_REMOTE',
  KEEP_LOCAL_AS_NEW_REVISION: 'KEEP_LOCAL_AS_NEW_REVISION',
  SAVE_BOTH_COPIES: 'SAVE_BOTH_COPIES'
};

class DriveConflictResolver {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    this.deviceLabel = options.deviceLabel || 'Device B';
  }

  /**
   * Detect whether a conflict exists between base, working, and remote revisions
   * @param {Object} params
   * @param {string} params.baseRevisionId - Revision when editing session started
   * @param {string} params.workingRevisionId - Current local working revision
   * @param {string} params.remoteRevisionId - Confirmed latest revision on Google Drive
   * @returns {boolean}
   */
  hasConflict(params = {}) {
    const { baseRevisionId, workingRevisionId, remoteRevisionId } = params;
    if (!remoteRevisionId) {
      return false; // Remote project is brand new
    }
    if (!baseRevisionId) {
      // Local started with no base but remote exists -> conflict
      return true;
    }
    // If remote has progressed beyond what local started from, and local is not already equal to remote
    return remoteRevisionId !== baseRevisionId && remoteRevisionId !== workingRevisionId;
  }

  /**
   * Inspect remote manifest on Google Drive to detect concurrency state
   * @param {Object} params
   * @param {Object} params.driveAdapter
   * @param {string} params.manifestFileId
   * @param {string} params.baseRevisionId
   * @returns {Promise<{ hasConflict: boolean, baseRevisionId: string, remoteRevisionId: string, remoteManifest: Object }>}
   */
  async checkConcurrency(params = {}) {
    const { driveAdapter, manifestFileId, baseRevisionId } = params;
    if (!driveAdapter || !manifestFileId) {
      return { hasConflict: false, baseRevisionId, remoteRevisionId: null, remoteManifest: null };
    }

    const remoteManifest = await driveAdapter.getFileContent(manifestFileId, 'json');
    const remoteRevisionId = remoteManifest ? remoteManifest.currentRevisionId : null;
    const isConflicted = this.hasConflict({
      baseRevisionId,
      workingRevisionId: null,
      remoteRevisionId
    });

    return {
      hasConflict: isConflicted,
      baseRevisionId,
      remoteRevisionId,
      remoteManifest
    };
  }

  /**
   * Generate a non-destructive scene and asset diff between local and remote documents
   * @param {Object} localDocument
   * @param {Object} remoteDocument
   * @returns {Object} Diff report
   */
  generateDiff(localDocument, remoteDocument) {
    const localScenes = (localDocument && localDocument.scenes) || [];
    const remoteScenes = (remoteDocument && remoteDocument.scenes) || [];

    const localSceneMap = new Map(localScenes.map(s => [s.sceneId || s.id, s]));
    const remoteSceneMap = new Map(remoteScenes.map(s => [s.sceneId || s.id, s]));

    const addedScenes = [];
    const modifiedScenes = [];
    const deletedScenes = [];

    // Find added or modified scenes in local
    for (const [id, localScene] of localSceneMap.entries()) {
      if (!remoteSceneMap.has(id)) {
        addedScenes.push({ sceneId: id, title: localScene.title || id });
      } else {
        const remoteScene = remoteSceneMap.get(id);
        const localHash = JSON.stringify(localScene);
        const remoteHash = JSON.stringify(remoteScene);
        if (localHash !== remoteHash) {
          modifiedScenes.push({
            sceneId: id,
            title: localScene.title || id,
            localDuration: localScene.duration,
            remoteDuration: remoteScene.duration
          });
        }
      }
    }

    // Find deleted scenes (in remote but not in local)
    for (const [id, remoteScene] of remoteSceneMap.entries()) {
      if (!localSceneMap.has(id)) {
        deletedScenes.push({ sceneId: id, title: remoteScene.title || id });
      }
    }

    return {
      hasDifferences: (addedScenes.length > 0 || modifiedScenes.length > 0 || deletedScenes.length > 0),
      summary: {
        addedCount: addedScenes.length,
        modifiedCount: modifiedScenes.length,
        deletedCount: deletedScenes.length
      },
      addedScenes,
      modifiedScenes,
      deletedScenes,
      localRevisionId: localDocument ? localDocument.revisionId : null,
      remoteRevisionId: remoteDocument ? remoteDocument.revisionId : null
    };
  }

  /**
   * Resolve conflict according to selected strategy
   * @param {Object} params
   * @param {string} params.strategy - One of CONFLICT_STRATEGY
   * @param {Object} params.projectDocument - Working project document
   * @param {Map<string, Buffer>|Object} [params.binaryAssets]
   * @param {Object} params.remoteManifest - Current remote manifest on Drive
   * @param {Object} params.driveAdapter
   * @param {string} params.parentFolderId
   * @param {string} [params.deviceLabel] - Suffix for "Save Both"
   * @param {Object} [params.commitEngine] - Optional DriveCommitProtocol instance
   * @returns {Promise<Object>} Resolution outcome
   */
  async resolveConflict(params = {}) {
    const {
      strategy,
      projectDocument,
      binaryAssets = {},
      remoteManifest,
      driveAdapter,
      parentFolderId,
      deviceLabel = this.deviceLabel,
      commitEngine = null
    } = params;

    if (!driveAdapter) {
      throw new Error('ADAPTER_REQUIRED: driveAdapter required for conflict resolution');
    }

    switch (strategy) {
      // -----------------------------------------------------------------------
      // STRATEGY 1: OPEN_REMOTE (Discard local, download remote head revision)
      // -----------------------------------------------------------------------
      case CONFLICT_STRATEGY.OPEN_REMOTE: {
        if (!remoteManifest || !remoteManifest.currentRevisionFileId) {
          throw new Error('CANNOT_OPEN_REMOTE: Remote manifest missing currentRevisionFileId');
        }
        const remoteRevPayload = await driveAdapter.getFileContent(remoteManifest.currentRevisionFileId, 'json');
        return {
          strategy: CONFLICT_STRATEGY.OPEN_REMOTE,
          success: true,
          action: 'LOADED_REMOTE_REVISION',
          activeDocument: remoteRevPayload.document,
          revisionId: remoteRevPayload.revisionId,
          message: 'Local draft discarded. Active project updated to latest Google Drive revision.'
        };
      }

      // -----------------------------------------------------------------------
      // STRATEGY 2: KEEP_LOCAL_AS_NEW_REVISION (Force commit local over remote)
      // -----------------------------------------------------------------------
      case CONFLICT_STRATEGY.KEEP_LOCAL_AS_NEW_REVISION: {
        // Enforce commit with remote head as baseRevision
        const newRevId = `rev_${Date.now()}_local_override`;
        const updatedDoc = Object.assign({}, projectDocument, {
          revisionId: newRevId,
          baseRevisionId: remoteManifest ? remoteManifest.currentRevisionId : null
        });

        if (commitEngine) {
          const commitResult = await commitEngine.executeCommit({
            projectDocument: updatedDoc,
            binaryAssets,
            projectFolderId: parentFolderId,
            manifestFileId: remoteManifest ? remoteManifest.manifestFileId : null,
            lastKnownGoodRevisionId: remoteManifest ? remoteManifest.currentRevisionId : null,
            driveAdapter
          });
          return {
            strategy: CONFLICT_STRATEGY.KEEP_LOCAL_AS_NEW_REVISION,
            success: true,
            action: 'OVERWROTE_REMOTE_WITH_NEW_REVISION',
            activeDocument: updatedDoc,
            revisionId: commitResult.revisionId,
            commitResult
          };
        }

        // Bundle save
        const saveRes = await driveAdapter.saveEditableProject({
          projectDocument: updatedDoc,
          binaryAssets,
          remoteFolderId: parentFolderId
        });
        return {
          strategy: CONFLICT_STRATEGY.KEEP_LOCAL_AS_NEW_REVISION,
          success: true,
          action: 'OVERWROTE_REMOTE_WITH_NEW_REVISION',
          activeDocument: updatedDoc,
          revisionId: newRevId,
          saveRes
        };
      }

      // -----------------------------------------------------------------------
      // STRATEGY 3: SAVE_BOTH_COPIES (Non-destructive duplicate)
      // -----------------------------------------------------------------------
      case CONFLICT_STRATEGY.SAVE_BOTH_COPIES: {
        const originalTitle = projectDocument.title || 'Untitled Project';
        const duplicateTitle = `${originalTitle} (Copy from ${deviceLabel})`;
        const duplicateProjectId = (crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const duplicateRevisionId = `rev_${Date.now()}_copy`;

        const duplicateDocument = Object.assign({}, projectDocument, {
          projectId: duplicateProjectId,
          title: duplicateTitle,
          revisionId: duplicateRevisionId,
          baseRevisionId: remoteManifest ? remoteManifest.currentRevisionId : null,
          branchedFromProjectId: projectDocument.projectId,
          branchedAt: new Date().toISOString()
        });

        // 1. Remote original remains completely untouched!
        // 2. Create brand new project folder/bundle for the copy
        const appFolderId = await driveAdapter.findOrCreateAppFolder();
        const copyFolderId = await driveAdapter.findOrCreateFolder(`project-${duplicateProjectId}`, appFolderId);

        let copyResult;
        if (commitEngine) {
          copyResult = await commitEngine.executeCommit({
            projectDocument: duplicateDocument,
            binaryAssets,
            projectFolderId: copyFolderId,
            lastKnownGoodRevisionId: null,
            driveAdapter
          });
        } else {
          copyResult = await driveAdapter.saveEditableProject({
            projectDocument: duplicateDocument,
            binaryAssets,
            remoteFolderId: copyFolderId
          });
        }

        return {
          strategy: CONFLICT_STRATEGY.SAVE_BOTH_COPIES,
          success: true,
          action: 'CREATED_NON_DESTRUCTIVE_DUPLICATE',
          originalRemoteIntact: true,
          originalRevisionId: remoteManifest ? remoteManifest.currentRevisionId : null,
          duplicateDocument,
          duplicateFolderId: copyFolderId,
          duplicateRevisionId,
          message: `Remote original preserved intact. Created non-destructive duplicate: "${duplicateTitle}".`
        };
      }

      default:
        throw new Error(`UNKNOWN_CONFLICT_STRATEGY: Strategy '${strategy}' is not supported`);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFLICT_STRATEGY,
    DriveConflictResolver
  };
} else if (typeof window !== 'undefined') {
  window.DriveConflictResolver = DriveConflictResolver;
  window.CONFLICT_STRATEGY = CONFLICT_STRATEGY;
}
