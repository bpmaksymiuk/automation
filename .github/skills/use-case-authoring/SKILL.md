# Use Case Authoring - SKILL.md

> Stage 2 only. The proposed stage has been removed from this model.

---

## When to Use

Use at Stage 2 to author and approve the single authoritative use-case file.

- Output file: 2-USE-CASES.md
- Upstream inputs: 0-IDEA.md and 1-BRAINSTORM.md

---

## Target File

| Stage | File |
|---|---|
| 2 | 2-USE-CASES.md |

---

## Record Schema

```markdown
## UC-XXX : ACTOR - USE CASE NAME

- GOAL: One sentence describing the actor's objective.
- STEPS:
  1. Step one.
  2. Step two.
- ACCEPTANCE CRITERIA:
  - AC1: Observable, testable condition.
  - AC2: Observable, testable condition.
- NOTES: Constraints, caveats, or out-of-scope clarifications.
- RELATED: IDs of related UCs or upstream goals.
```

Rules:
- UC IDs are sequential and never reused.
- Acceptance criteria must be independently testable.
- 2-USE-CASES.md is the single source of approved intent.

---

## Procedure (Stage 2)

1. Read 0-IDEA.md and 1-BRAINSTORM.md.
2. Draft use cases from concrete user goals.
3. Review for measurability and scope clarity.
4. Finalize all approved UCs in 2-USE-CASES.md.
5. Add approval header: Approved: YYYY-MM-DD.
6. Run Stage 2 exit gate.

---

## Exit Gate (Stage 2)

- [ ] All UC records follow the schema.
- [ ] UC IDs are sequential starting from UC-001.
- [ ] Every acceptance criterion is independently testable.
- [ ] Approval header is present.
- [ ] 2-USE-CASES.md is ready as downstream source of intent.
