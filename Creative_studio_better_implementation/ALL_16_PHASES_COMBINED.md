# AnyConverter Creative Studio — 16 Phases + Browser-Native Short-Form Studio (Complete V2)

**All 16 original phase scopes are preserved and extended. Read README and MASTER before Phase 01. No push until owner-finalized phase + explicit push permission.**

[Phase 17 — AI-Guided Blender Production](17_AI_GUIDED_BLENDER_PRODUCTION.md) is a separately authorized extension after the original 16-phase program. Use the individual roadmap files for the current Blender handoff notes.



---

<!-- FILE: README_START_HERE.md -->

# AnyConverter Creative Studio — 16 Sequential Visual-Quality Phases

**Start with `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and `01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md`.**

This package contains a deep-research-based roadmap, **16 separate detailed AGY implementation specifications**, and owner repair/finalization prompts. It is for the native visual composition and user experience. It is NOT authorization to deploy, merge or execute all phases.

## Non-negotiable push restriction

> **AGY must NOT push any code while a phase is unfinished, being tested, being repaired or awaiting owner review.** AGY may work and locally commit on a feature branch. Only after the owner inspects actual media, explicitly finalizes that particular phase and separately authorizes a push may AGY push that phase's finalized commits. Pushing phase N never automatically authorizes phase N+1. No merge or deployment without separate written approval.

## Usage

1. Give AGY the master document and **Phase 01 only**.
2. AGY implements, tests localhost, exports actual films/stills and fixes all phase defects.
3. AGY sends one consolidated `AWAITING_OWNER_VISUAL_APPROVAL` handoff; owner watches videos/contact sheet and reviews source/QA.
4. If rejected, use `PHASE_REJECTION_REPAIR_AND_FINALIZATION_PROMPTS.md`; AGY repairs the same phase with **no push**.
5. Once accepted, owner may issue the explicit **APPROVED FOR PUSH** command. AGY pushes only the phase's finalized work and stops.
6. Only a new **START PHASE 02** instruction permits AGY to begin the next phase.

## Package inventory

- `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` — research, architecture, visual QA rubric, governance.
- `01_...md` to `16_...md` — per-phase work packages with exact tasks, workflows, blockers and copy-ready AGY prompts.
- `PHASE_REJECTION_REPAIR_AND_FINALIZATION_PROMPTS.md` — reusable human review and repair loop.

## Why the change matters

Prior videos had correct WebM framing but low-quality designs: tiny titles, repeated orange circles, debug text and simplistic 3D. Better encoding cannot fix this. The programme builds original art direction, typography, layout, motion, shot library, storyboard compiler, editor controls, 3D, sound-linked motion, aspect ratio recomposition, and a long-form storytelling system.

## Phase list

- 01. Visual Baseline, Creative Direction and First Publishable Slice
- 02. Visual Design Tokens, Grids and Composition Constraints
- 03. Professional Typography, Text Shaping and Kinetic Treatments
- 04. Frame-Deterministic Motion Graph, Easing and Springs
- 05. Cinematic Transitions, Masks and Shared-Element Choreography
- 06. Professionally Designed Shot Library and Composition Components
- 07. Photography, Video Footage Treatment and Product Mockups
- 08. Animated Charts, Diagrams and Visual Explanations
- 09. Storyboard and Validated VisualRecipe Compiler
- 10. Visual Editor UX for Shot and Scene-Level Control
- 11. Audio-Linked Motion, Captions and Sound Design
- 12. Professional 3D Art Direction, Lighting, Materials and Camera
- 13. Small Premium Template Collection and User Brand Kits
- 14. Actual 16:9, 9:16 and 1:1 Recomposition
- 15. Five-Minute Narrative Continuity, Pacing and Quality Budgets
- 16. Independent Creative QA, Blind Comparison and Final Visual Release Gate

**New fees or hosting are prohibited unless the owner explicitly authorises them.** Remotion is a reference only, pending commercial license and telemetry review.


## V2 upgrade: Explicit browser-production scope

This release is the **full original set of 16 phase documents, each extended with a mandatory production-video addendum**. Added `FRONTEND_SHORTS_PRODUCTION_ARCHITECTURE_AND_REFERENCE_BRIEFS.md` covering Blender-to-pose PNG/glTF, browser-native Remotion-like composition, optional Kokoro JS TTS, Web Audio sound design, declarative timeline.json and character-comedy/SVG-suspense visual briefs. The original goals, detailed tasks, tests, repair loops, quality rubric and no-push discipline remain intact.

**Use:** Read master, added architecture/reference brief, and Phase 01. AGY must execute Phase 01 ONLY; the whole ZIP provides context, not execution permission. Every phase now contains an additional copy-ready implementation prompt and defect-repair prompt for the user-supplied short-form stack.

**Strict rule:** `NO PUSH OR PR UNTIL PHASE NN IS OWNER-FINALIZED *AND* THE OWNER EXPRESSLY AUTHORIZES PUSH.` No merge or deploy without separate approval. Do not start next phase without a separately issued START.



---

<!-- FILE: 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md -->

# AnyConverter Creative Studio — Deep-Research-Based 16-Phase Visual Quality Programme

**Prepared:** 25 November 2026  
**Source base:** supplied six video artifacts and AGY verification reports; prior actual source review of `assets/js/creative-studio/render-adapter.js`, `studio-app.js`, and template registry; contemporary technical sources listed below.  
**Primary instruction:** This pack is a *plan*, not authority to execute phases 02–16. AGY must receive Phase 01 first and stop after each phase.  

## Executive diagnosis

The studio has demonstrated accurate browser media encoding and archiving, but sampled public-facing exports remain engineering demos: dark backgrounds, tiny labels, a recurring orange test orb, progress indicator, frame counts, and simple box-geometry 3D. An encoder cannot invent professional art direction. The missing layer is deliberate storytelling and editable scene composition.

The current `_renderCanonicalScene()` explicitly draws the debug title/orb/progress; the current graphics template data relies on basic typography and background values. Solving technical frame accuracy without replacing creative composition leaves the output low-grade.

## Key decisions from research

1. **Keep the proven WebCodecs/Muxer pipeline.** Build a composition evaluator, scene graph and visual grammar above it, shared by preview and export. WebCodecs provides frame timestamps but does not decide how frames look.
2. **Remotion is an authoring-quality reference, not a mandatory production library.** Its browser renderer can operate without a backend, but licence/telemetry terms for video-creation tools are material; do not introduce paid minimums, telemetry or licensing risk without owner review. Use general patterns—frame interpolation, sequence timing, reusable motion components—implemented natively.
3. **VisualRecipe is safer than executable AI output.** A strict JSON recipe validates shot IDs, durations, layout, text and asset references; native rules and templates work without AI. A Claude/ChatGPT-produced recipe can be imported after validation but must never execute arbitrary JS.
4. **Fewer genuinely polished assets beat many generic templates.** Start with a published-quality SaaS vertical slice and then build reusable design systems and component families.
5. **Maintain visual parity and editability.** What the creator sees in the UI must match decoded video frames, and all source assets, text, timing, and keyframes must survive `.acstudio` reopen. No diagnostic overlays in production.
6. **Human acceptance is non-negotiable.** Exact frame counts and pixel drift do not determine quality. Use a visual scorecard plus owner viewing and comments.

## Six shortcomings from existing exports and direct fixes

| Existing symptom | Structural cause | Remedy phases |
|---|---|---|
| Empty backgrounds, same orange orb | Hardcoded debug compositor | 01, 02, 06 |
| Tiny corner labels, weak headlines | Thin text layout and hierarchy | 02, 03 |
| Same shot repeated throughout | No shot grammar and storyboarding | 06, 09, 15 |
| Mechanical object motion | Missing easing/curves/choreography | 04, 05 |
| Flat input media and UI screenshots | Missing crop/mask/mockup controls | 07 |
| Unconvincing 3D character | Basic staging/cameras/lighting/assets | 12 |
| No genuinely guided user story workflow | Weak storyboard and editor integration | 09, 10 |
| Wrong text size in vertical formats | Cropping instead of recomposition | 14 |
| Technically valid but boring 300s video | No long-form pacing/continuity | 15, 16 |

## Roadmap and hard sequencing

| Phase | Objective | Minimum proof | Blocker that phase removes |
|---:|---|---|---|
| 01 | Visual Baseline, Creative Direction and First Publishable Slice | One polished 20–25s multi-shot SaaS promo titled “From raw data to clear answers”, plus a nine-frame storyboard sheet and old/new side-by-side | No access to premium media |
| 02 | Visual Design Tokens, Grids and Composition Constraints | Live layout editor displaying responsive guides plus three finished layouts (hero, comparison, statistic), all using shared constraints | Canvas text and DOM geometry differ |
| 03 | Professional Typography, Text Shaping and Kinetic Treatments | A 15–20s kinetic-typography composition with 6 distinct text treatments and actual multiline paragraphs, all editable | Canvas shaping differences |
| 04 | Frame-Deterministic Motion Graph, Easing and Springs | A 20s motion showreel displaying 10 useful primitives on real content and one redesigned Phase 01 scene | Existing animation engine assumes wall-clock |
| 05 | Cinematic Transitions, Masks and Shared-Element Choreography | 30s seven-shot sequence demonstrating four understated transition families and two shared-element handoffs | Mask features vary by browser |
| 06 | Professionally Designed Shot Library and Composition Components | A searchable 12-shot library and a 40s mini-video assembled from 8 diverse shots | Missing assets |
| 07 | Photography, Video Footage Treatment and Product Mockups | 25s feature film using one screenshot, one photo, one local footage clip and two UI mockups | Browser codec limitations |
| 08 | Animated Charts, Diagrams and Visual Explanations | 45–60s educational explainer “How Solar Panels Generate Electricity” with six diagram-led scenes and a real data chart | Complex automatic layout |
| 09 | Storyboard and Validated VisualRecipe Compiler | Guided brief → 6-shot storyboard → editable native project → completed 45s output; plus import of a hand-authored JSON VisualRecipe | Natural language comprehension without AI |
| 10 | Visual Editor UX for Shot and Scene-Level Control | Fully interactive flow to build and polish a 30s video without editing JSON or writing code | Existing two sources of truth |
| 11 | Audio-Linked Motion, Captions and Sound Design | 45s narrative promo with locally imported voiceover and music, synced captions and four visible audio-linked animation beats | Codec/browser audio decode |
| 12 | Professional 3D Art Direction, Lighting, Materials and Camera | 15s 3D showcase with a genuinely licensed glTF subject, dynamic camera move, accent lighting and tasteful composited titles | No professional model license |
| 13 | Small Premium Template Collection and User Brand Kits | Eight polished working templates with authentic preview clips and one-click brand adaptation, including still-thumbnail and print-card consistency | Quantity pressure |
| 14 | Actual 16:9, 9:16 and 1:1 Recomposition | One concept exported as three distinct first-class compositions (16:9, 9:16, 1:1) with equivalent story and matching brand | Complex wide diagrams |
| 15 | Five-Minute Narrative Continuity, Pacing and Quality Budgets | Five-minute native educational episode with 5 chapters, at least 24 purposefully composed shots, genuine media/diagrams and voice or caption-led narration | Memory/codec limits |
| 16 | Independent Creative QA, Blind Comparison and Final Visual Release Gate | Final comparative evidence package, seven showcase projects, objective technical report and an explicit owner-go/no-go decision | Human aesthetics cannot be proven by automated score |

## Contract for each phase

**DO NOT begin all phases when handed the zip. Execute Phase 01 only.** Every subsequent phase requires a separately sent owner command. AGY must work through implement → live localhost visual QA → repair all issues → regenerate actual video/contact sheet → full project save/reopen/edit/export → owner review → only authorized push → STOP.

A complete phase consists of real app UI interaction, independently playable export, narrative contact sheet, source diff, scoped defect register, practical fallback for unsupported browsers, no existing-site regressions, and owner acceptance. Test scripts calling render functions directly are supporting unit evidence, never substitutes for user journeys.

## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Visual benchmarks for the completed programme

- 20–25s SaaS promo with five meaningful shots and a clear payoff (Phase 01).
- 15–20s kinetic typography film showing editorial hierarchy (Phase 03).
- 30s transitions/shared-element story (Phase 05).
- 45–60s solar-energy explainer with original diagram visuals (Phase 08).
- 15s licensed 3D showcase with deliberate lights and camera (Phase 12).
- Eight premium template choices, across differentiated audiences and formats (Phase 13).
- Three genuine 16:9/9:16/1:1 re-compositions of the same narrative (Phase 14).
- Five-minute educational episode with 5 chapters and 24+ edited shots (Phase 15).
- Final blinded evaluation of seven project types plus still-image formats (Phase 16).

## Source-based blockers and decisions

| Decision | Required action / restriction |
|---|---|
| Native compositor vs Remotion | Native is default. Remotion browser renderer works but commercial video-editor licensing/telemetry must be cleared with owner before integration. |
| Fonts and licenses | Use self-hosted legitimately licensed families and ship notices in code; project must be portable. |
| Media assets | User-owned or legally redistributable assets only; no broken third-party hotlinks. |
| Browser compute | Use explicit memory/performance budgets, reduced-res fallback and honest browser capability detection. |
| Visual creativity | Fixed creative brief plus templates; native mode never claims magical AI understanding. |
| 3D realism | Do not pretend a basic geometric model is photorealistic. Quality depends on licensed models, shading, cameras and lighting. |
| Cross-browser | Test actual browser engines; mark physical Safari/iOS NOT TESTED until available. |
| Approval | AGY cannot auto-approve its own aesthetics. Owner must watch and sign off. |

## Research references (primary sources; reviewed November 2026)

- [Remotion client rendering and client-side limitations](https://www.remotion.dev/docs/client-side-rendering/)
- [Remotion browser rendering implementation details](https://www.remotion.dev/docs/client-side-rendering/how-it-works)
- [Remotion pricing for automated editors](https://www.remotion.dev/docs/license/pricing)
- [Remotion terms / telemetry](https://www.remotion.dev/docs/terms)
- [Remotion easing, sequences and transitions](https://www.remotion.dev/docs/interpolate)
- [Remotion scene transitions](https://www.remotion.dev/docs/transitions/transitionseries)
- [Remotion Three.js integration](https://www.remotion.dev/docs/three)
- [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
- [Canvas text measurement](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Mediabunny browser media library and MPL-2.0](https://github.com/Vanilagy/mediabunny)
- [Three.js MIT licensing](https://threejs.org/license/)
- [Material motion choreography](https://m1.material.io/motion/choreography.html)
- [WCAG 2.2](https://www.w3.org/TR/wcag/)
- [Google Fonts licensing overview](https://developers.google.com/fonts/)

## Required AGY progress protocol

AGY responds **once per completed phase**, not a stream of “done” claims. Use the exact fields:
```text
PHASE NN: AWAITING_OWNER_VISUAL_APPROVAL
Local feature branch: ...
Current local HEAD: ...
Remote push: NO
Merge: NO
Deploy: NO
Implemented user-visible features: ...
Before/after clips and stills: ...
Full exported media: ...
Storyboard contact sheet: ...
Localhost editor walkthrough: ...
Archive reopen/edit/re-export proof: ...
Regression and frame/media checks: ...
Visual score breakdown: ...
P0/P1/P2 and visual defects: ...
Changes needed to clear gate: ...
Exact changed source files: ...
STOP: Awaiting owner feedback.
```

If owner rejects, AGY must respond to **all** reported visual defects within the same phase and repeat every affected check, with no push. If owner approves a phase, that still does not independently authorize next-phase implementation or deployment.

## Startup prompt — deliver ONLY Phase 01 first

```text
AGY — read 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md and 01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md.
Implement PHASE 01 ONLY. The previous outputs look like engineering tests, not publishable videos.
Build one real 20–25s premium SaaS film with five purposeful shots and a documented original visual direction.
Use the actual Creative Studio browser UI, export real media, assemble a before/after contact sheet,
test edit/reopen/export and fix all defects. Return complete evidence for the owner to view.
DO NOT PUSH ANY CODE before the owner explicitly accepts final Phase 01 and authorizes that push.
Do not merge, deploy or start Phase 02. End with PHASE 01: AWAITING_OWNER_VISUAL_APPROVAL.
```

## Phase files

- [`01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md`](01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md)
- [`02_DESIGN_TOKENS_LAYOUT_AND_SAFE_AREAS.md`](02_DESIGN_TOKENS_LAYOUT_AND_SAFE_AREAS.md)
- [`03_PROFESSIONAL_TYPOGRAPHY_AND_KINETIC_TEXT.md`](03_PROFESSIONAL_TYPOGRAPHY_AND_KINETIC_TEXT.md)
- [`04_MOTION_GRAPH_EASING_SPRINGS_AND_STAGGER.md`](04_MOTION_GRAPH_EASING_SPRINGS_AND_STAGGER.md)
- [`05_TRANSITIONS_MASKS_AND_CHOREOGRAPHY.md`](05_TRANSITIONS_MASKS_AND_CHOREOGRAPHY.md)
- [`06_SHOT_LIBRARY_AND_VISUAL_PATTERNS.md`](06_SHOT_LIBRARY_AND_VISUAL_PATTERNS.md)
- [`07_MEDIA_TREATMENT_AND_PRODUCT_MOCKUPS.md`](07_MEDIA_TREATMENT_AND_PRODUCT_MOCKUPS.md)
- [`08_DATA_DIAGRAMS_AND_PROCEDURAL_STORYTELLING.md`](08_DATA_DIAGRAMS_AND_PROCEDURAL_STORYTELLING.md)
- [`09_STORYBOARD_VISUAL_RECIPE_COMPILER.md`](09_STORYBOARD_VISUAL_RECIPE_COMPILER.md)
- [`10_SHOT_LEVEL_EDITOR_UX_AND_PARITY.md`](10_SHOT_LEVEL_EDITOR_UX_AND_PARITY.md)
- [`11_AUDIO_CAPTIONS_AND_BEAT_SYNCHRONIZED_MOTION.md`](11_AUDIO_CAPTIONS_AND_BEAT_SYNCHRONIZED_MOTION.md)
- [`12_THREE_D_ART_DIRECTION_AND_CAMERA_STAGING.md`](12_THREE_D_ART_DIRECTION_AND_CAMERA_STAGING.md)
- [`13_PREMIUM_TEMPLATES_AND_BRAND_KITS.md`](13_PREMIUM_TEMPLATES_AND_BRAND_KITS.md)
- [`14_ASPECT_RATIO_RECOMPOSITION.md`](14_ASPECT_RATIO_RECOMPOSITION.md)
- [`15_LONG_FORM_STORY_PACING_CONTINUITY.md`](15_LONG_FORM_STORY_PACING_CONTINUITY.md)
- [`16_FINAL_VISUAL_ACCEPTANCE_AND_RELEASE_GATE.md`](16_FINAL_VISUAL_ACCEPTANCE_AND_RELEASE_GATE.md)

**There is no permission to push the work merely because this package was downloaded.**


---

# V2 ADDITION — EXPLICIT FRONTEND SHORT-FORM PRODUCTION PIPELINE (NOVEMBER 2026)

This amendment **extends and does not replace** the original 16 phase scopes above. It maps the user's explicit reference workflow—Blender bpy + pose PNGs, Remotion React components, Kokoro ONNX voice, Python-generated audio/music, timeline.json, and FFmpeg video—into this browser-only tool. The desktop pipeline is the comparison target, **not evidence that its entire runtime runs in a web page**. Original 16-phase acceptance gates and no-push rule remain binding.

## Non-negotiable feasibility boundary

- **Blender/Cycles/Freestyle:** desktop and build-time asset authoring only. Browser production uses imported transparent pose images/spritesheets and Three.js glTF character rigs; do not quietly require cloud GPU or the user's installation of Blender.
- **Remotion:** reference for sequencing, parameterized components, typed transitions and responsive composition. Browser integration has licensing/telemetry implications for public video tools; do not add a runtime dependency without written owner approval. Native frame evaluator, WebCodecs and muxers remain default.
- **Kokoro ONNX:** optional browser-side WebGPU/WASM TTS after consent; model downloads may be large and slow, browser/device and voice/language support vary. Neither claim an instant model nor auto-fetch it on page load. Voice import/record remains available.
- **Python NumPy/SciPy audio:** substitute Web Audio/OfflineAudioContext, portable JavaScript DSP and AudioWorklets/Workers. Original or rights-cleared sounds and music; audio that merely contains a tone is not a finished soundtrack.
- **Remotion CLI/FFmpeg:** development tools may be used for QA and comparison, but public browser workflow must use local media decode, frame-evaluated composition and browser WebCodecs plus muxer. A real Remotion CLI render is **not** proof that AnyConverter's frontend can export the same scene.
- **TypeScript/React code authored by Claude:** generate design plans or strictly validated JSON VisualRecipe in AnyConverter; arbitrary generated TSX/JS must not be evaluated in users' browsers. Building an isolated precompiled studio module is allowed only after dependency/security/bundle review.
- **The 'short-form-attention' skill** may guide hook/pacing only when actually present and licensed in AGY's environment. The planner must function without it.

## How to reproduce the two reference Short types

**Parrot comedy:** original/rights-cleared expressive parrot poses (Blender-prepared transparent PNG atlas *or* browser-rendered Three.js rig); character identity and pivots; action slots idle/blink/talk/react/shock; large captions; timed props; controlled zoom/shake; Kokoro or imported voice; chirps/pops/chimes/music mixed and ducked around voice; coherent hook/build/punchline within 20–30s. Every shot and sound remains individually editable.

**SVG suspense:** original vector stick characters, path-based gestures, high-contrast lighting/silhouette, eerie negative space, camera placement/hold, cue-bound captions and soundscape with silence; one impactful reveal. Use declarative SVG assets/safe rasterization and never rely on a late imported flattened movie for editability.

**Critical missing capability:** current `_renderCanonicalScene()` still hardcodes engineering test visuals and is not a professional composer. The V2 contract is a **single canonical, frame-deterministic scene evaluator** shared by canvas preview, editor controls and export. All outputs originate from actual project assets/cues. Diagnostics are strictly editor-only.

## Mapping to the already-approved 16 phases

| Phase | New production-pipeline emphasis | Must not claim before later phase |
|---|---|---|
| 01 | Three visual directions and real reference-quality slice; short parrot/Vector suspense look tests | Local TTS, Blender-grade real-time, finished puppet system |
| 02 | Character staging/caption-safe layout regions and frame composition tokens | Automatic script understanding |
| 03 | Large expressive captions, word-pop, suspense typography | Automatic forced alignment |
| 04 | Named character poses, keyframes, easing, anchor correction | Full GLB rigging editor |
| 05 | Camera/prop choreography, intentional comedy/suspense transitions | Sound-reactive timing without Phase 11 |
| 06 | Short-form shot archetypes, character staging, suspense and comic visual patterns | Hundreds of premium templates |
| 07 | Blender-authored pose PNG/GLB **import** and media-treatment pipeline | Blender Python running inside website |
| 08 | Deterministic SVG figure/diagram animations and visual metaphors | Generative intelligence without user input |
| 09 | `timeline.json` / VisualRecipe compiler with character pose, camera, caption and sound events | Executing arbitrary external code |
| 10 | Actual UI controls for posed character, shot, audio cue, camera, caption and keyframe | Hidden JSON-only editor |
| 11 | Browser Kokoro optional; OfflineAudioContext mix/ducking; synced captions | Zero-download instant voices in all languages |
| 12 | Three.js toon animal/glTF rig, lighting, animation and low-end sprite fallback | In-browser Cycles/Freestyle output equivalence |
| 13 | Eight reviewed premium templates with reference-quality parrot/suspense kit | Low-value catalog of 100 generic templates |
| 14 | Designed 9:16 vertical outputs with platform-safe composition variants | Resized/cropped 16:9 as vertical finished work |
| 15 | Episodic continuity, reusable character bible and 5-minute coherent acts | Automatic high-quality arbitrary script writing |
| 16 | Actual exports audited aesthetically and technically, full Short comparison | Automatic self-approval |

## Shared implementation contracts

1. **Visual source of truth:** project.scenes[].shots[].layers; every drawable references a licensed asset or native primitive, has transform, anchor, visibility, keyframes, style and role. Preview and export evaluate exactly the same frame state.
2. **Audio source of truth:** sample-time track positions, source/voice model provenance, amplitude, fade, ducking and cue markers. Captions carry actual timestamps; generated approximate alignments must say 'approximate' until user corrected.
3. **Character source of truth:** consistent characterId, assetId, pose atlas/rig reference, pivot normalization, named action state and voice reference across scenes; no re-randomization at each frame.
4. **Safe structured authoring:** allow declarative JSON VisualRecipe from user/Claude if validated. Reject arbitrary JS/TSX, HTML scripts, unsafe SVG, external HTTP asset access without user consent and invalid asset IDs.
5. **Media assets:** signed-off license and provenance, original file hash, transparencies, download/cache quota, no secretly remote media. Archive must preserve media and editable tracks across sessions.
6. **Progressive enhancement:** WebGPU and complex 3D are optional; capability-gate model inference and material effects; CPU/slow GPU users can select spritesheets and pre-authored sound, and 720p export where necessary.
7. **No hidden financial dependency:** no AnyConverter server, new SaaS fees, compulsory API key, server-saved user videos, silent model downloads or Remotion license purchase.
8. **Public content quality:** no engineering text, frame counts, frame counter overlays, stock/demo watermark, generic orb or filler geometry. Each shot must convey an idea, emotion, cause or payoff.

## Phase-by-phase owner decision and STOP contract

- Begin **Phase 01 only**. AGY may read all 16 and plan dependencies but not implement the next phase.
- Use local working branch. **NO `git push` or remote PR, remote branch creation, merge, deploy, CDN upload or code publishing until the owner first reviews and finalizes the current phase and then explicitly says 'APPROVED FOR PUSH'.** Local commits allowed.
- AGY may show local evidence through the established review channel, but if a file cannot be physically viewed by the owner, the phase is *not approved*; arrange actual playable accessible proof within existing review environment without pushing source code.
- If owner critiques ten defects, reproduce and fix all ten in same phase, regenerate every affected proof and run all regressions before one new handoff. No one-defect-at-a-time response unless safety demands it.
- Owner approval to push phase N is not approval to merge, deploy or start phase N+1. AGY stops after each phase even if its own QA passes.
- **Never label a phase PASS FOR PRODUCTION based only on ffprobe frame counts, generically worded reports or screenshots from a custom test renderer.** Human visual acceptance of authentic artifacts is required.

## Research links — primary resources, re-verify versions/licensing at implementation time

- [Remotion client-side renderer & telemetry](https://www.remotion.dev/docs/client-side-rendering/): Client-side WebCodecs rendering exists; every client render sends a telemetry event. Verify before adding it.
- [Remotion licensing](https://www.remotion.dev/docs/license/pricing): Automated video tools can require a commercial license. Do not assume free commercial embedding.
- [Kokoro browser implementation](https://github.com/hexgrad/kokoro/blob/main/kokoro.js/README.md): Kokoro JS can run locally on WebGPU or WASM; availability/performance varies.
- [WebCodecs MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API): Low-level browser frame encoding/decoding; it is not a composition or art-direction engine.
- [WebAudio offline render](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext): Browser-side deterministic offline mixing independent from realtime sound hardware.
- [Three.js glTF loader](https://threejs.org/docs/pages/GLTFLoader.html): Browser import of glTF models, paired with animation and toon/camera logic.
- [Blender glTF export manual](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html): Blender can prepare portable glTF animations at asset-authoring time.
- [Three.js toon outlining](https://threejs.org/docs/pages/ToonOutlinePassNode.html): WebGL toon outline effects require tested pipelines and performance budgets.



---

<!-- FILE: FRONTEND_SHORTS_PRODUCTION_ARCHITECTURE_AND_REFERENCE_BRIEFS.md -->

# AnyConverter Visual Studio — Browser-Only Short-Form Production Architecture (V2)

**This is not a server implementation request and not a one-shot command.** Use the master roadmap and individual phase specs; do not implement past the current owner-authorized phase.

## The user-supplied short-form stack vs browser runtime

| Desktop source technique | Browser implementation | What is NOT included | Phase(s) |
|---|---|---|---|
| Blender bpy: 8 parrot poses, Cycles toon shader, Freestyle outlines | User/developer-created transparent PNG pose atlases; optional uploaded glTF/GLB and Three.js toon renderer | No full Blender/Cycles Python runtime on the site | 01,04,07,12 |
| Remotion React sequenced compositions | Validated VisualRecipe + shared scene evaluator + WebCodecs/muxer | No Remotion production package/licence purchase without owner approval | 02–06,09–10,16 |
| Kokoro 82M ONNX, `af_heart` | Optional opt-in `kokoro-js` WebGPU/WASM TTS after compatibility check | Not an instant 0MB voice or all-languages guarantee | 11,13 |
| Python NumPy/SciPy sound synthesis/mixing | Web Audio API / OfflineAudioContext, DSP, gain envelopes, ducking, limiter | No Python runtime in frontend or 3rd-party audio backend | 11,15 |
| TypeScript/React scripted animations | Client-bundled components and strictly validated JSON scene/shot/timeline recipe | No arbitrary user-supplied executable code | 03–10 |
| `timeline.json` captions, props and audio cues | Versioned JSON with shot events, captions, pose/camera actions and sample-time audio cues | No hardcoded test timeline as proof of an editor workflow | 09–11 |
| Remotion CLI renders frames + FFmpeg H.264 | Existing browser deterministic frame generation with WebCodecs and muxer (codec probed) | Browser FFmpeg CLI not needed or assumed | 01,10,16 |

## Original 30-second comedy story specification (not a copyrighted parrot or viral Short)

Title: **The Parrot Who Tried to Run a Meeting**. Original comedic scenario; replace assets with licensed/original material. Draft shot chart (guidance, not an immutable storyboard):

| Time | What viewer sees | Action | Text/voice | Audio cue | What makes it useful |
|---|---|---|---|---|---|
| 0–3s | Tight parrot closeup, unexpected prop enters frame | Snap look at a large microphone | “I am the new manager.” | Pop then silence | Immediate hook |
| 3–7s | Clean two-level office layout with parrot and notes | Wing points to giant to-do list | “First: no more meetings.” | Paper flick | Establish rule |
| 7–12s | Reaction composition with parrot and ringing calendar | Blink → shock pose and punch-in | “Wait… a meeting about meetings?” | Chime interruption | Creates contradiction |
| 12–18s | Two-shot reaction and calendar cards | Pose atlas action switches with prop movement | “That makes no sense.” | Short chirp, comedic pause | Emotional beat |
| 18–24s | Oversized red calendar occupies the frame | Camera whip to calendar labeled MEETING | Large emphatic punchline caption | Staccato SFX plus ducked music | Visual escalation |
| 24–30s | Satisfying payoff: parrot closes laptop | Final look to camera and deliberate held frame | “Meeting canceled.” | Click, short musical resolution | Closure |

**Prohibited proof shortcut:** a video that shows a parrot merely switching poses under a centered title is NOT sufficient. The user needs a sequence with multiple purposeful shots, character acting, readable captions, camera and prop choreography, and sound.

## Original 30-second SVG suspense specification

Title: **The Last Light in the Corridor**. SVG figures are authored as native editable vector assets.

| Time | Shot | Sound | Editorial purpose |
|---|---|---|---|
| 0–4s | Empty high-contrast corridor, distant figure faintly visible | Room tone/hum | Establish a visual question |
| 4–9s | Close-up of switch and hand; light blinks | Switch click, silence | First clear action |
| 9–15s | Wide silhouette shot, shadow moves against fixed actor | Low restrained pulse | Tension via contradiction |
| 15–21s | Split focus: foreground figure, far wall negative space | No music for 1.5s | Hold anticipation |
| 21–26s | Deliberate 2–3 frame reveal then cut to darkness | Short impact, controlled peak | Payoff without cheap constant shaking |
| 26–30s | Quiet aftermath, simple closing line | Reduced ambience | Release and closure |

**Do not misrepresent these as user-supplied copyrighted reference footage.** They are fresh original design briefs to validate the system.

## Safe starter schema — conceptual only, formal JSON Schema in Phase 09

```json
{
  "schemaVersion": "2.0.0",
  "canvas": {"width": 1080, "height": 1920, "fpsNumerator": 30, "fpsDenominator": 1},
  "assets": [{"id": "parrot-pose-atlas", "type": "image/png", "sha256": "<real sha256>", "license": "source-recorded"}],
  "characters": [{"id": "parrot-1", "poseAtlasAssetId": "parrot-pose-atlas", "pivot": [0.5, 0.85]}],
  "scenes": [{
    "id": "meeting-intro", "durationFrames": 90, "purpose": "hook",
    "shots": [{"id": "closeup", "startFrame": 0, "durationFrames": 90, "layout": "character-closeup"}],
    "characterEvents": [{"characterId": "parrot-1", "frame": 6, "action": "look-right"}],
    "cameraKeys": [{"frame": 0, "zoom": 1.0}, {"frame": 15, "zoom": 1.14}],
    "captionCues": [{"startFrame": 12, "endFrame": 78, "text": "I am the new manager."}],
    "soundEvents": [{"startSample": 24000, "assetId": "original-pop-sfx", "gain": 0.55}]
  }]
}
```

The example intentionally contains a **placeholder hash** and SFX reference and is NOT a ready-to-render project. AGY must generate real assets, genuine hashes and an evidence-backed schema; no user-facing demo may contain placeholders.

## Asset rights, browser budget and privacy

1. User-uploaded 3D models, fonts and music must have lawful use rights; attribution/redistribution rules vary. Bundle evidence that is legally distributable.
2. A `GLB` with texture + skeleton can be entirely user-supplied and manipulated in browser; Blender-generated pose sprites are a robust low-memory alternative.
3. TTS weight downloads can be large. Capture actual byte size at runtime and display ahead of download. No auto prefetch on homepage, service worker or open-studio event.
4. No arbitrary JS execution through imported recipe/asset. Validate SVG scriptlessness; use isolated decoding; disallow remote URLs until opt-in.
5. Browser memory is finite; presets need tiered texture sizes, lazy model load/unload, cancel/resume handling and cleanup.
6. Real browser inference may not run in restrictive browsers; document FALLBACK rather than claiming coverage.
7. Never assert Remotion is license-free for a public online editor. Official docs have specific render-based company licensing and browser render telemetry.

## Required per-phase report/checklist fields

- Phase # and previously approved baseline commit.
- Changed files and local (non-remote) commit hash.
- Real browser user workflow steps and screenshots.
- Actual export filenames and contact sheet of scenes.
- Evidence of semantic preview/export parity and clean audio.
- Source asset provenance + licenses and downloaded bytes.
- High/medium/low defects found; each with code diff and retest proof.
- Remaining hard constraints and exact honest fallback.
- Creative scorecard with concrete human-observable reasons.
- **`AWAITING OWNER VISUAL APPROVAL; NOT PUSHED; NOT MERGED; NOT DEPLOYED; NEXT PHASE NOT STARTED`**.

## Primary sources for architecture and release choices

- [Remotion client-side renderer & telemetry](https://www.remotion.dev/docs/client-side-rendering/) — Client-side WebCodecs rendering exists; every client render sends a telemetry event. Verify before adding it.
- [Remotion licensing](https://www.remotion.dev/docs/license/pricing) — Automated video tools can require a commercial license. Do not assume free commercial embedding.
- [Kokoro browser implementation](https://github.com/hexgrad/kokoro/blob/main/kokoro.js/README.md) — Kokoro JS can run locally on WebGPU or WASM; availability/performance varies.
- [WebCodecs MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) — Low-level browser frame encoding/decoding; it is not a composition or art-direction engine.
- [WebAudio offline render](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) — Browser-side deterministic offline mixing independent from realtime sound hardware.
- [Three.js glTF loader](https://threejs.org/docs/pages/GLTFLoader.html) — Browser import of glTF models, paired with animation and toon/camera logic.
- [Blender glTF export manual](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html) — Blender can prepare portable glTF animations at asset-authoring time.
- [Three.js toon outlining](https://threejs.org/docs/pages/ToonOutlinePassNode.html) — WebGL toon outline effects require tested pipelines and performance budgets.



---

<!-- FILE: 01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md -->

# PHASE 01 — Visual Baseline, Creative Direction and First Publishable Slice

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 1 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Replace the engineering-demo aesthetic with one genuinely publishable, editable 20–25-second SaaS launch composition. Establish the visual standard before expanding the engine.

**Creative direction:** Three original directions: Editorial Kinetic (white, black, editorial typography), Cinematic SaaS (deep indigo with disciplined lighting and product-device renders), and Modern Educational (paper-white diagram-led teaching). Prototype three key frames for each; implement one complete approved-looking direction without awaiting a separate design selection.

**Required demonstrable output:** One polished 20–25s multi-shot SaaS promo titled “From raw data to clear answers”, plus a nine-frame storyboard sheet and old/new side-by-side.

**Phase prerequisites:** Existing working renderer, studio UI, baseline WebM artifacts, local .acstudio serialization; do not refactor the codec.

## 2. Source files and architecture contract

Inspect `assets/js/creative-studio/render-adapter.js` (`_renderCanonicalScene`), `studio-app.js`, `graphics-canvas.js`, `assets/creative-studio/templates/graphics-templates.json`, `creative-studio/index.html`, and six existing evidence WebMs. Propose `assets/js/creative-studio/visual/creative-director.js` and `/visual/reference-shot.js`.

**Engineering design:** Introduce an explicit `mode: production|diagnostics` render context. Design a 5-shot sequence with (1) compelling hook, (2) problem, (3) product/solution, (4) concrete benefit, (5) visual payoff/CTA. Keep each shot purposeful; distinguish editorial color, typography, graphic motif and sound accents.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Capture time-based contact sheets and 8–12s clips from all six current exports; document exact faults (debug text, empty space, bouncing orb, missing narrative).
2. Build a reference board with 12 public examples for composition principles—not copied logos/layouts—record source links and techniques.
3. Design three original art directions with frame sketches, safe-area rules, palette, type scale and animation tone; record tradeoffs.
4. Implement one complete five-shot composition as editable layers/scenes, using only bundled licensed/vector assets and native shapes.
5. Remove all frame numbers, developer labels, test orbs and progress bars from production output; keep optional diagnostics behind deliberate toggle.
6. Make first-frame, midpoint and final-frame compositions individually strong as still images; avoid centered title on empty background.
7. Demonstrate authoring and editing from visible UI controls; ensure project archive can reopen and mutate shots.
8. Compare exported result side-by-side with baseline, record deficiencies and repair them in the same phase.

## 4. Real user-facing editing workflow that must work

1. Choose art direction from a visible picker or preset
2. Edit headline, brand accent and shot duration from UI
3. Reorder or replace a shot via project layers
4. Preview full sequence, export genuine WebM and frame stills
5. Save, close, reopen, modify headline, export again

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. 20–25s coherent video with minimum 5 distinct purposeful shots and no engineer/debug elements
2. Text readable at 100% size and a scaled mobile video preview
3. A visual reviewer can explain the story without inspecting the source code
4. Visual comparison visibly improves composition, typography, palette and pacing over baseline
5. UI preview and export agree on three nominated timestamps
6. No custom test-only onRenderFrame callback used as primary evidence

**Exact live QA script:** Real user journey: open localhost `/creative-studio/` → select “SaaS Promo” → edit headline/brand color → preview five shots → export → extract frames at 1, 4, 8, 13, 19 and 23 seconds → archive → new browser session → edit scene 3 → re-export.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. No access to premium media: use custom SVG/vector compositions and user-owned or clearly licensed assets
2. Uncertain final brand preference: provide three previews and choose one documented provisional default
3. Existing renderer still injects debug content: isolate and disable from production path without regressing technical export

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 01**; do not open Phase 02.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-01/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 01

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 01 ONLY: Visual Baseline, Creative Direction and First Publishable Slice

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 01 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 02.

Implement: Replace the engineering-demo aesthetic with one genuinely publishable, editable 20–25-second SaaS launch composition. Establish the visual standard before expanding the engine.
Creative target: Three original directions: Editorial Kinetic (white, black, editorial typography), Cinematic SaaS (deep indigo with disciplined lighting and product-device renders), and Modern Educational (paper-white diagram-led teaching). Prototype three key frames for each; implement one complete approved-looking direction without awaiting a separate design selection.
Produce: One polished 20–25s multi-shot SaaS promo titled “From raw data to clear answers”, plus a nine-frame storyboard sheet and old/new side-by-side.
Source review: Inspect `assets/js/creative-studio/render-adapter.js` (`_renderCanonicalScene`), `studio-app.js`, `graphics-canvas.js`, `assets/creative-studio/templates/graphics-templates.json`, `creative-studio/index.html`, and six existing evidence WebMs. Propose `assets/js/creative-studio/visual/creative-director.js` and `/visual/reference-shot.js`.
Critical architecture: Introduce an explicit `mode: production|diagnostics` render context. Design a 5-shot sequence with (1) compelling hook, (2) problem, (3) product/solution, (4) concrete benefit, (5) visual payoff/CTA. Keep each shot purposeful; distinguish editorial color, typography, graphic motif and sound accents.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 02
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 01: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 01 CORRECTION LOOP. I have NOT accepted the Phase 01 visuals.
Read my feedback below and the Phase 01 acceptance gate. Stay exclusively in Phase 01.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 01 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 01 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 02.
Return `PHASE 01: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 01: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 01
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 02.
```

**To start the next phase, the owner must separately say** `PHASE 02: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 01

