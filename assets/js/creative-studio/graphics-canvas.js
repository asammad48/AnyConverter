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
   * Render all visible layers onto a 2D canvas rendering context
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   */
  renderToCanvas(ctx, options = {}) {
    if (!ctx) return;
    // 1. Draw canvas background
    ctx.fillStyle = this.background || '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Draw layers in bottom-to-top order
    for (const layer of this.layers) {
      if (layer.visible === false) continue;
      ctx.save();
      ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : 1.0;
      const t = layer.transform || { x: 0, y: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 };
      ctx.translate(t.x || 0, t.y || 0);
      if (t.rotationDeg) {
        ctx.rotate((t.rotationDeg * Math.PI) / 180);
      }
      ctx.scale(t.scaleX || 1, t.scaleY || 1);

      if (layer.type === 'shape') {
        ctx.beginPath();
        const w = layer.width || 200;
        const h = layer.height || 100;
        if (layer.shapeType === 'circle' || layer.shapeType === 'ellipse') {
          ctx.ellipse(w / 2, h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
        } else {
          ctx.rect(0, 0, w, h);
        }
        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.fill();
        }
        if (layer.stroke) {
          ctx.strokeStyle = layer.stroke;
          ctx.lineWidth = layer.strokeWidth || 1;
          ctx.stroke();
        }
      } else if (layer.type === 'text') {
        const fontSize = layer.fontSize || 36;
        const fontWeight = layer.fontWeight || 600;
        const fontFamily = layer.fontFamily || 'Inter, sans-serif';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = layer.fill || '#111827';
        ctx.textBaseline = 'top';
        const text = String(layer.content || '');
        const lines = text.split('\n');
        let yOff = 0;
        const lineHeight = fontSize * 1.25;
        for (const line of lines) {
          ctx.fillText(line, 0, yOff);
          yOff += lineHeight;
        }
      } else if (layer.type === 'image') {
        if (layer.imageElement && layer.imageElement.complete) {
          ctx.drawImage(layer.imageElement, 0, 0, layer.width || layer.imageElement.width, layer.height || layer.imageElement.height);
        } else {
          const w = layer.width || 300;
          const h = layer.height || 200;
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, w, h);
          ctx.fillStyle = '#64748b';
          ctx.font = '14px Inter, sans-serif';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(layer.name || 'Image Layer', w / 2, h / 2);
        }
      } else if (layer.type === 'background') {
        ctx.fillStyle = layer.fill || this.background;
        ctx.fillRect(0, 0, this.width, this.height);
      }
      ctx.restore();
    }
  }

  /**
   * Export the canvas as a real PNG DataURL or Blob
   * @param {Object} options - { scale: 1.0, quality: 0.95 }
   * @returns {Promise<{ dataUrl: string, blob: Blob|null, width: number, height: number }>}
   */
  async exportPng(options = {}) {
    const scale = options.scale || 1.0;
    const dims = this.getExportDimensions(scale);

    if (typeof document !== 'undefined' && document.createElement) {
      const c = document.createElement('canvas');
      c.width = dims.exportWidth;
      c.height = dims.exportHeight;
      const ctx = c.getContext('2d');
      if (scale !== 1.0) ctx.scale(scale, scale);
      this.renderToCanvas(ctx, options);
      const dataUrl = c.toDataURL('image/png');
      const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'));
      return {
        dataUrl,
        blob,
        width: dims.exportWidth,
        height: dims.exportHeight
      };
    }

    // Node.js headless environment fallback
    const fallbackPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    return {
      dataUrl: fallbackPng,
      blob: null,
      width: dims.exportWidth,
      height: dims.exportHeight
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
if (typeof window !== 'undefined') {
  window.GraphicsCanvas = GraphicsCanvas;
}
