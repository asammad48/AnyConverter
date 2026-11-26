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


> **V3 owner architecture decision (binding, supersedes older optional Remotion language):** No Remotion dependency or Remotion runtime in AnyConverter production. Use native browser composition, deterministic VisualRecipe JSON, the existing canonical canvas/WebGL evaluator and WebCodecs exporter. JSON is an internal and advanced-user interchange format—not a requirement imposed on beginners. No AnyConverter-funded backend, image/AI inference, server rendering, cloud storage or media proxy. No phase begins and no code is pushed without the owner's separate explicit permission. A local test PASS is not approval.



# V3 MANDATORY EXTENSION — PHASE 10: SIX CREATION MODES, PROGRESSIVE UX AND CANONICAL EDITOR

**Status:** Specification only. **Scope:** Original Phase 10 shot editor (create/split/trim/reorder/duplicate, direct manipulation, masks, motion keyframes, accessible timeline, undo/redo, edit/reopen, 30-second benchmark) remains mandatory. This V3 extension makes it accessible through six creation modes, including nontechnical, low-literacy and AI copy/paste users. None may depend on Remotion, a paid AI model, a backend or bypass the canonical document/renderer.

## V3.1 One engine, six interface modes (NOT six separate renderers)

All modes read/write the **same VisualRecipe document store and asset IDs**, with shared undoable commands and one canonical frame evaluator. Switching modes must preserve scene order, shot IDs, media refs, masks, keyframes, captions, audio events and all versioned metadata. Each mode is a different *presentation* and *creation pathway*, never an independent project format.

| Mode | Name (EN; translate ES/DA) | Target user | Exact first screen / next action | Required outcome |
|---|---|---|---|---|
| 1 | **Quick Create** | First-time user, low technical literacy | Big pictures: `What would you like to make?` → `Video length?` → `Choose a look` → `Show this` → `Create` | Complete short with chosen, relevant visuals in ≤5 clear steps; no JSON or code |
| 2 | **Guided Storyboard** | Educator, marketer, student | Story cards: `What happens?` + `What should people see?` + visual suggestions from Phase 07/08 | Meaningful editable scene-by-scene visual plan with on-topic diagrams and safe publish status |
| 3 | **Template Remix** | Content creator seeking speed | Choose a professional template, instantly preview; `Change text`, `Change visual`, `Change colour`, `Adjust time` | Editable remix; all scene and asset properties persist; not flattened movie |
| 4 | **AI-Assisted Copy/Paste** | ChatGPT/Claude users, without connected keys | `Copy prompt` → paste into user's AI chat → `Paste design here` → Validation/errors → Preview | Import strict JSON through Phase 09; zero AnyConverter-hosted AI inference; user-controlled privacy |
| 5 | **Advanced Visual Editor** | Experienced creator | Canvas + shot cards + timeline + layers + animation keyframes + asset tray + property inspector | Full non-linear editorial control; no private internal JS hacks |
| 6 | **Developer / JSON Mode** | Developers, integration designers | Strict JSON editor with schema hints, validation, safe code-free import/export and diff | Accurate roundtrip VisualRecipe, compile errors, no execution of arbitrary code |

**Product promise:** A user without an image, an AI key, a design degree or an understanding of JSON can still produce a coherent short using procedural components or a text-led layout. No mode may fabricate arbitrary picture assets when none exist.

## V3.2 Beginner and low-literacy design rules (highest priority)

- Start with **one large, understandable decision per screen**, picture-based choices rather than developer jargon; avoid `codec`, `DOM`, `layer`, `schema`, `keyframe`, `easing`, `WebCodecs`, `vector` and `JSON` in Modes 1–3.
- Show progressive disclosure: a clean mode bar + one main action; advanced menus are tucked away. Always present a clear `Back`, `Next`, `Preview`, `Change visuals`, `Save`, `Export`, `Undo` and keyboard equivalent where relevant.
- Use sample presets for *teacher lesson*, *product promotion*, *storytelling*, *social short*, *security explainer*, *business infographic* and *simple photo/video montage*. Asset hints, thumbnails and context-specific what-you-see notes explain what each choice does.
- Support reading simplicity rather than condescending assumptions. Use labels with icons, a large touch target, visually distinct mode names, helpful empty states, and a **visual storyboard with 3–5 safe options per shot**, not a huge raw asset result list.
- EN/ES/DA strings authored natively and checked for overflow; avoid naive word-for-word interpolation in generated creative content. Future extra languages via localization keys.
- When a user switches to Advanced/JSON and back, show a friendly `This part can be edited in Advanced mode` notice for unsupported complex controls; **never strip keyframes/assets** because Quick Mode cannot display them.
- No nudging users toward external AI. Modes 1–3 must be fully productive offline with permitted local assets.