> **Binding instruction:** This addendum extends the original Phase 01 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Prove that the Creative Studio can produce a deliberate, aesthetically coherent composition from real editable assets, not merely encode pixels.

**Technology interpretation:** A staging version of the pose-switching parrot and SVG horror grammar; no Blender/TTS/3D engine mandate yet.

## Additional detailed implementation work (mandatory, not optional)

1. Inspect every uploaded old WebM at a minimum of 0%, 10%, 25%, 50%, 75%, 90%, 100%; create a side-by-side contact sheet and record exact problems (title size, negative space, meaningless orb, repeated footage, pacing, contrast and non-diegetic debug labels). Work from actual decodes, not the report alone.
2. Create three deliberate art-direction boards—Editorial Kinetic, Character Comedy, and Minimal Suspense. Each board must contain at least three actual 1280×720 still frames, coordinated fonts/color/spacing/character and a 5–7 line rationale. Do not imitate a specific copyrighted video.
3. Build the original 20–25s SaaS mini-promo from the baseline phase using five visual propositions (hook → tension → transformation → benefit → payoff); replace _renderCanonicalScene demo graphics with explicit production shot objects and keep developer diagnostics editor-only.
4. Produce a small 8–12s parrot pilot using an original/appropriately licensed pose sprite or character PNG sequence, text, layered props and three camera moves, and an 8–12s SVG suspense pilot using vector stick figures, controlled contrast and a deliberate reveal. These are design feasibility probes, not full advanced animation/voice features.
5. Ensure all three pilot compositions are editable with the current UI as far as existing controls allow, and archive/reopen with source attribution. Record unresolved abilities explicitly for their future phase rather than building shortcuts that cannot be edited later.
6. Draft the quality bar: deliberate shot purpose, large readable headline, subject focal point, non-repetitive compositions, motion supporting the story; distinguish still-frame appeal from motion quality.

