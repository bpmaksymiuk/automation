# Stage 7 Design Instructions — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Technical Lead
- **SOURCE INPUTS:** 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md

## Implementation Plan

All build artifacts live under `10-BUILD/`. Final deliverables: `10-BUILD/index.html` (self-contained client) and `10-BUILD/agent.py` (metrics agent). Implement DIs in order; later DIs depend on earlier ones.

### Canonical metrics snapshot schema (shared contract)

Both the agent (producer) and client (consumer) use this exact JSON shape. The demo simulator must emit the same shape.

```json
{
  "ts": 1718366400.0,
  "cpu": { "overall": 63.2, "cores": [41.0, 88.2, 12.5, 50.1], "tempC": 61.0 },
  "gpu": { "available": true, "util": 38.0, "vramUsedMB": 2048, "vramTotalMB": 8192, "name": "NVIDIA RTX" },
  "mem": { "totalB": 16777216000, "usedB": 11811160064, "availB": 4966055936, "cachedB": 3328599654, "percent": 70.4,
           "swapTotalB": 4294967296, "swapUsedB": 429496729, "swapPercent": 10.0 },
  "disks": [ { "mount": "/", "totalB": 500107862016, "usedB": 305065795850, "percent": 61.0 } ],
  "diskio": { "readBps": 130023424, "writeBps": 39845888 },
  "net": { "iface": "eth0", "txBps": 4404019, "rxBps": 12373196 },
  "procCpu": [ { "name": "chrome", "pid": 4821, "cpu": 41.0 } ],
  "procMem": [ { "name": "chrome", "pid": 4821, "memB": 1610612736, "memPercent": 9.6 } ]
}
```

Notes: all byte fields end in `B`/`Bps`; percentages are 0–100 floats; `gpu.available:false` omits the other gpu fields; `procCpu`/`procMem` arrays hold at least 5 entries when available, sorted descending by their metric.

---

## DI-001 : Create build directory and entrypoints

- **SUMMARY:** Establish the `10-BUILD/` directory with the two empty entrypoint files the later DIs populate.
- **IMPLEMENTATION STEPS:**
  1. Create directory `10-BUILD/`.
  2. Create empty file `10-BUILD/index.html`.
  3. Create empty file `10-BUILD/agent.py`.
  4. Create `10-BUILD/README.md` documenting: run client standalone by opening `index.html` (demo mode); run live by `python3 agent.py` then visiting `http://127.0.0.1:8077`.
- **SKILLSET REQUIRED:** Filesystem basics.
- **NOTES:** Inputs: none. Outputs: directory + 3 files. Failure: if `10-BUILD/` exists, reuse it. Verification: the three files exist. No `index.html`/`agent.py` content yet.
- **RELATED:** PT-001, PT-003; AR-001, AR-005

## DI-002 : Implement the metrics collector in agent.py

