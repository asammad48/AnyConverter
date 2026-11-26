# PHASE 07 — Photography, Video Footage Treatment and Product Mockups

**Project:** AnyConverter Creative Studio — Visual Quality Programme  
**Scope:** Visual design, creative composition, editing and visual evidence only  
**Sequence:** 7 of 16  
**Phase status at issue:** NOT STARTED  
**Base:** `feat/creative-studio-recovery`; local quality branch as defined in master file  
**Approval:** Owner visual review mandatory before ANY push or next phase

> **Do this phase only.** A successful local test is not permission to push or advance. See mandatory gate below.

## 1. Outcome and why this matters

Turn user-provided stills/screenshots/videos into professional-looking shots without paid media generation.

**Creative direction:** Focal crop, depth, frame-within-frame, tasteful highlights, phone/browser mockups, layered cards and parallax.

**Required demonstrable output:** 25s feature film using one screenshot, one photo, one local footage clip and two UI mockups.

**Phase prerequisites:** Phases 02–06; asset registry and archive path work.

## 2. Source files and architecture contract

Inspect media import and asset resolver in studio, `graphics-canvas.js`, video decode modules; propose `/visual/media-presenter.js`, `/visual/mockups.js`, `/visual/focal-crop.js`.

**Engineering design:** `MediaLayer` with source hash, focalPoint (0..1), fit, mask, crop, color adjustments, deviceFrame, parallaxTrack and rights metadata. Export draws decoded frames at exact project timestamps; no unauthorized downloads.

Do not infer that proposed new modules already exist: inspect current repository first, document actual paths, and choose the smallest consistent implementation. Preserve the stable frame-accurate WebCodecs adapter. New composition classes must not return a fake successful export.

## 3. Exact implementation work packages

1. Create cover/contain focal cropping with user-controlled subject pin and safe area.
2. Support rounded masks, shadow stacks, subtle glare, depth layering and controlled parallax.
3. Implement laptop, mobile and browser-window mockups with customizable frame/no actual brand trademark dependence.
4. Support low-res warnings, upscaling disclosure and asset orientation handling.
5. Provide deterministic asset preload and graceful offline failures with an actionable media-resolve notice.
6. Enable replacing footage while preserving timing and overlay layers.
7. Preserve input media and metadata in .acstudio without embedding source URLs requiring network.
8. Verify preview frame and exported frame match at chosen timestamps.

## 4. Real user-facing editing workflow that must work

1. Import real image, crop and pin focal point
2. Drag screenshot into device mockup
3. Add footage and apply time-bounded frame overlay
4. Replace clip without losing typography
5. Export/reopen with byte-identical media

Provide a screen recording or Playwright trace of **the real page at `http://localhost:3000/creative-studio/`**. Test EN/ES/DA headings/controls touched by the change. Do not inject a one-off stage renderer into the browser to make a benchmark pass when the actual editor cannot construct that composition.

## 5. Acceptance criteria (all mandatory before owner review)

1. Source imagery treated professionally with no stretching
2. No black/empty frames caused by asynchronous media decoding
3. At least two distinct believable device mockups
4. Export keeps same crop/focal point and timing as preview
5. Works with offline local assets and preserves rights metadata

**Exact live QA script:** Import a screen recording, a portrait and an app screenshot; create two device shots and a parallax media shot; export and compare source and output.

Additional mandatory checks: frame-accurate playable output where motion applies, no debug content in exported pixels, source licensing, visible recovery after archive reopen, browser console free of new uncaught errors, no extra user-media network uploads, and no regressions in existing tools. Record actual failures rather than marking them BLOCKED without investigation.

## 6. Known risks and feasible fallbacks

1. Browser codec limitations: detect and show media compatibility path, no hidden server conversion
2. Large photos: downscale cache previews while preserve originals
3. Copyright: use own/licensed media; license and provenance fields mandatory

For a proposed dependency, record licence, browser compatibility, bundle size, privacy and performance impact. If it cannot satisfy the zero-cost/zero-backend requirements, pick a compatible native alternative and continue the phase; do not add a fee or a proxy.

## 7. Defect-elimination loop — stay in this phase

1. Implement the smallest integrated vertical slice, preview in localhost and export actual media.
2. Capture frames/contact sheet and watch the full exported media—not only parse metadata.
3. Have an independent reviewer/AGY critique narrative, framing, legibility, motion, pacing and quality using the rubric.
4. Record P0/P1/P2 and aesthetic faults, fix all that violate the current phase; rerun fresh exports and regressions.
5. Reopen saved `.acstudio` in a separate browser session, edit and export again.
6. Produce one consolidated phase handoff. Stop for the owner's comments. If rejected, **repair Phase 07**; do not open Phase 08.

