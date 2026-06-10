# Test Report Writing — SKILL.md

> Stage 11 (second half) — execute test cases, record evidence, issue release recommendation.

---

## When to Use

Invoke at Stage 11 (Tester) after test execution. Use it when executing formal verification specs and recording the outcome of each test case with evidence-backed results in `11-TEST-REPORT.md`. Every TC must have a corresponding TR; every covered acceptance criterion must be exercised through execution; every passing TR must cite screenshot evidence. Use the Playwright helper libraries under `.github/skills/test-report-writing/lib/` for execution and screenshot handling. Do not use headless execution — observable evidence is required.

---

## Target Files

- `11-TEST-REPORT.md`
- `./11-TESTS/playwright.config.mjs` (inside `./11-TESTS/`, NOT at the project root, NOT inside `./10-BUILD/`)
- `./11-TESTS/specs/**` (Playwright spec files)
- `./11-TESTS/package.json` (`@playwright/test` devDependency — installed via `npm install` inside `./11-TESTS/`)
- `.github/skills/test-report-writing/lib/**` (Playwright helper libraries)
- `.github/skills/test-report-writing/automation/verify-test-report-consistency.sh` (status/evidence consistency verifier)
- `./11-TESTS/results/full/**` (full-test evidence: screenshots, `.txt` records, JSON report, Playwright artefacts)
- `./11-TESTS/results/smoke/**` (smoke-test evidence: screenshots, JSON report, Playwright artefacts)

---

## Playwright Library Convention

- Skill-local helper libraries live under `.github/skills/test-report-writing/lib/`.
- Test execution and screenshot collection at Stage 11 must use these helpers.
- Helpers may be extended, but existing helper interfaces should remain backward compatible for prior specs.

### Spec file conventions

All Playwright test artefacts live under `./11-TESTS/` (project root). Nothing test-related goes inside `./10-BUILD/`.

```
PROJECTS/<APP>/
├── 11-TESTS/
│   ├── package.json          ← { devDependencies: { "@playwright/test": "^1.x" } }
│   ├── package-lock.json
│   ├── playwright.config.mjs ← config lives here
│   ├── specs/                ← spec files live here
│   │   └── *.spec.mjs
│   ├── results/
│   │   ├── full/             ← full-test evidence
│   │   │   ├── screenshots/  ← latest-run screenshots
│   │   │   ├── report.json   ← JSON report
│   │   │   ├── playwright-artifacts/ ← Playwright failure artefacts
│   │   │   └── archive/      ← previous-run screenshot dirs
│   │   └── smoke/            ← smoke-test evidence
│   │       ├── screenshots/  ← latest smoke screenshots
│   │       ├── report.json   ← smoke JSON report
│   │       └── playwright-artifacts/ ← smoke Playwright artefacts
└── 10-BUILD/                    ← app source only
```

Tests are run from `./11-TESTS/`:

```
cd PROJECTS/<APP>/10-TESTS
npx playwright test --config=playwright.config.mjs --headed
```

Or from the project root:
```
npm --prefix 10-TESTS test -- --headed
```

Within each spec file (at `11-TESTS/specs/`):
```js
// evidence-helper import — 4 levels up from 11-TESTS/specs/ to the MYTEAM workspace root
import { ensureResultsDir, writeEvidence } from '../../../../.github/skills/test-report-writing/lib/evidence-helper.mjs';

// evidence output dir — full tests write to results/full/, smoke tests to results/smoke/
// BAMCO_EVIDENCE_DIR is set by the config; default resolves to 11-TESTS/results/full/
const RESULTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), process.env.BAMCO_EVIDENCE_DIR ?? '../results/full');
```

`playwright.config.mjs` settings (inside `11-TESTS/`):
```js
testDir: './specs',
outputDir: './results/full/playwright-artifacts',
reporter: [['list'], ['json', { outputFile: './results/full/report.json' }]],
webServer: { command: 'npm --prefix ../9-BUILD run dev', url: 'http://localhost:5173', ... },
```

`@playwright/test` is installed in `./11-TESTS/node_modules/` — **not** at the project root and **not** inside `./10-BUILD/`.

---

## Report Structure

```markdown
# T-PIPELINE-<APP>-<NNN> — Test Report

- **Run ID:** T-PIPELINE-<APP>-<NNN>
- **Date:** YYYY-MM-DD
- **Product:** <product name>
- **Build Path:** ./10-BUILD/

## Results

| T-ID | Description | Result | Evidence |
|------|-------------|--------|----------|
| T-001 | Test case name | PASS / FAIL | Screenshot filename — REQUIRED for every row |

## Business Requirement Coverage

| BR-ID | Description | Result | T-IDs | Evidence |
|-------|-------------|--------|-------|----------|
| BR-001 | Requirement text | PASS / FAIL | T-XXX, T-YYY | Screenshot filename — REQUIRED for every row |

## Summary

- **Total:** N
- **Pass:** N
- **Fail:** N
- **BRs Verified:** N / N

## Recommendation

**PASS** / **FAIL** / **CONDITIONAL PASS**

> Justification: one paragraph explaining the recommendation based on the results above.

## Evidence

### T-XXX — [brief title]
[Screenshot or output snippet. Screenshot is MANDATORY for every test case, passing or failing.
For FAIL: also include exact error message or observed behaviour.]
```

