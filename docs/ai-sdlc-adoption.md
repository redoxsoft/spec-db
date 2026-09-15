# AI-SDLC catalog: adoption guide

This document describes the `ai-sdlc` catalog in Spec DB: the pipelines, the documents they produce, their input and output contracts, and how a team joining mid-development proceeds with **sufficient evidence**.

It reflects the catalog as of source version **1.2**. Internal slugs and folder names still contain older “feature spec” wording; **user-facing titles** are what agents resolve by exact name. Select the pack with tag `ai-sdlc` or collection `ai-sdlc`. Installing that pack across WorkX and SpecX hosts is a host feature; this catalog does not promise one-click cross-host bootstrap.

Related reading: [Building Predictable Software Delivery with AI](ai-native-sdlc-whitepaper.md).

---

## 1. What this catalog is

The `ai-sdlc` set is a structured delivery layer for product and engineering work that an agent can execute in SpecX (documents) and WorkX (pipelines).

It is not a full SDLC product by itself. It does not deploy, tag, publish, open pull requests, or manage CI/CD. Implementation leaves code in the working tree. “Delivery Sync” updates living specs after verification; it is not a production release.

The promise is:

> Start with whatever you have — an idea, an existing PRD, a ticket, a bug report, a design, a branch, or code already in progress. Launch with incomplete context. Before the pipeline produces a decision or implementation, it resolves and locks the minimum information required for that stage.

Keep three **product-intent** artifacts when they apply:

| Intent | Artifact | Typical examples | Primary path |
|---|---|---|---|
| Define or materially evolve a product capability | **PRD** | New product, major module, significant brownfield feature, new journey, pricing or workflow change | PRD → Design Spec → Milestone Plan → Implementation → Review → Delivery Sync |
| Amend a known, existing behaviour or contract | **Change Request** | Add a field, alter validation, revise an API, tweak permissions, change an existing flow | Change Request → Implementation (optionally Design/Plan) → Review → Delivery Sync |
| Correct unintended behaviour | **Bug Fix Spec** | Regression, broken workflow, incorrect output, performance defect, incident | Bug Fix Spec → Implementation → Review → Delivery Sync |

Add one **execution bridge**, not a fourth product-intent type:

| Role | Artifact | When to use it |
|---|---|---|
| Bound a slice from mixed or external evidence | **Work Scope Brief** | A PRD, ticket, design, branch, PR, or named diff is enough to build, review, or test, but no Change Request, Bug Fix Spec, or open milestone exists yet |

A delivery run needs **one product-intent artifact when applicable**, **one bounded work item for execution**, and any number of linked evidence sources. The Work Scope Brief records provenance, scope, acceptance criteria, assumptions, exclusions, and either a planned or as-built change boundary. After a matching Review PASS, Delivery Sync may append an Implementation Record on that brief. It does not invent missing product history.

A Change Request is **not** a replacement specification. It is a tracked amendment against an identified source of truth. After verification, Delivery Sync applies approved deltas to the linked source documents and keeps the Change Request as the implementation record.

---

## 2. Shared contract conventions

These rules apply to every pipeline unless a section below overrides them.

### Launch vs lock

No launch variable is schema-required. You can start a run with every input empty.

The first resolve task treats empty, omitted, or a leftover `${VAR}` placeholder as missing. It then shortlists workspace documents or asks the user. **Authoring does not proceed until those values are locked.**

In the tables below:

- **Optional at launch** — the run can start without it.
- **Required to finish** — must be locked before the pipeline authors or implements.
- **Conditional** — required only in some cases.

### Catalog dependencies (always required)

Authoring pipelines resolve **templates and guidelines by exact SpecX title**. If that catalog document is not installed in the workspace, the pipeline **stops** and reports **workspace setup required**, naming both the exact title and its stable slug. That is not an invalid project input. It will not reconstruct rules from memory.

This is an install problem. Mid-adopters need the `ai-sdlc` templates and specs imported into SpecX before any pipeline can author documents. Collection `ai-sdlc` is the bundle selector; one-click install across hosts is outside this catalog.

