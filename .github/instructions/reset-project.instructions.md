---
description: "Reset a project back to a selected stage."
---

# Reset Project (Simple Mode)

## Input
- Project path
- Target stage N

## Action
1. Keep files up to stage N.
2. Remove stage-owned outputs above stage N.
3. Keep 0-IDEA.md.
4. Keep append-only history files unless user explicitly asks otherwise.
5. Update PIPELINE-STATUS.md so stages above N are Not Started.

## Safety Rule
Never delete without explicit target stage confirmation.
