**Goal:** Lock the display name, package slug, and absolute project path with the user before any files are written.

**Scope:** Chat-only intake. Apply SpecX spec `Node.js Application Development Standards` sections `identity`, `workspace`, `lock-file`, and `user-output`. Do not create directories or application files.

**Definition of Done:** The user answered project name, then location (or chose resume / restart). This task printed only a fenced `WAITING FOR USER` block from section `user-output` while waiting. Nothing was created.

This task is **waiting**, not blocked and not failed, while a banner is showing.

Actions:

- Read sections `identity`, `workspace`, `lock-file`, and `user-output`.
- Prompts say project name; the lock field stays `display_name`. Derive the slug with the `identity` algorithm (My First App becomes my-first-app).
- Ask **one** question per turn. Do not ask name and location together.
- Print each wait as **one Markdown `text` fence** (opening three backticks + `text`, then the lines, then closing three backticks). Do not print those lines outside the fence. Do not wrap the fence in a paragraph. Chat UIs flatten unfenced newlines.
- **Name first.** Default display name: current workspace folder name. Print **only** this fenced block:

```text
WAITING FOR USER
Project name? (default: <display name>)
Type ok to use the default, or type a new name.
```

  - `ok`, `yes`, `use default`, or `looks good` keeps the default.
  - Any other text is the new name. That is the answer. Do not ask for a second confirm.
  - Reserved or empty slug: one sentence of why, then ask `Project name?` again. Do not offer a reserved default.
  - `cancel`: stop without creating files. Do not print `BLOCKED`.
- **Then location or resume.** Default location: parent of the current workspace, slug appended.
  - If `boilerplate-lock.md` exists at the path about to be used, print **only** this fenced block and stop:

```text
WAITING FOR USER
A previous run exists at <absolute path> (status: <lock status>).
1. Resume
2. Restart
3. Use a new path
Choice? (1, 2, or 3)
```

  - `1` or `resume`: keep the lock identity. Do not create files here.
  - `2` or `restart`: remember restart for initialize-lock. Do not create files here.
  - `3` or a new path: ask the location question. Do not reuse an unusable default.
  - Otherwise print **only** this fenced block:

```text
WAITING FOR USER
Location? (default: <absolute path>)
Type ok to use the default, or type a new path.
```

  - `ok`, `yes`, `use default`, or `looks good` keeps the default when that default is usable.
  - A new path is the answer. If the user gives a parent directory, append the slug.
  - Occupied path, relative path, or filesystem rejection: one sentence of why, then ask `Location?` again. Do not invent a path. Do not append a suffix. Do not offer `ok` when the default is unusable — omit `(default: …)` and write `Type a new path.`
  - If the answered path has a lock, switch to the resume block.
- Do not create the project directory in this task.
