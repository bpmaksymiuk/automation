#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: verify-test-case-authoring.sh <project-root>
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
use_cases_file="$project_root/2-USE-CASES.md"
test_cases_file="$project_root/11-TEST-CASES.md"

for required_file in "$use_cases_file" "$test_cases_file"; do
  if [[ ! -f "$required_file" ]]; then
    echo "FAIL: required file is missing: $required_file" >&2
    exit 1
  fi
done

mapfile -t expected_acceptance_criteria < <(
  awk '
    /^## UC-[0-9]{3} :/ {
      current_uc = $2;
      next;
    }
    /^[[:space:]]*- AC[0-9]+:/ && current_uc != "" {
      match($0, /AC[0-9]+/);
      print current_uc " " substr($0, RSTART, RLENGTH);
    }
  ' "$use_cases_file"
)

if [[ ${#expected_acceptance_criteria[@]} -eq 0 ]]; then
  echo "FAIL: no acceptance criteria found in $use_cases_file" >&2
  exit 1
fi

mapfile -t test_ids < <(grep -oE '^## T-[0-9]{3}' "$test_cases_file" | awk '{ print $2 }')

if [[ ${#test_ids[@]} -eq 0 ]]; then
  echo "FAIL: no Stage 11 test cases found in $test_cases_file" >&2
  exit 1
fi

ac_coverage_field_count="$(grep -c '^- \*\*AC COVERAGE:\*\*' "$test_cases_file" || true)"
if [[ "$ac_coverage_field_count" -ne "${#test_ids[@]}" ]]; then
  echo "FAIL: expected one AC COVERAGE field per test case in $test_cases_file" >&2
  echo "- test cases: ${#test_ids[@]}" >&2
  echo "- AC COVERAGE fields: $ac_coverage_field_count" >&2
  exit 1
fi

mapfile -t covered_acceptance_criteria < <(grep -oE 'UC-[0-9]{3} AC[0-9]+' "$test_cases_file" | sort -u)

declare -a missing_acceptance_criteria=()

for criterion in "${expected_acceptance_criteria[@]}"; do
  if ! printf '%s\n' "${covered_acceptance_criteria[@]}" | grep -Fxq "$criterion"; then
    missing_acceptance_criteria+=("$criterion")
  fi
done

if [[ ${#missing_acceptance_criteria[@]} -gt 0 ]]; then
  echo "FAIL: Stage 11 test-case authoring verification failed for $project_root" >&2
  for criterion in "${missing_acceptance_criteria[@]}"; do
    echo "- Missing acceptance-criterion coverage: $criterion" >&2
  done
  exit 1
fi

echo "PASS: Stage 11 test cases cover every acceptance criterion and include AC COVERAGE fields"
