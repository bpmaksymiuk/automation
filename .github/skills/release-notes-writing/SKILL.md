# Release Notes Writing — SKILL.md

> **Stage 10** — Append one release notes record (never overwrite prior entries).

---

## When to Use

**Exactly:** Invoke at Stage 10 (Developer) after implementing all DIs. Also use after any bug-fix re-run.  
**Input:** List of changed files, UC/BR coverage, implementation caveats.  
**Output:** One RN record appended to `10-RELEASE-NOTES.md`.  
**Quality gate:** One new RN entry. Version incremented. Append-only (never overwrite or insert before).

---

## Target File

- `10-RELEASE-NOTES.md` (append-only)

---

## RN Record Schema (Required: 4 Fields)

```markdown
## RN-XXX : vX.X.X — YYYY-MM-DD

- **CHANGED FILES:**
  - `./path/to/file.ext` — brief description of what changed
  - `./path/to/other.ext` — brief description
- **IMPLEMENTATION CAVEATS:** Known limitations, partial implementations, deferred work, observed side effects. Write "None." if there are no caveats.
- **UC/BR COVERAGE:** UC-IDs and BR-IDs addressed in this run (example: UC-001, UC-003, BR-005, BR-012).
- **NOTES:** Anything Tester or next Developer needs to know before picking up from here.
```

---

## Versioning Rule (Strict)

- **Patch (X.X.Y)** — Increment patch by +1 for every implementation run or bug-fix re-run within Stage 10.
- **Minor (X.Y.0)** — Increment minor by +1 only when a complete pipeline run finishes (all stages Stage 1–12 pass).
- **Major (X.0.0)** — Reserved for breaking schema changes or complete rewrites (rare).
- **Starting version:** v0.1.0 (first complete pipeline run).
- **Rule:** Every new RN must have a higher version than the prior entry. Never repeat, decrease, or skip versions.

**Example version progression:**
- v0.0.1 (first Stage 10 run)
- v0.0.2 (Stage 10 bug-fix re-run)
- v0.0.3 (Stage 10 second iteration)
- v0.1.0 (full pipeline run completes: Stages 1–12 pass)
- v0.1.1 (Stage 10 run after the full pipeline)

---

## Constraints

- ✅ Append this RN record below all prior entries (never insert before, never overwrite).
- ✅ Increment version number strictly (never repeat or skip).
- ✅ List every file created or modified (do not omit files).
- ✅ Be honest about caveats (do not hide shortcuts or known issues).
- ✅ Reference all UC-IDs and BR-IDs addressed (Tester uses this to scope verification).

---

## Procedure (Do In This Order)

### Step 1: Gather Information

1. List every file created or modified during this Stage 10 run.
   - Example: `./src/components/UserForm.tsx` (new), `./src/api/users.ts` (modified), `./package.json` (modified).

2. For each file, write a one-line description of what changed.
   - Example: `./src/components/UserForm.tsx` — User registration form component with email validation.
   - Example: `./src/api/users.ts` — Added POST /api/users endpoint and user creation logic.

3. List all UC-IDs and BR-IDs addressed in this run (from the DIs you implemented).
   - Check each DI's RELATED field for UC/BR references.
   - Example: UC-001, UC-003, BR-005, BR-012.

4. Document caveats:
   - Any shortcuts taken? (Example: "Email validation is client-side only; server-side validation deferred to Stage 10.2".)
   - Any incomplete parts? (Example: "Forgot password flow not yet implemented; placeholder button added".)
   - Any known issues? (Example: "Form fails with React error if user submits twice quickly; retry logic not yet added".)
   - If none: write "None."

5. Note anything downstream stages need to know.
   - Example: "Test database must be seeded with test user accounts before running tests."
   - Example: "Production API key required in .env for email service."

### Step 2: Determine Next Version

1. Open `10-RELEASE-NOTES.md`.
2. Find the last RN entry (the most recent one).
3. Note its version (example: v0.0.2).
4. Increment patch: v0.0.2 → v0.0.3.
5. Record today's date (YYYY-MM-DD format).

### Step 3: Write the RN Record

1. Copy the schema above to a buffer.
2. Fill in all 4 fields exactly.
3. **Append this record to `10-RELEASE-NOTES.md` AFTER all prior entries.**
   - Position: scrolls to end of file, above the gate line (or where gate line will be).
4. Example:
   ```markdown
   ## RN-003 : v0.0.3 — 2026-06-15
   
   - **CHANGED FILES:**
     - `./src/components/UserForm.tsx` — New user registration form with email validation
     - `./src/api/users.ts` — Added POST /api/users endpoint, user creation, validation
     - `./package.json` — Added email-validator library dependency
   - **IMPLEMENTATION CAVEATS:** Email validation is client-side only. Server-side email uniqueness check deferred to v0.0.4. Form does not retry on network failure.
   - **UC/BR COVERAGE:** UC-001, UC-002, BR-005, BR-010.
   - **NOTES:** Test database requires seed data: test account with email=test@example.com. Production deployment requires SENDGRID_API_KEY in .env.
   ```

### Step 4: Validate (Before Gate)

1. Version higher than last entry? YES → OK. NO → Fix version.
2. All 4 fields filled? YES → OK. NO → Add missing fields.
3. CHANGED FILES list every file from Step 1? YES → OK. NO → Add missing files.
4. Each file has a brief description? YES → OK. NO → Add descriptions.
5. IMPLEMENTATION CAVEATS present? YES → OK. NO → Add "None." or list caveats.
6. UC/BR COVERAGE non-empty? YES → OK. NO → Add UC/BR IDs from DI RELATED fields.
7. New entry appended (not inserted before old ones)? YES → OK. NO → Move it.

---

## Exit Gate (All Boxes Checked)

- [ ] A new RN entry has been appended to `10-RELEASE-NOTES.md` (below all prior entries).
- [ ] Version number is higher than the prior entry and follows versioning rule (patch +1, or minor +1 for full pipeline).
- [ ] CHANGED FILES lists every file created or modified during this Stage 10 run.
- [ ] Each file in CHANGED FILES has a one-line description.
- [ ] IMPLEMENTATION CAVEATS is present (may be "None." if truly none).
- [ ] UC/BR COVERAGE lists at least one UC-ID and one BR-ID (from the DIs you implemented).
- [ ] NOTES contains useful guidance for Tester or next Developer.
- [ ] New RN entry is appended, not inserted before or after existing entries (order is chronological).
- [ ] No prior RN entries have been modified, deleted, or reordered.
