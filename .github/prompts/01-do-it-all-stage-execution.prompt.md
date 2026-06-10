# Do It All For One Stage (Low-Ambiguity)

Use this prompt when you want the agent to fully execute one stage with minimal back-and-forth.

---

Execute Stage <STAGE_NUMBER> for project root <PROJECT_ROOT> end-to-end.

Rules:
1. Do not ask planning questions unless blocked.
2. Keep edits minimal and stage-scoped.
3. Use deterministic commands and show results.

Required workflow:
1. Run precheck:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <PROJECT_ROOT> <STAGE_NUMBER>`
2. Run stage runner (JSON mode):
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --json <PROJECT_ROOT> <STAGE_NUMBER>`
3. Apply required edits only in allowed scope.
4. Run postcheck on the primary artifact:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <PROJECT_ROOT> <STAGE_NUMBER> <PRIMARY_ARTIFACT_PATH>`
5. Run stage guard with changed paths:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --strict --postcheck <PRIMARY_ARTIFACT_PATH> <PROJECT_ROOT> <STAGE_NUMBER> <CHANGED_PATH_1> [CHANGED_PATH_2 ...]`
6. If any `.github/` file changed, run:
   - `bash .github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh .`

Final response format:
- Summary: 3-6 bullets.
- Files changed: bullet list.
- Validation run: each command with PASS/FAIL.
- Remaining blockers: `None` or short list.
