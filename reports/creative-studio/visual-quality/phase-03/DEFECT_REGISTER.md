# Phase 03 audit defect register

| Finding | Correction or disposition |
| --- | --- |
| Busy caption legibility had no production proof | The comedy now demonstrates panel, outline and shadow on the real patterned backdrop. Measured worst-case settled contrast is 8.27:1 on pattern and 13.94:1 on panel. [Phone comparison](audit/PHONE_CAPTIONS.png) · [Contrast and bounds](audit/typography-regression.json) |
| Portrait captions were small and detached from subjects | The opted-in portrait stack is tighter with brighter and larger captions. Platform footer clearance remains and some final cards still look sparse. [Storyboard](audit/SHOT_STORYBOARD.png) |
| Product diagnostic microcopy was small | Five larger file-type badges now illustrate the incoming sources. Earlier projects retain the prior renderer. [Before and after](audit/BEFORE_AFTER.png) |
| Some motion demonstrated settings without serving timing | Revised comedy delays the reaction and suspense reduces opening movement and delays the final whisper. Several long holds remain. [Comedy](audit/fun.webm) · [Suspense](audit/suspense.webm) |
| No dedicated typography suite or 4K proof | Browser raster tests enumerate the 12 effects and exact boundaries; the real editor has 4K PNG output and extreme wrapping diagnostics. [Suite results](audit/typography-regression.json) · [4K extreme](audit/extreme-4k.png) |
| Callback deficit previously looked like missing encoded frames | Quality counters and per-frame callbacks were recorded together. Repeat found a pre-subscription presentation and a few playback drops under the revised run, with correct decoded counts and timestamps. [Playback QA](FINAL_INDEPENDENT_PHASE_03_GATE.md#playback-discrepancy) |
| Known VP8 frame-zero tint | Small genuine first-keyframe quantization remains in portrait. FFmpeg comparisons use full-range BT.709. [Portrait parity](audit/parity-portrait.png) |
| Stale publication status and large trace | Published baseline and separate authorization are recorded. The prior large trace remains and the revised compact trace is about 819 KiB. [Handoff](PHASE_HANDOFF.md) · [Trace](audit/browser-trace.zip) |

Imported noisy footage, physical devices, broad bidirectional and complex-script coverage, and automatic voice alignment remain outside verified scope. CJK and joined emoji specimens are included in the dedicated suite and the real 4K fixture. The phone OCR probe measures recognition after downsampling, and the independent review separately notes the visual limitations. [Final gate](FINAL_INDEPENDENT_PHASE_03_GATE.md)
