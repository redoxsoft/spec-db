**Goal:** Inspect the source and repository, persist a resumable technical-design drafting contract, and obtain one approval.

**Scope:** This task accepts engineering notes, a feature spec, a PRD, or a tech-debt description, infers the subject and the title `<Subject> - Agile Tech Spec`, and inspects the workspace enough to ground that choice. It must not draft the document body, modify source code, or start another pipeline.

**Verification / Definition of Done:**
- [ ] Unformatted input was accepted.
- [ ] The source and relevant repository evidence were inspected before any question.
- [ ] Source reference, subject, title, Technical Design mode, applicable modules, assumptions, and decisions were established.
- [ ] Provenance was recorded only for material decisions and assumptions.
- [ ] A title collision was resolved in the same approval preview.
- [ ] One preview showed only applicable provenance classes and did not force empty categories.
- [ ] The named Persisted handoff stores every field needed by a fresh drafting context.
- [ ] Agile Technical Design Template (`agile-sdlc-technical-design-template`) was present, or the task stopped with workspace setup required and named that title and slug.

**Instructions:**

1. Expose concise state while working: `inspecting` during discovery, `waiting` only for the single approval or one unresolved consequential decision, and `blocked` when a required workspace dependency is unavailable.
2. Accept the input as given and establish a durable source reference: an exact document title, ticket, commit, or supplied-input description.
3. Inspect the source and relevant repository language, manifests, directory shape, tests, interfaces, data tools, and existing design decisions before asking. Infer a concise subject and `<Subject> - Agile Tech Spec`; preserve upstream behaviors and acceptance criteria only when evidenced.
4. Determine which optional modules are relevant: API or interfaces, data, migration, security, operations, rollout, and rollback. Check the produced-title collision and Agile Technical Design Template availability; recommend update in place for a collision and report `blocked` if the template is unavailable.
5. Give provenance `user-stated`, `repository-observed`, `agent-inferred`, or `unresolved` only to material decisions and assumptions. Preserve Technical Design mode, applicable modules, collision disposition, assumptions, decisions, and any open decision.
6. Present one preview of at most six lines covering source, subject/title and mode, intended boundaries/modules, applicable material decisions or assumptions with provenance, collision disposition when relevant, and next action. Omit provenance classes with no material content. Set state to `waiting` and ask once for acknowledgement.
7. After acknowledgement, **Persisted handoff:** store status `approved`, source reference, subject, produced title, approved mode, applicable modules, collision disposition, and material assumptions and decisions with provenance. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state.
8. Do not draft the document body or modify source code.
