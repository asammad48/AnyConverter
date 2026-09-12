# Evidence log

## Run metadata

| Field | Value |
|---|---|
| Phase / day | Record the phase and day identifier |
| Owner / reviewer | Record accountable people or `pending — unassigned` |
| UTC started / completed | ISO-8601 timestamps or `pending — not completed` |
| Git branch / commit | Exact branch and SHA examined |
| Environment | Local, preview, production, or named external console |
| Scope | Exact files, URLs, selectors, reports, filters, and date ranges |

## Evidence entries

Allowed statuses: `observed`, `pending`, `unknown`, `not applicable`. A blank never means zero, absent, or passing.

| ID | Action class | Claim/question | Status | Local or external | Authoritative source | Exact evidence/artifact reference | Observation (not inference) | Decision threshold/result | Owner/UTC | Fallback or next action |
|---|---|---|---|---|---|---|---|---|---|---|
| E-001 | Research/decision | Record a concrete claim or question | pending | State one | Name the authoritative system/document/reviewer | Command and output path, URL/export, or review record | Record only what was directly observed | State pass/fail threshold and current result | Assign owner/date | State safe procedure or blocker |

## Decision record

| Decision | Evidence IDs | Outcome | Confidence boundary | Approver / UTC | Rollback or containment |
|---|---|---|---|---|---|
| Record the decision being made | Cite rows above | accepted, rejected, held, or inconclusive | State what the evidence does not prove | Named approver or `pending` | Exact reversal/containment steps |

## Unknowns and blockers

| Unknown/blocker | Why it cannot be inferred | Required source/access | Owner | Unblocks | Safe work that can continue |
|---|---|---|---|---|---|
| Record every material gap | Explain the evidence boundary | Name exact console, export, test, or reviewer | Assign or mark unassigned | Name downstream day/milestone | Name preparation that does not assume the result |

## Handoff

State known facts, facts that remain unknown, artifact locations, changes/rollbacks, review status, downstream state (`unblocked`, `partially unblocked`, or `blocked`), and the first safe next command.