- **SUMMARY:** Produce a `collect_snapshot()` function returning the canonical snapshot dict from `psutil` plus optional GPU.
- **IMPLEMENTATION STEPS:**
  1. In `10-BUILD/agent.py`, `import json, time, subprocess, argparse, threading` and `import psutil`. Wrap `import psutil` in try/except; if it fails, set a module flag `PSUTIL_OK=False` and have `collect_snapshot()` raise `RuntimeError("psutil unavailable")` (the server handles this — see DI-004).
  2. Maintain module-level previous counters `_prev = {"t": None, "disk": None, "net": None}` for delta rate calculation.
  3. Define `def collect_snapshot() -> dict:` that gathers:
     - `cpu.overall = psutil.cpu_percent(interval=None)`, `cpu.cores = psutil.cpu_percent(interval=None, percpu=True)`. For `cpu.tempC`: try `psutil.sensors_temperatures()`, take the first sensor's first `current`; if unavailable, set `tempC` to `null`.
     - `mem` from `psutil.virtual_memory()` (`total,used,available,percent`) and `psutil.swap_memory()` (`total,used,percent`); map `cachedB` to `getattr(vm,'cached',0)`.
     - `disks`: iterate `psutil.disk_partitions(all=False)`; for each, call `psutil.disk_usage(part.mountpoint)`; append `{mount, totalB, usedB, percent}`. Skip a partition if `disk_usage` raises `PermissionError`/`OSError`.
     - `diskio`/`net` rates: read `psutil.disk_io_counters()` and `psutil.net_io_counters()`; compute bytes/sec as `(now_value - prev_value)/dt` where `dt = now_t - _prev["t"]` (guard `dt<=0` → rate 0); on first call `_prev["t"] is None`, emit rates 0 and store counters. For `net.iface`, pick the interface with the highest combined counters from `psutil.net_io_counters(pernic=True)`.
     - `procCpu`: build list from `psutil.process_iter(['pid','name','cpu_percent'])`, sort by `cpu_percent` desc, take top 5 as `{name,pid,cpu}`; wrap per-process access in try/except `(psutil.NoSuchProcess, psutil.AccessDenied)`.
     - `procMem`: from `psutil.process_iter(['pid','name','memory_info','memory_percent'])`, sort by `memory_percent` desc, take top 5 as `{name,pid,memB,memPercent}`.
  4. Define `def collect_gpu() -> dict:` that runs `subprocess.run(["nvidia-smi","--query-gpu=utilization.gpu,memory.used,memory.total,name","--format=csv,noheader,nounits"], capture_output=True, text=True, timeout=1.5)`. On success parse the first line into `{available:True, util, vramUsedMB, vramTotalMB, name}`. On any exception (FileNotFoundError, timeout, parse error, non-zero return) return `{"available": False}`.
  5. Set `snapshot["gpu"] = collect_gpu()` and `snapshot["ts"] = time.time()`.
- **SKILLSET REQUIRED:** Python 3, psutil API, subprocess.
- **NOTES:** Inputs: none (reads OS). Outputs: dict matching the canonical schema. Failure: missing sensors/GPU degrade to `null`/`available:false`; partition errors skipped. Verification: `python3 -c "import agent,json;print(json.dumps(agent.collect_snapshot()))"` from `10-BUILD/` prints valid JSON with all top-level keys.
- **RELATED:** BR-006, BR-007, BR-009, BR-010, BR-011, BR-012, BR-013, BR-015, BR-016, BR-018, BR-021, BR-022, BR-023; AR-002, AR-003; PT-002

## DI-003 : Implement the HTTP server and endpoints in agent.py

- **SUMMARY:** Serve the static client and the JSON/SSE metrics endpoints over a threaded loopback HTTP server.
- **IMPLEMENTATION STEPS:**
  1. In `10-BUILD/agent.py`, subclass `http.server.BaseHTTPRequestHandler` as `Handler` with a `do_GET(self)` that routes on `self.path`:
     - `/` or `/index.html`: read sibling `index.html` (path = `os.path.join(os.path.dirname(__file__), "index.html")`), respond `200` `text/html; charset=utf-8` with its bytes. If the file is missing, respond `404` with `b"index.html not found"`.
     - `/api/metrics`: call `collect_snapshot()`, respond `200` `application/json` with `json.dumps(snapshot).encode()`. On `RuntimeError` (psutil missing) respond `503` `application/json` `{"error":"psutil_unavailable"}`.
     - `/api/stream`: respond `200` with headers `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`; then loop: write `f"data: {json.dumps(collect_snapshot())}\n\n".encode()`, `self.wfile.flush()`, `time.sleep(1.0)`. Break the loop on `BrokenPipeError`/`ConnectionResetError` (client disconnected) and return.
     - any other path: `404` `b"not found"`.
  2. Add `Access-Control-Allow-Origin: *` header on the two `/api/*` responses so the client also works when opened from `file://` during testing.
  3. Override `log_message` to a no-op to keep stdout clean.
  4. Use `http.server.ThreadingHTTPServer` so SSE streams do not block other requests.
  5. Add `def main():` parsing `argparse` flags `--host` (default `"127.0.0.1"`) and `--port` (default `8077`, int); create `ThreadingHTTPServer((host,port), Handler)`; print `f"Boiler Room agent on http://{host}:{port}"`; call `serve_forever()`; wrap in `try/except KeyboardInterrupt` to shut down cleanly. Guard with `if __name__ == "__main__": main()`.
