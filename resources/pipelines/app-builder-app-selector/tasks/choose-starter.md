**Goal:** Ask three intent questions and store the confirmed generator as short pipeline-context strings.

**Scope:** This task recommends one of the nine App Builder generators from business intent and confirms or overrides that recommendation. It must not show a recommended marker on the first two questions, ask for a project name or directory, open a spec, check a toolchain, write project files, or start another pipeline.

**Verification / Definition of Done:**
- [ ] Three questions were asked one at a time. Questions 1 and 2 had no recommended marker. Question 3 listed all nine starters with `**[Recommended]**` prefixed on item 1 only.
- [ ] The stored slug and title are one of the nine generators in the catalog table in this task.
- [ ] Pipeline context holds `status` `selected`, `selectedSlug`, and `selectedTitle`, each a short string. `carriedApiRuntime` is `python` only when a free-text answer already chose a new Python backend for React + Separate API; otherwise that key is omitted.
- [ ] No project file was written, no spec was opened, and no other pipeline was started.

**Instructions:**

1. Set state to `asking`. Do not open a spec. Do not write files. Do not start another pipeline. The nine legal starters, with catalog title, slug, and confirmation blurb, are:

   | Short name | Catalog title | Slug | Confirmation blurb |
   |---|---|---|---|
   | Next.js Full-Stack | App Builder Next.js Full-Stack | `app-builder-nextjs-fullstack` | single project with UI and backend together |
   | React + Separate API | App Builder React Separate API | `app-builder-react-separate-api` | separate UI and backend projects |
   | React + Vite Web App | App Builder React Vite Web App | `app-builder-react-vite-webapp` | UI only, no embedded backend |
   | Static Website | App Builder Static Website | `app-builder-static-website` | simple landing page or portfolio |
   | Next.js Website | App Builder Next.js Website | `app-builder-nextjs-website` | content-oriented multi-page website |
   | Node.js API | App Builder Node.js API | `app-builder-nodejs-api` | standalone JavaScript / TypeScript backend |
   | Python API | App Builder Python API | `app-builder-python-api` | standalone Python backend |
   | Expo + React Native | App Builder Expo React Native | `app-builder-expo-react-native` | iPhone and Android application |
   | Flutter | App Builder Flutter App | `app-builder-flutter-app` | iPhone and Android application using Dart |

   Canonical remainder order for Question 3 is that table order. Do not invent a tenth starter.

2. Ask Question 1 exactly:

   **What do you want to create?**

   1. A public website — to present a business, showcase work, or publish content.
   2. A browser application — where customers or staff complete tasks, manage information, or use tools.
   3. A phone application — that people install on iPhone or Android.
   4. A backend service — that other applications connect to.

   End with: Reply with a number, or write a one-line answer if none fits. Do not mark any choice recommended. Map `1` to website, `2` to browser application, `3` to phone application, and `4` to backend service. Map a one-line answer to the closest of those four. If it cannot be mapped, ask Question 1 again.

3. Ask only the Question 2 that matches Question 1. Do not mark any choice recommended. Option 1 is the default when the user is unsure. End each Question 2 with: Reply with a number, or write a one-line answer if none fits. If a one-line answer cannot be mapped, ask that Question 2 again.

   **Website — What kind of website are you planning?**

   1. A simple site — a landing page, portfolio, or small business website.
   2. A content-oriented site — articles, documentation, or a growing collection of pages.
   3. Not sure yet — start with a simple website.

   Map `1`, `3`, or unsure to Static Website. Map `2` to Next.js Website.

   **Browser application — What kind of starting project do you want?**

   1. A single project containing both the user interface and backend — good for maintainability and scale.
   2. Two separate projects — one for the user interface and one for the backend — to keep concerns clearly separated.
   3. Just the user interface — it can work independently or connect to an existing backend.

   Map `1` to Next.js Full-Stack. Map `2` to React + Separate API. Map `3` to React + Vite Web App. A one-line answer that names a new Python backend maps to React + Separate API and sets a pending `carriedApiRuntime` of `python`.

   **Phone application — Do you have a technology preference?**

   1. No preference.
   2. React Native / JavaScript / TypeScript.
   3. Flutter / Dart.

   Map `1` or `2` to Expo + React Native. Map `3` to Flutter.

   **Backend service — Does the backend need to use a particular language?**

   1. No preference.
   2. JavaScript / TypeScript.
   3. Python.

   Map `1` or `2` to Node.js API. Map `3` to Python API.

4. Ask Question 3. The recommended starter is the Question 2 result. Build the list so that starter is item 1, then the other eight in canonical remainder order, skipping the recommended slug. Prefix item 1 with `**[Recommended]**` at the start of that choice, never at the end. Do not mark items 2 through 9. Prompt with: We recommend {short name}. Which starter would you like to use? Then list nine numbered lines in this shape: `1. **[Recommended]** Next.js Full-Stack — single project with UI and backend together.` End with: Reply 'yes' to accept the recommendation, choose another number, or describe what does not fit.

5. `yes`, `y`, or `1` accepts item 1. A number 2 through 9 selects that listed starter. If the accepted starter is not React + Separate API, clear any pending `carriedApiRuntime`. Keep `python` only when the accepted starter is React + Separate API and a pending Python backend was already recorded. A sentence that does not fit is mapped to the closest legal starter; show Question 3 again with that starter as item 1 and the prefix at the start of that line. If it cannot be mapped, show the same Question 3 again.

6. Write pipeline context: `status` = `selected`, `selectedSlug` = the accepted slug, `selectedTitle` = the accepted catalog title. Write `carriedApiRuntime` = `python` only when step 5 kept that value. Otherwise omit `carriedApiRuntime`. Do not store file contents, a path list, or a toolchain result. Do not write files. Do not start another pipeline.
