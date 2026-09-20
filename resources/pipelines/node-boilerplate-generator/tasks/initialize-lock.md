**Goal:** Create the project root and write `boilerplate-lock.md` so later tasks have a single source of run state.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `lock-file`, `workspace`, and `user-output`. Create the directory if needed. Write only `boilerplate-lock.md`. Do not generate application source.

**Definition of Done:** The absolute project root exists. `boilerplate-lock.md` matches section `lock-file`. Progress `lock-initialized` is checked and this task printed `PROGRESS lock-initialized done`. An occupied path printed `BLOCKED` and stopped.

Actions:

- Read the confirmed display name, slug, and absolute path from intake.
- Classify the path per `workspace`. If occupied, print:

```text
BLOCKED
Where: initialize-lock
Problem: The project path already has an application in it.
Do this: Choose an empty directory or a new name.
Then: after you finish that, rerun Node Boilerplate Generator
```

  Then stop.

- Create the directory if it does not exist.
- Write `boilerplate-lock.md` using the headings in `lock-file`.
- Copy prerequisite results (including any Docker or PostgreSQL skip, and `node: <version> (override)` when the user chose `continue` on a Node newer than 22).
- On resume, keep completed progress. On restart, rewrite the lock.
- Check `lock-initialized`. Print:

```text
PROGRESS lock-initialized done
```

- Do not write `package.json` or application files.
