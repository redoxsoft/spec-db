# Multi-import plan (Spec DB → WorkX / SpecX)

We are adding **batch import from Spec DB**: the user can select multiple catalog resources (pipelines in WorkX, specs/templates in SpecX) and hand them off in one embed `postMessage`. Spec DB sends only identities (`kind` + `slug`) plus a `batchId`. Each host imports **one item at a time** against the existing single-item BE import API, with host-owned **retry**, **linear progress**, and **continue-on-failure** (try the next item after a failed one). No BE changes. Spec DB owns the postMessage contract; WorkX and SpecX reuse the same message shapes and only differ on allowed kinds and product UX.

**Source of truth for the wire contract:** this plan, then [`embed.md`](./embed.md) + `src/lib/importHandoff.ts` once Spec DB lands the types.

---

## Ownership

| Owner | Builds | Does not own |
|-------|--------|----------------|
| **Spec DB** | Contract types for all three message types, `batch-requested` handoff, embed multi-select + Import (N), docs + host-mock receive/log | Host BE calls, retry policy, host progress overlay, navigation; per-card progress chrome until hosts emit |
| **WorkX** | Listen for batch (and single) messages; sequential pipeline import queue; retry; continue-on-failure; linear progress UI; toasts / post-batch nav; emit progress/completed to iframe | Spec DB selection UI; SpecX kinds |
| **SpecX** | Same host runner pattern as WorkX for `spec` \| `template` | Pipeline import; Spec DB selection UI |

**Order:** Spec DB first (contract + multi-select UI) → WorkX and SpecX in parallel on the frozen message shapes → Spec DB progress-listen only after hosts emit.

### Spec DB scope for this pass

**Ship now**

- Types + constants for **all three** message types (`batch-requested`, `batch-progress`, `batch-completed`) so the wire contract is frozen
- `requestImportBatch` / multi-select + **Import (N)** (embed-only)
- `embed.md` documenting both directions + host policy conventions
- `host-mock`: receive/log `batch-requested` (optional: simulate progress later for host authors — Spec DB UI need not consume it yet)

**Leave open**

- Listener wired to real UI
- Per-card started/succeeded/failed chrome

**Why not Full yet:** Hosts own the primary progress UX (overlay n/N). Spec DB per-card status is secondary and easy to get wrong before WorkX/SpecX emit real timing/retry behavior. Building Full against a mock tends to lock chrome that then has to be reworked.

**Why not Minimal either (for now):** Without hosts emitting, “clear on `batch-completed`” only works against the mock. Until WorkX/SpecX land, Spec DB keeps today’s fire-and-forget style: after Import (N), clear or keep selection with a short local “sent” state — same honesty level as single import’s local “Imported!”. When hosts emit, land Minimal first (disable Import / clear on `batch-completed`), then per-card status if still wanted.

**Embed-only:** Multi-select + Import (N) are **embed-only**. Standalone keeps detail-modal / deep-link **single** import (`kind` + `slug`).

---

## Contract (identity-only, product-agnostic)

### Spec DB → host: batch request (required)

```ts
type SpecDbImportItem = {
  kind: 'pipeline' | 'spec' | 'template'
  slug: string
}

type SpecDbImportBatchRequested = {
  type: 'spec-db:import:batch-requested'
  batchId: string // Spec DB–generated; hosts echo in progress/completed
  items: SpecDbImportItem[] // length >= 1; order = import order
}
```

**Rules**

- Identity only — no bodies, no `contentUrl`, no workspace/auth.
- No policy fields (`continueOnFailure`, `maxRetries`, etc.) — those are host-owned.
- Host kind allowlist still wins (WorkX: `pipeline`; SpecX: `spec` \| `template`).

### Compat: single-item (keep)

Keep `spec-db:import:requested` `{ type, kind, slug }`. Hosts treat it as a one-item batch (`batchId` generated on the host if needed). Spec DB may later send only the batch type even for one selection.

### Host → Spec DB: progress + completed (recommended)

