# PRD to Feature List Rules

## Purpose <!-- key: purpose -->

Convert a PRD into a feature list that a delivery team can estimate, without silently inventing scope and without silently dropping it.

This spec governs *what* to extract and *how* to shape it. The companion spec Feature List Document Format governs the structure of the document produced.

## Source of truth <!-- key: source-of-truth -->

The PRD is the only source of scope, and it is treated as finished. A thin or messy PRD produces a thin or messy feature list. Do not interrogate it into completeness.

- Do not add a feature because similar products have it.
- Do not drop a requirement quietly. If the PRD itself marks it optional or defers it, record it as out of scope so the exclusion is visible.
- Every committed feature cites the PRD section it came from. A row that cannot cite one does not belong in the list.
- Where the PRD is silent or vague, pick the reading its words most nearly support, commit the implied product behaviour when that is the natural reading, and record the choice as an assumption. Do not block the list to wait for a better PRD.

## The whole PRD is in scope <!-- key: whole-prd-in-scope -->

The feature list covers the entire source document. Do not narrow it to a proof of concept, a phase, or a product area because that slice looks like the natural first delivery.

Only two things move material out of the committed list:

- **The PRD says so.** It labels the capability optional, or defers it to a later phase. Use the document's own wording as the reason.
- **A human says so.** Someone running the pipeline states the exclusion explicitly. Record who asked and what they said.

An open question must not reintroduce that slice. Do not ask which half of the PRD ships first, what belongs in a proof of concept, or how to bound a first increment. Those questions are silent omission by another name.

## Translation model <!-- key: translation-model -->

Work in this order, one stage at a time:

1. **PRD evidence** — a statement, workflow step, constraint, output, integration, or decision rule that appears in the document.
2. **Requirement** — the capability or condition that evidence implies, noted against the PRD section it came from.
3. **Module** — a coherent product area drawn from the canonical spine.
4. **Feature** — a distinct, estimable capability inside a module.

Do not jump from PRD headings straight to features. Write the requirement inventory before designing modules. Only the feature list is published.

## Requirement signals <!-- key: requirement-signals -->

Classify every extracted requirement as exactly one signal. The signal drives which module it lands in.

| Signal | Covers | Typically becomes |
|---|---|---|
| User workflow | An actor performs an action | A user-facing feature in the core workflow module |
| System capability | The product stores, calculates, validates, or automates | A backend or platform feature |
| Data and integration | Sources, uploads, APIs, connectors, imports, exports, syncs | An ingestion or integration feature |
| AI capability | Extraction, classification, inference, ranking, generation | Several features — see AI decomposition |
| Output | Dashboard, report, document, notification, score, file | A reporting or export feature |
| Governance | Roles, security, privacy, audit, compliance, retention, scale | A cross-cutting feature, never a footnote |

A statement that carries two signals produces two requirements, not one requirement with a compound description.

## Scope classification <!-- key: scope-classification -->

Every requirement carries exactly one scope label. The label decides where it lands in the final document.

| Label | Use when | Lands in |
|---|---|---|
| Committed | The PRD requires it, and neither defers nor marks it optional | A module feature table |
| Assumption | A reading is needed because the PRD is silent, vague, or implied | Assumptions |
| Dependency | Delivery needs an external party, API, licence, template, or approval | Dependencies |
| Optional | The PRD says may, could, optional, or if required | Out of Scope |
| Future Phase | The PRD defers it to a later phase | Out of Scope |
| Open Question | The PRD states two incompatible things | Open Questions |

Optional and future-phase material never appears in a committed feature table. Both labels require the PRD's own wording — quote or paraphrase the phrase that justifies them. Neither is available for material you simply judged to be later work.

Prefer an assumption over an open question. Record the reading you took and what changes if it is wrong, then continue. Open Questions are for contradictions in the PRD, not for missing operational detail, unnamed roles, unset cadence, or an unstated human-control mechanism.

When the PRD implies product behaviour without specifying the mechanism — most often human control over an advisory AI decision — commit the implied feature and record the reading as an assumption. Do not invent capabilities the PRD does not imply, and do not block the document.

