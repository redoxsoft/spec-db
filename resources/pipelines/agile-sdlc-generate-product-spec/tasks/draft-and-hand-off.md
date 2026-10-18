**Goal:** Draft or update each approved PRD or feature spec from the Agile Product Spec Template, then hand off in at most five lines.

**Scope:** Use the persisted discovery contract. PRDs emphasize initiative context, outcomes, requirements, and supported success evidence. Feature specs emphasize behavior, requirements, and acceptance criteria; include journeys when useful. Do not invent facts or commitments, modify application source code, start another pipeline, or repeat resolved questions.

**Definition of Done:**
- [ ] The approved contract, discovery decisions, unresolved items, and each output placement were reloaded.
- [ ] Each artifact was written in its persisted location with the approved title and template.
- [ ] The draft follows the template, distinguishes proposals and unresolved items, and contains no invented facts.
- [ ] A brief quality check found no unresolved duplication, unclear behavior, untestable criteria, or material contradiction.
- [ ] The handoff is at most five lines and truthfully reports outcome, decision, artifact, evidence, and next action.

## 1. Write

1. Set state to `drafting`. Reload Task 1's complete **Persisted handoff**. Stop `blocked` unless its status is `approved`. For each output, an update must include artifact id, current folder id, and informational folder path; a create must include its approved folder path. Do not reconstruct missing state from conversation.
2. Use each output's own saved placement; never recompute placement, list folders, or relocate an existing artifact. For updates, reread and write by artifact id, keeping the document in its current folder; if its folder changed since scoping, note an advisory and still write there. For creates, use the Agile Product Spec Template, approved title, and saved folder path (folder names from the root). Use one idempotency key per create and reuse it if retried. If the template or create is unavailable, stop `blocked`.
3. Read "Agile Requirements Quality Guide" (`agile-sdlc-requirements-quality-guide`) once only when requirements or criteria are substantial and their quality is not established by the source. Do not reread the routing guide or load another spec.
4. Fill the template from the source, answers, and accepted decisions. Include the required problem/users, outcome, requirements, behavior/rules, and acceptance criteria. Omit optional sections with no useful content. Put material exclusions under `Context & Scope > Non-Goals`. Give every rule one authoritative home; journeys add end-to-end understanding and reference requirements instead of repeating their criteria.
5. Keep facts, accepted decisions, proposals, hypotheses, and unknowns distinct. Mark unaccepted product behavior or targets `* [PROPOSAL]`; mark consequential unresolved facts or choices `? [NEEDS_INPUT]`; use `! [HYPOTHESIS]` only for an explanation still under investigation. Never silently promote a proposal or hypothesis; require explicit acceptance or empirical verification. Do not invent research, baselines, existing behavior, telemetry, stakeholder agreement, or commitments. A proposed target does not imply instrumentation is in scope. If the user deferred a question, draft unaffected behavior and keep only the affected part unresolved.

## 2. Quality check

6. Review the draft briefly: Is the scope the smallest coherent version? Are relevant actors, triggers, conditions, state changes, observable outcomes, and failure behavior clear? Are acceptance criteria observable? Do requirements, journeys, exclusions, and decisions agree without duplication? Are material constraints included without a generic checklist? Fix issues within accepted decisions. If a newly discovered consequential choice blocks a useful draft, set `waiting`, explain why, and ask it once; otherwise leave a specific `? [NEEDS_INPUT]` or `* [PROPOSAL]` and continue. Do not add the review checklist to the PRD.

## 3. Report

7. Emit at most five lines labeled Outcome, Decision, Artifact, Evidence, and Next action. Use `done`, `failed`, `needs_input`, or `blocked` truthfully. Name each exact document and informational folder path, include a placement advisory only when needed, and briefly cite source/repository evidence and material provenance. Do not modify source code or create another artifact.
