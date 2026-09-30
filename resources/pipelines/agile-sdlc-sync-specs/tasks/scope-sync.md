**Goal:** Confirm implementation completed on one persisted Target Revision with no unresolved required verification failure, then define deterministic non-overlapping living-spec updates.

**Scope:** This task resolves one existing Delivery Record, rechecks a selected Target Revision manifest, maps the upstream gate outcome exactly, and lists existing living specs whose paths do not overlap the persisted implementation boundary. It must not create a duplicate record, update living specs yet, edit application source or tests, deploy, tag, publish, merge, or start another pipeline.

**Verification / Definition of Done:**
- [ ] An explicitly supplied Delivery Record title/reference was used first; inference occurred only when none was supplied, and ambiguity requested one selection.
- [ ] The selected revision satisfied its persisted manifest semantics.
- [ ] Upstream failed, blocked, needs_input, and missing/unreadable state mapped to failed, blocked, needs_input, and blocked respectively.
- [ ] After the gate passed, each existing living-spec target had a stable target id, exact path and section, and deterministic intended section change; an empty list remained a valid done no-op.
- [ ] Every proposed living-spec path was preflighted against the implementation permitted boundary before approval; overlap stopped blocked before mutation.
- [ ] After the gate passed, one preview included provenance only for material assumptions or decisions and was acknowledged once.
- [ ] The named Persisted handoff stores every field required by Task 2.
- [ ] Application source and tests were not edited. Nothing was deployed, tagged, published, or merged.

**Instructions:**

1. Expose concise state while working: `inspecting`, `waiting` for the single approval, or `blocked` when required documents are unavailable.
2. Use these outcome meanings: `done` means required verification passed or was concretely observed; `failed` means verification ran and found a defect or unmet acceptance criterion; `needs_input` means one unresolved consequential decision requires a person; `blocked` means the environment or authority is unavailable, or required durable state is unavailable.
3. If the user supplied a Delivery Record title or durable reference, resolve it exactly and persist that exact title. Only when none was supplied, infer the subject and `<Subject> - Agile Delivery Record`. If more than one candidate matches, use `needs_input` for one selection; never silently choose or create a duplicate. If the selected record is missing or unreadable, stop `blocked` and name it.
4. Select one revision id and its stored manifest; if several revisions are present and none was explicitly selected, ask once which to sync. Validate it under its persisted manifest semantics; boundary drift is `blocked`, unrelated outside-boundary changes are ignored, and nothing is checked out or auto-committed.
5. Read Implementation Outcome and append-only events. Map the gate exactly: upstream `failed` -> `failed`; upstream `blocked` -> `blocked`; upstream `needs_input` -> `needs_input` and cite its durable decision; missing or unreadable outcome, manifest, event state, or contract boundary -> `blocked`. For upstream `done`, require a source `implement` event in the selected revision lineage and no unresolved required failed event in that lineage. A failure is resolved only by later passing required evidence in the same lineage that links to its event id; not-applicable never resolves it. Missing matching implementation evidence is `blocked`; an unresolved required verification failure is `failed`.
6. Inspect only existing living documents for the subject. Include a target only when matching-revision evidence supports a criterion or shipped decision. Give each target a stable id and preserve its exact title, repository path, existing section, deterministic intended section change, and supporting event or decision id. An empty target list is a valid done no-op.
7. Before approval, preflight every target living-spec repository path against the persisted implementation permitted boundary. If any target overlaps it or would invalidate the selected revision, stop `blocked` and name the overlapping paths. Do not edit anything.
8. Record provenance only for material assumptions or decisions. Present one preview of at most six lines with exact record title/revision id, gate evidence, target actions, material decisions, and next action; wait for one acknowledgement.
9. **Persisted handoff:** store status `approved`, exact source Delivery Record title, subject, selected revision id and complete manifest, exact implementation permitted boundary, gate evidence, target entries with stable target ids, exact titles and repository paths, existing sections, deterministic intended section changes, and supporting ids, plus material assumptions or decisions. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state.
10. Do not mutate documents or the repository.
