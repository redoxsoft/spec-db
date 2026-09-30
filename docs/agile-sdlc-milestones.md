# Agile SDLC milestones

Execute these in order, one at a time. **Stop at the end of each milestone. Do not start the next until its verification passes.**

Every mapping rule, slug, title, tag, and outline shape lives in [agile-sdlc-playbook.md](agile-sdlc-playbook.md). Read it in full before Milestone 1; the milestones below cite it rather than repeating it. Repository authoring rules are [CONTRIBUTING.md](../CONTRIBUTING.md).

`npm run check` is necessary, never sufficient. It validates schemas, tags, and the registry. Completion also requires adversarial execution against active resources: include the smallest routine change, actual instruction/context/output burden, fresh-context handoffs, and optional cross-pipeline transitions without using charter or playbook prose to fill gaps.

## Standing constraints

These hold for every milestone.

- **Legacy source is historical input.** During initial construction, read the legacy `resources/**/agile-sdlc-*` resources without modifying them. After canonicalization, the resource tree must contain only the exact inventory in playbook section 5.
- **Do not reconstruct content from memory.** During initial construction, open the legacy source named in playbook section 5 and rewrite from it.
- `relatedSlugs` is omitted through Milestone 2. Milestone 3 wires the exact six-template inventory to its existing consumers; every entry added from then on must resolve to an existing `agile-sdlc-*` resource.
- If a milestone's verification fails, fix it inside that milestone. Do not carry a known failure forward.

### Reusable checks

Run these from the repository root. `rg` is ripgrep.

```bash
# A. No legacy resource references inside canonical resources (must print nothing)
rg -n 'agile-sdlc-(implement-change|review-change|address-review|verify-change|pipeline-execution-contract|artifact-selection-guide)' resources/*/agile-sdlc-*/

# B. No legacy titles or filesystem write targets inside canonical resources (must print nothing)
rg -n 'Agile (Implement Change|Review Change|Address Review|Verify Change|Pipeline Execution Contract|Artifact Selection)' resources/*/agile-sdlc-*/
rg -n 'docs/(prds|specs|plans|test-plans|reviews|verification|records)/|\.specx/checkpoints' resources/*/agile-sdlc-*/

# C. No banned procedural vocabulary inside canonical knowledge specs (must print nothing)
rg -ni 'typed outcome|write boundar|execution preview|record profile|remediation cycle|delivery_cycle|SpecX run context|child pipeline' resources/specs/agile-sdlc-*/content.md

# D. No counters, obsolete outcomes, or three-outcome handoff bans (must print nothing)
rg -ni 'failed_implementation|failed_test_contract|design_conflict|blocked_input|blocked_environment|human_decision_required|changes_requested' resources/*/agile-sdlc-*/
rg -ni 'attempt limit|retry counter|cycle count|remediation cycle|delivery_cycle|outcome \(done, needs_input, or blocked' resources/*/agile-sdlc-*/

# E. Mechanical pipeline form (must print nothing)
rg -n '\$\{' resources/pipelines/agile-sdlc-*/tasks/
rg -n '"type"\s*:\s*"pipeline"' resources/pipelines/agile-sdlc-*/content.json
```

---

## Milestone 1 — Registry

**Done when:** the pack can be referenced and no canonical resource exists yet.

Confirm the two permanent strings called out in playbook section 2 (`displayName` and the tag id) before writing anything. Then add collection `agile-sdlc` with subcollections `agile-sdlc-specify`, `agile-sdlc-deliver`, and `agile-sdlc-verify`, plus tag `agile-sdlc`, exactly as specified there.

**Verify**

- [ ] `collections/collections.json` has the four ids; the three children carry `parentId: "agile-sdlc"`; all are `"status": "active"`; unrelated entries are byte-identical to before.
- [ ] `tags/tags.json` has `agile-sdlc` under `use-case`, active, and applicable to spec, template, and pipeline.
- [ ] No `resources/**/agile-sdlc-*` directory exists.
- [ ] `npm run check` prints `validate: ok`.

## Milestone 2 — Knowledge specs

**Done when:** the five specs in playbook section 5.1 exist, and they contain knowledge only.

For each, open the legacy source named in section 5.1, carry the domain content, and leave every procedural passage behind. The test for each paragraph: if it tells an agent what to do in what order, or names a pipeline, an outcome, or a write permission, it does not belong here — it will be written into a task file in Milestones 5 through 7.

**Verify**

- [ ] Exactly these five slugs exist and no other Agile SDLC spec: `agile-sdlc-artifact-routing-guide`, `agile-sdlc-requirements-quality-guide`, `agile-sdlc-tech-design-standards`, `agile-sdlc-test-strategy-guide`, `agile-sdlc-code-review-guide`.
- [ ] Each has H1 exactly equal to `metadata.title`, sections starting at H2, a `<!-- key: ... -->` on every section heading, unique keys, and no content before the first H2.
- [ ] Check C prints nothing.
- [ ] The routing guide makes risk categories advisory, stops only for an unresolved consequential decision, and contains no authority matrix, write-boundary table, or record-profile table.
- [ ] The code review guide has exactly two severities and no outcome routing table.
- [ ] Checks A and B print nothing. `relatedSlugs` is omitted. `npm run check` passes.

