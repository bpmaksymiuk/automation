---
description: "Declare gate result at end of stage."
---

# Gate Declaration (Simple Mode)

## Required Steps
1. Confirm required stage output files exist.
2. Print one gate line:
   - GATE N: PASS
   - GATE N: FAIL - reason
3. Update only that stage row in PIPELINE-STATUS.md.
4. Append COMPLETE entry to X-Journal.md.
5. Stop. Do not start the next stage in the same run.

## If FAIL
- State owning stage.
- State reason.
- List rerun order from owning stage to Stage 12.