## V3.3 Shared state, commands and reconciliation

**Central document commands:** `addShot`, `removeShot`, `duplicateShot`, `reorderShot`, `setText`, `setVisual`, `importAsset`, `replaceAsset`, `setCrop`, `setLayout`, `setMotion`, `moveKeyframe`, `setDuration`, `setBrandMode`, `setCaptionCue`, `setAudioCue` (where supported), `applyValidatedRecipe`. Each operation emits a typed, undoable transaction with a before/after revision and an asset dependency check. Do not expose all functions as undocumented `window.*` authoring hooks or rely on Playwright `page.evaluate` to create projects.

**Critical side effects:** Reordering recomputes frame starts and transition overlaps; resize/recomposition respects future Phase 14 constraints but cannot silently crop subjects; removing a shot cannot orphan referenced media or corrupt subsequent frames. Mode switching must be lossless; autosave and `.acstudio` archive remain compatible with Phase 01 and Phase 09. Browser reload or expired OPFS quota must not erase an unsaved project without actionable warning.

**Mode state vs project state:** `activeMode`, open panels, selected card, search text, undo history pointers are editor preferences; actual video/asset/shot details belong only to canonical project. Save `preferredMode` optionally as metadata but never duplicate the content across modes.

## V3.4 Mode-specific implementation work packages

### Mode 1 — Quick Create: fully visual five-step wizard

1. `Choose what to make` with 6–8 visual categories. 2. `Select size and length` via friendly labels (Vertical Short, Wide Video, Square) with real output aspect ratio. 3. `Enter message/topic` in a text area. 4. `Choose scenes` from 3 suggested meaningful diagrams/visuals per scene; allow `No image—use typography/diagram` and `Upload my own`. 5. `Preview / Export` with clear publishability status, credits and save. Allow previous-step changes without losing choices; offer one-click `Edit further` advanced transition. Test on a low-end device and 375px viewport.

### Mode 2 — Guided Storyboard: narrative to visually relevant shots

Each storyboard card contains `Purpose`, `Narration or on-screen words`, `What should people see?`, `Choose illustration`, `Duration` and `Next visual beat`. Show meaningfully different scene thumbnails, not same title card five times. Select visual motifs or licensed images through Phase 07 without opening JSON. Display per-scene semantic confidence/status as `Fits selected topic / Please review / Missing visual`—the app is not a factual AI checker. Deliver six-shot educational explainer with honest sourced claims, correct diagram sequence and readable timing.

### Mode 3 — Template Remix: editable professional composition

Filter templates by purpose, video format and licensed asset requirement. Preview actual frames, not poster mockups. Replace graphics/characters, media, headings, colours, fonts and timing without flattening; retain keyframes if user keeps default, provide safe motion adjustments. Confirm that an unlicensed/missing asset cannot be exported as polished output. At least three genuinely distinct native template styles, all with responsive layouts and archive support; Phase 13 expands premium range.

### Mode 4 — AI-Assisted Copy/Paste: no keys or cloud rendering

Integrate Phase 09 `Copy design prompt`, `Paste VisualRecipe JSON`, `Validate`, `Preview changes`, `Apply`, `Copy fix prompt` and `Export`. The outgoing prompt shows exactly what will be shared; exclude private files, credentials, full project blobs and metadata by default. Invalid JSON must not change the active project. Show missing asset IDs and suggest actual registered alternatives. External assistant outputs must never become executable JS/React/HTML/SVG. E2E test must use deliberately malformed AI output, correction and real UI import without internal function calls.

