#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: stage-postcheck.sh [--json] <project-root> <stage> <artifact-path>

Validates minimal stage output contract shape:
- first line is a markdown title
- STATUS line exists
- STATUS UPDATED line exists
- stage gate line exists for requested stage
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

json_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

emit_fail() {
  local error_code="$1"
  local next_action="$2"

  if [[ "$json_mode" -eq 1 ]]; then
    printf '{"result":"FAIL","error_code":"%s","requested_stage":"%s","artifact":"%s","next_action":"%s"}\n' \
      "$(json_escape "$error_code")" \
      "$(json_escape "${stage:-unknown}")" \
      "$(json_escape "${artifact_path:-unknown}")" \
      "$(json_escape "$next_action")"
  else
    echo "RESULT: FAIL"
    echo "ERROR_CODE: $error_code"
    echo "REQUESTED_STAGE: ${stage:-unknown}"
    if [[ -n "${artifact_path:-}" ]]; then
      echo "ARTIFACT: ${artifact_path}"
    fi
    echo "NEXT_ACTION: $next_action"
  fi
}

project_root="$1"
stage="$2"
artifact_path="$3"

if [[ ! -d "$project_root" ]]; then
  emit_fail "POSTCHECK_PROJECT_NOT_FOUND" "Provide a valid project root and rerun postcheck."
  exit 1
fi

if [[ ! "$stage" =~ ^[0-9]+$ ]] || [[ "$stage" -lt 1 ]] || [[ "$stage" -gt 12 ]]; then
  emit_fail "POSTCHECK_INVALID_STAGE" "Use a stage number from 1 to 12."
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"
artifact_full_path="$project_root/$artifact_path"

if [[ ! -f "$artifact_full_path" ]]; then
  emit_fail "POSTCHECK_ARTIFACT_NOT_FOUND" "Create the artifact, then rerun postcheck."
  exit 1
fi

first_line="$(head -n 1 "$artifact_full_path" || true)"

if [[ ! "$first_line" =~ ^#[[:space:]]+.+$ ]]; then
  emit_fail "POSTCHECK_MISSING_TITLE" "Ensure first line is a markdown title."
  exit 1
fi

if ! grep -Eq '^- \*\*STATUS:\*\* (PASS|FAIL)$' "$artifact_full_path"; then
  emit_fail "POSTCHECK_MISSING_STATUS_LINE" "Add '- **STATUS:** PASS' or '- **STATUS:** FAIL'."
  exit 1
fi

if ! grep -Eq '^- \*\*STATUS UPDATED:\*\* [0-9]{4}-[0-9]{2}-[0-9]{2}$' "$artifact_full_path"; then
  emit_fail "POSTCHECK_MISSING_STATUS_UPDATED" "Add '- **STATUS UPDATED:** YYYY-MM-DD'."
  exit 1
fi

if ! grep -Eq "^GATE ${stage}: (PASS|FAIL - .+)$" "$artifact_full_path"; then
  emit_fail "POSTCHECK_MISSING_GATE_LINE" "Add gate line 'GATE ${stage}: PASS' or 'GATE ${stage}: FAIL - reason'."
  exit 1
fi

# Gate line must appear in the final 15% of the file (rounded up to a minimum of 5 lines).
# This prevents weaker models from writing the gate near the STATUS header.
total_lines="$(wc -l < "$artifact_full_path" || echo 1)"
gate_line_num="$(grep -n "^GATE ${stage}:" "$artifact_full_path" | tail -n 1 | cut -d: -f1)"
min_bottom_line=$(( total_lines - ( total_lines * 15 / 100 + 5 ) ))
if [[ -n "$gate_line_num" ]] && [[ "$gate_line_num" -lt "$min_bottom_line" ]]; then
  emit_fail "POSTCHECK_GATE_LINE_NOT_AT_BOTTOM" "Gate line is at line ${gate_line_num} of ${total_lines}. Move 'GATE ${stage}:' to the final lines of the artifact (after all sections)."
  exit 1
fi

if [[ "$json_mode" -eq 1 ]]; then
  printf '{"result":"PASS","requested_stage":"%s","artifact":"%s","next_action":"%s"}\n' \
    "$(json_escape "$stage")" \
    "$(json_escape "$artifact_path")" \
    "$(json_escape "Proceed to gate declaration and stop.")"
else
  echo "RESULT: PASS"
  echo "REQUESTED_STAGE: $stage"
  echo "ARTIFACT: $artifact_path"
  echo "NEXT_ACTION: Proceed to gate declaration and stop."
fi
