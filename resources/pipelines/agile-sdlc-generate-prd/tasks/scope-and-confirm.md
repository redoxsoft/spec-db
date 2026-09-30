**Goal:** Inspect the source and repository, persist a resumable PRD drafting contract, and obtain one approval.

**Scope:** This task accepts unformatted notes, feedback, or an initiative brief; grounds it in available source and repository evidence; and confirms PRD mode and `<Subject> - Agile PRD`. It must not draft the document body, modify source code, or create another artifact.

**Verification / Definition of Done:**
- [ ] Unformatted input was accepted.
- [ ] The source and relevant repository evidence were inspected before any question.
- [ ] Source reference, subject, produced title, approved mode, and material assumptions and decisions were established.
- [ ] Provenance was recorded only for material decisions and assumptions.
- [ ] Artifact identity, a title collision, any single-capability routing concern, and any placement advisory were resolved in the same approval preview without listing folder contents.
- [ ] Existing artifacts keep their exact current folder; new PRDs use a valid create-only override or the flat `Project Work/Initiatives` default outside the protected imported collection.
- [ ] One preview showed only applicable provenance classes and did not force empty categories.
- [ ] The named Persisted handoff stores the exact artifact reference, canonical `folderId`, informational `folderPath`, and every other field needed by a fresh drafting context.
- [ ] Agile Product Spec Template (`agile-sdlc-product-spec-template`) was present, or the task stopped with workspace setup required and named that title and slug.

**Instructions:**

1. Expose concise state while working: `inspecting` during discovery, `waiting` only for the single approval or one unresolved consequential decision, and `blocked` when a required workspace dependency is unavailable.
2. Accept the input as given. Notes, feedback, or an initiative brief are valid. Accept an explicitly supplied destination-folder override as a create-only hint. Establish a durable source reference: an exact document title, ticket, commit, or supplied-input description. If no usable source exists, inspect first, then include the missing source in the single approval request.
3. Inspect the source and relevant repository files, manifests, tests, and existing specifications before asking. Infer a concise subject and `<Subject> - Agile PRD`; identify repository-observed constraints and reversible agent-inferred defaults.
4. Read "Agile Artifact Routing Guide" only when deciding whether PRD mode resolves actual initiative-level uncertainty. For a single bounded capability, recommend Product Spec Feature mode or the default Work Item route. Record the recommendation without creating another artifact.
5. Resolve artifact identity without browsing folders: use a supplied artifact id first, otherwise exact-title or explicit-reference lookup. If one artifact exists, read its cheap folder property and preserve its exact current `folderId` and informational `folderPath`, even at workspace root, under the imported collection, or in an unconventional location; defaults and overrides never move an existing artifact. Ignore a supplied override on this update and include a concise advisory. If several exact matches exist, include one identity selection in the approval gate. Do not use folder-content listing to find or disambiguate artifacts.
6. For a new PRD, resolve placement once. Use a valid explicit override when supplied; otherwise ensure and use `Project Work/Initiatives`, with the PRD directly in `Initiatives` and no per-PRD folder. Determine protected imported-collection ancestry from imported-resource metadata and the folder hierarchy, never a folder name. If an override is in that protected tree, reject it and use the default with one concise advisory. Fetch hierarchy only to check ancestry or ensure this known path; never list folder contents. Treat `folderId` as write authority and `folderPath` as informational. Do not assume workspace configuration or create a placement enum.
7. Check Agile Product Spec Template availability. If it is unavailable, report `blocked` and name its title and slug. Give provenance `user-stated`, `repository-observed`, `agent-inferred`, or `unresolved` only to material decisions and assumptions. Use `unresolved` only for a consequential choice that cannot be safely inferred.
8. Present one preview of at most six lines covering source, subject/title and mode, intended scope, exact update or create destination, applicable material decisions or assumptions with provenance, any collision or placement advisory, and next action. Omit inapplicable details. Set state to `waiting` and ask once for acknowledgement.
9. After acknowledgement, **Persisted handoff:** store status `approved`, source reference, subject, produced title, approved mode, exact artifact id/reference when one exists, collision disposition, operation (`create` or `update`), canonical `folderId`, informational `folderPath`, any concise placement advisory, and material assumptions and decisions with provenance. This is the only placement resolution and the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state. If the user chooses a different route, finish without approval and state the chosen next action.
10. Do not draft the document body or modify source code.
