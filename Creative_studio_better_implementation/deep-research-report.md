# AnyConverter Creative Studio — Deep Research and Visual-Quality Implementation Programme

## Research findings

The current Creative Studio has largely solved the **technical-rendering** problem but not yet the **creative-authoring** problem. The latest supplied evidence reports deterministic browser-side WebCodecs exports at 2 seconds, 60 seconds and 5 minutes with exact frame counts, while the same five-minute evidence still describes scenes built around generic act labels, an animated orb and a progress bar. That combination strongly indicates that encoding fidelity is no longer the principal constraint; the missing layer is a sophisticated composition and visual-design system. fileciteturn0file0 fileciteturn0file2

The supplied recovery evidence also indicates that editable project reopening, deterministic video editing, Three.js-based 3D rendering, Canvas graphics, QR/PDF export and `.acstudio` persistence now exist in functioning form. Those capabilities should therefore be retained and upgraded visually rather than replaced wholesale. fileciteturn0file3 fileciteturn0file4

The reason Claude-authored Remotion projects frequently appear much more polished is **not that Remotion automatically creates better-looking videos**. Remotion supplies strong authoring primitives—frame-based timing, interpolation, springs, sequencing, transitions, fonts, media components and Three.js integration—which make it easy for a skilled author or model to describe deliberate compositions. Remotion exposes `interpolate()`, springs, `Series`, `TransitionSeries`, media tracks and Three.js integrations that support this style of programmatic motion design. citeturn146620search5turn483197search27turn146620search6turn146620search7

Remotion's current browser renderer is technically compatible with the zero-backend direction: `@remotion/web-renderer` renders directly in the browser using WebCodecs and Mediabunny. However, client rendering supports only a subset of browser layout/style behaviour, and Remotion states that browser renders send telemetry events. citeturn146620search0turn146620search1

Licensing is the bigger constraint. Remotion currently advertises free use for individuals and companies of up to three people, while organisations that do not qualify and use it for video editors, prompt-to-video applications or similar automation fall under its Automators licensing model, currently listed at $0.01 per render with a $100/month minimum. citeturn146620search3turn146620search2

Because AnyConverter's architecture explicitly avoids new recurring licence costs, **Remotion should remain an optional owner-approved experiment rather than the default rendering dependency**. The preferred design is therefore a Remotion-quality composition layer on top of the native renderer AnyConverter has already implemented.

The browser platform already provides most of the primitives needed. WebCodecs offers explicit frame timestamps and low-level browser video/audio encoding; OffscreenCanvas can move expensive rendering away from the main UI thread; Canvas provides deterministic text measurement; SVG supports masks, clipping and filters; and the Web Animations timing model provides a useful conceptual foundation for reusable animation graphs. citeturn146620search9turn146620search10turn305889search11turn305889search17turn146620search8

Three.js is MIT-licensed and is therefore a sensible basis for the improved 3D presentation system under the project's cost constraints. citeturn305889search8 Mediabunny is another potentially useful browser media layer, but it is MPL-2.0, so its licence obligations would need to be retained and reviewed before adoption. citeturn305889search0turn305889search1

## What is actually missing visually

The next implementation programme should concentrate on the **creative grammar** between the user's idea and the encoder.

The largest gaps are professional typography and wrapping; meaningful scene composition; reusable shot patterns; visual hierarchy; semantic animation curves; transition choreography; image/video treatment; masks and clipping; charts and diagrams; product mockups; sound-linked motion; more sophisticated 3D lighting/cameras/materials; aspect-ratio recomposition; consistent long-form pacing; and an editor that exposes those capabilities at scene and shot level.

Motion should communicate hierarchy and relationships instead of existing simply because animation is possible. Material Design's motion guidance specifically treats movement as a way to describe relationships, intention and hierarchy, and recommends consistent easing/choreography rather than arbitrary motion. citeturn483197search21turn483197search42

The resulting engine should therefore use a repeatable visual grammar:

**Story:** hook → establish → explain/prove → contrast → payoff → close.

