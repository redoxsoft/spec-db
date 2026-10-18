# Agile Requirements Quality Guide

## Requirements Quality Bar <!-- key: quality-bar -->

A requirement is useful when someone other than its author can tell, from observation, whether it is met.

### Testability <!-- key: testability -->

A requirement is valid when an independent reviewer can determine whether it passes or fails.

**No subjective qualifiers.** A requirement does not use vague adjectives or adverbs as the success condition.

- Not testable: "The system should be fast, responsive, and intuitive."
- Testable: "The search endpoint returns results within 250ms at p95 for a database of up to 1,000,000 records."
- Not testable: "Gracefully handle network errors."
- Testable: "When the payment gateway returns HTTP 500, display error banner `PAY-ERR-01` and retain the user's form inputs."

**Observable states.** Every functional requirement specifies:

- The triggering condition or input event.
- The state transition or transformation.
- The externally observable outcome: an HTTP status, a visible UI change, an emitted event, or a changed record.

### User Outcomes and Requirement Grain <!-- key: requirement-hierarchy -->

A requirement states the capability or system guarantee. The problem and intended outcome belong in the Product Spec Template's `Context & Scope`; a requirement need not repeat them. A requirement does not dictate internal language constructs, local function signatures, or private variable names unless those names are an external contract.

#### Requirements and Acceptance Criteria <!-- key: req-versus-ac -->

Requirements and acceptance criteria are different grains of detail within a coherent requirements artifact. Optional `REQ-xxx` and `AC-xxx` identifiers can make them easier to reference when needed.

- **Requirements (`REQ-xxx`).** High-level capability statements. They say what user capability or system guarantee is needed. Example: `REQ-001: Bulk CSV member invitation`. They do not specify private implementation detail.
- **Acceptance criteria (`AC-xxx`).** Concrete contracts for how a specific interaction, validation rule, or error state behaves and how that behavior is verified. Example: `AC-001: A 50-row CSV enqueues invitation jobs`.

#### Requirement Content <!-- key: requirement-content -->

Use the Product Spec Template's `Behavior & Rules` and `Acceptance Criteria` children as the core structure for each requirement. State the user problem and intended outcome in the document's `Context & Scope`; do not repeat an outcome or success measure under every requirement. Add a requirement-specific scope note only when it clarifies that requirement's boundary. Include functional and relevant quality requirements in the same structure without copying a universal checklist. A requirement does not need a `REQ-xxx` identifier unless stable references or independent tracking are useful.

### Non-Goals and the Initial Slice <!-- key: non-goals -->

Undefined material boundaries invite speculative completeness. A requirements document states non-goals when they clarify the initial slice; it does not manufacture exclusions for a well-bounded request.

- **Initial slice.** A requirements artifact distinguishes capabilities in the current scope from capabilities deferred to later work.
- **Material non-goals and exclusions.** When exclusions, deferred features, unsupported configurations, or integrations materially clarify scope, record them as optional entries under `Context & Scope > Non-Goals` in the Product Spec Template. Omit the section when no exclusion adds a useful boundary; do not require IDs or detailed rationale for simple exclusions.

Examples:

- Multi-currency transactions are out of scope; all transactions are processed in USD only.
- Offline synchronization is not supported in this release.

## Acceptance Criteria <!-- key: acceptance-criteria -->

Every requirement that governs delivery has one or more observable acceptance criteria. Use one of the formats below. Add `AC-xxx` identifiers only when stable references or independent tracking are useful; descriptive headings are sufficient for ordinary PRDs.

### Two Formats <!-- key: ac-formats -->

#### Given, When, Then <!-- key: given-when-then -->

Use this format for stateful transitions, interactive flows, and asynchronous operations.

- **Given** a precondition or starting state.
- **When** a specific action or stimulus occurs.
- **Then** a deterministic observable outcome and state change.
- **And** an optional further invariant.

