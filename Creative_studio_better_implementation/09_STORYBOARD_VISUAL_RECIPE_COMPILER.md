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


> **V3 owner architecture decision (binding, supersedes older optional Remotion language):** No Remotion dependency or Remotion runtime in AnyConverter production. Use native browser composition, deterministic VisualRecipe JSON, the existing canonical canvas/WebGL evaluator and WebCodecs exporter. JSON is an internal and advanced-user interchange format—not a requirement imposed on beginners. No AnyConverter-funded backend, image/AI inference, server rendering, cloud storage or media proxy. No phase begins and no code is pushed without the owner's separate explicit permission. A local test PASS is not approval.



# V3 MANDATORY EXTENSION — PHASE 09: VERSIONED VISUALRECIPE JSON, SAFE COMPILER AND CHATGPT/CLAUDE HANDOFF

**Status:** Specification only. **Authority:** Do not execute until explicit `PHASE 09: START`; original Phase 09 guided 6-shot storyboard → editable native 45s video AND hand-authored JSON import are preserved. The V3 schema compiler is **not** the same as a text-to-image AI model. It can only compose registered primitives, layouts, media, motion, transitions and later-approved 3D/audio capabilities.

## V3.1 Single canonical architecture

`User intent or UI edits / third-party AI-generated JSON` → `parse` → `size and structural limits` → `trusted static JSON Schema validation` → `semantic graph validator` → `capability & asset resolver` → `compile to canonical shot graph` → `deterministic per-frame evaluator` → `same preview canvas AND WebCodecs export` → `.acstudio save/reopen`.

**No Remotion** (including indirect runtime dependency) and **no executing user/AI supplied JavaScript, React, HTML, SVG active content, CSS expressions, arbitrary shader strings, URLs or code**. The schema is compiled from a known, version-controlled definition shipped at build time; user documents are JSON instances, never schemas or scripts. No network calls to AI providers by default: the AI workflow is *copy prompt into personal ChatGPT/Claude → paste JSON back*.

**One source of truth:** Persist one canonical project/shot graph with unique, stable IDs. UI, JSON import, templates, undo/redo, preview, export, archive and hint engine must all use it; never create an AI-specific renderer, separate demonstration-only visual path or output that misrepresents available assets.

## V3.2 VisualRecipe v1 contract (deliver a REAL machine-readable JSON Schema)

Deliver `visual-recipe-v1.schema.json` and type definitions with the following normalized sections. Include `schemaVersion`, `id`, `locale`, `title`, `canvas{width,height,fps,background}`, `style{themeId,accent}`, `assets[]`, `shots[]`, `intent`, `durationFrames`, `layoutId`, `elements[]`, `tracks[]`, `transitionOut`, and `editor{...}` when necessary. Every element has `id`, `type`, `transform`, `style` and type-specific content, using **only registered renderer tokens**.

**Allowed initial element types:** `text`, `shape`, `procedural`, `image`, `video`, `group`, `caption`. **Allowed initial animations:** `opacity`, `position.x`, `position.y`, `scale`, `rotation`, `blur` only where native evaluator already supports them; `animate` keyframe arrays map `[frame,value,easing]` into frame-deterministic interpolation (no expressions). **Allowed scene metadata:** `visualIntent`, `rightsCheck`, `publishability`, `locale`, `altText`, and `sourceLink` if relevant; never turn semantic hints into blindly trusted facts.

Bound limits in schema AND runtime: max input bytes, depth, shots, elements per shot, tracks/keyframes, frame count, text length, image/video max dimensions and decoded total bytes. Treat any numeric value as finite and bounded. Explicitly reject duplicate IDs, unknown type/preset, invalid keyframe order, unresolved `assetRef`, out-of-bound timeline, cyclic groups, wrong locale, unsupported render features, placeholder marked publishable, unlicensed remote media, missing font IDs and schemaVersion mismatch. **Unknown fields must reject or be quarantined with a user-visible migration message—not silently execute or vanish.**

