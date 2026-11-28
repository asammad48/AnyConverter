# Phase 04 revised independent gate

**PHASE 04: REVISED — AWAITING OWNER VISUAL APPROVAL — PHASE 05 NOT STARTED.**

The repair is isolated on local branch `feat/create-studio-phase-04-repair` based on the verified published commit `c8e6073d86de4bb912e3fceb1afc25dee89aebeb`. Repairs remain local. No PR, merge or deployment was performed.

| Source-audit item | Revised result and direct evidence |
| --- | --- |
| Sequential actions | Idle → talk → recoil → shocked → point → exit in one editable shot. Separate clips support add, replace and remove. A conflicting overlap is rejected without changing existing clips. Chromium, Firefox and WebKit author the sequence, test action boundaries and random seeks, save, reopen, and export. [Video](revised/sequential-actions-chromium.webm) · [Project](revised/sequential-actions-chromium.acstudio) · [Decoded pose sheet](revised/SEQUENTIAL_ACTIONS_CONTACT_SHEET.png). Blink and excited also appear in the Chromium project’s second shot. |
| Target and property compatibility | Layout-aware editor controls, localized availability, rasterized headline and caption ink, numeric Statistic and entry values, envelope opening, and graphic color. [Matrix](TARGET_PROPERTY_COMPATIBILITY.md) · [Property tests](revised/repair-browser-chromium-properties.json) |
| Shared group transform | Five independently positioned children under a nested group share a common pivot. Three centers verify the same rotation translation and uniform scale as their authored root. The UI rejects a cycle and the evaluator drops invalid ancestry in imported data. [Group video](revised/field-station-group.webm) · [Project](revised/field-station-group.acstudio) · [Decoded group sheet](revised/SHARED_GROUP_CONTACT_SHEET.png) · [Geometry checks](revised/repair-browser-chromium-group.json) |
| Motion bounds | Canvas matrices transform the layer envelopes and articulated pose bounds. Chromium exercised translation, rotation, spring scale, path extremes and deliberate clipping across all three formats. [Bounds and geometry](revised/repair-browser-chromium-group.json) · [Aspect-ratio previews](revised/LOCALES_AND_FORMATS.png) |
| Ordinary composition | Field station file handoff was authored through the standard SaaS shot controls without loading Motion showreel. CSV received fade-rise and underline, then numeric and color curves. [Archive](revised/field-station-group.acstudio) |
| Acting and pacing | The revised showreel uses talk, shock and point. The envelope stays open once the keyhole is visible, the caption follows the reveal and the impact lands with the cut at frame 498. [Before and after](revised/AUDIT_BEFORE_AFTER.png) · [Revised storyboard](revised/SHOT_STORYBOARD.png) · [Independent review](INDEPENDENT_REVISED_VISUAL_REVIEW.md) |
| Browser regression | Chromium, Firefox and WebKit completed native authoring and archive recovery and produced VP8/Opus. A separate Firefox profile verified the video-only MediaRecorder fallback. [Browser compatibility](BROWSER_COMPATIBILITY.md) |
| Dedicated tests | Real controls, raw Canvas RGBA, real downloads, negative overlap, retained tracks, nested transforms, keyframe timing, reduced motion and recovery. The Phase 10 marker requirement is recorded. [Browser tests](scripts/repair-browser.js) · [Preset matrix run](revised/repair-browser-chromium-presets.json) · [Unit results](revised/test_phase04_motion_and_pose.txt) · [Future work register](TECHNICAL_DEBT_AND_INTEGRATION.md) |

## Showreel and deterministic export

- [Revised showreel](revised/showreel.webm) · [Editable archive](revised/showreel.acstudio) · [Repeat export](revised/showreel-repeat-reduced-preview.webm)
- [Fresh-session edit and re-export](revised/reopened-edited.webm) · [Edited archive](revised/reopened-edited.acstudio) · [Before and after the edit](revised/REOPEN_EDIT.png)
- [Preview and decoded comparison](revised/parity.json) · [600-frame and audio signatures](revised/media-metadata.json) · [Extra scene metadata and cue levels](revised/repair-media.json) · [Browser trace](revised/browser-trace.zip)

The repeat showreel exports match across all 600 decoded frames and decoded PCM, including an export made with reduced-motion preview enabled. The reopened edit changed 38 decoded frames. Encoded timestamps are verified from the files. The independent revision review scored **87/100**. Audio was assessed from the decoded waveform rather than by ear, and physical-device playback remains unverified.

[Implementation and action rules](IMPLEMENTATION_SUMMARY.md) · [Defect register](DEFECT_REGISTER.md) · [Source and evidence handoff](PHASE_HANDOFF.md)
