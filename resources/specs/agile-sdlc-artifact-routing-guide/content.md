# Agile Artifact Routing Guide

## Default Route <!-- key: default-route -->

Most work uses the durable route:

```text
Work Item -> implementation and verification -> Delivery Record
```

The Work Item preserves intent, acceptance criteria, repository boundary, and verification approach; it adds exclusions, defect evidence, risks, or decisions only when material. The Delivery Record summarizes what changed and links to observed evidence.

A bounded low-risk typo, copy, simple configuration, or one-line correction with clear intent, one or a few deterministic criteria, exact permitted paths and verification, and no material decision, risk, ambiguity, or cross-session resumability need is the narrow exception. It needs no Work Item artifact; the Delivery Record is its durable artifact. Any work outside those conditions uses the durable route.

## Work Item Modes <!-- key: work-item-modes -->

Changes, defects, and loose evidence that require a durable contract are modes of one Work Item, not separate artifact routes.

| Mode | Fits | Distinct content |
| --- | --- | --- |
| Change | A bounded amendment to behavior, an interface, configuration, or copy. | Intended outcome, affected boundary, acceptance criteria, verification, and exclusions only when needed. |
| Defect | Unintended behavior, a failing test, an incident, or a regression. | Available defect evidence, fix boundary, regression checks, and a cause tagged `! [HYPOTHESIS]` until confirmed. |
| Task | An engineering objective drawn from an issue, diff, review finding, or unformatted notes. | Intended outcome, acceptance criteria, repository boundary, verification, and optional originating evidence. |

Review findings are evidence for a Work Item. They are not a substitute for its execution boundary.

## Optional Artifacts <!-- key: optional-artifacts -->

Product Spec, Technical Design, and Delivery Plan are independent options. Each is justified by a concrete uncertainty it resolves; none requires either of the others.

| Artifact | Use it when | It resolves |
| --- | --- | --- |
| Product Spec | Product behavior, users, business rules, scope, or success evidence needs agreement beyond one bounded Work Item. PRD mode fits a multi-capability initiative; Feature mode fits one behavior-rich capability. | What outcome or behavior is intended. |
| Technical Design | Architecture, data migration, security design, system boundaries, or published compatibility has a consequential open choice. | How the solution should work across technical boundaries. |
| Delivery Plan | Sequencing, coordination, test strategy, long-running work, or recovery needs to remain explicit across sessions or contributors. Test Plan and Implementation Plan are modes of the same shape. | How substantial execution or verification should be organized. |

One optional artifact may be enough. Existing repository conventions or an already-approved decision may resolve the uncertainty without any additional artifact.

## Routing Signals <!-- key: routing-signals -->

Artifact choice follows unresolved uncertainty, not work size or category alone.

- A truly trivial correction meeting every narrow exception condition may omit the Work Item; otherwise a coherent bounded outcome routes directly through a Work Item.
- Several capabilities with a shared objective may benefit from a Product Spec in PRD mode.
- One capability with unsettled flows, rules, or edge cases may benefit from a Product Spec in Feature mode.
- An unsettled architecture, migration, security design, or published contract may benefit from a Technical Design.
- Material sequencing, coordination, recovery, or coverage choices may benefit from a Delivery Plan.
- A change that already exists may use review or extended verification without retroactively creating planning artifacts.

When a proposed Product Spec bundles independent capabilities, a split is useful only when separate documents clarify independently deliverable behavior. The accepted subjects and boundaries remain a product decision; a split is not silently imposed.

## Risk and Decision Boundaries <!-- key: risk-boundaries -->

Database or migration work, authentication or authorization, personal data, and published contracts are risk signals. They affect scoping and verification, but they are advisories when the consequential choices are already resolved.

A human decision is needed only when safe progress would require choosing an unresolved consequential matter:

- materially different product behavior;
- a material expansion of outcome or system boundary;
- security or privacy policy;
- destructive or irreversible data handling and recovery;
- compatibility or migration behavior for a published contract;
- the meaning of an acceptance criterion or the integrity of its verification;
- credentials, production access, legal approval, or other external authority.

Once the decision is recorded, its category does not create another stop. Environmental inability to perform required work is a block, not an artifact-selection signal.

## Routing Anti-Patterns <!-- key: anti-patterns -->

- **Documentation by category.** A migration or authentication change does not automatically require a Technical Design.
- **Mandatory chain.** A Product Spec does not imply a Technical Design or Delivery Plan, and no optional artifact is a prerequisite for another.
- **Retroactive planning stack.** A bounded defect or existing diff does not wait for documents that resolve no remaining uncertainty.
- **Silent invention.** An artifact does not turn an unresolved product or safety choice into an assumed fact.
- **Duplicated authority.** Requirements guidance judges requirement quality; it does not select artifacts. Technical, test, and review guides provide domain knowledge; they do not define routes.
