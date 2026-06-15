# Weak Model Playbook

> Quick-reference guide for operating this pipeline with lower-capability models (Claude Haiku, GPT-4 Mini).

**Read this first if you're using a model with <100k context window or slower reasoning.**

---

## Core Operating Principle

When running on weak models:
- **Narrower instructions** (not broader)
- **Explicit state machines** (not advice)
- **Checklists before prose** (not principles)
- **Binary decisions** (not multi-choice)
- **Built-in validation** (not trust & verify)

---

## Pipeline Stages: Weak-Model Routing

| Stage | Owner | Recommended Model | Why | Fallback |
|-------|-------|---|---|---|
| 0 | User | Any | Reading only | N/A |
| 1 | Writer | Sonnet+ | Brainstorm needs broad context | Haiku: use templates |
| 2 | Product Owner | Sonnet+ | Approval requires reading all UCs | Haiku: one UC at a time |
| 3 | Writer | Sonnet or Haiku | Narrative is modular | ✅ Haiku OK |
| 4 | Graphic Artist | Opus+ | Storyboard = complex visual reasoning | ⚠️ Haiku: struggle |
| 5 | Business Analyst | Sonnet or Haiku | Requirements are atomic | ✅ Haiku OK |
| 6 | Architect | Sonnet+ | Architecture needs system thinking | Haiku: use decision trees |
| 7 | Technical Lead | Sonnet+ | DIes need precision + context | Haiku: use DI templates |
| 8 | Writer | Sonnet or Haiku | Text content is modular | ✅ Haiku OK |
| 9 | Graphic Artist | Opus+ | Asset curation is complex | ⚠️ Haiku: struggle |
| 10 | Developer | Sonnet or Haiku | Code writing is precise | ✅ Haiku OK |
| 11 | Tester | Sonnet or Haiku | Test execution is procedural | ✅ Haiku OK |
| 12 | Prod Ops | Sonnet or Haiku | Deployment is procedural | ✅ Haiku OK |

**Legend:**
- ✅ **Haiku OK** — can run on Haiku reliably with this playbook
- ⚠️ **Haiku: struggle** — Haiku can attempt, but expect quality degradation; prefer Sonnet+
- Sonnet+ means Claude Sonnet, GPT-4, or better

---

## Weak-Model Failure Patterns (What to Watch For)

### Pattern 1: Vague Instruction Interpretation
**Symptom:** Model writes code/requirements that technically follow the instruction but miss the intent.
**Prevention:** Use exact examples instead of principles.
**Fix:** Quote the exact requirement back; rewrite using constraint-based phrasing.

### Pattern 2: Context Loss in Long Documents
**Symptom:** References to earlier section are forgotten; inconsistencies appear.
**Prevention:** Embed cross-references as explicit numbered links. Repeat constraints in each section.
**Fix:** Break upstream document into smaller chunks; queue them before the task.

### Pattern 3: Ambiguity Explosion
**Symptom:** Model asks clarifying questions instead of making reasonable decisions.
**Prevention:** Use state machines ("IF X then do Y") instead of "use your judgment."
**Fix:** Provide 2–3 concrete worked examples per section.

### Pattern 4: Gate Line Misplacement
**Symptom:** Model writes gate line in wrong position (near status block instead of EOF).
**Prevention:** Explicit instruction in bold + example in both correct/wrong positions.
**Fix:** Add to precheck: "grep for 'GATE' in final artifact; it must be the last non-blank line."

### Pattern 5: Incomplete Checklists
**Symptom:** Model skips checkbox items; only does first 3–4 items then stops.
**Prevention:** Keep checklists ≤12 items. Use inline completion percentage.
**Fix:** Break long checklists into named subsections; require each section to complete.

---

## Weak-Model Best Practices

### 1. Use Constraint-Before-Context Pattern

✅ **DO:**
```markdown
## Quality Gate (must all pass)
- [ ] Every file path is absolute or project-relative
- [ ] No "TBD" or placeholder text remains
- [ ] All RELATED BR-IDs are valid identifiers
```

❌ **DON'T:**
```markdown
## Quality Guidance
When writing design instructions, remember that the Developer needs to understand 
context without asking questions. Consider adding file paths, and think about 
referencing related requirements...
```

### 2. Use Explicit State Machines (Not Advice)

