**Goal:** Judge whether the locked change satisfies the locked work item's acceptance criteria.

**Scope:** Read the locked `${WORK_ITEM_REF}` and inspect only `${CHANGE_SCOPE}`. Record alignment findings. Do not edit code or SpecX documents. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Every acceptance criterion on the locked work item is mapped to the change as met, unmet, or not applicable, with evidence. Extra behaviour the spec forbids is recorded as a finding.

**Instructions:**

- Reread the locked work item by document id when one was locked; otherwise by exact title. If neither is available, repeat resolution rather than guessing. Do not rely on a previous task's unstated memory.
- Read the full spec: acceptance criteria, edge cases, and explicit non-goals, exclusions, or out-of-scope statements. A Work Scope Brief is a valid work item; use its outcome, inclusions, exclusions, and criteria.
- Inspect only the locked `${CHANGE_SCOPE}`. Do not review unrelated files.
- Map each acceptance criterion to the change. An unmet criterion is a finding. Treat a mismatch between implemented behaviour and stated criteria as a defect, not a documentation fix to defer.
- Reject extra behaviour the spec forbids or that expands neighboring work. If the spec is silent on behaviour the change introduces, record a finding rather than inventing a requirement.
- Report the work item title and version, the mapped criteria, and any unresolved alignment findings.