## Live production-UI demonstration and evidence

- Polished 20–25s SaaS film; 8–12s parrot visual proof; 8–12s horror SVG visual proof, all genuinely exported from the production path.
- 3×3 art-direction board and old-vs-new contact sheet; save/reopen and edited re-export of at least one proof.
- No orange diagnostic orb/progress strip/frame counters in public exports.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-01/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Insufficient character imagery | Create original legal SVG/Canvas designs or import locally generated sprite PNGs; record license and source, never scrape copyrighted cartoon frames. |
| No sound subsystem yet | Use explicitly user-uploaded licensed voice/music or render visual-only pilots with a truthful note; Kokoro and audio automation stay in Phase 11. |
| Phase scope too broad | Implement one complete strong master film; keep auxiliary style proofs short and clearly separated; do not waive evidence for the main film. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 01 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 01 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 01 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 01 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Prove that the Creative Studio can produce a deliberate, aesthetically coherent composition from real editable assets, not merely encode pixels.
Technology interpretation: A staging version of the pose-switching parrot and SVG horror grammar; no Blender/TTS/3D engine mandate yet.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 01 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 01 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 01: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 01 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 01 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 02_DESIGN_TOKENS_LAYOUT_AND_SAFE_AREAS.md -->

# PHASE 02 — Visual Design Tokens, Grids and Composition Constraints

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 2 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Make every composition adhere to a coherent visual system, removing arbitrary coordinates and inconsistent spacing.

**Creative direction:** Premium editorial balance: 12-column desktop design grid, rhythm based on 8-point units, deliberate asymmetry, reusable light/dark palettes and restrained accent usage.

**Required demonstrable output:** Live layout editor displaying responsive guides plus three finished layouts (hero, comparison, statistic), all using shared constraints.

**Phase prerequisites:** Phase 01 approved visual direction and non-debug production output.

## 2. Source files and architecture contract

Inspect `graphics-canvas.js`, `studio-app.js`, `creative-studio.css`, project schemas; propose `/visual/design-tokens.js`, `/visual/layout-solver.js`, `/visual/constraint-schema.json`.

**Engineering design:** Declarative design tokens: `space, type, color, radius, shadow, z, safeInsets`, with `LayoutConstraint` of anchor, maxWidth, minSize, align, baseline and gap. Separate project coordinates from output pixel geometry; compute resolved layout per aspect ratio.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Implement semantic palette roles: background, surface, foreground, muted, accent, success, warning and overlay, with contrast checking.
2. Build compositional grids and baseline guides as editor overlays only; ensure absent in exported pixels.
3. Add anchor, percentage, intrinsic and min/max constraints with deterministic evaluation order and cycle detection.
4. Create alignment tools: snap-to-grid, edge/center snapping, distribute, equal-gap and safe-area highlighting.
5. Use measured padding and whitespace tokens for panels, title blocks, products, charts and footers.
6. Implement collision and off-canvas warnings; warn on ambiguous overlap, do not block intentional artistic overlap.
7. Migrate Phase 01 pilot without changing its appearance and preserve old project schema via migration.
8. Validate constrained layouts at 1920×1080, 1280×720, 1080×1920 and 1080×1080.

## 4. Real user-facing editing workflow that must work

1. Drag a block near grid guides and observe snapping
2. Change canvas size and watch constraints resolve
3. Select a title and apply an anchored layout preset
4. Toggle safe-area/grid overlays without embedding them in export
5. Save/reopen after layout edits

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No unintentional clipping on four named formats
2. At least three layout variations share tokens rather than copied hardcoded values
3. Grid/guide overlays never appear in export
4. Responsive layout has predictable identity across formats
5. Existing Phase 01 frames differ only where intentional

**Exact live QA script:** Change selected template to 9:16, move three objects using snapping, export screenshots, reopen and verify constrained positions; compare to 16:9 source.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Canvas text and DOM geometry differ: resolve through one frame-layout evaluator
2. Legacy project absolute positions: maintain schema migrations and sensible defaults
3. Designer freedom vs hard rules: allow intentional overlap override with visible warning

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 02**; do not open Phase 03.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-02/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 02

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 02 ONLY: Visual Design Tokens, Grids and Composition Constraints

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 02 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 03.

Implement: Make every composition adhere to a coherent visual system, removing arbitrary coordinates and inconsistent spacing.
Creative target: Premium editorial balance: 12-column desktop design grid, rhythm based on 8-point units, deliberate asymmetry, reusable light/dark palettes and restrained accent usage.
Produce: Live layout editor displaying responsive guides plus three finished layouts (hero, comparison, statistic), all using shared constraints.
Source review: Inspect `graphics-canvas.js`, `studio-app.js`, `creative-studio.css`, project schemas; propose `/visual/design-tokens.js`, `/visual/layout-solver.js`, `/visual/constraint-schema.json`.
Critical architecture: Declarative design tokens: `space, type, color, radius, shadow, z, safeInsets`, with `LayoutConstraint` of anchor, maxWidth, minSize, align, baseline and gap. Separate project coordinates from output pixel geometry; compute resolved layout per aspect ratio.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 03
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 02: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 02 CORRECTION LOOP. I have NOT accepted the Phase 02 visuals.
Read my feedback below and the Phase 02 acceptance gate. Stay exclusively in Phase 02.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 02 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 02 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 03.
Return `PHASE 02: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 02: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 02
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 03.
```

**To start the next phase, the owner must separately say** `PHASE 03: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 02

> **Binding instruction:** This addendum extends the original Phase 02 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make reusable design constraints that work for speaking characters, caption blocks, props, foreground/background and title-card shots.

**Technology interpretation:** Remotion-like composition layouts authored as browser-native objects, without Remotion as a production dependency.

## Additional detailed implementation work (mandatory, not optional)

1. Add design tokens for character scale, prop elevation, outline stroke, subject safe-zone, caption area, cinematic letterbox or full-screen choice, scene depth, corner radius, shadows and semantic colors.
2. Create responsive constraint solver for left/right/center character, dialogue-caption lower third, two-up reaction, prop-insertion reveal, UI mockup, silhouette horror and punchline card; reserve blank space intentionally.
3. Expose visual guides in the editor that never become part of export; prevent captions from overlapping faces, characters from clipping the 9:16 safe zone and logos from sitting under platform chrome.
4. Support foreground/midground/background parallax transforms through one consistent design coordinate system, with normalized positions plus absolute pixel fallbacks.
5. Prove layout survives replacing a short sentence with a long Spanish and Danish translation and with a different parrot pose size.
6. Keep preexisting SaaS/motion/still artwork layouts functional and ensure the same layout evaluation is called in preview and offline export.

## Live production-UI demonstration and evidence

- Three new polished story layouts (character dialogue, horror silhouette, animated product) in 16:9 and previewed in 9:16.
- Collision and safe-area screenshots with guides turned on and final clean export with guides off.
- A deterministic viewport-layout snapshot test for EN/ES/DA text expansion.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-02/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Text collision with subjects | Use region reservations, line wrap, minimum font-size and editorial warnings before export. |
| Layout constraints break older scenes | Add schema defaults, migration tests, and an opt-in layout-engine version per scene. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 02 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 02 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 02 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 02 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make reusable design constraints that work for speaking characters, caption blocks, props, foreground/background and title-card shots.
Technology interpretation: Remotion-like composition layouts authored as browser-native objects, without Remotion as a production dependency.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 02 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 02 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 02: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 02 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 02 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 03_PROFESSIONAL_TYPOGRAPHY_AND_KINETIC_TEXT.md -->

# PHASE 03 — Professional Typography, Text Shaping and Kinetic Treatments

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 3 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Replace tiny labels and naive fillText with readable, editorial typography and purposeful animated text.

**Creative direction:** A controlled type scale (hero 80–140px at 1080p, headline 48–82, body 28–42, label 20–28 as situational starting points), two complementary type families, strong leading and intentional line breaks.

**Required demonstrable output:** A 15–20s kinetic-typography composition with 6 distinct text treatments and actual multiline paragraphs, all editable.

**Phase prerequisites:** Phase 02 layout constraints.

## 2. Source files and architecture contract

Inspect `graphics-canvas.js`, `_renderCanonicalScene`, font imports; propose `/visual/text-layout.js`, `/visual/font-manager.js`, `/visual/kinetic-type.js`.

**Engineering design:** `TextNode` contains semantic role, content, fontFamily, weights, size, tracking, lineHeight, maxLines, maxWidth, align, baseline, overflowPolicy, lineBreakStrategy; preflight font loading with `document.fonts.ready`, `TextMetrics`, script/locale fallback and layout bounding boxes.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Implement measured multiline wrapping, explicit newline, punctuation-aware breaking and ellipsis/shrink policies.
2. Create line-height, tracking, weight, optical-size and baseline handling; test high-DPI exports.
3. Self-host two or three permissively licensed fonts with required license text (do not redistribute restricted fonts).
4. Define text roles for hook, hero, kicker, body, caption, quote, number, statistic and CTA.
5. Implement line/word/character stagger, masked rise, tracked reveal, kinetic emphasis, animated numerical counter and highlight sweeps.
6. Prevent late web-font layout shift: wait for fonts, measure once, allow fallback warning and stable export.
7. Test Danish and Spanish diacritics and long translated phrases, plus user-entered emoji/complex scripts fallback.
8. Provide deterministic text keyframes shared by timeline preview and exporter.

## 4. Real user-facing editing workflow that must work

1. Paste a two-paragraph description and see correct wrapping
2. Switch fonts and line height live
3. Pick text animation and adjust start, length and stagger
4. Create visible emphasis without overusing effects
5. Reopen and modify accented Danish/Spanish content

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No overflow/occlusion across 16:9, 9:16 and 1:1
2. Six effects visibly differ and express a textual hierarchy
3. All text effects reproduce identically from sampled frame/time
4. Correct glyph rendering for chosen EN/ES/DA fixtures
5. Text contrast and caption legibility pass agreed checks

**Exact live QA script:** Compose a 15s product hook with 12-word headline, two-line subhead and CTA; switch EN→ES→DA text; export and inspect every reveal stage.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Canvas shaping differences: use browser text metrics and a consistent font/layout engine; scope complex-script support honestly
2. Font licensing/CORS: self-host legal fonts, document provenance
3. Small vertical canvas: reflow and line-count presets instead of pure scaling

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 03**; do not open Phase 04.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-03/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 03

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 03 ONLY: Professional Typography, Text Shaping and Kinetic Treatments

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 03 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 04.

Implement: Replace tiny labels and naive fillText with readable, editorial typography and purposeful animated text.
Creative target: A controlled type scale (hero 80–140px at 1080p, headline 48–82, body 28–42, label 20–28 as situational starting points), two complementary type families, strong leading and intentional line breaks.
Produce: A 15–20s kinetic-typography composition with 6 distinct text treatments and actual multiline paragraphs, all editable.
Source review: Inspect `graphics-canvas.js`, `_renderCanonicalScene`, font imports; propose `/visual/text-layout.js`, `/visual/font-manager.js`, `/visual/kinetic-type.js`.
Critical architecture: `TextNode` contains semantic role, content, fontFamily, weights, size, tracking, lineHeight, maxLines, maxWidth, align, baseline, overflowPolicy, lineBreakStrategy; preflight font loading with `document.fonts.ready`, `TextMetrics`, script/locale fallback and layout bounding boxes.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 04
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 03: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 03 CORRECTION LOOP. I have NOT accepted the Phase 03 visuals.
Read my feedback below and the Phase 03 acceptance gate. Stay exclusively in Phase 03.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 03 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 03 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 04.
Return `PHASE 03: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 03: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 03
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 04.
```

**To start the next phase, the owner must separately say** `PHASE 04: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 03

