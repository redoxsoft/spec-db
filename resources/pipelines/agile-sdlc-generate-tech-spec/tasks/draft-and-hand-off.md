**Goal:** Draft or update `<Subject> - Agile Tech Spec` from the technical design template, then hand off in at most five lines.

**Scope:** This task writes the technical design in place from the confirmed brief and inspected repository: approach, decisions, affected boundaries, verification, and only the API, data, migration, security, operations, rollout, and rollback modules that apply. It must not invent architecture or schemas, modify application source code, start another pipeline, or continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] The approved drafting contract and persisted output placement were reloaded completely.
- [ ] The persisted placement was consumed without recomputation: update by id in the current folder, or create from Agile Technical Design Template at the persisted destination, re-ensuring only its exact path if the folder id vanished.
- [ ] When technical-design quality needed external guidance, the mapped knowledge guide was read once.
- [ ] Unresolved items are tagged `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`. No requirement, metric, or schema was invented to fill the outline.
- [ ] API, data, migration, security, operations, rollout, and rollback modules appear only where the brief and repository require them.
- [ ] Application source code was not modified, and no other pipeline was started.
- [ ] The handoff is at most five lines: outcome, decision needed, document written, evidence, and next action.
- [ ] The draft was self-checked against this definition of done.

**Instructions:**

1. Expose concise state while working: `drafting`, `waiting` for a newly discovered consequential decision, or `blocked` when a required dependency is unavailable.
2. Reload the complete Task 1 **Persisted handoff**, including its output placement and concise guide basis when one was selected. Name every missing applicable field and stop `blocked`; stop unless status is approved. Do not reconstruct state from conversation or re-ask an approved choice.
3. Load the persisted output placement only; never recompute, list folders, or relocate. For `update`, reread by artifact id and write in its current folder, advising if its path changed. For `create`, use `folderId`; if it vanished, re-ensure only the exact persisted `folderPath`, blocking if that path or the template cannot be made available.
4. When the draft needs architecture, decision, schema, migration, or published-contract guidance not already established by the source, read "Agile Technical Design Standards" (`agile-sdlc-tech-design-standards`) once. Use the persisted guide basis from Task 1 without reloading that guide or another knowledge spec.
5. Fill the template from the stored source, decisions, and applicable guide basis. State the smallest supported technical approach, material decisions, affected boundaries, and verification; cite a project-guide decision or exception only when it changes the design. Include only the approved optional modules. Tag unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`; do not silently promote either or invent unsupported content.
6. Self-check the draft against this definition of done and correct it without a separate verification pass.
7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Artifact names the exact document and informational folder path; include a persisted placement advisory only when present. Evidence concisely names the source and repository facts used and gives provenance only for material decisions or assumptions. Do not modify application source code or create another artifact.