- **SKILLSET REQUIRED:** Python 3 `http.server`, SSE format, argparse.
- **NOTES:** Inputs: HTTP GET requests. Outputs: HTML, JSON, or SSE stream. Failure: missing client file → 404; psutil missing → 503; client disconnect ends stream loop. Integration: default bind `127.0.0.1:8077` (AR-009). Verification: `python3 agent.py` then `curl -s http://127.0.0.1:8077/api/metrics` returns JSON; `curl -N http://127.0.0.1:8077/api/stream` emits `data:` lines ~1/s.
- **RELATED:** BR-003, BR-005, BR-NF-SECURITY; AR-001, AR-004, AR-009; PT-001

## DI-004 : Build the HTML structure and green/amber styling in index.html

- **SUMMARY:** Lay out paired furnaces (CPU red flame + GPU blue flame), paired boilers (RAM + VRAM), and a connecting steam-pipe network in a single-viewport CSS Grid with a green-primary / yellow-amber theme, responsive reflow, focus styles, and reduced-motion rules.
- **IMPLEMENTATION STEPS:**
  1. In `10-BUILD/index.html`, write a full HTML5 document: `<!doctype html>`, `<html lang="en">`, `<head>` with `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>The Boiler Room</title>`, and a single inline `<style>` block. No external links.
  2. Define CSS custom properties on `:root` (green primary, yellow/amber accent, dark background — BR-039): `--oil:#0c140c; --iron:#16241a; --brass:#7bbf4a; --copper:#4f8f37; --ember:#e8d24a; --amber:#f2e15a; --alarm:#d2463a; --ok:#5fd35f; --text:#eaf5e0; --muted:#b9d6a8;`. Flame accents (exceptions to the green theme): `--cpu-flame:#e0492c` (red) and `--gpu-flame:#3a86e0` (blue). Body text uses `--text` on `--oil` (contrast ≥4.5:1 — BR-NF-ACCESSIBILITY).
  3. Header bar `#topbar` containing the title "THE BOILER ROOM", a `#conn` connection indicator (`<span id="conn" data-state="demo">demo</span>`), a reduced-motion toggle button `#btn-motion`, and an alert-drawer toggle button `#btn-alerts`.
  4. Main container `#room` using `display:grid` with `height:100vh; overflow:hidden` (base view never scrolls — BR-001). Desktop template (min-width:769px) uses named areas to keep things tidy: `grid-template-areas: "furnaces pipes" "boilers pipes" "procs pipes";` with two columns (left wider for furnaces/boilers, right column for the pipe network). `#panel-alerts` is a drawer fixed to the bottom-right.
  5. **Furnaces row** (`#panel-furnaces`, area `furnaces`): two side-by-side flame furnaces — CPU (left, red) and GPU (right, blue) — each a vertical card with a flame canvas, an overall-% readout, and an indicator lamp. Header "FURNACES".
  6. **Boilers row** (`#panel-boilers`, area `boilers`): two side-by-side boilers — RAM (left) and VRAM (right) — sized in proportion to their real total capacities (BR-037), each a vessel canvas with a readout and lamp. Header "BOILERS".
  7. **Pipe network** (`#panel-pipes`, area `pipes`): a tall card holding a steam-pipe canvas that routes from a central furnace manifold out to four labelled endpoints — disk-write outlet, disk-read inlet, net-TX outlet, net-RX inlet (BR-038) — plus the disk capacity tanks, the disk I/O readout, the rolling network chart, and the network readout. Header "STEAM PIPES".
  8. **Process tables** (`#panel-procs`, area `procs`): the CPU and memory top-consumer tables side by side. Header "TOP CONSUMERS".
  9. Required containers (filled by DI-006), keeping the DOM ID contract:
     - CPU → `<canvas id="cpu-flame" data-tip="cpu">`, `<canvas id="cpu-cores">`, `<div id="cpu-readout">`, `<span class="lamp" id="lamp-cpu">`.
     - GPU → `<canvas id="gpu-flame" data-tip="gpu">`, `<div id="gpu-readout">`, `<span class="lamp" id="lamp-gpu">`.
     - RAM → `<canvas id="mem-tank" data-tip="mem">`, `<div id="mem-readout">`, `<span class="lamp" id="lamp-mem">`.
     - VRAM → `<canvas id="vram-tank" data-tip="vram">`, `<div id="vram-readout">`, `<span class="lamp" id="lamp-vram">`.
     - PIPES → `<canvas id="pipe-canvas" data-tip="pipes">`, `<div id="disk-tanks" data-tip="disk">`, `<div id="disk-io">`, `<canvas id="net-chart">`, `<div id="net-readout" data-tip="net">`, `<span class="lamp" id="lamp-disk">`, `<span class="lamp" id="lamp-net">`.
     - PROCS → `<table id="cpu-procs">`, `<table id="mem-procs">`.
  10. Alert drawer `#panel-alerts` contains, for each of cpu/gpu/mem/disk/net: a labelled `<input type="range" min="1" max="100" class="threshold" id="thr-cpu" data-res="cpu">` and a value display `id="val-cpu"`. Add a notifications section: checkbox `#notify-desktop`, checkbox `#notify-browser`, text input `#webhook-url`. Add a `#btn-stoke` button "Stoke the furnace (demo load)".
  11. Add a tooltip element `<div id="tooltip" role="status" aria-live="polite" hidden></div>` and a `<dialog id="history-modal">` with `#history-title`, `#history-close`, `#history-canvas`.
  12. CSS states: `.lamp` is a 12px circle; `.lamp[data-state=normal]{background:var(--ok)} [data-state=warning]{background:var(--amber)} [data-state=critical]{background:var(--alarm)}`. `.panel.alarm{animation:shudder .3s}` plus a red border. Define `@keyframes shudder` and flame/boil/steam keyframes. Frames/rivets use `border:2px solid var(--brass)` (green).
  13. Responsive: `@media (max-width:768px){#room{grid-template-columns:1fr; grid-template-areas:"furnaces" "boilers" "pipes" "procs"; height:auto; overflow:auto}}` — single column, page allowed to scroll on mobile (BR-032).
  14. Accessibility: `@media (prefers-reduced-motion: reduce){ *{animation:none !important} }` and `body.reduced-motion *{animation:none !important}` toggled by the in-app button (BR-035). Add `:focus-visible{outline:2px solid var(--amber)}` (BR-NF-ACCESSIBILITY).
