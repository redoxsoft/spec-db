**Goal:** Confirm every Test Plan case has a recorded outcome, that no result was invented, and report the QA handoff.

**Scope:** Read-only verification of the locked `<Subject> - Test Plan` against the locked `${SOURCE_SPEC_REF}` and the SpecX spec `Test Strategy Guidelines`. Do not edit the document or application code. Do not fix application defects — report them. Do not invent missing results. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Every case has an observed outcome (pass, fail, or `not run` with reason). Every case traces to a source acceptance criterion. No result was invented. `not ready` cases are not counted as PASS. Gaps are listed, or the Test Plan is reported complete. The output names title, version, counts, and defects reported.

**Instructions:**

- Resolve the SpecX spec `Test Strategy Guidelines` by exact title. If it cannot be found, stop and report that exact missing title (`ai-sdlc-test-strategy-guidelines`).
- Reread the document titled `<Subject> - Test Plan` in full, and reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If either is unavailable, repeat resolution rather than guessing.
- Check the completion criteria: every source acceptance criterion has at least one case; every high-risk behaviour has a primary layer; every case has an observed outcome; no result was invented. Unresolved fails stay fails. `not run` is not a pass. `not ready: <reason>` is not a pass.
- Do not mark the plan complete while a high-risk behaviour has no case, while any case lacks a source criterion, or while results are assumed rather than recorded.
- Report the exact Test Plan title and version, the locked `${SOURCE_SPEC_REF}` (id when available, title for display), test-plan mode, pass/fail/`not run` counts, any remaining gaps, and defects found (reported, not fixed). Recommend `Implementation` or a Bug Fix Spec for failures; do not start another pipeline unless the user asks.
