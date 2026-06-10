# Bug Report Writing — SKILL.md

> Stage 11 — document every test failure as a traceable BUG record.

---

## When to Use

Invoke at Stage 11 (Tester) when recording defects. Use it to append BUG records to `11-BUG-REPORT.md` following the append-only convention for every FAIL result in `11-TEST-REPORT.md`. If no defects are found, a “no defects” BUG-001 entry is still required. Every BUG record must name an OWNING STAGE to enable Manager routing. One BUG record per distinct failure; multiple T-IDs may map to the same BUG if they share a root cause.

---

## Target Files

- `11-BUG-REPORT.md`

---

## Record Schema

```
## BUG-XXX : TITLE

- **SEVERITY:** Critical | High | Medium | Low
- **STAGE:** The pipeline stage responsible for the fix (usually Stage 10 — Developer).
- **DESCRIPTION:** Observed behaviour. Be specific: what happened, where, under what conditions.
- **ROOT CAUSE:** The most likely technical cause. Identify the artifact, file, or function responsible.
- **FIX APPLIED:** What was done to resolve this bug. Write "Pending" if not yet fixed.
- **RELATED:** T-IDs that surfaced this bug; UC-IDs and BR-IDs it violates.
- **STATUS:** Open | Fixed | Verified
```

---

## Severity Guidelines

| Severity | Meaning |
|----------|---------|
| Critical | The product cannot be used; core UC fails completely. |
| High | A major UC or BR is broken; no workaround available. |
| Medium | A UC or BR is impaired but a workaround exists. |
| Low | Minor cosmetic or non-critical issue; does not block a UC. |

---

## Constraints

- Do not fix bugs as part of bug reporting.
- Do not suppress or omit failures to obtain a PASS recommendation.

---

## Procedure

1. Read `11-TEST-REPORT.md` and identify every FAIL entry.
2. For each FAIL (or group of FAILs with the same root cause), write one BUG record.
3. Assign BUG-IDs sequentially (BUG-001, BUG-002, …).
4. Set STATUS to `Open` for all new records.
5. Set FIX APPLIED to `Pending` until the Developer resolves it.
6. After a fix is applied and re-verified by the Tester, update STATUS to `Fixed` then `Verified`.
7. Append only — never delete BUG records, even after they are resolved.
8. Validate against the exit gate.

---

## Exit Gate

- [ ] Every FAIL in `11-TEST-REPORT.md` maps to at least one BUG record.
- [ ] Every BUG record has a SEVERITY assigned.
- [ ] Every BUG record has a STATUS (Open / Fixed / Verified).
- [ ] Every BUG record's RELATED field references at least one T-ID and one UC-ID or BR-ID.
- [ ] BUG-IDs are sequential and non-reused.
- [ ] No BUG records have been deleted or overwritten.
- [ ] `11-BUG-REPORT.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
