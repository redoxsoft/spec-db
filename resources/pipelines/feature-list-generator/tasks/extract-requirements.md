**Goal:** Produce a complete, traceable inventory of what the PRD actually says, before any feature design begins.

**Scope:** Read the locked PRD and write the inventory to this task's output. Do not create or update any SpecX document, do not name features, do not choose modules, and do not estimate anything.

**Definition of Done:**
- Every heading in the outline captured by the previous step has been walked, in document order.
- Each extracted requirement carries a statement, its PRD section reference, one signal type, and one scope label.
- The inventory has been appended to this task's output.
- No requirement exists that cannot be traced to a specific heading in the PRD.

**Actions:**

- Apply the SpecX spec `PRD to Feature List Rules`, sections Requirement signals and Scope classification.

- This inventory is working state, not a deliverable. It exists so the next step designs features from the whole document rather than from the headings that happened to stick, and so verification has something to check against. Record it with `appendTextOutputToTask`. Do not create a SpecX document for it, and do not show it to the user unless they ask.

- Walk the PRD in document order, heading by heading, using the outline from the previous step. Extract every statement that would change what a user can do, what the system must guarantee, or what data enters or leaves the system.

- Ground each requirement in the PRD's own wording, and record the heading it came from using the PRD's own section numbering. That reference is the only identifier a requirement gets — do not assign sequential IDs of your own. The PRD's headings already identify its contents, and a parallel numbering scheme survives into the deliverable as noise.

- Assign exactly one signal and exactly one scope label per requirement. A statement carrying two signals becomes two requirements.

- Run the cross-cutting pass from the rules spec before finishing. Constraints mentioned in passing — data residency, retention, roles, rate limits, audit trails, scale targets — are requirements, not colour. A single clause can generate several.

- Cover the whole PRD. Every section gets walked, including ones that read like background, future thinking, or an aside. Label a requirement `Optional` or `Future Phase` only when the PRD's own wording says so, and note the phrase that justifies it.

- Where the PRD is ambiguous, record the requirement and label it `Open Question`. Do not resolve ambiguity by assumption at this stage — that decision belongs to a human.

- Do not merge distinct requirements to keep the inventory short, and do not invent sub-requirements to make it look thorough.

- Group the output by PRD heading, in document order, so the next step and the verifier can both read it as a checklist:

```text
§7.4 Skill Inference
  - <requirement statement> [AI capability] [Committed]
  - <requirement statement> [Governance] [Open Question]
```

- Close with a one-line count of requirements found and headings walked, so a mismatch against the captured outline is visible immediately.

**Hard stops:** Stop if the PRD yields no extractable requirements. Stop if the heading outline from the previous step is missing — without it there is nothing to walk and nothing to verify against.
