/**
 * AnyConverter Creative Studio — Phase 11: Character, World & Series Bible
 * Persistent repository for reusable actors, environments, voice profiles,
 * and continuity anchors for episodic drama series.
 * Supports native 2D/3D rigs, reference-supported AI, and strict consent validation.
 */

const PRODUCTION_MODE = {
  NATIVE_RIG: 'NATIVE_RIG',       // Highest deterministic identity (2D sprite / 3D GLTF)
  REFERENCE_AI: 'REFERENCE_AI',   // Probabilistic character consistency via image references
  HYBRID: 'HYBRID'                // Combination (e.g. 2D/3D foreground + AI background plate)
};

const CONSENT_STATUS = {
  NOT_APPLICABLE: 'NOT_APPLICABLE', // Fictional character
  CONFIRMED: 'CONFIRMED',           // User confirmed legal ownership or consent
  PENDING: 'PENDING',               // Requires user action
  REJECTED: 'REJECTED'              // Real person without consent
};

class CharacterBible {
  /**
   * @param {Object} data
   */
  constructor(data = {}) {
    this.characterId = data.characterId || `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.displayName = data.displayName || 'Unnamed Character';
    this.role = data.role || 'PROTAGONIST'; // PROTAGONIST, ANTAGONIST, SUPPORTING, EXTRA
    this.appearance = Object.assign({
      hair: 'black',
      eyeColor: 'brown',
      skinTone: 'neutral',
      wardrobe: 'default',
      faceAnchorAssetId: null,
      bodyAnchorAssetId: null,
      colorPalette: []
    }, data.appearance || {});

    this.rigRefs = Object.assign({
      type: 'NONE', // '2D_SPRITE', 'glTF', 'NONE'
      assetId: null,
      animationMap: {}
    }, data.rigRefs || {});

    this.voiceRef = Object.assign({
      kind: 'preset', // 'preset', 'user-supplied'
      profileName: 'standard_narrator',
      assetId: null,
      language: 'en',
      accent: 'neutral',
      consentConfirmed: false
    }, data.voiceRef || {});

    this.continuityLocks = Array.isArray(data.continuityLocks)
      ? [...data.continuityLocks]
      : ['face', 'hair', 'wardrobe'];

    this.approvedShotIds = Array.isArray(data.approvedShotIds) ? [...data.approvedShotIds] : [];
    this.rejectedShotIds = Array.isArray(data.rejectedShotIds) ? [...data.rejectedShotIds] : [];

    this.rights = Object.assign({
      isRealPerson: false,
      consentStatus: CONSENT_STATUS.NOT_APPLICABLE,
      consentConfirmed: false,
      licenseType: 'original_creation' // 'original_creation', 'licensed', 'public_domain'
    }, data.rights || {});
  }

  /**
   * Check if character representation has valid legal consent
   * @returns {{ valid: boolean, reason: string|null }}
   */
  validateRights() {
    if (this.rights.isRealPerson) {
      if (!this.rights.consentConfirmed || this.rights.consentStatus !== CONSENT_STATUS.CONFIRMED) {
        return {
          valid: false,
          reason: `REAL_PERSON_CONSENT_REQUIRED: Character '${this.displayName}' portrays a real person without confirmed legal consent.`
        };
      }
    }

    if (this.voiceRef.kind === 'user-supplied' && !this.voiceRef.consentConfirmed) {
      return {
        valid: false,
        reason: `VOICE_CONSENT_REQUIRED: Voice profile for '${this.displayName}' requires confirmed consent for user-supplied recording.`
      };
    }

    return { valid: true, reason: null };
  }

  /**
   * Add approved shot reference to this character
   * @param {string} shotId
   */
  approveShot(shotId) {
    if (!this.approvedShotIds.includes(shotId)) {
      this.approvedShotIds.push(shotId);
    }
  }

  /**
   * Record a rejected shot with a continuity reason
   * @param {string} shotId
   * @param {string} reason
   */
  rejectShot(shotId, reason = 'Inconsistent face or wardrobe') {
    this.rejectedShotIds.push({ shotId, reason, rejectedAt: new Date().toISOString() });
    const idx = this.approvedShotIds.indexOf(shotId);
    if (idx !== -1) {
      this.approvedShotIds.splice(idx, 1);
    }
  }

  toJSON() {
    return {
      characterId: this.characterId,
      displayName: this.displayName,
      role: this.role,
      appearance: this.appearance,
      rigRefs: this.rigRefs,
      voiceRef: this.voiceRef,
      continuityLocks: this.continuityLocks,
      approvedShotIds: this.approvedShotIds,
      rejectedShotIds: this.rejectedShotIds,
      rights: this.rights
    };
  }
}

class WorldBible {
  /**
   * @param {Object} data
   */
  constructor(data = {}) {
    this.worldId = data.worldId || `world-${Date.now()}`;
    this.name = data.name || 'Primary World';
    this.genre = data.genre || 'Drama';
    this.colorPalette = data.colorPalette || {
      primaryTone: '#1A1A24',
      accentTone: '#F39C12',
      lightingTone: '#3498DB'
    };
    this.locations = new Map();
    this.props = new Map();

    if (data.locations) {
      const locList = Array.isArray(data.locations) ? data.locations : Object.values(data.locations);
      for (const loc of locList) {
        this.addLocation(loc);
      }
    }

    if (data.props) {
      const propList = Array.isArray(data.props) ? data.props : Object.values(data.props);
      for (const p of propList) {
        this.addProp(p);
      }
    }
  }

  addLocation(loc) {
    const locationId = loc.locationId || `loc-${this.locations.size + 1}`;
    this.locations.set(locationId, {
      locationId,
      name: loc.name || 'Unnamed Location',
      backdropAssetId: loc.backdropAssetId || null,
      lightingPreset: loc.lightingPreset || 'cinematic_soft',
      cameraPreset: loc.cameraPreset || 'medium_shot_eye_level'
    });
    return this.locations.get(locationId);
  }

  getLocation(locationId) {
    return this.locations.get(locationId) || null;
  }

  addProp(prop) {
    const propId = prop.propId || `prop-${this.props.size + 1}`;
    this.props.set(propId, {
      propId,
      name: prop.name || 'Unnamed Prop',
      assetId: prop.assetId || null,
      isShared: Boolean(prop.isShared)
    });
    return this.props.get(propId);
  }

  toJSON() {
    return {
      worldId: this.worldId,
      name: this.name,
      genre: this.genre,
      colorPalette: this.colorPalette,
      locations: Array.from(this.locations.values()),
      props: Array.from(this.props.values())
    };
  }
}

class SeriesBible {
  /**
   * @param {Object} data
   */
  constructor(data = {}) {
    this.seriesId = data.seriesId || `series-${Date.now()}`;
    this.title = data.title || 'Untitled Series';
    this.productionMode = data.productionMode || PRODUCTION_MODE.HYBRID;
    this.languages = Array.isArray(data.languages) ? [...data.languages] : ['en'];
    this.characters = new Map();
    this.world = new WorldBible(data.world || {});
    this.episodes = Array.isArray(data.episodes) ? [...data.episodes] : [];

    if (data.characters) {
      const charList = Array.isArray(data.characters) ? data.characters : Object.values(data.characters);
      for (const charData of charList) {
        this.addCharacter(charData);
      }
    }
  }

  addCharacter(charData) {
    const char = charData instanceof CharacterBible ? charData : new CharacterBible(charData);
    this.characters.set(char.characterId, char);
    return char;
  }

  getCharacter(characterId) {
    return this.characters.get(characterId) || null;
  }

  removeCharacter(characterId) {
    return this.characters.delete(characterId);
  }

  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  /**
   * Validate full bible integrity: unique IDs, rights compliance, anchor presence
   * @returns {{ valid: boolean, errors: Array<string> }}
   */
  validateBible() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Series must have a non-empty title.');
    }

    if (this.characters.size === 0) {
      errors.push('Series must have at least one character in CharacterBible.');
    }

    for (const char of this.characters.values()) {
      const rightsCheck = char.validateRights();
      if (!rightsCheck.valid) {
        errors.push(rightsCheck.reason);
      }

      // If production mode is NATIVE_RIG, verify rig asset reference
      if (this.productionMode === PRODUCTION_MODE.NATIVE_RIG) {
        if (!char.rigRefs.assetId || char.rigRefs.type === 'NONE') {
          errors.push(`Character '${char.displayName}' requires a 2D sprite or 3D glTF rig under NATIVE_RIG production mode.`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      seriesId: this.seriesId,
      title: this.title,
      productionMode: this.productionMode,
      languages: this.languages,
      characters: Array.from(this.characters.values()).map(c => c.toJSON()),
      world: this.world.toJSON(),
      episodes: this.episodes
    };
  }

  static fromJSON(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return new SeriesBible(parsed);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTION_MODE,
    CONSENT_STATUS,
    CharacterBible,
    WorldBible,
    SeriesBible
  };
} else if (typeof window !== 'undefined') {
  window.CharacterBible = CharacterBible;
  window.WorldBible = WorldBible;
  window.SeriesBible = SeriesBible;
  window.PRODUCTION_MODE = PRODUCTION_MODE;
  window.CONSENT_STATUS = CONSENT_STATUS;
}
