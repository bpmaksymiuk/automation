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

1. **2-USE-CASES.md is the single source of approved intent.**
2. **One stage owner writes stage-owned artifacts.** No side writing.
3. **On failure, route back to the owning stage; rerun downstream stages in order.**
4. **Every stage declares an explicit gate:** `GATE N: PASS` or `GATE N: FAIL - reason; re-run from Stage X`.
5. **Historical records are append-only:** X-Journal.md, release notes, test reports, bug reports. Never overwrite prior entries.
6. **Stage artifacts must follow contract:** `.github/instructions/stage-output-contract.instructions.md`.
7. **Weak model guidance:** Read `.github/WEAK-MODEL-PLAYBOOK.md` before invoking Haiku or GPT-4 Mini.

## Execution Model

1. Start from `0-IDEA.md`.
2. Run Stage 1, then Stages 2–12 sequentially.
3. No stage may begin before the prior stage gate is PASS.
4. If any stage gate is FAIL, route back to the owning stage for correction. Rerun downstream stages (see Recovery below).

## Recovery (Stage Failure)

If a stage gate fails:

1. **Identify the owning stage** (the one that wrote the failed artifact).
2. **Document the gate failure reason** (e.g., "TC-001 references invalid UC ID").
3. **Route the owning stage** to fix the artifact.
4. **Rerun order after fix:** Owning stage + all downstream stages in sequence (e.g., if Stage 7 gate fails, rerun: Stage 7 → Stage 8 → Stage 9 → Stage 10 → Stage 11 → Stage 12).

## Control File Boundaries

- **Pipeline rules** → `pipeline.instructions.md` (this file; do not fork).
- **Stage behavior helpers** → `.github/instructions/` (instruction files per stage).
- **Role-specific operational detail** → `.github/agents/` and `.github/skills/`.
- **Shared automation & scripts** → `.github/skills/*/automation/` (inside each skill folder, not scattered).

## Model Routing Guidance

**Check `.github/agents/<role>.agent.md`** for `works_with` and `not_recommended` metadata.

- **Haiku recommended stages:** 3, 5, 8, 10, 11, 12
- **Sonnet recommended stages:** All (safe default)
- **Opus recommended stages:** 4, 9 (complex visual reasoning)

See `.github/WEAK-MODEL-PLAYBOOK.md` for detailed routing and adaptation patterns.

## Operator Aids

- **Policy index:** `.github/instructions/pipeline-policy-index.md`
- **Allowed actions matrix:** `.github/instructions/stage-allowed-actions.instructions.md`
- **Stage output contract:** `.github/instructions/stage-output-contract.instructions.md`
- **Weak model guide:** `.github/WEAK-MODEL-PLAYBOOK.md`

---

# Per-Stage Checklists (Embedded)

Use these checklists **before writing stage output** and **before declaring a gate**.

## Stage 1: Brainstorm

**BEFORE YOU START**
- [ ] Read `.github/WEAK-MODEL-PLAYBOOK.md` if using Haiku or GPT-4 Mini
- [ ] Read `0-IDEA.md`
- [ ] Understand the problem space clearly

**DURING**
- [ ] Brainstorm depth: ≥3 themes explored
- [ ] Research conducted: ≥2 sources for competitive landscape
- [ ] Tone and style established: clear, consistent voice

**BEFORE GATE**
- [ ] No "TBD" or placeholder text
- [ ] `1-BRAINSTORM.md` ends with blank line + `GATE 1: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 2: Use Cases

**BEFORE YOU START**
- [ ] Read `.github/WEAK-MODEL-PLAYBOOK.md` if using Haiku or GPT-4 Mini (note: Product Owner rated "sonnet+" — break work into smaller chunks if using Haiku)
- [ ] Read `0-IDEA.md` and `1-BRAINSTORM.md`

**DURING**
- [ ] Every UC has a clear actor, precondition, and success outcome
- [ ] Every acceptance criterion is testable and observable
- [ ] UC IDs are sequential (UC-001, UC-002, …)

**BEFORE GATE**
- [ ] All UCs have at least 1 acceptance criterion
- [ ] No vague UCs (e.g., "System works well")
- [ ] `2-USE-CASES.md` ends with blank line + `GATE 2: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 3: Narrative Vision

**BEFORE YOU START**
- [ ] Read `.github/WEAK-MODEL-PLAYBOOK.md` if using Haiku
- [ ] Read `2-USE-CASES.md`

**DURING**
- [ ] Vision is user-centric: focuses on jobs users need to do
- [ ] Tone consistent with brainstorm
- [ ] Sections are modular (can be read independently)

