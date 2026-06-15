# Index: Pipeline Optimization for Weak Models

**Last Updated:** 2026-06-15  
**Status:** Complete (All P0 + P1 items done)

---

## 🚀 START HERE

| Need | File | Section |
|------|------|---------|
| Quick start | `.github/QUICK-REFERENCE.md` | All |
| Weak model tips | `.github/WEAK-MODEL-PLAYBOOK.md` | All |
| Model routing | `.github/WEAK-MODEL-PLAYBOOK.md` | Table: Pipeline Stages |
| Your stage checklist | `.github/instructions/pipeline.instructions.md` | Search "## Stage N" |

---

## 🔄 WHAT CHANGED

### New Files (2)
| File | Purpose | Size |
|------|---------|------|
| `.github/WEAK-MODEL-PLAYBOOK.md` | Comprehensive weak-model guide (failure patterns, best practices, FAQ) | 12.8 KB |
| `.github/QUICK-REFERENCE.md` | 1-page operator cheat sheet | 5.5 KB |

### Modified Skills (4)
| Skill | Stage | Changes |
|-------|-------|---------|
| `design-instructions-authoring/SKILL.md` | 7 | Constraint-first DI schema; 5-point quality gate; zero-questions test |
| `implementation-stage/SKILL.md` | 10 | 10 anti-patterns; step-by-step procedure; 13-item exit gate |
| `test-case-authoring/SKILL.md` | 11 | 6-field TC schema; coverage checklist; ambiguity detection |
| `release-notes-writing/SKILL.md` | 10 | Strict versioning algorithm; append-only explicit; 4-field schema |

### Modified Agents (12)
All in `.github/agents/`:
- `architect.agent.md` ← model_capability, weak_model_adaptation, works_with, not_recommended
- `auditor.agent.md`
- `business-analyst.agent.md`
- `developer.agent.md`
- `graphic-artist.agent.md`
- `manager.agent.md`
- `product-owner.agent.md`
- `prod-ops.agent.md`
- `technical-lead.agent.md`
- `tester.agent.md`
- `user-ba.agent.md`
- `writer.agent.md`

### Modified Instructions (1)
| File | Changes |
|------|---------|
| `.github/instructions/pipeline.instructions.md` | Added 12 stage-specific checklists (BEFORE YOU START \| DURING \| BEFORE GATE); model routing guidance; weak model section |

---

## 🎯 KEY PATTERNS

### Constraint-First Pattern
**Instead of:** "Write clear steps that handle edge cases..."  
**Now:** Explicit checklist (5-point quality gate, zero-questions test)  
**Files:** All 4 core skills + playbook

### Model Routing
**Instead of:** Same instructions for all models  
**Now:** Metadata in every agent (works_with, not_recommended)  
**Files:** All 12 agents + playbook + quick-reference

### Embedded Checklists
**Instead of:** External shell scripts (stage-precheck.sh)  
**Now:** Numbered checklists in pipeline.instructions.md  
**Files:** pipeline.instructions.md (12 stage checklists)

### Gate Rules
**Instead of:** Subtle positions for gate lines  
**Now:** Explicit (last line of file, exact format)  
**Files:** All skills + pipeline.instructions.md

---

## 📋 STAGE ROUTING QUICK TABLE

| Stage | Model | Haiku | Notes |
|-------|-------|-------|-------|
| 1 | Sonnet+ | ❌ | Brainstorm; broad context needed |
| 2 | Sonnet+ | ❌ | Product Owner; approval of all UCs |
| 3 | Sonnet/Haiku | ✅ | Narrative is modular |
| 4 | Opus+ | ❌ | Visual storyboards (complex reasoning) |
| 5 | Sonnet/Haiku | ✅ | Atomic requirements |
| 6 | Sonnet+ | ⚠️ | Architect; Haiku needs binary trees |
| 7 | Sonnet+ | ⚠️ | DIes precise; Haiku produces narrower |
| 8 | Sonnet/Haiku | ✅ | Text is modular |
| 9 | Opus+ | ❌ | Asset curation (complex) |
| 10 | Sonnet/Haiku | ✅ | Code is precise |
| 11 | Sonnet/Haiku | ✅ | Test procedures |
| 12 | Sonnet/Haiku | ✅ | Deployment checklist |

**Legend:** ✅ Haiku OK | ⚠️ Haiku can try (narrower output) | ❌ Use Sonnet+

---

## 🔍 FIND BY PROBLEM

### "I need to approve requirements but I'm using Haiku"
→ Stage 5 (Business Analyst)  
→ Open `.github/agents/business-analyst.agent.md`  
→ Note: "sonnet" model_capability, but can use Haiku with adaptation  
→ Read `.github/instructions/pipeline.instructions.md`, search "## Stage 5"  
→ Read `.github/WEAK-MODEL-PLAYBOOK.md`, section 2 (routing)

