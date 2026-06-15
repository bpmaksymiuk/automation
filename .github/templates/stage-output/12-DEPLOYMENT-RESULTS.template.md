# Deployment Results — [PROJECT NAME] v[VERSION]

- **STATUS:** PASS
- **STATUS UPDATED:** YYYY-MM-DD

---

## Deployment Summary

| Field | Value |
|-------|-------|
| Deployed At | YYYY-MM-DD HH:MM UTC |
| Build ID / Git SHA | [exact identifier] |
| Deploy Target | [host:path or URL] |
| Deployed By | Prod Ops agent |
| Deploy Method | [rsync / scp / docker push / …] |

---

## Pre-flight Checks

| Check | Result | Notes |
|-------|--------|-------|
| Stage 11 release recommendation | PASS / FAIL | [go / no-go / conditional] |
| All blocking/critical bugs resolved | PASS / FAIL | |
| `.env.deploy` populated | PASS / FAIL | |
| `deploy.sh` executable | PASS / FAIL | |
| SSH connectivity to target | PASS / FAIL | |
| Smoke spec present at `11-TESTS/playwright.smoke.config.mjs` | PASS / FAIL | |

---

## Deployment Steps Executed

1. [Step 1 and outcome]
2. [Step 2 and outcome]
3. [Step 3 and outcome]

---

## Post-Deploy Smoke Tests

| Test | URL / Path | HTTP Status | Screenshot | Result |
|------|------------|-------------|------------|--------|
| [Smoke test name] | [URL] | [200] | [path or link] | PASS / FAIL |

**Smoke run command:**
```
npx playwright test --config=11-TESTS/playwright.smoke.config.mjs
```

**Smoke run result:** PASS / FAIL

---

## Live URL

**Production URL:** [https://…]

---

## Rollback Plan

[How to revert to the previous version if needed.]

```
[Rollback command or procedure]
```

---

## Issues Discovered Post-Deploy

[Any issues found after deployment that were not caught during Stage 11.]

_None_ (if no issues)

---

GATE 12: PASS
