**Goal:** Implement the home screen, theme tokens, error boundary, offline banner, and secure-storage wrapper.

**Scope:** This task fills the screen and theme files and writes the README. It must not install packages, run `expo start`, call secure storage from the home screen, or add auth or a camera.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] The home screen title is the display name, inside a safe-area view, with no hex color literal in `app/` or `components/`.
- [ ] `app/_layout.tsx` uses `ErrorBoundary`. `OfflineBanner` and `services/secure-storage.ts` exist.
- [ ] `README.md` documents `npx expo start`, `npm run ios`, and `npm run android`.
- [ ] Pins were not changed. No packager was started.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not reread the Context pin table and do not change a specifier.
2. Re-read Topology, Output Contract, and Design System in "App Builder Expo React Native Contract". Also read Resilience, Errors & Diagnostics in "App Builder Mobile Standards" for the error boundary, offline banner, and safe area. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask.
4. `theme/colors.ts` defines `background`, `text`, `muted`, and `accent` as slate-50, slate-900, slate-500, and indigo-600 equivalents. Hex values stay in that file. `theme/spacing.ts` sets `screen` to 24 and `stack` to 12. Title size is 28 and weight is `700`. Screens and components import those names. `theme/colors.test.ts` asserts that those four names are defined. The test runs in Node and does not launch a simulator.
5. `components/ui/ErrorBoundary.tsx` wraps the tree in `app/_layout.tsx`, together with a gesture-handler root. `app/index.tsx` redirects to `/(tabs)`. `app/(tabs)/index.tsx` shows a `Text` title equal to the display name stored as `name`, inside a safe-area view, and renders `OfflineBanner`. `OfflineBanner` uses NetInfo. `services/secure-storage.ts` exports `getSecret` and `setSecret` using `expo-secure-store`. The home screen does not call them.
6. `README.md` documents `npm install`, `npm run typecheck`, `npm run lint`, `npm test`, `npx expo start` for the Expo Go QR code, `npm run ios`, and `npm run android`. State that simulators need Xcode or Android Studio and are not part of the automated check. Do not run `npm install` or `expo start`. Do not deploy, push, tag, merge, submit the app to a store, or run `docker build`. Run git only when the user explicitly asks in this run.
