**Goal:** Ensure later implementation tasks have a bounded native work item: pass through an already-implementable artifact, or create a Work Scope Brief from PRD, Design Spec, or external evidence.

**Scope:** Create or update a SpecX Work Scope Brief only when required. Do not edit application code. Do not invent outcome, acceptance criteria, exclusions, or a repository boundary. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `${WORK_ITEM_REF}` is locked as a native Change Request, Bug Fix Spec, Milestone Plan (with a locked milestone), or Work Scope Brief that states exact outcome, acceptance criteria, exclusions, and repository boundary — or the task stopped because those cannot be locked without guessing.

**Instructions:**

- Resolve the SpecX template `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`) by exact title when a brief must be created. If it cannot be found, stop and report **workspace setup required**: missing `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`). This is not an invalid project input.
- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title or the carried evidence snapshot. If neither is available, repeat resolution rather than guessing.
- Pass through without rewriting when the locked work item is already a Change Request, Bug Fix Spec, Milestone Plan with a locked milestone, or Work Scope Brief that already states outcome, acceptance criteria, exclusions, and change boundary.
- When the locked source is a PRD, Design Spec, ticket, branch, URL, path, paste, or mixed evidence, create or update `<Subject> - Work Scope Brief` from `Work Scope Brief Template` before continuing:
  1. Set entry mode to `planned`.
  2. Record every evidence item with location (document id and title when native; otherwise URL, issue, path, branch, diff, or paste hash), snapshot, and provenance.
  3. State the exact outcome, inclusions, exclusions, and repository change boundary.
  4. Write testable acceptance criteria traced to evidence. Label assumptions, inferred statements, and unresolved gaps.
  5. Do not expand into a PRD, Change Request, or Design Spec.
- If the outcome, acceptance criteria, exclusions, or repository boundary cannot be locked without guessing, **stop**. That is a safety block. Report what is missing and recommend the smallest authoring pipeline that would make the slice safe (`Change Request Builder`, `Bug Fix Analyzer`, `PRD / Change Request → Design Spec`, or `Milestone Plan Builder`).
- After a brief is created or updated, lock `${WORK_ITEM_REF}` to that brief's document id (when available) and display title. Later tasks must read that locked implementable work item, not the original PRD or paste.
- Print the locked implementable work item id (when available), title, entry mode, and change boundary before continuing.
