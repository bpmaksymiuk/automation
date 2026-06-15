# Stage 6 Architecture Recommendations — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Architect
- **SOURCE INPUTS:** 2-USE-CASES.md, 5-REQUIREMENTS.md

## OVERALL ARCHITECTURE SUMMARY

The Boiler Room is a **two-part local application**: a small **Python metrics agent** and a **single self-contained HTML client**. The agent uses **Python 3 standard-library `http.server`** plus **`psutil`** (the only third-party dependency) to read CPU, GPU-adjacent, memory, disk, and network metrics and serve them. The client is one `index.html` containing inlined HTML, CSS, and vanilla JavaScript that renders the steampunk boiler room with the native **Canvas 2D API** (particles, flames, bubbles, charts) and **inline SVG/CSS** (gauges, tanks, frames). The visual system is driven by CSS custom properties so the green/amber boiler-room palette can be applied consistently across the main scene, overlays, and text while preserving contrast. This stack is chosen for three core quality attributes: **zero runtime third-party client dependencies** (everything inlined, works offline - satisfies the "no CDN/fonts at runtime" constraint), **real-time fidelity** (Server-Sent Events push sub-2-second updates with built-in reconnection), and **portability/testability** (the client runs even with no agent via a built-in demo simulator, so it can be opened as a static file and tested headlessly).

The system has four boundaries. (1) **Collection** - the agent samples `psutil` on a fixed cadence. (2) **Transport** - the agent exposes `GET /api/metrics` (one-shot JSON snapshot) and `GET /api/stream` (SSE event stream); it also serves the static `index.html`. (3) **State & rendering** - the client maintains a rolling in-memory history buffer, user thresholds and preferences in `localStorage`, and a `requestAnimationFrame` render loop. (4) **Presentation** - the six panels, overlays, alarms, and notifications. The client is data-source-agnostic: a small `DataSource` abstraction tries SSE first, falls back to JSON polling, and finally to the demo simulator, exposing the connection state (live/demo/disconnected) required by BR-004.

Every use case is enabled as follows. **UC-001/UC-002** (single live page): a CSS Grid one-viewport layout fed by SSE at <= 2 s (BR-001..005). **UC-003** (CPU furnace): `psutil.cpu_percent(percpu=True)` drives the SVG gauge and per-core Canvas flames with glow scaled to load (BR-006..008). **UC-004** (GPU forge): optional GPU sampling via NVML/`nvidia-smi` when present, otherwise a graceful "GPU not available" state (BR-009..011). **UC-005** (memory boiler): `virtual_memory()`/`swap_memory()` drive a Canvas liquid tank whose vessel size is proportional to true capacity and whose boil intensifies past a threshold (BR-012..014, BR-037). **UC-006** (disk tanks): `disk_partitions()`/`disk_usage()`/`disk_io_counters()` per mount drive the surface-mounted disk pipe run and tank fills (BR-015..017, BR-038). **UC-007** (network pipes): `net_io_counters()` deltas drive Canvas particle flow and a rolling 60 s chart, with the pipe network terminated in a labelled network box (BR-018..020, BR-038). **UC-008** (top processes): `process_iter()` sorted by CPU and memory feeds the adjacent tables (BR-021..024). **UC-009/UC-010** (thresholds & alerts): client-side threshold state in `localStorage` re-colours zones, raises panel alarm states and indicator lamps, and fires the optional `Notification` API (BR-025..031). **UC-011** (mobile): a `@media (max-width:768px)` single-column reflow with touch-operable range inputs (BR-032..033). **UC-012** (tooltips): pointer/touch handlers reveal exact values (BR-034). **UC-013** (reduced motion): `prefers-reduced-motion` plus an in-app toggle gate the animation loop (BR-035..036). **BR-039** is carried by the CSS custom-property palette system that keeps the green primary / yellow-amber accent scheme consistent across all panels and text.

