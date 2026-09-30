**Goal:** Complete an empty boundary as not applicable, or confirm and persist a non-empty diff boundary before review.

**Scope:** This task accepts a branch, a commit range, a pull request, or a working tree diff. An empty diff completes immediately as `done` / `not-applicable` without approval or a Findings document. For a non-empty diff, it identifies the governing Work Item by title when one exists and locks that boundary in one preview. It must not evaluate the diff, edit a file, stage, commit, push, or start another pipeline.

**Verification / Definition of Done:**
- [ ] A branch, commit range, pull request, or working tree diff was accepted.
- [ ] An empty diff completed the review run as done/not-applicable without approval or a Findings document.
- [ ] For a non-empty diff, the governing Work Item was recorded by title only when one existed, and none was invented when it did not.
- [ ] For a non-empty diff, one exact revision manifest for the reviewed boundary was resolved and persisted.
- [ ] An explicitly supplied Delivery Record title/reference was preserved first; inference occurred only when none was supplied, and ambiguity requested one selection without creating a duplicate.
- [ ] For a non-empty diff, one preview gave provenance only for material assumptions or decisions and omitted empty classes.
- [ ] For a non-empty diff, the named Persisted handoff stores every field required by the evaluation task.
- [ ] No file was edited, staged, committed, or pushed.

**Instructions:**

1. Expose concise state while working: `inspecting`, `waiting` for the single approval, or `blocked` when the boundary cannot be read.
2. Accept a branch, a commit range, a pull request, or a working tree diff. Treat the exact boundary as the durable source reference.
3. Inspect the boundary and relevant repository context before asking. If it contains no changes, complete the review run as `done` with reason `not-applicable: the selected boundary contains no changes`; do not ask for approval, persist an approved evaluation, create or update a Findings document, or continue to the evaluation task.
4. Create the reviewed revision manifest with a stable revision id and full base commit SHA. A clean revision has no boundary entries and represents that exact commit. For a dirty revision, treat the base SHA as ancestry context and persist entries sorted by repository-relative path for every path changed or untracked inside the reviewed permitted boundary relative to that base: path plus SHA-256 of regular-file bytes, SHA-256 of symlink target bytes, `gitlink:<commit>` for a submodule, or `MISSING`. Ensure no changed path in that boundary is absent; optionally describe the boundary, do not compute an aggregate hash, and do not auto-commit.
5. Identify the governing Work Item if one exists and infer the subject and findings title. If a Delivery Record title/reference was explicitly supplied, resolve and preserve it exactly. Only when none was supplied may `<Subject> - Agile Delivery Record` be inferred; if several candidates match, request one selection and never create or silently choose a duplicate. The record is an optional one-way link only; Review never mutates it.
6. Record provenance only for material assumptions or decisions. Present one preview of at most six lines with source boundary/title, revision id, material scope facts or decisions, artifact, and next action. Wait for one acknowledgement.
7. **Persisted handoff:** store status `approved`, explicit non-empty boundary state, source boundary description, revision id and complete manifest, governing Work Item title when one exists, subject, findings title, optional exact Delivery Record title, and material assumptions or decisions. This is the complete Task 1-to-Task 2 state; `inputVarDefinitions` remain empty because they are caller hints, not internal state.
8. Do not evaluate or edit the diff, stage, commit, or push.
