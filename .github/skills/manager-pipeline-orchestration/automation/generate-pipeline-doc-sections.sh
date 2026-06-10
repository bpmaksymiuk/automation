#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: generate-pipeline-doc-sections.sh <repo-root>

Regenerates duplicated stage tables from:
  .github/instructions/pipeline-stage-schema.tsv

Target files:
  - .github/instructions/pipeline.instructions.md
  - .github/instructions/stage-kickoff.instructions.md
  - .github/instructions/validate-stage-artifacts.instructions.md
  - .github/instructions/new-project-scaffold.instructions.md
  - .github/skills/manager-pipeline-orchestration/automation/stage-status-template.md
EOF
}

if [[ $# -ne 1 ]]; then
  usage >&2
  exit 2
fi

repo_root="$1"

if [[ ! -d "$repo_root" ]]; then
  echo "FAIL: repo root does not exist: $repo_root" >&2
  exit 1
fi

repo_root="$(cd "$repo_root" && pwd)"
schema_file="$repo_root/.github/instructions/pipeline-stage-schema.tsv"

if [[ ! -f "$schema_file" ]]; then
  echo "FAIL: schema file not found: $schema_file" >&2
  exit 1
fi

pipeline_file="$repo_root/.github/instructions/pipeline.instructions.md"
kickoff_file="$repo_root/.github/instructions/stage-kickoff.instructions.md"
validate_file="$repo_root/.github/instructions/validate-stage-artifacts.instructions.md"
scaffold_file="$repo_root/.github/instructions/new-project-scaffold.instructions.md"
status_template_file="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-status-template.md"

build_stage_directory_table() {
  local output_file="$1"

  {
    echo "| Stage | Owner | Artifact(s) | Skill |"
    echo "|---|---|---|---|"

    while IFS='|' read -r stage owner artifacts skill kickoff_inputs validate_required || [[ -n "${stage:-}" ]]; do
      [[ -z "$stage" || "$stage" =~ ^# ]] && continue
      echo "| $stage | $owner | $artifacts | $skill |"
    done < "$schema_file"
  } > "$output_file"
}

build_kickoff_inputs_table() {
  local output_file="$1"

  {
    echo "| Stage | Must Read Before Writing |"
    echo "|---|---|"

    while IFS='|' read -r stage owner artifacts skill kickoff_inputs validate_required || [[ -n "${stage:-}" ]]; do
      [[ -z "$stage" || "$stage" =~ ^# ]] && continue
      [[ "$stage" == "0" ]] && continue
      echo "| $stage | $kickoff_inputs |"
    done < "$schema_file"
  } > "$output_file"
}

build_validate_checklist_table() {
  local output_file="$1"

  {
    echo "| Stage | Required |"
    echo "|---|---|"

    while IFS='|' read -r stage owner artifacts skill kickoff_inputs validate_required || [[ -n "${stage:-}" ]]; do
      [[ -z "$stage" || "$stage" =~ ^# ]] && continue
      [[ "$stage" == "0" ]] && continue
      echo "| $stage | $validate_required |"
    done < "$schema_file"
  } > "$output_file"
}

build_status_table() {
  local output_file="$1"
  local status_value="$2"
  local date_value="$3"

  {
    echo "| Stage | Status | Status Updated |"
    echo "|---|---|---|"

    while IFS='|' read -r stage owner artifacts skill kickoff_inputs validate_required || [[ -n "${stage:-}" ]]; do
      [[ -z "$stage" || "$stage" =~ ^# ]] && continue
      echo "| $stage | $status_value | $date_value |"
    done < "$schema_file"
  } > "$output_file"
}

replace_generated_block() {
  local file_path="$1"
  local key="$2"
  local block_file="$3"
  local start_marker="<!-- GENERATED:${key}:START -->"
  local end_marker="<!-- GENERATED:${key}:END -->"
  local temp_file

  if [[ ! -f "$file_path" ]]; then
    echo "FAIL: target file not found: $file_path" >&2
    exit 1
  fi

  if ! grep -Fq "$start_marker" "$file_path"; then
    echo "FAIL: missing start marker '$start_marker' in $file_path" >&2
    exit 1
  fi

  if ! grep -Fq "$end_marker" "$file_path"; then
    echo "FAIL: missing end marker '$end_marker' in $file_path" >&2
    exit 1
  fi

  temp_file="$(mktemp)"

  awk -v start="$start_marker" -v end="$end_marker" -v repl_file="$block_file" '
    BEGIN {
      while ((getline line < repl_file) > 0) {
        replacement = replacement line ORS
      }
      close(repl_file)
      in_block = 0
    }
    {
      if ($0 == start) {
        print $0
        printf "%s", replacement
        in_block = 1
        next
      }
      if ($0 == end) {
        in_block = 0
        print $0
        next
      }
      if (!in_block) {
        print $0
      }
    }
  ' "$file_path" > "$temp_file"

  mv "$temp_file" "$file_path"
}

stage_directory_block="$(mktemp)"
kickoff_block="$(mktemp)"
validate_block="$(mktemp)"
pipeline_status_block="$(mktemp)"
scaffold_status_block="$(mktemp)"
status_template_block="$(mktemp)"

trap 'rm -f "$stage_directory_block" "$kickoff_block" "$validate_block" "$pipeline_status_block" "$scaffold_status_block" "$status_template_block"' EXIT

build_stage_directory_table "$stage_directory_block"
build_kickoff_inputs_table "$kickoff_block"
build_validate_checklist_table "$validate_block"
build_status_table "$pipeline_status_block" "Not Started/In Progress/PASS/FAIL" "YYYY-MM-DD"
build_status_table "$scaffold_status_block" "Not Started" "<TODAY>"
build_status_table "$status_template_block" "Not Started" "YYYY-MM-DD"

replace_generated_block "$pipeline_file" "STAGE_DIRECTORY" "$stage_directory_block"
replace_generated_block "$kickoff_file" "UPSTREAM_INPUTS" "$kickoff_block"
replace_generated_block "$validate_file" "STAGE_CHECKLIST" "$validate_block"
replace_generated_block "$pipeline_file" "STATUS_BOARD_TEMPLATE" "$pipeline_status_block"
replace_generated_block "$scaffold_file" "STATUS_BOARD_TEMPLATE" "$scaffold_status_block"
replace_generated_block "$status_template_file" "STATUS_BOARD_TEMPLATE" "$status_template_block"

echo "PASS: regenerated pipeline instruction sections from schema"
echo "- $pipeline_file"
echo "- $kickoff_file"
echo "- $validate_file"
echo "- $scaffold_file"
echo "- $status_template_file"
