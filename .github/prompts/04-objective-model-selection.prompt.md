# Pick The Cheapest Model That Still Works

Use this prompt when you want objective model selection instead of opinion.

---

I need the cheapest model that is still good enough for <TASK_TYPE>.

Evaluate candidate models using this exact method:
1. Define 8-12 representative test tasks for <TASK_TYPE>.
2. Score each model on:
   - Correctness (0-5)
   - Instruction following (0-5)
   - Determinism/repeatability (0-5)
   - Tool-use reliability if relevant (0-5)
3. Compute weighted quality score:
   - Quality = 0.45*Correctness + 0.25*Instruction + 0.20*Determinism + 0.10*ToolUse
4. Compute cost per successful task:
   - CPS = average cost per run / success rate
5. Recommend the cheapest model that meets minimum quality >= <QUALITY_THRESHOLD>.

Output format:
1. Test set used.
2. Score table.
3. Cost table.
4. Final recommendation and backup choice.
5. One-line policy: when to upgrade model tier.