- **SKILLSET REQUIRED:** HTML5, CSS Grid (named areas), media queries, CSS custom properties.
- **NOTES:** Inputs: none. Outputs: static DOM + styles. Verification: opening `index.html` shows the paired furnaces, paired boilers, pipe network, and process tables in one viewport at desktop width and a single column at ≤768px. IDs above are contracts consumed by DI-006/DI-007/DI-008/DI-009.
- **RELATED:** BR-001, BR-032, BR-033, BR-035, BR-037, BR-038, BR-039, BR-NF-ACCESSIBILITY; AR-005, AR-008; PT-003, PT-008

## DI-005 : Implement the DataSource abstraction (SSE → polling → demo)

- **SUMMARY:** Provide a single client object that yields canonical snapshots and reports connection state, trying SSE, then polling, then a demo simulator.
- **IMPLEMENTATION STEPS:**
  1. In the client `<script>`, define `const AGENT_BASE = (location.protocol==='file:') ? 'http://127.0.0.1:8077' : '';` and a function `setConn(state)` that sets `#conn` text and `data-state` to `'live'|'demo'|'disconnected'`.
  2. Define `function startDataSource(onSnapshot)`. It first attempts SSE: `const es = new EventSource(AGENT_BASE + '/api/stream')`. On `es.onmessage = e => { setConn('live'); onSnapshot(JSON.parse(e.data)); }`. On `es.onerror`: call `es.close()`, then call `startPolling(onSnapshot)`.
  3. `function startPolling(onSnapshot)`: every 1000 ms `fetch(AGENT_BASE + '/api/metrics')`; on ok JSON → `setConn('live'); onSnapshot(data);` on failure → increment a miss counter; after 2 consecutive misses call `startDemo(onSnapshot)`.
  4. `function startDemo(onSnapshot)`: `setConn('demo')`; every 1000 ms call `onSnapshot(DemoSimulator.next())`.
  5. Guard so only one mode runs at a time (clear any active interval before switching).
  6. Define `DemoSimulator` (DI-010) producing canonical snapshots.
