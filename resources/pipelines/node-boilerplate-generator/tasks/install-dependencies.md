**Goal:** Install the declared dependency set and produce `package-lock.json` before any application source is written.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `dependencies`, `commands`, and `user-output`. Run npm only at the locked `project_root`. Do not add undeclared packages. Do not start the application.

**Definition of Done:** `npm install` exited 0. Resolved versions are in the lock file. Progress `dependencies` is checked and this task printed `PROGRESS npm install done`. A failed install printed `BLOCKED` with logs and stopped here.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` and stop.
- If `dependencies` is already checked and `package-lock.json` exists, print `PROGRESS npm install done` and skip.
- Print:

```text
WORKING ON npm install
```

- Run `npm install` at the locked project root.
- On failure, copy up to the last 50 lines of the npm output into `Log`, then print:

```text
BLOCKED
Where: install-dependencies
Problem: npm install did not resolve the declared packages.
Log:
<up to the last 50 lines of the npm error>
Do this: Fix network or registry access.
Then: after you finish that, rerun Node Boilerplate Generator
```

  Then stop.

- Record `name@version` lines under `Resolved versions`.
- Check `dependencies`. Print:

```text
PROGRESS npm install done
```
