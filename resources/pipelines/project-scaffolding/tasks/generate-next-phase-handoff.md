**Goal:** Give the user an exact, copy-pasteable command to start Planning with only the project name, plus local preview steps for the scaffold.

**Scope:** Produce the handoff text only after verify-scaffold succeeds. Do not analyze requirements into milestones or begin implementation.

**Definition of Done:** The response contains the Planning invocation command with the unchanged project name `${PROJECT_NAME}`, followed by a preview block that uses the absolute project path and README run commands recorded in the prior report.

Render this command exactly:

```text
Run Planning pipeline for `${PROJECT_NAME}`.
```

Then render a preview block (substitute real values from the scaffold README and absolute project path; do not invent package-manager commands):

```text
To preview the scaffold:
  cd <absolute_project_path>
  <install_if_needed from README>
  <dev_or_preview command from README>
```
