# Agile SDLC goals

This document is the durable product charter for the Agile SDLC collection. It defines what we are building, why it exists, and the principles future iterations must preserve.

Implementation plans, playbooks, templates, specs, and pipelines may change. When they conflict with this document, this document wins. Change these goals only when the product direction intentionally changes, not to justify an implementation that drifted.

---

## 1. Product promise

Agile SDLC helps a small software team turn an idea, ticket, defect, or engineering task into a well-bounded, working, verified change with help from agents.

The system should provide enough structure to prevent ambiguity, unsafe changes, and unverifiable claims without turning routine development into a documentation exercise. A team should be able to describe ordinary work once, let an agent execute it, and receive a concise record of what changed and what was actually checked.

It is designed for the common case, not every organization. Teams should be able to adapt it to their workflow with small, local changes rather than redesigning a tightly coupled system.

---

## 2. Overall goals

### 2.1 Help teams deliver useful software

The primary measure of success is whether a team can move from intent to a correct change with less coordination and rework.

- Routine work follows a short path.
- Additional planning is used when it resolves real uncertainty or risk.
- Verification is based on observed behavior, not document completion.
- The system supports discovery and planning, but has a slight bias toward action once the work is sufficiently bounded.
- No artifact exists merely to prove that a process step happened.

### 2.2 Make the system understandable to people

A product manager, engineer, or technical lead should be able to understand what will happen without learning an internal workflow language.

- Ask for a decision once and explain why it matters.
- Keep previews and handoffs concise.
- Use familiar engineering artifacts and terminology.
- Avoid compliance language, role assumptions, scorecards, and traceability structures that do not help the team make or verify a change.
- Keep the canonical description of the work and its result easy to find.

### 2.3 Make execution predictable for agents

Agents are the primary operators of the pipelines. Instructions should exploit their ability to inspect a repository, infer local conventions, implement, test, and repair their work without forcing them through artificial loops.

- Every task contains the complete procedure it must execute.
- The information needed by a later task is persisted explicitly; correctness must not depend on conversational memory surviving.
- Instructions define boundaries and completion conditions rather than prescribing arbitrary retry counts.
- Agents may make reversible implementation decisions from repository evidence.
- Agents must not invent product behavior, weaken verification, or silently expand the requested outcome.
- The same inputs and repository state should lead different capable agents to materially similar decisions.

### 2.4 Keep the system small, modular, and easy to adopt

The smallest useful installation must work end to end:

```text
Trivial work request -> Implement and verify -> Delivery record
Other work request   -> Work item -> Implement and verify -> Delivery record
```

Specification generation, independent review, extended verification, and living-document synchronization are optional capabilities. Removing an optional capability must not break the default path.

A small project development guide may provide defaults for maintainable code and consistent agent choices. A one-time bootstrap may adapt that guide to a repository, but ordinary implementation remains usable without bootstrap or a project-owned guide.

The collection should also be a clear example of how to use the Spec DB resource types:

- **Pipelines** contain execution and orchestration.
- **Specs** contain reusable knowledge, standards, and best practices.
- **Templates** define the shape of durable output.

These responsibilities must not be duplicated across resource types.

### 2.5 Treat token cost and execution time as product requirements

Agent context, tool calls, and elapsed time are finite resources. A workflow that is correct but repeatedly reloads unchanged rules, launches redundant reviewers, or performs checks unrelated to the change is not successful.

- Minimize the instructions and reference material loaded on the default path.
- Read repository files and knowledge specs only when they are relevant to the current decision.
- Project guides must expose an applicability index and independently keyed concerns so a task can read only the sections it needs.
- Do not re-read unchanged rules merely because execution moved to another task.
- Persist distilled decisions and evidence so later tasks do not have to reconstruct them.
- Prefer one capable execution pass with targeted checks over several agents repeating the same analysis.
- Do not require a companion agent or second model pass as part of routine execution.
- Evaluate changes to the system for token cost, tool-call count, user wait time, and total elapsed time as well as correctness.

Performance optimizations must not remove necessary evidence or bypass a genuine hard stop. Conservatism must not be used to justify unlimited context loading or duplicated verification.

### 2.6 Make trustworthy execution legible

Agile SDLC should be a credible showcase of agent-assisted software delivery because the user can understand and evaluate the work, not because it produces a large amount of visible activity.

A first-time technical user should be able to answer:

1. What did I ask for?
2. What did the agent observe and infer?
3. What is it going to change?
4. What changed, and what remains unresolved?
5. What evidence supports the result?

