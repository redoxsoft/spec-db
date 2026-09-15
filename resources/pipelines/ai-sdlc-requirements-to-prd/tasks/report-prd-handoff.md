**Goal:** Report the PRD handoff: document title, version, unresolved decisions, and Design Spec generation as the next step.

**Scope:** Read-only reporting of the locked `<Subject> - PRD`. Do not create or edit documents or code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The output names the PRD title and version, remaining open questions, and recommends Design Spec generation. No new files or documents were created.

**Instructions:**

- Reread the document titled `<Subject> - PRD` so the report reflects the current document, not a previous task's memory.
- Report the exact title and version, the locked `${INITIATIVE}`, any unresolved decisions, and recommended next steps: generate a Design Spec by running `PRD / Change Request → Design Spec`, or a product-level Milestone Plan by running `Milestone Plan Builder`, or a requirements-based Test Plan by running `Test Generation & Logging`. Typical material-capability path: PRD → Design Spec → Milestone Plan → Implementation → Review & Verification → Delivery Sync. A ready PRD may also feed a Work Scope Brief for Implementation when the slice is already bounded.
- Do not start another pipeline unless the user asks.
