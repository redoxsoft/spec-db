# App Builder goals

This document is the durable product charter for the App Builder collection. It defines what we are building, why it exists, and the principles future iterations must preserve.

Implementation plans, playbooks, specs, and pipelines may change. When they conflict with this document, this document wins. Change these goals only when the product direction intentionally changes, not to justify an implementation that drifted.

The authoring contract is [app-builder-playbook.md](app-builder-playbook.md). Resources outside the `app-builder-*` namespace are out of scope.

---

## 1. Product promise

App Builder helps a person go from “I need a starter” to a clean, opinionated, hello-world project that actually runs.

Each generator pipeline scaffolds one kind of application: a website, a frontend web app, a full-stack web app, a standalone API, or a mobile app. The caller answers a short list of numbered choices. Everything else is already decided: language, layout, tooling, dependency pins, lint, one test, and the checks that prove the starter.

App Builder App Selector does not scaffold. It asks intent questions, confirms one generator, and starts that generator. Name, directory, and remaining stack choices stay in the selected generator.

The result is a production-shaped blank project, not a feature. It has the repository hygiene, directory boundaries, and health or hello-world surface that later work should extend. It does not include authentication, payments, a CMS, analytics, or a deployment.

The collection also ships a draft project development guide for the work that follows the starter. A team may adapt it to its repository through a separate, optional bootstrap; the generator still produces only its approved starter directory.

### 1.1 Day-0 floor

These decisions are locked in the contracts. Agents copy them. They do not ask the user, invent a version, or skip a required check.

- **Complete pins.** If a starter installs packages, its contract `context` section has a complete version table for every package that starter writes. Agents copy those specifiers. They do not write `latest` and they do not invent a version that is not in the table. A generator that installs packages and has no table is unfinished.
- **Lint, one test, and the compile bar.** Every starter that has a toolchain includes lint, one smoke or health test, and the build or typecheck that starter already runs. Verify observes those commands. A lint script named only in a README does not count. Plain HTML has no toolchain and is the exception: file checks replace lint, test, and build.
- **First-pass configuration.** Scaffold configs should pass the required checks without predictable repair; verify observes the same baseline commands as CI.
- **One Node check.** Every starter that needs Node requires `^20.19.0` or `>=22.12.0`. Node 21 is not accepted. Plain HTML does not run this check.
- **One SQLite driver for Node.** Node starters that select SQLite pin `better-sqlite3` `12.11.1`.
- **Flat ESLint.** JavaScript starters write ESLint flat config. They do not write a new `.eslintrc` file.
- **Standards cut.** Each standard marks day-0 rules as binding for the hello-world tree and later rules as non-binding. A later sentence is not implemented and is not a reason to stop.

A person should be able to pick a generator, or be routed by App Builder App Selector, confirm one preview, and receive commands that were actually run plus the commands they run next.

---

## 2. Overall goals

### 2.1 Produce a runnable starter

The primary measure of success is a project under the approved directory whose required checks passed.

- The visible entry shows the approved name.
- The chosen stack is the stack that was written. A plain site has no bundler. A Vite site has Vite. Fastify is not mixed with Express.
- Verification is an observed command or a concrete file check. A checklist item is not a pass until it was evaluated.
- Hello-world scope is the product. Extra features are a failure of scope, even when they build.

### 2.2 Make the choice list understandable

A person should see what is still open and what is already decided.

- Ask with numbered choices and a recommended default when a real option exists.
- Ask one question at a time, then confirm the full set once.
- Generators with no stack choice ask only for the name and the directory.
- Use ordinary words: site name, build tool, database, how it should run. Avoid internal workflow language.
- Show the derived values, such as a Flutter package name, in that same confirmation.
- When a file this starter will write already exists, that same confirmation is also the overwrite decision. Unrelated files in the directory do not add a question.

### 2.3 Make execution predictable for agents

Agents are the operators of the pipelines. Instructions should let them collect choices, check the machine, write files, and repair their own scaffold.

- Every task contains the complete procedure it must execute.
- The approved name, directory, and choice tokens are persisted explicitly. A later task must not depend on the earlier conversation.
- Agents branch only on the approved tokens.
- Agents copy the pinned versions from the generator contract. They do not upgrade them to get a green build. They do not invent a specifier the table omits.
- Every generator that needs Node uses the same Node check from section 1.1. Every Node starter that selects SQLite uses the same `better-sqlite3` pin from that section.
- Agents create and modify project files only inside the resolved approved directory. A symlink or path that resolves outside that directory is not a legal write.
- Agents replace an existing file only when the preview listed that path and the user granted overwrite. Files this run created may be repaired. Every other existing file stays.
- The same choices and machine should lead different capable agents to the same topology, pins, and checks. Wording of a tagline and modest styling may vary inside the contract’s creative leeway.

