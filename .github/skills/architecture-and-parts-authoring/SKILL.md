# Architecture and Parts Authoring — SKILL.md

> Stage 6 — concrete technology decisions and component inventory from business requirements.

---

## When to Use

Invoke at Stage 6 (Architect). Use it when making technology decisions and building the parts inventory that translates requirements into a concrete technical structure. Every AR must be justified by explicit rationale and at least one named alternative. Produces `6-ARCHITECTURE-RECOMMENDATIONS.md` and `6-PARTS LIST.md`. Upstream inputs: `2-USE-CASES.md` and `5-REQUIREMENTS.md`. The Architect must address every use case before writing component-level decisions — technology choices made here cascade into all downstream stages.

---

## Target Files

- `6-ARCHITECTURE-RECOMMENDATIONS.md`
- `6-PARTS LIST.md`

---

## OVERALL ARCHITECTURE SUMMARY — Required First Section

Before writing any AR or PT record, the Architect must produce an **OVERALL ARCHITECTURE SUMMARY** as the first section of `6-ARCHITECTURE-RECOMMENDATIONS.md`. This summary is the holistic technology plan for the entire project.

The summary must:
1. Name the overall technology stack and explain why it satisfies the project's core quality attributes (performance, visual fidelity, scalability, maintainability, etc.).
2. Address every UC-ID from `2-USE-CASES.md` — for each UC, state in one to two sentences how the proposed architecture enables it. No UC may be left unaddressed.
3. Identify the major system boundaries (e.g., rendering engine, data layer, UI layer, deployment target) and describe how they interact.
4. Identify the top two or three architectural risks and mitigation strategies.
5. Be written as a coherent narrative of 4–8 paragraphs before any structured AR records appear.

Do not write individual AR records until the OVERALL ARCHITECTURE SUMMARY section is complete and internally coherent. If the summary cannot be made coherent without resolving open use-case conflicts, route back to Stage 2 before proceeding.

---

## AR Record Schema

```
## AR-XXX : RECOMMENDATION TITLE

- **DECISION:** The specific technology, pattern, or approach selected.
- **RATIONALE:** Why this decision was made over alternatives. Name at least one alternative considered.
- **UC REFERENCES:** UC-IDs from 2-USE-CASES.md that this AR directly contributes to satisfying.
- **NOTES:** Known limitations, version constraints, or configuration requirements.
- **RELATED:** BR-IDs this AR satisfies; PT-IDs that implement this AR.
```

## PT Record Schema

```
## PT-XXX : PART NAME

- **DESCRIPTION:** What this part does in the system.
- **TECHNOLOGY RECOMMENDATIONS:** Specific library, format, tool, or pattern. Not a category — a named choice.
- **NOTES:** File naming conventions, size constraints, runtime behaviour, or integration requirements.
- **RELATED:** AR-IDs this PT implements; BR-IDs it satisfies.
```

---

## Constraints

- Do not write implementation code, Playwright scripts, or design instructions.
- Every recommendation must name a specific technology, library, or pattern — not a generic category.
- The OVERALL ARCHITECTURE SUMMARY must appear before the first AR record.
- Every UC in `2-USE-CASES.md` must be addressed — either in the OVERALL ARCHITECTURE SUMMARY or via at least one AR's UC REFERENCES field.

## Context Budget (Low-Ambiguity Mode)

- Read only required upstream files plus current Stage 6 files.
- Do not open unrelated stage artifacts unless a blocker explicitly requires it.
- Keep output focused on Stage 6 artifacts only.

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`. Verify that the UC-IDs and acceptance criteria you are working from match the current `2-USE-CASES.md`.
2. List every UC-ID from `2-USE-CASES.md`. This list drives the OVERALL ARCHITECTURE SUMMARY — every UC must be addressed before proceeding to AR records.
3. **Write the OVERALL ARCHITECTURE SUMMARY first.** Produce a coherent holistic technology plan that names the stack, addresses every UC-ID, defines major system boundaries, and identifies top risks. Do not begin AR records until this section is complete.
4. **Web research before making technology decisions.** For each BR concern group and each major UC capability, search the web to validate technology choices before committing to them. Research areas include: official documentation for candidate libraries and frameworks, benchmark comparisons, known failure modes, licence compatibility, community health, and version constraints. Use `fetch_webpage` to retrieve official docs, changelogs, and comparison resources. Record the most decision-relevant source for each AR in the RATIONALE field.
5. Group related BRs and UCs by concern (data, UI, rendering, security, integration, etc.).
6. For each concern group, make one or more technology decisions and write an AR record. Populate the UC REFERENCES field for every AR.
7. For each AR, identify the concrete components (files, libraries, config) and write PT records.
8. Assign sequential IDs within each series (AR-001, AR-002, …; PT-001, PT-002, …).
9. Validate against the exit gate.

---

## Exit Gate

- [ ] An OVERALL ARCHITECTURE SUMMARY section exists as the first content section in `6-ARCHITECTURE-RECOMMENDATIONS.md`, before any AR records.
- [ ] The OVERALL ARCHITECTURE SUMMARY explicitly addresses every UC-ID from `2-USE-CASES.md`.
- [ ] Every BR maps to at least one AR.
- [ ] Every UC-ID from `2-USE-CASES.md` is referenced in at least one AR's UC REFERENCES field or is covered in the OVERALL ARCHITECTURE SUMMARY.
- [ ] Every AR names a specific, concrete technology — no generic categories.
- [ ] Every AR includes at least one alternative considered in RATIONALE.
- [ ] Every AR has a UC REFERENCES field.
- [ ] Every PT has a TECHNOLOGY RECOMMENDATIONS field that names a specific choice.
- [ ] AR IDs are sequential and non-reused.
- [ ] PT IDs are sequential and non-reused.
- [ ] RELATED fields trace AR↔BR and PT↔AR correctly.
- [ ] `6-ARCHITECTURE-RECOMMENDATIONS.md` and `6-PARTS LIST.md` document `STATUS` fields are set to `PASS` and `STATUS UPDATED` is set to today's date.
