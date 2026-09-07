# Phase 02 · Day 12: Specify Browser hub implementation

**Phase timeline preserved from the source report:** Weeks 2-3. **Planning unit:** one focused workday.

## Objective and end-of-day outcome

Complete **specify browser hub implementation**. End the day with **An approved implementation or hold decision with exact affected paths.** This brief authorizes preparation, research, validation, and the explicitly described later-roadmap work only; it does not authorize inventing results or silently widening scope.

## Why this matters

This work converts a phase-level recommendation into a reproducible decision. It prevents a later coding agent from treating repository intent as deployed truth, treating missing console data as zero, or implementing a change before its dependencies and rollback are understood.

## Sources and exact inspection scope

- **Source of truth:** [`../phase-02-architecture-internal-linking.md`](../phase-02-architecture-internal-linking.md).
- **Repository context:** `README.md`, `SEO_SPEC.md`, `PERFORMANCE.md`, `TOOLS_SPEC.md`, `sitemap.xml`, `robots.txt`, and the applicable phase overview.
- **Inspect exactly:** Day 05 spec; Browser/Device tool pages; `sitemap.xml`; `_redirects` only if approved.
- **External surfaces, only when access is authorized:** Deployed pages and GSC link/index evidence when authorized.
- Record URLs as absolute production URLs (`https://anyconverter.io/...`) and repository paths as root-relative paths. Record selectors as stable CSS selectors; if none exists, record the heading text and DOM ancestry rather than inventing an ID.

## Prerequisites and dependencies