## Visual quality rubric (owner-led, not automatically certifiable)

| Category | Maximum |
|---|---:|
| Narrative clarity and information hierarchy | 20 |
| Composition and framing | 15 |
| Typography and readability | 15 |
| Motion intent, easing and pacing | 15 |
| Colour and art direction | 10 |
| Imagery, illustration, diagrams or 3D quality | 10 |
| Audio/caption treatment when applicable | 5 |
| Aspect-ratio adaptation when applicable | 5 |
| Brand coherence and overall consistency | 5 |
| **Total** | **100** |

A phase is eligible for approval at **80/100 minimum overall**, with no dimension below **60% of its maximum**. “Not applicable” categories must be explicitly documented and reweighted fairly, never silently awarded full points. Even a passing score does **not** replace the owner's visual approval. Record what is visibly weak and repair it before any push.


## Required independently inspectable evidence

Use `reports/creative-studio/visual-quality/phase-07/` locally (no push before approval):

- `IMPLEMENTATION_SUMMARY.md` — work completed and relevant source diff with rationale.
- `VISUAL_BEFORE_AFTER.md` — links to previous versus new frames and scene-level critique.
- `SHOT_STORYBOARD.png` or contact sheet plus **actual exported playable video** for motion phases, genuine PNG/PDF for relevant still work.
- `PREVIEW_EXPORT_PARITY.md` — sample frame numbers/timestamps and pixel/semantic comparison; document acceptable font/codec variation.
- `LIVE_LOCALHOST_JOURNEY.md` — real clicks, input values, URLs, screenshots and browser console/network results.
- `REOPEN_EDIT_REEXPORT.md` — fresh browser session import of `.acstudio`, edit and second export.
- `DEFECT_REGISTER.md` — all findings, severities, fixes, retests, unresolved items and supporting artifact paths.
- `CREATIVE_SCORECARD.md` — category scoring, evidence, remaining subjective questions for the owner.
- `PHASE_HANDOFF.md` — status `AWAITING_OWNER_VISUAL_APPROVAL`, local commit SHA if any, changed files, and **explicit statement `NOT PUSHED / NOT MERGED / NOT DEPLOYED`**.

Every artifact must be generated fresh in the real browser from the production UI. Do not reuse a preexisting artifact as proof of the current implementation. `ffprobe` / image checks prove structure, not design. Attach an actual video and a contact sheet. No generic “all tests pass” as substitute for visible samples.


## Project invariants and anti-simulation rules

- **Scope is visual quality only.** Preserve working WebCodecs video/audio, browser archive, native editing, existing website, Google Drive integration contracts and BYOK safety. Do not reopen unrelated infrastructure tasks.
- No managed backend, server GPU, Cloudflare Worker BFF, AnyConverter-funded AI calls, hosted asset storage or new recurring licence fee. Build tools for local development may bundle an isolated, lazy-loaded static Studio island; production remains static-site deployable.
- **Do not install or ship Remotion as a production dependency** without explicit owner authorisation and a verified licence/telemetry assessment. Borrow general principles (sequencing, interpolation, typography, components) without copying protected source or assets.
- Every public export must be free of debug frame counts, engineering subtitles, orange test orbs, test progress bars, placeholders, fake data, simulated output or unrequested branding. Diagnostics may exist only behind an explicit editor-only switch.
- The **same canonical composition and frame evaluator** must feed interactive preview and offline export. No separate test-only `onRenderFrame` render that bypasses production editing as the primary success proof.
- Do not run arbitrary AI-generated JavaScript in the page. Structured external designs must be validated declarative JSON. Native templates must work with zero AI keys.
- Every new asset needs origin/licence metadata, local/offline availability where appropriate, and archive portability. Self-hosted fonts require appropriate notice; never ship font files to a chat user.
- Accessibility, EN/ES/DA localization and three aspect ratios must be considered from the beginning; later phases deepen the implementation.


## Mandatory git, approval, and phase-isolation policy

**NO REMOTE PUSH DURING IMPLEMENTATION OR REPAIR OF THIS PHASE.** This is explicit owner instruction and overrides earlier prompts that said to push after testing.

