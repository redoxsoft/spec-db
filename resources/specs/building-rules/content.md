# Building Rules

## Selecting work <!-- key: selecting-work -->

This SpecX spec governs the Milestone Builder pipeline. It selects the first `pending` milestone whose dependencies are all `done` from SpecX spec `${PROJECT_NAME} - Milestones`.

- If there is exactly one eligible milestone, build it.
- If there are none because all milestones are `done`, report project completion.
- If there are none because dependencies are blocked or inconsistent, stop and report the blocker.
- Never choose a later milestone to bypass an earlier blocked milestone without explicit user direction.

## Context loading <!-- key: context-loading -->

Before editing, read:

- the requirements SpecX spec;
- SpecX spec `${PROJECT_NAME} - Decision Matrix`;
- SpecX spec `${PROJECT_NAME} - Architecture Rules`;
- SpecX spec `${PROJECT_NAME} - Milestones`;
- the project README and relevant existing source.

Confirm the selected milestone's scope and definition of done. Do not implement neighboring or speculative features.

## Implementation behavior <!-- key: implementation-behavior -->

1. Inspect current workspace changes and preserve unrelated work.
2. Mark the selected milestone `in_progress` in SpecX spec `${PROJECT_NAME} - Milestones`.
3. Implement the smallest complete change satisfying its acceptance criteria.
4. Follow the locked stack and architecture rules from the SpecX specs above.
5. Update documentation and configuration required by the change.
6. Avoid introducing new dependencies unless the milestone or architecture explicitly requires them.
7. Do not commit, reset, or publish changes automatically.

## Verification <!-- key: verification -->

Run the narrowest relevant checks first, then the project's standard health checks:

- formatter;
- type checker;
- linter;
- focused tests;
- full test suite when practical;
- build or local run check;
- manual acceptance checks when automated checks cannot cover the behavior.

Use the commands documented by the scaffold and project README. If a check cannot run, record the exact reason.

## Status updates <!-- key: status-updates -->

After implementation, update SpecX spec `${PROJECT_NAME} - Milestones`:

- Set status to `done` only when every acceptance criterion and the definition of done pass.
- Set status to `blocked` when progress cannot continue, and record evidence and the smallest next action.
- Leave status `in_progress` only when the session ends before verification is complete; record the remaining work.
- Add a short implementation and verification note to the milestone.

Never mark a milestone done because the code merely compiles if its behavioral acceptance criteria are unverified. Never write status updates to a local markdown milestones file.

## Building completion criteria <!-- key: building-completion-criteria -->

Building is complete when one milestone has been implemented, verified, and accurately marked in SpecX spec `${PROJECT_NAME} - Milestones`, or when a concrete blocker has been recorded. The pipeline must not begin the next milestone in the same invocation unless the user explicitly asks for batch execution.
