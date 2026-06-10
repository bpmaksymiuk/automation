# Test Case Authoring — SKILL.md

> Stage 11 (first half) — write test cases before executing any tests.

---

## When to Use

Invoke at Stage 11 (Tester). Use it when writing Playwright spec files and corresponding TC records that verify every approved use case, every approved acceptance criterion, and every BR with observable evidence. Produces `11-TEST-CASES.md` and spec files under `./11-TESTS/specs/`. Upstream inputs: `2-USE-CASES.md`, `7-DESIGN-INSTRUCTIONS.md`, `10-RELEASE-NOTES.md`. Every UC, every `UC-XXX ACn`, and every BR must have at least one test case written before execution begins — writing test cases after testing is a gate violation.

---

## Target Files

- `11-TEST-CASES.md`
- `./11-TESTS/specs/**`

---

## Record Schema

```
## T-XXX : TEST CASE NAME

- **UC REFERENCE:** UC-IDs this test case covers.
- **AC COVERAGE:** Explicit `UC-XXX ACn` references covered by this test case.
- **BR REFERENCE:** BR-IDs this test case verifies.
- **PRECONDITIONS:** What must be true before this test starts (app state, data, browser state).
- **STEPS:**
  1. Numbered action steps.
  2. Each step is a distinct user or system action.
- **EXPECTED RESULT:** The specific, observable outcome if the system is working correctly.
- **NOTES:** Any known issues, environmental dependencies, or edge cases to watch for.
```

---

## Constraints

- Do not use this skill to repair defects in the build.
- Do not suppress or omit failures to obtain a PASS recommendation.
- Do not use headless browser execution — must use a visible browser with screenshots.
- Do not collapse multiple use cases into a vague umbrella test. If one T record covers multiple use cases, its `AC COVERAGE` field must enumerate every covered criterion explicitly.
- For realism, motion, textures, lighting, reflections, or layout criteria, include visible-browser observation steps and screenshot capture points. DOM-only or accessibility-only checks are insufficient.
- Do not begin browser testing until all test cases are written and the exit gate below is PASS.

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md`, `9-GRAPHIC-ASSETS.md`, `10-RELEASE-NOTES.md`.
2. List all UC-IDs from `2-USE-CASES.md` and expand every acceptance criterion into explicit `UC-XXX ACn` items.
3. List all BR-IDs from `5-REQUIREMENTS.md`.
4. Write test cases so every `UC-XXX ACn` appears in at least one `AC COVERAGE` field.
5. For each BR, write at least one test case that can verify the testable condition.
6. Split overly broad tests when necessary. If one T record covers multiple UCs, its `AC COVERAGE` field must enumerate every covered criterion explicitly.
7. For visual or qualitative criteria, include visible-browser observation steps that require the tester to inspect rendered output and capture corroborating screenshots.
8. Assign T-IDs sequentially (T-001, T-002, …).
9. Run `bash .github/skills/test-case-authoring/automation/verify-test-case-authoring.sh <project-root>` before execution begins.
10. Do not begin browser testing until all test cases are written and the exit gate below is PASS.
11. Validate against the exit gate.

---

## Exit Gate

- [ ] Every UC-ID has at least one T record referencing it.
- [ ] Every approved acceptance criterion from `2-USE-CASES.md` appears in at least one `AC COVERAGE` field.
- [ ] Every BR-ID has at least one T record referencing it.
- [ ] Every T record contains an `AC COVERAGE` field with explicit `UC-XXX ACn` references.
- [ ] Every T record has an EXPECTED RESULT that is independently observable.
- [ ] T-IDs are sequential and non-reused.
- [ ] No test case has steps that are ambiguous or cannot be executed by a human tester.
- [ ] Visual or qualitative criteria include visible-browser observation steps and planned screenshot evidence.
- [ ] Test cases are written and committed before any execution begins.
- [ ] `bash .github/skills/test-case-authoring/automation/verify-test-case-authoring.sh <project-root>` passes.
- [ ] `11-TEST-CASES.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
