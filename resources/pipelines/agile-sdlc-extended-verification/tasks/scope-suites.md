**Goal:** Select long suites for one exact Delivery Record Target Revision manifest and persist a complete fresh-context handoff.

**Scope:** This task locates one Delivery Record, verifies a selected Target Revision manifest, reads prior suite history, and selects existing end-to-end, performance, or long integration suites. It must not invent or run a suite, waive missing required verification, edit source or tests, stage, commit, push, or start another pipeline.

**Verification / Definition of Done:**
- [ ] An explicitly supplied Delivery Record title/reference was used first; `<Subject> - Agile Delivery Record` was inferred only when none was supplied, and ambiguity requested one selection without creating a duplicate.
- [ ] The selected revision satisfied its persisted manifest semantics; boundary drift stopped blocked without guessing.
- [ ] Prior required suite events in the selected revision lineage were compared with suites currently available.
- [ ] A previously required but unavailable suite completed blocked and named the suite; a clean no-suite case remained done/not-applicable.
- [ ] Runnable suites were approved once, or clean no-suite mode continued informationally without an unnecessary decision; both stored the same complete Persisted handoff.
- [ ] No source or test file was edited, and nothing was staged, committed, or pushed.

**Instructions:**

1. Expose concise state: `inspecting`, `waiting` only when runnable suites require selection approval, or `blocked`.
2. If the user supplied a Delivery Record title or durable reference, resolve it exactly and persist that exact title. Only when none was supplied, infer the subject and `<Subject> - Agile Delivery Record`. If more than one candidate matches, ask for one selection; if none exists, stop `blocked` and name the missing record. Never create or silently choose a duplicate. Read the governing Work Item when linked; otherwise retain the originating request reference when present.
3. Read the selected Delivery Record before deciding suite applicability. Select one stored revision id and its manifest; if several revisions are present and none was explicitly selected, ask once which revision to use.
4. Validate the selected revision under its persisted manifest semantics; boundary drift is `blocked`, unrelated outside-boundary changes are ignored, and nothing is checked out or auto-committed.
5. For the selected revision lineage, collect prior long-suite events marked `required`, including event id, command, criteria, result, and resolution links. Find currently available end-to-end, performance, and long integration suites, with exact commands, required/optional status, and covered criteria. Read "Agile Test Strategy Guide" once only when repository evidence does not establish suite selection.
6. If any previously required suite for this revision is unavailable, complete `blocked` and name each missing suite and prior event id. Do not ask for an exception and do not append a not-applicable or resolution event. Otherwise choose completion mode `run-suites` or `clean-no-suite`; the latter applies only when no current or prior required suite exists.
7. Present one concise preview with the exact record title/revision id, selected suites and criteria or no-suite reason, material assumptions or decisions only, and next action. Wait for one acknowledgement only for `run-suites`; for `clean-no-suite`, continue informationally without asking for a decision.
8. **Persisted handoff:** store status `approved`, source references, exact Delivery Record title, subject, Governing Work Item title or originating request reference when present, selected revision id and complete manifest, acceptance criteria, completion mode, current suites (an explicit empty list for clean-no-suite), prior required events (an explicit empty list when none), and material assumptions or decisions. This exact block is required by Task 2; `inputVarDefinitions` remain empty because they are caller hints, not internal state.
9. Do not run suites or mutate the repository.
