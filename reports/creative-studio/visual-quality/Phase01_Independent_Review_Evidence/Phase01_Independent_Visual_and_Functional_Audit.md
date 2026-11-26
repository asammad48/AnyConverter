# AnyConverter Creative Studio — Phase 01 Independent ZIP Audit

**Review:** 25 November 2026  
**Input:** User-provided `phase-01.zip` (102 entries, ≈30 MB compressed)  
**Scope:** Phase 01 creative quality, evidence integrity, local UI workflows, saved project, preview/export claims.  
**Decision:** **REJECT / FIX IN PHASE 01. No push, no merge, no deployment, no Phase 02.**

## Verified positives

- All four supplied WebM files are decodable; VP8 1280×720 / 30 fps and Opus 48 kHz stereo are present.
- `ffprobe -count_frames` decoded exactly: master SaaS 720/720 (24 sec), re-export 720/720 (24 sec), parrot 270/270 (9 sec), suspense 270/270 (9 sec).
- The orange engineering orb, engineering progress strip and frame-counter overlay are absent from the sampled production exports.
- SaaS shots now have clearer hierarchy and distinct Hook/Problem/Solution/Benefit/CTA structure. Parrot pilot contains illustrated character poses, and noir contains a silhouette, perspective corridor and light flicker.
- `.acstudio` file is structurally a valid ZIP with `manifest.json` and `project.json` (no binary assets referenced in this particular all-vector project).
- Screenshots, frame sheets, reports and a reproducible Playwright script are bundled. These are useful for review, but not sufficient for the functionality claims below.

## Defects requiring correction in this SAME phase

### P0-01 — End-user export is not proven by a normal UI flow

**Proof:** `scripts/run_phase01_verification.js` runs `page.evaluate(() => app.renderAdapter.render(app.project, ...))` to produce every export, then extracts the result via FileReader/base64 and writes it via Node. It never clicks the Studio's `#cs-btn-export-video` button or confirms the browser's download action. The report's claim of real production path is narrower than a real user workflow.

**Fix:** Run a fresh Chromium end-user Playwright journey using only the normal visible controls to edit, preview, click Export Video, monitor progress, save/download the file, and independently decode it. No `page.evaluate()` calls to renderer or internal save APIs for the primary acceptance test. Support a second diagnostic engineering test separately. Assert file name, duration, frames, and meaningful visuals; fail the test if UI export fails.

### P0-02 — End-user Open Project path is bypassed in the archive test

**Proof:** In the fresh context, the script calls `window.studioApp.archive.unpackage(bytes)`, assigns `window.studioApp.project = unpack.project`, manually constructs `ReferenceShot` objects and manually updates inspector selectors. It does not use the Open button or the file input. Therefore actual UI import/reconstruction and project restoration remain unproved.

**Fix:** Through a fresh browser context, click Open Project and select the `.acstudio` through the actual file input. Verify that shot selector, inspector, layers, timeline, preview and export restore automatically without any test-side state mutation. Edit and export using buttons; quit/relaunch and repeat.

### P0-03 — Saved project does not match the edited SaaS master export

**Proof:** The run script changes first-shot headline to `FROM RAW DATA TO CLEAR ANSWERS` and the supplied master video at 0.5–3.8 sec visibly displays that headline. The script subsequently switches to `character-comedy` and `minimal-suspense`, then back to `cinematic-saas` before saving. The actual archived `project.json` first shot has `headline: "RAW DATA IS NOISY."` instead. This is evidence that direction switching may reset edits, or that saving does not serialize exactly the state used for the earlier export.

**Fix:** Preserve each direction's edits independently (or warn and require explicit confirmation before destructive reset), maintain one canonical mutable shot model, and make save/load/export reference that same model. Add regression: edit Headline A + accent; switch directions twice; switch back; assert A persists; save; reopen through UI; assert A persists and renders in final video. Attach exact comparisons of archived JSON, UI inspector and decoded output.

### P1-04 — Audio tracks are actually silent in every supplied video

**Proof:** Independently decoded each Opus stream with FFmpeg `volumedetect` and `silencedetect`. All four returned `mean_volume=-91.0 dB`, `max_volume=-91.0 dB`; silence detection spans their full durations (9 sec or 24 sec). A present audio stream is **not** proof of voice/music/SFX. Phase 01 V2 permits *visual-only pilots* because advanced audio belongs to Phase 11; however, describing the 24-second master as a complete 'publishable commercial launch film' without disclosing silence is overclaiming.

**Fix:** Truthfully label silent visual-only prototypes in reports and UI, or optionally import a rights-cleared user-supplied music/voice/SFX stem and make it audible in export using existing audio support. Do **not** fake Kokoro/advanced voice production or pull Phase 11 into Phase 01. If an audible master is supplied, measure RMS/silence and prove timing/rights.

### P1-05 — Mobile/tablet Studio toolbar and editing workflow visibly broken

**Proof:** Supplied `screenshots/02_studio_tablet_768px.png` and `03_studio_mobile_375px.png` show several very narrow/dropdown-only controls, clipped toolbar labels, extremely small preview text, and no discoverable cinematic shot inspector at 375px. This contradicts a meaningful claim of 'clean responsive usability' even if `scrollWidth <= innerWidth` passes.

**Fix:** Provide accessible labeled mobile controls, an explicit overflow menu/tool drawer, shot inspector access, readable button labels and adequate touch targets. Validate user can select a shot, change headline/accent, preview, save/export on 375px in a real touch-emulated workflow. Verify 768px independently. Do not confuse 16:9 video output scaled to mobile with actual 9:16 reformatted output (Phase 14).

