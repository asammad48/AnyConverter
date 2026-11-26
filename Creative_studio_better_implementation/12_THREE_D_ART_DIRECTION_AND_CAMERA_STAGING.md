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
