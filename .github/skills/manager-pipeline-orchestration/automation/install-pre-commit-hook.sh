#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install-pre-commit-hook.sh <repo-root>

Installs an optional pre-commit hook that runs pipeline health checks:
  .github/skills/manager-pipeline-orchestration/automation/pipeline-health.sh <repo-root>
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
git_dir="$repo_root/.git"

if [[ ! -d "$git_dir" ]]; then
  echo "SKIP: no .git directory found at $repo_root"
  echo "Install manually by creating .git/hooks/pre-commit when this is a git checkout."
  exit 0
fi

hook_path="$git_dir/hooks/pre-commit"
health_script="$repo_root/.github/skills/manager-pipeline-orchestration/automation/pipeline-health.sh"

if [[ ! -x "$health_script" ]]; then
  echo "FAIL: required executable not found: $health_script" >&2
  exit 1
fi

cat > "$hook_path" <<EOF
#!/usr/bin/env bash
set -euo pipefail

bash "$health_script" "$repo_root"
EOF

chmod +x "$hook_path"

echo "PASS: installed pre-commit hook at $hook_path"