**Shots:** hero title, statistic, comparison, process, product mockup, quote, diagram, split-screen, full-bleed media, 3D hero and CTA.

**Motion:** enter → settle → hold → emphasis → exit, with spatial motion separated from effect motion.

**Typography:** defined headline, deck, body, label, statistic and caption roles.

**Colour:** semantic palette roles rather than arbitrary per-element colours.

**Media:** focal crops, overlays, masks, depth, constrained zoom/pan and resolution diagnostics.

**3D:** deliberate camera language, studio lighting, materials, depth and meaningful animation.

Accessibility must also remain part of visual quality. WCAG guidance calls for adequate contrast and caption support, while motion guidance recommends accommodating users who request reduced motion. citeturn483197search10turn483197search7

## Architecture recommendation

The central new abstraction should be a declarative **VisualRecipe** rather than generated code.

Claude, ChatGPT or another BYOK assistant could output structured JSON describing scene purpose, shot type, style system, text, layout, motion, assets and transitions. AnyConverter would validate that recipe and compile it into its editable project schema. Arbitrary AI-generated JavaScript, React or Remotion code should never execute inside the editor.

This solves an important quality problem: it lets AI make high-level composition decisions while AnyConverter maintains deterministic rendering, security and editability.

Native workflows must not require an AI key. The same VisualRecipe compiler should be able to generate strong compositions from deterministic rules and professional templates.

The implementation should prioritise **a small exceptional component/template library rather than a huge mediocre library**. Eight genuinely strong templates will create more value than a hundred templates that merely vary colours.

For typography assets, Google Fonts states that the fonts it serves are released under open-source licences, making appropriately selected and documented families a practical source for redistributable/self-hosted typography. citeturn305889search10 Any bundled font should nevertheless keep its specific licence metadata in the project.

## The sixteen-phase visual programme

I created a complete sequential programme consisting of a deep-research/master file plus **16 implementation phases**. Every phase has its own goal, implementation requirements, localhost workflow, acceptance criteria, evidence requirements, copy-ready AGY implementation prompt, copy-ready repair prompt and mandatory **STOP gate**.

The sequence is:

| Phase | Visual implementation |
|---|---|
| **01** | Visual baseline, three art directions and a real reference-quality vertical slice |
| **02** | Design tokens, responsive grid, safe areas, snapping and composition constraints |
| **03** | Professional typography, measured wrapping, hierarchy and kinetic text |
| **04** | Deterministic motion primitives, easing, springs, stagger and animation graph |
| **05** | Masks, transitions, shared-element movement and scene choreography |
| **06** | Professional reusable shot library |
| **07** | Image/video treatment, focal cropping, mockups and media presentation |
| **08** | Charts, diagrams and procedural visual storytelling |
| **09** | Storyboard → validated VisualRecipe → editable scene compiler |
| **10** | Scene/shot-level editor UX and storyboard-to-timeline controls |
| **11** | Audio-, speech- and beat-synchronised motion plus professional captions |
| **12** | 3D art direction, cameras, lighting, materials and rig presentation |
| **13** | Small premium template system and reusable brand kits |
| **14** | True 16:9 / 9:16 / 1:1 recomposition rather than cropping |
| **15** | Five-minute continuity, pacing, motif management and visual quality budgets |
| **16** | Final benchmark suite, blind A/B comparison and owner visual acceptance |

The programme intentionally postpones sophisticated long-form work until typography, composition, motion, shots and visual components exist. That prevents AGY from producing another technically valid five-minute benchmark made from simplistic repeated geometry.

## Phase acceptance model

A phase cannot be completed merely because unit tests or screenshot baselines pass.

Every phase must be exercised through the **real localhost production UI**. AGY must create a fresh project, modify visible controls, preview it, export genuine media, independently inspect the export, create a temporal contact sheet, save `.acstudio`, terminate the browser, reopen the project, modify it again and re-export.

The programme explicitly forbids primary evidence based on test-only `onRenderFrame` callbacks, direct renderer calls, hardcoded benchmark scenes, pre-existing files or mocked screenshots.

