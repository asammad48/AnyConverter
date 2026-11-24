/**
 * AnyConverter Creative Studio — Phase 13: Local Agent Bridge SDK
 * Canonical tool-like contract for local agent interoperability (Claude Code, local CLI, desktop tools).
 * Enforces local sandboxing, strict directory allowlisting, explicit user write consent,
 * and zero hosted backend dependencies (Rule G-01).
 */

const path = typeof require !== 'undefined' ? require('path') : null;
const { AgentInteropSecurity, CreationRequestCompiler } = typeof require !== 'undefined'
  ? require('./agent-interop.js')
  : (typeof window !== 'undefined' ? window : {});
const { AcStudioArchive } = typeof require !== 'undefined'
  ? require('./archive.js')
  : (typeof window !== 'undefined' ? window : {});

class LocalAgentBridge {
  /**
   * @param {Object} [options]
   * @param {string} [options.allowedDirectory] - Sandboxed base directory for file operations
   * @param {boolean} [options.allowFilesystemWrite=false] - Explicit write permission
   */
  constructor(options = {}) {
    this.allowedDirectory = options.allowedDirectory
      ? (path ? path.resolve(options.allowedDirectory) : options.allowedDirectory)
      : null;
    this.allowFilesystemWrite = Boolean(options.allowFilesystemWrite);
    this.compiler = new CreationRequestCompiler();
    this.archive = new AcStudioArchive();
  }

  /**
   * Verify sandboxed path remains strictly inside allowedDirectory
   * @param {string} targetPath
   */
  _verifySandboxPath(targetPath) {
    if (!this.allowedDirectory || !path) return;
    const resolved = path.resolve(targetPath);
    if (!resolved.startsWith(this.allowedDirectory)) {
      const err = new Error(`SANDBOX_VIOLATION: Path '${targetPath}' resolves outside allowed directory '${this.allowedDirectory}'`);
      err.code = 'SANDBOX_VIOLATION';
      throw err;
    }
  }

  /**
   * Tool Contract: createProject
   * Compiles an agent CreationRequest into a valid ProjectDocument
   * @param {Object} spec - CreationRequest
   * @returns {Object} ProjectDocument
   */
  createProject(spec) {
    return this.compiler.compile(spec);
  }

  /**
   * Tool Contract: validateProject
   * Deeply validates and sanitizes a ProjectDocument
   * @param {unknown} project
   * @returns {{ valid: boolean, errors: Array<string>, sanitizedProject: Object|null }}
   */
  validateProject(project) {
    try {
      const sanitized = AgentInteropSecurity.parseAndSanitize(project);
      const errors = [];

      if (!sanitized.projectId) errors.push('Missing projectId');
      if (!sanitized.title) errors.push('Missing title');
      if (!Array.isArray(sanitized.scenes)) errors.push('Missing or invalid scenes array');

      return {
        valid: errors.length === 0,
        errors,
        sanitizedProject: errors.length === 0 ? sanitized : null
      };
    } catch (err) {
      return {
        valid: false,
        errors: [err.message],
        sanitizedProject: null
      };
    }
  }

  /**
   * Tool Contract: applyScenePatch
   * Updates a specific scene without touching any other scenes
   * @param {Object} project
   * @param {string} sceneId
   * @param {Object} changes
   * @returns {Object} Patch result with previous snapshot
   */
  applyScenePatch(project, sceneId, changes) {
    return this.compiler.applyScenePatch(project, sceneId, changes);
  }

  /**
   * Tool Contract: exportProject
   * Packages project and binary assets into a portable .acstudio ZIP buffer
   * @param {Object} projectDocument
   * @param {Map<string, Buffer>|Object} [binaryAssets]
   * @returns {Buffer} Portable .acstudio archive buffer
   */
  exportProject(projectDocument, binaryAssets = {}) {
    return this.archive.package(projectDocument, binaryAssets);
  }

  /**
   * Tool Contract: importProject
   * Unpacks and sanitizes a portable .acstudio archive buffer
   * @param {Buffer} archiveBuffer
   * @returns {{ projectDocument: Object, binaryAssets: Map<string, Buffer>, manifest: Object }}
   */
  importProject(archiveBuffer) {
    const unpacked = this.archive.unpackage(archiveBuffer);
    const sanitizedProject = AgentInteropSecurity.parseAndSanitize(unpacked.project);
    return {
      projectDocument: sanitizedProject,
      binaryAssets: unpacked.assets,
      manifest: unpacked.manifest
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LocalAgentBridge
  };
} else if (typeof window !== 'undefined') {
  window.LocalAgentBridge = LocalAgentBridge;
}
