**Goal:** Install dependencies, typecheck, lint, run the theme test, and hand off the QR and simulator commands.

**Scope:** This task runs `npm install`, `npm run typecheck`, `npm run lint`, and `npm test`, then reports the outcome. It must not run `expo start`, launch a simulator, or treat a missing Xcode or Android SDK as a failure.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `npm install` produced `package-lock.json`. Typecheck, lint, and test exit statuses were recorded.
- [ ] Each verification check was recorded, including that the home screen has no hex color literal.
- [ ] A missing simulator was not a failed check. `expo start` was not run.
- [ ] Repair stayed inside the directory and stopped when no concrete in-boundary change remained or the same failure returned with no new evidence.
- [ ] The handoff states outcome, directory, stack, checks and exit statuses, user commands, limitations, and next action, and does not say the project was committed, deployed, or submitted, and does not expose internal field names.
- [ ] The handoff offers the draft project guide for later work without reading it or starting another pipeline.

**Instructions:**

1. Set state to `verifying`. Reload `status`, `name`, `targetDir`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Read Verification Checks in "App Builder Expo React Native Contract" and Quality Baseline & Verification in "App Builder Mobile Standards" for strict TypeScript, lint, and `tsc --noEmit`. Re-read Topology only to know which paths a repair may edit. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. A repair may edit files this run created and, when `overwrite` is `granted`, planned paths from the contract tree. Do not delete or replace any other existing file. Do not change a pinned specifier. Do not install a missing Node, npm, or npx. Do not claim a pass without an observed result.
4. From the directory, run `npm install` and confirm `package-lock.json` exists. Run `npm run typecheck`, `npm run lint`, and `npm test`. Record each exit status. Do not run `expo start`. Do not launch a simulator.
5. Walk the verification checks. Confirm the home screen file has no hex color literal. A missing simulator, Xcode, or Android SDK is not a failed check. Continue repairing while a concrete change inside the boundary can address a typecheck, lint, or test failure. Stop when no such change remains, the same failure returns with no new evidence, or the next change would add auth, a camera, or a business feature, or upgrade a pin. A remaining required failure is `failed`. Name the command, its exit status, and why repair stopped. Do not describe that failure as a pass.
6. On success, finish `done`. The user-facing handoff names the outcome, the directory, Expo Router for iOS and Android, and each check and exit status. Next commands, as text only, are `npx expo start` for the QR code, `npm run ios` when Xcode is installed, and `npm run android` when the Android SDK is installed. Ask the user to confirm the title, the safe area, and the offline banner. The next action may say that later changes to the project can run through Agile SDLC, starting with Agile Implement; this run does not start it. Do not deploy, push, tag, merge, or run `docker build`. Do not claim the project was committed, deployed, or submitted. The handoff does not expose internal field names. Run git only when the user explicitly asks in this run. Offer the imported App Builder Project Development Guide as a draft starting point for later work; if Agile SDLC is installed, name its optional Agile Bootstrap Project Guide for repository-specific adaptation. Do not load the guide or start that pipeline in this run.
