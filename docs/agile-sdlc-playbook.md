# Agile SDLC playbook

Maintain **`agile-sdlc`** as a small, goals-driven collection: one default execution-to-Delivery Record route, a true trivial fast path, independent optional specification capabilities, optional review and extended verification, and knowledge specs that contain no workflow procedure.

Execution order is [agile-sdlc-milestones.md](agile-sdlc-milestones.md). This document is the contract those milestones are checked against. Authoring rules for the repository itself are [CONTRIBUTING.md](../CONTRIBUTING.md); everything here is additional, not a replacement.

The product charter is [agile-sdlc-goals.md](agile-sdlc-goals.md) and wins over this playbook. Resources outside the `agile-sdlc-*` namespace are out of scope.

---

## 1. Product shape

The common paths are:

```text
Trivial request -> Implement -> Delivery Record
Work Item       -> Implement -> Delivery Record
```

The first route applies only to a bounded low-risk typo, copy, simple configuration, or one-line fix with clear intent, deterministic criteria, exact permitted paths and verification, and no material decision, risk, ambiguity, or cross-run resumability need. Its compact approved contract lives only in pipeline run state; it requires no Work Item or Work Item template, but its only required durable document is a Delivery Record in the SpecX document workspace. All other work uses a durable Work Item. Product Spec, Technical Design, and Delivery Plan are independent optional artifacts.

Review, extended verification, synchronization, and Project Guide bootstrap are independent optional pipelines. No pipeline launches another pipeline. Six knowledge specs provide reusable judgment, seven templates provide durable document shape, and task files contain all procedure.

---

## 2. Registry

Add to `collections/collections.json` and `tags/tags.json` in the same change as the first resources.

| id | displayName | parentId | Holds |
|---|---|---|---|
| `agile-sdlc` | Agile SDLC | — | The pack. Only the Artifact Routing Guide sits at the root, as the place to start. |
| `agile-sdlc-specify` | Specify | `agile-sdlc` | The four document-generation pipelines, the templates they fill, and the requirements and technical design guides. |
| `agile-sdlc-deliver` | Deliver | `agile-sdlc` | The `implement` pipeline, its Work Item and Delivery Record templates, and the defect diagnosis guide. |
| `agile-sdlc-verify` | Verify | `agile-sdlc` | Review, extended verification, and spec sync, with the review findings template and code review guide. |
| `agile-sdlc-standards` | Standards | `agile-sdlc` | Guidance used across stages: the project development guide, its template, the bootstrap pipeline, and the test strategy guide. |

Each resource sits in the folder of the job that uses it. A resource used by more than one stage goes in Standards. Subcollection `order` follows the table from 1 to 4.

Collection description: "A lean agent-executed delivery lifecycle: one self-verifying implement pipeline, optional specification pipelines, and optional review and verification gates."

New tag, appended to `tags/tags.json` under parent `use-case`:

```json
{
  "id": "agile-sdlc",
  "displayName": "Agile SDLC",
  "description": "Templates, guides, and pipelines for the lean Agile SDLC delivery pack.",
  "applicableKinds": ["spec", "template", "pipeline"],
  "ui": "facet",
  "parentId": "use-case",
  "order": 7,
  "status": "active"
}
```

> [!IMPORTANT]
> The canonical collection display name is `Agile SDLC`, and the canonical tag id is `agile-sdlc`. Treat both as stable public identifiers.

---

## 3. Naming and shared metadata

- Slug: `agile-sdlc-<name>`, lowercase kebab-case, equal to the folder name.
- Title: starts with `Agile `.
- Every resource carries tag `agile-sdlc` plus exactly one `domain.*` and one `use-case.*` tag from the inventory tables in section 5.

Shared `metadata.json` fields:

| Field | Value |
|---|---|
| `schemaVersion` | `"1"` |
| `sourceVersion` | `"1.0"` |
| `license` | `"CC-BY-4.0"` |
| `collection` | `"agile-sdlc"` |
| `subcollection` | Every resource except the Artifact Routing Guide. Section 5 gives each resource's value. |
| `createdAt` / `updatedAt` | The date the milestone is executed, `YYYY-MM-DD`. |
| `templateSlug` | Unset. |
| `relatedSlugs` | Omitted through Milestone 2. From Milestone 3 onward, every entry resolves to an existing `agile-sdlc-*` resource. |

### Produced document identity

