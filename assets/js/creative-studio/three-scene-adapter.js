/**
 * AnyConverter Creative Studio — Three.js 3D Scene Graph Adapter
 * Manages glTF character models, WebGL camera/lighting, model keyframe animations,
 * timeline synchronization, and context loss recovery with 2D fallback.
 */

class ThreeSceneAdapter {
  constructor(options = {}) {
    this.models = new Map();
    this.canvas = options.canvas || null;
    this.width = options.width || 1280;
    this.height = options.height || 720;
    this.cameraSpec = options.camera || { fov: 45, position: [0, 1.5, 4], target: [0, 1, 0] };
    this.lights = options.lights || [
      { type: 'ambient', color: '#ffffff', intensity: 0.8 },
      { type: 'directional', color: '#ffffff', intensity: 1.5, position: [5, 10, 7.5] }
    ];
    this.contextState = 'active'; // 'active' | 'lost' | 'restored' | 'unsupported'
    this.fallbackPoster = options.fallbackPoster || null;
    this.isRendering = false;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mixer = null;
    this.activeClip = null;
    this.activeAction = null;
    this.characterGroup = null;

    if (options.autoInit !== false && typeof THREE !== 'undefined') {
      this.initScene();
    }
  }

  initScene(customCanvas) {
    if (customCanvas) this.canvas = customCanvas;
    if (!this.canvas && typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    if (typeof THREE === 'undefined') {
      this.contextState = 'unsupported';
      return false;
    }

    try {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(this.cameraSpec.fov, this.width / this.height, 0.1, 1000);
      this.camera.position.set(...this.cameraSpec.position);
      this.camera.lookAt(...this.cameraSpec.target);

      // Ambient + Directional Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 10, 7.5);
      this.scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
      fillLight.position.set(-5, 0, -5);
      this.scene.add(fillLight);

      if (this.canvas) {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(1);
      }

      this.contextState = 'active';
      return true;
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      this.contextState = 'unsupported';
      return false;
    }
  }

  /**
   * Load and register a glTF/GLB model from an ArrayBuffer
   */
  async loadGltfFromArrayBuffer(arrayBuffer, modelId = 'character-01') {
    if (typeof THREE === 'undefined' || !THREE.GLTFLoader) {
      throw new Error('THREE.GLTFLoader not available');
    }
    if (!this.scene) this.initScene();

    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          this.characterGroup = gltf.scene;
          this.characterGroup.name = modelId;
          this.scene.add(this.characterGroup);

          // Setup animation mixer
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.characterGroup);
            this.activeClip = gltf.animations[0];
            this.activeAction = this.mixer.clipAction(this.activeClip);
            this.activeAction.play();
          }

          const meshDetails = [];
          this.characterGroup.traverse((node) => {
            if (node.isMesh) {
              meshDetails.push({
                name: node.name,
                geometryType: node.geometry ? node.geometry.type : null,
                materialType: node.material ? (Array.isArray(node.material) ? node.material.map(m => m.type) : node.material.type) : null,
                vertices: node.geometry && node.geometry.attributes.position ? node.geometry.attributes.position.count : 0
              });
            }
          });

          const record = {
            id: modelId,
            loaded: true,
            meshCount: meshDetails.length,
            meshDetails,
            animations: gltf.animations.map(a => ({ name: a.name, duration: a.duration })),
            group: this.characterGroup,
            position: [this.characterGroup.position.x, this.characterGroup.position.y, this.characterGroup.position.z],
            rotation: [this.characterGroup.rotation.x, this.characterGroup.rotation.y, this.characterGroup.rotation.z],
            scale: [this.characterGroup.scale.x, this.characterGroup.scale.y, this.characterGroup.scale.z]
          };

          this.models.set(modelId, record);
          this.renderFrame(0);
          resolve(record);
        },
        reject
      );
    });
  }

  /**
   * Load and register a glTF/GLB model into the 3D scene (Metadata/Spec style)
   */
  loadGltfModel(id, modelSpec) {
    if (!id || !modelSpec) throw new Error('Model ID and specification are required');
    const record = {
      id,
      assetId: modelSpec.assetId,
      position: modelSpec.position || [0, 0, 0],
      rotation: modelSpec.rotation || [0, 0, 0],
      scale: modelSpec.scale || [1, 1, 1],
      animationClip: modelSpec.animationClip || null,
      loaded: true
    };
    this.models.set(id, record);
    return record;
  }

  updateModelTransform(id, transform = {}) {
    const model = this.models.get(id);
    if (!model) throw new Error(`Model not found: ${id}`);
    if (transform.position) model.position = [...transform.position];
    if (transform.rotation) model.rotation = [...transform.rotation];
    if (transform.scale) model.scale = [...transform.scale];

    if (model.group) {
      if (transform.position) model.group.position.set(...transform.position);
      if (transform.rotation) model.group.rotation.set(...transform.rotation);
      if (transform.scale) model.group.scale.set(...transform.scale);
    }
    return model;
  }

  /**
   * Timeline synchronization: scrub model animation & scene transforms to exact timestamp
   */
  setTime(timeSeconds) {
    if (this.mixer) {
      this.mixer.setTime(timeSeconds);
    }
    if (this.characterGroup) {
      // Dynamic rotation across timeline
      this.characterGroup.rotation.y = timeSeconds * 1.5;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  renderFrame(frameNumber, fps = 30) {
    const timeSeconds = frameNumber / fps;
    this.setTime(timeSeconds);
    return this.evaluateFrame(frameNumber);
  }

  handleContextLost() {
    this.contextState = 'lost';
    this.isRendering = false;
    const snapshot = {};
    for (const [id, m] of this.models.entries()) {
      snapshot[id] = { position: m.position ? [...m.position] : [0,0,0] };
    }
    this._savedSnapshot = snapshot;
    return {
      status: 'CONTEXT_LOST_HANDLED',
      modelsPreserved: this.models.size,
      activeAction: 'PAUSED_AWAITING_RESTORE'
    };
  }

  handleContextRestored() {
    this.contextState = 'restored';
    this.isRendering = true;
    if (this.renderer && this.renderer.forceContextRestore) {
      this.renderer.forceContextRestore();
    }
    return {
      status: 'CONTEXT_RESTORED',
      modelsRebuilt: this.models.size
    };
  }

  evaluateFrame(frameNumber) {
    if (this.contextState === 'lost' || this.contextState === 'unsupported') {
      return {
        renderedMode: '2D_POSTER_FALLBACK',
        poster: this.fallbackPoster,
        message: 'WebGL context unavailable. Fallback 2D placeholder displayed.'
      };
    }

    return {
      renderedMode: '3D_WEBGL',
      frame: frameNumber,
      camera: this.camera ? { position: this.camera.position.toArray() } : this.cameraSpec,
      modelCount: this.models.size,
      models: Array.from(this.models.values()).map(m => ({
        id: m.id,
        loaded: m.loaded,
        meshCount: m.meshCount,
        position: m.position,
        rotation: m.rotation,
        scale: m.scale
      })),
      activeAnimation: this.activeClip ? this.activeClip.name : null
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThreeSceneAdapter };
}
if (typeof window !== 'undefined') {
  window.ThreeSceneAdapter = ThreeSceneAdapter;
}
