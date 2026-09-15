**Goal:** Create or update `<Bug Subject> - Bug Fix Spec` from the Bug Fix Spec Template using confirmed diagnosis only.

**Scope:** Create or update only the SpecX document titled `<Bug Subject> - Bug Fix Spec`, using the locked `${BUG_REPORT}` and the confirmed diagnosis. Do not implement the fix or edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A document titled `<Bug Subject> - Bug Fix Spec` exists, was created or updated in place (no duplicate), and follows the `Bug Fix Spec Template`. Root cause is confirmed, not hypothesized. The task stopped if the template could not be found by exact title, or if root cause is still a guess.

**Instructions:**

- Resolve the SpecX template `Bug Fix Spec Template` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another template.
- Reread the locked `${BUG_REPORT}`, the reproduction, and the confirmed root cause. If the cause is still a hypothesis, stop — do not author a fix strategy that pretends it is known.
- Locate an existing SpecX document titled `<Bug Subject> - Bug Fix Spec` and update it. If none exists, create it with that exact title. Do not create a duplicate.
- Fill observed versus expected behaviour, reproduction cases a stranger can follow, confirmed root cause, regression gap, the smallest proposed change, risks and rollback, and the verification that closes the gap. Do not expand into unrelated refactors. Do not pre-fill implementation records.
- Report the document title and version, and any remaining unknowns.
