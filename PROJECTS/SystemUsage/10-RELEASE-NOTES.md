# Release Notes — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Developer

## RN-002 : v0.2.0 — 2026-06-14 — Verdigris redesign

- **CHANGED FILES:**
  - `./10-BUILD/index.html` — rebuilt to the redesigned layout and green/amber theme. CPU and GPU are now paired furnaces drawn as **canvas flames** (red CPU `#cpu-flame`, blue GPU `#gpu-flame`) replacing the dial gauges; RAM and VRAM are paired **boilers** (`#mem-tank`, `#vram-tank`) whose vessel heights scale in proportion to true capacity (BR-037); disk and network read/write render as an animated **steam-pipe network** (`#pipe-canvas`) routing from a central furnace manifold out to four labelled inlets/outlets — WRITE/READ/TX/RX (BR-038); the whole palette was re-keyed to green-primary / yellow-amber (BR-039). New panels: `#panel-furnaces`, `#panel-boilers`, `#panel-pipes`, `#panel-procs`; per-resource cards `#card-cpu/gpu/mem/vram/disk/net` carry the alarm state and indicator lamps.
  - `./9-RESOURCES/tokens/palette.css`, `./9-RESOURCES/tokens/tokens.json` — recoloured to the green/amber "Verdigris Boiler" scheme.
- **IMPLEMENTATION CAVEATS:**
  - `agent.py` is unchanged — the canonical snapshot schema was sufficient for the redesign (VRAM proportionality uses existing `gpu.vramTotalMB`; pipe flows use existing `diskio` and `net` rates).
  - The flames, boiler bubbles, and pipe particles all honour reduced-motion (no flicker/spawn) while still rendering current values.
  - VRAM is shown as an informational boiler with its own lamp (warning ≥80%, critical ≥90%); it is not part of the five configurable alert thresholds (cpu/gpu/mem/disk/net), matching DI-009.
- **UC/BR COVERAGE:** UC-001, UC-003..UC-007; BR-001, BR-008, BR-009, BR-010, BR-012, BR-014, BR-016, BR-020, BR-037, BR-038, BR-039.
- **NOTES:** Verified live against a real machine (24-core CPU, NVIDIA RTX 2070 SUPER, 3 disks) — `#conn`="live", paired furnaces/boilers/pipe-network/process tables all populated, browser console clean (no errors). Demo mode confirmed. Boiler proportionality visibly correct (RAM 62.7 GB vessel taller than VRAM 8 GB vessel). Security posture unchanged: agent binds `127.0.0.1`, process names rendered via `textContent`.

## RN-001 : v0.1.0 — 2026-06-14

- **CHANGED FILES:**
  - `./10-BUILD/README.md` — run guide for demo mode and live mode (DI-001).
  - `./10-BUILD/agent.py` — Python metrics agent: `collect_snapshot()` (psutil), `collect_gpu()` (nvidia-smi), and a `ThreadingHTTPServer` serving `/`, `/api/metrics` (JSON), and `/api/stream` (SSE) on `127.0.0.1:8077` with argparse `--host`/`--port` (DI-002, DI-003).
  - `./10-BUILD/index.html` — self-contained Coal & Brass dashboard: six-panel CSS Grid layout with reduced-motion + responsive rules (DI-004); DataSource SSE→poll→demo with connection indicator (DI-005); `renderSnapshot()` driving gauges, boiler tank, disk tanks, readouts, and process tables via `textContent` (DI-006); rAF animation engine for flames/boil/steam/net particles (DI-007); rolling 60-second network chart (DI-008); thresholds, alarm zones, lamps, desktop/in-page/webhook notifications persisted to `localStorage` (DI-009); demo simulator + "Stoke" control (DI-010); bootstrap, tooltips, and history modal (DI-011).
- **IMPLEMENTATION CAVEATS:**
  - The history modal uses the native `<dialog>` element; an explicit `keydown` Escape handler was added because the platform `cancel` event did not fire to close the dialog in the test browser. Functionally verified (open via title click, close via Escape and Close button).
  - The "Stoke the furnace" control affects the demo simulator only; in live mode it has no effect on real metrics, by design (DI-010).
  - GPU panel depends on `nvidia-smi`; on machines without it the panel correctly shows "GPU not available".
  - Per AR-005/AR-006 no third-party runtime libraries are bundled; all rendering uses Canvas 2D, inline SVG, and CSS.
- **UC/BR COVERAGE:** UC-001..UC-013; BR-001..BR-036 plus BR-NF-ACCESSIBILITY, BR-NF-PERFORMANCE, BR-NF-SECURITY.
- **NOTES:** Verified live against a real machine (24-core CPU, NVIDIA RTX 2070 SUPER, 3 disks) — `#conn`="live", all panels populated, browser console clean (no errors/warnings). Demo mode confirmed with no agent. Security: agent binds `127.0.0.1` by default, only reads system data, no secrets in client, all dynamic text uses `textContent`. The DOM ID contract from DI-004 is intact for Stage 11 Playwright tests.

GATE 10: PASS
