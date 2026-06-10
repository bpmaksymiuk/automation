#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: lint-pipeline-controls.sh <repo-root>
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

declare -a failures=()

search_fixed() {
  local file_path="$1"
  local pattern="$2"

  if command -v rg >/dev/null 2>&1; then
    rg -q --fixed-strings "$pattern" "$file_path"
  else
    grep -Fq -- "$pattern" "$file_path"
  fi
}

search_regex() {
  local file_path="$1"
  local pattern="$2"

  if command -v rg >/dev/null 2>&1; then
    rg -q -e "$pattern" "$file_path"
  else
    grep -Eq -- "$pattern" "$file_path"
  fi
}

check_contains() {
  local file_path="$1"
  local pattern="$2"
  local message="$3"

  if [[ ! -f "$file_path" ]]; then
    failures+=("Missing file: ${file_path#$repo_root/}")
    return
  fi

  if ! search_fixed "$file_path" "$pattern"; then
    failures+=("$message")
  fi
}

check_not_contains() {
  local file_path="$1"
  local pattern="$2"
  local message="$3"

  if [[ ! -f "$file_path" ]]; then
    failures+=("Missing file: ${file_path#$repo_root/}")
    return
  fi

  if search_regex "$file_path" "$pattern"; then
    failures+=("$message")
  fi
}

pipeline_file="$repo_root/.github/instructions/pipeline.instructions.md"
stage_kickoff_file="$repo_root/.github/instructions/stage-kickoff.instructions.md"
stage_output_contract_file="$repo_root/.github/instructions/stage-output-contract.instructions.md"
policy_index_file="$repo_root/.github/instructions/pipeline-policy-index.md"
allowed_actions_file="$repo_root/.github/instructions/stage-allowed-actions.instructions.md"
templates_dir="$repo_root/.github/templates/stage-output"
manager_skill="$repo_root/.github/skills/manager-pipeline-orchestration/SKILL.md"
manager_readme="$repo_root/.github/skills/manager-pipeline-orchestration/automation/README.md"
stage_status_template="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-status-template.md"
stage_output_verifier="$repo_root/.github/skills/manager-pipeline-orchestration/automation/verify-stage-outputs.sh"
stage_precheck="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh"
stage_runner="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-runner.sh"
stage_postcheck="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh"
stage_write_scope="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-write-scope-check.sh"
stage_guard="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-guard.sh"
stage_strict_check="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-strict-check.sh"
stage_packet_create="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-packet-create.sh"
stage_one_command="$repo_root/.github/skills/manager-pipeline-orchestration/automation/stage-one-command.sh"
strict_alias_installer="$repo_root/.github/skills/manager-pipeline-orchestration/automation/install-strict-aliases.sh"
pipeline_linter="$repo_root/.github/skills/manager-pipeline-orchestration/automation/lint-pipeline-controls.sh"
pipeline_health="$repo_root/.github/skills/manager-pipeline-orchestration/automation/pipeline-health.sh"
hook_installer="$repo_root/.github/skills/manager-pipeline-orchestration/automation/install-pre-commit-hook.sh"
test_case_skill="$repo_root/.github/skills/test-case-authoring/SKILL.md"
test_case_verifier="$repo_root/.github/skills/test-case-authoring/automation/verify-test-case-authoring.sh"
test_report_skill="$repo_root/.github/skills/test-report-writing/SKILL.md"
prod_ops_skill="$repo_root/.github/skills/prod-ops/SKILL.md"
deploy_template="$repo_root/.github/skills/prod-ops/templates/deploy.sh"
env_template="$repo_root/.github/skills/prod-ops/templates/.env.deploy.example"
nginx_template="$repo_root/.github/skills/prod-ops/templates/nginx.conf"

