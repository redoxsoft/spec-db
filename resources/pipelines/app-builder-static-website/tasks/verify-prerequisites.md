**Goal:** Check the machine and directory, then get one approval before any file is written.

**Scope:** This task reloads the collected intake, checks write access and the Vite toolchain when needed, compares the contract tree with the directory, and shows one preview. It must not open a standard, store the path list, install Node or npm, or write a project file.

**Verification / Definition of Done:**
- [ ] `status`, `name`, `targetDir`, and `buildTool` were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] A directory inside the imported App Builder collection, or a path that resolves outside the directory, stopped as `needs_input` with no files written.
- [ ] `buildTool` `vite` required Node `^20.19.0` or `>=22.12.0` (Node 21 is not accepted) and npm. `plain` recorded toolchain `not-required` and did not check Node.
- [ ] A missing or unusable required tool, or a directory that cannot be written, stopped as `blocked`, named what is missing, and did not install it.
- [ ] The topology for the selected `buildTool` was compared with the directory. Unrelated files did not add a question.
- [ ] One preview showed the name, directory, build tool, and toolchain result, plus one overwrite-or-other-directory line only when a planned path already exists.
- [ ] Approval wrote `status` `approved`, `toolchain`, and `overwrite` as `not-needed` or `granted`. Cancellation finished `done` and said that no starter was produced.
- [ ] The path list was not stored. No project file was written.

**Instructions:**

1. Set state to `checking`. Reload `status`, `name`, `targetDir`, and `buildTool`. If any is missing, or `status` is not `collected`, stop `blocked`, name the missing string, and write nothing.
2. Refuse `targetDir` when it lies inside the imported App Builder collection. Membership comes from imported-resource metadata and folder ancestry, not from a folder happening to be named App Builder. Stop `needs_input` and ask for a different directory. Write nothing there.
3. Resolve `targetDir`. Refuse it when that path, or a planned path under it, resolves outside the directory through a symlink or another link. Stop `needs_input` and ask for a different directory.
4. If the parent is not writable, stop `blocked`, name write access, and write nothing. Do not create the project directory in this task.
5. If `buildTool` is `vite`, run `node -e "const [maj,min]=process.versions.node.split('.').map(Number); const ok=(maj===20&&min>=19)||maj>22||(maj===22&&min>=12); if(!ok){console.error('Node must be ^20.19.0 or >=22.12.0, found '+process.versions.node); process.exit(1)}"`, then `npm -v`. Node 21 is not accepted. If Node or npm fails, stop `blocked`, name Node.js `^20.19.0` or `>=22.12.0` and npm, and say they are required before a Vite site can be written. Do not install them, and do not show a write approval. If `buildTool` is `plain`, skip Node and npm. The toolchain string is `not-required`.
6. Read only the Topology section of "App Builder Static Website Contract" for the selected `buildTool`. Compare those planned paths with the directory. Do not read a standard. If the directory does not exist, no planned path exists. Unrelated files do not count. Discard the path list after the comparison. Do not store it.
7. Set state to `waiting`. Show one preview: display name, directory, Vite or plain HTML, and the toolchain result. When no planned path exists, the confirmation is proceed or cancel. When any planned path exists, the same preview asks once to overwrite the files this starter needs, or to choose a different directory, and cancel remains available. Do not ask a second product question.
8. Proceed with no collision: set `overwrite` to `not-needed`. Proceed with blanket overwrite: set `overwrite` to `granted`. Keep `name`, `targetDir`, and `buildTool`. Set `status` to `approved` and `toolchain` to a short observed value such as `node 20.19.0, npm 10.8.2`, or `not-required`. Write no project files.
9. A different directory updates `targetDir` and returns to step 2 before any write. A changed `buildTool` before any write updates that token and returns to step 2. Either change discards the previous overwrite grant. Show one new preview, and set `overwrite` only from that preview. Later tasks do not ask again. Cancel finishes `done`, writes nothing, and the handoff says that no starter was produced. The handoff names the outcome, the directory, that no stack was written, and that there is no next command. It does not expose internal field names.