- Read [`day-11.md`](day-11.md) and its evidence log before starting.
- Phase 02 consumes the accepted outputs named in the root [dependency matrix](../README.md#cross-phase-dependency-matrix). If any required milestone is missing, continue only with work that does not depend on it.
- Preserve existing URLs and the report’s original timeline. Do not execute unrelated roadmap fixes while gathering evidence.
- Console credentials, production deployment rights, paid-tool access, and native-speaker availability are **not assumed**.

## Research questions

1. Which cluster best matches the user’s next task?
2. Can the goal be met without changing an existing URL?
3. Is every proposed link useful, crawlable, and accurately labeled?
4. Which exact artifact will let the next agent reproduce the conclusion?

## Ordered execution plan

1. **Research/decision** — Open the phase overview, prior evidence, and every repository path named above; write the scope, timestamp (UTC), branch/commit, and assumptions into a copy of [`../templates/evidence-log.md`](../templates/evidence-log.md).
2. **Repository change** — Locate the exact page, selector, configuration key, report row, or URL involved. Preserve raw observations separately from interpretation.
3. **Research/decision** — Resolve hub URL.
4. **Research/decision** — define navigation placement and child pages; document sitemap/canonical impact; hold if ownership or migration evidence is missing.
5. **External-console action** — If authorized, collect the named console/deployed evidence with property, filters, dates, and export filename. Otherwise add a `pending — access unavailable` evidence row and continue with the local preparation.
6. **Manual browser validation** — Serve the site locally, open the affected desktop and 360px-wide views, perform the relevant task with synthetic/non-sensitive data, and record URL, viewport, visible result, console errors, and network observations.
7. **Stakeholder/native-speaker review** — Request the appropriate engineering, security/privacy, product, or native-language sign-off when the decision depends on expertise or language quality. Record reviewer and date; if unavailable, keep the decision pending.
8. **Repository change** — Store the resulting plan/report in the location chosen by the executing team, link its evidence, and update the handoff. Do not alter production SEO/product behavior merely to complete this documentation day.

## Verification

Run from the repository root; adapt the local port only if `server.js` documents a different one.

```bash
git diff --check
python3 - <<'PY'
from pathlib import Path
for p in ['robots.txt','sitemap.xml','sitemap.xml']:
    assert Path(p).exists(), p
print('required local inputs present')
PY
python3 - <<'PY'
from pathlib import Path
from xml.etree import ElementTree as ET
ET.parse('sitemap.xml')
print('sitemap XML parses')
PY
```

Manual checks:

- Confirm each evidence row distinguishes `observed`, `pending`, `unknown`, and `not applicable`.
- Confirm browser findings identify the exact URL, viewport, action, selector/heading, and observed result.
- Confirm external screenshots/exports omit credentials and user content and are stored only in an approved location.
- Confirm no claim about rankings, demand, indexing, translation quality, CWV, or outreach exists without the required source.

## Deliverables

- The end-of-day outcome stated above, with an owner and UTC observation date.
- A completed evidence log using [`../templates/evidence-log.md`](../templates/evidence-log.md).
- Raw command output or console export references sufficient to reproduce each accepted fact.
- A blocker/decision entry for every unavailable prerequisite; blank fields are not acceptable.
- A concise handoff for [`day-13.md`](day-13.md).

## Acceptance criteria

- [ ] Every inspected item is identified by exact repository path, production URL, report name, configuration key, or selector/heading.
- [ ] Each conclusion links to evidence and states whether it describes local, deployed, or external-console state.
- [ ] The end-of-day outcome is complete and reproducible; unavailable observations are `pending` or `unknown`, never guessed.
- [ ] Actions are labeled with one of the five required action classes.
- [ ] No roadmap implementation outside this day’s explicit scope was performed.
- [ ] Risks, owner, next action, and rollback/containment are recorded for every blocking or high-impact decision.

## Risks, rollback, and blocking conditions

- **Evidence drift:** deployed pages and consoles can change after capture. Mitigate with UTC timestamps, immutable exports, and commit hashes.
- **Scope drift:** investigation can become an unreviewed SEO implementation. Roll back any accidental product/config edits and retain only evidence/documentation.
- **Sensitive data:** never place credentials, query exports containing personal data, uploaded files, JWTs, IPs, or PDF contents in Git. Delete unsafe artifacts and rotate exposed credentials through the responsible owner.
- **False certainty:** local HTML, `curl`, or static fetch cannot prove Google indexation, field CWV, JS-injected schema, translation quality, demand, or outreach success.
- **Block the decision** when its authoritative source is unavailable, observations conflict, a trust/security test fails, native review is required but absent, or ownership/rollback is undefined. Nondependent preparation may continue.

## Handoff to the following day

Pass to [`day-13.md`](day-13.md): the decision summary, evidence-log path, raw artifact references, exact known/unknown list, unresolved blockers with owners, files/URLs/selectors inspected, and the first safe next command. State explicitly whether downstream work is **unblocked**, **partially unblocked**, or **blocked**.

## Evidence contract

| Contract field | Requirement for Day 12 |
|---|---|
| Required evidence | Direct observations for the stated outcome: file excerpts/diffs and command output for repository facts; URL/status/render captures for runtime facts; dated exports/screenshots for console facts; named review for judgment-dependent facts. |
| Authoritative source | Repository behavior/configuration for implementation facts; the deployed URL for deployed behavior; GSC/analytics/CrUX for their own metrics; official specifications for standards; qualified native speaker for language quality; designated security/product owner for risk acceptance. |
| Local or external | Repository inputs are local. Deployment, consoles, field metrics, search-demand sources, and stakeholder/native review are external. Keep the two evidence classes separate. |
| Decision threshold | Accept only when all acceptance checks are met and every material claim has direct, reproducible evidence. A sample supports only a sample-level conclusion. Security/privacy fails on any demonstrated leakage; launch decisions require all mandatory gates. |
| Fallback without evidence/access | Complete local inventory, exact console/browser procedure, expected export fields, and blocker entry. Mark the result `pending` or `unknown`; do not substitute historical reports as current truth. |
| Must remain unknown | Current Google-selected canonical/index status, current GSC/analytics values, search demand, field CWV, translation quality, deployed network behavior, and outreach outcomes unless observed in their authoritative source during this day. |
