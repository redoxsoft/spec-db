**Goal:** Draft or update `<Subject> - Agile PRD` from the shared product spec template, then hand off in at most five lines.

**Scope:** This task writes the PRD in place from the confirmed brief, emphasizing initiative context, outcomes, supported scope, and success evidence. It must not invent requirements, personas, stakeholders, metrics, traceability, or an upstream artifact; modify application source code; start another pipeline; or continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] Approved status, source reference, subject, title, mode, assumptions, and decisions were reloaded from durable run state, and the task stopped when they were incomplete.
- [ ] `<Subject> - Agile PRD` was created or updated in place from Agile Product Spec Template (slug `agile-sdlc-product-spec-template`) in PRD mode, or the task stopped with workspace setup required and named that title and slug.
- [ ] When requirement quality needed external guidance, the mapped knowledge guide was read once.
- [ ] Unresolved items are tagged `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`. No requirement, metric, or schema was invented to fill the outline.
- [ ] Application source code was not modified, and no other pipeline was started.
- [ ] The handoff is at most five lines: outcome, decision needed, document written, evidence, and next action.
- [ ] The draft was self-checked against this definition of done.

**Instructions:**

1. Expose concise state while working: `drafting`, `waiting` for a newly discovered consequential decision, or `blocked` when a required dependency is unavailable.
2. Reload the Task 1 **Persisted handoff**: status, source reference, subject, produced title, approved mode, collision disposition, and material assumptions and decisions with provenance. Name every missing field and stop `blocked`; stop unless status is approved. Do not reconstruct state from conversation or re-ask an approved choice.
3. Create or update the stored produced title in place from Agile Product Spec Template using the approved mode. If the template is missing, report `blocked` and name its title and slug.
4. When the draft contains substantial requirements or acceptance criteria whose quality is not already established by the source, read "Agile Requirements Quality Guide" (`agile-sdlc-requirements-quality-guide`) once. Do not read the routing guide again or reference another spec.
5. Fill the template from the stored source and decisions. Emphasize context, intended outcomes, supported success evidence, scope, risks, dependencies, and open decisions. Record each material non-goal as an optional `Non-Goal` instance under `Scope and Requirements`; omit all such instances when none adds a useful boundary. Tag unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`; do not silently promote either. Omit irrelevant descendants and do not invent unsupported content.
6. Self-check the draft against this definition of done and correct it without a separate verification pass.
7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Evidence concisely names the source and repository facts used and gives provenance only for material decisions or assumptions. Do not modify application source code or create another artifact.
