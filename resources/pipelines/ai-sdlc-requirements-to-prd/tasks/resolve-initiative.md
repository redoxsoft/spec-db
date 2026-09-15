**Goal:** Lock a named initiative, classify it as PRD-worthy, and stop with a Change Request or Bug Fix recommendation when that artifact fits better.

**Scope:** Resolution, classification, and confirmation only. Do not create or edit SpecX documents or application code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `${INITIATIVE}` is locked as a usable name or description, a short subject name is locked, and the work is classified as a PRD with the reason printed — or the task stopped with a Change Request or Bug Fix recommendation, or stopped because a required spec could not be found.

**Instructions:**

- Resolve the SpecX spec `Work Intake & Artifact Selection Guide` (`ai-sdlc-prd-vs-feature-spec-guidelines`) by exact title. If it cannot be found, stop and report **workspace setup required**: missing `Work Intake & Artifact Selection Guide` (`ai-sdlc-prd-vs-feature-spec-guidelines`). This is not an invalid project input. Do not substitute another document or reconstruct the rules from memory.
- Treat an empty value, an omitted value, or the literal unexpanded placeholder (`${INITIATIVE}` appearing verbatim) as missing.
- If `${INITIATIVE}` already contains a usable name or description, use it. If it is missing, inspect available project context (`WORKSPACE.TITLE`, `WORKSPACE.DESCRIPTION`) and existing PRDs. Present a shortlist of relevant existing PRDs with title, version, and open questions. Ask the user to continue an existing PRD or start a new initiative. Do not invent an initiative from uncommitted files.
- When continuing an existing native PRD, lock both its document id (when the host provides one) and its display title as separate values. Later tasks must read by id when available and use the title only for display or fallback.
- Ask focused questions until these are known enough to classify: who is blocked, what fails today, the desired outcome, constraints, and what evidence exists. Ask at most two questions in one turn.
- Derive a short subject name from the locked initiative (the product or problem name, not a sentence). If the subject is empty or ambiguous, ask the user for one.
- Apply `Work Intake & Artifact Selection Guide`. Write a PRD only when that spec says a PRD is warranted — a new or materially evolving capability, journey, business rule, or success measure, whether greenfield or brownfield.
  1. If the work is a bounded, intentional amendment to an existing contract, **stop** — do not author a PRD. Recommend running `Change Request Builder` and print the classification reason.
  2. If the work is unintended deviation from expected behaviour, **stop** — do not author a PRD. Recommend running `Bug Fix Analyzer` and print the classification reason.
- If classification is still ambiguous after those rules, ask the user which path to take rather than writing a hybrid document.
- Print the locked initiative, subject, and classification before continuing. Carry those locked values for later tasks; do not write them back into the run's launch inputs.
