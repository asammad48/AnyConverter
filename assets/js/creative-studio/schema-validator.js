/**
 * AnyConverter Creative Studio — Schema Validator & Migration Engine
 * Zero-dependency JSON Schema validator and migrator for ProjectDocument and ManifestDocument.
 */

class SchemaValidator {
  constructor() {
    this.currentSchemaVersion = '1.0.0';
    this.currentManifestVersion = '1.0.0';
  }

  /**
   * Validate a ProjectDocument against canonical schema rules
   * @param {Object} doc - ProjectDocument candidate
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validateProject(doc) {
    const errors = [];

    if (!doc || typeof doc !== 'object') {
      return { valid: false, errors: ['ProjectDocument must be a non-null object'] };
    }

    // Required fields check
    const required = [
      'schemaVersion', 'projectId', 'revisionId', 'title',
      'kind', 'locale', 'canvas', 'assets', 'scenes', 'tracks'
    ];
    for (const field of required) {
      if (doc[field] === undefined || doc[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Version format
    if (doc.schemaVersion && !/^\d+\.\d+\.\d+$/.test(doc.schemaVersion)) {
      errors.push(`Invalid schemaVersion format: ${doc.schemaVersion} (must match semver)`);
    }

    // Kind enum
    const validKinds = ['graphic', 'video', 'business-card', 'series'];
    if (doc.kind && !validKinds.includes(doc.kind)) {
      errors.push(`Invalid kind: ${doc.kind} (must be one of ${validKinds.join(', ')})`);
    }

    // Locale enum
    const validLocales = ['en', 'es', 'da'];
    if (doc.locale && !validLocales.includes(doc.locale)) {
      errors.push(`Invalid locale: ${doc.locale} (must be en, es, or da)`);
    }

    // Canvas checks
    if (doc.canvas) {
      if (typeof doc.canvas.width !== 'number' || doc.canvas.width < 64 || doc.canvas.width > 8192) {
        errors.push('canvas.width must be an integer between 64 and 8192');
      }
      if (typeof doc.canvas.height !== 'number' || doc.canvas.height < 64 || doc.canvas.height > 8192) {
        errors.push('canvas.height must be an integer between 64 and 8192');
      }
      if (typeof doc.canvas.fpsNumerator !== 'number' || doc.canvas.fpsNumerator < 1) {
        errors.push('canvas.fpsNumerator must be a positive integer');
      }
      if (typeof doc.canvas.fpsDenominator !== 'number' || doc.canvas.fpsDenominator < 1) {
        errors.push('canvas.fpsDenominator must be a positive integer');
      }
    }

    // Assets validation
    if (Array.isArray(doc.assets)) {
      const shaRegex = /^sha256:[a-f0-9]{64}$/;
      doc.assets.forEach((asset, idx) => {
        if (!asset.id || !shaRegex.test(asset.id)) {
          errors.push(`assets[${idx}].id must be a valid sha256:<64 hex> format`);
        }
        if (typeof asset.sizeBytes !== 'number' || asset.sizeBytes < 0) {
          errors.push(`assets[${idx}].sizeBytes must be a non-negative integer`);
        }
        if (!['import', 'native', 'generated', 'drive'].includes(asset.source)) {
          errors.push(`assets[${idx}].source must be one of import, native, generated, drive`);
        }
      });
    } else {
      errors.push('assets must be an array');
    }

    // Scenes validation
    if (Array.isArray(doc.scenes)) {
      doc.scenes.forEach((scene, sIdx) => {
        if (!scene.id || typeof scene.id !== 'string') {
          errors.push(`scenes[${sIdx}].id must be a non-empty string`);
        }
        if (typeof scene.startFrame !== 'number' || scene.startFrame < 0) {
          errors.push(`scenes[${sIdx}].startFrame must be >= 0`);
        }
        if (typeof scene.durationFrames !== 'number' || scene.durationFrames < 1) {
          errors.push(`scenes[${sIdx}].durationFrames must be >= 1`);
        }
        if (!Array.isArray(scene.layers)) {
          errors.push(`scenes[${sIdx}].layers must be an array`);
        }
      });
    } else {
      errors.push('scenes must be an array');
    }

    // Tracks validation
    if (!Array.isArray(doc.tracks)) {
      errors.push('tracks must be an array');
    }

    // Security audit: reject embedded API keys or credentials in document
    const rawJson = JSON.stringify(doc);
    if (/sk-[a-zA-Z0-9]{20,}/.test(rawJson) || /ya29\.[a-zA-Z0-9_-]{20,}/.test(rawJson)) {
      errors.push('SECURITY DEFECT: Document contains embedded API keys or OAuth credentials');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate older project schemas forward
   * @param {Object} doc - Raw project object from legacy source
   * @returns {{ migrated: boolean, document: Object, error: string|null }}
   */
  migrateProject(doc) {
    if (!doc || typeof doc !== 'object') {
      return { migrated: false, document: null, error: 'Cannot migrate non-object document' };
    }

    const version = doc.schemaVersion || '0.9.0';
    if (version === this.currentSchemaVersion) {
      return { migrated: false, document: doc, error: null };
    }

    const clone = JSON.parse(JSON.stringify(doc));

    // Migration rule: 0.9.x -> 1.0.0
    if (version.startsWith('0.9')) {
      clone.schemaVersion = '1.0.0';
      if (!clone.tracks) clone.tracks = [];
      if (!clone.characters) clone.characters = [];
      if (!clone.locale) clone.locale = 'en';
      if (clone.canvas && !clone.canvas.fpsNumerator) {
        clone.canvas.fpsNumerator = 30;
        clone.canvas.fpsDenominator = 1;
      }
      return { migrated: true, document: clone, error: null };
    }

    return {
      migrated: false,
      document: doc,
      error: `Unsupported schemaVersion for migration: ${version}`
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SchemaValidator };
}
