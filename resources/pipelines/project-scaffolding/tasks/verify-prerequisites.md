**Goal:** Establish that the local machine is ready for the selected architecture before writing project files.

**Scope:** Check only the deterministic prerequisite list from SpecX spec `${PROJECT_NAME} - Decision Matrix` and required external configuration. Do not install software or create cloud resources.

**Definition of Done:** Every required prerequisite is confirmed, or the pipeline has stopped with an exact missing prerequisite and remediation action.

Actions:

- Read the deterministic prerequisite list from SpecX spec `${PROJECT_NAME} - Decision Matrix`.
- Check installed software and versions.
- Check required external configuration without exposing secrets.
- Stop before writing source files when a required prerequisite is missing.