> **Binding instruction:** This addendum extends the original Phase 03 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Give characters and suspense shots expressive readable typography, while keeping text editable and language-safe.

**Technology interpretation:** Remotion-like kinetic typography using native per-frame interpolation, glyph metrics, text layouts and caption event objects.

## Additional detailed implementation work (mandatory, not optional)

1. Build a typography hierarchy: hero hooks, punchline emphasis, spoken-word captions, whisper cards, horror note overlays, subtitles, numeric callouts; choose licensed web fonts with audited fallbacks.
2. Implement measured multiline wrapping, max-lines, exact line-height, typographic tracking, word-level styled spans, punctuation placement and bounding boxes; support actual Unicode glyphs in EN/ES/DA.
3. Author word-pop, masked reveal, type-on, tracking settle, rhythmic underline, highlighted key phrase, shadow echo and suspense gradual reveal effects—all frame-sampled, not setTimeout-driven.
4. Include 9:16 caption safe zones and outline/shadow for real footage; ensure captions remain readable in noisy backgrounds with configurable contrast treatment.
5. Add text animations declaratively to project JSON and import/export without flattening or JS injection.
6. Set a no-flashy-text rule: every effect should serve comedic timing, explanation or dread; do not animate every word for no reason.

## Live production-UI demonstration and evidence

- A 15–20s typography mini-film with six distinct meaningful treatments and both fun and suspense variants.
- Screenshots of difficult text wrapping and identical words in preview/export at 0%, 50%, 100% cue progress.
- Save/reopen/edit caption wording without losing animation.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-03/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Font differs between UI and exported canvas | Wait for FontFaceSet readiness and use shared shaping/layout metrics; warn when a font cannot be embedded. |
| Word timing unavailable before Phase 11 | Use deterministic hand-entered timing and imported caption cue data; automatic alignment comes in Phase 11. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 03 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 03 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 03 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 03 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Give characters and suspense shots expressive readable typography, while keeping text editable and language-safe.
Technology interpretation: Remotion-like kinetic typography using native per-frame interpolation, glyph metrics, text layouts and caption event objects.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 03 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 03 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 03: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 03 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 03 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 04_MOTION_GRAPH_EASING_SPRINGS_AND_STAGGER.md -->

# PHASE 04 — Frame-Deterministic Motion Graph, Easing and Springs

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 4 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Create Remotion-grade animation behaviour with intentional timing, not random oscillations.

**Creative direction:** Natural movement with arrivals, subtle overshoot, anticipation and held readability; motion must reveal relationships or change focus.

**Required demonstrable output:** A 20s motion showreel displaying 10 useful primitives on real content and one redesigned Phase 01 scene.

**Phase prerequisites:** Phases 02 and 03 approved.

## 2. Source files and architecture contract

Inspect `animation-engine.js`, timeline code in `studio-app.js`, project schemas and `render-adapter.js`; propose `/visual/motion-graph.js`, `/visual/easings.js`.

**Engineering design:** Timeline tracks identified by stable layer IDs, keys `{frame,value,ease,inTangent,outTangent}`; evaluator pure from `frame` and project state. Implement cubic Bezier, easeOutExpo, damped spring, hold, linear, stagger, overshoot and path motion, with explicit clamping and local time.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Implement reusable `enter/settle/hold/emphasize/exit` animation patterns and focus hierarchy.
2. Build frame-based interpolation, stable keyframe ordering, deterministic spring integration or analytical solution.
3. Animate transform, opacity, clip progress, mask offset, number values and color interpolation where supported.
4. Add grouping/parent-child transforms, relative timing and stagger with per-item delays.
5. Implement motion presets: fade-rise, reveal, slide, scale-pop, rotation, orbit, focus-zoom, underline draw, staggered cards and path follow.
6. Add scrubbable timeline curves and bounded duration controls in editor.
7. Respect reduced-motion preview option, without forcing published videos to differ from the user-selected motion style.
8. Test random seek to last frame before first playback and repeat exports against pixel signatures.

## 4. Real user-facing editing workflow that must work

1. Assign two different motion presets to same element
2. Drag keyframe times in timeline
3. Scrub backward/forward and jump to arbitrary frame
4. Change easing curves and view result live
5. Export twice and compare selected decoded frames

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. Same project/time produces same transform and pixels under deterministic settings
2. 10 primitives work without flicker or visual popping
3. Animation never requires wall-clock setTimeout sequencing for export timing
4. No unintended overshoot beyond safe bounds
5. Preview/export parity across 12 timestamp samples

**Exact live QA script:** Open a multi-layer hero, animate 5 entries, scrub to frames 0,7,15,30,45,90, and export; compare screenshots at those exact frames.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Existing animation engine assumes wall-clock: adapt it to pure frame evaluation
2. Scene-local versus global times: formalize conversion
3. High node counts: cache resolved static layout and only evaluate animated properties

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 04**; do not open Phase 05.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-04/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 04

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 04 ONLY: Frame-Deterministic Motion Graph, Easing and Springs

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 04 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 05.

Implement: Create Remotion-grade animation behaviour with intentional timing, not random oscillations.
Creative target: Natural movement with arrivals, subtle overshoot, anticipation and held readability; motion must reveal relationships or change focus.
Produce: A 20s motion showreel displaying 10 useful primitives on real content and one redesigned Phase 01 scene.
Source review: Inspect `animation-engine.js`, timeline code in `studio-app.js`, project schemas and `render-adapter.js`; propose `/visual/motion-graph.js`, `/visual/easings.js`.
Critical architecture: Timeline tracks identified by stable layer IDs, keys `{frame,value,ease,inTangent,outTangent}`; evaluator pure from `frame` and project state. Implement cubic Bezier, easeOutExpo, damped spring, hold, linear, stagger, overshoot and path motion, with explicit clamping and local time.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 05
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 04: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 04 CORRECTION LOOP. I have NOT accepted the Phase 04 visuals.
Read my feedback below and the Phase 04 acceptance gate. Stay exclusively in Phase 04.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 04 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 04 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 05.
Return `PHASE 04: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 04: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 04
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 05.
```

**To start the next phase, the owner must separately say** `PHASE 05: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 04

> **Binding instruction:** This addendum extends the original Phase 04 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make pose swapping and motion feel acted, intentional and frame accurate—not like a spinning icon.

**Technology interpretation:** Pose atlas switching, simple 2D puppet rig, spring/ease motions, camera and prop tracks evaluated by absolute frame.

## Additional detailed implementation work (mandatory, not optional)

1. Implement typed motion tracks for scale/rotation/position/opacity, sprite poseId, squash-stretch, head tilt, eye direction, arm pose and held frames.
2. Store pose atlases and transparencies with crop rects or PNG asset refs; support non-uniform pose proportions without visible jumps, plus pivot/anchor data per pose.
3. Use eased anticipation/action/settle profiles and frame-indexed keyframes with deterministic seeded randomness for micro-shake. No wall-clock-dependent frame choices.
4. Create a browser-native puppet controller with named actions: idle, blink, talk, shocked, excited, recoil, point, exit; map to allowed pose IDs rather than arbitrary code.
5. Implement accessible reduce-motion preview mode without changing the intended saved video unless the user explicitly asks.
6. Add a motion-debug overlay in editor only that visualizes curves and pose switches, never exported.

## Live production-UI demonstration and evidence

- 20s motion study with parrot reaction, calm-to-shock, prop entrance and a separate suspense jump cut.
- Frame-exact tests of pose selection, easing outputs and seeded camera shake (same input+frame -> same pixels).
- A frame-by-frame strip across each pose change with no teleporting anchor/limb errors.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-04/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Pose images have inconsistent bounds | Normalize with explicit character local coordinates/pivots and visual atlas QC. |
| Easing causes overshoot beyond canvas | Clamp or constraint-aware motion bounds with on-screen warnings; validate no clipped characters. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 04 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 04 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 04 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 04 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make pose swapping and motion feel acted, intentional and frame accurate—not like a spinning icon.
Technology interpretation: Pose atlas switching, simple 2D puppet rig, spring/ease motions, camera and prop tracks evaluated by absolute frame.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 04 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 04 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 04: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 04 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 04 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 05_TRANSITIONS_MASKS_AND_CHOREOGRAPHY.md -->

# PHASE 05 — Cinematic Transitions, Masks and Shared-Element Choreography

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 5 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Make scene boundaries feel directed instead of abrupt title/color changes.

**Creative direction:** Use visual continuity: shared objects travel between shots, masks reveal subjects and transitions respond to meaning.

**Required demonstrable output:** 30s seven-shot sequence demonstrating four understated transition families and two shared-element handoffs.

**Phase prerequisites:** Phases 02–04; timeline evaluator stable.

## 2. Source files and architecture contract

Inspect compositor and project scene model; propose `/visual/mask-engine.js`, `/visual/transition-engine.js`, `/visual/choreography.js`.

**Engineering design:** Transition tracks with two simultaneously evaluated scenes across overlap; compositor handles clip/mask, alpha, depth and optional shared-node mapping by stable `sharedId`. Source scenes remain independently editable.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Build hard-cut, fade, directional wipe, masked shape reveal and shared-element transforms.
2. Add adjustable overlap window and transition duration; revise total timeline accounting and audio sync.
3. Support rounded corners, gradients and image matte masks with clipping safety.
4. Implement Z-order ownership and composition cache for overlapping shots.
5. Show per-transition preview scrubber and meaningful controls in UI.
6. Avoid gratuitous transitions: keep cuts as the default and use semantic rules.
7. Support transitions in 9:16 without horizontal elements leaving safe framing.
8. Test precise boundary frames before, at and after transition start/end, including reopen.

## 4. Real user-facing editing workflow that must work

1. Pick transition between two existing scenes
2. Change transition overlap
3. Connect shared element in scene A/B
4. Preview a hard cut versus mask transition
5. Save/reopen and export boundary frames

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No black frames, leaks, stale masks or duplicate elements at joins
2. Two shared-element transitions visibly track one conceptual object across scenes
3. Preview/export parity at 12 sampled boundary frames
4. No transition alters expected total duration silently
5. Export remains pixel- and frame-deterministic

**Exact live QA script:** Edit a 4-scene video; add mask transitions and a shared icon; scrub ±10 frames at three joins; export and compare boundary contact sheet.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Mask features vary by browser: Canvas2D clipping fallback
2. Expensive double-scene rendering: cache layers and limit expensive effects
3. Shader effects: use only if equivalent fallback tested

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 05**; do not open Phase 06.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-05/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 05

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 05 ONLY: Cinematic Transitions, Masks and Shared-Element Choreography

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 05 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 06.

Implement: Make scene boundaries feel directed instead of abrupt title/color changes.
Creative target: Use visual continuity: shared objects travel between shots, masks reveal subjects and transitions respond to meaning.
Produce: 30s seven-shot sequence demonstrating four understated transition families and two shared-element handoffs.
Source review: Inspect compositor and project scene model; propose `/visual/mask-engine.js`, `/visual/transition-engine.js`, `/visual/choreography.js`.
Critical architecture: Transition tracks with two simultaneously evaluated scenes across overlap; compositor handles clip/mask, alpha, depth and optional shared-node mapping by stable `sharedId`. Source scenes remain independently editable.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 06
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 05: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 05 CORRECTION LOOP. I have NOT accepted the Phase 05 visuals.
Read my feedback below and the Phase 05 acceptance gate. Stay exclusively in Phase 05.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 05 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 05 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 06.
Return `PHASE 05: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 05: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 05
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 06.
```

**To start the next phase, the owner must separately say** `PHASE 06: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 05

> **Binding instruction:** This addendum extends the original Phase 05 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Deliver scene-to-scene transitions and micro-choreography appropriate to comedy and suspense.

**Technology interpretation:** Layer masks, shared-element transitions, on-beat prop hits, camera whip and restrained shake.

## Additional detailed implementation work (mandatory, not optional)

1. Create masked reveal, match-cut, occlusion wipe, motion-blur-like smear, silhouette cut and shared-element transforms; avoid indiscriminate slideshow dissolves.
2. Introduce two-shot composition choreography: parrot looks right as prop enters from right; horror silhouette appears after a held empty frame.
3. Tie transitions to explicit storyboard beats, allow pre-roll/post-roll and ease durations but maintain same absolute frame clock.
4. Add visual continuity helpers for position, brightness, subject scale, gaze direction and camera line across cuts.
5. Capture alpha/mask correctness at 720p; test translucent PNG and SVG under mask and Safari alternative fallback path where available.
6. Prohibit false cinematic claims from a single generic zoom; create emotion-specific transition presets and evidence of use.

## Live production-UI demonstration and evidence

- 30s transition short with comedy and horror transition families used in meaningful context.
- Timeline screenshot of match-cut/shared-element handoff; frame strips at five cuts.
- No black frames, alpha edge glitches or double-rendered props.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-05/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Canvas compositing and SVG masks diverge | Centralize clip/mask evaluation; raster fallback for unsupported filters with documented quality impact. |
| Motion blur expensive | Use sparse directional trails and caps; performance test low-power GPU before allowing high quality preset. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 05 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 05 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 05 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 05 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Deliver scene-to-scene transitions and micro-choreography appropriate to comedy and suspense.
Technology interpretation: Layer masks, shared-element transitions, on-beat prop hits, camera whip and restrained shake.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 05 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 05 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 05: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 05 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 05 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 06_SHOT_LIBRARY_AND_VISUAL_PATTERNS.md -->

# PHASE 06 — Professionally Designed Shot Library and Composition Components

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 6 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Provide reusable movie-making building blocks that carry meaning, so users do not have to hand-code scenes.

**Creative direction:** Twelve recognizable editorial shot types with carefully controlled art direction; content-driven not random.

**Required demonstrable output:** A searchable 12-shot library and a 40s mini-video assembled from 8 diverse shots.

**Phase prerequisites:** Phases 02–05.

## 2. Source files and architecture contract

Inspect `/assets/creative-studio/templates/graphics-templates.json` and studio UI; propose `/visual/shot-registry.js`, `/visual/shot-components/`, `/visual/shot-params.schema.json`.

**Engineering design:** `Shot` factory receives `{intent, content, palette, assets, aspect, durationFrames}` and returns editable scene graph children; each shot exposes constrained parameters, content validation and layout tests.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Ship 12 polished primitives: title hero, statistic, process, feature stack, before/after, comparison, quote, explainer diagram, product mockup, timeline, testimonial and CTA.
2. For each, design meaningful default visuals, content limits, layout constraints, animation timeline and asset slots.
3. Implement preview thumbnails with honest representative content, keyboard navigation and category descriptions.
4. Permit replacing all default words/assets and converting shot to editable layers without flattening.
5. Create balanced shot-selection guidance: vary purpose, background and pace, not merely color.
6. Add import-safe registry version and graceful missing-asset fallback.
7. Do not duplicate output via twelve renamed template colors; require composition-distinct layouts.
8. Create a 40s story from eight shot types and inspect transitions and readability.

## 4. Real user-facing editing workflow that must work

1. Open shot gallery, filter by purpose
2. Add a statistic and edit value/unit/source
3. Replace media in feature shot
4. Reorder shots and adjust duration
5. Export and reopen as editable project

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. 12 distinct semantic shot patterns with varied layouts, not recolors
2. Each shot works with long text and absent optional assets
3. At least 8 shots combine into a coherent narrative without visual collisions
4. No background debug overlays or default engineering text
5. Each shot survives archive roundtrip

