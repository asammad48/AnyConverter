# Phase 01 — Defect Register & Resolution Table

**Project:** AnyConverter Creative Studio — Visual Quality Production Programme  
**Phase:** 01 (Visual Baseline & First Publishable Slice)  
**Status:** `ALL PHASE 01 DEFECTS RESOLVED`  

---

## Defect Inventory & Resolution Proof

| ID | Severity | Defect Symptom | Root Cause | Code Diff / Architectural Fix | Fresh Retest Proof | Status |
|---|---|---|---|---|---|---|
| **D01** | **P0 (Critical)** | Pre-existing videos had a bouncing orange orb and blue progress bar baked into every exported frame. | `_renderCanonicalScene()` in `render-adapter.js` unconditionally drew an animated circle and progress strip for debugging. | Removed the orb and progress strip from production mode; isolated behind `project.renderMode === 'diagnostics'`. | Master export `From_Raw_Data_to_Clear_Answers_Master.webm` contains 0 orange orbs across all 720 frames. | **CLOSED** |
| **D02** | **P0 (Critical)** | Frame numbers, timestamps, and debug strings (`Frame 901/1800 (30.00s / 60s)`) rendered into public video pixels. | Hardcoded monospace debug overlay in `render-adapter.js` line 592. | Replaced with mode-gated diagnostics. Production exports contain zero non-diegetic timestamps. | Inspected frames at 0%, 10%, 25%, 50%, 75%, 90%, 100%. All free of debug text. | **CLOSED** |
| **D03** | **P1 (High)** | Disconnect between viewport preview and exported WebM frames (preview showed static canvas; export showed orb). | Two disparate render loops: `GraphicsCanvas` for preview vs `NativeCanvasRenderAdapter` for export. | Unified preview and export under `CreativeDirector.renderFrame()`. Viewport and exporter now execute the exact same canonical frame evaluator. | Verified in `PREVIEW_EXPORT_PARITY.md`: Frame 390 preview still matches exported Frame 390 pixel-for-pixel. | **CLOSED** |
| **D04** | **P1 (High)** | Lack of cinematic narrative structure; single repeated scene throughout long-form benchmarks. | Project model lacked multi-shot sequencing, shot timing metadata, and camera choreography. | Introduced `ReferenceShot` and `CreativeDirector` with 5-shot narrative arc (Hook -> Problem -> Solution -> Benefit -> Payoff). | Full 24-second video has 5 distinct visual propositions and camera moves. | **CLOSED** |
| **D05** | **P1 (High)** | Typography lacked hierarchy and commercial polish (single font size, tiny corner labels). | Relying on unstyled default system fonts without scale ratios or brand accents. | Introduced Bricolage Grotesque (`52px` 700 bold) headlines paired with Inter (`20px` 400 regular) subheads and topic pills. | Verified readable at 100% and mobile scaled viewports. | **CLOSED** |
| **D06** | **P2 (Medium)** | Shot headlines and brand accents were not directly editable from the Studio UI. | Right sidebar inspector lacked shot-level controls. | Added `Cinematic Shot Editor` to right sidebar with Shot Selector, Headline, Subhead, Accent Color, and Duration fields. | Live user journey demonstrated headline and color updates updating the canvas in real time. | **CLOSED** |
| **D07** | **P2 (Medium)** | Project archives (`.acstudio`) lost shot metadata on save and reload. | `AcStudioArchive.package` only synchronized 2D graphic canvas layers. | Enhanced `saveProjectArchive()` and `openProjectArchive()` to serialize `shots`, `visualDirection`, and `renderMode`. | Clean-session reopen unpacked 5 shots, allowed mutation of Shot 4, and re-exported successfully. | **CLOSED** |
