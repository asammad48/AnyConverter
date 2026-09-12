# Phase 04 All-Days Execution Prompt

Generated: 2026-09-12

Use this prompt to run Phase 04 end to end in one pass.

## Role

You are implementing Phase 04: Performance, Privacy, and Release Gates for AnyConverter. Work in the local static site repository. Do not move URLs. Do not make production traffic, ranking, field CWV, analytics, or Google-selected canonical claims unless current external evidence is available. Do not claim secure redaction; use Blackout PDF or visual blackout language until true redaction is implemented and verified. Treat ES/DA copy quality as pending native review.

## Scope

Priority URLs:

- `/`
- `/pdf-merge/`
- `/pdf-compress/`
- `/image-converter/`
- `/json-formatter/`
- `/word-counter/`
- `/typing-speed-test/`

Phase 03 carryover priority pages for privacy/dependency inventory:

- `/organize-pdf/`
- `/jpg-to-pdf/`
- `/pdf-to-jpg/`
- `/ocr-pdf/`
- `/redact-pdf/`
- `/pdf-security/`
- `/csv-to-sql/`
- `/csv-query/`
- `/jwt-decoder/`
- `/regex-tester/`
- `/hash-generator/`
- `/base64-encoder/`
- `/url-encoder/`
- `/cron-expression-parser/`

## Execute All Days

1. Day 01: Define the repeatable measurement protocol.
   - Separate lab evidence from field evidence.
   - Record device, viewport, network assumptions, browser, run count, and exact commands.
   - Use Core Web Vitals thresholds: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile when field data is available.

2. Day 02: Collect local lab baseline.
   - Run Lighthouse on the seven priority URLs.
   - Store JSON artifacts under `output/lighthouse/`.
   - Report LCP, CLS, TBT, performance, SEO, and best-practices scores.
   - Mark local lab results as non-production and non-field.

3. Day 03: Collect or document external evidence.
   - Check whether GSC, analytics, CrUX/PageSpeed field data, and Google-selected canonical data are available.
   - If unavailable, log as access blocker and do not invent results.

4. Day 04: Build the heavy-library loading matrix.
   - Identify every CDN/tool dependency per priority and carryover page.
   - Confirm heavy libraries are not loaded on unrelated priority pages.
   - Prefer lazy-loading for PDF/CSV/OCR libraries where safe.

5. Day 05: Build the third-party request inventory.
   - Record page, resource host, purpose, initiator, data class, consent requirement, and owner.
   - Distinguish first-load resources from resources triggered only after a workflow starts.

6. Day 06: Audit privacy/security claims.
   - Replace absolute claims such as "100% private", "never leaves", "we cannot see", and SRI claims unless proved for the exact workflow.
   - Use precise wording: "designed to process selected file/text content in the browser" and disclose third-party resources.

7. Day 07: Implement lazy-loading/code-splitting fixes.
   - Remove heavy libraries from first-load HTML where they are only needed after user action.
   - Keep user-visible failure handling when a CDN dependency cannot load.

8. Day 08: Add automatable SEO release gates.
   - Check robots, sitemap, canonical, noindex, hreflang, JSON-LD, deferred scripts, and local links.
   - Exit non-zero on critical failures.

9. Day 09: Add product/browser gate.
   - Smoke desktop and mobile viewports.
   - Check core selectors, basic workflows, console/page errors, JSON-LD validity, and horizontal overflow.

10. Day 10: Define privacy-safe analytics.
    - Allowed events: `tool_open`, `input_added`, `conversion_started`, `conversion_success`, `conversion_error`, `download_started`, `copy_result`, `related_tool_clicked`, `language_changed`.
    - Allowed properties: `tool_name`, `tool_category`, `page_language`, `device_class`.
    - Prohibited data: file names, file contents, pasted text, IPs, passwords, JWTs, PDF contents, image contents, CSV rows, and raw user input.

11. Day 11: Set budgets and decision thresholds.
    - Block release on SEO gate failures, browser gate failures, LCP > 2.5s, CLS > 0.1, or missing privacy review for changed claims.
    - Warn on Lighthouse performance score < 0.9 or TBT > 200ms unless numeric CWV-style budgets pass and a product owner accepts the risk.

12. Day 12: Write release and rollback runbook.
    - Prefer Thursday or Friday daytime releases.
    - Define owner, observation window, rollback triggers, and evidence capture.

13. Day 13: Dry-run the gates.
    - Run the gates locally and distinguish true page failures from tooling defects.
    - Log any remaining external-data blockers.

14. Day 14: Publish the handoff packet.
    - Include command results, changed files, unresolved dependencies, and Phase 05 recommendations.

## Required Commands

```powershell
node server.js
node tools\phase04-seo-release-gate.js
$env:NODE_PATH='C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\phase04-browser-gate-runner.js
node tools\phase04-third-party-inventory.js
npx --yes lighthouse "http://localhost:5000/" --quiet --preset=desktop --chrome-flags="--headless" --only-categories=performance,seo,best-practices --output=json --output-path="output\lighthouse\phase04-desktop-home.json"
```

Repeat the Lighthouse command for the remaining six priority URLs.