1. Work exclusively on a local visual-quality feature branch derived from `feat/creative-studio-recovery`. Do **not** work directly on `main` or modify the base branch unnecessarily. Name suggestion: `feat/creative-studio-visual-quality` (local until approved).
2. Local saves, working-tree changes and **local commits** are permitted for safety checkpoints. Do **not** run `git push`, create a remote PR, merge branches, deploy or trigger production publishing during an unfinished phase.
3. Do **not** push just because automated tests or AGY's own visual review passed. The owner must **see and approve the actual video/still evidence and explicitly authorize a push for the finalized phase**. Approval to proceed to the next phase is also separate; never infer it.
4. Return a phase report with `AWAITING_OWNER_VISUAL_APPROVAL` and a list of exact files changed. The owner may provide corrections; implement **all** feedback within the same phase, repeat export + QA and request re-review.
5. Only after explicit owner authorization may AGY push the approved phase's local commit(s) to the designated feature branch. **Never push partially complete or rejected phase work.** Still do not merge to `main` or deploy without separate explicit approval.
6. **STOP after the approved phase.** Start phase N+1 only when the owner explicitly sends a new instruction. A zip containing all phases is NOT authorization to run them all.
7. No code changes outside Creative Studio visuals and directly necessary shared adapters without written justification. Preserve old public URLs, EN/ES/DA, sitemap, and existing tool functionality.

**Owner feedback protocol:** `PHASE NN: REJECTED — [specific visual or functional faults]. Repair all in the same phase. Do not push or advance.` / `PHASE NN: APPROVED FOR PUSH — push only finalized phase changes, then stop.` / `PHASE NN+1: START — implement the next phase only.`


## 8. Copy-ready AGY implementation prompt — Phase 07

```text
ANTIGRAVITY / AGY — EXECUTE PHASE 07 ONLY: Photography, Video Footage Treatment and Product Mockups

Read `00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md` and this entire Phase 07 specification.
Inspect actual repository code, relevant user-uploaded old WebM benchmarks and current phase prerequisites.
Do not substitute a plan, refactor unrelated modules or run Phase 08.

Implement: Turn user-provided stills/screenshots/videos into professional-looking shots without paid media generation.
Creative target: Focal crop, depth, frame-within-frame, tasteful highlights, phone/browser mockups, layered cards and parallax.
Produce: 25s feature film using one screenshot, one photo, one local footage clip and two UI mockups.
Source review: Inspect media import and asset resolver in studio, `graphics-canvas.js`, video decode modules; propose `/visual/media-presenter.js`, `/visual/mockups.js`, `/visual/focal-crop.js`.
Critical architecture: `MediaLayer` with source hash, focalPoint (0..1), fit, mask, crop, color adjustments, deviceFrame, parallaxTrack and rights metadata. Export draws decoded frames at exact project timestamps; no unauthorized downloads.

Execute every numbered implementation task, exercise every user workflow in actual localhost UI,
export real media, inspect the visual result and fix all phase defects in the same phase.
Render the evidence artifacts, fully reopen/edit/re-export, run existing regression checks,
write PHASE_HANDOFF.md and return a consolidated report with direct playable evidence.
Score against the 100-point creative rubric, minimum 80 with per-category floors.

GIT HARD STOP: DO NOT `git push`, open PR, merge or deploy during this phase.
Local changes/checkpoint commits allowed only on the visual-quality feature branch.
Do not push after your tests pass: WAIT for explicit owner approval of visual evidence
AND explicit authorization to push this completed phase. Do not begin Phase 08
unless separately instructed by owner. If findings exist, fix them and repeat checks
rather than reporting complete.

Final AGY response must end: `PHASE 07: AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED`.
```

## 9. Copy-ready single-phase repair prompt — after owner critiques output

```text
AGY — PHASE 07 CORRECTION LOOP. I have NOT accepted the Phase 07 visuals.
Read my feedback below and the Phase 07 acceptance gate. Stay exclusively in Phase 07.

OWNER FEEDBACK:
[Paste all visual, animation, typography, UI, or exported-media issues here]

For each issue: reproduce through the REAL localhost editor; explain precise cause;
fix the actual composition model/UI; re-export complete proof; inspect all changed
frames, captions and motion; rerun Phase 07 regressions and archive reopen/edit.
Resolve every issue together before returning, not one micro-fix at a time.
List exact file paths and new evidence. Reissue the Phase 07 scorecard and ask for owner review.

ABSOLUTE RULE: DO NOT PUSH ANY CODE, create PR, merge, deploy or start Phase 08.
Return `PHASE 07: REVISED — AWAITING_OWNER_VISUAL_APPROVAL — NOT PUSHED`.
```

## 10. Owner's finalization/push commands (owner uses only when satisfied)

```text
PHASE 07: APPROVED FOR PUSH. I have inspected the playable visual evidence,
accepted the current phase and authorise pushing ONLY the finalized Phase 07
commit(s) to the designated visual-quality feature branch. Do not merge or deploy.
After pushing, provide exact remote SHA and STOP. Do not start Phase 08.
```

**To start the next phase, the owner must separately say** `PHASE 08: START`.


