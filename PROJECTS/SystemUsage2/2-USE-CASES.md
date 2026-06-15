# Use Cases — The Boiler Room System Resources Dashboard

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **Approved:** 2026-06-15
- **Approver:** Product Owner
- **Source Inputs:** 0-IDEA.md, 1-BRAINSTORM.md

## Scope Decisions (resolving Stage 1 open questions)

- **Platform:** Linux-first for the metrics agent (reads `psutil`/`/proc`). The browser client is platform-neutral.
- **Architecture boundary:** A lightweight local agent exposes metrics over HTTP (JSON snapshot + Server-Sent Events stream). The client is a single self-contained HTML page. When no agent is reachable, the client runs a built-in **demo/simulation mode** so the experience is always viewable.
- **GPU:** Optional. If no GPU or sensor is available, the GPU panel degrades gracefully to an "offline" state rather than failing.
- **Notifications (v1):** In-browser visual alerts (valve vent + indicator lamp) and optional Web Notifications API desktop notifications. An email/webhook field is provided and best-effort; SMS/phone is out of scope for v1.
- **Machines:** Local machine only. Multi-host/fleet view is out of scope for v1.
- **Accessibility:** A reduced-motion mode is in scope for v1.
- **Layout (v1 revision):** The main view is arranged as two paired furnaces and two paired boilers with a connecting pipe network: (row 1) the **CPU red flame** and the **GPU blue flame** sit side by side as the twin furnaces; (row 2) the **RAM boiler** and the **VRAM boiler** sit above their corresponding flames so the water reads as heating from below, with vessel sizes scaled in proportion to actual capacity (e.g. a 64 GB RAM boiler is visibly larger than an 8 GB VRAM boiler); disk and network read/write flows are drawn as **surface-mounted steam pipes** that run from the furnaces to labelled boxes for **disk** and **network**, with inlets (reads / receive) and outlets (writes / transmit). The presentation must read as tidy and orderly.
- **Palette (v1 revision):** The colour scheme is **green primary with yellow/amber accents on a dark background**, while preserving a minimum 4.5:1 body-text contrast ratio.
- **VRAM placement (v1 revision):** VRAM usage is presented as its own boiler beside the RAM boiler (no longer only a fill bar inside the GPU panel); the GPU panel itself focuses on utilisation as the blue flame, with the VRAM water line visually sitting above the GPU flame.

---

## UC-001 : Operator - View all system resources on one live page

- GOAL: See CPU, GPU, RAM, VRAM, disk, and network status simultaneously on a single non-scrolling page.
- STEPS:
  1. Open the dashboard URL in a browser.
  2. Observe the paired furnaces (CPU red flame + GPU blue flame), the paired boilers (RAM + VRAM), the connecting steam-pipe network for disk/network I/O, and the Alert Control Panel render within one viewport.
  3. Watch values populate from the live agent (or demo mode if no agent).
- ACCEPTANCE CRITERIA:
  - AC1: All resource areas (CPU flame, GPU flame, RAM boiler, VRAM boiler, disk, network) and the alert panel are present in the DOM on load.
  - AC2: The main view fits in one viewport at 1920×1080 without vertical page scrolling.
  - AC3: Each resource area displays a numeric current value within 3 seconds of load.
- NOTES: Single-page, non-scrolling main view is a hard constraint; the layout is paired furnaces over paired boilers, joined by the pipe network.
- RELATED: UC-002, UC-010

## UC-002 : Operator - See metrics update in real time

- GOAL: Watch resource values refresh continuously without manual reload.
- STEPS:
  1. Leave the dashboard open.
  2. Observe values change as system load changes.
- ACCEPTANCE CRITERIA:
  - AC1: Displayed metric values update at least once every 2 seconds without a page reload.
  - AC2: The client uses a push stream (SSE) when an agent is available and falls back to polling/demo data otherwise.
  - AC3: A visible "live" indicator shows connection state (live / demo / disconnected).
- NOTES: 2-second maximum refresh interval.
- RELATED: UC-001

## UC-003 : Enthusiast - Read CPU load as a red furnace flame

- GOAL: Understand overall and per-core CPU load through a red flame furnace metaphor, placed beside the GPU flame.
- STEPS:
  1. Look at the CPU furnace (left flame of the paired furnaces row).
  2. Read the overall percentage.
  3. Scan the per-core flames for hotspots.
