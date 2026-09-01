**Goal:** Prove coverage mechanically, correct what the findings justify, set the document status, and report a fixed summary.

**Scope:** Verify the feature list against the requirement inventory and the PRD, apply corrections the findings justify, and report. Do not introduce new scope while remediating.

**Definition of Done:**
- The six mechanical checks have been run, and re-run after any change.
- Every Blocking and Major finding is resolved, or listed in the document with the reason it could not be.
- Document status is set to `FINAL` or `BLOCKED`.
- The completion summary has been printed verbatim in the required format.

**Actions:**

- Run these mechanical checks from the SpecX spec `PRD to Feature List Rules`, section Verification checklist. Each is objective — report the actual offending headings or feature names, not a judgement:
  1. Every heading in the PRD outline appears in at least one citation somewhere in the feature list.
  2. Every feature cites at least one PRD section, and every cited section exists in the PRD.
  3. Feature names are unique within a module.
  4. Every section holds at most one table, and no table exceeds 29 data rows, 10 columns, or 400 characters in a cell.
  5. No effort cell contains a number, including zero.
  6. Every Out of Scope row quotes the PRD wording that makes it optional or deferred, or names the person who excluded it.

- Check 1 is coverage at section granularity, so it can pass while a dense section is under-covered. Close that gap by hand: take the requirement inventory from the extraction step and read it against the rows citing each heading. A section that yielded four requirements but one thin feature is a Major finding.

- Then apply the judgement checks from the same section, covering module fit, vague or over-combined rows, over-fragmentation, AI chain completeness including human control, cross-cutting coverage, and duplicates.

- Assign every finding a severity of Blocking, Major, or Minor, and cite the PRD section or feature name it concerns.

- Resolve all Blocking and Major findings. Apply Minor findings only when the correction introduces no new scope. When a finding cannot be resolved without a human decision, convert it into an open question rather than guessing.

- Re-run the six mechanical checks after remediation. Remediation can break what it was meant to fix, so this pass is not optional.

- Set Status in Document Control to `FINAL` when no Blocking or Major finding remains. Otherwise set `BLOCKED` and list what is blocking it directly under Open Questions.

- Bump the revision marker in Document Control.

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
Next step: <fill the effort columns | resolve the listed open questions>
```

- Say nothing beyond this block except a direct answer to a question the user asks.

**Hard stops:** Never report `FINAL` while a Blocking or Major finding is unresolved. Never claim a check passed unless it was actually run. Never report a heading count on the `Coverage basis` line that the checks did not actually produce.
