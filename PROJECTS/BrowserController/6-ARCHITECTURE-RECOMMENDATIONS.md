# Stage 6 Architecture Recommendations

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10

---

## OVERALL ARCHITECTURE SUMMARY

BrowserController is a cross-platform, code-free browser automation tool designed for QA engineers, data engineers, and non-technical users. The architecture employs a **client-side rendering model with a Node.js + Electron desktop application** paired with a **Playwright-based browser automation engine** and a **declarative YAML script format** for human-readable workflow versioning. This design prioritizes accessibility (no code required), reliability (auto-correcting selectors), and maintainability (scripts are durable version-control artifacts).

### Technology Stack Overview

The system divides into four major layers:

1. **User Interface Layer (Electron):** Cross-platform desktop application providing a graphical interface for recording and running workflows. Electron enables native browser integration for recording mode without requiring Chrome DevTools Protocol expertise from end-users.

2. **Automation Engine Layer (Playwright + Selector Strategies):** Uses Playwright for headless and headed browser automation with a four-tier selector fallback strategy (CSS → XPath → ARIA role-based → fuzzy text matching) that enables scripts to survive page structure changes without manual maintenance.

3. **Script and Data Layer (YAML + File Storage):** Scripts are stored as human-readable YAML files compatible with version control (Git), allowing teams to track workflow changes and collaborate using standard development practices. Execution results are logged as JSON for CI/CD integration and programmatic access.

4. **Scheduling & Integration Layer (Node.js Cron + Webhooks):** Scheduled execution support via `node-cron` enables monitoring workflows to run unattended. Webhooks and REST APIs expose script execution for CI/CD pipelines and third-party integrations.

### Use Case Coverage

**UC-001 (Recording):** Electron UI captures browser events (click, fill, navigate, wait) in real-time. Playwright's inspector integration validates selectors immediately. Recorded actions are converted to YAML steps with plain-language descriptions and persisted as `.script` files.

**UC-002 (Running):** The Playwright executor loads a YAML script and executes each step sequentially. Headless mode runs in CI/CD pipelines; headed mode aids debugging. Pass/fail status and extracted data are returned as JSON.

**UC-003 (Scraping):** Recording captures multi-page navigation (clicks, pagination, filtering). Extracted data is mapped to structured fields and output as JSON or CSV. The executor handles dynamic content via configurable wait conditions.

**UC-004 (Failure Recovery):** When a selector fails during execution, the Selector Resolution Engine automatically tries alternatives in priority order. On success, the corrected selector is persisted back to the YAML file, ensuring subsequent runs use the optimized path.

**UC-005 (Non-Technical Access):** Electron UI hides complexity behind intuitive buttons and dialogs. Scripts are displayed in plain language ("Click button 'Submit'") with technical selectors hidden by default. Results are shown as data tables and pass/fail badges, not JSON or logs.

**UC-006 (Monitoring):** Node.js cron scheduler triggers script execution at configured times. Results are logged with timestamps for historical analysis. Anomaly rules and failure alerts are configured via UI and persisted in a settings file.

**UC-007 (Integration Testing):** YAML scripts support assertion syntax ("assert text == 'Order Confirmed'"). The executor evaluates assertions and fails the run if any assertion does not pass. Results include assertion status and actual vs. expected values for CI/CD reporting.

### Major System Boundaries

- **Recording Boundary:** Electron IPC (inter-process communication) bridges the UI process and a headless Playwright browser session, capturing events without coupling the UI to Chrome internals.
- **Execution Boundary:** The Executor isolates script execution context from the UI, enabling headless runs and concurrent execution support.
- **Storage Boundary:** YAML scripts and JSON results are persisted to the local filesystem, with optional encryption for sensitive data.
- **Integration Boundary:** REST APIs and webhooks enable external systems (CI/CD, monitoring platforms) to trigger and consume script results.

### Top Architectural Risks and Mitigations

1. **Risk: Selector brittleness causing long-term script maintenance burden.**
   - *Mitigation:* Four-tier selector strategy (CSS → XPath → ARIA → fuzzy) with automatic correction persistence ensures scripts adapt to minor page changes without intervention. Extensive testing against real-world site variations validates strategy effectiveness.