Pipelines create or update SpecX documents by durable id when one is known and otherwise by **exact title**. A filesystem path is never a document write destination. Workspace folder placement is a separate concern governed below.

| Produced by | Title |
|---|---|
| `generate-product-spec` (PRD mode) | `<Subject> - Agile PRD` |
| `generate-product-spec` (Feature mode) | `<Subject> - Agile Feature Spec` |
| `generate-tech-spec` | `<Subject> - Agile Tech Spec` |
| `generate-test-plan` | `<Subject> - Agile Test Plan` |
| `generate-implementation-plan` | `<Subject> - Agile Implementation Plan` |
| `implement` intake | `<Subject> - Agile Work Item` |
| `implement`, `extended-verification`, `sync-specs` | `<Subject> - Agile Delivery Record` |
| `review` | `<Subject> - Agile Review Findings` |
| `bootstrap-project-guide` | `Project Development Guide` |

If a target title already exists, update it in place. Never create a second document for the same subject.

Optional pipelines preserve an explicitly supplied Delivery Record title/reference first and infer `<Subject> - Agile Delivery Record` only when none was supplied. Ambiguity requires one selection; it never causes silent duplicate creation. The selected exact title is persisted across tasks.

### Runtime artifact hierarchy

Imported collection resources are reusable inputs, not destinations for runtime work. Recommend `Project Work` as the runtime base folder, while allowing an explicit team override or a locally customized collection default. This contract does not assume that the host provides a workspace-settings key.

```text
workspace-root/
├── <Imported collection>/              # protected reusable resources
└── Project Work/                       # configurable runtime base
    ├── Initiatives/                    # PRDs remain flat
    │   └── <Initiative> - Agile PRD
    ├── Standards/
    │   └── Project Development Guide
    ├── Features/
    │   └── <Feature>/
    │       ├── Feature Spec, Tech Spec, and plans
    │       └── Work/
    │           └── Work Items, Delivery Records, and Review Findings
    └── Work/
        └── <Subject>/                  # no feature anchor
            └── Work Items, Delivery Records, and Review Findings
```

Do not create per-PRD or per-Work-Item folders. Derive `<Initiative>`, `<Feature>`, and `<Subject>` from the already approved subject, applying only sanitization required by the host. Do not strip semantic prefixes or introduce another normalization scheme.

The protected import boundary is established from imported resources' collection metadata and the ancestry in the fetched folder hierarchy. A folder name, including `Agile SDLC`, is not proof that a folder is imported or protected.

### Placement contract

Placement is resolved once by the producing pipeline's scope task and persisted per artifact as exact artifact id/reference, `create` or `update` disposition, `folderId`, informational `folderPath`, and any advisory. Implement persists separate records for its Work Item and Delivery Record; existing artifacts in different folders keep different records. Later tasks use the correct artifact's record and never recompute placement.

An existing exact-title artifact is always updated in its current folder. Its durable id is authoritative across tasks: after a human move or folder rename, re-read by id, write in the artifact's current folder, note the changed display path, and never relocate it. Defaults, overrides, and governing-source folders apply only when creating a new artifact; they never migrate an artifact at workspace root, in a manually moved folder, or in any other unconventional location.

For a new artifact, use this decision map:

1. Use an explicit valid folder override.
2. Otherwise use the governing source artifact's folder when that artifact type inherits placement.
3. Otherwise ensure and use the output-specific default under the runtime base.
4. Never create a runtime artifact anywhere inside the protected import boundary. If an override, governing source, or existing counterpart folder is protected, skip that candidate and continue to the next valid feature `Work` or standalone default, with one concise advisory for the final fallback.
5. Ask only when artifact identity is ambiguous. Missing or conflicting placement evidence falls back deterministically with an advisory because placement is reversible.

Output-specific defaults and inheritance are:

- A PRD is created directly in `Initiatives`; PRDs do not get individual folders.
- A Feature Spec establishes `Features/<Feature>`, even when a PRD is its source.
- A Tech Spec, Test Plan, or Implementation Plan inherits the folder of its explicitly supplied primary Feature Spec or other governing feature-level source. Without a feature anchor, use `Work/<Subject>` and advise that standalone placement was used.
- Implement places a new Work Item and Delivery Record in `<Feature>/Work` when a valid governing Work Item or feature-level source establishes a feature folder. Otherwise it uses `Work/<Subject>`. When both are new they normally share that valid destination; when either already exists, its own update placement remains separate.
- Review follows a valid existing Delivery Record folder, then a valid existing Work Item folder; a protected candidate is skipped for a new Findings document. If neither governs placement, it uses the same feature-backed or standalone Work rule.
- Extended Verification and Sync Specs create no folders and update the exact Delivery Record or living artifact in place.

