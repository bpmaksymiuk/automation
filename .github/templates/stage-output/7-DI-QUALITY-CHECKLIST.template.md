# Stage 7 DI Quality Quick Check

Use this checklist before finalizing `7-DESIGN-INSTRUCTIONS.md`.

## DI Completeness Checks

- [ ] Each DI defines explicit inputs (request shape, params, events, or user action triggers).
- [ ] Each DI defines explicit outputs (response shape, rendered result, state mutation, or side effects).
- [ ] Each DI defines failure behavior (validation errors, retry/fallback behavior, user-visible error state).
- [ ] Each DI defines integration points (dependencies, import paths, config keys, and cross-component contracts).
- [ ] Each DI defines a concrete verification target (runtime behavior that must be observed after implementation).

## Ambiguity Checks

- [ ] No DI uses placeholders (`TBD`, `TODO`, `fill later`, `to be decided`).
- [ ] No DI defers critical choices with vague language (`as appropriate`, `best judgment`, `implementation specific`).
- [ ] Every implementation step is a single action and has one clear interpretation.
- [ ] Every file path is complete and project-root relative.
- [ ] Function/API signatures include parameter names and types when applicable.

## Mapping Checks

- [ ] Every DI has valid `RELATED` links to BR/AR/PT IDs.
- [ ] DI IDs are sequential and non-reused.
- [ ] BR/AR scope implied by Stage 6 has at least one implementing DI.

## Release Readiness Check

- [ ] A competent Developer can implement each DI without follow-up clarification.
