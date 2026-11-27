# Archive recovery and text edits

The workflow downloaded `fun.acstudio`, created a fresh Chromium browser context, selected the archive from Studio’s file input, and located the word-pop caption cue in the inspector. It changed “First rule: no more meetings.” to “Règle un: ingen møder i caféen.” and confirmed that the effect still read as word pop before pressing Export Video. The displayed lines are visible at the same decoded frame in both versions. [Archive](evidence/fun.acstudio) · [Before](evidence/fun.webm) · [Edited re-export](evidence/fun-edited.webm) · [Frame comparison](evidence/REOPEN_EDIT.png)

A second isolated context reopened the Danish product archive, changed the wording to “Vælg fem kilder.” and “Gennemgå rapporten på ét sted.”, and retained the line reveal. [Danish archive](evidence/product-da.acstudio) · [Edited Danish export](evidence/product-da-edited.webm) · [Decoded edited frame](evidence/product-da-edited-65.png)

The legacy regression reopened Phase 01 and Phase 02 archive fixtures, sampled frame 30, and compared clean still downloads against the pinned baseline. [Legacy comparison hashes](evidence/browser-regression.json)