Do not import arbitrary JSON Schema from the user's AI answer. If using Ajv, use locally trusted **precompiled standalone validators** so strict CSP can remain; do not enable `unsafe-eval` just to compile untrusted schemas at runtime. Keep a separate manual semantic validator for cross-field and asset constraints. Add deterministic migration from prior Phase 01 `.acstudio` and VisualRecipe versions with golden fixtures and no loss of shot timing/motifs.

The bundled `/spec/visual-recipe-v1.schema.json` and `/examples/password-vault.visualrecipe.json` are **proposed starting contracts to adapt and implement**, not claims the existing repo can render these types yet. AGY must reconcile with real current model and document every compatibility change.

## V3.3 Exact animation/motion semantics

- Project timeline is integer frames; `fps` stored explicitly. A shot's duration is an integer frame count. The compiler computes `startFrame` by cumulative sum and forbids negative/infinite values. `frame=0` is the first frame, end frame is exclusive. A 90f shot at 30fps is 3.0 sec. Keyframe timestamps are **shot-local** unless explicitly defined global; standardize and test.
- The canonical evaluator `evaluateAtFrame(project, frameIndex)` must be pure/deterministic for the same project, assets and supported backend. Easing presets are registered IDs with portable maths; pseudo-random motion requires a saved seed. Avoid runtime wall clock, Math.random, unsupported CSS animations or source media that cannot seek deterministically.
- `transitionOut` with finite allowed types; overlap rules documented (whether duration consumes/overlaps shots), no blank frames, cross-shot timing deterministic. Camera should be a registered transform/group node, not loose JS motion.
- Layer ordering, opacity, z-order, masks, safe areas, anchoring, clipping, cover/contain and parallax must connect to actual Phase 02–08 component implementation.
- Audio and voice future proof: allow data-only audio/caption/cue references without claiming Phase 11 voice generation works in Phase 09; unsupported track types must produce an actionable capability error or draft warning, not fake silence.
- Asset references must resolve through Phase 07 registry **locally for preview AND export**, and preserve hashes, rights records and embedded bytes in `.acstudio`; no remote downloads while a deterministic offline export is expected.

## V3.4 Compiler pipeline implementation work packages

1. **Audit and reconcile:** Find Phase 01 `project.shots[]`, `scenes[0].durationFrames`, presets, archive, WebCodecs and Phase 07 registry; create migration diagram and tests.
2. **Schema + generated types:** Build strict schema and own TypeScript/JSDoc definitions; produce `examples/valid/*` and `examples/invalid/*`; no open-ended `any`/freeform script strings for executable behavior.
3. **Parser/validator:** JSON size, parser error location, safe structure, max nesting, duplicate IDs, missing refs, licensed asset capability and no executable markup. The UI shows understandable error line and affected shot.
4. **Compiler:** Resolve visual intent to supported component IDs/layout; compile shot graph & frame tracks; emit `SUPPORTED`, `NEEDS_ASSET`, `DRAFT_ONLY`, `UNSUPPORTED_RECIPE` with precise reasons, per-shot—not fake art.
5. **Storyboarding without AI:** A rule-based guided brief generates a 6-shot storyboard, editable through existing controls, with suggested layout and asset alternatives. Export 45s with real composed scenes and no mismatched motif.
6. **AI copy/paste without service integration:** Provide **Copy Design Prompt** plus schema mini-contract, available component list and asset manifest snapshot. User pastes into an external chat of choice, receives JSON, imports through actual UI. Preview diff before commit and show errors; never upload project automatically.
7. **Import preview / safe apply:** Parse in memory, build staged preview, list all modifications, required assets/unknowns, and require explicit user confirmation; atomic apply and undo. Allow export JSON and `Copy repair request` that explains validation issues; no script execution.
8. **Scene sequencing and motion:** Support per-shot sequencing, declarative registered transitions, motion/keyframes and captions; normalize safe aspect ratios. Encode one meaningful 45-second scene compilation, with verified timeline and sample frame parity.
9. **Roundtrip + migrations:** JSON → project → `.acstudio` → fresh isolated reopen → JSON export must preserve all relevant fields; lossless canonicalization may reorder keys but not semantics. Old projects must migrate deterministically and never lose saved asset metadata.
10. **Locale/accessibility/privacy:** EN/ES/DA for UI labels and compiler diagnostics; text shaping/RTL plan clearly marked if unsupported; no hidden AI requests or copied private asset bytes in generated prompt without consent.