2. **Risk: Performance degradation in headless mode under CI/CD load.**
   - *Mitigation:* Playwright is optimized for headless execution. Resource pooling (browser instance reuse) and timeout tuning prevent cascading failures. Load testing during Stage 11 validates CI/CD suitability.

3. **Risk: Non-technical users struggle to debug failures without code access.**
   - *Mitigation:* Execution logs use plain language ("Element button 'Search' not found") and include last screenshot. Failure recovery attempts are logged visually (see strategy tried, why it failed, what was attempted next).

---

## Architecture Records

## AR-001

- **DECISION:** Desktop application framework: Electron (Node.js + Chromium).
- **RATIONALE:** Electron provides cross-platform (Windows, macOS, Linux) distribution with native browser integration, essential for non-technical users who need to record browser interactions without terminal access. Alternatives considered: (1) Web-only app—loses local automation capability; (2) Native Swift/C#—fragmented across platforms. Electron balances reach, capability, and maintainability. Uses Electron 22+ for stability.
- **UC REFERENCES:** UC-001, UC-005
- **NOTES:** Requires ~150 MB disk footprint per installation. Auto-updates via electron-updater.
- **RELATED:** BR-019, BR-020, PT-001

---

## AR-002

- **DECISION:** Browser automation library: Playwright (Node.js).
- **RATIONALE:** Playwright supports headless and headed modes, multiple browser engines (Chromium, Firefox, WebKit), and reliable element location via robust selectors and retry logic. Alternatives: (1) Selenium—lower-level API, requires manual retry logic; (2) Puppeteer—headless-only, Chromium-only, lower-level. Playwright's built-in auto-wait and cross-browser support reduce script brittleness and testing burden. Version: 1.40+.
- **UC REFERENCES:** UC-001, UC-002, UC-004
- **NOTES:** Requires browser binary installation (~100 MB per browser). Supports parallel execution via worker pools.
- **RELATED:** BR-006, BR-007, BR-015, PT-002

---

## AR-003

- **DECISION:** Script format: Declarative YAML with step-based actions.
- **RATIONALE:** YAML is human-readable and widely supported in version control. Step-based structure maps directly to user intent (click → fill → navigate) without code. Alternatives: (1) JSON—valid but less human-friendly; (2) DSL/custom format—requires custom parser. YAML with a fixed schema (action type, selector, data, wait condition) balances readability and machine-parseable structure. Schema documented in Stage 7.
- **UC REFERENCES:** UC-001, UC-002, UC-005
- **NOTES:** File extension: `.script` (e.g., `login-flow.script`). Includes metadata (name, tags, created date) and assertion list.
- **RELATED:** BR-003, BR-021, PT-003

---

## AR-004

- **DECISION:** Selector resolution strategy: four-tier fallback (CSS → XPath → ARIA-based → fuzzy text matching).
- **RATIONALE:** Page structure changes are inevitable. Playwright's default selector strategy (strict CSS) fails on minor DOM variations. A fallback chain enables long-lived scripts. Tier 1 (CSS) is fastest; Tier 4 (fuzzy text) is slowest but most resilient. Alternatives: (1) Manual selector maintenance—not scalable; (2) Single strategy—brittle. The four-tier approach is validated by Selenium IDE and Playwright's own recommendations. Fallback logic is configurable (timeout per tier, success criteria).
- **UC REFERENCES:** UC-004, UC-006
- **NOTES:** Fuzzy matching uses Levenshtein distance with configurable threshold (default 0.8). Corrected selectors are persisted to YAML file for subsequent runs.
- **RELATED:** BR-015, BR-016, BR-027, PT-005

---

## AR-005

- **DECISION:** Data extraction and result format: JSON schema with timestamped entries.
- **RATIONALE:** JSON is machine-parseable and integrates with CI/CD systems (GitHub Actions, Jenkins, etc.). Timestamped entries enable trend analysis. Alternatives: (1) CSV—row-oriented, less flexible for nested data; (2) Database—adds deployment complexity. JSON files stored in the project filesystem enable version control and local analysis.
- **UC REFERENCES:** UC-002, UC-003, UC-006, UC-007
- **NOTES:** Result file: `{script-name}-results-{timestamp}.json`. Includes action status, extracted data, assertion results, and execution logs.
- **RELATED:** BR-008, BR-009, BR-024, PT-007

