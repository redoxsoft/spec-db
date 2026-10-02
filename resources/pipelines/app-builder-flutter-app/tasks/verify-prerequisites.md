**Goal:** Check the Flutter and Dart floors, then get one approval before `flutter create` writes anything.

**Scope:** This task reloads the collected intake, checks Flutter, and treats any existing file in the directory as a collision. It must not install Flutter, accept Android licenses, store a doctor log, or run `flutter create`.

**Verification / Definition of Done:**
- [ ] `status`, `name`, `targetDir`, and `packageName` were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] Flutter was 3.44.0 or newer and Dart was 3.12.0 or newer, or the task stopped `blocked` without installing Flutter and without a write approval.
- [ ] `flutter doctor` ran. Device, Xcode, or license warnings did not by themselves stop the run.
- [ ] An empty directory needed no overwrite question. Any existing file produced one blanket overwrite-or-other-directory line.
- [ ] A directory inside the imported App Builder collection, or a planned path under it that resolves outside the directory, stopped as `needs_input` with no files written.
- [ ] Approval wrote `status` `approved`, `toolchain`, and `overwrite` as `not-needed` or `granted`. Cancellation finished `done` and said that no starter was produced.

**Instructions:**

1. Set state to `checking`. Reload `status`, `name`, `targetDir`, and `packageName`. If any is missing, or `status` is not `collected`, stop `blocked`, name the missing string, and write nothing.
2. Run `flutter --version`. If the command is missing, or Flutter is below 3.44.0, or Dart is below 3.12.0, stop `blocked`. Name Flutter stable 3.44.0 or newer and Dart 3.12.0 or newer. Do not install Flutter. Do not create files. Do not show a write approval.
3. Run `flutter doctor`. If it reports missing Xcode, Android licenses, or no devices, keep going. Do not accept licenses. Do not store the doctor log. A short toolchain string may say `flutter 3.44.0, dart 3.12.0, doctor: device warnings` when those warnings appeared, using the observed versions.
4. Refuse `targetDir` when it lies inside the imported App Builder collection. Membership comes from imported-resource metadata and folder ancestry, not from a folder happening to be named App Builder. Stop `needs_input` and ask for a different directory. Write nothing there.
5. Resolve `targetDir`. Refuse it when that path, or a planned path under it, resolves outside the approved directory through a symlink or another link. Stop `needs_input` and ask for a different directory. If the parent is not writable, stop `blocked` and name write access. Do not create the project directory in this task.
6. Read only the Topology section of "App Builder Flutter App Contract". Do not read a standard. That section does not list every file `flutter create` writes, so do not use it as a closed path list. The directory is the write unit. An empty or missing directory has no collision. Any existing file is a collision. Do not store a path list.
7. Set state to `waiting`. Show one preview: display name, directory, derived package name, iOS and Android, and the toolchain string. When the directory is empty, the confirmation is proceed or cancel. When any file exists, the same preview asks once for blanket permission to overwrite that directory, or for a different directory, and cancel remains available. Do not ask a platform question.
8. Proceed with an empty directory: set `overwrite` to `not-needed`. Proceed with blanket overwrite: set `overwrite` to `granted`. Keep `name`, `targetDir`, and `packageName`. Set `status` to `approved` and `toolchain` to the short string from step 3. Write no project files.
9. A different directory updates `targetDir` and returns to step 4 before any write. A changed display name before any write derives `packageName` again and returns to step 4. This starter has no choice tokens. Either change discards the previous overwrite grant. Show one new preview, and set `overwrite` only from that preview. Later tasks do not ask again. Cancel finishes `done`, writes nothing, and the handoff says that no starter was produced. It does not expose internal field names.
