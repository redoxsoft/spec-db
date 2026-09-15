**Goal:** Implement only the locked work item (and locked milestone, when the source is a plan) and add proportionate tests.

**Scope:** Edit application code and tests only inside the locked scope from `${WORK_ITEM_REF}` and, when applicable, the locked milestone. Preserve unrelated existing changes. Do not expand into neighboring or speculative work. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The locked scope is implemented with proportionate tests. Unrelated existing changes remain intact. An exact change scope is locked and printed — the files, diff, or milestone boundary this run produced — for later child pipelines.

**Instructions:**

- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. When the work item is a Milestone Plan, implement only the locked milestone; when it is a Change Request, Bug Fix Spec, or Work Scope Brief, implement the entire locked spec as the bounded work item.
- Implement the stated outcome and add tests that match the risk and size of the change. Stay inside the brief's or spec's inclusions and change boundary. Do not add neighboring refactors, drive-by cleanup, or speculative features.
- Preserve the unrelated existing changes recorded in the previous task. Do not revert or overwrite them. Honour explicit exclusions.
- After the edits, lock an exact change scope: the files, diff, or milestone boundary that belongs to this implementation. That locked change scope is what later tasks pass to child pipelines. Do not infer scope from arbitrary unrelated dirty files.
- Leave all changes in the working tree. Do not commit, push, open a pull request, publish, or deploy.
- Print the locked work item, the locked milestone when applicable, and the exact locked change scope before continuing.
