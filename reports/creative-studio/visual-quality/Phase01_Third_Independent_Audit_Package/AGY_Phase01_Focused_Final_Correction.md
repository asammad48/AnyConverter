# AGY — Phase 01 third review: focused final correction, no push

Read `Phase01_Third_Independent_Reaudit.md` and view `Phase01_Current_Export_Visual_Samples.jpg` before making changes.

Your newest export files are real: the independent review re-decoded 720/720 SaaS frames, 270/270 each of the pilots, audio loudness, and seven PSNR/SSIM comparisons. These technical defects are **not** to be reworked again. The owner has **not** approved creative quality.

## Current-phase fixes (execute now, do not redesign the entire 16-phase roadmap)

1. **Remove authoring instructions from production video.** Inspect every text layer, `ReferenceShot`, `CreativeDirector` scene recipe, parrot dialogue/caption, and suspense overlay. “Wing gesture towards the agenda,” “Negative space holds anticipation,” “Creeping silhouette” as a diagnostic caption, and similar stage directions must not appear unless deliberately written as audience-facing story text. Separate internal `directorNotes` from approved `onScreenText`, captions, labels and dialogue. Add a regression test that fails if director-only strings appear in rendered production frames or on-screen-text collections. The diagnostics toggle may show these notes, never default production export.

2. **Make the nine-second noir pilot genuinely readable and suspenseful.** Preserve atmosphere but give the silhouette/room legible edge lighting, meaningful composition, clear narrative escalation and a payoff. Audit sampled frame luminance and contrast, including at 375px mobile display. Provide side-by-side old/new screenshot and actual exported media. Do not equate pitch-black frames with cinematography.

3. **Raise the creative bar without phase creep.** Revisit the 24s SaaS hook and visual motifs so the story visibly changes instead of relying on repetitive text/card layouts; make the parrot's physical action drive the joke. Preserve scene editor compatibility and editing state, without prematurely implementing the full Phase 04/11/12 engines. Obtain **actual owner visual judgment**, not AGY's self-awarded 4.58/5.0 score.

4. **Real negative testing.** Refactor parity/audio/archive checks into shared functions. Replace constant-only test cases with real broken-input fault-injection tests: (a) mismatched preview/export state, (b) silenced audio/video, (c) wrong frame counts or truncated video, (d) corrupted archive, (e) impossible SSIM parser value. Invoke the real production verification functions and prove a nonzero runner/process exit code for each. Negative suite must exercise the same logic as the positive suite.

5. **Harden positive acceptance.** Assert fresh browser context default headline before opening archive; assert zero unexpected page errors; include `ffprobe -count_frames` exact frame-count checks for all exported videos; assert both source and final filename/duration; ensure no missing frames, and verify preview/export across scene boundaries, not only interiors. Preserve the verified corrected SSIM and color pipeline.

6. **Make test runner portable.** Remove mandatory `C:\Users\...\chrome.exe` executable path; use installed Playwright Chromium by default, allow optional override environment variable. Update README and `PHASE_HANDOFF.md` with the actual runner name and prerequisites. Ensure all reports link to relative, present paths.

7. **Submit evidence:** Updated four video masters, corrected `.acstudio`, five-shot storyboard, the two Shorts' contact sheets, screenshots at desktop/tablet/mobile, console output, independent video/audio/frame verification, positive + fault-injection tests, editable source patch (UTF-8), defect register, and a concise before/after narrative. No mocked exports, synthetic pass claims or hardcoded result metrics.

## Enforced phase governance

- Stay **only** on `feat/creative-studio-visual-quality` in the local repository.
- Local commits allowed. **DO NOT PUSH** without the owner's explicit Phase 01 finalization and separate permission to push.
- No remote PR, no merge, no Cloudflare deploy, no Phase 02 or later-scope feature work.
- If one test fails or output is still weak, fix it and rerun Phase 01 in the same correction cycle; report unresolved limitations honestly.
- After submission, **STOP and request owner visual approval**.

Required final line: `PHASE 01 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED — PHASE 02 NOT STARTED.`