The default experience exposes three concise moments, independent of the host interface:

- **Intake and preview:** intended outcome, acceptance criteria, scope, user-stated constraints, repository-observed facts, agent inferences, unresolved decisions, and verification approach.
- **Execution state:** whether the work is being implemented, verified, waiting for a decision, or blocked, plus the current action at a useful level of detail.
- **Delivery result:** changed areas, acceptance results, checks and observations, limitations, advisories, and the next action.

Routine users should not need raw agent transcripts, internal context keys, pipeline topology, or hidden reasoning to assess the result. Concise conclusions should link to inspectable repository evidence, commands, or artifacts when more detail is useful.

The collection does not require a particular dashboard or user interface. Hosts may render these moments differently. The pipelines, templates, and records must provide enough structured information for any host to present them clearly without reconstructing intent from logs.

### 2.7 Resolve goal conflicts consistently

The goals in this document are constraints on one product, not independent ideals to maximize in isolation. When they appear to conflict, apply this order:

1. **Truth and irreversible safety:** do not fabricate evidence, silently change approved behavior, expose protected data, or take destructive or remote actions without authority.
2. **Approved user intent and correctness:** deliver the agreed outcome and preserve the meaning of its acceptance criteria.
3. **Forward progress:** among safe and correct options, continue autonomously using repository evidence and reversible defaults.
4. **Simplicity and comprehensibility:** choose the smallest workflow and artifact set that preserves intent and evidence.
5. **Runtime economy:** among materially equivalent designs, prefer fewer tokens, reads, tool calls, tasks, and waits.
6. **Optional completeness and showcase polish:** add richer planning, review, verification, or presentation only when it provides distinct value.

Higher items do not justify unlimited process. For example, truthful verification requires sufficient evidence, not every possible test; safety requires a hard stop only for an unresolved consequential decision, not for every file in a sensitive category.

When two goals still conflict:

1. Name the concrete scenario and the two goals in tension.
2. Identify the first item in the precedence order that distinguishes the options.
3. Choose the least costly option that satisfies that higher-priority goal.
4. Preserve the rejected concern as an advisory or optional follow-up when useful.
5. Add or update a convergence test if the conflict could recur.

An implementation plan, spec, or pipeline must not silently redefine this precedence. If repeated real-world evidence shows the order is wrong, change this charter explicitly before changing the system around it.

---

## 3. User goals

Users should be able to:

1. Start from the evidence they already have: an idea, ticket, defect, pull request, diff, or notes.
2. See a short, accurate preview of the intended outcome, important assumptions, change boundary, and verification approach.
3. Approve the work once and avoid repeated confirmation of the same facts.
4. Let the agent make ordinary implementation decisions using the repository's existing patterns.
5. Know when the agent stopped, why it stopped, and exactly what decision or environmental change is needed.
6. Receive a concise record containing the change, acceptance results, commands run, and observed results.
7. Add independent review or longer verification when the risk justifies it.
8. Adopt only the artifacts and optional pipelines their team needs.
9. Understand the current execution state and next required action without reading an agent transcript.
10. Expand a conclusion into the command, repository evidence, or artifact that supports it.

The system must not require users to understand which internal pipeline, context key, record profile, or outcome-routing rule is responsible for the next step.

---

## 4. Agent goals

An agent should always be able to answer:

- What outcome am I responsible for?
- Which acceptance conditions prove it?
- What repository area may I change?
- What evidence will establish completion?
- Which decisions may I infer, and which require a person?
- Where must I persist information needed by the next task?

### 4.1 Inspect before asking

Before asking a user for information, inspect the work request, repository, existing artifacts, manifests, tests, and local conventions that can answer the question.

The agent should distinguish four sources of truth:

- **User-stated:** requirements, constraints, and choices explicitly supplied by a person.
- **Repository-observed:** facts established by files, configuration, code, tests, and available tools.
- **Agent-inferred:** reversible defaults inferred from established repository patterns.
- **Unresolved:** consequential choices that neither the user nor repository has answered.

Only unresolved consequential choices require a question. Present a recommended default when one is defensible. Do not ask a user to choose a package manager, directory, test command, or coding convention that repository inspection can establish.

Inspect first, then ask once before consequential mutation. “Ask once” does not require every question to appear in the first mechanical task; it requires the pipeline to gather evidence before presenting one consolidated decision gate.

### 4.2 Expected autonomy

