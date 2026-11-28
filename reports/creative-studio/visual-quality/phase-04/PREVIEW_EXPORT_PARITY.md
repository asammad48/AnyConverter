# Preview and export parity

The browser downloaded a 20.000-second 1280×720 WebM with VP8 video and stereo Opus audio at 48 kHz. FFprobe counted `600` video packets and FFmpeg decoded `600` frames. Packet timestamps are strictly increasing from `0.000` to `19.966` seconds. The largest deviation from frame index divided by 30 is `0.000667` seconds, within the WebM millisecond time base.

The 16 comparisons use the matching decoded frame index. The decoder converts BT.709 full-range YUV to RGB as tagged by the stream before computing SSIM across RGB planes. The initial default conversion made the decoded background appear darker. At frame 7 the corrected comparison still shows a mild transient codec color/edge artifact on the reveal. Title, caption, entrance and clip geometry match visually. All other samples exceed 0.99 SSIM.

| Frame | Project seconds | RGB SSIM | Inspect |
| ---: | ---: | ---: | --- |
| 0 | 0.000000 | 0.992148 | [Preview](evidence/preview-0.png) · [Decoded](evidence/decoded-0.png) |
| 7 | 0.233333 | 0.979482 | [Preview](evidence/preview-7.png) · [Decoded](evidence/decoded-7.png) |
| 15 | 0.500000 | 0.995854 | [Preview](evidence/preview-15.png) · [Decoded](evidence/decoded-15.png) |
| 30 | 1.000000 | 0.996402 | [Preview](evidence/preview-30.png) · [Decoded](evidence/decoded-30.png) |
| 45 | 1.500000 | 0.996488 | [Preview](evidence/preview-45.png) · [Decoded](evidence/decoded-45.png) |
| 90 | 3.000000 | 0.996824 | [Preview](evidence/preview-90.png) · [Decoded](evidence/decoded-90.png) |
| 134 | 4.466667 | 0.996901 | [Preview](evidence/preview-134.png) · [Decoded](evidence/decoded-134.png) |
| 135 | 4.500000 | 0.994972 | [Preview](evidence/preview-135.png) · [Decoded](evidence/decoded-135.png) |
| 173 | 5.766667 | 0.994067 | [Preview](evidence/preview-173.png) · [Decoded](evidence/decoded-173.png) |
| 258 | 8.600000 | 0.994306 | [Preview](evidence/preview-258.png) · [Decoded](evidence/decoded-258.png) |
| 300 | 10.000000 | 0.990764 | [Preview](evidence/preview-300.png) · [Decoded](evidence/decoded-300.png) |
| 374 | 12.466667 | 0.993494 | [Preview](evidence/preview-374.png) · [Decoded](evidence/decoded-374.png) |
| 375 | 12.500000 | 0.995944 | [Preview](evidence/preview-375.png) · [Decoded](evidence/decoded-375.png) |
| 479 | 15.966667 | 0.995796 | [Preview](evidence/preview-479.png) · [Decoded](evidence/decoded-479.png) |
| 480 | 16.000000 | 0.994546 | [Preview](evidence/preview-480.png) · [Decoded](evidence/decoded-480.png) |
| 599 | 19.966667 | 0.996527 | [Preview](evidence/preview-599.png) · [Decoded](evidence/decoded-599.png) |

Both exports have identical decoded hashes for all 600 video frames and identical decoded PCM audio hashes. The repeat was exported with reduced-motion preview enabled. The decoded frame-sequence SHA-256 is `74ffc064b827878fe02f5fbac6a1d7d6d77a09260569ac51ad3830327ee8b9de`. The archive edit changed 38 decoded frames. Opus decoded to 960,648 samples per channel, including codec padding. The measured mean and peak are -20.8 dB and -7.0 dB.

Browser playback independently reached 20.000 seconds and fired 597 presentation callbacks. Chromium reported 600 total video frames and 2 dropped during that run. The encoded packet and decoded-frame counts above come from the file itself.

[Media metadata and packet times](evidence/media-metadata.json) · [Per-sample parity](evidence/parity.json) · [Browser callback log](evidence/browser-playback.json) · [First export](evidence/showreel.webm) · [Second export](evidence/showreel-repeat-reduced-preview.webm)
