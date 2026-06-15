# Narrative Vision — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Writer
- **SOURCE INPUTS:** 2-USE-CASES.md, 1-BRAINSTORM.md

## OVERVIEW

The Boiler Room is a real-time system-resources dashboard that turns a computer into a single living engine room. CPU and GPU become paired furnaces, RAM and VRAM become paired boilers, disk and network traffic become surface-mounted steam pipes, and the alert panel becomes a brass control station that can vent pressure when thresholds are crossed. The result is not a generic monitoring wall; it is a readable machine metaphor that makes system state feel physical at a glance.

It is designed for users who want immediate, honest awareness of their local machine: home lab operators, developers, streamers, hardware enthusiasts, and anyone who keeps a resource monitor open because they care what the system is doing right now. The product solves the gap between raw observability and emotional legibility. It shows the real data, but it stages that data in a form that makes load, heat, pressure, and throughput intuitive without hiding the numbers behind the metaphor.

The experience is deliberately local and lightweight. A small agent provides live metrics or a demo fallback, and a self-contained browser page renders the entire scene in one non-scrolling viewport. When the machine is calm, the room breathes quietly; when load rises, the room becomes more animated, more urgent, and more informative. The user never has to choose between a beautiful interface and a trustworthy one, because the beauty is the interface for the truth.

## COMPETITIVE & CREATIVE RESEARCH

- **Netdata** — a real-time observability product focused on per-second truth, lightweight edge collection, and instant answers from live metrics. What to match: the feeling that the data is fresh and actionable the moment the page loads. What to exceed: Netdata is informationally dense and operationally serious; The Boiler Room should be more singular, more scene-like, and more immediately memorable for a local-machine audience. Source: https://www.netdata.cloud/
- **Grafana** — the canonical flexible dashboard platform for metrics, alerting, and time-series composition. What to match: threshold-driven alerting, clean data credibility, and the idea that one view can unify multiple signals. What to exceed: Grafana is powerful but visually neutral; The Boiler Room should feel authored, theatrical, and metaphor-driven without sacrificing clarity. Source: https://grafana.com/grafana/
- **btop** — a polished terminal system monitor with strong readability, per-core views, and configurable panels for CPU, memory, disk, network, and processes. What to match: quick scanning, compactness, and satisfying at-a-glance state changes. What to exceed: btop stays in the language of terminal tools; The Boiler Room can turn the same control surface into a full visual world. Source: https://github.com/aristocratos/btop
- **htop** — the classic interactive process viewer that still sets the standard for direct, no-nonsense process inspection. What to match: fast process comprehension and a clear hierarchy between current load and top consumers. What to exceed: htop is efficient and trusted, but it is intentionally spare; The Boiler Room can make the same information feel alive, spatial, and atmospheric. Source: https://htop.dev/ and https://github.com/htop-dev/htop
- **Rainmeter / Conky** — desktop customization and system-display ecosystems that prove people enjoy monitoring their systems as part of the environment, not just as a utility. What to match: personal expression, ambient presence, and the appeal of always-on desktop instrumentation. What to exceed: these tools are powerful but often authoring-heavy or desktop-bound; The Boiler Room can deliver a more cohesive, browser-native experience with a stronger narrative. Sources: https://www.rainmeter.net/ and https://github.com/brndnmtthws/conky

## THEMES AND TONE

- **Theme — Honest Instrumentation.** Every visual flourish must correspond to a real metric. The room can be dramatic, but it cannot lie.
- **Theme — Heat as Effort.** Compute work becomes fire, memory becomes boil, and throughput becomes flow. This gives the user a physical way to understand load without decoding charts first.
- **Theme — Pressure and Release.** Alerts are not abstract errors; they are valves, lamps, and vents responding to rising pressure. This keeps warnings grounded in the engine-room metaphor.
- **Theme — Calm Vigilance.** The dashboard is designed to be left open. Idle state should feel steady and watchful, not blank or noisy.
- **Theme — Local Control.** The room belongs to the user’s machine. Thresholds, motion preferences, and alert settings should feel like operator controls, not remote SaaS configuration.

Voice and register should be confident, concrete, and lightly industrial. The UI should speak like a seasoned engineer: short labels, plain terms, no decorative jargon in the visible surface, and precise detail only when the user asks for it. The tone is warm rather than corporate, and serious without becoming grim. When the system is healthy, the room should feel welcoming; when it is under strain, it should feel urgent but not chaotic.

## WORLD-BUILDING / CONCEPTS

- **The Boiler Room.** The product lives in one continuous machine space, not a set of disconnected pages. This justifies the one-viewport dashboard and makes every panel feel physically related to the others.
- **The Furnace.** CPU and GPU are not charts; they are sources of heat and effort. Separate furnaces make parallel compute immediately legible.
- **The Boiler.** RAM and VRAM are tanks whose volume and boil state express capacity and pressure. The “water heating upward” idea turns memory into something tactile and easy to compare.
- **The Steam Pipe.** Disk and network activity are carried as visible flow through pipes. Direction, density, and colour make throughput understandable without stopping to read a legend.
- **The Relief Valve.** Thresholds are operator-controlled safety limits. When a metric crosses the line, the room vents, flashes, and speaks in the language of a machine protecting itself.
- **The Operator’s Station.** The user is not browsing a report; they are standing watch. Hovering, dragging, and acknowledging alerts are all acts of supervision inside the same physical scene.

The main mental model is that the machine is alive but legible. A glance should answer three questions: what is hot, what is full, and what is moving? The remaining detail is available on demand, but the first read should always be spatial and emotional before it becomes numerical. That is what makes the dashboard feel like an experience rather than a report.

GATE 3: PASS