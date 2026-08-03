# Scaffolding Rules

## Scope <!-- key: scope -->

Scaffolding creates the smallest runnable project that proves the locked architecture from SpecX specs `${PROJECT_NAME} - Decision Matrix` and `${PROJECT_NAME} - Architecture Rules` is wired correctly.

Scaffolding may create:

- source directories and entry points;
- package/environment manifests;
- minimal configuration;
- local environment example files;
- a hello-world or health-check screen/endpoint;
- README setup and run instructions;
- verification scripts and commands.

Scaffolding must not implement product features, authentication flows, business workflows, or milestone work. Do not create SpecX milestone or feature-spec documents in this pipeline.

## Prerequisite gate <!-- key: prerequisite-gate -->

Before writing project files:

1. Read the prerequisite list from SpecX spec `${PROJECT_NAME} - Decision Matrix`.
2. Check required installed software and versions.
3. Check required external configuration without printing secrets.
4. Stop if a required prerequisite is missing.

Report the missing item, why it is required, and the user action needed. Do not install software or create cloud resources unless explicitly requested.

## Project quality baseline <!-- key: project-quality-baseline -->

The scaffold must provide:

- one documented command to install dependencies;
- one documented command to run locally;
- one documented command to verify health;
- an example environment file with secret names only;
- a clear entry point;
- formatting, type-checking, linting, or test scripts when supported by the selected stack;
- a README describing prerequisites, setup, run, verification, and known limitations.

Use the selected architecture exactly. Do not substitute a different framework, ORM, package manager, or database because a generator defaults to it. Always apply SpecX spec `${PROJECT_NAME} - Architecture Rules`.

## Verification gate <!-- key: verification-gate -->

At minimum, verify:

- dependencies resolve;
- the project starts or builds;
- the hello-world screen or health endpoint responds;
- configured type/lint/test checks pass, or their absence is documented.

If verification fails, leave the project in a recoverable state, document the failure, and do not report scaffolding as complete.

## Scaffolding completion criteria <!-- key: scaffolding-completion-criteria -->

Scaffolding is complete when the blank project runs locally, its setup is documented, its health check passes, and the project is ready for Planning. It is not complete merely because files were generated.
