# Work Intake & Artifact Selection Guide

## Expected inputs <!-- key: expected-inputs -->

This spec governs which product artifact to write, and when a Work Scope Brief is enough to execute. Apply it at intake and when a later pipeline receives non-native evidence. It does not author architecture, code, or test cases.

Use:

- the initiative, requested change, problem statement, ticket, design, branch, diff, or pasted evidence
- existing product, design, API, or technical contracts, if any
- whether the intended behaviour is already defined, and whether observed behaviour matches it

If those inputs are missing, stop and collect them. Do not classify from a vague wish.

Missing catalog templates or guidelines are a **workspace setup** problem, not an invalid project input. Report the missing exact title and its stable slug, and stop until the `ai-sdlc` pack is installed.

## Classification rules <!-- key: classification-rules -->

Every delivery scope has **one product-intent artifact when applicable**, **one bounded work item for execution**, and any number of linked evidence sources.

Write a **PRD** when the work creates or materially changes a product capability, user journey, business rule, or success measure — whether the product is new or existing. Typical signals:

- a new product, module, or user-facing surface
- a significant evolution of an existing capability, workflow, or pricing model
- new or reshaped journeys, audiences, or product-level metrics
- an architecture or platform change that creates or retires product capabilities

Write a **Change Request** when all of these are true:

- the intended behaviour is already substantially defined in an existing product, design, API, or technical contract
- the work is a bounded, intentional amendment to that contract
- the desired outcome is a delta, not a new or materially expanded product framing

Write a **Bug Fix Spec** when the desired behaviour already exists and observed behaviour is incorrect: a regression, broken workflow, incorrect output, performance defect, or production incident. Do not use a Bug Fix Spec for an intentional contract change.

A **Work Scope Brief** is not a fourth product-intent classification. Create or update `<Subject> - Work Scope Brief` only as an **execution bridge** when the team has sufficient evidence to plan, build, review, or test a bounded slice, but no native Change Request, Bug Fix Spec, or open milestone yet exists. Typical evidence: an approved PRD, Design Spec, ticket, branch, PR, named diff, or mixed sources.

When signals conflict, prefer the larger product-intent artifact. A change that needs new journeys, a new audience, or new product-level metrics is a PRD even if some existing behaviour is reused.

A Change Request is not a replacement specification. It is a tracked amendment proposal against an identified source of truth. After verification, Delivery Sync applies approved amendments to the linked source documents and keeps the Change Request as the implementation record.

## Evidence and locking <!-- key: evidence-and-locking -->

Pipelines require **sufficient evidence** for their decision, not a fixed type matrix.

- Prefer a native SpecX document. Lock both its document id (when the host provides one) and its display title. Later tasks read by id when available and use the title only for display or fallback.
- URL, path, issue id, or pasted content is usable evidence. Before a later task rereads the lock, persist that evidence as a SpecX document: a native PRD, Change Request, Design Spec, Bug Fix Spec, or Test Plan when that is the intended artifact, otherwise a Work Scope Brief.
- Label each extracted statement as observed, inferred, or unresolved. Do not write guesses as facts.
- **Blocked:** the agent cannot safely determine what to change, the repository boundary, or the evidence required to verify it.
- **Recommended:** the team can proceed, but missing design, environment, or contract detail is recorded as an assumption or follow-up.

Do not bounce the user into an unrelated authoring pipeline whose only purpose is satisfying a type gate. Offer the smallest durable SpecX record that makes the current stage safe and traceable.

## PRD quality bar <!-- key: prd-quality-bar -->

A PRD is ready only when:

- the problem, audience, and 1–3 measurable goals are stated
- non-goals are explicit and are not deferred stretch items
- every journey has a user need, observable steps, and pass/fail acceptance criteria
- every requirement has intent and testable acceptance criteria
- assumptions and open questions are labeled as such, not written as facts

Do not invent personas, metrics, or scope. Do not describe implementation.

Follow the PRD Template for structure; this spec governs whether a PRD is warranted and when it is good enough.

A ready PRD may feed Design Spec, Milestone Plan (product-level), requirements-based Test Plan, or a Work Scope Brief for Implementation. It is not itself an implementable change boundary.

## Change Request quality bar <!-- key: feature-spec-quality-bar -->

A Change Request is ready only when:

- the source of truth is named (PRD, Design Spec, API or technical contract, or equivalent usable reference)
- current behaviour and desired outcome are both stated as deltas
- every change has testable acceptance criteria
- every impacted spec section names its current contract and the required update
- the delivery approach says whether the change can go straight to implementation or needs a design spec and milestone plan

Do not expand into product vision, new personas, or a restated PRD.

If you cannot name an existing contract to update, stop and reclassify as a PRD. Follow the Change Request Template for structure. When the source contract was pasted or linked rather than already native, snapshot that evidence inside the Change Request; do not require a separate Work Scope Brief solely for the source contract.

## Work Scope Brief quality bar <!-- key: work-scope-brief-quality-bar -->

A Work Scope Brief is ready only when:

- entry mode is `planned` or `as-built`
- at least one evidence item names a location (document id/title, URL, issue, path, branch, diff, or paste hash)
- the outcome, inclusions, exclusions, and exact change boundary are stated
- every acceptance criterion is a pass/fail check traced to evidence
- assumptions and unresolved gaps are labeled as such

Follow the Work Scope Brief Template for structure. If the outcome, acceptance criteria, exclusions, or repository boundary cannot be locked without guessing, **stop**. That is a safety block, not a type gate.

Do not use a Work Scope Brief to skip a Bug Fix Spec when the work is restoring already-defined behaviour, or to skip a PRD when the work is a material capability change that still needs product framing.

## Escalation cases <!-- key: escalation-cases -->

Escalate a Change Request to a PRD when, during authoring, any of these appear:

- new user-facing surfaces, audiences, or journeys
- new success metrics that redefine what the product is for
- architecture changes that create or retire product capabilities
- no existing spec section can receive the required update
- multiple independently releasable slices, or unknowns and dependencies that exceed a bounded amendment

Downgrade a PRD to a Change Request when all of these become true:

- the work is a bounded amendment to existing behaviour
- a source contract already owns the behaviour
- no new journeys, audiences, or product-level metrics are needed

Convert a Bug Fix Spec to a Change Request or PRD when diagnosis shows expected behaviour is undefined or product intent has changed. Convert a Change Request or PRD to a Bug Fix Spec when the work is restoring already-defined behaviour, not changing it.

Promote a Work Scope Brief to a Change Request, Bug Fix Spec, or PRD when those quality bars become the right durable record. Keep the brief as linked evidence; do not delete provenance.

When escalating, stop the current authoring path, record the reason, and start the other artifact.

Do not keep two product-intent artifacts live for the same change. A Work Scope Brief may coexist with a PRD, Design Spec, or ticket as linked evidence.

## Completion criteria <!-- key: completion-criteria -->

Classification is done when the product-intent artifact (if any) and, for execution stages, a bounded work item are locked, the reason is recorded, and the matching quality bar is met.

If classification is still ambiguous after these rules, ask the user which path to take rather than writing a hybrid document.
