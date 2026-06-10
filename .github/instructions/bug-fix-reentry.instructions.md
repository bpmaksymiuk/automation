---
description: "Use when Stage 11 sends a bug to Stage 10, then Stage 11 re-tests."
---

# Bug-Fix Re-Entry (Simple Mode)

## Flow
1. Stage 11 finds a bug.
2. Stage 11 routes the bug to Stage 10.
3. Stage 10 fixes the bug.
4. Stage 11 re-tests the same bug.
5. If fail, route again to Stage 10.
6. If pass, continue.
7. After all routed bugs pass, run full Stage 11 again.

## Required Bug Fields
- Bug ID
- Severity
- UC/BR reference
- Steps to reproduce
- Observed result
- Expected result
- Evidence
- Re-test method

## Stage 10 Rules
- Fix one bug at a time.
- Add each bug fix to 10-RELEASE-NOTES.md.
- If requirement is unclear, stop and escalate to Stage 7.

## Stage 11 Rules
- Re-test routed bug first.
- Record PASS/FAIL in 11-TEST-REPORT.md.
- No GATE 11 PASS until all blocking/critical routed bugs pass.
