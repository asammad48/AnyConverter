# AnyConverter Visual Studio — Browser-Only Short-Form Production Architecture (V2)

**This is not a server implementation request and not a one-shot command.** Use the master roadmap and individual phase specs; do not implement past the current owner-authorized phase.

## The user-supplied short-form stack vs browser runtime

| Desktop source technique | Browser implementation | What is NOT included | Phase(s) |
|---|---|---|---|
| Blender bpy: 8 parrot poses, Cycles toon shader, Freestyle outlines | User/developer-created transparent PNG pose atlases; optional uploaded glTF/GLB and Three.js toon renderer | No full Blender/Cycles Python runtime on the site | 01,04,07,12 |
| Remotion React sequenced compositions | Validated VisualRecipe + shared scene evaluator + WebCodecs/muxer | No Remotion production package/licence purchase without owner approval | 02–06,09–10,16 |
| Kokoro 82M ONNX, `af_heart` | Optional opt-in `kokoro-js` WebGPU/WASM TTS after compatibility check | Not an instant 0MB voice or all-languages guarantee | 11,13 |
| Python NumPy/SciPy sound synthesis/mixing | Web Audio API / OfflineAudioContext, DSP, gain envelopes, ducking, limiter | No Python runtime in frontend or 3rd-party audio backend | 11,15 |
| TypeScript/React scripted animations | Client-bundled components and strictly validated JSON scene/shot/timeline recipe | No arbitrary user-supplied executable code | 03–10 |
| `timeline.json` captions, props and audio cues | Versioned JSON with shot events, captions, pose/camera actions and sample-time audio cues | No hardcoded test timeline as proof of an editor workflow | 09–11 |
| Remotion CLI renders frames + FFmpeg H.264 | Existing browser deterministic frame generation with WebCodecs and muxer (codec probed) | Browser FFmpeg CLI not needed or assumed | 01,10,16 |

## Original 30-second comedy story specification (not a copyrighted parrot or viral Short)

Title: **The Parrot Who Tried to Run a Meeting**. Original comedic scenario; replace assets with licensed/original material. Draft shot chart (guidance, not an immutable storyboard):

| Time | What viewer sees | Action | Text/voice | Audio cue | What makes it useful |
|---|---|---|---|---|---|
| 0–3s | Tight parrot closeup, unexpected prop enters frame | Snap look at a large microphone | “I am the new manager.” | Pop then silence | Immediate hook |
| 3–7s | Clean two-level office layout with parrot and notes | Wing points to giant to-do list | “First: no more meetings.” | Paper flick | Establish rule |
| 7–12s | Reaction composition with parrot and ringing calendar | Blink → shock pose and punch-in | “Wait… a meeting about meetings?” | Chime interruption | Creates contradiction |
| 12–18s | Two-shot reaction and calendar cards | Pose atlas action switches with prop movement | “That makes no sense.” | Short chirp, comedic pause | Emotional beat |
| 18–24s | Oversized red calendar occupies the frame | Camera whip to calendar labeled MEETING | Large emphatic punchline caption | Staccato SFX plus ducked music | Visual escalation |
| 24–30s | Satisfying payoff: parrot closes laptop | Final look to camera and deliberate held frame | “Meeting canceled.” | Click, short musical resolution | Closure |

**Prohibited proof shortcut:** a video that shows a parrot merely switching poses under a centered title is NOT sufficient. The user needs a sequence with multiple purposeful shots, character acting, readable captions, camera and prop choreography, and sound.

## Original 30-second SVG suspense specification

Title: **The Last Light in the Corridor**. SVG figures are authored as native editable vector assets.

| Time | Shot | Sound | Editorial purpose |
|---|---|---|---|
| 0–4s | Empty high-contrast corridor, distant figure faintly visible | Room tone/hum | Establish a visual question |
| 4–9s | Close-up of switch and hand; light blinks | Switch click, silence | First clear action |
| 9–15s | Wide silhouette shot, shadow moves against fixed actor | Low restrained pulse | Tension via contradiction |
| 15–21s | Split focus: foreground figure, far wall negative space | No music for 1.5s | Hold anticipation |
| 21–26s | Deliberate 2–3 frame reveal then cut to darkness | Short impact, controlled peak | Payoff without cheap constant shaking |
| 26–30s | Quiet aftermath, simple closing line | Reduced ambience | Release and closure |

