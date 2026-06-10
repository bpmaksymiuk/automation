# Implementation Stage — SKILL.md

> Stage 10 — implement all design instructions into ./10-BUILD/ from 7-DESIGN-INSTRUCTIONS.md.

---

## When to Use

Invoke at Stage 10 (Developer). Use it when implementing every DI record from Stage 7 into concrete files under `10-BUILD/`. Produces all build outputs and `10-RELEASE-NOTES.md`. Upstream input: `7-DESIGN-INSTRUCTIONS.md`. The Developer may use iterative Playwright scripts during coding, but must not author or modify formal verification specs under `10-BUILD/11-TESTS/specs/**`; those belong to the Tester at Stage 11. Does not design, refactor, or extend beyond what is specified.

This stage is software construction, not documentation-only activity. The expected output is working production software that satisfies each DI in behavior, not just file presence.

Operate as a senior software engineer while implementing: choose robust code structure, preserve correctness under edge conditions described by the DI, and deliver code that compiles, runs, and is maintainable by other engineers.

---

## Target Files

- `./10-BUILD/**` (all files specified in DIs)
- `10-RELEASE-NOTES.md` (updated after implementation)

---

## Record Schema

See `release-notes-writing/SKILL.md` for the RN record schema.

---

## Constraints

- Write real, runnable software for every DI; never treat implementation as a placeholder, pseudocode, or partial scaffold unless the DI explicitly says scaffold-only.
- Do not author or modify formal verification specs under `11-TESTS/specs/**` as part of this skill.
- Do not add features not specified in a DI.
- Do not refactor, add comments, or make improvements not explicitly requested in a DI.
- Do not create files not specified in the design instructions.
- Treat project-root `./8-TEXT/**` files as read-only inputs when a DI references them; do not relocate or rewrite them unless a DI explicitly instructs a generated copy.
- Do not skip the release notes entry before validating this skill's exit gate.
- Iterative Playwright scripts for coding feedback are permitted, but must not be used as formal verification evidence.

### Anti-Patterns (Always Fail Stage 10)

- "File exists" but behavior is stubbed:
   - Example: route/controller/component is created, but returns placeholder data or `TODO` branch.
- UI shape without behavior:
   - Example: button or form renders, but click/submit does not execute DI-required logic.
- Happy-path only implementation:
   - Example: success flow works, but DI-specified validation, boundary, or error state is missing.
- Contract mismatch:
   - Example: endpoint/function exists at right path but request/response/state contract differs from DI.
- Hidden debug artifacts:
   - Example: `console.log`, temporary mocks, dead/commented-out blocks, or hardcoded test values remain.
- Partial DI closure:
   - Example: some steps in a DI are done but required follow-on behavior (wiring, integration, error handling) is not.

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md`, `9-GRAPHIC-ASSETS.md`. Read `7-DESIGN-INSTRUCTIONS.md` first and build a mental model of all required outputs before starting.

2. **Inventory the Graphic Artist's pre-fetched resources before writing any code.**
   a. Run `list_dir` on `./9-RESOURCES/` and each subdirectory (`libs/`, `fonts/`, `icons/`, `textures/`, `models/`, `animations/`, `photos/`, `ui-kits/`, `tokens/`, `references/`, `audio-visual/`).
   b. Read the RES records in `9-GRAPHIC-ASSETS.md` — note the PATH, INSTALL/USE instructions, and LICENCE for every entry.
   c. Map each RES record to the DI(s) that will use it. Never re-source a resource that already exists under `./9-RESOURCES/`.
   d. For library resources (e.g. `libs/`), follow the INSTALL/USE field exactly when adding the dependency to the build (import path, package name, version).
   e. For media resources (images, fonts, icons, textures, models, animations), reference them from their `./9-RESOURCES/` path — do not copy them unless a DI explicitly requires it.

3. Implement DIs in order (DI-001, DI-002, …). Respect dependency ordering — scaffolding DIs before file-writing DIs.
4. For each DI:
   a. Re-read the DI immediately before implementing it.
   b. Write or edit only the files specified in that DI, and fully implement the required behavior in executable code.
   c. Use exact file paths as stated — do not invent paths.
   d. After writing, run `get_errors` to check for unresolved issues.
   e. Run the changed code path and verify the DI behavior occurs exactly as specified.
   f. Do not proceed to the next DI until the current one is error-free and behavior-complete.
5. **Do not add:**
   - Features not specified in a DI
   - Refactors of existing code
   - Comments, docstrings, or type annotations on code not changed
   - Error handling for scenarios not mentioned in the DI
   - Helper utilities created "just in case"
6. After all DIs are implemented, run a **spec-compliance self-review** against the running build:
   a. Start the build locally and open it in a browser.
   b. For each DI, re-read the DI specification and then exercise the corresponding behavior in the running build — verify that the implemented behavior matches what the DI describes, not just that code was written.
   c. For each requirement with an error state, boundary input, or edge condition, deliberately trigger it in the browser and observe the result.
   d. Open browser DevTools console — no errors or warnings should appear during normal use. Investigate and fix any that do.
   e. Check that no hardcoded test data, `console.log` debug statements, commented-out code, or placeholder content remain in delivered files.
   f. Run `npm audit` (or equivalent for the project's package manager) and resolve any critical or high severity vulnerabilities before proceeding.
   g. For web products: verify accessible HTML semantics — heading hierarchy, landmark regions, image alt text, form labels, and keyboard focus order — by tabbing through the UI and inspecting the DOM.
   h. Document any gap found during self-review as an IMPLEMENTATION CAVEAT in `10-RELEASE-NOTES.md` before proceeding. Do not hide gaps; the Tester must know about them.

7. Load `release-notes-writing/SKILL.md` and write an RN entry.
8. Run the exit gate checklist.

---

## Exit Gate

- [ ] Every file specified in every DI exists at the correct path.
- [ ] No unresolved compile or lint errors in any `./10-BUILD/` file.
- [ ] No files in `./10-BUILD/` that are not traceable to a DI.
- [ ] `10-RELEASE-NOTES.md` has been updated with a new RN entry for this run.
- [ ] Every DI has been implemented — none skipped, none partially implemented.
- [ ] Self-review complete: each DI re-read against its implemented output and the specified behavior confirmed in the running build.
- [ ] Browser console is clean during normal use — no errors or warnings.
- [ ] No hardcoded test data, debug artifacts, `console.log` statements, or placeholder content remain in delivered files.
- [ ] `npm audit` (or equivalent) run — no unresolved critical or high severity vulnerabilities.
- [ ] Accessible HTML semantics verified: heading hierarchy, landmark regions, alt text, form labels, keyboard focus order.
- [ ] All deviations from DI specifications documented in `10-RELEASE-NOTES.md` under IMPLEMENTATION CAVEATS.