### 2.4 Keep the pack modular

Nine generators share three day-0 architectural standards, one optional guide for later work, and the day-0 floor in section 1.1. They are otherwise independent. Removing one generator must leave the others runnable. App Builder App Selector lists all nine generators and is updated in the same change when that inventory changes. The shared floor is Node, SQLite driver, ESLint shape, lint, one test, and complete pins, not identical product trees.

The collection is also an example of how Spec DB resource types divide work:

- **Pipelines** contain intake, checks, file writes, repair, and handoff.
- **Specs** contain reusable standards and the per-generator contract: legal tokens, topology, pins, output contract, and verification checks.
- **Templates** are absent. The output is a directory of code, not a SpecX document.

These responsibilities must not be duplicated across resource types.

### 2.5 Treat token cost and execution time as product requirements

A scaffold that reloads every standard, re-asks approved choices, or installs unrelated frameworks is not successful.

- The discover task asks from its own instructions. Those questions are a projection of the contract’s choice tokens, checked when the resources are authored. Discover does not open a spec at runtime.
- The preview reads the contract topology, and nothing else, to list the paths this starter will write.
- A writing or verify task reads the contract sections and the one standard it needs for the current action.
- Persist the approved tokens so later tasks do not reconstruct the interview.
- Prefer one repair of a failure this run caused over a second agent repeating the same analysis.
- Do not require a companion agent.

### 2.6 Make the run legible

A first-time user should be able to answer:

1. Which starter did I ask for?
2. Which choices were confirmed?
3. Where will the files be written?
4. What was created, and which checks passed?
5. What do I run next?

The default experience exposes three concise moments:

- **Intake and preview:** name, directory, choices, derived values, toolchain result, and, when a planned path already exists, one overwrite decision.
- **Execution state:** asking, checking, waiting, scaffolding, wiring, verifying, or blocked, plus the current action.
- **Handoff:** path, stack actually written, commands that passed, commands for the user, and limitations.

The collection does not require a particular host interface. The pipelines must carry enough structured information for any host to present these moments.

### 2.7 Resolve goal conflicts consistently

When goals appear to conflict, apply this order:

1. **Truth and irreversible safety:** do not fabricate a passing check, write outside the resolved approved directory, replace or delete an existing file the user did not approve, or deploy, publish, push, tag, or merge.
2. **Approved choices and the output contract:** write the stack that was confirmed, at the pinned versions, with the required landmarks.
3. **Forward progress:** among safe and correct options, repair a failure this run caused and continue.
4. **Hello-world simplicity:** choose the smallest starter that satisfies the contract.
5. **Runtime economy:** among materially equivalent designs, prefer fewer tokens, reads, tool calls, tasks, and waits.
6. **Polish:** improve copy or styling only inside the contract’s creative leeway.

Higher items do not justify extra product scope. A green build does not justify a new dependency, a weaker test, or an authentication feature.

When two goals still conflict:

1. Name the concrete scenario and the two goals in tension.
2. Identify the first item in the precedence order that distinguishes the options.
3. Choose the least costly option that satisfies that higher-priority goal.
4. Preserve the rejected concern as an advisory when useful.
5. Add or update a convergence test if the conflict could recur.

---

## 3. User goals

Users should be able to:

1. Start from a generator name and a sentence of intent.
2. Answer only the choices that generator actually has.
3. Accept a recommended default without designing a stack.
4. See one preview of name, directory, choices, toolchain, and any overwrite decision before any file is written.
5. Keep unrelated files in that directory. Be asked only when this starter would replace a file that is already there, and answer that once.
6. Be told when the machine cannot do the work, and what to install.
7. Receive a starter whose lint, test, and build or typecheck were actually observed when that starter has a toolchain. Plain HTML uses file checks.
8. Receive the local run commands, without the agent deploying or opening a store listing.
9. Adopt one generator without taking the other eight.

The system must not require users to know contract section keys, handoff field names, or which standard file a task reads.

---

## 4. Agent goals

An agent should always be able to answer:

- Which generator am I running?
- Which choice tokens were approved?
- Which directory may I write?
- Which contract sections define the tree, the pins, and the checks?
- Which failures may I repair, and which require a person or a different machine?

### 4.1 Ask only for open choices

Before asking, use the generator’s fixed decisions. Do not ask the user to pick a package manager, a linter, a test runner, a directory layout, or a platform when the generator has already fixed it.

