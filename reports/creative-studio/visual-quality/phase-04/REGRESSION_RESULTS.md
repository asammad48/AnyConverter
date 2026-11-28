# Regression results

| Coverage | Result |
| --- | --- |
| Dedicated Phase 04 motion and pose checks | Passed. Ten presets × five timing patterns, typed and held tracks, stable seek, seed stability, parent hierarchy, reduced preview and atlas checks. |
| Browser control checks | Localized controls, system reduced-motion option, Bézier handles and group transforms are recorded by locale. |
| Phase 01–03 archive recovery against pinned tip | Passed. Reopened one archive per phase through the upload control. Exact production-canvas signatures matched at 0, 30, and 60 for each. |
| Phase 02 layout solver | Passed. Existing layout presets and safe-area/constraint tests across four dimensions. |
| Phase 03 typography in Chromium | Passed. Existing kinetic treatments, safe areas, archive round trip, font loading/fallback, video export and still export. |
| Existing project schema, archive, animation, rendering, timeline, audio and caption unit suites | Passed. |
| Multilingual page parity | Passed. EN, ES and DA markup and script parity. |
| Sitewide parity | Passed. Existing tool counts and route checks. |

The Phase 03 suite attempted Firefox and WebKit. Both launches reported a missing executable. Physical mobile devices, Safari, and audible speaker playback were outside observed coverage. The locale and aspect-ratio proof uses actual Chromium previews in all nine combinations.

[Motion and pose test](evidence/test_phase04_motion_and_pose.txt) · [Live controls](evidence/controls-regression.json) · [Phase 01–03 archive frame signatures](evidence/legacy-archive-regression.json) · [Layout suite](evidence/layout.txt) · [Typography regression](evidence/phase03-browser-regression.json) · [Schema and persistence](evidence/test_phase03_schema_and_persistence.txt) · [Legacy animation and render](evidence/test_phase05_animation_and_rendering.txt) · [Timeline, captions and audio](evidence/test_phase06_timeline_audio_captions.txt) · [Locale parity](evidence/test_multilingual_creative_studio_ui.txt) · [Sitewide parity](evidence/test_sitewide_parity_and_counts.txt)

## Source-audit revision

See [revised browser coverage](BROWSER_COMPATIBILITY.md), [revised unit and sitewide outputs](revised/), and [the final gate](FINAL_INDEPENDENT_PHASE_04_GATE.md). The Phase 01–03 legacy archive pixels matched exactly. The Phase 03 typography browser regression was rerun with the restored engines. [Fresh typography results](revised/phase03-regression/typography-regression.json)
