# AnyConverter Creative Studio — Phase 01 Origin-of-Visuals and User-Authoring Audit

**Review basis:** User-supplied `phase-01(6).zip`, source patches and scripts inside `phase-01/`. This is a static/source-and-artifact review, **not an independent run of AGY's unpublished localhost application**. Date: 25 November 2026.

## Executive finding

**The visuals were generated in the AnyConverter browser renderer, but the scenes and designs were authored by AGY in code.** There is no evidence in this package that AGY generated the rendered parrot/noir/SaaS art using a separate commercial image-generation service. Conversely, there is **no evidence that an ordinary visitor can create comparable original designs without changing source code**. These are different claims and should not be confused.

**Status: no authorization to push, merge, or start Phase 02.** Phase 01 can be evaluated as an initial *template-based vertical slice*; it cannot yet be advertised as a flexible user-controlled video/character design system.

## Trace of how the output is produced

1. `OWNER_REVIEW_SOURCE_PATCH.diff` adds `assets/js/creative-studio/visual/creative-director.js` and `assets/js/creative-studio/visual/reference-shot.js` and includes them in `creative-studio/index.html`.
2. `CreativeDirector.createMasterSaaSSequence()` defines all five SaaS shots and their initial copy, frame counts, colours, badges, camera movements and scripted motif choices. `createParrotComedyPilot()` and `createMinimalSuspensePilot()` similarly define fixed nine-second pilots.
3. `ReferenceShot.render()` calls `_renderCinematicSaaS`, `_renderCharacterComedy` or `_renderMinimalSuspense`, drawing directly to HTML Canvas using `ctx.fillText`, gradients, paths, lines, circles, ellipses and rectangles. The parrot's body, wings, beak, eyes, microphone and office props are **literal drawing instructions embedded in JavaScript**. The corridor, silhouette and lighting are similarly coded.
4. The `studio-app.js` patch chooses one of three hard-coded sequence factories when users select the corresponding visual direction, then passes its frame model to the shared creative director renderer. The same canonical canvas renderer is used for preview and the WebCodecs export path.
5. The submitted `.acstudio` ZIP contains only `manifest.json` and `project.json`. Both the project `assets` array and manifest `assets` list are empty. The visual output is reconstructed from the application's drawing code, not from packaged image assets. Changing just the project data does **not** make new character art available.
6. The acceptance script `run_phase01_second_correction.js` selects `'cinematic-saas'`, `'character-comedy'` and `'minimal-suspense'` using `#cs-direction-select` and changes text/accent using `#cs-shot-headline` and `#cs-shot-accent`. There is no demonstrated UI workflow for making a new bird character, new illustration, new suspense environment or independent new visual design from blank canvas.
7. Some `.png` artifacts such as `SHOT_STORYBOARD.png`, `PARROT_PILOT_CONTACT_SHEET.png`, `NOIR_PILOT_CONTACT_SHEET.png` and `OLD_VS_NEW_COMPARISON.png` are **verification/report images**, assembled outside the website by FFmpeg and/or Playwright. That is normal for independent evidence, but they must not be presented as evidence that the site itself generated an editable graphic design.

## What the ZIP proves and does not prove

| Question | Finding |
|---|---|
| Do the provided videos contain actual encoded video frames? | Yes; prior independent media audits verified these outputs; the exact four video hashes are preserved in this ZIP. |
| Are the demonstrated visuals rendered by code running as part of the AnyConverter frontend? | **Yes, based on the submitted source patch and UI harness.** |
| Were the visual compositions initially designed by AGY rather than created through the public editor? | **Yes.** Their art direction, geometries and camera logic are written in JavaScript. |
| Does the ZIP show externally generated/parrot PNGs or Blender assets baked into the video? | **No.** The current parrot is procedural Canvas vector artwork, not a Blender-rendered PNG pose collection. |
| Can users select one of the three prebuilt styles and change basic text, accent and shot duration? | The source patch implements this; the test script exercises those controls. |
| Can users create a new character, set of poses, backdrop, shot motif, diagram or independent sequence without touching JavaScript? | **Not demonstrated.** The patch does not expose a generalized visual creation workflow for these functions. |
| Does the empty asset list mean absolutely no media-import system exists elsewhere in AnyConverter? | No; it proves only that **this submitted sample project** contains no imported assets. |
| Does source inspection prove all UI flows currently work on AGY's machine? | No. A fresh independent browser run with a complete checkout would be needed. |

## Additional evidence-integrity concern

The supplied positive test runner downloads a fresh video through the real Export button to `live_download_*.webm` and checks only minimum file size. **If a preserved master already exists, it does not replace that master unless `OVERWRITE_MASTERS=1`.** The runner then verifies and reports the preserved master, and deletes the fresh download. Therefore a successful run can check an older known-good artifact while a newly generated UI export might differ. The harness must either (a) verify the freshly downloaded video itself before comparing with the preserved master, or (b) record each hash, explicitly show any differences and explain why they are valid. Do not silently use retained masters as proof of the current application.

## Decision criteria

There are two distinct acceptance standards:

**A. Phase 01 — template-based vertical slice:** Acceptable if the owner agrees Phase 01 is *only* proof of prebuilt templates, legitimate UI editing of their exposed fields, save/reopen, and browser export. AGY must label those limitations honestly. More general creation is scheduled for future phases.

**B. Claim of a genuine user-driven creative platform:** **Not yet proven.** Before making this claim, require a clean-browser end-to-end demonstration in which an ordinary user produces a *new, unfamiliar, user-supplied concept* entirely through public AnyConverter controls, without editing JavaScript, running an external generator or invoking privileged browser-console functions. The result must remain editable in `.acstudio`, survive a fresh session and export with preview parity. Image/character editing must be actual user-facing capability, not a selection among three AGY-coded presets.

## Recommendation

Keep Phase 01's engineering/media evidence credited, but **do not approve it as evidence of general-purpose visual creation**. Ask AGY to complete the narrowly scoped provenance and user-creation test before requesting owner visual acceptance. If that requires advanced functions assigned to later phases, clearly mark them deferred rather than falsely claiming they already exist. **No push until the owner explicitly finalizes Phase 01 and authorizes push.**