✅ **DO:**
```markdown
## Procedure: Write One DI

1. Read the DI template at `.github/templates/stage-output/7-DI-QUALITY-CHECKLIST.template.md`
2. Copy it: `cp .github/templates/7-CHECKLIST.template.md 7-DI-XXX-CHECKLIST.md`
3. Fill in every line (no blanks).
4. For IMPLEMENTATION STEPS: write numbered steps until you can't add more.
5. **STOP here.** Do not proceed to the next DI until this one passes:
   - [ ] Can a Developer read this and implement without asking questions?
   - If NO: rewrite steps. If YES: go to step 6.
6. Write the SUMMARY field.
7. Append to `7-DESIGN-INSTRUCTIONS.md`.
```

❌ **DON'T:**
```markdown
## Procedure: Write Design Instructions

Think carefully about what the Developer needs to know. Write clear steps that guide 
implementation without ambiguity. Consider edge cases and integration points. Make 
sure each DI is complete and thorough...
```

### 3. Embed Quality Checks in Skill, Not External Tools

For weak models, external shell scripts are a bottleneck. Instead:

✅ **DO: Embed in Markdown**
```markdown
## Before You Finish: Self-Check

In this exact order:
1. Open `7-DESIGN-INSTRUCTIONS.md` in your editor.
2. Search for "TBD". Result should be: "No matches found". If found, fix them.
3. Search for "DI-0". Count results. Should match your DI count (e.g., if you wrote 5 DIs, should find DI-001 to DI-005).
4. Search for "as appropriate" or "use your judgment". Should be: "No matches found". If found, rewrite as explicit steps.
5. Open the Status block at top of file. Set STATUS to PASS. Set STATUS UPDATED to today (YYYY-MM-DD).
```

❌ **DON'T: External Utility**
```
Run: bash .github/skills/design-instructions-authoring/automation/verify-di-quality.sh
```

### 4. Use Binary Decision Trees (Not Multi-Choice)

✅ **DO:**
```markdown
## IF/THEN Decision Tree

**Is the DI describing a file creation?**
- YES → Go to section "File DI Template"
- NO → Go to section "Behavior DI Template"

**Does the file path include `./11-TESTS/`?**
- YES → STOP. This is a gate violation. Tester writes test files, not you.
- NO → Continue to implementation steps.
```

❌ **DON'T:**
```markdown
## Types of Design Instructions

Design instructions can take many forms. They might describe:
- File creation and modification
- Behavioral changes
- Integration points
- Configuration updates
Consider which type applies to your situation and write accordingly...
```

### 5. Exact Position Rules for Critical Contracts

**Problem:** Weak models misplace GATE declarations (write near STATUS block instead of EOF).

✅ **DO:**
```markdown
## Gate Line: Critical Position Rule

The gate line MUST be:
1. **The very last non-blank line in the file** (no sections after it)
2. Blank line before it (to visually separate)
3. One of exactly two forms:
   - `GATE 7: PASS`
   - `GATE 7: FAIL - reason; re-run from Stage X`

**WRONG position (near top, causes instant gate violation):**
```
# 7-DESIGN-INSTRUCTIONS.md
- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
GATE 7: PASS  ← VIOLATION: must be at EOF
...content...
```

**CORRECT position (at EOF):**
```
...final DI content...
- **NOTES:** See Stage 6 for dependency ordering.

GATE 7: PASS
```
```

### 6. Use Numbered Lists for Procedures (Not Prose)

✅ **DO:**
```markdown
1. Read `6-ARCHITECTURE-RECOMMENDATIONS.md`.
2. Read `6-PARTS LIST.md`.
3. For each AR record:
   a. Identify all file paths mentioned.
   b. Check each path: Does it exist in the project? YES → note it. NO → this triggers a DI.
4. Go to section "Write One DI" below.
```

❌ **DON'T:**
```markdown
Start by reviewing the architecture recommendations. Think about which parts need 
implementation. You'll want to read both the AR and parts list to understand what's needed. 
Then write design instructions that cover all the architectural decisions...
```

---

## Using This Playbook in Your Workflow

### Before Invoking a Weak-Model Agent

1. **Check the model capability table above.** Is your model on the recommended list for this stage?
   - YES: Use the skill as written.
   - NO: Either switch to a stronger model, or apply adaptations below.

2. **If using a model rated "⚠️ Haiku: struggle":**
   - Add preamble to the agent prompt: "This is a challenging stage. Use the constraint-first pattern from `.github/WEAK-MODEL-PLAYBOOK.md` sections 1–6."
   - Break work into smaller chunks (one UC at a time, not the whole document).
   - Provide 2–3 worked examples from your codebase (not generic).

3. **If using a model rated "❌ Not Recommended":**
   - Switch to Sonnet or stronger for this stage, OR
   - Break the stage into sub-tasks, each <5min of reasoning.

