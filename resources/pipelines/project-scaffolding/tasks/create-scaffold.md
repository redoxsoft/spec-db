**Goal:** Produce the smallest runnable project that implements the locked stack wiring.

**Scope:** Create manifests, configuration, minimal source structure, entry points, and a smoke target at the Decision Matrix `project_root` per SpecX spec Scaffolding Rules, SpecX spec `${PROJECT_NAME} - Decision Matrix`, and SpecX spec `${PROJECT_NAME} - Architecture Rules`. Do not implement product features or milestone work. Do not create SpecX milestone documents.

**Definition of Done:** The project at `project_root` contains the selected framework/runtime/data-access setup, starts or builds far enough for verification, and has no unapproved technology substitutions.

Actions:

- Read absolute `project_root` from SpecX spec `${PROJECT_NAME} - Decision Matrix`. Hard-stop if missing.
- Initialize only the selected framework, runtime, package manager, and data-access layer **at `project_root`**.
- Create the minimal source structure under `project_root`.
- Add a hello-world screen, health endpoint, or equivalent smoke target.
- Add environment examples, scripts, and configuration required for local execution.
- Always apply architecture rules from SpecX spec `${PROJECT_NAME} - Architecture Rules`.
- Do not implement product features.
- Do not scaffold at a different path than the locked `project_root`.
