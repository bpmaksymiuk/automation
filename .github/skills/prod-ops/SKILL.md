---
name: prod-ops
description: "Deployment and post-deploy smoke testing for pipeline products. Use when: deploying a build to production, running smoke tests against the live URL, maintaining deploy.sh or nginx.conf, writing 12-DEPLOYMENT-RESULTS.md, diagnosing post-deploy failures."
---

# Prod Ops

Deploys the production build to the live server and verifies it with post-deploy Playwright smoke tests. Produces `12-DEPLOYMENT-RESULTS.md`.

## Skill Contents

```
prod-ops/
  SKILL.md                       ← this file
  templates/
    deploy.sh                    ← canonical deploy script (copy to project root)
    nginx.conf                   ← nginx SPA config template
    .env.deploy.example          ← env var template (copy to .env.deploy, fill values, never commit)
```

> **Security:** `.env.deploy` must never be committed. Add it to `.gitignore`. The `.env.deploy.example` in `templates/` contains placeholder values only.

## Setup for a New Project

```bash
# 1. Copy templates to the project root
cp .github/skills/prod-ops/templates/deploy.sh   PROJECTS/<APP>/deploy.sh
cp .github/skills/prod-ops/templates/nginx.conf  PROJECTS/<APP>/deploy/nginx.conf
cp .github/skills/prod-ops/templates/.env.deploy.example  PROJECTS/<APP>/.env.deploy
chmod +x PROJECTS/<APP>/deploy.sh

# 2. Fill in .env.deploy (never commit this file)
# 3. Add .env.deploy to .gitignore
```

Always derive the smoke target from `.env.deploy`. Set `DEPLOY_URL` there and use it for post-deploy verification instead of hardcoding a production URL inside the skill or smoke workflow.

## When to Use

- On every production deployment
- When re-deploying after a hotfix
- When the live site needs verification

---

## Deployment Inputs

Populate `.env.deploy` in the project root with at least these fields:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DEPLOY_USER` | Yes | SSH user for the deployment target |
| `DEPLOY_HOST` | Yes | SSH host name or IP |
| `DEPLOY_PORT` | No | SSH port; defaults to `22` |
| `DEPLOY_PATH` | Yes | Remote destination directory for the deployed files |
| `DEPLOY_KEY_PATH` | Yes | Private key used by `ssh` and `rsync` |
| `DEPLOY_URL` | Yes | Live URL or live subpath used for smoke verification |
| `BUILD_DIR` | No | Override when the build root is not `10-BUILD/` |
| `DIST_DIR` | No | Override when deployment should publish something other than `10-BUILD/dist/` |

The generic `deploy.sh` template defaults to `10-BUILD/` and automatically falls back to the raw build directory when no `dist/` exists. Use `BUILD_DIR` or `DIST_DIR` only when a project truly differs from that default pipeline layout.

---

## Constraints

- Do not hard-code secrets, credentials, or SSH private keys in any committed file.
- Do not modify Tester-owned shared smoke specs without Tester review.
- `.env.deploy` must never be committed — add to `.gitignore`.
- Do not hard-code the smoke target in the skill or automation when `DEPLOY_URL` exists in `.env.deploy`.

---

## Deployment Procedure

### 1. Pre-flight checks

```bash
cd PROJECTS/<APP>

# Verify .env.deploy exists and exposes the required deployment target
set -a
source .env.deploy
set +a
: "${DEPLOY_USER:?DEPLOY_USER not set}"
: "${DEPLOY_HOST:?DEPLOY_HOST not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH not set}"
: "${DEPLOY_KEY_PATH:?DEPLOY_KEY_PATH not set}"
: "${DEPLOY_URL:?DEPLOY_URL not set}"

# Verify SSH key has correct permissions
ls -la "$DEPLOY_KEY_PATH"
chmod 600 "$DEPLOY_KEY_PATH"