Within an approved outcome and scope, an agent should continue without asking about:

- implementation details already answered by repository conventions;
- naming, file placement, and code structure that follow established patterns;
- adding or adjusting tests required to prove the acceptance conditions;
- diagnosing and repairing failures caused by its own changes;
- using an equivalent local command when the repository clearly establishes it;
- small, reversible changes needed to complete the approved behavior.

This is not permission to optimize for a green check at any cost. The agent may not change what an acceptance criterion means, weaken or remove a meaningful test, hide an error, or broaden the product behavior without approval.

### 4.3 Repair behavior

Repair is part of implementation, not a separate loop that must be invoked.

The agent keeps diagnosing and correcting its work while the repair:

- remains traceable to the approved outcome;
- stays inside the approved or safely inferred repository boundary;
- preserves the meaning of the acceptance criteria and tests;
- does not conceal a pre-existing or unrelated failure.

There is no arbitrary attempt or cycle counter. The agent stops when the nature of the next action crosses a decision boundary, not because a tally was reached.

### 4.4 Durable task handoff

When a pipeline has more than one task, Task 1 must persist one concise named handoff containing the complete approved execution contract or a pointer to one durable document. `inputVarDefinitions` are caller-variable hints, not internal state. At minimum the handoff includes:

- subject and exact durable artifact reference, or the complete compact fast-path contract when allowed;
- intended outcome;
- acceptance criteria;
- material exclusions when any;
- approved or inferred file boundary;
- verification commands or the reason no automated command applies;
- important assumptions and decisions already accepted.

For each material decision, preserve whether it was user-stated, repository-observed, agent-inferred, or explicitly approved. Approved consequential decisions become the ground truth for the rest of that run. A later task may update them only when new evidence creates a genuine conflict, and must record why.

Later tasks must reload this contract and name missing fields. They must not rely on unstored details from the prior conversation.

---

## 5. Bias for action and hard stops

Risk signals are not automatically stop conditions. A database, authentication, personal-data, migration, or public-contract change deserves more careful scoping and verification, but it may proceed when the relevant decision has already been made and the work is safely bounded.

The pipeline should surface the risk in its preview and continue after approval. It should not repeatedly stop merely because the category of work remains the same.

### 5.1 Hard stops

Stop and ask for a human decision only when proceeding would require the agent to choose something consequential that has not already been decided:

- **Product behavior:** materially different user-visible behaviors are both plausible.
- **Scope:** completing the work requires a material outcome or system boundary not covered by the request.
- **Security or privacy policy:** the agent would choose who gets access, what data may be collected or exposed, or how a security control should behave.
- **Destructive or irreversible data action:** migration, deletion, or backfill safety and recovery are not established.
- **Published compatibility:** a breaking contract needs an explicit compatibility or migration decision.
- **Verification integrity:** completion would require changing the meaning of an acceptance criterion or weakening the test that proves it.
- **External authority:** credentials, production access, legal approval, or another authorization only a person can provide is required.

A hard stop must name one concrete decision. Once that decision is recorded, the same condition must not stop the resumed run again.

### 5.2 Environmental blocks

Stop as blocked when the environment cannot perform required work: a missing toolchain, unavailable service, invalid credentials, or inaccessible test environment.

An environmental block is not a request for a product decision. State what is unavailable, which verification or action it prevents, and what would unblock it.

### 5.3 Conditions that should not stop routine work

Do not stop solely because:

- a change touches a database schema, authentication code, authorization code, or personal data;
- the change spans more than one file or module;
- no dedicated Feature Spec, Tech Spec, Test Plan, or Implementation Plan exists;
- no automated test runner applies to a documentation, copy, or configuration change;
- an optional review or extended test suite does not exist;
- the agent needs to repair a build or test failure caused by its own work.

These conditions may alter the preview, evidence, or recommended optional follow-up. They do not by themselves make progress unsafe.

### 5.4 Blockers and advisories

Not every concern is a blocker.

- A **blocker** means execution cannot safely or truthfully continue without a decision, authority, prerequisite, or correction.
- An **advisory** is a risk, limitation, improvement, or optional follow-up that does not invalidate the current result.

Pipelines should continue when only advisories remain, record them concisely, and avoid turning them into additional approval gates. A warning about risk is not a hard stop unless it meets the criteria in 5.1 or 5.2.

---

## 6. Artifact strategy

Use the least formal artifact that preserves intent and safety.

### 6.1 Default paths

