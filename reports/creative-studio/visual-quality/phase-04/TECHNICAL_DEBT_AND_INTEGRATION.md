# Technical debt and future-phase integration

| Scope | Requirement or limitation |
| --- | --- |
| Phase 10 mandatory | Add direct keyframe markers to the main timeline. Markers must support pointer drag, keyboard edit, snapping, selection and stable identity through archive recovery. Phase 04 edits an individual key with its accessible time slider. |
| Phase 10 | Show named-action intervals and overlap feedback directly on the timeline. Phase 04 selects, replaces and removes actions in the shot inspector. |
| Group editing | Two authored group nodes share a stable safe-box pivot and can nest. User-positionable pivots and arbitrary group creation are outside the current inspector. |
| Bounds | Boundary diagnostics use transformed draw envelopes. The text envelope is its allocated rectangle, not the exact raster outline of each glyph. Explicitly authorized clips remain clipped by Canvas. |
| Browser export | WebCodecs repeat-frame guarantees apply to the deterministic path. MediaRecorder is realtime and may vary in frame count and encoder timing. The exercised Firefox fallback produces video without the authored soundtrack. Keep the audio-bearing WebCodecs export path as the verified delivery path. |
| Physical coverage | Automated desktop browser runs do not establish behavior on physical iOS/Android hardware. |
