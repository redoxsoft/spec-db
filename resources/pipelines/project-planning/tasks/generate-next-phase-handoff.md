**Goal:** Give the user an exact, copy-pasteable command to start Milestone Builder for the first eligible milestone.

**Scope:** Produce the handoff text only after validate-the-plan and write-milestones-artifact succeed. Do not implement any milestone.

**Definition of Done:** The response contains one copy-paste command containing only the unchanged project name `${PROJECT_NAME}` and, when useful, identifies the first eligible milestone in the report.

Render this command exactly:

```text
Build next milestone for `${PROJECT_NAME}` using Milestone Builder pipeline.
```

If the first eligible milestone should be called out, append:

```text
The first eligible milestone is `<milestone_id>`.
```
