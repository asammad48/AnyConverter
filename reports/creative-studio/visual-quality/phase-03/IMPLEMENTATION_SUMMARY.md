# Phase 03 implementation

The starting point is published branch `feat/create-studio-visual-quality_PR` at `6786857063d89afb473560e928b7b2ebfca8c863`. GitHub and local Git both confirmed that repair commit `1fe7e081922cf298aed3e7c8f631407c2baa6af3` is an ancestor. Phase 03 lives in the isolated checkout `/workspace/AnyConverter-phase03` on `feat/create-studio-phase-03`.

## Production path

Select a shot and a composition layout. Paste text in Headline or Subhead / Narrative, then expand Typography and motion. The inspector selects the headline, caption, or CTA independently. Semantic roles start with a size, weight and family. Controls expose leading, tracking, maximum lines, vertical alignment, ellipsis or shrink, and the phrase and style used for emphasis. Horizontal alignment and width come from Composition layout. Start and end frames are relative to the shot, with an exclusive end frame. Reveal length and stagger are in frames.

A shot opts in via `customData.typography.version = 1`. Its title and caption cues refer to the existing editable headline and subhead fields. CTA text and cue settings live in the same versioned object. Phase 03 supports one independently timed cue per text block per shot. Archive import goes through the existing `.acstudio` loader and whitelists cue options at evaluation. Animation stays attached to the block when copy changes. Legacy shots skip the enhanced text path.

The layout module measures Canvas glyph bounds and advances, keeps explicit paragraph breaks, attaches punctuation when splitting oversized words, and memoizes measured lines for repeat evaluation. Styles use matching phrases and can recur within a block. Each styled source range is painted independently. For shaping-sensitive scripts the renderer prefers painting a whole run, including when the chosen reveal has to fall back to clipping. Exact fallback glyph coverage depends on installed system fonts.

Preview, PNG and WebCodecs use the same CreativeDirector and layout/kinetic evaluator. The constraint solver still owns safe areas and collision flags. The caption timing estimate uses the selected cue window and the existing reading-rate rules. Panel, outline and shadow options use the existing palette. Normal video export still uses the production suitability gate.

## Fonts and asset provenance

- DejaVu Sans and Serif regular and bold are the unchanged Debian `fonts-dejavu-core` 2.37-8 files. Their original distribution notice is retained. [DejaVu notice](../../../../assets/fonts/studio/LICENSE.txt)
- Bricolage Grotesque is SIL OFL 1.1. The Google Fonts variable source SHA-256 is `413e7357809ddd12fd80a96a8a396de0e401638d4acd3cb3e37532f0472ac682`. FontTools pinned width to 100 and optical size to 14 for text and 72 for display, retaining the weight axis. The designation uses authored size at 1080p, with display at 52 px and up. [Upstream source](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) · [OFL notice](../../../../assets/fonts/studio/Bricolage-OFL.txt)
- The six static-site font assets total about 2.5 MiB. Studio preflights them once per page session and selects whole-family fallbacks if any face in the family fails. They use same-origin requests. Project archives store family identifiers for portability within Creative Studio.
- Parrot, corridor, product diagrams and instrumental audio use the repository’s existing procedurally drawn scenes and synthesized backing tracks. The archive keeps shot data and an audio clip with sample position, duration and theme so Studio can rebuild the backing track on reopen. [Archive metadata](evidence/archive-metadata.json)

## Source changes

- `assets/js/creative-studio/visual/font-manager.js`, `kinetic-type.js`, `text-layout.js` and `typography-editor.js`
- `assets/js/creative-studio/visual/layout-composition.js`, `assets/js/creative-studio/studio-app.js` and `assets/js/creative-studio/render-adapter.js`
- `assets/css/creative-studio.css` and the EN, ES and DA `creative-studio/index.html` entry points
- Six font files and two license notices under `assets/fonts/studio/`
- Phase 03 evidence, reproduction scripts and repository memory

There are no new runtime package dependencies.
