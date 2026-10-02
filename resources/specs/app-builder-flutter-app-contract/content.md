# App Builder Flutter App Contract

## Context <!-- key: context -->

One Flutter screen that shows `projectName` on iOS and Android. No auth, camera, or business features. Both mobile platforms and Dart are fixed.

`packageName` is `projectName` lowercased, with spaces and hyphens replaced by underscores, and a leading digit prefixed with `app_`. `flutter create` and Dart imports use that name.

Pubspec version numbers, not ranges:

| Package | Version |
| :--- | :--- |
| `go_router` | `18.0.2` |
| `flutter_riverpod` | `3.4.3` |
| `flutter_secure_storage` | `11.2.0` |
| `connectivity_plus` | `7.3.1` |

SDK floor: Flutter `>=3.44.0` and Dart `>=3.12.0`. `go_router` 18.0.2 requires that floor.

Apply App Builder Mobile Standards, section Topology & Directory Structure, for the feature-first tree. Apply section Layering & Design Patterns for screens versus widgets and GoRouter. Apply section Resilience, Errors & Diagnostics for safe area and offline awareness. Apply section Quality Baseline & Verification for strict analyzer flags and `flutter analyze`.

## Choice Tokens <!-- key: choice-tokens -->

This starter has no stack choice tokens. `packageName` is derived, not chosen.

## Topology <!-- key: topology -->

```bash
flutter create --platforms=ios,android --org com.example --project-name <packageName> <targetDir>
```

Layout to add after create:

```text
lib/
├── main.dart
├── core/
│   ├── theme/app_theme.dart
│   ├── storage/secure_storage.dart
│   └── error/app_failure.dart
├── features/home/
│   └── presentation/
│       ├── home_screen.dart
│       └── offline_banner.dart
test/home_screen_test.dart
analysis_options.yaml
.github/workflows/ci.yml      # flutter analyze and flutter test
```

`main.dart` uses `ProviderScope`, `MaterialApp.router`, and a `GoRouter` route `/` that builds `HomeScreen`. A Riverpod `Provider<String>` named `appTitleProvider` returns `projectName`. `HomeScreen` watches it for the title text. `HomeScreen` uses `SafeArea` and shows `OfflineBanner`. `secure_storage.dart` wraps `FlutterSecureStorage` and is not called from `HomeScreen`. `analysis_options.yaml` enables `strict-casts`, `strict-inference`, and `strict-raw-types`. `pubspec.yaml` `name` stays `packageName`. The description may change. Add the four pinned dependencies.

Feature widgets take colors from `ThemeData` / `ColorScheme` built in `lib/core/theme/`. Do not write `Color(0x` in `lib/features/`.

## Output Contract <!-- key: output-contract -->

- Title text equals `projectName`. Route `/` is the home screen. Theme comes from `lib/core/theme/app_theme.dart`.
- Platforms are only iOS and Android. Analyzer strict flags are on. Feature files contain no `Color(0x`.
- Fixed: package pins, route, provider name, and the platform list. Free: the subtitle under the title.
- `flutter analyze` and `flutter test` exit 0. `flutter run` is not a required check. `.github/workflows/ci.yml` runs those two commands.

## Design System <!-- key: design-system -->

Build `ThemeData` in `app_theme.dart` with a `ColorScheme` seeded from one brand color defined only in that file.

- Color roles: `surface` is a light neutral, `onSurface` is near-black, and `primary` is indigo.
- Space: screen padding 24, stack gap 12.
- Type: the title uses `textTheme.headlineSmall`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `flutter create` used `--platforms=ios,android` only.
- [ ] `pubspec.yaml` name is `packageName` and pins the four dependencies at the versions in Context.
- [ ] `analysis_options.yaml` sets `strict-casts`, `strict-inference`, and `strict-raw-types`.
- [ ] `lib/main.dart` uses `ProviderScope` and `GoRouter` with path `/`.
- [ ] `HomeScreen` displays `appTitleProvider` and contains no `Color(0x` literal.
- [ ] `lib/core/theme/app_theme.dart`, `lib/core/storage/secure_storage.dart`, and `lib/core/error/app_failure.dart` exist.
- [ ] `test/home_screen_test.dart` finds the `projectName` text.
- [ ] `README.md` documents `flutter pub get`, `flutter analyze`, `flutter test`, and `flutter run`.
- [ ] `.github/workflows/ci.yml` runs `flutter analyze` and `flutter test`.
- [ ] `flutter analyze` exits 0.
- [ ] `flutter test` exits 0.
- [ ] A missing device is not a failed check.
