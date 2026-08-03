**Goal:** Select exactly one milestone that is eligible under the dependency graph.

**Scope:** Read milestone statuses and dependencies only from SpecX spec `${PROJECT_NAME} - Milestones`, using SpecX spec Building Rules and SpecX spec Pipeline Operating Contract. Do not choose work based on convenience, skip blocked prerequisites, or edit implementation files. Accept only `${PROJECT_NAME}` as user input; do not accept an alternate milestone-ID invocation.

**Definition of Done:** One eligible milestone is selected, or a terminal state is reported: all done, blocked, or invalid plan.

Actions:

- Resolve SpecX spec `${PROJECT_NAME} - Milestones`.
- Read the milestone statuses and dependencies.
- Select the first pending milestone whose dependencies are all `done`.
- If all milestones are `done`, report project completion.
- If no milestone is eligible, report the blocking dependency or invalid plan.
