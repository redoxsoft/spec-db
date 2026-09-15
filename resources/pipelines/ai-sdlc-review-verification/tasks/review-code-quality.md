**Goal:** Review the locked change against the Code Review & Quality Bar and produce severity-tagged findings.

**Scope:** Read the SpecX spec `Code Review & Quality Bar` and inspect only `${CHANGE_SCOPE}` against the locked `${WORK_ITEM_REF}`. Do not edit code yet. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The quality-bar spec was read in full. Every finding has severity blocker, major, or minor. Required checks were attempted and their actual outcomes recorded. The task stopped if the quality-bar spec could not be found by exact title.

**Instructions:**

- Resolve the SpecX spec `Code Review & Quality Bar` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another document or reconstruct the rules from memory.
- Follow that spec for correctness, maintainability, security, tests and verification, and severity. Assign every finding exactly one of blocker, major, or minor.
- Reread the locked `${WORK_ITEM_REF}` by document id when one was locked; otherwise by exact title if needed so findings stay tied to the spec, not to taste.
- Run the repository's required checks (lint, typecheck, tests, or the project's equivalent) against the locked `${CHANGE_SCOPE}`. Record the command and the actual outcome. A required check that cannot be run is a failure, not a skip.
- Report findings with severity, the work item title, and check outcomes. Do not pass the review because the code looks reasonable.
