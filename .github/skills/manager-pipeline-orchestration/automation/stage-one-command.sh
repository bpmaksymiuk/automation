#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-one-command.sh <project-root> <stage> <postcheck-artifact> <changed-path> [changed-path...]

One command for low-ambiguity stage execution:
1) creates <project-root>/.stage-packet.json
2) runs stage-guard with --packet
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

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
packet_create_script="$script_dir/stage-packet-create.sh"
guard_script="$script_dir/stage-guard.sh"

if [[ ! -x "$packet_create_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ONE_COMMAND_PACKET_CREATE_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-packet-create.sh executable and retry."
  exit 1
fi

if [[ ! -x "$guard_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ONE_COMMAND_GUARD_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-guard.sh executable and retry."
  exit 1
fi

packet_output="$(bash "$packet_create_script" "$project_root" "$stage" "$postcheck_artifact" "${changed_paths[@]}")" || {
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ONE_COMMAND_PACKET_CREATE_FAILED"
  echo "NEXT_ACTION: Resolve packet creation failure and retry."
  exit 1
}

packet_path="$(echo "$packet_output" | sed -n 's/^PACKET_PATH: //p' | head -n 1)"
if [[ -z "$packet_path" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ONE_COMMAND_PACKET_PATH_MISSING"
  echo "NEXT_ACTION: Ensure stage-packet-create returns PACKET_PATH."
  exit 1
fi

guard_output="$(bash "$guard_script" --packet "$packet_path")" || {
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ONE_COMMAND_GUARD_FAILED"
  echo "PACKET_PATH: $packet_path"
  echo "NEXT_ACTION: Resolve stage-guard failure and retry."
  exit 1
}

echo "RESULT: PASS"
echo "PACKET_PATH: $packet_path"
echo "$guard_output"