---

# V2 MANDATORY ADDENDUM — FRONTEND SHORT-FORM PRODUCTION INTEGRATION / PHASE 07

> **Binding instruction:** This addendum extends the original Phase 07 file above; all original tasks remain compulsory. Read both sections. The user specifically requires strong work on Blender-pose/Remotion-quality/Kokoro/audio/timeline short-form capabilities, but **only the abilities assigned to this phase** may be implemented now. Never fake completion of later-phase dependencies.

## Explicit output and production-stack mapping

**New specific objective:** Make Blender-derived assets and local photos/videos practical in browser editing without shipping Blender to users.

**Technology interpretation:** Optional offline authoring with Blender bpy, glTF/GLB import, pose PNG atlases, SVG figures and browser media pipelines.

## Additional detailed implementation work (mandatory, not optional)

1. Document Blender as OPTIONAL development or user desktop tooling for creating original/licensed assets; Blender bpy/Cycles/Freestyle are not a web runtime promise.
2. Build browser import of glTF/GLB, RGBA pose PNGs, spritesheets, SVG and raster images; validate type, origin, asset size, transparency and dimensions.
3. Create a pose atlas conversion/import UI with order, name, pivot, silhouette thumbnail, idle/talk/react pose assignment and alpha premultiplication checks.
4. Support posterization/toon/duotone/LUT-like looks, grain, vignette, shadow, stroke and foreground separation for available image/video assets; non-destructive effect stacks.
5. Add project asset manifest (hash, license, attribution, source link if known, usage rights, dimensions, extraction method) and bundle source media in .acstudio where legal/size permits.
6. Design fallback when large GLB exceeds memory: use Blender-pre-rendered pose images rather than converting GLB through server infrastructure.
7. Verify real UI footage treatment and character atlas compositing both at preview size and exported resolution.

## Live production-UI demonstration and evidence

- Original/licensed parrot asset converted into at least 8 named poses, with a live browser animation and all assets in .acstudio.
- One genuine external photo, one six-second local footage clip and one mocked-up product interface in a polished 25s export.
- Reopen assets across fresh browser session with SHA-256 matching and an asset-rights manifest.

Every proof must originate in the **real localhost application**, using real user-visible actions and project files. Any custom programmatic test may supplement but never replace a UI proof. Deliver local `reports/creative-studio/visual-quality/phase-07/V2_SHORTS_INTEGRATION_EVIDENCE.md`, reference stills, contact sheet, playable exports, project archive, preview/export comparisons and fresh-session reopen/edit/re-export when relevant. Document exact export codec, width/height/fps/frame count and timing. Write captions and audible assets explicitly into the project timeline, not just the video.

## Phase-specific blockers and feasible corrective action

| Blocker | Fix / truthful fallback |
|---|---|
| Browser cannot run full Blender Cycles | Treat pose rendering as offline authoring only; users upload PNG/GLB; never ship Python bpy binaries to frontend. |
| Untrusted SVG / huge assets | Sanitize SVG; strict memory/size caps; reject scripts/external references; avoid unsafe HTML embedding. |
| Media decoding varies by browser | Probe supported codecs; offer still-photo/pose fallback; never fake a decoded video import. |

Do not downgrade a failed capability to PASS; apply the fallback visibly and document it as limited. For any missing external asset or physical device, maximize what can be implemented locally and mark the remaining edge **BLOCKED** rather than making silent assumptions.

## Creative quality rejection conditions

The owner should **reject** Phase 07 if shots are repetitive, captions overlap subjects, voice is synthetic filler, animation has no dramatic cause, project assets are not editable, preview/export differ materially, references are unlicensed, any required production UI path only works through special test scripts, or future-phase capabilities are claimed as already shipped. The original phase rubric remains in force; quality is assessed visually by watching exported movies, not by an AGY self-issued numerical PASS.

## Copy-ready strict Phase 07 Antigravity implementation prompt (V2)

