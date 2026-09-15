**Goal:** Append or update today's standup entry titled `<YYYY-MM-DD> — <Member>` on the workspace Standup Log.

**Scope:** Create or update only that entry on the SpecX document titled `${WORKSPACE.TITLE} - Standup Log`. Do not rewrite other members' entries or past dates. Never fabricate progress. Never treat silence as confirmation that there are no blockers. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** An entry titled `<YYYY-MM-DD> — <Member>` exists, attributed to the locked member, containing the locked completed, next, and blocker facts. An existing entry for the same date and member was updated in place rather than duplicated. The task stopped if `Standup Log Template` could not be found by exact title.

**Instructions:**

- Resolve the SpecX template `Standup Log Template` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another template.
- Reread the document titled `${WORKSPACE.TITLE} - Standup Log` and the locked member and facts. If the log title or locked member is unavailable, repeat resolution rather than guessing. Use today's date in `YYYY-MM-DD`.
- Locate an existing entry titled `<YYYY-MM-DD> — <Member>` for this date and locked member and update it in place. If none exists, append a new entry with that exact title. Do not duplicate the same date and member. Do not title the entry "Standup Entry".
- Write completed, next, and blockers from the locked facts only. Include help and decisions when they were locked. Do not add work that was not collected. Do not rewrite other entries.
- If blockers were explicitly "no blockers" from the member, omit the blockers node rather than inventing a blocker list. If blockers were named, record them. Do not infer either from silence.
- Report the Standup Log title and version, the entry title, and whether the entry was created or updated.
