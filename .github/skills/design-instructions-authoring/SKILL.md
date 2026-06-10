# Design Instructions Authoring — SKILL.md

> Stage 7 — implementation-ready instructions that a Developer can execute without clarifying questions.

---

## When to Use

Invoke at Stage 7 (Technical Lead). Use it when converting architecture decisions into numbered, ordered, file-path-specific implementation instructions that the Developer can execute without ambiguity. Produces `7-DESIGN-INSTRUCTIONS.md`. Upstream inputs: `6-PARTS LIST.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`. Each DI must be complete enough for the Developer to act on immediately — partial or placeholder DIs are a gate violation. 

This stage must produce implementation-ready software engineering instructions, not high-level guidance. A DI is only acceptable when a competent software engineer can implement the behavior exactly as intended without follow-up clarification.

---

## Target Files

- `7-DESIGN-INSTRUCTIONS.md`

Optional deterministic preflight template:

- `.github/templates/stage-output/7-DI-QUALITY-CHECKLIST.template.md`

---

## Record Schema

```
## DI-XXX : INSTRUCTION TITLE

- **SUMMARY:** One sentence stating what this DI produces or achieves.
- **IMPLEMENTATION STEPS:**
  1. Numbered, ordered steps.
  2. Each step is a single action.
  3. Include exact file paths, function signatures, data schemas, or pseudocode where needed.
  4. Name every edge case that must be handled.
- **SKILLSET REQUIRED:** Technologies or domain knowledge the Developer must have to implement this DI.
- **NOTES:** Constraints, known limitations, ordering dependencies, or references to related DIs.
- **RELATED:** BR-IDs, AR-IDs, PT-IDs that motivated this DI.
```

---

## Quality Standard

The Developer must be able to implement a DI without asking any clarifying questions. Test each DI by asking: "Could a competent Developer read this and produce the correct output on the first attempt?" If the answer is no, the DI is incomplete.

**Required specificity:**
- File paths must be complete and relative to the project root.
- Function signatures must include parameter names and types.
- Data schemas must list every required field.
- Pseudocode must be implementation-ready, not conceptual.
- Edge cases must be named and their handling specified.

**Engineering completeness check (must pass for every DI):**
- Inputs are explicit: request shape, params, events, or user action triggers.
- Outputs are explicit: response shape, rendered result, state mutation, or side effects.
- Failure behavior is explicit: validation errors, retry behavior, fallback paths, and user-visible error states.
- Integration points are explicit: dependencies, import paths, config keys, and contracts with related components.
- Verification target is explicit: what concrete runtime behavior the Developer must observe after implementation.

---

## Constraints

- Do not write code, test scripts, or make technology decisions (those belong to Stage 6).
- Do not write partial or placeholder DIs — "TBD" is a gate violation.
- Do not delegate critical design detail to the Developer with phrases like "as appropriate", "use best judgment", or "implementation specific".

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`.
2. Identify all implementation work implied by the BR/AR/PT combinations.
3. Write one DI per logical unit of work (a file, a component, a behaviour, a configuration).
4. Order DIs by dependency: DIs that create directories or scaffolds come before DIs that write files.
5. Assign sequential IDs (DI-001, DI-002, …).
6. For each DI, write implementation steps before writing the summary — this ensures the summary is accurate.
7. For each DI, run a "zero-questions" test: if any step can be interpreted in two or more ways, rewrite it until only one implementation path is reasonable.
8. Run the quick-check template at `.github/templates/stage-output/7-DI-QUALITY-CHECKLIST.template.md` and close every unchecked item.
9. Validate against the exit gate.

---

## Exit Gate

- [ ] Every BR/AR pair has at least one DI.
- [ ] Every DI has all five schema sections (SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED).
- [ ] No DI contains "TBD", placeholder text, or steps that defer work to the Developer's judgment.
- [ ] Every file path in implementation steps is complete and relative.
- [ ] DI IDs are sequential and non-reused.
- [ ] RELATED fields reference valid BR-IDs, AR-IDs, and PT-IDs.
- [ ] `7-DESIGN-INSTRUCTIONS.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
