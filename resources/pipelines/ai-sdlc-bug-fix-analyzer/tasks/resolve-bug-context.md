**Goal:** Lock the single defect this analysis will diagnose, refuse unrelated failures that merely happen to be visible, and stop if the work is an intentional contract change.

**Scope:** Resolution and confirmation only. Do not reproduce, edit code, or author a spec. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `${BUG_REPORT}` is locked as a usable report, log, failing test, file, URL, or symptom description and printed, or the task stopped because a required spec or template could not be found, or stopped with a Change Request or PRD recommendation. No unrelated visible failure was selected.

**Instructions:**

- Resolve the SpecX spec `Bug Analysis Guidelines` (`ai-sdlc-bug-analysis-guidelines`) and the SpecX template `Bug Fix Spec Template` (`ai-sdlc-bug-fix-spec-template`) by exact title. If either cannot be found, stop and report **workspace setup required**: missing that exact title and slug. This is not an invalid project input. Do not substitute another document or reconstruct the rules from memory.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${BUG_REPORT}` appearing verbatim) as missing.
- If `${BUG_REPORT}` already contains a usable report, lock it. If it is a native SpecX document, lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback. If it is a URL, path, or paste, carry source location, excerpt or revision, and observed vs inferred vs unresolved statements into the Bug Fix Spec; do not require a Work Scope Brief solely for the bug report.
- If missing, ask for symptoms, logs, a failing test, a file, or a URL. You may help discover failing tests and logs, but **never select an unrelated failure merely because it is visible**. Present candidates with why each matches the reported symptoms, and ask the user to choose when more than one is plausible.
- When one candidate is strongly implied, present it for confirmation rather than silently locking it.
- Confirm whether observed ≠ expected is **unintended** (bug) or a **requested contract change**. If stakeholders want the contract changed, or expected behaviour is undefined, **stop** and apply `Work Intake & Artifact Selection Guide`: recommend `Change Request Builder` for a bounded amendment, or `Requirements → PRD` for a material capability change. Do not continue bug analysis for an intentional product change.
- Derive a short bug subject (the failing behaviour or component, not a sentence). If it is empty or ambiguous, ask the user for one.
- Print the locked bug report (id and title when native) and subject before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