## Milestone 3 — Generic artifact templates

**Done when:** exactly the six templates in playbook section 5.2 exist and all five specification pipelines use the shared generic templates.

Retain the Work Item, Delivery Record, and Review Findings templates. Use the canonical Technical Design template slug and generalized content. Add the shared Product Spec and Delivery Plan templates, update every consumer and related-slug edge, then remove the four superseded specialized template directories. Produced document titles do not change.

**Verify**

- [ ] Exactly these six prefixed slugs exist: `work-item-template`, `product-spec-template`, `technical-design-template`, `delivery-plan-template`, `delivery-record-template`, and `review-findings-template`.
- [ ] Exact template titles match playbook section 5.2, including Agile Technical Design Template at the canonical `agile-sdlc-technical-design-template` slug.
- [ ] Every outline has fixed top-level nodes, no required descendant under an optional ancestor, depth at most 4, and tree-wide unique keys. Every top-level node is inherently meaningful or contains required meaningful content; optional modules can be omitted as a whole, with no empty wrapper or placeholder.
- [ ] Product Spec has one fixed Product Specification root with required Context and Intent. Its other named modules are optional descendants, including optional repeatable Non-Goals under Scope and Requirements. PRD and Feature modes use the same shape without requiring personas, metrics, traceability, or an upstream PRD.
- [ ] Technical Design has one fixed Technical Design root with required Technical Approach and Approach Overview. It preserves optional decisions, affected boundaries, API, data, migration, security, operations, rollout, and rollback modules without mandatory isolation zones or stack assumptions.
- [ ] Delivery Plan has one fixed Delivery Plan root with required Objective and Scope plus Objective. Test Plan mode may omit the Execution Increments module; Implementation Plan mode may omit Verification Scenarios when increment checks suffice.
- [ ] Generate PRD and Generate Feature Spec use Agile Product Spec Template while preserving `<Subject> - Agile PRD` and `<Subject> - Agile Feature Spec`.
- [ ] Generate Test Plan and Generate Implementation Plan use Agile Delivery Plan Template while preserving `<Subject> - Agile Test Plan` and `<Subject> - Agile Implementation Plan`.
- [ ] Generate Tech Spec uses Agile Technical Design Template at the canonical slug and preserves `<Subject> - Agile Tech Spec`.
- [ ] Templates contain durable document shape and generic repository-derived guidance, not source-control actions, retries, checkpoints, role assignments, or orchestration procedure.
- [ ] Every Agile SDLC `relatedSlugs` entry resolves, every resource keeps `sourceVersion: "1.0"`, and the four superseded slugs and titles are absent from canonical resources and docs.
- [ ] Checks A and B print nothing. `npm run check` prints `validate: ok`.

## Milestone 4 — Goal alignment and runtime economy

**Done when:** the existing 20-resource pack follows the product charter without changing canonical names, source versions, or the six-template shape.