### Mode 5 — Advanced Visual Editor: production-grade controls

Preserve original Phase 10 non-linear timeline, split/trim/duplicate/reorder, direct drag, resize, crop, anchor, masks, layers/z-index, caption track, pose where supported, camera/transition keyframes, named easing presets, music/SFX cue placeholders/actual audio when Phase 11 enabled, waveform if available, snapping, guides and history. Never pretend to edit a component that is actually hardcoded. Export visual overlays (selection boxes, handles, engineering timestamps) prohibited. Preview and render use same node graph; compare both at numerous cut boundaries. Select any imported asset and inspect its rights/source. Allow changing any shot visual through actual UI.

### Mode 6 — Developer / JSON Mode: safe advanced interchange

Use multiline editor with syntax highlighting optionally lazy-loaded, schema-aware suggestions (for *registered IDs only*), inline error line, allowed values, formatting, diff, dry-run compile, import/export and repair prompt. No `eval`, dynamic Function, unsafe `innerHTML`, third-party arbitrary scripts, remote shader loading or code preview execution. Validate against trusted schema and graph semantics before atomic apply. A developer can modify keyframe values, scene order, asset references and transitions in JSON then return to Beginner mode with no data loss. Preserve comments only in editor scratch if desired; JSON spec itself has no comments.

## V3.5 Cross-mode lifecycle & quality guarantees

- **Same project, six modes, one output:** Create Quick video, switch to Guided to refine, Template Remix to choose style, Advanced to edit keyframes, Developer to inspect JSON, AI Copy/Paste to revise, then save and reopen. No hidden conversion that changes shots or strips properties.
- **Visual relevance:** Every scene must be on topic via explicit user choices or clearly marked review. If not, provide procedural diagrams or text-only treatment, not unrelated SaaS graphics. Unknown matching is `REVIEW_REQUIRED`, not invented semantic guarantee.
- **No asset provided:** use built-in procedural component tiers, design tokens and diagrams with meaningful labels and motion. If a user's requested specific photo/character is unavailable, say so, offer upload or compatible catalog asset; **do not claim to generate it without AI**.
- **Performance:** Lazy-load Advanced/JSON editor and optional catalog integrations; avoid turning all 128 AnyConverter tools into a heavy SPA. Record JS bundle size, cold open, timeline seek latency, export memory, autosave. Offload suitable decoding and encoding work to worker where supported; no forced paid services.
- **Privacy:** user files stay browser-local unless user explicitly chooses provider search or external AI chat; analytics policy documented; no project content/asset bytes in silent telemetry.
- **Accessible workflows:** keyboard focus and screen reader labels, reduce-motion preview preference (without silently changing export), not solely colour-dependent statuses, 44px-class touch targets where feasible, full functional mobile Quick mode; Advanced mobile can be honestly constrained.
- **Safe project persistence:** JSON and asset manifests in `.acstudio`, stable IDs, integrity checks, old project migrations, clean browser reopen and edit for every mode. No serialized object URLs as permanent dependencies.

## V3.6 Formal acceptance suite (all mandatory)

**A. Six-mode smoke and parity:** Each mode opens EN/ES/DA, creates/edits relevant content, and returns to same project. No disabled decorative mode buttons claiming implementation. Stable project checksum/semantic diff after roundtrip.

**B. Five novice usability journeys (real people preferred; objective automated path supplement):** A user who has never seen JSON produces a 20–30s Short with distinct shots in ≤5 wizard steps; a teacher makes a diagrammatic 6-shot lesson; a marketing user remixes a template; a creator changes an asset/keyframe and undo/redo; a developer safely imports JSON. Record mistakes and friction rather than fabricating a successful usability score. Encourage an actual nontechnical tester but do not invent one.

**C. AI paste security:** Paste valid example, invalid syntax, malicious HTML/JS/SVG, unknown animation/asset IDs, 100MB content, duplicate IDs, unresolved assets, forbidden URL; reject cleanly and preserve active project. No browser code execution.

**D. Cross-mode asset fidelity:** Import an asset through Factory, apply in Guided mode, change in Advanced mode, inspect in JSON, export, fresh-profile reopen offline, verify same pixels/rights and deterministic frame counts.

