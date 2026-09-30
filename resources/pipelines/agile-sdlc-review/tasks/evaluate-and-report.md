**Goal:** Evaluate the approved diff and write `<Subject> - Agile Review Findings`.

**Scope:** This task runs only for a persisted, approved, non-empty diff, consults the code review guide as a checklist, and creates or updates the findings document. An empty diff has already completed as done/not-applicable in the scope task and does not reach this task. This task must not edit application source, tests, or living specification documents, must not stage, commit, or push, and must not continue when this run is not approved.

**Verification / Definition of Done:**
- [ ] Status was loaded from SpecX run context for this run, and the task stopped unless it was approved.
- [ ] The persisted boundary was non-empty; no Findings document was created for an empty boundary.
- [ ] The mapped review guide was consulted once as a checklist, without creating a report section for each checklist item.
- [ ] `<Subject> - Agile Review Findings` was created or updated in place from Agile Review Findings Template (slug `agile-sdlc-review-findings-template`), or the task stopped with workspace setup required and named that title and slug.
- [ ] Every finding uses severity blocking or non-blocking and contains a generic actionable location, concrete evidence, impact, and recommendation.
- [ ] When there are zero findings, only a concise non-blocking verdict says that this is a pass; no empty section or placeholder was added.
- [ ] No file was edited except the findings document. Nothing was staged, committed, or pushed, and no other pipeline was started.
- [ ] Once findings were written, the review-run outcome is done even when the verdict is blocking.
- [ ] The handoff is at most five lines. Its next action says a later Agile Implement run should receive the findings title as intake and that this review does not start it.

**Instructions:**

1. Expose concise state while working: `evaluating`, `reporting`, or `blocked` when the approved boundary cannot be read.
2. Reload the Task 1 **Persisted handoff**: approved status, explicit non-empty boundary state, source boundary, revision id and complete manifest, optional governing Work Item title, subject, findings title, optional exact Delivery Record title, and material assumptions or decisions. Name every missing required field and stop `blocked`; do not reconstruct state from conversation. If an empty boundary reaches this task, complete as `done` / `not-applicable` without creating or updating a Findings document.
3. Validate the selected revision under its persisted manifest semantics; boundary drift is `blocked`, unrelated outside-boundary changes are ignored, and nothing is auto-committed. Consult "Agile Code Review Guide" once while reading the approved boundary.
4. Create or update the stored findings title in place from Agile Review Findings Template. If the template is missing, report `blocked` and name it.
5. Record date, persisted revision manifest, source boundary, and optional reviewer, Governing Work Item, and Delivery Record link when known. Omit unknown optional values rather than inventing placeholders. Do not mutate the Delivery Record.
6. Under `Verdict`, record each optional finding with severity blocking or non-blocking, precise location, concrete evidence, impact, and recommendation, and each optional note only when it is a useful observation rather than a finding. Do not report unenforced style preferences or paste raw output.
7. Write the verdict in one or two sentences. Represent zero findings only with a concise non-blocking pass verdict; add no finding or note instance, empty section, or `none` placeholder. Once findings are truthfully written, the review-run outcome is `done` even when the verdict is blocking.
8. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Evidence identifies the revision id and boundary; the next action may say a later Implement run can use the findings title as intake.
9. Write only the findings document. Do not edit source, tests, living specifications, or any other document; stage, commit, push, or run suites.
