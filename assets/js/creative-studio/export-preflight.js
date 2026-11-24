/**
 * AnyConverter Creative Studio — Export Preflight Engine
 * Pre-render capability negotiation, asset completeness check, CSS filter audit, and device checks.
 */

class ExportPreflight {
  constructor(options = {}) {
    this.maxSafePixels = options.maxSafePixels || 1920 * 1080; // 1080p safe default
  }

  /**
   * Run comprehensive preflight checks before video export
   * @param {Object} projectDocument - Project to render
   * @param {Map<string, any>|Set<string>} availableAssetIds - Assets available locally
   * @param {Object} targetOptions - { resolution, fps, codec }
   * @returns {{ passed: boolean, errors: string[], warnings: string[], recommendations: string[] }}
   */
  check(projectDocument, availableAssetIds = new Set(), targetOptions = {}) {
    const errors = [];
    const warnings = [];
    const recommendations = [];

    if (!projectDocument || !projectDocument.canvas) {
      return { passed: false, errors: ['Invalid project document or canvas'], warnings: [], recommendations: [] };
    }

    const width = targetOptions.width || projectDocument.canvas.width;
    const height = targetOptions.height || projectDocument.canvas.height;
    const pixelCount = width * height;

    // 1. Resolution & Memory Preflight
    if (pixelCount > 3840 * 2160) {
      errors.push(`Resolution ${width}x${height} exceeds maximum supported browser export limit (4K)`);
    } else if (pixelCount > 1920 * 1080) {
      warnings.push(`Exporting at ${width}x${height} (>1080p) may exceed memory limits on mobile devices or integrated GPUs.`);
      recommendations.push('Consider downscaling to 1080p (1920x1080) for universal compatibility.');
    }

    // 2. Asset Completeness Check
    const assetIdSet = availableAssetIds instanceof Set ? availableAssetIds : new Set(Object.keys(availableAssetIds));
    const declaredAssets = projectDocument.assets || [];

    for (const asset of declaredAssets) {
      if (!assetIdSet.has(asset.id)) {
        errors.push(`MISSING_ASSET: Required media asset '${asset.id}' is not loaded in local storage.`);
        recommendations.push('Please relink or re-upload the missing media before rendering.');
      }
    }

    // 3. Unsupported CSS Filter & Effects Audit
    const unsupportedFilters = ['drop-shadow', 'backdrop-filter', 'contrast', 'hue-rotate'];
    const scenes = projectDocument.scenes || [];

    for (const scene of scenes) {
      for (const layer of (scene.layers || [])) {
        if (layer.effects) {
          for (const effect of layer.effects) {
            if (unsupportedFilters.includes(effect.kind)) {
              warnings.push(`UNSUPPORTED_EFFECT: Effect '${effect.kind}' on layer '${layer.name || layer.id}' cannot be accurately composited by hardware video encoder.`);
              recommendations.push(`Convert '${effect.kind}' to pre-rendered bitmap or use standard opacity/transforms.`);
            }
          }
        }
      }
    }

    // 4. Timebase & FPS Invariants
    const fpsNum = projectDocument.canvas.fpsNumerator || 30;
    const fpsDen = projectDocument.canvas.fpsDenominator || 1;
    const effectiveFps = fpsNum / fpsDen;

    if (effectiveFps > 60) {
      warnings.push(`Framerate ${effectiveFps} fps is high for client-side encoding.`);
      recommendations.push('Target 30 fps for smooth, reliable encoding without frame drops.');
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExportPreflight };
}
