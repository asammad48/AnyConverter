/**
 * AnyConverter Creative Studio — Phase 11: Episodic Drama Planner & Continuity Tracker
 * Manages Series -> Episodes -> Scenes -> Shots hierarchy with dialogue beats,
 * character assignment, camera directions, and automated continuity checking.
 */

class DramaSeriesPlanner {
  /**
   * @param {Object} options
   * @param {Object} [options.seriesBible] - SeriesBible instance
   */
  constructor(options = {}) {
    this.seriesBible = options.seriesBible || null;
    this.episodes = new Map();
  }

  /**
   * Set or update associated SeriesBible
   * @param {Object} bible
   */
  setSeriesBible(bible) {
    this.seriesBible = bible;
  }

  /**
   * Create an episode within the series
   * @param {Object} episodeData
   * @returns {Object} Episode object
   */
  createEpisode(episodeData = {}) {
    const episodeId = episodeData.episodeId || `ep-${this.episodes.size + 1}`;
    const episode = {
      episodeId,
      episodeNumber: episodeData.episodeNumber || (this.episodes.size + 1),
      title: episodeData.title || `Episode ${this.episodes.size + 1}`,
      synopsis: episodeData.synopsis || '',
      targetDurationSeconds: episodeData.targetDurationSeconds || 300,
      scenes: []
    };
    this.episodes.set(episodeId, episode);

    if (this.seriesBible && !this.seriesBible.episodes.find(e => e.episodeId === episodeId)) {
      this.seriesBible.episodes.push({
        episodeId,
        episodeNumber: episode.episodeNumber,
        title: episode.title
      });
    }

    return episode;
  }

  getEpisode(episodeId) {
    return this.episodes.get(episodeId) || null;
  }

  /**
   * Add a scene to an existing episode
   * @param {string} episodeId
   * @param {Object} sceneData
   * @returns {Object} Scene object
   */
  addSceneToEpisode(episodeId, sceneData = {}) {
    const episode = this.getEpisode(episodeId);
    if (!episode) {
      throw new Error(`EPISODE_NOT_FOUND: Episode with id '${episodeId}' does not exist.`);
    }

    const sceneId = sceneData.sceneId || `scene-${episode.scenes.length + 1}`;
    const scene = {
      sceneId,
      sceneNumber: sceneData.sceneNumber || (episode.scenes.length + 1),
      title: sceneData.title || `Scene ${episode.scenes.length + 1}`,
      locationId: sceneData.locationId || null,
      dialogue: Array.isArray(sceneData.dialogue) ? [...sceneData.dialogue] : [],
      shots: []
    };

    if (Array.isArray(sceneData.shots)) {
      for (const shot of sceneData.shots) {
        scene.shots.push(this._formatShot(shot, scene.shots.length + 1));
      }
    }

    episode.scenes.push(scene);
    return scene;
  }

  /**
   * Add a shot to a specific scene
   * @param {string} episodeId
   * @param {string} sceneId
   * @param {Object} shotData
   * @returns {Object} Shot object
   */
  addShotToScene(episodeId, sceneId, shotData = {}) {
    const episode = this.getEpisode(episodeId);
    if (!episode) {
      throw new Error(`EPISODE_NOT_FOUND: Episode '${episodeId}' not found.`);
    }

    const scene = episode.scenes.find(s => s.sceneId === sceneId);
    if (!scene) {
      throw new Error(`SCENE_NOT_FOUND: Scene '${sceneId}' not found in episode '${episodeId}'.`);
    }

    const shot = this._formatShot(shotData, scene.shots.length + 1);
    scene.shots.push(shot);
    return shot;
  }

  _formatShot(data, defaultIndex) {
    const shotId = data.shotId || `shot-${defaultIndex}`;
    const initialVersion = data.initialAssetId ? [{
      versionNumber: 1,
      assetId: data.initialAssetId,
      prompt: data.prompt || '',
      model: data.model || 'native',
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    }] : [];

    return {
      shotId,
      shotNumber: data.shotNumber || defaultIndex,
      characterIds: Array.isArray(data.characterIds) ? [...data.characterIds] : [],
      cameraInstruction: data.cameraInstruction || 'medium_shot',
      durationSeconds: data.durationSeconds || 4,
      dialogueRef: data.dialogueRef || null,
      versions: Array.isArray(data.versions) ? [...data.versions] : initialVersion,
      activeVersionNumber: data.activeVersionNumber || (initialVersion.length > 0 ? 1 : null)
    };
  }

