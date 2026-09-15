**Goal:** Lock this member's completed, next, blocker, and help facts, asking only for what is still missing.

**Scope:** Elicit facts from `${STANDUP_INPUT}` and the user for the locked member. Do not write the Standup Log yet. Never fabricate progress. Never treat silence as confirmation that there are no blockers. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Completed work, next work, and an explicit blocker statement are locked and printed. Help and decisions are locked or explicitly omitted by the member. No fact was inferred from silence or invented from repository state.

**Instructions:**

- Reread the locked member and `${STANDUP_INPUT}`. Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${STANDUP_INPUT}` appearing verbatim) as missing notes. If the locked member is unavailable, repeat resolution rather than guessing.
- Parse `${STANDUP_INPUT}` for completed work, next work, blockers, and help or decisions. Keep only facts that are actually present.
- Ask only for the missing facts. Do not re-ask for a field the notes already cover.
- Completed work must be work that actually finished. Do not list in-progress work as done. Do not invent completed items from uncommitted files or assumed activity.
- Next work must name concrete artifacts or tickets, not vague intent. If next work is missing, ask for it.
- If blockers are missing, ask whether anything is stopping progress. Do not treat an omitted blockers field, an empty answer, or silence as "no blockers". Record blockers only when the member names them, or record an explicit "no blockers" only when the member says so.
- Help and decisions are optional. Ask only if the notes suggest an ask or a decision without stating it. Omit the field when the member says there are none.
- Print the locked member and the locked completed, next, blocker, and help facts before continuing. Carry them for later tasks; do not write them back into the run's launch inputs.