---

## Constraints

Same as test-case-authoring for evidence discipline: do not use this skill to repair defects, do not suppress failures, and use a visible browser only.

Additional evidence rules:

- For realism, motion, texture, lighting, reflections, or layout criteria, corroborate the actual rendered scene in a visible browser. DOM text, accessibility snapshots, and source inspection are supplementary only.
- **Screenshot evidence is mandatory for every test case, passing or failing. It is not acceptable to record a result — PASS or FAIL — without an accompanying screenshot. A result row with no screenshot evidence is a gate violation.**
- If a test case's `AC COVERAGE` criteria were not all exercised, record the case as FAIL or NOT EXECUTED and route the gap.
- Every BR listed in `5-REQUIREMENTS.md` must appear in the Business Requirement Coverage table with at least one T-ID reference and one screenshot. A BR row that has no evidence screenshot is a gate violation.

## Context Budget (Low-Ambiguity Mode)

- Read only `11-TEST-CASES.md`, required Stage 11 evidence files, and directly referenced upstream inputs.
- Do not inspect unrelated stages when writing the report.
- Keep edits scoped to Stage 11-owned artifacts.

---

## Procedure

1. Read `11-TEST-CASES.md` in full, including every `AC COVERAGE` field.
2. Load Playwright helper libraries from `.github/skills/test-report-writing/lib/`.
3. Execute formal verification specs in a visible browser using Playwright.
4. Open the product in a **visible browser** when manual corroboration is needed. For visual or qualitative criteria, visible-browser corroboration is mandatory.
5. Execute each test case in T-ID order:
   a. Follow the STEPS exactly as written.
   b. Verify every `UC-XXX ACn` item named in that test case's `AC COVERAGE` field.
   c. Record the actual result (PASS or FAIL).
   d. Capture screenshots via Playwright helpers in `.github/skills/test-report-writing/lib/` and store them under `./11-TESTS/results/full/screenshots/` (never inside `./10-BUILD/`). Screenshots are mandatory for every test case, passing and failing alike — a result without a screenshot is not acceptable and must not be submitted.
   e. For visual or qualitative criteria, record what was actually seen on screen in addition to any DOM or assertion output.
   f. For FAIL: record the exact observed behaviour vs the expected result.
6. Populate the Results table and Summary counts.
7. Write the Recommendation with a clear justification:
   - **PASS:** All test cases passed.
   - **FAIL:** One or more critical test cases failed.
   - **CONDITIONAL PASS:** Minor failures noted; recommend fix before next release.
8. Attach evidence for every result. PASS entries require screenshots; FAIL entries require screenshots or error logs, and visual criteria require rendered-scene observations.
9. Assign a unique Run ID: `T-PIPELINE-<APP>-<NNN>` (increment NNN from prior runs).
10. Run `bash .github/skills/test-case-authoring/automation/verify-use-case-coverage.sh <project-root>` after writing the report so acceptance-criterion coverage and report linkage are checked against the executed results.
11. Run `bash .github/skills/test-report-writing/automation/verify-test-report-consistency.sh <project-root>` after writing the report so the report, UC-BR evidence, and current stage status cannot disagree.
12. If historical FAIL snapshots are retained in the report, they must be explicitly labeled as archived history and must not conflict with the current authoritative result section.
13. Append the report below any prior test reports — do not overwrite.
14. Validate against the exit gate.

---

## Exit Gate

- [ ] All test cases in `11-TEST-CASES.md` have been executed.
- [ ] Every T-ID appears in the Results table.
- [ ] Every `UC-XXX ACn` referenced in `AC COVERAGE` fields has executed evidence through its corresponding T-ID result.
- [ ] Every FAIL entry has concrete evidence (screenshot or error log excerpt).
- [ ] Every PASS entry has screenshot evidence.
- [ ] No result row (PASS or FAIL) is without a named screenshot file — screenshot evidence is mandatory for every test case without exception.
- [ ] The Business Requirement Coverage table is present and contains one row per BR-ID from `5-REQUIREMENTS.md`.
- [ ] Every BR row in the coverage table has at least one T-ID reference and at least one screenshot.
- [ ] Visual or qualitative criteria were corroborated in a visible browser, not only through DOM or accessibility state.
- [ ] Playwright execution and screenshot capture used helper libraries under `.github/skills/test-report-writing/lib/`.
- [ ] `bash .github/skills/test-case-authoring/automation/verify-use-case-coverage.sh <project-root>` passes after report authoring.
- [ ] `bash .github/skills/test-report-writing/automation/verify-test-report-consistency.sh <project-root>` passes after report authoring.
- [ ] A Recommendation (PASS / FAIL / CONDITIONAL PASS) has been issued with written justification.
- [ ] A unique Run ID has been assigned.
- [ ] No prior test report entries have been modified or deleted.
- [ ] `11-TEST-REPORT.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
