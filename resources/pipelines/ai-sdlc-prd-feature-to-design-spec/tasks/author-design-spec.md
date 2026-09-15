**Goal:** Create or update `<Subject> - Design Spec` from the Design Spec Template, following Design & Architecture Principles, so every source requirement has an owner and every decision records a rejected alternative.

**Scope:** Create or update only the SpecX document titled `<Subject> - Design Spec`, using the locked `${SOURCE_SPEC_REF}`, locked subject, and architecture inspection. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A document titled `<Subject> - Design Spec` exists, was created or updated in place (no duplicate), follows the `Design Spec Template`, and records decisions with rejected alternatives. The task stopped if the template or `Design & Architecture Principles` could not be found by exact title.

**Instructions:**

- Resolve the SpecX template `Design Spec Template` and the SpecX spec `Design & Architecture Principles` by exact title. If either cannot be found, stop and report the exact missing title. Do not substitute another template or invent a structure.
- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. Reread the locked subject. If either locked value is unavailable, repeat resolution rather than guessing. Do not rely on a previous task's unstated memory.
- Locate an existing SpecX document titled `<Subject> - Design Spec` and update it. If none exists, create it with that exact title. Do not create a second document for the same subject.
- Fill the template from the locked source and the architecture inspection. Name the source title; do not restate the PRD or Change Request. Extend existing owners and contracts; do not add a new service, store, or layer unless no existing owner can take the responsibility.
- Record each material decision as the chosen option, at least one rejected alternative, and why the alternative lost. Label open decisions as open. Do not list undecided options as if they were chosen.
- Map each source requirement to a component or contract. State validation, compatibility, failure modes, and signals. Omit threats and migrations you cannot justify.
- Report the document title and version, the source title, and any unresolved decisions that remain.
