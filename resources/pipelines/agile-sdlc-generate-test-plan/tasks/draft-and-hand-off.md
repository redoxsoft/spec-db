**Goal:** Draft or update `<Subject> - Agile Test Plan` from the shared delivery plan template, then hand off in at most five lines.

**Scope:** This task writes a repository-grounded verification strategy, risks, scenarios, environment, data, recovery considerations, and decisions from the confirmed brief. Execution increments are optional in this mode. Concrete assertions live in code, not in the plan. It must not invent scenarios, modify application source code or tests, start another pipeline, or continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] Approved status, source reference, subject, title, mode, coverage boundary, assumptions, and decisions were reloaded from durable run state, and the task stopped when they were incomplete.
- [ ] `<Subject> - Agile Test Plan` was created or updated in place from Agile Delivery Plan Template (slug `agile-sdlc-delivery-plan-template`) in Test Plan mode, or the task stopped with workspace setup required and named that title and slug.
- [ ] When test-strategy quality needed external guidance, the mapped knowledge guide was read once.
- [ ] The plan states strategy and scenarios. Concrete assertions and mocks are absent from the plan.
- [ ] Unresolved items are tagged `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`. No requirement, metric, or schema was invented to fill the outline.
- [ ] Application source code and tests were not modified, and no other pipeline was started.
- [ ] The handoff is at most five lines: outcome, decision needed, document written, evidence, and next action.
- [ ] The draft was self-checked against this definition of done.

**Instructions:**

1. Expose concise state while working: `drafting`, `waiting` for a newly discovered consequential decision, or `blocked` when a required dependency is unavailable.
2. Reload the Task 1 **Persisted handoff**: status, source reference, subject, produced title, approved mode, coverage boundary, collision disposition, and material assumptions and decisions with provenance. Name every missing field and stop `blocked`; stop unless status is approved. Do not reconstruct state from conversation or re-ask an approved choice.
3. Create or update the stored produced title in place from Agile Delivery Plan Template using Test Plan mode. If the template is missing, report `blocked` and name its title and slug.
4. When test levels or risk-based coverage are not already established by the source and repository, read "Agile Test Strategy Guide" (`agile-sdlc-test-strategy-guide`) once. Do not reference another spec.
5. Fill the template from the stored source, coverage boundary, and decisions. State the objective, scope, prerequisites, strategy, risks, and useful scenarios. Name repository-supported commands, environments, and synthetic fixtures where established. Concrete assertions remain outside the plan. Tag unresolved items `? [NEEDS_INPUT]` and proposals `* [PROPOSAL]`; omit irrelevant descendants and do not invent unsupported content.
6. Self-check the draft against this definition of done and correct it without a separate verification pass.
7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Evidence concisely names the source and repository facts used and gives provenance only for material decisions or assumptions. Do not modify application source code or tests or create another artifact.
