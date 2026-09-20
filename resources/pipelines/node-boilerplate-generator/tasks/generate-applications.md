**Goal:** Write the hello-world frontend, backend, and persistence stub. No product features.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `frontend`, `backend`, `persistence`, and `user-output`. Work only under the locked `project_root`. Do not write tests, Docker files, or the README.

**Definition of Done:** Application paths in `file-manifest` exist. `Home.tsx` has the five `data-section` regions in order and the verbatim `styles.css`. Backend exposes only `GET /` and `GET /health`. Progress `applications` is checked and this task printed `PROGRESS applications done`.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` and stop.
- If `applications` is already checked, print `PROGRESS applications done` and skip.
- Print `WORKING ON applications` before writing files.
- Bake `DISPLAY_NAME` from the lock file into `Home.tsx` and the root controller. Bake `DOCKER_SKIPPED` from the lock `docker` field. Do not read the lock file from application code at runtime.
- Copy `styles.css` from section `frontend` verbatim. Build `Home.tsx` to the required DOM in that section. Wrap paths, env names, commands, and `/health` in `<code>`. Wrap the Next URLs in `<a href>`. Do not add, remove, or reorder sections.
- Copy `apps/frontend/config/env.ts` from `configuration` verbatim. Do not throw at import time.
- Implement `healthStatus.ts` with the three strings and tone classes from `frontend`.
- Follow route → controller → service → data. `/health` as specified. Process stays up if the database is down.
- Load root `.env` with `dotenv.config({ path: path.resolve(process.cwd(), '.env') })`. Listen on `PORT` only. `EADDRINUSE` on 3000 is a hard failure.
- CORS in development allows any `localhost` or `127.0.0.1` origin.
- Create `migrations/001_init.cjs` as a no-op or `SELECT 1` migration.
- Do not add auth, extra routes, forms, or a client store.
- Check `applications`. Print:

```text
PROGRESS applications done
```
