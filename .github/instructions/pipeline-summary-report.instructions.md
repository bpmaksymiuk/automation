---
description: "Read-only one-page pipeline status summary."
---

# Pipeline Summary (Simple Mode)

## Inputs
- PIPELINE-STATUS.md
- Last 3 entries in X-Journal.md
- On-disk artifact presence for stages 1-12

## Output Sections
1. Current position (highest stage with PASS plus required artifacts)
2. Stage table (declared status vs disk status)
3. Mismatches
4. Last activity (3 journal entries)
5. Next runnable stage

## Rule
Do not modify project files.