Each phase has a defect loop:

**Implement → localhost test → visually review → record defects → repair → regenerate evidence → regress → commit → STOP.**

AGY must fix all P0/P1 issues and every defect that violates the phase acceptance criteria before asking for acceptance. It may **not** continue to the next phase automatically.

Human review uses a 100-point visual-quality rubric:

- Storytelling and information hierarchy — 20
- Composition — 15
- Typography — 15
- Motion and choreography — 15
- Colour and art direction — 10
- Media / illustration / 3D treatment — 10
- Audio and captions — 5
- Aspect-ratio adaptation — 5
- Consistency and brand coherence — 5

A phase requires **80/100 overall**, with no category receiving less than 60% of its available score.

This human gate matters because an encoder can produce 9,000 mathematically correct frames while those 9,000 frames remain visually uninteresting—a problem already evident in the supplied five-minute benchmark description. fileciteturn0file2

## Downloadable implementation package

The complete research and phase package is ready:

[Download the complete 16-phase visual-quality implementation programme](sandbox:/mnt/data/AnyConverter_Visual_Quality_16_Phase_Implementation_Programme.zip)

The package contains the master research document, README and all sixteen individual phase specifications.

[Master deep-research and roadmap](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/00_DEEP_RESEARCH_MASTER_VISUAL_ROADMAP.md)

[Phase 01 — Baseline & vertical slice](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/01_VISUAL_BASELINE_AND_REFERENCE_VERTICAL_SLICE.md)

[Phase 02 — Design tokens & grid](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/02_DESIGN_TOKENS_AND_COMPOSITION_GRID.md)

[Phase 03 — Typography engine](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/03_TYPOGRAPHY_ENGINE_AND_TEXT_SHAPING.md)

[Phase 04 — Motion primitives](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/04_MOTION_PRIMITIVES_EASING_AND_ANIMATION_GRAPH.md)

[Phase 05 — Transitions & choreography](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/05_TRANSITIONS_MASKS_AND_SCENE_CHOREOGRAPHY.md)

[Phase 06 — Shot library](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/06_SHOT_LIBRARY_AND_REUSABLE_VISUAL_COMPONENTS.md)

[Phase 07 — Media treatment](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/07_MEDIA_TREATMENT_IMAGE_VIDEO_AND_PRODUCT_MOCKUPS.md)

[Phase 08 — Diagrams & charts](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/08_DIAGRAMS_CHARTS_PROCEDURAL_VISUALS.md)

[Phase 09 — VisualRecipe compiler](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/09_STORYBOARD_VISUAL_RECIPE_COMPILER.md)

[Phase 10 — Editor UX](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/10_EDITOR_UX_FOR_SCENE_AND_SHOT_LEVEL_CONTROL.md)

[Phase 11 — Audio/caption motion](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/11_AUDIO_CAPTIONS_AND_SOUND_SYNCHRONISED_MOTION.md)

[Phase 12 — 3D art direction](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/12_3D_ART_DIRECTION_CAMERA_LIGHTING_AND_MATERIALS.md)

[Phase 13 — Premium templates & brand kits](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/13_PREMIUM_TEMPLATE_SYSTEM_AND_BRAND_KITS.md)

[Phase 14 — Aspect-ratio recomposition](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/14_ASPECT_RATIO_ADAPTATION_AND_SOCIAL_RECOMPOSITION.md)

[Phase 15 — Long-form continuity](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/15_LONG_FORM_CONTINUITY_PACING_AND_QUALITY_BUDGETS.md)

[Phase 16 — Final visual acceptance](sandbox:/mnt/data/anyconverter_visual_quality_16_phases/16_FINAL_VISUAL_ACCEPTANCE_BENCHMARK_SUITE.md)

The most important operational change is that **AGY should now receive only Phase 01**. It should implement it, fix every Phase-01 issue until the visual gate passes, return the evidence and stop. Only after explicit owner acceptance should Phase 02 begin.