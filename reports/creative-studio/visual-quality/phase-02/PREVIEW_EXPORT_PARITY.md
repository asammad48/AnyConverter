# Preview and export parity

The interactive stage, clean PNG export, and WebCodecs adapter all call the same frame evaluator. The layout version, project geometry and shot-local frame determine the output. Editor guides are drawn after evaluation only on the preview canvas.

| Check | Comparison | Result |
|---|---|---|
| Clean canvas vs public PNG | 1080 × 1920, frame 0, after all three block drags and the subject depth edit | PNG bytes identical |
| Guides on vs off | Same preset, text, pose, geometry and frame | Export PNG bytes identical |
| Fresh archive reopen | Same frame and canvas dimensions after opening the downloaded .acstudio | PNG bytes identical |
| Phase 01 Original | Frame 73 from exact baseline source vs current Original layout | Preview PNG bytes identical |
| Clean preview vs encoded video | Portrait WebM frame 0 at 0.000 seconds, decoded with the stream's full-range BT.709 metadata | SSIM 0.991179 and PSNR 37.911 dB |
| Storyboard frames | 1, 3, 5, 7 seconds, plus product payoff at 10.5 seconds | Shot structure, legible captions and clean boundaries inspected on decoded material |

VP8 chroma subsampling and quantization cause slight color and edge differences. Comparison uses the same resolution and matched frame, with explicit full-range BT.709 interpretation rather than the FFmpeg default limited-range RGB conversion. A same-browser canvas/PNG comparison also avoids font differences. Full-video decoding verified 270 or 375 video frames without decoder errors. [Metrics](evidence/parity-metrics.txt) · [Preview](evidence/portrait-preview-full.png) · [Decoded frame](evidence/frames/portrait-export-0.png) · [Storyboard](SHOT_STORYBOARD.png) · [Playback results](evidence/playback-results.json)
