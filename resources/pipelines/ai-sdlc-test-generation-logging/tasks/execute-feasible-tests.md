**Goal:** Run only the Test Plan cases that can actually execute in this environment, and capture observed outcomes.

**Scope:** Execute cases from the locked `<Subject> - Test Plan` against the locked `${SOURCE_SPEC_REF}`. Do not edit the Test Plan in this task. Do not edit application code to make a test pass. Do not fix application defects — report them. Do not invent results. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** Every case is classified as runnable or not in this environment. Runnable cases were executed and their observed outcomes recorded (pass or fail with actual result). Unrunnable cases name the exact reason they were not run, including `not ready: <reason>` for implementation-specific cases that lack environment, API, or build detail. No result was assumed or counted as PASS.

**Instructions:**

- Reread the document titled `<Subject> - Test Plan` in full, and reread the locked `${SOURCE_SPEC_REF}` by document id when one was locked; otherwise by exact title. If either is unavailable, repeat resolution rather than guessing.
- For each case, decide whether it can actually run here: required environment, data, tools, and access must exist. Do not substitute a different environment silently. Do not skip a high-risk case merely because it is awkward if it is otherwise runnable.
- Implementation-specific cases without environment, API, or build detail are `not run` with `not ready: <reason>`. Never invent their results or count them as PASS.
- Execute only the cases that can run. Record the command or steps used and the observed result. A case that cannot fail is not a test — still record what was observed.
- Do not treat an unrun case as a pass. Do not convert a fail into `not run` to keep the plan green.
- If a case fails, report the defect. Do not patch application code in this pipeline.
- Report the Test Plan title, test-plan mode, which cases ran, observed pass/fail, which cases were not runnable and why, and any defects found. Carry those observed outcomes for the logging task.
