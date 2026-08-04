**Goal:** Establish the implementation context and a safe starting point for the selected milestone.

**Scope:** Read SpecX specs (requirements, `${PROJECT_NAME} - Decision Matrix`, `${PROJECT_NAME} - Architecture Rules`, `${PROJECT_NAME} - Milestones`, SpecX spec Building Rules) and inspect workspace changes under the locked `project_root`. Do not implement before scope and current state are understood.

**Definition of Done:** The milestone's scope and definition of done are understood, relevant files are identified under `project_root`, unrelated changes are noted, SpecX architecture-rules spec is loaded, and status is `in_progress` in SpecX spec `${PROJECT_NAME} - Milestones`.

Actions:

- Read the selected milestone completely from the SpecX milestones spec.
- Read the requirements SpecX spec, SpecX spec `${PROJECT_NAME} - Decision Matrix`, SpecX spec `${PROJECT_NAME} - Architecture Rules` (required; hard-stop if missing), README, and source.
- Read absolute `project_root` from SpecX spec `${PROJECT_NAME} - Decision Matrix`. Hard-stop if missing or invalid.
- If the agent cwd differs from `project_root`, switch/open that root before inspecting or editing.
- Inspect current workspace changes under `project_root`.
- Mark the selected milestone `in_progress` in SpecX before implementation.
- Never write status to a local markdown milestones file.
