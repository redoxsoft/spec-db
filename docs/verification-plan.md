# Execute and evaluate the guides locally

## 1. Prepare the test area

Use `/Users/dhaundiyal/src/verify` as the output root. Do not edit `spec-db`. Before and after validation, save `git status --porcelain` for `spec-db` and compare the two files.

Create this layout:

```text
~/src/verify/
  runbook.md                 # local rules given to pipeline subagents
  expected.json              # review subagents only; never shown to pipeline subagents
  tools/read-resource.py     # prints and logs only requested resource sections
  fixtures/{web,api,brownfield}/repo/
  cases/<case>/<repeat>/{repo,artifacts,state,logs}/
  cache/{npm,tmp}/
  results.jsonl
  report.md
```

Set `npm_config_cache` and `TMPDIR` under `verify` for every generated project. Prepare and commit each fixture repository before copying it into cases. Save its baseline commit SHA. The three repeated runs of a case must start from the same SHA and the same resource-file hashes.

## 2. Local pipeline contract

A coordinator runs one pipeline at a time as a pair of subagents.

1. One pipeline subagent executes every task in that pipeline, in `content.json` order, in a single session. It receives the pipeline `content.json`, the case request, the writable case directory, and the current artifact index. It opens each task file only when that task starts. The coordinator supplies a scripted answer only after the agent presents the relevant question or preview, and the same agent continues. Before the next task, the agent writes that task’s `state/<step-key>.json` and `logs/<step-key>.md`.
2. One review subagent starts after that pipeline subagent stops. It receives `expected.json`, plus that run’s logs, state, artifacts, and git output. It scores the run and appends one `results.jsonl` row per task. It writes those scores only to `results.jsonl`. It does not resume the pipeline, change the case repository, or edit `spec-db`.

The coordinator starts the review subagent only after the pipeline subagent has stopped, and starts the next pipeline only after that review is written. A `blocked`, `failed`, or unresolved `needs_input` outcome stops the pipeline subagent unless that task explicitly supports resuming with the scripted answer. The review subagent still scores the partial run.

The local protocol takes precedence **only** for SpecX storage mechanics:

| Task instruction | Local operation |
|---|---|
| Pipeline run context | Write the actual handoff to `state/<step-key>.json`; the next task reads that file. |
| Create or update a SpecX document | Create or update a Markdown file under `artifacts/`, shaped by the named template. Update `artifacts/index.json`, a map from exact document title to absolute file path. |
| Lookup by exact title or durable ID | Use `artifacts/index.json` or an explicitly supplied existing file path. The path is the local durable reference. |
| `folderId`, folder hierarchy, imported ancestry | Use and check the real local directory path for this rehearsal. Never invent a SpecX ID. Mark the platform-specific assertion `not exercised`. |
| SpecX workspace unavailable | The real local `artifacts/` and `state/` directories provide storage for this rehearsal. Block only if required local storage or state is unavailable. |

Every other task rule remains binding: applicability, approvals, status, permitted code paths, verification, evidence, and stop conditions. No agent may call SpecX MCP or write a fabricated tool response. The review subagent must not score MCP, SpecX IDs, or workspace placement as passed.

Use these artifact paths:

- Guide: `artifacts/Project Work/Standards/Project Development Guide.md`
- Work Item, Delivery Record, and Findings: `artifacts/Project Work/Work/<approved-subject>/<exact-document-title>.md`

For Markdown created from a template, render top-level outline nodes as H2, children as H3, and grandchildren as H4; place `<!-- key: ... -->` on each heading. Omit optional nodes that have no content. A guide section that is included must contain its keyed Adoption subsection with `Status` and `Applies to`.

Each `state/<step-key>.json` contains `outcome`, `reason`, the task’s actual `persistedHandoff`, local artifact paths, and a list of platform assertions not exercised. Preserve the fields named by the task; do not fill missing fields with guesses. Replace an artifact or folder ID field with an explicitly named `localArtifactPath` or `localFolderPath`, and have the next task use that field under this local protocol.

### Read boundary and audit

The pipeline subagent may read the pipeline `content.json`, the active task file, prior state and artifacts in this case, relevant repository files, and only resources directly requested by the active task. It may **not** read a later task before the current task’s state file is written, another pipeline, another collection, an earlier case, `expected.json`, goals, playbooks, or milestone notes.

The review subagent may read `expected.json`, this run’s logs, state, artifacts, and git output. It may not run tasks or call SpecX MCP.

`read-resource.py` must:

- print and log the exact bytes delivered to the agent;
- for a spec, support `--index` (H2 keys, titles, and `Applies to` lines) and `--section <key>` (one H2 section);
- for a template or task, print the requested file;
- append timestamp, task key, path, section key, and printed byte count to `logs/reads.jsonl`.

Repository inspection can use normal commands, but the pipeline subagent lists each repository path inspected in `logs/<step-key>.md`. Reading a whole development guide during an ordinary change, rereading it downstream, or reading the next task early is a test failure. Bootstrap may read Purpose and Adoption, the index, and its selected section bodies.

After completing a task, the pipeline subagent writes `logs/<step-key>.md` with its preview, supplied answer, commands and exit codes, files changed, and final handoff. The review subagent checks these files after the pipeline stops.

## 3. Fixed scenarios and responses

The coordinator keeps expected results in `expected.json` for review subagents. Give pipeline subagents the verbatim work requests below; do not tell them which guide sections the review expects.

### A. Fresh web: generator, bootstrap, implementation

Run `app-builder-react-vite-webapp` once into `fixtures/web/repo`. Answer display name **Guide Web**, give that absolute directory, and approve its write preview. Require actual lint, build, and test exit statuses. Commit the successful starter. If a required check fails, record the failure; do not change a dependency pin to rescue the scenario.

For each of three repetitions, copy that commit to `cases/fresh-web/<repeat>/repo`, with fresh `artifacts/` and `state/` directories:

1. Run `agile-sdlc-bootstrap-project-guide`. At its preview, approve Code Structure, User Experience, Styling, State and Data Flow, and Tests as **Approved**; accept Configuration and Diagnostics as **Draft** if proposed. Reject any unexplained API or Persistence section.
2. In a new pipeline subagent, run `agile-sdlc-implement` with subject **Catalog Filter** and this request: “Show Alpha, Bravo, Charlie, and Delta on the existing page. Add a `q` URL filter that matches names case-insensitively, updates the URL when edited, survives refresh, and shows `No matching items` for zero results. Add focused tests. Change only `src/features/catalog/**`, the necessary route or `App.tsx` files, and tests. Add no package.” Approve one preview only if it preserves that boundary and the stated behavior.
3. Require a Work Item, changed code, observed relevant checks, and a Delivery Record. Compare the three runs’ guide decisions and boundaries.

### B. Fresh API: generator and bootstrap

Run `app-builder-nodejs-api` into `fixtures/api/repo`. Answer **Guide API**, `fastify`, `sqlite`, and `long-running`; approve the write preview. Record actual install, build, test, and health-check results. Commit a successful starter.

Copy it to `cases/fresh-api/1/repo` and run bootstrap. At its preview approve Code Structure, API and External Boundaries, Persistence, and Tests; leave Configuration and Diagnostics Draft. The review expects UI, Styling, and interactive State sections to be omitted unless the agent cites concrete repository evidence.

### C. Fresh mobile: generator and bootstrap

Run `app-builder-expo-react-native` into `cases/fresh-mobile/1/repo`. Answer **Guide Mobile** and that absolute directory; approve its write preview. Record actual typecheck, lint, and test results. Do not start Expo or a simulator.

Run bootstrap in a new pipeline subagent. Approve User Experience, Styling, State and Data Flow, and Tests; leave Code Structure and Configuration Draft. Do not approve an invented backend, database, or server authorization convention.

### D. Prepare one deterministic brownfield fixture

Start from the committed API starter. A setup agent, **outside any tested pipeline**, adds a legacy `GET /legacy/items` route that reads SQLite directly in the route module. The fixture must satisfy these exact checks before it is frozen:

- `GET /legacy/items?limit=2` returns 200 with `{"items":["alpha","beta"]}`.
- `GET /legacy/items?limit=-1` currently returns 500, establishing the defect.
- A focused test proves both current observations; `npm test` and `npm run build` pass.
- A repository decision note says: preserve the successful route response; use the existing repository/service path for **new** data access; legacy direct queries may remain until touched.

Commit this fixture to `fixtures/brownfield/repo` and record its SHA. If these observations cannot be established, stop fixture preparation and report the blocker; do not substitute a different defect.

### E. Brownfield without bootstrap

Copy the brownfield commit to `cases/brownfield-draft/1/repo`. Leave `artifacts/index.json` empty. Run `agile-sdlc-implement` with subject **Legacy Limit Validation**:

> For `GET /legacy/items?limit=-1`, return HTTP 400 using the project’s error envelope with code `INVALID_LIMIT` instead of the current 500. Accept integer limits from 1 through 20; preserve the existing `limit=2` response. Change only the legacy route and its focused test.

