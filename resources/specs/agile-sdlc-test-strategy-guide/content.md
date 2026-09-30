# Agile Test Strategy Guide

## Test Strategy <!-- key: test-strategy -->

A test strategy says how an implementation is verified. It balances rigor with the cost of the suite. The plan chooses levels, risks, and critical scenarios. Assertions and fixtures live in code.

### Principles <!-- key: principles -->

1. **Tests live in code.** Assertions, mocks, steps, and fixtures belong in the executable suite (`*.spec.ts`, `test_*.py`, and the repository's equivalents), not in a markdown table.
2. **Strategy lives in the plan.** The plan holds the distribution across levels, the critical risk scenarios, and the coverage matrix.
3. **Markdown holds a summary.** A specification records a short account of a run. Raw execution traces stay with the test report or the continuous-integration run.

## Test Levels <!-- key: test-levels -->

Testing is spread across five levels so the suite does not become an inverted pyramid of slow end-to-end checks.

```text
               +-------------------------+
               |    PERFORMANCE / LOAD   |  Latency, throughput, and resource checks
               +------------+------------+
                            |
               +------------v------------+
               |       END-TO-END        |  Critical user journeys only
               +------------+------------+
                            |
               +------------v------------+
               |   COMPONENT / CONTRACT  |  API schemas, boundaries, event contracts
               +------------+------------+
                            |
               +------------v------------+
               |       INTEGRATION       |  Service plus local database or cache
               +------------+------------+
                            |
               +------------v------------+
               |          UNIT           |  Pure logic, in memory
               +-------------------------+
```

1. **Unit (`UNIT`).** Isolated functions, classes, data transforms, and pure domain logic. In memory only: no network, disk, or real database. Each test is fast, on the order of a few milliseconds.
2. **Integration (`INT`).** Interactions between components, or with local ephemeral infrastructure such as SQLite, a local cache, or a test database. Hermetic local state. This level checks queries, repository layers, and wiring.
3. **Component and contract (`CONTRACT`).** Public HTTP or RPC contracts, message schemas, and external client boundaries. Schema validators or mock servers check payloads against OpenAPI or JSON Schema.
4. **End-to-end (`E2E`).** Critical user journeys across the full stack, in a staged or containerized environment with seeded data. Kept few, because this level is where flakiness is expensive.
5. **Performance (`PERF`).** Hot paths, batch jobs, and high-concurrency endpoints, in an isolated harness that measures latency percentiles (p50, p95) and throughput.

### Choosing a Level <!-- key: choosing-a-level -->

Choose the lowest level that can observe the behavior under test:

- Pure logic is a unit test.
- A query, a repository, or local infrastructure is an integration test.
- The shape of a public payload or event is a contract test.
- A critical user journey across the stack is one of a few end-to-end tests.
- Latency or throughput of a hot path is a performance test.

Depth then follows the risk of the flow, in the next section. A display-only change does not inherit the suite of a payment change.

## Risk-Based Coverage <!-- key: risk-coverage -->

Coverage depth follows business risk and blast radius.

- **Critical flows** (money movement, authentication, core data):
  - Unit coverage of domain logic and edge cases.
  - Integration coverage of database queries, transactions, and rollback paths.
  - Contract checks for public interfaces.
  - One golden-path end-to-end scenario.
- **Standard flows** (core features, ordinary create-read-update-delete, internal APIs):
  - Unit coverage of primary logic, branches, and edge cases.
  - Integration coverage of persistence and external adapters.
  - Schema checks on modified endpoints.
- **Low-risk flows** (internal tools, display copy, administrative views):
  - Repository-native verification relevant to the changed behavior. Unit tests cover non-trivial logic when present. A concrete manual observation or an explicit not-applicable reason can be sufficient for display, copy, documentation, or simple configuration changes; an integration smoke check is used only when it observes a relevant boundary.

## Test Data <!-- key: test-data -->

1. **Each test is independent.** No shared mutable state leaks between tests. Temporary files are isolated. Database work rolls back, or the test uses its own database.
2. **Fixtures are synthetic.** Factories and deterministic seeds produce the data. Production data and customer personal data are not fixtures.
3. **Waits have a condition.** Synchronization uses a condition poll with an explicit timeout. A fixed multi-second sleep is not a synchronization strategy.

## Evidence <!-- key: evidence -->

> [!IMPORTANT]
> Evidence of a pass is the command that ran, its exit code, and the counts of total, passed, and failed tests. A required test that was skipped or omitted is not a pass. The existence of a test plan or a test file is not a pass.

A compact summary also includes, when they are known, the commit that was tested, the date, who or what ran the command, and how long it took. The summary may point at the full report (a test-results file or a continuous-integration run). It does not contain the report.

- Raw terminal output, stack traces, and shell history stay out of markdown.
- A test that does not apply to this change is recorded with the reason it does not apply (a disabled flag, or a platform the change does not target). That note is not a pass, and it is not a failure of an in-scope requirement.
- A required test that cannot be executed because the environment is missing is not a pass.
- Evidence results distinguish `passed`, `failed`, `not-applicable`, and `blocked`. A failed run is evidence of a defect, not a request for a decision.
- When a run fails and a later run passes, both summaries stay. The later summary links to the failed event it resolves; the earlier failure remains part of the evidence.
- A test that flips between pass and fail with no code change is not evidence of a pass. Running it again until it succeeds does not make it evidence.
