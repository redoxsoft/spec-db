**Goal:** Update every affected SpecX document so it describes the verified behaviour of the locked change.

**Scope:** Update existing SpecX documents whose contracts the locked `${CHANGE_SCOPE}` changed, using the locked `${WORK_ITEM_REF}` as the source of truth. This pipeline may update SpecX documents only. It must not edit code, commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Each resolvable affected document was updated in place, or reported as already matching verified behaviour. Missing linked titles were reported and skipped with a recommended authoring pipeline. No duplicate or retrospective product document was created. Unresolved document titles are listed.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title. Identify which SpecX documents and sections the shipped change affects.
- For each affected document, locate the existing target by document id when known, otherwise by exact title, and update it. Do not create a duplicate.
- If a linked PRD, Design Spec, or other source title cannot be found, **report and skip that document**. Name the missing title and recommend the matching authoring pipeline (`Requirements → PRD`, `PRD / Change Request → Design Spec`, `Change Request Builder`, or `Bug Fix Analyzer`). Do not abort synchronization of other resolvable documents. Do not invent a new title or write retrospective product history.
- If the work item is a Work Scope Brief and no living source docs exist, preserve the verified brief as the durable record. Report documentation follow-up; do not start a post-hoc baseline-authoring pipeline.
- Align the stated behaviour, contracts, and acceptance criteria with what was verified inside `${CHANGE_SCOPE}`. Do not expand the spec into unverified work.
- Report each updated document title and version, each skipped missing title with the recommended pipeline, and that skipped documents did not block the rest of the sync.
