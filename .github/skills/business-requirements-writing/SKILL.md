# Business Requirements Writing — SKILL.md

> Stage 5 — convert approved use cases into atomic, testable business requirements.

---

## When to Use

Invoke at Stage 5 (Business Analyst). Use it when deriving atomic, testable, shall-language requirements from approved use cases and lightweight research. The BA must conduct research to validate that requirements are implementable and records research sources inline in `5-REQUIREMENTS.md`. Produces `5-REQUIREMENTS.md`. Upstream inputs: `2-USE-CASES.md`, research sources cited inline. Every requirement must be derivable from a use case — do not invent requirements without a UC source.

---

## Target Files

- `5-REQUIREMENTS.md`

---

## Record Schema

```
## BR-XXX : REQUIREMENT STATEMENT

The system shall <specific, measurable, atomic condition>.

- **TESTABLE CONDITION:** The specific observable outcome that proves this requirement is met.
- **NOTES:** Constraints, edge cases, or out-of-scope clarifications.
- **RELATED:** UC-IDs this BR derives from; BR-IDs of related requirements.
```

---

## Writing Standard

- Use **shall** language for requirements. "Should" and "may" indicate preferences, not requirements.
- Each BR must be **atomic** — one requirement per BR record. Do not combine two requirements with "and".
- No implementation details — a BR states what the system does, not how.
- Quantify wherever possible: "within 2 seconds" is better than "quickly".
- Testable condition must be independently verifiable without access to source code.

**Correct:** `The system shall display an error message when a required field is left empty.`  
**Incorrect:** `The system should handle errors and also validate inputs before submission.`

---

## Constraints

- Do not include implementation details or technology choices in BR statements.

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`.
2. **Web research to validate implementability.** Before writing requirements, search the web for any domain-specific rules, standards, technical constraints, or regulatory requirements implied by the use cases. Record all research sources inline in `5-REQUIREMENTS.md` using a `> Sources:` block adjacent to the BRs they informed. Use `fetch_webpage` to retrieve relevant documentation, specifications, or comparable product behaviour.
3. For each UC, identify all behaviours implied by the acceptance criteria and steps.
4. Write one BR per distinct, atomic behaviour.
5. Assign sequential IDs (BR-001, BR-002, …).
6. For each BR, write the TESTABLE CONDITION before writing the requirement statement — this forces clarity.
7. Group BRs by UC in a `## BR-XXX` block for readability.
8. Validate against the exit gate.

---

## Exit Gate

- [ ] Every UC maps to at least one BR.
- [ ] Every BR uses shall language.
- [ ] Every BR is atomic (no compound requirements).
- [ ] Every BR has a TESTABLE CONDITION.
- [ ] No BR contains implementation details (no technology names, no code references).
- [ ] BR IDs are sequential and non-reused.
- [ ] RELATED fields reference valid UC-IDs.
- [ ] `5-REQUIREMENTS.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