```text
AGY / ANTIGRAVITY — CURRENT AUTHORIZED PHASE 07 ONLY — FRONTEND PRODUCTION VISUAL QUALITY

Read the 00_MASTER_RESEARCH_ARCHITECTURE_AND_STOP_RULES.md original sections PLUS its V2 frontend production addendum. Read the entire Phase 07 document, including its original tasks and this V2 addendum. Continue from locally accepted earlier phases.

Produce: Make Blender-derived assets and local photos/videos practical in browser editing without shipping Blender to users.
Technology interpretation: Optional offline authoring with Blender bpy, glTF/GLB import, pose PNG atlases, SVG figures and browser media pipelines.

Implement EACH of the 7 numbered V2 tasks above AND every original Phase 07 task. Do not compress the task into a proof-of-concept that cannot be edited. Every scenario must use actual media/assets, the production scene editor and the canonical frame evaluator. Never add any diagnostic orb, progress bar or frame stamp to a public output.

Reproduce and inspect the end-to-end localhost user experience, actual decoded video and source project. Fix ALL discovered issues inside this phase, rerun the tests and return ONE consolidated evidence report with the full playable artifacts and exact issue register. Explain any blocked device, voice or provider option honestly.

NON-NEGOTIABLE: NO GIT PUSH, NO REMOTE PR, NO MERGE, NO DEPLOY, NO NEXT PHASE. Local changes/commits only. STOP after Phase 07 report. I will inspect visual evidence; if I reject it, fix ALL phase issues and show new evidence before I decide whether to finalize it. Do not push until I explicitly say 'PHASE 07: APPROVED FOR PUSH'. No future phase begins without its own START command.

Return exactly: PHASE 07 — AWAITING OWNER VISUAL APPROVAL — NOT PUSHED — NOT MERGED — NOT DEPLOYED.
```

## Consolidated correction prompt (use without advancing)

```text
AGY: PHASE 07 NOT ACCEPTED. Fix all defects I list in the SAME PHASE, including every original and V2 requirement. Reproduce each fault through real UI, identify root causes, implement fixes, regenerate full assets/videos and compare before/after. Review audio, captions, poses, frame timing, preview/export and archive preservation as applicable. Provide an evidence table per defect (symptom -> cause -> code fix -> fresh test -> visual proof). DO NOT PUSH, OPEN PR, MERGE, DEPLOY OR START THE NEXT PHASE. Respond AWAITING OWNER VISUAL APPROVAL.

OWNER DEFECTS:
[PASTE ALL FEEDBACK HERE]
```


---


> **V3 owner architecture decision (binding, supersedes older optional Remotion language):** No Remotion dependency or Remotion runtime in AnyConverter production. Use native browser composition, deterministic VisualRecipe JSON, the existing canonical canvas/WebGL evaluator and WebCodecs exporter. JSON is an internal and advanced-user interchange format—not a requirement imposed on beginners. No AnyConverter-funded backend, image/AI inference, server rendering, cloud storage or media proxy. No phase begins and no code is pushed without the owner's separate explicit permission. A local test PASS is not approval.



# V3 MANDATORY EXTENSION — PHASE 07: ASSET FACTORY, SEARCH, IMPORT, CACHE, LICENSING AND SELECTED-ASSET STORAGE

**Status:** Specification only; NOT implemented by this document. **Phase authorization:** This does not start Phase 07. The existing media treatment, focal cropping, two device mockups, parallax, archive and 25-second media film in the original Phase 07 remain mandatory. This extension adds the asset supply/discovery layer and MUST be implemented together with those original tasks once Phase 07 is expressly started.

## V3.1 Non-negotiable product outcome

A nontechnical creator can search or choose a legal asset, understand its license, drop it into a real video shot, crop or replace it, render it offline after import, save it inside `.acstudio`, reopen on a fresh browser/profile, and export an identical shot **without relying on the original provider URL**. A user with no PNG/SVG must still be able to make useful visuals from procedural diagrams and text-first treatments.

**Asset Factory is not a warehouse of millions of files** and not an AI image generator. It is a search/federation + procedural component + curated pack + local-import pipeline. Do not scrape, bulk mirror, preload huge libraries, silently use unknown rights or proxy around blocked CORS. Provider connectors are optional and shall show truthful states when not available.

## V3.2 Four supply tiers and exact scope

| Tier | Input | Source of visuals | Browser behavior | Requirements |
|---|---|---|---|---|
| 1. Procedural | User intent and settings | Built-in registered SVG/Canvas primitives and structured compositions | Offline; 0 external requests | Parameterized text, colours, aspect ratio, motion, editability, semantics, tests |
| 2. Curated | Local static manifest | Small first-party/appropriately licensed icons, mockups, starter backgrounds and characters | Lazy static chunks only | Per-asset immutable IDs, license manifest, dedupe, bundle-budget measurement |
| 3. Discover | Search query, license filter | Permitted catalog APIs: first consider Iconify for icons; conditional Openverse and Wikimedia Commons | Search on demand; import selected bytes only if terms/CORS allow | Provider adapter contract, license check, attribution, rate limiting, offline and CORS handling |
| 4. User-owned | File picker / drag drop / opt-in file handle | User PNG/JPEG/WebP, sanitized SVG, media clips, optional glTF/GLB where renderer supports | File stays browser-local; user permission | Type/size validation, hash, EXIF metadata privacy, portable archive, replacement workflow |

