**Goal:** Persist the validated plan in the canonical SpecX milestones document.

**Scope:** Create or update only SpecX spec `${PROJECT_NAME} - Milestones` (and necessary SpecX references) per SpecX spec Planning Rules. Do not implement any milestone. Never write a local milestones markdown file.

**Definition of Done:** The SpecX spec contains the project completion definition, all validated milestones, status values, dependencies, acceptance criteria, verification, and notes needed by Milestone Builder.

Actions:

- Create or update SpecX spec titled `${PROJECT_NAME} - Milestones`.
- Set every new milestone to `pending`.
- Record `project_name: ${PROJECT_NAME}` and `artifact_type: milestones`.
- Record the project completion definition.
