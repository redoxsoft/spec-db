**Goal:** Give the user an exact, copy-pasteable command to start Scaffolding using only the project name.

**Scope:** Produce the handoff text only after verify-handoff succeeds. Do not start Scaffolding or modify project source.

**Definition of Done:** The response contains one copy-paste command containing only the unchanged project name `${PROJECT_NAME}`.

Render this command exactly:

```text
Run Scaffolding pipeline for `${PROJECT_NAME}`.
```
