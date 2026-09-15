**Goal:** Lock the work item to implement — a native implementable artifact or evidence from which a Work Scope Brief can be created — and lock one milestone when the work item is a plan.

**Scope:** Resolution and confirmation only. Do not inspect the repository in depth, edit code, or author a Work Scope Brief yet. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `${WORK_ITEM_REF}` is locked as a usable native document or evidence source (document id when available, plus display title) and printed. When that work item is a Milestone Plan, a single milestone is locked and printed after confirmation. Direct Change Request, Bug Fix Spec, or Work Scope Brief work treats the entire spec as the bounded work item.

**Instructions:**

- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${WORK_ITEM_REF}` or `${MILESTONE_SELECTOR}` appearing verbatim) as missing.
- Resolve `${WORK_ITEM_REF}`:
  1. If it is already a native SpecX Milestone Plan, Change Request, Bug Fix Spec, or Work Scope Brief, lock both its document id (when the host provides one) and its display title as separate values.
  2. If it is a native PRD or Design Spec, or non-native evidence (ticket, branch, URL, path, paste, or mixed sources), lock that evidence for the next task to normalize. Carry document id and title when native; otherwise carry location, excerpt or revision, and observed vs inferred vs unresolved statements.
  3. If missing, inspect Milestone Plans, Change Requests, Bug Fix Specs, Work Scope Briefs, PRDs, and Design Specs. Present a shortlist with title, type, and why each candidate is relevant to implementation.
  4. Ask the user to choose when several plausible candidates exist.
  5. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  6. When no candidate exists, ask the user for a title, URL, path, description, branch, diff, or pasted content.
- Do not reject a PRD, Design Spec, ticket, or branch at this step. The next task must produce a bounded Work Scope Brief when the locked source is not already implementable. Do not lock a Test Plan or Standup Log as `${WORK_ITEM_REF}`.
- If the locked work item is a Milestone Plan, resolve `${MILESTONE_SELECTOR}` against that plan:
  1. If it already names an open milestone by exact title or number, present that milestone for confirmation rather than silently locking it.
  2. If missing, list the plan's open (not Done) milestones with title, sequence, and why each is eligible.
  3. Ask the user to choose when several open milestones exist.
  4. When only one open milestone exists, present it for confirmation — never silently select it.
  5. When no open milestone exists, ask the user how to proceed; do not invent a slice.
- If the locked work item is a Change Request, Bug Fix Spec, or Work Scope Brief, treat the entire spec as the bounded work item. Do not ask for a milestone.
- If the host cannot persist a document id across tasks, carry the exact title or evidence snapshot and do not claim a typed persistent reference.
- Print the locked work item id (when available), title or evidence location, and, when applicable, the locked milestone before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
