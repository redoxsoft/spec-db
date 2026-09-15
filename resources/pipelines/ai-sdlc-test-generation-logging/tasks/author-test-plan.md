**Goal:** Create or update `<Subject> - Test Plan` from the Test Plan Template, with every case traced to one source acceptance criterion.

**Scope:** Create or update only the SpecX document titled `<Subject> - Test Plan`, using the locked `${SOURCE_SPEC_REF}`, locked subject, test-plan mode, and coverage design. Do not run tests yet. Do not edit application code. Do not fix application defects — report them. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A document titled `<Subject> - Test Plan` exists, was created or updated in place (no duplicate), follows the `Test Plan Template`, records test-plan mode, and every case cites one source acceptance criterion. The task stopped if the template or `Test Strategy Guidelines` could not be found by exact title.

**Instructions:**

- Resolve the SpecX template `Test Plan Template` and the SpecX spec `Test Strategy Guidelines` by exact title. If either cannot be found, stop and report the exact missing title. Do not substitute another template or invent a structure.
- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. Reread the locked subject and test-plan mode. If a locked value is unavailable, repeat resolution rather than guessing. Do not rely on a previous task's unstated memory.
- Locate an existing SpecX document titled `<Subject> - Test Plan` and update it. If none exists, create it with that exact title. Do not create a second document for the same subject.
- Fill source and scope, test-plan mode (`requirements-based` or `implementation-aware`), risk priorities, environments, data, prerequisites, and cases from the locked source and the coverage design. Title each case with the scenario, not "Test Case". One case, one objective. Preconditions, steps, and expected results must be concrete and observable. Every case must cite one source acceptance criterion — do not invent a criterion the source does not contain.
- In `requirements-based` mode, author journey and acceptance tests. Do not invent implementation-specific cases the PRD or Change Request cannot support.
- Leave execution results empty. Do not pre-fill pass, fail, or `not run`.
- Report the document title and version, the source title, the test-plan mode, and how many cases were authored.
