**Goal:** Determine milestone order and what blocks what from the locked source, before writing any plan.

**Scope:** Read the locked `${SOURCE_SPEC_REF}` and related architecture. Record proposed slices, dependencies, and parallel work. Do not author the Milestone Plan yet. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Proposed milestones are named as outcomes, each with what it needs from earlier work, and the graph has no cycle. Coverage of the locked source scope is stated, including anything that cannot yet be sequenced. Missing architecture is labeled as an assumption, risk, or recommendation — not an automatic rejection.

**Instructions:**

- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. Use the locked title for display. Reread the locked subject and plan mode.
- If plan mode is `implementation-level` (Design Spec, Change Request, or Work Scope Brief), use components, contracts, migrations, and the brief's change boundary as the units to sequence.
- If plan mode is `product-level` (PRD), sequence outcome slices, owners, dependencies, and decision points. Label unresolved technical sequencing `Needs design decision` or `Validation required before implementation`. Do not invent architecture to fill those gaps, and do not reject the plan because design is incomplete.
- Inspect the repository only as far as it explains real build or delivery order.
- Group work into shippable outcome-named slices. State what each slice leaves for later. Name which slices may run in parallel and which cannot start until another finishes.
- Record external blockers (data, approvals, other teams) separately from milestone-to-milestone dependencies. Do not invent owners, dates, or effort.
- Reject a cycle: if A depends on B and B depends on A, split or reorder until the graph is acyclic, or stop and ask the user which dependency is wrong.
- Report the locked source title and version, plan mode, the proposed sequence, parallel sets, blockers, labeled design gaps, and any source scope that has no slice yet.
