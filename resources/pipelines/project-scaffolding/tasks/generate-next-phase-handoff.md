**Goal:** Give the user an exact, copy-pasteable command to start Planning with only the project name.

**Scope:** Produce the handoff text only after verify-scaffold succeeds. Do not analyze requirements into milestones or begin implementation.

**Definition of Done:** The response contains one copy-paste command containing only the unchanged project name `${PROJECT_NAME}`.

Render this command exactly:

```text
Run Planning pipeline for `${PROJECT_NAME}`.
```
