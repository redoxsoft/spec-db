**Goal:** Lock the source spec this Test Plan will verify, and a short subject name for the target document.

**Scope:** Resolution and confirmation only. Do not design coverage, author a Test Plan, run tests, or edit application code. Do not fix application defects — report them. Do not commit, push, open a pull request, publish, or deploy. Creating or updating a native source or Work Scope Brief so later tasks can reread it is allowed.

**Verification / Definition of Done:** `${SOURCE_SPEC_REF}` is locked as a native PRD, Change Request, Bug Fix Spec, Design Spec, Milestone Plan, or Work Scope Brief (document id when available, plus display title) and a short subject is locked, both printed — or the task stopped because a required template or spec could not be found.

**Instructions:**

- Resolve the SpecX template `Test Plan Template` (`ai-sdlc-test-plan-template`) and the SpecX spec `Test Strategy Guidelines` (`ai-sdlc-test-strategy-guidelines`) by exact title. If either cannot be found, stop and report **workspace setup required**: missing that exact title and slug. This is not an invalid project input. Do not substitute another document or reconstruct the rules from memory.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${SOURCE_SPEC_REF}` appearing verbatim) as missing.
- Resolve `${SOURCE_SPEC_REF}`:
  1. If it is already a native SpecX PRD, Change Request, Bug Fix Spec, Design Spec, Milestone Plan, or Work Scope Brief, lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
  2. If missing, inspect those allowed types. Present a shortlist with title, type, and why each candidate is relevant to testing.
  3. Ask the user to choose when several plausible candidates exist.
  4. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  5. When no native candidate exists, ask the user for a title, URL, path, description, pasted content, or code/API evidence. If that evidence is sufficient but is not already an allowed native document, create or update `<Subject> - Work Scope Brief` from `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`) before continuing. Preserve source location, excerpt or revision, and observed vs inferred vs unresolved statements. Then lock that brief's id and title.
- Do not lock a Standup Log or an existing Test Plan as `${SOURCE_SPEC_REF}`. Do not invent acceptance criteria to test.
- Record test-plan mode for later tasks: `requirements-based` when the locked source is a PRD or Change Request; `implementation-aware` when it is a Design Spec, Milestone Plan, Bug Fix Spec, Work Scope Brief, or code/API evidence.
- If the host cannot persist a document id across tasks, carry the exact title and do not claim a typed persistent reference.
- Derive a short subject from the locked source (the product, change, bug, or milestone name — strip suffixes such as ` - PRD`, ` - Change Request`, ` - Bug Fix Spec`, ` - Design Spec`, ` - Milestone Plan`, or ` - Work Scope Brief`). If the subject is empty or ambiguous, ask the user for one.
- Print the locked source id (when available), title, subject, and test-plan mode before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
