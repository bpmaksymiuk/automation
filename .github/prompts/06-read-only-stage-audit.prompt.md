# Read-Only Stage Audit

Use this prompt for quick status checks without changing files.

---

Run a read-only audit for <PROJECT_ROOT>.

Required checks:
1. Artifact existence by stage:
   - For each stage 1..12 run:
   - `bash .github/skills/manager-pipeline-orchestration/automation/verify-stage-outputs.sh <PROJECT_ROOT> <STAGE_NUMBER>`
2. Current stage status board:
   - Read `PIPELINE-STATUS.md`
3. Last gate declarations per stage artifact:
   - Read each existing stage markdown and extract `GATE N:` line.

Output format:
1. Stage table: stage, artifact status, gate status.
2. Missing required files (if any).
3. Highest ready stage.
4. Next action command (single best command).

Do not edit any files.
