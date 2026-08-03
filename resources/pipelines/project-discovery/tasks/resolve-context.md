**Goal:** Establish one unambiguous project name and a usable requirements context from SpecX.

**Scope:** Use `${PROJECT_NAME}` to locate the requirements SpecX spec and inspect only the SpecX project context needed for Discovery. Do not request paths unless SpecX spec resolution is ambiguous. Do not make architecture decisions or modify project source.

**Definition of Done:** The exact project name `${PROJECT_NAME}` is locked; exactly one matching requirements SpecX spec is resolved and read; product shape, major capabilities, local-development constraints, and explicit preferences are recorded; or a concrete blocker has been reported.

Actions:

- Preserve the exact user-supplied `${PROJECT_NAME}`.
- Resolve SpecX specs using SpecX spec Pipeline Operating Contract.
- Resolve required global SpecX specs before continuing: Architecture Decision Matrix, Pipeline Operating Contract, and Discovery Rules. Hard-stop if any is missing.
- Prefer SpecX spec titled `${PROJECT_NAME} - Requirements`; otherwise exactly one SpecX spec whose title or metadata matches `${PROJECT_NAME}`.
- Read the requirements SpecX spec completely.
- Extract product shape, major capabilities, local-development constraints, and explicit technology preferences.
- Preserve explicit user preferences as candidate decisions; do not silently override them with archetype defaults.

Stop and ask the user to identify the requirements SpecX spec if no confident match or multiple matches exist. Stop if the product idea is too ambiguous to select a product shape.
