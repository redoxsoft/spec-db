**Goal:** Convert locked choices into a complete, internally consistent architecture and prerequisite set.

**Scope:** Apply SpecX spec Architecture Decision Matrix constants, prerequisite engine, and validation rules. Do not add technologies based on general knowledge or start project setup. Do not create SpecX documents yet.

**Definition of Done:** The resulting state validates; every architecture layer has an explicit value including `none`; prerequisites are deduplicated and categorized; assumptions and deferred concerns are recorded.

Actions:

- Apply every matching constant rule from SpecX spec Architecture Decision Matrix.
- Derive prerequisites using that SpecX spec's sole prerequisite engine.
- Validate all required state paths and invariants.
- Record deferred concerns instead of inventing deployment or production decisions.
