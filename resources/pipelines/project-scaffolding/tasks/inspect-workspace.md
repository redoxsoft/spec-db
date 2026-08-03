**Goal:** Determine whether scaffolding can safely create the requested project in the current workspace.

**Scope:** Inspect files, repository state, and existing changes. Resolve SpecX specs for `${PROJECT_NAME}` using SpecX spec Pipeline Operating Contract and SpecX spec Scaffolding Rules. Do not generate, delete, reset, or overwrite source files.

**Definition of Done:** The workspace is classified as empty, compatible existing project, or conflicting existing project; unrelated changes are identified; SpecX specs `${PROJECT_NAME} - Decision Matrix`, `${PROJECT_NAME} - Architecture Rules`, and the requirements SpecX spec are resolved; any conflict requiring user direction is reported.

Actions:

- Resolve SpecX spec `${PROJECT_NAME} - Decision Matrix`.
- Resolve SpecX spec `${PROJECT_NAME} - Architecture Rules` (required; hard-stop if missing).
- Resolve the matching requirements SpecX spec.
- Check whether a project already exists.
- Inspect current changes and preserve them.
- If an existing project conflicts with the decision SpecX spec, report the mismatch before changing files.
- Do not overwrite an existing application or initialize a second project inside it without user direction.
