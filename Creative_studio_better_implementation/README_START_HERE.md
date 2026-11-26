# AnyConverter Creative Studio — 16 Sequential Visual-Quality Phases

**Start with `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and `01_VISUAL_BASELINE_AND_VERTICAL_SLICE.md`.**

This package contains a deep-research-based roadmap, **16 separate detailed AGY implementation specifications**, and owner repair/finalization prompts. It is for the native visual composition and user experience. It is NOT authorization to deploy, merge or execute all phases.

## Non-negotiable push restriction

> **AGY must NOT push any code while a phase is unfinished, being tested, being repaired or awaiting owner review.** AGY may work and locally commit on a feature branch. Only after the owner inspects actual media, explicitly finalizes that particular phase and separately authorizes a push may AGY push that phase's finalized commits. Pushing phase N never automatically authorizes phase N+1. No merge or deployment without separate written approval.

## Usage

1. Give AGY the master document and **Phase 01 only**.
2. AGY implements, tests localhost, exports actual films/stills and fixes all phase defects.
3. AGY sends one consolidated `AWAITING_OWNER_VISUAL_APPROVAL` handoff; owner watches videos/contact sheet and reviews source/QA.
4. If rejected, use `PHASE_REJECTION_REPAIR_AND_FINALIZATION_PROMPTS.md`; AGY repairs the same phase with **no push**.
5. Once accepted, owner may issue the explicit **APPROVED FOR PUSH** command. AGY pushes only the phase's finalized work and stops.
6. Only a new **START PHASE 02** instruction permits AGY to begin the next phase.

## Package inventory

- `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` — research, architecture, visual QA rubric, governance.
- `01_...md` to `16_...md` — per-phase work packages with exact tasks, workflows, blockers and copy-ready AGY prompts.
- `PHASE_REJECTION_REPAIR_AND_FINALIZATION_PROMPTS.md` — reusable human review and repair loop.

## Why the change matters

Prior videos had correct WebM framing but low-quality designs: tiny titles, repeated orange circles, debug text and simplistic 3D. Better encoding cannot fix this. The programme builds original art direction, typography, layout, motion, shot library, storyboard compiler, editor controls, 3D, sound-linked motion, aspect ratio recomposition, and a long-form storytelling system.

## Phase list

- 01. Visual Baseline, Creative Direction and First Publishable Slice
- 02. Visual Design Tokens, Grids and Composition Constraints
- 03. Professional Typography, Text Shaping and Kinetic Treatments
- 04. Frame-Deterministic Motion Graph, Easing and Springs
- 05. Cinematic Transitions, Masks and Shared-Element Choreography
- 06. Professionally Designed Shot Library and Composition Components
- 07. Photography, Video Footage Treatment and Product Mockups
- 08. Animated Charts, Diagrams and Visual Explanations
- 09. Storyboard and Validated VisualRecipe Compiler
- 10. Visual Editor UX for Shot and Scene-Level Control
- 11. Audio-Linked Motion, Captions and Sound Design
- 12. Professional 3D Art Direction, Lighting, Materials and Camera
- 13. Small Premium Template Collection and User Brand Kits
- 14. Actual 16:9, 9:16 and 1:1 Recomposition
- 15. Five-Minute Narrative Continuity, Pacing and Quality Budgets
- 16. Independent Creative QA, Blind Comparison and Final Visual Release Gate

**New fees or hosting are prohibited unless the owner explicitly authorises them.** Remotion is a reference only, pending commercial license and telemetry review.


## V2 upgrade: Explicit browser-production scope

This release is the **full original set of 16 phase documents, each extended with a mandatory production-video addendum**. Added `FRONTEND_SHORTS_PRODUCTION_ARCHITECTURE_AND_REFERENCE_BRIEFS.md` covering Blender-to-pose PNG/glTF, browser-native Remotion-like composition, optional Kokoro JS TTS, Web Audio sound design, declarative timeline.json and character-comedy/SVG-suspense visual briefs. The original goals, detailed tasks, tests, repair loops, quality rubric and no-push discipline remain intact.

**Use:** Read master, added architecture/reference brief, and Phase 01. AGY must execute Phase 01 ONLY; the whole ZIP provides context, not execution permission. Every phase now contains an additional copy-ready implementation prompt and defect-repair prompt for the user-supplied short-form stack.

**Strict rule:** `NO PUSH OR PR UNTIL PHASE NN IS OWNER-FINALIZED *AND* THE OWNER EXPRESSLY AUTHORIZES PUSH.` No merge or deploy without separate approval. Do not start next phase without a separately issued START.
