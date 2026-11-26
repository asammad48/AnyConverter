# AGY — Phase Repair, Approval and Push Commands

## Rule of engagement

AGY runs one visual phase at a time. The owner may reject a phase as many times as needed. The agent MUST fix all issues in that SAME phase, regenerate evidence and stop. **NO `git push` until the owner explicitly finalizes the phase and authorizes push.** No merges or deployments without separate owner approval.

## 1. User sends a phase-specific rejection

```text
PHASE [NN]: REJECTED. The following outputs are not acceptable:
[Paste ALL faults after watching the actual export, e.g. tiny text, wrong focus,
boring pacing, misspelled word, unintended cropping, poor 3D shading, broken audio.]
AGY: work ONLY on Phase [NN]. Reproduce each issue in localhost from the real UI.
For each defect, identify source, fix design/editor/render parity, rerun and regenerate
full exported media. Fix ALL listed issues before asking for approval again.
Give old/new evidence, one consolidated report and updated creative scorecard.
DO NOT PUSH, create remote PR, merge, deploy, or start Phase [NN+1].
```

## 2. Owner requests one more quality pass without adding new requirements

```text
PHASE [NN]: QUALITY PASS AGAIN. Re-watch full export and compare keyframes against
reference brief. Fix weak hierarchy, repetitive scenes, pacing, inconsistent
motion or typography, bad framing, and visual distractions. Keep changes in Phase
[NN] only, test real UI, re-export, reopen/edit/re-export, return evidence.
NO PUSH OR NEXT PHASE until I approve.
```

## 3. Explicit owner phase acceptance / permission to push

```text
PHASE [NN]: APPROVED FOR PUSH. I reviewed real video and still evidence and
accept this phase. You may push ONLY finalized Phase [NN] commits to the named
visual-quality feature branch. Confirm remote SHA. Do NOT merge or deploy.
Stop afterwards. Do NOT begin Phase [NN+1] until I explicitly instruct you.
```

## 4. Explicit next-phase kickoff (separate instruction)

```text
PHASE [NN+1]: START. Phase [NN] is finalized. Read the master file and the
Phase [NN+1] Markdown file. Implement ONLY that phase, test real localhost output,
fix all problems in-phase, return playable evidence, await my review.
DO NOT PUSH Phase [NN+1] until I finalize and authorize it.
```

## 5. Rejection of misleading evidence

```text
PHASE [NN]: EVIDENCE REJECTED. A unit test, magic bytes, frame count,
prebuilt sample or direct render callback is not proof that the user can
create professional visuals. Rebuild the demonstration from the actual
localhost UI, export the entire piece, inspect decoded visuals and show
save/reopen/edit. Keep phase open and do NOT PUSH.
```
