**Goal:** Give the user an exact, copy-pasteable instruction for continuing the project safely, plus local preview steps when this invocation changed project source.

**Scope:** Produce one continuation instruction after update-milestone-status and report-handoff. If the current milestone is `done`, hand off to the next eligible milestone. If it is `blocked` or `in_progress`, hand off to the appropriate recovery action instead of bypassing it.

**Definition of Done:** The response contains exactly one applicable continuation instruction containing only the unchanged project name `${PROJECT_NAME}`, and its wording matches the updated SpecX milestone status. When this invocation changed project source and the milestone is `done` (including all milestones done), also include a preview block using the absolute project path and README commands from the prior report.

When the completed milestone has a next eligible milestone, render:

```text
Build next milestone for `${PROJECT_NAME}` using Milestone Builder pipeline.
```

Then, when project source changed in this invocation, append:

```text
To preview current work:
  cd <absolute_project_path>
  <dev_or_preview from README>
```

When the current milestone is blocked, render only (no preview block):

```text
Resolve the blocker in the current milestone for `${PROJECT_NAME}`, then rerun Milestone Builder pipeline.
```

When all milestones are done, render:

```text
Project `${PROJECT_NAME}` has completed all planned milestones. Review the final requirements SpecX spec and verification results.
```

Then, when project source changed in this invocation, append the same preview block as above.