A bounded low-risk typo, copy, simple configuration, or one-line fix with clear intent, one or a few deterministic criteria, exact permitted repository paths and verification, and no material decision, risk, ambiguity, or cross-run resumability need may use a compact execution contract in pipeline run state. It still receives one three-line approval preview. It does not require a Work Item or its template; its Delivery Record is the only required durable document, so the SpecX document workspace must be available by recording time.

All nontrivial, risky, ambiguous, or resumable work uses a durable Work Item. The Implement pipeline may create it from loose evidence, so a user does not need to run a specification pipeline first. A compact fast-path contract is not a cross-run checkpoint: interruption before the Delivery Record is written may require intake to be rerun.

### 6.2 When additional specifications help

Create a specification when it resolves uncertainty that should be settled before coding:

- **Product or initiative spec:** several capabilities share a product objective, users, and success measures.
- **Feature or behavior spec:** one capability has significant user flows, business rules, or edge cases.
- **Technical design:** architecture, migration, security design, or a published contract needs an explicit decision.
- **Test strategy:** risk warrants deliberate coverage beyond the repository's normal checks.
- **Implementation plan:** sequencing, coordination, or resumability across a substantial change needs to be made explicit.

These are available routes, not a mandatory chain. One artifact may be sufficient. Do not require every upstream artifact merely because a downstream artifact exists.

### 6.3 One canonical delivery history

The Delivery Record is the canonical history of implementation and verification for a change.

- Implementation appends its observed checks.
- Extended verification appends additional test runs.
- Specification synchronization appends which living documents changed.
- Each Target Revision is stored once as a manifest with stable revision id and full base commit SHA. A clean manifest has no boundary entries and represents that exact commit. A dirty manifest treats the base SHA as ancestry context and adds sorted repository-relative entries whose identity is the SHA-256 of regular-file bytes, SHA-256 of symlink target bytes, `gitlink:<commit>` for a submodule, or `MISSING`; all listed identities must match and no additional changed path may exist in the persisted boundary relative to that base. A later optional run may append a clean current-SHA manifest linked to the original dirty revision, never overwrite it.
- Each event records its date, revision id, command or action, result, and evidence pointer. It does not repeat the manifest.
- Later runs never overwrite earlier evidence.

Independent review findings may remain a separate document because they are actionable input, not execution evidence. The Delivery Record may link to them without copying the report.

---

## 7. Generic template goals

Templates should provide stable structure while leaving repository-specific details to the agent.

### 7.1 Design principles

- Keep required sections to the minimum needed for the artifact's purpose.
- Prefer generic names such as Context, Intended Outcome, Acceptance Criteria, Technical Approach, Risks, Verification, Decisions, and Evidence.
- Identify the small fixed framework that makes the artifact dependable, then explicitly leave repository-specific implementation details to the agent.
- Describe bounded creative leeway: what must remain fixed, what may be inferred from the repository, and what requires approval.
- Give every generative template observable completion checks without prescribing one stack or implementation.
- Make domain-specific modules optional: APIs, UI, data models, migrations, security, observability, rollout, and rollback appear only when relevant.
- Put examples and best practices in guidance or knowledge specs, not as mandatory outline nodes.
- Do not require empty sections, placeholder content, invented metrics, or invented architecture.
- Do not encode a particular framework, repository layout, cloud, test runner, role structure, or release process.
- Let the agent inspect the actual repository and fill concrete files, commands, interfaces, schemas, and conventions.
- Use repeatable structures for evidence, decisions, requirements, findings, and execution events so later pipelines can append rather than overwrite.

### 7.2 Preferred reusable templates

The collection should converge toward a small set of generic templates:

1. **Work Item:** context, outcome, acceptance criteria, exclusions, risks, and repository boundary. Optional defect details.
2. **Product/Feature Spec:** problem, users, intended behavior, requirements, acceptance criteria, non-goals, and open decisions. Optional journeys and success measures.
3. **Technical Design:** context, constraints, approach, decisions, affected boundaries, verification, rollout, and rollback. Optional API, data, migration, security, and operational modules.
4. **Execution Plan:** ordered increments, dependencies, target areas, checks, and recovery guidance. Used only when sequencing adds value.
5. **Delivery Record:** repeatable implementation and verification events, acceptance results, decisions, and links.
6. **Review Findings:** concise, actionable findings with location, impact, recommendation, and blocking status.

A specialized template is justified only when a generic template cannot express the artifact clearly without extensive workarounds.

---

## 8. Resource design rules

### 8.1 Pipelines

