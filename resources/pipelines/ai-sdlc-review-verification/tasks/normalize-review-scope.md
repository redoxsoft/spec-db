**Goal:** Ensure later review tasks have a bounded native work item: pass through an already-implementable artifact, or on a direct run create an as-built Work Scope Brief from named issue/evidence plus the exact change boundary.

**Scope:** Create or update a SpecX Work Scope Brief only on a direct run that lacks a native implementable work item. Do not review code yet. Do not invent a change boundary. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `${WORK_ITEM_REF}` is a native Change Request, Bug Fix Spec, Milestone Plan, or Work Scope Brief with an exact locked `${CHANGE_SCOPE}` — or the task stopped because those cannot be locked without guessing. Parent invocations never created a new brief.

**Instructions:**

- If this is a parent invocation, pass through the already-locked work item and change scope. Do not create or rewrite a Work Scope Brief.
- If this is a direct run and `${WORK_ITEM_REF}` is already a Change Request, Bug Fix Spec, Milestone Plan, or Work Scope Brief, pass through after confirming `${CHANGE_SCOPE}` is an exact file set, diff, branch, PR, or milestone boundary.
- If this is a direct run from a named issue, PR, diff, or other evidence plus an exact change boundary, resolve `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`) by exact title. If it cannot be found, stop and report **workspace setup required**: missing `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`). Then create or update `<Subject> - Work Scope Brief`:
  1. Set entry mode to `as-built`.
  2. Record evidence items with location, snapshot, and provenance.
  3. State the outcome, inclusions, exclusions, and the exact locked change boundary.
  4. Write testable acceptance criteria traced to evidence. Label assumptions and unresolved gaps.
- If the outcome, acceptance criteria, exclusions, or repository boundary cannot be locked without guessing, **stop**. Do not infer scope from arbitrary uncommitted files.
- After a brief is created, lock `${WORK_ITEM_REF}` to that brief's document id (when available) and display title. Later tasks must read by id when available and use the title only for display or fallback.
- Print the locked work item id (when available), title, entry mode, and change scope before continuing.