check_contains "$pipeline_file" '| 12 | Prod Ops | `12-DEPLOYMENT-RESULTS.md`, `deploy.sh`, `.env.deploy`, `deploy/nginx.conf`, `11-TESTS/playwright.smoke.config.mjs` |' "Pipeline instructions prod-ops row must own deploy.sh, .env.deploy, deploy/nginx.conf, and smoke config."
check_contains "$pipeline_file" '## Control File Boundaries' "Pipeline instructions must define control-file boundaries."
check_contains "$pipeline_file" 'stage-output-contract.instructions.md' "Pipeline instructions must reference the stage output contract instruction."
check_contains "$pipeline_file" 'pipeline-policy-index.md' "Pipeline instructions must reference the policy index."
check_contains "$pipeline_file" 'stage-allowed-actions.instructions.md' "Pipeline instructions must reference the allowed-actions matrix."
check_contains "$stage_kickoff_file" 'stage-precheck.sh <project-root> <stage>' "Stage kickoff instructions must require stage precheck."
check_contains "$test_case_skill" 'verify-test-case-authoring.sh <project-root>' "Test-case authoring skill must use the pre-execution verifier."
check_contains "$test_report_skill" 'verify-use-case-coverage.sh <project-root>` after writing the report' "Test-report skill must run acceptance-criterion coverage after report authoring."
check_contains "$test_report_skill" 'cd PROJECTS/<APP>/10-TESTS' "Test-report skill examples must use 10-TESTS."
check_contains "$test_report_skill" "npm --prefix 10-TESTS test -- --headed" "Test-report skill root command example must use 10-TESTS."
check_contains "$test_report_skill" "npm --prefix ../9-BUILD run dev" "Test-report skill webServer example must point at ../9-BUILD."
check_contains "$stage_output_verifier" '".env.deploy" "deploy" "deploy/nginx.conf" "11-TESTS/playwright.smoke.config.mjs"' "Stage output verifier must enforce prod-ops deploy artifacts and smoke config."
check_contains "$stage_output_verifier" 'verify-test-case-authoring.sh' "Stage output verifier must check for the pre-execution Stage 11 verifier."
check_contains "$manager_skill" 'lint-pipeline-controls.sh <repo-root>' "Manager skill must require the pipeline-control lint after .github edits."
check_contains "$manager_readme" 'lint-pipeline-controls.sh' "Manager automation README must document the pipeline-control lint."
check_contains "$manager_readme" 'pipeline-health.sh' "Manager automation README must document pipeline health checks."
check_contains "$manager_readme" 'install-pre-commit-hook.sh' "Manager automation README must document optional pre-commit hook installation."
check_contains "$manager_readme" 'stage-precheck.sh' "Manager automation README must document stage precheck."
check_contains "$manager_readme" 'stage-runner.sh' "Manager automation README must document stage runner."
check_contains "$manager_readme" 'stage-postcheck.sh' "Manager automation README must document stage postcheck."
check_contains "$manager_readme" 'stage-write-scope-check.sh' "Manager automation README must document write-scope checks."
check_contains "$manager_readme" 'stage-guard.sh' "Manager automation README must document stage guard wrapper."
check_contains "$manager_readme" 'stage-strict-check.sh' "Manager automation README must document strict checker."
check_contains "$manager_readme" 'stage-packet-create.sh' "Manager automation README must document stage packet creation."
check_contains "$manager_readme" 'stage-one-command.sh' "Manager automation README must document one-command flow."
check_contains "$manager_readme" 'install-strict-aliases.sh' "Manager automation README must document strict alias installer."
check_contains "$manager_readme" 'stage-output-contract.instructions.md' "Manager automation README must reference the stage output contract instruction."
check_contains "$manager_readme" 'pipeline-policy-index.md' "Manager automation README must reference the policy index."
check_contains "$manager_readme" 'stage-allowed-actions.instructions.md' "Manager automation README must reference the allowed-actions matrix."
check_contains "$manager_readme" '.github/templates/stage-output/' "Manager automation README must reference stage output templates."
check_contains "$manager_readme" '7-DI-QUALITY-CHECKLIST.template.md' "Manager automation README must document the Stage 7 DI quality checklist template."
check_contains "$stage_runner" 'POLICY_REFERENCES: POLICY-002,POLICY-006' "Stage runner must emit explicit policy references for precheck and output contract."
check_contains "$stage_runner" 'QUALITY_CHECK_TEMPLATE:' "Stage runner must emit stage-specific quality-check hints."
check_contains "$stage_runner" '7-DI-QUALITY-CHECKLIST.template.md' "Stage runner must reference the Stage 7 DI quality checklist template."
check_contains "$stage_runner" '--json' "Stage runner must support --json mode."
check_contains "$stage_postcheck" '--json' "Stage postcheck must support --json mode."
check_contains "$stage_guard" '--postcheck' "Stage guard must support optional postcheck mode."
check_contains "$stage_guard" '--strict' "Stage guard must support strict mode."
check_contains "$stage_guard" '--packet' "Stage guard must support packet mode."
check_contains "$stage_one_command" '--packet "$packet_path"' "Stage one-command wrapper must execute stage-guard in packet mode."
check_contains "$strict_alias_installer" 'stage1cmd' "Strict alias installer must install stage1cmd alias."
check_contains "$policy_index_file" 'POLICY-001' "Policy index must define POLICY-001."
check_contains "$policy_index_file" 'POLICY-008' "Policy index must define POLICY-008."
check_contains "$stage_status_template" '| 1 | Not Started | YYYY-MM-DD |' "Stage status template must include Stage 1."
check_contains "$stage_status_template" '| 12 | Not Started | YYYY-MM-DD |' "Stage status template must include prod-ops."
check_contains "$env_template" 'DEPLOY_URL=' "Prod Ops env template must include DEPLOY_URL for smoke verification."
check_contains "$deploy_template" 'BUILD_DIR="${BUILD_DIR:-${SCRIPT_DIR}/9-BUILD}"' "Deploy template must default BUILD_DIR to 9-BUILD."
check_contains "$deploy_template" 'DEPLOY_SOURCE_DIR=' "Deploy template must select a deploy source directory explicitly."
check_contains "$prod_ops_skill" 'derive the smoke target from `.env.deploy`' "Prod Ops skill must derive smoke target from .env.deploy."
check_contains "$prod_ops_skill" '`DEPLOY_URL`' "Prod Ops skill must document DEPLOY_URL."
check_not_contains "$prod_ops_skill" 'BAMCO|bamcoi5|www\.bamco\.net|bamco\.key|bamco\.spec|PROJECTS/BAMCO-' "Prod Ops skill must remain generic and free of BAMCO-specific values."
check_not_contains "$deploy_template" 'BAMCO|bamcoi5|www\.bamco\.net|bamco\.key' "Prod Ops deploy template must remain generic and free of BAMCO-specific values."
check_not_contains "$env_template" 'bamcoi5|www\.bamco\.net|bamco\.key' "Prod Ops env template must remain generic and free of BAMCO-specific values."
check_not_contains "$nginx_template" 'bamco\.net|www\.bamco\.net|/var/www/bamco/' "Prod Ops nginx template must remain generic and free of BAMCO-specific values."