- **SKILLSET REQUIRED:** JavaScript, EventSource, fetch, timers.
- **NOTES:** Inputs: agent endpoints or none. Outputs: a stream of snapshots via `onSnapshot`. Failure: SSE error → polling; repeated poll failure → demo. Integration: consumes `/api/stream` and `/api/metrics` from DI-003; CORS header allows `file://`. Verification: with the agent running, `#conn` reads "live"; with no agent, it reads "demo" and panels still update (BR-004, BR-005).
- **RELATED:** BR-002, BR-003, BR-004, BR-005; AR-004; PT-004

## DI-006 : Render gauges, tank, disks, and readouts from a snapshot

- **SUMMARY:** Implement `renderSnapshot(s)` that maps a canonical snapshot to all panel visuals and numeric readouts.
- **IMPLEMENTATION STEPS:**
  1. Define `function renderSnapshot(s){ state.last = s; ... }` storing the latest snapshot in a module `state` object and pushing `s.net` into a `state.netHistory` ring buffer (cap 60 entries) and `s.cpu.overall` into `state.cpuHistory` (cap 1800 for the 30-min modal).
  2. CPU flame: draw a red flame on `#cpu-flame` whose height/brightness scales with `s.cpu.overall`; set `#cpu-readout` text to `${s.cpu.overall.toFixed(1)}%` and `tempC` when not null. Set furnace glow: `panel-furnaces.style.setProperty('--glow', s.cpu.overall/100)` (BR-008). The flame uses `--cpu-flame` (red).
  3. Per-core flames: draw on `#cpu-cores` canvas one bar/flame per `s.cpu.cores[i]`, height ∝ value (BR-007). Count must equal `s.cpu.cores.length`.
  4. GPU flame: if `s.gpu.available`, draw a blue flame on `#gpu-flame` scaled to `s.gpu.util` using `--gpu-flame` (blue), and set `#gpu-readout` to util % (BR-009). If `!available`, set `#gpu-readout` text to "GPU not available" and render no flame (BR-011).
  5. RAM boiler: set `#mem-tank` fill ratio to `s.mem.percent/100` (drawn in DI-007); set `#mem-readout` to used/total GB, available GB, swap used/percent (BR-012, BR-013). Set `state.memPercent` for the boil engine. VRAM boiler: when `s.gpu.available`, set `#vram-tank` fill ratio to `vramUsedMB/vramTotalMB`, set `#vram-readout` to `usedMB / totalMB`, and set `state.vramPercent`; size the two boiler vessels in proportion to `s.mem.totalB` vs `s.gpu.vramTotalMB` (the larger pool gets the taller vessel) (BR-010, BR-037). When `!available`, render an empty/offline VRAM boiler.
  6. Disks: rebuild `#disk-tanks` to contain one element per `s.disks[i]` with a fill height of `percent`% (±1pp accuracy — BR-017) and text `mount percent%`; set `#disk-io` to human-readable `readBps`/`writeBps` (BR-015, BR-016). Feed disk read/write rates into the pipe network (DI-007 `#pipe-canvas`).
  7. Network: set `#net-readout` to `↑ human(txBps) ↓ human(rxBps)` (BR-018); the pipe network (`#pipe-canvas`, DI-007) and the rolling chart (`#net-chart`, DI-008) are driven from `state.last`.
  8. Process tables: implement `fillProcTable(tableId, rows, valueFn)` that clears and rebuilds rows with three cells (name, pid, value) using `textContent` only — never `innerHTML` with dynamic data (BR-NF-SECURITY). Fill `#cpu-procs` from `s.procCpu` and `#mem-procs` from `s.procMem`; show ≥5 rows (BR-021..024).
  9. Implement helper `human(bytesPerSec)` returning `B/s, KB/s, MB/s, GB/s` with one decimal.
  10. After updating visuals, call `evaluateAlerts(s)` (DI-009).
