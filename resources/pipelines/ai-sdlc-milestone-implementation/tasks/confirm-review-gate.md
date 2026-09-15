**Goal:** Confirm `Review & Verification` passed for the locked work item and change scope, and stop this pipeline before Delivery Sync if it did not.

**Scope:** Gate only. Read the child review outcome, the locked `${WORK_ITEM_REF}`, and the exact locked change scope. Do not edit code or SpecX documents. Do not start `Delivery Sync & Spec Update`. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The delivery-verification gate is reported as passed only with zero unresolved blocker or major findings and every required check succeeding. If the gate fails or evidence is missing, this task stops the pipeline here — `run-release-spec-update` is unreachable.

**Instructions:**

- Confirm the `Review & Verification` outcome for this exact locked `${WORK_ITEM_REF}` and locked change scope. Require zero unresolved blocker or major findings and all required checks succeeding. A required check that could not be run is a fail.
- If the outcome is a pass, print that the delivery-verification gate passed and that Delivery Sync may proceed. Do not start the Delivery Sync child in this task.
- If the outcome is a fail, evidence is missing, or any blocker or major remains, stop here. Print that the delivery-verification gate failed and that `Delivery Sync & Spec Update` must not run. Do not proceed to the next step.
- Do not commit, push, open a pull request, publish, or deploy.
