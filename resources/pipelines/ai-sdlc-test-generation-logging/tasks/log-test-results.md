**Goal:** Record the observed run on `<Subject> - Test Plan`: honest failures and `not run` with the exact reason.

**Scope:** Update only the execution-results of the SpecX document titled `<Subject> - Test Plan`. Do not rewrite cases to hide failures. Do not edit application code. Do not fix application defects — report them. Do not invent results. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** An execution-run instance titled with the run date and environment exists on `<Subject> - Test Plan`. Every case has an outcome of pass, fail, or `not run`. Failures record the actual result. Each `not run` names the exact reason, including `not ready: <reason>` when applicable. No result was invented or counted as PASS without observation.

**Instructions:**

- Resolve the SpecX spec `Test Strategy Guidelines` by exact title. If it cannot be found, stop and report that exact missing title (`ai-sdlc-test-strategy-guidelines`).
- Reread the document titled `<Subject> - Test Plan` and the observed outcomes from execution. If the Test Plan title is unavailable, repeat resolution rather than guessing.
- Locate the existing `<Subject> - Test Plan` and update it. Do not create a duplicate Test Plan.
- Append an execution-run instance titled with the run date and environment. Write pass, fail, and `not run` from observed evidence only. Follow `Test Strategy Guidelines`: record only what was observed; do not pre-fill results; do not convert a fail to `not run`; never invent a PASS for a `not ready` case.
- Mark unavailable checks `not run` with the exact reason (missing environment, missing data, tool unavailable, blocked by a prior failure, or `not ready: <reason>`).
- Report the document title and version, the run title, pass/fail/`not run` counts, and any defects found. Unresolved fails stay fails. `not run` is not a pass.
