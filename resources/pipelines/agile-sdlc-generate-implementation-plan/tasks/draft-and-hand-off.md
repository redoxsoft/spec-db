**Goal:** Draft or update `<Subject> - Agile Implementation Plan` from the shared delivery plan template, then hand off in at most five lines.

**Scope:** This task writes a repository-grounded plan in place: objective, scope, prerequisites, strategy, risks, execution increments, sufficient checks, recovery or rollback, and decisions. A dedicated scenario inventory is optional when increment checks are sufficient. It must not invent tasks, modify application source code, start another pipeline, or continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] Approved status, source reference, subject, title, mode, delivery boundary, assumptions, and decisions were reloaded from durable run state, and the task stopped when they were incomplete.
- [ ] `<Subject> - Agile Implementation Plan` was created or updated in place from Agile Delivery Plan Template (slug `agile-sdlc-delivery-plan-template`) in Implementation Plan mode, or the task stopped with workspace setup required and named that title and slug.
- [ ] When technical-plan quality needed external guidance, the mapped knowledge guide was read once.
- [ ] Step size uses only the single advisory sentence in the instructions.
- [ ] Unresolved items are tagged `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`. No requirement, metric, or schema was invented to fill the outline.
- [ ] Application source code was not modified, and no other pipeline was started.
- [ ] The handoff is at most five lines: outcome, decision needed, document written, evidence, and next action.
- [ ] The draft was self-checked against this definition of done.

**Instructions:**

1. Expose concise state while working: `drafting`, `waiting` for a newly discovered consequential decision, or `blocked` when a required dependency is unavailable.
2. Reload the Task 1 **Persisted handoff**: status, source reference, subject, produced title, approved mode, delivery boundary, collision disposition, and material assumptions and decisions with provenance. Name every missing field and stop `blocked`; stop unless status is approved. Do not reconstruct state from conversation or re-ask an approved choice.
3. Create or update the stored produced title in place from Agile Delivery Plan Template using Implementation Plan mode. If the template is missing, report `blocked` and name its title and slug.
4. When the plan follows architecture, schema, migration, or a published contract not sufficiently established by the source, read "Agile Technical Design Standards" (`agile-sdlc-tech-design-standards`) once. Do not reference another spec.
5. Fill the template from the stored source, delivery boundary, and decisions. Order increments by actual dependency, keep each increment coherent to implement and verify, and name repository-supported target areas and checks. Tag unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`; omit irrelevant descendants and do not invent unsupported content.
6. Self-check the draft against this definition of done and correct it without a separate verification pass.
7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Evidence concisely names the source and repository facts used and gives provenance only for material decisions or assumptions. Do not modify application source code or create another artifact.
