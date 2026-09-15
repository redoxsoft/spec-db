**Goal:** Run `Delivery Sync & Spec Update` inline with the same exact locked work item and change scope, only after the delivery-verification gate passed.

**Scope:** Invoke the child pipeline `Delivery Sync & Spec Update` only when `confirm-review-gate` passed. If that gate failed or was not confirmed, this task is unreachable — stop without invoking the child. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Either the task stopped because the delivery-verification gate did not pass, or the child pipeline `Delivery Sync & Spec Update` was found by that exact title, run with the locked `${WORK_ITEM_REF}` and the exact locked change scope, and its handoff is recorded. The task stopped if a pipeline with that exact title could not be found.

**Instructions:**

- If the previous task did not confirm a passed delivery-verification gate, stop immediately. Do not run `Delivery Sync & Spec Update` on a failed or missing gate.
- Resolve the pipeline `Delivery Sync & Spec Update` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another pipeline or update specs yourself.
- Run the `Delivery Sync & Spec Update` pipeline with the same exact locked work item and the same exact locked change scope already passed to review. Pass those values as already-locked parent inputs. Do not ask the user to rediscover them. Do not pass missing or fuzzy values.
- Carry the child's reported spec updates and implementation-record title for the handoff task.
- Do not commit, push, open a pull request, publish, or deploy.
