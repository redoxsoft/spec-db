**Goal:** Confirm the standards spec and required local tools exist before asking the user for a project name.

**Scope:** Resolve SpecX spec `Node.js Application Development Standards` by exact title. Apply sections `goal`, `prerequisites`, and `user-output`. Check Node, npm, PostgreSQL, and Docker. Do not create files. Do not ask for a project name yet. Do not change the user's default Node alias. Do not install Node if 22 is not already present.

**Definition of Done:** The spec is locked by exact title. This shell is using Node 22, or the user accepted a greater-than-22 override. npm is present. At least one of PostgreSQL or Docker Compose is present.

Actions:

- Resolve SpecX spec `Node.js Application Development Standards` by that exact title. If it cannot be found, print:

```text
BLOCKED
Where: check-prerequisites
Problem: Spec Node.js Application Development Standards is not in this workspace.
Do this: Install that exact title into this workspace.
Then: after you finish that, rerun Node Boilerplate Generator
```

  Then stop. Do not reconstruct the rules from memory.

- Read sections `goal`, `prerequisites`, and `user-output`. Apply the `user-output` chat-output rule for this task and every later task: console output is only the named templates, each as one fenced `text` block.
- Select Node in this order. Keep the chosen 22 on PATH for later tasks in this run. Do not set a default alias.

  1. If `node -v` major is 22, use it.
  2. Else if Node 22 is already installed and selectable, **use it without asking**. Try, in any order that works:
     - `nvm`: source nvm if needed, then `nvm use 22` only when 22 is already installed.
     - `fnm use 22` only when 22 is already installed.
     - `volta` / `asdf` use or PATH for an already-installed 22.
     - Homebrew `node@22`: `$(brew --prefix node@22)/bin`, `/opt/homebrew/opt/node@22/bin`, or `/usr/local/opt/node@22/bin` when that `node` binary exists. Prepend that `bin` to PATH.
     Recheck `node -v`. If major is 22, continue.
  3. Else if `node -v` major is **greater than 22**, print **only** this fenced `text` block and wait (this is waiting, not blocked). Keep the fence marks. Do not print the lines as a paragraph:

```text
WAITING FOR USER
Recommended Node 22 is not available. Continue with <detected-version>?
Type ok to continue, or cancel.
```

     - `ok` / `yes` / `continue`: remember `node: <detected-version> (override)` for the lock. Generated `.nvmrc` and `engines` stay 22. Do not switch Node.
     - `cancel` / `no`: stop. Do not print `BLOCKED`.
  4. Else print `BLOCKED` and stop. Use this when `node` is missing, or major is below 22, and step 2 found no installed 22:

```text
BLOCKED
Where: check-prerequisites
Problem: Node 22 is not installed and no Node 22 or newer is available.
Do this: Install Node 22 (recommended) or Node 23 or newer yourself. The agent will not install Node.
Then: after you finish that, rerun Node Boilerplate Generator
```

- Check `npm -v`. If it fails, print `BLOCKED` with **Do this:** Install npm yourself and confirm `npm -v` works. **Then:** after you finish that, rerun Node Boilerplate Generator.
- Check PostgreSQL (server or `psql`) and Docker Compose.
- If both are missing, print `BLOCKED` with **Do this:** Install PostgreSQL (or `psql`) or Docker Compose yourself. **Then:** after you finish that, rerun Node Boilerplate Generator.
- If only one of PostgreSQL or Docker is missing, remember that skip for the lock file. Do not print a skip warning here.
- On a clean pass (Node 22 selected, or an accepted override), print nothing.
- Do not write the lock file in this task.