Distinguish:

- **User-stated:** name, directory, and any numbered choice the person selected.
- **Derived:** values computed from those answers, such as a package slug or Flutter package name.
- **Machine-observed:** toolchain versions, and which planned paths already exist.
- **Unresolved:** a missing required choice, an unsupported combination, or a planned overwrite that has not been approved.

Only unresolved items require a question. Present the recommended default with the choice.

### 4.2 Expected autonomy

After the single approval, an agent should continue without asking about:

- file contents that the contract already specifies;
- which pinned version to write;
- creating the conditional files that follow from the approved tokens;
- installing dependencies and running the generator’s verify commands inside the approved directory;
- replacing a planned path after overwrite was granted in the preview;
- repairing a failure caused by the files this run wrote, without changing pins, tokens, or hello-world scope.

This is not permission to satisfy the check by weakening it, skipping it, or adding a product feature.

### 4.3 Repair behavior

Repair is part of verification, not a counted loop.

Continue while the evidence supports a concrete change that stays inside the approved directory and the approved paths, and that can address the failure. The repair:

- preserves the approved tokens and pinned versions;
- preserves the meaning of the verification checks;
- may edit files this run created, and planned paths only after overwrite was granted;
- does not replace or delete any other existing file;
- does not hide a missing toolchain as a successful scaffold.

Stop when no such change remains, or the same failure returns with no new evidence. Also stop when the next change would leave hello-world scope, mix stacks, upgrade a pin, weaken a required check, or when the failure is a missing tool or an unavailable service the contract says is acceptable. Report the unresolved check and why repair stopped. There is no attempt counter and no execution budget.

### 4.4 Durable task handoff

Tasks pass run memory through pipeline context. Each value is a short string. Pipeline context does not hold file contents, command logs, or the planned path list.

Task 1 writes the collected intake. Task 2 writes the approved scaffold after checks and the single confirmation. `inputVarDefinitions` are caller-variable hints, not internal state, and stay empty.

The approved scaffold includes:

- display name and exact target directory;
- every choice token and every derived value;
- a short toolchain result;
- `overwrite` as `not-needed` or `granted`;
- status `approved`.

Later tasks reload those strings and name any missing field. They re-read the contract tree for paths. They must not re-ask an approved choice or an approved overwrite. They must not rely on unstored details from the prior conversation. A new preview is required only when the directory, the tokens, or the overwrite grant changes before any write.

---

## 5. Hard stops and outcomes

### 5.1 Hard stops

Stop for a person only when proceeding would require an undecided consequential choice:

- A required choice was not answered.
- The combination is unsupported. SQLite together with serverless is unsupported on the generators that offer both. Ask for a legal pair. Write nothing until one is approved.
- A path this starter will write already exists. The preview asks once for blanket permission to overwrite the files this starter needs, or for a different directory. Cancel writes nothing. Unrelated files do not raise this question and are left in place. Flutter is the exception: `flutter create` writes a platform tree the contract does not fully list, so any file already in that directory requires the same single blanket permission for the directory.
- The target directory is inside the imported App Builder collection, or a planned path resolves outside the approved directory. Ask for a different directory. Write nothing there.

Once a decision is recorded, the same condition must not stop the resumed run again. Later tasks do not open a second approval.

### 5.2 Environmental blocks

Stop as blocked when the required toolchain is missing or too old, or the directory cannot be written. Name what is missing and which action it prevents. Do not create project files, and do not install the missing toolchain, a global tool, or a host configuration change.

An environmental block is not a product choice. PostgreSQL being unreachable is not, by itself, a failed scaffold when the generator’s contract says the process must still boot and the live check must pass.

### 5.3 Conditions that should not stop the run

Do not stop solely because:

- the generator has several conditional files;
- a later (Day-2) sentence in a standard describes a feature this hello-world starter does not include;
- a tagline or accent color was not specified;
- the user did not ask for a git commit.

Record a limitation when it helps the handoff. Do not open a second approval for it.

### 5.4 Outcomes

Use only these outcomes, each with a one-line reason:

- `done` — the required checks passed and a starter was written, or the user cancelled before any file was written. The reason states which. A cancellation says that no starter was produced.
- `failed` — a required check ran and did not pass, and repair stopped because no concrete in-boundary change remained or the same failure returned with no new evidence.
- `needs_input` — an unresolved choice, an unsupported combination, or an overwrite-or-other-directory decision is waiting on a person.
- `blocked` — the toolchain or write access required for this generator is unavailable. The agent does not install that toolchain.

A skipped required check is not `done`. A check the approved tokens make inapplicable is not `failed`.

