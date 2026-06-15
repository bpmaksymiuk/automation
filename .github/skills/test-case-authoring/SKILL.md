# Test Case Authoring — SKILL.md

> **Stage 11 (first half)** — Write test cases that verify every approved UC and BR before executing any tests.

---

## When to Use

**Exactly:** Invoke at Stage 11 (Tester). Write Playwright specs + TC records.  
**Input:** `2-USE-CASES.md`, `5-REQUIREMENTS.md`, `7-DESIGN-INSTRUCTIONS.md`, `10-RELEASE-NOTES.md`.  
**Output:** `11-TEST-CASES.md` (append-only) + `./11-TESTS/specs/` (Playwright specs).  
**Quality gate:** Every UC acceptance criterion has at least one test case; every BR has at least one test case. No tests run yet. All test cases are written first.

---

## Target Files

- `11-TEST-CASES.md` (append-only TC records)
- `./11-TESTS/specs/**` (Playwright .spec.ts or .spec.js files)

---

## TC Record Schema (Required: 6 Fields)

```markdown
## T-XXX : [TEST CASE NAME]

- **UC REFERENCE:** UC-IDs this test verifies (example: UC-001, UC-003).
- **AC COVERAGE:** Explicit acceptance criteria `UC-XXX ACn` covered by this test (example: UC-001 AC1, UC-001 AC2).
- **BR REFERENCE:** BR-IDs this test verifies (example: BR-005, BR-012).
- **PRECONDITIONS:** What must be true before this test starts (app state, test data, browser state).
- **STEPS:** 
  1. Numbered action steps. Each step is one user or system action.
  2. Include exact click targets, form inputs, URLs, or API calls.
- **EXPECTED RESULT:** The specific, observable outcome if the system is working correctly.
- **NOTES:** Known issues, environmental dependencies, or edge cases.
```

---

## Constraints

- ❌ Do not execute tests yet. Write test cases first; execute later (Stage 11 second half).
- ❌ Do not suppress or hide failures to obtain a PASS recommendation.
- ❌ Do not use headless browser. Tests must use a visible browser with screenshots.
- ❌ Do not collapse multiple UCs into one vague test. If one TC covers multiple UCs, enumerate every `UC-XXX ACn` explicitly.
- ❌ Do not use DOM-only checks for visual/qualitative criteria. Include visible-browser observation steps + screenshots.
- ❌ Do not write test code yet. Write TC records first (test code written in Stage 11 second half).

---

## Procedure (Do In This Order)

### Step 1: Inventory Coverage Requirements

1. Read `2-USE-CASES.md`. For each UC:
   - List the UC-ID.
   - List every acceptance criterion as `UC-XXX AC1`, `UC-XXX AC2`, etc.
2. Read `5-REQUIREMENTS.md`. List every BR-ID.
3. Read `10-RELEASE-NOTES.md`. Note what was actually implemented in this run (CHANGED FILES, UC/BR COVERAGE).
4. Create a coverage map:
   ```
   - UC-001 AC1 → needs T-XXX
   - UC-001 AC2 → needs T-YYY
   - BR-005 → needs T-ZZZ
   - BR-012 → needs T-AAA
   ```

### Step 2: Write One TC (Repeat Until All Covered)

For each UC acceptance criterion and each BR:

1. **Design the test:**
   - What is the minimal sequence of user actions to verify this UC/BR?
   - Example: "Login with valid credentials, then check that dashboard appears."
   - Example: "Submit form with invalid email, then check error message appears."

