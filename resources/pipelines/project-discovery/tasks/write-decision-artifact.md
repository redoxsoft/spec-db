**Goal:** Persist the validated architecture in the canonical project decision SpecX spec.

**Scope:** Create or update only SpecX spec `${PROJECT_NAME} - Decision Matrix` (and necessary SpecX metadata/references). Do not create source files, local markdown artifacts, or milestone SpecX specs.

**Definition of Done:** The SpecX spec contains the locked state, stack, prerequisites, assumptions, unresolved items, source references, and matrix revision, and another agent can use it without reconstructing decisions from conversation history.

Actions:

- Create or update SpecX spec titled `${PROJECT_NAME} - Decision Matrix`.
- Include locked state, stack by layer, prerequisites, assumptions, unresolved items, and source revisions.
- Record `project_name: ${PROJECT_NAME}` and `artifact_type: decision_matrix` in the SpecX spec.
- Never write a local `.md` decision matrix file.
