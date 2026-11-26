# Phase 01 Correction Cycle — Independent Re-Audit (25 November 2026)

**Source:** User-supplied `phase-01(1).zip` (124 ZIP entries; 51,689,233 uncompressed bytes) and AGY correction report. The evaluation uses extracted files, independent FFmpeg/FFprobe measurements, actual screenshots and test-script inspection. We cannot independently operate AGY's local unpublished application from this evidence bundle; real-browser run claims are corroborated by the supplied script but not re-run here.

## Decision

**REVISIONS REQUIRED — do not finalize or push Phase 01.** The previous serious defects are largely improved, but release verification is not reliable. Continue correction work within Phase 01; do not start Phase 02, push, merge, or deploy.

## Verified improvements (not just claims)

- **New video files decode:** master 24.000s / 720 frames; parrot 9.000s / 270 frames; noir 9.000s / 270 frames; reopened-and-mutated 24.000s / 720 frames. VP8 1280×720 @30fps, audio track present. Verified by fresh `ffprobe -count_frames`.
- **New videos are not silent:** independently verified `ffmpeg volumedetect` — master mean −16.6 dB / peak −6.7 dB, parrot −21.3/−6.4 dB, noir −21.2/−12.9 dB. This proves non-silence, not musical or narrative quality. Old silent videos also remain in the ZIP and must be clearly archived/marked superseded.
- **Saved archive is corrected:** `From_Raw_Data_to_Clear_Answers_Master.acstudio` is a real ZIP with manifest and `project.json`, 5 shots, 720 frames, first headline exactly `FROM RAW DATA TO CLEAR ANSWERS`, accent `#06b6d4`; `audioClips` has metadata. No external media asset is embedded (`assets: []`), which is acceptable for purely procedural shots, but do not claim independent media-asset portability from this test.
- **Real UI control calls are present in supplied script:** `page.click('#cs-btn-export-video')` plus `page.waitForEvent('download')`; `page.click('#cs-btn-open-project')` plus `fileChooser.setFiles(archivePath)`; editor form inputs filled. This is a material improvement over the previous direct-adapter test. These are inspection-based confirmations of the test code; the script was not independently executed without the private local repo.
- **Mobile inspector drawer is visible** in screenshots and appears accessible at 375px. Direction switching script and the archive demonstrate a plausible repaired state flow.

## Unresolved defects

### P0-A — Impossible SSIM report and invalid automated PASS gate

The source report claims SSIM of **2.52, 2.46, 2.47, 2.22, 2.33**. Structural Similarity Index is in the range [−1, 1] (usually [0,1] for similar images); these values are impossible. The script `computeImageMetrics()` captures the **parenthesized decibel equivalent** from FFmpeg `All:0.439704 (2.515824)` instead of actual `All:0.439704`.

We independently re-ran FFmpeg SSIM on the five bundled 1280×720 preview/export image pairs:

| Time | Reported 'SSIM' (actually dB) | Actual SSIM All | Reported PSNR |
|---|---:|---:|---:|
| 1.5s | 2.515824 | **0.439704** | 25.99 dB |
| 6.5s | 2.458284 | **0.432231** | 25.73 dB |
| 12.0s | 2.473529 | **0.434221** | 26.03 dB |
| 17.5s | 2.217826 | **0.399909** | 19.02 dB |
| 22.0s | 2.332761 | **0.415582** | 25.93 dB |

**Fix:** Parse the actual `All:` numeric score; separately label any logarithmic `(dB)` score. Compare only matching state, frame, resolution and color interpretation. Use hard assertions on a justified parity threshold; do not mark PASS unless checks actually pass.

### P0-B — Parity test compares different project states

`run_phase01_corrections.js` first exports the original master, then **reopens the project and mutates Shot 4** to `MUTATED BENEFIT: 0 DROPPED FRAMES` and Shot 1 to `REOPENED AND MUTATED MASTER`. It then *switches to the already active cinematic-saas direction*, edits Shot 1 again, captures preview frames, and compares them to the **older original master export**. The project state is not restored to the exact original for Shot 4. At 17.5 seconds the preview literally reads `MUTATED BENEFIT: 0 DROPPED FRAMES` while the exported master reads `CLEAR ANSWERS. INSTANT SPEED.`. This is a test-design error, not a codec-quality effect.

**Fix:** Capture preview images from an immutable snapshot immediately before the SAME UI export, or reopen the exact saved master in a fresh context and export that same snapshot. Compare matching scenes/times; additionally compare *mutated preview* against *mutated export*. Record project revision/hash and shot property hashes used for both sides.

### P1-C — Significant dark-color shift between preview and export

