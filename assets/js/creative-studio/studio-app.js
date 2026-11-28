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
      this.totalFrames = 720; // 24 seconds @ 30fps default for master SaaS sequence
      this.fps = 30;
      this.zoom = 1.0;
      this.activeCardSide = 'front';
      this.activeSceneIndex = 0;
      this.activeShotIndex = 0;
      this.renderMode = 'production';

      // Core Engines Validation (B11: Never disguise missing dependencies with plain Objects)
      const missing = [];
      const checkEngine = (name, target) => {
        if (!target) missing.push(name);
        return target;
      };

      const GraphicsCanvasClass = checkEngine('GraphicsCanvas', window.GraphicsCanvas);
      const BusinessCardEngineClass = checkEngine('BusinessCardEngine', window.BusinessCardEngine);
      const QrVcardEngineClass = checkEngine('QrVcardEngine', window.QrVcardEngine);
      const AcStudioArchiveClass = checkEngine('AcStudioArchive', window.AcStudioArchive);
      const RenderAdapterClass = checkEngine('NativeCanvasRenderAdapter', window.NativeCanvasRenderAdapter);
      const AnimationEngineClass = checkEngine('AnimationEngine', window.AnimationEngine);

      if (missing.length > 0) {
        const errorMsg = `Creative Studio engine initialization failed: Missing required modules [${missing.join(', ')}].`;
        this._renderMissingDependencyBanner(missing, errorMsg);
        throw new Error(errorMsg);
      }

      this.graphics = new GraphicsCanvasClass({ width: 1280, height: 720 });
      this.cardEngine = new BusinessCardEngineClass();
      this.qrEngine = new QrVcardEngineClass();
      this.archive = new AcStudioArchiveClass();
      this.renderAdapter = new RenderAdapterClass();
      this.animation = new AnimationEngineClass();

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
      this.cachedDirectionProjects = {};
    }

    _renderMissingDependencyBanner(missing, msg) {
      if (typeof document === 'undefined') return;
      const existing = document.getElementById('cs-dependency-error');
      if (existing) return;
      const banner = document.createElement('div');
      banner.id = 'cs-dependency-error';
      banner.className = 'cs-alert cs-alert-error';
      banner.setAttribute('role', 'alert');
      banner.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:99999;background:#ef4444;color:#fff;padding:12px 20px;border-radius:8px;font-family:sans-serif;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
      banner.textContent = msg;
      document.body.appendChild(banner);
    }

    init() {
      if (this.initialized) return;
      this.cacheDom();
      this.layoutEditor = window.StudioLayoutEditor ? new window.StudioLayoutEditor(this) : null;
      this.typographyEditor = window.StudioTypographyEditor ? new window.StudioTypographyEditor(this) : null;
      this.motionEditor = window.StudioMotionEditor ? new window.StudioMotionEditor(this) : null;
      this.bindEvents();
      window.StudioFonts?.prepare().then(() => {
        this.typographyEditor?.sync();
        this.render();
      });
      this.initDefaultLayers();
      this.currentMode = 'video';
      this.updateModeUI('video');
      if (this.dom.modeSelect) this.dom.modeSelect.value = 'video';
      if (window.CreativeDirector) {
        this.initCinematicSequence('cinematic-saas');
      }
      this.render();
      this.initialized = true;
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
        btnExportDraft: document.getElementById('cs-btn-export-draft'),
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
        cardSideBack: document.getElementById('cs-card-side-back'),
        directionSelect: document.getElementById('cs-direction-select'),
        renderModeSelect: document.getElementById('cs-render-mode-select'),
        shotSelect: document.getElementById('cs-shot-select'),
        btnShotMoveUp: document.getElementById('cs-btn-shot-move-up'),
        btnShotMoveDown: document.getElementById('cs-btn-shot-move-down'),
        shotHeadline: document.getElementById('cs-shot-headline'),
        shotSubhead: document.getElementById('cs-shot-subhead'),
        shotAccent: document.getElementById('cs-shot-accent'),
        shotDuration: document.getElementById('cs-shot-duration'),
        shotMotifSelect: document.getElementById('cs-shot-motif-select'),
        shotSuitabilityAlert: document.getElementById('cs-shot-suitability-alert'),
        shotSuitabilityMsg: document.getElementById('cs-shot-suitability-msg'),
        brandModeSelect: document.getElementById('cs-brand-mode'),
        btnMobileInspector: document.getElementById('cs-btn-mobile-inspector'),
        btnCloseInspector: document.getElementById('cs-btn-close-inspector'),
        sidebarRight: document.getElementById('cs-sidebar-right'),
        shotsList: document.getElementById('cs-shots-list'),
        timelineVideoTrack: document.getElementById('cs-timeline-video-track'),
        tabBtnShots: document.getElementById('cs-tab-btn-shots'),
        presetContainer: document.getElementById('cs-preset-container'),
        inspectorVideoGroup: document.getElementById('cs-inspector-video-group'),
        inspectorLayerGroup: document.getElementById('cs-inspector-layer-group'),
        inspectorVcardGroup: document.getElementById('cs-inspector-vcard-group')
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
        this.dom.btnSave.addEventListener('click', async () => {
          if (this.hasParrotMotion()) {
            try {
              const { asset, archiveBytes } = window.StudioPuppet;
              if (!this.assetBlobs.has(asset.id)) this.assetBlobs.set(asset.id, await archiveBytes());
            } catch (error) {
              this.motionEditor?.showError(error);
              return;
            }
          }
          this.saveProjectArchive();
        });
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
        this.dom.btnExportVideo.addEventListener('click', () => this.exportVideo({ requirePublishable: true }));
      }
      if (this.dom.btnExportDraft) {
        this.dom.btnExportDraft.addEventListener('click', () => this.exportVideo({ isDraft: true, requirePublishable: false }));
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

      // Visual Direction & Render Mode
      if (this.dom.directionSelect) {
        this.dom.directionSelect.addEventListener('change', (e) => this.switchArtDirection(e.target.value));
      }
      if (this.dom.renderModeSelect) {
        this.dom.renderModeSelect.addEventListener('change', (e) => this.switchRenderMode(e.target.value));
      }

      // Cinematic Shot Editor
      if (this.dom.shotSelect) {
        this.dom.shotSelect.addEventListener('change', (e) => this.selectShot(parseInt(e.target.value, 10)));
      }
      if (this.dom.btnShotMoveUp) {
        this.dom.btnShotMoveUp.addEventListener('click', () => {
          if (this.activeShotIndex > 0) {
            this.moveShot(this.activeShotIndex, this.activeShotIndex - 1);
          }
        });
      }
      if (this.dom.btnShotMoveDown) {
        this.dom.btnShotMoveDown.addEventListener('click', () => {
          if (this.project.shots && this.activeShotIndex < this.project.shots.length - 1) {
            this.moveShot(this.activeShotIndex, this.activeShotIndex + 1);
          }
        });
      }
      if (this.dom.shotHeadline) {
        this.dom.shotHeadline.addEventListener('input', (e) => {
          this.updateActiveShot('headline', e.target.value);
          this.checkActiveShotSuitability();
        });
      }
      if (this.dom.shotSubhead) {
        this.dom.shotSubhead.addEventListener('input', (e) => {
          this.updateActiveShot('subhead', e.target.value);
          this.updateMotionTimeline(this.totalFrames);
          this.checkActiveShotSuitability();
        });
      }
      if (this.dom.shotAccent) {
        this.dom.shotAccent.addEventListener('input', (e) => this.updateActiveShot('accentColor', e.target.value));
      }
      if (this.dom.shotDuration) {
        this.dom.shotDuration.addEventListener('input', (e) => this.updateActiveShot('durationFrames', parseInt(e.target.value, 10) || 60));
      }
      if (this.dom.shotMotifSelect) {
        this.dom.shotMotifSelect.addEventListener('change', (e) => {
          this.updateActiveShot('motif', e.target.value);
          this.checkActiveShotSuitability();
        });
      }
      if (this.dom.brandModeSelect) {
        this.dom.brandModeSelect.addEventListener('change', (e) => {
          const mode = e.target.value;
          this.project.brandMode = mode;
          if (this.project.shots && this.project.shots.length > 0) {
            const lastShot = this.project.shots[this.project.shots.length - 1];
            if (lastShot) {
              lastShot.motif = (mode === 'unbranded') ? 'unbranded-conclusion' : 'branded-payoff';
            }
          }
          this.updateShotInspectorUI();
          this.render();
        });
      }

      // Mobile Inspector Toggle
      if (this.dom.btnMobileInspector && this.dom.sidebarRight) {
        this.dom.btnMobileInspector.addEventListener('click', () => {
          this.dom.sidebarRight.classList.toggle('mobile-open');
        });
      }
      if (this.dom.btnCloseInspector && this.dom.sidebarRight) {
        this.dom.btnCloseInspector.addEventListener('click', () => {
          this.dom.sidebarRight.classList.remove('mobile-open');
        });
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
        if (this.currentMode === 'video' && this.project.shots?.length) return;
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

    initCinematicSequence(directionKey = 'cinematic-saas') {
      if (!window.CreativeDirector) return;

      // Save deep copy of current sequence state before switching
      if (this.project && this.project.visualDirection && this.project.shots) {
        this.cachedDirectionProjects[this.project.visualDirection] = {
          title: this.project.title,
          visualDirection: this.project.visualDirection,
          totalFrames: this.project.totalFrames,
          fps: this.project.fps,
          durationSeconds: this.project.durationSeconds,
          canvas: Object.assign({}, this.project.canvas),
          shots: this.project.shots.map(s => new window.ReferenceShot(s)),
          audioClips: this.project.audioClips
        };
      }

      let cached = this.cachedDirectionProjects[directionKey];
      let seq;
      if (cached) {
        seq = {
          title: cached.title,
          visualDirection: cached.visualDirection,
          totalFrames: cached.totalFrames,
          fps: cached.fps,
          durationSeconds: cached.durationSeconds,
          canvas: Object.assign({}, cached.canvas),
          shots: cached.shots.map(s => new window.ReferenceShot(s)),
          audioClips: cached.audioClips
        };
      } else {
        if (directionKey === 'motion-showreel') {
          seq = window.StudioMotionShowreel.create(this.project.locale);
        } else if (directionKey === 'character-comedy') {
          seq = window.CreativeDirector.createParrotComedyPilot();
        } else if (directionKey === 'minimal-suspense') {
          seq = window.CreativeDirector.createMinimalSuspensePilot();
        } else {
          seq = window.CreativeDirector.createMasterSaaSSequence();
        }
        this.cachedDirectionProjects[directionKey] = {
          title: seq.title,
          visualDirection: directionKey,
          totalFrames: seq.totalFrames,
          fps: seq.fps,
          durationSeconds: seq.durationSeconds,
          canvas: Object.assign({}, seq.canvas),
          shots: seq.shots.map(s => new window.ReferenceShot(s)),
          audioClips: seq.audioClips
        };
      }

      this.project.title = seq.title;
      this.project.kind = 'cinematic';
      this.project.visualDirection = directionKey;
      this.project.renderMode = this.renderMode || 'production';
      this.project.totalFrames = seq.totalFrames;
      this.project.fps = seq.fps;
      this.project.durationSeconds = seq.durationSeconds;
      this.project.canvas = Object.assign({}, seq.canvas);
      this.project.shots = seq.shots;
      this.project.audioClips = seq.audioClips;
      this.prepareMotionAssets();

      this.totalFrames = seq.totalFrames;
      this.fps = seq.fps;
      this.currentFrame = 0;
      this.activeShotIndex = 0;

      if (this.dom.titleInput) this.dom.titleInput.value = seq.title;
      if (this.dom.timelineScrubber) {
        this.dom.timelineScrubber.max = this.totalFrames - 1;
        this.dom.timelineScrubber.value = 0;
      }
      if (this.dom.directionSelect) {
        this.dom.directionSelect.value = directionKey;
      }
      if (this.dom.renderModeSelect) {
        this.dom.renderModeSelect.value = this.renderMode;
      }

      this.updateShotSelectOptions();
      this.updateShotInspectorUI();
      this.updateShotsListUI();
      this.updateTimelineTracks();
      this.seekFrame(0);
    }

    hasParrotMotion() {
      return this.project.shots?.some(shot => shot.customData?.motion?.puppet === 'parrot');
    }

    prepareMotionAssets() {
      if (this.hasParrotMotion()) {
        window.StudioPuppet.prepare(this.assetBlobs.get(window.StudioPuppet.asset.id)).then(() => this.render()).catch(error => this.motionEditor?.showError(error));
      }
    }

    switchArtDirection(directionKey) {
      this.initCinematicSequence(directionKey);
      this.render();
    }

    switchRenderMode(mode) {
      this.renderMode = mode;
      this.project.renderMode = mode;
      this.render();
    }

    selectShot(shotIndex) {
      if (!this.project.shots || !this.project.shots[shotIndex]) return;
      this.activeShotIndex = shotIndex;
      const shot = this.project.shots[shotIndex];
      this.updateShotInspectorUI();
      this.updateShotsListUI();
      this.updateTimelineTracks();
      this.seekFrame(shot.startFrame);
    }

    updateActiveShot(field, value) {
      if (!this.project.shots || !this.project.shots[this.activeShotIndex]) return;
      const shot = this.project.shots[this.activeShotIndex];
      shot[field] = value;

      if (field === 'durationFrames') {
        let acc = 0;
        for (let i = 0; i < this.project.shots.length; i++) {
          this.project.shots[i].startFrame = acc;
          acc += this.project.shots[i].durationFrames;
        }
        this.totalFrames = acc;
        this.project.totalFrames = acc;
        this.project.durationSeconds = acc / this.fps;
        if (this.project.scenes && this.project.scenes[0]) {
          this.project.scenes[0].durationFrames = acc;
        }
        if (this.dom.timelineScrubber) this.dom.timelineScrubber.max = this.totalFrames - 1;
        this.updateShotSelectOptions();
        this.updateTimelineTracks();
        this.typographyEditor?.sync();
      }

      this.updateShotsListUI();
      this.render();
    }

    moveShot(fromIndex, toIndex) {
      if (!this.project.shots || !Array.isArray(this.project.shots)) return false;
      const count = this.project.shots.length;
      if (fromIndex < 0 || fromIndex >= count) return false;
      if (toIndex < 0 || toIndex >= count) return false;
      if (fromIndex === toIndex) return false;

      // Move complete shot object
      const movedShot = this.project.shots.splice(fromIndex, 1)[0];
      this.project.shots.splice(toIndex, 0, movedShot);

      // Recalculate startFrame sequentially for all shots
      let acc = 0;
      for (let i = 0; i < this.project.shots.length; i++) {
        this.project.shots[i].startFrame = acc;
        acc += this.project.shots[i].durationFrames;
      }
      this.totalFrames = acc;
      this.project.totalFrames = acc;
      this.project.durationSeconds = acc / (this.fps || 30);
      if (this.project.scenes && this.project.scenes[0]) {
        this.project.scenes[0].durationFrames = acc;
      }
      if (this.dom.timelineScrubber) {
        this.dom.timelineScrubber.max = this.totalFrames - 1;
      }

      // Sync activeShotIndex to new index of moved shot
      this.activeShotIndex = toIndex;

      // Update cached direction project if exists
      if (this.cachedDirectionProjects && this.project.visualDirection) {
        this.cachedDirectionProjects[this.project.visualDirection] = {
          title: this.project.title,
          visualDirection: this.project.visualDirection,
          totalFrames: this.project.totalFrames,
          fps: this.project.fps,
          durationSeconds: this.project.durationSeconds,
          canvas: Object.assign({}, this.project.canvas),
          shots: this.project.shots.map(s => new window.ReferenceShot(s)),
          audioClips: this.project.audioClips
        };
      }

      // Refresh UI components
      this.updateShotSelectOptions();
      this.updateShotInspectorUI();
      this.updateShotsListUI();
      this.updateTimelineTracks();

      // Seek playhead to start of moved shot and render preview
      const targetShot = this.project.shots[toIndex];
      this.seekFrame(targetShot ? targetShot.startFrame : 0);
      this.render();
      return true;
    }

    updateShotSelectOptions() {
      if (!this.dom.shotSelect || !this.project.shots) return;
      this.dom.shotSelect.innerHTML = '';
      this.project.shots.forEach((s, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Shot ${idx + 1}: ${s.title || s.purpose} (${s.durationFrames}f)`;
        if (idx === this.activeShotIndex) opt.selected = true;
        this.dom.shotSelect.appendChild(opt);
      });
    }

    updateShotInspectorUI() {
      if (!this.project.shots || !this.project.shots[this.activeShotIndex]) return;
      const shot = this.project.shots[this.activeShotIndex];
      if (this.dom.shotSelect) this.dom.shotSelect.value = this.activeShotIndex;
      if (this.dom.shotHeadline) this.dom.shotHeadline.value = shot.headline || '';
      if (this.dom.shotSubhead) this.dom.shotSubhead.value = shot.subhead || '';
      if (this.dom.shotAccent) this.dom.shotAccent.value = shot.accentColor || '#38bdf8';
      if (this.dom.shotDuration) this.dom.shotDuration.value = shot.durationFrames || 90;
      if (this.dom.shotMotifSelect) this.dom.shotMotifSelect.value = shot.motif || 'default';
      if (this.dom.brandModeSelect) {
        this.dom.brandModeSelect.value = (shot.motif === 'unbranded-conclusion' || this.project.brandMode === 'unbranded')
          ? 'unbranded'
          : 'branded';
      }
      if (this.dom.btnShotMoveUp) {
        const canMoveUp = this.activeShotIndex > 0;
        this.dom.btnShotMoveUp.disabled = !canMoveUp;
        this.dom.btnShotMoveUp.style.opacity = canMoveUp ? '1' : '0.4';
        this.dom.btnShotMoveUp.style.cursor = canMoveUp ? 'pointer' : 'not-allowed';
      }
      if (this.dom.btnShotMoveDown) {
        const canMoveDown = this.project.shots && this.activeShotIndex < (this.project.shots.length - 1);
        this.dom.btnShotMoveDown.disabled = !canMoveDown;
        this.dom.btnShotMoveDown.style.opacity = canMoveDown ? '1' : '0.4';
        this.dom.btnShotMoveDown.style.cursor = canMoveDown ? 'pointer' : 'not-allowed';
      }
      this.typographyEditor?.sync();
      this.motionEditor?.sync();
      this.checkActiveShotSuitability();
    }

    checkActiveShotSuitability() {
      if (!this.project.shots || !this.project.shots[this.activeShotIndex]) return;
      const shot = this.project.shots[this.activeShotIndex];
      const evalResult = (window.ReferenceShot && window.ReferenceShot.evaluateSuitability)
        ? window.ReferenceShot.evaluateSuitability(shot)
        : { suitable: true };

      if (this.dom.shotSuitabilityAlert) {
        if (!evalResult.suitable) {
          this.dom.shotSuitabilityAlert.style.display = 'block';
          if (this.dom.shotSuitabilityMsg) {
            this.dom.shotSuitabilityMsg.textContent = evalResult.reason;
          }
        } else {
          this.dom.shotSuitabilityAlert.style.display = 'none';
        }
      }
    }

    updateShotsListUI() {
      if (!this.dom.shotsList || !this.project.shots) return;
      this.dom.shotsList.innerHTML = '';
      const totalCount = this.project.shots.length;
      this.project.shots.forEach((s, idx) => {
        const item = document.createElement('div');
        item.className = 'cs-shot-item' + (idx === this.activeShotIndex ? ' active' : '');
        item.style.position = 'relative';
        item.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:12px;color:var(--cs-text-main, #f8fafc);" data-shot-title></span>
            <div style="display:flex;align-items:center;gap:4px;">
              <span class="cs-badge" style="font-size:10px;padding:1px 5px;">${Number(s.durationFrames)}f</span>
              <button type="button" class="cs-btn cs-btn-icon cs-shot-move-up-item" data-index="${idx}" title="Move Shot Up" style="width:20px;height:20px;font-size:10px;padding:0;line-height:1;${idx === 0 ? 'opacity:0.3;cursor:not-allowed;' : ''}" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button type="button" class="cs-btn cs-btn-icon cs-shot-move-down-item" data-index="${idx}" title="Move Shot Down" style="width:20px;height:20px;font-size:10px;padding:0;line-height:1;${idx === totalCount - 1 ? 'opacity:0.3;cursor:not-allowed;' : ''}" ${idx === totalCount - 1 ? 'disabled' : ''}>▼</button>
            </div>
          </div>
          <div style="font-size:11px;color:var(--cs-text-muted, #94a3b8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;" data-shot-headline></div>
        `;

        item.querySelector('[data-shot-title]').textContent = `Shot ${idx + 1}: ${s.title || s.purpose}`;
        item.querySelector('[data-shot-headline]').textContent = s.headline || '';
        item.addEventListener('click', (e) => {
          if (e.target.closest('.cs-shot-move-up-item') || e.target.closest('.cs-shot-move-down-item')) return;
          this.selectShot(idx);
        });

        const btnUp = item.querySelector('.cs-shot-move-up-item');
        if (btnUp && idx > 0) {
          btnUp.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveShot(idx, idx - 1);
          });
        }

        const btnDown = item.querySelector('.cs-shot-move-down-item');
        if (btnDown && idx < totalCount - 1) {
          btnDown.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveShot(idx, idx + 1);
          });
        }

        this.dom.shotsList.appendChild(item);
      });
    }

    updateTimelineTracks() {
      if (!this.dom.timelineVideoTrack || !this.project.shots) return;
      this.dom.timelineVideoTrack.innerHTML = '';
      const totalF = this.totalFrames || 720;
      this.project.shots.forEach((s, idx) => {
        const block = document.createElement('div');
        block.className = 'cs-shot-block' + (idx === this.activeShotIndex ? ' active' : '');
        const pct = ((s.durationFrames / totalF) * 100).toFixed(2);
        block.style.width = `${pct}%`;
        block.title = `Shot ${idx + 1}: ${s.title || s.purpose} (${s.durationFrames}f)`;
        block.innerHTML = `
          <span class="cs-shot-block-label" data-shot-title></span>
          <span style="font-size:9px;opacity:0.8;">${Number(s.durationFrames)}f</span>
        `;
        block.querySelector('[data-shot-title]').textContent = `Shot ${idx + 1}: ${s.title || s.purpose}`;
        block.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectShot(idx);
        });
        this.dom.timelineVideoTrack.appendChild(block);
      });
      this.updateMotionTimeline(totalF);
    }

    updateMotionTimeline(totalFrames) {
      const captionTrack = document.getElementById('cs-motion-caption-track');
      const audioTrack = document.getElementById('cs-motion-audio-track');
      if (!captionTrack || !audioTrack) return;
      const visible = this.project.shots.some(shot => shot.customData?.motion?.version === 1);
      captionTrack.hidden = audioTrack.hidden = !visible;
      audioTrack.parentElement.querySelector('.cs-legacy-audio-track').hidden = visible;
      if (!visible) return;
      captionTrack.replaceChildren();
      audioTrack.replaceChildren();
      const blocks = (host, label, start, duration) => {
        const block = document.createElement('button');
        block.type = 'button';
        block.className = 'cs-clip cs-motion-clip';
        block.style.left = 100 * start / totalFrames + '%';
        block.style.width = 100 * Math.max(0, Math.min(duration, totalFrames - start)) / totalFrames + '%';
        block.textContent = block.title = label;
        block.addEventListener('click', () => this.seekFrame(Math.min(totalFrames - 1, Math.round(start))));
        host.append(block);
      };
      for (const shot of this.project.shots) {
        if (!shot.subhead) continue;
        const caption = shot.customData?.typography?.caption;
        const start = Math.max(0, caption?.startFrame || 0);
        const end = Math.min(shot.durationFrames, caption?.endFrame || shot.durationFrames);
        blocks(captionTrack, shot.subhead, shot.startFrame + start, Math.max(1, end - start));
      }
      for (const clip of this.project.audioClips || []) {
        const names = {
          inbox: ['Inbox music', 'Música del buzón', 'Indboksmusik'],
          delivery: ['Delivery music', 'Música del envío', 'Leveringsmusik'],
          hall: ['Hall ambience', 'Ambiente del pasillo', 'Gangens baggrundslyd'],
          'door-hit': ['Door impact', 'Golpe de puerta', 'Dørslag']
        };
        const language = Math.max(0, ['en', 'es', 'da'].indexOf(this.project.locale));
        blocks(audioTrack, names[clip.clipId]?.[language] || clip.clipId, clip.startSample * this.fps / 48000,
          clip.durationSamples * this.fps / 48000);
      }
    }

    render() {
      if (!this.dom.ctx || !this.dom.canvas) return;

      const cinematic = this.currentMode === 'video' && window.CreativeDirector?.isCreativeProject(this.project);
      const { width, height } = cinematic ? this.project.canvas : this.graphics;

      // Match canvas internal resolution to current project geometry
      if (this.dom.canvas.width !== width) {
        this.dom.canvas.width = width;
      }
      if (this.dom.canvas.height !== height) {
        this.dom.canvas.height = height;
      }

      // Check if project is a Cinematic sequence
      if (cinematic) {
        const resolved = window.CreativeDirector.renderFrame(
          this.dom.ctx,
          this.project,
          this.currentFrame,
          this.totalFrames,
          width,
          height,
          { mode: this.renderMode || 'production', reducedMotionPreview: this.motionEditor?.reduced }
        );
        this.layoutEditor?.afterRender(resolved);
        this.motionEditor?.afterRender(resolved);
        return;
      }

      this.motionEditor?.afterRender();

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

      this.layoutEditor?.fit();
      this.dom.canvas.classList.remove('cs-layout-draggable');
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
      this.updateModeUI(mode);
      if (mode === 'business-card') {
        this.applyPreset('card-standard-eu');
      } else if (mode === 'thumbnail') {
        this.applyPreset('youtube-thumbnail');
      } else if (mode === 'video') {
        this.applyPreset('youtube-thumbnail');
      }
    }

    updateModeUI(mode) {
      const isVideo = (mode === 'video');
      const isCard = (mode === 'business-card');

      if (this.dom.presetContainer) {
        this.dom.presetContainer.style.display = isVideo ? 'none' : 'inline-block';
      }
      if (this.dom.directionSelect) {
        this.dom.directionSelect.style.display = isVideo ? 'inline-block' : 'none';
      }
      if (this.dom.renderModeSelect) {
        this.dom.renderModeSelect.style.display = isVideo ? 'inline-block' : 'none';
      }
      if (this.dom.cardSideToggle) {
        this.dom.cardSideToggle.style.display = isCard ? 'inline-flex' : 'none';
      }
      if (this.dom.inspectorVideoGroup) {
        this.dom.inspectorVideoGroup.style.display = isVideo ? 'block' : 'none';
      }
      if (this.dom.inspectorLayerGroup) {
        this.dom.inspectorLayerGroup.style.display = isVideo ? 'none' : 'block';
      }
      if (this.dom.inspectorVcardGroup) {
        this.dom.inspectorVcardGroup.style.display = isCard ? 'block' : 'none';
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
        if (this.currentMode === 'video' && window.CreativeDirector?.isCreativeProject(this.project)) {
          if (this.project.shots?.some(shot => shot.customData?.typography?.version === 1)) await window.StudioFonts.prepare();
          const output = document.createElement('canvas');
          const { width, height } = this.project.canvas;
          output.width = width;
          output.height = height;
          window.CreativeDirector.renderFrame(output.getContext('2d'), this.project, this.currentFrame,
            this.totalFrames, width, height, { mode: 'production' });
          this.downloadFile(output.toDataURL('image/png'), `${this.project.title || 'studio-export'}.png`);
          return;
        }
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

    syncLayoutSoundtrack() {
      if (!this.project.shots?.some(shot => shot.customData?.layout?.version === 1)) return;
      const builtinThemes = new Map([
        ['saas-master-audio', 'saas'], ['parrot-comedy-audio', 'comedy'], ['noir-suspense-audio', 'suspense']
      ]);
      const frames = this.totalFrames;
      const samples = Math.round(frames * 48000 / this.fps);
      for (const clip of this.project.audioClips || []) {
        const theme = builtinThemes.get(clip.clipId);
        if (!theme || clip.startSample !== 0 || clip.durationSamples === samples) continue;
        clip.pcmData = window.CreativeDirector.synthesizeAudibleAudio(frames / this.fps, theme, 48000);
        clip.durationSamples = samples;
        clip.theme = theme;
      }
    }

    async exportVideo(options = {}) {
      try {
        if (this.dom.titleInput) {
          this.project.title = this.dom.titleInput.value;
        }

        const isDraft = options.isDraft === true;
        const requirePublishable = options.requirePublishable !== undefined ? options.requirePublishable : !isDraft;

        // Pre-Export Semantic Suitability & Publishability Guard (for cinematic-saas direction)
        const isSaaSProject = !this.project.visualDirection || this.project.visualDirection === 'cinematic-saas';
        if (isSaaSProject && this.project.shots && window.ReferenceShot && window.ReferenceShot.evaluateSuitability) {
          for (let i = 0; i < this.project.shots.length; i++) {
            const shot = this.project.shots[i];
            const evalResult = window.ReferenceShot.evaluateSuitability(shot);

            // 1. Strict Concept Mismatch Block: Prevent publishing mismatched videos in both production and draft
            if (evalResult.isSuitable === false) {
              const errorMsg = `Export Blocked: Concept Mismatch in Shot ${i + 1} ("${(shot.headline || '').slice(0, 30)}..."). Narrative copy discusses a topic not illustrated by the active graphic motif. Please select a matching motif or switch to placeholder before exporting.`;
              console.warn(errorMsg);
              if (this.dom.shotSuitabilityAlert) {
                this.dom.shotSuitabilityAlert.style.display = 'block';
                if (this.dom.shotSuitabilityMsg) {
                  this.dom.shotSuitabilityMsg.textContent = errorMsg;
                }
              }
              if (typeof alert === 'function' && !options.silent) {
                alert(errorMsg);
              }
              return { success: false, blocked: true, isDraft, error: errorMsg };
            }

            // 2. Publishable Requirement Block: Deny normal production export if placeholders exist
            if (requirePublishable && evalResult.isPublishable === false) {
              const errorMsg = `Export Blocked: Shot ${i + 1} contains unillustrated storyboard placeholders and cannot be exported as a publishable release. Use 'Export Draft' or select an illustrated motif.`;
              console.warn(errorMsg);
              if (this.dom.shotSuitabilityAlert) {
                this.dom.shotSuitabilityAlert.style.display = 'block';
                if (this.dom.shotSuitabilityMsg) {
                  this.dom.shotSuitabilityMsg.textContent = errorMsg;
                }
              }
              if (typeof alert === 'function' && !options.silent) {
                alert(errorMsg);
              }
              return { success: false, blocked: true, isDraft: false, error: errorMsg };
            }
          }
        }

        if (this.project.scenes && this.project.scenes[this.activeSceneIndex || 0]) {
          this.project.scenes[this.activeSceneIndex || 0].layers = JSON.parse(JSON.stringify(this.graphics.layers));
        }

        const durationSeconds = options.durationSeconds || (this.currentMode === 'video' && this.project.shots?.length ? this.totalFrames / this.fps : this.project.durationSeconds) || this.totalFrames / this.fps || 24;
        const renderOpts = Object.assign({
          durationSeconds,
          fps: this.fps,
          width: this.project.canvas.width,
          height: this.project.canvas.height
        }, options);

        this.syncLayoutSoundtrack();
        const res = await this.renderAdapter.render(this.project, renderOpts, (prog) => {
          if (this.dom.exportProgressBar && this.dom.exportProgressText) {
            this.dom.exportProgressBar.style.width = `${prog.percent}%`;
            this.dom.exportProgressText.textContent = `Rendering frame ${prog.frame} / ${prog.totalFrames} (${prog.percent}%)`;
          }
        });
        this.lastExportResult = res;

        if (res && res.blob) {
          const ext = res.mimeType.includes('webm') ? 'webm' : 'mp4';
          const prefix = isDraft ? '[DRAFT]_' : '';
          const url = URL.createObjectURL(res.blob);
          this.downloadFile(url, `${prefix}${this.project.title || 'video-export'}.${ext}`);
        }
        if (res) {
          res.isDraft = isDraft;
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

        // Clean serialization of cinematic shots
        if (this.project.shots) {
          this.project.shots = this.project.shots.map(s => ({
            id: s.id,
            purpose: s.purpose,
            title: s.title,
            startFrame: s.startFrame,
            durationFrames: s.durationFrames,
            headline: s.headline,
            subhead: s.subhead,
            badge: s.badge,
            accentColor: s.accentColor,
            secondaryColor: s.secondaryColor,
            backgroundColor: s.backgroundColor,
            directorNotes: s.directorNotes,
            artDirection: s.artDirection,
            cameraMove: s.cameraMove,
            motif: s.motif || 'default',
            motifTitle: s.motifTitle || '',
            customData: s.customData || {}
          }));
        }

        // Schema coherence: sync scenes duration to total cinematic frames
        if (this.project.scenes && this.project.scenes[0]) {
          this.project.scenes[0].durationFrames = this.totalFrames;
        }

        // Clean serialization of audio clips (avoid massive raw Float32Array in JSON)
        this.syncLayoutSoundtrack();
        const savedAudioClips = (this.project.audioClips || []).map(c => ({
          clipId: c.clipId,
          startSample: c.startSample,
          durationSamples: c.durationSamples,
          volume: c.volume,
          theme: c.theme || (this.project.visualDirection === 'character-comedy' ? 'comedy' : (this.project.visualDirection === 'minimal-suspense' ? 'suspense' : 'saas'))
        }));
        const projectToPackage = Object.assign({}, this.project, {
          brandMode: this.project.brandMode || 'branded',
          audioClips: savedAudioClips
        });

        const binaryAssets = new Map(this.assetBlobs);
        if (this.hasParrotMotion()) {
          const { asset } = window.StudioPuppet;
          if (!binaryAssets.has(asset.id)) throw new Error('The parrot atlas is unavailable for save.');
          if (!projectToPackage.assets?.some(entry => entry.id === asset.id)) {
            projectToPackage.assets = [...(projectToPackage.assets || []), asset];
          }
        }
        const zipBuffer = this.archive.package(projectToPackage, binaryAssets);
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
          if (res.project.shots?.some(shot => shot.customData?.typography?.version === 1)) await window.StudioFonts.prepare();
          this.project = res.project;
          this.assetBlobs = res.assets || new Map();
          this.lastOpenedUnpack = res;

          if (this.dom.titleInput) this.dom.titleInput.value = this.project.title;

          // Restore Cinematic Sequence if present
          if (this.project.visualDirection && window.CreativeDirector) {
            this.currentMode = 'video';
            this.updateModeUI('video');
            if (this.dom.modeSelect) this.dom.modeSelect.value = 'video';
            if (this.dom.directionSelect) this.dom.directionSelect.value = this.project.visualDirection;
            this.totalFrames = this.project.totalFrames || 720;
            this.fps = this.project.fps || 30;
            if (this.dom.timelineScrubber) {
              this.dom.timelineScrubber.max = this.totalFrames - 1;
              this.dom.timelineScrubber.value = 0;
            }
            if (this.project.shots && window.ReferenceShot) {
              this.project.shots = this.project.shots.map(s => new window.ReferenceShot(s));
              this.prepareMotionAssets();
            }
            if (this.project.audioClips && window.CreativeDirector) {
              this.project.audioClips.forEach(c => {
                if (!c.pcmData) {
                  const theme = c.theme || (this.project.visualDirection === 'character-comedy' ? 'comedy' : (this.project.visualDirection === 'minimal-suspense' ? 'suspense' : 'saas'));
                  const durSec = c.durationSamples ? c.durationSamples / 48000 : 24;
                  c.pcmData = window.CreativeDirector.synthesizeAudibleAudio(durSec, theme, 48000);
                }
              });
            }
            this.cachedDirectionProjects[this.project.visualDirection] = this.project;
            this.activeShotIndex = 0;
            this.updateShotSelectOptions();
            this.updateShotInspectorUI();
            this.updateShotsListUI();
            this.updateTimelineTracks();
            this.seekFrame(0);
          } else if (res.project.scenes && res.project.scenes[0]) {
            this.graphics.layers = res.project.scenes[0].layers || [];
          }
          this.render();
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

      // Track active shot index in cinematic project
      if (this.project.shots && this.project.shots.length > 0) {
        for (let i = 0; i < this.project.shots.length; i++) {
          const s = this.project.shots[i];
          if (frame >= s.startFrame && (frame < s.startFrame + s.durationFrames || i === this.project.shots.length - 1)) {
            if (this.activeShotIndex !== i) {
              this.activeShotIndex = i;
              this.updateShotInspectorUI();
              this.updateShotsListUI();
              this.updateTimelineTracks();
            }
            break;
          }
        }
      }

      // Animate any keyframed layers (fallback mode)
      const timeRatio = frame / this.totalFrames;
      const titleLayer = this.graphics.getLayer('layer-title');
      if (titleLayer) {
        titleLayer.transform.x = Math.round(100 + Math.sin(timeRatio * Math.PI * 2) * 50);
      }
      this.render();
    }

    splitActiveClip() {
      // Split clip at current playhead position
      if (this.currentScene && this.timeline) {
        this.timeline.splitClip('track-v1', 'active-clip', this.currentFrame);
      }
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
      window.app = window.studioApp;
      window.studioApp.init();
    }
  });
})();
