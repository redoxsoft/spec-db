# Agile Technical Design Standards

## Technical Design Quality Bar <!-- key: quality-bar -->

A technical design is the engineering contract between requirements and code. It is concrete enough to implement without guesswork, and short enough for a person to review.

### Principles <!-- key: principles -->

1. **Concerns over a fixed layout.** The design addresses the technical concerns, failure modes, and boundaries that matter. It is not bound to one syntactic layout.
2. **Relevant concerns only.** Describe the approach, boundaries, and consequential decisions that make the design understandable. Data, migration, API, security, operational, and non-functional detail exists only when the work affects that concern.
3. **Grounding.** The design says where its choices come from: direct inspection of the target codebase, the repository's own conventions, or greenfield assumptions.
4. **Brownfield realism.** In an existing repository, the design follows discovered conventions — package manager, patterns, linters — rather than a greenfield ideal.

### Traceability <!-- key: traceability -->

The design maps upstream behavior to concrete components, so scope stays attached to the requirements:

`Feature behavior or AC-xxx` -> `owning component or interface` -> `key files and the scope of the change`.

## Architecture Decision Records <!-- key: adr-standards -->

### When to Record a Decision <!-- key: when-to-write-an-adr -->

An `ADR-xxx` records a consequential trade-off: adopting a library, choosing a storage pattern, introducing a cache, or changing a core design pattern. Trivial or obvious implementation details do not need one.

### What a Decision Record Contains <!-- key: adr-content -->

Each `ADR-xxx` documents:

- **Identifier and title.** For example, `ADR-001: Use SQLite for local persistence`.
- **Status.** `[PROPOSED]`, `[ACCEPTED]`, or `[SUPERSEDED]`. A new record starts as `[PROPOSED]` unless the team has already accepted the decision, or the record cites an existing one.
- **Context and problem.** What forces the choice, and which constraints matter: performance, complexity, timeline.
- **Decision and rationale.** What was selected, and the technical merits.
- **Alternatives considered.** Which viable approaches were rejected, and why.
- **Consequences.** The benefits gained, and the complexity or operational cost accepted.

## Component Boundaries <!-- key: component-boundaries -->

The solution decomposes into components or subsystems. For each one, the design states:

1. **Responsibility.** The domain concern it owns.
2. **Interface.** The public functions, classes, or endpoints it exposes.
3. **Collaborators.** The other components or external services it calls.
4. **Failure modes.** Behavior when a dependency fails or times out: fallback, error envelope, retry, or fail-fast.

Components may be written as sections, type definitions, or a short flow diagram, whichever a reader can scan.

## API Contracts <!-- key: api-contracts -->

Include this when the work introduces or modifies an HTTP, RPC, or messaging endpoint. Each contract states:

1. **Endpoint and method.** The path, such as `POST /api/v1/projects`, and the verb or RPC method.
2. **Purpose.** What the endpoint does.
3. **Authentication and authorization.** The credentials and permissions it requires.
4. **Request schema.** Field names, types, validation rules, and which fields are mandatory.
5. **Success response.** The status, such as `200 OK` or `201 Created`, and the payload structure.
6. **Errors.** How errors are communicated, including relevant statuses (`400`, `401`, `404`, `409`, `422`) and the error payload.
7. **Idempotency and concurrency.** Whether a mutating operation supports an idempotency key or an optimistic concurrency check.
8. **Compatibility.** A change to an existing published contract is additive by default: new request fields are optional, existing fields keep their meaning, and no field is renamed, removed, or reused for a new meaning without a migration path for current callers. A new version is a last resort for a break that cannot be avoided. The design names the success and failure behavior existing callers rely on and states whether the change preserves it.

JSON examples, OpenAPI fragments, or type definitions are all fit, as long as a person and a test can read the contract the same way.

## Schemas and Migrations <!-- key: schemas-and-migrations -->

Include this when tables, collections, or other persistent schemas are created or modified. The schema in the design is the data contract. Tables, fields, and migrations are specified there so implementation does not invent them ad hoc.

1. **Entity definitions.** Table or collection name, field names, data types, nullability, defaults, primary keys, and foreign keys.
2. **Indexing and query paths.** Which indexes exist, and which access patterns they serve.
3. **Expand, then contract, for production tables.**
   - Expand: add new columns as nullable or with a safe default, and write both the old and the new shape.
   - Backfill: migrate legacy rows asynchronously when they need a new value.
   - Contract: remove old columns only after every consumer has moved.
   - A column rename or a destructive drop does not ship in the same deployment as the application upgrade that depends on it.
4. **Rollback.** Every forward migration has a down migration or a recovery script.
5. **Locks.** High-volume tables note how the migration avoids a long lock, for example by creating an index concurrently in Postgres.

## Brownfield Safety <!-- key: brownfield-safety -->

### Grounding in the Repository <!-- key: repository-grounding -->

A design for an existing codebase reflects that codebase:

- The toolchain matches the repository's package manager (`package.json`, `pnpm-lock.yaml`, `go.mod`, `pyproject.toml`, and their equivalents). The design does not mix package managers.
- The structure follows the existing layout and patterns, such as ports and adapters, a modular monolith, or MVC.
- Lint rules, naming, and file structure follow the conventions already in the repository.

### Scoping Zones <!-- key: isolation-zones -->

Three zones are advice for describing the scope of a change in an existing codebase. They name which files the change includes.

- **Primary targets.** Files created or directly modified for this change. New behavior and its tests live here.
- **Wiring.** Existing shared files touched only to connect the new capability. Changes here stay backward-compatible.
- **Leave alone.** Shared infrastructure, connection pools, and legacy code outside the feature. The design names this code so the scope stays visible and the change does not wander into it.

Edits that only reformat, reorder imports, or modernize unrelated files sit outside the scoped change.

## Non-Functional Constraints <!-- key: non-functional -->

Include this for performance-sensitive, security-critical, or high-throughput work.

- **Latency and throughput.** Concrete budgets where they apply, such as p95 under 200ms at 200 requests per second.
- **Concurrency and state.** How shared resources are isolated: mutexes, row locks, or optimistic concurrency.
- **Secrets and inputs.** No hardcoded secrets. Secrets load from the environment or a vault. Inputs are parameterized so they cannot be injected.
- **Observability.** The metrics that matter (counters, latencies) and what structured logs are expected to contain.

## Unresolved Questions <!-- key: uncertainty -->

Unresolved technical points stay tagged. They are not filled in as if they were decided.

- `? [NEEDS_INPUT]` is an architectural question a person still has to answer.
- `* [PROPOSAL]` is a recommended option the team has not accepted.
- `! [HYPOTHESIS]` is a technical assumption that still needs a spike or a verifying test.

A proposal or a hypothesis is not treated as an accepted decision until a person confirms it, or a check confirms it.