**BEFORE GATE**
- [ ] No "TBD" text
- [ ] Vision aligns with UC scope
- [ ] `3-NARRATIVE-VISION.md` ends with blank line + `GATE 3: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 4: Concept Storyboard

**BEFORE YOU START**
- [ ] ⚠️ **Model check:** Haiku struggles here. Use Opus if possible.
- [ ] Read `2-USE-CASES.md` and `3-NARRATIVE-VISION.md`

**DURING**
- [ ] Storyboard captures key user journeys visually
- [ ] Screen flow diagram included (required)
- [ ] Annotations are clear and implementation-ready

**BEFORE GATE**
- [ ] Screen flow diagram present
- [ ] All concept files in `4-CONCEPT/` folder
- [ ] `4-CONCEPT-STORYBOARD.md` ends with blank line + `GATE 4: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 5: Business Requirements

**BEFORE YOU START**
- [ ] Read `.github/WEAK-MODEL-PLAYBOOK.md` if using Haiku (Haiku OK for this stage)
- [ ] Read `2-USE-CASES.md`

**DURING**
- [ ] Every BR is atomic and testable (one behavior per BR)
- [ ] BR IDs are sequential (BR-001, BR-002, …)
- [ ] Each BR references at least one UC

**BEFORE GATE**
- [ ] Zero "should", "may", or vague language
- [ ] Every BR has a clear pass/fail condition
- [ ] `5-REQUIREMENTS.md` ends with blank line + `GATE 5: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 6: Architecture

**BEFORE YOU START**
- [ ] ⚠️ **Model check:** Architect rated "sonnet+". Use Sonnet or Opus.
- [ ] Read `2-USE-CASES.md` and `5-REQUIREMENTS.md`

**DURING**
- [ ] Technology choices are explicit (yes/no for each tool)
- [ ] Architecture diagram included (if needed)
- [ ] Parts list is complete and sourced

**BEFORE GATE**
- [ ] No "TBD" in AR or PT records
- [ ] All technology decisions justified
- [ ] `6-ARCHITECTURE-RECOMMENDATIONS.md` ends with blank line + `GATE 6: PASS`
- [ ] `6-PARTS LIST.md` ends with blank line + `GATE 6: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today (both files)

---

## Stage 7: Design Instructions

**BEFORE YOU START**
- [ ] ⚠️ **Model check:** Technical Lead rated "sonnet+". Use Sonnet or Opus.
- [ ] Read constraint-first DI pattern in `.github/WEAK-MODEL-PLAYBOOK.md` (section 2, 3, 4)
- [ ] Read `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`

**DURING (Per DI)**
- [ ] IMPLEMENTATION STEPS are numbered and complete
- [ ] Every step includes exact file paths and parameters
- [ ] Edge cases are named and their handling is explicit
- [ ] Zero "TBD", "as appropriate", "use your judgment"
- [ ] Run zero-questions test: can a Developer implement this without asking one clarifying question?

**BEFORE GATE**
- [ ] Every BR has at least one DI referencing it
- [ ] DI IDs are sequential (DI-001, DI-002, …)
- [ ] All 5 schema fields present: SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED
- [ ] `7-DESIGN-INSTRUCTIONS.md` ends with blank line + `GATE 7: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 8: Text Content

**BEFORE YOU START**
- [ ] Read `.github/WEAK-MODEL-PLAYBOOK.md` if using Haiku (Haiku OK for this stage)
- [ ] Read `7-DESIGN-INSTRUCTIONS.md`

**DURING**
- [ ] All text is modular (each piece can be moved independently)
- [ ] Tone matches `3-NARRATIVE-VISION.md`
- [ ] Files organized in `8-TEXT/` folder

**BEFORE GATE**
- [ ] All text referenced by any DI is present
- [ ] `8-TEXT-CONTENT.md` ends with blank line + `GATE 8: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 9: Graphic Assets

**BEFORE YOU START**
- [ ] ⚠️ **Model check:** Graphic Artist rated "opus+". Haiku not recommended.
- [ ] Read `7-DESIGN-INSTRUCTIONS.md` and `8-TEXT-CONTENT.md`

**DURING**
- [ ] All graphics acquired, sourced, or created
- [ ] Resources documented with license info
- [ ] Asset organization is clear

