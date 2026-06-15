# Stage 5 Requirements

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Business Analyst
- **SOURCE INPUTS:** 2-USE-CASES.md, 3-NARRATIVE-VISION.md, 4-CONCEPT-STORYBOARD.md

> Sources (implementability research): psutil exposes `cpu_percent(percpu=True)`, `virtual_memory()`, `swap_memory()`, `disk_partitions()`, `disk_usage()`, `disk_io_counters()`, `net_io_counters()`, `process_iter()`, `sensors_temperatures()`, and `sensors_fans()`, confirming the needed Linux-first system metrics are available from one library (https://psutil.readthedocs.io/). Server-Sent Events provide a one-way server→client live stream over plain HTTP with automatic reconnection via `EventSource` (https://developer.mozilla.org/docs/Web/API/Server-sent_events). The `prefers-reduced-motion` media feature is the standard browser hook for honoring a user’s reduced-motion preference (https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion).

## Functional Requirements

### BR-001 : Single-page resource overview

The system shall present the CPU flame, GPU flame, RAM boiler, VRAM boiler, disk, and network areas together within a single browser viewport without requiring vertical page scrolling on a 1920×1080 display.

- **TESTABLE CONDITION:** On load at 1920×1080, the resource areas (CPU, GPU, RAM, VRAM, disk, network) and the alert panel are all present in the DOM and the document body does not exceed the viewport height (no vertical scrollbar on the page).
- **NOTES:** Layout is paired furnaces (CPU+GPU) over paired boilers (RAM+VRAM), joined by the disk/network steam-pipe network. Overlays may appear above the main view but the base view is non-scrolling.
- **RELATED:** UC-001

### BR-002 : Initial value population

The system shall display a numeric current value for each resource panel within 3 seconds of page load.

- **TESTABLE CONDITION:** Within 3 seconds of load, each resource panel shows at least one numeric value (not a blank or placeholder).
- **NOTES:** Demo data satisfies this when no agent is present.
- **RELATED:** UC-001, UC-002

### BR-003 : Real-time refresh interval

The system shall update displayed metric values at least once every 2 seconds without a full page reload.

- **TESTABLE CONDITION:** Observed metric values change (or are re-rendered with a fresh timestamp) at intervals no longer than 2 seconds while the page remains open.
- **NOTES:** Applies to live and demo modes.
- **RELATED:** UC-002

### BR-004 : Live connection state indicator

The system shall display a connection-state indicator showing whether data is live, demo, or disconnected.

- **TESTABLE CONDITION:** A visible indicator element reads one of "live", "demo", or "disconnected" and changes to match the active data source.
- **NOTES:** Defaults to demo when no agent reachable.
- **RELATED:** UC-002

### BR-005 : Demo fallback

The system shall render a functioning dashboard using internally generated sample data when no metrics agent is reachable.

- **TESTABLE CONDITION:** With no agent running, the dashboard loads, populates all panels, and animates without console-fatal errors.
- **NOTES:** Enables viewing and testing without a backend.
- **RELATED:** UC-001, UC-002

### BR-006 : CPU overall gauge

The system shall display overall CPU utilisation as a percentage from 0 to 100 on a gauge.

- **TESTABLE CONDITION:** The CPU panel shows a numeric percentage between 0 and 100 inclusive, and the gauge indicator position corresponds to that value.
- **NOTES:** —
- **RELATED:** UC-003

### BR-007 : CPU per-core breakdown

The system shall render one per-core visual element for each logical CPU core, scaled to that core's utilisation.

- **TESTABLE CONDITION:** The count of per-core elements equals the reported logical core count, and each element's magnitude tracks its core's percentage.
- **NOTES:** In demo mode a representative core count is used.
- **RELATED:** UC-003

### BR-008 : CPU load visual intensity

The system shall render the CPU flame in a red palette and increase its flame height/intensity as overall CPU utilisation increases.

- **TESTABLE CONDITION:** The CPU flame uses red-family colouring, and a measurable visual property bound to the flame (e.g. height/intensity) increases monotonically with rising CPU percentage.
- **NOTES:** Red CPU flame contrasts the blue GPU flame beside it; visual is bound to the metric.
- **RELATED:** UC-003

### BR-009 : GPU utilisation gauge

The system shall display GPU utilisation as a percentage rendered as a blue flame, placed beside the CPU flame, when a GPU is detected.

- **TESTABLE CONDITION:** When GPU data is present, the GPU flame uses blue-family colouring, shows a 0–100 percentage, and sits adjacent to the CPU flame.
- **NOTES:** Blue GPU flame contrasts the red CPU flame.
- **RELATED:** UC-004

### BR-010 : VRAM boiler display

The system shall display GPU video-memory (VRAM) usage as its own boiler beside the RAM boiler, with a fill level and used/total values, when a GPU is detected.

- **TESTABLE CONDITION:** When GPU data is present, a VRAM boiler shows used and total VRAM figures and a fill level proportional to used/total, positioned beside the RAM boiler.
- **NOTES:** VRAM is no longer a bar inside the GPU panel; it is a paired boiler (see UC-005).
- **RELATED:** UC-004, UC-005

### BR-011 : GPU graceful absence

The system shall display a clear "GPU not available" state for the GPU flame and an empty/offline VRAM boiler, and continue operating, when no GPU or GPU sensor is detected.

- **TESTABLE CONDITION:** With no GPU data, the GPU flame shows an explicit unavailable message, the VRAM boiler renders empty/offline, and the rest of the dashboard remains functional with no fatal error.
- **NOTES:** GPU is optional hardware.
- **RELATED:** UC-004

### BR-012 : Memory fill level

The system shall display used RAM as a percentage of total RAM on a boiler fill indicator.

- **TESTABLE CONDITION:** The RAM boiler shows a fill level equal (within rounding) to used/total memory and a corresponding percentage.
- **NOTES:** —
- **RELATED:** UC-005

### BR-013 : Memory breakdown

The system shall display a memory breakdown including used, available (or cached), free, and swap usage with byte-based values.

- **TESTABLE CONDITION:** The panel lists used, available/cached, free, and swap figures with human-readable byte units.
- **NOTES:** —
- **RELATED:** UC-005

### BR-014 : Memory boil escalation

The system shall intensify a boiler's boiling animation when that boiler's utilisation rises above a high-usage threshold.

- **TESTABLE CONDITION:** Above the high-usage threshold, a measurable change in the boil animation state occurs versus below it, for the RAM and VRAM boilers.
- **NOTES:** Core water-to-boil metaphor.
- **RELATED:** UC-005

### BR-015 : Per-filesystem disk capacity

The system shall display one capacity indicator per detected mounted filesystem showing used and total capacity.

- **TESTABLE CONDITION:** The number of disk indicators equals the count of reported filesystems, each showing used and total capacity.
- **NOTES:** Demo mode shows representative mounts.
- **RELATED:** UC-006

### BR-016 : Disk I/O throughput

The system shall display current disk read and write throughput in bytes per second, rendered as steam-pipe flows (write as an outlet pipe, read as an inlet pipe).

- **TESTABLE CONDITION:** The disk area shows numeric read and write rates with byte-rate units that update over time, and the read/write flows are drawn as steam pipes.
- **NOTES:** Read-only; the dashboard never writes to monitored disks. Shares the pipe-network visual language with the network flows.
- **RELATED:** UC-006

### BR-017 : Disk fill accuracy

The system shall represent each filesystem's fill level as its used percentage within ±1 percentage point of the reported value.

- **TESTABLE CONDITION:** For each filesystem, the rendered fill proportion matches the reported used percentage within ±1pp.
- **NOTES:** —
- **RELATED:** UC-006

### BR-018 : Network throughput display

The system shall display current network transmit and receive rates in human-readable byte-per-second units.

- **TESTABLE CONDITION:** The network panel shows TX and RX rates with human-readable units that update over time.
- **NOTES:** —
- **RELATED:** UC-007

### BR-019 : Network rolling history

The system shall display a rolling line graph covering at least the most recent 60 seconds of transmit and receive activity.

- **TESTABLE CONDITION:** The network graph plots a time series spanning at least 60 seconds for both TX and RX and advances over time.
- **NOTES:** —
- **RELATED:** UC-007

### BR-020 : Network flow animation

The system shall render network transmit/receive as steam-pipe flows whose density varies in proportion to current throughput, with transmit as an outlet pipe and receive as an inlet pipe.

- **TESTABLE CONDITION:** A measurable flow property increases with higher throughput and decreases with lower throughput, and the flow is drawn as a steam pipe.
- **NOTES:** —
- **RELATED:** UC-007

### BR-021 : Top CPU consumers table

The system shall display a table of at least the top five CPU-consuming processes adjacent to the CPU panel.

- **TESTABLE CONDITION:** The CPU process table contains at least five rows ordered by CPU usage descending.
- **NOTES:** —
- **RELATED:** UC-008

### BR-022 : Top memory consumers table

The system shall display a table of at least the top five memory-consuming processes adjacent to the memory panel.

- **TESTABLE CONDITION:** The memory process table contains at least five rows ordered by memory usage descending.
- **NOTES:** —
- **RELATED:** UC-008

### BR-023 : Process row contents

The system shall display the process name, process identifier, and the relevant usage metric for each row in a process table.

- **TESTABLE CONDITION:** Each process row shows a name, a PID, and a usage value.
- **NOTES:** —
- **RELATED:** UC-008

### BR-024 : Process table re-ranking

The system shall re-rank process tables as the underlying usage data updates.

- **TESTABLE CONDITION:** When sample data changes ordering, the rendered table order updates to match within one refresh interval.
- **NOTES:** —
- **RELATED:** UC-008

### BR-025 : Adjustable thresholds

The system shall provide an adjustable alert threshold control for each of CPU, GPU, memory, disk, and network.

- **TESTABLE CONDITION:** Each of the five resources has an interactive threshold control whose value can be changed by the user.
- **NOTES:** Defaults provided per resource.
- **RELATED:** UC-009

### BR-026 : Threshold zone recolouring

The system shall update the affected panel's warning and critical colouring immediately when its threshold is changed.

- **TESTABLE CONDITION:** Changing a threshold re-renders the panel's zone colouring without a page reload.
- **NOTES:** —
- **RELATED:** UC-009

### BR-027 : Threshold persistence

The system shall persist threshold settings across page reloads.

- **TESTABLE CONDITION:** After setting a threshold and reloading, the previously set threshold value is restored.
- **NOTES:** Stored in browser local storage.
- **RELATED:** UC-009

### BR-028 : Alarm state on breach

The system shall place a panel into a visible alarm state when its metric crosses the configured threshold.

- **TESTABLE CONDITION:** When a metric exceeds its threshold, the panel shows a distinct alarm appearance (e.g. red/critical styling and indicator).
- **NOTES:** —
- **RELATED:** UC-010

### BR-029 : Per-resource indicator lamps

The system shall display an indicator reflecting each resource's current state as normal, warning, or critical.

- **TESTABLE CONDITION:** Each resource has an indicator that shows one of three states matching its current value relative to threshold.
- **NOTES:** —
- **RELATED:** UC-010

### BR-030 : Automatic alarm clear

The system shall clear a panel's alarm state automatically when its metric returns below the threshold.

- **TESTABLE CONDITION:** After a metric drops below threshold, the alarm appearance reverts to normal within one refresh interval.
- **NOTES:** —
- **RELATED:** UC-010

### BR-031 : Optional desktop notification

The system shall send a desktop notification on threshold breach when the user has granted notification permission.

- **TESTABLE CONDITION:** With notification permission granted, crossing a threshold triggers a Web Notification; without permission, no notification is attempted and no error occurs.
- **NOTES:** Email/webhook is best-effort and optional; SMS out of scope.
- **RELATED:** UC-010

### BR-032 : Mobile single-column reflow

The system shall reflow the panels into a single vertical column at viewport widths of 768 pixels or less.

- **TESTABLE CONDITION:** At ≤768px width, panels are arranged in one column and content does not overflow horizontally.
- **NOTES:** —
- **RELATED:** UC-011

### BR-033 : Touch-operable controls

The system shall allow threshold controls to be operated by touch input.

- **TESTABLE CONDITION:** On a touch device/emulation, a threshold control's value can be changed via touch interaction.
- **NOTES:** —
- **RELATED:** UC-011

### BR-034 : Detail tooltip

The system shall display a tooltip with the exact current value when a resource component is hovered or tapped.

- **TESTABLE CONDITION:** Hovering/tapping a resource component reveals a tooltip containing the exact current value and dismisses on leave/tap-away.
- **NOTES:** Detail-on-demand without leaving the main view.
- **RELATED:** UC-012

### BR-035 : Reduced-motion suppression

The system shall suppress or minimise continuous decorative animations when reduced motion is requested via the operating-system preference or an in-app toggle.

- **TESTABLE CONDITION:** With `prefers-reduced-motion: reduce` or the in-app toggle active, continuous decorative animations are not running while data still updates.
- **NOTES:** —
- **RELATED:** UC-013

### BR-036 : Reduced-motion persistence

The system shall persist the in-app reduced-motion preference across page reloads.

- **TESTABLE CONDITION:** After enabling the in-app reduce-motion toggle and reloading, the preference remains active.
- **NOTES:** —
- **RELATED:** UC-013

### BR-037 : Proportional boiler sizing

The system shall size the RAM and VRAM boiler vessels in proportion to their real total capacities, so the larger-capacity pool renders as the visibly larger vessel.

- **TESTABLE CONDITION:** Given differing RAM and VRAM total capacities, the rendered vessel dimension (e.g. height) of the larger-capacity boiler is greater than that of the smaller-capacity boiler, scaled to the capacity ratio within rounding.
- **NOTES:** When VRAM total is unknown/zero, the VRAM boiler renders at a minimum legible size without erroring.
- **RELATED:** UC-005

### BR-038 : Steam-pipe I/O network routing

The system shall draw disk and network read/write flows as a connected steam-pipe network that routes from the furnaces to a set of labelled inlets (reads / receive) and outlets (writes / transmit).

- **TESTABLE CONDITION:** Disk read/write and network TX/RX are each rendered as pipe flows that visually connect the furnace region to distinct inlet and outlet endpoints, using one consistent pipe visual language.
- **NOTES:** Inlets correspond to inbound flows (disk read, network receive); outlets to outbound flows (disk write, network transmit).
- **RELATED:** UC-006, UC-007

### BR-039 : Green/yellow colour scheme

The system shall present its interface using a green-primary, yellow/amber-accent colour scheme on a dark background.

- **TESTABLE CONDITION:** Sampled primary theme tokens fall in the green hue family and accent tokens in the yellow/amber family, over a dark background, while body text still meets the contrast requirement in BR-NF-ACCESSIBILITY.
- **NOTES:** Aesthetic revision; must not reduce readability below 4.5:1.
- **RELATED:** UC-001

## Non-Functional Baseline

- BR-NF-ACCESSIBILITY: The system shall provide a reduced-motion mode (see BR-035), shall meet a minimum text contrast ratio of 4.5:1 for body text against its background, and shall keep all interactive controls keyboard-operable with visible focus.
  - **TESTABLE CONDITION:** Reduced-motion works (BR-035); sampled body text meets ≥4.5:1 contrast; threshold controls and toggles are reachable and operable via keyboard with a visible focus indicator.
- BR-NF-PERFORMANCE: The system shall maintain interactive responsiveness with continuous animations targeting smooth rendering (aim 60 fps; degrade gracefully on low-power hardware) and shall keep initial content visible within 3 seconds of load (see BR-002).
  - **TESTABLE CONDITION:** Initial values appear within 3 s; animation does not block UI interaction; reduced-motion path removes continuous animation cost.
- BR-NF-SECURITY: The system shall not embed secrets in client-delivered files, shall bind the metrics agent to localhost by default, shall treat all monitored system data as read-only, and shall avoid unsafe HTML injection of dynamic values.
  - **TESTABLE CONDITION:** No credentials/secrets in shipped client files; agent default bind address is loopback; dynamic values are inserted as text, not raw HTML; no disk/process write operations are performed by the dashboard.

## Traceability

| UC | Covered by BRs |
|---|---|
| UC-001 | BR-001, BR-002 |
| UC-002 | BR-002, BR-003, BR-004, BR-005 |
| UC-003 | BR-006, BR-007, BR-008 |
| UC-004 | BR-009, BR-010, BR-011 |
| UC-005 | BR-012, BR-013, BR-014, BR-037 |
| UC-006 | BR-015, BR-016, BR-017, BR-038 |
| UC-007 | BR-018, BR-019, BR-020, BR-038 |
| UC-008 | BR-021, BR-022, BR-023, BR-024 |
| UC-009 | BR-025, BR-026, BR-027 |
| UC-010 | BR-028, BR-029, BR-030, BR-031 |
| UC-011 | BR-032, BR-033 |
| UC-012 | BR-034 |
| UC-013 | BR-035, BR-036 |
| Cross-cutting | BR-039, BR-NF-ACCESSIBILITY, BR-NF-PERFORMANCE, BR-NF-SECURITY |

GATE 5: PASS