# Test SSH connectivity with the configured target
ssh -i "$DEPLOY_KEY_PATH" -p "${DEPLOY_PORT:-22}" -o ConnectTimeout=10 "${DEPLOY_USER}@${DEPLOY_HOST}" "echo SSH OK"
```

### 2. Run the deploy script

```bash
bash deploy.sh
```

The script will:
1. Run `npm run build` inside `10-BUILD/` when that directory contains a `package.json`
2. Use `10-BUILD/dist/` when it exists, or fall back to the raw build directory when the project is already static
3. `rsync` the deployable output to `DEPLOY_USER@DEPLOY_HOST:DEPLOY_PATH` over the configured SSH port
3. Print "Deploy complete." on success

If the target requires a non-standard SSH port, set `DEPLOY_PORT` in `.env.deploy`. Do not hard-code a project-specific port in the generic template.

### 3. Verify live site is reachable

```bash
curl -sf -o /dev/null -w "%{http_code}" "$DEPLOY_URL"
# expect: 200
```

---

## Post-Deploy Smoke Tests

Run the existing Playwright spec against the live URL using the smoke test config. No webServer is started — the live site is the target.

```bash
cd PROJECTS/<APP>/10-TESTS
DEPLOY_URL="$DEPLOY_URL" npx playwright test --config=playwright.smoke.config.mjs 2>&1
```

The smoke config should read `DEPLOY_URL` from the environment or a project-local wrapper that sources `.env.deploy`. Do not hard-code the production URL in a shared skill or shared smoke workflow.

### Subpath Deployments and Shared Specs

If the live application is deployed under a path such as `/fishtank/` and the shared spec uses `page.goto('/')`, do not point Playwright `baseURL` directly at the subpath and assume the browser will stay there. Playwright resolves `page.goto('/')` to the origin root. In that case, keep the Tester-owned spec unchanged and run prod-ops smoke through a lightweight local proxy rooted at `/` that forwards `/` and root-relative asset requests to `DEPLOY_URL` with browser-style headers. This preserves shared-spec compatibility and avoids shared-hosting `406 Not Acceptable` responses to non-browser-like requests.

The smoke config (`11-TESTS/playwright.smoke.config.mjs`) should set:
- `baseURL` from `process.env.DEPLOY_URL` or equivalent project-local sourcing
- No `webServer` block when the live site is already running
- Screenshot capture enabled for smoke evidence

Run only the smoke suite relevant to the current project. File-system checks remain valid when they examine deploy artefacts generated inside the same project root.

---

## Output: 12-DEPLOYMENT-RESULTS.md

Create or update `12-DEPLOYMENT-RESULTS.md` using this schema:

```markdown
# 12-DEPLOYMENT-RESULTS.md

## Deployment Record

| Field | Value |
|-------|-------|
| Run ID | DR-PIPELINE-<APP>-<NNN> |
| Date | YYYY-MM-DD |
| Version | v<semver from 10-RELEASE-NOTES.md> |
| Agent | Prod Ops |
| Target | <user>@<host>:<path> |
| SSH Port | <DEPLOY_PORT or 22> |
| Build | <deploy source dir> |
| Deploy Script | deploy.sh |
| Outcome | PASS / FAIL |

## Deploy Output

<paste of deploy.sh stdout>

## Smoke Test Results

| Test ID | Title | Result |
|---------|-------|--------|
| T-001 | … | ✅ PASS / ❌ FAIL |
…

### Summary

| Metric | Value |
|--------|-------|
| Total | N |
| Passed | N |
| Failed | N |

## Post-Deploy Verification

- Live URL: <DEPLOY_URL>
- HTTP status: 200 ✓
- Notes: …

## Gate Result

**PASS** or **FAIL**
```

Each deployment appends a new `## Deployment Record` section. `12-DEPLOYMENT-RESULTS.md` is append-only; do not delete or overwrite prior entries.

---

## Maintaining the Playwright Spec

The smoke spec family under `11-TESTS/specs/` is shared between Stage 11 (Tester, usually against localhost) and prod-ops (against the live URL). Prod Ops may propose changes to shared smoke coverage when:
- New pages or routes are added
- A production-only failure reveals a missing test case

Any proposed changes must be reviewed by the Tester before being merged. The spec must remain passing against both localhost and the live URL.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Connection timed out` on the SSH port | Firewall, wrong port, or host unreachable | Verify `DEPLOY_PORT`, SSH rules, and reachability to `DEPLOY_HOST` |
| `Permission denied (publickey)` | Key not authorised or wrong permissions | `chmod 600 "$DEPLOY_KEY_PATH"`; confirm the server authorises that key |
| `rsync: connection unexpectedly closed` | SSH succeeds but rsync fails | Check remote path exists; check disk quota |
| Smoke tests fail with `net::ERR_CONNECTION_REFUSED` | Site not reachable | Check nginx is running; verify deploy path |
| `dist/index.html` not found | Build output path differs from the template default | Set `DIST_DIR` in `.env.deploy` or update the project build so the deploy script can locate the output |
| 404 on refresh (SPA routes) | nginx SPA fallback missing | Verify `try_files $uri $uri/ /index.html` in `nginx.conf` |
| Smoke tests on a subpath app open the site root instead of the deployed app | Shared spec uses `page.goto('/')`, which resolves to `/` at the origin root | Put a prod-ops-owned local proxy in front of the live subpath and point smoke `baseURL` at the local proxy root |
| Smoke proxy or curl receives `406 Not Acceptable` | Upstream filtering rejected non-browser-like headers | Normalize forwarded headers to a browser-like `User-Agent` plus `Accept-Language` before proxying to the live site |

---

## Exit Gate

- [ ] `deploy.sh` ran to completion without error.
- [ ] Live URL returns HTTP 200.
- [ ] All smoke tests PASS (or failures are documented in `12-DEPLOYMENT-RESULTS.md` with Root Cause).
- [ ] `12-DEPLOYMENT-RESULTS.md` has been appended with a new Deployment Record (append-only).
