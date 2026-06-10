#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-precheck.sh <project-root> <stage>

Validates required upstream inputs for the requested stage using
.github/instructions/pipeline-stage-schema.tsv.
EOF
}

if [[ $# -ne 2 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
stage="$2"

if [[ ! -d "$project_root" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PRECHECK_PROJECT_NOT_FOUND"
  echo "REQUESTED_STAGE: $stage"
  echo "NEXT_ACTION: Provide a valid project root and rerun precheck."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PRECHECK_INVALID_STAGE"
  echo "REQUESTED_STAGE: $stage"
  echo "NEXT_ACTION: Use a stage number from 1 to 12."
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"
schema_file="$repo_root/.github/instructions/pipeline-stage-schema.tsv"

if [[ ! -f "$schema_file" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PRECHECK_SCHEMA_NOT_FOUND"
  echo "REQUESTED_STAGE: $stage"
  echo "NEXT_ACTION: Ensure pipeline-stage-schema.tsv exists, then rerun precheck."
  exit 1
fi

kickoff_inputs="$(awk -F'|' -v target_stage="$stage" '$1 == target_stage { print $5 }' "$schema_file")"

if [[ -z "$kickoff_inputs" ]]; then
  echo "RESULT: PASS"
  echo "REQUESTED_STAGE: $stage"
  echo "CHECKED_INPUTS: none"
  echo "NEXT_ACTION: Proceed with stage kickoff."
  exit 0
fi

normalized_inputs="${kickoff_inputs// and /, }"

declare -a required_paths=()
IFS=',' read -r -a raw_parts <<< "$normalized_inputs"
for part in "${raw_parts[@]}"; do
  trimmed="$(echo "$part" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
  if [[ -n "$trimmed" ]]; then
    required_paths+=("$trimmed")
  fi
done

declare -a missing_paths=()
declare -a reroute_stages=()

for path in "${required_paths[@]}"; do
  if [[ ! -e "$project_root/$path" ]]; then
    missing_paths+=("$path")

    if [[ "$path" =~ ^([0-9]{1,2})- ]]; then
      stage_owner="${BASH_REMATCH[1]}"
      if [[ "$stage_owner" -ge 1 ]] && [[ "$stage_owner" -le 12 ]]; then
        reroute_stages+=("$stage_owner")
      fi
    fi
  fi
done

if [[ ${#missing_paths[@]} -gt 0 ]]; then
  unique_reroute="$(printf '%s\n' "${reroute_stages[@]}" | awk 'NF > 0' | sort -n -u | paste -sd ',')"
  if [[ -z "$unique_reroute" ]]; then
    unique_reroute="unknown"
  fi

  echo "RESULT: FAIL"
  echo "ERROR_CODE: PRECHECK_MISSING_INPUTS"
  echo "REQUESTED_STAGE: $stage"
  echo "REROUTE_STAGES: $unique_reroute"
  echo "MISSING_INPUTS:"
  for missing in "${missing_paths[@]}"; do
    echo "- $missing"
  done
  echo "NEXT_ACTION: Produce missing inputs at owning stage(s), then rerun precheck."
  exit 1
fi

echo "RESULT: PASS"
echo "REQUESTED_STAGE: $stage"
echo "CHECKED_INPUTS: $kickoff_inputs"
echo "NEXT_ACTION: Proceed with stage kickoff."