When candidate sources disagree, the explicit governing source wins: the primary Feature Spec for feature-level generation, the Work Item for implementation, and the Delivery Record for optional verification or synchronization. If no governing source has been established, use the deterministic output default with an advisory.

Placement lookup must remain economical. Use a persisted artifact id first. Otherwise resolve an exact title or explicit reference and read that artifact's cheap folder property. Fetch the folder hierarchy only to ensure a known path or verify ancestry, including protection. Never list folder contents to discover artifacts, detect title collisions, select among candidates, or decide placement. If a not-yet-created output's persisted `folderId` disappears before writing, re-ensure the exact persisted `folderPath` and use its replacement id; this preserves the scope decision rather than recomputing it. If that exact path cannot be re-established, stop `blocked` for the environment.

The contract has converged when no new runtime artifact can enter an imported-resource descendant through an override, source, counterpart, or default; every later task receives a separate placement record for each artifact it writes; existing artifacts are found by id and updated in their current folders; missing create-folder ids re-ensure only the persisted path; and no path requires a folder-content listing.

---

## 4. Cross-cutting authoring rules

These are what make the pack predictable. Every milestone verification checks them.

**R1 — Tasks are self-sufficient.** A `tasks/<key>.md` states its whole procedure: what to ask, what to do, what to write, when to stop, and what the handoff looks like. The pack has **no per-pipeline rules specs**. A task never tells the agent to go read the procedure somewhere else.

**R2 — Knowledge is referenced conditionally.** A scope task may read only applicable Project Development Guide sections and persist a concise guide basis. A later drafting, build, or evaluation task uses that basis without reloading the unchanged guide and reads at most one other knowledge spec, by full title, only when source and repository evidence have not established the needed judgment. The trivial implementation fast path loads no guide, and the core implementation path does not read the Artifact Routing Guide.

**R3 — No counters.** No retry counts, attempt limits, cycle budgets, or `delivery_cycle_count`. Stopping is always expressed as a condition on the current action, never as a tally carried across turns.

**R4 — The boundary rule.** This replaces v1's fix loop and appears verbatim in the `implement` build task:

> Fix freely inside the permitted boundary. Stop and report instead of continuing when the fix would touch an area outside that boundary, change what an acceptance criterion asserts, or make a check pass by weakening, skipping, deleting, or mocking past the thing under test. Stop and report when the failure existed before this change. Do not re-run an unchanged command against unchanged code and environment hoping for a different result; after a relevant code or environment repair, rerunning the affected command is required verification.

Both the initial failure and later passing event remain durable evidence.

**R5 — Four outcomes.** `done`, `failed`, `needs_input`, `blocked`, each with a one-line reason. `failed` means verification ran and found a defect or unmet acceptance criterion. `needs_input` means an unresolved consequential decision requires a person. `blocked` means required work or verification cannot run because the environment or authority is unavailable. Nothing else.

**R6 — One approval per invocation.** After inspection, the scope task presents one concise preview. A true trivial fast path uses exactly three lines: outcome and criteria, exact permitted paths, and verification. Richer previews include provenance only for material decisions and assumptions, omitting empty categories. Title collisions, modes, assumptions, and split proposals are resolved in that same gate. The scope task persists one named complete handoff for Task 2; `inputVarDefinitions` remains empty because caller variables are not internal state.

**R7 — One contract, one record, one Target Revision rule.** A durable Work Item is the execution contract except on the true trivial fast path, whose complete compact contract stays in run state until recording. `<Subject> - Agile Delivery Record`, created once and appended in place, is the canonical delivery history and the only required durable fast-path document. It stores each Target Revision manifest once: stable revision id, full base commit SHA, optional permitted-boundary description, and sorted boundary-file entries when dirty. Each entry has repository-relative path plus SHA-256 of regular-file bytes, SHA-256 of symlink target bytes, `gitlink:<commit>` for a submodule, or `MISSING`; untracked files are normal entries. A clean revision has no boundary entries and requires exact current-HEAD equality with its full commit SHA. For a dirty revision, the base SHA is ancestry context: current HEAD may equal or descend from it, all listed identities must match, and no additional changed path may exist inside the persisted boundary relative to that base. This permits unrelated outside-boundary commits and committing exactly the manifested implementation while rejecting boundary drift. Events reference the revision id and never repeat the manifest. An optional pipeline may append a new clean current-SHA manifest linked to the original dirty revision and reference the new id; it never overwrites the old manifest. Mismatch is `blocked`; no task auto-commits. There is no aggregate serialization or hash.

