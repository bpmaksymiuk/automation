# Auditor — SKILL.md

> Cross-cutting role — compliance observation after every stage.

---

## When to Use

Invoke for the Auditor cross-cutting role after every completed stage. Use it to inspect the stage artifact against pipeline governance rules and append AUDIT records to `X-AUDIT-REPORT.md`. Violation entries must name the specific rule breached from `pipeline.instructions.md`. The Auditor observes and records; it does not modify delivery artifacts. A “Stage N — Clean” entry is required even when no violations are found.

---

## Target Files

- `X-AUDIT-REPORT.md` (append only — no other files)

---

## Audit Entry Schema

```
## AUDIT-XXX : Stage N — YYYY-MM-DD

- **RULE VIOLATED:** The exact rule from pipeline.instructions.md that was broken.
- **ARTIFACT:** The file path where the violation was observed.
- **EVIDENCE:** The specific text, missing field, or observed behaviour that constitutes the violation.
- **SEVERITY:** Minor | Major | Blocking
- **STATUS:** Open | Resolved
```

For clean stages:
```
## AUDIT-XXX : Stage N — Clean — YYYY-MM-DD

No violations found. All governance rules observed.
```

---

## Observation Scope

Check each of the following after every stage:

1. **Ownership** — Did the correct agent produce the artifact? Compare the producing agent to the Pipeline Stages table ownership rule.
2. **Cross-edit** — Did any agent modify an artifact it does not own? Check modification timestamps or diff against known prior state.
3. **Exit gate completeness** — Is the exit gate section present in the artifact? Is every checklist item explicitly confirmed (not just present)?
4. **ID sequencing** — Are IDs within each prefix sequential and non-reused? Check for gaps, duplicates, or out-of-order entries.
5. **Traceability coverage** — Validate traceability fields against the Traceability ID Convention table. For records with `RELATED`, ensure all referenced IDs are valid. For release notes, validate `UC/BR COVERAGE` IDs. Check for orphaned or invented IDs.

---

## Severity Guidelines

| Severity | Meaning |
|----------|---------|
| Blocking | The pipeline must not advance until this is resolved. Examples: cross-edit, missing artifact, invalid exit gate. |
| Major | Significant quality or process issue; should be resolved before Stage 11. Examples: untraceable IDs, missing RELATED fields. |
| Minor | Style or convention deviation that does not affect correctness. Examples: inconsistent capitalisation in IDs. |

---

## Procedure

1. Read `pipeline.instructions.md` to confirm the current rule set.
2. Read all artifacts produced in the current stage (not just the primary artifact — check any supporting files created).
3. Work through each item in the Observation Scope systematically.
4. For each violation found: write an AUDIT entry with all fields populated.
5. For each clean stage: write a clean entry confirming the audit ran.
6. Assign AUDIT-IDs sequentially and append below all prior entries.
7. Report to Manager with: total violations, severity breakdown (Blocking / Major / Minor), and overall pipeline status.

---

## Explicit Prohibitions

- Do not fix violations — report them and let the Manager route the fix.
- Do not edit any stage-owned artifact other than `X-AUDIT-REPORT.md`.
- Do not suppress or omit violations to produce a cleaner report.
- Do not combine multiple stage audits into a single entry — one entry per stage per audit run.

---

## Exit Gate

- [ ] `X-AUDIT-REPORT.md` has an entry for the current stage (violation or clean).
- [ ] All open Blocking violations have been reported to Manager.
- [ ] AUDIT-IDs are sequential and non-reused.
- [ ] No stage-owned artifacts have been modified by the Auditor.
