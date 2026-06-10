#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install-strict-aliases.sh [repo-root]

Installs deterministic pipeline command aliases in ~/.bashrc.
Safe to rerun (idempotent).
EOF
}

if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  usage
  exit 0
fi

repo_root="${1:-$(pwd)}"
if [[ ! -d "$repo_root" ]]; then
  echo "RESULT: FAIL"
  echo "ERROR_CODE: ALIASES_REPO_NOT_FOUND"
  echo "NEXT_ACTION: Provide a valid repo root and retry."
  exit 1
fi

repo_root="$(cd "$repo_root" && pwd)"
bashrc_path="$HOME/.bashrc"

start_marker="# >>> pipeline-strict-aliases >>>"
end_marker="# <<< pipeline-strict-aliases <<<"

alias_block=$(cat <<EOF
$start_marker
alias stagepkt='bash "$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-packet-create.sh"'
alias stageguardpkt='bash "$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-guard.sh" --packet'
alias stage1cmd='bash "$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-one-command.sh"'
$end_marker
EOF
)

if [[ ! -f "$bashrc_path" ]]; then
  printf '%s\n' "$alias_block" > "$bashrc_path"
  echo "RESULT: PASS"
  echo "NEXT_ACTION: Run 'source ~/.bashrc' to activate aliases in current shell."
  exit 0
fi

if grep -Fq "$start_marker" "$bashrc_path"; then
  tmp_file="$(mktemp)"
  awk -v start="$start_marker" -v end="$end_marker" '
    BEGIN { in_block=0 }
    index($0, start) { in_block=1; next }
    index($0, end) { in_block=0; next }
    !in_block { print }
  ' "$bashrc_path" > "$tmp_file"
  mv "$tmp_file" "$bashrc_path"
fi

printf '\n%s\n' "$alias_block" >> "$bashrc_path"

echo "RESULT: PASS"
echo "NEXT_ACTION: Run 'source ~/.bashrc' to activate aliases in current shell."
