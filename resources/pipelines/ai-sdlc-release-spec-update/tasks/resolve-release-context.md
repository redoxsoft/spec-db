**Goal:** Lock the exact work item and change scope this Delivery Sync will record, or stop with a contract error when a parent failed to supply them.

**Scope:** Resolution and confirmation only. This pipeline may update SpecX documents only. It must not edit code, commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Both `${WORK_ITEM_REF}` and `${CHANGE_SCOPE}` are locked as exact values and printed, or the task stopped with a named contract error. A direct run never locked scope from arbitrary uncommitted files.

**Instructions:**

- Decide invocation mode first. Parent invocation: another pipeline asked you to run `Delivery Sync & Spec Update` with already-locked inputs. Direct user run: the user started this pipeline themselves.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${WORK_ITEM_REF}` or `${CHANGE_SCOPE}` appearing verbatim) as missing.
- On parent invocation, both inputs must already be exact and lockable — a native implementable SpecX document (Change Request, Bug Fix Spec, milestone, or Work Scope Brief) identified by document id when available and by title otherwise, and a named file set, diff, or milestone boundary for the change scope. If either is missing or too fuzzy to lock without rediscovery, stop with an explicit contract error that names the failed input and states that the parent must pass exact locked values. Do not ask the user to rediscover what the parent should have supplied.
- On a direct user run, resolve `${WORK_ITEM_REF}` as follows:
  1. If it is already a native SpecX Change Request, Bug Fix Spec, Milestone Plan, or Work Scope Brief, lock both its document id (when the host provides one) and its display title as separate values.
  2. If missing, inspect those types. Present a shortlist with title, type, and why each candidate is relevant.
  3. Ask the user to choose when several plausible candidates exist.
  4. When one candidate is strongly implied, present it for confirmation rather than silently locking it.
  5. When no candidate exists, ask the user for a title, URL, path, or description. Do not invent a work item from a dirty tree.
- On a direct user run, resolve `${CHANGE_SCOPE}` by asking the user to name or confirm the intended files, diff, or milestone boundary. Do not infer scope from arbitrary uncommitted files. If a candidate scope is visible, present it for confirmation rather than locking it silently.
- Later tasks must read the work item by document id when available and use the title only for display or fallback. If the host cannot persist a document id, carry the exact title and do not claim a typed persistent reference.
- Print the locked work item id (when available), title, and change scope in the task output before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
