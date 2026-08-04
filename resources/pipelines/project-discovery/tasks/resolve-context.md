**Goal:** Establish one unambiguous project name, a usable requirements context from SpecX, and a locked absolute `project_root`.

**Scope:** Use `${PROJECT_NAME}` to locate the requirements SpecX spec, lock `project_root` per SpecX spec Pipeline Operating Contract, and inspect only the SpecX project context needed for Discovery. Do not make architecture decisions or modify project source.

**Definition of Done:** The exact project name `${PROJECT_NAME}` is locked; exactly one matching requirements SpecX spec is resolved and read; absolute `project_root` is locked (auto or user-confirmed); product shape, major capabilities, local-development constraints, and explicit preferences are recorded; or a concrete blocker has been reported.

Actions:

- Preserve the exact user-supplied `${PROJECT_NAME}`.
- Resolve SpecX specs using SpecX spec Pipeline Operating Contract.
- Resolve required global SpecX specs before continuing: Architecture Decision Matrix, Pipeline Operating Contract, and Discovery Rules. Hard-stop if any is missing.
- Resolve the requirements SpecX spec in this order:
  1. Prefer exact title `${PROJECT_NAME} - Requirements` — lock without asking.
  2. Else prefer exactly one SpecX whose `project_name` metadata or exact title equals `${PROJECT_NAME}` — lock without asking.
  3. Else, using SpecX `document_list` titles and list metadata only (do not read document bodies for matching), propose fuzzy near matches (case-insensitive token containment, common spelling variants, titles that start with the project name).
  4. If one strong fuzzy candidate: present title and id and ask the user to confirm before locking.
  5. If multiple fuzzy candidates: present the shortlist and ask which one to use.
  6. Never silently lock a fuzzy match.
- Read the requirements SpecX spec completely after it is locked.
- Lock `project_root` per Pipeline Operating Contract project-root resolution:
  1. If the current agent workspace is empty/safe as an app root (no `package.json`, no existing application `src/` tree), lock `project_root` to that absolute path without asking.
  2. Otherwise recommend exactly one absolute path (prefer `<parent-of-cwd>/${PROJECT_NAME}`) and ask the user to confirm before locking.
  3. Do not silently sanitize `${PROJECT_NAME}` into a different folder identity.
- Record locked `project_root` in task output for `write-decision-artifact`.
- Extract product shape, major capabilities, local-development constraints, and explicit technology preferences.
- Preserve explicit user preferences as candidate decisions; do not silently override them with archetype defaults.
- Keep to at most two user questions in one turn (for example requirements fuzzy confirm and path confirm).

Stop and ask the user to identify the requirements SpecX spec if there is no exact match, no fuzzy candidate, or the user rejects the proposal(s). Stop if path confirmation is required and unanswered. Stop if the product idea is too ambiguous to select a product shape.
