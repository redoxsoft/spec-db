**Goal:** Prove coverage mechanically, correct what the findings justify, set the document status, and report a fixed summary.

**Scope:** Verify the feature list against the requirement inventory and the PRD, apply corrections the findings justify, and report. Do not introduce new scope while remediating.

**Definition of Done:** The checks have been run; Blocking and Major findings are resolved without inventing PRD text; status is `FINAL` unless a committed requirement is still missing or a heading still has no home; the completion summary has been printed verbatim.

**Actions:**

- Run the mechanical and judgement checks in SpecX spec `PRD to Feature List Rules`, section Verification checklist. Report offending headings or feature names, not a judgement. The dense-section read against the extraction inventory is a Major finding when a heading's requirements collapsed into one thin feature.

- Assign Blocking, Major, or Minor. Resolve all Blocking and Major findings. Apply Minor findings only when the correction introduces no new scope. Convert underspecification into an assumption with a chosen reading, not an open question.

- Re-run the six mechanical checks after any remediation.

- Set Status in Document Control to `FINAL` when no Blocking or Major finding remains. Use `BLOCKED` only when a committed PRD requirement is missing, a feature has no PRD evidence, or a heading has no home. Do not block because the PRD left details unstated. Bump the revision marker.

- Print the completion summary using exactly the template below. Fill every angle-bracket slot. Do not reword the labels, do not reorder the lines, do not add commentary before or after it, and do not summarise the run in your own words instead.

```text
FEATURE LIST GENERATION - COMPLETE
Source PRD:     <resolved SpecX title or file path>
Subject:        <derived subject name>
Coverage basis: whole PRD, <n> of <n> headings cited

Artifact:
  <Subject> - Feature List (SpecX)
  Estimation-ready module and feature breakdown, traced to PRD sections.
  Effort columns BE / FE / AI / UX / QA intentionally blank.

Contents:  <n> modules, <n> features, <n> assumptions, <n> dependencies,
           <n> out of scope, <n> open questions
Findings:  <n> blocking, <n> major, <n> minor unresolved
Status:    FINAL | BLOCKED
Next step: <fill the effort columns | resolve the listed blocking findings>
```

- Say nothing beyond this block except a direct answer to a question the user asks.

**Hard stops:** Never report `FINAL` while a Blocking or Major finding is unresolved. Never report `BLOCKED` because the PRD left a detail unstated — record an assumption instead. Never report `FINAL` if an open question asks which slice of the PRD to deliver first — remove that question; the whole PRD stays in scope. Never claim a check passed unless it was actually run. Never report a heading count on the `Coverage basis` line that the checks did not actually produce.