The top architectural risks are: **(R1) Animation performance** - many simultaneous Canvas effects could drop frames on weak hardware; mitigated by a single shared `requestAnimationFrame` loop, capped particle counts, and a reduced-motion path that halts decorative animation while data keeps updating. **(R2) Cross-platform/optional GPU** - GPU metrics are not uniformly available; mitigated by treating GPU as optional with explicit graceful-absence handling and Linux-first scope. **(R3) Security of local system access** - the agent exposes system data over HTTP; mitigated by binding to `127.0.0.1` by default, serving read-only data, never embedding secrets in the client, and inserting dynamic values as text (not raw HTML) to avoid injection.

> Sources: psutil API reference (https://psutil.readthedocs.io/en/latest/), Python `http.server` docs (https://docs.python.org/3/library/http.server.html), MDN Server-Sent Events (https://developer.mozilla.org/docs/Web/API/Server-sent_events), MDN Canvas API (https://developer.mozilla.org/docs/Web/API/Canvas_API), MDN Notifications API (https://developer.mozilla.org/docs/Web/API/Notifications_API).

## Architecture Records

## AR-001

- **DECISION:** Implement the agent as a single Python 3 script using `http.server.ThreadingHTTPServer` (standard library) to serve metrics and the static client.
- **RATIONALE:** Avoids a heavyweight web framework for a localhost single-user tool, keeping install to "Python + one pip package". Alternative considered: **Flask/FastAPI** - rejected for v1 because it adds dependencies and a server runtime without benefit at this scale. Alternative considered: **Node.js/Express** - rejected to keep a single language aligned with `psutil`.
- **UC REFERENCES:** UC-001, UC-002
- **NOTES:** Requires Python 3.8+. Threaded server so the SSE stream does not block snapshot/static requests.
- **RELATED:** BR-003, BR-005; PT-001, PT-002

## AR-002

- **DECISION:** Use `psutil` for CPU (incl. per-core), memory, swap, disk capacity/IO, network IO, and process enumeration.
- **RATIONALE:** Single cross-platform library covering every required metric, mature and widely used. Alternative considered: **reading `/proc` and `/sys` directly** - rejected as more code and less portable; `psutil` wraps these efficiently. Alternative considered: **Glances as a backend** - rejected to avoid an extra service layer.
- **UC REFERENCES:** UC-003, UC-005, UC-006, UC-007, UC-008
- **NOTES:** GPU is not covered by psutil; see AR-003. License: BSD-3-Clause.
- **RELATED:** BR-006, BR-007, BR-012, BR-013, BR-015, BR-016, BR-018, BR-021, BR-022, BR-023; PT-002

## AR-003

- **DECISION:** Sample GPU utilisation/VRAM via `nvidia-smi` (queried as a subprocess) when available; otherwise report GPU as unavailable.
- **RATIONALE:** `nvidia-smi` ships with NVIDIA drivers and needs no extra Python package; querying it as a subprocess keeps the dependency optional. Alternative considered: **`pynvml`/`nvidia-ml-py`** - viable but adds a dependency and only covers NVIDIA; deferred. Alternative considered: **vendor-agnostic GPU libs** - immature; rejected for v1.
- **UC REFERENCES:** UC-004
- **NOTES:** Absence of a GPU/`nvidia-smi` must not error; agent emits `gpu: {available:false}`.
- **RELATED:** BR-009, BR-010, BR-011; PT-002

## AR-004

- **DECISION:** Push metrics to the client via SSE (`text/event-stream`) on `/api/stream`; the client falls back to polling `/api/metrics`, then to a built-in demo simulator.
- **RATIONALE:** SSE is one-directional server->client (exactly the need), runs over plain HTTP, and auto-reconnects - simpler than WebSockets here. Alternative considered: **WebSocket** - rejected as bidirectional capability is unneeded and adds complexity. Alternative considered: **plain polling only** - rejected as the primary path because SSE gives smoother sub-2 s updates; retained as fallback.
- **UC REFERENCES:** UC-001, UC-002
- **NOTES:** Demo simulator guarantees a working UI with no agent (BR-005) and drives headless tests.
- **RELATED:** BR-002, BR-003, BR-004, BR-005; PT-003, PT-004

## AR-005

- **DECISION:** Ship one `index.html` with all HTML, CSS, JS, and SVG inlined; no external fonts or CDN at runtime.
- **RATIONALE:** Meets the offline/self-contained constraint and makes deployment a single static file. Alternative considered: **a bundler (Vite/webpack) with split assets** - rejected as overkill for one page and would add a build step. Alternative considered: **framework (React)** - rejected; vanilla JS keeps the file dependency-free and small.
- **UC REFERENCES:** UC-001, UC-011, UC-012
- **NOTES:** System font stack used; no webfont fetch.
- **RELATED:** BR-001, BR-032, BR-034, BR-NF-SECURITY; PT-003

## AR-006

- **DECISION:** Render particles, per-core flames, liquid boil, and rolling charts with the Canvas 2D API; render gauges, tanks, frames, and lamps with inline SVG and CSS.
- **RATIONALE:** Canvas is efficient for many moving primitives (particles/bubbles); SVG/CSS is crisp and accessible for static structural shapes and easy to query in tests. Alternative considered: **WebGL** - rejected as unnecessary GPU complexity for 2D effects. Alternative considered: **a charting library (Chart.js)** - rejected to avoid a runtime dependency; a small custom canvas chart suffices.
- **UC REFERENCES:** UC-003, UC-005, UC-007
- **NOTES:** One shared `requestAnimationFrame` loop; particle counts capped for low-power hardware.
- **RELATED:** BR-008, BR-014, BR-019, BR-020, BR-037, BR-038, BR-NF-PERFORMANCE; PT-005, PT-006

## AR-007

- **DECISION:** Store user thresholds, notification toggles, and the reduced-motion preference in `localStorage`; evaluate alarm state on the client each refresh; fire desktop alerts via the Web `Notification` API when permitted.
- **RATIONALE:** Per-user settings belong on the client and must survive reload without a backend datastore. Alternative considered: **server-side settings storage** - rejected as unnecessary for a single local user and would complicate the stateless agent. Alternative considered: **cookies** - rejected; `localStorage` is simpler for structured settings.
- **UC REFERENCES:** UC-009, UC-010, UC-013
- **NOTES:** Email/webhook delivery is best-effort/optional and out of the critical path.
- **RELATED:** BR-025, BR-026, BR-027, BR-028, BR-029, BR-030, BR-031, BR-035, BR-036; PT-007

## AR-008

- **DECISION:** Lay out the six panels with CSS Grid in one viewport on desktop and a single column at <=768px; gate decorative animation behind `prefers-reduced-motion` and an in-app toggle; use range inputs for thresholds.
- **RATIONALE:** CSS Grid gives a robust non-scrolling cockpit that reflows cleanly; native range inputs are keyboard- and touch-operable for free. Alternative considered: **absolute positioning** - rejected as brittle across viewport sizes. Alternative considered: **flexbox-only** - workable but Grid expresses the fixed cockpit better.
- **UC REFERENCES:** UC-001, UC-011, UC-012, UC-013
- **NOTES:** Body text colours chosen for >=4.5:1 contrast on the dark ground.
- **RELATED:** BR-001, BR-032, BR-033, BR-034, BR-035, BR-039, BR-NF-ACCESSIBILITY; PT-003, PT-008

## AR-009

- **DECISION:** Bind the agent to `127.0.0.1` by default, serve only read-only metric data, embed no secrets in the client, and insert all dynamic values as text nodes.
- **RATIONALE:** Minimises exposure of system telemetry and eliminates injection vectors. Alternative considered: **bind to `0.0.0.0` for LAN access** - rejected as default for safety; can be an explicit opt-in later.
- **UC REFERENCES:** UC-001
- **NOTES:** No authentication needed while loopback-only.
- **RELATED:** BR-NF-SECURITY; PT-001

## Risks And Mitigations

- **R1 - Animation performance on low-power hardware.** Mitigation: single shared rAF loop, capped particle/bubble counts, and a reduced-motion path that halts decorative animation while data updates (AR-006, AR-008).
- **R2 - Optional/absent GPU and cross-platform variance.** Mitigation: GPU treated as optional with explicit graceful-absence state; Linux-first scope (AR-003).
- **R3 - Exposure of system telemetry / injection.** Mitigation: loopback-only bind, read-only data, no secrets in client, text-only DOM insertion (AR-009).

GATE 6: PASS