### Evidence locking

When the source is a native SpecX document, resolve tasks lock both its **document id** (when the host provides one) and its **display title**. Later tasks read by id when available and use the title only for display or fallback.

URL, path, issue id, branch, diff, or pasted content is usable evidence. Before a later task rereads the lock, the pipeline persists that evidence as a SpecX document: a native PRD, Change Request, Design Spec, Bug Fix Spec, or Test Plan when that is the intended artifact, otherwise a **Work Scope Brief**. Change Request Builder snapshots an external source contract **inside the Change Request**; it does not create a separate brief solely for that contract.

Hosts that cannot persist ids across tasks still use the locked title. Typed persistent `{source_kind, source_id, display_title, source_revision}` run variables are a platform follow-up; this catalog does not claim to fully solve stable references across runs.

### True blockers vs recommendations

**Blocked** (stop): the agent cannot safely determine what to change, the repository boundary, or the evidence required to verify it. Also blocked: missing catalog templates/guidelines, unconfirmed bug root cause, unrelated dirty files treated as in-scope, required checks not run for Review PASS, and Delivery Sync without a matching Review PASS.

**Recommended** (proceed with gaps): missing design, environment, or contract detail is recorded as an assumption, `Needs design decision`, `Validation required before implementation`, or `not ready: <reason>`. Do not bounce the user into an unrelated authoring pipeline whose only purpose is satisfying a type gate.

### Shared lifecycle language

| Term | Meaning |
|---|---|
| **Verified** | Review & Verification returned PASS for a named change boundary. |
| **Synced** | Linked SpecX documents were updated to match verified behaviour. |
| **Released** | Not used. This catalog does not deploy or publish software. |

### Shared input labels

| Internal key | Meaning |
|---|---|
| `SOURCE_SPEC_REF` | Artifact being elaborated into design, plans, or tests. |
| `WORK_ITEM_REF` | Approved scope to implement, verify, or synchronize — or evidence from which a Work Scope Brief can be created. |
| `CHANGE_SCOPE` | Files, diff, branch, PR, or milestone boundary under review. |
| `MILESTONE_SELECTOR` | Delivery slice; only when the work item is a Milestone Plan. |

---

## 3. Typical paths

```text
Material capability
  Requirements → PRD
        ↓
  PRD / Change Request → Design Spec     (optional if the slice is already bounded)
        ↓
  Milestone Plan Builder                 (from PRD, Design Spec, Change Request, or Work Scope Brief)
        ↓
  Implementation                         (normalizes PRD/Design/external evidence into a Work Scope Brief)
        ↓
  Review & Verification                  (PASS / FAIL)
        ↓
  Delivery Sync & Spec Update            (docs only; no deploy)

Bounded amendment
  Change Request Builder
        ↓
  Implementation                         (or Design Spec → Milestone Plan first)
        ↓
  Review & Verification
        ↓
  Delivery Sync & Spec Update

Defect
  Bug Fix Analyzer
        ↓
  Implementation
        ↓
  Review & Verification
        ↓
  Delivery Sync & Spec Update

Mid-stream evidence (ticket, branch, named diff, mixed sources)
  Work Scope Brief created by Implementation, Review, planning, or test resolve
        ↓
  Implementation / Review / Test Generation / Delivery Sync as applicable
```

**Test Generation & Logging** and **Scrum Standup** sit beside these paths. Tests may be designed from a PRD. Standup is status logging, not delivery.

Implementation invokes Review, then Delivery Sync, as child pipelines. Those two can also be run directly.

---

## 4. Catalog map

### Pipelines (WorkX)

