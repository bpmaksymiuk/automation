---
description: "Allowed read/write boundaries per stage for low-ambiguity execution."
---

# Stage Allowed Actions (Simple Mode)

## Global Write Rule

1. A stage may write only stage-owned artifacts plus `PIPELINE-STATUS.md` and `X-Journal.md`.
2. A stage must not edit artifacts owned by other stages.

## Stage Matrix

| Stage | Must Read | May Write |
|---|---|---|
| 1 | `0-IDEA.md` | `1-BRAINSTORM.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 2 | `0-IDEA.md`, `1-BRAINSTORM.md` | `2-USE-CASES.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 3 | `2-USE-CASES.md` | `3-NARRATIVE-VISION.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 4 | `2-USE-CASES.md`, `3-NARRATIVE-VISION.md` | `4-CONCEPT-STORYBOARD.md`, `4-CONCEPT/`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 5 | `2-USE-CASES.md` | `5-REQUIREMENTS.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 6 | `2-USE-CASES.md`, `5-REQUIREMENTS.md` | `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 7 | `2-USE-CASES.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md` | `7-DESIGN-INSTRUCTIONS.md`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 8 | `2-USE-CASES.md`, `7-DESIGN-INSTRUCTIONS.md` | `8-TEXT-CONTENT.md`, `8-TEXT/`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 9 | `2-USE-CASES.md`, `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md` | `9-GRAPHIC-ASSETS.md`, `9-GRAPHIC-ASSETS/`, `9-DIAGRAMS/`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 10 | `2-USE-CASES.md`, `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md`, `9-GRAPHIC-ASSETS.md` | `10-RELEASE-NOTES.md`, `10-BUILD/`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 11 | `2-USE-CASES.md`, `10-RELEASE-NOTES.md`, `10-BUILD/` | `11-TEST-CASES.md`, `11-TEST-REPORT.md`, `11-BUG-REPORT.md`, `11-TESTS/`, `PIPELINE-STATUS.md`, `X-Journal.md` |
| 12 | `11-TEST-REPORT.md`, `10-BUILD/`, `11-TESTS/playwright.smoke.config.mjs` | `12-DEPLOYMENT-RESULTS.md`, `deploy.sh`, `.env.deploy`, `deploy/nginx.conf`, `PIPELINE-STATUS.md`, `X-Journal.md` |

## Fast Command

Use stage precheck before writing:

`bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <project-root> <stage>`
