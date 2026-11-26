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