Vendor-supplied capability is a Dependency, not a Committed feature with padded hours. A bought assessment tool, speech service, or enrichment API has a licence and an integration cost, and those are different numbers. Mark the integration work as committed if the PRD requires it, and record the vendor itself as a dependency.

## Module spine <!-- key: module-spine -->

Use this canonical, ordered spine:

| # | Module | Include when |
|---|---|---|
| 1 | Experience Design | The PRD implies screens, journeys, or a design system |
| 2 | Platform Foundation | Environments, repository, CI/CD, or data architecture are implied |
| 3 | Identity and Access | Roles, login, permissions, or tenancy appear |
| 4 | Data Ingestion | Data enters from uploads, APIs, crawls, or onboarding |
| 5 | Data Processing and Records | Data is normalised, deduplicated, scored, or stored as records |
| 6 | Core Workflow | Always — the product's central job or jobs |
| 7 | Intelligence and Automation | Any AI, scoring, ranking, or inference is described |
| 8 | Human Review and Collaboration | People review, override, annotate, or approve |
| 9 | Reporting and Exports | Dashboards, reports, exports, or notifications are described |
| 10 | Administration and Configuration | Settings, thresholds, templates, or admin tooling appear |
| 11 | Compliance and Auditability | Audit trails, retention, residency, or regulation appear |
| 12 | Delivery Management | The estimate is expected to include project-management artefacts |

Rules for using the spine:

- Include a module only when at least one requirement supports it. Empty modules are noise.
- Rename module 6 to the product's actual job — Resume Screening, Creator Discovery, Claims Intake. Keep its position.
- If the PRD has more than one distinct central job — different actors, workflows, or outcomes that would be estimated, tested, or bought separately — split module 6 into one named module per job and keep those modules adjacent. Do not fold a second job into Reporting, Intelligence, or another neighbour to preserve a single core name. Table size does not decide this split.
- Split any other spine module into two only when it would otherwise exceed roughly ten features, and keep both halves adjacent.
- Adding a module outside the spine is allowed but must be deliberate. Prefer fitting the work into an existing one.
- Delivery Management holds estimable project-management work — plans, cadence, status artefacts — when the PRD or the person running the pipeline asks for it in the estimate. Partnership, engagement model, modular adoption, or pace tied to commercial wins are Assumptions. They are not Delivery Management features.

## Feature granularity <!-- key: feature-granularity -->

A feature has one primary outcome and can be estimated on its own.

Split a capability when the parts differ in any of these:

- User outcome or interface
- Data model or transformation
- External integration
- Model or algorithm behaviour
- Output artifact
- Permission or control model
- Failure mode

Keep parts together when they deliver one outcome and nobody would prioritise, test, or buy them separately.

Calibration, as a sanity check rather than a rule:

- A module usually carries three to eight features. One or two suggests it belongs inside a neighbour. More than ten suggests it should split.
- A feature description runs one to two sentences, roughly fifteen to thirty-five words.
- If an engineer would ask more than two material clarifying questions about a row, it is a theme, not a feature. Decompose it or record the reading as an assumption.

## AI decomposition <!-- key: ai-decomposition -->

Never write a single feature called AI Integration, AI Engine, or similar. An AI requirement is a chain, and each link has separate complexity, separate failure modes, and often a separate vendor.

For each AI requirement, decide whether the PRD supports a feature at each link:

1. Input acquisition and preparation — upload, OCR, parsing, normalisation
2. The model task itself — extraction, classification, inference, ranking, generation
3. Structured output — the score, recommendation, or generated artifact
4. Explanation, confidence, or traceability
5. Human review, correction, override, or approval
6. Feedback, evaluation, or quality validation

Include only the links the PRD evidences or clearly implies.

When a PRD says AI should support a decision rather than make it, treat human control as implied product behaviour. Commit a review, override, or approval feature and record the mechanism you assumed (for example in-product review before a client-ready CV is issued). Do not block the list because the PRD omitted the UI.

Other implied-but-unstated chain links follow the same pattern: assume a reading, commit if it is product behaviour, record the assumption. Do not add links the PRD does not imply.

## Cross-cutting pass <!-- key: cross-cutting-pass -->

