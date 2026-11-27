# Production browser journey

Chromium ran the repository's static site at `http://localhost:3000/creative-studio/`. Playwright used the normal controls for each operation. The trace includes pointer, selection, download and UI snapshots. [Playwright trace](evidence/browser-trace.zip) · [Reproduction script](scripts/browser.js)

1. Opened Composition layout from the inspector. Selected Hero, Comparison and Statistic and downloaded PNGs through Export PNG.
2. Used Art Direction, Active Shot, Layout, Headline, Subhead and Duration to author dialogue, suspense and product sequences. Shot holds were 60–90 frames. Exported the wide sequences using Export Video and changed each preview to 1080 × 1920 for another still.
3. Set the dialogue title to “Let the room talk,” its caption to “Keep the conversation moving. Give everyone a clear next step,” and selected the large pose. Turned guides on and selected the Bottom anchor for the title to exercise collision handling. Returned the anchor to Free and dragged all three blocks. The packed archive confirmed all three positions. Set the subject depth to Foreground.
4. Exported with guides on and off, checked exact pixel identity, and exported square and full-HD stills. Saved the project from Save .acstudio and rendered the portrait movie through Export Video.
5. Opened separate English, Spanish and Danish pages at a 375 × 900 viewport, used the mobile shot inspector, entered long localized headlines and captions, selected the large pose, switched to square and back, and exported clean portrait PNGs.

The final browser run recorded zero uncaught page errors and zero external write requests. Existing Google Fonts and Google Tag Manager GETs hit certificate errors in the cloud browser. The composition uses the system font and the exports completed locally. [Browser results](evidence/browser-results.json) · [Locale and legacy results](evidence/locale-and-legacy-results.json)

[Collision screenshot](evidence/collision.png) · [Full canvas with guides](evidence/canvas-guides.png) · [Desktop UI](evidence/portrait-guides.png) · [Mobile EN](evidence/mobile-en.png) · [Mobile ES](evidence/mobile-es.png) · [Mobile DA](evidence/mobile-da.png)
