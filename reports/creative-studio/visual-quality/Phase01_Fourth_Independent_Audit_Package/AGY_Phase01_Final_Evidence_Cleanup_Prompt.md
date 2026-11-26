# AGY — PHASE 01 FINAL EVIDENCE CLEANUP (NO PUSH)

Your corrected Phase 01 package was independently inspected. The four video exports, audio tracks, seven preview/export image comparisons, saved project headline, and improved noir brightness now pass independent artifact-level checks. **Do not rework the successfully repaired encoder, audio or parity engine.**

Read `Phase01_Fourth_Independent_Audit.md` fully and implement only these focused Phase 01 corrections.

## 1) Fix the mislabeled visual comparison
- `OLD_VS_NEW_COMPARISON.png` currently juxtaposes a SaaS-style frame and the **current noir pilot** at ~50%, rather than an old engineering-baseline frame and a new SaaS frame.
- Regenerate it directly from the old engineering demonstration file and Phase 01 SaaS master, both actual video frames and clearly labeled with source filename/time.
- Use matching images in the accompanying HTML; prevent stale or unrelated frames with a source/image manifest and deterministic generation script.
- Include both the new PNG and precise source artifact hashes.

## 2) Complete genuine negative artifact tests
- Remove fallback fake numbers/errors from Tests 1 and 3. Missing reference assets must fail tests.
- Produce a *real muted/silent media file* and feed it through the actual FFmpeg-backed `runFFmpegVolumeDetect` + `verifyAudioIntegrity`, expecting failure.
- Produce a *real truncated/corrupted media copy*, pass it to the real `verifyVideoFrameCount`, and prove it rejects the file.
- Spawn the actual acceptance runner with a controlled failing gate and assert a nonzero exit; retain safe reusable fixtures and no production mutation.
- Label parser-only cases as **unit tests**, not real media injections.
- Ensure all negative tests fail (exit nonzero) when the intentionally bad media is **not detected**, and fail if fixtures are missing.

## 3) Make verification more reproducible
- Add `page.on('pageerror')` capture alongside console errors; fail the positive runner on uncaught page exceptions.
- Populate `phase01_run_results.json.workflows` with real button clicks/downloads/chooser/reopen/exports and evidence filenames (avoid blank `{}`).
- Supply platform-neutral setup/run instructions; do not present the ZIP as a full runnable repo.
- Avoid baseless quantitative marketing claims.

## 4) Quality boundary and release governance
- Preserve the updated clean audience dialogue, visible noir lighting and project-editing UI; don't regress those.
- Do NOT demand full 3D character rigs or Kokoro TTS in Phase 01; those belong to later phases.
- Submit complete new videos/contact sheets only if the underlying visual content changes; otherwise keep verified masters with hash manifest.
- Separate technical PASS from the owner's unpublished visual-quality approval.
- Do not give yourself a numeric quality score or say 'approved for production'.

**Never push, merge, open a PR, deploy, or start Phase 02.** Work locally on `feat/creative-studio-visual-quality`. Finish corrections, rerun tests, produce a concise artifact-based report and **stop for owner approval**.

End with:
`PHASE 01 — FINAL EVIDENCE CLEANUP COMPLETE — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED — PHASE 02 NOT STARTED.`
