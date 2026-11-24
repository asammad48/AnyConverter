# AnyConverter Creative Studio — Defect Register

**Audit Run ID:** `2026-11-25-audit`  
**Classification:** P0 (Release Blocker), P1 (Major Defect), P2 (Moderate Defect), P3 (Minor Polish)

---

## Defect Inventory

### DEF-001 — HTTP 404 on Canonical Studio Routes (Release Blocker)
- **Severity:** `P0`
- **Route:** `http://127.0.0.1:3000/creative-studio/`, `/creative-studio/index.html`, `/es/creative-studio/`, `/da/creative-studio/`
- **Click Sequence / Repro:**
  1. Start local server: `npx serve . -p 3000`
  2. Open browser and navigate to `http://127.0.0.1:3000/creative-studio/`
- **Observed Behavior:** Browser displays `404 Not Found`. Page content length 186 bytes.
- **Expected Behavior:** Browser renders AnyConverter Creative Studio authoring environment with canvas, toolbar, timeline, and preset picker.
- **Console Errors:** `GET http://127.0.0.1:3000/creative-studio/ 404 (Not Found)`
- **Screenshot Reference:** `screenshots/03_route__creative-studio_.png`
- **Root Cause:** No HTML file exists under `creative-studio/` in the repository worktree. Previous development delivered only background JS modules in `assets/js/creative-studio/` and Node.js unit tests.
- **Remediation:** Create `creative-studio/index.html` (and Spanish/Danish equivalents under `/es/` and `/da/`) with standard AnyConverter layout, canvas mount points, and script imports.

---

### DEF-002 — Video Render Adapter Produces Zero Video Output (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `assets/js/creative-studio/render-adapter.js` (lines 65–126)
- **Repro Steps:**
  1. Instantiate `const adapter = new NativeCanvasRenderAdapter();`
  2. Call `await adapter.render(project, { durationSeconds: 5 });`
  3. Inspect returned object.
- **Observed Behavior:** Returns metadata `{ success: true, totalFrames: 150, mimeType: "video/mp4" }`. No video Blob, Uint8Array, or file stream is generated.
- **Expected Behavior:** Hardware-accelerated WebCodecs `VideoEncoder` compresses canvas frames, mixes audio samples, and muxes them into an actual playable MP4 or WebM Blob.
- **Root Cause:** `NativeCanvasRenderAdapter.render()` contains a mock timing loop that increments `renderedFrames++` without touching canvas pixel data or invoking video codecs.
- **Remediation:** Integrate a true client-side video muxer (e.g. `mp4-muxer` or `webm-muxer`) fed by `canvas.captureStream()` or WebCodecs `VideoEncoder.encode()`.

---

### DEF-003 — Generated QR Code Fails Scanning on Real Devices (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `assets/js/creative-studio/qr-vcard.js` (lines 106–129)
- **Repro Steps:**
  1. Instantiate `const qr = new QrVcardEngine();`
  2. Run `qr.generateQrSvg("BEGIN:VCARD...", { size: 256 })`
  3. Save SVG to disk and scan with smartphone camera / standard QR code scanner.
- **Observed Behavior:** Scanner fails to recognize the image as a valid QR code.
- **Expected Behavior:** Camera scanner immediately detects valid vCard contact payload.
- **Screenshot / Output Reference:** `OUTPUTS/test_qr_vcard.svg`
- **Root Cause:** In `qr-vcard.js`, `_generateMatrix` fills modules with pseudo-random noise: `const bit = ((hash ^ (r * 13 + c * 37)) & 1);`. It lacks standard QR Reed-Solomon error correction, alignment markers, timing patterns, and format masks.
- **Remediation:** Implement standard ISO/IEC 18004 QR generation algorithm or integrate a zero-dependency client-side QR matrix library.

---

