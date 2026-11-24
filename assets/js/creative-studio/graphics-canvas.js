/**
 * AnyConverter Creative Studio — 2D Graphics Canvas Engine
 * Object-oriented scene graph, affine transformations, preset sizing, snapping, and high-DPI export.
 */

class GraphicsCanvas {
  constructor(options = {}) {
    this.width = options.width || 1280;
    this.height = options.height || 720;
    this.background = options.background || '#ffffff';
    this.layers = [];
    this.selectedLayerIds = new Set();
    this.snapThreshold = options.snapThreshold || 8; // Snap within 8 pixels
  }

  // --- Preset Geometry Configurations ---
  static get PRESETS() {
    return {
      'youtube-thumbnail': { width: 1280, height: 720, label: 'YouTube Thumbnail (16:9)', defaultDpi: 72 },
      'social-square': { width: 1080, height: 1080, label: 'Social Square (1:1)', defaultDpi: 72 },
      'social-story': { width: 1080, height: 1920, label: 'Social Story / Reel (9:16)', defaultDpi: 72 },
      'social-banner': { width: 1200, height: 630, label: 'Facebook / OpenGraph Banner', defaultDpi: 72 },
      'twitter-header': { width: 1500, height: 500, label: 'X / Twitter Header (3:1)', defaultDpi: 72 },
      'card-standard-eu': { width: 1004, height: 650, label: 'Business Card 85x55mm @ 300DPI', defaultDpi: 300, trimMm: [85, 55], bleedMm: 3 },
      'card-standard-us': { width: 1050, height: 600, label: 'Business Card 3.5x2in @ 300DPI', defaultDpi: 300, trimMm: [88.9, 50.8], bleedMm: 3 }
    };
  }

  setPreset(presetKey) {
    const preset = GraphicsCanvas.PRESETS[presetKey];
    if (!preset) throw new Error(`Unknown preset: ${presetKey}`);
    this.width = preset.width;
    this.height = preset.height;
    return preset;
  }

  addLayer(layer) {
    if (!layer.id) layer.id = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (layer.visible === undefined) layer.visible = true;
    if (layer.locked === undefined) layer.locked = false;
    if (layer.opacity === undefined) layer.opacity = 1.0;
    if (!layer.transform) {
      layer.transform = { x: 0, y: 0, scaleX: 1.0, scaleY: 1.0, rotationDeg: 0 };
    }
    this.layers.push(layer);
    return layer;
  }

  getLayer(id) {
    return this.layers.find(l => l.id === id) || null;
  }

  removeLayer(id) {
    const idx = this.layers.findIndex(l => l.id === id);
    if (idx >= 0) {
      this.selectedLayerIds.delete(id);
      return this.layers.splice(idx, 1)[0];
    }
    return null;
  }

  reorderLayer(id, newIndex) {
    const currentIndex = this.layers.findIndex(l => l.id === id);
    if (currentIndex < 0) return false;
    const clampedIndex = Math.max(0, Math.min(newIndex, this.layers.length - 1));
    const [layer] = this.layers.splice(currentIndex, 1);
    this.layers.splice(clampedIndex, 0, layer);
    return true;
  }

  // --- Alignment & Distribution Helpers ---

  alignSelected(alignment) {
    const selected = this.layers.filter(l => this.selectedLayerIds.has(l.id));
    if (selected.length === 0) return;

    for (const layer of selected) {
      if (layer.locked) continue;
      const bounds = this.getLayerBounds(layer);
      switch (alignment) {
        case 'left':
          layer.transform.x = 0;
          break;
        case 'center':
          layer.transform.x = (this.width - bounds.width) / 2;
          break;
        case 'right':
          layer.transform.x = this.width - bounds.width;
          break;
        case 'top':
          layer.transform.y = 0;
          break;
        case 'middle':
          layer.transform.y = (this.height - bounds.height) / 2;
          break;
        case 'bottom':
          layer.transform.y = this.height - bounds.height;
          break;
      }
    }
  }

  getLayerBounds(layer) {
    const w = (layer.width || 200) * (layer.transform.scaleX || 1.0);
    const h = (layer.height || 100) * (layer.transform.scaleY || 1.0);
    return {
      x: layer.transform.x,
      y: layer.transform.y,
      width: Math.abs(w),
      height: Math.abs(h)
    };
  }

  // --- Magnetic Snapping Engine ---

  calculateSnap(x, y, width, height) {
    let snappedX = x;
    let snappedY = y;
    const snapGuides = [];

    // Canvas Snap Points
    const canvasCenterX = this.width / 2;
    const canvasCenterY = this.height / 2;
    const objCenterX = x + width / 2;
    const objCenterY = y + height / 2;

    // Horizontal snap: Left edge, Center, Right edge
    if (Math.abs(x) < this.snapThreshold) {
      snappedX = 0;
      snapGuides.push({ type: 'vertical', position: 0 });
    } else if (Math.abs(objCenterX - canvasCenterX) < this.snapThreshold) {
      snappedX = canvasCenterX - width / 2;
      snapGuides.push({ type: 'vertical', position: canvasCenterX });
    } else if (Math.abs((x + width) - this.width) < this.snapThreshold) {
      snappedX = this.width - width;
      snapGuides.push({ type: 'vertical', position: this.width });
    }

    // Vertical snap: Top edge, Middle, Bottom edge
    if (Math.abs(y) < this.snapThreshold) {
      snappedY = 0;
      snapGuides.push({ type: 'horizontal', position: 0 });
    } else if (Math.abs(objCenterY - canvasCenterY) < this.snapThreshold) {
      snappedY = canvasCenterY - height / 2;
      snapGuides.push({ type: 'horizontal', position: canvasCenterY });
    } else if (Math.abs((y + height) - this.height) < this.snapThreshold) {
      snappedY = this.height - height;
      snapGuides.push({ type: 'horizontal', position: this.height });
    }

    return { x: snappedX, y: snappedY, snapGuides };
  }

  // --- Export Pipeline Serialization ---

  serializeToProjectScene(sceneId = 'scene-graphic-01') {
    return {
      id: sceneId,
      name: 'Graphic Artboard',
      startFrame: 0,
      durationFrames: 1, // Static graphic = 1 frame
      layers: JSON.parse(JSON.stringify(this.layers))
    };
  }

  /**
   * Calculate high-DPI export dimensions
   * @param {number} scaleFactor - 1x, 2x (Retina), or 3x (Print 300DPI)
   */
  getExportDimensions(scaleFactor = 1.0) {
    const factor = Math.max(0.25, Math.min(scaleFactor, 4.0));
    return {
      exportWidth: Math.round(this.width * factor),
      exportHeight: Math.round(this.height * factor),
      scaleFactor: factor
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GraphicsCanvas };
}