Pipelines contain the complete workflow:

- intake and approvals;
- ordered actions;
- tool usage and repository inspection;
- state persistence between tasks;
- write boundaries;
- stop conditions;
- output creation and handoff.

Do not hide required orchestration in a spec. Do not make one pipeline start optional pipelines. An optional pipeline takes an existing artifact or change boundary as input and can run independently.

### 8.2 Specs

Specs are reference material:

- requirements quality;
- API or CSS best practices;
- technical design guidance;
- test strategy;
- review heuristics;
- domain-specific standards.

An imported development guide is a draft starting point. When a team has a project-owned guide, its approved sections govern the applicable work. A draft section supplies a forward-looking default for new or touched code; the agent weighs it against repository evidence and records a consequential choice in the existing work contract. The guide must not cause a broad refactor or a new approval gate by itself.

A task references a spec only when that knowledge is relevant. Prefer the whole short document or one stable section. If a rule must be followed on every run, put it directly in the task instead of requiring an unconditional spec load.

Do not make consecutive tasks reload the same unchanged spec. Persist the decision or concise derived constraint that the earlier task obtained from it. Fine-grained section references help only when they reduce context; they must not become a reason to scatter procedure across many specs.

### 8.3 Templates

Templates define durable output structure and authoring guidance. They do not contain workflow, approval logic, retry behavior, pipeline routing, or tool instructions.

The task decides when to use a template. The template describes what a useful completed artifact contains.

### 8.4 Avoid duplication

Each rule has one authoritative home:

- procedure in a task;
- reusable knowledge in a spec;
- document shape in a template;
- product direction in this goals document.

Related resources may link to that authority but must not restate it in competing language.

### 8.5 Runtime economy

The default pipeline should load only:

- its current task instructions;
- the approved execution contract or durable work item;
- repository files needed for the current action;
- a knowledge spec or section only when the current work triggers it.

Avoid catalog-wide reads, repeated standards loads, mandatory companion-agent audits, and separate verification passes that repeat checks already completed. Deterministic schema and link validation should be automated cheaply. Independent review remains an optional capability for changes that benefit from a second perspective.

---

## 9. Verification and outcomes

Verification should be proportional to the change and grounded in observable evidence.

- Use repository-native commands and conventions.
- Record the exact command or manual observation, exact target revision, result, and useful counts.
- A skipped required check is not a pass.
- A check that does not apply is not a failure and does not require a human decision.
- Manual verification is valid when automated verification does not apply, provided the observation is concrete.
- A failed check is a failed check; do not mislabel it as a request for user input.
- Separate implementation completion from optional review and extended-verification status so later evidence does not erase earlier history.

The outcome vocabulary should be small but semantically complete. It must distinguish at least:

- work and required verification completed;
- work incomplete because a decision is needed;
- work or verification prevented by the environment;
- verification ran and found a defect.

Exact labels may evolve, but distinct situations must not be collapsed merely to reduce the number of outcomes.

---

## 10. Adoption and customization goals

A team should be able to:

- use only Work Item, Implement, and Delivery Record;
- add specification generation independently;
- add review independently;
- add extended verification independently;
- remove specification synchronization without changing implementation;
- replace a knowledge spec with its own engineering guide;
- simplify a template without rewriting task orchestration.
- adapt a compact development guide to its repository, approve relevant sections, and revise them later without changing pipeline procedure.

Customization should mainly involve replacing guidance, changing optional templates, or selecting pipelines. It should not require editing a web of exact-title references across the entire collection.

---

## 11. Non-goals

Agile SDLC is not:

- an ISO, regulatory, or process-compliance framework;
- a replacement for engineering judgment;
- a universal process for every team size and risk profile;
- a requirement to create every possible document;
- a mechanism for agents to push, merge, deploy, or perform destructive production actions without explicit authorization;
- a guarantee that self-verification replaces independent review for every change;
- an exhaustive stack-specific implementation handbook.
- a requirement to launch a companion agent or re-read the complete rule set before completing routine work.

---

## 12. Convergence tests

Every material iteration must be checked against these scenarios. A release is not ready when an ordinary scenario dead-ends, loses state, overwrites evidence, or introduces a mandatory artifact that does not resolve uncertainty.

Goal-completion claims require adversarial validation of the active templates, tasks, specs, and pipeline transitions without relying on this charter or a playbook to supply missing behavior. Exercise the smallest routine change, measure its actual instruction/context/output burden, and traverse cross-pipeline handoffs from persisted state. Schema checks, static searches, and read-through compliance are necessary but insufficient.

