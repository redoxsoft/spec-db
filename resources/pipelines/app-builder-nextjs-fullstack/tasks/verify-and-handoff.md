**Goal:** Install dependencies, run the health test and the Next.js build, and hand off the directory and commands.

**Scope:** This task runs the checks for the approved database and run mode, repairs only inside the approved directory, and reports the outcome. It must not deploy, run `docker build`, require a live PostgreSQL server, or ask a new product question.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `npm install` produced `package-lock.json`. `npm test` and `npm run build` exit statuses were recorded.
- [ ] Each applicable verification check was recorded. `output: 'export'` is absent. The Dockerfile rule matches the run mode.
- [ ] An unreachable PostgreSQL was recorded as a limitation when the live helper test and `npm run build` exited 0, and the run was not failed for that 503.
- [ ] Repair stayed inside the directory and stopped when no concrete in-boundary change remained or the same failure returned with no new evidence.
- [ ] The handoff states outcome, directory, stack, checks and exit statuses, user commands, limitations, and next action, and does not say the project was committed, deployed, or submitted, and does not expose internal field names.
- [ ] The handoff offers the draft project guide for later work without reading it or starting another pipeline.

**Instructions:**

1. Set state to `verifying`. Reload `status`, `name`, `targetDir`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Read Verification Checks in "App Builder Next.js Full-Stack Contract" and Scaffolding Baseline (Day 0) in "App Builder Web Standards" for the lockfile and a green build. Re-read Topology only to know which paths a repair may edit. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. A repair may edit files this run created and, when `overwrite` is `granted`, planned paths from the contract tree. Do not delete or replace any other existing file. Do not change `database`, `runMode`, or a pinned specifier. Do not install a missing Node or npm. Do not claim a pass without an observed result.
4. From the directory, run `npm install` and confirm `package-lock.json` exists. Run `npm test`, then `npm run build`. Record both exit statuses. Do not start PostgreSQL and do not run `docker build`.
5. Walk the verification checks that apply to this database and run mode. Confirm `next.config.mjs` has no `output: 'export'`. For `decide-later` and `long-running`, confirm `output: 'standalone'`, `node:22-alpine`, and `USER node`. For `serverless`, confirm there is no `Dockerfile` and no `output: 'standalone'`. When PostgreSQL is unreachable, `/api/health/ready` may return 503. That is still a pass when `npm test` and `npm run build` exit 0. Record it as a limitation.
6. Continue repairing while a concrete change inside the boundary can address a failure. Stop when no such change remains, the same failure returns with no new evidence, or the next change would add auth or a business feature, upgrade a pin, mix in static export, or weaken a required check. A remaining required failure is `failed`. Name the command, its exit status, and why repair stopped. Do not describe that failure as a pass.
7. On success, finish `done`. The user-facing handoff names the outcome, the directory, the database and run mode in ordinary words, each check and exit status, and the next commands: `npm run dev`, `npm test`, and `npm run build` followed by `npm start`. Ask the user to open `http://localhost:3000` and confirm the heading, then `/api/health/live`, `/api/health/ready`, and `/api/hello`. Ready may be `not_configured`, `ok`, or 503 when PostgreSQL is down. Do not deploy, push, tag, merge, or run `docker build`. Do not claim the project was committed, deployed, or submitted. The handoff does not expose internal field names. Run git only when the user explicitly asks in this run. Offer the imported App Builder Project Development Guide as a draft starting point for later work; if Agile SDLC is installed, name its optional Agile Bootstrap Project Guide for repository-specific adaptation. Do not load the guide or start that pipeline in this run.
