**Goal:** Report the Milestone Plan handoff: document title, version, and the first eligible milestone.

**Scope:** Read-only reporting of the locked `<Subject> - Milestone Plan`. Do not create or edit documents or code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The output names the Milestone Plan title and version, the locked `${SOURCE_SPEC_REF}`, plan mode, and the first eligible milestone. No new files or documents were created.

**Instructions:**

- Reread the document titled `<Subject> - Milestone Plan` so the report reflects the current document, not a previous task's memory. If that title is unavailable, repeat resolution rather than guessing.
- Identify the first eligible milestone: a `Planned` (or otherwise not Done) milestone whose named dependencies are already Done or absent, preferring the earliest in the stated sequence. If several are equally eligible, list them and name the first in sequence.
- Report the exact title and version, the locked `${SOURCE_SPEC_REF}` (id when available, title for display), plan mode, remaining open questions including `Needs design decision` or `Validation required before implementation` items, the first eligible milestone, and the recommended next step: implement that milestone by running `Implementation` when the slice has a bounded scope and acceptance criteria; otherwise recommend `PRD / Change Request → Design Spec` for unresolved architecture.
- Do not start another pipeline unless the user asks.
