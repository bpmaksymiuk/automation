#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-guard.sh [--packet <packet-path>] [--postcheck <artifact-path>] [--strict] <project-root> <stage> <changed-path> [changed-path...]

Runs in order:
1) stage-runner.sh --json
2) stage-write-scope-check.sh --json
3) optional: stage-postcheck.sh --json
4) optional: stage-strict-check.sh --json

Returns non-zero if either step fails.
EOF
}

postcheck_artifact=""
strict_mode=0
packet_file=""

packet_get_string() {
  local key="$1"
  local file="$2"
  sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$file" | head -n 1
}

packet_get_bool() {
  local key="$1"
  local file="$2"
  sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\(true\|false\).*/\1/p" "$file" | head -n 1
}

packet_get_changed_paths() {
  local file="$1"
  awk '
    /"changed_paths"[[:space:]]*:/ {
      in_array=1
      next
    }
    in_array && /]/ {
      in_array=0
      next
    }
    in_array {
      while (match($0, /"[^"]+"/)) {
        value=substr($0, RSTART+1, RLENGTH-2)
        print value
        $0=substr($0, RSTART+RLENGTH)
      }
    }
  ' "$file"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --packet)
      if [[ $# -lt 2 ]]; then
        usage >&2
        exit 2
      fi
      packet_file="$2"
      shift 2
      ;;
    --postcheck)
      if [[ $# -lt 2 ]]; then
        usage >&2
        exit 2
      fi
      postcheck_artifact="$2"
      shift 2
      ;;
    --strict)
      strict_mode=1
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

if [[ -n "$packet_file" ]]; then
  if [[ ! -f "$packet_file" ]]; then
    echo "RESULT: FAIL"
    echo "ERROR_CODE: GUARD_PACKET_NOT_FOUND"
    echo "NEXT_ACTION: Provide a valid packet path and retry."
    exit 1
  fi

  project_root="$(packet_get_string "project_root" "$packet_file")"
  stage="$(packet_get_string "stage" "$packet_file")"

  packet_postcheck="$(packet_get_string "postcheck_artifact" "$packet_file")"
  if [[ -n "$packet_postcheck" ]]; then
    postcheck_artifact="$packet_postcheck"
  fi

  packet_strict="$(packet_get_bool "strict_mode" "$packet_file")"
  if [[ "$packet_strict" == "true" ]]; then
    strict_mode=1
  fi

  mapfile -t changed_paths < <(packet_get_changed_paths "$packet_file")

  if [[ -z "$project_root" ]] || [[ -z "$stage" ]] || [[ ${#changed_paths[@]} -eq 0 ]]; then
    echo "RESULT: FAIL"
    echo "ERROR_CODE: GUARD_PACKET_INVALID"
    echo "NEXT_ACTION: Regenerate packet with stage-packet-create.sh and retry."
    exit 1
  fi
else
  if [[ $# -lt 3 ]]; then
    usage >&2
    exit 2
  fi

  project_root="$1"
  stage="$2"
  shift 2
  changed_paths=("$@")
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
runner_script="$script_dir/stage-runner.sh"
scope_script="$script_dir/stage-write-scope-check.sh"
postcheck_script="$script_dir/stage-postcheck.sh"
strict_script="$script_dir/stage-strict-check.sh"

if [[ ! -x "$runner_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_RUNNER_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-runner.sh executable and retry."
  exit 1
fi

if [[ ! -x "$scope_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_SCOPE_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-write-scope-check.sh executable and retry."
  exit 1
fi

if [[ -n "$postcheck_artifact" ]] && [[ ! -x "$postcheck_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_POSTCHECK_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-postcheck.sh executable and retry."
  exit 1
fi

if [[ "$strict_mode" -eq 1 ]] && [[ -z "$postcheck_artifact" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_STRICT_REQUIRES_POSTCHECK"
  echo "NEXT_ACTION: Provide --postcheck <artifact-path> when using --strict."
  exit 1
fi

if [[ "$strict_mode" -eq 1 ]] && [[ ! -x "$strict_script" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_STRICT_NOT_EXECUTABLE"
  echo "NEXT_ACTION: Make stage-strict-check.sh executable and retry."
  exit 1
fi

runner_output="$(bash "$runner_script" --json "$project_root" "$stage")" || {
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_RUNNER_FAILED"
  echo "NEXT_ACTION: Resolve stage-runner failure and retry."
  exit 1
}

scope_output="$(bash "$scope_script" --json "$project_root" "$stage" "${changed_paths[@]}")" || {
  echo "RESULT: FAIL"
  echo "ERROR_CODE: GUARD_SCOPE_FAILED"
  echo "RUNNER_JSON: $runner_output"
  echo "NEXT_ACTION: Resolve write-scope violations and retry."
  exit 1
}

postcheck_output=""
if [[ -n "$postcheck_artifact" ]]; then
  postcheck_output="$(bash "$postcheck_script" --json "$project_root" "$stage" "$postcheck_artifact")" || {
    echo "RESULT: FAIL"
    echo "ERROR_CODE: GUARD_POSTCHECK_FAILED"
    echo "RUNNER_JSON: $runner_output"
    echo "SCOPE_JSON: $scope_output"
    echo "NEXT_ACTION: Resolve postcheck output-contract issues and retry."
    exit 1
  }
fi

strict_output=""
if [[ "$strict_mode" -eq 1 ]]; then
  strict_output="$(bash "$strict_script" --json "$project_root" "$stage" "$postcheck_artifact")" || {
    echo "RESULT: FAIL"
    echo "ERROR_CODE: GUARD_STRICT_FAILED"
    echo "RUNNER_JSON: $runner_output"
    echo "SCOPE_JSON: $scope_output"
    echo "POSTCHECK_JSON: $postcheck_output"
    echo "NEXT_ACTION: Resolve strict-mode heading issues and retry."
    exit 1
  }
fi

echo "RESULT: PASS"
echo "RUNNER_JSON: $runner_output"
echo "SCOPE_JSON: $scope_output"
if [[ -n "$postcheck_artifact" ]]; then
  echo "POSTCHECK_JSON: $postcheck_output"
fi
if [[ "$strict_mode" -eq 1 ]]; then
  echo "STRICT_JSON: $strict_output"
fi
echo "NEXT_ACTION: Proceed with stage output updates."