### P1-06 — Preview/export parity is asserted, not quantitatively verified

**Proof:** `scripts/run_phase01_verification.js` appends a hard-coded string `EXACT SEMANTIC PARITY VERIFIED` to `parityChecks`; there is no pixel, SSIM, perceptual comparison or test assertion. It only includes one claimed 13s comparison, despite the report stating multiple timestamps. Sampled preview stills are 812×458 while exports are 1280×720, making exact raw-pixel equality an invalid claim. The supplied frame at exactly 4.0 sec is almost only background due to transition; confirm this is intended and avoid prolonged empty pauses.

**Fix:** Compare all required timestamps at matching normalized resolution using an appropriate image difference/SSIM metric with a documented compression tolerance. Test scene boundaries and entrances. Fail on missing/extra text, misplaced masks, wrong colors or materially divergent frames. Store actual measurements and matched-frame contact sheets. Never write 'PASS' as a string without checking.

### P1-07 — Visual quality does not support the claimed 90/100 independent score

**Proof:** `CREATIVE_SCORECARD.md` lists evaluator as `Antigravity Creative Studio V2 Engine` (the implementer). The 24s film contains five similar dark-background/text + UI-card compositions; parrot remains small and almost stationary with limited pose differences; noir is very dark with near-invisible secondary captions and simple line geometry. Improvement over baseline is genuine, but 'commercially polished' and 'publishable' are subjective and cannot be certified by the implementing agent's self-score.

**Fix:** Treat 90/100 as unverified self-assessment. Provide a blind visual comparison (old/new and independently chosen licensed reference), readable at phone video scale; strengthen composition, primary focal point, typography/contrast, shot variety, visual progression and decisive payoff. Do not demand Phase 04/12 animation systems yet; the 8–12s style pilots may be simple, but must visibly demonstrate pose changes and clear beats.

### P1-07B — Video mode still exposes contradictory thumbnail/layer/timeline UI

**Proof:** In `screenshots/01_initial_studio_desktop.png`, the header still presents a `YouTube Thumb...` preset while cinematic video is selected; the left panel lists four legacy graphic layers (`Subtitle`, `Accent Pill`, `Main Title`, `Background`), and the bottom timeline shows only `Scene 1: Visual Artboard & Title` even though the cinematic video project contains **five shots**. The right-side Cinematic Shot Editor manages an apparently separate shot model. This is confusing and may mean changes made through legacy layer controls do not affect rendered video. The supplied test does not check this interaction.

**Fix:** In video mode, label the active composition correctly and expose the five shots and their duration/selection on the timeline, or clearly label the current track as a placeholder and prevent editing irrelevant legacy layers. Prove actual UI actions affect both preview and exported video; defer full nonlinear editor features to Phase 10. The supplied `06_reopened_session_mutated_shot4.png` happens to capture frame 450 at a dark transition, so the screenshot itself does **not** display the mutated headline; capture a frame in the body of the shot (e.g., frame 480) as UI proof.

### P2-08 — Reports use inaccessible local Windows file URLs and omit changed source files

**Proof:** `PHASE_HANDOFF.md` references `file:///D:/SynergyRepo/...` paths that do not open on another computer. ZIP includes evidence and `scripts/*.js` but **not** the modified actual application source files `reference-shot.js`, `creative-director.js`, `render-adapter.js`, `studio-app.js`, HTML or a complete `git diff`. As the branch is intentionally unpushed, the reviewer cannot inspect the implementation from GitHub. This is a reviewability blocker, not proof the source was not changed.

**Fix:** Repackage evidence with portable relative links and an `OWNER_REVIEW_SOURCE_PATCH.diff` generated from the base commit, plus the changed source files (or a read-only source snapshot) and `git status --porcelain`, `git log --oneline -3`, `git diff --check` outputs. No push needed.

### P2-09 — Unverified product-performance/marketing claims in the creative output

**Proof:** The project includes copy such as 'Sub-42ms parsing latency', 'Instant WebAssembly processing' and zero-upload guarantees, but supplied Phase 01 material does not contain benchmark data that verifies each specific figure and execution path. Avoid using fabricated or generalized stats as factual ad copy.

**Fix:** Link each quantified claim to a reproducible benchmark and clear test conditions, or replace it with carefully qualified defensible copy. Verify statements describe the specific Creative Studio feature, not an unrelated converter tool.

## Owner gate and QA acceptance

**Do not authorize push.** This Phase 01 submission is promising but needs correction. At minimum, P0-01 to P0-03 and P1-05/06 must have real browser-UI proof; P1-04 must be honestly labeled silent or receive actual audio; visual quality must be re-reviewed by owner. No next phase until the owner explicitly says to proceed.

Return all regenerated exports and portable evidence, the original vs corrected archive consistency check, source patch, and clear unresolved items. **Do not push, open PR, merge, deploy or start Phase 02.**

## Independent audit method

- Extracted all 102 ZIP entries safely; inspected stills, screenshot proofs, markdown reports, Playwright test script and `.acstudio` project payload.
- `ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames` for 4 videos.
- `ffmpeg -af volumedetect` and `-af silencedetect=noise=-55dB:d=0.3` for every video.
- Generated new storyboard time sampling (not relying solely on AGY's contact sheets) for 24s SaaS and both 9s pilots; reviewed 0.25–23.5s frame samples.
- This audit did not execute code on AGY's local Windows branch because the ZIP did not include its executable application source or full repository. Therefore localhost functionality beyond the visible artifacts and script execution design is not independently certified.