while IFS= read -r -d '' agent_file; do
  relative_path="${agent_file#$repo_root/}"
  check_not_contains "$agent_file" '## ⚠️ FILE WRITING PROTOCOL' "Agent files must not embed generic runtime file-writing protocol: $relative_path"
  check_not_contains "$agent_file" '^[0-9]+\. Read `?\.github/instructions/pipeline\.instructions\.md`?' "Agent files must not define pipeline procedure steps: $relative_path"
  check_not_contains "$agent_file" 'Load and follow `?\.github/skills/|Load `?\.github/skills/' "Agent files must not instruct skill loading or execution steps: $relative_path"
done < <(find "$repo_root/.github/agents" -type f -name '*.agent.md' -print0)

while IFS= read -r -d '' skill_file; do
  relative_path="${skill_file#$repo_root/}"
  check_not_contains "$skill_file" 'Append .*X-Journal\.md' "Skill files must not restate journal workflow mechanics: $relative_path"
  check_not_contains "$skill_file" 'PIPELINE-STATUS\.md' "Skill files must not restate status-board workflow mechanics: $relative_path"
  check_not_contains "$skill_file" 'GATE [A-Za-z0-9-]+: PASS|GATE [A-Za-z0-9-]+: FAIL' "Skill files must not restate pipeline gate wording: $relative_path"
