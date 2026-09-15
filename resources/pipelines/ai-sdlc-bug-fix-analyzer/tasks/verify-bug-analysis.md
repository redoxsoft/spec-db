**Goal:** Confirm the Bug Fix Spec states a fix boundary, a rollback approach, and regression coverage before analysis is done.

**Scope:** Read the locked `<Bug Subject> - Bug Fix Spec` and the SpecX spec `Bug Analysis Guidelines`. Record gaps. Do not implement the fix. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The spec states a bounded fix, how to revert if it fails, and a regression test that would have caught this bug (or an explicit substitute and why automation is impossible). Analysis is not marked complete while the cause is still a guess.

**Instructions:**

- Resolve the SpecX spec `Bug Analysis Guidelines` by exact title. If it cannot be found, stop and report that exact missing title.
- Reread the document titled `<Bug Subject> - Bug Fix Spec` in full. If that title is unavailable, repeat resolution rather than guessing.
- Require a stated fix boundary (files, contracts, and behaviours the fix may touch), a rollback approach, and regression coverage. The regression test must fail on the unfixed code and pass on the fix, or the spec must say why an automated test cannot exist and what check replaces it.
- Confirm observed versus expected behaviour, a reproduction or impossibility explanation, and a confirmed (not hypothesized) root cause.
- Report the document title and version, what passed, remaining gaps, and the recommended next step: implement the bounded fix via `Implementation`. Typical defect path: Bug Fix Spec → Implementation → Review & Verification → Delivery Sync. Do not mark analysis complete while the cause is still a guess or any required item is missing.