**R8 — Sizing is advisory.** "Keep each step small enough to build and verify in one run" is guidance, not a gate. No numeric thresholds as pass/fail, and no automatic `git checkout --`; if a step fails, leave the work in place and report.

**R9 — Risk signals are advisories by default.** Database schema or migration work, authentication or authorization or personal-data work, and published-contract changes are shown with their concrete risk and safeguards. Stop with `needs_input` only when inspection leaves one consequential product, scope, security or privacy, destructive-data, compatibility, verification-integrity, or external-authority decision unresolved. Persist that decision and do not stop on it again after resolution. Never require another artifact merely because of a risk category.

**R10 — Invariants restated in the task that needs them.** These are short enough to inline and are read every run, so they live in the task file, not a spec: approve acceptance criteria and repository boundary before editing; no drive-by refactoring or formatting churn outside scope; stage by explicit path and never `git add .` or `git add -A`; never `git push`, tag, or merge; never claim a pass without an observed automated result or concrete manual observation; keep raw logs out of the record.

**R11 — Mechanical form.** `inputVarDefinitions` is `[]`, `iteratorFields` is `[]`, no `${...}` in any task file, no `type: "pipeline"`, flat steps only. Every `steps[].key` has a matching `tasks/<key>.md` and there are no orphan task files.

**R12 — Independence from v1.** No file under `resources/**/agile-sdlc-*/` may name a v1 slug, a v1 title (`Agile Implement Change`, `Agile Review Change`, and the rest), or a `resources/` path. This document and the milestones may name v1 resources, because they are the source map.

**R13 — Legible state and handoff.** Every task exposes a concise state such as inspecting, drafting, implementing, verifying, waiting, recording, or blocked. Every final handoff contains outcome, decision, artifact, evidence, and next action without exposing internal context keys.

**R14 — Exact wiring.** `relatedSlugs` contains only templates instantiated, knowledge specs explicitly referenced, and direct producer/consumer relationships. Every edge resolves. Optional pipelines may point inward to retained core resources, but retained specs, templates, and core pipelines never point outward to optional review, extended-verification, sync, or bootstrap pipelines, so deleting any of those four pipeline directories leaves no dangling edge.

### Task file shape

Every task file uses these four blocks, in this order, and nothing above them:

```text
**Goal:** one sentence.

**Scope:** what this task covers, then what it must not do.

**Verification / Definition of Done:**
- [ ] checkable statements

**Instructions:**
numbered steps
```

---

## 5. Target inventory

Twenty-three resources: seven knowledge specs, seven templates, and nine pipelines.

### 5.1 Knowledge specs — 7

`resources/specs/<slug>/metadata.json` + `content.md`. Collection `agile-sdlc`, subcollection from the table. H1 exactly equals `metadata.title`. Sections start at H2 and carry `<!-- key: ... -->`.

These hold domain judgment only. If a sentence tells an agent what to do in what order, it belongs in a task file instead.

Two markdown notes when porting from v1. A plain `>` blockquote degrades to a paragraph and makes `npm run check` emit a warning — v1's requirements guide does this today; use a GitHub alert (`> [!IMPORTANT]`) or ordinary prose instead. LaTeX fragments such as `$\rightarrow$` and `$\boxed{...}$` appear throughout v1; replace them with plain text, since they render as literal source.

