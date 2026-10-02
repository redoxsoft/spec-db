# Agile Code Review Guide

## Review Checklist <!-- key: review-pillars -->

A code review is an independent look at whether a change meets its contract, fits the architecture, and stays inside its scope. Consult these seven pillars as a checklist. Findings are individual items. A review does not need a section for each pillar.

1. **Correctness and logic.** The change meets each acceptance criterion of its governing Work Item when one exists. Algorithmic soundness, edge cases, null and undefined safety, error propagation, and preservation of state invariants.
2. **Architectural alignment.** Consistency with the governing `ADR-xxx` decisions, separation of layers (for example, no raw SQL in a controller), and component boundaries.
3. **Maintainability.** Small focused functions, expressive names, no dead or commented-out code, and complexity a reader can follow.
4. **Security and secrets.** No hardcoded secrets or credentials, parameterized queries, output encoding where content is rendered, and authentication and authorization checks where the contract requires them. Whether or not the contract mentions it, an existing access check is not removed or weakened, and secrets, credentials, and personal data do not appear in logs.
5. **Performance and resources.** Computational cost, no N+1 query patterns, handles and connections closed, and I/O that does not block the caller without a reason.
6. **Test quality.** Tests assert observable behavior and fail when the behavior they cover is missing. New edge cases have coverage. Execution is deterministic.
7. **Scope discipline.** Every modified file and line traces to the governing task, requirement, or defect. Unrelated legacy code stays as it was.

A finding may name the pillar it relates to. That name is a label on the finding, not a heading the report is required to include.

## Severities <!-- key: findings-taxonomy -->

Findings use exactly two severities: blocking and non-blocking. A finding that could be either is blocking. A severity is never lowered to reach a pass.

### Blocking <!-- key: blocking -->

A blocking finding means the change is unsafe or incorrect until it is fixed. This severity covers:

- A security vulnerability, a removed or weakened access check, secrets or personal data written to logs, a data-loss risk, a broken build, a regression in core logic, or an edit outside the agreed scope.
- An unmet acceptance criterion of the governing Work Item.
- A significant flaw, an unhandled edge case, an N+1 query pattern, a missing test for new behavior, or missing error recovery.

### Non-Blocking <!-- key: non-blocking -->

A non-blocking finding is an observation the change can ship with. This severity covers:

- A naming improvement, minor duplication, or a small inconsistency with the repository's own conventions.
- Informational feedback, recognition of a clear approach, or an alternative idiom.

## Actionable Findings <!-- key: actionable-finding -->

A finding is actionable when it has all five of these:

- **Location.** The repository-relative file and smallest useful line or region. A whole-file or generated-artifact concern names the artifact and relevant region.
- **Severity.** `blocking` or `non-blocking`.
- **Evidence.** The concrete observed condition and the governing requirement, invariant, or established repository behavior it conflicts with.
- **Impact.** The incorrect behavior, risk, regression, or scope violation the condition can cause.
- **Recommendation.** A concrete change, specific enough that another person could apply it. A short snippet belongs here when it makes the recommendation precise.

"This looks messy" is not a finding: it has no evidence, impact, or concrete fix.

## Anti-Patterns <!-- key: anti-patterns -->

- **An incomplete look.** A review that skips tests, error paths, and security boundaries has not consulted the checklist.
- **Style bike-shedding.** A personal formatting preference that the repository's linters do not enforce is not a finding. It is not blocking, and it is not a non-blocking note.
- **Moving the goalposts.** New feature requirements that were not in the agreed spec are not review findings.
- **Vague feedback.** A comment without a useful location, concrete evidence and impact, and a specific fix is not actionable.
- **Scope creep left in place.** Edits to unrelated files in the same change are a scope-discipline problem, and they are blocking when they fall outside the agreed change.
