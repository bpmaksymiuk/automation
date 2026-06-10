#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  cat <<'EOF'
Usage: verify-stage-outputs.sh <project-root> <stage>

Examples:
  verify-stage-outputs.sh PROJECTS/fishtank 1
  verify-stage-outputs.sh /abs/path/to/PROJECTS/fishtank 10
EOF
}

if [[ $# -ne 2 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
stage="$2"

if [[ ! -d "$project_root" ]]; then
  echo "FAIL: project root does not exist: $project_root" >&2
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"

declare -a required_paths=()

case "$stage" in
  1)
    required_paths=("1-BRAINSTORM.md")
    ;;
  2)
    required_paths=("2-USE-CASES.md")
    ;;
  3)
    required_paths=("3-NARRATIVE-VISION.md")
    ;;
  4)
    required_paths=("4-CONCEPT-STORYBOARD.md" "4-CONCEPT" "4-CONCEPT/screen-flow-diagram.svg")
    ;;
  5)
    required_paths=("5-REQUIREMENTS.md")
    ;;
  6)
    required_paths=("6-ARCHITECTURE-RECOMMENDATIONS.md" "6-PARTS LIST.md")
    ;;
  7)
    required_paths=("7-DESIGN-INSTRUCTIONS.md")
    ;;
  8)
    required_paths=("8-TEXT-CONTENT.md" "8-TEXT")
    ;;
  9)
    required_paths=("9-GRAPHIC-ASSETS.md" "9-GRAPHIC-ASSETS" "9-DIAGRAMS" "9-DIAGRAMS/data-flow-diagram.svg")
    ;;
  10)
    required_paths=("10-BUILD" "10-RELEASE-NOTES.md")
    ;;
  11)
    required_paths=("11-TEST-CASES.md" "11-TEST-REPORT.md" "11-BUG-REPORT.md" "11-TESTS/specs")
    ;;
  12)
    required_paths=("12-DEPLOYMENT-RESULTS.md" "deploy.sh" ".env.deploy" "deploy" "deploy/nginx.conf" "11-TESTS/playwright.smoke.config.mjs")
    ;;
  *)
    echo "FAIL: unsupported stage '$stage'. Expected one of: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12" >&2
    exit 2
    ;;
esac

declare -a missing_paths=()

check_path() {
  local relative_path="$1"
  local absolute_path="$project_root/$relative_path"

  if [[ ! -e "$absolute_path" ]]; then
    missing_paths+=("$relative_path")
    return
  fi

  if [[ -d "$absolute_path" ]]; then
    if [[ -z "$(find "$absolute_path" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]]; then
      missing_paths+=("$relative_path (directory exists but is empty)")
    fi
  fi
}

check_path "PIPELINE-STATUS.md"
check_path "X-Journal.md"

for path in "${required_paths[@]}"; do
  check_path "$path"
done

if [[ "$stage" == "9" && -d "$project_root/9-DIAGRAMS" ]]; then
  sequence_diagram_count="$(find "$project_root/9-DIAGRAMS" -maxdepth 1 -type f -name 'sequence-*.svg' | wc -l | tr -d '[:space:]')"
  if [[ "$sequence_diagram_count" -lt 2 ]]; then
    missing_paths+=("9-DIAGRAMS (expected at least two sequence-*.svg files)")
  fi
fi

if [[ "$stage" == "11" ]]; then
  test_case_verifier="$script_dir/../../test-case-authoring/automation/verify-test-case-authoring.sh"
  coverage_verifier="$script_dir/../../test-case-authoring/automation/verify-use-case-coverage.sh"
  report_consistency_verifier="$script_dir/../../test-report-writing/automation/verify-test-report-consistency.sh"
  if [[ ! -x "$test_case_verifier" ]]; then
    missing_paths+=(".github/skills/test-case-authoring/automation/verify-test-case-authoring.sh (missing or not executable)")
  fi
  if [[ ! -x "$coverage_verifier" ]]; then
    missing_paths+=(".github/skills/test-case-authoring/automation/verify-use-case-coverage.sh (missing or not executable)")
  fi
  if [[ ! -f "$report_consistency_verifier" ]]; then
    missing_paths+=(".github/skills/test-report-writing/automation/verify-test-report-consistency.sh (missing)")
  fi
fi

if [[ -f "$project_root/PIPELINE-STATUS.md" ]]; then
  if ! grep -Eq "^\|[[:space:]]*$stage[[:space:]]*\|" "$project_root/PIPELINE-STATUS.md"; then
    missing_paths+=("PIPELINE-STATUS.md (missing stage row for '$stage')")
  fi
fi

if [[ ${#missing_paths[@]} -gt 0 ]]; then
  echo "FAIL: missing required outputs for stage $stage in $project_root" >&2
  for missing in "${missing_paths[@]}"; do
    echo "- $missing" >&2
  done
  exit 1
fi

if [[ "$stage" == "11" ]]; then
  "$test_case_verifier" "$project_root"
  "$coverage_verifier" "$project_root"
  bash "$report_consistency_verifier" "$project_root"
fi

echo "PASS: stage $stage required outputs exist in $project_root"
for path in "PIPELINE-STATUS.md" "X-Journal.md" "${required_paths[@]}"; do
  echo "- $path"
done