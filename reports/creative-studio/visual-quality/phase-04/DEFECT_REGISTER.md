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
