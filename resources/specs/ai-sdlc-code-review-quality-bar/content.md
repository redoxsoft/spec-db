# Code Review & Quality Bar

## Expected inputs <!-- key: expected-inputs -->

This spec governs review of a concrete change. Apply it when checking a diff against a locked work item. It does not design a test strategy, and it does not decide product scope.

Use:

- the locked work item (milestone, Change Request, or Bug Fix Spec) and its acceptance criteria
- the exact change scope — files, diff, or milestone boundary
- the repository's required checks (lint, typecheck, tests, or the project's equivalent)

Stop if the work item or change scope cannot be named. Do not review an inferred or unrelated diff.

This spec does not author a Test Plan. Follow Test Strategy Guidelines for designing and executing tests.

## Spec correctness <!-- key: spec-correctness -->

The change must satisfy the locked work item. Behaviour the spec does not require is out of scope.

- Map every acceptance criterion to the change. An unmet criterion is a finding.
- Reject extra behaviour the spec forbids, or that expands neighboring work.
- Treat a mismatch between implemented behaviour and stated criteria as a defect, not a doc fix to defer.
- If the spec is silent on behaviour the change introduces, record a finding. Do not invent a requirement to justify the code.

Do not pass a review because the code looks reasonable. Pass only against the locked spec.

## Maintainability <!-- key: maintainability -->

Prefer the smallest change that meets the spec. Do not expand into unrelated cleanup.

- Keep new logic inside the owners named by the design, if a design exists.
- Reuse the canonical helper, contract, or type. Do not duplicate it.
- Name things for the behaviour they implement, not for the ticket.
- Do not leave dead code, commented-out blocks, or debug leftovers in the locked scope.
- A change that cannot be understood without its author is not maintainable.

Refactor only when required to implement the spec correctly. Cosmetic restyles are minor at most.

## Security <!-- key: security -->

Treat new or changed trust boundaries as in-scope even if the spec did not spell them out.

- Validate untrusted input at the boundary that accepts it. Do not trust client-shaped data inside the component.
- Do not log secrets, tokens, or personal data. Do not commit credentials or keys.
- Preserve authentication and authorization on every new or changed endpoint, job, or write path.
- Do not weaken existing access checks, CORS, or CSRF protections to make a test pass.

A security defect an attacker can trigger from the changed surface is a blocker.

## Tests and verification <!-- key: tests-and-verification -->

The change must include proportionate tests and must pass the required checks.

- Every new behaviour has a test that would fail if the behaviour were missing.
- A bug fix includes a regression test that would have caught the defect, or an explicit reason an automated test cannot exist.
- Run the required checks and record the actual outcome.
- A required check that cannot be run is a failure, not a skip. Do not treat `not run` as a pass.
- Do not delete, skip, or weaken a failing test to make the review green.

This section judges the change's own tests and required checks. Broader coverage design belongs in Test Strategy Guidelines.

## Severity levels <!-- key: severity-levels -->

Assign every finding exactly one of these three severities. Do not invent a fourth level. Do not leave severity blank.

- **Blocker** — the change is wrong, unsafe, or violates the spec; it must not proceed. Examples: unmet acceptance criteria; a security hole on a changed surface; a required check that failed or could not be run; data loss; auth bypass.
- **Major** — a real defect or maintainability problem that must be fixed before the delivery-verification gate passes. Examples: missing regression coverage for a confirmed bug; duplicated contracts; a stated edge case that will fail; a broken error path callers rely on.
- **Minor** — a suggestion that may be deferred without blocking. Examples: naming nits, optional comments, non-functional style, or a refactor that does not affect correctness.

If a finding could be blocker or major, choose blocker. If it could be major or minor, choose major. Deferral is allowed only for minor.

Unresolved means the finding still applies to the current change. A finding that was fixed and re-checked is resolved.

## Completion criteria <!-- key: completion-criteria -->

Review passes only with **zero unresolved blocker and major findings** and all required checks succeeding.

A required check that cannot be run is a failure, not a pass.

Review is not done while any blocker or major finding is open, while a required check has not been observed as succeeding, or while the change still fails a locked acceptance criterion.

Minor findings may remain open. Record them; they do not gate the review.

Do not mark review complete by lowering severity to reach zero.
