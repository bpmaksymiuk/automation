# Design Instructions Authoring — SKILL.md

> **Stage 7** — Write numbered implementation instructions so precise that a Developer can build them without asking one clarifying question.

---

## When to Use

**Exactly:** Invoke at Stage 7 (Technical Lead). Produces `7-DESIGN-INSTRUCTIONS.md`.  
**Input:** `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `5-REQUIREMENTS.md`.  
**Output:** One DI per logical unit (one file creation, one component, one behavior, one config).  
**Quality gate:** Each DI must be so specific a Developer implements it identically on the first attempt.

---

## Target Files

- `7-DESIGN-INSTRUCTIONS.md` (append-only document with all DIs)

---

## DI Record Schema (Required: All 5 Fields)

```markdown
## DI-XXX : [ONE-LINE TITLE]

- **SUMMARY:** One sentence. What does this DI produce?
- **IMPLEMENTATION STEPS:**
  1. [Action 1 with exact file paths, parameter names, types]
  2. [Action 2]
  ... (continue until complete; no "and so on")
- **SKILLSET REQUIRED:** Technologies Developer must have (or learn) to implement this DI.
- **NOTES:** Edge cases, dependencies, related DIes, constraints.
- **RELATED:** BR-IDs that justify this DI (example: BR-001, BR-003).
```

---

## Quality Gate: 5-Point Checklist

Before writing each DI, verify:

1. **Inputs explicit?**  
   ✅ Each step tells Developer: where to start, what data triggers this step, what file/event activates it.  
   ❌ No: "Handle the incoming request" — NEED: "When POST /api/users arrives with `{name: string, email: string}`, validate that email matches pattern `[a-z]+@[a-z]+\\.com`."

2. **Outputs explicit?**  
   ✅ Each step ends with: the file modified/created, the state change, the response sent, the error returned.  
   ❌ No: "Save the data" — NEED: "Write JSON to `./data/users.json` with schema `{id: number, name: string, email: string, createdAt: ISO8601}`."

3. **Failure behavior explicit?**  
   ✅ For every validation or network call, state the error: "If email already exists, return HTTP 409 with body `{error: 'Email already registered'}`."  
   ❌ No "handle errors as appropriate."

4. **Integration points explicit?**  
   ✅ "Import `UserRepository` from `./src/lib/db.ts` at top of file. Call `await UserRepository.create(user)` before returning."  
   ❌ No: "Use the database service."

5. **Verification observable?**  
   ✅ "After implementation, start the server. POST `{name: 'Alice', email: 'alice@test.com'}` to `http://localhost:3000/api/users`. Expect HTTP 201 and response body matching the schema above."  
   ❌ No: "Verify the implementation works."

---

## Constraints (Violations = Gate Fail)

- ❌ Do not write code. Write instructions *about* code.
- ❌ Do not defer to Developer judgment. No "as appropriate", "use best judgment", "implementation specific", or "choose your approach".
- ❌ Do not skip implementation steps. Every step must be numbered and actionable.
- ❌ Do not use "TBD", "TK", or placeholder text. DI is complete or it fails the gate.
- ❌ Do not make technology choices (those belong to Stage 6 Architect). DI assumes the tech choice is already made.
- ❌ Do not write test specs. Tester writes tests at Stage 11 (unit tests and specs belong to 11-TESTS/).

---

## Procedure (Do In This Order)

### Step 1: Inventory All Work
1. Read `5-REQUIREMENTS.md`. List every BR-ID.
2. Read `6-ARCHITECTURE-RECOMMENDATIONS.md`. List every AR-ID.
3. Read `6-PARTS LIST.md`. List every PT-ID.
4. For each BR + AR + PT combination, identify what must be built: which files, which behaviors, which integrations?
5. Write a simple map: `BR-005 + AR-003 (React UI) = Build new component at ./src/components/UserForm.tsx`

### Step 2: Create File Structure First
Write DIs for infrastructure before feature DIes:
- [ ] Create directories (`mkdir -p ./src/components/`)
- [ ] Create empty files (`touch ./src/lib/db.ts`)
- [ ] Then write content DIes

### Step 3: Write One DI (Repeat Until Done)
For each logical unit of work:

1. Copy the schema above to a scratch buffer.
2. Fill in IMPLEMENTATION STEPS first (steps before summary — summary must be accurate).
   - Start with "Step 1: Open file X at path Y."
   - Add each action as its own numbered step.
   - Stop when you cannot add more steps (i.e., the behavior is complete).
3. Write SUMMARY to match your steps exactly.
4. Fill in SKILLSET REQUIRED (what tech must Developer know?).
5. Fill in NOTES (dependencies? related DIes? edge cases?).
6. Fill in RELATED (which BR/AR/PT IDs justify this DI?).
7. **Run the zero-questions test:**  
   - Read the DI once more.
   - For each step, ask: "Can this be misinterpreted?"
   - If YES: rewrite that step more specifically. Go back to #7.
   - If NO: go to step 8.
8. Assign a DI-ID sequentially: DI-001, DI-002, DI-003, etc. (never reuse).
9. Append this DI to `7-DESIGN-INSTRUCTIONS.md` (do not insert — always append at end, before gate line).
10. **Do not proceed to next DI until this one passes the zero-questions test.**

### Step 4: Final Validation (Before Gate)
In this exact order:

1. Open `7-DESIGN-INSTRUCTIONS.md`.
2. Search for "TBD" → should find: **0 matches**. If found, fix them.
3. Search for "DI-001" → should find: **exactly 1 match**. Count up (DI-001, DI-002, etc.) — your DI count should match.
4. Search for these phrases → should find: **0 matches**:
   - "as appropriate"
   - "use your judgment"
   - "implementation specific"
   - "and so on"
   - "etc."
5. Go to end of file (Ctrl+End). Last non-blank line should be: `GATE 7: PASS` (or `GATE 7: FAIL - reason` if not ready).
6. If last line is NOT a gate line, **add it now:**
   ```
   GATE 7: PASS
   ```

---

## Exit Gate (All Boxes Must Be Checked)

- [ ] Every BR-ID from Stage 5 has at least one DI that references it (check RELATED field).
- [ ] Every AR-ID from Stage 6 has at least one DI that references it (check RELATED field).
- [ ] Every DI has exactly 5 schema fields: SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED.
- [ ] Zero "TBD", "TK", placeholder text, or vague phrases in any DI.
- [ ] All file paths in IMPLEMENTATION STEPS are complete and project-relative (e.g., `./src/components/Button.tsx`).
- [ ] DI-IDs are sequential (DI-001 through DI-NNN, no gaps, no reuse).
- [ ] RELATED fields contain only valid BR/AR/PT IDs (no made-up references).
- [ ] `7-DESIGN-INSTRUCTIONS.md` has blank line + `GATE 7: PASS` as the final two lines.
- [ ] STATUS field in document header is set to `PASS` and STATUS UPDATED is today's date (YYYY-MM-DD).
