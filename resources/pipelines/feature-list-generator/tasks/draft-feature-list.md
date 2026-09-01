**Goal:** Convert the requirement inventory into an estimation-ready feature list document.

**Scope:** Work from the inventory in the previous task's output and the two rule specs. Do not fill effort numbers, and do not create features that no inventory entry supports.

**Definition of Done:**
- The SpecX document `<Subject> - Feature List` exists in the structure defined by `Feature List Document Format`.
- Every feature row cites at least one PRD section.
- Every heading in the PRD outline appears in at least one citation somewhere in the document.
- Every effort cell is empty.
- Module names come from the canonical spine, renamed only where the spine allows.

**Actions:**

- Apply the SpecX spec `PRD to Feature List Rules` for module selection, granularity, AI decomposition, and writing style. Apply the SpecX spec `Feature List Document Format` for document structure.

- Select modules from the canonical spine in spine order. Include a module only when at least one inventory entry supports it, and omit empty modules rather than shipping placeholders. Rename the core workflow module to the product's actual job.

- Create features at estimation boundaries. Before writing each one, check it against the granularity rules: one primary outcome, independently estimable, and not a theme in disguise. A module carrying more than about ten features usually needs splitting; one carrying fewer than three usually belongs inside a neighbour.

- Decompose every AI requirement into the chain links the PRD evidences rather than writing one AI feature. Where the PRD asks AI to support a decision rather than make it, the human control link belongs in the list.

- Cite PRD sections on every feature, in the `PRD Ref` column, using the PRD's own section numbers and short names. A feature you cannot cite is scope you invented — convert it to an assumption or an open question instead. This applies even when the capability seems obviously necessary and even when comparable products all have it.

- Place committed scope in module tables. Place everything else in Assumptions, Dependencies, Out of Scope, or Open Questions, each citing its PRD sections. Then walk the PRD outline and confirm every heading is cited somewhere. A heading with no home means scope was dropped.

- Keep the whole PRD in scope. An Out of Scope row is admissible only when it quotes the PRD's own optional or deferred wording, or names the person who excluded it. Never move material out because it looks like a later phase, and never narrow the list to a proof of concept or pilot the PRD happens to describe.

- Label vendor-supplied capability `Vendor / Subscription` in Remarks, and record the vendor itself as a dependency. The integration work stays a committed feature only if the PRD requires it.

- Leave every effort cell empty — `BE`, `FE`, `AI`, `UX`, and `QA` all stay blank. Empty means not yet estimated. Never write `0`, which asserts the work is free.

- Give each module its own subsection holding exactly one nine-column table. SpecX permits one table per section, caps tables at 29 data rows, and caps any cell at 400 characters — keep descriptions to one or two sentences so they fit.

- Fill the Summary counts last, after the tables are final.

**Hard stops:** Stop if a feature would have no supporting PRD section. Stop if the requirement inventory from the previous step is missing or unreadable.
