# App Builder Mobile Standards

## Topology & Directory Structure <!-- key: topology -->

Opinionated architectural standards for cross-platform mobile applications (Expo + React Native and Flutter).

Day-0 is binding: repo artifacts, theme tokens, safe area, offline banner, error boundary, lint or analyzer, one test, and CI. Later sentences are non-binding and must not stop a run.

Mobile applications enforce clean separation between route navigation, presentation widgets, state management, and device infrastructure. Hello-world implements one home screen on that layout.

### Mandatory Repository Artifacts

Every generated mobile project must include:

- `README.md`: Development setup, simulator commands (`npm run ios`, `npm run android`, `flutter run`), device pairing instructions (Expo Go QR), and environment variable documentation.
- `.env.example`: Template listing all required public and private environment keys; secrets must never be committed.
- `.gitignore`: Standard React Native / Flutter ignores (`node_modules`, `.expo`, `.dart_tool`, `build/`, `ios/Pods`, `.env*` except `.env.example`).
- `.github/workflows/ci.yml`: Expo runs lint and typecheck. Flutter runs `flutter analyze` and `flutter test`. A missing simulator is not a CI failure.

### Expo + React Native Layout (Expo Router)

```text
├── app/                      # File-based navigation hierarchy
│   ├── _layout.tsx           # Root navigation stack and theme provider
│   ├── index.tsx             # Home / landing screen
│   └── (tabs)/               # Tab-based route group
├── components/
│   ├── ui/                   # Reusable mobile primitives (Button, Card, Text)
│   └── layout/               # Screen wrappers, Safe Area containers, KeyboardAvoiding containers
├── features/                 # Domain-specific modules
│   └── [feature]/
│       ├── components/       # Feature-specific UI
│       └── hooks/            # Feature business logic and queries
├── services/                 # API client, device services, storage gateway
│   └── secure-storage.ts     # Platform Keychain / Keystore wrapper
├── theme/                    # Color palette, spacing, typography tokens
└── app.json                  # Expo application configuration
```

### Flutter Layout (Feature-First)

```text
├── lib/
│   ├── core/                 # Shared foundations
│   │   ├── theme/            # Theme data, color schemes, typography
│   │   ├── network/          # HTTP client, interceptors
│   │   ├── storage/          # Flutter secure storage wrapper
│   │   └── error/            # Failure models and exceptions
│   ├── features/             # Feature-first domain modules
│   │   └── [feature]/
│   │       ├── data/         # Repositories and data sources
│   │       ├── domain/       # Entity models and business logic
│   │       └── presentation/ # Screen widgets and Riverpod state controllers
│   └── main.dart             # Application root and provider scope
```

## Data Flow & State Lifecycle <!-- key: data-flow -->

### The Mobile Single-Gateway Rule

- **Screens Never Make Raw Network Calls**: Screen components must not instantiate HTTP requests or database connections directly.
- **Provider / Hook Mediated Access (day 0)**: Flutter home uses a Riverpod provider for the title. Expo home does not add Zustand or TanStack Query.
- **Later (non-binding)**: Zustand or TanStack Query in Expo for feature data.

### Secure Storage vs. Cache Storage

1. **Secure Storage Invariant**: Authentication tokens, refresh tokens, and sensitive biometric credentials must be stored strictly in hardware-backed platform secure storage (`expo-secure-store` / iOS Keychain & Android Keystore, or `flutter_secure_storage`).
2. **Unencrypted Storage Ban**: `AsyncStorage` or unencrypted key-value stores must NEVER hold tokens, user credentials, or personally identifiable information (PII). Use unencrypted storage only for non-sensitive UI preferences (e.g., theme toggle, onboarding viewed).

## Layering & Design Patterns <!-- key: design-patterns -->

- **Screens vs. Widgets**:
  - `Screens`: Represent full-view route targets; consume state providers, wire navigation callbacks, and compose layout.
  - `Widgets / UI Primitives`: Pure presentational components receiving data via props/parameters; completely decoupled from router state.
- **Platform Interaction Standards**:
  - **Keyboard Avoidance**: All form and input screens must wrap input fields in keyboard avoidance containers (`KeyboardAvoidingView` with platform offset or scrollable container) to prevent the virtual keyboard from obscuring focused inputs.
  - **Hardware Navigation**: Respect Android hardware back-button behaviors and iOS interactive edge swipe-back gestures without breaking navigation stack state.
- **Platform Abstraction Layer**:
  - When accessing native device APIs (biometrics, camera, haptics, geolocation), wrap the native call in an abstract application service interface.
  - Never scatter platform-checking conditional blocks (`Platform.OS === 'ios'`) across visual widget trees.
- **Modern Navigation**:
  - Expo: File-based routing with **Expo Router** using typed routes.
  - Flutter: Declarative routing with **GoRouter**.

## Resilience, Errors & Diagnostics <!-- key: resilience -->

- **Global Uncaught Error Boundary**:
  - Wrap the root component/app in an error boundary that catches rendering exceptions and displays a user-friendly recovery screen with a "Restart" or "Reload" action.
- **Offline Awareness**:
  - The application must monitor network connectivity (e.g., NetInfo / connectivity_plus) and display a non-intrusive banner or toast when offline, without crashing active views.
- **Safe Area Inset Handling**:
  - Every screen layout must respect hardware cutouts, dynamic islands, and home indicator bars by incorporating Safe Area insets (`SafeAreaView` / `SafeArea`).

## Quality Baseline & Verification <!-- key: quality-baseline -->

- **Strict Type Checking**:
  - In Expo: TypeScript with strict mode enabled (`"strict": true`).
  - In Flutter: Dart analyzer configured with `strict-casts`, `strict-inference`, and `strict-raw-types`.
- **Centralized Design Tokens (day 0)**: Hardcoded color hex strings inside UI widget code are prohibited. All visual styling references the centralized theme palette (`theme/` or `ThemeData`). NativeWind is later and is not added in hello-world.
- **Verification Harness (day 0)**:
  - Expo: `npm run lint`, `npx tsc --noEmit`, and `npm test` (one node-environment test; do not launch a simulator).
  - Flutter: `flutter analyze` and `flutter test`.
  - A missing device is not a failed check.
