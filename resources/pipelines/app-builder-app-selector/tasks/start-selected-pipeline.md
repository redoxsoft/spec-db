**Goal:** Start the confirmed generator by its exact catalog title.

**Scope:** This task reloads the selected starter and starts that generator. It must not ask for a project name or directory, ask the three selector questions again, open a spec, check a toolchain, or write project files.

**Verification / Definition of Done:**
- [ ] `selectedSlug` and `selectedTitle` were present, and the pipeline whose exact title is `selectedTitle` was started.
- [ ] This task did not ask for a name, a directory, or a selector question.
- [ ] When `carriedApiRuntime` is `python` and the selected title is App Builder React Separate API, that generator run is told to answer Python when it asks for API runtime.
- [ ] No project file was written by this pipeline.

**Instructions:**

1. Reload pipeline context. Stop `blocked` if `status` is not `selected`, or if `selectedSlug` or `selectedTitle` is missing. Do not reconstruct the selection from conversation.

2. Find the pipeline whose exact catalog title is `selectedTitle`. Stop `blocked` if that title cannot be found. Do not start a pipeline by guessing a similar name.

3. Start that pipeline now and begin its first task. Do not ask for a project name or directory here. Name, directory, and any remaining generator choices belong to that generator. This pipeline writes no project files.

4. If `carriedApiRuntime` is `python` and `selectedTitle` is App Builder React Separate API, tell that run to answer Python, stored as `python`, when it asks for API runtime. Do not carry a Python answer onto any other generator.

5. Finish `done`. The user-facing handoff names the starter that was started, using the catalog title, and says that name, directory, and remaining stack choices are asked in that generator. It does not expose internal field names. It does not say a starter directory was written.
