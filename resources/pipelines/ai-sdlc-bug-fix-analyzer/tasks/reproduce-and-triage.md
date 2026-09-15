**Goal:** Reproduce the locked defect in a safe environment, or state explicitly that reproduction is impossible and why.

**Scope:** Investigate the locked `${BUG_REPORT}` only. Do not change production code. Do not apply a fix. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Numbered reproduction steps exist that a stranger can follow to see the same failure, or impossibility is stated with a concrete reason (missing environment, missing data, intermittent without a captured trigger, or access limits). Observed versus expected behaviour is recorded from evidence.

**Instructions:**

- Reread the locked `${BUG_REPORT}`. If that locked value is unavailable, repeat resolution rather than guessing. Stay on this defect; do not switch to a different visible failure.
- Reproduce in a safe environment. Do not use production write paths to hunt for the failure. Do not change production code to investigate.
- Record numbered steps from named preconditions, plus the evidence (quoted errors, log lines, or UI text). Cite the spec or contract for expected behaviour when one exists; otherwise state expected behaviour as an assumption.
- If reproduction is impossible, say so explicitly and why. Do not treat an unreproduced stack trace or "works on my machine" as a reproduction.
- Report observed versus expected behaviour, impact you can actually observe, and the reproduction outcome. Do not propose a fix in this task.
