**Goal:** Confirm each milestone has a verifiable definition of done, that dependencies form no cycle, and that the milestones together cover the locked source scope.

**Scope:** Read the locked `<Subject> - Milestone Plan` and the locked `${SOURCE_SPEC_REF}`. Record gaps. Do not edit the document or application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Every milestone has a verifiable definition of done, an owner or `Unassigned`, and `Planned` status unless a later status was already recorded. Dependencies are acyclic. Together the milestones cover the locked source scope at the locked plan mode. Missing architecture is listed as an assumption, risk, or recommendation — not an automatic rejection. Gaps that make a slice unimplementable (no bounded scope or acceptance criteria) are listed, or the plan is reported ready.

**Instructions:**

- Reread the document titled `<Subject> - Milestone Plan` in full, and reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If either is unavailable, repeat resolution rather than guessing.
- Check each milestone: outcome-named title; goal and explicit leftovers; concrete work items; owner or `Unassigned`; verification that an outsider could run; status is one of Planned, In Progress, Blocked, or Done.
- Walk the dependency graph. Fail verification if a cycle exists, if a dependency names a milestone that is not in the plan, or if sequencing contradicts the stated order.
- Confirm coverage against the locked source and plan mode:
  - `product-level`: every PRD journey, goal, or requirement maps to at least one milestone. Unresolved technical sequencing labeled `Needs design decision` or `Validation required before implementation` is an assumption, not a fail.
  - `implementation-level`: every design component/contract, change, or brief inclusion maps to at least one milestone.
- Name any source scope with no slice. Do not fail the plan solely because architecture is missing. Do fail a milestone that claims to be implementation-ready without a bounded scope and acceptance criteria.
- Report the document title and version, plan mode, what passed, labeled design gaps, and any remaining blockers. Do not mark the plan ready while a coverage, cycle, or definition-of-done item fails.
