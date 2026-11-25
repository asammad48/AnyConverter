# EXPORT FRAME ACCURACY REPORT: AnyConverter Creative Studio

**Date:** 25 November 2026  
**Environment:** Chromium 1248 on Windows x64 (Localhost Secure Context)  
**Verification Tooling:** `ffprobe-static` v3.1.0, `ffmpeg-static` v5.3.0  
**Status:** PASS — 100% Deterministic Monotonic Frame Clock Verified

---

## 1. Frame Accuracy Verification Summary

Previous exports suffered from variable-frame-rate drop issues caused by accelerated `MediaRecorder` wall-clock loops. The implementation of offline deterministic WebCodecs (`VideoEncoder` + `AudioEncoder` + `WebMMuxer`) guarantees exact integer frame output with 0 dropped frames.

| Export Duration | Requested FPS | Expected Frames | Decoded Frames (`ffprobe -count_frames`) | Dropped Frames | Elapsed Render Time | Speed Factor | Audio/Video Drift | Result |
|---|---|---|---|---|---|---|---|---|
| **2.0 seconds** | 30.0 fps | 60 | **60** | **0** | 3.70s | 0.54x | 0.00 ms | **PASS** |
| **4.0 seconds (Edited)** | 30.0 fps | 120 | **120** | **0** | 4.12s | 0.97x | 0.00 ms | **PASS** |
| **60.0 seconds** | 30.0 fps | 1,800 | **1,800** | **0** | 13.92s | 4.31x | 0.00 ms | **PASS** |
| **300.0 seconds (5 min)** | 30.0 fps | 9,000 | **9,000** | **0** | 56.47s | 5.31x | 0.00 ms | **PASS** |

---

## 2. 5-Minute (9,000 Frame) Benchmark Deep Inspection

### Stream & Container Metadata (`ffprobe`)
```json
{
  "format": {
    "format_name": "matroska,webm",
    "duration": "300.000000",
    "size": "33320722",
    "bit_rate": "888552"
  },
  "streams": [
    {
      "index": 0,
      "codec_name": "vp8",
      "codec_type": "video",
      "width": 1280,
      "height": 720,
      "r_frame_rate": "30/1",
      "avg_frame_rate": "30/1",
      "time_base": "1/1000",
      "start_time": "0.000000",
      "duration": "300.000000",
      "nb_read_frames": "9000"
    },
    {
      "index": 1,
      "codec_name": "opus",
      "codec_type": "audio",
      "sample_rate": "48000",
      "channels": 2,
      "r_frame_rate": "0/0",
      "avg_frame_rate": "0/0",
      "time_base": "1/1000",
      "start_time": "0.000000",
      "duration": "300.000000"
    }
  ]
}
```

---

## 3. Mandatory Gate A Scene Timestamp Samples

Each of the 4 acts (75 seconds each) was extracted at boundary and interior timestamps to confirm visual scene progression:

| Timestamp | Expected Act | Visual Description | Extracted Artifact Path | File Size |
|---|---|---|---|---|
| **5.0s** | Act 1 (0s–75s) | Core Engine Architecture (Dark Slate Blue) | `recovery-evidence/frames_5min/scene_act_1_5s.png` | 114,407 B |
| **74.0s** | Act 1 (End) | Scene 1 concluding frames | `recovery-evidence/frames_5min/scene_act_1_74s.png` | 109,971 B |
| **76.0s** | Act 2 (Start) | High-Performance Canvas Rendering (Purple) | `recovery-evidence/frames_5min/scene_act_2_76s.png` | 141,219 B |
| **149.0s** | Act 2 (End) | Scene 2 concluding frames | `recovery-evidence/frames_5min/scene_act_2_149s.png` | 125,152 B |
| **151.0s** | Act 3 (Start) | Audio Stems & Timeline Orchestration (Emerald Green) | `recovery-evidence/frames_5min/scene_act_3_151s.png` | 138,736 B |
| **224.0s** | Act 3 (End) | Scene 3 concluding frames | `recovery-evidence/frames_5min/scene_act_3_224s.png` | 157,384 B |
| **226.0s** | Act 4 (Start) | 9,000 Frame Stress & Memory Benchmark (Deep Indigo) | `recovery-evidence/frames_5min/scene_act_4_226s.png` | 154,596 B |
| **290.0s** | Act 4 (Interior) | Act 4 animated orb & progress bar at 96% | `recovery-evidence/frames_5min/scene_act_4_290s.png` | 156,176 B |
| **299.0s** | Act 4 (Final) | Final frame before conclusion (Frame 8970) | `recovery-evidence/frames_5min/scene_act_4_299s.png` | 133,106 B |

---

## 4. Audio Synchronization & Sample-Accurate Timeline

- **Sample Rate:** 48,000 Hz Stereo Opus.
- **Samples per Frame (30fps):** 1,600 samples per video frame.
- **Total Audio Samples:** 14,400,000 samples.
- **Audio Stream Duration:** 300.000s.
- **Video Stream Duration:** 300.000s.
- **Measured A/V Drift:** **0.00 ms**.
- **Chromium Playback at Tail:**
  - Playback at `t = 250.0s`: Verified (`currentTime` advanced, ticks > 0).
  - Playback at `t = 295.0s`: Verified (`currentTime` advanced, ticks > 0).

---

## 5. Memory Profile During 9,000 Frame Run

- **Node.js Runner Peak RSS:** 219.18 MB
- **Node.js Heap Used:** 121.14 MB
- **Browser JS Heap Peak:** 78.14 MB (Total Available: 81.05 MB)
- **Garbage Collection Behavior:** Steady-state flat curve across all 9,000 frames due to immediate `VideoFrame.close()` and `AudioData.close()` calls after encoder submission.