### "My Haiku model keeps asking clarifying questions"
→ Check `.github/WEAK-MODEL-PLAYBOOK.md`, section 3 (failure patterns)  
→ Pattern 2: "Ambiguity Explosion"  
→ Solution: Use constraint-based phrasing (section 4 best practices)  
→ Example: Rewrite instruction as state machine ("IF X then do Y")

### "I don't know which model to use for Stage N"
→ Open `.github/QUICK-REFERENCE.md`, section "Model Routing (Quick Table)"  
→ OR: Open `.github/agents/<role>.agent.md` (check model_capability, works_with)  
→ OR: Open `.github/WEAK-MODEL-PLAYBOOK.md` table "Pipeline Stages: Weak-Model Routing"

### "How do I validate a gate?"
→ Open `.github/instructions/pipeline.instructions.md`  
→ Search "## Stage N", find "BEFORE GATE" section  
→ Use the checkbox list (binary format, no ambiguity)

### "I'm writing Design Instructions on Haiku and it's too vague"
→ Read `.github/skills/design-instructions-authoring/SKILL.md`  
→ Section: "Quality Gate: 5-Point Checklist"  
→ Follow the constraint-first pattern (5 points before each DI)  
→ Use the zero-questions test (if ambiguous, rewrite)

---

## 📊 BEFORE/AFTER: What Improved

### Skills
| Aspect | Before | After |
|--------|--------|-------|
| Format | Narrative guidance | Constraint-first checklist |
| Ambiguity | "Consider edge cases" | Explicit 5-point quality gate |
| Weak-model readiness | ❌ Low | ✅ High |
| Gate validation | Subtle (easy to miss) | Binary checklist (no ambiguity) |

### Agents
| Aspect | Before | After |
|--------|--------|-------|
| Model routing | ❌ None | ✅ Explicit (works_with, not_recommended) |
| Weak-model adaptation | ❌ None | ✅ Specific constraints listed |
| Model capability | ❌ Assumed | ✅ Declared (sonnet, sonnet+, opus+) |

### Instructions
| Aspect | Before | After |
|--------|--------|-------|
| Stage checklists | External scripts | Embedded in pipeline.md |
| Model guidance | ❌ None | ✅ Routing matrix + ⚠️/🔴 markers |
| Gate rules | Subtle position rules | Explicit (EOF only, exact format) |

### Documentation
| Aspect | Before | After |
|--------|--------|-------|
| Weak-model guide | ❌ None | ✅ Playbook (12.8 KB) |
| Quick reference | ❌ None | ✅ Quick-reference (5.5 KB) |

---

## ✅ VALIDATION CHECKLIST

Use this before shipping:

- [ ] All 4 core skills updated (Design, Implementation, Test, Release)
- [ ] All 12 agents have model metadata (works_with, not_recommended)
- [ ] pipeline.instructions.md has 12 stage checklists
- [ ] Playbook and quick-reference files created
- [ ] Model routing tested with sample Stage 7 on Haiku
- [ ] Gate line position rule documented and enforced
- [ ] Weak-model failure patterns documented

---

## 🎓 LEARNING RESOURCES

1. **Philosophy:**
   - `.github/WEAK-MODEL-PLAYBOOK.md` (Read all)

2. **Quick orientation:**
   - `.github/QUICK-REFERENCE.md` (Read all)

3. **Specific stage:**
   - `.github/instructions/pipeline.instructions.md` (Search "## Stage N")
   - `.github/agents/<role>.agent.md` (Check model_capability)
   - `.github/skills/<stage>/SKILL.md` (Full procedure)

4. **Model routing decisions:**
   - `.github/WEAK-MODEL-PLAYBOOK.md` table "Pipeline Stages: Weak-Model Routing"
   - `.github/QUICK-REFERENCE.md` section "Model Routing (Quick Table)"

5. **Weak-model failure handling:**
   - `.github/WEAK-MODEL-PLAYBOOK.md` section "Weak-Model Failure Patterns"

---

## 🚀 NEXT STEPS

1. **Read the playbook:** `.github/WEAK-MODEL-PLAYBOOK.md` (all sections)
2. **Test:** Run Stage 7 on Haiku with the new constraint-first skill
3. **Measure:** Can the model follow the rules without clarifying questions?
4. **Monitor:** Log any new weak-model failures to `.github/WEAK-MODEL-FAILURES.log`

---

**Questions?** Check the FAQ in `.github/WEAK-MODEL-PLAYBOOK.md` section "FAQ: Running Weak Models at Scale"

