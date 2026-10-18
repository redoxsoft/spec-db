# App Builder Project Development Guide

## Purpose and Adoption <!-- key: purpose_and_adoption -->

This guide gives a small team a useful starting point for code that stays understandable as the project grows. It is guidance for future work, not a claim that an existing repository already follows every rule. Use the sections that fit the project; a website, API, and mobile app need different subsets. Teams may change any default to suit their needs.

Each section has its own **Status**. The imported sections ship as **Draft**: applicable rules are the starting defaults for new or touched code, subject to repository-specific requirements and explicit team decisions, while the team decides its long-term convention. In a project-owned copy, **Approved** means the team has chosen that section as its convention. Status here describes adoption of a standard; it is separate from approval of a Work Item or pipeline run. A proposed revision to an Approved section is Draft; the last Approved decision governs current work until the team accepts the replacement. Keep that governing decision identifiable while a revision is pending.

For a Draft section, compare its proposed direction with repository evidence and choose a forward-looking pattern for the affected area. An existing pattern may be the right choice for compatibility or local consistency, but its existence alone does not settle the future direction. Touching a file does not require bringing unrelated code into compliance; apply the guidance to behavior and supporting code inside the agreed change boundary. Record a material deviation or gradual migration direction in the existing work artifact, or in the change description when no work artifact exists. A Draft status does not create an extra approval gate. For an Approved section, follow the project decision in applicable new work and surface a material exception through the work's normal decision path.

This guide does not select product behavior, a framework, or a package. App Builder contracts and day-0 standards continue to govern a generated starter's paths, dependency versions, and checks; this guide applies as the project grows. Repository-specific requirements and explicit team decisions take precedence over these generic defaults.

Applicability index: `code_structure` (application code); `user_experience` and `styling` (web or mobile UI); `state_and_data_flow` (interactive web or mobile); `api_boundaries` (backends, full-stack apps, or external-service clients); `persistence` (durable data); `configuration_and_diagnostics` (runtime configuration, external services, or device storage); `tests_and_checks` (repository checks). Read only the concern keys that fit the project and current work.

## Standards <!-- key: standards -->

### Code Structure and Boundaries <!-- key: code_structure -->

#### Adoption <!-- key: code_structure_adoption -->

**Status:** Draft  
**Applies to:** All application code.

- Give each feature or domain concern a clear home. Keep related behavior, types, and tests near one another when the repository supports it; shared code should earn its place through actual reuse.
- Keep entry points and UI or HTTP handlers thin enough to see the flow. Put nontrivial rules in code that can be exercised without a browser or server process.
- Prefer clear module interfaces and ordinary functions over abstraction for a single caller. Add a layer when it separates a real responsibility or simplifies testing.
- Match established names and layout when they serve the change. If the current pattern causes repeated coupling or confusion, choose a better target for the touched area and describe any gradual transition.

### User Experience and Accessibility <!-- key: user_experience -->

#### Adoption <!-- key: user_experience_adoption -->

**Status:** Draft  
**Applies to:** Web and mobile interfaces.

- Make the main action and its result clear. Real asynchronous actions need useful pending, success, and error feedback; data views need an empty state when empty data is plausible.
- Use semantic controls and labels on the web, and the platform's accessible controls and labels on mobile. Keyboard focus, touch targets, readable contrast, and error messages should let people complete the core flow.
- Make layouts work at the sizes the product supports. Respect mobile safe areas and system text scaling where applicable.
- Avoid inventing new flows, copy requirements, or visual polish beyond the product brief. A starter can remain simple; a working feature should handle its actual states.

### Styling and UI Components <!-- key: styling -->

#### Adoption <!-- key: styling_adoption -->

**Status:** Draft  
**Applies to:** Web and mobile interfaces.

