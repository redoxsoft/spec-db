**Goal:** Create an iOS and Android Flutter project and add the feature-first folders and pinned dependencies.

**Scope:** This task runs `flutter create` for iOS and Android only, then adds the contract folders, the four pub pins, and the analyzer flags. It must not implement the home screen or run `flutter pub get` or `flutter run`.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `flutter create` used `--platforms=ios,android` only, with the derived package name.
- [ ] `pubspec.yaml` name is `packageName` and pins `go_router` `18.0.2`, `flutter_riverpod` `3.4.3`, `flutter_secure_storage` `11.2.0`, and `connectivity_plus` `7.3.1`.
- [ ] `analysis_options.yaml` sets `strict-casts`, `strict-inference`, and `strict-raw-types`.
- [ ] Create ran only when the directory was empty or `overwrite` was `granted`. No pub get was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `packageName`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Context and Topology in "App Builder Flutter App Contract". Also read Topology & Directory Structure in "App Builder Mobile Standards" for the feature-first layout. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Run `flutter create` only when `overwrite` is `granted` or the directory is empty. If `overwrite` is `not-needed` and any file already exists, stop `failed` and do not ask. Do not enable web, macOS, Windows, or Linux. Do not install a missing Flutter SDK.
4. From the parent of the directory, run `flutter create --platforms=ios,android --org com.example --project-name` followed by the stored `packageName` and the resolved directory. Do not pass any other platform.
5. Add `lib/core/theme/`, `lib/core/storage/`, `lib/core/error/`, and `lib/features/home/presentation/`. Leave widget bodies for Wire the Home Screen. Add the four Context dependencies to `pubspec.yaml` at those exact versions, not as ranges. Keep `name` equal to `packageName`. The description may change.
6. `analysis_options.yaml` enables `strict-casts`, `strict-inference`, and `strict-raw-types`. Write `.github/workflows/ci.yml` that runs `flutter analyze` and `flutter test`. Do not run `flutter pub get` or `flutter run`.
