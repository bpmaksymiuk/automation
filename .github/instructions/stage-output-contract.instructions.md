---
description: "Minimal output contract for every stage artifact."
---

# Stage Output Contract (Simple Mode)

Use this contract for the primary markdown artifact written by Stages 1..12.

## Required Fields

1. Document title on the first line (`# ...`).
2. A status line in this exact shape:
   - `- **STATUS:** PASS` or `- **STATUS:** FAIL`
3. A status-updated line in this exact shape:
   - `- **STATUS UPDATED:** YYYY-MM-DD`
4. A stage gate declaration line in this exact shape:
   - `GATE N: PASS` or `GATE N: FAIL - reason`

## Contract Rules

1. Keep status, status-updated, and gate result internally consistent.
2. If gate is FAIL, include a short reason and owning reroute stage.
3. Do not remove historical entries; append updates.
4. Keep section headings stable unless a stage-specific skill explicitly requires more.

## Fast Check

Before writing stage output, run:

`bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <project-root> <stage>`

For a deterministic execution checklist, run:

`bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh <project-root> <stage>`

After writing output, validate contract shape:

`bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <project-root> <stage> <artifact-path>`

For lower-variance writing, copy a stage template from:

`.github/templates/stage-output/`
