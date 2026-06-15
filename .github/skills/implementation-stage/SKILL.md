# Implementation Stage — SKILL.md

> **Stage 10** — Convert every Design Instruction into working, runnable code with zero placeholders.

---

## When to Use

**Exactly:** Invoke at Stage 10 (Developer). Produces `10-BUILD/` (all runnable files) and appends to `10-RELEASE-NOTES.md`.  
**Input:** `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md`, `9-GRAPHIC-ASSETS.md`.  
**Output:** Code that compiles, runs, and behaves exactly as each DI specifies.  
**Quality gate:** Every file specified in every DI exists and works. No placeholders. No "TODO" branches. No hardcoded test data.

---

## Target Files

- `./10-BUILD/**` (all files specified in each DI)
- `10-RELEASE-NOTES.md` (append one RN record, never overwrite prior entries)

---

## Anti-Patterns (Instant Gate Fail)

Each of these is a gate violation. Zero tolerance.

- ❌ **File exists but no behavior** — route/component/function exists at the right path but returns placeholder data or TODO.
- ❌ **UI without interaction** — button/form renders, but click/submit does nothing.
- ❌ **Happy-path only** — success works; validation/error/boundary conditions missing.
- ❌ **Contract mismatch** — endpoint exists but request/response shape differs from DI.
- ❌ **Debug artifacts remain** — `console.log`, commented code, temporary mocks, hardcoded test data.
- ❌ **Partial DI** — some steps done; required follow-on behavior (wiring, integration, error handling) missing.
- ❌ **Unresolved imports** — code compiles with errors or imports point to non-existent files.
- ❌ **Browser console errors** — app runs but logs JS errors/warnings during normal use.
- ❌ **Security vulnerabilities** — `npm audit` flags unresolved high/critical issues.
- ❌ **Untraced files** — files in `10-BUILD/` not mentioned in any DI (these are deleted at gate).

---

## Constraints

- ✅ Write real, runnable software for every DI. Never treat implementation as a placeholder, pseudocode, or partial scaffold.
- ✅ Do not author formal verification specs at `11-TESTS/specs/**` — Tester does that at Stage 11.
- ✅ Do not add features not in a DI.
- ✅ Do not refactor or improve code not explicitly requested in a DI.
- ✅ Do not create files not in any DI (untraced files are deleted).
- ✅ Treat `8-TEXT/**` files as read-only inputs; do not move or rewrite unless a DI explicitly says so.
- ✅ If a DI is unclear or incomplete, stop and route back to Stage 7 with the specific gap.

---

## Procedure (Do In This Order)

### Step 1: Pre-Flight (Before Writing Any Code)

1. Read `7-DESIGN-INSTRUCTIONS.md` completely. Write down all DI-IDs (DI-001, DI-002, ...).
2. Read `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md` — these are context.
3. List every file path mentioned in all DIs. Check: Are there directory-creation DIes before file-writing DIes? If not, reorder mentally (DIes that create dirs first).
4. Check: Any DI contains "TBD"? YES → **Stop. Route back to Stage 7.** NO → Continue.
5. Check: Any graphics resources in `9-GRAPHIC-ASSETS.md`? If YES:
   - Read `9-GRAPHIC-ASSETS.md`. List every RES record and its PATH.
   - Check: Are these files in `./9-RESOURCES/`? If YES, use them as-is. If NO, note which resources are missing.

### Step 2: Implement One DI (Repeat In Order)

For each DI-ID from your list:

1. **Re-read the DI immediately before implementing it.** Especially IMPLEMENTATION STEPS and edge cases in NOTES.
2. **For each IMPLEMENTATION STEP:**
   a. Do the step exactly as written.
   b. After each step, check for compile/lint errors: `npm run build` (or language equivalent). Errors? Fix them. No errors? Proceed.
   c. Do not skip steps or assume "I'll handle this later."
3. **After the full DI is written:**
   a. Run the build for that DI's code path: `npm start` or `npm run dev` (language dependent).
   b. Exercise the behavior described in the DI specification (not the code — the spec).
   c. Example: If DI says "POST /api/users returns HTTP 201 with body `{id, name, email, createdAt}`", then POST to that endpoint with test data and verify the response matches exactly.
   d. Example: If DI says "Button click increments counter from 0 to 1", click the button and observe the counter increment.
   e. If behavior differs from DI: **Stop. Do not proceed.** Fix code to match DI exactly.
