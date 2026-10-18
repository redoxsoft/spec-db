**Goal:** Resolve setup, discover material product decisions, and persist the contract for drafting a PRD or feature spec.

**Scope:** Accept a brief, ticket, notes, existing spec, or other supplied source. Inspect evidence and prepare the drafting contract. Do not draft the document body, create artifacts, or modify source code.

**Question policy:** Setup questions resolve paths, titles, artifact identity, workspace access, and tools. Shift these left: inspect first, use established defaults, and ask early only when evidence cannot resolve a consequential choice or blocker. Discovery questions resolve product intent, users, outcomes, scope, behavior, priorities, and acceptance. Ask them when needed to produce a useful spec; explain why an answer matters and recommend an option when useful. Ask related questions together and dependent questions after their prerequisite. There is no fixed question or round limit. Change the usual timing only when evidence, a dependency, or a consequential decision justifies it, and record why. Facts, accepted decisions, proposals, and unresolved items are distinct; a recommendation is not approval.

**Definition of Done:**
- [ ] Source and relevant repository/workspace evidence were inspected before asking questions.
- [ ] Setup was resolved from evidence or defaults where possible; necessary setup questions were asked before they blocked discovery or drafting.
- [ ] Material discovery questions were asked and answered, or explicitly deferred and recorded. No unsupported fact or product behavior was invented.
- [ ] Mode and any split were recommended; consequential choices were resolved and no unaccepted split was applied.
- [ ] Output identity and placement are resolved for every artifact, with a complete persisted drafting handoff.
- [ ] The template is available, or the task stopped `blocked` and named the missing template.

## 1. Preflight

1. Set state to `inspecting`. Establish a durable source reference (document title, ticket, commit, or supplied-input description). Inspect that source and only the repository files, existing specs, manifests, tests, and workspace details relevant to understanding the brief or resolving setup.
2. Confirm Agile Product Spec Template (`agile-sdlc-product-spec-template`) is available. If not, stop `blocked` and name it.
3. Infer a provisional subject and likely output mode. Resolve the likely output title with an exact, case-insensitive workspace search. If there is one match, persist its artifact id, current folder id, and informational folder path. If several matches exist, ask the user to select one and persist the selected identity and collision disposition. Never list folder contents.
4. Resolve placement once per output. For updates, keep the existing artifact in its current folder; ignore a supplied override and note an advisory. For creates, persist only the folder path: use a valid override explicitly assigned to that output, otherwise PRDs use `Project Work/Initiatives` and Feature Specs use `Project Work/Features/<approved subject>`. Apply only host-required subject sanitization. Do not create folders or artifacts. Each split feature has its own subject folder; do not share a general override across split outputs.
5. Ask setup questions now only when evidence cannot resolve a consequential choice, identity ambiguity, invalid override affecting destination, or a dependency that blocks later work. Batch independent questions. If discovery changes an output's subject or count, repeat identity and placement lookup only for affected outputs.

## 2. Discovery

6. Consider the problem and users, intended outcome, smallest useful scope, behavior, observable acceptance, and material constraints. Ask only when the answer could materially change the spec. Distinguish unknown facts from product choices: request evidence for an essential unknown fact, or mark it `? [NEEDS_INPUT]`; label suggested behavior `* [PROPOSAL]` until accepted. Use `! [HYPOTHESIS]` only for a plausible explanation still under investigation. Allow explicit deferral and preserve the affected behavior as unresolved. Do not silently broaden scope.
7. Recommend PRD mode (`<Subject> - Agile PRD`) when several capabilities share an initiative objective, users, and outcomes. Recommend Feature mode (`<Subject> - Agile Feature Spec`) for one capability with meaningful flows, rules, or edge cases. Read "Agile Artifact Routing Guide" only when the evidence does not settle whether a spec or the default Work Item route is sufficient. Ask about mode only when evidence and the request leave a consequential choice unresolved.
8. In Feature mode, propose a split only when independently deliverable capabilities would be clearer as separate specs. Apply it only if accepted. PRD mode produces one document.

## 3. Handoff

9. Show one preview of at most six concise lines: source; mode and subject/title or accepted split; intended outcome and scope; exact update/create destination; material decisions, proposals, or advisories; next action. Include only applicable details. Ask for an answer only when a consequential choice remains; otherwise the request to generate the spec authorizes drafting with the recorded choices and defaults. Do not add an acknowledgement that resolves nothing.
10. Persist status `approved`, source reference, mode, accepted subjects/titles and split, each collision disposition, material facts and their provenance (`user-stated`, `repository-observed`, `agent-inferred`, or `unresolved`), discovery questions/answers and deferred choices, proposal status, template id, advisory, and each output disposition. For updates store artifact id, current folder id, and informational folder path; for creates store only the approved folder path. This is the complete state for a fresh drafting task; do not rely on conversation history. Keep `inputVarDefinitions` empty because they are caller hints, not internal state.
11. If the user chooses the default Work Item route, finish and state that next action. Do not draft, create artifacts, modify source code, or repeat settled questions in this task.