2. **Fill the TC template (all 6 fields required):**
   - UC REFERENCE: UC-IDs this test covers.
   - AC COVERAGE: Explicit `UC-XXX ACn` references (not vague "covers UC-001").
   - BR REFERENCE: BR-IDs this test covers.
   - PRECONDITIONS: What app state, test data, or browser state must exist first? (Example: "User is logged out. Test account with email 'test@example.com' and password 'password123' exists in database.")
   - STEPS: Numbered action steps. Example: "1. Navigate to http://localhost:3000/login. 2. Enter email 'test@example.com' in the email field. 3. Enter password 'password123' in the password field. 4. Click the 'Login' button. 5. Wait for page navigation."
   - EXPECTED RESULT: The specific observable outcome. Example: "The page navigates to http://localhost:3000/dashboard and displays a header 'Welcome, Test User'."
   - NOTES: Any environmental dependencies, known issues, or edge cases. (Example: "Test account must be cleared between runs. If test fails with 'user already exists', manually delete test@example.com from the database.")

3. **Check for ambiguity:**
   - Can a Tester read STEPS and execute them without asking a question? YES → Go to step 4. NO → Rewrite.
   - Example ❌: "Click the button" → ✅ "Click the blue 'Submit' button in the bottom-right corner of the form."

4. **For visual/qualitative criteria (layout, colors, fonts, motion):**
   - Do NOT rely on DOM inspection alone.
   - Include explicit visual observation steps. Example: "Observe the rendered button. It should have a blue background, white text, and be 200px wide."
   - Plan a screenshot at that step for evidence later.

5. **Assign sequential T-ID:** T-001, T-002, etc. (never reuse).

6. **Append this TC to `11-TEST-CASES.md`.** Do not insert — always append before gate line.

7. **Repeat for next UC/BR.** Continue until every UC acceptance criterion and every BR has at least one TC referencing it.

### Step 3: Verify Coverage (Before Gate)

1. Create a coverage checklist:
   ```markdown
   ## Coverage Verification
   - [ ] UC-001 AC1 → referenced in T-XXX AC COVERAGE
   - [ ] UC-001 AC2 → referenced in T-YYY AC COVERAGE
   - [ ] BR-005 → referenced in T-ZZZ BR REFERENCE
   - [ ] BR-012 → referenced in T-AAA BR REFERENCE
   ```
2. For each checkbox:
   - Open `11-TEST-CASES.md`.
   - Search for the UC/BR ID in the AC COVERAGE or BR REFERENCE fields.
   - Found? Check it off. Missing? Write a TC for it.

### Step 4: Validate Gate

1. Zero unchecked coverage items? YES → Continue. NO → Write missing TCs.
2. All TCs have 6 fields? YES → Continue. NO → Add missing fields.
3. All T-IDs unique and sequential? YES → Continue. NO → Renumber them.
4. All STEPS are unambiguous and executable by a human? YES → Continue. NO → Rewrite.
5. All EXPECTED RESULTs are observable (not vague)? YES → Continue. NO → Rewrite them.
6. Add gate line to `11-TEST-CASES.md`:
   ```
   GATE 11A: PASS
   ```
   (This is gate for "test cases written" phase, not execution.)

---

## Exit Gate (All Boxes Checked)

- [ ] Every UC-ID from `2-USE-CASES.md` has at least one TC referencing it in UC REFERENCE field.
- [ ] Every acceptance criterion `UC-XXX ACn` appears in at least one TC's AC COVERAGE field.
- [ ] Every BR-ID from `5-REQUIREMENTS.md` has at least one TC referencing it in BR REFERENCE field.
- [ ] Every TC has all 6 schema fields: UC REFERENCE, AC COVERAGE, BR REFERENCE, PRECONDITIONS, STEPS, EXPECTED RESULT, NOTES.
- [ ] No TC has ambiguous or un-executable steps.
- [ ] All EXPECTED RESULTs are specific and observable (not vague like "works correctly").
- [ ] T-IDs are sequential (T-001 through T-NNN, no gaps, no reuse).
- [ ] Visual/qualitative criteria include observation steps + planned screenshots.
- [ ] `11-TEST-CASES.md` ends with blank line + `GATE 11A: PASS`.
- [ ] STATUS field in document header set to `PASS` and STATUS UPDATED set to today's date (YYYY-MM-DD).
