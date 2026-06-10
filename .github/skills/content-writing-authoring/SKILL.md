# Content Writing — SKILL.md

> Stage 3 (narrative vision) and Stage 8 (text content, glossary, phrasebook).

---

## When to Use

- **Stage 3:** When writing the narrative vision document that establishes tone, themes, and world context for the product, drawing on research into comparable products. Upstream input: `2-USE-CASES.md`.
- **Stage 8:** When producing all application text content, a glossary, and a writing phrasebook from approved design instructions. Upstream inputs: `2-USE-CASES.md`, `7-DESIGN-INSTRUCTIONS.md`.

---

## Target Files

| Stage | File(s) |
|-------|---------|
| 3 | `3-NARRATIVE-VISION.md` |
| 8 | `8-TEXT-CONTENT.md`, `./8-TEXT/**` |

---

## Record Schema (Stage 8 — TC Records)

```
## TC-XXX : CONTENT TITLE

- **SUMMARY:** One sentence describing the text content piece.
- **FILE:** Relative path in ./8-TEXT/
- **CATEGORY:** `narrative` | `ui` | `utility` | `legal`
- **TONE NOTES:** Key tone and style guidance (formal/casual, active/passive, length constraints).
- **GLOSSARY REFERENCES:** GL-IDs used in this content piece.
- **TRACEABILITY:** DI-IDs that motivated this content piece.
```

---

## Constraints

- Stage 3 and 7 content must derive from approved upstream artifacts — do not invent content not grounded in `2-USE-CASES.md`.

---

## Procedure

**Stage 3:**
1. Read `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`.
2. Write `3-NARRATIVE-VISION.md` with four required sections:
   - `## OVERVIEW` — 2–3 paragraphs: what the product is, who it is for, what problem it solves.
   - `## COMPETITIVE & CREATIVE RESEARCH` — reference 3–5 comparable products or approaches; draw relevant lessons.
   - `## THEMES AND TONE` — identify 3–5 named themes; describe the desired voice and register.
   - `## WORLD-BUILDING / CONCEPTS` — name and describe the key concepts, metaphors, or mental models that should permeate the product.
3. Validate against Stage 3 exit gate.

**Stage 8:**
1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `7-DESIGN-INSTRUCTIONS.md`.
2. Read `7-DESIGN-INSTRUCTIONS.md` in full to identify all text-bearing DIs.
3. For each text-bearing DI, create a TC record in `8-TEXT-CONTENT.md`.
4. Write the corresponding text file at the path specified in the TC record.
5. Build a `## GLOSSARY` table in `8-TEXT-CONTENT.md` with columns: GL-ID | Term | Definition.
6. Build a `## PHRASEBOOK` table with columns: Category | Correct Phrasing | Incorrect Phrasing | Notes.
7. Validate against Stage 8 exit gate.

---

## Exit Gate

**Stage 3:**
- [ ] `3-NARRATIVE-VISION.md` contains all four required sections.
- [ ] OVERVIEW explains what the product does in plain language.
- [ ] COMPETITIVE & CREATIVE RESEARCH cites specific references.
- [ ] THEMES AND TONE names at least three distinct themes.
- [ ] WORLD-BUILDING / CONCEPTS identifies at least two key mental models.
- [ ] `3-NARRATIVE-VISION.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.

**Stage 8:**
- [ ] `8-TEXT-CONTENT.md` contains a GLOSSARY table and a PHRASEBOOK table.
- [ ] Every text-bearing DI has a corresponding TC record.
- [ ] Every TC record has a FILE path that exists in `./8-TEXT/`.
- [ ] Every TC record includes TRACEABILITY to at least one DI-ID.
- [ ] Glossary entries are consistent with phrasebook entries (no contradictions).
- [ ] `8-TEXT-CONTENT.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