| Slug | Title | Subcollection | Tags | Carries |
|---|---|---|---|---|
| `agile-sdlc-artifact-routing-guide` | Agile Artifact Routing Guide | — | `domain.product`, `use-case.planning` | Sole routing authority: the default Work Item to Delivery Record route; Work Item modes for change, defect, and loose evidence; independent optional Product Spec, Technical Design, and Delivery Plan; risk advisories and consequential decision boundaries. |
| `agile-sdlc-requirements-quality-guide` | Agile Requirements Quality Guide | `agile-sdlc-specify` | `domain.product`, `use-case.specification` | Requirement and acceptance-criterion quality only: testability, observable behavior, non-goals, uncertainty tags, and identifiers. It does not select or split artifacts. |
| `agile-sdlc-tech-design-standards` | Agile Technical Design Standards | `agile-sdlc-specify` | `domain.engineering`, `use-case.specification` | How to document architecture, decision records, schemas and migrations; brownfield safety; isolation zones **as advice for scoping a change**, not as an enforcement mechanism. |
| `agile-sdlc-test-strategy-guide` | Agile Test Strategy Guide | `agile-sdlc-standards` | `domain.engineering`, `use-case.specification` | Test levels and how to choose them; risk-based coverage; tests live in code; what counts as evidence (command, exit code, counts) and why a skipped required test is not a pass; no raw logs in markdown. |
| `agile-sdlc-code-review-guide` | Agile Code Review Guide | `agile-sdlc-verify` | `domain.engineering`, `use-case.execution` | The seven review pillars **as a checklist to consult**; two severities, blocking and non-blocking; what makes a finding actionable; the ban on style bike-shedding. |
| `agile-sdlc-defect-diagnosis-guide` | Agile Defect Diagnosis Guide | `agile-sdlc-deliver` | `domain.engineering`, `use-case.execution` | Defect diagnosis only, read during durable `defect` intake: confirm it is a defect, evidence, reproduction, confirmed root cause versus hypothesis, the fix, and a regression check that fails on the unfixed code. |
| `agile-sdlc-project-development-guide` | Agile Project Development Guide | `agile-sdlc-standards` | `domain.engineering`, `use-case.execution` | Draft, adaptable defaults for future code; applicable sections are scoped during intake and their chosen direction is persisted for later tasks. |

Specs remain compact reusable references. Routing procedure, approvals, persistence, write boundaries, outcomes, and handoffs stay in task files.

### 5.2 Templates — 7

`resources/templates/<slug>/metadata.json` + `content.json`. Collection `agile-sdlc`, subcollection from the table. Outlines must satisfy the CONTRIBUTING invariants: top-level nodes fixed, no required node under an optional ancestor, depth at most 4, keys unique tree-wide. Every fixed top-level node is inherently meaningful or has required meaningful content; optional modules are optional descendants and are omitted as a whole when absent. No empty wrapper or placeholder is required.

| Slug | Title | Subcollection | Tags | Notes |
|---|---|---|---|---|
| `agile-sdlc-work-item-template` | Agile Work Item Template | `agile-sdlc-deliver` | `domain.engineering`, `use-case.specification` | The bounded execution contract for a change, defect, or task. See 5.2.1. |
| `agile-sdlc-product-spec-template` | Agile Product Spec Template | `agile-sdlc-specify` | `domain.product`, `use-case.specification` | Used by Generate Product Spec in PRD and Feature modes. See 5.2.2. |
| `agile-sdlc-technical-design-template` | Agile Technical Design Template | `agile-sdlc-specify` | `domain.engineering`, `use-case.specification` | Generic technical design. See 5.2.3. |
| `agile-sdlc-delivery-plan-template` | Agile Delivery Plan Template | `agile-sdlc-specify` | `domain.engineering`, `use-case.planning` | Shared by Generate Test Plan and Generate Implementation Plan. See 5.2.4. |
| `agile-sdlc-delivery-record-template` | Agile Delivery Record Template | `agile-sdlc-deliver` | `domain.engineering`, `use-case.execution` | The single append-only delivery history. See 5.2.5. |
| `agile-sdlc-review-findings-template` | Agile Review Findings Template | `agile-sdlc-verify` | `domain.engineering`, `use-case.execution` | Actionable output written only when review runs. See 5.2.6. |
| `agile-sdlc-project-development-guide-template` | Agile Project Development Guide Template | `agile-sdlc-standards` | `domain.engineering`, `use-case.planning` | Shape for the optional project-owned guide; the imported spec supplies its default content. |

Dropped or consolidated: the separate product, feature, test, and implementation plan templates, plus `implementation-summary`, `verification-report`, `remediation-record`, `implementation-record`, `review-report`, `change-request`, `bug-spec`, `work-scope-brief`, and `delivery-summary`.

#### 5.2.1 Work Item outline

