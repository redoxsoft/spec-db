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

## Workspace Organization <!-- key: workspace-organization -->

Runtime project work belongs outside imported collection resources. `Project Work` is the recommended runtime base, but a team may explicitly choose another base or customize the collection default.

```text
Project Work/
├── Initiatives/
│   └── <Initiative> - Agile PRD
├── Features/
│   └── <Feature>/
│       ├── Feature Spec, Tech Spec, and plans
│       └── Work/
│           └── Work Items, Delivery Records, and Review Findings
└── Work/
    └── <Subject>/
        └── Work Items, Delivery Records, and Review Findings
```

PRDs remain flat in `Initiatives`; there is no folder per PRD. A feature has one `Features/<Feature>` folder, with delivery artifacts under its `Work` child. Work without a feature anchor uses `Work/<Subject>`; there is no folder per Work Item.

An imported collection and its descendants are protected from runtime output. Protection comes from imported-resource collection metadata and folder ancestry, not from a fixed folder name. A similarly named team folder is not protected merely because of its name, and a renamed imported folder remains protected.

## Placement Principles <!-- key: placement-principles -->

Artifact identity and folder placement are distinct. A durable artifact id governs when available; an exact title or explicit reference resolves identity otherwise. Each output keeps its own create/update disposition, folder id, informational folder path, and advisory. A later human folder move does not change identity: update by id in the artifact's current folder and never relocate it.

Existing artifacts are updated in their current folders. This includes artifacts at workspace root, artifacts moved by a person, and artifacts in unconventional locations. New defaults do not migrate prior work.

For new artifacts, an explicit valid folder override has precedence, followed by the governing source artifact's folder, then the artifact's default under the runtime base. No new runtime artifact may be created in the protected import tree, including by colocation with an existing Work Item, Delivery Record, or Review Findings there. Skip any protected override, source, or counterpart candidate, continue to a valid feature `Work` or standalone default, and produce one advisory rather than a hard stop. Missing placement evidence also uses a deterministic fallback with an advisory; only ambiguous artifact identity requires a decision.

Feature Specs establish `Features/<Feature>` even when they originate from a PRD. Tech Specs and plans follow their primary Feature Spec or other governing feature source. Work Items, Delivery Records, and Review Findings use the feature's `Work` folder when feature-backed and `Work/<Subject>` otherwise. Review follows an existing Delivery Record or Work Item location. Extended verification and synchronization update existing artifacts and create no folders.

When sources disagree, use the artifact that governs the work: the primary Feature Spec for feature-level generation, the Work Item for implementation, and the Delivery Record for later verification or synchronization.

Predictable placement should not require browsing folder contents. Persisted ids, exact artifact references, cheap direct folder properties, and the cheaply fetched known folder hierarchy provide sufficient evidence. Folder-content listings are expensive and are not a dependable way to discover identity, detect collisions, or choose a destination. If a persisted folder id for a not-yet-created output disappears, re-ensure only its exact persisted path; this preserves the decision rather than rerunning precedence.

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