**E. Export real films:** At least one 30s publishable Short and one 45s educational explainer (Phase 09 output may be reused only as baseline—not proof of newly added controls). Inspect actual full video with sound status and subject relevance; compare preview/export at random frames and scene transition boundaries.

**F. Regression & responsive:** Controls tested at 1440, 768, 375 px; EN/ES/DA; keyboard and pointer; offline; provider rate-limit/CORS; low-memory quota; browser capability fallback; site-wide URL/link/accessibility/performance checks. No PSNR or SSIM pass for a wrong/irrelevant visual—semantic and visual review is separate.

**G. State mutation & persistence:** Undo/redo across modes, reorder shots, trim split, save as `.acstudio`, open isolated browser, re-edit, re-export; compare intended shot content and frame counts. UI-created output and JSON-import-created output use identical renderer and preserve provenance.

**H. Defect closure:** Independent owner sees real local video and contact sheet, rejects visual filler/overlaps, P0/P1 fixed in Phase 10, no 'all pass' claim merely because tests return exit code 0. Report truthful unsupported capabilities rather than fake controls.

### Required Phase 10 artifact set

`SIX_MODE_UI_CAPABILITY_MATRIX.md`, `MODE_WIZARD_SCREENS_AND_COPY.md`, `MODE_SWITCH_DATA_FIDELITY.md`, `LOW_LITERACY_USABILITY.md`, `JSON_PASTE_SECURITY_TESTS.md`, `ASSET_FACTORY_EDITOR_INTEGRATION.md`, `REAL_30S_QUICK_CREATE.webm`, `REAL_45S_EDUCATIONAL_EXPORT.webm`, `CROSS_MODE_REOPEN_EDIT_REEXPORT.md`, `PREVIEW_EXPORT_PARITY.md`, `EN_ES_DA_RESPONSIVE.md`, `DEFECT_REGISTER.md`, `PHASE_HANDOFF.md`, and source patch with exact locally tested commit SHA. No need to upload huge media archives; local paths + contact sheet + text report after owner request.

## V3.7 Non-goals and risk boundaries

- No hosted AI chat integration, paid TTS, cloud asset storage, cloud inference, server generation, generic prompt-to-image engine or Remotion. External user-owned AI chat is manual copy/paste only. BYOK direct-browser integration is outside this phase unless separately authorized.
- Don't implement 3D rigs or TTS prematurely; Phase 11/12 capabilities are enabled only when their corresponding renderer/assets exist. Optional UI placeholders must be visibly disabled with an explanation, not look like finished tools.
- Phase 13 owns broader template polish/library; Phase 14 deeper aspect-ratio recomposition, Phase 15 long-form pacing; do not hijack Phase 10 to claim these are complete.

## V3.8 Copy-ready AGY Phase 10 authorization prompt

```text
AGY — EXECUTE AUTHORIZED PHASE 10 ONLY: SIX FRONTEND CREATION MODES ON ONE CANONICAL JSON-BASED VISUALRECIPE ENGINE. Keep ALL original V2 Phase 10 editing, masks, motion, 30s publishable video, undo/redo and fresh archive requirements. Implement Quick Create (visual ≤5-step wizard), Guided Storyboard, Template Remix, external ChatGPT/Claude Copy/Paste JSON, Advanced Visual Editor, and Developer/JSON Mode. They are NOT six renderers. All use Phase 09 compiler and Phase 07 licensed Asset Factory. Beginners must never need JSON or AI subscription. Produce 30s and 45s original, on-topic, actual UI-created exports; demonstrate changing content and visual assets, mode-switch fidelity, cross-language access, archive reopening and independent preview/export comparisons. Test malicious AI JSON, missing assets, license/CORS/offline. No UI button may advertise a nonexistent feature. No Remotion, AnyConverter-hosted AI, paid backend, bulk asset hosting or code execution. Preserve site-wide tools. Log all defects and repair inside Phase 10. NO PUSH, PR, MERGE, DEPLOY OR START PHASE 11 without explicit owner phase completion AND separate push authorization.
```

