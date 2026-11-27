# Preview and decoded export parity

| Sample | Cue frames | Preview vs decoded frame sheets |
| --- | --- | --- |
| 1920 × 1080 product | 0, 15, 30 | [Wide](evidence/parity-wide.png) |
| 1080 × 1920 product | 0, 15, 30 | [Portrait](evidence/parity-portrait.png) |
| 1080 × 1080 product | 0, 15, 30 | [Square](evidence/parity-square.png) |
| 1080 × 1920 comedy caption | 8, 23, 38 | [Caption](evidence/parity-caption.png) |

The three frames in each row are at 0%, 50% and 100% of the cue’s reveal window. The product hook starts at frame 0 and lasts 30 frames. The comedy caption starts at frame 8 and lasts 30 frames. Preview PNGs came from the production canvas after keyboard scrubbing. Decoded PNGs came from the matching full browser export. Text, wrapping, placement and reveal stage agree within lossy video variation. SSIM ranged from 0.991902 to 0.998833 across the 12 comparisons. [Per-frame SSIM and timestamps](evidence/parity.json)

FFmpeg’s default VP8 decode reported limited-range BT.601 on the decoded frame even though the WebM container declares full-range BT.709. That produced an artificially dark PNG and a 0.934 initial SSIM result. The evidence decode honors the container colour metadata. A separately sampled Chromium video confirmed the corrected interpretation. Small first-frame color quantization remains in the real VP8 output. The production encoder settings were preserved.

Every export was fully decoded and compared to the 30 fps frame clock. The first presentation timestamp is 0. The last is 14.966 s on 450-frame films and 15.966 s on 480-frame films. WebM timestamp rounding accounts for the 0.667 ms maximum error relative to each 30 fps frame index. All carry stereo 48 kHz Opus. [Full stream and audio metadata](evidence/media-metadata.json) · [Native Chromium playback](evidence/browser-playback.json)
