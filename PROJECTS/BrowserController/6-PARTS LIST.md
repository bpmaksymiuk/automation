# Parts List — BrowserController

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10

---

## System Components

## PT-001

- **DESCRIPTION:** Electron main process: window management, IPC handlers for UI-automation communication, settings persistence.
- **TECHNOLOGY RECOMMENDATIONS:** Electron 22+ with `ipcMain`/`ipcRenderer` for IPC, `electron-store` for persisting user settings.
- **NOTES:** Entry point: `main.js`. Manages app lifecycle, menu, and spawns browser context for recording. Single main process; multiple renderer processes (one per window).
- **RELATED:** AR-001

---

## PT-002

- **DESCRIPTION:** Playwright browser automation library: browser launch, context management, page interactions, element location.
- **TECHNOLOGY RECOMMENDATIONS:** `playwright@1.40+` with TypeScript definitions. Use `chromium` as primary engine; `firefox` and `webkit` as fallbacks.
- **NOTES:** Installed via `npm install playwright`. Browser binaries downloaded during first run. Worker pool for parallel execution managed by `piscina` or Node.js Worker Threads.
- **RELATED:** AR-002

---

## PT-003

- **DESCRIPTION:** Script parser and serializer: read/write YAML script files, validate schema, provide object interface to executor.
- **TECHNOLOGY RECOMMENDATIONS:** `js-yaml` library for YAML parsing. Custom `ScriptSchema` TypeScript interface defining script structure (steps array, metadata, assertions).
- **NOTES:** Script file format: `.script` extension. File location: `~/.browsercontroller/scripts/` on Linux/macOS; `%APPDATA%\BrowserController\scripts\` on Windows. Includes version field for backward compatibility.
- **RELATED:** AR-003

---

## PT-004

- **DESCRIPTION:** React UI components for recording and running workflows: buttons, dialogs, script editor, results viewer.
- **TECHNOLOGY RECOMMENDATIONS:** React 18+ with TypeScript. UI library: Material-UI v5+ for accessible, pre-built components. Icons via `@mui/icons-material`.
- **NOTES:** Components: `RecordingView`, `RunningView`, `ScriptEditor`, `ResultsViewer`, `SchedulingDialog`. Build via Webpack bundled into Electron app. Styling: CSS-in-JS via `@mui/system`.
- **RELATED:** AR-007

---

## PT-005

- **DESCRIPTION:** Selector resolution engine: implement four-tier fallback logic (CSS → XPath → ARIA → fuzzy text matching).
- **TECHNOLOGY RECOMMENDATIONS:** `playwright`'s `locator` API for CSS/XPath. Custom fuzzy matching via `fuse.js` (fuzzy search) or `string-distance` (Levenshtein distance).
- **NOTES:** File: `src/selector-resolver.ts`. Configurable timeouts per tier (default: 2s CSS, 3s XPath, 5s ARIA, 10s fuzzy). Returns { selector, strategy, confidence } tuple.
- **RELATED:** AR-004

---

## PT-006

- **DESCRIPTION:** Cron scheduler: trigger script execution at configured intervals; manage job state.
- **TECHNOLOGY RECOMMENDATIONS:** `node-cron` for scheduling. Persist schedules in SQLite database (`better-sqlite3` or `sqlite3`).
- **NOTES:** Database file: `~/.browsercontroller/settings.db`. Job listener process runs in main Electron process, spawning executor as subprocess per run to isolate execution context.
- **RELATED:** AR-006

---

## PT-007

- **DESCRIPTION:** Execution results writer: produce JSON output with action status, extracted data, assertions, logs.
- **TECHNOLOGY RECOMMENDATIONS:** Node.js `fs` (filesystem) for writes. JSON schema defined in TypeScript (`ExecutionResult` interface). Compression via `gzip` for large results (>10 MB).
- **NOTES:** File: `{script-name}-results-{ISO8601-timestamp}.json`. Stored in `~/.browsercontroller/results/`. Includes execution duration, browser version, screenshot paths.
- **RELATED:** AR-005

---

## PT-008

- **DESCRIPTION:** REST API server: expose endpoints for script triggering, result retrieval, settings update.
- **TECHNOLOGY RECOMMENDATIONS:** Express.js 4.x with TypeScript. Middleware: authentication (JWT), CORS, body parsing.
- **NOTES:** Runs on localhost:3200 by default (configurable). Endpoints: `POST /scripts/{id}/run`, `GET /scripts/{id}/results`, `GET /scripts`, `POST /scripts/{id}/schedule`. Webhook callback triggered via `axios` or `node-fetch`.
- **RELATED:** AR-008

---

## PT-009

- **DESCRIPTION:** Encryption utility: AES-256 encryption/decryption for sensitive script data.
- **TECHNOLOGY RECOMMENDATIONS:** Node.js built-in `crypto` module (AES-256-GCM mode). Master key stored in OS keychain via `keytar` library.
- **NOTES:** Encryption is optional; triggered by user checkbox in UI. Encrypted scripts stored with `.encrypted` suffix. Decryption happens at script load time.
- **RELATED:** AR-009

---

## Storage and Configuration

## PT-010

- **DESCRIPTION:** Local filesystem directories for scripts, results, and logs.
- **TECHNOLOGY RECOMMENDATIONS:** OS-standard app data directories (XDG on Linux, Application Support on macOS, AppData on Windows).
- **NOTES:** Hierarchy: `~/.browsercontroller/scripts/` (scripts), `~/.browsercontroller/results/` (JSON results), `~/.browsercontroller/logs/` (execution logs), `~/.browsercontroller/settings.db` (SQLite).
- **RELATED:** AR-003, AR-005

---

## PT-011

- **DESCRIPTION:** Settings database: schedule definitions, alert rules, user preferences.
- **TECHNOLOGY RECOMMENDATIONS:** SQLite 3.x via `better-sqlite3` (sync access, simpler than promise-based drivers).
- **NOTES:** Schema includes tables: `schedules` (script_id, cron_expr, enabled), `alerts` (script_id, rule_type, threshold, channel), `preferences` (key, value). Migrations via custom SQL scripts in `/migrations/` directory.
- **RELATED:** AR-006

---

## Testing and Validation

## PT-012

- **DESCRIPTION:** Integration test suite: verify recording → script generation → execution → result capture workflow.
- **TECHNOLOGY RECOMMENDATIONS:** Jest + Playwright for E2E tests. Mock websites via `msw` (Mock Service Worker) or local test server.
- **NOTES:** Test files: `src/__tests__/recording.spec.ts`, `src/__tests__/execution.spec.ts`. Coverage target: >80% for Selector Resolution Engine and Executor.
- **RELATED:** AR-002, AR-004

---

## CI/CD and Deployment

## PT-013

- **DESCRIPTION:** Docker container for headless execution (alternative to desktop Electron app).
- **TECHNOLOGY RECOMMENDATIONS:** Node.js 18+ alpine base image. Multi-stage build to minimize image size (~300 MB with Playwright). Entry point: REST API server.
- **NOTES:** Dockerfile includes Playwright browser binaries. Exposed port: 3200. Environment variables for configuration (API_KEY, LOG_LEVEL, etc.). Intended for CI/CD pipelines and cloud deployments.
- **RELATED:** AR-002, AR-008

---

## Summary by Tier

| Layer | Components | Technologies |
|-------|-----------|--------------|
| **UI** | PT-001, PT-004 | Electron, React, Material-UI |
| **Automation** | PT-002, PT-005 | Playwright, fuse.js |
| **Scripts & Data** | PT-003, PT-007, PT-010 | js-yaml, Node.js fs |
| **Scheduling** | PT-006, PT-011 | node-cron, SQLite |
| **Integration** | PT-008, PT-009, PT-013 | Express.js, crypto, Docker |
| **Testing** | PT-012 | Jest, Playwright, Mock Service Worker |

---

GATE 6: PASS
