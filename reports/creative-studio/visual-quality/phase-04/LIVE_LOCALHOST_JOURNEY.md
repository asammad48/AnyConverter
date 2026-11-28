# Production editor journey

URL used for authoring and proof was `http://localhost:3000/creative-studio/`. Browser automation acted on the production UI. Canvas captures read the production canvas. Exact frame jumps used the existing range control's input event. Keyframe time was dragged with the pointer.

1. Opened Motion graph, captured the original opening, selected Motion showreel, and used End on the timeline to seek directly to frame 599 before playback.
2. Applied staggered cards to CSV, JSON, PDF, YAML and SQL. Applied underline draw to CSV as its second preset. Dragged the second underline key to frame 48.
3. Scrubbed in mixed order, switched the underline from linear to exponential easing, and compared frame 35. Enabled diagnostics and toggled reduced preview.
4. Changed the courier caption in the shot inspector and assigned the Shocked action with a 27-frame start and 41-frame duration. The motion diagnostic reads `shock` at project frame 300. Five caption clips and four audio clips are present in the timeline.
5. Downloaded two matching exports through the Video button, the second while reduced preview was on. Saved through the .acstudio button. Opened the archive in a separate browser context and re-exported with the CSV curve changed to Hold.
6. Opened the EN, ES and DA pages, selected the showreel and tested 1280×720, 1080×1920, and 1080×1080 for each locale.

The browser log contains no uncaught page errors or external writes. Existing Google Fonts CSS and Tag Manager requests failed certificate validation in this environment. The Studio's self-hosted composition fonts loaded. The trace captures browser actions and resource events. Separate screenshots show the editor and stage.

[Browser trace](evidence/browser-trace.zip) · [Inspector](evidence/motion-editor.png) · [Stage](evidence/editor-stage.png) · [Browser results](evidence/browser-results.json) · [Locale and ratio contact sheet](evidence/LOCALES_AND_FORMATS.png) · [Reproduction script](scripts/browser.js)
