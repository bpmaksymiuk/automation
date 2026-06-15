---
description: "Declare gate result at end of stage."
---

# Gate Declaration (Simple Mode)

## Required Steps
1. Confirm required stage output files exist.
2. Write the gate line as the **final non-blank line** of the primary artifact — after all sections, after the last `---` separator if present:
   - GATE N: PASS
   - GATE N: FAIL - reason
3. Update only that stage row in PIPELINE-STATUS.md.
4. Append COMPLETE entry to X-Journal.md using the JN-ID determined at stage kickoff (incremented from START entry).
5. Stop. Do not start the next stage in the same run.

## Gate Line Position Rule

The gate line must be at the bottom. This is machine-checked.
Putting the gate line near the STATUS block at the top is a postcheck violation.

Correct (end of file):
```
...last section content...

GATE 5: PASS
```

Wrong (top of file, near STATUS):
```
- **STATUS:** PASS
GATE 5: PASS          ← VIOLATION
```

## If FAIL
- State owning stage.
- State reason.
- List rerun order from owning stage to Stage 12.
