# Brainstorm — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Writer
- **SOURCE IDEA:** 0-IDEA.md (a living steampunk system resources dashboard that turns live machine telemetry into an immersive boiler-room scene)

---

## ELEVATOR PITCH
The Boiler Room is a full-screen system dashboard that makes a computer feel like a living engine room. CPU heat becomes furnace glow, memory becomes a pressure vessel, disks become pumping tanks, and network traffic becomes steam racing through pipes. The point is not just to monitor the machine, but to make load feel physically legible at a glance, with enough cinematic movement that the dashboard stays interesting even when nothing is wrong. It is a utility that behaves like a stage set: functional first, theatrical by design.

## AUDIENCE & EMOTIONAL GOALS
- Home lab operators who enjoy tuning their machines should feel mastery and delight when they can read the whole system as one coherent machine.
- Developers and SRE-adjacent users who keep a dashboard open all day should feel calm confidence, not alert fatigue.
- Hardware enthusiasts who care about sensors, thermals, and fan curves should feel curiosity and control when the scene responds visibly to load.
- Streamers or desk-setup enthusiasts who want a striking always-on display should feel awe and a little theatrical pride.

## EXPERIENCE EXPLORATION
- The first 30 seconds: the room powers up with a soft boiler hum, gauges warm from dim brass to active amber, and the main metrics settle into view with almost no UI chrome. A first-time user should understand immediately that hot parts are hot and busy parts are moving faster.
- The peak moment of joy: a sudden workload spike drives the CPU furnace from warm orange into an urgent red, steam vents hiss, the needle snaps upward, and the relevant process list animates to explain why the pressure changed.
- A surprising detail: each panel can have its own micro-behaviour, such as bubbles rising in memory, valve clacks for disk I/O, or tiny ember flickers that shift with temperature even when the numbers barely move.
- Optional ambient behaviour: when idle, the room does not freeze; it settles into a low mechanical rhythm with intermittent puffs of steam, a slow needle drift, and a subtle light flicker that makes the dashboard feel alive rather than waiting.

## SCREEN & FLOW IDEAS
- Boiler Room Overview — the main single-screen dashboard with all major resources visible at once; it supports quick scanning and hover inspection; it transitions into detail overlays when a gauge, tank, or process row is selected.
- Metric Detail Overlay — a modal-style close-up for CPU, memory, disk, or network history; it supports time-range exploration and threshold review; it returns to the overview without losing context.
- Process Rack — a denser drill-down where top consumers are expanded into a more forensic view; it supports process selection, command-line inspection, and trend comparison; it collapses back into the resource panel that spawned it.
- Alert Control Panel — a brass side panel with thresholds and alert states; it supports immediate tuning of limit values and acknowledgement of warnings; it slides over the overview without interrupting live telemetry.
- Interface Selector Strip — a compact surface for switching NICs or sensor sources; it supports focus without cluttering the main scene; it fades in from the network area and fades out after selection.

Flow sketch:

Overview -> Metric Detail Overlay
     |              ^
     v              |
Process Rack -> Alert Control Panel
     |
     v
Interface Selector Strip

## COMPETITIVE LANDSCAPE
- `htop` — a classic interactive process viewer that is fast, precise, and familiar to technical users. It does well at making process state readable and actionable in one place. The opportunity gap is emotional richness: it is efficient, but not atmospheric, and its resource story is still mostly textual. Source: https://htop.dev/ and https://github.com/htop-dev/htop
- `btop` — a modern terminal resource monitor with polished graphs, mouse support, and configurable panels for CPU, memory, disks, network, and processes. It does well at making system load visually approachable without leaving the terminal. The opportunity gap is that it still speaks the language of terminal dashboards; The Boiler Room can push further into metaphor, scene composition, and ambient motion. Source: https://github.com/aristocratos/btop
- `Grafana` — a flexible observability dashboard platform that unifies metrics, alerts, and panels into a single-pane view. It does well at correlation, alerting, and flexible visualization at scale. The opportunity gap is personality and immediacy; Grafana is powerful, but it is not trying to feel like a living machine. Source: https://grafana.com/grafana/
- `Conky` — a lightweight desktop system monitor that can display many kinds of information, including OS stats, process stats, and network data, with custom drawing and Lua extensibility. It does well at desktop embedding and extreme configurability. The opportunity gap is that it gives freedom, but not a strong authored experience; The Boiler Room can use that raw data freedom to create a much more intentional visual narrative. Source: https://github.com/brndnmtthws/conky

> Sources:
> - https://htop.dev/
> - https://github.com/htop-dev/htop
> - https://github.com/aristocratos/btop
> - https://grafana.com/grafana/
> - https://github.com/brndnmtthws/conky

