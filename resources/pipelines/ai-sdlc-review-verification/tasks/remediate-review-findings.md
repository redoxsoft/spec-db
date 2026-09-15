**Goal:** Fix every unresolved blocker and major finding inside the locked change scope, then re-run the checks those findings required.

**Scope:** Edit code and tests only within `${CHANGE_SCOPE}` as needed to resolve blocker and major findings against `${WORK_ITEM_REF}`. Do not expand into unrelated cleanup. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Each blocker and major finding is either fixed and re-checked, or still listed with evidence why it remains. Minor findings may stay deferred. Required checks that apply to the remediations were re-run.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title. Reread the current findings. Stay inside `${CHANGE_SCOPE}`.
- Fix blocker findings first, then major findings. Do not "fix" a spec mismatch by rewriting the spec.
- Re-run the relevant required checks after edits. Record outcomes. A required check that cannot be run remains a failure.
- Leave minor findings deferred unless they are trivial to fix inside the locked scope.
- Report what changed, which findings are resolved, and which remain, with the work item title.
