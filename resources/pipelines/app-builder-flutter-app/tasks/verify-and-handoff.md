**Goal:** Fetch packages, analyze, test, and hand off `flutter run` as a user command.

**Scope:** This task runs `flutter pub get`, `flutter analyze`, and `flutter test`, then reports the outcome. It must not run `flutter run`, launch a device, or treat a missing simulator as a failure.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `flutter pub get`, `flutter analyze`, and `flutter test` exit statuses were recorded. The test finds the display name.
- [ ] Applicable verification checks were recorded, including no `Color(0x` literal under `lib/features`.
- [ ] A missing device was not a failed check. `flutter run` was not started.
- [ ] Doctor device warnings from the toolchain string were included as a limitation, not a failure.
- [ ] The handoff states outcome, directory, stack, checks and exit statuses, user commands, limitations, and next action, and does not say the project was committed, deployed, or submitted, and does not expose internal field names.
- [ ] The handoff offers the draft project guide for later work without reading it or starting another pipeline.

**Instructions:**

1. Set state to `verifying`. Reload `status`, `name`, `targetDir`, `packageName`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Read Verification Checks in "App Builder Flutter App Contract" and Quality Baseline & Verification in "App Builder Mobile Standards" for `flutter analyze` and the strict analyzer flags. Re-read Topology only to know which paths a repair may edit. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. A repair may edit files this run created and, when `overwrite` is `granted`, files in the directory. Do not delete an unrelated file that this starter is not replacing. Do not change `packageName` or the four pub versions. Do not install a missing Flutter SDK. Do not claim a pass without an observed result.
4. From the directory, run `flutter pub get`, then `flutter analyze` and `flutter test`. Record each exit status. Do not run `flutter run`. Do not launch a simulator.
5. Walk the verification checks. Confirm `flutter create` used `--platforms=ios,android` only and that `lib/features` has no `Color(0x` literal. A missing device is not a failed check. If `toolchain` mentions device warnings, record them as a limitation. Continue repairing while a concrete change inside the boundary can address an analyze or test failure. Stop when no such change remains, the same failure returns with no new evidence, or the next change would add another platform, auth, or a business feature, or change a pin. A remaining required failure is `failed`. Name the command, its exit status, and why repair stopped. Do not describe that failure as a pass.
6. On success, finish `done`. The user-facing handoff names the outcome, the directory, the package name, iOS and Android, and each check and exit status. The next command is `flutter run`, as text for the user, plus `flutter analyze` and `flutter test`. Ask the user to confirm the title, the safe area, and the offline banner. The next action may say that later changes to the project can run through Agile SDLC, starting with Agile Implement; this run does not start it. Do not deploy, push, tag, merge, or run `docker build`. Do not claim the project was committed, deployed, or submitted. The handoff does not expose internal field names. Run git only when the user explicitly asks in this run. Offer the imported App Builder Project Development Guide as a draft starting point for later work; if Agile SDLC is installed, name its optional Agile Bootstrap Project Guide for repository-specific adaptation. Do not load the guide or start that pipeline in this run.
