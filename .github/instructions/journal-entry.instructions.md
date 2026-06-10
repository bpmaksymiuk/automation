---
description: "Append-only journal entry format."
---

# Journal Entry (Simple Mode)

## Rule
Never edit old entries. Only append.

## START Template
## JN-NNN : <Agent> - Stage <N> - START - <YYYY-MM-DD>
- AGENT: <name>
- STAGE: <N>
- EVENT: Start
- DATE: <YYYY-MM-DD>
- ARTIFACTS READ: <list>
- ARTIFACTS WRITTEN: -
- SUMMARY: <one line>
- ISSUES: None or <issue>
- HANDOFF NOTES: N/A - stage starting

---

## COMPLETE Template
## JN-NNN : <Agent> - Stage <N> - COMPLETE - <YYYY-MM-DD>
- AGENT: <name>
- STAGE: <N>
- EVENT: Complete
- DATE: <YYYY-MM-DD>
- GATE RESULT: PASS or FAIL - reason
- ARTIFACTS READ: <list>
- ARTIFACTS WRITTEN: <list>
- SUMMARY: <one line>
- ISSUES: None or <issue>
- HANDOFF NOTES: <next-step notes>

---
