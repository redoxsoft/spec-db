**Goal:** Lock the workspace Standup Log and the member identity this entry will attribute.

**Scope:** Resolve or create the SpecX document titled `${WORKSPACE.TITLE} - Standup Log` using the SpecX template `Standup Log Template`. Lock member identity. Do not append an entry yet. Never fabricate progress. Never treat silence as confirmation that there are no blockers. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** The document titled `${WORKSPACE.TITLE} - Standup Log` exists (located or created in place), the member identity is locked and printed, and `${STANDUP_INPUT}` has been parsed for a member name when present — or the task stopped because the template could not be found.

**Instructions:**

- Resolve the SpecX template `Standup Log Template` (`ai-sdlc-standup-log-template`) by exact title. If it cannot be found, stop and report **workspace setup required**: missing `Standup Log Template` (`ai-sdlc-standup-log-template`). This is not an invalid project input. Do not substitute another template or invent a structure.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${STANDUP_INPUT}` appearing verbatim) as missing.
- If `${WORKSPACE.TITLE}` is empty or unusable, ask for a workspace or log title rather than guessing. Do not invent a workspace name.
- Deterministically resolve the document titled `${WORKSPACE.TITLE} - Standup Log`:
  1. Locate an existing SpecX document with that exact title and use it. Lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
  2. If none exists, create it with that exact title using `Standup Log Template`. Fill team and cadence only from known facts; do not invent people or a cadence. Lock the new document's id and title.
  3. Do not create a second Standup Log for the same workspace.
- From `${STANDUP_INPUT}`, extract a member name if one is present. If member identity is unavailable, ask for it. Do not invent a person from uncommitted files or from other log entries.
- Print the locked Standup Log id (when available), title, and the locked member before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
