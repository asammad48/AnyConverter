# Defect register

| Severity | Finding | Fix and retest |
|---|---|---|
| P1 | Startup displayed video controls while the controller still reported graphics mode. Cinematic PNGs exported the graphics stage. | Set both initial mode states and route PNG to the canonical renderer. All four target dimensions and guide-independent PNGs now pass. |
| P1 | Shot durations were rounded to whole seconds before export. | Use exact frames divided by FPS. The 375-frame video measures 12.500 seconds. |
| P1 | The portrait canvas extended outside the viewport and made the caption block unreachable. | Fit based on viewport dimensions, then assert that title, subject and caption were all dragged and serialized. |
| P1 | A bottom anchor could place the title over the caption. | Warn and reserve the lower caption band. Verified through the real anchor control and solver tests. |
| P1 | The Spanish and Danish stage markup lacked the canvas wrapper expected by fit-to-viewport. | Matched the localized canvas structure and reran export, expanded copy and mobile workflows in all three languages. |
| P2 | The suspense switch shot showed a dashboard, the reaction pose used an unsupported name and the report ending showed a generic power symbol. | Added a switch insert and floor shadow, used the named shocked pose, and replaced the report ending with a document checkmark. Reviewed decoded footage. |
| P2 | Very short holds and uniform caption treatments weakened visual differentiation. | Tuned the authored sequence to 2–3-second holds and gave suspense an unboxed, ruled caption. Independent score rose from 69 to 81. |
| Environment | Existing font and analytics GETs hit cloud certificate errors. | Confirmed affected hosts and verified the local browser workflow, production outputs and zero external writes. |

[Browser results](evidence/browser-results.json) · [Collision guide](evidence/collision.png) · [Contact sheet](SHOT_STORYBOARD.png)
