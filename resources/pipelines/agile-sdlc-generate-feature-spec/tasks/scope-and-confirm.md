**Goal:** Inspect the source and repository, persist a resumable feature-spec drafting contract, and obtain one approval.

**Scope:** This task accepts unformatted notes, a ticket, a user story, or a product-spec excerpt; grounds it in available source and repository evidence; and confirms Feature mode, title, and any proposed split. It must not draft the document body, modify source code, or create another artifact.

**Verification / Definition of Done:**
- [ ] Unformatted input was accepted.
- [ ] The source and relevant repository evidence were inspected before any question.
- [ ] Source reference, subject, produced title, approved mode, and material assumptions and decisions were established.
- [ ] Provenance was recorded only for material decisions and assumptions.
- [ ] A title collision and any proposed split were resolved in the same approval preview.
- [ ] One preview showed only applicable provenance classes and did not force empty categories.
- [ ] The named Persisted handoff stores every field needed by a fresh drafting context.
- [ ] Agile Product Spec Template (`agile-sdlc-product-spec-template`) was present, or the task stopped with workspace setup required and named that title and slug.

**Instructions:**

1. Expose concise state while working: `inspecting` during discovery, `waiting` only for the single approval or one unresolved consequential decision, and `blocked` when a required workspace dependency is unavailable.
2. Accept the input as given and establish a durable source reference: an exact document title, ticket, commit, or supplied-input description. Inspect the source and relevant repository files, manifests, tests, and existing specifications before asking.
3. Infer a concise subject and `<Subject> - Agile Feature Spec`. Read "Agile Artifact Routing Guide" only when deciding whether Product Spec Feature mode resolves actual behavioral uncertainty or whether the default Work Item route is sufficient.
4. If the brief bundles independently deliverable capabilities, propose subjects and boundaries only when separate documents would clarify the work. Preserve the unsplit brief unless the proposal is approved. Do not silently impose a split.
5. Check title collisions and Agile Product Spec Template availability. Recommend update in place for a collision. If the template is unavailable, report `blocked` and name it.
6. Give provenance `user-stated`, `repository-observed`, `agent-inferred`, or `unresolved` only to material decisions and assumptions. Preserve proposed mode, split disposition, title-collision disposition, assumptions, decisions, and any open decision.
7. Present one preview of at most six lines covering source, subject/title and mode or split, intended scope, applicable material decisions or assumptions with provenance, dispositions when relevant, and next action. Omit provenance classes with no material content. Set state to `waiting` and ask once for acknowledgement.
8. After acknowledgement, **Persisted handoff:** store status `approved`, source reference, each accepted subject and produced title, approved mode, split disposition, collision disposition, and material assumptions and decisions with provenance. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state. If the user chooses the default Work Item route, finish without approval and state that next action.
9. Do not draft the document body or modify source code.
