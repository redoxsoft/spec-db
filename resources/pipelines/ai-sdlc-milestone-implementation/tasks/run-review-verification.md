**Goal:** Run `Review & Verification` inline against the locked work item and the exact change scope from implementation.

**Scope:** Invoke the child pipeline `Review & Verification` with already-locked exact values. Do not rediscover the work item or infer a new diff. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The child pipeline `Review & Verification` was found by that exact title and run with the locked `${WORK_ITEM_REF}` and the exact locked change scope as inputs, and its pass/fail outcome is recorded — or this task stopped because a pipeline with that exact title could not be found.

**Instructions:**

- Resolve the pipeline `Review & Verification` by exact title. If it cannot be found, stop and report that exact missing title (`ai-sdlc-review-verification`). Do not substitute another pipeline or reconstruct the review yourself.
- Run the `Review & Verification` pipeline with the locked work item and the exact locked change scope from implementation as inputs. Pass those values as already-locked parent inputs: the native implementable document (id when available, exact title otherwise) for the work item, and the named file set, diff, or milestone boundary for the change scope. Do not ask the user to rediscover what this parent already locked. Do not pass missing or fuzzy values.
- Carry the child's reported outcome (pass or fail, unresolved blocker and major counts, required-check results) for the next task. Do not treat a missing or incomplete child run as a pass.
- Do not commit, push, open a pull request, publish, or deploy.
