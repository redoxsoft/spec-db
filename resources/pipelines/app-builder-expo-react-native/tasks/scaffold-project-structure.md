**Goal:** Create the Expo Router tree, pinned manifest, and app config for iOS and Android.

**Scope:** This task writes directories, `package.json`, and config. It must not implement the home screen, error boundary, or README commands, and it must not install packages or run `expo start`.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `package.json` copies every Context specifier and defines `start`, `ios`, `android`, `lint`, `typecheck`, and `test`. `"main"` is `expo-router/entry`.
- [ ] `app.json` lists `ios` and `android`. `tsconfig.json` has `"strict": true`.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. No install was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Context and Topology in "App Builder Expo React Native Contract". Also read Topology & Directory Structure in "App Builder Mobile Standards" for the Expo Router layout. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain. Do not add a web platform or a bare `ios/` and `android/` project.
4. Create the Topology directories and placeholder files. Write `package.json` with every Context row copied exactly. Do not write `latest`. Scripts: `start` is `expo start`, `ios` is `expo start --ios`, `android` is `expo start --android`, `lint` is `expo lint`, `typecheck` is `tsc --noEmit`, and `test` is `vitest run`. `"main"` is `expo-router/entry`. `vitest.config.ts` sets `environment: 'node'` and includes `theme/**/*.test.ts`. Write `.github/workflows/ci.yml` that runs lint and typecheck. Do not add `jest-expo`.
5. `app.json` sets `expo.name` to the display name stored as `name`. `slug` and `scheme` are that name lowercased, with spaces turned into hyphens. `platforms` is `["ios", "android"]`. Plugins include `expo-router` and `expo-secure-store`.
6. `tsconfig.json` extends `expo/tsconfig.base` and sets `"strict": true`. `eslint.config.js` uses `eslint-config-expo`. `.gitignore` ignores `node_modules`, `.expo`, and `.env`. `.env.example` contains `EXPO_PUBLIC_APP_NAME=` with the display name as the placeholder. No real secrets. Do not run `npm install` or `expo start`.
