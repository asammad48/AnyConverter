# Architectural Decision Records (ADR-001 – ADR-008)
## AnyConverter Creative Studio

**Date:** 2026-11-24  
**Author:** Lead Systems Architect / Antigravity Agent  
**Status:** Approved & Binding across Files 02–14  

---

### ADR-001: Strict Zero-Backend & Static Delivery Architecture
- **Context:** AnyConverter is deployed to Cloudflare Pages as a static site with 441 indexed tool URLs. Creative Studio requires project authoring, media encoding, and asset persistence.
- **Decision:** All Creative Studio operations must execute entirely within the client's browser runtime. We explicitly ban:
  1. Cloudflare Workers, Pages Functions, or Node.js server endpoints.
  2. Cloudflare R2, D1, KV, Supabase, Firebase, or external databases managed by AnyConverter.
  3. Server-side rendering, hosted job queues, remote headless browser rendering, or hosted OAuth proxy servers.
  4. Silent server-side telemetry or scraping of user project text, canvas graphics, or media assets.
- **Consequences:** 
  - Zero recurring cloud hosting or server compute bills for AnyConverter.
  - Zero server-side attack surface for user credentials or project content.
  - Features requiring server infrastructure (e.g., hosted live collaboration, remote MCP endpoints) are permanently out-of-scope under G-01.
- **Rollback Plan:** In the event that a capability cannot be delivered without a backend, that feature is classified as `UNSUPPORTED IN BROWSER` with a manual/local fallback; backend infrastructure will never be deployed.

---

### ADR-002: Modular Rendering Engine: Native Canvas/WebCodecs vs. Remotion
- **Context:** Video rendering in the browser can be achieved via `@remotion/web-renderer` or native Web APIs (`HTML5 Canvas` + `WebCodecs` VideoEncoder/AudioEncoder + WASM muxer). Remotion requires a commercial license ($480–$2,400+/year) for commercial organizations and Automators products.
- **Decision:** 
  1. Implement a pluggable `RenderAdapter` interface decoupling video composition from the underlying encoding engine.
  2. **Primary / Default Engine:** A zero-cost, zero-licensing-fee native engine using `OffscreenCanvas`, `WebCodecs` (`VideoEncoder`, `AudioEncoder`), `Web Audio API`, and pure WebAssembly muxers (`mp4-muxer` / `webm-muxer`).
  3. **Remotion Engine:** Isolated behind the `RenderAdapter` interface. Its production bundle is **GATED** unless AnyConverter explicitly procures a commercial license or qualifies under strict owner non-commercial exemptions.
- **Consequences:** 
  - Guaranteed zero legal risk or unexpected licensing invoices.
  - 100% browser-native video export playable in standard external media players.
  - Fallback to `MediaRecorder` or WebM on browsers lacking WebCodecs MP4 encoder support.

---

### ADR-003: 2D Graphics Canvas Architecture (Thumbnail, Branding, Cards)
- **Context:** Graphic design tools (thumbnails, covers, business cards, QR) require draggable objects, layering, affine transforms, masks, text curving, snapping, and high-DPI export.
- **Decision:** Utilize an object-based 2D canvas scene graph (lightweight Konva.js or native modular Canvas graph) sharing identical entity IDs (`layerId`, `assetId`, `transform`) with the timeline video compositor.
- **Consequences:** 
  - Graphic presets (1280x720, 1080x1080, 85x55mm) share the unified `ProjectDocument` schema.
  - Print cards support front/back artboards, vector QR/vCard payloads, printer bleed (3mm), and safe zones.
  - No duplicated data structures between static graphics and animated video scenes.

---

