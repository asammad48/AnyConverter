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
