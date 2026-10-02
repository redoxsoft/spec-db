# Agile Defect Diagnosis Guide

## Defect Diagnosis <!-- key: defect-diagnosis -->

A defect is observed behavior that deviates from behavior that was already expected. Diagnosis finds the mechanism that produces the failure before a fix is chosen, so the fix removes the cause instead of hiding the symptom.

### Confirm It Is a Defect <!-- key: classification -->

- A defect has an established expectation: a spec, contract, test, documentation, or clearly established prior behavior. Observed behavior differs from it.
- When the expected behavior is undefined, or the request is to change behavior people rely on, the work is a change, not a defect.
- The defect is the failure that was reported. A different failure that happens to be visible is not substituted for it.

### Evidence <!-- key: evidence -->

- Quote the actual error, log line, status, or UI text. A paraphrase that loses the failing signal is not evidence.
- Name the source of the expected behavior. When none exists, state the expectation as an assumption.
- State impact only as far as evidence shows it: who is affected, how often, and how severely.
- A similar past incident is not proof unless the same mechanism is shown here.

### Reproduction <!-- key: reproduction -->

- Reproduce the failure before changing production code. A reproduction is a set of numbered steps from named preconditions that another person can follow to see the same failure. A failing automated test is the strongest form.
- Reproduce in a local or test environment, never through production write paths.
- When reproduction is not possible, state why: missing environment or data, an intermittent failure with no captured trigger, or missing access. An unreproduced stack trace or "works on my machine" is not a reproduction.

### Root Cause and Hypothesis <!-- key: root-cause -->

- A root cause is a mechanism confirmed by evidence: a reproduction, a failing test, or a traced code path, invariant, or data condition that produces the observed failure.
- Any other explanation is tagged `! [HYPOTHESIS]`. Competing explanations stay hypotheses until one is confirmed, for example by changing one variable at a time.
- Contributing factors are recorded separately from the cause. A missing test explains why the defect shipped; it is not the mechanism that produced it.

### Fix <!-- key: fix -->

- Fix the confirmed cause with the smallest change that removes it. Unrelated cleanup and refactoring stay out of the fix.
- A fix is not built on a hypothesis. When the cause cannot be confirmed, the result says so rather than presenting a speculative change as the fix.
- Catching, suppressing, or hiding the error is not a fix unless that is the confirmed correct behavior.

### Regression Check <!-- key: regression-check -->

- Add a check that fails on the unfixed code and passes after the fix. Run it before the fix to show that it fails.
- When no automated check can exist, record why, and the concrete manual observation that replaces it.
- Name the missing test, review, or check that let the defect ship.
- A check that passes on the unfixed code does not prove the fix.