---

## AR-006

- **DECISION:** Scheduling: Node.js cron jobs stored in settings file; persistent via SQLite.
- **RATIONALE:** Node.js `node-cron` is lightweight and cross-platform. Cron expressions are industry-standard. Settings stored in SQLite (not filesystem) enable complex rules (anomaly thresholds, alert channels) without file proliferation. Alternatives: (1) External scheduler (systemd, Windows Task Scheduler)—OS-specific; (2) Webhook-only—requires external trigger infrastructure. Node.js cron keeps the tool self-contained.
- **UC REFERENCES:** UC-006
- **NOTES:** Supports standard cron expressions (e.g., `0 9 * * MON-FRI` for weekday 9 AM). Missed runs during offline periods are not backfilled.
- **RELATED:** BR-023, PT-006

---

## AR-007

- **DECISION:** Non-technical UI: Plain-language action descriptions in UI; technical selectors in collapsible sections.
- **RATIONALE:** Non-technical users (UC-005) should not see CSS or XPath. Actions rendered as "Click button 'Search'" not `click(selector: ".header > button.search")`. Collapsible sections expose selectors for power users. Alternatives: (1) Hide selectors entirely—loses debugging capability; (2) Show all details by default—overwhelming. Collapsible sections offer progressive disclosure.
- **UC REFERENCES:** UC-005
- **NOTES:** Implemented via React component with toggle. Selector details shown only after user expands section.
- **RELATED:** BR-021, BR-022, PT-004

---

## AR-008

- **DECISION:** Alerting and integration: REST API endpoints for script execution; webhook callbacks for results.
- **RATIONALE:** CI/CD integration (UC-007, UC-006) requires programmatic access. REST API enables external systems to trigger runs and fetch results. Webhooks notify external systems asynchronously (e.g., send to Slack on failure). Alternatives: (1) CLI-only—requires CLI parsing; (2) Database polling—fragile. REST + webhooks are standard and widely supported.
- **UC REFERENCES:** UC-006, UC-007
- **NOTES:** Endpoints: POST `/scripts/{id}/run`, GET `/scripts/{id}/results`. Webhook URL configured in script settings.
- **RELATED:** BR-025, PT-008

---

## AR-009

- **DECISION:** Security: Optional script encryption using AES-256; no plaintext credential storage in scripts.
- **RATIONALE:** Scripts may be committed to Git with sensitive URLs or data. Optional encryption protects confidentiality. Credentials (passwords) must not be embedded in YAML; instead, scripts reference environment variables or vault services. Alternatives: (1) No encryption—credential exposure risk; (2) Mandatory encryption—adds UI/performance overhead. Optional encryption balances security and usability.
- **UC REFERENCES:** UC-005
- **NOTES:** Encryption uses Node.js `crypto` module. Master key stored securely (OS keychain integration planned for Stage 10).
- **RELATED:** BR-NF-SECURITY, PT-009

---

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Selector fallback times out too frequently in production, causing slow execution | Medium | High | Load test with 1000+ real websites; tune timeout thresholds per tier during Stage 11. Implement metrics dashboard to track fallback frequency. |
| Concurrent script execution causes race conditions or port conflicts | Medium | High | Use worker pool with isolated browser contexts per job. Test concurrent runs during Stage 11 with 10+ parallel scripts. |
| Non-technical users struggle to set up automated scheduling | Medium | Medium | Provide UI wizard for common patterns (daily at 9 AM, hourly). Include email/Slack alert templates. Document in user guide (Stage 8). |
| Electron app becomes slow as user collects many scripts over time | Low | Medium | Implement lazy loading for script list; archive old results. Benchmark with 1000+ scripts during Stage 10. |
| YAML schema evolves, breaking backward compatibility with old scripts | Medium | Medium | Version script schema field; support migration for 2+ major versions. Document schema changes in release notes. |

---

GATE 6: PASS
