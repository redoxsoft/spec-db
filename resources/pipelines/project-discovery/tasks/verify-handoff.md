**Goal:** Prove that the next workflow has all required SpecX inputs and knows exactly what to run next.

**Scope:** Check SpecX spec existence, references, prerequisite reporting, and locked `project_root` only. Do not scaffold or modify implementation source.

**Definition of Done:** The requirements SpecX spec, decision SpecX spec (including absolute `project_root`), mandatory architecture-rules SpecX spec, and prerequisite list are locatable by `${PROJECT_NAME}`; the next workflow is named; any missing item is reported as a blocker.

Actions:

- Confirm SpecX can locate:
  - the requirements SpecX spec;
  - SpecX spec `${PROJECT_NAME} - Decision Matrix`;
  - SpecX spec `${PROJECT_NAME} - Architecture Rules`;
  - the listed prerequisites;
  - absolute `project_root` recorded on the Decision Matrix.
- Report the locked `project_root` so Scaffolding can proceed without guessing.
- Do not scaffold in this pipeline.
- Hard-stop if `project_root` is missing or not absolute.