- ACCEPTANCE CRITERIA:
  - AC1: A CPU flame, rendered in a red palette, displays overall CPU utilisation as a percentage (0–100).
  - AC2: A per-core visual element is rendered for each logical core, scaled to that core's load.
  - AC3: The flame height/intensity increases as overall CPU utilisation increases.
- NOTES: CPU temperature shown when a sensor is available; otherwise omitted. The CPU flame is red to contrast the blue GPU flame beside it, and the RAM boiler sits visually above the CPU flame so the heat reads as rising into the water from below.
- RELATED: UC-004, UC-008, UC-009

## UC-004 : Enthusiast - Read GPU load as a blue furnace flame

- GOAL: Monitor GPU utilisation through a blue flame furnace placed beside the red CPU flame.
- STEPS:
  1. Look at the GPU furnace (right flame of the paired furnaces row).
  2. Read GPU utilisation.
- ACCEPTANCE CRITERIA:
  - AC1: A GPU flame, rendered in a blue palette, displays GPU utilisation as a percentage when a GPU is detected.
  - AC2: The GPU flame sits directly beside the CPU flame so the two furnaces read as a pair.
  - AC3: When no GPU/sensor is available, the GPU flame shows a clear "GPU not available" state and does not error.
- NOTES: GPU is optional hardware. VRAM is presented separately as its own boiler (see UC-005). The GPU flame is blue to contrast the red CPU flame, and the VRAM boiler sits visually above the GPU flame so the heat reads as rising into the water from below.
- RELATED: UC-003, UC-005

## UC-005 : Operator - Monitor RAM and VRAM as twin boilers

- GOAL: See system RAM and GPU VRAM usage side by side as two boilers whose sizes reflect their true capacities, with each boiler visually sitting above its corresponding furnace flame.
- STEPS:
  1. Look at the paired boilers row (RAM boiler left, VRAM boiler right).
  2. Read each boiler's liquid fill level and breakdown.
- ACCEPTANCE CRITERIA:
  - AC1: Two boilers are shown side by side — a RAM boiler and a VRAM boiler — each fill level representing used capacity as a percentage of that pool's total.
  - AC2: The two boiler vessels are sized in proportion to their real total capacities (the larger-capacity pool renders as the visibly larger vessel), and each shows used/total with byte values; the RAM boiler also shows swap usage.
  - AC3: Each boiler's boiling animation intensifies as its utilisation rises (visible state change above a high-usage threshold).
- NOTES: Water-boiling metaphor is the emotional core. When no GPU is present, the VRAM boiler shows an empty/offline vessel without erroring. The RAM boiler should read as hovering above the CPU flame and the VRAM boiler above the GPU flame.
- RELATED: UC-004, UC-009

## UC-006 : Operator - Monitor disk capacity and I/O as pressure tanks and pipes

- GOAL: See per-filesystem capacity and current read/write activity, with the read/write flows drawn as steam pipes.
- STEPS:
  1. Look at the disk capacity tanks.
  2. Read fill levels per mount and follow the read/write steam pipes.
- ACCEPTANCE CRITERIA:
  - AC1: One tank is shown per detected mounted filesystem with used/total capacity.
  - AC2: Current disk read and write throughput (bytes/sec) are displayed and rendered as surface-mounted steam-pipe flows — write as an outlet pipe, read as an inlet pipe — running from the furnaces to the labelled disk box and its inlets/outlets.
  - AC3: Fill level reflects used percentage accurately (within rounding) for each filesystem.
- NOTES: Read-only; the dashboard never writes to disks. The disk read/write pipes share the same steam-pipe visual language as the network pipes (see UC-007), and both are treated as surface-mounted pipe runs terminating at labelled boxes.
- RELATED: UC-007, UC-008

## UC-007 : Operator - Monitor network as steam pipes from the furnace

- GOAL: See current upload/download throughput and recent history, drawn as steam pipes that run from the furnace around to network inlets and outlets.
- STEPS:
  1. Follow the network steam pipes from the furnaces to the labelled inlets/outlets.
  2. Read current TX/RX rates and the rolling graph.
- ACCEPTANCE CRITERIA:
  - AC1: Current transmit (TX) and receive (RX) rates are displayed in bytes/sec (human-readable units) and rendered as steam-pipe flows — transmit as an outlet pipe, receive as an inlet pipe — terminating at the labelled network box.
  - AC2: A rolling line graph shows at least the last 60 seconds of TX and RX.
  - AC3: The steam-pipe flow/particle density reflects relative throughput, and the pipes route from the furnaces to a set of inlets (receive) and outlets (transmit).
