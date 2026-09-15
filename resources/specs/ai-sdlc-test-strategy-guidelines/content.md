# Test Strategy Guidelines

## Expected inputs <!-- key: expected-inputs -->

This spec governs designing and executing tests. Apply it when authoring a Test Plan or choosing what to run. It does not review a code change.

Use:

- the locked source spec (PRD, Change Request, Bug Fix Spec, Design Spec, Milestone Plan, or Work Scope Brief) and its acceptance criteria
- the locked test-plan mode (`requirements-based` or `implementation-aware`)
- the risks those criteria imply
- the environments, data, and tools actually available

Stop if the source spec cannot be named. Do not invent acceptance criteria to test.

Missing `Test Plan Template` (`ai-sdlc-test-plan-template`) or this guideline (`ai-sdlc-test-strategy-guidelines`) is a **workspace setup** problem, not an invalid project input.

Code Review & Quality Bar governs reviewing a change: spec alignment, maintainability, security, and whether that change's required checks passed. This spec governs how to rank risk, pick coverage layers, write cases, and record observed results.

## Plan modes <!-- key: plan-modes -->

**Requirements-based** plans come from a PRD or Change Request. Author journey and acceptance tests, risks, data needs, and expected outcomes from the source criteria. Implementation-specific cases that need environment, API, or build detail the source does not contain must not be invented.

**Implementation-aware** plans come from a Design Spec, Milestone Plan, Bug Fix Spec, Work Scope Brief, or code/API evidence. Cases may name contracts, endpoints, migrations, and repository checks when those exist in the evidence.

A PRD may feed a Test Plan. Execution honesty still applies: a case that cannot actually run is `not run`, never PASS.

## Risk classification <!-- key: risk-classification -->

Rank behaviours by the harm if they fail, then cover highest risk first. Do not start from a favourite test type.

Treat a behaviour as higher risk when any of these are true:

- it can lose, corrupt, or leak data
- it sits on a trust boundary (auth, payments, permissions, external input)
- it is user-visible and has no fallback
- it has failed before, or the spec names it as a hard acceptance criterion
- it is hard to observe in production after release

Lower risk: internal formatting, copy, purely cosmetic UI, or behaviour already locked by a higher-layer check.

Do not skip a high-risk behaviour because it is awkward to automate. Classify it, then pick the cheapest layer that can actually fail.

If risk is tied, prefer the behaviour with the clearer, more testable acceptance criterion.

## Coverage layers <!-- key: coverage-layers -->

Assign each risk to the lowest layer that can prove the failure. Do not promote a case to a slower layer without a reason.

- **Unit** — logic, parsing, validation, and state transitions that can fail without I/O. Default for pure functions and invariants.
- **Integration** — contracts between components: APIs, stores, queues, and adapters. Use when a unit test cannot see the boundary.
- **End-to-end** — a user-visible journey that only fails when several components run together. Keep these few and tied to the highest-risk journeys.
- **Manual** — only when automation cannot observe the result (hardware, visual, legal, or missing environment). Record why automation is impossible.

Do not write an end-to-end case for something a unit or integration test already proves. Do not use a manual case as a substitute for an automatable check.

One risk, one primary layer. Additional layers are allowed only when they catch a different failure mode.

In a requirements-based plan, prefer journey and acceptance layers that the PRD or Change Request can actually support. Do not invent API or build checks the source does not describe.

## Test case quality <!-- key: test-case-quality -->

A case is valid only when a stranger can execute it and know whether it passed.

- Trace every case to one source acceptance criterion. Do not invent a criterion the source does not contain.
- One case, one objective. Do not combine unrelated assertions.
- Preconditions, data, and steps must be concrete. Numbered actions, one per line.
- The expected result must be observable: a status, payload, UI state, or log line — not "works as expected".
- Title the case with the scenario, not "Test Case".

A case that cannot fail is not a test. A case with no source criterion is out of plan.

Follow the Test Plan Template for structure; this spec governs what those cases must satisfy.

## Environments and data <!-- key: environments-and-data -->

Run tests only where you have access, and only with data you are allowed to use.

- Name each environment. Do not invent access you do not have.
- Prefer fixtures and dedicated accounts. Do not use production write paths or real personal data.
- State the build, flags, and tools required before a run starts.
- If the required environment is missing, mark those cases `not run` with that reason. Do not substitute a different environment silently.

Shared mutable test data that other runs can corrupt is not a valid fixture. Isolate it or name the collision.

## Execution evidence <!-- key: execution-evidence -->

Record only what was observed. Never report a result that was not observed.

Allowed outcomes:

- **pass** — the expected result was seen
- **fail** — the expected result was not seen; record the actual result
- **not run** — the case was not executed; record the exact reason

`not run` reasons include missing environment, missing data, tool unavailable, blocked by a prior failure, and `not ready: <reason>` when an implementation-specific case lacks environment, API, or build detail. Never invent that case as PASS.

Record failures honestly. Do not convert a fail to `not run` to keep the plan green.

A required automated check that could not be run is still `not run` in a Test Plan. Review treats an unrun required check as a failure; this spec only forbids inventing a pass.

Do not pre-fill results. Title each run with the date and environment.

## Completion criteria <!-- key: completion-criteria -->

Testing is done when every source acceptance criterion has at least one case, every high-risk behaviour has a primary layer, every case has an observed outcome (pass, fail, or `not run` with reason), and no result was invented.

Do not mark the plan complete while a high-risk behaviour has no case, while any case lacks a source criterion, or while results are assumed rather than recorded.

Unresolved fails stay fails. `not run` is not a pass. `not ready: <reason>` is not a pass.
