#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-write-scope-check.sh [--json] <project-root> <stage> <changed-path> [changed-path...]

Validates that changed paths are within stage-owned write scope:
- stage artifacts from pipeline-stage-schema.tsv
- PIPELINE-STATUS.md
- X-Journal.md
EOF
}

json_mode=0
if [[ "${1:-}" == "--json" ]]; then
  json_mode=1
  shift
fi

if [[ $# -lt 3 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
stage="$2"
shift 2
changed_paths=("$@")

json_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

emit_fail() {
  local error_code="$1"
  local next_action="$2"

  if [[ "$json_mode" -eq 1 ]]; then
    printf '{"result":"FAIL","error_code":"%s","requested_stage":"%s","next_action":"%s"}\n' \
      "$(json_escape "$error_code")" \
      "$(json_escape "${stage:-unknown}")" \
      "$(json_escape "$next_action")"
  else
    echo "RESULT: FAIL"
    echo "ERROR_CODE: $error_code"
    echo "REQUESTED_STAGE: ${stage:-unknown}"
    echo "NEXT_ACTION: $next_action"
  fi
}

if [[ ! -d "$project_root" ]]; then
  emit_fail "SCOPE_PROJECT_NOT_FOUND" "Provide a valid project root and rerun scope check."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  emit_fail "SCOPE_INVALID_STAGE" "Use a stage number from 1 to 12."
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"
schema_file="$repo_root/.github/instructions/pipeline-stage-schema.tsv"

if [[ ! -f "$schema_file" ]]; then
  emit_fail "SCOPE_SCHEMA_NOT_FOUND" "Ensure pipeline-stage-schema.tsv exists and rerun scope check."
  exit 1
fi

artifacts_raw="$(awk -F'|' -v target_stage="$stage" '$1 == target_stage { print $3 }' "$schema_file")"
if [[ -z "$artifacts_raw" ]]; then
  emit_fail "SCOPE_STAGE_NOT_IN_SCHEMA" "Add the requested stage row to pipeline-stage-schema.tsv."
  exit 1
fi

declare -a allowed_entries=("PIPELINE-STATUS.md" "X-Journal.md")
IFS=',' read -r -a artifact_parts <<< "$artifacts_raw"
for part in "${artifact_parts[@]}"; do
  cleaned="$(echo "$part" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g; s/^`|`$//g')"
  if [[ -n "$cleaned" ]]; then
    allowed_entries+=("$cleaned")
  fi
done

is_allowed_path() {
  local path="$1"
  local allowed

  for allowed in "${allowed_entries[@]}"; do
    if [[ "$allowed" == */ ]]; then
      local prefix="${allowed%/}"
      if [[ "$path" == "$prefix" ]] || [[ "$path" == "$prefix/"* ]]; then
        return 0
      fi
    else
      if [[ "$path" == "$allowed" ]]; then
        return 0
      fi
    fi
  done

  return 1
}

declare -a violations=()

for path in "${changed_paths[@]}"; do
  normalized="$(echo "$path" | sed -E 's#^\./##; s#^/+##')"
  if ! is_allowed_path "$normalized"; then
    violations+=("$normalized")
  fi
done

if [[ ${#violations[@]} -gt 0 ]]; then
  if [[ "$json_mode" -eq 1 ]]; then
    joined_violations="$(printf '%s;' "${violations[@]}")"
    printf '{"result":"FAIL","error_code":"SCOPE_VIOLATION","requested_stage":"%s","violations":"%s","next_action":"%s"}\n' \
      "$(json_escape "$stage")" \
      "$(json_escape "$joined_violations")" \
      "$(json_escape "Limit writes to stage-owned artifacts and rerun scope check.")"
  else
    echo "RESULT: FAIL"
    echo "ERROR_CODE: SCOPE_VIOLATION"
    echo "REQUESTED_STAGE: $stage"
    echo "VIOLATIONS:"
    for violation in "${violations[@]}"; do
      echo "- $violation"
    done
    echo "NEXT_ACTION: Limit writes to stage-owned artifacts and rerun scope check."
  fi
  exit 1
fi

if [[ "$json_mode" -eq 1 ]]; then
  printf '{"result":"PASS","requested_stage":"%s","checked_count":"%s","next_action":"%s"}\n' \
    "$(json_escape "$stage")" \
    "$(json_escape "${#changed_paths[@]}")" \
    "$(json_escape "Proceed with stage output updates.")"
else
  echo "RESULT: PASS"
  echo "REQUESTED_STAGE: $stage"
  echo "CHECKED_COUNT: ${#changed_paths[@]}"
  echo "NEXT_ACTION: Proceed with stage output updates."
fi
