**Goal:** Produce a clear pass or fail the parent can gate on: zero unresolved blocker or major findings, and every required check succeeding.

**Scope:** Re-read the locked `${WORK_ITEM_REF}`, re-inspect `${CHANGE_SCOPE}`, and re-run required checks as needed. Do not start new feature work. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The task output states `PASS` or `FAIL` in those words. Pass is allowed only with zero unresolved blocker or major findings and all required checks succeeding. A required check that could not be run is a fail.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title. Confirm the current change still matches `${CHANGE_SCOPE}`.
- Confirm every blocker and major finding is resolved against the current change, not against an earlier snapshot.
- Re-run required checks if they have not been run against the final change. Record each check name, command, and outcome. Treat `not run` as fail.
- Print a gate block the parent can use:

```text
Review outcome: PASS | FAIL
Work item:      <exact title>
Change scope:   <locked scope>
Blockers open:  <n>
Majors open:    <n>
Required checks: <each check: pass | fail | could not run>
Unresolved:     <none | list>
```

- If the outcome is FAIL, say what must be fixed before the delivery-verification gate can pass. Do not proceed as if the gate passed.