| Title | Slug | Role |
|---|---|---|
| Requirements → PRD | `ai-sdlc-requirements-to-prd` | Intake for material capability work |
| Change Request Builder | `ai-sdlc-feature-spec-builder` | Intake for bounded amendments |
| Bug Fix Analyzer | `ai-sdlc-bug-fix-analyzer` | Intake for unintended defects |
| PRD / Change Request → Design Spec | `ai-sdlc-prd-feature-to-design-spec` | Architecture from a product brief |
| Milestone Plan Builder | `ai-sdlc-design-feature-to-milestone-plan` | Slice delivery from PRD, design, change, or brief |
| Implementation | `ai-sdlc-milestone-implementation` | Build a locked work item |
| Review & Verification | `ai-sdlc-review-verification` | Delivery-verification gate |
| Delivery Sync & Spec Update | `ai-sdlc-release-spec-update` | Sync living docs after PASS |
| Test Generation & Logging | `ai-sdlc-test-generation-logging` | Test plan + observed results |
| Scrum Standup | `ai-sdlc-scrum-standup` | Daily/sprint log entry |

### Templates (documents the pipelines create)

| Title | Document produced |
|---|---|
| PRD Template | `<Subject> - PRD` |
| Change Request Template | `<Subject> - Change Request` |
| Design Spec Template | `<Subject> - Design Spec` |
| Milestone Plan Template | `<Subject> - Milestone Plan` |
| Work Scope Brief Template | `<Subject> - Work Scope Brief` |
| Bug Fix Spec Template | `<Bug Subject> - Bug Fix Spec` |
| Test Plan Template | `<Subject> - Test Plan` |
| Standup Log Template | `${WORKSPACE.TITLE} - Standup Log` |

### Guidelines (rules loaded by exact title)

| Title | Governs |
|---|---|
| Work Intake & Artifact Selection Guide | PRD vs Change Request vs Bug Fix Spec, and when a Work Scope Brief is an execution bridge |
| Design & Architecture Principles | Design Spec quality |
| Bug Analysis Guidelines | Bug Fix Spec quality and bug-vs-change routing |
| Code Review & Quality Bar | Review PASS/FAIL |
| Test Strategy Guidelines | Test Plan coverage, modes, and observed results |

---

## 5. Pipeline contracts

### 5.1 Requirements → PRD

**Use when:** defining a new or materially evolving capability (greenfield or brownfield). Continue here to update an existing PRD.

**Steps:** Resolve the initiative → Author the PRD → Verify the PRD → Report the PRD handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `INITIATIVE` | Optional | Required | Product or problem name/description. If missing, shortlists existing PRDs and asks whether to continue one or start new. |

**Catalog required:** `Work Intake & Artifact Selection Guide` (`ai-sdlc-prd-vs-feature-spec-guidelines`), `PRD Template` (`ai-sdlc-prd-template`).

**Output:** `<Subject> - PRD` created or updated in place. Handoff recommends `PRD / Change Request → Design Spec`, `Milestone Plan Builder`, or `Test Generation & Logging`. A ready PRD may also feed a Work Scope Brief for Implementation when the slice is already bounded.

**Stops midway if:**

- Intake guide or PRD Template missing (**workspace setup required**).
- Work is a bounded amendment → recommends **Change Request Builder**.
- Work is unintended deviation from expected behaviour → recommends **Bug Fix Analyzer**.
- Classification still ambiguous → asks the user; does not write a hybrid document.
- PRD quality bar fails (journeys, AC, measurable goals) → does not mark ready.

**Mid-adoption:** Strong entry point. Paste or describe an existing PRD/requirements doc; the pipeline will create or update `<Subject> - PRD`. Does not require any prior `ai-sdlc` document.

---

### 5.2 Change Request Builder

**Use when:** a known contract already exists and the work is a bounded, intentional amendment.

**Steps:** Resolve the change context → Analyze the change impact → Author the Change Request → Verify the Change Request → Report the change-request handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `REQUESTED_CHANGE` | Optional | Required | The bounded behaviour change. |
| `SOURCE_CONTRACT_REF` | Optional | Required | Existing PRD, Design Spec, API/technical contract, or equivalent usable reference. URL/path/paste is snapshotted inside the Change Request. |

**Catalog required:** `Work Intake & Artifact Selection Guide` (`ai-sdlc-prd-vs-feature-spec-guidelines`), `Change Request Template` (`ai-sdlc-feature-spec-template`).

