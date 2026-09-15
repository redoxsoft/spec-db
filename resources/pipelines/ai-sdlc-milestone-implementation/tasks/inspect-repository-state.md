**Goal:** Record the current repository state and any unrelated existing changes so later implementation can preserve them.

**Scope:** Read the locked `${WORK_ITEM_REF}` and inspect the repository as it relates to this work. Do not implement, revert, or edit files. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The output names the locked work item, the current branch or workspace identity, and every unrelated existing change that must be preserved. No files were edited.

**Instructions:**

- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. Use the locked title for display. Reread the locked milestone when the work item is a Milestone Plan. The work item must already be a Change Request, Bug Fix Spec, Milestone Plan, or Work Scope Brief from the previous task.
- Inspect the repository's current state: branch, uncommitted edits, and generated or ignored files that are already dirty.
- Classify existing changes as in-scope for the locked work item or unrelated. Unrelated existing changes must be preserved — do not revert, overwrite, restage, or fold them into this work.
- When the work item is a Work Scope Brief, use its change boundary and exclusions as the in-scope definition.
- Report the locked work item (and milestone when applicable), the snapshot of unrelated changes to preserve, and which areas look relevant to the locked scope. Do not start implementation in this task.
