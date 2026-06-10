# Browser Remote Control - SKILL.md

> Cross-cutting utility skill for any stage that needs to operate a running app in a real browser.

---

## When to Use

Use this skill when you need interactive browser control against the app under construction, including:
- Developer implementation checks
- Tester evidence capture and scenario replay
- Any stage that needs click/type/navigation verification

This skill uses a Playwright runtime installed in a directory next to this file:
- Runtime dir: `.github/skills/browser-remote-control/playwright-runtime/`

---

## Runtime Setup

From the project root:

```bash
cd .github/skills/browser-remote-control/playwright-runtime
npm install
npx playwright install chromium
```

---

## Runner Usage

Run a scenario file with optional base URL override:

```bash
cd .github/skills/browser-remote-control/playwright-runtime
node runner.mjs --scenario ./scenarios/smoke-home.json --baseUrl http://localhost:3000 --headed true
```

---

## Scenario File Format

A scenario is JSON with ordered `steps`:

```json
{
  "name": "home smoke",
  "baseUrl": "http://localhost:3000",
  "steps": [
    { "action": "goto", "url": "/" },
    { "action": "waitForSelector", "selector": "body" },
    { "action": "assertText", "text": "Browser" },
    { "action": "screenshot", "path": "home.png" }
  ]
}
```

Supported actions:
- `goto`: `{ "url": "/path" }` or full URL
- `click`: `{ "selector": "..." }`
- `type`: `{ "selector": "...", "text": "..." }`
- `press`: `{ "key": "Enter" }`
- `waitForSelector`: `{ "selector": "..." }`
- `waitForTimeout`: `{ "ms": 500 }`
- `assertText`: `{ "text": "..." }` (checks visible page text)
- `screenshot`: `{ "path": "name.png" }`

---

## Output

- Screenshots go to `playwright-runtime/artifacts/`.
- The runner prints each executed step and exits non-zero on first failure.

---

## Rules

- Do not use this skill as a replacement for Stage 11 formal test case/report artifacts.
- Keep scenarios small and deterministic.
- Always capture at least one screenshot for evidence-producing runs.
