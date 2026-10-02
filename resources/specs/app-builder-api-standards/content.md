# App Builder API Standards

## Topology & Directory Structure <!-- key: topology -->

Opinionated architectural standards for standalone backend services and REST APIs (Node.js/Fastify/Express and Python/FastAPI/Flask).

Day-0 is binding for the hello-world tree: repo artifacts, layered health routes, OpenAPI, health JSON, the error envelope, lint, one health test, and CI. Later sentences in this standard are non-binding and must not stop a run.

Backend projects enforce a layered architecture: Routes handle HTTP transport, Controllers coordinate validation, Services execute business rules, and Repositories manage database persistence. Hello-world uses that layering for health (and a repository only when a database is selected).

### Mandatory Repository Artifacts

Every generated API project must include:

- `README.md`: Setup commands, local run instructions (`npm run dev` or `uvicorn`), database migration steps, and environment variable documentation.
- `.env.example`: Template listing all required environment variable keys with empty or placeholder values; secrets must never be committed.
- `.gitignore`: Standard Node.js/Python ignores (`node_modules`, `__pycache__`, `.venv`, `.env*` except `.env.example`).
- `.github/workflows/ci.yml`: Baseline CI action running linting, type-checking, tests, and build.

### Node.js (Fastify / Express) Layout

```text
├── src/
│   ├── config/               # Environment variables, app configuration, and Zod env schema
│   ├── db/                   # Database client, connection pool, and migrations
│   ├── routes/               # Route registrations and URL definitions
│   ├── controllers/          # HTTP request unpackers and response formatters
│   ├── services/             # Core business logic and transactions
│   ├── repositories/         # Database queries, ORM calls, and persistence logic
│   ├── errors/               # Custom error classes and global error middleware
│   ├── app.ts                # App factory, middleware registration, OpenAPI setup
│   └── server.ts             # Process entry point and graceful shutdown
├── Dockerfile                # Multi-stage production container definition
└── package.json
```

### Python (FastAPI / Flask) Layout

```text
├── app/
│   ├── core/                 # Settings, config, and security utilities
│   ├── db/                   # Engine, sessionmaker, and migrations (Alembic)
│   ├── api/                  # API router definitions and versioning
│   ├── controllers/          # Endpoint handlers and dependency injectors
│   ├── services/             # Domain logic and business rules
│   ├── repositories/         # Data access layer (SQLAlchemy/SQLModel)
│   ├── schemas/              # Pydantic input/output schemas
│   └── main.py               # Application entry point with OpenAPI docs
├── Dockerfile
└── pyproject.toml / requirements.txt
```

## Data Flow & State Lifecycle <!-- key: data-flow -->

### The Linear Flow Invariant

All data flows unidirectionally through explicit boundaries:

`HTTP Request -> Validation -> Controller -> Service -> Repository -> Database`

- **Controllers Must Never Touch DB Queries**: Direct ORM queries or raw SQL inside route handlers or controllers is strictly forbidden.
- **Repositories Return Domain Models**: Repositories abstract SQL or ORM operations and return typed entities.

### OpenAPI Contract & Self-Documentation

- Every API must automatically generate and serve OpenAPI documentation at `/docs` or `/openapi.json`.
- Routes must specify request schemas, response codes, and summary tags.

### Database Connection & Version-Controlled Migrations

1. **Connection Pooling**: Database connections must use a shared, pooled client initialized once during process startup (not per request).
2. **Version-Controlled Migrations**: When a database is chosen, table schemas must be managed via migrations (Drizzle Kit or Alembic) committed to git. Ad-hoc raw table generation in runtime code is prohibited.
3. **SQLite vs. PostgreSQL Invariant**:
   - **SQLite**: Permitted for local development and self-contained container deployments with persistent mounted volumes.
   - **Serverless Warning**: When deploying to ephemeral serverless containers (e.g., AWS Lambda, Vercel Functions), SQLite must NOT be used for persistent state. Use managed PostgreSQL or an edge-native driver (Turso/LibSQL) to prevent data loss upon cold-starts.

Later (non-binding): list endpoints enforce pagination defaults (`limit=20`, `max_limit=100`). Hello-world has no list resource.

## Layering & Design Patterns <!-- key: design-patterns -->

- **Service-Repository Pattern**:
  - `Service`: Pure business rules, validations, and cross-entity workflows. Agnostic of HTTP requests and raw database drivers.
  - `Repository`: Specialized data-access interface (e.g., `UserRepository.findById()`, `UserRepository.create()`).
- **Dependency Injection**: Services receive repositories via constructor/factory parameters; controllers receive services. This ensures unit-testability without monkey-patching.
- **Day-0 middleware**: request size limits, a correlation id, CORS or security headers as the contract requires, schema validation on the routes that exist, the route handler, and centralized error handling last.
- **Later (non-binding)**: authentication, authorization, and pagination defaults on list endpoints. Do not add those layers in hello-world.
- **Secrets Management**: Secrets must only come from environment variables. Never log authorization headers, passwords, or credentials.

## Resilience, Errors & Diagnostics <!-- key: resilience -->

- **Centralized Error Middleware**: Every unhandled error must bubble to a single centralized error handler. Never allow an uncaught exception to crash the process silently.
- **Error Sanitization**: Client-facing error responses must never leak SQL queries, driver stack traces, internal hostnames, or file paths.
- **Standardized JSON Error Envelope**: Every error response must include a correlation `requestId`:

  ```json
  {
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "User with ID '123' does not exist",
      "details": [],
      "requestId": "req_01HX89M..."
    }
  }
  ```

- **Separated Health Probes**:
  - `GET /health/live`: Liveness probe indicating the HTTP process is running. Returns HTTP 200 with `{ "status": "alive" }`.
  - `GET /health/ready`: Readiness probe indicating the service is ready to accept user traffic (verifies database ping/pool health). Returns HTTP 200 with `{ "status": "ready", "checks": { "database": "ok" } }` or 503 on failure.

## Quality Baseline & Verification <!-- key: quality-baseline -->

- **Day-0 schema validation**: Node uses **Zod** on the health (and hello) routes that exist. Python uses **Pydantic** on those same payloads. Do not add a business resource schema because this section mentions validation.
- **Production Containerization**:
  - Every API project includes a multi-stage `Dockerfile`:
    - Stage 1: Build & install dependencies.
    - Stage 2: Distroless or Alpine runtime, runs under a non-root user (`USER node` or `USER nonroot`).
- **Continuous Integration Baseline**:
  - The repository includes a `.github/workflows/ci.yml` running:
    1. Static typecheck (`npx tsc --noEmit` or `mypy`)
    2. Linting (`npm run lint` or `flake8`/`ruff`)
    3. Integration test: executes against `/health/live` and `/health/ready`
- **Verification Harness**:
  - The project must start up and pass integration tests on the `/health/live` and `/health/ready` endpoints (`npm test` / `pytest`).
