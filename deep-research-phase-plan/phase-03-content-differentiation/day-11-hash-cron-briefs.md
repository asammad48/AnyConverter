# Phase 03 Day 11 - Hash And Cron Briefs

Generated: 2026-09-10

## Objective

Create rewrite briefs for `/hash-generator/` and `/cron-expression-parser/`.

## `/hash-generator/` Brief

Verified tool facts:

- Text and file inputs are supported.
- SHA-1, SHA-256, and SHA-512 use the browser Web Crypto API.
- MD5 is implemented locally in JavaScript.
- File mode reads bytes with `file.arrayBuffer`.
- UI includes uppercase output and live hash controls.
- Copy buttons are available.

Engineering review item:

- File MD5 correctness needs validation before copy claims that compare it to standard command-line MD5 output. The implementation routes file bytes through local MD5 text logic, so Phase 04 should test known file fixtures before publishing file-MD5 examples.

Recommended intro:

`Use Hash Generator to calculate hashes for text or files in your browser. Generate SHA-1, SHA-256, SHA-512, or MD5 output, switch casing when needed, and copy the hash for comparison.`

Trust wording:

- Hashes can verify equality or detect changes; they do not encrypt content.
- Avoid recommending MD5 for security-sensitive integrity checks.
- Prefer SHA-256 examples for modern checksum copy.

Practical example:

`Example: Drop a downloaded file into the tool, generate SHA-256, and compare it with the checksum published by the source. If the strings differ, do not trust that file copy.`

## `/cron-expression-parser/` Brief

Verified tool facts:

- Parses exactly five fields: minute, hour, day, month, weekday.
- Uses `cronstrue.toString` when the library is loaded.
- Shows field breakdown in the UI.
- Preset buttons populate common expressions.
- Errors when the expression does not have exactly five fields.

Recommended intro:

`Use Cron Expression Parser to read a five-field cron schedule in plain English. Enter minute, hour, day, month, and weekday fields, then check the field breakdown and generated description.`

Practical example:

`Example: Enter `0 9 * * 1-5` to describe a weekday 9:00 schedule, then verify each field before using it in a server or automation config.`

Limits:

- Five-field cron only.
- Do not claim seconds, year, Quartz, systemd timer, or timezone support unless added.
- The parser explains expressions; it does not schedule jobs.

## Day 11 Handoff

Phase 04 can safely write `/cron-expression-parser/` copy now. `/hash-generator/` should get a small fixture test before publishing file-hash examples, especially for MD5.