- **SKILLSET REQUIRED:** JavaScript DOM, SVG transforms, Canvas 2D, unit formatting.
- **NOTES:** Inputs: a canonical snapshot. Outputs: updated DOM/canvas + `state`. Failure: missing optional fields (`tempC` null, gpu unavailable) handled explicitly; never throw on absent data. Integration: reads IDs from DI-004; calls DI-009. Verification: feeding a hand-written snapshot updates every panel's numbers and gauge positions.
- **RELATED:** BR-006, BR-007, BR-009, BR-010, BR-011, BR-012, BR-013, BR-015, BR-016, BR-017, BR-018, BR-021, BR-022, BR-023, BR-024, BR-037; AR-006; PT-005

## DI-007 : Implement the animation engine (steam, flames, boil, particles)

- **SUMMARY:** Drive all continuous decorative animation from one `requestAnimationFrame` loop bound to live metric values, suppressible under reduced motion.
- **IMPLEMENTATION STEPS:**
  1. Define `let rafId=null; function animationLoop(t){ if(!state.reducedMotion){ drawSteam(); drawCpuFlame(); drawGpuFlame(); drawCores(); drawBoil(); drawPipes(); } rafId=requestAnimationFrame(animationLoop); }` and start it once after first render.
  2. `drawBoil()`: on `#mem-tank` and `#vram-tank` canvases, draw the liquid rectangle to each boiler's fill height, colour-lerp green→amber→red by percent; spawn rising bubble circles when percent>60, and increase bubble spawn rate/amplitude when percent>85 (BR-014). Vessel canvas heights are sized proportionally (BR-037).
  3. `drawPipes()`: on `#pipe-canvas`, draw a steam-pipe manifold from the furnace region out to four labelled endpoints — disk-write outlet, disk-read inlet, net-TX outlet, net-RX inlet — and animate a capped pool (max 120) of particles along each pipe; spawn rate ∝ the matching rate (`diskio.readBps/writeBps`, `net.txBps/rxBps`) normalised against a rolling max (BR-020, BR-038). Outlets carry outbound flows (write/TX), inlets carry inbound flows (read/RX).
  4. `drawCpuFlame()`/`drawGpuFlame()`: draw the red CPU flame and blue GPU flame, height/flicker scaled to `s.cpu.overall` / `s.gpu.util`.
  5. `drawCores()`: animate flame flicker heights around the base per-core values from DI-006.
  6. `drawSteam()`: draw translucent rising wisps whose count scales with `state.last.cpu.overall`.
  7. Implement `setReducedMotion(on)`: set `state.reducedMotion`, toggle `body.classList.toggle('reduced-motion', on)`, persist to `localStorage['boiler.reducedMotion']`, and update `#btn-motion` label. On load, initialise from `localStorage` OR `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (BR-035, BR-036).
  8. Performance guard: cap all pools; never allocate inside the hot loop beyond the pools (BR-NF-PERFORMANCE).
- **SKILLSET REQUIRED:** Canvas 2D, requestAnimationFrame, colour interpolation.
- **NOTES:** Inputs: `state` (latest snapshot + flags). Outputs: canvas drawing. Failure: if a canvas context is null, skip that draw. Integration: reads `state` from DI-006; toggled by DI-004 button. Verification: under normal mode steam/particles animate and intensify with load; with reduced motion on, canvases hold static and `state.last` numbers still update.
- **RELATED:** BR-008, BR-014, BR-019, BR-020, BR-035, BR-036, BR-037, BR-038, BR-NF-PERFORMANCE; AR-006, AR-008; PT-006

## DI-008 : Implement the rolling 60-second network chart

- **SUMMARY:** Plot the last 60 seconds of TX and RX on `#net-chart`.
- **IMPLEMENTATION STEPS:**
  1. Define `function drawNetChart()` called each snapshot: read `state.netHistory` (array of `{txBps,rxBps}`, length ≤60).
  2. Clear `#net-chart`; compute `maxVal = Math.max(1, ...all tx/rx)`; draw axes baseline.
  3. Plot TX as a blue polyline (`#3a86e0`) and RX as an amber polyline (`var(--ember)`), x-spacing = width/60, y = height*(1 - val/maxVal).
  4. Label current values at the right edge using `human()`.