- Reuse the project's existing styling method and small set of colors, spacing, and typography tokens. When none exists, establish only the tokens needed for consistent work in the current scope.
- Reuse a component for a repeated interaction or visual pattern; keep one-off presentation local. Components should expose meaningful inputs rather than embed feature-specific data fetching.
- Keep interactive states coherent: focus, disabled, loading, and error styling should be visible where the interaction uses them.
- Introduce a second styling system or component library only when its benefit justifies the added maintenance cost and the team accepts the direction.

### State and Data Flow <!-- key: state_and_data_flow -->

#### Adoption <!-- key: state_and_data_flow_adoption -->

**Status:** Draft  
**Applies to:** Interactive web and mobile applications.

- Keep state with its closest owner. Use shared state only when several parts of the app genuinely need to coordinate it.
- Keep shareable navigation state, such as search, filters, and pagination, in the route or URL when the platform supports that behavior.
- Keep the source of truth for remote data explicit. Use a clear access and refresh path; distinguish cached data, editable drafts, and locally owned state rather than maintaining competing copies without a synchronization rule.
- After a mutation, update the visible result and preserve useful user input on a recoverable failure. Choose a state library only when the app's complexity warrants one.

### API and External Boundaries <!-- key: api_boundaries -->

#### Adoption <!-- key: api_boundaries_adoption -->

**Status:** Draft  
**Applies to:** Backends, full-stack applications, and clients that call external services.

- Validate data where it enters the application. Keep transport details separate from nontrivial business rules, without forcing a large layer structure on a small service.
- Enforce authorization where a service owns a protected operation; client-side checks alone do not protect it. Keep request and response shapes, errors, and authorization behavior consistent with the project's public contract. Return useful errors without exposing secrets or internal diagnostics.
- Put external calls behind a small, identifiable boundary so timeouts, failure handling, and tests have one clear place to live.
- Treat a published API change or a new access rule as a design decision. State its compatibility and verification implications before implementation.

### Persistence and Migrations <!-- key: persistence -->

#### Adoption <!-- key: persistence_adoption -->

**Status:** Draft  
**Applies to:** Projects with durable data.

- Keep schema changes in version-controlled migrations or the repository's established equivalent. Application startup should not silently make an unreviewed production schema change.
- Put data access behind a clear module or interface when queries become part of business behavior. Add constraints and indexes to support actual integrity rules and query paths.
- For a data migration, identify what data may be lost or transformed, how recovery works, and how the result will be checked with representative data. Preserve compatibility during a staged change when old and new code may run together.
- Do not introduce a database, ORM, repository layer, or migration tool solely because this guide mentions them.

### Configuration and Diagnostics <!-- key: configuration_and_diagnostics -->

#### Adoption <!-- key: configuration_and_diagnostics_adoption -->

**Status:** Draft  
**Applies to:** Applications with runtime configuration, external services, or device storage.

- Keep deployment-varying configuration explicit and separate from ordinary application logic. Never commit secrets or include credentials and sensitive personal data in logs.
- Make failures diagnosable at the boundary where they occur. Use appropriate error reporting, concise contextual logs, and a clear recovery action when one exists. Add health checks only for services that need them.
- On mobile, store device-held credentials in platform secure storage; never embed server-side secrets in the app. Treat connectivity loss as an expected state for network-dependent flows.
- Add monitoring or operational machinery in proportion to the app's real deployment and support needs.

### Tests and Routine Checks <!-- key: tests_and_checks -->

#### Adoption <!-- key: tests_and_checks_adoption -->

**Status:** Draft  
**Applies to:** All projects, using checks supported by the repository and change.

- Check changed behavior at the cheapest level that gives trustworthy evidence. Prefer a focused unit or integration test for a rule or boundary, and an end-to-end check for a critical flow that needs the whole system.
- Add a regression check for a defect when it can observe the failure. Avoid tests that merely repeat implementation details or assert that a file exists without proving the behavior at issue.
- Run relevant repository-native lint, type, test, and build commands. Record the commands or concrete manual observations actually performed and name any limitation honestly.
- Keep test data controlled and no larger than needed to exercise the behavior. A pre-existing failure or unavailable environment should be reported with its effect on confidence, not hidden by weakening a check.
