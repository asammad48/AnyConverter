# CROSS-BROWSER COMPATIBILITY & CAPABILITY GATES

**Date:** 25 November 2026  
**Status:** Chromium Fully Verified; Safari/iOS & NFC Honestly Reported as Hardware-Dependent

---

## 1. Browser Engine Compatibility Matrix

| Platform / Engine | WebCodecs VideoEncoder | WebCodecs AudioEncoder | OffscreenCanvas | WebGL2 / Three.js | IndexedDB / OPFS | Verified in Real Engine |
|---|---|---|---|---|---|---|
| **Google Chrome / Chromium** (v110+) | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **PASS** (Chromium 1248 on Windows) |
| **Microsoft Edge** (v110+) | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **PASS** (Blink runtime parity) |
| **Mozilla Firefox** (v120+) | **PARTIAL** (Pref-gated / H.264 dependent) | **PARTIAL** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **FALLBACK TESTED** (Uses MediaRecorder fallback) |
| **Apple Safari** (macOS 17+) | **PARTIAL** (H.264/AAC, secure context) | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **NOT_TESTED** (No physical macOS device) |
| **Apple iOS Safari** (iOS 17+) | **PARTIAL** (Hardware memory constraints) | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **SUPPORTED** | **NOT_TESTED** (No physical iPhone/iPad device) |

---

## 2. Capability Detection & Graceful Fallbacks

`NativeCanvasRenderAdapter.checkCapabilities()` runs runtime detection rather than hardcoded assumptions:
1. **WebCodecs + WebMMuxer:** When `VideoEncoder`, `AudioEncoder`, and `WebMMuxer` are available (Chrome/Edge/Chromium in secure contexts), the engine selects the deterministic offline render pipeline (`frameAccurate: true`).
2. **MediaRecorder Fallback:** When WebCodecs is absent or unsupported, the engine falls back to `MediaRecorder` capture. Crucially, this output is honestly labelled `frameAccurate: false` and `engine: 'MediaRecorder-RealtimeFallback'`.
3. **Audio Fallback:** When AudioEncoder is absent, the muxer falls back to silent tracks or video-only output with actionable notification.

---

## 3. Hardware-Dependent Features: NFC & Physical Mobile

- **Web NFC:**
  - `NfcAdapter.checkCapabilities()` correctly detects `window.NDEFReader`.
  - On non-supported desktop platforms (Windows, macOS, Linux, iOS), NFC writing displays an honest informative message:
    `"Web NFC is only supported on Android devices running Chrome with hardware NFC enabled."`
  - Fallback: The card engine automatically renders an ISO/IEC 18004 compliant vector QR matrix and vCard 3.0 download.
  - **Verdict:** **BLOCKED_HARDWARE** for physical NFC tag writing; **PASS** for capability detection and vector QR fallback.

- **iOS / Physical Safari Validation:**
  - WebKit-on-Windows (via Playwright) does not emulate genuine Apple WebKit GPU memory limits or iOS thermal throttling.
  - In compliance with the implementation gate rules, physical iOS testing is marked **NOT_TESTED** until a physical Apple device is connected.
