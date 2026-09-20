**Goal:** Prove the scaffold meets the verification matrix, or record a recoverable failure.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `verification` and `user-output`. Run only the listed checks at the locked `project_root`. Do not wait for a `.env` edit. Tear down every process and container this task starts, after any failure `Log` is printed.

**Definition of Done:** Every matrix row has a lock value. Required applicable checks passed. This task printed `WORKING ON verify` before the matrix, then `PROGRESS verify done` only on success, or `BLOCKED` with logs on a required-check failure. Everything this task started was torn down.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` and stop.
- Set status to `verifying`.
- Print:

```text
WORKING ON verify
```

- Run the matrix in order: install, lint, build, test-unit, dev-boot, backend-boot, health-local, frontend-http, compose, compose-health. Record each outcome as it happens.
- `dev-boot`: from the project root, run `npm run dev` with the generated `.env`. Do not use `vite preview` or `serve` as a stand-in.
- If the API exits because port 3000 is in use (`EADDRINUSE`), `dev-boot` and `backend-boot` fail. That is a hard failure. Do not try another API port.
- If Vite cannot bind 5173, it may bind the next free port. Read that origin from Vite's log and use it for `frontend-http`. Occupied 5173 is not a failure when Vite rebound.
- `backend-boot` passes when the API child of `npm run dev` is listening on 3000.
- Do not treat local `/health` 503 from placeholders as a failure. Write `health-local: not-configured`.
- Frontend HTTP check against the Vite origin that actually bound: body contains `data-section="hero"`, `data-section="status"`, `data-section="structure"`, `data-section="pending"`, `data-section="next"`, and the lock-file display name. GET the Vite-served `apps/frontend/config/env.ts` module. Fail if it throws or the body is `Missing VITE_API_BASE_URL`. No browser.
- Docker missing or environment failure (daemon down, occupied Compose frontend port, blocked pull): `compose: skipped` plus why. Do not fail. An occupied host port 3000 still fails `dev-boot`.
- On a required-check failure (including Compose started but `/health` is not 200 because wiring is broken): copy up to the last 50 lines of the failed command or Compose logs into `Log`, print `BLOCKED`, then tear down. Do not tell the user to inspect containers this task already removed. Example:

```text
BLOCKED
Where: verify-project
Problem: <failed check id> did not pass.
Log:
<up to the last 50 lines of the failed command or Compose logs>
Do this: Fix the failed command, Dockerfile, or service names using the log above.
Then: after you finish that, rerun Node Boilerplate Generator
```

  Do not check `verify`. Stop.
- Tear down Compose and any backend, Vite, or `serve` process this task started (after `Log` is printed on failure).
- On success, check `verify`, set status `complete` after teardown, and print:

```text
PROGRESS verify done
```