  /**
   * Check continuity across an entire episode against the Series & World Bible
   * @param {string} episodeId
   * @returns {{ isConsistent: boolean, issues: Array<string>, characterStats: Object }}
   */
  checkContinuity(episodeId) {
    const episode = this.getEpisode(episodeId);
    if (!episode) {
      throw new Error(`EPISODE_NOT_FOUND: Cannot check continuity for unknown episode '${episodeId}'.`);
    }

    const issues = [];
    const characterStats = {};

    if (!this.seriesBible) {
      issues.push('NO_SERIES_BIBLE: Cannot verify character or world continuity without linked SeriesBible.');
      return { isConsistent: false, issues, characterStats };
    }

    for (const scene of episode.scenes) {
      // 1. Check Location in World Bible
      if (scene.locationId) {
        const location = this.seriesBible.world.getLocation(scene.locationId);
        if (!location) {
          issues.push(`Scene '${scene.title}' (${scene.sceneId}) references missing locationId '${scene.locationId}'.`);
        }
      }

      // 2. Check Characters in Dialogue
      for (const turn of scene.dialogue) {
        if (turn.characterId) {
          const char = this.seriesBible.getCharacter(turn.characterId);
          if (!char) {
            issues.push(`Dialogue in scene '${scene.title}' references unknown characterId '${turn.characterId}'.`);
          } else {
            characterStats[turn.characterId] = (characterStats[turn.characterId] || 0) + 1;
          }
        }
      }

      // 3. Check Characters in Shots
      for (const shot of scene.shots) {
        for (const charId of shot.characterIds) {
          const char = this.seriesBible.getCharacter(charId);
          if (!char) {
            issues.push(`Shot '${shot.shotId}' in scene '${scene.title}' references unknown characterId '${charId}'.`);
          } else {
            // Check character anchor assets
            if (!char.appearance.faceAnchorAssetId && !char.rigRefs.assetId) {
              issues.push(`Character '${char.displayName}' (${charId}) in shot '${shot.shotId}' lacks both face anchor and rig asset.`);
            }
          }
        }
      }
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      characterStats
    };
  }

  /**
   * Compile a generation-ready prompt bundle for a shot
   * @param {Object} shot
   * @param {Object} scene
   * @returns {Object} Prompt bundle with references
   */
  compileShotPrompt(shot, scene) {
    if (!this.seriesBible) {
      throw new Error('SERIES_BIBLE_REQUIRED: Cannot compile prompt without linked SeriesBible');
    }

    const characterPrompts = [];
    const referenceAssetIds = [];

    for (const charId of shot.characterIds) {
      const char = this.seriesBible.getCharacter(charId);
      if (char) {
        characterPrompts.push(`${char.displayName}: ${char.appearance.hair} hair, ${char.appearance.wardrobe} wardrobe`);
        if (char.appearance.faceAnchorAssetId) {
          referenceAssetIds.push(char.appearance.faceAnchorAssetId);
        }
        if (char.rigRefs.assetId) {
          referenceAssetIds.push(char.rigRefs.assetId);
        }
      }
    }

    let locationPrompt = 'Neutral Studio';
    if (scene && scene.locationId) {
      const loc = this.seriesBible.world.getLocation(scene.locationId);
      if (loc) {
        locationPrompt = `${loc.name}, ${loc.lightingPreset}`;
        if (loc.backdropAssetId) {
          referenceAssetIds.push(loc.backdropAssetId);
        }
      }
    }

    const fullPrompt = [
      `[Scene: ${locationPrompt}]`,
      `[Camera: ${shot.cameraInstruction}]`,
      `[Characters: ${characterPrompts.join('; ')}]`,
      shot.cameraInstruction
    ].join(' ');

    return {
      shotId: shot.shotId,
      fullPrompt,
      durationSeconds: shot.durationSeconds,
      referenceAssetIds,
      aspectRatio: '16:9'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DramaSeriesPlanner
  };
} else if (typeof window !== 'undefined') {
  window.DramaSeriesPlanner = DramaSeriesPlanner;
}