**Do not misrepresent these as user-supplied copyrighted reference footage.** They are fresh original design briefs to validate the system.

## Safe starter schema — conceptual only, formal JSON Schema in Phase 09

```json
{
  "schemaVersion": "2.0.0",
  "canvas": {"width": 1080, "height": 1920, "fpsNumerator": 30, "fpsDenominator": 1},
  "assets": [{"id": "parrot-pose-atlas", "type": "image/png", "sha256": "<real sha256>", "license": "source-recorded"}],
  "characters": [{"id": "parrot-1", "poseAtlasAssetId": "parrot-pose-atlas", "pivot": [0.5, 0.85]}],
  "scenes": [{
    "id": "meeting-intro", "durationFrames": 90, "purpose": "hook",
    "shots": [{"id": "closeup", "startFrame": 0, "durationFrames": 90, "layout": "character-closeup"}],
    "characterEvents": [{"characterId": "parrot-1", "frame": 6, "action": "look-right"}],
    "cameraKeys": [{"frame": 0, "zoom": 1.0}, {"frame": 15, "zoom": 1.14}],
    "captionCues": [{"startFrame": 12, "endFrame": 78, "text": "I am the new manager."}],
    "soundEvents": [{"startSample": 24000, "assetId": "original-pop-sfx", "gain": 0.55}]
  }]
}
```

The example intentionally contains a **placeholder hash** and SFX reference and is NOT a ready-to-render project. AGY must generate real assets, genuine hashes and an evidence-backed schema; no user-facing demo may contain placeholders.

## Asset rights, browser budget and privacy

1. User-uploaded 3D models, fonts and music must have lawful use rights; attribution/redistribution rules vary. Bundle evidence that is legally distributable.
2. A `GLB` with texture + skeleton can be entirely user-supplied and manipulated in browser; Blender-generated pose sprites are a robust low-memory alternative.
3. TTS weight downloads can be large. Capture actual byte size at runtime and display ahead of download. No auto prefetch on homepage, service worker or open-studio event.
4. No arbitrary JS execution through imported recipe/asset. Validate SVG scriptlessness; use isolated decoding; disallow remote URLs until opt-in.
5. Browser memory is finite; presets need tiered texture sizes, lazy model load/unload, cancel/resume handling and cleanup.
6. Real browser inference may not run in restrictive browsers; document FALLBACK rather than claiming coverage.
7. Never assert Remotion is license-free for a public online editor. Official docs have specific render-based company licensing and browser render telemetry.

## Required per-phase report/checklist fields

- Phase # and previously approved baseline commit.
- Changed files and local (non-remote) commit hash.
- Real browser user workflow steps and screenshots.
- Actual export filenames and contact sheet of scenes.
- Evidence of semantic preview/export parity and clean audio.
- Source asset provenance + licenses and downloaded bytes.
- High/medium/low defects found; each with code diff and retest proof.
- Remaining hard constraints and exact honest fallback.
- Creative scorecard with concrete human-observable reasons.
- **`AWAITING OWNER VISUAL APPROVAL; NOT PUSHED; NOT MERGED; NOT DEPLOYED; NEXT PHASE NOT STARTED`**.

## Primary sources for architecture and release choices

- [Remotion client-side renderer & telemetry](https://www.remotion.dev/docs/client-side-rendering/) — Client-side WebCodecs rendering exists; every client render sends a telemetry event. Verify before adding it.
- [Remotion licensing](https://www.remotion.dev/docs/license/pricing) — Automated video tools can require a commercial license. Do not assume free commercial embedding.
- [Kokoro browser implementation](https://github.com/hexgrad/kokoro/blob/main/kokoro.js/README.md) — Kokoro JS can run locally on WebGPU or WASM; availability/performance varies.
- [WebCodecs MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) — Low-level browser frame encoding/decoding; it is not a composition or art-direction engine.
- [WebAudio offline render](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) — Browser-side deterministic offline mixing independent from realtime sound hardware.
- [Three.js glTF loader](https://threejs.org/docs/pages/GLTFLoader.html) — Browser import of glTF models, paired with animation and toon/camera logic.
- [Blender glTF export manual](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html) — Blender can prepare portable glTF animations at asset-authoring time.
- [Three.js toon outlining](https://threejs.org/docs/pages/ToonOutlinePassNode.html) — WebGL toon outline effects require tested pipelines and performance budgets.
