# Stage 11 Test Cases — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Tester
- **SOURCE INPUTS:** 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 10-RELEASE-NOTES.md

> Execution: visible (headed) Chromium via Playwright against the running agent at `http://127.0.0.1:8079` (live data). The client script exposes its functions globally, so deterministic states (GPU-unavailable, high-memory boil, threshold crossing, reduced motion) are driven by feeding hand-written canonical snapshots through `renderSnapshot()` and by toggling controls, per DI-006/DI-009. Screenshots are captured for every test case under `./11-TESTS/results/full/screenshots/`.

---

## T-001 : All resources on one live page

- **UC REFERENCE:** UC-001
- **AC COVERAGE:** UC-001 AC1, UC-001 AC2, UC-001 AC3
- **BR REFERENCE:** BR-001, BR-005, BR-039
- **PRECONDITIONS:** Agent running; viewport 1920×1080.
- **STEPS:**
  1. Open the dashboard.
  2. Assert all panels (`#panel-furnaces`, `#panel-boilers`, `#panel-pipes`, `#panel-procs`, `#panel-alerts`) exist in the DOM.
  3. Assert the document does not scroll vertically (`document.body.scrollHeight <= innerHeight`) at 1920×1080.
  4. Wait ≤3s and assert each resource readout shows a number; assert the theme is green-primary / yellow-amber (BR-039).
- **EXPECTED RESULT:** Furnaces, boilers, pipes, processes and alert panels present; no vertical page scroll at 1920×1080; every resource readout shows a number within 3 seconds; green/yellow palette in effect.
- **NOTES:** Single-page non-scrolling constraint.

## T-002 : Real-time updates and connection indicator

- **UC REFERENCE:** UC-002
- **AC COVERAGE:** UC-002 AC1, UC-002 AC2, UC-002 AC3
- **BR REFERENCE:** BR-002, BR-003, BR-004, BR-005
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Open the dashboard; wait for `#conn` to read "live".
  2. Record `#cpu-readout` text, wait 2.2s, record again.
  3. Confirm an SSE `EventSource` was used (connection reached "live" without manual reload).
  4. Evaluate `DemoSimulator.next()` and confirm it returns a valid canonical snapshot (fallback path).
- **EXPECTED RESULT:** `#conn`="live"; readout changes within 2s without reload; demo fallback produces a schema-valid snapshot.
- **NOTES:** 2-second max refresh.

## T-003 : CPU furnace flame (red)

- **UC REFERENCE:** UC-003
- **AC COVERAGE:** UC-003 AC1, UC-003 AC2, UC-003 AC3
- **BR REFERENCE:** BR-006, BR-007, BR-008
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Feed a snapshot with `cpu.overall=90` and 8 cores.
  2. Assert `#cpu-flame` draws a red-dominant flame and `#cpu-readout` shows the overall % and core count; assert `#cpu-cores` draws one flame per core.
  3. Compare flame height at high vs low CPU (top-most painted pixel row).
- **EXPECTED RESULT:** A red CPU flame shows overall %; one flame per core on `#cpu-cores`; flame height increases with CPU.
- **NOTES:** Per-core count equals `cores.length`. CPU flame is red to contrast the blue GPU flame beside it.

## T-004 : GPU furnace flame (blue) and unavailable state

- **UC REFERENCE:** UC-004
- **AC COVERAGE:** UC-004 AC1, UC-004 AC2, UC-004 AC3
- **BR REFERENCE:** BR-009, BR-011
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Feed a snapshot with `gpu.available=true, util=55`.
  2. Assert `#gpu-readout` shows util % and `#gpu-flame` draws a blue (non-red-dominant) flame beside the CPU furnace.
  3. Feed a snapshot with `gpu.available=false`; assert `#gpu-readout` shows "GPU not available" and no error thrown.
- **EXPECTED RESULT:** Blue GPU flame and util % when available; clean "GPU not available" state otherwise.
- **NOTES:** GPU optional hardware. VRAM is presented separately as its own boiler (see T-005).

## T-005 : RAM and VRAM twin boilers

