**Goal:** Collect the app name and directory, and derive the Dart package name.

**Scope:** This task accepts a short intent and asks for the display name and the directory, one at a time. It must not open a spec, ask about iOS versus Android or a state library, or write files.

**Verification / Definition of Done:**
- [ ] The display name and directory were each answered.
- [ ] `packageName` is the display name lowercased, with spaces and hyphens turned into underscores, and a leading digit prefixed with `app_`.
- [ ] The derived package name was shown before the task finished. No platform question was asked.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, and `packageName`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for an iOS and Android app. Do not open a spec. This starter has no stack choice tokens. Both mobile platforms and Dart are fixed.
2. Ask for the app name. When the user is unsure, suggest `My Flutter App`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my_flutter_app`. Store it as `targetDir`.
4. Derive `packageName` by lowercasing `name`, replacing spaces and hyphens with underscores, and prefixing a leading digit with `app_`. Tell the user that package name. Recap the display name, package name, and directory. If the user corrects the name or directory, derive the package name again and recap. This recap is not the write approval. Do not ask another product question.
5. Write pipeline context: `status` = `collected`, `name`, `targetDir`, and `packageName`. Do not store file contents, a path list, or a toolchain result. Do not write files.
