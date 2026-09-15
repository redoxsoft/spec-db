**Goal:** Lock the upstream PRD or Change Request this Design Spec will translate, and a short subject name for the target document.

**Scope:** Resolution and confirmation only. Do not inspect architecture in depth, author a Design Spec, or edit code. Do not commit, push, open a pull request, publish, or deploy. Creating or updating the locked source document so later tasks can reread it is allowed.

**Verification / Definition of Done:** `${SOURCE_SPEC_REF}` is locked as a native PRD or Change Request (document id when available, plus display title) and a short subject is locked, both printed — or the task stopped because a required template or spec was missing, or because the evidence was not a PRD or Change Request.

**Instructions:**

- Resolve the SpecX template `Design Spec Template` (`ai-sdlc-design-spec-template`) and the SpecX spec `Design & Architecture Principles` (`ai-sdlc-design-architecture-principles`) by exact title. If either cannot be found, stop and report **workspace setup required**: missing that exact title and slug. This is not an invalid project input. Do not substitute another document or reconstruct the rules from memory.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${SOURCE_SPEC_REF}` appearing verbatim) as missing.
- Resolve `${SOURCE_SPEC_REF}`:
  1. If it is already a native SpecX PRD or Change Request, lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
  2. If it is a URL, path, or paste that is already a PRD or Change Request, create or update the matching native document from `PRD Template` (`ai-sdlc-prd-template`) or `Change Request Template` (`ai-sdlc-feature-spec-template`) using the imported content so later tasks can reread it. Preserve source location, excerpt or revision, and observed vs inferred vs unresolved statements. Then lock that document's id and title.
  3. If missing, inspect only PRDs and Change Requests. Present a shortlist with title, type, and why each candidate is relevant to this design work.
  4. Ask the user to choose when several plausible candidates exist.
  5. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  6. When no candidate exists, ask the user for a title, URL, path, description, or pasted content.
- Do not lock a Design Spec, Milestone Plan, Bug Fix Spec, Work Scope Brief, or other non-PRD/Change Request source as `${SOURCE_SPEC_REF}`. Do not create a Work Scope Brief as a substitute for a PRD or Change Request. If the evidence is not a PRD or Change Request, stop and recommend `Requirements → PRD` or `Change Request Builder`.
- If the host cannot persist a document id across tasks, carry the exact title and do not claim a typed persistent reference.
- Derive a short subject from the locked source (the product, change, or problem name — strip suffixes such as ` - PRD` or ` - Change Request`). If the subject is empty or ambiguous, ask the user for one.
- Print the locked source id (when available), title, and subject before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
