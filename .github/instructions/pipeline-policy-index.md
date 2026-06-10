# Pipeline Policy Index

Single-page map of core pipeline rules, canonical sources, and enforcement.

| Policy ID | Rule | Canonical Source | Enforced By |
|---|---|---|
| POLICY-001 | Stage order and ownership | `.github/instructions/pipeline.instructions.md` | Manual + `lint-pipeline-controls.sh` |
| POLICY-002 | Upstream input requirements | `.github/instructions/pipeline-stage-schema.tsv` | `stage-precheck.sh` |
| POLICY-003 | Required stage outputs | `.github/instructions/pipeline-stage-schema.tsv` | `verify-stage-outputs.sh` |
| POLICY-004 | Gate declaration format | `.github/instructions/gate-declaration.instructions.md` | Manual review + stage checks |
| POLICY-005 | Append-only journal discipline | `.github/instructions/journal-entry.instructions.md` | Manual review |
| POLICY-006 | Stage output shape | `.github/instructions/stage-output-contract.instructions.md` | Manual review + `stage-postcheck.sh` |
| POLICY-007 | Cross-artifact traceability | `.github/instructions/traceability-audit.instructions.md` | `verify-traceability.sh` |
| POLICY-008 | Pipeline-control internal consistency | `.github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh` | `lint-pipeline-controls.sh` |

## Glossary

- **Gate:** The stage result declaration line in the form `GATE N: PASS` or `GATE N: FAIL - reason`.
- **Owning stage:** The stage that owns an artifact and is responsible for correcting defects in it.
- **Reroute:** Returning work to the owning stage on failure and rerunning downstream stages in order.
- **Current status:** The latest authoritative PASS/FAIL state for a stage artifact.
- **Archived status:** Historical status entries retained for audit history and explicitly marked as archival.

## Operator Shortcut

For day-to-day checks, run:

`bash .github/skills/manager-pipeline-orchestration/automation/pipeline-health.sh <repo-root> [project-root]`