## V3.5 ChatGPT/Claude copy-paste exchange (required user-facing flow)

**A. Beginner selects scene brief.** Show a button `Copy a prompt for ChatGPT / Claude`. Prompt includes: creative brief, aspect ratio, fps, supported `layoutId`, `proceduralId` and animation preset IDs from installed registry, known asset IDs (no raw private file data), schema URL/version, and clear 'JSON only'. **B. User pastes external answer into 'Import VisualRecipe' box.** Import applies no code or remote URL; validate; show scene thumbnails and unsupported assets; optionally export feedback via `Copy a fix prompt` with specific schema errors. **C. User can use the exact same project in Phase 10 beginner/advanced visual modes without encountering JSON.** Modes are different views on one project.

**Text for the external AI prompt (use as UI button template):**

```text
You are designing a scene composition for AnyConverter Creative Studio. Produce ONLY a single valid VisualRecipe v1 JSON object (no Markdown, JSX, HTML, Python, JavaScript or comments).
Brief: {{userBrief}}. Format: {{width}}x{{height}}, fps={{fps}}, locale={{locale}}.
Choose only from these installed and available layout IDs: {{layoutIds}}.
Choose only from these installed procedural IDs: {{proceduralIds}}.
Choose only asset IDs from the attached list: {{permittedAssetIds}}; if none, use procedural diagrams and typography. Do NOT invent photos, images, brand assets, factual statistics, files or remote URLs.
Every shot needs a clear narrative intention and a visual element that actually illustrates it. Use controlled keyframes and registered easing tokens only. Required: schemaVersion, project, canvas, style, shots. Use strict allowed types. If some visual concept is not possible, mark it as draft/unresolved and provide a text-first or procedural alternative; do not silently substitute unrelated SaaS graphics.
The answer will be validated against the application's strict schema and capability registry. Output JSON only.
```

**No silent AI access:** It is an external copy/paste workflow; the user's personal ChatGPT/Claude service and privacy policies apply outside AnyConverter. The app may copy only the user-authorized brief and selected capability list, not private media, authentication tokens, browser histories or hidden prompts. Never advertise as in-app automatic AI video generation.

## V3.6 Fail-closed content suitability and publishability

The Phase 01 security-vs-SaaS regex is a **bounded guard**, not general semantic understanding. In Phase 09 add a `visualIntent` + `illustrates` binding: every shot identifies which visual primitive/asset supports the concept. Match against a registry taxonomy of allowed topics and explicit user selection. If a topic cannot be mapped, mark `REVIEW_REQUIRED` or `DRAFT_ONLY` and request user visual confirmation. A rule-based match must not assert correctness for scientific/medical/financial facts. No invented 81% statistics, bogus encryption labels or unrequested product promotion. Export logic must preserve the existing Production vs Draft distinction: placeholders/unresolved/known mismatch may only go out with a visible DRAFT label; production export fail closed on known mismatch or required unresolved asset. A user's deliberate text-only treatment can be publishable if it has actual designed composition and the user explicitly approves this mode; not every shot requires a stock image.

**Important:** No automatic service can guarantee semantic truth using only a local keyword taxonomy. Your gate rejects known mismatches, supplies meaningful warnings and lets users make informed visual choices; the owner reviews the actual video.

## V3.7 Required demonstrations and **hard** acceptance gates

**Journey 1 — fully offline/no AI:** Choose a six-shot beginner brief, compile via UI, choose 6 relevant registered visuals, generate a 45s original narrated-by-text (audio status disclosed) video; ensure it does not merely change titles on six copies of the same background.