**Exact live QA script:** Build an 8-shot product explainer entirely from gallery; change 8 pieces of content; export 40s and audit contact sheet.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Missing assets: fallback to well-designed vector variants instead of broken media
2. Schema stability: template version and migration
3. Performance: thumbnails rendered at small resolution lazily

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 06**; do not open Phase 07.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-06/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 06

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 06 ONLY: Professionally Designed Shot Library and Composition Components

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 06 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 07.

Implement: Provide reusable movie-making building blocks that carry meaning, so users do not have to hand-code scenes.
Creative target: Twelve recognizable editorial shot types with carefully controlled art direction; content-driven not random.
Produce: A searchable 12-shot library and a 40s mini-video assembled from 8 diverse shots.
Source review: Inspect `/assets/creative-studio/templates/graphics-templates.json` and studio UI; propose `/visual/shot-registry.js`, `/visual/shot-components/`, `/visual/shot-params.schema.json`.
Critical architecture: `Shot` factory receives `{intent, content, palette, assets, aspect, durationFrames}` and returns editable scene graph children; each shot exposes constrained parameters, content validation and layout tests.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 07
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 06: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 06 CORRECTION LOOP. I have NOT accepted the Phase 06 visuals.
Read my feedback below and the Phase 06 acceptance gate. Stay exclusively in Phase 06.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 06 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 06 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 07.
Return `PHASE 06: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 06: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 06
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 07.
```

**To start the next phase, the owner must separately say** `PHASE 07: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 06

> **Binding instruction:** This addendum extends the original Phase 06 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Turn one-off effects into reliable, art-directed shot archetypes that editors can assemble quickly.

**Technology interpretation:** Reusable 2D character/action patterns and SVG suspense shot components plus existing educational/SaaS shot library.

## Additional detailed implementation work (mandatory, not optional)

1. Add shot archetypes: facial reaction, object reveal, call-and-response, over-shoulder, punchline freeze, big-number hook, before/after, step diagram, dark corridor, ominous silhouette, shadow reveal and final CTA.
2. Each shot schema declares purpose, focal region, estimated hold time, animation entrance, exit, required asset slots, caption lane and mobile behavior.
3. Build a character blocking layer for foreground and prop z-order; provide palette consistency and reusable character/prop scale.
4. Allow thumbnails/shot previews without full render or API calls; all demo shots use original/licensed visuals and editable inputs.
5. Add searchable labels and category filters; selecting a shot inserts editable composition layers, not a pre-rendered 720p video.
6. Audit repetition: a 40s video assembled from eight shots must genuinely vary camera, scale, subject/visual purpose and rhythm.

## Live production-UI demonstration and evidence

- At least 12 shot components with PNG previews and matching exported short clips.
- A coherent 40s short using eight different archetypes; editable parrot and suspense scenes.
- A template manifest audit proving no proprietary assets were silently copied.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-06/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Too many generic shots | Limit first batch to 12 with clear dramatic roles and QA; reject filler shot packs. |
| Shot inserts do not integrate with editor | Create a contract adapter and a real insertion UI test before approving shot library count. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 06 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 06 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 06 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 06 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Turn one-off effects into reliable, art-directed shot archetypes that editors can assemble quickly.
Technology interpretation: Reusable 2D character/action patterns and SVG suspense shot components plus existing educational/SaaS shot library.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 06 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 06 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 06: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 06 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 06 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 07_MEDIA_TREATMENT_AND_PRODUCT_MOCKUPS.md -->

# PHASE 07 — Photography, Video Footage Treatment and Product Mockups

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 7 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Turn user-provided stills/screenshots/videos into professional-looking shots without paid media generation.

**Creative direction:** Focal crop, depth, frame-within-frame, tasteful highlights, phone/browser mockups, layered cards and parallax.

**Required demonstrable output:** 25s feature film using one screenshot, one photo, one local footage clip and two UI mockups.

**Phase prerequisites:** Phases 02–06; asset registry and archive path work.

## 2. Source files and architecture contract

Inspect media import and asset resolver in studio, `graphics-canvas.js`, video decode modules; propose `/visual/media-presenter.js`, `/visual/mockups.js`, `/visual/focal-crop.js`.

**Engineering design:** `MediaLayer` with source hash, focalPoint (0..1), fit, mask, crop, color adjustments, deviceFrame, parallaxTrack and rights metadata. Export draws decoded frames at exact project timestamps; no unauthorized downloads.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Create cover/contain focal cropping with user-controlled subject pin and safe area.
2. Support rounded masks, shadow stacks, subtle glare, depth layering and controlled parallax.
3. Implement laptop, mobile and browser-window mockups with customizable frame/no actual brand trademark dependence.
4. Support low-res warnings, upscaling disclosure and asset orientation handling.
5. Provide deterministic asset preload and graceful offline failures with an actionable media-resolve notice.
6. Enable replacing footage while preserving timing and overlay layers.
7. Preserve input media and metadata in .acstudio without embedding source URLs requiring network.
8. Verify preview frame and exported frame match at chosen timestamps.

## 4. Real user-facing editing workflow that must work

1. Import real image, crop and pin focal point
2. Drag screenshot into device mockup
3. Add footage and apply time-bounded frame overlay
4. Replace clip without losing typography
5. Export/reopen with byte-identical media

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. Source imagery treated professionally with no stretching
2. No black/empty frames caused by asynchronous media decoding
3. At least two distinct believable device mockups
4. Export keeps same crop/focal point and timing as preview
5. Works with offline local assets and preserves rights metadata

**Exact live QA script:** Import a screen recording, a portrait and an app screenshot; create two device shots and a parallax media shot; export and compare source and output.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Browser codec limitations: detect and show media compatibility path, no hidden server conversion
2. Large photos: downscale cache previews while preserve originals
3. Copyright: use own/licensed media; license and provenance fields mandatory

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 07**; do not open Phase 08.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-07/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 07

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 07 ONLY: Photography, Video Footage Treatment and Product Mockups

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 07 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 08.

Implement: Turn user-provided stills/screenshots/videos into professional-looking shots without paid media generation.
Creative target: Focal crop, depth, frame-within-frame, tasteful highlights, phone/browser mockups, layered cards and parallax.
Produce: 25s feature film using one screenshot, one photo, one local footage clip and two UI mockups.
Source review: Inspect media import and asset resolver in studio, `graphics-canvas.js`, video decode modules; propose `/visual/media-presenter.js`, `/visual/mockups.js`, `/visual/focal-crop.js`.
Critical architecture: `MediaLayer` with source hash, focalPoint (0..1), fit, mask, crop, color adjustments, deviceFrame, parallaxTrack and rights metadata. Export draws decoded frames at exact project timestamps; no unauthorized downloads.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 08
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 07: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 07 CORRECTION LOOP. I have NOT accepted the Phase 07 visuals.
Read my feedback below and the Phase 07 acceptance gate. Stay exclusively in Phase 07.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 07 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 07 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 08.
Return `PHASE 07: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 07: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 07
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 08.
```

**To start the next phase, the owner must separately say** `PHASE 08: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 07

> **Binding instruction:** This addendum extends the original Phase 07 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make Blender-derived assets and local photos/videos practical in browser editing without shipping Blender to users.

**Technology interpretation:** Optional offline authoring with Blender bpy, glTF/GLB import, pose PNG atlases, SVG figures and browser media pipelines.

## Additional detailed implementation work (mandatory, not optional)

1. Document Blender as OPTIONAL development or user desktop tooling for creating original/licensed assets; Blender bpy/Cycles/Freestyle are not a web runtime promise.
2. Build browser import of glTF/GLB, RGBA pose PNGs, spritesheets, SVG and raster images; validate type, origin, asset size, transparency and dimensions.
3. Create a pose atlas conversion/import UI with order, name, pivot, silhouette thumbnail, idle/talk/react pose assignment and alpha premultiplication checks.
4. Support posterization/toon/duotone/LUT-like looks, grain, vignette, shadow, stroke and foreground separation for available image/video assets; non-destructive effect stacks.
5. Add project asset manifest (hash, license, attribution, source link if known, usage rights, dimensions, extraction method) and bundle source media in .acstudio where legal/size permits.
6. Design fallback when large GLB exceeds memory: use Blender-pre-rendered pose images rather than converting GLB through server infrastructure.
7. Verify real UI footage treatment and character atlas compositing both at preview size and exported resolution.

## Live production-UI demonstration and evidence

- Original/licensed parrot asset converted into at least 8 named poses, with a live browser animation and all assets in .acstudio.
- One genuine external photo, one six-second local footage clip and one mocked-up product interface in a polished 25s export.
- Reopen assets across fresh browser session with SHA-256 matching and an asset-rights manifest.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-07/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Browser cannot run full Blender Cycles | Treat pose rendering as offline authoring only; users upload PNG/GLB; never ship Python bpy binaries to frontend. |
| Untrusted SVG / huge assets | Sanitize SVG; strict memory/size caps; reject scripts/external references; avoid unsafe HTML embedding. |
| Media decoding varies by browser | Probe supported codecs; offer still-photo/pose fallback; never fake a decoded video import. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 07 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 07 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 07 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 07 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make Blender-derived assets and local photos/videos practical in browser editing without shipping Blender to users.
Technology interpretation: Optional offline authoring with Blender bpy, glTF/GLB import, pose PNG atlases, SVG figures and browser media pipelines.

Implement EACH of the 7 numbered V2 tasks above AND every original Phase 07 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 07 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 07: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 07 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 07 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 08_DATA_DIAGRAMS_AND_PROCEDURAL_STORYTELLING.md -->

# PHASE 08 — Animated Charts, Diagrams and Visual Explanations

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 8 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Give education/business videos genuine explanatory imagery instead of generic animated shapes.

**Creative direction:** Elegant line-and-area charts, animated flow systems, process arrows, bar chart races (restrained), timelines and cause-effect callouts.

**Required demonstrable output:** 45–60s educational explainer “How Solar Panels Generate Electricity” with six diagram-led scenes and a real data chart.

**Phase prerequisites:** Phases 02–07.

## 2. Source files and architecture contract

Inspect scene graph and vector drawing; propose `/visual/diagram-layout.js`, `/visual/chart-components.js`, `/visual/procedural-illustrations/`.

**Engineering design:** Semantic diagram model of nodes/edges/groups with auto-layout, routing, labels and reveal order; chart model `{series,units,range,source}` with readable ticks and animation of plotted values (not falsified data).

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Create flowchart, step process, comparison, concept map, timeline and bar/line chart shots.
2. Use vector primitives and SVG assets with consistent stroke and diagram grid.
3. Implement labels and arrow routing to avoid overlaps; highlight current step by semantic cue.
4. Animate processes in explanatory order with pauses timed for comprehension.
5. Build chart input validation and explicit data provenance labels where appropriate.
6. Avoid decorative random values and misleading scales; animate numeric graphics faithfully.
7. Produce an original six-scene solar-energy teaching sequence using iconography and arrows.
8. Test accessibility: noncolor cues, legible axis labels, high contrast and reduced-motion presentation alternative.

## 4. Real user-facing editing workflow that must work

1. Create a five-step process by editing labels
2. Change chart values and units in data panel
3. Reorder reveal sequence
4. Switch diagram style with same content
5. Export educational piece and reopen to edit step 3

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. Viewer can state causal process after watching without reading code
2. At least six distinct original explanatory scenes
3. All numbers match source dataset and plotted geometry
4. No intersecting arrows or unreadable text in tested layouts
5. Scene 3 can be changed without rebuilding scenes 1,2,4–6

**Exact live QA script:** Enter six teaching facts and a small chart, generate a 50s storyboard, revise one statistic, export and verify contact sheet and full playback.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Complex automatic layout: begin with deterministic constrained templates, document limits
2. Charts with missing/negative/outlier data: validate and render truthful axes
3. Large diagrams on mobile: create overview-and-zoom shots rather than shrinking everything

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 08**; do not open Phase 09.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-08/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 08

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 08 ONLY: Animated Charts, Diagrams and Visual Explanations

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 08 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 09.

Implement: Give education/business videos genuine explanatory imagery instead of generic animated shapes.
Creative target: Elegant line-and-area charts, animated flow systems, process arrows, bar chart races (restrained), timelines and cause-effect callouts.
Produce: 45–60s educational explainer “How Solar Panels Generate Electricity” with six diagram-led scenes and a real data chart.
Source review: Inspect scene graph and vector drawing; propose `/visual/diagram-layout.js`, `/visual/chart-components.js`, `/visual/procedural-illustrations/`.
Critical architecture: Semantic diagram model of nodes/edges/groups with auto-layout, routing, labels and reveal order; chart model `{series,units,range,source}` with readable ticks and animation of plotted values (not falsified data).

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 09
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 08: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 08 CORRECTION LOOP. I have NOT accepted the Phase 08 visuals.
Read my feedback below and the Phase 08 acceptance gate. Stay exclusively in Phase 08.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 08 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 08 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 09.
Return `PHASE 08: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 08: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 08
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 09.
```

**To start the next phase, the owner must separately say** `PHASE 09: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 08

> **Binding instruction:** This addendum extends the original Phase 08 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Add a reason for every visual in educational scenes, rather than decorating the screen with unrelated geometric objects.

**Technology interpretation:** Data-bound charts, diagrams, SVG/vector figures, procedural symbols and character-driven visual explanations.

## Additional detailed implementation work (mandatory, not optional)

1. Build deterministic primitive library for arrows, causal flows, counters, progressions, graphs, comparisons, icon callouts and simplified educational diagrams.
2. Use story-defined motion: diagram segments appear when explained, chart values animate accurately from real data and comedy props react to actions.
3. Add keyed anchor points and callouts that follow source objects or characters, keeping caption and callout lanes separate.
4. Support SVG stick figures and primitive puppetry for suspense with safe path transforms and color/opacity animation.
5. Implement timing grammar: setup → demonstration → highlight → takeaway, with beats expressible in VisualRecipe.
6. Create a 45–60s explainer with six genuinely different teaching compositions and a short parallel horror vector shot; keep true data labeled as facts vs example values.

## Live production-UI demonstration and evidence

- Six diagram-led explainer shots with annotated source data and visible transformations.
- SVG figure suspense reveal with two distinct poses and animated light/shadow without rasterization artifacts.
- A visual causality score: reviewer can explain what each animation teaches or implies.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-08/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Charts and callouts collide | Text/layout solver from Phase 02 + connector routing with collision avoidance. |
| Fake quantified data in demos | Use visibly labeled sample data or documented public numbers; never claim simulated metrics are real user data. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 08 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 08 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 08 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 08 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Add a reason for every visual in educational scenes, rather than decorating the screen with unrelated geometric objects.
Technology interpretation: Data-bound charts, diagrams, SVG/vector figures, procedural symbols and character-driven visual explanations.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 08 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 08 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 08: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 08 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 08 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 09_STORYBOARD_VISUAL_RECIPE_COMPILER.md -->

# PHASE 09 — Storyboard and Validated VisualRecipe Compiler

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 9 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Bridge user intent and professional output by compiling constrained, editable scene recipes; permit Claude/ChatGPT-generated structured plans but never execute arbitrary code.

**Creative direction:** A visual storyboard containing meaningful scene thumbnails, shot purposes, palette, asset choices, voiceover/caption sections and approved timing.

**Required demonstrable output:** Guided brief → 6-shot storyboard → editable native project → completed 45s output; plus import of a hand-authored JSON VisualRecipe.

**Phase prerequisites:** Phases 02–08 and shot registry.

## 2. Source files and architecture contract

Inspect `agent-interop.js`, `agent-bridge.js`, creation wizard, schema and archive; propose `/visual/visual-recipe.schema.json`, `/visual/recipe-validator.js`, `/visual/recipe-compiler.js`.

**Engineering design:** Versioned `VisualRecipe {intent, audience, aspect, styleId, storyBeats[], shots[{id, purpose, componentId, payload, durationFrames, transitions, assetRefs}]}`. Validate schema/strings/asset refs/limits; compile only approved component IDs and numeric motion parameters into canonical editable scene graph. Reject embedded JS/HTML/script URLs.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Create guided brief fields: purpose, audience, length, platform, message, points, media and CTA.
2. Build a deterministic rule-based shot planner requiring no AI; use a consistent story rhythm.
3. Implement storyboard thumbnails and per-shot duration/layout/asset controls.
4. Publish strict JSON schema and parser for external Claude/ChatGPT recipe generation with safe import/export.
5. Record provenance and prompt history without storing secrets in project exports.
6. Add error messages for unsupported shot IDs, missing assets, bad timings and long text.
7. Guarantee compiled output editable in Studio after import, not flattened into MP4.
8. Demonstrate same recipe compiles reproducibly with no AI network calls.

## 4. Real user-facing editing workflow that must work

1. Fill six-field creative brief and generate storyboard
2. Swap two shot types and rewrite script lines
3. Export VisualRecipe JSON for review
4. Import an intentionally malformed recipe and see safe rejection
5. Compile valid recipe, preview/edit/save/reopen/export

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No AI key required for deterministic storyboard mode
2. No arbitrary code execution from external recipe
3. Each shot remains an editable canonical scene with stable IDs
4. Malformed imports fail safely with actionable diagnostics
5. User edits visual recipe and sees corresponding changed output

**Exact live QA script:** Use a brief for a product launch, generate 6 shots, export JSON, hand-edit a validated field, reimport, export video, and reopen archive.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Natural language comprehension without AI: require structured fields and honest scope
2. LLM JSON inconsistencies: validate against explicit schema and reject unsupported features
3. Project schema migration: maintain VisualRecipe version plus compiler revision

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 09**; do not open Phase 10.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-09/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 09

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 09 ONLY: Storyboard and Validated VisualRecipe Compiler

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 09 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 10.

Implement: Bridge user intent and professional output by compiling constrained, editable scene recipes; permit Claude/ChatGPT-generated structured plans but never execute arbitrary code.
Creative target: A visual storyboard containing meaningful scene thumbnails, shot purposes, palette, asset choices, voiceover/caption sections and approved timing.
Produce: Guided brief → 6-shot storyboard → editable native project → completed 45s output; plus import of a hand-authored JSON VisualRecipe.
Source review: Inspect `agent-interop.js`, `agent-bridge.js`, creation wizard, schema and archive; propose `/visual/visual-recipe.schema.json`, `/visual/recipe-validator.js`, `/visual/recipe-compiler.js`.
Critical architecture: Versioned `VisualRecipe {intent, audience, aspect, styleId, storyBeats[], shots[{id, purpose, componentId, payload, durationFrames, transitions, assetRefs}]}`. Validate schema/strings/asset refs/limits; compile only approved component IDs and numeric motion parameters into canonical editable scene graph. Reject embedded JS/HTML/script URLs.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 10
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 09: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 09 CORRECTION LOOP. I have NOT accepted the Phase 09 visuals.
Read my feedback below and the Phase 09 acceptance gate. Stay exclusively in Phase 09.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 09 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 09 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 10.
Return `PHASE 09: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 09: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 09
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 10.
```

**To start the next phase, the owner must separately say** `PHASE 10: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 09

