**Goal:** Confirm today's standup entry is present, attributed to the locked member, and does not invent progress.

**Scope:** Read-only verification of the SpecX document titled `${WORKSPACE.TITLE} - Standup Log`. Do not edit the log. Never fabricate progress. Never treat silence as confirmation that there are no blockers. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** An entry titled `<YYYY-MM-DD> — <Member>` exists for today and the locked member, contains completed and next facts, and is not a duplicate of another same-date same-member entry. Gaps are listed, or the entry is reported complete.

**Instructions:**

- Reread the document titled `${WORKSPACE.TITLE} - Standup Log` in full so the check reflects the current document, not a previous task's memory. If that title is unavailable, repeat resolution rather than guessing. Reread the locked member.
- Confirm exactly one entry titled `<YYYY-MM-DD> — <Member>` exists for today and the locked member. Confirm it is attributed to that member and includes completed work and next work from the locked facts.
- Confirm completed work is not in-progress work restated as done. Confirm no extra progress was added that was not collected.
- If the blockers node is absent, do not treat that as confirmation that there are no blockers — note that absence is not a "no blockers" statement unless the member said so.
- Report the Standup Log title and version, the entry title, what passed, and any remaining gaps. Do not start another pipeline unless the user asks.
