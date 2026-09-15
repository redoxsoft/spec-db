**Goal:** Report the Change Request title, version, and the recommended next pipeline.

**Scope:** Read-only reporting of the locked `<Subject> - Change Request`. Do not create or edit documents or code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The output names the Change Request title and version, the locked `${REQUESTED_CHANGE}` and `${SOURCE_CONTRACT_REF}`, and one recommended next pipeline. No new files or documents were created.

**Instructions:**

- Reread the document titled `<Subject> - Change Request` so the report reflects the current document, not a previous task's memory.
- Report the exact title and version, remaining open questions, and that verified amendments will later be applied to the linked source documents by `Delivery Sync & Spec Update`.
- Recommend the next pipeline from the spec's delivery approach: `Implementation` when the change can go straight to implementation; otherwise `PRD / Change Request → Design Spec` then `Milestone Plan Builder`.
- Do not start another pipeline unless the user asks.