**Output:** `<Subject> - Change Request` created or updated in place. This is a **sibling amendment**, not an in-place edit of the source spec. External source contracts are preserved as a Source Contract Snapshot. Delivery approach recommends either straight **Implementation** or Design Spec then Milestone Plan Builder.

**Stops midway if:**

- Intake guide or Change Request Template missing (**workspace setup required**).
- Work is a material capability change → **Requirements → PRD**.
- Work is unintended deviation with no change intent → **Bug Fix Analyzer**.
- Impact analysis cannot name an existing contract to update → **Requirements → PRD**.

**Mid-adoption:** Usable if you can name or paste the current contract. If there is no contract at all, this pipeline will not invent one; it sends you to a PRD. It does not create a Work Scope Brief solely for the source contract.

---

### 5.3 Bug Fix Analyzer

**Use when:** observed behaviour is wrong against an already-defined expectation. Continue from a report, log, failing test, or incident.

**Steps:** Resolve the bug context → Reproduce and triage → Establish the root cause → Author the Bug Fix Spec → Verify the bug analysis.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `BUG_REPORT` | Optional | Required | Symptoms, log, failing test, path, URL, or description. |

**Catalog required:** `Bug Analysis Guidelines` (`ai-sdlc-bug-analysis-guidelines`), `Bug Fix Spec Template` (`ai-sdlc-bug-fix-spec-template`) (and intake guide when routing out).

**Output:** `<Bug Subject> - Bug Fix Spec` created or updated in place. Does **not** implement the fix. Handoff recommends **Implementation**.

**Stops midway if:**

- Guidelines or template missing (**workspace setup required**).
- Stakeholders want the contract changed, or expected behaviour is undefined → **Change Request Builder** or **Requirements → PRD**.
- Root cause is still a hypothesis → will not author a pretend fix. **This remains a safety block.**
- Reproduction is impossible and that is not stated.

**Mid-adoption:** Strong entry point. No prior catalog spec is required. A visible unrelated failure must not be selected automatically.

---

### 5.4 PRD / Change Request → Design Spec

**Use when:** a product brief exists and you need architecture, contracts, and traceability.

**Steps:** Resolve the design context → Inspect the existing architecture → Author the Design Spec → Verify the design → Report the design handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `SOURCE_SPEC_REF` | Optional | Required | Must be a **PRD or Change Request**. Pasted PRD/CR is persisted as a native document so later tasks can reread it. |

**Catalog required:** `Design Spec Template` (`ai-sdlc-design-spec-template`), `Design & Architecture Principles` (`ai-sdlc-design-architecture-principles`).

**Rejected sources:** Design Spec, Milestone Plan, Bug Fix Spec, Work Scope Brief, Test Plan, Standup Log. Design still needs a product brief; a Work Scope Brief is not a substitute.

**Output:** `<Subject> - Design Spec` created or updated in place. Handoff recommends `Milestone Plan Builder`.

**Stops midway if:**

- Template or principles missing (**workspace setup required**).
- Evidence is not a PRD or Change Request.
- Design quality bar fails (no owner per concern, restated PRD in place of architecture, missing rejected alternatives).

**Mid-adoption:** Bring an external PRD by pasting it here or by running Requirements → PRD first. You cannot skip the product brief and start from an existing Design Spec here (that document is the *output*, not the input). Existing designs can already enter planning, testing, or Work Scope normalization without recreating them.

---

### 5.5 Milestone Plan Builder

**Use when:** delivery needs sequenced, independently verifiable slices.

**Steps:** Resolve the planning context → Map the delivery dependencies → Author the Milestone Plan → Verify the milestones → Report the plan handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `SOURCE_SPEC_REF` | Optional | Required | **PRD, Design Spec, Change Request, or Work Scope Brief.** External evidence that is sufficient is persisted as a Work Scope Brief. |

**Catalog required:** `Milestone Plan Template` (`ai-sdlc-milestone-plan-template`).

**Rejected sources:** Milestone Plan, Bug Fix Spec, Test Plan, Standup Log. A PRD is **accepted**.

**Plan modes:**

