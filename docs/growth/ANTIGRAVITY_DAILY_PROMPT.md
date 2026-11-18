# Antigravity Daily Prompt — AnyConverter Growth Program

**Owner:** send one of these prompts at the start of each working session.
Antigravity is already configured to read `AGENTS.md` and
`.ai-memory/{STATE,HANDOFF,PROJECT,ARCHITECTURE,DESIGN,DECISIONS}.{json,md}`
at the start of every task, so the prompts stay short.

---

## Prompt A — Standard daily prompt (copy-paste, no edits needed)

```
Continue the AnyConverter.io Growth Program.

1. Discovery first (per AGENTS.md §3):
   - Read .ai-memory/STATE.json → growthProgram.currentSprint.
   - Read .ai-memory/HANDOFF.md → Phase 38 Growth Program Handover section.
   - Read docs/growth/60_DAY_AGGRESSIVE_PLAN.md → find the sprint card
     matching STATE.json growthProgram.currentSprint.id.
   - Read .agents/skills/anyconverter-*/SKILL.md for the skills this
     sprint needs.
   - Run `git status` and confirm the active branch matches the sprint’s
     feature branch; if the branch does not exist, create it from a
     fresh checkpoint off main (do not stack on unrelated feature
     branches).
   - Run `node .agents/scripts/switch-profile.js status` and switch to
     the MCP profile this sprint needs.

2. Execute the current sprint card exactly as written.
   - Respect every guardrail in STATE.json growthProgram.guardrails.
   - No fabricated numbers. Label missing data UNKNOWN.
   - Preserve EN/ES/DA tool algorithms, URLs, canonicals, hreflang,
     schema while making changes.

3. Pre-deploy gate before any merge:
   - Run .agents/skills/anyconverter-pre-deploy-seo-verification/SKILL.md
     against the feature branch.
   - Record evidence in docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md
     with explicit PASS / FAIL / BLOCKED / NOT TESTED per gate.
   - Do not merge or deploy without my explicit approval on the gate
     report.

4. End-of-session persistence:
   - Update .ai-memory/STATE.json growthProgram.currentSprint with
     today’s progress, remaining blockers, and the next sprint id
     when done.
   - Update .ai-memory/HANDOFF.md with a concise handoff.
   - Record any architectural choice in .ai-memory/DECISIONS.md.

Deliverable for me at the end of this session:
   - A short status comment (shipped / blocked / deferred) per sprint
     task.
   - The exact approvals you need from me to continue tomorrow.
   - Any evidence or report paths I should open.

Do not: deploy, merge to main, send outreach, post to communities,
submit to extension stores, spend on paid APIs, or make scaled
translations without my explicit approval.
```

---

## Prompt B — Short daily prompt (if you want a quick ping)

```
Continue AnyConverter Growth Program. Read .ai-memory/STATE.json and
docs/growth/60_DAY_AGGRESSIVE_PLAN.md; execute the current sprint card;
honor STATE.json growthProgram.guardrails; end with a status comment
and the exact approvals you need from me.
```

---

## Prompt C — Sprint-ship day prompt (when a sprint is ready to ship)

```
Ship-day for the current sprint.

1. Confirm all Day-1 build work is committed on the feature branch.
2. Run the full pre-deploy gate per
   .agents/skills/anyconverter-pre-deploy-seo-verification/SKILL.md
   and capture evidence per gate into
   docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md.
3. Produce the owner-approval package:
   - branch + HEAD SHA
   - changed files
   - gate report
   - rollback plan (prior Cloudflare Pages deployment ID + revert commit)
4. Do not merge or deploy until I reply APPROVED with the gate report
   referenced. On approval: merge, verify Cloudflare Pages promotion,
   run a 5-minute prod smoke test (homepage + 3 affected tools in
   EN/ES/DA), and update STATE.json + HANDOFF.md.
```

---

## Prompt D — When a sprint is blocked on me (user action)

```
Current sprint is blocked. Read STATE.json
growthProgram.currentSprint.blockers and reply with:
1. The exact user-side action needed, step by step.
2. Any parallel work from the 60-day plan you can safely do without
   unblocking (non-destructive, no outreach, no deploy). Propose a
   max 1-sprint side task.
3. Nothing more. Do not start the side task until I say go.
```

---

## Notes for the owner

- **One prompt per session is enough.** Antigravity will self-orient
  from `STATE.json` and `HANDOFF.md`, which are updated at the end of
  every session.
- **When the current sprint id changes**, no change to the prompt is
  needed — it reads the id from `STATE.json`.
- **If you want to jump sprints** (e.g. priority shift), edit
  `.ai-memory/STATE.json` → `growthProgram.currentSprint.id` to the
  desired id from `docs/growth/60_DAY_AGGRESSIVE_PLAN.md`, then send
  Prompt A.
- **Reply shortcuts** when Antigravity asks for approval:
  - `APPROVED <sprint-id> gate report at <path>` → it may merge + deploy.
  - `REJECTED <reason>` → it fixes and re-runs the gate.
  - `DEFER <sprint-id>` → it rolls the sprint forward and picks the
    next unblocked card.