## TECHNOLOGY SIGNALS
- Real-time updates are central, because the scene only works if the machine feels responsive to current load rather than stale snapshots.
- Sensor variability matters, because CPU temperature, GPU telemetry, disk I/O, and network stats may differ across Linux systems and hardware vendors.
- Motion budget is important, because the room needs to stay fluid at 60 fps even while updating multiple gauges and process tables.
- Persistence matters, because alert thresholds and display preferences should survive refreshes through local storage or an equivalent local settings layer.
- Offline friendliness matters, because the experience should be self-contained and not depend on external fonts or CDN assets at runtime.

## VISUAL DIRECTION
### Brass Boiler Theatre
- Descriptor: a heavy industrial engine room rendered as a theatrical stage set.
- References: Victorian boiler rooms, brass instrument panels, analog pressure gauges, riveted steel, furnace glass.
- Mood adjectives: warm, tactile, dramatic, smoky, authoritative.
- Palette: ember orange, copper, brass, soot black, oxblood red, parchment ivory.
- Typography sketch: condensed serif labels with stamped metal numerals and a bold technical sans for values.

### Midnight Observatory
- Descriptor: a darker, cleaner, more glass-and-light interpretation of the same machine.
- References: dark scientific instruments, star chart dashboards, laboratory instrumentation, watchmaker dials, phosphor displays.
- Mood adjectives: precise, quiet, electric, elegant, eerie.
- Palette: deep navy, cyan glow, teal, graphite, pale steel, warning amber.
- Typography sketch: modern condensed sans for metrics, monospace accents for technical detail, finer labels than the brass variant.

## MOOD & ATMOSPHERE
The soundscape should suggest machinery working rather than generic UI noise: a low furnace hum, occasional valve hiss, soft mechanical ticking, and a restrained crackle when load rises. Motion should feel consequential, not decorative. When the system is calm, the room is contemplative; when the system is busy, the room becomes tense but still readable. The emotional tone is “measured pressure,” not panic.

## UI & INTERACTION PRINCIPLES
- Every visual change must map to a real system state, not ornamental motion.
- The main view should answer “what is hot, what is full, and what is moving?” without forcing navigation.
- Details should appear where the user already is, not in faraway settings pages.
- Thresholds should be visible and adjustable next to the thing they control.
- Hover should explain; click should deepen; drag should change state immediately.
- Nothing important should disappear when the machine gets busy.

## METAPHORS & MENTAL MODELS
- A boiler room: useful for pressure, heat, valves, and overflow as the core mental model.
- A control deck: useful for layered panels, toggles, and operator confidence.
- A living organism: useful for breathing idle animation and signs of strain.
- A stage set: useful for dramatic lighting, composition, and a strong sense of presence.

## "WHAT IF" PROVOCATIONS
- What if the dashboard could shift from calm brass daylight to a red-alert night shift with one toggle, making the same data feel like a different workplace?
- What if each process row had a tiny mechanical avatar, like a piston or spark, that changed size based on contribution?
- What if users could pin one component so it “follows” them across every screen as a persistent warning lamp?
- **Ambitious, exploratory:** What if the room reacted to ambient sound from the microphone, brightening and pulsing when the physical workspace gets louder?
- **Ambitious, exploratory:** What if the entire scene could be projected onto a secondary display as a kinetic wallpaper mode with no controls visible at all?
- What if threshold breaches were narrated by a tiny telegraph-style ticker instead of a standard toast?
- What if a process click opened a maintenance log that felt like a ship’s engineer notebook?
- What if the GPU area could swap between “forge,” “foundry,” and “kiln” themes without changing the underlying telemetry?

## OPEN QUESTIONS FOR PRODUCT OWNER
- Is the primary use case an always-on monitor for a desk, or a diagnostic dashboard users actively inspect during incidents?
- Should the tone stay playfully theatrical at all times, or should it become more restrained in a professional mode?
- Which signals are most important on first release: CPU, memory, disk, network, GPU, temperature, or process detail?
- Do users need read-only visibility, or should the experience eventually support actions like process control and alert acknowledgement?
- Is the local agent expected to run with elevated permissions to read the richest sensor data, or should it degrade gracefully without them?

## REFERENCES
- htop. Interactive process viewer with strong process-focused ergonomics and system stats. https://htop.dev/ and https://github.com/htop-dev/htop
- btop. Resource monitor with polished panels, mouse support, and configurable CPU/memory/disk/network views. https://github.com/aristocratos/btop
- Grafana. Flexible observability dashboards, alerting, and panel composition across data sources. https://grafana.com/grafana/
- Conky. Lightweight desktop monitor with broad data hooks, custom drawing, and scripting extensibility. https://github.com/brndnmtthws/conky

GATE 1: PASS