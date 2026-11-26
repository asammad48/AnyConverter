# Antigravity — Phase 01 Second Correction Gate

**The phase is NOT FINALIZED. Do not push.**

Read `Phase01_Correction_Independent_Reaudit.md` and all evidence. Fix the specific remaining defects P0-A/B, P1-C/D/E/F, P2-G/H/I in the existing **Phase 01** branch; do not start Phase 02.

**Mandatory implementation order**

1. **Fix metric parser**: Parse FFmpeg `All:<0..1>` as actual SSIM; parenthesized value is the score in dB. Add unit tests for `All:0.439704 (2.515824)`; reject SSIM >1 and missing/NaN scores. Assert meaningful bounds and fail the process on any failed gate. `process.exitCode = 1` or rethrow in the test runner; never print `PASS` merely because a check ran.
2. **Fix state-matched parity**: Export through the UI and capture previews from the same immutable project revision in the same scene state. Do NOT mutate Shot 4 and compare that preview to the original master. Compare original-preview ↔ original-export AND mutated-preview ↔ mutated-export. Include project/shot hashes, exact timestamps, frame identifiers, preview/export images, PSNR, actual SSIM, color difference, plus scene-boundary frames. Explicitly prove changed Shot 4 headline is present in the new export. Confirm preview and export text/layout/hues visually.
3. **Investigate output color shift**: Create a 16-color swatch chart and gradient, render to canvas and through WebCodecs to VP8/H.264 (when supported), independently decode, and compare expected RGB values. In the attached evidence sample dark RGB `(7,11,22)` becomes `(0,0,3)`. Find the color-range/colorspace mismatch and fix it without merely hiding the failure by lowering thresholds.
4. **Real isolated project recovery**: Close original browser; launch a fresh browser context or process with no persisted local storage, use the actual Open Project button, verify title, all five shot properties and audio configuration, make Shot 4 changes through the inspector, download export via Export Video button; verify decoded frame carries the mutation.
5. **Proper test failure behavior**: Use `assert`/Playwright expect for UI elements, downloaded files, archive properties, actual audio levels, frame counts, parity score bounds, and absence of browser errors. Save failure artifacts. Fail CI/CLI with nonzero exit status and provide logs. Test negative cases to prove your gate catches defects.
6. **Production visual quality**: Submit a revised 24s SaaS master with perceptible narrative changes, readable details at scaled playback, purposeful camera motion and a distinct visual payoff. Improve the 9s parrot's character performance and noir scene readability. Use commercially usable self-created or properly licensed assets; report licensing and privacy. Do not overstate 4.58/5 self-scored quality.
7. **Correct inspector UX in video mode**: Hide thumbnail presets, business-card Front/Back QR and unrelated legacy text controls in cinematic mode or move them into appropriate contextual tabs. Mobile inspector opens on active shot editor rather than scrolling past unrelated props. Preserve other tool modes.
8. **Evidence hygiene**: Produce UTF-8 `.diff` patches, check applicability against the correct source commit, label/remove old silent outputs from the approval bundle, and include only current source, scripts, logs, actual media and matched screenshot contact sheets.

**Required final deliverables:** Phase01_Correction_02.md, BUG_REGISTER.md, actual UI-exported master and pilots, both exact-state preview/export comparisons, swatch chart report, truly isolated UI reopen video, test runner exit logs and negative tests, portable UTF-8 patch, revised responsive screenshots, and a single clean Phase 01 ZIP. If a defect cannot be fixed, state BLOCKED with reproduction and root cause; don't call it PASSED.

**Governance:** Local commits only. **NO git push, remote PR, merge, deployment, or Phase 02.** Wait for owner review and explicit push authorization.

End exactly: **PHASE 01 — SECOND CORRECTION REVIEW REQUESTED — NOT PUSHED — NOT MERGED — NOT DEPLOYED — PHASE 02 NOT STARTED.**
