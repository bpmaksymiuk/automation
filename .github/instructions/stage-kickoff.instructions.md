---
description: "Run before starting any stage output."
---

# Stage Kickoff (Simple Mode)

## Do This First
1. Confirm current project folder.
2. Read pipeline.instructions.md.
3. Load current stage skill.
4. Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <project-root> <stage>`.
5. Read required upstream files.
6. Append START entry in X-Journal.md.

## Upstream Inputs

<!-- GENERATED:UPSTREAM_INPUTS:START -->
| Stage | Must Read Before Writing |
|---|---|
| 1 | 0-IDEA.md |
| 2 | 0-IDEA.md and 1-BRAINSTORM.md |
| 3 | 2-USE-CASES.md |
| 4 | 2-USE-CASES.md and 3-NARRATIVE-VISION.md |
| 5 | 2-USE-CASES.md |
| 6 | 2-USE-CASES.md and 5-REQUIREMENTS.md |
| 7 | 2-USE-CASES.md, 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md |
| 8 | 2-USE-CASES.md and 7-DESIGN-INSTRUCTIONS.md |
| 9 | 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 8-TEXT-CONTENT.md |
| 10 | 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 8-TEXT-CONTENT.md, 9-GRAPHIC-ASSETS.md |
| 11 | 2-USE-CASES.md, 10-RELEASE-NOTES.md, 10-BUILD/ |
| 12 | 11-TEST-REPORT.md, 10-BUILD/, 11-TESTS/playwright.smoke.config.mjs |
<!-- GENERATED:UPSTREAM_INPUTS:END -->

## Stop Conditions
- If any required input is missing, stop and route back.