- **product-level** from a PRD: outcome slices, owners, dependencies, decision points. Unresolved technical sequencing is labeled `Needs design decision` or `Validation required before implementation`.
- **implementation-level** from a Design Spec, Change Request, or Work Scope Brief: contracts, migrations, and technical ordering may drive milestones.

**Output:** `<Subject> - Milestone Plan` created or updated in place. New milestones are `Planned`; existing In Progress / Blocked / Done statuses are preserved. Unknown owners are `Unassigned`. Handoff recommends **Implementation** of the first eligible milestone when that slice has a bounded scope and acceptance criteria.

**Stops midway if:**

- Template missing (**workspace setup required**).
- Dependency graph contains a cycle that cannot be resolved.
- A milestone claims to be implementation-ready without a bounded scope and acceptance criteria.

Missing architecture is a visible assumption, risk, or recommendation — **not** an automatic rejection.

**Mid-adoption:** A team with only a PRD can plan. Implementation still requires each selected milestone to have a bounded scope and acceptance criteria.

---

### 5.6 Implementation

**Use when:** a delivery scope is ready to build, or evidence exists from which a bounded Work Scope Brief can be created.

**Steps:** Resolve the work item → Normalize the work item → Inspect the repository state → Implement the work item → Run Review & Verification → Confirm the delivery-verification gate → Run Delivery Sync & Spec Update → Report the implementation handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `WORK_ITEM_REF` | Optional | Required | Native Milestone Plan, Change Request, Bug Fix Spec, or Work Scope Brief, **or** PRD / Design Spec / ticket / branch / mixed evidence to normalize. |
| `MILESTONE_SELECTOR` | Optional | Conditional | Required when the work item is a Milestone Plan. Not used for Change Request, Bug Fix Spec, or Work Scope Brief. |

**Normalization:** native Change Request, Bug Fix Spec, milestone, or Work Scope Brief passes through. PRD, Design Spec, or external evidence must produce a bounded Work Scope Brief before code changes. If outcome, acceptance criteria, exclusions, and repository boundary cannot be locked without guessing, **stop** — this remains a safety block.

**Output:**

- Code and tests in the working tree (**no commit, push, PR, publish, or deploy**).
- Locked change boundary (files/diff/milestone) for child pipelines.
- Child **Review & Verification** PASS/FAIL.
- If PASS: child **Delivery Sync & Spec Update** (spec updates + implementation record).
- If FAIL: Delivery Sync does not run.

**Stops midway if:**

- No eligible work item or sufficient evidence can be locked.
- Normalization cannot lock outcome, AC, exclusions, or repo boundary without guessing.
- Work item is a plan but no open milestone exists (asks; does not invent a slice).
- Unrelated dirty files would be overwritten — they must be preserved.
- Child `Review & Verification` pipeline title missing.
- Delivery-verification gate FAIL → **blocks Delivery Sync**.
- Child `Delivery Sync & Spec Update` pipeline title missing after PASS.

**Mid-adoption:** Working code plus a PRD can proceed when the PRD (or ticket/branch) can be turned into a bounded Work Scope Brief. The branch is not treated as the work item by itself. Unrelated dirty files stay out of scope.

---

### 5.7 Review & Verification

**Use when:** a defined change boundary must be judged against its work item and the Code Review & Quality Bar. Also invoked as a child of Implementation.

**Steps:** Resolve the review context → Normalize the review scope → Review alignment with the spec → Review code quality → Remediate review findings → Verify the review outcome.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `WORK_ITEM_REF` | Optional on direct run; required already-exact on parent run | Required | Open milestone, Change Request, Bug Fix Spec, or Work Scope Brief. |
| `CHANGE_SCOPE` | Optional on direct run; required already-exact on parent run | Required | Files, diff, branch, PR, or milestone boundary. Never inferred from arbitrary dirty files. |

**Catalog required:** `Code Review & Quality Bar` (`ai-sdlc-code-review-quality-bar`). Direct-run as-built briefs also need `Work Scope Brief Template` (`ai-sdlc-work-scope-brief-template`).

