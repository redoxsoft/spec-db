**Goal:** Determine what actually changes: current behaviour, the delta, and the source-contract sections that must move.

**Scope:** Read the locked `${SOURCE_CONTRACT_REF}`, inspect the repository as it relates to `${REQUESTED_CHANGE}`, and record impact. Do not author the Change Request yet. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Current behaviour, desired outcome, and each impacted source section are named with evidence from the locked spec and the repository. If no existing contract can receive the update, or the change is material, the task stopped and recommended a PRD. If the work is unintended deviation from expected behaviour, the task stopped and recommended Bug Fix Analyzer.

**Instructions:**

- Reread the locked `${SOURCE_CONTRACT_REF}` by document id when one was locked; otherwise by exact title or the carried source-contract snapshot. If neither is available, repeat resolution rather than guessing. Reread the locked `${REQUESTED_CHANGE}` so impact stays tied to the requested change. Do not require a Work Scope Brief solely for the source contract.
- Inspect the repository only as far as it explains current behaviour for this request. Do not expand into unrelated modules.
- State the current contract, the desired delta, and which sections of the source spec must change. Quote or paraphrase each impacted section's current contract.
- Apply `Work Intake & Artifact Selection Guide`:
  1. If the work is unintended deviation from a documented contract with no change intent, **stop** and recommend `Bug Fix Analyzer`. Do not continue to authoring.
  2. If you cannot name an existing contract to update, or the change is material (multiple journeys, new metrics, new capability area), **stop** and reclassify as a PRD. Recommend `Requirements → PRD` and do not continue to authoring.
- Report the locked change name, source title and version, impacted sections, and whether the change can go straight to implementation or needs design and milestone planning.
