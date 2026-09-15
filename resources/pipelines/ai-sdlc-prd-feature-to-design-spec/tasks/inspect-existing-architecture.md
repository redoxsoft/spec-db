**Goal:** Record how the current system already owns the locked source's requirements, so the Design Spec extends reality rather than describing a greenfield ideal.

**Scope:** Read the locked `${SOURCE_SPEC_REF}`, existing Design Specs, and the repository as they relate to this source. Record current owners, contracts, and constraints. Do not author the Design Spec yet. Do not edit application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Current components, contracts, and constraints that the new design must respect are named with evidence from the locked source, existing design documents, and the repository. Gaps where no owner exists are listed explicitly.

**Instructions:**

- Resolve the SpecX spec `Design & Architecture Principles` by exact title. If it cannot be found, stop and report that exact missing title. Do not reconstruct the rules from memory.
- Reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. Reread the locked subject.
- Read existing Design Specs and architecture notes that cover the same subject or overlapping components. Prefer extending those documents' owners and contracts over inventing new ones.
- Inspect the repository only as far as it explains current owners, interfaces, and runtime constraints for this source. Do not expand into unrelated modules.
- Follow `Design & Architecture Principles`: name existing owners per concern; note published APIs, events, and schemas that callers already rely on; record hard limits the new design must respect.
- Report the locked source title and version, the subject, current owners and contracts, constraints, and any gap where no existing owner can take the change.