- **UC REFERENCE:** UC-005
- **AC COVERAGE:** UC-005 AC1, UC-005 AC2, UC-005 AC3
- **BR REFERENCE:** BR-010, BR-012, BR-013, BR-014, BR-037
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Feed a snapshot with `mem.percent=45` and a GPU with VRAM; assert `#mem-readout` and `#vram-readout` show their fills.
  2. Assert the two boiler vessels (`#mem-tank`, `#vram-tank`) are sized in proportion to true capacity (RAM 16 GB taller than VRAM ~8.6 GB) (BR-037).
  3. Feed a snapshot with `mem.percent=92`; assert `state.memPercent` updates and the RAM boil engine spawns bubbles; assert `#mem-readout` shows GB and swap values.
- **EXPECTED RESULT:** Twin boilers side by side, vessels proportional to capacity; fills reflect percentage; boil intensifies above a high threshold.
- **NOTES:** Water-boiling metaphor. VRAM boiler shows an offline vessel when no GPU is present.

## T-006 : Disk pressure tanks and I/O

- **UC REFERENCE:** UC-006
- **AC COVERAGE:** UC-006 AC1, UC-006 AC2, UC-006 AC3
- **BR REFERENCE:** BR-015, BR-016, BR-017, BR-038
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Feed a snapshot with two disks (`/`=61%, `/home`=78%) and diskio rates.
  2. Assert `#disk-tanks` has one tank per disk with fill height matching percent (±1pp).
  3. Assert `#disk-io` shows human-readable read and write rates, and `#pipe-canvas` renders the disk read/write steam-pipe flows (BR-038).
- **EXPECTED RESULT:** One tank per filesystem; fill matches used %; read/write throughput shown and routed through the steam-pipe network.
- **NOTES:** Read-only.

## T-007 : Network steam pipe and rolling chart

- **UC REFERENCE:** UC-007
- **AC COVERAGE:** UC-007 AC1, UC-007 AC2, UC-007 AC3
- **BR REFERENCE:** BR-018, BR-019, BR-020, BR-038
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Feed several snapshots with varying tx/rx.
  2. Assert `#net-readout` shows ↑TX ↓RX human-readable.
  3. Assert `state.netHistory` accumulates samples (rolling 60s), `#net-chart` draws non-blank pixels, and `#pipe-canvas` routes TX/RX through the steam-pipe network (BR-038).
- **EXPECTED RESULT:** TX/RX shown; rolling chart with ≥2 points; pipe-network flow density tracks throughput from furnace to inlets/outlets.
- **NOTES:** Interface selection by highest counters.

## T-008 : Top process tables

- **UC REFERENCE:** UC-008
- **AC COVERAGE:** UC-008 AC1, UC-008 AC2, UC-008 AC3
- **BR REFERENCE:** BR-021, BR-022, BR-023, BR-024
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Wait for live data.
  2. Assert `#cpu-procs` and `#mem-procs` each have ≥5 rows.
  3. Assert each row shows name, PID, and a value; feed a re-ranked snapshot and confirm rows update.
- **EXPECTED RESULT:** Both tables list top 5 with name/PID/value and re-rank on update.
- **NOTES:** Demo shows sample processes.

## T-009 : Set custom alert thresholds

- **UC REFERENCE:** UC-009
- **AC COVERAGE:** UC-009 AC1, UC-009 AC2, UC-009 AC3
- **BR REFERENCE:** BR-025, BR-026, BR-027, BR-033
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Open Alert Control; assert a threshold range input exists for cpu/gpu/mem/disk/net.
  2. Set CPU threshold to 1; assert the CPU panel colouring/lamp updates immediately.
  3. Reload; assert the threshold persisted from `localStorage['boiler.thresholds']`.
- **EXPECTED RESULT:** Five adjustable thresholds; immediate colour update; persistence across reload.
- **NOTES:** Defaults provided.

## T-010 : Alarm on threshold crossing

- **UC REFERENCE:** UC-010
- **AC COVERAGE:** UC-010 AC1, UC-010 AC2, UC-010 AC3
- **BR REFERENCE:** BR-028, BR-029, BR-030, BR-031
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Set CPU threshold to 1; assert `#card-cpu` gains class `alarm` and `#lamp-cpu` `data-state=critical`.
  2. Assert lamp reflects normal/warning/critical zones.
  3. Set CPU threshold back to 85; assert alarm class clears and lamp returns to normal.
