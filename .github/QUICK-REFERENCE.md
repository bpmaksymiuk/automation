# Quick Reference: Pipeline for Weak Models

**Print this. Post it in your Copilot prompt.**

---

## 🚀 Before You Start Any Stage

1. **Check your model:**
   ```
   Am I using Haiku or GPT-4 Mini?
   → Read .github/WEAK-MODEL-PLAYBOOK.md
   
   Am I using Sonnet or better?
   → Use the skill normally
   ```

2. **Check your stage:**
   ```
   Open .github/instructions/pipeline.instructions.md
   Search for your stage number (e.g., "## Stage 7")
   Follow the checklist under BEFORE YOU START
   ```

3. **Load the skill:**
   ```
   Check .github/agents/<role>.agent.md
   Note: model_capability, weak_model_adaptation
   Open .github/skills/<stage>/SKILL.md
   ```

---

## Model Routing (Quick Table)

| Stage | Model | Note |
|-------|-------|------|
| 1 | Sonnet+ | Brainstorm needs context |
| 2 | Sonnet+ | Reading all UCs at once |
| 3 | Haiku ✅ | Modular writing |
| 4 | Opus | Visual storyboards (Haiku struggles) |
| 5 | Haiku ✅ | Atomic requirements |
| 6 | Sonnet+ | Architecture (Haiku needs binary trees) |
| 7 | Sonnet+ | DIes need precision; Haiku produces narrower |
| 8 | Haiku ✅ | Modular text |
| 9 | Opus | Asset curation (complex) |
| 10 | Haiku ✅ | Code is precise work |
| 11 | Haiku ✅ | Test procedures |
| 12 | Haiku ✅ | Deployment checklists |

---

## Constraint-First Pattern (For Any Model)

Instead of:
```markdown
## Guidance
Think about what the Developer needs. Write clear steps that are complete 
and handle edge cases. Consider validation and error behavior...
```

Do this:
```markdown
## Required Checklist
- [ ] Every input has a validation rule
- [ ] Every error state has a user-visible message
- [ ] No hardcoded test data
- [ ] RELATED field lists all BR/AR IDs
```

---

## Gate Line Rule (Critical)

**Gate line MUST be:**
1. Last non-blank line in the file (EOF)
2. Exact format: `GATE N: PASS` or `GATE N: FAIL - reason`
3. Blank line before it

**✅ CORRECT:**
```
...last content...

GATE 7: PASS
```

**❌ WRONG (near top):**
```
- **STATUS:** PASS
GATE 7: PASS  ← VIOLATION
...content...
```

---

## Stage Checklist Locations

| Stage | Checklist in |
|-------|--------------|
| All | `.github/instructions/pipeline.instructions.md` (search "## Stage N") |

Each stage has:
- **BEFORE YOU START** (model checks)
- **DURING** (quality criteria)
- **BEFORE GATE** (binary checklist)

---

## Haiku Survival Tips

1. **One chunk at a time.**  
   Don't read the whole doc. Read one section, implement, move on.

2. **Use the template.**  
   Each skill has a schema (DI template, TC template, RN template). Haiku excels with templates.

3. **Binary choices only.**  
   "IF this THEN that" works. "Consider these options" doesn't.

4. **Checklists work.**  
   Haiku can handle numbered checklists with ≤12 items.

5. **If confused, stop.**  
   If Haiku asks "should I do X or Y?", it has hit a limit. Switch to Sonnet.

---

## Red Flags (Switch to Sonnet)

- Haiku says "I need clarification..."
- Haiku writes contradictions ("Wait, I should have...")
- Haiku skips entire sections
- Haiku writes vague gate lines ("GATE 7: PASS (with caveats)")
- Haiku places GATE line in wrong position (near top)

---

## Weak-Model Failure Patterns

| Pattern | Fix |
|---------|-----|
| Vague interpretation | Quote the exact requirement back; rewrite as constraint |
| Context loss in long docs | Break into smaller chunks; repeat constraints per section |
| Ambiguity explosion | Use state machines ("IF X then do Y"), not advice |
| Gate line misplacement | Explicit instruction in bold + example of wrong/right positions |
| Incomplete checklists | Keep <12 items; use named subsections |

---

## Files You'll Use

```
.github/
├── agents/
│   ├── developer.agent.md          ← Check model_capability
│   ├── technical-lead.agent.md     ← Stage 7 agent
│   └── ...
├── instructions/
│   ├── pipeline.instructions.md    ← 12 stage checklists HERE
│   ├── stage-output-contract.md    ← Gate rules
│   └── ...
├── skills/
│   ├── design-instructions-authoring/SKILL.md    ← Stage 7
│   ├── implementation-stage/SKILL.md              ← Stage 10
│   ├── test-case-authoring/SKILL.md              ← Stage 11
│   ├── release-notes-writing/SKILL.md            ← Stage 10
│   └── ...
├── WEAK-MODEL-PLAYBOOK.md          ← Read this for Haiku tips
└── QUICK-REFERENCE.md              ← You are here
```

---

## Common Commands

```bash
# Validate gate line position (must be EOF)
tail -3 7-DESIGN-INSTRUCTIONS.md | head -1

# Check for TBD (should find 0)
grep -r "TBD" 7-DESIGN-INSTRUCTIONS.md

# Count DIes
grep -c "^## DI-" 7-DESIGN-INSTRUCTIONS.md

# Validate release notes append-only
git log -p 10-RELEASE-NOTES.md | head -50
```

---

## Example: Stage 7 with Haiku

```markdown
# You are the Technical Lead (Stage 7).

Read .github/skills/design-instructions-authoring/SKILL.md

THIS IS IMPORTANT:
1. Use the constraint-first pattern (5-point quality gate per DI)
2. Write DIs one at a time
3. For each DI:
   - Fill all 5 schema fields: SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED
   - Run zero-questions test: "Can a Developer implement this without asking me?"
   - If NO → rewrite. If YES → done with this DI.
4. After all DIes:
   - Search for "TBD" → should find 0
   - Last line of file: GATE 7: PASS

Input: 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md
Output: 7-DESIGN-INSTRUCTIONS.md
```

---

**Last Updated:** 2026-06-15  
**Read alongside:** `.github/WEAK-MODEL-PLAYBOOK.md`
