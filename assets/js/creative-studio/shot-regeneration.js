/**
 * AnyConverter Creative Studio — Phase 11: Selective Shot Regeneration & Rollback Engine
 * Manages non-destructive shot versioning, candidate evaluations, instant rollbacks,
 * middle-scene edit isolation, and missing asset relinking diagnostics.
 */

const SHOT_VERSION_STATUS = {
  CANDIDATE: 'CANDIDATE',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

class ShotRegenerationEngine {
  constructor(options = {}) {
    this.auditLog = [];
  }

  _log(action, meta = {}) {
    this.auditLog.push({
      time: new Date().toISOString(),
      action,
      meta
    });
  }

  /**
   * Submit a new regenerated candidate version for a specific shot
   * @param {Object} shot
   * @param {Object} candidateParams
   * @param {string} candidateParams.assetId - New media asset ID (e.g. sha256:...)
   * @param {string} [candidateParams.prompt]
   * @param {string} [candidateParams.model]
   * @returns {Object} Newly created candidate version record
   */
  proposeCandidateVersion(shot, candidateParams = {}) {
    if (!shot) {
      throw new Error('SHOT_REQUIRED: Must provide target shot for regeneration proposal');
    }
    if (!candidateParams.assetId) {
      throw new Error('ASSET_ID_REQUIRED: Candidate must have valid assetId');
    }

    if (!Array.isArray(shot.versions)) {
      shot.versions = [];
    }

    const nextVersionNum = shot.versions.length + 1;
    const versionRecord = {
      versionNumber: nextVersionNum,
      assetId: candidateParams.assetId,
      prompt: candidateParams.prompt || '',
      model: candidateParams.model || 'ai_regenerated',
      status: SHOT_VERSION_STATUS.CANDIDATE,
      proposedAt: new Date().toISOString(),
      priorActiveVersion: shot.activeVersionNumber || 1
    };

    shot.versions.push(versionRecord);
    // Notice: activeVersionNumber remains UNCHANGED until explicit user acceptance!
    this._log('CANDIDATE_VERSION_PROPOSED', { shotId: shot.shotId, versionNumber: nextVersionNum });

    return versionRecord;
  }

  /**
   * User decision: Accept candidate version and attach to active timeline
   * @param {Object} shot
   * @param {number} versionNumber
   * @returns {Object} Accepted version
   */
  acceptCandidateVersion(shot, versionNumber) {
    const version = shot.versions.find(v => v.versionNumber === versionNumber);
    if (!version) {
      throw new Error(`VERSION_NOT_FOUND: Shot ${shot.shotId} has no version ${versionNumber}`);
    }

    version.status = SHOT_VERSION_STATUS.APPROVED;
    version.acceptedAt = new Date().toISOString();
    shot.activeVersionNumber = versionNumber;

    this._log('CANDIDATE_ACCEPTED', { shotId: shot.shotId, versionNumber });
    return version;
  }

  /**
   * User decision: Reject candidate version without affecting active timeline
   * @param {Object} shot
   * @param {number} versionNumber
   * @param {string} [reason]
   * @returns {Object} Rejected version
   */
  rejectCandidateVersion(shot, versionNumber, reason = 'User rejected candidate output') {
    const version = shot.versions.find(v => v.versionNumber === versionNumber);
    if (!version) {
      throw new Error(`VERSION_NOT_FOUND: Shot ${shot.shotId} has no version ${versionNumber}`);
    }

    version.status = SHOT_VERSION_STATUS.REJECTED;
    version.rejectReason = reason;
    version.rejectedAt = new Date().toISOString();

    // If this version was currently active, revert back to prior version or version 1
    if (shot.activeVersionNumber === versionNumber) {
      const priorApproved = shot.versions.find(v => v.versionNumber !== versionNumber && v.status === SHOT_VERSION_STATUS.APPROVED);
      shot.activeVersionNumber = priorApproved ? priorApproved.versionNumber : 1;
    }

    this._log('CANDIDATE_REJECTED', { shotId: shot.shotId, versionNumber, reason });
    return version;
  }

  /**
   * Instant Rollback: Switch active version to any previously approved version
   * @param {Object} shot
   * @param {number} targetVersionNumber
   * @returns {Object} Active version after rollback
   */
  rollbackToVersion(shot, targetVersionNumber) {
    const version = shot.versions.find(v => v.versionNumber === targetVersionNumber);
    if (!version) {
      throw new Error(`CANNOT_ROLLBACK: Target version ${targetVersionNumber} does not exist on shot ${shot.shotId}`);
    }

    shot.activeVersionNumber = targetVersionNumber;
    this._log('ROLLBACK_EXECUTED', { shotId: shot.shotId, targetVersionNumber });
    return version;
  }

  /**
   * Get active version object for a shot
   * @param {Object} shot
   * @returns {Object|null}
   */
  getActiveVersion(shot) {
    if (!shot || !Array.isArray(shot.versions) || shot.versions.length === 0) {
      return null;
    }
    const activeNum = shot.activeVersionNumber || 1;
    return shot.versions.find(v => v.versionNumber === activeNum) || shot.versions[0];
  }

  /**
   * Verify middle scene edit isolation across all scenes in an episode.
   * Asserts that editing sceneIndex only mutates sceneIndex, while all other scenes retain
   * identical asset IDs and durations.
   * @param {Array<Object>} originalScenes
   * @param {Array<Object>} updatedScenes
   * @param {string} modifiedSceneId
   * @returns {{ isIsolated: boolean, unmutatedCount: number, mutatedScenes: Array<string> }}
   */
  verifySceneEditIsolation(originalScenes, updatedScenes, modifiedSceneId) {
    const mutatedScenes = [];
    let unmutatedCount = 0;

    for (const orig of originalScenes) {
      const updated = updatedScenes.find(s => s.sceneId === orig.sceneId);
      if (!updated) {
        mutatedScenes.push(`Deleted: ${orig.sceneId}`);
        continue;
      }

      const origShots = JSON.stringify(orig.shots.map(s => ({
        shotId: s.shotId,
        activeAsset: (s.versions.find(v => v.versionNumber === s.activeVersionNumber) || {}).assetId,
        duration: s.durationSeconds
      })));

      const updatedShots = JSON.stringify(updated.shots.map(s => ({
        shotId: s.shotId,
        activeAsset: (s.versions.find(v => v.versionNumber === s.activeVersionNumber) || {}).assetId,
        duration: s.durationSeconds
      })));

      if (orig.sceneId === modifiedSceneId) {
        if (origShots !== updatedShots) {
          mutatedScenes.push(orig.sceneId);
        }
      } else {
        if (origShots === updatedShots) {
          unmutatedCount++;
        } else {
          mutatedScenes.push(`UnexpectedMutation: ${orig.sceneId}`);
        }
      }
    }

    const isIsolated = mutatedScenes.length === 1 && mutatedScenes[0] === modifiedSceneId;
    return {
      isIsolated,
      unmutatedCount,
      mutatedScenes
    };
  }

  /**
   * Diagnose missing media assets upon Drive or archive reopen
   * @param {Object} params
   * @param {Object} params.seriesBible
   * @param {Array<Object>} params.episodes
   * @param {Set<string>|Array<string>} params.availableAssetIds - Asset IDs found in storage
   * @returns {{ hasMissingAssets: boolean, missingAssets: Array<{ assetId: string, affectedScenes: Array<string>, affectedCharacters: Array<string> }> }}
   */
  diagnoseMissingAssets(params = {}) {
    const { seriesBible, episodes = [], availableAssetIds } = params;
    const availableSet = availableAssetIds instanceof Set ? availableAssetIds : new Set(availableAssetIds || []);
    const missingMap = new Map(); // assetId -> { assetId, affectedScenes: Set, affectedCharacters: Set }

    const recordMissing = (assetId, sceneTitle, charName) => {
      if (!assetId || availableSet.has(assetId)) return;
      if (!missingMap.has(assetId)) {
        missingMap.set(assetId, {
          assetId,
          affectedScenes: new Set(),
          affectedCharacters: new Set()
        });
      }
      const record = missingMap.get(assetId);
      if (sceneTitle) record.affectedScenes.add(sceneTitle);
      if (charName) record.affectedCharacters.add(charName);
    };

    // Check Characters
    if (seriesBible && seriesBible.characters) {
      for (const char of seriesBible.characters.values()) {
        if (char.appearance.faceAnchorAssetId) {
          recordMissing(char.appearance.faceAnchorAssetId, null, char.displayName);
        }
        if (char.rigRefs.assetId) {
          recordMissing(char.rigRefs.assetId, null, char.displayName);
        }
      }
    }

    // Check Episodes & Shots
    for (const ep of episodes) {
      for (const scene of ep.scenes || []) {
        for (const shot of scene.shots || []) {
          for (const ver of shot.versions || []) {
            recordMissing(ver.assetId, `${ep.title} - ${scene.title}`, null);
          }
        }
      }
    }

    const missingAssets = Array.from(missingMap.values()).map(m => ({
      assetId: m.assetId,
      affectedScenes: Array.from(m.affectedScenes),
      affectedCharacters: Array.from(m.affectedCharacters)
    }));

    return {
      hasMissingAssets: missingAssets.length > 0,
      missingAssets
    };
  }

  /**
   * Relink a missing asset ID with a new replacement asset ID non-destructively
   * @param {Object} params
   * @param {Object} params.seriesBible
   * @param {Array<Object>} params.episodes
   * @param {string} params.oldAssetId
   * @param {string} params.newAssetId
   * @returns {{ relinkedCount: number }}
   */
  relinkAsset(params = {}) {
    const { seriesBible, episodes = [], oldAssetId, newAssetId } = params;
    let relinkedCount = 0;

    if (!oldAssetId || !newAssetId) {
      throw new Error('ASSET_IDS_REQUIRED: Must provide oldAssetId and newAssetId for relinking');
    }

    // Relink in Characters
    if (seriesBible && seriesBible.characters) {
      for (const char of seriesBible.characters.values()) {
        if (char.appearance.faceAnchorAssetId === oldAssetId) {
          char.appearance.faceAnchorAssetId = newAssetId;
          relinkedCount++;
        }
        if (char.rigRefs.assetId === oldAssetId) {
          char.rigRefs.assetId = newAssetId;
          relinkedCount++;
        }
      }
    }

    // Relink in Episodes & Shots
    for (const ep of episodes) {
      for (const scene of ep.scenes || []) {
        for (const shot of scene.shots || []) {
          for (const ver of shot.versions || []) {
            if (ver.assetId === oldAssetId) {
              ver.assetId = newAssetId;
              relinkedCount++;
            }
          }
        }
      }
    }

    this._log('ASSET_RELINKED', { oldAssetId, newAssetId, relinkedCount });
    return { relinkedCount };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SHOT_VERSION_STATUS,
    ShotRegenerationEngine
  };
} else if (typeof window !== 'undefined') {
  window.ShotRegenerationEngine = ShotRegenerationEngine;
  window.SHOT_VERSION_STATUS = SHOT_VERSION_STATUS;
}
