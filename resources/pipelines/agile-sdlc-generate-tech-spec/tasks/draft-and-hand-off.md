**Goal:** Draft or update `<Subject> - Agile Tech Spec` from the technical design template, then hand off in at most five lines.

**Scope:** This task writes the technical design in place from the confirmed brief and inspected repository: approach, decisions, affected boundaries, verification, and only the API, data, migration, security, operations, rollout, and rollback modules that apply. It must not invent architecture or schemas, modify application source code, start another pipeline, or continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] Approved status, source reference, subject, title, mode, modules, assumptions, and decisions were reloaded from durable run state, and the task stopped when they were incomplete.
- [ ] `<Subject> - Agile Tech Spec` was created or updated in place from Agile Technical Design Template (slug `agile-sdlc-technical-design-template`), or the task stopped with workspace setup required and named that title and slug.
- [ ] When technical-design quality needed external guidance, the mapped knowledge guide was read once.
- [ ] Unresolved items are tagged `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`. No requirement, metric, or schema was invented to fill the outline.
- [ ] API, data, migration, security, operations, rollout, and rollback modules appear only where the brief and repository require them.
- [ ] Application source code was not modified, and no other pipeline was started.
- [ ] The handoff is at most five lines: outcome, decision needed, document written, evidence, and next action.
- [ ] The draft was self-checked against this definition of done.

**Instructions:**

1. Expose concise state while working: `drafting`, `waiting` for a newly discovered consequential decision, or `blocked` when a required dependency is unavailable.
2. Reload the Task 1 **Persisted handoff**: status, source reference, subject, produced title, approved mode, applicable modules, collision disposition, and material assumptions and decisions with provenance. Name every missing field and stop `blocked`; stop unless status is approved. Do not reconstruct state from conversation or re-ask an approved choice.
3. Create or update the stored produced title in place from Agile Technical Design Template. If the template is missing, report `blocked` and name its title and slug.
4. When the draft needs architecture, decision, schema, migration, or published-contract guidance not already established by the source, read "Agile Technical Design Standards" (`agile-sdlc-tech-design-standards`) once. Do not reference another spec.
5. Fill the template from the stored source and decisions. State the smallest supported technical approach, material decisions, affected boundaries, and verification. Include only the approved optional modules. Tag unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`; do not silently promote either or invent unsupported content.
6. Self-check the draft against this definition of done and correct it without a separate verification pass.
7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Evidence concisely names the source and repository facts used and gives provenance only for material decisions or assumptions. Do not modify application source code or create another artifact.
