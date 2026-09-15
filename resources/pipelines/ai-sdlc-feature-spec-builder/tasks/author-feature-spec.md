**Goal:** Create or update `<Subject> - Change Request` from the Change Request Template, with references to every impacted source section and a delivery recommendation.

**Scope:** Create or update only the SpecX document titled `<Subject> - Change Request`, using the locked `${REQUESTED_CHANGE}` and `${SOURCE_CONTRACT_REF}` and the impact analysis. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** A document titled `<Subject> - Change Request` exists, was created or updated in place (no duplicate), follows the `Change Request Template`, cites impacted source sections, and recommends either direct implementation or design and milestone planning. The task stopped if the template could not be found by exact title.

**Instructions:**

- Resolve the SpecX template `Change Request Template` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another template.
- Reread the locked `${REQUESTED_CHANGE}` and `${SOURCE_CONTRACT_REF}` (by document id when one was locked; otherwise by exact title or the carried snapshot). Derive `<Subject>` from the locked request (the change or behaviour name, not a sentence). If that name is ambiguous, ask once.
- Locate an existing SpecX document titled `<Subject> - Change Request` and update it. If none exists, create it with that exact title. Do not create a duplicate.
- Fill current behaviour, desired outcome, each change with acceptance criteria, and each impacted section with its current contract and required update. Name the source of truth by document id when native and by title for display. When the source contract was a URL, path, issue, or paste, fill Source Contract Snapshot with location, excerpt or revision, and provenance. Do not create a separate Work Scope Brief solely for that source contract. Do not expand into product vision, new personas, or a restated PRD. Do not pre-fill implementation records.
- State that this Change Request is a tracked amendment, not a replacement specification. When verification passes, `Delivery Sync & Spec Update` will apply approved amendments to the linked source documents and keep this Change Request as the implementation record.
- In delivery approach, recommend either straight-to-implementation or a Design Spec plus Milestone Plan, and say why.
- Report the document title and version, the source spec title, and the delivery recommendation.
