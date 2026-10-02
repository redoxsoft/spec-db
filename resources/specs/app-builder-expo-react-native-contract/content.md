# App Builder Expo React Native Contract

## Context <!-- key: context -->

One Expo Router screen that shows `projectName`. iOS and Android. No auth, camera, or business features. Both platforms, Expo Router, and TypeScript are fixed.

Do not use `latest`. Copy this table into `package.json`.

| Package | Specifier |
| :--- | :--- |
| `expo` | `57.0.26` |
| `expo-router` | `57.0.24` |
| `expo-linking` | `57.0.11` |
| `expo-constants` | `57.0.20` |
| `expo-status-bar` | `57.0.1` |
| `expo-secure-store` | `57.0.4` |
| `react` | `19.2.3` |
| `react-native` | `0.86.3` |
| `react-native-screens` | `4.26.2` |
| `react-native-safe-area-context` | `5.7.0` |
| `react-native-gesture-handler` | `2.32.0` |
| `react-native-reanimated` | `4.5.1` |
| `react-native-worklets` | `0.10.1` |
| `@expo/metro-runtime` | `57.0.16` |
| `@react-native-community/netinfo` | `12.0.1` |
| `typescript` | `5.9.3` |
| `@types/react` | `19.2.3` |
| `eslint` | `9.39.5` |
| `eslint-config-expo` | `57.0.2` |
| `vitest` | `5.0.2` |

Apply App Builder Mobile Standards, section Topology & Directory Structure, for the Expo Router tree. Apply section Resilience, Errors & Diagnostics for the error boundary, offline banner, and safe area. Apply section Quality Baseline & Verification for strict TypeScript, theme tokens, lint, typecheck, one node-environment test, and CI.

## Choice Tokens <!-- key: choice-tokens -->

This starter has no stack choice tokens.

## Topology <!-- key: topology -->

```text
├── app/
│   ├── _layout.tsx
│   ├── index.tsx                 # Redirect to /(tabs)
│   └── (tabs)/
│       ├── _layout.tsx
│       └── index.tsx             # Home screen
├── components/
│   ├── ui/ErrorBoundary.tsx
│   └── layout/OfflineBanner.tsx
├── services/secure-storage.ts
├── theme/colors.ts
├── theme/spacing.ts
├── theme/colors.test.ts          # node-environment Vitest; does not launch a simulator
├── vitest.config.ts
├── app.json
├── package.json
├── tsconfig.json
├── eslint.config.js
├── README.md
├── .gitignore
├── .env.example
└── .github/workflows/ci.yml      # lint and typecheck
```

Scripts: `start` is `expo start`, `ios` is `expo start --ios`, `android` is `expo start --android`, `lint` is `expo lint`, `typecheck` is `tsc --noEmit`, and `test` is `vitest run`.

`vitest.config.ts` sets `environment: 'node'` and includes `theme/**/*.test.ts`. `theme/colors.test.ts` asserts that `background`, `text`, `muted`, and `accent` are defined. Do not add `jest-expo`. Do not launch a simulator.

`app.json` `expo.name` is `projectName`. `slug` and `scheme` are the slug of that name. `platforms` is `["ios", "android"]`. The plugin list includes `expo-router` and `expo-secure-store`.

`app/(tabs)/index.tsx` shows a `Text` title equal to `projectName`, inside a safe-area view, using theme tokens. It renders `OfflineBanner`. `app/_layout.tsx` wraps children in `ErrorBoundary` and a gesture-handler root. `services/secure-storage.ts` exports `getSecret` and `setSecret` using `expo-secure-store`. The home screen does not call them. `.env.example` contains `EXPO_PUBLIC_APP_NAME=` with the project name as the placeholder value. No real secrets.

Screens and components import colors and spacing from `theme/`. Hex color literals do not appear in `app/` or `components/`.

## Output Contract <!-- key: output-contract -->

- The home screen title is `projectName`. The root layout has an error boundary. Home uses a safe area. The offline banner exists. The theme module is the only color source for UI.
- Both platforms are listed in `app.json`. TypeScript `strict` is true. Lint, typecheck, and the theme test exit 0.
- Fixed: versions, routes, token names, and the both-platform config. Free: the subtitle under the title.
- `npm run typecheck`, `npm run lint`, and `npm test` exit 0. `package-lock.json` exists after install. `expo start` is a documented manual command, not a required check.

## Design System <!-- key: design-system -->

Define these names in `theme/colors.ts` and `theme/spacing.ts`. UI code references the names.

- Color: `background` is a slate-50 equivalent, `text` a slate-900 equivalent, `muted` a slate-500 equivalent, and `accent` an indigo-600 equivalent. Hex values may appear only inside `theme/colors.ts`.
- Space: `screen` is 24 and `stack` is 12.
- Type: title size 28, weight `700`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `package.json` pins the Context table and defines `start`, `ios`, `android`, `lint`, `typecheck`, and `test`.
- [ ] `app.json` `platforms` lists `ios` and `android`.
- [ ] `tsconfig.json` has `"strict": true`.
- [ ] `app/(tabs)/index.tsx` renders `projectName` and does not contain a hex color literal.
- [ ] `app/_layout.tsx` uses `ErrorBoundary`.
- [ ] `components/layout/OfflineBanner.tsx` and `services/secure-storage.ts` exist.
- [ ] `theme/colors.ts` and `theme/spacing.ts` exist. `theme/colors.test.ts` asserts the four color names.
- [ ] `README.md` documents `npx expo start` (QR / Expo Go), `npm run ios`, and `npm run android`.
- [ ] `.gitignore` ignores `node_modules`, `.expo`, and `.env`.
- [ ] `.github/workflows/ci.yml` runs lint and typecheck.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm test` exits 0.
- [ ] `package-lock.json` is present.
- [ ] A missing simulator is not a failed check. Automated checks do not launch one.