1. **Small defect:** Start from a short bug report, implement and test the fix, and produce one Delivery Record without another specification.
2. **UI or configuration change:** Proceed when no automated test applies, use a concrete manual observation, and do not report an unobserved pass.
3. **Database migration:** Surface migration and rollback risk, proceed after those decisions are approved, and do not stop again merely because a migration remains in scope.
4. **Authentication change:** Stop only for an unresolved access-policy or security decision; proceed when the intended policy and verification are established.
5. **Breaking contract:** Require an explicit compatibility or migration decision, then resume from that recorded decision.
6. **Repair:** Fix a build or test failure caused by the current change without entering a separately counted repair loop.
7. **Pre-existing failure:** Preserve it, avoid unrelated repair, and state how it limits verification.
8. **Resume:** Start the second task in a fresh agent context and recover the complete approved execution contract.
9. **Extended verification:** Append several unit, integration, end-to-end, or performance runs without overwriting earlier evidence.
10. **No extended suite:** Finish the optional pipeline as not applicable rather than requesting an unnecessary decision.
11. **Independent review:** Produce findings that can become a new Work Item without coupling review to implementation.
12. **Optional modules removed:** Delete review, extended verification, and spec synchronization; the default implementation path still works.
13. **Runtime economy:** Complete a routine change without reloading unchanged specs, launching a companion audit, or repeating checks that already produced sufficient evidence.
14. **Legible happy path:** A first-time technical user can follow a small defect from short request through preview, execution state, and delivery evidence, and can explain what changed and how it was verified.
15. **Legible hard stop:** A risk-sensitive change presents one concrete unresolved decision, shows why work is waiting, and resumes after the decision without stopping on the same condition again.
16. **Evidence drill-down:** Every claimed acceptance result can be traced to a command, concrete observation, repository fact, artifact, or stated verification limitation without exposing raw internal reasoning.
17. **True trivial fast path:** Complete a bounded low-risk one-line change with one three-line approval, no Work Item or Work Item-template dependency, and one Delivery Record in the SpecX document workspace; verify that interruption before recording does not claim cross-run recovery.
18. **Deterministic dirty revision:** Recompute a stored manifest across regular files, symlinks, submodules, missing paths, and untracked files; accept current HEAD equal to or descended from the stored base when all boundary identities and changed paths still match, ignore unrelated outside-boundary commits, accept committing exactly the implementation, and block on boundary drift.
19. **Zero-event stop:** Record an early blocked or needs_input implementation before checks without inventing a revision or event id; cite its durable Work Item decision or Originating Request.
20. **Interrupted sync:** Resume after interruption between a living-spec update and its event, append only the missing truthful event, skip completed targets, and block on ambiguous partial state.
21. **Predictable artifact placement:** Never create runtime work in an imported collection tree, including beside an existing runtime artifact there; preserve existing artifacts in place, keep separate Work Item and Delivery Record placements, and use durable artifact ids across later human folder moves without broad content scans.
22. **Project development guidance:** A fresh or brownfield change consults only applicable guide sections. A draft leads to a forward-looking, scoped decision; an approved project section is followed or a material exception is raised. The default path still works when bootstrap has not run.

---

## 13. Guardrails for future changes

Before accepting a change to the collection, answer:

1. Which user or agent problem does this solve?
2. Which convergence scenario demonstrates the problem and the improvement?
3. Does it add a new hard stop? If so, what unsafe or consequential decision makes the stop necessary, and how does the run resume after that decision?
4. Does it add a mandatory artifact or confirmation? What uncertainty does it resolve?
5. Is the rule placed in the correct resource type?
6. Is the same rule already stated elsewhere?
7. Is all state needed by the next task persisted explicitly?
8. Can optional capabilities still be removed independently?
9. Can a generic template express the output without invented or irrelevant sections?
10. Does the change reduce or increase the context an agent must load on every run?
11. Does it add another agent pass, repeated rule read, tool call, or verification step? If so, what unique risk or evidence justifies its token and latency cost?
12. Does the preview distinguish user-stated, repository-observed, agent-inferred, and unresolved decisions?
13. If two goals conflict, which item in the precedence order resolves the conflict, and is this the least costly design that satisfies it?
14. Can a user understand the preview, current state, evidence, and next action without knowing the internal pipeline structure?

If the answers are unclear, do not add the rule yet. Test the scenario first.