### After the Model Completes Work

1. **Run the embedded self-check from the skill** (not external shell scripts).
2. **Verify gate line position** manually: `tail -3 <artifact>` should show gate line at end.
3. **If gate fails:** Route back with specific constraint violated, not vague feedback.

---

## Example: Adapting a Skill for Haiku

**Original (Sonnet-capable) Instruction:**
```markdown
## Procedure

Read the architecture and think about what needs building. Consider dependencies, 
integration points, and error scenarios. Write design instructions that are clear, 
complete, and cover all edge cases. Test each DI mentally against the architecture 
to ensure it's implementable.
```

**Adapted (Haiku-capable) Instruction:**
```markdown
## Procedure: Write One DI (Repeat This 5 Times)

For each design instruction, follow this exact sequence:

1. Pick one thing from the architecture that needs building (one file, one component, one config).
2. Copy this template (exact):
   ```
   ## DI-XXX : [TITLE]
   - **SUMMARY:** One sentence. What does this DI produce?
   - **IMPLEMENTATION STEPS:**
     1. [Step 1]
     2. [Step 2]
     ... (keep adding until no more steps)
   - **SKILLSET REQUIRED:** [What does Developer need to know?]
   - **NOTES:** Dependencies? Edge cases?
   - **RELATED:** [BR-IDs from Stage 5 that justify this DI]
   ```
3. Fill every line. No blanks.
4. Check: Can a Developer read this and build it without asking you a question?
   - NO → Rewrite that DI's steps until YES.
   - YES → Go to step 5.
5. Append this DI to `7-DESIGN-INSTRUCTIONS.md`.
6. Repeat for next DI.

## Self-Check (Before You Finish)

In this exact order, do these checks:

- [ ] Search for "TBD" in `7-DESIGN-INSTRUCTIONS.md` → Should find 0 matches
- [ ] Search for "DI-001" → Should find exactly 1 match
- [ ] Count your DIs (DI-001 through DI-NNN) → Each has all 5 schema fields
- [ ] Open file; press Ctrl+End (go to EOF) → Last non-blank line should be `GATE 7: PASS` or `GATE 7: FAIL - reason`
- [ ] Blank line before the GATE line? YES ✓
```

---

## Red Flags: When to Switch Models

If you see these patterns, your model is hitting limits. Switch to Sonnet+ for this stage:

1. **"I'll need clarification..."** — Model is asking questions instead of deciding.
2. **Repeated self-corrections** — Model writes something, then says "wait, I should have..."
3. **Contradictions** — Model writes conflicting requirement in the same artifact.
4. **Missing sections** — Model skips entire sections of the output schema.
5. **Vague gate lines** — Model writes `GATE 7: PASS (with caveats)` instead of binary PASS/FAIL.
6. **Gate in wrong place** — GATE line is not the final line of the file.

---

## FAQ: Running Weak Models at Scale

**Q: Can I run the whole pipeline on Haiku?**
A: Partially. Stages 3, 5, 8, 10, 11, 12 are reliable on Haiku. Stages 1, 2, 4, 6, 7, 9 benefit from Sonnet+. Stages 4 & 9 (graphics) prefer Opus.

**Q: How do I know if a Haiku output is good enough?**
A: Check the gate checklist. If gate passes + all upstream references are traceable, the output is good enough. Haiku will be more conservative (narrower scope), but that's OK — it stays within capability.

**Q: What if Haiku fails a stage?**
A: Don't retry Haiku on the same task. Route back to the owning stage and switch to Sonnet. Include the gate failure reason in your handoff.

**Q: Can I mix Haiku and Sonnet in one pipeline run?**
A: Yes. Use Haiku for its safe stages (3, 5, 8, 10–12) and Sonnet for risky stages (1, 2, 4, 6–7, 9). Your Manager agent can route to the right model at each stage.

**Q: How much slower is Haiku for Stage 7 (DI writing)?**
A: Haiku takes 2–3x longer and produces narrower DIes (smaller implementation unit per DI). Fewer DIes = more detail per DI = same time-to-build. Quality is comparable if you use the constraint-first structure.

---

## Contact & Updates

If you discover a new weak-model failure pattern:
1. Record it in `.github/WEAK-MODEL-FAILURES.log` (append only).
2. Add mitigation to this playbook.
3. Consider whether the pipeline structure should change.

Last updated: 2026-06-15
Tested with: Claude Haiku 4.5, Sonnet 4.5, GPT-4 Mini