**Journey 2 — hand-authored JSON:** Import example, validate, render, export and reopen. Modify a keyframe and visual asset via the actual UI, export JSON; compile again and compare decoded frames semantically/quantitatively.

**Journey 3 — external ChatGPT/Claude:** Use Copy Prompt, get JSON from a separately simulated fixture representing an untrusted AI response (test uses real import UI), correct an invalid ID using Copy Fix Prompt, preview and export. Do not call the AI from AnyConverter, and do not fake asset creation.

**Journey 4 — malformed/malicious JSON:** Syntax errors, unknown types, unsupported procedural ID, duplicate IDs, oversized strings/numbers, NaN-like invalid tokens, dangerous URLs, embedded active SVG/HTML, missing asset, out-of-range keyframe, malformed preset. No code executes, no render success and an actionable error is shown. Confirm no `eval`/new Function on user-supplied data in runtime.

**Journey 5 — archive/version:** Old Phase 01 project, asset-rich Phase 07 project and V1 recipe → save/reopen in isolated offline browser; imported content remains editable and renders same after restart. Recompute hashes and verify the original assets are still embedded.

**Benchmark target:** same canonical evaluator yields preview/export SSIM ≥ threshold justified by codec and consistent per-frame narrative at **0, 10, 25, 50, 75, 90, 100% and transition boundaries**; at least three compositions and a complete 45s playable video. Subjective visual score is owner-led only. Assert nonzero process exit on every unmet hard gate. Test EN/ES/DA, Chrome/Firefox/Safari capability matrix, with unsupported encode path labelled honestly.

### Deliverables in `reports/creative-studio/visual-quality/phase-09/`

`VISUALRECIPE_SCHEMA_AND_CAPABILITIES.md`, `visual-recipe-v1.schema.json`, `SCHEMA_VALID_INVALID_FIXTURES/`, `MIGRATION_AND_ROUNDTRIP.md`, `COMPILER_VALIDATION_ERRORS.md`, `CHATGPT_CLAUDE_COPY_PASTE_JOURNEY.md`, `NO_AI_OFFLINE_45S_VIDEO.webm`, `AI_PASTED_JSON_EDITED_VIDEO.webm`, `DRAFT_PRODUCTION_GATE.md`, `PREVIEW_EXPORT_PARITY.md`, `REGRESSION_TESTS.md`, `DEFECT_REGISTER.md`, `PHASE_HANDOFF.md` and actual source patches with UTF-8 encoding. Every video must be produced by real editor UI, not directly calling internal render to bypass controls.

## V3.8 Dependencies and handoff to Phase 10

Phase 09 delivers **engine and minimum import UI**, not the full six-mode polished experience. Phase 10 builds the mode selector and guided visual UX on this same compiler. The Motion Graph from Phase 04, transitions from Phase 05, shot library Phase 06, Asset Factory Phase 07, diagrams Phase 08 are actual reachable registries; no advertised feature may be a one-off fake preview or future capability disguised as working.

## V3.9 Copy-ready AGY Phase 09 authorization prompt

```text
AGY — EXECUTE AUTHORIZED PHASE 09 ONLY: SAFE JSON-BASED VISUALRECIPE + COMPOSITION COMPILER. Read original V2 Phase 09, V3 addendum and master governance. Keep original guided 6-shot/45s movie and handwritten JSON import requirements. Implement versioned strict JSON Schema, safe parser, semantic/asset/capability validation, canonical frame-based compilation, migrations, all offline without Remotion. Add Copy Prompt and Import AI Design (copy/paste, not hosted AI) and a Copy Fix Prompt explaining schema problems. No arbitrary AI code, HTML, SVG actions, shaders, image generation promises or remote asset magic. Validate realistic no-image and missing-asset workflows; export and reopen the actual project through browser UI; prove codec frames, preview/export parity, meaningful visuals, EN/ES/DA and negative security gates. Return truthful source diffs, actual playable media, and defects. DO NOT PUSH, PR, MERGE, DEPLOY OR START PHASE 10. Owner must approve output and separately authorize any push.
```

