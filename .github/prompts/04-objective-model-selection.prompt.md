# Choose The Cheapest Sufficient Model

Use this prompt when you need to choose the smallest model that can complete a pipeline task safely.

---

Choose a model for <TASK_DESCRIPTION> in <PROJECT_ROOT>.

Required inputs:
- `.github/WEAK-MODEL-PLAYBOOK.md`
- `.github/instructions/pipeline.instructions.md`
- The relevant stage skill or stage prompt
- Any files that define the actual task scope

Required actions:
1. Identify the stage number and task type: writing, architecture, visual reasoning, implementation, testing, audit, or recovery.
2. Use the repo routing rules:
   - Stage 4 and Stage 9: prefer Opus.
   - Stages 1, 2, 6, 7: prefer Sonnet unless the task is tiny and local.
   - Stages 3, 5, 8, 10, 11, 12: Haiku is acceptable when the task is narrow and template-driven.
3. If the task has any of these flags, choose the stronger model:
   - large context
   - cross-file dependencies
   - visual reasoning
   - ambiguous recovery
   - missing upstream inputs
4. Return exactly one recommendation with a fallback and a short reason.
5. If the task is under-specified, ask for the missing input instead of guessing.

Final response format:
- Recommended model.
- Fallback model.
- Why this is the cheapest safe choice.
- Missing input, if any.
