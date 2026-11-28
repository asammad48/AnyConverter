# Revised Phase 04 browser compatibility

| Engine | Browser-native run | Archive and Canvas proof |
| --- | --- | --- |
| Chromium 156 | WebCodecs VP8/Opus | Six actions, random seeks, exact RGBA recovery, nested group and geometry, all aspect ratios |
| Firefox 157 | WebCodecs VP8/Opus | Same six-action authoring, seek and recovery workflow |
| WebKit 27.2 | WebCodecs VP8/Opus | Same six-action authoring, seek and recovery workflow |
| Firefox 157 with WebCodecs disabled in the browser profile | MediaRecorder realtime export | Same authoring and recovery workflow. The decoded artifact is variable-rate VP8 video without an audio stream. The default WebCodecs path produced audible Opus in all three engines. |

Firefox initially lacked writable profile directories and crashed in this container when writing user namespace maps. The verification used workspace-local XDG directories and Firefox's test-process content-sandbox setting. Firefox's PNG bytes differed across contexts, so the recovery regression compares decoded Canvas RGBA directly. WebKit needed Playwright's browser download plus Debian shared libraries extracted to the workspace. Its launcher was pointed at those libraries. These are local browser-runner changes. The Studio still uses native browser APIs.

Browser case failures and unavailable launches exit the harness nonzero. An attempted MediaRecorder audio extension did not return a download within the browser test timeout. The attempted change was reverted and the original video fallback was retested. No physical-device testing was performed. The legacy archive comparator separately verified three sampled frames per accepted Phase 01–03 archive against the pinned Phase 03 audit baseline.

[Chromium result](revised/repair-browser-chromium.json) · [Firefox result](revised/repair-browser-firefox.json) · [WebKit result](revised/repair-browser-webkit.json) · [Firefox realtime result](revised/repair-browser-firefox-realtime.json) · [Realtime video](revised/sequential-actions-firefox-realtime.webm) · [Unsuccessful audio attempt](revised/realtime-audio-attempt.json) · [Encoded streams and timing](revised/repair-media.json) · [Legacy archive regression](revised/legacy-archive-regression.json)