**BEFORE GATE**
- [ ] All RES records have PATH and INSTALL/USE fields
- [ ] All referenced graphics exist in `9-GRAPHIC-ASSETS/` or `9-RESOURCES/`
- [ ] `9-GRAPHIC-ASSETS.md` ends with blank line + `GATE 9: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 10: Implementation

**BEFORE YOU START**
- [ ] Read `.github/skills/implementation-stage/SKILL.md` **completely**
- [ ] Read `7-DESIGN-INSTRUCTIONS.md` first and mentally model all outputs
- [ ] Check: Any DI contains "TBD"? If YES → **Stop. Route back to Stage 7.**

**DURING (Per DI)**
- [ ] Implement each DI in order (DI-001, then DI-002, etc.)
- [ ] After each DI: verify behavior in running app (not just code presence)
- [ ] After each DI: check for compile errors, lint errors, browser console errors
- [ ] Do not proceed to next DI until current one is error-free and behavior-complete

**AFTER ALL DIs**
- [ ] Run self-review: re-read each DI spec and exercise its behavior in the running app
- [ ] Check browser console: zero errors/warnings during normal use
- [ ] Run `npm audit` (or equivalent): zero critical/high vulnerabilities
- [ ] Search code for: `console.log`, `TODO`, `FIXME`, `@ts-ignore`, commented code — should find 0 matches
- [ ] For web: verify accessible HTML (heading hierarchy, form labels, alt text, keyboard nav)

**BEFORE GATE**
- [ ] Append one RN record to `10-RELEASE-NOTES.md` (never overwrite prior entries)
- [ ] RN version is higher than prior entry
- [ ] All files in DIes exist at correct paths
- [ ] Zero compile/lint errors
- [ ] Zero untraced files in `10-BUILD/`
- [ ] All caveats documented in `10-RELEASE-NOTES.md`
- [ ] `10-RELEASE-NOTES.md` ends with blank line + `GATE 10: PASS`

---

## Stage 11: Test Cases (First Half)

**BEFORE YOU START**
- [ ] Read `.github/skills/test-case-authoring/SKILL.md` (constraint-first TC schema)
- [ ] Read `2-USE-CASES.md`, `5-REQUIREMENTS.md`, `10-RELEASE-NOTES.md`

**DURING (Write TCs, Don't Execute Yet)**
- [ ] For each UC acceptance criterion: write one TC
- [ ] For each BR: write at least one TC
- [ ] Every TC has 6 fields: UC REFERENCE, AC COVERAGE, BR REFERENCE, PRECONDITIONS, STEPS, EXPECTED RESULT, NOTES
- [ ] STEPS are numbered and executable by a human
- [ ] EXPECTED RESULTs are specific and observable

**COVERAGE VERIFICATION**
- [ ] Every UC-ID has at least one TC
- [ ] Every acceptance criterion `UC-XXX ACn` appears in at least one TC AC COVERAGE field
- [ ] Every BR-ID has at least one TC
- [ ] T-IDs are sequential (T-001, T-002, …)

**BEFORE GATE 11A (Test Cases Written)**
- [ ] All TCs written in `11-TEST-CASES.md`
- [ ] Zero unchecked coverage items
- [ ] All STEPS are unambiguous
- [ ] All EXPECTED RESULTs are observable
- [ ] `11-TEST-CASES.md` ends with blank line + `GATE 11A: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

## Stage 11: Test Execution (Second Half)

**DURING TEST EXECUTION**
- [ ] Execute each TC in sequence in a visible browser
- [ ] Capture evidence: screenshots for visual criteria, logs for system behavior
- [ ] Record PASS/FAIL for each TC in `11-TEST-REPORT.md`
- [ ] If TC fails: file a bug report in `11-BUG-REPORT.md`, route back to Stage 10
- [ ] If TC passes: document in `11-TEST-REPORT.md`

**BEFORE GATE 11B (Testing Complete)**
- [ ] All TCs executed and results documented in `11-TEST-REPORT.md`
- [ ] Evidence captured for every test
- [ ] Critical/blocking bugs fixed (routed to Stage 10 and re-tested)
- [ ] Release recommendation issued in `11-TEST-REPORT.md` (PASS or FAIL)
- [ ] `11-TEST-REPORT.md` ends with blank line + `GATE 11B: PASS` (if all TCs pass)

---

## Stage 12: Production Deployment

**BEFORE YOU START**
- [ ] Read `.github/skills/prod-ops/SKILL.md`
- [ ] Read `10-RELEASE-NOTES.md` and `11-TEST-REPORT.md`
- [ ] Verify Stage 11 gate is PASS (all tests passed)

**PREPARE FOR DEPLOYMENT**
- [ ] Verify build artifacts are present and runnable
- [ ] Check deploy environment: all secrets, keys, configs present
- [ ] Verify deployment script (`deploy.sh`) is executable and tested locally

**DEPLOY**
- [ ] Execute deployment steps (from `deploy.sh` or `.github/skills/prod-ops/SKILL.md`)
- [ ] After deployment: run smoke tests against live URL
- [ ] Verify critical paths work: user login, primary feature, error states

**AFTER DEPLOYMENT**
- [ ] Document deployment outcomes in `12-DEPLOYMENT-RESULTS.md`
- [ ] Verify live app is responding and functional

**BEFORE GATE 12**
- [ ] Deployment completed without critical errors
- [ ] Smoke tests passed
- [ ] `12-DEPLOYMENT-RESULTS.md` ends with blank line + `GATE 12: PASS`
- [ ] STATUS field = PASS, STATUS UPDATED = today

---

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
