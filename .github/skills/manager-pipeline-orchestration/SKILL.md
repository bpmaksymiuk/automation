# Manager Pipeline Orchestration — SKILL.md

> Cross-cutting role — gate failure detection, fault attribution, routing, pipeline recovery, and continuous improvement of pipeline controls.

---

## When to Use

Invoke for the Manager cross-cutting role whenever a gate failure is detected, whenever an Auditor flags a blocking violation, or whenever the pipeline needs to be re-triggered after a recovery. Use it to identify the owning stage, attribute fault to the responsible artifact, issue a routing instruction with a precise failure description, and add the minimal pipeline-control update needed to make the same class of mistake harder to repeat. After correction, issue a recovery instruction naming every downstream stage to rerun in order. The Manager does not produce stage artifacts, but it may update pipeline-control files under `.github/` when a failure reveals a process gap.

---

## Target Files

- Session log (informal — not a pipeline artifact owned by any stage)
- `.github/instructions/pipeline.instructions.md`
- `.github/skills/**`
- `.github/agents/**`

---

## Procedure

Follow the Gate Failure Loop below. Activate on demand only — not on a fixed stage cadence.

## Gate Failure Loop

1. **Detect failure.** Receive the failure signal: an agent self-reports an exit gate FAIL, a stage artifact is missing or invalid, or the Auditor flags a blocking violation.
2. **Identify ownership and fault.** Determine which artifact failed, which stage owns it, and why that stage is responsible. Consult the Pipeline Stages table in `pipeline.instructions.md` and cite the specific artifact or gate criterion.
3. **Verify root-scoped outputs.** If the failure came from delegated or automated work, verify the active project root directly before writing the routing note. Use `bash .github/skills/manager-pipeline-orchestration/automation/verify-stage-outputs.sh <project-root> <stage>` when available.
	- When a later stage reports a qualitative or runtime failure, inventory the concrete required files, sidecars, and stage-owned contract outputs first. Do not route another subjective rerun while required upstream outputs are still missing on disk.
4. **Determine the escape condition.** Decide whether a missing rule, weak skill instruction, unclear agent guidance, or missing automation check allowed the failure to escape earlier detection or recur.
5. **Design the prevention.** Choose the minimal durable change that makes the same failure mode less likely to repeat. Prefer narrow edits to the relevant `.github/instructions/`, `.github/skills/`, `.github/agents/`, or `.github/skills/**/automation/` file.
6. **Update pipeline controls when needed.** If Step 4 found a repeatable process gap, edit the minimal relevant pipeline-control files before closing the Manager action. Do not modify stage-owned product artifacts as part of this prevention step.
	- After any `.github/` pipeline-control edit, run `bash .github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh <repo-root>` before closing the Manager action.
7. **Write a failure description.** Produce a specific, actionable description of what failed and why. Vague descriptions ("it didn't work") are not acceptable. Include: the artifact name, the specific failing criterion, the expected vs observed state, and the preventive control update made or the reason none was needed.
8. **Route to owning stage.** Direct the owning stage's agent to re-run with the failure description. Do not attempt to fix the artifact yourself.
9. **Wait for re-run.** Monitor the re-run. Do not proceed to downstream stages until the exit gate is PASS. Do not apply time pressure that causes the agent to skip quality checks.
10. **Trigger downstream.** After a confirmed PASS, trigger all downstream stages in order, starting from the stage immediately after the recovered stage.
11. **Log the recovery and prevention.** Record in the session log: stage that failed, fault attribution, failure description, routing action, preventive files changed or `None`, re-run result, recovery confirmation, and downstream re-run sequence.

---

## Explicit Prohibitions

- Do not edit any stage-owned artifact directly.
- Do not accept a delegated or automated completion claim without verifying the required outputs in the active project root.
- Do not skip the re-run of any downstream stage after a recovery.
- Do not close a failure record without a confirmed PASS from the owning stage.
- Do not merge multiple failure loops — resolve one failure completely before addressing another.
- Do not accept a partial fix — the exit gate must fully pass, not just the failing criterion.
- Do not assign fault without naming the owning artifact, stage, and evidence.
- Do not skip a pipeline-control update when the failure exposed a repeatable process gap.
- Do not use a pipeline-control update as a substitute for rerunning the owning stage.
- Do not edit unrelated `.github` files; prevention updates must be minimal and tied to the observed failure mode.

---

## Exit Gate

- [ ] No open failure records remain unresolved.
- [ ] Every failure record has a documented routing action, fault attribution, and a confirmed PASS outcome.
- [ ] Every repeatable failure has a documented preventive pipeline-control update or an explicit written reason why no update was needed.
- [ ] After any `.github/` pipeline-control edit, `bash .github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh <repo-root>` passes.
- [ ] All downstream stages were re-run in order after each recovery.
- [ ] Pipeline is at PASS on all stage exit gates before the Manager session closes.
