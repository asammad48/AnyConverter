---
name: anyconverter-pre-deploy-seo-verification
description: "Pre-deployment SEO verification gate for AnyConverter.io. Run before every production merge or Cloudflare Pages deploy. Use whenever the user says: deploy, release, merge to main, ship, publish, pre-deploy check, release gate, verify SEO, regression check. Produces PASS / FAIL / BLOCKED / NOT TESTED verdict per gate. No deploys or merges happen without explicit owner approval."
metadata:
  version: 1.0.0
  blocking: true
---

# AnyConverter — Pre-Deployment SEO Verification

Scope: the independent release gate that must pass before any merge to
`main` or Cloudflare Pages production deploy. Aligns with
`COMBINED_GROWTH_MASTER_PLAN.md` §18 release-gate matrix and the
`CLAUDE.md` project rules.

Related skills: `anyconverter-technical-seo`, `anyconverter-multilingual-seo`,
`anyconverter-internal-linking`, `seo-audit`, `seo-sitemap`, `seo-hreflang`.

## 1. When this skill runs

- Before any PR that modifies an `.html`, `.xml`, `_headers`, `_redirects`,
  `assets/js/shared.js`, `TOOL-INVENTORY.json`, or
  `RELATED_TOOLS_COMPLETE_MAPPING.json` file is approved.
- Before any manual or automated Cloudflare Pages promotion.
- Before any sitemap is submitted / resubmitted to Google.

## 2. Required inputs

1. Git branch + HEAD SHA.
2. List of changed files (`git diff --name-only $BASE..HEAD`).
3. Affected URLs — derived from changed files (tool paths, hubs, sitemap).
4. Locale coverage — the set of locales touched (EN / ES / DA).
5. Previous release's test artifacts for diff comparison.

If any input is missing, output `BLOCKED` with the exact missing item.
Do not guess.

## 3. Gate matrix

Every gate reports one of: `PASS`, `FAIL`, `BLOCKED`, `NOT TESTED`.

| # | Gate | Evidence required | Pass condition |
|---|---|---|---|
| G1 | Repo safety | `git status`, diff, branch/SHA | No unrelated work lost; branch is not `main` |
| G2 | Existing tests | `node tests/run_all_tests.js` + prior suite count | All previously-passing tests still pass |
| G3 | HTML validation | `npx html-validate "**/*.html"` on changed pages | No new errors; warnings triaged |
| G4 | Link integrity | `npx linkinator . --recurse` on changed sections | No new 404 / 500 / broken internal link |
| G5 | Functional E2E | Chrome DevTools / Playwright MCP run on affected tools | Correct output, errors, copy, download, reset |
| G6 | Multilingual regression | EN + ES + DA key journey tests + translation diff | No locale breakage; no EN leaked into ES/DA |
| G7 | Responsive UI | Widths 320 / 375 / 768 / 1024 / 1280 / 1920 / 2560 | No clipped menus, overflow, or unusable actions |
| G8 | Accessibility | Keyboard-only + screen-reader semantics + contrast ≥ 4.5:1 | No new critical a11y issue |
| G9 | Privacy / security | Grep event payloads + secrets scan | No PII / secrets in events or commits |
| G10 | Performance | Lighthouse or CWV diff vs baseline | LCP < 2.5s, INP < 200ms, CLS < 0.1; no material regression |
| G11 | SEO route invariants | Canonical / hreflang / sitemap / robots diff | All rules in `anyconverter-technical-seo` §1–§4 hold |
| G12 | Structured data | JSON-LD validity + visible-text parity | `WebApplication` present, `FAQPage` matches visible Q&A |
| G13 | Internal linking | Orphan scan + related-tool mapping consistency | No new orphan; mapping reciprocal where required |
| G14 | AdSense placement | Required slots render; no CLS induced | 3 slots per tool page, no policy violation |
| G15 | Rollback plan | Revert commit documented; CF Pages prior deployment reachable | Reversible safe release |

A single `FAIL` on G1–G13 blocks the release. `WARN`-level items from
`seo-audit` do not block but must appear in the handoff.

## 4. Automation hooks

Use existing project tools where available:

- Tests: `node tests/run_all_tests.js` (already permitted in
  `.claude/settings.local.json`).
- HTML validation: `npx html-validate "**/*.html"`.
- Link check: `npx linkinator . --recurse`.
- Local server: `npx serve . -p 3000`.
- Browser: Chrome DevTools MCP (slim, fast) for G5/G7/G10; Playwright MCP
  for multi-step interactive flows.
- GSC regression (optional, read-only): enable the `google-search-console`
  MCP profile and compare the last-7-day index-coverage snapshot vs today.

Capture evidence to `docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md`
with gate ID, command run, stdout excerpt, pass/fail, and timestamp.

## 5. Report template

```markdown
# Pre-deploy SEO verification — {{branch}} @ {{sha}}

Date: 2026-11-18T..Z
Changed files: N
Affected URLs: [...]
Locales touched: [en, es, da]

| Gate | Status | Evidence |
|---|---|---|
| G1 Repo safety | PASS | branch=feat/x; no uncommitted drift |
| G2 Existing tests | PASS | 142/142 |
| G3 HTML validation | PASS | 0 new errors |
| G4 Link integrity | FAIL | 3 broken: /es/pdf-merge/ → /pdf-split/ (should /es/pdf-split/) |
| G5 Functional E2E | NOT TESTED | Playwright MCP disabled this session |
| G6 Multilingual regression | WARN | ES body contains 2 EN strings on /es/csv-to-sql/ |
| ... | ... | ... |

## Verdict
BLOCKED — G4 has 3 broken internal links; fix before deploy.

## Rollback plan
Previous deploy: {{cf_pages_deployment_id}}; revert commit: {{sha}}.
```

## 6. Explicit refusal behavior

If a user requests a deploy / merge while any G1–G13 gate is `FAIL` or
`BLOCKED`:

1. State the exact failing gate(s) and evidence.
2. Do **not** run `git push`, `git merge`, or any Cloudflare Pages
   promotion command.
3. Offer: fix the failure, or escalate to the owner for an explicit
   override with the failure details attached.

## 7. Do not

- Do not mark a gate `PASS` without a captured command + output.
- Do not claim "Tests pass" as a general statement — cite the specific
  suite and count.
- Do not deploy, push to `main`, or submit sitemap without explicit
  owner approval, even if every gate is green.
- Do not use `--no-verify` to bypass hooks. Fix the root cause.
- Do not treat `WARN` as equivalent to `PASS`. Record and review.
