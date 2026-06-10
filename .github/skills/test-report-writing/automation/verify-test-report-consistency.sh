#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: verify-test-report-consistency.sh <project-root>

Validates Stage 11 consistency across:
- 11-TEST-REPORT.md
- 11-TESTS/UC-BR-EVIDENCE.md
- PIPELINE-STATUS.md (stage 11 row)
EOF
}

if [[ $# -ne 1 ]]; then
  usage >&2
  exit 2
fi

project_root="$1"
if [[ ! -d "$project_root" ]]; then
  echo "FAIL: project root does not exist: $project_root" >&2
  exit 1
fi

project_root="$(cd "$project_root" && pwd)"
report_file="$project_root/11-TEST-REPORT.md"
evidence_file="$project_root/11-TESTS/UC-BR-EVIDENCE.md"
status_file="$project_root/PIPELINE-STATUS.md"

for file in "$report_file" "$evidence_file" "$status_file"; do
  if [[ ! -f "$file" ]]; then
    echo "FAIL: missing required file: $file" >&2
    exit 1
  fi
done

report_status="$(grep -E "^- \*\*STATUS:\*\* (PASS|FAIL)$" "$report_file" | head -n 1 | sed -E 's/.*\*\*STATUS:\*\* (PASS|FAIL).*/\1/')"
gate_status="$(grep -E "\*\*GATE 11:\*\* (PASS|FAIL)" "$report_file" | tail -n 1 | sed -E 's/.*\*\*GATE 11:\*\* (PASS|FAIL).*/\1/')"
current_uc_status="$(grep -E "^- \*\*Current UC Status:\*\* (PASS|FAIL)$" "$report_file" | tail -n 1 | sed -E 's/.*\*\*Current UC Status:\*\* (PASS|FAIL).*/\1/')"
current_br_status="$(grep -E "^- \*\*Current BR Status:\*\* (PASS|FAIL)$" "$report_file" | tail -n 1 | sed -E 's/.*\*\*Current BR Status:\*\* (PASS|FAIL).*/\1/')"
evidence_overall="$(grep -E "^- Overall: (PASS|FAIL)$" "$evidence_file" | head -n 1 | sed -E 's/.*- Overall: (PASS|FAIL).*/\1/')"
stage11_status="$(grep -E '^\|[[:space:]]*11[[:space:]]*\|' "$status_file" | head -n 1 | awk -F'|' '{gsub(/^[[:space:]]+|[[:space:]]+$/, "", $3); print $3}')"

if [[ -z "$report_status" || -z "$gate_status" || -z "$current_uc_status" || -z "$current_br_status" || -z "$evidence_overall" || -z "$stage11_status" ]]; then
  echo "FAIL: unable to parse one or more required status fields." >&2
  echo "Parsed values:" >&2
  echo "  report_status=${report_status:-<empty>}" >&2
  echo "  gate_status=${gate_status:-<empty>}" >&2
  echo "  current_uc_status=${current_uc_status:-<empty>}" >&2
  echo "  current_br_status=${current_br_status:-<empty>}" >&2
  echo "  evidence_overall=${evidence_overall:-<empty>}" >&2
  echo "  stage11_status=${stage11_status:-<empty>}" >&2
  exit 1
fi

if [[ "$report_status" != "$gate_status" || "$report_status" != "$current_uc_status" || "$report_status" != "$current_br_status" || "$report_status" != "$evidence_overall" || "$report_status" != "$stage11_status" ]]; then
  echo "FAIL: Stage 11 status mismatch detected." >&2
  echo "  report STATUS: $report_status" >&2
  echo "  report GATE 11: $gate_status" >&2
  echo "  report Current UC: $current_uc_status" >&2
  echo "  report Current BR: $current_br_status" >&2
  echo "  evidence Overall: $evidence_overall" >&2
  echo "  pipeline stage 11: $stage11_status" >&2
  exit 1
fi

pass_count="$(grep -c '\*\*PASS\*\*' "$report_file" || true)"
fail_count="$(grep -c '\*\*FAIL\*\*' "$report_file" || true)"
if [[ "$pass_count" -gt 0 && "$fail_count" -gt 0 ]]; then
  if ! grep -q "Archived Historical Snapshot" "$report_file"; then
    echo "FAIL: report contains both PASS and FAIL markers but no archived historical snapshot labeling." >&2
    exit 1
  fi
fi

echo "PASS: Stage 11 report consistency checks passed."
echo "- STATUS/GATE/evidence/pipeline all agree: $report_status"
