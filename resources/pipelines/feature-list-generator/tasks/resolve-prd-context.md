**Goal:** Lock exactly one source PRD, derive the subject name used to title the generated document, and load the rule specs.

**Scope:** Resolution and reading only. Do not extract requirements, do not name features, and do not create or update any SpecX document in this step.

**Definition of Done:**
- Both required rule specs have been resolved by exact title and read in full.
- Exactly one PRD is locked, with its resolved SpecX title or file path recorded.
- A subject name is derived and echoed to the user.
- The PRD's heading outline has been captured, since it is the traceability spine for every later step.
- The locked context block has been printed in chat.

**Actions:**

- Resolve these global SpecX specs by exact title before anything else:
  - `PRD to Feature List Rules`
  - `Feature List Document Format`

  If either is missing, stop and report the exact missing title. Do not continue with a partial ruleset, do not substitute another document, and do not reconstruct the rules from memory.

- Resolve `${PRD_REF}` to exactly one PRD, searching both SpecX documents and repository markdown files:
  1. Exact SpecX document title match — lock without asking.
  2. Exact file path that exists — lock without asking.
  3. Otherwise gather candidates from SpecX document titles and repository `.md` filenames. Score by case-insensitive token containment and by titles or filenames that begin with the supplied text. Match on titles and paths only; do not read document bodies to rank candidates.
  4. One strong candidate — present its title or path and ask the user to confirm before locking.
  5. Several candidates — present the shortlist and ask which one to use.
  6. None — ask the user to identify the PRD.

- Never silently lock a fuzzy match. Exact matches proceed without a question.

- If the value arrives unresolved because no PRD was supplied at invocation, ask the user which PRD to translate before doing anything else. Do not guess from workspace contents.

- Derive the subject name from the locked PRD: take its title or filename, drop file extensions, drop a leading `PRD`, `PRD:`, or `PRD -` token, replace underscores with spaces, and collapse repeated whitespace. For example `PRD_ AMS International.pdf.md` yields `AMS International`. If the result is empty or ambiguous, ask the user for a subject name.

- Read the locked PRD completely, end to end, before moving on.

- Capture its heading outline — every section and subsection, in document order, with the numbering the PRD itself uses. This outline is the traceability spine: later steps cite these headings, and verification walks them one by one to prove nothing was dropped. Record it in the task output.

- The whole PRD is in scope. Do not choose a slice of it, and do not treat a named proof of concept, phase, or pilot as the delivery being quoted just because it looks like the natural first increment. Per the rules spec, material leaves the committed list only when the PRD itself marks it optional or deferred, or when a person explicitly excludes it — and both are recorded later, in Out of Scope, with the wording that justifies them.

- If the user supplied an explicit exclusion when invoking the pipeline, record it verbatim along with who asked, and carry it forward. Do not invent one, and do not ask for one.

- Print the locked context in this shape, then continue:

```text
Source PRD:     <resolved SpecX title or file path>
Subject:        <derived subject name>
Target doc:     <Subject> - Feature List
PRD outline:    <n> headings captured
Exclusions:     none | <verbatim instruction, requested by <who>>
```

**Hard stops:** Stop if a required rule spec is missing. Stop if the PRD cannot be narrowed to exactly one source. Stop if the subject name cannot be derived and the user has not supplied one. Ask at most two questions in one turn.