Do not claim millions are locally owned or instantly available. Search providers' catalogs rather than storing their image binaries. Web-level search is **discovery**, not license clearance. Third-party API keys must never be embedded in shipped frontend bundles. An API requiring a confidential server credential is incompatible with the zero-backend default and must be marked unavailable or require the user's own permitted credentials, subject to provider terms.

## V3.3 UI: 'Assets' tray and visual hints (user-visible actions)

**Asset tray tabs:** `Suggested visuals` | `Built-in` | `Find online` | `My uploads` | `Recently used` | `Licenses`. Provide search, category, type, orientation, style, colour, duration (for animations), resolution, transparent background and license filters. Default is **curated 3–5 useful suggestions**, not 10,000 undifferentiated thumbnails. Every search result card identifies *source, creator, license, preview, import feasibility, commercial-use flag and attribution*; display `UNKNOWN/REVIEW REQUIRED` honestly.

**What should viewers see?** mini-wizard on a selected shot: `Diagram`, `Icon / illustration`, `My image/video`, `Search licensed assets`, `Typography-only scene`. Use phase 08's registered diagram components when available; before then offer current Phase 06 primitives. When no matching visuals exist, show `No matching illustration available. Choose a procedural diagram, text-only composition or upload an asset.` NEVER substitute SaaS/WebCodecs visuals merely because they are available. Maintain `unresolved` / `draft-only` state for required imagery that isn't resolved.

**License UX:** A selected result must show `Use in commercial videos?`, `Can I modify it?`, `Attribution required?`, `Share-alike restrictions?`, `Provider terms?`, `How is credit exported?`. Do not assert legal permission just because an API labels a file Creative Commons. Incompatible NC commercial uses, ND transformation use, missing attribution/unknown license and provider restrictions are explicit blocked/review states. CC BY-SA share-alike is not universally compatible with a given project's distribution—surface conditions rather than granting blanket approval. Prefer curated CC0/public-domain assets when available but still preserve provenance.

## V3.4 Technical contracts and suggested modules (proposed, verify actual repository)

- `visual/assets/asset-registry.js`: stable opaque asset IDs, type, owner, current availability, hash and resolvability.
- `visual/assets/provider-adapters/{iconify,openverse,wikimedia}.js`: `search(query, filters, signal)`, `inspect(resultId)`, `import(resultId)`; provider-specific terms, retries, cancellation, pagination and quotas. Provider response is never trusted markup.
- `visual/assets/procedural-catalog.js`: registry of allowed procedural component IDs, typed adjustable parameters, meaningful subject tags, deterministic seed and preview generator.
- `visual/assets/asset-importer.js`: decode, size check, MIME sniff, sanitized SVG, SVG-to-canvas-safe conversion, EXIF strip option, duplicate hashes; fail closed on dangerous content.
- `visual/assets/local-asset-store.js`: OPFS (where supported) or IndexedDB; in-memory no-persistence fallback; LRU thumbnails and origin storage estimation; **no silent evictions of active project data**.
- `visual/assets/license-manifest.js`: normalized provenance and compatibility notices; explicit user confirmation where required.
- `visual/assets/hint-engine.js`: bounded keyword/intent taxonomy and registered component suggestions. No invented AI comprehension or covert cloud model.
- `visual/media-presenter.js`, `visual/mockups.js`, `visual/focal-crop.js`: preserve the original Phase 07 media treatment tasks.

This is a suggested decomposition, NOT a claim the files already exist. Inspect `studio-app.js`, `graphics-canvas.js`, current archive, media decode and canonical renderer first; justify where each integration happens. No duplication of the existing renderer. Use content-addressed IDs like `asset:sha256:<hex>` for file data; use separately stable **node IDs** and declarative component identifiers for rendering.

### Proposed selected-asset record (contract, not current implementation)

```json
{
  "id": "asset:sha256:<64-hex-hash>",
  "kind": "image",
  "mime": "image/png",
  "width": 1920,
  "height": 1080,
  "sizeBytes": 280000,
  "availability": "embedded",
  "rights": {
    "licenseId": "CC-BY-4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "creator": "Example Creator",
    "sourceUrl": "https://example.org/item",
    "retrievedAt": "2026-11-27T00:00:00Z",
    "modifications": "cropped; colours adjusted",
    "attributionRequired": true,
    "attributionText": "Example Creator, CC BY 4.0"
  }
}
```

All fields from a provider must be escaped and validated. Dates/URLs are examples and must be replaced with actual evidence. `rights` is provenance, **not a guarantee of legal clearance**. Preserve a human-readable `CREDITS.md` or metadata/credit view in `.acstudio` and allow users to export attribution when needed.

