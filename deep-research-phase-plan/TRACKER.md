# Execution tracker

Use [`execution-tracker.csv`](execution-tracker.csv) to assign and track the 98 daily briefs. The text-based tracker has:

- one row per daily file;
- the exact daily-brief and phase-overview filenames;
- a ready-to-copy, day-specific prompt for Codex;
- status, owner, UTC date, evidence/PR, blocker, and notes fields;
- a `Status` field using `Not started`, `In progress`, `Blocked`, `Done`, or `Skipped`;
- standard CSV formatting that can be opened in a spreadsheet application or reviewed directly in Git.

The CSV is the only tracker source, so status changes and notes remain reviewable without committing a binary workbook.

## How to use each prompt

1. Filter to the earliest `Not started` row whose dependencies are available under the main README's next-unblocked-day rules.
2. Copy the complete **Prompt for Codex** cell into a new Codex task.
3. Give Codex repository and authorized console access appropriate for that daily brief.
4. Change the row to `In progress`; add owner and start time in UTC.
5. On completion, link evidence or the pull request, record blockers/notes, and use `Done` only after every acceptance criterion in the daily brief passes.
6. If authoritative evidence is unavailable, use `Blocked` or retain `In progress`; never replace an unknown external fact with an assumption.

The tracker begins with every row at `Not started`. It does not claim that any SEO roadmap action has been performed.
