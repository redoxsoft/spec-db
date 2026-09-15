**Goal:** Lock both the requested change and the existing source contract this Change Request will amend.

**Scope:** Resolution and confirmation only. Do not analyze impact, author a spec, or edit code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Both `${REQUESTED_CHANGE}` and `${SOURCE_CONTRACT_REF}` are locked as exact usable values and printed, or the task stopped because a required spec or template could not be found, or stopped with a PRD or Bug Fix recommendation. Neither value was silently inferred from arbitrary uncommitted files. An external source contract was preserved as a snapshot to carry into the Change Request, not as a separate Work Scope Brief.

**Instructions:**

- Resolve the SpecX spec `Work Intake & Artifact Selection Guide` (`ai-sdlc-prd-vs-feature-spec-guidelines`) and the SpecX template `Change Request Template` (`ai-sdlc-feature-spec-template`) by exact title. If either cannot be found, stop and report **workspace setup required**: missing that exact title and slug. This is not an invalid project input. Do not substitute another document or reconstruct the rules from memory.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${REQUESTED_CHANGE}` or `${SOURCE_CONTRACT_REF}` appearing verbatim) as missing.
- Resolve `${REQUESTED_CHANGE}`:
  1. If it already names a bounded behaviour change, lock it.
  2. If missing, ask what existing behaviour should change, and for whom. Do not invent a change from workspace files.
- Resolve `${SOURCE_CONTRACT_REF}`:
  1. If it is already a native SpecX document (PRD, Design Spec, API or technical contract), lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
  2. If it is a URL, path, issue, or pasted contract, lock that evidence as the source contract. Carry source location, excerpt or revision, and observed vs inferred vs unresolved statements for the Change Request's Source Contract Snapshot. **Do not** create a Work Scope Brief solely for this source contract.
  3. If missing, inspect only relevant PRDs and Design Specs. Present a shortlist with title, type, and why each candidate is relevant.
  4. Ask the user to choose when several plausible candidates exist.
  5. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  6. When no candidate exists, ask the user for a title, URL, path, description, or pasted content.
- If the host cannot persist a document id across tasks, carry the exact title or snapshot and do not claim a typed persistent reference.
- Apply `Work Intake & Artifact Selection Guide` to the locked pair:
  1. If the work is a material capability, journey, business-rule, or success-measure change, **stop** and recommend `Requirements → PRD` rather than authoring a Change Request.
  2. If the work is unintended deviation from expected behaviour with no intent to change the contract, **stop** and recommend `Bug Fix Analyzer`.
  3. Continue only when the work is a bounded, intentional amendment to a known contract.
- Print both locked values (id and title when native; location plus snapshot notes when external) before continuing. Carry them for later tasks; do not write them back into the run's launch inputs.
