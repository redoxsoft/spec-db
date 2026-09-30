**Goal:** Run the agreed long suites against one unchanged Target Revision manifest and append truthful evidence.

**Scope:** This task reloads the Task 1 Persisted handoff, rechecks the selected revision manifest, runs the selected suites or records a clean no-suite result, and appends immutable evidence referencing that revision id. It must not edit source or tests, stage, commit, push, claim an unobserved pass, change implementation outcome, or waive unavailable required verification.

**Verification / Definition of Done:**
- [ ] Every field in the Task 1 Persisted handoff was reloaded without inference; exact missing fields stopped blocked.
- [ ] The selected revision satisfied its persisted manifest semantics before suites ran and again before evidence was appended.
- [ ] Each agreed suite ran with exact command, exit code, and useful counts, or a clean no-suite case recorded not-applicable.
- [ ] A missing previously required suite completed blocked with its name; a suite failure completed failed.
- [ ] Evidence was appended with minimum dependable fields, and later passing evidence linked any prior failed event it resolved.
- [ ] Source and tests were not edited; nothing was staged, committed, or pushed; implementation outcome was unchanged.

**Instructions:**

1. Expose concise state: `verifying`, `recording`, or `blocked`.
2. Reload the Task 1 **Persisted handoff** exactly: approved status, source references, subject, exact Delivery Record title, Governing Work Item or originating request when present, selected revision id and complete manifest, acceptance criteria, completion mode, current suites, prior required events, and material assumptions or decisions. Name every missing field and stop `blocked`; never reconstruct it from conversation.
3. Validate the selected revision under its persisted manifest semantics; boundary drift is `blocked`, unrelated outside-boundary changes are ignored, and nothing is auto-committed. Re-read the stored Delivery Record and confirm the selected manifest and prior-event state still exist.
4. For `run-suites`, confirm every selected required suite is still available before running any suite. If one became unavailable between tasks, complete `blocked` as environment unavailable, name it, and append no event or fake evidence. Otherwise run each agreed exact command against the unchanged revision without editing source or tests. Preserve exit code, useful counts or concise observation, covered criteria, artifact pointer, and material limitations. A suite failure is `failed`. For `clean-no-suite`, append one `not-applicable` event and complete `done`.
5. Before recording, apply the persisted-manifest validation from step 3 again. If the selected manifest is dirty and current HEAD is a descendant commit containing exactly its manifested boundary state with no uncommitted boundary drift, this optional pipeline may first append a new clean manifest for the current full SHA with a new revision id and `Derived From Revision ID` pointing to the selected dirty revision; never overwrite the original. Append immutable source `extended-verification` evidence to the exact record title with event id, source, date, the new clean revision id when that bridge was added or otherwise the selected revision id, exact command/action, result, and result details plus applicable criteria, requirement, prior failed-event links, artifact pointer, or limitations. A later pass resolves a prior required failure only when it links that event within the same revision lineage. Never duplicate a manifest, create another record, or fake a resolution.
6. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action, identifying the evidence revision id.
