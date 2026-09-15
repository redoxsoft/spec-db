# Design & Architecture Principles

## Expected inputs <!-- key: expected-inputs -->

This spec governs technical design. Apply it when authoring or reviewing a Design Spec. It does not decide whether the source is a PRD or a Change Request, and it does not diagnose bugs.

Use:

- the locked source PRD or Change Request
- existing design specs, contracts, and architecture rules
- the current codebase and runtime constraints

Stop if the source requirements cannot be named. Do not invent product scope to fill a design.

Do not use this spec to write a test plan or a bug diagnosis.

## Boundaries and decomposition <!-- key: boundaries-and-decomposition -->

Give every concern exactly one owning component. State what each component must not own.

- Split when two teams, failure modes, or release cadences would otherwise share a module.
- Keep a change inside the smallest set of components that can satisfy the source requirements.
- Do not add a new service, store, or layer unless an existing owner cannot take the responsibility.
- Keep business rules out of presentation components and persistence adapters.
- Name the boundary in the design; do not leave ownership implied by folder names.
- One owner per write path. Shared mutable state without an owner is a failed decomposition.

A Design Spec that restates requirements without naming owners is incomplete.

Do not decompose by technology layer (frontend, backend, database) when a user-facing capability already has a natural owner.

## Interfaces and data compatibility <!-- key: interfaces-and-data-compatibility -->

Treat published APIs, events, and schemas as contracts other systems rely on.

- Validate external input at every trust boundary. Do not trust caller-shaped data inside the component.
- Evolve contracts backward-compatibly: add optional fields, keep existing field meaning, and version only when a breaking change is unavoidable.
- Do not remove, rename, or reuse a field for a new meaning without a migration path for current callers.
- Document success and failure behaviour callers can observe, not only the happy-path payload.
- Point to one canonical schema per contract. Do not duplicate the same shape in several sections.

If compatibility cannot be preserved, record the break, the migration, and the rollback.

Default to additive change; treat a version bump as a last resort, not a style preference.

## Security and reliability <!-- key: security-and-reliability -->

Design the failure, not only the success path.

- Authenticate and authorize at the boundary that exposes the capability.
- Minimize data collected and retained; name where secrets and personal data live.
- State failure modes, retry or timeout behaviour, and what the caller sees when a dependency is down.
- Name the signals that show healthy, degraded, and failed states.
- Do not swallow errors, retry without a bound, or log secrets and personal data.

Omit threats you cannot justify from the source requirements or the change's attack surface.

Reliability work that cannot be observed in logs, metrics, or user-visible failure behaviour is not designed.

## Decision discipline <!-- key: decision-discipline -->

Record each architecture decision as a chosen option, at least one rejected alternative, and the reason the alternative lost.

- Decide only what this design must lock. Do not reopen stack choices already recorded elsewhere.
- Do not list undecided options as if they were chosen.
- If two options remain viable, pick one or label the decision open; do not hide the fork in prose.
- Prefer the simplest design that meets the source requirements and these principles.

A decision with no rejected alternative is incomplete unless no alternative existed; say so if that is the case.

Follow the Design Spec Template for structure; this spec governs the rules that structure must satisfy.

## Completion criteria <!-- key: completion-criteria -->

Design is done when every source requirement maps to an owning component or contract, every published interface states validation and compatibility, failure modes and signals are named, and every material decision records the choice, the rejected alternative, and the reason.

Name residual gaps explicitly; do not mark the design complete around them.