---

## 6. What gets written

The only user-facing filesystem deliverable is the starter directory. Pipeline context and the user-facing handoff are not written as a report beside the starter.

- Create and modify project files only inside the resolved approved directory. Do not follow a symlink or other path that resolves outside it.
- Contract-required commands may use normal tool caches and temporary storage. They must not install global or missing toolchains, modify host configuration, or change unrelated projects.
- Refuse a directory inside the imported App Builder collection, whatever that folder is named on disk.
- After the choices are known, compare the contract tree with the directory. If none of those paths exist, write the starter and leave every other file alone. If any exist, one preview asks for blanket overwrite of the files this starter needs, or for a different directory. The decision is stored as the short string `overwrite`. Later tasks re-read the contract tree and may replace an existing planned path only when `overwrite` is `granted`. They do not ask again.
- For Flutter, the directory is the write unit. An empty directory needs no overwrite question. Any file already there needs that one blanket permission, because `flutter create` is not limited to a closed path list.
- Do not delete an existing file that this starter is not replacing under an approved overwrite.
- Do not deploy, publish, submit to a store, run `docker build`, push, tag, or merge.
- Run git operations only when the user explicitly asks in the current run. The handoff must not claim the project was committed, deployed, or submitted.

Workspace folder layout for SpecX documents is out of scope. The user’s chosen directory is the destination.

---

## 7. Resource design rules

### 7.1 Pipelines

Pipelines contain the workflow: questions, the single confirmation, toolchain checks, file creation, wiring, verification, repair, and the handoff.

The nine generators do not launch another pipeline. The split frontend-and-API generator is one pipeline that writes both trees. App Builder App Selector is the only exception: after the confirmation in its interview, it may start one generator by that generator’s exact catalog title. It does not write a starter. Nested `type: "pipeline"` steps remain forbidden.

### 7.2 Specs

Two kinds of spec exist.

**Standards** state shared architecture for web, API, or mobile projects: topology, data flow, layering, resilience, and the quality bar. Day-0 sentences are binding for the hello-world tree. Later sentences describe what a project of that kind should grow into. They do not name a pipeline step or tell an agent when to ask a question.

The project development guide collects concise, editable defaults for later work across these project kinds. It does not add a generator choice, change a contract's pins or checks, or require a generator task to load another standard. The existing web, API, and mobile standards remain the authority for their day-0 rules.

**Contracts** state one generator’s legal tokens, version pins, directory tree, output landmarks, design tokens, and verification checks. They are the authority a scaffold, wire, or verify task consults. They do not contain the interview script, the approval gate, or the repair procedure.

A task reads a spec only for the section it is about to apply. If a short rule must be followed on every run of a task, that task states the rule itself. The discover task’s numbered choices are a projection of the contract’s choice tokens. Authoring checks that the two agree. Discover does not open the contract to do that.

### 7.3 Templates

This collection has no templates. A future template would be justified only by a new durable document the user asked to keep. A starter directory is not that document.

### 7.4 One authority

- Procedure lives in a task.
- Shared architecture lives in a standard.
- A generator’s tree, pins, and checks live in its contract.
- Product direction lives in this document.

Related resources may point at that authority. They must not restate it in competing language.

### 7.5 Runtime economy

Each task loads only:

- its own instructions;
- the short pipeline-context strings it needs;
- the contract sections for the files or checks it is about to write or evaluate;
- at most one standard, and only the sections the source generator already cited for that kind of work.

Discover loads none of the specs. The preview loads the contract topology and does not load a standard. Avoid reading all three standards on any path.

---

## 8. Verification

- Run the commands the contract names for the approved tokens.
- Record the command, the exit status, and a short result. Keep raw logs out of the handoff; the user can inspect the terminal.
- A required check that was not run is not a pass.
- A check that does not apply to the approved tokens is not a failure.
- When the contract allows a degraded dependency, such as PostgreSQL refusing connections while the live probe passes, report that limitation and do not mark the scaffold failed.
- `failed` means a required check failed. Do not relabel it as a request for input.

Catalog validation (`npm run check`) proves the resources are well formed. It does not build the starters. Reading tasks and specs can confirm the day-0 floor is written into the contracts. It cannot prove a starter builds. Proof that a generator emits a compiling project remains a pipeline run that records exit codes. Do not add a user question or a second approval to get that proof.

---

## 9. Non-goals

App Builder is not:

- a feature, authentication, billing, or content-management generator;
- a deployment, hosting, or store-submission pipeline;
- a SpecX document workflow with templates and delivery records;
- a place to upgrade framework majors during a port;
- a guarantee that later (Day-2) architecture sentences are implemented in the hello-world tree; those sentences are non-binding and must not stop a run;
- a requirement to launch a companion agent or reload every standard before writing files.

---

## 10. Convergence tests

Every material iteration must be checked against these scenarios. A release is not ready when an ordinary scenario writes the wrong stack, writes outside the directory, claims an unobserved pass, or re-asks an approved choice.

Reading the active tasks and specs confirms that pins, trees, checks, and the day-0 floor are written. That reading is not proof that a starter builds. Proof remains a pipeline run that records exit codes. A contract that installs packages and has no version table is unfinished.

1. **Plain static site:** Choose plain HTML. The tree has no package manager, and the page shows the site name.
2. **Vite static site:** Choose Vite. The contract has a complete pin table. `npm run lint`, `npm test`, and `npm run build` exit 0, and plain-HTML files are absent.
3. **Fixed stack:** Run the React + Vite generator or Expo generator. The only questions are name and directory.
4. **Flutter package name:** The package name is derived, shown in the preview, and no iOS-versus-Android question is asked.
5. **Unsupported cell:** Choose SQLite and serverless on a generator that offers both. No files are written. After a legal pair is chosen, the run continues from that decision.
6. **Planned-path collision:** A directory that contains only unrelated files does not raise an overwrite question, and those files remain. A planned path that already exists is decided in the one preview: blanket overwrite of the paths this starter needs, or another directory. Cancel finishes `done`, writes nothing, and the handoff says no starter was produced. Proceed replaces only the approved paths. Flutter treats any file already in the directory as this case, because `flutter create` has no closed path list.
7. **Imported collection:** A target inside the imported App Builder tree is refused before any write.
8. **Fresh scaffold task:** Start the scaffold task with only the pipeline-context strings. It does not re-ask tokens or overwrite permission, and it branches on the tokens.
9. **Honest failure:** A required build that still fails is `failed`, with the command and exit status, and is not described as a pass.
10. **Repair boundary:** A failure caused by this run is repaired inside the directory without upgrading a pin or adding a business feature. Repair stops when no concrete in-boundary change remains, or the same failure returns with no new evidence, and the outcome names that reason.
11. **No remote side effects:** The run does not deploy, push, tag, merge, or build a container image.
12. **Optional database down:** PostgreSQL unreachable follows the contract’s live-versus-ready rule and is not automatically `failed`.
13. **Runtime economy:** Discover completes without opening a contract or a standard. The preview reads the contract topology and does not read a standard. No task opens all three standards.
14. **Independent generators:** Remove one generator pipeline directory and its contract. Every remaining `relatedSlugs` entry among generators, contracts, and standards still resolves. App Builder App Selector lists all nine generators and is the exception; that inventory change updates its `relatedSlugs` in the same change.
15. **Legible handoff:** A first-time user can point to the directory, the choices, the checks that passed, and the next command without reading an agent transcript.
16. **Path escape:** A target directory, or a planned path under it, that resolves outside the approved directory is refused before any write.
17. **Stale approval:** Changing the directory or the choice tokens before writing invalidates the previous overwrite grant. The run shows one new preview and does not ask again from a later task.
18. **Intake agreement:** The discover task’s options and defaults match the contract’s choice tokens. That check is done while authoring, not by opening the contract during discover.
19. **Day-0 floor:** Every toolchain starter’s contract has a complete pin table, lint, one test, and the pack Node check from section 1.1 when Node is required. JavaScript starters use ESLint flat config. Node SQLite uses `better-sqlite3` `12.11.1`. Plain HTML has none of those.
20. **Later guidance stays optional:** Importing the draft project development guide adds no question, file, check, or standard read to a generator run. Its guidance can be adapted after the starter is handed off.

---

## 11. Guardrails for future changes

Before accepting a change to the collection, answer:

1. Which user or agent problem does this solve?
2. Which convergence scenario demonstrates the problem and the improvement?
3. Does it add a question or a stop? Which undecided choice or missing tool makes that necessary?
4. Does it add a file, dependency, or feature to every starter? Which contract check requires it?
5. Is the rule in a task, a contract, or a standard, and nowhere else?
6. Is every short string the next task needs present in pipeline context, with no file contents or path list stored there?
7. Can one generator be removed without breaking the others?
8. Does the change increase the context loaded on discover or on a no-choice generator?
9. Does it upgrade a pin? If so, the port is no longer a faithful import.
10. Can a user understand the preview, the directory, the evidence, and the next command without internal keys?

If the answers are unclear, do not add the rule yet.