Fixed top-level nodes are `document-status`, `intended-outcome`, `acceptance-criteria`, `repository-boundary`, and `verification-approach`. Optional detail is nested under the relevant required section so it disappears without leaving a dedicated empty wrapper.

- `document-status` children: `status`, `work-type` (`change`, `defect`, or `task`), `last-updated`, optional `originating-evidence`, and optional repeatable `decision-or-assumption`; no owner is required.
- `intended-outcome` may contain one optional compact `defect-evidence` child. Omit it for non-defects and when no dependable defect evidence exists; tag an unconfirmed cause `! [HYPOTHESIS]`.
- `acceptance-criteria` is inherently required and has one repeatable child `acceptance-criterion` at `{ "min": 1, "max": null }`; guidance tells the author to title each instance with the behavior, not "Acceptance Criterion".
- `repository-boundary` names permitted areas and exact files where known, with optional `exclusions` and repeatable `risk-or-advisory` children.
- `verification-approach` has optional leaves for automated commands, concrete manual observations, and an explicit not-applicable reason.
- Risks, decisions, and assumptions appear only when material. Provenance applies to material decisions and assumptions, not routine repository facts.

#### 5.2.2 Product Spec outline

The single fixed top-level node is `product-specification`. Its required `context-and-intent` child makes the root meaningful.

- Optional named child modules preserve users and stakeholders, outcomes and success evidence, scope and requirements, behaviors and journeys, acceptance criteria, risks and dependencies, and open decisions. Omit an entire module when it has no useful supported content.
- Optional `scope-and-requirements` contains repeatable `non-goal` entries alongside scope items and requirements. There is no dedicated top-level Non-Goals wrapper, and zero non-goals needs no placeholder or empty section.
- PRD mode emphasizes initiative context, outcomes, success evidence, and scope. Feature mode emphasizes behaviors, journeys, and acceptance criteria.
- Acceptance criteria use Given / When / Then for flows and concise Target plus Constraint for other observable checks; Violation appears only when failure behavior is part of the contract.
- The template does not require personas, metrics, micro-traceability, or an upstream PRD. The pipeline supplies the produced title and may use either mode without changing the root.
- Root guidance defines bounded leeway: repository-supported detail may be inferred, but product behavior and consequential decisions may not be invented.

#### 5.2.3 Technical Design outline

The single fixed top-level node is `technical-design`. Its required `technical-approach` child contains a required `approach-overview`, making the root meaningful.

- Optional named descendants preserve context and constraints, decisions, affected boundaries, verification, API and interfaces, data, migration, security, operations, rollout, and rollback without mandatory isolation zones, stack assumptions, workflow detail, or invented architecture.
- Omit an irrelevant module as a whole; never render it as an empty section.
- The template title is Agile Technical Design Template and its slug is `agile-sdlc-technical-design-template`. The produced document title remains `<Subject> - Agile Tech Spec`.

#### 5.2.4 Delivery Plan outline

The single fixed top-level node is `delivery-plan`. Its required `objective-and-scope` child contains a required `objective`, making the root meaningful.

- Optional named descendants preserve prerequisites, strategy and risks, execution increments, verification scenarios, environment and data, recovery and rollback, and decisions. Root guidance requires repository inspection and omission of irrelevant modules as whole sections.
- Test Plan mode may omit the Execution Increments module. Implementation Plan mode may omit the Verification Scenarios module when checks attached to increments provide sufficient coverage.
- The template contains document shape only: no source-control actions, checkpoints, retries, role assignments, or orchestration procedure.
- The pipeline supplies `<Subject> - Agile Test Plan` or `<Subject> - Agile Implementation Plan` without changing the root.

#### 5.2.5 Delivery Record outline

The single fixed top-level node is `delivery-record`. Its required `document-status` and `implementation-summary` children make the root useful for every outcome, including an early zero-event `blocked` or `needs_input` result.

