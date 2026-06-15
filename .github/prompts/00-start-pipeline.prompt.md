# Start Pipeline From A Fresh Idea

Use this prompt when you have a new project root and want to begin the pipeline from Stage 1.

---

Start the pipeline for <PROJECT_ROOT> from the beginning.

Required inputs:
- `<PROJECT_ROOT>/0-IDEA.md`
- `<PROJECT_ROOT>/PIPELINE-STATUS.md`
- `<PROJECT_ROOT>/X-Journal.md`
- `.github/instructions/pipeline.instructions.md`

Required actions:
1. Confirm Stage 1 is the correct next stage. If any later stage is already PASS, stop and use `08-resume-pipeline.prompt.md` instead.
2. If the project scaffold is missing, follow `.github/instructions/new-project-scaffold.instructions.md` before writing stage output.
3. Run Stage 1 precheck:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <PROJECT_ROOT> 1`
4. Run the Stage 1 runner:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --json <PROJECT_ROOT> 1`
5. Load the Stage 1 skill from `.github/skills/` and write `1-BRAINSTORM.md`.
6. Run postcheck:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <PROJECT_ROOT> 1 1-BRAINSTORM.md`
7. Run stage guard:
   - `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --strict --postcheck 1-BRAINSTORM.md <PROJECT_ROOT> 1 1-BRAINSTORM.md PIPELINE-STATUS.md X-Journal.md`
8. Update `PIPELINE-STATUS.md` and append to `X-Journal.md`.
9. Declare `GATE 1: PASS` or `GATE 1: FAIL - reason`.

Final response format:
- Stage started.
- Files changed.
- Validation commands and results.
- Next action or blocker.