- [ ] Artifact Routing Guide is the sole routing authority. Its default is Work Item -> Implement -> Delivery Record; optional Product Spec, Technical Design, and Delivery Plan artifacts resolve concrete uncertainty and do not form a mandatory chain.
- [ ] Change, defect, and loose evidence map to Work Item modes. Risk categories are advisories unless one consequential decision remains unresolved.
- [ ] Requirements Quality Guide contains requirement and acceptance-criterion quality only. All five specs contain reusable knowledge rather than pipeline procedure.
- [ ] Every two-task generation pipeline inspects source and repository evidence before asking, persists source/title/mode/decisions with provenance, uses one approval, and reloads complete state in a fresh drafting context.
- [ ] Review, extended verification, and sync persist every field their second task needs. No second task depends on conversational memory.
- [ ] A drafting or evaluation task reads at most one relevant knowledge spec. The same unchanged spec is not reread in a later task. Implement does not read the Routing Guide.
- [ ] Every preview gives provenance only for material decisions and assumptions and omits empty provenance classes. Every task exposes concise state. Every handoff reports outcome, decision, artifact, evidence, and next action.
- [ ] Metadata and `relatedSlugs` exactly match references and producer/consumer relationships. Optional verification modules remain removable.
- [ ] Once repository identity exists, Build persists one Target Revision manifest with stable revision id and every actual verification/manual-observation entry referencing it. Record stores the manifest once and appends events without rerunning checks; an early blocked or needs_input result before checks may have neither and cites its durable decision or request instead.
- [ ] A clean manifest requires exact full-SHA equality. A dirty manifest treats Base Commit SHA as ancestry context, accepts current HEAD equal to or descended from it only when all listed identities match and no additional boundary path changed relative to that base, ignores unrelated outside-boundary commits, and never auto-commits. An optional pipeline may append a linked clean bridge without overwriting the dirty manifest.
- [ ] Extended verification uses an explicitly supplied Delivery Record first, selects its stored revision manifest, and validates it under persisted semantics. Clean no-suite persists the same complete handoff as runnable suites and appends not-applicable; a required suite that becomes unavailable between tasks is blocked without fake evidence.
- [ ] Review completes an empty diff as done/not-applicable and never mutates Delivery Record. Sync uses an explicitly supplied record first, rechecks Target Revision, accepts only later passing evidence linked to a prior required failure, reports gate failures as failed, missing state or revision mismatch as blocked, and uses needs_input only for record/revision selection.
- [ ] A true trivial low-risk change has one three-line preview, requires no Work Item/template/document workspace, persists its compact contract only in run state, and produces Delivery Record as its only required durable document. Interrupted pre-record runs may require intake again.
- [ ] Delivery Record stores repeatable Target Revision manifests before zero-or-more events; summary claims use event ids only when evidence exists, and events use stable revision ids instead of repeating manifests. No aggregate fingerprint remains.
- [ ] Review Findings has only Document Status and Verdict as fixed top-level wrappers; optional repeatable findings and notes are Verdict descendants, and zero findings is only a concise non-blocking verdict with no empty section or placeholder.
- [ ] Sync preflights every target path against the implementation permitted boundary, persists deterministic per-target progress before mutation, updates one target at a time, appends that target's event immediately, reconciles interruption without duplicate edits/events, blocks on ambiguous partial state, appends one no-op event for zero targets, and claims no transactionality.
- [ ] Retained core, spec, and template metadata contain no reverse `relatedSlugs` to review, extended verification, or sync. Simulated deletion of those three pipeline directories leaves every retained edge resolvable.
- [ ] Requirements guidance uses optional Product Spec Non-Goal entries under Scope and Requirements and requires no dedicated Non-Goals or Exclusions wrapper.
- [ ] Requirements guidance and the Work Item and Product Spec templates use Given / When / Then for flows, Target plus Constraint for other observable checks, and Violation only when failure behavior is part of the contract.
- [ ] Delivery Record has one fixed Delivery Record root with required Document Status and Implementation Summary; Target Revision, Delivery Event, Decision Shipped, and Related Artifact are optional repeatable descendants omitted when absent. A zero-event blocked or needs_input record remains useful without empty history sections.
- [ ] Playbook and milestones describe the current 5-spec, 6-template, 9-pipeline, 19-task design.

**Verify**

```bash
npm run check
npm run index

# Exact inventory
test "$(printf '%s\n' resources/specs/agile-sdlc-* | wc -l | tr -d ' ')" = 5
test "$(printf '%s\n' resources/templates/agile-sdlc-* | wc -l | tr -d ' ')" = 6
test "$(printf '%s\n' resources/pipelines/agile-sdlc-* | wc -l | tr -d ' ')" = 9
test "$(printf '%s\n' resources/pipelines/agile-sdlc-*/tasks/*.md | wc -l | tr -d ' ')" = 19

# No category-only stop, repeated knowledge reads, cross-version references, orchestration, or counters
rg -n 'schema change or data migration.*need(s)? a human|authentication.*automatic stop|published-contract.*automatic stop' resources/*/agile-sdlc-*
rg -n 'companion agent|child pipeline|type:\s*"pipeline"|delivery_cycle|cycle count|attempt limit|retry counter' resources/*/agile-sdlc-* -i
rg -n 'agile-sdlc-(implement-change|review-change|address-review|verify-change|pipeline-execution-contract|artifact-selection-guide)' resources/*/agile-sdlc-*

# Simulate deleting optional pipeline directories without changing the tree.
# Must print: optional deletion simulation: ok
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";

const root = "resources";
const removed = new Set([
  "resources/pipelines/agile-sdlc-review",
  "resources/pipelines/agile-sdlc-extended-verification",
  "resources/pipelines/agile-sdlc-sync-specs",
]);
const metadata = [];
for (const kind of fs.readdirSync(root)) {
  const kindDir = path.join(root, kind);
  if (!fs.statSync(kindDir).isDirectory()) continue;
  for (const name of fs.readdirSync(kindDir)) {
    const resourceDir = path.join(kindDir, name);
    const metadataPath = path.join(resourceDir, "metadata.json");
    if (removed.has(resourceDir) || !fs.existsSync(metadataPath)) continue;
    metadata.push(JSON.parse(fs.readFileSync(metadataPath, "utf8")));
  }
}
const retainedSlugs = new Set(metadata.map(({ slug }) => slug));
const dangling = metadata.flatMap(({ slug, relatedSlugs = [] }) =>
  relatedSlugs.filter((related) => !retainedSlugs.has(related)).map((related) => `${slug} -> ${related}`),
);
if (dangling.length) {
  console.error(dangling.join("\n"));
  process.exit(1);
}
console.log("optional deletion simulation: ok");
NODE
```

The three searches must print nothing, and the simulated deletion must print its success line. Also verify every `relatedSlugs` value resolves, every `sourceVersion` remains `"1.0"`, and changed paths are limited to canonical resources plus the canonical Agile SDLC documents.
