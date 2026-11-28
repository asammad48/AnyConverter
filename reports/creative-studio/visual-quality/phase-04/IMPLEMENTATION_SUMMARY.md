# Phase 04 implementation

Phase 04 uses the existing CreativeDirector frame entry point for the canvas and WebCodecs exports. The motion graph is an opt-in, versioned shot property under `customData.motion`. A shot without that property retains its existing rendering path. The shot-local clock subtracts the shot start, layer offset and stagger delay. Seeded shake uses the absolute project frame. Track keys hold typed numeric, color or pose values. Equal-frame keys resolve to the last key, and a later curve for the same property takes precedence once that curve starts.

The evaluator includes linear, hold, exponential, cubic Bézier, and a bounded analytical spring. It resolves parent transforms, position, rotation, independent scale, opacity, reveal clipping, mask offsets, underline progress, color, numbers, orbit, paths and puppet properties. Layer clips remain inside the solved layout blocks. The authoring interface supports the ten presets, five timing patterns, typed key values, draggable times, curve handles, delay, common grouping and path control points. Reduced preview is initialized from the user's system preference and can be toggled in the inspector. The diagnostic curve and stage label are editor DOM surfaces.

The parrot uses a split head/body PNG atlas with eight named actions. Pose keys use held interpolation. The rig anchors the feet to the perch while the neck, eyes and wing can move. The existing archive packager embeds the PNG by content hash. The preview loads the embedded bytes on a fresh open. WebCodecs waits for the atlas to decode. The showreel has four deterministic audio clips and five caption blocks in the project, exposed in their own timeline rows.

## Integration decisions

- `CreativeDirector.renderFrame` remains the canonical composition entry. The motion-enabled composition uses the existing Phase 02 layout solver and Phase 03 type renderer.
- The legacy `AnimationEngine` and general `TimelineEditor` continue to serve their existing callers. Shot motion uses keyed, versioned tracks through the cinematic timeline.
- The browser-native rig uses the bundled original atlas. A general Blender or arbitrary media import workflow belongs to the later media scope. The audio uses existing native synthesis with a new non-vocal doorway cue.
- Headless Chromium exercised the new authoring and export path. Firefox and WebKit binaries were unavailable in the environment. Detailed coverage and external resource errors are recorded in the browser results.

[Production journey](LIVE_LOCALHOST_JOURNEY.md) · [Parity](PREVIEW_EXPORT_PARITY.md) · [V2 assets and pose evidence](V2_SHORTS_INTEGRATION_EVIDENCE.md) · [Exact changed paths](PHASE_HANDOFF.md)

## Revision after the published source audit

Named actions are stored as independent shot-local clips. Add and Replace reject overlap atomically. Imported overlaps resolve to the latest start and then the last stored clip for an equal start. Replace affects only the selected clip. Remove leaves existing curves and other action clips untouched. The active action overrides its pose channel and layers relative acting motion on top of authored transform curves. The most recent clip carries its terminal state to the next action. A manually authored pose key after the clip resumes control until the next action. The final exit holds its endpoint. Existing projects that store raw pose tracks continue to use them.

Groups share the solved shot safe-box pivot. A group is composed before the child transform, and Canvas uses the same canonical transform in preview and export. A cyclic imported chain falls back to the child transform. The inspector prevents creation of a cycle through its two group nodes. Hero rows use fixed spacing when grouped.

The renderer derives bounds from the transformed draw envelope, with alpha-derived pose rectangles and the neck/perch transforms for the parrot. Explicit entrance clipping is labeled separately. Captions retain their layout clip. The inspector disables unsupported properties and explains them in EN, ES and DA. Text ink, numeric Statistic and entry values, graphics colors and envelope opening are drawn by the production renderer.

The revised 20-second reel adds a talk beat, an independently timed envelope reveal, a keyhole note, a point toward the hall and a shorter final hold. The doorway cue is placed on an integer audio sample. The mixer normalizes fractional archive offsets to preserve the rest of the mix.

[Compatibility matrix](TARGET_PROPERTY_COMPATIBILITY.md) · [Revised gate](FINAL_INDEPENDENT_PHASE_04_GATE.md) · [Future-phase register](TECHNICAL_DEBT_AND_INTEGRATION.md)
