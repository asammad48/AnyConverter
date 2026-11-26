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
