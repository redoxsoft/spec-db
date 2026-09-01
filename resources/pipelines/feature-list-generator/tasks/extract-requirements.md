**Goal:** Produce a complete, traceable inventory of what the PRD actually says, before any feature design begins.

**Scope:** Read the locked PRD and write the inventory to this task's output. Do not create or update any SpecX document, do not name features, do not choose modules, and do not estimate anything.

**Definition of Done:** Every heading in the captured outline has been walked; each requirement has a statement, a PRD section citation, one signal, and one scope label; the inventory is on the task output.

**Actions:**

- Apply the SpecX spec `PRD to Feature List Rules`, sections Requirement signals, Scope classification, Cross-cutting pass, AI decomposition, and The whole PRD is in scope.

- Walk the PRD heading by heading using the outline from the previous step. Extract every statement that would change what a user can do, what the system must guarantee, or what data enters or leaves the system.

- Ground each requirement in the PRD's own wording, and cite the heading with the PRD's own numbering. That is the only identifier — do not invent requirement IDs.

- Assign exactly one signal and exactly one scope label per requirement. A statement carrying two signals becomes two requirements.

- Label `Optional` or `Future Phase` only when the PRD's own wording says so, and note that phrase. Where the PRD is silent, vague, or implied, label `Assumption` and record the reading. Label `Open Question` only when the PRD contradicts itself. Do not interrogate missing operational detail, and do not use either label to defer committed material.

- Do not merge distinct requirements to keep the inventory short, and do not invent sub-requirements to make it look thorough.

- Record the inventory with `appendTextOutputToTask`, grouped by PRD heading. Do not show it to the user unless they ask.

```text
§7.4 Skill Inference
  - <requirement statement> [AI capability] [Committed]
  - <requirement statement> [Governance] [Assumption]
```

- Close with a one-line count of requirements found and headings walked.

**Hard stops:** Stop if the PRD yields no extractable requirements. Stop if the heading outline from the previous step is missing. Stop if an open question's answer would be which part of the PRD to build first. Stop if you would block the inventory because the PRD left a detail unstated — record an assumption instead.
