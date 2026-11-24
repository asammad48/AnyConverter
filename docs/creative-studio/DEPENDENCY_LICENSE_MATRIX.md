# Dependency & License Matrix — AnyConverter Creative Studio

**Audit Date:** 2026-11-24  
**Author:** Lead Systems Architect / Antigravity Agent  
**Compliance Target:** Strict zero recurring software/licensing cost to AnyConverter (Constraint G-01, G-02, G-12)  

---

## 1. Commercial License Evaluation

| Component | License Type | Commercial Use Terms | AnyConverter Eligibility | Architecture Gate Status |
|---|---|---|---|---|
| **Remotion** (`@remotion/player`, `@remotion/web-renderer`) | Remotion License v1.0 / Automators License | Free only for individuals or companies <= 3 people and < $100k revenue. Products offering video generation/editing to public users require an **Automators License** ($480 – $2,400+/year). | **INELIGIBLE FOR UNRESTRICTED FREE COMMERCIAL PRODUCTION SHIP.** Under G-02, AnyConverter will not incur paid SaaS or software licensing fees. | **GATED / RESTRICTED.** Retained behind `RenderAdapter` interface as an opt-in/pluggable engine, but **NOT bundled as the primary renderer**. |
| **Native Canvas + WebCodecs + Web Audio** | W3C Web Standard | Native browser APIs (Chrome, Edge, Safari, Firefox). Zero external fees, zero license restrictions. | **100% ELIGIBLE.** Native to modern browsers. | **PRIMARY ENGINE SELECTED.** Provides 1080p 30fps export with zero software licensing cost. |
| **Three.js** | MIT License | Permissive open-source license. Commercial use, modification, and distribution fully allowed. | **100% ELIGIBLE.** | **APPROVED FOR 3D SCENE GRAPH.** |
| **mp4-muxer / webm-muxer** | MIT License | Permissive open-source. Client-side pure JS/WASM container muxing without FFmpeg binaries. | **100% ELIGIBLE.** | **APPROVED FOR CLIENT VIDEO EXPORT.** |
| **fflate** / **JSZip** | MIT License | Permissive open-source. High-speed lossless ZIP compression/decompression in browser. | **100% ELIGIBLE.** | **APPROVED FOR `.acstudio` CONTAINER.** |
| **Google Identity Services (GIS) & Picker** | Google Terms of Service | Official Google client-side JavaScript libraries for OAuth 2.0 and Drive file selection. Free to use with user consent. | **100% ELIGIBLE.** (Requires user-owned Drive quota; zero storage bill to AnyConverter). | **APPROVED FOR OPT-IN GOOGLE DRIVE SYNC.** |
| **Google Fonts (Roboto, Montserrat, Inter, etc.)** | SIL Open Font License (OFL) 1.1 / Apache 2.0 | Free commercial redistribution and web embedding. | **100% ELIGIBLE.** | **APPROVED FOR GRAPHICS & CAPTIONS.** |
| **AI Model APIs (OpenAI, Gemini, Hugging Face)** | BYOK (User Agreement) | Billed directly to user's personal API account. | **100% ELIGIBLE AS BYOK ONLY.** AnyConverter stores no keys and pays zero invoices. | **APPROVED FOR USER-OWNED KEYS.** |
| **Kaggle / Google Colab Runtimes** | Terms of Service (Personal/Interactive Use) | Free interactive notebooks. Terms restrict unattended, automated third-party commercial orchestration. | **RESTRICTED FOR PUBLIC UNATTENDED AUTOMATION.** | **MANUAL NOTEBOOK IMPORT APPROVED; AUTOMATED REMOTE SCRAPING BLOCKED.** |

---

## 2. Hard Legal Decision on Video Rendering

Per File 02 and File 05 mandates:
> *"If Remotion license fails, retain the boundary but choose an alternative browser renderer... Do not hide a monthly render license cost."*

**Verdict:**  
Remotion's Automators and Company licensing terms would create a recurring commercial financial obligation for AnyConverter. In strict compliance with rule **G-02** ("No inference or software cost charged to AnyConverter") and rule **G-12** ("User consent and licensing before release"), **AnyConverter Creative Studio will default to a pure Native WebCodecs + HTML5 Canvas + Web Audio rendering engine**. Remotion is abstracted behind the `RenderAdapter` interface and will only be activated if the repository owner explicitly supplies and registers a valid enterprise license key.