### ADR-004: 3D Scene Graph & Mesh Compositing Engine
- **Context:** Users require 3D scenes, glTF model imports, and animated characters without false marketing claims.
- **Decision:** Integrate a lightweight Three.js runtime. 3D objects exist as genuine WebGL scene layers within the unified project graph, exposing camera position, orbit, lighting, and animation clips.
- **Consequences:** 
  - Honest 3D rendering: real glTF geometries and textures rather than CSS pseudo-3D transforms.
  - Resilient context-loss handling: WebGL `webglcontextlost` and `webglcontextrestored` listeners recreate textures and restore rendering without crashing the project.
  - If a device lacks WebGL or hardware acceleration, fallback to 2D vector mode is triggered.

---

### ADR-005: Local Persistence Hierarchy: OPFS, IndexedDB, and Portable `.acstudio`
- **Context:** Browser storage can be evicted by the OS; users risk losing large projects (video clips, audio, bibles).
- **Decision:** Establish a 3-tier persistence model:
  1. **Working State (Tier 1):** IndexedDB for `project.json` manifest and command undo/redo history.
  2. **Binary Media Store (Tier 2):** Origin Private File System (OPFS) / IndexedDB Blobs for content-addressed immutable media (`sha256:<hash>`).
  3. **Portable Archive (Tier 3 - Source of Truth):** Versioned `.acstudio` ZIP archive containing manifest, project tree, and original media, allowing total project recovery on any device or fresh browser.
- **Consequences:** 
  - Automatic `navigator.storage.persist()` request on project initialization.
  - Prominent UI warnings when storage quota exceeds 80% or when private browsing prevents persistent storage.
  - Explicit instruction that clearing browser cache will erase unexported local projects unless saved as `.acstudio` or to Google Drive.

---

### ADR-006: Client-Side Security, Secrets Management & Zero-Token Leakage
- **Context:** Users connect their personal Google Drive (via OAuth) and third-party AI provider API keys.
- **Decision:**
  1. **Zero AnyConverter Accounts:** No user registration, password database, or server sessions.
  2. **Google Drive Auth:** Browser-only Google Identity Services (GIS) token model requesting minimal `drive.file` scope. Short-lived access token held strictly in memory.
  3. **AI Keys:** By default, held strictly in module memory for the active session.
  4. **Optional Encrypted Vault:** If user chooses "Remember key locally", key is encrypted via AES-256-GCM using a key derived from a user passphrase via PBKDF2 (WebCrypto API). Plaintext keys are never written to localStorage, cookies, project files, `.acstudio` archives, or error logs.
  5. **Telemetry Shielding:** No analytics or advertisement scripts allowed on Creative Studio workspace routes.

---

### ADR-007: AI Provider BYOK Policy & Non-Guaranteed Free GPU Fallbacks
- **Context:** AI generation involves third-party costs, rate limits, CORS policies, and potential abuse.
- **Decision:**
  1. All AI features are **Bring Your Own Key (BYOK)**. AnyConverter incurs zero inference cost.
  2. Browser-capable APIs (official CORS + public client permitted) use client adapters.
  3. Providers requiring server-side secrets or forbidding direct browser origin calls are classified as `MANUAL NOTEBOOK ONLY`. No insecure third-party "CORS proxies" will be used.
  4. Kaggle / Colab free notebook workflows are delivered as downloadable, version-pinned `.ipynb` files for user-controlled manual execution; automated remote execution is disabled pending explicit vendor authorization.

---

### ADR-008: Agent Interoperability & No-Backend AI Assistant Bridge
- **Context:** Users want ChatGPT and Claude to generate and edit Creative Studio projects.
- **Decision:**
  1. Publish formal, versioned JSON Schemas (`project.schema.json` and `CreationRequest.schema.json`).
  2. Users can ask ChatGPT/Claude to generate a JSON payload conforming to the schema and import it directly into Creative Studio via the browser file picker or text paste.
  3. No remote hosted MCP endpoint will be advertised or simulated, as static hosting cannot expose an active remote MCP server.
  4. An optional open-source local Node.js CLI bridge will be provided for technical users running desktop Claude Code / local agents.
