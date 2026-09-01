**Goal:** Convert the requirement inventory into an estimation-ready feature list document.

**Scope:** Work from the inventory in the previous task's output and the two rule specs. Do not fill effort numbers, and do not create features that no inventory entry supports.

**Definition of Done:** SpecX document `<Subject> - Feature List` exists in the format spec's structure; every feature cites a PRD section; every PRD heading is cited somewhere; every effort cell is empty; module names come from the canonical spine.

**Actions:**

- Apply the SpecX spec `PRD to Feature List Rules` for module selection (including a split of Core Workflow when the PRD has more than one central job), Delivery Management, granularity, AI decomposition, writing style, traceability, and whole-PRD scope. Apply the SpecX spec `Feature List Document Format` for document structure.

- Create or update `<Subject> - Feature List`. Place committed scope in module tables. Place implied-but-unstated readings in Assumptions. Place contradictions in Open Questions. Place everything else in Dependencies or Out of Scope. Each row cites PRD sections.

- Walk the PRD outline and confirm every heading is cited somewhere.

- Fill the Summary counts last, after the tables are final.

**Hard stops:** Stop if a feature would have no supporting PRD section. Stop if the requirement inventory from the previous step is missing or unreadable. Stop if a second core job was folded into another module to keep a single Core Workflow name. Stop if Delivery Management rows are partnership or pace language with no project-management artefact. Stop if an underspecified detail was written as an open question instead of an assumption.