In the Shot-1 bundled evidence, pixel (0,0) changes from preview RGB `(7,11,22)` to exported `(0,0,3)`; background pixel (400,500) changes `(12,19,34)` to `(0,2,19)`. These are visible global tonal changes beyond an explanation of 1px anti-aliasing. The actual SSIM around 0.43 is not credible as high-fidelity preview/export parity. Test a known color-patch chart through canvas → WebCodecs → muxer → ffmpeg → display and correct color-space/range/transfer metadata and handling; avoid compensating the entire canvas blindly. Distinguish expected lossy error from systematic range/gamma shifts.

### P1-D — 'Fresh isolated session' not proven

The correction runner says it clears memory using `await page.goto(...)` on the **same `page` and `context`**. This reloads JS but does not prove a new browser process or clean browser storage. The UI Open flow itself is a genuine improvement; the stated *isolated session* claim remains unsupported. Run a second **fresh Playwright browser context or separate browser process** with cleared storage. Verify project restoration through the real file chooser.

### P1-E — Tests log success but do not enforce failure

`runCorrections()` catches errors and assigns `results.fatalError = err.message` but does not rethrow or set `process.exitCode = 1`. Assertions are largely missing: `isAudible`, `saasPreserved`, `archiveHeadlineMatches`, `reopenVerification.*`, actual SSIM bounds and download frame counts are stored/logged rather than explicitly asserted. The script can end successfully even when a critical check fails. Replace print-only checks with mandatory assertions. Require nonzero exit on failure. Validate JSON report and CLI exit status independently.

### P1-F — Improved visuals still under the 'publishable' standard

The newly exported SaaS video has coherent panels but mostly dark technical cards and small fine text; the character comedy remains a simple repeated backdrop with pose switching and text balloons; the noir remains an extremely dark repeated silhouette corridor with minimal variation. These are legitimate early prototypes rather than indisputably publishable Remotion-level creative films. Existing internal 4.58/5.0 score is self-assigned, not an independent/owner score. Require user-visible side-by-side video review, meaningful scene dynamics and a modest independent design rubric; do not fabricate customer-facing benchmarks. See actual video contact sheet in this package.

### P2-G — Studio UX still has legacy/contradictory controls

Corrected desktop/mobile screenshots display `YouTube Thumb...` preset and `Front / Back (QR)` switch alongside `Cinematic Video`; the properties inspector starts with unrelated default `Text / Content: Creative Studio`, font/position fields, followed by Cinematic Shot Editor. The new shot list/timeline is better, but mode-specific inspectors are not yet clean. In cinematic mode, show video-specific controls first and hide irrelevant thumbnail/business-card controls; preserve their functionality in their proper modes. Mobile drawer should open directly on the selected shot's controls.

### P2-H — Review patch files not directly usable with standard Git tooling

`OWNER_REVIEW_SOURCE_PATCH.diff` and `PHASE01_CORRECTION_CYCLE.diff` are **UTF-16LE with BOM**, despite being described as portable Git diffs. Most Unix `git apply` workflows expect UTF-8 diff files. Converted UTF-8 review copies are included in this audit evidence ZIP. AGY must regenerate true UTF-8 patches and run `git apply --check` against the stated base state, verifying that new-file changes are represented.

### P2-I — Superseded assets mixed with corrected evidence

The ZIP includes older `V2_Pilot_Parrot_Character_Comedy.webm`, `V2_Pilot_Minimal_Noir_Suspense.webm`, and `Reopened_Modified_SaaS_Promo.webm`; those older versions remain digitally silent. New evidence uses `The_Parrot_Manager_Pilot.webm`, `The_Last_Signal_Pilot.webm`, and `Reopened_and_Mutated_Master.webm`. Label old files SUPERSEDED or separate them to prevent misleading review.

## Approval checklist for next submission

1. Correct all metric parsing and gating; actual SSIM must be in [0,1] and tests exit nonzero on any failure.
2. Compare exact matching project revisions before/after export, including mutated Shot 4. Provide frame-by-frame preview/export parity evidence with real numeric metrics, plus color patch checks.
3. Run UI open/edit/export in a genuinely isolated fresh browser context/process; validate re-export content and audio/video independently.
4. Improve visual output enough to be reviewed as a publishable first slice; do not prematurely implement the full later phases.
5. Fix mode-specific inspector priorities and remove contradictory video-mode controls.
6. Provide clean UTF-8 reproducible source patches; separate superseded artifacts, include actual tests and new evidence.
7. **No push, PR, merge, deploy or Phase 02 until owner has approved the corrected Phase 01.**

**Note:** The report deliberately distinguishes objective file-level verification from AGY's claimed execution of tests on its own localhost. The no-push claim is consistent with the named feature branch not appearing in the GitHub branch search, but absence in the remote listing alone is not proof of no other remote changes. No local Git activity was performed by this review.
