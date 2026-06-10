# Manager Automation

This folder contains automation used by Manager-stage orchestration.

## Files

- `stage-status-template.md` - Copy into `PROJECTS/<APP>/PIPELINE-STATUS.md` for stage status tracking.
- `lint-pipeline-controls.sh` - Validate that pipeline instructions, agent/skill boundary rules, stage templates, and generic prod-ops controls stay in sync.
- `generate-pipeline-doc-sections.sh` - Regenerate duplicated stage and status tables from `.github/instructions/pipeline-stage-schema.tsv`.
- `pipeline-health.sh` - One-command check that runs generation, lint, and optional traceability.
- `install-pre-commit-hook.sh` - Optional helper that installs a git pre-commit hook for `pipeline-health.sh`.
- `stage-precheck.sh` - Fail-fast check for required upstream inputs before stage work starts.
- `stage-runner.sh` - Runs precheck and prints a deterministic stage execution checklist.
- `stage-postcheck.sh` - Validates output contract shape for a stage artifact.
- `stage-write-scope-check.sh` - Validates changed paths against stage write boundaries.
- `stage-guard.sh` - One-command wrapper that runs runner JSON and write-scope JSON checks.
- `stage-strict-check.sh` - Strict heading-profile validation for template-backed artifacts.
- `stage-packet-create.sh` - Creates a deterministic `.stage-packet.json` for stage execution.
- `stage-one-command.sh` - Creates a packet and runs `stage-guard --packet` in one step.
- `install-strict-aliases.sh` - Installs short deterministic aliases (`stagepkt`, `stageguardpkt`, `stage1cmd`) in `~/.bashrc`.

## Rule

Keep skill automation inside `.github/skills/<skill-name>/automation/`.

Run `bash .github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh <repo-root>` after any `.github/` pipeline-control edit and before closing the Manager action.

Run `bash .github/skills/manager-pipeline-orchestration/automation/generate-pipeline-doc-sections.sh <repo-root>` when stage ownership, required inputs, or required outputs change.

Run `bash .github/skills/manager-pipeline-orchestration/automation/pipeline-health.sh <repo-root> [project-root]` for a standard all-in-one health check.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh <project-root> <stage>` before writing stage outputs.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh <project-root> <stage>` to get a low-ambiguity checklist for that stage.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --json <project-root> <stage>` for machine-readable output.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-runner.sh --no-hydrate <project-root> <stage>` to disable auto-template hydration.
For Stage 7, `stage-runner` also emits `QUALITY_CHECK_TEMPLATE` and `QUALITY_CHECK_NEXT_COMMAND` to drive deterministic DI quality preflight.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh <project-root> <stage> <artifact-path>` after writing a stage artifact.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh --json <project-root> <stage> <artifact-path>` for machine-readable output.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-write-scope-check.sh <project-root> <stage> <changed-path> [changed-path...]` before commit to enforce write boundaries.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-write-scope-check.sh --json <project-root> <stage> <changed-path> [changed-path...]` for machine-readable output.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh <project-root> <stage> <changed-path> [changed-path...]` to run runner and write-scope checks in one command.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --postcheck <artifact-path> <project-root> <stage> <changed-path> [changed-path...]` to include postcheck output-contract validation in the same command.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --strict --postcheck <artifact-path> <project-root> <stage> <changed-path> [changed-path...]` to enforce strict heading profiles and fail on unknown sections.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-packet-create.sh <project-root> <stage> <artifact-path> <changed-path> [changed-path...]` to generate a stage packet.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-guard.sh --packet <project-root>/.stage-packet.json` to execute from packet without additional stage arguments.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-one-command.sh <project-root> <stage> <artifact-path> <changed-path> [changed-path...]` for a single deterministic command that creates and executes a stage packet.
Run `bash .github/skills/manager-pipeline-orchestration/automation/install-strict-aliases.sh <repo-root>` to install `stagepkt`, `stageguardpkt`, and `stage1cmd` aliases for this repo.

Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-strict-check.sh <project-root> <stage> <artifact-path>` for standalone strict checking.
Run `bash .github/skills/manager-pipeline-orchestration/automation/stage-strict-check.sh --json <project-root> <stage> <artifact-path>` for machine-readable output.

Stage packet template is available at `.github/templates/stage-output/stage-packet.template.json`.

Stage 7 DI quick-check template is available at `.github/templates/stage-output/7-DI-QUALITY-CHECKLIST.template.md`.

Stage output shape is defined by `.github/instructions/stage-output-contract.instructions.md`.

Policy map is in `.github/instructions/pipeline-policy-index.md`.

Allowed stage read/write boundaries are in `.github/instructions/stage-allowed-actions.instructions.md`.

Stage output templates are in `.github/templates/stage-output/`.

Optionally install a local pre-commit hook:

`bash .github/skills/manager-pipeline-orchestration/automation/install-pre-commit-hook.sh <repo-root>`
