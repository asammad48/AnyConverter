# AnyConverter Creative Studio — Live Feature Inventory

**Audit Run ID:** `2026-11-25-audit`  
**Scope:** Advertised features from Blueprint Phase 01–14 vs. Real Localhost Behavior

---

## Feature Implementation Inventory Matrix

| Advertised Feature | Advertised Route / Entrypoint | UI Controls & Buttons | Actual Localhost Implementation Status | Observed Reality & Failure Mode | Evidence ID |
|---|---|---|:---:|---|---|
| **Creative Studio Hub / Workspace** | `/creative-studio/` | New Project, Import `.acstudio`, Template Picker | **MISSING** | Route returns HTTP 404. No HTML page or template exists in the codebase. | `EV-404-01` |
| **Spanish Studio Route** | `/es/creative-studio/` | Localized workspace & navigation | **MISSING** | Route returns HTTP 404. No localized directory or HTML page exists. | `EV-404-02` |
| **Danish Studio Route** | `/da/creative-studio/` | Localized workspace & navigation | **MISSING** | Route returns HTTP 404. No localized directory or HTML page exists. | `EV-404-03` |
| **Thumbnail & Graphic Editor** | `/thumbnail-maker/` or in-studio tab | Canvas, layer list, font selector, preset dropdown, export PNG | **MISSING / CODE-ONLY PARTIAL** | Route is 404. `graphics-canvas.js` contains layer math & bounds calculation, but has zero canvas rendering methods (`draw()`), zero DOM UI, and zero PNG export code. | `EV-MOD-01` |
| **Print Business Card Designer** | `/business-card-maker/` | 2-sided toggle, 3mm bleed guide, crop marks, export PDF | **MISSING / CODE-ONLY PARTIAL** | Route is 404. `business-card.js` calculates mm-to-pixel bleed geometry and crop marks in memory, but has no PDF generator or UI artboard. | `EV-MOD-02` |
| **Vector QR & vCard Generator** | `/qr-business-card/` or in-studio panel | Name/phone inputs, SVG preview, quiet zone toggle | **PARTIAL (DEFECTIVE)** | No UI page. `qr-vcard.js` generates SVG string, but uses pseudo-random bit hashing rather than standard QR Reed-Solomon encoding. Unscannable by real QR readers. | `EV-OUTPUT-QR` |
| **Web NFC Business Card Writer** | In-studio card exporter | Write NFC button, tag detect prompt, vCard fallback | **BLOCKED_HARDWARE** | `nfc-adapter.js` handles fallback JSON logic, but desktop Windows Chromium lacks `NDEFReader`. No hardware present. | `EV-HARDWARE-01` |
| **Native 2D/3D Video Timeline** | `/video-editor/` or in-studio timeline | Play, pause, seek, split, trim, multi-track audio, captions | **MISSING / CODE-ONLY PARTIAL** | Route is 404. `timeline-editor.js`, `audio-mixer.js`, `caption-editor.js` implement state structures in JS memory, but have no DOM timeline or wave rendering. | `EV-MOD-03` |
| **Native WebCodecs Video Renderer** | Studio Export Modal | Quality dropdown (720p/1080p), FPS selector, Export MP4 | **MISSING / FAKE COUNTER** | `render-adapter.js` does NOT call WebCodecs `VideoEncoder` or mux MP4 bytes. It executes a synchronous counter loop and returns a plain JSON object. | `EV-MOD-04` |
| **3D glTF Model Viewer** | Studio Scene 3D tab | 3D canvas, orbit camera, lighting controls, animation rig | **MISSING** | `three-scene-adapter.js` outlines adapter structure, but no 3D canvas is mounted to any DOM page. | `EV-MOD-05` |
| **Creation Wizards (Native / AI / Hybrid)** | Studio Creation Modal | Wizard steps, prompt input, storyboard grid | **MISSING / IN-MEMORY ONLY** | `creation-wizard.js` and `storyboard-manager.js` manage JS state models; no visible modal or user-facing form exists. | `EV-MOD-06` |
| **BYOK Encrypted Credential Vault** | Studio Settings Modal | Passphrase input, provider key inputs, lock/unlock | **MISSING / IN-MEMORY ONLY** | `byok-vault.js` implements PBKDF2/AES-GCM Web Crypto methods in JS, but has no UI dialog or settings panel. | `EV-MOD-07` |
| **Google Drive v3 Cloud Sync** | Studio Header "Save to Drive" | Connect Drive button, Google Picker, conflict modal | **BLOCKED_EXTERNAL / MISSING UI** | `drive-sync-adapter.js` contains REST endpoints, but no Google OAuth client ID/account is provided and no UI button exists. | `EV-DRIVE-01` |
| **Character & Drama Series Bible** | Studio Series Panel | Character cards, visual reference tags, episode planner | **MISSING / IN-MEMORY ONLY** | `character-bible.js` manages memory arrays; no UI gallery or editor views exist. | `EV-MOD-08` |
| **AI Budget Guard & Capacity Calculator** | Studio AI Prompt Modal | Credit cost breakdown, ceiling clip calculator | **MISSING / IN-MEMORY ONLY** | `budget-guard.js` and `budget-planner.js` calculate math correctly in unit tests; no UI widget exists. | `EV-MOD-09` |
| **Local Project Archive (.acstudio)** | Studio File Menu (Save / Open) | Download `.acstudio`, Drop/Open `.acstudio` file | **BROKEN IN BROWSER** | `archive.js` uses Node.js `require('crypto')` and `require('zlib')`. When fetched in browser, crashes with `ReferenceError: require is not defined`. | `EV-EVAL-01` |
| **Agent CreationRequest Interop** | Studio Import Menu | Paste JSON, schema validation toast | **MISSING / IN-MEMORY ONLY** | `agent-interop.js` validates against JSON schema; no UI import input exists. | `EV-MOD-10` |
