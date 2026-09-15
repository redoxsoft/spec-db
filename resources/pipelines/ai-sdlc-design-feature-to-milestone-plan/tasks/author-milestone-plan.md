**Goal:** Create or update `<Subject> - Milestone Plan` from the Milestone Plan Template, using the locked source and the dependency map.

**Scope:** Create or update only the SpecX document titled `<Subject> - Milestone Plan`, using the locked `${SOURCE_SPEC_REF}`, locked subject, plan mode, and dependency map. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A document titled `<Subject> - Milestone Plan` exists, was created or updated in place (no duplicate), follows the `Milestone Plan Template`, records plan mode, uses `Unassigned` when an owner is unknown, and sets every newly authored milestone status to `Planned`. The task stopped if the template could not be found by exact title.

**Instructions:**

- Resolve the SpecX template `Milestone Plan Template` by exact title. If it cannot be found, stop and report that exact missing title (`ai-sdlc-milestone-plan-template`). Do not substitute another template or invent a structure.
- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. Reread the locked subject and plan mode. If a locked value is unavailable, repeat resolution rather than guessing. Do not rely on a previous task's unstated memory.
- Locate an existing SpecX document titled `<Subject> - Milestone Plan` and update it. If none exists, create it with that exact title. Do not create a second document for the same subject.
- Fill the template from the locked source and the dependency map. Name the source by id when locked and by title for display; do not restate the source. Write plan mode as `product-level` or `implementation-level`. Title each milestone with its outcome, not "Milestone 1". Use `Unassigned` when an owner is unknown; never invent a name.
- In a product-level plan, keep slices at outcome, owner, dependency, and decision-point level. Write `Needs design decision` or `Validation required before implementation` where technical sequencing is unresolved. Do not invent architecture.
- In an implementation-level plan, contracts, migrations, and technical ordering may drive milestones.
- Set every milestone on a new plan to `Planned`. When updating an existing plan, set newly added milestones to `Planned` and do not reset In Progress, Blocked, or Done statuses. Do not pre-fill implementation records. Do not invent dates or progress.
- Write a verifiable definition of done for each milestone. Record sequencing and shared risks across milestones, including missing-architecture assumptions.
- Report the document title and version, the source title, plan mode, and any unresolved ownership, sequencing, or design-decision questions.
