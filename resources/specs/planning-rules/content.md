# Planning Rules

## Planning inputs <!-- key: planning-inputs -->

This SpecX spec governs conversion of requirements into SpecX spec `${PROJECT_NAME} - Milestones`.

Use:

- the requirements SpecX spec;
- SpecX spec `${PROJECT_NAME} - Decision Matrix`;
- SpecX spec `${PROJECT_NAME} - Architecture Rules`;
- the current scaffold and README, if Scaffolding has completed.

The plan must reflect the actual scaffold state. Do not plan work that is already complete as a future feature.

## Milestone design <!-- key: milestone-design -->

A milestone is an independently deliverable subset of the product. Each milestone must have:

- a stable ID and title;
- a concise user or system outcome;
- explicit in-scope work;
- explicit out-of-scope work;
- dependencies on earlier milestones only;
- affected areas;
- acceptance criteria;
- verification commands or checks;
- a definition of done;
- status: `pending`, `in_progress`, `done`, or `blocked`.

Prefer vertical slices that can be demonstrated. Avoid milestones that only create isolated layers unless that layer is a necessary foundation for the next slice.

## Dependency rules <!-- key: dependency-rules -->

- Order milestones so dependencies point backward.
- Do not create cycles.
- A milestone may not depend on a later milestone.
- Keep foundational work before dependent feature work.
- Place cross-cutting quality work early enough that later milestones inherit it.
- Include migration, seed, configuration, and documentation work in the milestone that needs it.

## Sizing and boundaries <!-- key: sizing-and-boundaries -->

Split a milestone when it contains multiple independently demonstrable outcomes or when its definition of done cannot be verified as one unit.

Combine tasks when splitting would create a non-runnable intermediate state. A milestone may contain implementation tasks, but users should invoke the Milestone Builder pipeline at milestone granularity.

Do not create a milestone for deployment unless deployment is explicitly in scope.

## Milestone document format <!-- key: milestone-document-format -->

Create or update SpecX spec `${PROJECT_NAME} - Milestones` with structure equivalent to:

```markdown
# <Project Name> Milestones

Status vocabulary: pending | in_progress | done | blocked

## Project completion definition
...

## Milestone M01 — <title>
- Status: pending
- Depends on: none
- Outcome: ...
- In scope: ...
- Out of scope: ...
- Affected areas: ...
- Acceptance criteria:
  - [ ] ...
- Verification:
  - ...
- Definition of done:
  - ...
- Notes/blockers: none
```

Never write this plan as a local markdown file.

## Planning completion criteria <!-- key: planning-completion-criteria -->

Planning is complete when every requirement is mapped to one or more milestones, all milestones have verifiable done conditions, the dependency order is valid, and the first eligible milestone is obvious without additional interpretation.
