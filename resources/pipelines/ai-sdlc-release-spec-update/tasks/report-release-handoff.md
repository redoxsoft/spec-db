**Goal:** Report the Delivery Sync handoff: what was recorded, which specs moved, and what should happen next.

**Scope:** Read-only reporting of the locked `${WORK_ITEM_REF}` and `${CHANGE_SCOPE}` outcome. This pipeline may update SpecX documents only. It must not edit code, commit, push, open a pull request, publish, or deploy. This task must not create or edit documents.

**Verification / Definition of Done:** The output names the work item title and version, the change scope, the spec documents updated, skipped missing titles with recommended pipelines, the implementation-record title, and the next step. No new files or documents were created.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title so the report reflects the current document, not a previous task's memory.
- Report the exact work item title and version, the locked change scope, documents synchronized and their versions, skipped missing linked titles with the recommended authoring pipeline for each, the implementation-record title, milestone status if applicable, and any unresolved decisions.
- If the durable record is a Work Scope Brief because no living source docs existed, say so and list documentation follow-up. Do not claim missing product history was authored.
- State that this step syncs documentation to verified behaviour. It does not deploy, publish, tag, or release software.
- If a parent invoked this pipeline, the next step is that parent's handoff. If the user ran it directly, recommend the next open milestone, Change Request, Bug Fix Spec, or Work Scope Brief still awaiting implementation. Do not start another pipeline unless the user asks.