> **Binding instruction:** This addendum extends the original Phase 09 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Convert a brief into professional shots and synchronized events, without needing AI-generated JavaScript or an AI subscription.

**Technology interpretation:** Declarative timeline.json with scenes, characters, poses, cameras, props, captions, cue tracks and asset refs; validated VisualRecipe.

## Additional detailed implementation work (mandatory, not optional)

1. Define versioned recipe with scene/shot IDs, purpose, duration frames, aspect strategy, style preset, character references, pose keyframes, prop motions, camera tracks, text cues, voice events, music stems, SFX cues and rights metadata.
2. Provide a local guided wizard with topic/tone/length/audience, hook mechanism, payoff type, and character role; create editable draft shots using deterministic rules/templates.
3. Compile validated timeline.json to the existing canonical project with no code eval; strict schema checks, unique IDs, time-range validation and asset permission lookup.
4. Create a strict adapter to ingest externally authored Claude/ChatGPT structured JSON recipes, sanitize text/URLs, reject unknown executable fields and preserve unrecognized safe metadata without executing it.
5. Allow character bible fields (palette, voice choice, pose atlas, props, comedic style, spatial continuity); show unmet asset requirements before export.
6. Support explicitly marked unresolved voice/audio events until Phase 11, with a manual import and timed-cue fallback.
7. Roundtrip recipe → project → editor changes → .acstudio → reopen → export and prove identical timing semantics.

## Live production-UI demonstration and evidence

- Complete non-AI brief → 6-shot editable storyboard → 45s export; one imported hand-authored recipe produces same shot plan.
- Validated example timeline.json for parrot comedy and SVG suspense in the package.
- Adversarial input tests: malformed timing, external URL, script tags and unknown expression keys rejected.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-09/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Natural-language scripts cannot be understood at Remotion/Claude quality without intelligence | Local rule-based wizard gives guided quality, not autonomous arbitrary story comprehension; user-authored or optional BYOK structured recipes supply complex semantics. |
| Generator creates generic filler | Require explicit shot purpose/tension/payoff and human storyboard approval before encoding. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 09 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 09 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 09 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 09 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Convert a brief into professional shots and synchronized events, without needing AI-generated JavaScript or an AI subscription.
Technology interpretation: Declarative timeline.json with scenes, characters, poses, cameras, props, captions, cue tracks and asset refs; validated VisualRecipe.

Implement EACH of the 7 numbered V2 tasks above AND every original Phase 09 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 09 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 09: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 09 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 09 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 10_SHOT_LEVEL_EDITOR_UX_AND_PARITY.md -->

# PHASE 10 — Visual Editor UX for Shot and Scene-Level Control

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 10 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Make the new composition system usable by a nontechnical creator, with an accurate preview matching the final export.

**Creative direction:** Clean editing workspace with scene storyboard rail, contextual shot controls, inspector, stage with safe guides and an understandable animation timeline.

**Required demonstrable output:** Fully interactive flow to build and polish a 30s video without editing JSON or writing code.

**Phase prerequisites:** Phases 02–09.

## 2. Source files and architecture contract

Inspect `studio-app.js`, `creative-studio.css`, EN/ES/DA HTML, command engine; propose `/visual/shot-editor-ui.js`, `/visual/property-inspector.js`, `/visual/preview-controller.js`.

**Engineering design:** Single canonical document store drives both preview and export; visual operations emit undoable commands with revision IDs, selection/transform handles and keyframe edits. No hidden export-only scene composer; every visible element has a project-node mapping.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Introduce storyboard rail with shot thumbnails, section labels and duration badges.
2. Add shot insert/delete/duplicate/reorder and content replacement with undo/redo.
3. Build context-specific properties for text, media, transitions, 3D and diagrams.
4. Expose motion keyframes visually with snapping and easing inspector.
5. Fix direct manipulation handles, touch pan/zoom, keyboard navigation and loss-of-selection edge cases.
6. Keep the stage visually faithful to export; forbid selection outlines, guides and handles in exported frames.
7. Ensure autosave revisions and .acstudio project serialization survive UI moves.
8. Translate all new controls and error messages EN/ES/DA, respecting long labels.

## 4. Real user-facing editing workflow that must work

1. Use UI to create three shots from scratch
2. Drag to reorder shot 2
3. Edit a mask and a motion curve in inspector
4. Preview scene changes and undo/redo
5. Reopen archive in fresh browser and repeat editing

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No JSON/code editing needed for benchmark creation
2. 100% of visible editable shot properties serialize and roundtrip
3. Preview/export parity on random sampled timestamps
4. Usable at desktop/tablet and honest constrained mobile mode
5. Clear errors, accessible labels and proper keyboard focus

**Exact live QA script:** From empty studio, create 3 shots, update content and motion, export, save/reopen, undo/redo and verify same output.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Existing two sources of truth: consolidate, migrate without losing projects
2. Mobile complexity: use stacked storyboard cards and modal inspector instead of compressing three panels
3. Expensive live preview: cache static layers and provide quality slider

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 10**; do not open Phase 11.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-10/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 10

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 10 ONLY: Visual Editor UX for Shot and Scene-Level Control

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 10 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 11.

Implement: Make the new composition system usable by a nontechnical creator, with an accurate preview matching the final export.
Creative target: Clean editing workspace with scene storyboard rail, contextual shot controls, inspector, stage with safe guides and an understandable animation timeline.
Produce: Fully interactive flow to build and polish a 30s video without editing JSON or writing code.
Source review: Inspect `studio-app.js`, `creative-studio.css`, EN/ES/DA HTML, command engine; propose `/visual/shot-editor-ui.js`, `/visual/property-inspector.js`, `/visual/preview-controller.js`.
Critical architecture: Single canonical document store drives both preview and export; visual operations emit undoable commands with revision IDs, selection/transform handles and keyframe edits. No hidden export-only scene composer; every visible element has a project-node mapping.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 11
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 10: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 10 CORRECTION LOOP. I have NOT accepted the Phase 10 visuals.
Read my feedback below and the Phase 10 acceptance gate. Stay exclusively in Phase 10.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 10 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 10 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 11.
Return `PHASE 10: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 10: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 10
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 11.
```

**To start the next phase, the owner must separately say** `PHASE 11: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 10

> **Binding instruction:** This addendum extends the original Phase 10 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Allow a non-programmer to make the same pacing and composition decisions that a Claude/Remotion programmer makes.

**Technology interpretation:** Timeline tracks for pose, captions, camera, props and audio with keyframe editor and preview/export parity.

## Additional detailed implementation work (mandatory, not optional)

1. Build scene navigator, shot cards, character pose dropdown, prop z-order, anchor/pivot controls, camera track/keyframe inspector and transition overview.
2. Add draggable cue markers for caption/SFX/camera beats and timecode snap-to-frame. Reveal dependencies when a visual depends on an asset or future voice model.
3. Implement multi-track editing operations: split, trim, ripple, slip, duplicate, group, keyframe shift; avoid silent flattening of source media or keyframes.
4. Support direct manipulation of character and caption regions in the canvas with undo/redo covering property edits, asset changes and keyframe relocation.
5. Make the same evaluator power preview and exported frame; compare snapshots at 0/10/25/50/75/90/100% of three sample shots and fail on semantic mismatch.
6. Use keyboard and accessible pointer/touch controls; no need for JSON editing or developer console to make parrot/horror proof shorts.
7. Preserve scene graph including pose animation and sound event placeholders in .acstudio after fresh browser restart.

## Live production-UI demonstration and evidence

- A full 30s animated Short created through UI from a template with at least five edits, two pose changes, caption re-timing, camera shift and one sound cue placeholder.
- Video recording of actual editor interactions and preview/export parity report.
- Undo/redo and save/reopen proves editing—not a hardcoded test-only scene.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-10/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Rendering uses a second shadow model unrelated to edit UI | Unify canonical evaluator; refuse phase approval on mismatch. |
| Editor becomes too complex | Offer Simple and Advanced views, progressive disclosure, and maintain mobile-basic functions. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 10 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 10 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 10 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 10 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Allow a non-programmer to make the same pacing and composition decisions that a Claude/Remotion programmer makes.
Technology interpretation: Timeline tracks for pose, captions, camera, props and audio with keyframe editor and preview/export parity.

Implement EACH of the 7 numbered V2 tasks above AND every original Phase 10 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 10 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 10: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 10 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 10 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 11_AUDIO_CAPTIONS_AND_BEAT_SYNCHRONIZED_MOTION.md -->

# PHASE 11 — Audio-Linked Motion, Captions and Sound Design

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 11 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Turn motion into purposeful audiovisual storytelling rather than silent/synthetic demonstrations.

**Creative direction:** Readable captions, elegant lower thirds, thoughtful sound effects and animated emphasis timed to real narration or imported music.

**Required demonstrable output:** 45s narrative promo with locally imported voiceover and music, synced captions and four visible audio-linked animation beats.

**Phase prerequisites:** Phases 04,05,09,10; existing PCM/audio pipeline.

## 2. Source files and architecture contract

Inspect `audio-mixer.js`, `render-adapter.js` `_mixProjectAudio`, editor timeline and schema; propose `/visual/caption-layout.js`, `/visual/audio-cues.js`, `/visual/beat-markers.js`.

**Engineering design:** Timeline `AudioCue` with sample-accurate start/end, volume automation, fades, source asset and markers; `CaptionTrack` with tokens/word timings and safe-zone style. Link animation cue times explicitly; optional on-device beat analysis may create suggestions but requires manual confirmation.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Import real narration/music via user files; never silently create default oscillator soundtrack.
2. Expose volume envelopes, ducking under narration, fade-in/out, silence and clipping warnings.
3. Implement manual/transcript caption editor, text segmentation, safe zones and read-rate warnings.
4. Build visual motion beat markers and snap keyframes to voice/beat cues.
5. Add accessibility captions and low-noise caption style presets for 16:9 and 9:16.
6. Support audio replacement while preserving cue edits and recoverability.
7. Avoid promising automatic transcription without real locally supported model or authorized BYOK.
8. Prove sync in independently decoded export, not just timeline widgets.

## 4. Real user-facing editing workflow that must work

1. Import voice file, align first word
2. Add caption blocks and style emphasis
3. Auto-duck music under speech with editable strength
4. Snap a title reveal to marked audio beat
5. Export and inspect sync/reopen

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. Imported narration is audible and no unexplained sine-wave tone appears
2. Captions align to nominated spoken words within an agreed perceptual tolerance
3. No audible clipping and no caption overlap with essential visuals
4. Audio fades survive reopen and export
5. At least four semantic motion events align with intended cues

**Exact live QA script:** Add 45s narration and background track, place 12 captions, sync four on-beat animations, export, listen and compare word timings in independent player.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Codec/browser audio decode: preflight decode or honest unsupported-format message
2. No paid ASR: manual captions first; optional BYOK only with approval
3. Speech privacy: process user-provided audio locally in native mode

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 11**; do not open Phase 12.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-11/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 11

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 11 ONLY: Audio-Linked Motion, Captions and Sound Design

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 11 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 12.

Implement: Turn motion into purposeful audiovisual storytelling rather than silent/synthetic demonstrations.
Creative target: Readable captions, elegant lower thirds, thoughtful sound effects and animated emphasis timed to real narration or imported music.
Produce: 45s narrative promo with locally imported voiceover and music, synced captions and four visible audio-linked animation beats.
Source review: Inspect `audio-mixer.js`, `render-adapter.js` `_mixProjectAudio`, editor timeline and schema; propose `/visual/caption-layout.js`, `/visual/audio-cues.js`, `/visual/beat-markers.js`.
Critical architecture: Timeline `AudioCue` with sample-accurate start/end, volume automation, fades, source asset and markers; `CaptionTrack` with tokens/word timings and safe-zone style. Link animation cue times explicitly; optional on-device beat analysis may create suggestions but requires manual confirmation.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 12
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 11: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 11 CORRECTION LOOP. I have NOT accepted the Phase 11 visuals.
Read my feedback below and the Phase 11 acceptance gate. Stay exclusively in Phase 11.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 11 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 11 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 12.
Return `PHASE 11: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 11: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 11
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 12.
```

**To start the next phase, the owner must separately say** `PHASE 12: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 11

> **Binding instruction:** This addendum extends the original Phase 11 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make video sound compelling without the example’s desktop Python mixing or a mandatory hosted TTS service.

**Technology interpretation:** kokoro-js on WebGPU/WASM (optional local model); Web Audio OfflineAudioContext; original sound FX generation; captions; ducking/limiting.

## Additional detailed implementation work (mandatory, not optional)

1. Implement opt-in local Kokoro-82M TTS adapter, dynamically imported only after the user requests voice generation. Detect WebGPU, use WASM fallback when practical, disclose precise model/voice download size, origin, quota/storage and supported languages/voices.
2. On model consent, show download progress, pause/cancel and offline-cache availability. Do not auto-download hundreds of MB; do not store user text/keys remotely. Offer a recorded/imported voice track workflow when model is not available or offline.
3. Generate speech PCM, track voiceId, rate, model version, timestamps and voice reference in project; store generated final PCM/WAV inside .acstudio with provenance and license.
4. Implement procedural chirp/pop/chime/noise/horror-rumble sound synthesis in a dedicated audio worker or OfflineAudioContext, deterministic seed and sample-accurate cue start.
5. Implement speech-sidechain ducking, safe gain staging, equal-power fades/crossfades, limiter with documented ceiling and true audio-silence handling; resample 44.1k/48k sources correctly.
6. Support manual/optional generated caption word timings and viseme cues; avoid claiming forced alignment if it is merely proportional interpolation. Use phoneme/timestamp models only if fully verified locally.
7. Expose caption timing and music/SFX mixing controls and waveform or beat markers in UI. Force explicit user click before rendering voice or fetching model.
8. Voice should contain expressive pacing and comedy pause; suspense must use silence, restrained dynamics and one deliberate peak rather than a continuous loud tone.

## Live production-UI demonstration and evidence

- 20–30s parrot Short with locally generated or explicitly user-provided real voice, timed subtitles, three sound effects, original/licensed music bed and measured ducking.
- 20–30s horror SVG Short with soundscape, tension build, deliberate silence and caption reveal.
- Export with real 48k audio; measured voice intelligibility, peak/clipping, synchronized cues; no spurious 440Hz tone.
- Model consent and network audit proves no model download before opt-in and no third-party speech transcript exfiltration.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-11/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Model large and memory hungry | Report sizes dynamically, lazy load, cache when appropriate, release models after generation, provide import/record fallback and avoid mobile default. |
| Voice supports limited languages | Probe actual voice and model language capabilities. Never claim natural Danish or Spanish voices unless verified. |
| TTS not automatically word-aligned | Support manual caption editing and optional timestamps, with accurate labeling for approximate alignments. |
| Audio export mismatch | Use one sample-time-based audio timeline; inspect waveform peaks and tail sync, not just stream duration metadata. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 11 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 11 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 11 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 11 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make video sound compelling without the example’s desktop Python mixing or a mandatory hosted TTS service.
Technology interpretation: kokoro-js on WebGPU/WASM (optional local model); Web Audio OfflineAudioContext; original sound FX generation; captions; ducking/limiting.

Implement EACH of the 8 numbered V2 tasks above AND every original Phase 11 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 11 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 11: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 11 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 11 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 12_THREE_D_ART_DIRECTION_AND_CAMERA_STAGING.md -->

# PHASE 12 — Professional 3D Art Direction, Lighting, Materials and Camera

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 12 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Upgrade the primitive block-character test into a directed 3D product/character showcase.

**Creative direction:** Studio-quality hero subject with attractive PBR shading, three-point lighting, shadows, deliberate camera paths and an uncluttered scene.

**Required demonstrable output:** 15s 3D showcase with a genuinely licensed glTF subject, dynamic camera move, accent lighting and tasteful composited titles.

**Phase prerequisites:** Phases 02–07 and 10.

## 2. Source files and architecture contract

Inspect `three-scene-adapter.js`, Three.js r187 bundle and asset manifests; propose `/visual/3d/camera-rig.js`, `/visual/3d/light-rig.js`, `/visual/3d/material-presets.js`.

