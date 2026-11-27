# Phase 17 — AI-Guided Blender Production

**Status** Planned extension. Starts only after the Phase 16 release-gate review and a separate `PHASE 17: START` from the owner. Phases 07, 09 and 12 provide asset import, validated story recipes and 3D staging.

## User workflow

1. In Creative Studio, enter a brief such as “Make a 20-second vertical reel about a parrot trying to run a meeting.” Choose a supported scene template, an original or licensed character rig, and any approved props.
2. Generate a storyboard through the Phase 09 planner. Make the AI provider optional and opt-in, with supported bring-your-own-key access where available. Keep the editable brief and manual recipe path usable without AI. Show the proposed shots, framing, poses, actions, captions and timing for review. Send only the prompt and selected metadata to an authorized provider. Keep source media, Blender files and credentials local to their respective environments.
3. Export a versioned Blender scene recipe and a human-readable shot sheet. Carry scene and shot IDs, frame rate, duration, aspect ratio, template and asset IDs, pose keys, camera keyframes, lighting presets, prop cues and caption timing. Show asset or rig requirements before export. The user approves the shot plan before handing it to Blender.
4. Open the recipe using an optional, separately installed local Blender add-on. The add-on maps validated recipe fields onto supported local rigs and templates, sets up an editable scene and timeline, and lists missing or unsupported items. The user can inspect the preview, adjust the scene and start a local render.
5. Export a Blender preview or finished render and a shot manifest. Import supported GLB/PNG assets or rendered clips into Creative Studio for assembly, caption and audio edits, and browser export. Report which elements remain editable in Blender and which arrive as rendered footage.

## Implementation boundary

Use a versioned declarative recipe, with an allowlist of animation, camera, lighting and render operations in the add-on. Validate enum values, asset references, relative paths, frame ranges, resolution and render budgets in both Creative Studio and the local importer. Reject script fields, shell commands and paths outside the selected project. Ask the Blender user for the local input and render-output folders. Blender and rendering run on the user's machine. A browser download and manual import provide the initial handoff, with no background desktop connection.

The first release uses existing rigs, reusable pose/action libraries, cameras, lights and scene templates. Free-form mesh generation, automatic rigging and a managed render service would require separately scoped work. Unsupported prompt instructions should clearly identify the affected shot and offer a mapped alternative, manual editing or a shot sheet. Validate one supported Blender version and one desktop platform before expanding coverage. Document actual install steps, hardware, render time and asset licensing.

## Acceptance and evidence

- From the real Creative Studio UI, turn an original prompt into a reviewed, multi-shot recipe for a 15–25 second vertical reel. Document provider use and include a run through the manual recipe path.
- Import the recipe into Blender. Inspect the editable scene, change at least one camera, pose or prop cue, and produce a real local Blender render. Record the actual software versions, settings, render time and asset provenance.
- Bring the render and shot manifest back into Creative Studio. Verify ordering and timing, edit a caption, save an `.acstudio` archive, reopen it in a fresh session and re-export. Deliver the playable Blender render and final browser export, contact sheet, screen capture, recipe and reproducible edit evidence.
- Exercise invalid and unsupported recipes, missing assets, interrupted render and the no-Blender fallback. Verify that a cancellation or failure leaves unrelated project files intact.
- Apply the master visual-review rubric. Stop for explicit owner visual review. Local work only until separately authorized to push, merge or deploy.
