# Independent revised visual review

I reviewed the browser-exported 20-second showreel against the [earlier export](evidence/showreel.webm). I ran normal-rate Chromium playback through the end, examined 80 presented images and an FFmpeg sequence sampled at four images per second, and inspected adjacent full-resolution blink and shock frames. The reviewed visual sequence and the final audio-repaired export share the same decoded signature for all 600 video frames. I also reviewed the parrot composition in 16:9, 9:16 and 1:1 and sampled the separate sequential-action export. [Revised showreel](revised/showreel.webm) · [Storyboard](revised/SHOT_STORYBOARD.png) · [Formats and locales](revised/LOCALES_AND_FORMATS.png)

## Findings

- **Reveal and pacing.** The first repair export exposed the clue in the caption ahead of the action, and the keyhole card disappeared as Pico settled before returning during the point. In the retest, the envelope stays open after the shock, and the concise caption arrives after the card. The held clue gives the hallway shot a reason to follow. The symbol is small at thumbnail size, where the caption still carries the connection. The opening file scene and final doorway retain several seconds of near-static hold. [Reaction strip](revised/REACTION_POSE_STRIP.png) · [Storyboard](revised/SHOT_STORYBOARD.png)
- **Pose continuity.** In the 720p production-preview crop, sampled foot-color pixels ended at y446–447 through the blink (frames 169–180) and y444–447 through the shock (frames 292–309). The foot pixels ended at y447 on both frames 299 and 300, where the shock pose changes. The crest and wings stayed inside the subject panel in the sampled transitions. The separate sequential film shows a clear outward wing point and a translating, fading exit from the perch. [Blink strip](revised/BLINK_POSE_STRIP.png) · [Reaction strip](revised/REACTION_POSE_STRIP.png) · [Sequential actions](revised/sequential-actions-chromium.webm)
- **Captions and framing.** The title, artwork, and inset caption area remain distinct. The English clue caption is short enough to read during its hold. The tested localized reaction layouts preserve the separation between the illustration and any visible caption. The two parrot shots still use the same set and similar framing. [Formats and locales](revised/LOCALES_AND_FORMATS.png)
- **Suspense.** Decoded frame 497 holds the corridor. Frame 498 cuts to the closer open door and figure at 16.600 seconds, which matches the last shot's archive start frame. The sting begins at audio sample 796800 at 48 kHz, also 16.600 seconds. After repairing a fractional clip offset, decoded 100 ms RMS rises from −20.5 dBFS immediately before the sting to −13.8 dBFS at its entrance. Room tone continues after the sting. The earlier export cut at 16.000 seconds. [Frame 497](revised/decoded-497.png) · [Frame 498](revised/decoded-498.png) · [Archive](revised/showreel.acstudio) · [Encoded metadata](revised/media-metadata.json)

## Rubric

| Category | Score | Observation |
| --- | ---: | --- |
| Narrative clarity and information hierarchy | 19 / 20 | The card visibly motivates the hallway. Its icon remains small at reduced size. |
| Composition and framing | 13 / 15 | The closer doorway reads immediately. The two parrot shots share much of their staging. |
| Typography and readability | 13 / 15 | Stable title and caption hierarchy. The second headline enters partly masked before settling. |
| Motion intent, easing and pacing | 12 / 15 | The motion stays legible and motivated. Long holds still flatten some beats. |
| Colour and art direction | 9 / 10 | Cool daytime tones and warm hallway light make the shift clear. |
| Imagery and illustration | 8 / 10 | Expressive anchored puppet poses and a legible prop in full-size playback. |
| Audio and captions | 4 / 5 | Caption cue now follows the visual clue. Audio rating uses decoded signal and timing checks. |
| Aspect-ratio adaptation | 5 / 5 | The sampled parrot layout reads in all three formats. |
| Brand coherence and overall consistency | 4 / 5 | Repeated typography and surface treatment connect the settings. |
| **Total** | **87 / 100** | Owner visual approval remains separate. |

The 600-frame SHA-256 of concatenated FFmpeg frame MD5s is `e2384d2ccefcc7ac5c8367300665b4310be292a8a73d48be544d1c94292947d6`.

The review environment did not provide an audible output to the reviewer. I decoded the stereo mix and measured its timing and signal levels. These results describe the waveform and do not establish subjective listening quality or physical-device playback.
