# PRD to Feature List Rules

## Purpose <!-- key: purpose -->

Convert a PRD into a feature list that a delivery team can estimate, without silently inventing scope and without silently dropping it.

This spec governs *what* to extract and *how* to shape it. The companion spec Feature List Document Format governs the structure of the document produced.

## Source of truth <!-- key: source-of-truth -->

The PRD is the only source of scope. Nothing else counts as evidence.

Feature lists commonly acquire scope that was agreed in meetings and never written down. Reading the finished list, nobody can tell which rows came from the document and which came from a conversation or from a comparable product the author had in mind. That ambiguity is what this framework removes.

Three rules follow:

- Do not add a feature because similar products have it. If a capability is genuinely needed but the PRD does not state it, record it as an assumption or an open question, not as a feature row.
- Do not drop a requirement quietly. If the PRD itself marks it optional or defers it, record it as out of scope so the exclusion is visible.
- Every committed feature cites the PRD section it came from. A row that cannot cite one does not belong in the list.

The result is deliberately smaller and more conservative than a list assembled from experience. That is the intended behaviour. Gaps surface as questions rather than as guesses.

## The whole PRD is in scope <!-- key: whole-prd-in-scope -->

The feature list covers the entire source document. Do not narrow it to a proof of concept, a phase, or a product area because that slice looks like the natural first delivery.

Only two things move material out of the committed list:

- **The PRD says so.** It labels the capability optional, or defers it to a later phase. Use the document's own wording as the reason.
- **A human says so.** Someone running the pipeline states the exclusion explicitly. Record who asked and what they said.

An inferred boundary is not a third case. Choosing a slice on the reader's behalf silently deletes scope, and the deletion is invisible precisely because the list that remains looks coherent. If the PRD covers more ground than a single engagement would quote, that is a conversation to have over a complete list, not a decision to bake into one.

## Translation model <!-- key: translation-model -->

Work in this order, one stage at a time:

1. **PRD evidence** — a statement, workflow step, constraint, output, integration, or decision rule that appears in the document.
2. **Requirement** — the capability or condition that evidence implies, noted against the PRD section it came from.
3. **Module** — a coherent product area drawn from the canonical spine.
4. **Feature** — a distinct, estimable capability inside a module.

Do not jump from PRD headings straight to features. PRD structure reflects how the author explained the product; module structure reflects how the work will be built and estimated. They rarely match.

Stage 2 is working state, not a deliverable. Walk the whole PRD and write the requirements down somewhere before designing modules, because the walk is what stops the list being assembled from the headings that happened to be memorable. Only the feature list is published.

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
| Assumption | A provisional reading is needed to describe scope | Assumptions |
| Dependency | Delivery needs an external party, API, licence, template, or approval | Dependencies |
| Optional | The PRD says may, could, optional, or if required | Out of Scope |
| Future Phase | The PRD defers it to a later phase | Out of Scope |
| Open Question | The answer materially changes scope or effort | Open Questions |

Optional and future-phase material never appears in a committed feature table. Both labels require the PRD's own wording — quote or paraphrase the phrase that justifies them. Neither is available for material you simply judged to be later work.

Vendor-supplied capability is a Dependency, not a Committed feature with padded hours. A bought assessment tool, speech service, or enrichment API has a licence and an integration cost, and those are different numbers. Mark the integration work as committed if the PRD requires it, and record the vendor itself as a dependency.

## Module spine <!-- key: module-spine -->

Use this canonical, ordered spine. It keeps two people translating the same PRD into the same shape, which is the entire point of the framework.

| # | Module | Include when |
|---|---|---|
| 1 | Experience Design | The PRD implies screens, journeys, or a design system |
| 2 | Platform Foundation | Environments, repository, CI/CD, or data architecture are implied |
| 3 | Identity and Access | Roles, login, permissions, or tenancy appear |
| 4 | Data Ingestion | Data enters from uploads, APIs, crawls, or onboarding |
| 5 | Data Processing and Records | Data is normalised, deduplicated, scored, or stored as records |
| 6 | Core Workflow | Always — this is the product's central job |
| 7 | Intelligence and Automation | Any AI, scoring, ranking, or inference is described |
| 8 | Human Review and Collaboration | People review, override, annotate, or approve |
| 9 | Reporting and Exports | Dashboards, reports, exports, or notifications are described |
| 10 | Administration and Configuration | Settings, thresholds, templates, or admin tooling appear |
| 11 | Compliance and Auditability | Audit trails, retention, residency, or regulation appear |
| 12 | Delivery Management | The estimate is expected to include project management |