- **SKILLSET REQUIRED:** Canvas 2D line drawing.
- **NOTES:** Inputs: `state.netHistory`. Outputs: chart drawing. Failure: <2 points → draw nothing but do not throw. Integration: history filled in DI-006. Verification: with changing net data, two lines advance and span ~60 samples (BR-019).
- **RELATED:** BR-019; AR-006; PT-006

## DI-009 : Implement thresholds, alarm states, lamps, and notifications

- **SUMMARY:** Evaluate each resource against its threshold, set zone colours/lamps/alarm states, and fire optional notifications.
- **IMPLEMENTATION STEPS:**
  1. Define defaults `const DEFAULT_THRESHOLDS={cpu:85,gpu:90,mem:90,disk:95,net:90}`. On load, read `localStorage['boiler.thresholds']` (JSON) merged over defaults into `state.thresholds` (BR-025, BR-027).
  2. Wire each `input.threshold[data-res]`: on `input` event, set `state.thresholds[res]=Number(value)`, update its value display, persist to `localStorage`, and call `applyZones(res)` immediately (BR-026). Range inputs satisfy keyboard+touch operability (BR-033).
  3. `function metricValue(res, s)` returns the comparable 0–100 number: cpu→`s.cpu.overall`, gpu→`available?util:0`, mem→`s.mem.percent`, disk→`max(percent over s.disks)`, net→normalised `(txBps+rxBps)` vs a rolling max ×100.
  4. `function evaluateAlerts(s)`: for each res compute `v=metricValue`, `thr=state.thresholds[res]`; state = `v>=thr ? 'critical' : v>=thr*0.9 ? 'warning' : 'normal'`. Set `#lamp-<res>` `data-state` (BR-029); toggle `panel.classList` `alarm` when critical (BR-028); when transitioning into critical, fire `notify(res, v)`; when dropping below threshold, ensure alarm class removed (BR-030).
  5. `function notify(res, v)`: if `#notify-desktop` checked and `Notification.permission==='granted'`, `new Notification('Boiler Room', {body:`${res.toUpperCase()} at ${v.toFixed(0)}%`})`; if permission is `default`, call `Notification.requestPermission()` once. If a `#webhook-url` value is present, `fetch(url,{method:'POST',body:JSON.stringify({res,value:v})}).catch(()=>{})` (best-effort, swallow errors) (BR-031).
  6. `function applyZones(res)`: set a CSS custom property on the panel (e.g. `--thr`) so zone colouring reflects the current threshold.
- **SKILLSET REQUIRED:** JavaScript, localStorage, Notifications API.
- **NOTES:** Inputs: snapshot + threshold controls. Outputs: lamp/alarm DOM state, optional notifications. Failure: notifications absent/denied → no-op, no throw; webhook failure swallowed. Integration: called by DI-006; controls from DI-004. Verification: lowering a threshold below current value turns its lamp red and adds the panel alarm class; raising it clears them; reload restores thresholds.
- **RELATED:** BR-025, BR-026, BR-027, BR-028, BR-029, BR-030, BR-031; AR-007; PT-007

## DI-010 : Implement the demo simulator and "stoke" control