**Output:** Task output with `PASS` or `FAIL`. May edit **in-scope** code to remediate blocker/major findings. A direct run may create an as-built Work Scope Brief. Parent invocation remains strict: exact work item and change boundary must already be supplied; no rediscovery and no new brief.

**Stops midway if:**

- **Parent invocation:** either input missing or too fuzzy → **contract error**, no rediscovery.
- Direct run: user will not name a work item/evidence or an exact change boundary.
- Outcome, AC, exclusions, or repo boundary cannot be locked without guessing.
- Required checks not run or failing → FAIL (not PASS). **This remains a safety block.**

**Mid-adoption:** Direct run can review a named issue/PR/diff against a work item, or create an as-built brief from that evidence plus the exact boundary. It will not invent scope from a dirty tree.

---

### 5.8 Delivery Sync & Spec Update

**Use when:** Review has already **PASSED** and living SpecX documents must match verified behaviour. Also invoked as a child of Implementation after the gate.

This pipeline **does not deploy, publish, tag, or release software**.

**Steps:** Resolve the delivery-sync context → Confirm delivery-sync readiness → Synchronize the specs → Record the implementation → Report the delivery-sync handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `WORK_ITEM_REF` | Same parent/direct rules as Review | Required | Milestone, Change Request, Bug Fix Spec, or Work Scope Brief. |
| `CHANGE_SCOPE` | Same parent/direct rules as Review | Required | Must match the verified boundary. |

**Output:**

