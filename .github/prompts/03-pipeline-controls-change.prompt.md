# Edit Pipeline Controls Safely

Use this prompt when changing `.github/instructions`, `.github/skills`, templates, or manager automation.

---

Make this pipeline-control change: <CHANGE_REQUEST>

Constraints:
1. Apply the smallest possible edit.
2. Preserve existing behavior unless the request explicitly changes behavior.
3. Update docs if command behavior changes.

Required validation:
- `bash .github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh .`

Final response format:
- What changed (short bullets).
- Why this is safe (short bullets).
- Validation command and result.
- Follow-up needed: `None` or one bullet.
