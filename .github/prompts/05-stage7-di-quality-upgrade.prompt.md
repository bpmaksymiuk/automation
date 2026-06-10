# Upgrade Stage 7 DI Quality

Use this prompt to make Stage 7 output implementation-ready for weaker models.

---

Improve `7-DESIGN-INSTRUCTIONS.md` in <PROJECT_ROOT> so a Developer can implement without clarification.

Must enforce per-DI checks:
1. Inputs are explicit.
2. Outputs are explicit.
3. Failure behavior is explicit.
4. Integration points are explicit.
5. Verification target is explicit.

Must remove:
- `TBD`, placeholders, and vague delegation wording.

Required command flow:
1. `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --json <PROJECT_ROOT> 7`
2. If runner returns quality-check hint, execute it.
3. `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <PROJECT_ROOT> 7 7-DESIGN-INSTRUCTIONS.md`
4. `bash .github/skills/manager-pipeline-orchestration/automation/stage-strict-check.sh <PROJECT_ROOT> 7 7-DESIGN-INSTRUCTIONS.md`

Final response format:
- DI-level improvements made.
- Remaining ambiguities (if any).
- Validation results.