## V3.5 Asset lifecycle, offline and archive reproducibility

1. `DISCOVERED`: preview metadata only; not render/export safe. 2. `LICENSE_REVIEWED`: attribution and rights decision; missing/unknown terms remain review required. 3. `IMPORTED`: bytes fetched with successful CORS or user-selected local file, validated and hashed. 4. `AVAILABLE`: decoded source confirmed safe for canvas and duration/timing, thumbnail cached. 5. `EMBEDDED`: actual asset bytes (or registered built-in component ID/version) included in portable `.acstudio`; manifest SHA-256 matches. 6. `MISSING/UNSUPPORTED`: recoverable notice, never replace silently.

- Save original source media when size/rights permit and an editable preview derivative separately; document any archive-size restrictions before export. Bundled project files have manifest, media checksums, provenance, stored sizes, and safe path names. Reject path traversal, ZIP bombs, cross-project asset reference collisions, unknown external schemes and oversized files. Preserve user-edited focal point, crop/masks, animation and attribution.
- Use **blob:** object URLs only as temporary runtime references; regenerate them after reopening. Never serialize them as permanent asset URLs. Reopen on a clean offline browser after import; no external URLs required for rendering selected bytes. Built-in procedural components are referenced by stable ID+version, with migration and clear missing-component error.
- Browser storage is not permanent: use `navigator.storage.estimate()` and `persist()` where available, provide storage usage, cache eviction and export guidance; quotas/eviction vary. Never promise unlimited offline assets.
- Never draw an arbitrary cross-origin external `<img>` directly into the export canvas. Attempt legitimate CORS import, verify decoded pixels can be read/exported, and give user an upload/alternative path when CORS fails. No AnyConverter CORS proxy, CORS bypass service or opaque fetch-to-canvas trick.
- SVG is potentially active content: remove scripts, event handlers, `foreignObject`, network/external references, active links, disallowed data URIs and unsupported animation. Reject unsafe SVG rather than trust a simple regex sanitizer; use a vetted parser/sanitizer with a strict allowlist; verify rasterization in a sandboxed flow or convert allowed SVG paths to internal primitives. Validate asset metadata before storing. Optional 3D/model support must not prematurely claim Phase 12 rigging/render capabilities.
- Local file processing/privacy: do not upload private files to analytics or catalog APIs. Search strings, URLs and user media are distinct data flows. Optional provider search requires user action and an understandable consent/privacy notice. Check font and icon-set rights before redistribution.

## V3.6 Phase 07 implementation work packages (additional to original mandatory tasks)

1. **Inventory existing import/decode/archive.** Establish before/after performance, memory, CORS and preservation baseline. Create capability matrix (by MIME, browser, offline, asset source); prove no regression of original media/mockup workflows.
2. **Implement procedural registry and 25+ useful component/motif variants**, designed (not random decoration) across business, education, security, data and general utility. Components should vary visuals genuinely; not only change titles over a fixed illustration. At least five parameterized components with meaningful spatial change, not just accent colour.
3. **Build curated-pack manifest and lazy loader.** Start small, e.g. <=100 carefully chosen items, license-reviewed. No silent importing all provider contents. Track loaded bytes, latency and offline behavior.
4. **User media import and shot binding.** Upload PNG/JPEG/WebP and sanitized SVG; replace any supported image in an editable video layer; preserve crop/focal point and motion. Keep original Phase 07 video clip/device mockup support. UI must show source availability and selected asset rights.
5. **Add at least ONE fully functioning external-provider search/import adapter** if actual live browser CORS, terms and quota allow. Use Iconify as first candidate; evaluate Openverse/Wikimedia Commons adapters and either implement those compatible or truthfully disable with captured reasons. Provider count is not a pass metric; working import+export is. Do not claim any API provides commercial licensing clearance.
6. **Cache selected items only.** Hash+dedupe, lazy thumbnail decode, cache budgets and evictions, OPFS/IndexedDB fallback, offline reopen and manifest checksums.
7. **Make visual hints actionable.** Enter three unfamiliar concepts; show 3–5 ranked meaningful motif/diagram/asset choices each; support manual overriding and explicit 'unresolved' state. Expose confidence as rule-based category matching, never as AI semantic understanding.
8. **License provenance and credits.** Allow creator/license info, license-filtered search, credit export, rights warnings, source URL tracking, and unknown-license handling. Block only genuinely disallowed or unresolved uses, document user choices clearly.
9. **Integrate with preview-export canonical evaluator.** Every imported/built-in component must be constructible through actual UI, not injected by a test-only JavaScript path. Frames from real export must show same asset/crop/animation as preview.
10. **Preserve original requirements:** focal crop, masks, parallax, 2 device mockups, 25-second feature film from screenshot + photo + footage and save/reopen/re-export. Do not submit a search-only demo in place of the original film.

