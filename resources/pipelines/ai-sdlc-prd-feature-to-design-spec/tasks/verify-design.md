**Goal:** Confirm every source requirement traces to a component or contract, and that every material decision records its rejected alternative.

**Scope:** Read the locked `<Subject> - Design Spec`, the locked `${SOURCE_SPEC_REF}`, and the SpecX spec `Design & Architecture Principles`. Record gaps. Do not edit the document or application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Every source requirement maps to an owning component or contract. Every published interface states validation and compatibility. Failure modes and signals are named. Every material decision records the choice, a rejected alternative, and the reason. Gaps are listed, or the design is reported ready.

**Instructions:**

- Resolve the SpecX spec `Design & Architecture Principles` by exact title. If it cannot be found, stop and report that exact missing title.
- Reread the document titled `<Subject> - Design Spec` in full, and reread the locked `${SOURCE_SPEC_REF}`. If either title is unavailable, repeat resolution rather than guessing.
- Check the design completion criteria: one owner per concern; contracts name success, failure, validation, and compatibility; security and reliability are justified by the change's attack surface; no restated PRD or Change Request in place of architecture.
- Confirm requirement traceability is complete against the locked source — name any source requirement with no owner. Confirm each key decision includes a rejected alternative, or an explicit statement that none existed.
- Report the document title and version, what passed, and any remaining gaps. Do not mark the design ready while a completion-criteria item fails.
