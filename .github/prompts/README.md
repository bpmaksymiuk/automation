# Prompt Pack For Common Pipeline Tasks

This folder contains copy-paste prompts designed to work well with weaker models.

Design rules used in every prompt:
- Single objective.
- Explicit inputs and outputs.
- Ordered steps.
- Required validation commands.
- Required final response format.

## Included Prompts

- `01-do-it-all-stage-execution.prompt.md` — Execute one stage end-to-end with validation
- `02-harden-for-dumb-models.prompt.md` — Add deterministic guardrails to reduce ambiguity
- `03-pipeline-controls-change.prompt.md` — Safely edit `.github/` pipeline controls
- `04-objective-model-selection.prompt.md` — Score and select the cheapest sufficient model
- `05-stage7-di-quality-upgrade.prompt.md` — Make DI records implementation-ready
- `06-read-only-stage-audit.prompt.md` — Status check without editing files
- `07-run-auditor-after-stage.prompt.md` — Run Auditor compliance check after any stage
- `08-resume-pipeline.prompt.md` — Pick up from the current stage and continue
- `09-full-traceability-audit.prompt.md` — Verify UC-ID coverage across all downstream artifacts