- Every **resolvable** linked SpecX document updated in place to match verified behaviour.
- Missing linked PRD/Design titles **reported and skipped** with a recommended authoring pipeline. Other documents still sync. No retrospective product history is invented.
- Dated implementation record on the work item (including a Work Scope Brief's Implementation Record).
- Milestone status `Done` when the work item is a plan slice.
- If a code-first team has no living source docs, the verified Work Scope Brief is the durable record, plus documentation follow-up.

**Stops midway if:**

- Review has not PASSED for this exact work item and change scope (**never syncs unverified work**).
- Parent invocation inputs are missing or fuzzy → contract error.

A missing linked title does **not** abort the rest of the sync.

**Mid-adoption:** Teams with shipped code and no SpecX sources keep the verified Work Scope Brief. Direct run still requires a prior Review PASS.

---

### 5.9 Test Generation & Logging

**Use when:** a spec needs a Test Plan with observed results. A PRD is enough to **design** tests. Does not fix defects.

**Steps:** Resolve the test context → Design the test coverage → Author the Test Plan → Execute the feasible tests → Log the test results → Verify the QA handoff.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `SOURCE_SPEC_REF` | Optional | Required | PRD, Change Request, Bug Fix Spec, Design Spec, Milestone Plan, or Work Scope Brief. |

**Catalog required:** `Test Plan Template` (`ai-sdlc-test-plan-template`), `Test Strategy Guidelines` (`ai-sdlc-test-strategy-guidelines`).

**Rejected sources:** Standup Log, an existing Test Plan. Does not invent acceptance criteria.

**Test-plan modes:**

- **requirements-based** for PRD or Change Request: journey and acceptance tests, risks, data needs, expected outcomes.
- **implementation-aware** for Design Spec, Milestone Plan, Bug Fix Spec, Work Scope Brief, or code/API evidence.

**Output:** `<Subject> - Test Plan` created or updated in place, with pass / fail / `not run` (with reason). Implementation-specific cases without environment, API, or build detail are `not run` with `not ready: <reason>` — never invented, never counted as PASS. Failures are reported, not fixed.

**Stops midway if:**

- Template or guidelines missing (**workspace setup required**).
- High-risk behaviour has no case, or results would have to be invented.

**Mid-adoption:** QA can start from a PRD. Execution stays honest: unready implementation cases are not passes.

---

### 5.10 Scrum Standup

**Use when:** recording one member’s daily or sprint update. Not a delivery pipeline.

**Steps:** Resolve the standup context → Collect the standup update → Append the standup entry → Verify the standup log.

| Input | Launch | Lock | Notes |
|---|---|---|---|
| `STANDUP_INPUT` | Optional | Partial | Member name, notes, or both. Member identity is required to finish. |
| `WORKSPACE.TITLE` | System | Required | Used to name `${WORKSPACE.TITLE} - Standup Log`. Asked if empty. |

**Required to finish (collected interactively):** member identity, completed work, next work, and an **explicit** blocker statement. Silence is not “no blockers.” Help and decisions are optional.

**Catalog required:** `Standup Log Template` (`ai-sdlc-standup-log-template`).

**Output:** Standup Log created if missing; today’s entry `<YYYY-MM-DD> — <Member>` created or updated in place.

**Stops midway if:** template missing (**workspace setup required**), workspace title unusable, or member identity cannot be locked. Does not fabricate progress.

**Mid-adoption:** Least blocked. Creates the log if it does not exist.

---

## 6. Allowed-source matrix

What each downstream pipeline will accept as its locked source / work item:

| Downstream | PRD | Change Request | Design Spec | Milestone Plan | Bug Fix Spec | Work Scope Brief |
|---|---|---|---|---|---|---|
| Requirements → PRD | continue/update | — (routes here from CR if material) | inspect for context only | — | — | — |
| Change Request Builder | source contract | output | source contract | — | — | — |
| Bug Fix Analyzer | — | route-out if intent changed | — | — | output | — |
| → Design Spec | **yes** | **yes** | no | no | no | no |
| Milestone Plan Builder | **yes** (product-level) | **yes** | **yes** | no | no | **yes** |
| Implementation | normalize to brief | **yes** | normalize to brief | **yes** (plus slice) | **yes** | **yes** |
| Review & Verification | as-built brief if exact diff named | **yes** | as-built brief if exact diff named | **yes** (open slice) | **yes** | **yes** |
| Delivery Sync | may be *updated* if linked; skip if missing | **yes** (work item) | may be *updated* if linked; skip if missing | **yes** (work item) | **yes** | **yes** (durable record) |
| Test Generation | **yes** (requirements-based) | **yes** | **yes** | **yes** | **yes** | **yes** |

“Normalize” means: proceed only after a Work Scope Brief states exact outcome, acceptance criteria, exclusions, and repository boundary.

---

## 7. Where mid-adoption gets stuck

Missing *previous catalog output* is usually not a hard stop. **Unsafe scope**, **unverified sync**, and **missing catalog install** are.

### 7.1 Safety blocks (still hard)

- Implementation / Review cannot lock outcome, acceptance criteria, exclusions, or a repository boundary without guessing.
- Unrelated dirty files must not be folded into the change.
- Bug Fix Analyzer will not author a spec from an unconfirmed root cause.
- Review PASS requires every required check to succeed; `not run` is a fail.
- Delivery Sync requires a matching Review PASS for the exact work item and change boundary.

### 7.2 Recommendations (not rejections)

- Milestone Plan Builder from a PRD with missing architecture → label `Needs design decision` or `Validation required before implementation`.
- Test Generation from a PRD → design the tests; mark implementation-specific cases `not run` / `not ready: <reason>`.
- Delivery Sync missing a linked PRD/Design title → report, skip, recommend the authoring pipeline; continue other documents.
- Code-first team with no living docs → keep the verified Work Scope Brief and report documentation follow-up.

### 7.3 Evidence that cannot survive a reread

Resolve allows URL / path / paste. Later tasks reread a native SpecX document (by id when locked, title as fallback). If the evidence was never persisted as a native document or Work Scope Brief, later tasks repeat resolution rather than guessing. Normalization is now part of the affected pipelines so a paste at step 1 should become a durable record before step 2.

### 7.4 Catalog not installed

Every authoring pipeline stops if its template or guideline is missing from SpecX. The failure copy names **workspace setup required**, the exact title, and the stable slug. Install the `ai-sdlc` collection into SpecX and WorkX before running work pipelines. This catalog does not perform that install.

---

## 8. Join-midway playbook

| What the team has today | First pipeline | First useful output | Likely block if skipped |
|---|---|---|---|
| Idea / problem statement | Requirements → PRD | `<Subject> - PRD` | — |
| Existing PRD in another tool | Requirements → PRD (paste/import) or Design / Plan / Tests / Implementation with persist | Adopted `<Subject> - PRD` or Work Scope Brief | Guessing an unbounded implementation slice |
| Ticket + existing behaviour / contract | Change Request Builder | `<Subject> - Change Request` | No namable contract → forced to PRD |
| Bug, log, failing test, incident | Bug Fix Analyzer | `<Bug Subject> - Bug Fix Spec` | Treating a product-intent change as a bug; unconfirmed root cause |
| PRD, need architecture | → Design Spec | `<Subject> - Design Spec` | Feeding a Design Spec back in as source |
| PRD, need slices (no design yet) | Milestone Plan Builder | Product-level `<Subject> - Milestone Plan` | Treating unlabeled design gaps as implementable slices |
| Design, Change Request, or Work Scope Brief, need slices | Milestone Plan Builder | Implementation-level plan | — |
| PRD / ticket / branch / mixed evidence, ready to build a bounded slice | Implementation | Work Scope Brief + working-tree code + review | Cannot lock outcome, AC, exclusions, or repo boundary |
| Change Request / Bug Fix Spec / open milestone / Work Scope Brief | Implementation | Working-tree code + review + optional sync | — |
| Named diff + issue/evidence | Review & Verification | As-built Work Scope Brief + PASS / FAIL | Inferring scope from a dirty tree; parent run with fuzzy inputs |
| PASS + existing SpecX sources | Delivery Sync | Updated sources + implementation record | No PASS |
| PASS + no living source docs | Delivery Sync | Implementation Record on the Work Scope Brief | Expecting invented PRDs |
| PRD or other allowed source, need tests | Test Generation | `<Subject> - Test Plan` | Counting `not ready` cases as PASS |
| Need a daily update | Scrum Standup | Standup Log entry | — |

**You do not need to start at the PRD.** Start at the most advanced incomplete artifact you can lock. You **do** need a bounded work item (Change Request, Bug Fix Spec, milestone slice, or Work Scope Brief) before code changes, and an exact change boundary before Review PASS.

---

## 9. What this catalog does not do

- Deploy, tag, publish, or open a pull request.
- Treat “Delivery Sync” as a production release.
- Auto-route a workspace into the correct pipeline (the human still picks one; summaries say when to continue).
- Automatically ingest Jira/Linear/GitHub/Confluence/URL content outside what a resolve task can paste and persist.
- Persist typed `{source_kind, source_id, display_title, source_revision}` run variables or write locked ids back into launch inputs (platform follow-up).
- One-click install across WorkX pipelines and SpecX templates/specs (host feature).
- Author a dedicated post-hoc documentation baseline, or refine an existing Design Spec through the Design pipeline (existing designs can already enter planning, testing, or Work Scope normalization).

Those are product/host concerns, not this catalog pass.

---

## 10. Internal identifiers (for implementers)

Hosts should show **titles** to users and keep these slugs stable:

| User-facing title | Stable slug |
|---|---|
| Change Request Builder | `ai-sdlc-feature-spec-builder` |
| Change Request Template | `ai-sdlc-feature-spec-template` |
| Work Intake & Artifact Selection Guide | `ai-sdlc-prd-vs-feature-spec-guidelines` |
| PRD / Change Request → Design Spec | `ai-sdlc-prd-feature-to-design-spec` |
| Milestone Plan Builder | `ai-sdlc-design-feature-to-milestone-plan` |
| Work Scope Brief Template | `ai-sdlc-work-scope-brief-template` |
| Implementation | `ai-sdlc-milestone-implementation` |
| Delivery Sync & Spec Update | `ai-sdlc-release-spec-update` |

Task filenames and step keys (for example `author-feature-spec`, `run-release-spec-update`, `normalize-work-item`) are also stable internals. Do not use them as user-facing names. Existing step keys were retained; `normalize-work-item` and `normalize-review-scope` are additive.
