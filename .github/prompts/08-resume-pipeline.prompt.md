# Resume Pipeline From Current Stage

Use this prompt to pick up where the pipeline left off and run the next incomplete stage end-to-end.

---

Resume the pipeline for project <PROJECT_ROOT> from the current stage.

Required workflow:
1. Read `<PROJECT_ROOT>/PIPELINE-STATUS.md` to identify the highest stage at PASS.
2. Determine the next runnable stage (highest PASS + 1, or stage with prior PASS inputs available).
3. Run the stage existence check:
   - `bash .github/skills/manager-pipeline-orchestration/automation/verify-stage-outputs.sh <PROJECT_ROOT> <NEXT_STAGE>`
4. Run precheck:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <PROJECT_ROOT> <NEXT_STAGE>`
5. If precheck passes, run the stage:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --json <PROJECT_ROOT> <NEXT_STAGE>`
6. Implement stage output (load the stage skill from `.github/skills/`).
7. Run postcheck on the primary artifact:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <PROJECT_ROOT> <NEXT_STAGE> <PRIMARY_ARTIFACT_PATH>`
8. Run stage guard:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --strict --postcheck <PRIMARY_ARTIFACT_PATH> <PROJECT_ROOT> <NEXT_STAGE> <CHANGED_PATH_1>`
9. Update `PIPELINE-STATUS.md` and append to `X-Journal.md`.
10. Declare gate: GATE N: PASS or GATE N: FAIL.

If FAIL:
- Stop. Do not advance.
- Report owning stage, failure reason, and rerun order.

Final response format:
- Stage executed.
- Gate result (PASS / FAIL).
- Files changed.
- Validation commands and results.
- Next stage to run (or `Pipeline blocked — see gate failure`).
