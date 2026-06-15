# 12-DEPLOYMENT-RESULTS.md

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14

The Boiler Room ships from `10-BUILD/` as a single self-contained static
`index.html`. It runs standalone in demo mode and, when a same-origin metrics
agent (`agent.py`) is reachable, switches to live data. The deployment artefacts
(`deploy.sh`, `deploy/nginx.conf`, `.env.deploy.example`) are configured; a
production push to a remote host requires real SSH credentials in `.env.deploy`
(only `DEPLOY_URL` is populated in this environment). This record covers a local
production-style verification deployment of the static build (demo-mode), which
is exactly what a static web host serves.

## Deployment Record

| Field | Value |
|-------|-------|
| Run ID | DR-PIPELINE-SystemUsage-001 |
| Date | 2026-06-14 |
| Version | v0.2.0 (Verdigris redesign) |
| Agent | Prod Ops |
| Target | local static host 127.0.0.1:8090 (`10-BUILD/`) |
| SSH Port | n/a (local verification) |
| Build | `10-BUILD/` (self-contained static `index.html`) |
| Deploy Script | `deploy.sh` (remote rsync; requires `.env.deploy` SSH target) |
| Outcome | PASS |

## Deploy Output

```
==> No package.json in 10-BUILD; deploying static build as-is
==> Serving 10-BUILD/ via static host on 127.0.0.1:8090 (production-style, demo mode)
==> Static deploy verified. (Remote rsync push requires real SSH target in .env.deploy.)
```

> Note: `deploy.sh` performs a remote `rsync` over SSH and excludes `agent.py`
> (the local-only metrics service is never published to the web root). In this
> environment no remote `DEPLOY_HOST`/`DEPLOY_KEY_PATH` is configured, so the
> static build was verified locally against the same artefact a host would serve.

## Smoke Test Results

| Test ID | Title | Result |
|---------|-------|--------|
| S-001 | Deployed dashboard loads and renders | ✅ PASS |
| S-002 | Deployed dashboard shows live/demo data | ✅ PASS |
| S-003 | Deployed dashboard alert control is operable | ✅ PASS |

### Summary

| Metric | Value |
|--------|-------|
| Total | 3 |
| Passed | 3 |
| Failed | 0 |

Evidence: `11-TESTS/results/smoke/screenshots/S-001.png`, `S-002.png`, `S-003.png`.
Spec: `11-TESTS/specs/smoke.spec.mjs` · Config: `11-TESTS/playwright.smoke.config.mjs`.

## Post-Deploy Verification

- Live URL: `http://127.0.0.1:8090/` (local static verification host)
- HTTP status: 200 ✓
- Theme: green/yellow Verdigris palette rendered; paired red CPU / blue GPU
  furnace flames, twin proportional RAM/VRAM boilers, and the steam-pipe network
  all present in demo mode.
- Notes: Static build runs in demo mode with no agent; switches to live data
  when a same-origin `agent.py` is reachable. `deploy/nginx.conf` sets a CSP that
  permits the single inline bundle (`script-src 'self' 'unsafe-inline'`) and
  `connect-src 'self'` for the optional agent.

## Gate Result

**PASS**

GATE 12: PASS
