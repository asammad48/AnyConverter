# Independent visual review

I reviewed the browser-exported 20-second cut of *The Unmarked Delivery* independently of the implementation. I played the WebM end to end at normal speed in Chromium, captured 80 presented images at quarter-second intervals, and inspected a separate sequence decoded by FFmpeg at four images per second. I examined adjacent production-preview frames across the blink and shock, and inspected the reaction composition in 16:9, 9:16, and 1:1. The Chromium playback was muted. Audio comments below use the decoded waveform and comparison to the visual cut. [Playable showreel](evidence/showreel.webm) · [Decoded storyboard](evidence/SHOT_STORYBOARD.png) · [Aspect ratio samples](evidence/LOCALES_AND_FORMATS.png)

The decoded pixel signature covers all 600 frames. SHA-256 of the concatenated FFmpeg frame MD5s is `74ffc064b827878fe02f5fbac6a1d7d6d77a09260569ac51ad3830327ee8b9de`.

## Findings

- The revised opening caption connects the five-format intake scene to the envelope. The bars help distinguish the five staged entries, although their lengths do not communicate quantities and the opening holds for several seconds after the motion settles. [Before and after](evidence/BEFORE_AFTER.png)
- The envelope now persists across the cut into the reaction scene. It opens as Pico springs into the shock pose, making the pose change read as a response to the contents. Across frames 292–309 the feet stay on the perch, including the switch between frames 299 and 300. The crest and wing remain visible. The envelope and head stay clear of the caption panel. [Blink strip](evidence/BLINK_POSE_STRIP.png) · [Reaction strip](evidence/REACTION_POSE_STRIP.png)
- The revised suspense shot cuts from the corridor to a readable closer view of the open door and figure at 16 seconds. Warm door light and deeper shadows distinguish the suspense beat from the cooler parrot set. Decoded 100 ms audio windows straddling the cut measure −18.0 and −13.2 dBFS RMS, consistent with an audible impact at the cut. The four-second ending leaves time to read, though the staging has little movement once the closer view settles. [Frame 479](evidence/decoded-479.png) · [Frame 480](evidence/decoded-480.png) · [Audio and frame metadata](evidence/media-metadata.json)
- The high-contrast captions remain legible in the sampled exports. The square Danish caption wraps naturally without encroaching on Pico, while portrait places the title, illustration and caption in a clear stack. The wide shot compositions keep the subject well separated from the dialogue. Contrast between the two parrot shots depends on the envelope and acting beats since the shots share staging and framing. [Aspect ratio samples](evidence/LOCALES_AND_FORMATS.png)

## Rubric

| Category | Score | Observation |
| --- | ---: | --- |
| Narrative clarity and information hierarchy | 17 / 20 | The delivery is easy to follow. A stronger visual clue in the envelope could better motivate the hallway. |
| Composition and framing | 13 / 15 | Subject and copy stay separated. The closer doorway has enough weight to land the cut. |
| Typography and readability | 13 / 15 | Main ideas and captions remain distinct. The title slide briefly enters clipped within its text region before settling. |
| Motion intent, easing and pacing | 12 / 15 | The relief before the shock and the envelope entrance are well timed. Lingering hero and reaction holds reduce the contrast between beats. |
| Colour and art direction | 9 / 10 | The cool workspace and warm threshold support the change in mood. |
| Imagery and illustration | 8 / 10 | The parrot poses are expressive and the anchored rig holds. The file-intake scene is visually simpler than the later scenes. |
| Audio and captions | 4 / 5 | Captions tell the story and the suspense cut has a measurable impact. This review assessed the waveform without listening to the mix. |
| Aspect-ratio adaptation | 5 / 5 | The sampled reaction composition holds up across all three formats. |
| Brand coherence and overall consistency | 4 / 5 | Type, dark surfaces and controlled accents carry through the three settings. |
| **Total** | **85 / 100** | Owner visual approval remains separate. |

This review covers the actual showreel and sampled reaction layouts. It does not establish playback or audio behavior on a physical phone, Safari, or Firefox.