**Engineering design:** Scene 3D node with GLB assetId, animationClip, pose/time, environment, cameraRig, lightRig, materialOverrides and depth-order compositing. Render Three.js from exact project frame; layer 2D titles over 3D through shared compositor.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Integrate glTF/GLB asset selection, license/provenance records and model validation.
2. Build studio light presets (softbox, rim, product key, daylight) with adjustable exposure and background.
3. Add camera framing and smooth dolly/orbit/push controls with deterministic curves.
4. Support model animations by stable clip ID, timeline offsets and playback speed.
5. Improve contact shadows, reflective ground, tone mapping and background separation within device performance limits.
6. Provide professional 2D overlay typography that respects depth and subject silhouette.
7. Offer mobile quality fallback with reduced shadows/pixel ratio, never fake detailed assets.
8. Export and inspect close-up/model material consistency, no missing meshes or black frame.

## 4. Real user-facing editing workflow that must work

1. Import valid licensed GLB
2. Apply a lighting preset
3. Set three camera keyframes
4. Overlay moving title and CTA
5. Export/restore scene and verify animation

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. One coherent 15s 3D sequence with intentional visual direction
2. Shading/camera quality visibly superior to block-character baseline
3. No GPU blackouts or texture loading races in tested browser
4. 3D position and animation deterministic at sampled frames
5. Asset licensing and fallback visible

**Exact live QA script:** Open 3D template, swap model, adjust camera/lighting, export 15s, inspect 6 frames, save/reopen and edit a camera waypoint.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. No professional model license: use original in-repo modeled asset or approved permissive GLB
2. Large GPU memory: preflight budgets and LOD fallback
3. Cross-browser WebGL differences: capability checks and fallback image if 3D impossible

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 12**; do not open Phase 13.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-12/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 12

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 12 ONLY: Professional 3D Art Direction, Lighting, Materials and Camera

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 12 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 13.

Implement: Upgrade the primitive block-character test into a directed 3D product/character showcase.
Creative target: Studio-quality hero subject with attractive PBR shading, three-point lighting, shadows, deliberate camera paths and an uncluttered scene.
Produce: 15s 3D showcase with a genuinely licensed glTF subject, dynamic camera move, accent lighting and tasteful composited titles.
Source review: Inspect `three-scene-adapter.js`, Three.js r187 bundle and asset manifests; propose `/visual/3d/camera-rig.js`, `/visual/3d/light-rig.js`, `/visual/3d/material-presets.js`.
Critical architecture: Scene 3D node with GLB assetId, animationClip, pose/time, environment, cameraRig, lightRig, materialOverrides and depth-order compositing. Render Three.js from exact project frame; layer 2D titles over 3D through shared compositor.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 13
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 12: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 12 CORRECTION LOOP. I have NOT accepted the Phase 12 visuals.
Read my feedback below and the Phase 12 acceptance gate. Stay exclusively in Phase 12.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 12 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 12 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 13.
Return `PHASE 12: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 12: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 12
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 13.
```

**To start the next phase, the owner must separately say** `PHASE 13: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 12

> **Binding instruction:** This addendum extends the original Phase 12 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Achieve a genuinely art-directed animated animal/character look in browser with source assets and deterministic 3D camera behavior.

**Technology interpretation:** Three.js GLTFLoader, AnimationMixer, MeshToonMaterial, outlines, original GLB rigs/poses; optional Blender-bpy asset production outside browser.

## Additional detailed implementation work (mandatory, not optional)

1. Use original/licensed animal GLB with meaningful silhouette, face expression, eye detail, feather/fur style approximations, cloth/prop geometry and correct animations; do not submit cuboids as the finished character.
2. Document OPTIONAL offline Blender workflow (bpy poses, Cycles toon asset renders, freestyle outlines) producing PNG atlas / glTF; the production website must never require Blender installation, Python execution or server renders.
3. Implement browser Three.js glTF playback with AnimationMixer, named clips, rigged head/wing/arm actions, morph targets if present, pose selectors and reliable asset orientation/scale normalization.
4. Implement tone-aware camera staging: closeup, reaction, OTS, tracking, parallax foreground; 3-point or stylized light rigs, shadows, toon ramps, outline quality and compositing with 2D captions.
5. For slow GPUs, allow pre-rendered 8–16 pose PNG/cel atlas with independent camera and prop tracks, matching original parrot puppet workflow; label fidelity differences explicitly.
6. If speech timestamps/viseme data exist, map them to mouth morph shapes or sprite replacements, otherwise use opt-in rough flap/idle mouth motion labeled as approximate.
7. Ensure alpha transparency, hair/feather edges, anti-aliasing and depth sorting remain acceptable in exported 9:16 and 16:9 videos.
8. Test GLB project save, reopen, missing-asset handling, GPU context-loss recovery and explicit render-fidelity settings.

## Live production-UI demonstration and evidence

- 20s 3D character showcase with 4 camera shots, 3 named gestures and expressive reaction, plus an 8-pose 2D fallback comparison.
- Rig/pose labels, exported alpha/layer screenshots and a licensed-asset manifest.
- One creator changes eye direction, pose and prop position via UI and re-exports a visibly changed shot.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-12/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Blender Cycles cannot be reproduced in regular browser | Use pre-rendered cel images or designed Three.js toon pipeline; no fake parity claim. |
| Unlicensed or low-detail character | Commission/create original or acquire explicit redistribution rights. Do not ship scraped movie/mascot assets. |
| WebGL memory/lighting cost | Cap lights, shadow maps, geometry, textures and animations; degrade gracefully to pose sprites. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 12 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 12 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 12 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 12 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Achieve a genuinely art-directed animated animal/character look in browser with source assets and deterministic 3D camera behavior.
Technology interpretation: Three.js GLTFLoader, AnimationMixer, MeshToonMaterial, outlines, original GLB rigs/poses; optional Blender-bpy asset production outside browser.

Implement EACH of the 8 numbered V2 tasks above AND every original Phase 12 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 12 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 12: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 12 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 12 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 13_PREMIUM_TEMPLATES_AND_BRAND_KITS.md -->

# PHASE 13 — Small Premium Template Collection and User Brand Kits

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 13 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Turn excellent components into compelling defaults: fewer templates, each good enough to publish after light edits.

**Creative direction:** An intentionally curated set of eight distinctive visual identities, not one dark style copied eight times.

**Required demonstrable output:** Eight polished working templates with authentic preview clips and one-click brand adaptation, including still-thumbnail and print-card consistency.

**Phase prerequisites:** Phases 01–12.

## 2. Source files and architecture contract

Inspect templates JSON, brand/graphics code and local project storage; propose `/visual/template-manifest.js`, `/visual/brand-kit.js`, `/visual/template-upgrade.js`.

**Engineering design:** Versioned template manifest `{id,version,category,shotPlan,styleTokens,assetLicenses,editableSlots,previewArtifacts}` and portable user brand kit `{logo,palette,fonts,voice,iconStyle,lowerThird}`. Applying brand must recompute contrast and text fit.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Deliver eight deliberately different templates: SaaS launch, educational diagram, editorial kinetic, startup case study, product tutorial, data story, social vertical story, and cinematic 3D opener.
2. Each template must have 5+ purposeful shots or suitable still design composition, not placeholder orb/title scenes.
3. Produce legitimate representative rendered previews, contact sheets and brief use-cases.
4. Create brand kit UI for user logo, colors, fonts, CTA and recurring motif; persist locally in project.
5. Add contrast-safe palette derivation and responsive content replacements.
6. Provide EN/ES/DA localized names/slots and test expanded text.
7. Test offline generation and rights metadata; no stock URLs that silently fetch third-party content.
8. Keep bundle lightweight using lazy loaded previews/assets.

## 4. Real user-facing editing workflow that must work

1. Pick template from gallery
2. Apply custom brand palette/logo
3. Replace 5 text slots and one image
4. Preview all shot changes
5. Save and reopen branded template

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. 8 templates visually differentiated in composition, not merely color
2. At least 3 templates pass 80/100 human review independently
3. Brand substitution does not create unreadable/overflowing text
4. No forbidden/debug assets or license problems
5. Templates remain editable and work offline

**Exact live QA script:** Pick SaaS launch, education and vertical templates; apply same brand kit; export all three and inspect distinct intended styles.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Quantity pressure: cap at eight; reject mediocre variants
2. Template-specific art assets: only original or cleared licenses
3. Language expansion: per-locale copy-fit diagnostics

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 13**; do not open Phase 14.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-13/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 13

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 13 ONLY: Small Premium Template Collection and User Brand Kits

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 13 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 14.

Implement: Turn excellent components into compelling defaults: fewer templates, each good enough to publish after light edits.
Creative target: An intentionally curated set of eight distinctive visual identities, not one dark style copied eight times.
Produce: Eight polished working templates with authentic preview clips and one-click brand adaptation, including still-thumbnail and print-card consistency.
Source review: Inspect templates JSON, brand/graphics code and local project storage; propose `/visual/template-manifest.js`, `/visual/brand-kit.js`, `/visual/template-upgrade.js`.
Critical architecture: Versioned template manifest `{id,version,category,shotPlan,styleTokens,assetLicenses,editableSlots,previewArtifacts}` and portable user brand kit `{logo,palette,fonts,voice,iconStyle,lowerThird}`. Applying brand must recompute contrast and text fit.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 14
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 13: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 13 CORRECTION LOOP. I have NOT accepted the Phase 13 visuals.
Read my feedback below and the Phase 13 acceptance gate. Stay exclusively in Phase 13.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 13 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 13 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 14.
Return `PHASE 13: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 13: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 13
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 14.
```

**To start the next phase, the owner must separately say** `PHASE 14: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 13

> **Binding instruction:** This addendum extends the original Phase 13 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make professional, reusable templates for polished Shorts and existing brand, thumbnail and educational use cases.

**Technology interpretation:** Templates built from declarative shot recipes, design tokens, character/pose/voice kits and audio palettes.

## Additional detailed implementation work (mandatory, not optional)

1. Build a limited premium pack rather than hundreds of shallow templates: Character Comedy, Suspense SVG, SaaS Promo, Product Reveal, Kinetic Text, Educational Diagram, Podcast Clip and Minimal Brand Intro.
2. Each template must contain a real storyboard, editable asset slots, caption lanes, camera tracks, sound cue placeholders, safe-area rules, timing/pacing guidance and a preview clip from the same production renderer.
3. Create user brand kits with fonts/colors/logo/voice/character/palette, copy-safe logos and original/licensed content defaults.
4. Provide parrot pose kit and SVG suspense kit as reference-quality included examples, subject to asset license and page-size budgets; allow replacement with user characters.
5. Create variation controls (calm/energetic/horror; 15/30/45s; 16:9 vs 9:16) that change story blocking and pace, not merely hue.
6. Store template provenance, version, license and a reproducible reference export, and include a regression script for every canonical template.

## Live production-UI demonstration and evidence

- Eight distinctive real working templates, each with a sample clip and cover image; select a template and edit a text, character and sound cue.
- Two 30s Shorts generated from the same template with visibly different shot choices and characters.
- Zero test placeholders in production preview cards.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-13/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Template volume masks weak output | Require individual creative approval; cut substandard templates from the release. |
| TTS/model dependencies make template unusable without internet | Templates must work visually and accept imported voice; lazy TTS optional, never mandatory. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 13 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 13 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 13 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 13 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make professional, reusable templates for polished Shorts and existing brand, thumbnail and educational use cases.
Technology interpretation: Templates built from declarative shot recipes, design tokens, character/pose/voice kits and audio palettes.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 13 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 13 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 13: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 13 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 13 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 14_ASPECT_RATIO_RECOMPOSITION.md -->

# PHASE 14 — Actual 16:9, 9:16 and 1:1 Recomposition

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 14 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Make output formats genuinely designed for their destination instead of crops from 16:9.

**Creative direction:** Platform-specific hierarchy: large safe-title in vertical, more negative space and spatial charts in widescreen, compact centered hierarchy for square.

**Required demonstrable output:** One concept exported as three distinct first-class compositions (16:9, 9:16, 1:1) with equivalent story and matching brand.

**Phase prerequisites:** Phases 02,03,06,10,13.

## 2. Source files and architecture contract

Inspect layout solver and asset presentation; propose `/visual/aspect-recomposer.js`, `/visual/platform-guides.js`.

**Engineering design:** Aspect-specific rules for shot variant selection, semantic safe regions, focal-media crop, responsive type sizes and content prioritization. Preserve one source project and explicit per-aspect overrides rather than destructive global scale.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Define 16:9 (1920×1080), 9:16 (1080×1920), 1:1 (1080×1080) layout profiles.
2. Map platforms to safe zones for caption/UI overlays, but show as non-export diagnostic guides.
3. Reflow title, media crop, chart geometry and CTA for each aspect ratio.
4. Allow user pinning focal subject separately per aspect and preview all variants side by side.
5. Provide per-aspect overrides with inheritance, not duplicate projects.
6. Reduce text density in vertical by splitting into additional shot or preserving readability.
7. Maintain coherent timing and safe captions when reframing.
8. Export three videos plus contact sheets and compare source assets/shot order.

## 4. Real user-facing editing workflow that must work

1. Open 16:9 storyboard and select “Make vertical”
2. Adjust subject pin and caption location
3. Preview side-by-side variants
4. Edit only vertical title position, keep widescreen unchanged
5. Export 3 formats and reopen project

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. No black bars or unintentional clipped subject
2. Each aspect shows intentional layout rearrangement, not a blind center crop
3. All captions and CTAs remain readable
4. Shared text/asset revisions propagate correctly; overrides are respected
5. Three outputs pass frame and media validation

**Exact live QA script:** Use one 30s template, export three aspects, inspect 5 timestamps each, edit one override, re-export and confirm isolation.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Complex wide diagrams: use variant patterns such as sequence cards
2. Vertical safe zones vary by platform: configurable profiles and warnings
3. Aspect changes may increase narration/shot length: surface duration adjustments

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 14**; do not open Phase 15.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-14/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 14

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 14 ONLY: Actual 16:9, 9:16 and 1:1 Recomposition

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 14 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 15.

Implement: Make output formats genuinely designed for their destination instead of crops from 16:9.
Creative target: Platform-specific hierarchy: large safe-title in vertical, more negative space and spatial charts in widescreen, compact centered hierarchy for square.
Produce: One concept exported as three distinct first-class compositions (16:9, 9:16, 1:1) with equivalent story and matching brand.
Source review: Inspect layout solver and asset presentation; propose `/visual/aspect-recomposer.js`, `/visual/platform-guides.js`.
Critical architecture: Aspect-specific rules for shot variant selection, semantic safe regions, focal-media crop, responsive type sizes and content prioritization. Preserve one source project and explicit per-aspect overrides rather than destructive global scale.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 15
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 14: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 14 CORRECTION LOOP. I have NOT accepted the Phase 14 visuals.
Read my feedback below and the Phase 14 acceptance gate. Stay exclusively in Phase 14.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 14 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 14 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 15.
Return `PHASE 14: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 14: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 14
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 15.
```

