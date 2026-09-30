**Goal:** Inspect the source and repository, persist a resumable PRD drafting contract, and obtain one approval.

**Scope:** This task accepts unformatted notes, feedback, or an initiative brief; grounds it in available source and repository evidence; and confirms PRD mode and `<Subject> - Agile PRD`. It must not draft the document body, modify source code, or create another artifact.

**Verification / Definition of Done:**
- [ ] Unformatted input was accepted.
- [ ] The source and relevant repository evidence were inspected before any question.
- [ ] Source reference, subject, produced title, approved mode, and material assumptions and decisions were established.
- [ ] Provenance was recorded only for material decisions and assumptions.
- [ ] A title collision and any single-capability routing concern were resolved in the same approval preview.
- [ ] One preview showed only applicable provenance classes and did not force empty categories.
- [ ] The named Persisted handoff stores every field needed by a fresh drafting context.
- [ ] Agile Product Spec Template (`agile-sdlc-product-spec-template`) was present, or the task stopped with workspace setup required and named that title and slug.

**Instructions:**

1. Expose concise state while working: `inspecting` during discovery, `waiting` only for the single approval or one unresolved consequential decision, and `blocked` when a required workspace dependency is unavailable.
2. Accept the input as given. Notes, feedback, or an initiative brief are valid. Establish a durable source reference: an exact document title, ticket, commit, or supplied-input description. If no usable source exists, inspect first, then include the missing source in the single approval request.
3. Inspect the source and relevant repository files, manifests, tests, and existing specifications before asking. Infer a concise subject and `<Subject> - Agile PRD`; identify repository-observed constraints and reversible agent-inferred defaults.
4. Read "Agile Artifact Routing Guide" only when deciding whether PRD mode resolves actual initiative-level uncertainty. For a single bounded capability, recommend Product Spec Feature mode or the default Work Item route. Record the recommendation without creating another artifact.
5. Check whether the produced title exists and whether Agile Product Spec Template (slug `agile-sdlc-product-spec-template`) is available. Recommend update in place for a collision. If the template is unavailable, report `blocked` and name it.
6. Give provenance `user-stated`, `repository-observed`, `agent-inferred`, or `unresolved` only to material decisions and assumptions. Use `unresolved` only for a consequential choice that cannot be safely inferred. Preserve the proposed mode, title-collision disposition, assumptions, decisions, and any open decision.
7. Present one preview of at most six lines covering source, subject/title and mode, intended scope, applicable material decisions or assumptions with provenance, collision disposition when relevant, and next action. Omit provenance classes that have no material content. Set state to `waiting` and ask once for acknowledgement.
8. After acknowledgement, **Persisted handoff:** store status `approved`, source reference, subject, produced title, approved mode, collision disposition, and material assumptions and decisions with provenance. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state. If the user chooses a different route, finish without approval and state the chosen next action.
9. Do not draft the document body or modify source code.
