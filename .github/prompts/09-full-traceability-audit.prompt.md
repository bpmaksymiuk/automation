# Run Full Traceability Audit

Use this prompt to verify that every UC-ID traces from use cases through to test coverage.

---

Run a full traceability audit for project <PROJECT_ROOT>.

Required checks (per `.github/instructions/traceability-audit.instructions.md`):

1. Read `2-USE-CASES.md` and extract all UC-IDs.
2. Check each artifact in the traceability chain:
   - `bash .github/skills/manager-pipeline-orchestration/automation/verify-traceability.sh <PROJECT_ROOT>`
3. For each downstream artifact, confirm every UC-ID is present:
   - `5-REQUIREMENTS.md` — each UC must appear in at least one BR's UC REFERENCE field.
   - `7-DESIGN-INSTRUCTIONS.md` — each UC must appear in at least one DI's UC REFERENCE field.
   - `10-RELEASE-NOTES.md` — each UC must appear in at least one RN's UC/BR COVERAGE field.
   - `11-TEST-CASES.md` — each UC must appear in at least one T record's UC REFERENCE field.
   - `11-TEST-REPORT.md` — each UC must appear in at least one TR record's test reference.

Gap routing rules:
- Missing from Stage 5 → route to Stage 5 (BA).
- Missing from Stage 7 → route to Stage 7 (TL).
- Missing from Stage 10 → route to Stage 10 (Developer).
- Missing from Stage 11 → route to Stage 11 (Tester).

Output format:
1. UC-ID list from Stage 2.
2. Per-artifact coverage table (PASS / GAP for each UC × artifact).
3. Gaps identified (UC-ID, artifact, routing target).
4. Overall result: FULL COVERAGE or GAPS FOUND.
5. Next action command or "No action needed".

Do not edit any files.
