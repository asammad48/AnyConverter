# Phase 04 target and property compatibility

The editor derives property and preset availability from the selected shot and layer. A preset is unavailable when any of its output properties is unsupported. Existing tracks from a previously compatible layout remain saved so they can work again when the layout is restored. EN, ES and DA explain the restriction in the inspector.

| Target | X/Y | Rotation, X/Y scale | Opacity | Reveal, mask offset | Orbit, path | Color | Number | Underline | Pose ID, wing pose, squash, head tilt, gaze | Shake | Envelope opening |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Headline | Yes | Yes | Yes | Yes | Yes | Text ink | — | Yes | — | — | — |
| Caption | Yes | Yes | Yes | Yes | Yes | Text ink | — | Yes | — | — | — |
| Subject | Yes | Yes | Yes | Yes | Yes | Statistic or supported SaaS accent surfaces | Statistic layout | Yes | — | — | — |
| CSV, JSON, PDF, YAML and SQL entries | Yes | Yes | Yes | Yes | Yes | Row bar | Row count or replacement numeric text | Yes | — | — | — |
| Envelope | Yes | Yes | Yes | Yes | Yes | Envelope body | — | Yes | — | — | Yes |
| Puppet | Yes | Yes | Yes | Yes | Yes | — | — | — | Yes | — | — |
| Camera | Yes | Yes | Yes | Yes | Yes | — | — | — | — | Yes | — |
| Group and nested group | Yes | Yes | Yes | Yes | Yes | — | — | — | — | — | — |

The SaaS entry targets require the Hero layout. Applying their first motion to the original SaaS shot enables its editable row layout. The envelope and puppet require the native parrot and a character layout. Adding a named action enables that rig. Camera moves the subject, including its perch and envelope, inside the subject viewport. Shared groups use the shot safe-box center as a stable pivot. Group properties affect attached children. The camera is outside the editable parenting hierarchy.

Subject color is supported in Statistic and in SaaS Hero with typography, Comparison, Product, Reveal and Punchline. Numeric tracks are sampled continuously and shown as rounded integers. Pose ID and wing pose tracks are held. Other visual properties are interpolated. Reveal clips from the left in layer coordinates. Mask offset moves the contents vertically inside their viewport. Path progress follows the four editable control points.

[Production control tests](scripts/repair-browser.js) · [Implementation summary](IMPLEMENTATION_SUMMARY.md)