- **EXPECTED RESULT:** Critical alarm state on crossing; lamp reflects state; auto-clears below threshold.
- **NOTES:** Desktop notification best-effort/optional.

## T-011 : Mobile responsive reflow

- **UC REFERENCE:** UC-011
- **AC COVERAGE:** UC-011 AC1, UC-011 AC2, UC-011 AC3
- **BR REFERENCE:** BR-032, BR-033
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Resize viewport to 390×844.
  2. Assert panels stack in a single column (`#panel-furnaces` and `#panel-boilers` share the same x with boilers below furnaces) and no horizontal overflow (`scrollWidth <= clientWidth`).
  3. Operate a threshold range input via keyboard (focus + ArrowRight) and confirm value changes.
- **EXPECTED RESULT:** Single-column layout ≤768px; no horizontal overflow; controls operable.
- **NOTES:** Responsive down to mobile.

## T-012 : Tooltip detail on demand

- **UC REFERENCE:** UC-012
- **AC COVERAGE:** UC-012 AC1, UC-012 AC2, UC-012 AC3
- **BR REFERENCE:** BR-034
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Hover `#cpu-flame`; assert `#tooltip` becomes visible with the exact current value.
  2. Assert the main view did not navigate away.
  3. Move pointer away; assert `#tooltip` hides.
- **EXPECTED RESULT:** Tooltip shows exact value on hover, in-place, and dismisses on leave.
- **NOTES:** Detail one interaction away.

## T-013 : Reduce motion

- **UC REFERENCE:** UC-013
- **AC COVERAGE:** UC-013 AC1, UC-013 AC2, UC-013 AC3
- **BR REFERENCE:** BR-035, BR-036
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Click `#btn-motion`; assert `body.reduced-motion` is set and `state.reducedMotion` true.
  2. Feed a new snapshot; assert `#cpu-readout` still updates while reduced motion is on.
  3. Reload; assert reduced-motion preference persisted from `localStorage['boiler.reducedMotion']`.
- **EXPECTED RESULT:** Decorative animation suppressed; data keeps updating; preference persists.
- **NOTES:** Accessibility v1 requirement.

## T-014 : Security baseline

- **UC REFERENCE:** UC-001, UC-002
- **AC COVERAGE:** UC-001 AC1, UC-002 AC2
- **BR REFERENCE:** BR-NF-SECURITY
- **PRECONDITIONS:** Build files on disk.
- **STEPS:**
  1. Scan `10-BUILD/index.html` and `10-BUILD/agent.py` for embedded secrets (passwords, tokens, API keys) — assert none.
  2. Assert `agent.py` default bind is `127.0.0.1`.
  3. Assert dynamic process rows are written via `textContent` (inject a snapshot with a `<script>`-laden process name and confirm it is not parsed as HTML).
- **EXPECTED RESULT:** No secrets; loopback default; dynamic values not HTML-injected.
- **NOTES:** OWASP-aligned; read-only data.

## T-015 : Performance baseline

- **UC REFERENCE:** UC-001, UC-002
- **AC COVERAGE:** UC-001 AC3, UC-002 AC1
- **BR REFERENCE:** BR-NF-PERFORMANCE
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Measure time from navigation to first populated resource readout (<3s).
  2. Run the animation for ~2s and assert particle/bubble pools stay capped (≤120) — no unbounded growth.
- **EXPECTED RESULT:** Content visible <3s; animation pools bounded (responsive rendering).
- **NOTES:** Aim 60fps; degrade gracefully.

## T-016 : Accessibility baseline

- **UC REFERENCE:** UC-011, UC-013
- **AC COVERAGE:** UC-011 AC3, UC-013 AC1
- **BR REFERENCE:** BR-NF-ACCESSIBILITY
- **PRECONDITIONS:** Agent running.
- **STEPS:**
  1. Assert a single `<h1>` and `<h2>` panel headings form a sensible hierarchy.
  2. Tab to the first threshold range input and confirm a visible focus outline (`:focus-visible`).
  3. Confirm body text contrast meets ≥4.5:1 (text `--text` #f3e7d2 on `--oil` #15110d).
- **EXPECTED RESULT:** Heading hierarchy present; keyboard focus visible; contrast ratio ≥4.5:1.
- **NOTES:** Reduced-motion covered in T-013.

GATE 11: PASS
