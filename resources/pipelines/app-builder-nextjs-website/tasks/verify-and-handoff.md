**Goal:** Install dependencies, run the Next.js production build, and hand off the directory and commands.

**Scope:** This task runs the contract checks for the approved run mode, repairs only inside the approved directory, and reports the outcome. It must not deploy, claim a commit, or ask a new product question.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `npm install` inside the directory produced `package-lock.json`. `npm run lint`, `npm test`, and `npm run build` exit statuses were recorded. `static-export` produced `out/index.html`. `server` produced `.next/`.
- [ ] Each check in Verification Checks was recorded from files and exit codes.
- [ ] Repair stayed inside the directory and stopped when no concrete in-boundary change remained or the same failure returned with no new evidence.
- [ ] The handoff states outcome, directory, stack, checks and exit statuses, user commands, limitations, and next action, and does not say the project was committed, deployed, or submitted, and does not expose internal field names.
- [ ] The handoff offers the draft project guide for later work without reading it or starting another pipeline.

**Instructions:**

1. Set state to `verifying`. Reload `status`, `name`, `targetDir`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Read Verification Checks in "App Builder Next.js Website Contract" and Scaffolding Baseline (Day 0) in "App Builder Web Standards". Re-read Topology only to know which paths a repair may edit. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. A repair may edit files this run created and, when `overwrite` is `granted`, planned paths from the contract tree. Do not delete or replace any other existing file. Do not change `runMode` or rewrite a dependency as `latest`. Do not install a missing Node or npm. Do not claim a pass without an observed result.
4. From the directory, run `npm install` and confirm `package-lock.json` exists. Then run `npm run lint`, `npm test`, and `npm run build`. Record each exit status. For `static-export`, confirm `out/index.html`. For `server`, confirm `.next/`.
5. Walk every verification check. Record pass or fail from files and exit codes. Continue repairing while a concrete change inside the boundary can address a failure. Stop when no such change remains, the same failure returns with no new evidence, or the next change would leave hello-world scope, mix a server export with static export, or weaken a required check. A remaining required failure is `failed`. Name the command, its exit status, and why repair stopped. Do not describe that failure as a pass.
6. On success, finish `done`. The user-facing handoff names the outcome, the directory, static export or Next.js server, each check and exit status, and the next commands: `npm run dev`, `npm run lint`, `npm test`, `npm run build`, then `npx serve out` for static export or `npm start` for the server. Those preview commands are text for the user. Ask the user to open the local site and confirm the title and `h1` match the display name and that Tailwind styles render. Do not deploy, push, tag, merge, or run `docker build`. Do not claim the project was committed, deployed, or submitted. The handoff does not expose internal field names. Run git only when the user explicitly asks in this run. Offer the imported App Builder Project Development Guide as a draft starting point for later work; if Agile SDLC is installed, name its optional Agile Bootstrap Project Guide for repository-specific adaptation. Do not load the guide or start that pipeline in this run.
