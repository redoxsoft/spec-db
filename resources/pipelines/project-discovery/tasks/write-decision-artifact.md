**Goal:** Persist the validated architecture in the canonical project decision SpecX spec.

**Scope:** Create or update only SpecX spec `${PROJECT_NAME} - Decision Matrix` (and necessary SpecX metadata/references). Do not create source files, local markdown artifacts, or milestone SpecX specs.

**Definition of Done:** The SpecX spec contains the locked state, stack, prerequisites, absolute `project_root`, assumptions, unresolved items, source references, and matrix revision, and another agent can use it without reconstructing decisions from conversation history.

Actions:

- Create or update SpecX spec titled `${PROJECT_NAME} - Decision Matrix`.
- Include locked state, stack by layer, prerequisites, assumptions, unresolved items, and source revisions.
- Record `project_name: ${PROJECT_NAME}`, `artifact_type: decision_matrix`, and `project_root: <absolute path locked in resolve-context>` in the SpecX spec.
- Hard-stop if `project_root` was not locked in resolve-context; do not invent a path.
- Never write a local `.md` decision matrix file.
