**Goal:** Collect the project name and directory for a React and Vite web app.

**Scope:** This task accepts a short intent and asks for the display name and the directory, one question at a time. It must not open a spec, ask a stack question, check Node or npm, or write files.

**Verification / Definition of Done:**
- [ ] The display name and directory were each answered.
- [ ] No framework, database, run-mode, package-manager, or platform question was asked.
- [ ] Pipeline context holds `status` `collected`, `name`, and `targetDir`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent such as a dashboard, portal, or internal tool. Do not open a spec. This starter has no stack choice tokens. The stack is fixed: React, Vite, TypeScript, Tailwind CSS, React Router, Vitest, and npm.
2. Ask for the project name. When the user is unsure, suggest `my-app`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my-app`. Store it as `targetDir`.
4. Recap the name and directory. If the user corrects one, update that value and recap again. This recap is not the write approval.
5. Write pipeline context: `status` = `collected`, `name`, and `targetDir`. Do not store a choice token, file contents, a path list, or a toolchain result. Do not write files.
