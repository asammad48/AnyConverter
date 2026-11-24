/**
 * AnyConverter Creative Studio — Main Browser Application Controller
 * Connects UI DOM elements to GraphicsCanvas, BusinessCardEngine, QrVcardEngine,
 * AcStudioArchive, CommandEngine, RenderAdapter, and ThreeSceneAdapter.
 */

(function () {
  'use strict';

  function t(map) {
    if (window.acT) return window.acT(map);
    const lang = (document.documentElement.lang || 'en').slice(0, 2);
    return map[lang] || map.en || '';
  }

  class StudioApp {
    constructor() {
      this.initialized = false;
      this.currentMode = 'thumbnail'; // thumbnail, business-card, video, 3d
      this.selectedLayerId = null;
      this.isPlaying = false;
      this.currentFrame = 0;
      this.totalFrames = 150; // 5 seconds @ 30fps
      this.fps = 30;
      this.zoom = 1.0;
      this.activeCardSide = 'front';
      this.activeSceneIndex = 0;

      // Core Engines
      this.graphics = new (window.GraphicsCanvas || Object)({ width: 1280, height: 720 });
      this.cardEngine = new (window.BusinessCardEngine || Object)();
      this.qrEngine = new (window.QrVcardEngine || Object)();
      this.archive = new (window.AcStudioArchive || Object)();
      this.renderAdapter = new (window.NativeCanvasRenderAdapter || Object)();
      this.animation = new (window.AnimationEngine || Object)();

      // Canonical Project Model
      this.project = {
        schemaVersion: '1.0.0',
        projectId: 'project-' + Date.now(),
        revisionId: 'rev-001-init',
        title: 'My Creative Project',
        kind: 'graphics',
        locale: document.documentElement.lang || 'en',
        canvas: {
          width: 1280,
          height: 720,
          fpsNumerator: 30,
          fpsDenominator: 1,
          background: '#ffffff'
        },
        assets: [],
        scenes: [
          {
            id: 'scene-01',
            name: 'Scene 1',
            startFrame: 0,
            durationFrames: 150,
            layers: []
          }
        ]
      };

      if (window.CommandEngine) {
        this.commands = new window.CommandEngine(this.project);
      }

      this.assetBlobs = new Map();
    }

    init() {
      if (this.initialized) return;
      this.cacheDom();
      this.bindEvents();
      this.initDefaultLayers();
      this.render();
      this.initialized = true;
      console.log('AnyConverter Creative Studio initialized successfully.');
    }

    cacheDom() {
      this.dom = {
        canvas: document.getElementById('cs-canvas'),
        ctx: null,
        titleInput: document.getElementById('cs-project-title'),
        presetSelect: document.getElementById('cs-preset-select'),
        modeSelect: document.getElementById('cs-mode-select'),
        btnUndo: document.getElementById('cs-btn-undo'),
        btnRedo: document.getElementById('cs-btn-redo'),
        btnSave: document.getElementById('cs-btn-save-project'),
        btnOpen: document.getElementById('cs-btn-open-project'),
        fileInput: document.getElementById('cs-file-input'),
        btnExportPng: document.getElementById('cs-btn-export-png'),
        btnExportPdf: document.getElementById('cs-btn-export-pdf'),
        btnExportQr: document.getElementById('cs-btn-export-qr'),
        btnExportVideo: document.getElementById('cs-btn-export-video'),
        layersList: document.getElementById('cs-layers-list'),
        btnAddText: document.getElementById('cs-btn-add-text'),
        btnAddShape: document.getElementById('cs-btn-add-shape'),
        btnAddImage: document.getElementById('cs-btn-add-image'),
        btnAddQr: document.getElementById('cs-btn-add-qr'),
        btnDeleteLayer: document.getElementById('cs-btn-delete-layer'),
        propContent: document.getElementById('cs-prop-content'),
        propFontSize: document.getElementById('cs-prop-font-size'),
        propFill: document.getElementById('cs-prop-fill'),
        propX: document.getElementById('cs-prop-x'),
        propY: document.getElementById('cs-prop-y'),
        propWidth: document.getElementById('cs-prop-w'),
        propHeight: document.getElementById('cs-prop-h'),
        btnPlay: document.getElementById('cs-btn-play-pause'),
        timelineScrubber: document.getElementById('cs-timeline-scrubber'),
        frameDisplay: document.getElementById('cs-frame-display'),
        btnSplitClip: document.getElementById('cs-btn-split-clip'),
        btnAddScene: document.getElementById('cs-btn-add-scene'),
        scenesTabs: document.getElementById('cs-scenes-tabs'),
        statusBadge: document.getElementById('cs-status-badge'),
        exportProgressModal: document.getElementById('cs-export-modal'),
        exportProgressBar: document.getElementById('cs-export-progress-bar'),
        exportProgressText: document.getElementById('cs-export-progress-text'),
        btnCancelExport: document.getElementById('cs-btn-cancel-export'),
        cardSideToggle: document.getElementById('cs-card-side-toggle'),
        cardSideFront: document.getElementById('cs-card-side-front'),
        cardSideBack: document.getElementById('cs-card-side-back')
      };

      if (this.dom.canvas) {
        this.dom.ctx = this.dom.canvas.getContext('2d');
      }
    }

    bindEvents() {
      // Title
      if (this.dom.titleInput) {
        this.dom.titleInput.addEventListener('input', (e) => {
          this.project.title = e.target.value || 'Untitled Project';
        });
      }

      // Presets
      if (this.dom.presetSelect) {
        this.dom.presetSelect.addEventListener('change', (e) => {
          this.applyPreset(e.target.value);
        });
      }

      // Mode Switcher
      if (this.dom.modeSelect) {
        this.dom.modeSelect.addEventListener('change', (e) => {
          this.switchMode(e.target.value);
        });
      }

      // Undo / Redo
      if (this.dom.btnUndo) {
        this.dom.btnUndo.addEventListener('click', () => this.undo());
      }
      if (this.dom.btnRedo) {
        this.dom.btnRedo.addEventListener('click', () => this.redo());
      }

      // Save / Open Project (.acstudio)
      if (this.dom.btnSave) {
        this.dom.btnSave.addEventListener('click', () => this.saveProjectArchive());
      }
      if (this.dom.btnOpen && this.dom.fileInput) {
        this.dom.btnOpen.addEventListener('click', () => this.dom.fileInput.click());
        this.dom.fileInput.addEventListener('change', (e) => this.openProjectArchive(e));
      }

      // Exports
      if (this.dom.btnExportPng) {
        this.dom.btnExportPng.addEventListener('click', () => this.exportPng());
      }
      if (this.dom.btnExportPdf) {
        this.dom.btnExportPdf.addEventListener('click', () => this.exportPdf());
      }
      if (this.dom.btnExportQr) {
        this.dom.btnExportQr.addEventListener('click', () => this.exportQr());
      }
      if (this.dom.btnExportVideo) {
        this.dom.btnExportVideo.addEventListener('click', () => this.exportVideo());
      }

      // Add Layers
      if (this.dom.btnAddText) {
        this.dom.btnAddText.addEventListener('click', () => this.addTextLayer());
      }
      if (this.dom.btnAddShape) {
        this.dom.btnAddShape.addEventListener('click', () => this.addShapeLayer());
      }
      if (this.dom.btnAddImage) {
        this.dom.btnAddImage.addEventListener('click', () => this.addImageLayer());
      }
      if (this.dom.btnAddQr) {
        this.dom.btnAddQr.addEventListener('click', () => this.addQrLayer());
      }
      if (this.dom.btnDeleteLayer) {
        this.dom.btnDeleteLayer.addEventListener('click', () => this.deleteSelectedLayer());
      }

      // Properties Inspector
      this.bindInspectorEvents();

      // Timeline & Playback
      if (this.dom.btnPlay) {
        this.dom.btnPlay.addEventListener('click', () => this.togglePlayback());
      }
      if (this.dom.timelineScrubber) {
        this.dom.timelineScrubber.addEventListener('input', (e) => {
          this.seekFrame(parseInt(e.target.value, 10));
        });
      }
      if (this.dom.btnSplitClip) {
        this.dom.btnSplitClip.addEventListener('click', () => this.splitActiveClip());
      }
      if (this.dom.btnAddScene) {
        this.dom.btnAddScene.addEventListener('click', () => this.addNewScene());
      }

      // Business Card Side Switch
      if (this.dom.cardSideFront) {
        this.dom.cardSideFront.addEventListener('click', () => this.switchCardSide('front'));
      }
      if (this.dom.cardSideBack) {
        this.dom.cardSideBack.addEventListener('click', () => this.switchCardSide('back'));
      }

      // Canvas Dragging
      this.bindCanvasMouseEvents();

      // Tab switching in left sidebar
      const tabBtns = document.querySelectorAll('.cs-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.cs-tab-pane').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const target = document.getElementById(btn.getAttribute('data-target'));
          if (target) target.classList.add('active');
        });
      });
    }

    bindInspectorEvents() {
      const updateSelected = (key, val) => {
        const layer = this.getSelectedLayer();
        if (!layer) return;
        if (key === 'content') layer.content = val;
        else if (key === 'fontSize') layer.fontSize = parseInt(val, 10) || 32;
        else if (key === 'fill') layer.fill = val;
        else if (key === 'x') layer.transform.x = parseFloat(val) || 0;
        else if (key === 'y') layer.transform.y = parseFloat(val) || 0;
        else if (key === 'width') layer.width = parseFloat(val) || 100;
        else if (key === 'height') layer.height = parseFloat(val) || 50;
        this.render();
      };

      if (this.dom.propContent) {
        this.dom.propContent.addEventListener('input', (e) => updateSelected('content', e.target.value));
      }
      if (this.dom.propFontSize) {
        this.dom.propFontSize.addEventListener('input', (e) => updateSelected('fontSize', e.target.value));
      }
      if (this.dom.propFill) {
        this.dom.propFill.addEventListener('input', (e) => updateSelected('fill', e.target.value));
      }
      if (this.dom.propX) {
        this.dom.propX.addEventListener('input', (e) => updateSelected('x', e.target.value));
      }
      if (this.dom.propY) {
        this.dom.propY.addEventListener('input', (e) => updateSelected('y', e.target.value));
      }
      if (this.dom.propWidth) {
        this.dom.propWidth.addEventListener('input', (e) => updateSelected('width', e.target.value));
      }
      if (this.dom.propHeight) {
        this.dom.propHeight.addEventListener('input', (e) => updateSelected('height', e.target.value));
      }
    }

    bindCanvasMouseEvents() {
      if (!this.dom.canvas) return;
      let isDragging = false;
      let startX = 0, startY = 0;
      let initialLayerX = 0, initialLayerY = 0;

      this.dom.canvas.addEventListener('mousedown', (e) => {
        const rect = this.dom.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.graphics.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.graphics.height / rect.height);

        // Hit test layers in reverse order (topmost first)
        const hit = [...this.graphics.layers].reverse().find(l => {
          if (!l.visible) return false;
          const x = l.transform ? l.transform.x : 0;
          const y = l.transform ? l.transform.y : 0;
          const w = l.width || 200;
          const h = l.height || 100;
          return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
        });

        if (hit) {
          this.selectLayer(hit.id);
          isDragging = true;
          startX = mouseX;
          startY = mouseY;
          initialLayerX = hit.transform.x;
          initialLayerY = hit.transform.y;
        } else {
          this.selectLayer(null);
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging || !this.selectedLayerId) return;
        const rect = this.dom.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.graphics.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.graphics.height / rect.height);

        const dx = mouseX - startX;
        const dy = mouseY - startY;
        const layer = this.getSelectedLayer();
        if (layer) {
          layer.transform.x = Math.round(initialLayerX + dx);
          layer.transform.y = Math.round(initialLayerY + dy);
          this.updateInspectorValues();
          this.render();
        }
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    initDefaultLayers() {
      // Add default background
      this.graphics.addLayer({
        id: 'layer-bg',
        name: 'Background',
        type: 'shape',
        shapeType: 'rect',
        fill: '#1e293b',
        width: 1280,
        height: 720,
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      });

      // Add default title text
      this.graphics.addLayer({
        id: 'layer-title',
        name: 'Main Title',
        type: 'text',
        content: 'Creative Studio',
        fontSize: 64,
        fontWeight: 700,
        fill: '#ffffff',
        width: 600,
        height: 80,
        transform: { x: 100, y: 150, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      });

      // Add default badge shape
      this.graphics.addLayer({
        id: 'layer-badge',
        name: 'Accent Pill',
        type: 'shape',
        shapeType: 'rect',
        fill: '#b5412b',
        width: 180,
        height: 36,
        borderRadius: 18,
        transform: { x: 100, y: 90, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      });

      // Add subtitle text
      this.graphics.addLayer({
        id: 'layer-sub',
        name: 'Subtitle',
        type: 'text',
        content: 'High-performance client-side creative engine',
        fontSize: 24,
        fontWeight: 400,
        fill: '#94a3b8',
        width: 600,
        height: 40,
        transform: { x: 100, y: 240, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      });

      this.selectLayer('layer-title');
    }

    render() {
      if (!this.dom.ctx || !this.dom.canvas) return;

      // Match canvas internal resolution to current project geometry
      if (this.dom.canvas.width !== this.graphics.width) {
        this.dom.canvas.width = this.graphics.width;
      }
      if (this.dom.canvas.height !== this.graphics.height) {
        this.dom.canvas.height = this.graphics.height;
      }

      // 1. Draw graphic layers
      this.graphics.renderToCanvas(this.dom.ctx);

      // 2. Draw selection bounding box and handles
      const selected = this.getSelectedLayer();
      if (selected && selected.visible !== false) {
        const ctx = this.dom.ctx;
        ctx.save();
        const t = selected.transform || { x: 0, y: 0 };
        const w = selected.width || 200;
        const h = selected.height || 100;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y, w, h);

        // Corner handles
        ctx.fillStyle = '#ffffff';
        const handleSize = 8;
        const corners = [
          [t.x, t.y],
          [t.x + w, t.y],
          [t.x, t.y + h],
          [t.x + w, t.y + h]
        ];
        for (const [cx, cy] of corners) {
          ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
          ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
        }
        ctx.restore();
      }

      this.updateLayersListUI();
    }

    selectLayer(id) {
      this.selectedLayerId = id;
      this.graphics.selectedLayerIds.clear();
      if (id) this.graphics.selectedLayerIds.add(id);
      this.updateInspectorValues();
      this.render();
    }

    getSelectedLayer() {
      return this.graphics.getLayer(this.selectedLayerId);
    }

    updateInspectorValues() {
      const layer = this.getSelectedLayer();
      if (!layer) return;

      if (this.dom.propContent) this.dom.propContent.value = layer.content || '';
      if (this.dom.propFontSize) this.dom.propFontSize.value = layer.fontSize || 32;
      if (this.dom.propFill) this.dom.propFill.value = layer.fill || '#ffffff';
      if (this.dom.propX) this.dom.propX.value = layer.transform ? layer.transform.x : 0;
      if (this.dom.propY) this.dom.propY.value = layer.transform ? layer.transform.y : 0;
      if (this.dom.propWidth) this.dom.propWidth.value = layer.width || 200;
      if (this.dom.propHeight) this.dom.propHeight.value = layer.height || 100;
    }

    updateLayersListUI() {
      if (!this.dom.layersList) return;
      this.dom.layersList.innerHTML = '';

      // Display in reverse order (top layers at top of list)
      [...this.graphics.layers].reverse().forEach(layer => {
        const item = document.createElement('div');
        item.className = 'cs-layer-item' + (layer.id === this.selectedLayerId ? ' active' : '');
        item.innerHTML = `
          <span style="font-weight: 500">${layer.name || layer.id}</span>
          <div class="cs-layer-controls">
            <button class="cs-btn cs-btn-icon" data-action="toggle-vis" title="Visibility">${layer.visible === false ? '👁️‍🗨️' : '👁️'}</button>
            <button class="cs-btn cs-btn-icon" data-action="delete" title="Delete">🗑️</button>
          </div>
        `;

        item.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          this.selectLayer(layer.id);
        });

        const btnVis = item.querySelector('[data-action="toggle-vis"]');
        if (btnVis) {
          btnVis.addEventListener('click', () => {
            layer.visible = layer.visible === false ? true : false;
            this.render();
          });
        }

        const btnDel = item.querySelector('[data-action="delete"]');
        if (btnDel) {
          btnDel.addEventListener('click', () => {
            this.graphics.removeLayer(layer.id);
            if (this.selectedLayerId === layer.id) this.selectedLayerId = null;
            this.render();
          });
        }

        this.dom.layersList.appendChild(item);
      });
    }

    addTextLayer() {
      const count = this.graphics.layers.filter(l => l.type === 'text').length + 1;
      const layer = {
        id: 'layer-text-' + Date.now(),
        name: `Text ${count}`,
        type: 'text',
        content: `Editable Text ${count}`,
        fontSize: 40,
        fontWeight: 600,
        fill: '#ffffff',
        width: 320,
        height: 60,
        transform: { x: 120 + count * 20, y: 120 + count * 20, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      };
      this.graphics.addLayer(layer);
      if (this.commands) {
        this.commands.execute({
          name: 'ADD_TEXT_LAYER',
          execute: () => {
            if (!this.graphics.getLayer(layer.id)) this.graphics.addLayer(layer);
            this.selectLayer(layer.id);
          },
          undo: () => {
            this.graphics.removeLayer(layer.id);
            if (this.selectedLayerId === layer.id) this.selectedLayerId = null;
          }
        });
      }
      this.selectLayer(layer.id);
    }

    addShapeLayer() {
      const count = this.graphics.layers.filter(l => l.type === 'shape').length + 1;
      const layer = {
        id: 'layer-shape-' + Date.now(),
        name: `Shape ${count}`,
        type: 'shape',
        shapeType: 'rect',
        fill: '#3b82f6',
        width: 200,
        height: 120,
        transform: { x: 150 + count * 20, y: 150 + count * 20, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      };
      this.graphics.addLayer(layer);
      if (this.commands) {
        this.commands.execute({
          name: 'ADD_SHAPE_LAYER',
          execute: () => {
            if (!this.graphics.getLayer(layer.id)) this.graphics.addLayer(layer);
            this.selectLayer(layer.id);
          },
          undo: () => {
            this.graphics.removeLayer(layer.id);
            if (this.selectedLayerId === layer.id) this.selectedLayerId = null;
          }
        });
      }
      this.selectLayer(layer.id);
    }

    addImageLayer() {
      const count = this.graphics.layers.filter(l => l.type === 'image').length + 1;
      const layer = {
        id: 'layer-img-' + Date.now(),
        name: `Image ${count}`,
        type: 'image',
        width: 300,
        height: 200,
        transform: { x: 180, y: 180, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      };
      this.graphics.addLayer(layer);
      if (this.commands) {
        this.commands.execute({
          name: 'ADD_IMAGE_LAYER',
          execute: () => {
            if (!this.graphics.getLayer(layer.id)) this.graphics.addLayer(layer);
            this.selectLayer(layer.id);
          },
          undo: () => {
            this.graphics.removeLayer(layer.id);
            if (this.selectedLayerId === layer.id) this.selectedLayerId = null;
          }
        });
      }
      this.selectLayer(layer.id);
    }

    addQrLayer() {
      const vcardText = this.qrEngine.formatVcard({
        fullName: 'Alex Morgan',
        organization: 'AnyConverter Studio',
        email: 'studio@anyconverter.io',
        url: 'https://anyconverter.io'
      });
      const qrRes = this.qrEngine.generateQrSvg(vcardText, { size: 180 });
      const layer = this.graphics.addLayer({
        name: 'vCard QR Code',
        type: 'qr',
        content: vcardText,
        svg: qrRes.svg,
        width: 180,
        height: 180,
        transform: { x: 200, y: 200, scaleX: 1, scaleY: 1, rotationDeg: 0 }
      });
      this.selectLayer(layer.id);
    }

    deleteSelectedLayer() {
      if (!this.selectedLayerId) return;
      this.graphics.removeLayer(this.selectedLayerId);
      this.selectedLayerId = null;
      this.render();
    }

    applyPreset(presetKey) {
      if (GraphicsCanvas.PRESETS[presetKey]) {
        this.graphics.setPreset(presetKey);
        this.project.canvas.width = this.graphics.width;
        this.project.canvas.height = this.graphics.height;
        this.render();
      }
    }

    switchMode(mode) {
      this.currentMode = mode;
      if (mode === 'business-card') {
        this.applyPreset('card-standard-eu');
      } else if (mode === 'thumbnail') {
        this.applyPreset('youtube-thumbnail');
      } else if (mode === 'video') {
        this.applyPreset('youtube-thumbnail');
      }
    }

    switchCardSide(side) {
      this.activeCardSide = side;
      if (this.dom.cardSideFront) this.dom.cardSideFront.classList.toggle('active', side === 'front');
      if (this.dom.cardSideBack) this.dom.cardSideBack.classList.toggle('active', side === 'back');
      this.cardEngine.setActiveSide(side);
      this.render();
    }

    // --- Export Implementations ---

    async exportPng() {
      try {
        const res = await this.graphics.exportPng({ scale: 1.0 });
        if (res && res.dataUrl) {
          this.downloadFile(res.dataUrl, `${this.project.title || 'studio-export'}.png`);
        }
      } catch (err) {
        console.error('Export PNG failed:', err);
      }
    }

    async exportPdf() {
      try {
        // Transfer layers into card engine
        this.cardEngine.sides.front.layers = this.graphics.layers;
        const res = await this.cardEngine.exportPdf();
        if (res && res.blob) {
          const url = URL.createObjectURL(res.blob);
          this.downloadFile(url, `${this.project.title || 'business-card'}.pdf`);
        }
      } catch (err) {
        console.error('Export PDF failed:', err);
      }
    }

    exportQr() {
      try {
        const vcard = this.qrEngine.formatVcard({
          fullName: 'AnyConverter Studio User',
          organization: 'AnyConverter',
          url: 'https://anyconverter.io/creative-studio/'
        });
        const res = this.qrEngine.generateQrSvg(vcard, { size: 300 });
        const blob = new Blob([res.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, 'vcard-qr.svg');
      } catch (err) {
        console.error('Export QR failed:', err);
      }
    }

    async exportVideo(options = {}) {
      try {
        if (this.dom.titleInput) {
          this.project.title = this.dom.titleInput.value;
        }
        if (this.project.scenes && this.project.scenes[this.activeSceneIndex || 0]) {
          this.project.scenes[this.activeSceneIndex || 0].layers = JSON.parse(JSON.stringify(this.graphics.layers));
        }

        const renderOpts = Object.assign({ durationSeconds: 3, fps: 30 }, options);
        const res = await this.renderAdapter.render(this.project, renderOpts);
        this.lastExportResult = res;

        if (res && res.blob) {
          const ext = res.mimeType.includes('webm') ? 'webm' : 'mp4';
          const url = URL.createObjectURL(res.blob);
          this.downloadFile(url, `${this.project.title || 'video-export'}.${ext}`);
        }
        return res;
      } catch (err) {
        console.error('Export Video failed:', err);
        return { success: false, error: err.message };
      }
    }

    // --- Project Storage (.acstudio) ---

    saveProjectArchive() {
      try {
        // Sync graphics layers into canonical scene
        if (this.project.scenes && this.project.scenes[this.activeSceneIndex || 0]) {
          this.project.scenes[this.activeSceneIndex || 0].layers = JSON.parse(JSON.stringify(this.graphics.layers));
        }
        if (this.dom.titleInput) {
          this.project.title = this.dom.titleInput.value;
        }

        const zipBuffer = this.archive.package(this.project, this.assetBlobs);
        const blob = new Blob([zipBuffer], { type: 'application/x-acstudio+zip' });
        this.lastSavedBlob = blob;
        this.lastSavedZip = zipBuffer;

        const url = URL.createObjectURL(blob);
        this.downloadFile(url, `${this.project.title || 'project'}.acstudio`);
        return { success: true, size: zipBuffer.length, blob };
      } catch (err) {
        console.error('Save .acstudio failed:', err);
        alert('Could not package .acstudio project: ' + err.message);
        return { success: false, error: err.message };
      }
    }

    async openProjectArchive(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      try {
        const arrayBuf = await file.arrayBuffer();
        const res = this.archive.unpackage(new Uint8Array(arrayBuf));
        if (res && res.project) {
          this.project = res.project;
          this.assetBlobs = res.assets || new Map();
          this.lastOpenedUnpack = res;

          if (this.dom.titleInput) this.dom.titleInput.value = this.project.title;
          if (res.project.scenes && res.project.scenes[0]) {
            this.graphics.layers = res.project.scenes[0].layers || [];
          }
          this.render();
          console.log('Project restored successfully from .acstudio container!');
          return res;
        }
      } catch (err) {
        console.error('Open .acstudio failed:', err);
        alert('Failed to unpack .acstudio project: ' + err.message);
        return { success: false, error: err.message };
      }
    }

    // --- Timeline & Playback ---

    togglePlayback() {
      this.isPlaying = !this.isPlaying;
      if (this.dom.btnPlay) {
        this.dom.btnPlay.textContent = this.isPlaying ? '⏸️ Pause' : '▶️ Play';
      }

      if (this.isPlaying) {
        this.playbackLoop();
      }
    }

    playbackLoop() {
      if (!this.isPlaying) return;
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.seekFrame(this.currentFrame);
      setTimeout(() => this.playbackLoop(), 1000 / this.fps);
    }

    seekFrame(frame) {
      this.currentFrame = frame;
      if (this.dom.timelineScrubber) this.dom.timelineScrubber.value = frame;
      if (this.dom.frameDisplay) {
        const sec = (frame / this.fps).toFixed(2);
        this.dom.frameDisplay.textContent = `Frame ${frame} / ${this.totalFrames} (${sec}s)`;
      }

      // Animate any keyframed layers
      const timeRatio = frame / this.totalFrames;
      const titleLayer = this.graphics.getLayer('layer-title');
      if (titleLayer) {
        titleLayer.transform.x = Math.round(100 + Math.sin(timeRatio * Math.PI * 2) * 50);
      }
      this.render();
    }

    splitActiveClip() {
      console.log('Clip split at frame', this.currentFrame);
    }

    addNewScene() {
      const count = this.project.scenes.length + 1;
      const newScene = {
        id: `scene-0${count}`,
        name: `Scene ${count}`,
        startFrame: count * 150,
        durationFrames: 150,
        layers: []
      };
      this.project.scenes.push(newScene);
      this.updateScenesUI();
    }

    updateScenesUI() {
      if (!this.dom.scenesTabs) return;
      this.dom.scenesTabs.innerHTML = '';
      this.project.scenes.forEach((scene, idx) => {
        const btn = document.createElement('button');
        btn.className = 'cs-btn' + (idx === this.activeSceneIndex ? ' cs-btn-primary' : '');
        btn.textContent = scene.name;
        btn.addEventListener('click', () => {
          this.activeSceneIndex = idx;
          this.updateScenesUI();
        });
        this.dom.scenesTabs.appendChild(btn);
      });
    }

    undo() {
      if (this.commands && this.commands.undo) {
        this.commands.undo();
        this.render();
      }
    }

    redo() {
      if (this.commands && this.commands.redo) {
        this.commands.redo();
        this.render();
      }
    }

    downloadFile(url, filename) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Auto-mount on load
  window.StudioApp = StudioApp;
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cs-canvas')) {
      window.studioApp = new StudioApp();
      window.studioApp.init();
    }
  });
})();
