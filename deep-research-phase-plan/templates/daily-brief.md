# Phase NN · Day NN: Descriptive title

> Copy this template; replace every instructional sentence with day-specific content. Do not leave bracket tokens in an active brief.

## Objective and end-of-day outcome
State one objective and one concrete artifact/decision that must exist by end of day.

## Why this matters
Connect the day to the phase exit criteria and name the failure it prevents.

## Sources and exact inspection scope
- Source phase overview and prior evidence
- Exact repository files/configuration keys/reports
- Exact production pages/URLs and DOM selectors or heading ancestry
- Exact external console/report and date/filter requirements

## Prerequisites and dependencies
List accepted inputs, owners/access needed, cross-phase milestones, and what can proceed when a dependency is missing.

## Research questions
Use answerable questions whose decisions are tied to the evidence contract.

## Ordered execution plan
Number every step and prefix it with exactly one classification:
`Repository change`, `External-console action`, `Research/decision`, `Manual browser validation`, or `Stakeholder/native-speaker review`.

## Verification
Provide runnable commands with expected results plus concrete desktop/mobile/manual checks.

## Deliverables
List paths/artifacts, owners, evidence references, and status vocabulary.

## Acceptance criteria
Use objective pass/fail checks; never accept a blank as zero or a missing source as proof.

## Risks, rollback, and blocking conditions
Name security/privacy, evidence drift, scope, deployment, and review risks; define containment and stop conditions.

## Handoff to the following day
Name the next brief and pass evidence, knowns/unknowns, blockers/owners, and first safe action.

## Evidence contract
| Contract field | Requirement |
|---|---|
| Required evidence | Direct artifact(s) needed to decide. |
| Authoritative source | System or reviewer authoritative for the fact. |
| Local or external | Repository-local, external, or both—kept separate. |
| Decision threshold | Minimum evidence and pass/fail rule. |
| Fallback without evidence/access | Local preparation plus `pending`/`unknown`. |
| Must remain unknown | Facts that cannot be inferred from available evidence. |