```ts
type SpecDbImportBatchProgress = {
  type: 'spec-db:import:batch-progress'
  batchId: string
  index: number // 0-based
  total: number
  item: SpecDbImportItem
  status: 'started' | 'succeeded' | 'failed' | 'skipped'
  attempt?: number // 1-based; optional
  error?: { code?: string; message: string }
}

type SpecDbImportBatchCompleted = {
  type: 'spec-db:import:batch-completed'
  batchId: string
  results: Array<{
    item: SpecDbImportItem
    status: 'succeeded' | 'failed' | 'skipped'
    error?: { code?: string; message: string }
  }>
}
```

Hosts validate Spec DB origin on receive; Spec DB validates parent origin on progress/completed. Do not put host resource ids (pipeline id, document id) in these messages.

### Host policy conventions (not in the message)

| Policy | Suggested default |
|--------|-------------------|
| Execution | Sequential — one BE call at a time |
| Continue on failure | `true` — record failure, import next |
| Retries | Retry transient errors; no retry on kind/validation failures |
| Idempotency | One `clientRequestId` per item; **reuse across retries** of that item |
| Concurrent batches | Ignore or queue; never parallelize items in a batch |
| Standalone `/import` | Batch is **embed-only**; deep link stays single `kind` + `slug` |

---

## Work items

### Spec DB — this pass (contract + multi-select; no progress-listen)

- [x] Add types + constants for `spec-db:import:batch-requested`, `batch-progress`, `batch-completed` in `src/lib/importHandoff.ts` (keep existing single-item type).
- [x] Add `requestImportBatch({ items, embed })` (or extend handoff) that posts `{ type, batchId, items }` to the parent with the same `targetOrigin` resolution as today.
- [x] Multi-select UX **in embed only**: select N resources, one **Import (N)** action that sends a single batch message (single selection may still use batch-of-one or legacy single message during rollout). Standalone stays single-item (detail modal / deep link).
- [x] After Import (N), keep fire-and-forget local UX (clear or keep selection + short “sent” / “Imported!” style ack) — do **not** wait on host progress/completed yet.
- [x] Document the full contract (both directions + host policy conventions) in [`embed.md`](./embed.md).
- [x] Update `public/host-mock.html` to receive/log `batch-requested` (optional later: simulate progress/completed for host authors; Spec DB UI does not consume it in this pass).
- [x] Mark Spec DB “this pass” items done in this file when shipped.

### Spec DB — later (after WorkX / SpecX emit)

- [ ] Listen for `batch-progress` / `batch-completed` from parent (origin-checked).
- [ ] **Minimal first:** disable Import / clear selection on `batch-completed` for the active `batchId`.
- [ ] **Optional Full:** per-card started/succeeded/failed chrome (only after hosts emit real timing/retry behavior).

### WorkX (ai-studio-fe) — after Spec DB contract lands

- [x] Extend Explore import listener to accept `batch-requested` and treat legacy `import:requested` as a one-item batch.
- [x] Replace “drop if importing” with a sequential queue over existing `runSpecDbImport` / `POST …/spec-db/imports`.
- [x] Implement retry + continue-on-failure (host policy; reuse `clientRequestId` per item across retries).
- [x] Replace binary overlay with linear progress (n/N, current slug, failure summary).
- [x] `postMessage` progress/completed back to the Spec DB iframe (`event.source`).
- [x] Post-batch UX: summary toast; navigation policy (single success → open pipeline; multi → stay on Explore).

### SpecX (spec-edit-fe) — parallel with WorkX

- [ ] Same listener + sequential runner as WorkX for kinds `spec` \| `template`.
- [ ] Same retry / continue-on-failure / linear progress / progress+completed acks.
- [ ] SpecX-specific success navigation and toasts only.

### Out of scope

- [ ] ~~Host BE batch import API~~ — keep single-item import.
- [ ] ~~Standalone multi-slug `/import` deep link~~ — embed-only for v1.
- [ ] ~~Shared npm package for message types~~ — Spec DB docs + duplicated host types are enough for v1.