- NOTES: Interface selection when multiple NICs exist. Disk and network pipes share one consistent pipe-network layout (see UC-006), using the same surface-mounted treatment and labelled destination boxes.
- RELATED: UC-002, UC-006

## UC-008 : Operator - Identify the top resource-consuming processes

- GOAL: Find which processes consume the most CPU, memory, and disk I/O.
- STEPS:
  1. Look at the process table beside the relevant panel.
  2. Read the top consumers.
- ACCEPTANCE CRITERIA:
  - AC1: A "top consumers" table accompanies the CPU and memory panels, each listing at least the top 5 processes.
  - AC2: Each row shows process name, PID, and the relevant usage metric.
  - AC3: Tables re-rank as the underlying data updates.
- NOTES: In demo mode, representative sample processes are shown.
- RELATED: UC-003, UC-005, UC-006

## UC-009 : Operator - Set custom alert thresholds per resource

- GOAL: Define the load level at which each resource raises an alert.
- STEPS:
  1. Open the Alert Control Panel.
  2. Drag a threshold control for a resource.
  3. Observe zone colouring update.
- ACCEPTANCE CRITERIA:
  - AC1: Each resource (CPU, GPU, memory, disk, network) has an adjustable threshold control.
  - AC2: Changing a threshold immediately updates the affected panel's warning/critical colouring.
  - AC3: Threshold settings persist across page reloads (saved to local storage).
- NOTES: Defaults provided for each resource.
- RELATED: UC-010

## UC-010 : Operator - Be alerted when a threshold is exceeded

- GOAL: Receive a clear signal when any resource crosses its threshold.
- STEPS:
  1. Set a low threshold (or let load rise).
  2. Observe the alert when the value crosses the threshold.
- ACCEPTANCE CRITERIA:
  - AC1: When a metric crosses its threshold, the corresponding panel enters a visible alarm state (e.g. valve vent + indicator lamp turns red).
  - AC2: An alert indicator lamp reflects each resource's current state (normal / warning / critical).
  - AC3: When a metric returns below threshold, its alarm state clears automatically.
- NOTES: Optional desktop Web Notification fires if the user has granted permission; email/webhook is best-effort and optional.
- RELATED: UC-009

## UC-011 : Mobile user - Use the dashboard on a small screen

- GOAL: View the dashboard on a phone or tablet.
- STEPS:
  1. Open the dashboard on a narrow viewport.
  2. Observe panels reflow into a usable vertical layout.
- ACCEPTANCE CRITERIA:
  - AC1: At viewport widths ≤ 768px, panels reflow into a single-column vertical layout.
  - AC2: All resource values remain readable (no horizontal overflow of content).
  - AC3: Interactive controls (threshold adjustment) remain operable via touch.
- NOTES: Responsive from 1920px down to mobile.
- RELATED: UC-001

## UC-012 : Operator - Inspect detail on demand

- GOAL: Get exact figures and detail without cluttering the main view.
- STEPS:
  1. Hover (or tap) a gauge, tank, or pipe.
  2. Read the tooltip with exact values.
- ACCEPTANCE CRITERIA:
  - AC1: Hovering/tapping a resource component reveals a tooltip with the exact current value.
  - AC2: The tooltip appears without navigating away from the main view.
  - AC3: The tooltip dismisses when the pointer leaves / on tap-away.
- NOTES: "Read the mood before the number" — detail is one interaction away.
- RELATED: UC-001

## UC-013 : Accessibility user - Reduce motion

- GOAL: Use the dashboard comfortably without heavy animation.
- STEPS:
  1. Enable reduced motion (OS preference or in-app toggle).
  2. Observe animations minimise while data remains live.
- ACCEPTANCE CRITERIA:
  - AC1: When `prefers-reduced-motion` is set, or the in-app reduce-motion toggle is on, continuous decorative animations (steam, particles, bubbling) are suppressed or minimised.
  - AC2: Live data values continue to update in reduced-motion mode.
  - AC3: The reduce-motion preference persists across reloads.
- NOTES: Accessibility is a v1 requirement.
- RELATED: UC-002

---

GATE 2: PASS