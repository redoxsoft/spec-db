**Goal:** Report what was implemented, the review outcome, the spec updates, and the next eligible work item.

**Scope:** Read-only reporting of the locked `${WORK_ITEM_REF}`, the locked milestone when applicable, the delivery-verification gate, and any Delivery Sync handoff. Do not create or edit documents or code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The output names the locked work item title and version, the locked milestone when applicable, what was implemented, the review outcome, spec updates when Delivery Sync ran, and the next eligible work item. No new files or documents were created. If the delivery-verification gate failed, the report states that Delivery Sync did not run.

**Instructions:**

- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title so the report reflects the current document, not a previous task's memory. If neither is available, repeat resolution rather than guessing. Reread the locked milestone when the work item is a Milestone Plan.
- Report the exact work item title and version, the locked milestone when applicable, the exact change scope that was implemented, the `Review & Verification` outcome, and — only if the delivery-verification gate passed — the spec documents updated and implementation-record title from `Delivery Sync & Spec Update`.
- If the delivery-verification gate failed, state that Delivery Sync did not run and what must be fixed before retrying.
- Identify the next eligible work item: the next open milestone on the same plan whose dependencies are Done, the next Change Request, Bug Fix Spec, or Work Scope Brief still awaiting implementation. If several are equally eligible, list them and name the first in sequence.
- Do not start another pipeline unless the user asks.