Rules for using the spine:

- Include a module only when at least one requirement supports it. Empty modules are noise.
- Rename module 6 to the product's actual job — Resume Screening, Creator Discovery, Claims Intake. Keep its position.
- Split a spine module into two only when it would otherwise exceed roughly ten features, and keep both halves adjacent.
- Adding a module outside the spine is allowed but must be deliberate. Prefer fitting the work into an existing one.

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
- If an engineer would ask more than two material clarifying questions about a row, it is a theme, not a feature. Decompose it or turn the ambiguity into an open question.

## AI decomposition <!-- key: ai-decomposition -->

Never write a single feature called AI Integration, AI Engine, or similar. An AI requirement is a chain, and each link has separate complexity, separate failure modes, and often a separate vendor.

For each AI requirement, decide whether the PRD supports a feature at each link:

1. Input acquisition and preparation — upload, OCR, parsing, normalisation
2. The model task itself — extraction, classification, inference, ranking, generation
3. Structured output — the score, recommendation, or generated artifact
4. Explanation, confidence, or traceability
5. Human review, correction, override, or approval
6. Feedback, evaluation, or quality validation

Include only the links the PRD evidences. Where a link is clearly necessary but unstated — most often human review over an automated decision — record it as an open question rather than adding it silently.

When a PRD says AI should support a decision rather than make it, the human control link is not optional. Its absence is a Blocking finding.

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

This is the mechanism that makes the rest enforceable.

The PRD already carries stable identifiers: its own headings. Use them. Do not mint a parallel numbering scheme, because a synthetic ID is only meaningful next to the table that defines it, and it forces a reader to hold two documents open to check one claim.

- Every row that describes scope — a feature, an assumption, a dependency, an out-of-scope entry — cites the PRD sections it came from.
- A citation is the section number and short name as the PRD writes them, such as `§7.4 Skill Inference`. Where a PRD has no numbering, use the heading text. Never cite a page number or a whole document.
- Every heading in the PRD has a visible home in the feature list, whether as a feature citation, an assumption, a dependency, an out-of-scope entry, or an open question.

That last rule makes coverage a walk through the PRD's table of contents rather than a matter of opinion, which is what lets verification be mechanical.

It is coverage at section granularity, not at sentence granularity. A section that produced two features when it described three capabilities will still pass. Closing that gap is the job of the judgement checks below, and of the person reviewing the list against the PRD.

## Verification checklist <!-- key: verification-checklist -->

Run the mechanical checks first. They are objective and they catch the failures that matter most.

1. Every PRD heading appears in at least one citation somewhere in the feature list.
2. Every feature cites at least one PRD section, and every cited section exists in the PRD.
3. Feature names are unique within a module.
4. Every section holds at most one table, and no table exceeds 29 data rows, 10 columns, or 400 characters in a cell.
5. No effort cell contains a number, including zero.
6. Every Out of Scope row quotes the PRD wording that makes it optional or deferred, or names the person who excluded it.

Then apply judgement checks:

- Does every module in the document earn its place, and is it named from the spine?
- Is any feature a theme in disguise, or a catch-all?
- Is any capability split so finely that the parts have no independent delivery value?
- Does each AI chain include the links the PRD requires, including human control?
- Did the cross-cutting pass produce features, or did constraints stay buried in descriptions?
- Are duplicates and near-duplicates consolidated?
- Re-read the densest PRD sections against the rows citing them. Did a section describing several capabilities produce features for all of them, or only for the first?

Assign each finding a severity:

- **Blocking** — a committed requirement is missing, scope has no evidence, a PRD section has no home, or a required human-control link is absent.
- **Major** — a row is too vague or too combined to estimate, or a cross-cutting requirement was dropped.
- **Minor** — wording, naming, or placement.

Resolve every Blocking and Major finding. Apply Minor findings only when the fix introduces no new scope. Re-run the six mechanical checks after any remediation.
