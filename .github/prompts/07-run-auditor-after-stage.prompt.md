# Run Auditor After Stage

Use this prompt to invoke the Auditor cross-cutting agent after any completed stage.

---

Run the Auditor compliance check for Stage <STAGE_NUMBER> of project <PROJECT_ROOT>.

Required actions:
1. Read `.github/instructions/pipeline.instructions.md` to confirm current rule set.
2. Read all artifacts produced at Stage <STAGE_NUMBER>.
3. Check ownership, cross-edits, exit gate completeness, ID sequencing, and traceability using `.github/skills/auditor/SKILL.md`.
4. Append audit findings to `<PROJECT_ROOT>/X-AUDIT-REPORT.md` (create file if absent).
5. Report to Manager with severity summary.

Audit entry format (from SKILL.md):
```
## AUDIT-XXX : Stage N — YYYY-MM-DD
- RULE VIOLATED: <exact rule>
- ARTIFACT: <file path>
- EVIDENCE: <specific text or missing field>
- SEVERITY: Minor | Major | Blocking
- STATUS: Open
```

For a clean stage:
```
## AUDIT-XXX : Stage N — Clean — YYYY-MM-DD
No violations found. All governance rules observed.
```

Final response format:
- Total violations found.
- Severity breakdown (Blocking / Major / Minor).
- Overall pipeline status (safe to proceed / blocked).
- Next action (Manager routing or "proceed to Stage N+1").

Do not edit any file other than `X-AUDIT-REPORT.md`.
