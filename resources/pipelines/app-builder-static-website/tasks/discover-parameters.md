**Goal:** Collect the site name, directory, and build tool for a static website starter.

**Scope:** This task accepts a short intent and asks for the display name, the directory, and the build tool, one question at a time. It must not open a spec, check Node or npm, install anything, or write files.

**Verification / Definition of Done:**
- [ ] The display name, directory, and build tool were each answered.
- [ ] The build-tool question offered Vite first, as the recommended default, then plain HTML, CSS, and JavaScript.
- [ ] The answer was stored as `vite` or `plain`, and no other spelling was stored.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, and `buildTool`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent such as a landing page, portfolio, or small business site. Do not open a spec. The questions below are the legal choices: `buildTool` is `vite` or `plain`.
2. Ask for the site name. When the user is unsure, suggest `my-site`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./` plus a slug of the name, for example `./my-site`. Store it as `targetDir`.
4. Ask "Build tool?" with numbered choices. `1` is recommended: Vite (TypeScript + Tailwind CSS), stored as `vite`. `2` is Plain HTML, CSS, and JavaScript, stored as `plain`. Ask again when the answer is neither. Do not ask about a package manager, linter, test runner, layout, or platform.
5. Recap the name, directory, and build tool. If the user corrects one, update that value and recap again. This recap is not the write approval.
6. Write pipeline context: `status` = `collected`, `name`, `targetDir`, and `buildTool`. Do not store file contents, a path list, or a toolchain result. Do not write files.
