# Bug Analysis Guidelines

## Expected inputs <!-- key: expected-inputs -->

This spec governs diagnosis of a single defect. Apply it when authoring or reviewing a Bug Fix Spec. It does not design new architecture.

Use:

- the bug report, log excerpt, failing test, file, URL, or symptom description
- the expected behaviour from a spec or contract, if one exists
- a safe environment in which to reproduce

Never select an unrelated failure merely because it is visible.

If the report is missing, ask for symptoms rather than guessing the bug.

Route before diagnosing. A Bug Fix Spec is for unintended deviation from expected behaviour. If stakeholders want the contract changed, or expected behaviour is undefined, stop and apply `Work Intake & Artifact Selection Guide`: recommend `Change Request Builder` for a bounded amendment, or `Requirements → PRD` for a material capability change. Do not author a Bug Fix Spec for an intentional product change.

## Evidence standards <!-- key: evidence-standards -->

Separate observed fact, inference, and unknown. Label each claim as one of those three.

- Quote errors, log lines, or UI text you actually have. Do not paraphrase away the failing signal.
- Cite the spec or contract for expected behaviour. If none exists, state the expected behaviour as an assumption.
- Do not inflate impact you cannot observe. Name who is affected, how often, and with what severity from evidence.
- Discard coincidences that do not reproduce with the failing case.

Evidence that cannot be shown again is still evidence, but it cannot confirm a root cause by itself.

Do not treat a similar past incident as proof unless the same mechanism is shown here.

## Reproduction <!-- key: reproduction -->

Reproduce the bug before proposing a fix. Do not change production code to investigate.

A reproduction is valid only when a stranger can follow numbered steps from named preconditions and see the same failure.

If reproduction is not possible, say so explicitly and state why: missing environment, missing data, intermittent failure without a captured trigger, or access limits. Do not skip this statement.

Do not treat "works on my machine" or an unreproduced stack trace as a reproduction.

Reproduce in a safe environment; do not use production write paths to hunt for the failure.

## Root cause vs. hypothesis <!-- key: root-cause-vs-hypothesis -->

A **root cause** is a mechanism confirmed by evidence: the reproduction, a failing test, or a code path shown to produce the observed failure.

A **hypothesis** is an untested explanation. Record hypotheses as hypotheses. Never write a guess in the root-cause field.

- Confirm the cause by changing one variable, or by tracing the failure to a specific line, invariant, or data condition.
- If several causes remain possible, keep them as hypotheses until one is confirmed.
- If the cause is still unknown, say so and stop short of a fix strategy that pretends it is known.

Contributing factors are not the root cause. Record them separately.

A missing test explains why the bug shipped; it is not the mechanism that produced the failure.

## Fix strategy <!-- key: fix-strategy -->

Propose the smallest change that removes the confirmed cause. Do not expand into unrelated refactors, cleanups, or design work.

- Bound the files, contracts, and behaviours the fix may touch.
- Name side effects and how to revert if the fix fails.
- Do not implement a fix against a hypothesis. If only a hypothesis exists, the analysis is not done.
- Do not "fix" the bug by catching and hiding the error unless that is the confirmed cause.

Follow the Bug Fix Spec Template for structure; this spec governs what may be claimed inside it.

## Regression prevention <!-- key: regression-prevention -->

Require a regression test that would have caught this bug before release.

- The test must fail on the unfixed code and pass on the fix, or the analysis must say why an automated test cannot exist and what check replaces it.
- Name the missing test, review, or check that let the bug ship.
- Do not count a manual "try it again" as regression prevention unless automation is impossible and the reason is recorded.

This spec does not design a full test strategy. It only requires the one check that closes this defect's gap.

Do not close the regression gap with a test that asserts an unrelated passing path.

## Completion criteria <!-- key: completion-criteria -->

Analysis is done when observed versus expected behaviour is stated, a reproduction exists or impossibility is explained, the root cause is confirmed (not hypothesized), a bounded fix is proposed, and a regression test or explicit substitute is named.

Do not mark analysis complete while the cause is still a guess.