- **SUMMARY:** Generate canonical snapshots with believable drift so the dashboard works with no agent, plus a button that spikes simulated load.
- **IMPLEMENTATION STEPS:**
  1. Define `const DemoSimulator = (()=>{ let cpu=20, ... })()` with internal smoothed values that random-walk within 0–100.
  2. `DemoSimulator.next()` returns a full canonical snapshot: 8 cpu cores around the overall value; `gpu.available:true` with util drifting; mem percent drifting 40–80 (or higher when stoked); two disks (`/` 61%, `/home` 78%); plausible `diskio`/`net` rates; and `procCpu`/`procMem` arrays of 5 sample processes (e.g. chrome, node, code, python, gnome-shell) with values summing roughly to the overall.
  3. Implement `DemoSimulator.stoke()` that temporarily raises target cpu/mem toward 95–100 for ~8 seconds then relaxes; wire `#btn-stoke` click to it.
  4. Ensure `next()` output passes the same `renderSnapshot` path with no special-casing.
- **SKILLSET REQUIRED:** JavaScript, basic random-walk modelling.
- **NOTES:** Inputs: none/optional stoke. Outputs: canonical snapshot objects. Failure: none. Integration: consumed by DI-005 demo branch; button from DI-004. Verification: opening `index.html` with no agent animates all panels; clicking "Stoke" drives CPU/MEM toward critical and trips alarms.
- **RELATED:** BR-002, BR-005; AR-004; PT-004

## DI-011 : Wire bootstrap, tooltips, and the history modal

- **SUMMARY:** Initialise the app on load, attach tooltip and gauge-label modal interactions.
- **IMPLEMENTATION STEPS:**
  1. On `DOMContentLoaded`: load preferences (thresholds, reduced motion), call `startDataSource(renderSnapshot)`, and start the animation loop.
  2. Tooltips: add `pointerenter`/`focus` listeners on each gauge/tank/pipe container that position `#tooltip` near the pointer and set its `textContent` to the exact current value from `state.last` (e.g. `CPU 63.4% · threshold 85%`); hide on `pointerleave`/`blur`/tap-away (BR-034). Touch: a `click` on a component also shows the tooltip for tap devices.
  3. History modal: clicking a panel `<h2>` opens `#history-modal` (a `<dialog>` or `div[role=dialog]`) drawing `state.cpuHistory` (or the relevant buffer) as a line graph over a dimmed backdrop; provide a close button and `Escape` handling; focus the dialog on open and return focus on close.
  4. Alert drawer toggle: `#btn-alerts` toggles `#panel-alerts` visibility; `#btn-motion` calls `setReducedMotion(!state.reducedMotion)`.
- **SKILLSET REQUIRED:** JavaScript events, dialog/modal a11y, Canvas.
- **NOTES:** Inputs: user pointer/keyboard. Outputs: tooltip + modal UI. Failure: empty history → modal shows "no data yet". Integration: uses `state` from DI-006; buttons from DI-004. Verification: hovering the CPU gauge shows a value tooltip; clicking the CPU title opens a history graph and Escape closes it.
- **RELATED:** BR-034, BR-NF-ACCESSIBILITY; AR-008; PT-003, PT-008

## Interface Contracts

- **Snapshot schema:** the canonical JSON above is the sole contract between agent, demo simulator, and `renderSnapshot`. Any field change must update DI-002, DI-006, and DI-010 together.
- **HTTP endpoints:** `GET /` (HTML), `GET /api/metrics` (JSON snapshot), `GET /api/stream` (SSE of snapshots). CORS `*` on `/api/*`.
- **DOM ID contract:** the element IDs enumerated in DI-004 step 9–11 are consumed verbatim by DI-005..DI-011 and by the Stage 11 tests; do not rename without updating consumers.
- **localStorage keys:** `boiler.thresholds` (JSON), `boiler.reducedMotion` (`"1"`/absent).

## Validation Notes

- After implementation, the Developer must confirm: opening `10-BUILD/index.html` with no agent shows the paired furnaces (red CPU + blue GPU flames), paired boilers (RAM + VRAM), pipe network, and process tables updating in demo mode within 3 s; running `python3 10-BUILD/agent.py` and visiting `http://127.0.0.1:8077` shows `#conn` = "live"; `curl http://127.0.0.1:8077/api/metrics` returns schema-valid JSON; no secrets appear in `index.html`; all dynamic text uses `textContent`.
- Security check (BR-NF-SECURITY): agent binds `127.0.0.1` by default; no credentials in client; process/disk data read-only.

GATE 7: PASS