Approve only a preview with those criteria and paths. Check that the agent uses applicable imported Draft guidance, records its forward-looking direction, runs the regression check, and leaves unrelated legacy code unchanged.

### F. Brownfield with project guidance and review

Make three independent copies of the unchanged brownfield fixture.

1. Run bootstrap. At its preview approve Code Structure, API and External Boundaries, Persistence, and Tests; leave Configuration Draft. In the accepted Persistence target, explicitly choose: **new database reads go through a repository module**. Keep the old direct-query route as a recorded adoption gap.
2. In a new pipeline, run `agile-sdlc-implement` with subject **Metadata Count**: “Add `GET /metadata/count` returning `{"count": N}`, where N is the number of rows in the existing `_scaffold_meta` table. Use the repository/service path and add tests for counts zero and one. Edit only the necessary app registration, route, controller, service, repository, and tests. Do not change `/legacy/items` or add a dependency.” Approve only that bounded preview.
3. In another new pipeline, run `agile-sdlc-review` on that implementation diff. Check its actual Findings document. A Draft preference alone cannot justify a blocking finding; an applicable Approved decision or concrete defect can.
4. In the first repetition only, rerun bootstrap to propose replacing the Approved Persistence target with “a small service may execute direct read-only SQL.” **Defer** that change and accept no other edits; the guide must remain byte-identical. Rerun and **accept** the same replacement; it must update the same file, preserve section keys, and create no duplicate.

### G. Trivial path

Copy the web fixture to `cases/fast-path/1/repo`. As fixture setup, add and commit `docs/usage.md` with `Run teh app.` Run `agile-sdlc-implement` with subject **Usage Typo**: “Replace `teh` with `the` in `docs/usage.md` only and verify the exact resulting line.” Approve its three-line preview. Require no guide read, no Work Item, and one Delivery Record with the observed text check.

## 4. Evaluate independently

After each pipeline subagent stops, its review subagent reads `expected.json`, task logs, state, artifacts, Git diffs, and command output. It writes one `results.jsonl` row per task with: case, repetition, pipeline, task, outcome, reads and emitted byte counts, artifact paths, repository diff paths, approvals, checks and exit codes, elapsed time, and platform assertions not exercised.

Score every assertion as **pass**, **fail**, or **not exercised**. An untested SpecX assertion cannot become a pass. Apply these checks in order:

1. **Isolation:** All deliberate writes are under `verify`; `spec-db` status is unchanged. Task order matches `content.json`. No task read a later task or forbidden resource. No SpecX MCP call or fabricated response occurred.
2. **Handoff:** Open each `state/<step-key>.json` and artifact. Confirm it was written before the next task started and that it contains the fields that task’s log shows it used. A missing persisted field is a failure even when the same pipeline subagent could have remembered the value.
3. **Repository and evidence:** Compare `git diff --name-only` with the approved boundary. Verify output behavior with the case’s exact commands and assertions. Match each claimed check to an observed command or concrete action and exit status. A claimed unobserved pass fails.
4. **Guide semantics:** Check applicable section selection, Draft versus Approved treatment, future target versus existing practice, unchanged unrelated code, deferred-revision preservation, and same-file accepted update. Inspect Findings for a blocking claim based only on Draft style guidance.
5. **Consistency:** After the review subagents finish all three fresh-web runs and all three guided-brownfield runs, the coordinator compares normalized section keys/statuses, target or exception, permitted paths, approval count, checks, artifact count, and stop outcome. All material entries must agree. Record wording and harmless code differences separately.
6. **Context cost:** Sum the exact resource bytes printed by `read-resource.py`, grouped as task, guide index/sections, other specs, templates, and persisted state. Report guide bytes and guide-basis bytes per task and pipeline, plus host token usage if exposed. Label byte counts as a context proxy, not measured tokens. Bootstrap is a separate one-time cost. **Fail** a generator or trivial run that reads the guide, or a downstream task that rereads an unchanged guide. Report the measured overhead without an arbitrary percentage pass threshold.

The coordinator writes `report.md` from the review rows. It contains the case-by-case result, evidence file paths, material differences, cost table, and a separate list of SpecX-only assertions not exercised. Resource defects go in the report for a later correction pass; this validation does not edit collection resources.

## Assumptions

`~src/verify` means `/Users/dhaundiyal/src/verify`. Local files replace document storage for this rehearsal only. Each tested pipeline is one pipeline subagent followed by one review subagent. Fixture setup stays outside that pair. The result can establish whether the authored task decisions and handoffs work locally; it cannot establish SpecX MCP or workspace behavior.
