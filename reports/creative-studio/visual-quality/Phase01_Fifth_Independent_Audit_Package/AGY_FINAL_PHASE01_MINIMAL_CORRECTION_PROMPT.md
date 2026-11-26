# AGY — Phase 01 final evidence-only repair (no push)

**Read** `PHASE01_FIFTH_INDEPENDENT_AUDIT.md`. Your previous fourth-cycle fixes are largely verified: exact video hashes, valid decoded frames, real audible audio, seven correct state-matched SSIM/PSNR values, and corrected `.acstudio` persistence. **DO NOT rebuild, replace, or re-export the four master videos just to address these two evidence defects.**

## Mandatory item A — Make the old/new comparison labels actually visible

The output `OLD_VS_NEW_COMPARISON.png` now contains the correct old and new frames, and the source hashes are valid, but the red and blue top banners are **blank**. Your `drawtext` script's successful exit does not prove that labels are visibly rendered.

- Fix `scripts/generate_old_vs_new_comparison.js` to burn **short, readable** source and timestamp labels into both bars. Use an approach robust to path punctuation and platform font availability (e.g. properly escaped `textfile=` plus explicit font, or a separately generated text overlay).
- Keep the old source at 30s and new source at 12s, preserve original videos unmodified, regenerate the 1280×360 PNG and its duplicate, and update the manifest composite hash.
- Include an enlarged upper-bar screenshot showing both labels. Add an automated image-content check that would fail on solid-colored blank banners. Manually inspect the final composite.

## Mandatory item B — Negative test prerequisite vs expected rejection separation

In `scripts/test_negative_gates.js`, Tests 1–4 catch any `AssertionError` from both fixture setup and actual production gate; missing required files can therefore wrongly count as a passed negative test.

- Move all fixture existence/format/precondition assertions **outside** expected-rejection `try/catch` or use narrowly scoped `assert.throws` around **only** the target gate function.
- Match expected failure **by reason/message** (mismatched parity, silent audio, frame mismatch/truncation, invalid archive), not simply error class.
- Add missing fixture meta-tests: remove/rename a frame or fixture in a disposable copy and prove the suite exits nonzero, without permanently deleting real artifacts.
- Ensure test failures always produce nonzero exit and no stale 7/7 success report.
- Keep existing genuine media fault-injection tests; no fake numeric fallbacks or test-only success conditions.

## Mandatory item C — Accuracy and portability

- Correct HTML's unsupported `Same Frame 9000 Times` claim; the old benchmark has four acts, although the animation is repetitive.
- Clearly document that rerunning the old/new generator requires the old original video at the documented path and that the browser runner requires the full website source and dependencies. Include the old video in a reviewer bundle or provide exact owner-supplied artifact provenance rather than an undisclosed dependency.
- Attach updated `phase01_run_results.json`, log of positive and negative suites, concise source diff, corrected comparison PNG, updated manifest and a small approval bundle.

## STOP RULE

Do **not** push commits, open a PR, merge, deploy, or start Phase 02. Local commits only. No further broad visual changes are requested for Phase 01. Submit the exact two defect closures with visual proof; stop and await the owner's explicit Phase 01 approval and separate push authorization.

**End with:** `PHASE 01 — EVIDENCE CORRECTIONS SUBMITTED — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED — PHASE 02 NOT STARTED.`