- `document-status` contains required `implementation-outcome` and `implementation-outcome-reason`, plus optional Governing Work Item and Originating Request. A fast-path record omits Governing Work Item and retains its request reference. Only `implement` writes outcome fields.
- `implementation-summary` requires a concise reader-first outcome/reason and adds changed areas, acceptance result, and limitations/next action only when established. It cites supporting event ids when evidence exists; an early blocked or needs_input outcome before checks instead cites its Work Item decision or Originating Request and omits revision and event modules. Optional pipelines do not invent or rewrite it.
- Optional repeatable `target-revision` descendants store manifests once. A clean manifest is an exact full commit SHA; a dirty manifest uses its base SHA as ancestry context plus exact boundary identities and complete changed-path coverage. Optional clean bridges carry `derived-from-revision-id`. Optional repeatable `delivery-event` descendants require stable id, source, date, revision-id reference, exact command or concrete action, result (`passed`, `failed`, `not-applicable`, or `blocked`), and concise result details.
- Events are append-only. Only later passing required evidence in the same revision lineage may resolve a prior required failed event by linking its id; not-applicable never resolves a required failure.
- Optional repeatable `decision-shipped` and `related-artifact` descendants exist only for shipped decisions and useful links. No grouping wrapper or placeholder is required.

No record-profile node, no cycle-count node, no child-orchestration node.

#### 5.2.6 Review Findings outline

Top-level, all fixed: `document-status`, `verdict`.

- `document-status` children: `reviewer`, `date`, `target-revision-and-boundary`, `governing-work-item`, and an optional Delivery Record link.
- `verdict`: blocking findings exist, or none do, in one or two sentences. Its optional repeatable `finding` children each carry `location`, `severity` (`blocking` or `non-blocking`), `evidence`, `impact`, and `recommendation`; every actual finding fills all five. Optional repeatable `note` children hold useful observations that are not findings.
- Zero findings is represented only by the concise non-blocking verdict. It creates no finding or note instance, empty section, or `none` placeholder.

### 5.3 Pipelines — 9

`resources/pipelines/<slug>/metadata.json` + `content.json` + `tasks/<step-key>.md`. Every pipeline carries a subcollection. Eighteen task files in total.

| Slug | Title | Subcollection | Tags | Steps: `key` — name |
|---|---|---|---|---|
| `agile-sdlc-implement` | Agile Implement | `agile-sdlc-deliver` | `domain.engineering`, `use-case.execution` | `scope-and-lock` — Scope the Change and Lock the Contract; `build-and-verify` — Build, Check, and Fix Within the Boundary; `record-and-hand-off` — Write the Delivery Record and Hand Off |
| `agile-sdlc-generate-product-spec` | Agile Generate Product Spec | `agile-sdlc-specify` | `domain.product`, `use-case.specification` | `scope-and-confirm` — Scope the Brief and Confirm the Mode; `draft-and-hand-off` — Draft the Product Spec and Hand Off |
| `agile-sdlc-generate-tech-spec` | Agile Generate Tech Spec | `agile-sdlc-specify` | `domain.engineering`, `use-case.specification` | `scope-and-confirm` — Scope the Technical Design and Confirm; `draft-and-hand-off` — Draft the Tech Spec and Hand Off |
| `agile-sdlc-generate-test-plan` | Agile Generate Test Plan | `agile-sdlc-specify` | `domain.engineering`, `use-case.specification` | `scope-and-confirm` — Scope the Test Strategy and Confirm; `draft-and-hand-off` — Draft the Test Plan and Hand Off |
| `agile-sdlc-generate-implementation-plan` | Agile Generate Implementation Plan | `agile-sdlc-specify` | `domain.engineering`, `use-case.planning` | `scope-and-confirm` — Scope the Plan and Confirm; `draft-and-hand-off` — Draft the Implementation Plan and Hand Off |
| `agile-sdlc-review` | Agile Review | `agile-sdlc-verify` | `domain.engineering`, `use-case.execution` | `scope-review` — Scope the Diff and Confirm; `evaluate-and-report` — Evaluate the Diff and Write Findings |
| `agile-sdlc-extended-verification` | Agile Extended Verification | `agile-sdlc-verify` | `domain.engineering`, `use-case.execution` | `scope-suites` — Scope the Suites and Confirm; `run-and-record` — Run the Suites and Record Evidence |
| `agile-sdlc-sync-specs` | Agile Sync Specs | `agile-sdlc-verify` | `domain.engineering`, `use-case.execution` | `scope-sync` — Scope the Living Specs and Confirm; `sync-and-record` — Update Living Specs and Record |
| `agile-sdlc-bootstrap-project-guide` | Agile Bootstrap Project Guide | `agile-sdlc-standards` | `domain.engineering`, `use-case.planning` | `inspect-confirm-and-write` — Inspect, Confirm, and Write the Project Guide |

