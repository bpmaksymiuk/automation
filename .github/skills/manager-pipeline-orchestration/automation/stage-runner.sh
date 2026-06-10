#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-runner.sh [--json] [--no-hydrate] <project-root> <stage>

Runs stage precheck and prints a deterministic execution checklist.
EOF
}

json_mode=0
hydrate_mode=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      json_mode=1
      shift
      ;;
    --no-hydrate)
      hydrate_mode=0
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      break
      ;;
  esac
done

if [[ $# -ne 2 ]]; then
  usage >&2
  exit 2
fi

json_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

emit_fail() {
  local error_code="$1"
  local next_action="$2"

  if [[ "$json_mode" -eq 1 ]]; then
    printf '{"runner_result":"FAIL","error_code":"%s","requested_stage":"%s","next_action":"%s"}\n' \
      "$(json_escape "$error_code")" \
      "$(json_escape "${stage:-unknown}")" \
      "$(json_escape "$next_action")"
  else
    echo "RUNNER_RESULT: FAIL"
    echo "ERROR_CODE: $error_code"
    echo "REQUESTED_STAGE: ${stage:-unknown}"
    echo "NEXT_ACTION: $next_action"
  fi
}

project_root="$1"
stage="$2"

if [[ ! -d "$project_root" ]]; then
  emit_fail "RUNNER_PROJECT_NOT_FOUND" "Provide a valid project root and rerun."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  emit_fail "RUNNER_INVALID_STAGE" "Use a stage number from 1 to 12."
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

schema_file="$repo_root/.github/instructions/pipeline-stage-schema.tsv"
precheck_script="$script_dir/stage-precheck.sh"
contract_file="$repo_root/.github/instructions/stage-output-contract.instructions.md"
actions_file="$repo_root/.github/instructions/stage-allowed-actions.instructions.md"
postcheck_script="$script_dir/stage-postcheck.sh"

if [[ ! -f "$schema_file" ]]; then
  emit_fail "RUNNER_SCHEMA_NOT_FOUND" "Ensure pipeline-stage-schema.tsv exists."
  exit 1
fi

if [[ ! -x "$precheck_script" ]]; then
  emit_fail "RUNNER_PRECHECK_NOT_EXECUTABLE" "Make stage-precheck.sh executable and retry."
  exit 1
fi

if [[ ! -x "$postcheck_script" ]]; then
  emit_fail "RUNNER_POSTCHECK_NOT_EXECUTABLE" "Make stage-postcheck.sh executable and retry."
  exit 1
fi

if [[ "$json_mode" -eq 1 ]]; then
  if ! bash "$precheck_script" "$project_root" "$stage" >/dev/null; then
    emit_fail "RUNNER_PRECHECK_FAILED" "Resolve missing upstream inputs using stage-precheck, then rerun stage-runner."
    exit 1
  fi
else
  bash "$precheck_script" "$project_root" "$stage"
fi

stage_row="$(awk -F'|' -v target_stage="$stage" '$1 == target_stage { print $0 }' "$schema_file")"

if [[ -z "$stage_row" ]]; then
  emit_fail "RUNNER_STAGE_NOT_IN_SCHEMA" "Add stage row to pipeline-stage-schema.tsv."
  exit 1
fi

owner="$(echo "$stage_row" | awk -F'|' '{ print $2 }')"
artifacts="$(echo "$stage_row" | awk -F'|' '{ print $3 }')"
skill="$(echo "$stage_row" | awk -F'|' '{ print $4 }')"
inputs="$(echo "$stage_row" | awk -F'|' '{ print $5 }')"

primary_artifact_raw="$(echo "$artifacts" | awk -F',' '{ print $1 }' | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
primary_artifact="$(echo "$primary_artifact_raw" | sed -E 's/^`|`$//g')"

template_hint="none"
quality_check_template="none"
quality_check_next_command="none"
if [[ "$stage" == "5" ]]; then
  template_hint="$repo_root/.github/templates/stage-output/5-REQUIREMENTS.template.md"
elif [[ "$stage" == "6" ]]; then
  template_hint="$repo_root/.github/templates/stage-output/6-ARCHITECTURE-RECOMMENDATIONS.template.md"
elif [[ "$stage" == "7" ]]; then
  template_hint="$repo_root/.github/templates/stage-output/7-DESIGN-INSTRUCTIONS.template.md"
  quality_check_template="$repo_root/.github/templates/stage-output/7-DI-QUALITY-CHECKLIST.template.md"
  quality_check_next_command="cp $quality_check_template $project_root/7-DI-QUALITY-CHECKLIST.md"
elif [[ "$stage" == "11" ]]; then
  template_hint="$repo_root/.github/templates/stage-output/11-TEST-REPORT.template.md"
fi

hydrated_artifact="false"
if [[ "$hydrate_mode" -eq 1 ]] && [[ "$template_hint" != "none" ]] && [[ ! -f "$project_root/$primary_artifact" ]]; then
  if [[ ! -f "$template_hint" ]]; then
    emit_fail "RUNNER_TEMPLATE_NOT_FOUND" "Ensure the template file exists or run with --no-hydrate."
    exit 1
  fi

  cp "$template_hint" "$project_root/$primary_artifact"
  hydrated_artifact="true"
fi

one_next_command="bash $postcheck_script $project_root $stage $primary_artifact"
if [[ "$hydrate_mode" -eq 0 ]] && [[ "$template_hint" != "none" ]] && [[ ! -f "$project_root/$primary_artifact" ]]; then
  one_next_command="cp $template_hint $project_root/$primary_artifact"
fi

if [[ "$json_mode" -eq 1 ]]; then
  printf '{"runner_result":"PASS","requested_stage":"%s","project_root":"%s","owner":"%s","skill":"%s","required_inputs":"%s","write_scope":"%s","forbidden_scope":"%s","output_contract":"%s","actions_matrix":"%s","policy_references":"POLICY-002,POLICY-006","primary_artifact":"%s","template_hint":"%s","quality_check_template":"%s","quality_check_next_command":"%s","hydrated_artifact":"%s","one_next_command":"%s"}\n' \
    "$(json_escape "$stage")" \
    "$(json_escape "$project_root")" \
    "$(json_escape "$owner")" \
    "$(json_escape "$skill")" \
    "$(json_escape "${inputs:-none}")" \
    "$(json_escape "$artifacts, PIPELINE-STATUS.md, X-Journal.md")" \
    "$(json_escape "Other stages' owned artifacts")" \
    "$(json_escape "$contract_file")" \
    "$(json_escape "$actions_file")" \
    "$(json_escape "$primary_artifact")" \
    "$(json_escape "$template_hint")" \
    "$(json_escape "$quality_check_template")" \
    "$(json_escape "$quality_check_next_command")" \
    "$(json_escape "$hydrated_artifact")" \
    "$(json_escape "$one_next_command")"
else
  echo "RUNNER_RESULT: PASS"
  echo "REQUESTED_STAGE: $stage"
  echo "PROJECT_ROOT: $project_root"
  echo "OWNER: $owner"
  echo "SKILL: $skill"
  echo "REQUIRED_INPUTS: ${inputs:-none}"
  echo "WRITE_SCOPE: $artifacts, PIPELINE-STATUS.md, X-Journal.md"
  echo "FORBIDDEN_SCOPE: Other stages' owned artifacts"
  echo "OUTPUT_CONTRACT: $contract_file"
  echo "ACTIONS_MATRIX: $actions_file"
  echo "POLICY_REFERENCES: POLICY-002,POLICY-006"
  echo "PRIMARY_ARTIFACT: $primary_artifact"
  echo "TEMPLATE_HINT: $template_hint"
  echo "QUALITY_CHECK_TEMPLATE: $quality_check_template"
  echo "QUALITY_CHECK_NEXT_COMMAND: $quality_check_next_command"
  echo "HYDRATED_ARTIFACT: $hydrated_artifact"
  echo "ONE_NEXT_COMMAND: $one_next_command"
fi