## V3.7 Real acceptance journeys and negative test gates

**Journey A — user owns no images:** Go offline; create an 18-second 5-shot password-safety/educational clip using registered diagrams, typography and icons. Edit three visual choices from UI. No external network/media needed; export is thematically coherent. Reopen offline after restart.

**Journey B — external licensed image:** Go online, search a relevant term from provider UI, review licensing, choose one compatible asset, import actual bytes, crop into device mockup, add to 25-second original Phase 07 film, export; disable network and reopen `.acstudio` in fresh browser; exported frame still shows the image. Record actual provider calls and licenses.

**Journey C — own file:** Import JPEG/PNG, sanitized SVG, actual local footage, set crop and frame overlay, replace one image; save/reopen/export. Verify asset IDs and hashes, no upload.

**Journey D — limited provider:** Simulate CORS 403, 429/rate limit, offline, API outage and suspicious metadata. User sees useful failure and never gets a blank/unlicensed/tainted exported video.

**Journey E — security/privacy:** Malicious SVG with `<script>`, event attributes or external references rejected; ZIP traversal rejected; oversized image fails cleanly; EXIF stripping option tested; unknown/NC/ND license warnings correct; attribution exported.

**Measure and record**: asset import success/failure reasons; licensing fields; CORS/exportability; preview/export SSIM with lossy codec tolerance; current frame and clip timestamps; browser storage used; network calls; local bytes; hash match; archive roundtrip; console errors; EN/ES/DA controls; desktop/tablet/mobile. Screenshot or Playwright trace is supplemental to actual saved project+playable video and human visual review.

### Mandatory failure states for Phase 07

Reject if the library is only static thumbnails, if search results have no working selected-byte import, if no-asset users get unrelated filler, if remote assets taint canvas, if credits disappear after reopen, if project relies on a remote source for an already imported asset, if the original media-treatment film is missing, or if tests bypass visible UI. **No future-phase deferral may silently downgrade these V3 Phase 07 tasks.**

## V3.8 Boundaries and integration handshake to Phases 09/10

Phase 07 returns a stable `AssetRegistry` API, manifests and licensed selected-byte asset references. Phase 09 adds VisualRecipe schema using those registry IDs; Phase 10 exposes the factory through Quick Create/Storyboards/Editor. **Do not implement the final six-mode UX in Phase 07.** A functional Asset tray and UI asset selection are enough. Scene graph/node binding must be kept compatible and documented. Treat phase 08 diagram primitives as further extensions of Phase 07's primitive registry. Deliver `ASSET_FACTORY_CAPABILITY_MATRIX.md`, `PROVIDER_LICENSE_CORS_AUDIT.md`, `ASSET_MANIFEST.md`, `STORAGE_OFFLINE_ROUNDTRIP.md`, `NO_IMAGE_USER_JOURNEY.md`, `REAL_IMPORT_PREVIEW_EXPORT.md`, `SECURITY_NEGATIVE_TESTS.md`, `VISUAL_ASSET_HINTS.md`, and `PHASE_HANDOFF.md` in `reports/creative-studio/visual-quality/phase-07/`.

## V3.9 Copy-ready AGY Phase 07 authorization prompt (only after owner says START PHASE 07)

```text
AGY — IMPLEMENT AUTHORIZED PHASE 07 ONLY, including ALL original V2 requirements AND the V3 ASSET FACTORY ADDENDUM.
Inspect the actual repo before designing modules. Preserve existing WebCodecs, audio, scene and archive behavior. Build four-tier source capability: meaningful offline procedural primitives, a small curated licensed pack, optional on-demand permitted external search+selected-byte import, and user-owned uploads; include metadata, attribution, local storage and portable .acstudio embedding. Never bundle millions of binaries, never silently use copyrighted material, never use paid backend/proxy/Remotion. Make 'no SVG or PNG' a normal first-class offline creation path.
Use the actual user-facing browser controls to run Journeys A–E and the ORIGINAL 25s media treatment film. Verify preview-export, archive reopen in an isolated offline browser, CORS/storage/security failures, EN/ES/DA and existing-site regressions. Produce actual playable evidence and honest defect logs. Fix all Phase 07 defects before handoff.
GIT/PHASE HARD STOP: NO PUSH, PR, MERGE, DEPLOY OR PHASE 08 until the owner explicitly reviews and authorizes. Return AWAITING OWNER VISUAL APPROVAL, not 'approved' or 'done' based on own test scores.
```

