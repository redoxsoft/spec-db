**Goal:** Collect the app name and directory for an Expo Router app.

**Scope:** This task accepts a short intent and asks for the display name and the directory, one at a time. It must not open a spec, ask about iOS versus Android, Expo versus bare React Native, or TypeScript versus JavaScript, or write files.

**Verification / Definition of Done:**
- [ ] The display name and directory were each answered.
- [ ] No platform, language, or stack question was asked.
- [ ] Pipeline context holds `status` `collected`, `name`, and `targetDir`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for an iOS and Android app. Do not open a spec. This starter has no stack choice tokens. Both platforms, Expo Router, and TypeScript are fixed.
2. Ask for the app name. When the user is unsure, suggest `my-expo-app`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my-expo-app`. Store it as `targetDir`.
4. Recap the name and directory. If the user corrects one, update that value and recap again. This recap is not the write approval. Do not ask another product question.
5. Write pipeline context: `status` = `collected`, `name`, and `targetDir`. Do not store a choice token, file contents, a path list, or a toolchain result. Do not write files.
