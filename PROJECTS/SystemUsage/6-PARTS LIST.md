# Stage 6 Parts List — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Architect
- **SOURCE INPUTS:** 2-USE-CASES.md, 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md

## Parts

## PT-001 : Metrics agent HTTP server

- **DESCRIPTION:** Local process that serves the static client and the metrics endpoints, bound to loopback by default.
- **TECHNOLOGY RECOMMENDATIONS:** Python 3.8+ with `http.server.ThreadingHTTPServer` (standard library); CLI flags `--host` (default `127.0.0.1`) and `--port` (default `8077`).
- **NOTES:** Threaded so SSE does not block other requests. File: `agent.py`.
- **RELATED:** AR-001, AR-009; BR-003, BR-005, BR-NF-SECURITY

## PT-002 : Metrics collector

- **DESCRIPTION:** Samples CPU (overall + per-core), memory, swap, disk capacity/IO, network IO, top processes, and optional GPU into a single snapshot dict.
- **TECHNOLOGY RECOMMENDATIONS:** `psutil` (BSD-3-Clause) for system metrics; `nvidia-smi` via `subprocess` for optional GPU; emits a versioned JSON shape.
- **NOTES:** Computes IO/network rates as deltas between samples. GPU absence → `{available:false}`. Module within `agent.py`.
- **RELATED:** AR-002, AR-003; BR-006, BR-007, BR-009, BR-010, BR-011, BR-012, BR-013, BR-015, BR-016, BR-018, BR-021, BR-022, BR-023

## PT-003 : Single-page client

- **DESCRIPTION:** The self-contained dashboard page with all six panels, overlays, and controls.
- **TECHNOLOGY RECOMMENDATIONS:** One `index.html` with inlined CSS and vanilla ES2020 JavaScript; CSS Grid layout; system font stack; no external assets.
- **NOTES:** Served by the agent and also openable directly as a file (demo mode). File: `index.html`.
- **RELATED:** AR-005, AR-008; BR-001, BR-002, BR-032, BR-034

## PT-004 : Data source abstraction

- **DESCRIPTION:** Client module that acquires metrics, exposing a uniform stream of snapshots and a connection state.
- **TECHNOLOGY RECOMMENDATIONS:** `EventSource` for SSE (`/api/stream`); `fetch` polling fallback (`/api/metrics`); built-in `DemoSimulator` generating plausible time-varying samples.
- **NOTES:** Emits `live` / `demo` / `disconnected` state for BR-004. Inlined in `index.html`.
- **RELATED:** AR-004; BR-002, BR-003, BR-004, BR-005

## PT-005 : Gauge & tank renderers

- **DESCRIPTION:** Visual components for CPU/GPU gauges, the memory boiler tank, and disk pressure tanks.
- **TECHNOLOGY RECOMMENDATIONS:** Inline SVG for gauge dials and tank vessels; CSS custom properties for fill levels and zone colours; Canvas 2D overlay for liquid boil/bubbles.
- **NOTES:** Fill proportions bound directly to metric values (honest instrumentation). Inlined in `index.html`.
- **RELATED:** AR-006; BR-006, BR-008, BR-012, BR-014, BR-015, BR-017

## PT-006 : Animation engine

- **DESCRIPTION:** Shared loop driving steam, per-core flames, bubbles, network particles, and rolling charts.
- **TECHNOLOGY RECOMMENDATIONS:** Single `requestAnimationFrame` loop over a Canvas 2D context; particle pool with capped counts; custom 60-second rolling line chart.
- **NOTES:** Loop suspends decorative work under reduced motion while data still updates. Inlined in `index.html`.
- **RELATED:** AR-006, AR-008; BR-019, BR-020, BR-035, BR-NF-PERFORMANCE

## PT-007 : Settings & alert engine

- **DESCRIPTION:** Stores thresholds and preferences, evaluates alarm states, recolours zones, and triggers notifications.
- **TECHNOLOGY RECOMMENDATIONS:** `localStorage` for persistence; client-side threshold evaluation each refresh; Web `Notification` API for optional desktop alerts; optional `fetch` POST to a user-supplied webhook URL (best-effort).
- **NOTES:** Three states normal/warning/critical per resource; alarm auto-clears. Inlined in `index.html`.
- **RELATED:** AR-007; BR-025, BR-026, BR-027, BR-028, BR-029, BR-030, BR-031, BR-036

## PT-008 : Responsive & accessibility layer

- **DESCRIPTION:** Layout reflow, reduced-motion handling, keyboard focus, and contrast.
- **TECHNOLOGY RECOMMENDATIONS:** CSS Grid with a `@media (max-width:768px)` single-column rule; `@media (prefers-reduced-motion: reduce)` plus an in-app toggle; native range inputs and buttons with visible `:focus-visible` styling.
- **NOTES:** Body text colours verified ≥4.5:1 on the dark ground. Inlined in `index.html`.
- **RELATED:** AR-008; BR-032, BR-033, BR-035, BR-NF-ACCESSIBILITY

## Traceability

| AR | Implemented by PTs |
|---|---|
| AR-001 | PT-001 |
| AR-002 | PT-002 |
| AR-003 | PT-002 |
| AR-004 | PT-004 |
| AR-005 | PT-003 |
| AR-006 | PT-005, PT-006 |
| AR-007 | PT-007 |
| AR-008 | PT-003, PT-008 |
| AR-009 | PT-001 |

GATE 6: PASS
