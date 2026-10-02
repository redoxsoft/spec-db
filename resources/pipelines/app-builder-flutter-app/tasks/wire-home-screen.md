**Goal:** Implement the GoRouter home screen, theme, offline banner, and a widget test that finds the app title.

**Scope:** This task fills `lib/main.dart`, the theme, the home feature, secure storage, and the widget test. It must not run `flutter pub get`, `flutter analyze`, `flutter test`, or `flutter run`.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `lib/main.dart` uses `ProviderScope` and `GoRouter` with path `/`.
- [ ] `HomeScreen` shows `appTitleProvider` inside `SafeArea` and has no `Color(0x` literal.
- [ ] `test/home_screen_test.dart` finds the display name. `README.md` documents `flutter pub get`, `flutter analyze`, `flutter test`, and `flutter run`.
- [ ] The four pub pins were not changed. Secure storage is not called from the home screen.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `packageName`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not change the four pub versions.
2. Re-read Topology, Output Contract, and Design System in "App Builder Flutter App Contract". Also read Layering & Design Patterns in "App Builder Mobile Standards" for screens versus widgets and GoRouter. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a file `flutter create` wrote, or a planned path, only when `overwrite` is `granted` or this run created it. If `overwrite` is `not-needed` and a planned path already exists that this run did not create, stop `failed` and do not ask. Do not delete unrelated files.
4. `lib/core/theme/app_theme.dart` builds `ThemeData` from a `ColorScheme`. `surface` is a light neutral, `onSurface` is near-black, and `primary` is indigo. The brand color literal stays in that file. Screen padding is 24 and the stack gap is 12. The title uses `textTheme.headlineSmall`. Feature files do not contain `Color(0x`.
5. A Riverpod `Provider<String>` named `appTitleProvider` returns the display name stored as `name`. `HomeScreen` watches it, shows that string inside `SafeArea`, and shows `OfflineBanner`. `OfflineBanner` uses `connectivity_plus`. `lib/main.dart` uses `ProviderScope`, `MaterialApp.router`, and a `GoRouter` route `/` that builds `HomeScreen`. Dart imports use `packageName`.
6. `lib/core/storage/secure_storage.dart` wraps `FlutterSecureStorage` and is not called from `HomeScreen`. `lib/core/error/app_failure.dart` exists. `test/home_screen_test.dart` wraps the screen in `ProviderScope` and finds the display name.
7. `README.md` documents `flutter pub get`, `flutter analyze`, `flutter test`, and `flutter run`. State that `flutter run` needs a device or simulator and is not part of the automated check. Do not run those commands in this step. Do not deploy, push, tag, merge, submit the app to a store, or run `docker build`. Run git only when the user explicitly asks in this run.
