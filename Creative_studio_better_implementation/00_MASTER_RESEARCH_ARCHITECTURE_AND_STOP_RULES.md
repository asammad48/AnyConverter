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

### Planned extension after Phase 16

[Phase 17 — AI-Guided Blender Production](17_AI_GUIDED_BLENDER_PRODUCTION.md) adds a reviewed prompt-to-scene workflow through an optional local Blender add-on. Phases 07, 09 and 12 provide the import, planning and 3D foundations. Phase 17 requires the Phase 16 release-gate review and a separate owner START.

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

- [`17_AI_GUIDED_BLENDER_PRODUCTION.md`](17_AI_GUIDED_BLENDER_PRODUCTION.md) — planned extension

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