```text
AC-001
- Given an authenticated user with role Editor on the Settings page
- When the user clicks "Export CSV" with a valid date range
- Then the system returns HTTP 200 with Content-Type: text/csv
- And an audit event EXPORT_TRIGGERED is recorded in audit_log with the user ID
```

#### Declarative Assertions <!-- key: declarative -->

Use this concise format for other observable checks, including stateless calculations, API schemas, validation constraints, and security properties.

- **Target.** The specific field, endpoint, or entity.
- **Constraint.** The explicit mathematical, structural, or logical invariant.
- **Violation (only when contracted).** The observable failure response or behavior, included only when that response or behavior is itself part of the contract.

```text
AC-002
- Target: Endpoint POST /api/v1/workspaces
- Constraint: Field name is 3 to 50 characters and contains only alphanumeric characters and hyphens
- Violation: When name fails validation, the endpoint returns HTTP 422 with payload {"code": "INVALID_WORKSPACE_NAME", "field": "name"}
```

### Anti-Patterns <!-- key: ac-anti-patterns -->

- **Vague success.** "It works correctly and does not crash." The criterion cannot be verified.
- **Coupled criteria.** Several independent assertions are combined into one criterion. Split independently verifiable outcomes; identifiers are optional unless they help reference or track the criteria.
- **Untestable preconditions.** "Given a happy user." A subjective state cannot be verified.

### Behavior Contract Snapshot <!-- key: feature-contract -->

A coherent behavior specification can state a six-field snapshot of the operational boundary before the detailed criteria:

- **Trigger.** The event, gesture, or API call that starts the feature.
- **Inputs.** The primary parameters, payloads, headers, or state preconditions.
- **Outputs.** The primary return values, status codes, UI transitions, or rendered views.
- **Side effects.** State mutations, jobs enqueued, events published, caches invalidated.
- **Idempotency.** Behavior on a repeated or concurrent invocation.
- **Completion gate.** The deterministic condition that shows the interaction has finished.

When requirements and criteria are separately itemized, make clear which criteria verify each requirement. The mapping may be inline; identifiers and a separate traceability artifact are unnecessary unless they provide value.

## Uncertainty Tags <!-- key: uncertainty -->

### Authority of an Approved Spec <!-- key: document-authority -->

An approved specification is authoritative. Individual sentences do not carry an `[AUTHORITATIVE]` stamp.

### Tags Used by Exception <!-- key: uncertainty-tags -->

Inline tags are reserved for content that is not yet settled.

- `? [NEEDS_INPUT]` marks an ambiguous product requirement, a conflicting business rule, or missing information. It is an open question, not a locked requirement.
- `* [PROPOSAL]` marks a recommendation, a suggested trade-off, or a design option a person has not accepted. It is not a locked requirement.
- `! [HYPOTHESIS]` marks a plausible explanation or a candidate root cause still under investigation. It is not a settled fact.

### No Silent Promotion <!-- key: non-promotion -->

> [!IMPORTANT]
> A `* [PROPOSAL]` or a `! [HYPOTHESIS]` is not silently promoted to an accepted fact. It becomes accepted only when a person confirms it, or when an empirical check confirms it.

## Identifiers <!-- key: identifiers -->

When stable identifiers are useful, these prefixes identify actionable items. Personas, metrics, exclusions, components, and risks use ordinary headings and lists, not formal identifiers.

| Prefix | Entity | Where it is written | What it traces to |
| --- | --- | --- | --- |
| `REQ-xxx` | Optional stable identifier for a business, product, or system requirement | Requirements artifact | Behavior and acceptance criteria |
| `AC-xxx` | Optional stable identifier for an acceptance criterion | Behavior specification or Work Item | Observable verification evidence |
| `TASK-xxx` | Execution increment | Delivery plan | The bounded work it describes |
| `ADR-xxx` | Architecture decision | Technical design | The affected technical boundary |

Identifiers are useful when items will be independently referenced, tracked, or mapped across artifacts. Do not add them to every heading by default.