### DEF-004 — Archive Module Throws ReferenceError in Browser Runtime (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `assets/js/creative-studio/archive.js` (lines 6–7)
- **Repro Steps:**
  1. Load `/assets/js/creative-studio/archive.js` in a browser `<script>` tag.
  2. Open browser Developer Tools console.
- **Observed Behavior:** Immediate unhandled error: `ReferenceError: require is not defined at archive.js:6:16`.
- **Expected Behavior:** Script loads cleanly into `window.AcStudioArchive` or browser ES module.
- **Root Cause:** File has unconditional Node.js CommonJS imports at top level: `const crypto = require('crypto'); const zlib = require('zlib');`.
- **Remediation:** Guard module loading: check `typeof require !== 'undefined'` and use `globalThis.crypto.subtle` + `CompressionStream` / browser-compatible deflate engine.

---

### DEF-005 — Fixture Project Contains Dummy Text Data Instead of Binary Media (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `tests/creative-studio/fixtures/sample_project.acstudio`
- **Repro Steps:**
  1. Unzip `tests/creative-studio/fixtures/sample_project.acstudio`
  2. Inspect asset files in `assets/` directory.
- **Observed Behavior:** Asset files contain 26–29 byte plain text strings: `FAKE_PNG_HEADER_DATA_12345`, `FAKE_MP4_AV_STREAM_DATA_67890`, `FAKE_WAV_AUDIO_PCM_DATA_11122`, `FAKE_GLTF_3D_MODEL_DATA_33344`.
- **Expected Behavior:** Valid binary media files (genuine PNG, MP4, WAV, and GLB files).
- **Root Cause:** Synthesized mock fixtures were checked in during Phase 03 to pass unit test assertions without testing real browser media decoders.
- **Remediation:** Generate genuine valid media binary fixtures with correct magic bytes and stream headers.

---

### DEF-006 — Missing Real Graphic Drawing and PNG Export in GraphicsCanvas (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `assets/js/creative-studio/graphics-canvas.js`
- **Repro Steps:**
  1. Inspect `GraphicsCanvas.prototype` methods.
- **Observed Behavior:** Canvas class contains only bounding box math, presets, snapping, and JSON serialization. It lacks any method to render layers onto an `HTMLCanvasElement` context or export a PNG Blob.
- **Expected Behavior:** `renderToCanvas(ctx)` and `exportPng()` methods that draw background, shapes, text, and images, and return a PNG data URL or Blob.
- **Remediation:** Implement 2D canvas context drawing loop supporting vector shapes, text metrics, and raster images.

---

### DEF-007 — Missing PDF Generation in BusinessCardEngine (Release Blocker)
- **Severity:** `P0`
- **Affected File:** `assets/js/creative-studio/business-card.js`
- **Repro Steps:**
  1. Inspect `BusinessCardEngine.prototype` methods.
- **Observed Behavior:** Only calculates print geometry (bleed box, crop marks). Lacks any `exportPdf()` method.
- **Expected Behavior:** Generates 2-page print PDF (front and back) at exact 300 DPI trim dimensions with crop marks.
- **Remediation:** Integrate with `pdf-lib` (already available in AnyConverter PDF tools) to construct printable vector PDF documents.

---

### DEF-008 — Creative Studio Orphaned from Homepage and Site Navigation (Major)
- **Severity:** `P1`
- **Affected File:** `index.html`, `assets/js/shared.js`, `sitemap.xml`
- **Repro Steps:**
  1. Open homepage `http://127.0.0.1:3000/`
  2. Search for "creative" or browse all 9 category sections.
- **Observed Behavior:** Zero references, links, or cards pointing to Creative Studio. Total nav links = 440, Creative Studio links = 0.
- **Expected Behavior:** Creative Studio is prominently featured in site header navigation and relevant category hubs.
- **Screenshot Reference:** `screenshots/01_homepage.png`
- **Remediation:** Add Creative Studio card to homepage Quick Access grid, category navigation, and XML sitemap.
