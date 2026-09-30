**Goal:** Evaluate the approved diff and write `<Subject> - Agile Review Findings`.

**Scope:** This task runs only for a persisted, approved, non-empty diff, consults the code review guide, and writes the Findings document from persisted placement. It must not recompute placement, relocate an artifact, edit application source, tests, or living specifications, stage, commit, push, or continue when unapproved.

**Verification / Definition of Done:**
- [ ] Status was loaded from SpecX run context for this run, and the task stopped unless it was approved.
- [ ] The persisted boundary was non-empty; no Findings document was created for an empty boundary.
- [ ] The mapped review guide was consulted once as a checklist, without creating a report section for each checklist item.
- [ ] Findings was updated by id in its current folder or created from Agile Review Findings Template at the persisted destination, re-ensuring only its exact path if the folder id vanished.
- [ ] Every finding uses severity blocking or non-blocking and contains a generic actionable location, concrete evidence, impact, and recommendation.
- [ ] When there are zero findings, only a concise non-blocking verdict says that this is a pass; no empty section or placeholder was added.
- [ ] No file was edited except the findings document. Nothing was staged, committed, or pushed, and no other pipeline was started.
- [ ] Once findings were written, the review-run outcome is done even when the verdict is blocking.
- [ ] The handoff is at most five lines. Its next action says a later Agile Implement run should receive the findings title as intake and that this review does not start it.

**Instructions:**

1. Expose concise state while working: `evaluating`, `reporting`, or `blocked` when the approved boundary cannot be read.
2. Reload the complete Task 1 **Persisted handoff**, including the Findings placement and exact related-artifact references. Name every missing required field and stop `blocked`; do not reconstruct state from conversation. If an empty boundary reaches this task, complete as `done` / `not-applicable` without writing Findings.
3. Validate the selected revision under its persisted manifest semantics; boundary drift is `blocked`, unrelated outside-boundary changes are ignored, and nothing is auto-committed. Consult "Agile Code Review Guide" once while reading the approved boundary.
4. Load the persisted Findings placement only; never recompute, list folders, or relocate. For `update`, reread by artifact id and write in its current folder, advising if its path changed. For `create`, use `folderId`; if it vanished, re-ensure only the exact persisted `folderPath`, blocking if that path or the template cannot be made available.
5. Record date, persisted revision manifest, source boundary, and optional reviewer, Governing Work Item, and Delivery Record link from their persisted exact references when known. Omit unknown optional values rather than inventing placeholders. Do not mutate the Delivery Record.
6. Under `Verdict`, record each optional finding with severity blocking or non-blocking, precise location, concrete evidence, impact, and recommendation, and each optional note only when it is a useful observation rather than a finding. Do not report unenforced style preferences or paste raw output.
7. Write the verdict in one or two sentences. Represent zero findings only with a concise non-blocking pass verdict; add no finding or note instance, empty section, or `none` placeholder. Once findings are truthfully written, the review-run outcome is `done` even when the verdict is blocking.
8. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Artifact includes the exact Findings document and informational folder path plus a persisted placement advisory only when present. Evidence identifies the revision id and boundary; the next action may say a later Implement run can use the findings title as intake.
9. Write only the findings document. Do not edit source, tests, living specifications, or any other document; stage, commit, push, or run suites.
