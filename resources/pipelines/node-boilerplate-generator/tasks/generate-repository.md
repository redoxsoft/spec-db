**Goal:** Write the single-package repository skeleton: manifests, TypeScript, ESLint, env files, and gitignore.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `file-manifest`, `repository`, `dependencies`, `commands`, `configuration`, and `user-output`. Work only under `project_root` from `boilerplate-lock.md`. Do not write application pages, API handlers, tests, Docker files, or the README yet.

**Definition of Done:** Repository and configuration paths exist. `.env` exists. `.gitignore` includes `boilerplate-lock.md`. Progress `repository` is checked and this task printed `PROGRESS repository done`.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` from section `user-output` (**Do this:** rerun intake. **Then:** after you finish that, rerun Node Boilerplate Generator) and stop.
- Read identity only from the lock file.
- If `repository` is already checked and the files exist, print `PROGRESS repository done` and skip writes.
- Print `WORKING ON repository` before writing files.
- Write verbatim configs from `repository`, `commands`, and `configuration`, including `vite.config.ts` (`envDir: process.cwd()`, `strictPort: false`).
- List every package from `dependencies`. Exact versions, no star ranges.
- Copy `.env.example` to `.env` if `.env` is missing. Vite and the API both read that root file.
- Stop with `BLOCKED` if unexpected application files are present.
- Check `repository`. Print:

```text
PROGRESS repository done
```
