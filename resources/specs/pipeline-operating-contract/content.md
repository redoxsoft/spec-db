# Pipeline Operating Contract

## Pipeline model <!-- key: pipeline-model -->

This SpecX spec applies to every project workflow pipeline (Discovery, Scaffolding, Planning, Milestone Builder).

A pipeline is an ordered set of tasks. Each task has a purpose, inputs, actions, outputs, and a stop condition. Execute tasks in order. Do not execute a later task when an earlier task has a blocking failure.

Every task in a pipeline must explicitly define:

- **Goal** — the outcome this task is responsible for;
- **Scope** — what the task may inspect or change;
- **Definition of Done** — objective conditions that must be true before the next task starts.

Actions are implementation guidance, not completion criteria. An agent must evaluate the Definition of Done after each task and stop when it is not satisfied.

Each pipeline invocation has:

```yaml
invocation:
  workflow: discovery | scaffolding | planning | milestone_builder
  project_name: "Habit Tracker"
```

The user-facing input is only `project_name` (`PROJECT_NAME`). Do not ask the user for document paths, slugs, UUIDs, or internal artifact names unless resolving an ambiguity.

## Input resolution <!-- key: input-resolution -->

Resolve the project context in this order:

1. The exact `project_name` supplied in the current invocation (`${PROJECT_NAME}`).
2. Generated SpecX specs whose canonical titles are derived from that exact project name.
3. A requirements SpecX spec whose metadata or title matches the exact project name.

Canonical SpecX project document titles:

```text
${PROJECT_NAME} - Decision Matrix
${PROJECT_NAME} - Architecture Rules
${PROJECT_NAME} - Milestones
```

Prefer the requirements SpecX spec titled `${PROJECT_NAME} - Requirements`. If it does not exist, accept exactly one SpecX spec whose `project_name` metadata or exact title matches `${PROJECT_NAME}`. If no candidate or multiple candidates exist, ask the user to identify the requirements SpecX spec. Do not fuzzy-match.

Use the exact project name as the SpecX document-title prefix. Do not derive or introduce a hidden machine name.

If SpecX rejects characters in the project name, ask the user to choose a valid project name. Do not silently sanitize it into a different identity.

Always create or update **SpecX specs** for workflow artifacts. Never write local markdown artifact files for decision matrices, architecture rules, or milestones.

## Global SpecX spec resolution <!-- key: global-spec-resolution -->

Global SpecX specs are hardcoded inputs, not user-provided project inputs. Each pipeline declares the exact SpecX spec titles it requires. Resolve those SpecX specs by exact title before starting the first task.

If a required global SpecX spec is unavailable, stop immediately and report its exact title. Do not substitute another revision, recreate it from memory, or continue with a partial ruleset.

## Project name and metadata <!-- key: project-name-and-metadata -->

The canonical identity is `project_name` only. Preserve its exact spelling and spacing after the initial invocation.

Every generated SpecX spec must record metadata equivalent to:

```yaml
project_name: "Habit Tracker"
artifact_type: decision_matrix | architecture_rules | milestones
```

If a supplied project name conflicts with the metadata in a generated SpecX spec, stop and ask for confirmation. Do not silently rename or create a second project.

## Spec precedence <!-- key: spec-precedence -->

When rules conflict, apply this precedence:

1. Explicit user decision in the current workflow.
2. The current workflow's pipeline instructions.
3. Referenced project-specific SpecX specs.
4. Shared global SpecX specs (this contract and related rules).
5. Opinionated defaults in the SpecX spec Architecture Decision Matrix.

A conflict that cannot be resolved by this order is a blocking clarification, not an invitation to guess.

## Interaction policy <!-- key: interaction-policy -->

- Prefer concrete choices over open-ended technical questions.
- Ask no more than two questions in one turn.
- Preserve all previously locked decisions.
- Treat an ambiguous answer as unresolved; never silently select one of multiple choices.
- If the user says "I don't know," present the currently recommended option as an explicit choice.
- Keep the user-facing response concise and state what is now locked, what is pending, and what happens next.

## Workspace safety <!-- key: workspace-safety -->

- Inspect the workspace and existing changes before writing.
- Preserve unrelated user changes.
- Do not delete, reset, or overwrite material without explicit permission.
- Do not commit, push, publish, or send external messages unless explicitly requested.
- Prefer additive or reversible changes.

## Artifact rules <!-- key: artifact-rules -->

Every generated SpecX spec must contain:

- project name;
- source inputs;
- generation date or revision marker when useful;
- current status;
- assumptions and unresolved items;
- a clear definition of what the artifact controls.

Use SpecX section structure and typed blocks. Keep the prose readable if an agent consumes a partial view of the SpecX spec.

## Completion report <!-- key: completion-report -->

At the end of every pipeline, report:

- completed tasks;
- SpecX specs created or updated;
- verification performed and its result;
- unresolved items or blockers;
- the exact next workflow invocation, if one is available.

Never claim a build, test, or verification succeeded unless it was actually run or explicitly verified from trustworthy output.
