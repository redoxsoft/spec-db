**Goal:** Determine whether scaffolding can safely create the requested project at the locked `project_root`.

**Scope:** Inspect files, repository state, and existing changes at the Decision Matrix `project_root`. Resolve SpecX specs for `${PROJECT_NAME}` using SpecX spec Pipeline Operating Contract and SpecX spec Scaffolding Rules. Do not generate, delete, reset, or overwrite source files.

**Definition of Done:** Absolute `project_root` is read from SpecX spec `${PROJECT_NAME} - Decision Matrix`; that path is classified as empty, compatible existing project, or conflicting existing project; unrelated changes are identified; SpecX specs `${PROJECT_NAME} - Decision Matrix`, `${PROJECT_NAME} - Architecture Rules`, and the requirements SpecX spec are resolved; any conflict requiring user direction is reported as a blocker (do not silently choose another directory).

Actions:

- Resolve SpecX spec `${PROJECT_NAME} - Decision Matrix` and read absolute `project_root`. Hard-stop if missing or invalid.
- Resolve SpecX spec `${PROJECT_NAME} - Architecture Rules` (required; hard-stop if missing).
- Resolve the matching requirements SpecX spec.
- If the agent cwd differs from `project_root`, switch/open that root before classifying or scaffolding.
- Classify **`project_root`** (not an arbitrary cwd): empty, compatible existing project, or conflicting existing project.
- Inspect current changes under `project_root` and preserve them.
- If an existing project at `project_root` conflicts with the decision SpecX spec, report the mismatch before changing files.
- Do not overwrite an existing application or initialize a second project inside it without user direction.
- Do not invent or ask for a different `project_root`.
