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
