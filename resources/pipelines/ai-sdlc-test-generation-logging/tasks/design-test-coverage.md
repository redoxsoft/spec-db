**Goal:** Rank the locked source's behaviours by risk and assign each a primary coverage layer, following Test Strategy Guidelines.

**Scope:** Read the locked `${SOURCE_SPEC_REF}` and the SpecX spec `Test Strategy Guidelines`. Record the risk ranking and layer choices. Do not author the Test Plan yet, do not run tests, and do not edit application code. Do not fix application defects — report them. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Highest-risk behaviours from the locked source are named, each has one primary layer (unit, integration, end-to-end, or manual) with a reason, and any behaviour that cannot be covered is listed with why. The locked test-plan mode is applied. The task stopped if `Test Strategy Guidelines` could not be found by exact title.

**Instructions:**

- Resolve the SpecX spec `Test Strategy Guidelines` by exact title. If it cannot be found, stop and report that exact missing title (`ai-sdlc-test-strategy-guidelines`). Do not reconstruct the rules from memory.
- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. Reread the locked subject and test-plan mode.
- Follow `Test Strategy Guidelines`: rank behaviours by the harm if they fail, then cover highest risk first. Do not start from a favourite test type. Assign each risk to the lowest layer that can prove the failure. One risk, one primary layer.
- Use only acceptance criteria that exist in the locked source. Do not invent criteria to fill coverage.
- In `requirements-based` mode (PRD or Change Request), design journey and acceptance coverage. Record implementation-specific checks that lack environment, API, or build detail as not ready rather than inventing them.
- In `implementation-aware` mode, contracts, endpoints, migrations, and repository checks may drive coverage when they exist in the evidence.
- If a high-risk behaviour cannot be automated, still classify it and pick the cheapest layer that can actually fail — including manual when automation cannot observe the result, with the reason.
- Report the locked source title and version, the subject, the test-plan mode, the ranked risks with chosen layers, and any source criterion that has no coverage path yet. Do not write the Test Plan in this task.
