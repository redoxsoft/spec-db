**Goal:** Close the run with a scannable report the user can copy.

**Scope:** Read-only. Read `boilerplate-lock.md` only. Apply section `user-output` close-out report. Do not start another pipeline. Do not edit application files.

**Definition of Done:** The chat contains only the close-out headings from section `user-output`, in order, with no extra narrative. **Next** appears only when status is `blocked`.

Actions:

Print exactly this shape as one fenced `text` block (fill slots from the lock file). Do not add other headings. Do not print the lines outside the fence.

```text
Made
- path: <absolute project root>
- name: <display name>
- slug: <package slug>
- tree: apps/frontend, apps/backend, migrations, package.json

Run
cd <absolute project root> && npm run dev
then http://localhost:5173 (or the port Vite printed if 5173 was busy)

Health
GET /health is 503 until .env has real DB_* or DATABASE_URL. Compose uses the documented placeholders and does not need that edit.

Checks
- <id>: pass | skipped | not-configured — <one-line why>
```

List every verification row under **Checks**. If the lock records `node: <version> (override)`, add one Checks line: verify ran on that Node; the project still pins 22.

If status is `blocked`, append only:

```text
Next
- failed: <lock field or task key>
- command: <literal command that failed>
- do this: <likely fix>
- then: resume Node Boilerplate Generator
```

If status is `complete`, omit **Next**.

Do not start another pipeline.
