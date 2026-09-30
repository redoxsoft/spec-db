# AI-SDLC best practices

Patterns shared across the `ai-sdlc` collection, beyond the catalog schema. Templates are the document shapes, specs are the quality bars those documents must meet, and pipelines are the only writers.

The shared rule underneath all three is: lock the minimum evidence, then refuse to invent the rest.

Related reading: [AI-SDLC catalog: adoption guide](ai-sdlc-adoption.md).

---

## Templates

- Each document is one artifact with one job. Guidance says what it is not (a Change Request is not a PRD; a Work Scope Brief is not a product-intent document) and which sibling to use instead.
- Shape is fixed context, then a required repeatable unit, then fixed fields on that unit. Journeys, requirements, changes, milestones, test cases, standup entries, and evidence items are the repeating units. Root sections stay singular.
- Gaps are optional, not omitted in silence. Edge cases, open questions, contributing factors, provenance, and dependencies use `{ min: 0 }`. Missing architecture or an unknown owner is labeled (`Needs design decision`, `Unassigned`), not filled in.
- Acceptance is a required child wherever the document can be executed or tested: journey criteria, requirement criteria, change criteria, milestone done-checks, test expected results.
- Source and mode are recorded on the document. Plans carry `product-level` or `implementation-level`. Test plans carry `requirements-based` or `implementation-aware`. Work Scope Briefs carry `planned` or `as-built`.
- Traceability is structural. Impacted sections name current contract and required update. Test cases point at one source acceptance criterion. Evidence items name a location and a snapshot.
- An Implementation Record is an optional list appended only after verification. Authoring guidance says not to pre-fill it. Standup and the PRD do not have one.
- Titles are stable and singular: `<Subject> - PRD`, `<Subject> - Change Request`, and the same pattern for the other artifacts. Pipelines update that document in place.

## Specs

- Every guideline has the same spine: expected inputs, the rules, then completion criteria. The opening paragraph fences the job (“governs X; does not do Y”) and points at the sibling spec that owns the other job.
- Structure comes from the template. The spec only says when a document is good enough (“follow the template for structure; this spec governs the quality bar”).
- Inputs are a short “use these” list plus a stop if they are missing. Missing pack documents are workspace setup, not a bad project input.
- Claims are labeled observed, inferred, or unresolved (bug analysis uses fact, inference, and unknown). Guesses are not written as facts.
- Completion is a pass/fail checklist, not a score. A PRD needs measurable goals and testable criteria. A design needs an owner per concern and a rejected alternative. A review passes only with zero unresolved blockers and majors.
- Closed vocabularies are explicit, and a fourth value is forbidden: review severities are blocker, major, minor; test results are pass, fail, `not run`. When two severities fit, the stricter one wins.
- The practical test is whether a stranger can follow the steps and see the same result. “Works as expected” and “try it again” do not count.
- Reclassification replaces hybrids. Conflicting signals escalate to the larger artifact (Change Request to PRD, bug to change). Two product-intent documents are not kept live for the same change.

## Pipelines

- The step order is resolve, inspect or analyze, author, verify, then report a handoff. Implementation inserts normalize, then calls Review and Delivery Sync as child pipelines. Standup is the same shape without a delivery handoff.
- Every task file uses the same four blocks: Goal, Scope, Verification / Definition of Done, Instructions. Scope names the one document or action allowed, and repeats the ban on commit, push, pull request, publish, and deploy.
- Nothing is required at launch. The resolve step treats empty, omitted, and a literal `${VAR}` as missing, shortlists candidates, and asks at most two questions. Authoring does not start until the value is locked and printed. Locked values are carried forward. They are not written back into launch inputs.
- Catalog dependencies are resolved by exact title and slug. If the template, guideline, or child pipeline is missing, the task stops with workspace setup required and does not reconstruct the rules from memory.
- Later steps reread the locked SpecX document. If the lock is gone, they repeat resolution instead of using the previous task’s memory. Pasted or URL evidence is persisted as a native document or a Work Scope Brief before the next step.
- Documents are created or updated in place under `<Subject> - <Artifact>`. A second document for the same subject is not created.
- Wrong artifact type is a stop with a named next pipeline, not a hybrid document. Safety blocks (unbounded scope, unconfirmed root cause, required check not run, Delivery Sync without a matching Review PASS) are different from recommendations (`Needs design decision`, `not run` / `not ready: <reason>`).
- Parent and direct runs are different contracts. A parent must pass already-exact inputs or the child stops with a contract error and does not rediscover them. A direct run may shortlist and confirm. A child outcome is never treated as a pass unless that outcome was actually returned.
