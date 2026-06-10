#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-packet-create.sh <project-root> <stage> <postcheck-artifact> <changed-path> [changed-path...]

Creates <project-root>/.stage-packet.json with deterministic stage execution inputs.
EOF
}

if [[ $# -lt 4 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
stage="$2"
postcheck_artifact="$3"
shift 3
changed_paths=("$@")

if [[ ! -d "$project_root" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PACKET_PROJECT_NOT_FOUND"
  echo "NEXT_ACTION: Provide a valid project root and retry packet creation."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PACKET_INVALID_STAGE"
  echo "NEXT_ACTION: Use a stage number from 1 to 12."
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"
schema_file="$repo_root/.github/instructions/pipeline-stage-schema.tsv"

if [[ ! -f "$schema_file" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PACKET_SCHEMA_NOT_FOUND"
  echo "NEXT_ACTION: Ensure pipeline-stage-schema.tsv exists and retry."
  exit 1
fi

artifacts_raw="$(awk -F'|' -v target_stage="$stage" '$1 == target_stage { print $3 }' "$schema_file")"
if [[ -z "$artifacts_raw" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: PACKET_STAGE_NOT_IN_SCHEMA"
  echo "NEXT_ACTION: Add the stage row to pipeline-stage-schema.tsv and retry."
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"
packet_path="$project_root/.stage-packet.json"

json_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

{
  echo "{"
  echo "  \"packet_version\": \"1\"," 
  echo "  \"generated_at\": \"$(date +%F)\"," 
  echo "  \"project_root\": \"$(json_escape "$project_root")\"," 
  echo "  \"stage\": \"$(json_escape "$stage")\"," 
  echo "  \"postcheck_artifact\": \"$(json_escape "$postcheck_artifact")\"," 
  echo "  \"strict_mode\": true,"
  echo "  \"allowed_write_scope\": \"$(json_escape "$artifacts_raw, PIPELINE-STATUS.md, X-Journal.md")\"," 
  echo "  \"changed_paths\": ["
  for i in "${!changed_paths[@]}"; do
    suffix=","
    if [[ "$i" -eq "$((${#changed_paths[@]} - 1))" ]]; then
      suffix=""
    fi
    echo "    \"$(json_escape "${changed_paths[$i]}")\"$suffix"
  done
  echo "  ]"
  echo "}"
} > "$packet_path"

echo "RESULT: PASS"
echo "PACKET_PATH: $packet_path"
echo "NEXT_ACTION: Run stage-guard with --packet $packet_path"
