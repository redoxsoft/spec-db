**Goal:** Append a dated implementation record on the locked work item and, for milestone work, mark that milestone Done.

**Scope:** Update only the locked `${WORK_ITEM_REF}` SpecX document, and its milestone instance when the work item is a plan. This pipeline may update SpecX documents only. It must not edit code, commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A dated implementation record exists on the locked work item describing `${CHANGE_SCOPE}`. Milestone work has that milestone's status set to `Done`. Change Request, Bug Fix Spec, and Work Scope Brief work has a new instance on that spec's implementation-record list.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title. Update that existing document; do not create a duplicate.
- If the work is a milestone inside a Milestone Plan, append a dated record under that completed milestone's Implementation Record list. Title the instance with the date. Set that milestone's Status to `Done`. Do not mark other milestones Done.
- If the work is a Change Request, Bug Fix Spec, or Work Scope Brief, append to that spec's implementation-record list. Title the instance with the date and the change. Write what was verified and synchronized in the instance body. For a Work Scope Brief, this is the optional append-only Implementation Record after a matching Review PASS.
- Record the locked `${CHANGE_SCOPE}`, the review pass, and the spec titles updated in the previous task, including any skipped missing titles. Do not invent owners, future dates, or work that was not done.
- Report the document title, version, and the new record title.
