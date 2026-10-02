**Goal:** Collect the site name, directory, and run mode for a Next.js website starter.

**Scope:** This task accepts a short intent and asks for the display name, the directory, and the run mode, one question at a time. It must not open a spec, check Node or npm, install anything, or write files.

**Verification / Definition of Done:**
- [ ] The display name, directory, and run mode were each answered.
- [ ] The run-mode question offered static export first, as the recommended default, then a Next.js server.
- [ ] The answer was stored as `static-export` or `server`, and no other spelling was stored.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, and `runMode`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for a public content site, marketing page, blog, or portfolio. Do not open a spec. The legal choice is `runMode`: `static-export` or `server`.
2. Ask for the site name. When the user is unsure, suggest `my-nextjs-site`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./` plus a slug of the name, for example `./my-nextjs-site`. Store it as `targetDir`.
4. Ask "How should it run?" with numbered choices. `1` is recommended: Static export (`output: 'export'`), stored as `static-export`. `2` is Next.js server, stored as `server`. Ask again when the answer is neither. Do not ask about a database, package manager, linter, or platform.
5. Recap the name, directory, and run mode. If the user corrects one, update that value and recap again. This recap is not the write approval.
6. Write pipeline context: `status` = `collected`, `name`, `targetDir`, and `runMode`. Do not store file contents, a path list, or a toolchain result. Do not write files.