**To start the next phase, the owner must separately say** `PHASE 15: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 14

> **Binding instruction:** This addendum extends the original Phase 14 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make 9:16 character Shorts and 16:9 educational/promo videos feel intentionally designed rather than cropped.

**Technology interpretation:** Aspect-aware shot layout reflow, caption/character repositioning and safe-zone simulation.

## Additional detailed implementation work (mandatory, not optional)

1. Add separate composition profiles for 16:9, 9:16 and 1:1 with actual layout reflow constraints; do not simply crop an existing widescreen canvas.
2. Provide platform-safe overlays for subtitle region, channel watermark zone and typical UI obstruction zones as configurable heuristics (do not assert a single timeless placement).
3. Reposition characters, props, headline and punchline based on aspect; support separate crop intent, subject tracking and per-aspect overrides.
4. Ensure vertical parrot joke remains readable and spatially balanced; eerie SVG horror framing must use negative space rather than cramped sticks.
5. Validate full-body, closeup and duo-character shots at target output 1080×1920 when browser hardware allows; offer honest 720×1280 quality fallback.
6. Allow one project to store three composition variants without destroying user edits; archive preserves original and overrides.

## Live production-UI demonstration and evidence

- Same 30s parrot composition in 9:16 and 16:9 with visibly different staging, and horror in 9:16/1:1.
- Actual phone-preview overlays and exported frame sheets, no cut-off heads/captions, correct text hierarchy.
- One-click aspect switch with editable shot-specific overrides survives reopen.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-14/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| High-res vertical rendering OOM | Memory-capability probe and tiered export settings; worker tiling where possible. |
| Safe regions vary by app and device | Offer editable overlays with documented heuristic status; no unsupported guaranteed-safe claim. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 14 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 14 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 14 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 14 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make 9:16 character Shorts and 16:9 educational/promo videos feel intentionally designed rather than cropped.
Technology interpretation: Aspect-aware shot layout reflow, caption/character repositioning and safe-zone simulation.

Implement EACH of the 6 numbered V2 tasks above AND every original Phase 14 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 14 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 14: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 14 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 14 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 15_LONG_FORM_STORY_PACING_CONTINUITY.md -->

# PHASE 15 — Five-Minute Narrative Continuity, Pacing and Quality Budgets

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 15 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Replace the previous five-minute solid-color benchmark with a coherent episode that maintains visual interest and meaning over time.

**Creative direction:** Chaptered documentary/explainer grammar with establishing shots, information beats, purposeful B-roll, diagrams, recurring motifs and satisfying closing payoff.

**Required demonstrable output:** Five-minute native educational episode with 5 chapters, at least 24 purposefully composed shots, genuine media/diagrams and voice or caption-led narration.

**Phase prerequisites:** All prior visual phases through 14.

## 2. Source files and architecture contract

Inspect storyboard compiler, shot registry, audio/caption pipeline, renderer; propose `/visual/continuity-engine.js`, `/visual/pacing-audit.js`, `/visual/longform-budget.js`.

**Engineering design:** `NarrativeArc` has hook, chapters, beats, callbacks, chapter recaps, motific visual anchors, shot-use counts and duration budget. Static pace diagnostics warn on overlong static holds and excessive repeated shot forms, without making aesthetic decisions entirely automatic.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Define five-chapter script outline with clear learning arc, section purposes and closing takeaway.
2. Compose minimum 24 shots with adequate variety; avoid repeated default orbit/progress animation.
3. Plan visual callbacks and matching chapter treatments to establish cohesion.
4. Create scene beat schedule and validate narration/caption timing against visual holds.
5. Implement visual diversity warnings for overrepeated components, long unchanged frames and title-only scenes.
6. Add render performance budgeting, source prefetch/cache, cancel/resume honesty and memory alerts.
7. Validate export parity at chapter boundaries and 12 additional selected timestamps.
8. Conduct full human watch-through with notes on clarity, repetition, legibility and pacing.

## 4. Real user-facing editing workflow that must work

1. Use long-form storyboard with 5 sections
2. Reorder two shots without losing narrative links
3. Swap one diagram and update an audio cue
4. Scrub between chapters and inspect captions
5. Export 300s, reopen and edit midpoint shot

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. 300s export with valid actual frames, but also purposeful narrative throughout
2. Minimum 24 semantically varied shots and five distinct chapters
3. No >20s static segment without intentional legible information/hold
4. At least 12 reviewed sample timestamps and full watch-through notes
5. Midpoint scene edit preserves all other chapters and audio sync

**Exact live QA script:** Create complete 5-minute educational episode in UI, export with 9,000 decoded frames at 30fps, review full video, reopen and change chapter 3.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Memory/codec limits: preflight device budget and offer reduced resolution without false promises
2. Long asset loading: local preload and explicit missing-asset remediation
3. Free narrations: use user-owned recordings/manual captions; no surprise paid TTS

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 15**; do not open Phase 16.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-15/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 15

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 15 ONLY: Five-Minute Narrative Continuity, Pacing and Quality Budgets

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 15 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 16.

Implement: Replace the previous five-minute solid-color benchmark with a coherent episode that maintains visual interest and meaning over time.
Creative target: Chaptered documentary/explainer grammar with establishing shots, information beats, purposeful B-roll, diagrams, recurring motifs and satisfying closing payoff.
Produce: Five-minute native educational episode with 5 chapters, at least 24 purposefully composed shots, genuine media/diagrams and voice or caption-led narration.
Source review: Inspect storyboard compiler, shot registry, audio/caption pipeline, renderer; propose `/visual/continuity-engine.js`, `/visual/pacing-audit.js`, `/visual/longform-budget.js`.
Critical architecture: `NarrativeArc` has hook, chapters, beats, callbacks, chapter recaps, motific visual anchors, shot-use counts and duration budget. Static pace diagnostics warn on overlong static holds and excessive repeated shot forms, without making aesthetic decisions entirely automatic.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 16
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 15: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 15 CORRECTION LOOP. I have NOT accepted the Phase 15 visuals.
Read my feedback below and the Phase 15 acceptance gate. Stay exclusively in Phase 15.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 15 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 15 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 16.
Return `PHASE 15: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 15: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 15
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 16.
```

**To start the next phase, the owner must separately say** `PHASE 16: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 15

> **Binding instruction:** This addendum extends the original Phase 15 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Scale short-form craft to coherent 5-minute episodic visuals without endless repetitive filler.

**Technology interpretation:** Scene/shot beat maps, character bible, sound motifs, continuity linting and performance budgets.

## Additional detailed implementation work (mandatory, not optional)

1. Define setup/tension/escalation/reversal/payoff beats for a short drama, and how the same rule scales to a 5-minute educational or episodic video.
2. Add character bible (asset IDs, appearance, voice, expressions, costume/color, spatial relationships, prop states), with validated references and preflight conflict warnings.
3. Provide continuity rules for temporal scene position, left/right look direction, persistent props, character names and role identity; detect accidental source-pose swaps.
4. Create long-form pacing linting for empty shots, >10s unmotivated holds, identical framing loops, repeating backgrounds, unchanging captions and audio dead zones.
5. Use a motion/value timeline and performance budget for texturing, 3D and TTS; chunk deterministic render when necessary while retaining exact timestamps and tail audio sync.
6. Produce a coherent approximately 5-minute story or educational episode using at least 12 distinct shots, recurring motifs, purposeful endings and no engineering labels.
7. Add deliberate editorial review at act boundaries and enable selective correction of one bad shot without regenerating or replacing the whole episode.

## Live production-UI demonstration and evidence

- 5-minute actual authored episode, storyboard map, continuity report and three sampled shots from each act.
- Character appearance stays consistent across returning scenes, and project reopen/edit/re-export modifies only selected shot.
- No repeated orb/loading bar, silence misrepresentation, or auto-generated fluff.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-15/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Browser memory for long video | Chunked render with stable scene state and streaming muxer/OPFS if implemented and tested; keep fallback export settings. |
| Automatic story coherence without LLM | Require guided template/human scene editing or optional external structured recipe; never claim AI-level free arbitrary writing. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 15 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 15 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 15 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 15 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Scale short-form craft to coherent 5-minute episodic visuals without endless repetitive filler.
Technology interpretation: Scene/shot beat maps, character bible, sound motifs, continuity linting and performance budgets.

Implement EACH of the 7 numbered V2 tasks above AND every original Phase 15 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 15 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 15: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 15 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 15 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: 16_FINAL_VISUAL_ACCEPTANCE_AND_RELEASE_GATE.md -->

# PHASE 16 — Independent Creative QA, Blind Comparison and Final Visual Release Gate

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 16 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Prove that the studio produces publishable creative work and that the quality is repeatable by an ordinary user.

**Creative direction:** A curated evaluation set across educational, SaaS, social, kinetic type, 3D, still thumbnail and print card, with independent human scoring.

**Required demonstrable output:** Final comparative evidence package, seven showcase projects, objective technical report and an explicit owner-go/no-go decision.

**Phase prerequisites:** All prior 15 phases individually approved.

## 2. Source files and architecture contract

Inspect all new visual modules, UI, project archive and tests; propose `reports/creative-studio/visual-qa/final/` and executable browser journey test suite.

**Engineering design:** QA protocol includes independent export decoder checks, blinded visual-score rubric, preview/export parity checks, archive recovery, performance, accessibility, locale parity and regressions. Human visual reviewer is a distinct approval dimension from unit-test success.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Create seven benchmark briefs with publicly reviewable outputs (education, SaaS, kinetic, social, 3D, thumbnail, print business card).
2. Require a fresh project built through UI for each benchmark, using editable assets/shot recipes rather than test-only rendering hooks.
3. Export genuine independent media; validate via ffprobe, frame samples, PDF renderer, image inspection as appropriate.
4. Run blind side-by-side comparison with old baseline and reference design criteria; document where new output fails.
5. Score storytelling, composition, typography, motion, color, media, audio, format adaptation and brand consistency.
6. Test full project save, terminate browser, reopen, edit and re-export on selected videos.
7. Run EN/ES/DA, mobile/desktop, SEO, existing-tool and site bundle regressions; do not claim Safari/iOS if untested.
8. Produce release recommendation with explicit known limitations and no automatic push/merge/deploy.

## 4. Real user-facing editing workflow that must work

1. Owner receives playable videos and contact sheets
2. Owner identifies visual defects per category
3. AGY repairs defects and re-exports complete examples
4. Independent user opens/revises project without source code
5. Owner explicitly approves or rejects final visual quality

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. At least 80/100 overall on each required benchmark and minimum 60% of each dimension
2. No remaining P0/P1 or visual blocker; human approval explicit
3. All required sample assets and fonts properly licensed/documented
4. No regression in existing creative editing and 128+ tools
5. No remote push without phase approval; no merge/deploy without independent authorization

**Exact live QA script:** Run complete seven-brief suite through live UI with fresh browser profiles, independent media validation, blind scorecards, defect repair loop and owner review.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Human aesthetics cannot be proven by automated score: owner must inspect videos
2. Real mobile/Safari hardware may be unavailable: mark not tested; do not overclaim
3. Paid external sources unavailable: demonstrations remain complete natively and disclose optional BYOK

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 16**; do not open Phase 17.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-16/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 16

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 16 ONLY: Independent Creative QA, Blind Comparison and Final Visual Release Gate

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 16 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 17.

Implement: Prove that the studio produces publishable creative work and that the quality is repeatable by an ordinary user.
Creative target: A curated evaluation set across educational, SaaS, social, kinetic type, 3D, still thumbnail and print card, with independent human scoring.
Produce: Final comparative evidence package, seven showcase projects, objective technical report and an explicit owner-go/no-go decision.
Source review: Inspect all new visual modules, UI, project archive and tests; propose `reports/creative-studio/visual-qa/final/` and executable browser journey test suite.
Critical architecture: QA protocol includes independent export decoder checks, blinded visual-score rubric, preview/export parity checks, archive recovery, performance, accessibility, locale parity and regressions. Human visual reviewer is a distinct approval dimension from unit-test success.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 17
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 16: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 16 CORRECTION LOOP. I have NOT accepted the Phase 16 visuals.
Read my feedback below and the Phase 16 acceptance gate. Stay exclusively in Phase 16.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 16 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 16 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 17.
Return `PHASE 16: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 16: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 16
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 17.
```

**To start the next phase, the owner must separately say** `PHASE 17: START` (or request final release review).


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 16

> **Binding instruction:** This addendum extends the original Phase 16 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Demonstrate the output quality materially exceeds baseline in reproducible human-viewable artifacts before considering a release.

**Technology interpretation:** Independent decoder QA plus creative critique, A/B comparison, asset rights, performance and branch/owner gating.

## Additional detailed implementation work (mandatory, not optional)

1. Re-export every promised reference artifact from current production UI: SaaS promo, Character Comedy Parrot, SVG Suspense, educational explainer, 3D character showcase, aspect variants and five-minute episode.
2. Collect blind A/B review against prior AnyConverter outputs; when comparing to Remotion/Claude show clearly labeled **techniques** and do not claim equal quality without an actual permissioned reference video.
3. Score originality, story coherence, readable typography, deliberate framing, character acting, animation continuity, sound quality, image quality, editability and UX, with category floors from master rubric.
4. Require real independent reviewer or owner to inspect full playable outputs rather than relying only on agent-generated numerical scores; list concrete weaknesses for every asset.
5. Verify media with ffprobe/ffmpeg frame count/timebase/audio, preview/export parity, archive reopen/edit/re-export, auth/network quiet path, browser capability fallbacks and cross-format performance.
6. Audit asset provenance, voice model notices, fonts, license terms, CDN loads, Remotion absence unless explicitly approved, and no hidden paid rendering calls.
7. Verify there are no diagnostic overlays/test-only hardcoded scenes in production. Run existing 58/58 and 21/21 if still applicable and new visual regression suites.
8. Deliver owner handoff with full issue register and links to playable files, exact local commit IDs, dependencies, untested hardware/browser claims, and `NOT PUSHED` status.

## Live production-UI demonstration and evidence

- Final visual proof library with at least six complete videos and three aspect variants; side-by-side old/new contact sheets.
- Owner visual score and rejection list recorded; artifacts not self-certified as publishable.
- Local commits only, no push/PR/merge/deploy until phase-16 approval and separate explicit push permission.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-16/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Automated tests falsely claim artistic quality | Require manual full-length review and documented visual score; agent score alone never approves. |
| Unverified Safari/NFC or provider TTS paths | Mark NOT_TESTED/BLOCKED and scope appropriately; do not translate test absence into PASS. |
| Release bundle too heavy | Use lazy-loading and measure realistic sizes, model consents and 3D memory limits. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 16 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 16 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 16 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 16 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Demonstrate the output quality materially exceeds baseline in reproducible human-viewable artifacts before considering a release.
Technology interpretation: Independent decoder QA plus creative critique, A/B comparison, asset rights, performance and branch/owner gating.

Implement EACH of the 8 numbered V2 tasks above AND every original Phase 16 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 16 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 16: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 16 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 16 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```



---

<!-- FILE: PHASE_REJECTION_REPAIR_AND_FINALIZATION_PROMPTS.md -->

# AGY — Phase Repair, Approval and Push Commands

## Rule of engagement

AGY runs one visual phase at a time. The owner may reject a phase as many times as needed. The agent MUST fix all issues in that SAME phase, regenerate evidence and stop. **NO `git push` until the owner explicitly finalizes the phase and authorizes push.** No merges or deployments without separate owner approval.

## 1. User sends a phase-specific rejection

```text
PHASE [NN]: REJECTED. The following outputs are not acceptable:
[Paste ALL faults after watching the actual export, e.g. tiny text, wrong focus,
boring pacing, misspelled word, unintended cropping, poor 3D shading, broken audio.]
AGY: work ONLY on Phase [NN]. Reproduce each issue in localhost from the real UI.
For each defect, identify source, fix design/editor/render parity, rerun and regenerate
full exported media. Fix ALL listed issues before asking for approval again.
Give old/new evidence, one consolidated report and updated creative scorecard.
DO NOT PUSH, create remote PR, merge, deploy, or start Phase [NN+1].
```

## 2. Owner requests one more quality pass without adding new requirements

```text
PHASE [NN]: QUALITY PASS AGAIN. Re-watch full export and compare keyframes against
reference brief. Fix weak hierarchy, repetitive scenes, pacing, inconsistent
motion or typography, bad framing, and visual distractions. Keep changes in Phase
[NN] only, test real UI, re-export, reopen/edit/re-export, return evidence.
NO PUSH OR NEXT PHASE until I approve.
```

## 3. Explicit owner phase acceptance / permission to push

```text
PHASE [NN]: APPROVED FOR PUSH. I reviewed real video and still evidence and
accept this phase. You may push ONLY finalized Phase [NN] commits to the named
visual-quality feature branch. Confirm remote SHA. Do NOT merge or deploy.
Stop afterwards. Do NOT begin Phase [NN+1] until I explicitly instruct you.
```

## 4. Explicit next-phase kickoff (separate instruction)

```text
PHASE [NN+1]: START. Phase [NN] is finalized. Read the master file and the
Phase [NN+1] Markdown file. Implement ONLY that phase, test real localhost output,
fix all problems in-phase, return playable evidence, await my review.
DO NOT PUSH Phase [NN+1] until I finalize and authorize it.
```

## 5. Rejection of misleading evidence

```text
PHASE [NN]: EVIDENCE REJECTED. A unit test, magic bytes, frame count,
prebuilt sample or direct render callback is not proof that the user can
create professional visuals. Rebuild the demonstration from the actual
localhost UI, export the entire piece, inspect decoded visuals and show
save/reopen/edit. Keep phase open and do NOT PUSH.
```



---

<!-- FILE: AGY_START_PHASE01_AND_UNIVERSAL_STOP_PROMPTS.md -->

# AGY — V2 Browser Creative Production: Copy-Ready Master Instruction

```text
AGY / ANTIGRAVITY, read the entire updated AnyConverter 16-phase V2 pack. The original 16-phase visual-quality plan is unchanged. Each phase also contains a mandatory V2 addendum applying the actual source Short production stack: Blender-prepared character poses/glTF, Remotion-quality native composition, browser Kokoro if supported, Web Audio sound design, a validated timeline.json, and existing WebCodecs output.

Implement the browser-native equivalents deeply and authentically. DO NOT claim that Blender bpy/Cycles or desktop Remotion CLI run in the frontend; optional offline authoring is allowed but the end-user site must function with browser assets only. No AnyConverter-paid backend, hosted rendering, AI credit, user-content storage or new Remotion license fees. No arbitrary generated JavaScript. Do not change unrelated site tools or break EN/ES/DA routes/SEO.

CURRENT AUTHORIZATION: PHASE 01 ONLY.

For Phase 01, establish a creative-quality baseline and actually produce one polished 20–25 second multi-shot SaaS promo using the editor, plus short parrot-character and SVG-horror look tests. This is the foundational visual direction, not a mandate to implement Kokoro/3D puppet engine/audio mixing before their assigned later phases. Fix the current default engineering-demo frame compositor and make preview/export match.

After implementation: run browser E2E workflows, produce playable real videos and scene contact sheets, archive/reopen/edit/re-export, run regressions, log and FIX ALL defects identified in the current phase, then send one owner-review handoff with actual visual evidence. If owner rejects, fix the same phase and resubmit, not advance. Owner review includes art direction, pacing, typography and the actual audio/character quality where applicable, not just ffprobe counts.

ABSOLUTE GIT GOVERNANCE: DO NOT PUSH, OPEN REMOTE PR, MERGE OR DEPLOY UNTIL THE CURRENT PHASE IS FINISHED, ALL ISSUES FIXED, AND THE OWNER HAS BOTH EXPLICITLY APPROVED THAT PHASE'S FINAL VISUALS AND AUTHORIZED PUSH. Local commits are allowed. An automated 100% PASS DOES NOT AUTHORIZE PUSH. Do not start Phase 02 until separately authorized.

After Phase 01, return precisely: PHASE 01 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED — NEXT PHASE NOT STARTED.
```

## Universal owner rejection prompt

```text
PHASE NN: REJECTED. Stay inside this phase. Fix ALL of my issues below by reproducing the actual UI and export failures, finding root causes and revising the production composition—not just test code. Regenerate authentic playable video/stills with before/after evidence, retest preview/export parity and archive reopen, and return a complete defect-resolution table. DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE.

OWNER ISSUES:
[PASTE ALL ISSUES]
```

## Phase approval for push (when owner chooses)

```text
PHASE NN: APPROVED FOR PUSH. I have personally reviewed and finalized the current phase. Push ONLY the approved commits to the intended visual-quality feature branch, give me the remote SHA and stop. Do not merge, deploy or start the next phase.
```