`address-review` has no canonical equivalent. Applying review findings is `implement` with `<Subject> - Agile Review Findings` as intake; `scope-and-lock` selects the compact trivial contract only when every fast-path condition holds and otherwise creates or updates `<Subject> - Agile Work Item`. Say so in the review pipeline's handoff.

---

## 6. Required content per pipeline

Beyond R1–R12, each pipeline's task files must contain the following. This is what keeps two different agent sessions from producing different pipelines.

### 6.1 `implement` — the core path

`scope-and-lock` accepts raw input, an existing Work Item, or Review Findings and inspects before asking. A true trivial change persists a compact approved execution contract with request reference, subject, outcome, criteria, exact paths, and verification, without requiring a Work Item or Work Item template; it may resolve Delivery Record placement before the document workspace is used, but recording still requires that workspace. All nontrivial, risky, ambiguous, or cross-run-resumable work creates or updates one complete Work Item. One preview remains mandatory.

`build-and-verify` reloads either approved contract, implements and repairs within its boundary, runs the recorded checks, and evaluates every criterion without inventing a pass. Once repository identity exists, it persists one Target Revision manifest and an ordered event list that references its revision id; an early blocked or needs_input result before checks may contain neither.

`record-and-hand-off` reloads the result and governing contract, validates and stores any manifest, and appends any events by revision id without rerunning checks. A zero-event blocked or needs_input summary cites its durable decision or request instead of invented ids. Fast-path recording omits Governing Work Item and retains the request reference. If interrupted before recording, fast-path intake may need to be rerun; no cross-run recovery is claimed.

### 6.2 The five `generate-*` pipelines

`scope-and-confirm` must: accept unformatted input; establish a durable source reference; inspect the source and relevant repository before asking; infer the subject and produced title; classify material facts as user-stated, repository-observed, agent-inferred, or unresolved; and resolve title collision, mode, assumptions, decisions, and any feature split in one preview and approval. It persists approved status, source reference, subject/title, approved mode, collision or split disposition, assumptions, and decisions for a fresh drafting context. PRD and Feature scope tasks consult the Artifact Routing Guide only when a routing judgment is needed.

`draft-and-hand-off` must reload the complete persisted drafting contract and stop when it is missing or unapproved; it never relies on prior conversation. It instantiates its template by exact title — PRD and Feature Spec share Agile Product Spec Template, Test Plan and Implementation Plan share Agile Delivery Plan Template, and Tech Spec uses Agile Technical Design Template at slug `agile-sdlc-technical-design-template`. It conditionally reads at most one mapped knowledge spec and never rereads the Routing Guide. It preserves produced titles, tags unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`, self-checks within the drafting pass, and emits the five-line outcome/decision/artifact/evidence/next-action handoff. These pipelines never modify source code.

### 6.3 Optional pipelines

`review` is read-only on code and living specs and never mutates Delivery Record. An empty diff completes `done` / `not-applicable`. A non-empty diff persists the source boundary, Target Revision and reviewed boundary path list, Work Item, subject, findings title, and optional exact Delivery Record title, evaluates with the Code Review Guide, and writes one Findings document. Findings and notes are optional Verdict descendants; zero findings appears only as a concise non-blocking verdict. Writing findings is `done` even when the verdict is blocking.

`extended-verification` resolves an explicitly supplied Delivery Record first, selects one stored revision manifest, and rechecks it before running and recording. Clean no-suite persists the same complete handoff as run-suites and appends `not-applicable`; a required suite that is unavailable at either task is `blocked` with no fake evidence.

`sync-specs` selects one stored revision manifest and preflights every target living-spec path against the persisted implementation permitted boundary before editing. Overlap blocks before mutation. Gate mapping preserves upstream failed, blocked, and needs_input; missing or unreadable state is blocked. It persists each deterministic target change before mutation, processes one target at a time, and appends that target's sync event immediately. Resume reconciliation compares intent, actual content, and event state, repairs only a missing truthful event, skips completed work, and blocks on ambiguity. Zero targets append one no-op event; no transactionality is claimed.

`bootstrap-project-guide` is optional and independent. It inspects repository evidence, proposes only applicable imported guide sections, and asks once for the team's choices. It creates or updates one project-owned `Project Development Guide` document from Agile Project Development Guide Template, preserving its stable keys and each section's Draft or Approved status. Existing Approved decisions continue to govern until a revision is accepted. It does not edit repository files or imported resources.
