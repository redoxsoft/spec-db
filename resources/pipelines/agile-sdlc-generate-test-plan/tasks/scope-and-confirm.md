**Goal:** Inspect the source and repository, persist a resumable Test Plan drafting contract, and obtain one approval.

**Scope:** This task accepts a brief, a feature spec, a tech spec, or a diff, infers the subject and the title `<Subject> - Agile Test Plan`, and notes the project's test command when a manifest shows one. It must not draft scenario text, write test code, modify source code, or start another pipeline.

**Verification / Definition of Done:**
- [ ] Unformatted input was accepted.
- [ ] The source and relevant repository evidence were inspected before any question.
- [ ] Source reference, subject, title, Test Plan mode, coverage boundary, assumptions, and decisions were established.
- [ ] Provenance was recorded only for material decisions and assumptions.
- [ ] A title collision was resolved in the same approval preview.
- [ ] One preview showed only applicable provenance classes and did not force empty categories.
- [ ] The named Persisted handoff stores every field needed by a fresh drafting context.
- [ ] Agile Delivery Plan Template (`agile-sdlc-delivery-plan-template`) was present, or the task stopped with workspace setup required and named that title and slug.

**Instructions:**

1. Expose concise state while working: `inspecting` during discovery, `waiting` only for the single approval or one unresolved consequential decision, and `blocked` when a required workspace dependency is unavailable.
2. Accept the input as given and establish a durable source reference: an exact document title, diff/commit, ticket, or supplied-input description.
3. Inspect the source and relevant repository manifests, test configuration, suites, environments, fixtures, and existing acceptance criteria before asking. Infer a concise subject and `<Subject> - Agile Test Plan`; preserve criteria only when evidenced.
4. Define the proposed Test Plan coverage boundary and repository-supported commands without drafting scenarios. Check the title collision and Agile Delivery Plan Template availability; recommend update in place for a collision and report `blocked` if the template is unavailable.
5. Give provenance `user-stated`, `repository-observed`, `agent-inferred`, or `unresolved` only to material decisions and assumptions. Preserve approved mode, coverage boundary, collision disposition, assumptions, decisions, and any open decision.
6. Present one preview of at most six lines covering source, subject/title and mode, coverage boundary, applicable material decisions or assumptions with provenance, collision disposition when relevant, and next action. Omit provenance classes with no material content. Set state to `waiting` and ask once for acknowledgement.
7. After acknowledgement, **Persisted handoff:** store status `approved`, source reference, subject, produced title, approved mode, coverage boundary, collision disposition, and material assumptions and decisions with provenance. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state.
8. Do not draft scenario text or modify source code or tests.
