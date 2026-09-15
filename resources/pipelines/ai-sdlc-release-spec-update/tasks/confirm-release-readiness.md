**Goal:** Confirm Review & Verification has already passed for the locked work item and change scope, and stop otherwise.

**Scope:** Read review evidence and the locked `${WORK_ITEM_REF}` / `${CHANGE_SCOPE}`. This pipeline may update SpecX documents only. It must not edit code, commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Review is confirmed passed — zero unresolved blocker or major findings and all required checks succeeding — or the task stopped because the work is unverified or the delivery-verification gate failed.

**Instructions:**

- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title. Reread `${CHANGE_SCOPE}`. If either locked value is unavailable, repeat resolution rather than guessing.
- Confirm that `Review & Verification` has already passed for this exact work item and change scope. When a parent invoked this pipeline after its delivery-verification gate, require that the parent reported a pass: zero unresolved blocker or major findings and all required checks succeeding.
- If this pipeline was launched directly, look for a pass outcome for the same locked work item and change scope. Do not assume a pass from an unrelated review.
- Stop if review has not passed, evidence is missing, or any required check failed or could not be run. This pipeline never runs on unverified work. Do not synchronize specs after a failed or missing gate.
