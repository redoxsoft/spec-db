**Goal:** Lock the upstream PRD, Design Spec, Change Request, or Work Scope Brief this Milestone Plan will deliver, and a short subject name for the target document.

**Scope:** Resolution and confirmation only. Do not map dependencies, author a plan, or edit code. Do not commit, push, open a pull request, publish, or deploy. Creating or updating a native source or Work Scope Brief so later tasks can reread it is allowed.

**Verification / Definition of Done:** `${SOURCE_SPEC_REF}` is locked as a native PRD, Design Spec, Change Request, or Work Scope Brief (document id when available, plus display title) and a short subject is locked, both printed — or the task stopped because a required template could not be found.

**Instructions:**

- Resolve the SpecX template `Milestone Plan Template` (`ai-sdlc-milestone-plan-template`) by exact title. If it cannot be found, stop and report **workspace setup required**: missing `Milestone Plan Template` (`ai-sdlc-milestone-plan-template`). This is not an invalid project input. Do not substitute another template or invent a structure.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${SOURCE_SPEC_REF}` appearing verbatim) as missing.
- Resolve `${SOURCE_SPEC_REF}`:
  1. If it is already a native SpecX PRD, Design Spec, Change Request, or Work Scope Brief, lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
  2. If missing, inspect PRDs, Design Specs, Change Requests, and Work Scope Briefs. Present a shortlist with title, type, and why each candidate is relevant to this planning work.
  3. Ask the user to choose when several plausible candidates exist.
  4. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  5. When no native candidate exists, ask the user for a title, URL, path, description, or pasted content. If that evidence is sufficient but is not already an allowed native document, create or update `<Subject> - Work Scope Brief` from `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`) before continuing. Preserve source location, excerpt or revision, and observed vs inferred vs unresolved statements. Then lock that brief's id and title.
- Do not lock a Milestone Plan, Bug Fix Spec, Test Plan, or Standup Log as `${SOURCE_SPEC_REF}`. Missing architecture is not a reason to reject a PRD; later tasks must record it as an assumption, risk, or recommendation.
- If the host cannot persist a document id across tasks, carry the exact title and do not claim a typed persistent reference.
- Derive a short subject from the locked source (the product, change, or problem name — strip suffixes such as ` - PRD`, ` - Design Spec`, ` - Change Request`, or ` - Work Scope Brief`). If the subject is empty or ambiguous, ask the user for one.
- Record plan mode for later tasks: `product-level` when the locked source is a PRD (or a Work Scope Brief whose evidence is a PRD); `implementation-level` when it is a Design Spec, Change Request, or other Work Scope Brief.
- Print the locked source id (when available), title, subject, and plan mode before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
