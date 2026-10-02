**Goal:** Check Node, npm, and npx, then get one approval before any file is written.

**Scope:** This task reloads the collected intake, checks write access and the Node floor, and compares the contract tree with the directory. It must not require a global Expo binary, Xcode, or the Android SDK, store the path list, install Node, or write a project file.

**Verification / Definition of Done:**
- [ ] `status`, `name`, and `targetDir` were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] A directory inside the imported App Builder collection, or a path that resolves outside the directory, stopped as `needs_input` with no files written.
- [ ] Node matched `^20.19.0` or `>=22.12.0`, and `npm -v` and `npx --version` succeeded, or the task stopped `blocked` without installing them and without a write approval.
- [ ] The contract topology was compared with the directory. Unrelated files did not add a question.
- [ ] One preview showed the name, directory, fixed Expo stack, and toolchain, plus one overwrite-or-other-directory line only when a planned path already exists.
- [ ] Approval wrote `status` `approved`, `toolchain`, and `overwrite` as `not-needed` or `granted`. Cancellation finished `done` and said that no starter was produced.

**Instructions:**

1. Set state to `checking`. Reload `status`, `name`, and `targetDir`. If any is missing, or `status` is not `collected`, stop `blocked`, name the missing string, and write nothing.
2. Refuse `targetDir` when it lies inside the imported App Builder collection. Membership comes from imported-resource metadata and folder ancestry, not from a folder happening to be named App Builder. Stop `needs_input` and ask for a different directory. Write nothing there.
3. Resolve `targetDir`. Refuse it when that path, or a planned path under it, resolves outside the directory through a symlink or another link. Stop `needs_input` and ask for a different directory.
4. If the parent is not writable, stop `blocked`, name write access, and write nothing. Do not create the project directory in this task.
5. Run `node -e "const [maj,min]=process.versions.node.split('.').map(Number); const ok=(maj===20&&min>=19)||maj>22||(maj===22&&min>=12); if(!ok){console.error('Node must be ^20.19.0 or >=22.12.0, found '+process.versions.node); process.exit(1)}"`, then `npm -v` and `npx --version`. Node 21 is not accepted. If Node, npm, or npx fails, stop `blocked`. Name Node.js `^20.19.0` or `>=22.12.0` with npm and npx. Do not install them. Do not require a global `expo` binary, Xcode, or the Android SDK. Do not show a write approval.
6. Read only the Topology section of "App Builder Expo React Native Contract". Compare those planned paths with the directory. Do not read a standard. If the directory does not exist, no planned path exists. Unrelated files do not count. Discard the path list. Do not store it.
7. Set state to `waiting`. Show one preview: display name, directory, Expo Router for iOS and Android, and the observed toolchain, for example `node 20.19.0, npm 10.8.2`. When no planned path exists, the confirmation is proceed or cancel. When any planned path exists, the same preview asks once to overwrite the files this starter needs, or to choose a different directory, and cancel remains available. Do not ask a platform question.
8. Proceed with no collision: set `overwrite` to `not-needed`. Proceed with blanket overwrite: set `overwrite` to `granted`. Keep `name` and `targetDir`. Set `status` to `approved` and `toolchain` to the short observed version string. Write no project files.
9. A different directory updates `targetDir` and returns to step 2 before any write. That change discards the previous overwrite grant. Show one new preview, and set `overwrite` only from that preview. Later tasks do not ask again. This starter has no choice tokens. Cancel finishes `done`, writes nothing, and the handoff says that no starter was produced. It does not expose internal field names.
