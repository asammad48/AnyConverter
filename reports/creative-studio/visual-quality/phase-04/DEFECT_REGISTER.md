# Defect register

| Severity | Finding | Disposition |
| --- | --- | --- |
| P1 | The first edit allowed the envelope to disappear on the reaction cut. | Kept the envelope visible across the cut. The flap now opens with the held shock pose. Checked the recut browser export and reaction strip. |
| P1 | The original final shot reduced the doorway to a small outline. | Used a close doorway composition with a readable silhouette and an impact cue at frame 480. Checked the adjacent encoded frames and the final hold. |
| P2 | The first editor capture scrolled the stage out of the picture during keyframe dragging. | Captured separate inspector and stage views. |
| P2 | The first atlas implementation moved only the pupil for head tilt. | Split body and head cels in the same atlas. Added per-pose neck, eye, shoulder and perch points. |
| P2 | CSS could display hidden timeline rows in legacy projects. | Added a specific hidden-row rule and retained the legacy audio row when motion is inactive. |
| P2 | Independent reviewer found the late hero and reaction holds linger and the two parrot shots use similar framing. | Retained the fixed running time and time for the captions. The review records this as an editorial limitation. |
| P2 | The first still extraction showed a dark shift due to the default decoder conversion. | Applied the tagged full-range BT.709 conversion. The early reveal at frame 7 retains mild codec color and edge variation. |
| Environment | Google Fonts CSS and Tag Manager failed TLS validation in headless Chromium. | This did not affect self-hosted type or rendering. Firefox and WebKit browser binaries were unavailable. Physical/mobile playback and speaker audition are unverified. |

[Independent review](INDEPENDENT_VISUAL_REVIEW.md) · [Browser console and network](evidence/browser-results.json) · [Updated cut](evidence/showreel.webm) · [Storyboard](evidence/SHOT_STORYBOARD.png)

## Source-audit correction cycle

| Finding | Repair and verification surface |
| --- | --- |
| P1 Action application removed overlapping-property curves. | Independent intervals with explicit reject, replace and remove controls. Same-shot sequence and reopen evidence. |
| P1 Available controls could target content with no pixel effect. | Layout-aware target/property matrix, localized availability and real text, numeric, graphic and prop rendering. |
| P1 Children could rotate around different local boxes. | Shared pivot chain and stable grouped row spacing. Three individually measured row centers and nested group export. |
| P1 Clip warnings used transform thresholds. | Canvas-matrix bounds for draw rectangles and articulated puppet bounds. Intentional clipping is classified separately. |
| P2 Revised note could disappear between shock and point. | The envelope now latches open through an independent property track. The caption follows the reveal. |
| P2 A fractional doorway audio offset disrupted the mix. | Integer sample placement plus a mixer regression for fractional offsets restored the cue. |
| P2 Firefox MediaRecorder fallback exports video without the authored soundtrack. | Observed in the generated WebM. A local audio extension timed out and was reverted. Firefox, Chromium and WebKit WebCodecs exports contain VP8 and Opus. |
| P2 Main timeline lacks direct draggable keyframe markers. | Recorded as mandatory Phase 10 integration. The Phase 04 time slider remains available. |

[Revised gate and current browser results](FINAL_INDEPENDENT_PHASE_04_GATE.md)
