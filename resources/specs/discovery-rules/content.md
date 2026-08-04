# Discovery Rules

## Discovery outputs <!-- key: discovery-outputs -->

This SpecX spec governs the Discovery pipeline after the SpecX spec Architecture Decision Matrix has locked the high-level stack.

Discovery always produces:

1. SpecX spec `${PROJECT_NAME} - Decision Matrix` — the locked stack and prerequisites.
2. SpecX spec `${PROJECT_NAME} - Architecture Rules` — mandatory project-specific implementation rules.

The second SpecX spec is separate so the decision matrix remains focused on stack selection. Create or update these as SpecX documents, never as local markdown files.

## Decision artifact requirements <!-- key: decision-artifact-requirements -->

The decision SpecX spec must record:

- project summary and inferred archetype;
- every user-facing choice and the selected value;
- triggered low-level constants;
- deterministic prerequisites, including external configuration;
- explicit `none` values where a layer is not used;
- assumptions made from the requirements SpecX spec;
- unsupported requests, unresolved questions, and deferred decisions;
- the source requirements SpecX spec and Architecture Decision Matrix revision;
- locked absolute `project_root` (filesystem path where Scaffolding will create the app).

Do not add technologies merely because they are commonly used. Every technology in the locked architecture must come from a user decision or an explicitly triggered rule.

## Mandatory architecture-rules phase <!-- key: mandatory-architecture-rules-phase -->

After the decision matrix is validated, always create SpecX spec `${PROJECT_NAME} - Architecture Rules` using the following categories:

- project folder and module boundaries;
- UI, application/service, store/repository, and external-service boundaries;
- configuration and environment-variable handling;
- validation and error-handling conventions;
- design-system and theme conventions;
- API/data-access conventions;
- testing and documentation expectations;
- forbidden shortcuts and their acceptable alternatives.

Do not ask the user whether to generate these rules. Do not put feature requirements or milestone sequencing in this SpecX spec.

## Hardening defaults <!-- key: hardening-defaults -->

Unless the user explicitly changes them, prefer these rules:

- UI components do not call low-level repositories directly.
- Access persistence and external APIs through stores, services, or repositories.
- Keep configuration in typed configuration modules; never hardcode secrets.
- Use shared theme tokens for colors, spacing, typography, and motion.
- Hand-write important project configuration instead of blindly accepting generator defaults.
- Keep business rules outside presentation components.
- Validate external input at boundaries.
- Add a short README section whenever a new local setup or command is introduced.

## Discovery completion criteria <!-- key: discovery-completion-criteria -->

Discovery is complete only when:

- all required decision nodes are locked;
- the architecture matrix validates;
- prerequisites are generated from rules rather than intuition;
- the mandatory architecture-rules SpecX spec is completed and validated;
- SpecX spec `${PROJECT_NAME} - Decision Matrix` records an absolute `project_root` that Scaffolding can use without guessing;
- the next workflow can locate the required SpecX specs without guessing.
