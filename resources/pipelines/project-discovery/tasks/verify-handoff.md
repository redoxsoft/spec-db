**Goal:** Prove that the next workflow has all required SpecX inputs and knows exactly what to run next.

**Scope:** Check SpecX spec existence, references, and prerequisite reporting only. Do not scaffold or modify implementation source.

**Definition of Done:** The requirements SpecX spec, decision SpecX spec, mandatory architecture-rules SpecX spec, and prerequisite list are locatable by `${PROJECT_NAME}`; the next workflow is named; any missing item is reported as a blocker.

Actions:

- Confirm SpecX can locate:
  - the requirements SpecX spec;
  - SpecX spec `${PROJECT_NAME} - Decision Matrix`;
  - SpecX spec `${PROJECT_NAME} - Architecture Rules`;
  - the listed prerequisites.
- Do not scaffold in this pipeline.
