#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: pipeline-health.sh <repo-root> [project-root]

Runs core pipeline control checks in one command:
1) Regenerate schema-driven docs
2) Lint pipeline controls
3) Optionally verify project traceability (if project-root is provided)

Examples:
  pipeline-health.sh .
  pipeline-health.sh . PROJECTS/Paint
EOF
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage >&2
  exit 2
fi

repo_root="$1"
project_root="${2:-}"

if [[ ! -d "$repo_root" ]]; then
  echo "RESULT: FAIL" >&2
  echo "ERROR_CODE: HEALTH_REPO_NOT_FOUND" >&2
  echo "NEXT_ACTION: Provide a valid repo root and rerun pipeline health." >&2
  exit 1
fi

repo_root="$(cd "$repo_root" && pwd)"

generator="$repo_root/.github/skills/manager-pipeline-orchestration/automation/generate-pipeline-doc-sections.sh"
linter="$repo_root/.github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh"
traceability="$repo_root/.github/skills/manager-pipeline-orchestration/automation/verify-traceability.sh"

for required in "$generator" "$linter" "$traceability"; do
  if [[ ! -x "$required" ]]; then
    echo "RESULT: FAIL" >&2
    echo "ERROR_CODE: HEALTH_REQUIRED_SCRIPT_NOT_EXECUTABLE" >&2
    echo "MISSING_SCRIPT: $required" >&2
    echo "NEXT_ACTION: Ensure required scripts are executable, then rerun pipeline health." >&2
    exit 1
  fi
done

echo "STEP 1/3: Regenerating schema-driven instruction sections"
bash "$generator" "$repo_root"

echo "STEP 2/3: Linting pipeline controls"
bash "$linter" "$repo_root"

if [[ -n "$project_root" ]]; then
  if [[ ! -d "$project_root" ]]; then
    echo "RESULT: FAIL" >&2
    echo "ERROR_CODE: HEALTH_PROJECT_NOT_FOUND" >&2
    echo "NEXT_ACTION: Provide a valid project root and rerun pipeline health." >&2
    exit 1
  fi

  echo "STEP 3/3: Verifying project traceability"
  bash "$traceability" "$project_root"
else
  echo "STEP 3/3: Skipped traceability (no project-root provided)"
fi

echo "PASS: pipeline health checks completed"