done < <(find "$repo_root/.github/skills" -type f -name 'SKILL.md' -print0)

if [[ ! -x "$test_case_verifier" ]]; then
  failures+=("Stage 11 pre-execution verifier must be executable.")
fi

if [[ ! -x "$pipeline_linter" ]]; then
  failures+=("Pipeline-control linter must be executable.")
fi

if [[ ! -x "$pipeline_health" ]]; then
  failures+=("Pipeline health script must be executable.")
fi

if [[ ! -x "$hook_installer" ]]; then
  failures+=("Pre-commit hook installer must be executable.")
fi

if [[ ! -x "$stage_precheck" ]]; then
  failures+=("Stage precheck script must be executable.")
fi

if [[ ! -x "$stage_runner" ]]; then
  failures+=("Stage runner script must be executable.")
fi

if [[ ! -x "$stage_postcheck" ]]; then
  failures+=("Stage postcheck script must be executable.")
fi

if [[ ! -x "$stage_write_scope" ]]; then
  failures+=("Stage write-scope checker script must be executable.")
fi

if [[ ! -x "$stage_guard" ]]; then
  failures+=("Stage guard wrapper script must be executable.")
fi

if [[ ! -x "$stage_strict_check" ]]; then
  failures+=("Stage strict checker script must be executable.")
fi

if [[ ! -x "$stage_packet_create" ]]; then
  failures+=("Stage packet creation script must be executable.")
fi

if [[ ! -x "$stage_one_command" ]]; then
  failures+=("Stage one-command wrapper script must be executable.")
fi

if [[ ! -x "$strict_alias_installer" ]]; then
  failures+=("Strict alias installer script must be executable.")
fi

if [[ ! -f "$stage_output_contract_file" ]]; then
  failures+=("Stage output contract instruction must exist.")
fi

if [[ ! -f "$policy_index_file" ]]; then
  failures+=("Pipeline policy index must exist.")
fi

if [[ ! -f "$allowed_actions_file" ]]; then
  failures+=("Stage allowed-actions instruction must exist.")
fi

if [[ ! -d "$templates_dir" ]]; then
  failures+=("Stage output templates directory must exist.")
fi

check_contains "$templates_dir/5-REQUIREMENTS.template.md" '- **STATUS:** PASS' "Stage 5 template must include STATUS line."
check_contains "$templates_dir/6-ARCHITECTURE-RECOMMENDATIONS.template.md" 'GATE 6: PASS' "Stage 6 architecture template must include gate line."
check_contains "$templates_dir/7-DESIGN-INSTRUCTIONS.template.md" 'GATE 7: PASS' "Stage 7 template must include gate line."
check_contains "$templates_dir/7-DI-QUALITY-CHECKLIST.template.md" '## DI Completeness Checks' "Stage 7 DI quick-check template must include completeness section."
check_contains "$templates_dir/11-TEST-REPORT.template.md" 'GATE 11: PASS' "Stage 11 template must include gate line."
check_contains "$templates_dir/stage-packet.template.json" '"packet_version": "1"' "Stage packet template must define packet_version 1."

for automation_script in "$stage_precheck" "$stage_runner" "$stage_postcheck" "$stage_write_scope" "$stage_guard" "$stage_strict_check" "$stage_packet_create" "$stage_one_command" "$strict_alias_installer" "$pipeline_health"; do
  check_contains "$automation_script" 'ERROR_CODE:' "Automation scripts must emit ERROR_CODE fields: ${automation_script#$repo_root/}"
done

if [[ ${#failures[@]} -gt 0 ]]; then
  echo "FAIL: pipeline-control lint found issues in $repo_root" >&2
  for failure in "${failures[@]}"; do
    echo "- $failure" >&2
  done
  exit 1
fi

echo "PASS: pipeline controls are internally consistent"
