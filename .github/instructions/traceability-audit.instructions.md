---
description: "Check traceability across pipeline artifacts."
---

# Traceability Audit (Simple Mode)

## Required Chain
2-USE-CASES.md -> 5-REQUIREMENTS.md -> 7-DESIGN-INSTRUCTIONS.md -> 10-RELEASE-NOTES.md -> 11-TEST-CASES.md + 11-TEST-REPORT.md

## PASS Rule
Every UC ID must be present in each downstream artifact in the chain.

## Gap Routing
- Missing from Stage 5 artifact: route to Stage 5.
- Missing from Stage 7 artifact: route to Stage 7.
- Missing from Stage 10 artifact: route to Stage 10.
- Missing from Stage 11 artifact: route to Stage 11.

## Timing
Run before Stage 12 and after major changes in Stages 5, 7, 10, or 11.

## Output
Report each check as PASS or FAIL with file names.
