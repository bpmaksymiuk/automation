---
applyTo: "PROJECTS/**"
---

# Pipeline - Stage Directory

<!-- GENERATED:STAGE_DIRECTORY:START -->
| Stage | Owner | Artifact(s) | Skill |
|---|---|---|---|
| 0 | User Input | 0-IDEA.md | n/a |
| 1 | Writer | 1-BRAINSTORM.md | .github/skills/brainstorming-authoring/SKILL.md |
| 2 | Product Owner (with User/BA input) | 2-USE-CASES.md | .github/skills/use-case-authoring/SKILL.md |
| 3 | Writer | 3-NARRATIVE-VISION.md | .github/skills/content-writing-authoring/SKILL.md |
| 4 | Graphic Artist | 4-CONCEPT-STORYBOARD.md, 4-CONCEPT/ | .github/skills/concept-storyboard-authoring/SKILL.md |
| 5 | Business Analyst | 5-REQUIREMENTS.md | .github/skills/business-requirements-writing/SKILL.md |
| 6 | Architect | 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md | .github/skills/architecture-and-parts-authoring/SKILL.md |
| 7 | Technical Lead | 7-DESIGN-INSTRUCTIONS.md | .github/skills/design-instructions-authoring/SKILL.md |
| 8 | Writer | 8-TEXT-CONTENT.md, 8-TEXT/ | .github/skills/content-writing-authoring/SKILL.md |
| 9 | Graphic Artist | 9-GRAPHIC-ASSETS.md, 9-GRAPHIC-ASSETS/, 9-DIAGRAMS/, 9-RESOURCES/ | .github/skills/graphic-artwork-authoring/SKILL.md |
| 10 | Developer | 10-RELEASE-NOTES.md, 10-BUILD/ | .github/skills/implementation-stage/SKILL.md, .github/skills/release-notes-writing/SKILL.md |
| 11 | Tester | 11-TEST-CASES.md, 11-TEST-REPORT.md, 11-BUG-REPORT.md, 11-TESTS/specs/ | .github/skills/test-case-authoring/SKILL.md, .github/skills/test-report-writing/SKILL.md, .github/skills/bug-report-writing/SKILL.md |
| 12 | Prod Ops | `12-DEPLOYMENT-RESULTS.md`, `deploy.sh`, `.env.deploy`, `deploy/nginx.conf`, `11-TESTS/playwright.smoke.config.mjs` | .github/skills/prod-ops/SKILL.md |
<!-- GENERATED:STAGE_DIRECTORY:END -->

## Foundational Rules

1. 2-USE-CASES.md is the single source of approved intent.
2. One stage owner writes stage-owned artifacts.
3. On failure, route back to the owning stage; rerun downstream stages in order.
4. Every stage declares an explicit gate: GATE N: PASS or GATE N: FAIL.
5. Historical records are append-only: X-Journal.md, release notes, test reports, bug reports.
6. Stage artifacts must follow `.github/instructions/stage-output-contract.instructions.md`.

## Execution Model

1. Start from 0-IDEA.md.
2. Run Stage 1, then 2 through 12 sequentially.
3. Stage 2 replaces the former proposed/approved split; only 2-USE-CASES.md is used.
4. No stage may begin before the prior stage gate is PASS.

## Control File Boundaries

- Pipeline rules belong in `pipeline.instructions.md`.
- Stage behavior helpers belong in separate instruction files under `.github/instructions/`.
- Role-specific operational detail belongs in `.github/agents/` and `.github/skills/`.
- Automation and enforcement belong in `.github/skills/*/automation/`.

## Operator Aids

- Policy index: `.github/instructions/pipeline-policy-index.md`
- Allowed actions matrix: `.github/instructions/stage-allowed-actions.instructions.md`

## Stage Status Board Template

<!-- GENERATED:STATUS_BOARD_TEMPLATE:START -->
| Stage | Status | Status Updated |
|---|---|---|
| 0 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 1 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 2 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 3 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 4 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 5 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 6 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 7 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 8 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 9 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 10 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 11 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
| 12 | Not Started/In Progress/PASS/FAIL | YYYY-MM-DD |
<!-- GENERATED:STATUS_BOARD_TEMPLATE:END -->