4. **After behavior is verified:** Check browser DevTools console. Any errors or warnings? Fix them. No errors? Proceed to next DI.
5. **Never proceed to the next DI until the current one is error-free and behavior-complete.**

### Step 3: Post-Implementation Self-Review (Before Gate)

After all DIs are implemented:

1. Start the build locally: `npm start` (or equivalent for your stack).
2. For each DI-ID:
   - Re-read the DI specification (not the code you wrote).
   - Find the feature/behavior in the running app.
   - Use it exactly as a user would.
   - If it doesn't behave as specified: **Stop. Fix the code. Do not pass gate.**
3. For each DI with an error state, validation, or boundary condition:
   - Deliberately trigger that error in the running app.
   - Observe the result.
   - Does it match the DI error behavior? YES → OK. NO → Fix code.
4. Open browser DevTools console (F12, Console tab). Use the app normally for 2–3 minutes.
   - Any `console.error`, `console.warn`, or stack traces? YES → Fix the code. NO → OK.
5. Search your code for these strings (should find 0 matches):
   - `console.log`
   - `TODO`
   - `FIXME`
   - `@ts-ignore`
   - `// eslint-disable`
   - Commented-out code
   - Hardcoded test data
6. Run security audit: `npm audit`. Any critical or high severity issues? If YES: fix them. If NO: OK.
7. For web products only: Verify accessible HTML:
   - Tab through the UI with keyboard only (no mouse). Can you reach every interactive element? Can you see focus? YES → OK. NO → Fix.
   - Inspect a form: Every input has a `<label>` with matching `for` attribute? YES → OK. NO → Fix.
   - Inspect images: Every `<img>` has `alt` text? YES → OK. NO → Fix.

### Step 4: Write Release Notes

1. Use `.github/skills/release-notes-writing/SKILL.md` to append one RN record to `10-RELEASE-NOTES.md`.
2. The RN record must list:
   - Every file created or modified.
   - Implementation caveats (shortcuts, known issues, or incomplete parts).
   - All UC-IDs and BR-IDs addressed in this run.

### Step 5: Validate Gate

1. All DIes implemented? YES → Continue. NO → Stop.
2. Build compiles without errors? YES → Continue. NO → Stop, fix.
3. All files in DIes exist? YES → Continue. NO → Stop, create them.
4. No untraced files in `10-BUILD/`? YES → Continue. NO → Stop, delete untraced files or add them to a DI.
5. No debug artifacts? YES → Continue. NO → Stop, clean them up.
6. Browser console clean? YES → Continue. NO → Stop, fix.
7. `npm audit` clean? YES → Continue. NO → Stop, fix.
8. RN entry appended? YES → Continue. NO → Go to Step 4.
9. Add gate line to top-level `10-RELEASE-NOTES.md`:
   - Blank line
   - `GATE 10: PASS` (or `GATE 10: FAIL - reason; re-run from Stage X`)

---

## Exit Gate (All Must Be Checked)

- [ ] Every file path specified in every DI exists at the correct location in `./10-BUILD/`.
- [ ] Zero compile, lint, or import errors in any `10-BUILD/` file.
- [ ] Zero untraced files in `./10-BUILD/` (files not mentioned in any DI are deleted or added to a DI).
- [ ] `10-RELEASE-NOTES.md` has been appended with a new RN record for this run.
- [ ] Every DI has been implemented end-to-end (none skipped, none partially done).
- [ ] Build runs locally without crashing: `npm start` (or equivalent) starts successfully.
- [ ] Behavior verified: each DI specification re-read and its behavior confirmed in the running app.
- [ ] Error states and boundary conditions tested manually (not just happy-path).
- [ ] Browser console is clean during normal use: zero errors, warnings, or stack traces.
- [ ] Zero `console.log`, `TODO`, `FIXME`, commented-out code, or hardcoded test data in committed files.
- [ ] `npm audit` (or equivalent) run: zero unresolved critical or high severity vulnerabilities.
- [ ] Accessible HTML verified (where applicable): heading hierarchy, form labels, image alt text, keyboard navigation.
- [ ] All deviations from DI specifications documented in `10-RELEASE-NOTES.md` under IMPLEMENTATION CAVEATS.
- [ ] Gate line `GATE 10: PASS` is the final non-blank line of `10-RELEASE-NOTES.md`.