PRDs bury operational scope in passing remarks. Run this pass explicitly before drafting, and turn each hit into a requirement:

- **Identity and access** — roles, permissions, tenant isolation, SSO
- **Data lifecycle** — source, ownership, retention, deletion, versioning, freshness
- **Integrations** — credentials, quotas, rate limits, retries, sync frequency, failure handling
- **Security and compliance** — residency, consent, encryption, audit trails, regulation
- **Operations** — monitoring, logging, alerting, admin tooling, manual correction
- **Scale and performance** — record volumes, concurrency, batch sizes, response targets
- **Outputs** — export formats, templates, sharing, permissions

A single clause such as no data leaves the region generates architecture, deployment, access-boundary, and audit work. It is not a remark; it is several requirements.

## Writing style <!-- key: writing-style -->

Feature names are concrete capability phrases. Prefer Bulk Upload and Parsing, Location-Based Search, Data Quality Scoring, Manual Data Override. Avoid Dashboard, Database Setup, User Management, Backend Work, Miscellaneous.

Descriptions follow one shape: what it does, the material input or rule, the result, and any constraint that changes delivery. Aim for one to two sentences.

Use the PRD's own vocabulary for domain nouns. If the PRD says creator, do not switch to influencer halfway through the list.

Describe behaviour, not implementation, unless the implementation changes scope. Naming a database is noise; requiring a search index is scope.

Never put an effort estimate in a description.

## Traceability contract <!-- key: traceability -->

Cite PRD headings. Format: `§7.4 Skill Inference`. If the PRD has no numbering, use the heading text. Do not invent another identifier scheme.

- Every feature, assumption, dependency, and out-of-scope row cites the PRD sections it came from.
- Every PRD heading has a home in the feature list — as a feature citation, an assumption, a dependency, an out-of-scope entry, or an open question.

Coverage is at section granularity. A section that produced two features when it described three capabilities still passes the mechanical check. Closing that gap is a judgement check: re-read the densest sections against the rows citing them.

## Verification checklist <!-- key: verification-checklist -->

Run the mechanical checks first:

1. Every PRD heading appears in at least one citation somewhere in the feature list.
2. Every feature cites at least one PRD section, and every cited section exists in the PRD.
3. Feature names are unique within a module.
4. Every section holds at most one table, and no table exceeds 29 data rows, 10 columns, or 400 characters in a cell.
5. No effort cell contains a number, including zero.
6. Every Out of Scope row quotes the PRD wording that makes it optional or deferred, or names the person who excluded it.

Then apply judgement checks:

- Does every module in the document earn its place, and is it named from the spine?
- If the PRD has two or more distinct central jobs, does each have its own core module, or was a job folded into Reporting or another neighbour?
- Is Delivery Management estimable project-management work, or engagement language that belongs in Assumptions?
- Is any feature a theme in disguise, or a catch-all?
- Is any capability split so finely that the parts have no independent delivery value?
- Does each AI chain include the links the PRD evidences or implies, with implied human control committed and the reading recorded as an assumption?
- Did the cross-cutting pass produce features, or did constraints stay buried in descriptions?
- Are duplicates and near-duplicates consolidated?
- Were underspecified details recorded as assumptions rather than turning the document into a questionnaire?
- Does any open question ask which slice of the PRD to deliver first, or ask the PRD to supply detail it never had?
- Re-read the densest PRD sections against the rows citing them. Did a section describing several capabilities produce features for all of them, or only for the first?

Assign each finding a severity:

- **Blocking** — a committed PRD requirement is missing from the list; a feature has no PRD evidence; a PRD section has no home; or an open question re-slices the PRD into a phase, PoC, or first increment.
- **Major** — a row is too vague or too combined to estimate, or a cross-cutting requirement was dropped.
- **Minor** — wording, naming, or placement.

Resolve every Blocking and Major finding. Underspecification is resolved with an assumption and a chosen reading, not by blocking the document. Apply Minor findings only when the fix introduces no new scope. Re-run the six mechanical checks after any remediation. Status is `FINAL` when Blocking and Major findings are resolved. Do not use `BLOCKED` because the PRD left details unstated.
