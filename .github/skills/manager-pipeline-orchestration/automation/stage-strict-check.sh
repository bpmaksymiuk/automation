#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-strict-check.sh [--json] <project-root> <stage> <artifact-path>

Validates strict section headings for template-backed stage artifacts.
Fails if the artifact contains unknown H2 headings (## ...).
EOF
}

json_mode=0
if [[ "${1:-}" == "--json" ]]; then
  json_mode=1
  shift
fi

if [[ $# -ne 3 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
stage="$2"
artifact_path="$3"

json_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

emit_fail() {
  local error_code="$1"
  local next_action="$2"
  local details="${3:-}"

  if [[ "$json_mode" -eq 1 ]]; then
    printf '{"result":"FAIL","error_code":"%s","requested_stage":"%s","artifact":"%s","details":"%s","next_action":"%s"}\n' \
      "$(json_escape "$error_code")" \
      "$(json_escape "${stage:-unknown}")" \
      "$(json_escape "${artifact_path:-unknown}")" \
      "$(json_escape "$details")" \
      "$(json_escape "$next_action")"
  else
    echo "RESULT: FAIL"
    echo "ERROR_CODE: $error_code"
    echo "REQUESTED_STAGE: ${stage:-unknown}"
    echo "ARTIFACT: ${artifact_path:-unknown}"
    if [[ -n "$details" ]]; then
      echo "DETAILS: $details"
    fi
    echo "NEXT_ACTION: $next_action"
  fi
}

if [[ ! -d "$project_root" ]]; then
  emit_fail "STRICT_PROJECT_NOT_FOUND" "Provide a valid project root and rerun strict check."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  emit_fail "STRICT_INVALID_STAGE" "Use a stage number from 1 to 12."
  exit 1
fi

artifact_full="$project_root/$artifact_path"
if [[ ! -f "$artifact_full" ]]; then
  emit_fail "STRICT_ARTIFACT_NOT_FOUND" "Create the artifact first, then rerun strict check."
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
template=""
allowed_headings=""
allowed_heading_regex=""

case "$stage:$artifact_path" in
  "5:5-REQUIREMENTS.md")
    template="$repo_root/.github/templates/stage-output/5-REQUIREMENTS.template.md"
    allowed_headings=$'Functional Requirements\nNon-Functional Baseline\nTraceability'
    allowed_heading_regex='^BR-[0-9]{3}$'
    ;;
  "6:6-ARCHITECTURE-RECOMMENDATIONS.md")
    template="$repo_root/.github/templates/stage-output/6-ARCHITECTURE-RECOMMENDATIONS.template.md"
    allowed_headings=$'OVERALL ARCHITECTURE SUMMARY\nArchitecture Records\nRisks And Mitigations'
    allowed_heading_regex='^AR-[0-9]{3}$'
    ;;
  "7:7-DESIGN-INSTRUCTIONS.md")
    template="$repo_root/.github/templates/stage-output/7-DESIGN-INSTRUCTIONS.template.md"
    allowed_headings=$'Implementation Plan\nInterface Contracts\nValidation Notes'
    allowed_heading_regex='^DI-[0-9]{3}$'
    ;;
  "11:11-TEST-REPORT.md")
    template="$repo_root/.github/templates/stage-output/11-TEST-REPORT.template.md"
    allowed_headings=$'Results\nCoverage Summary\nRecommendation'
    allowed_heading_regex='^(TC|TEST)-[0-9]{3}$'
    ;;
  *)
    # No strict heading map for this artifact; treat as pass to avoid false positives.
    if [[ "$json_mode" -eq 1 ]]; then
      printf '{"result":"PASS","requested_stage":"%s","artifact":"%s","strict_mode":"skipped","next_action":"%s"}\n' \
        "$(json_escape "$stage")" \
        "$(json_escape "$artifact_path")" \
        "$(json_escape "No strict heading profile for this artifact; continue with standard checks.")"
    else
      echo "RESULT: PASS"
      echo "REQUESTED_STAGE: $stage"
      echo "ARTIFACT: $artifact_path"
      echo "STRICT_MODE: skipped"
      echo "NEXT_ACTION: No strict heading profile for this artifact; continue with standard checks."
    fi
    exit 0
    ;;
esac

if [[ ! -f "$template" ]]; then
  emit_fail "STRICT_TEMPLATE_NOT_FOUND" "Restore template file and rerun strict check." "Missing template: $template"
  exit 1
fi

declare -a unknown=()
while IFS= read -r line; do
  [[ "$line" =~ ^##[[:space:]]+ ]] || continue
  heading="${line#\#\# }"
  if [[ -n "$allowed_heading_regex" ]] && [[ "$heading" =~ $allowed_heading_regex ]]; then
    continue
  fi
  if ! printf '%s\n' "$allowed_headings" | grep -Fxq "$heading"; then
    unknown+=("$heading")
  fi
done < "$artifact_full"

if [[ ${#unknown[@]} -gt 0 ]]; then
  joined="$(printf '%s;' "${unknown[@]}")"
  emit_fail \
    "STRICT_UNKNOWN_HEADING" \
    "Remove unknown headings or rehydrate from template: cp $template $artifact_full" \
    "$joined"
  exit 1
fi

if [[ "$json_mode" -eq 1 ]]; then
  printf '{"result":"PASS","requested_stage":"%s","artifact":"%s","strict_mode":"enforced","next_action":"%s"}\n' \
    "$(json_escape "$stage")" \
    "$(json_escape "$artifact_path")" \
    "$(json_escape "Proceed with stage output updates.")"
else
  echo "RESULT: PASS"
  echo "REQUESTED_STAGE: $stage"
  echo "ARTIFACT: $artifact_path"
  echo "STRICT_MODE: enforced"
  echo "NEXT_ACTION: Proceed with stage output updates."
fi
