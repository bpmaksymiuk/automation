# Narrative Vision — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Writer
- **SOURCE INPUTS:** 2-USE-CASES.md, 1-BRAINSTORM.md

## OVERVIEW

The Boiler Room is a real-time system-resources dashboard that reimagines your computer as a living Victorian steam engine. Where conventional monitors present a wall of numbers and sparklines, the Boiler Room presents *temperament*: a furnace that roars when the CPU works, water that rolls toward a boil as memory fills, pressure tanks for disks, and a glowing steam pipe for the network. It is built for people who keep an eye on their machine — PC enthusiasts, developers, DevOps engineers, and streamers — and for the merely curious who just want to understand why a laptop feels slow right now.

The product solves a real problem hiding behind an aesthetic one. System monitors are either powerful but cold (Grafana, Netdata) or charming but limited (terminal tools, desktop widgets). The Boiler Room occupies the gap between *trustworthy* and *beautiful*: every animated element is bound to a genuine metric, so the spectacle is also the data. A glance communicates whether the machine is calm, working, or in distress; a hover reveals the exact figures; a drag of a pressure-valve sets the threshold at which the machine sounds its alarm.

It runs as a lightweight local agent feeding a single, self-contained web page. The page never scrolls — the whole engine room lives in one cinematic viewport — and it reflows gracefully from a desktop cockpit down to a phone. When no agent is present, the room still breathes in a demonstration mode, so the experience is never blank.

## COMPETITIVE & CREATIVE RESEARCH

- **Netdata** (https://www.netdata.cloud/) — Best-in-class breadth and per-second granularity in the browser. Lesson to adopt: trust comes from genuinely live, high-frequency data. Lesson to improve on: its density overwhelms non-experts; the Boiler Room trades exhaustiveness for legibility.
- **Grafana** (https://grafana.com/) — The reference for time-series dashboards and alerting. Lesson to adopt: user-configurable thresholds and clear alert states. Lesson to improve on: it is neutral-corporate and setup-heavy; the Boiler Room is opinionated, atmospheric, and zero-config locally.
- **btop++ / htop** (https://github.com/aristocratos/btop, https://htop.dev/) — Beloved terminal monitors; btop proves that *delight* and *system monitoring* are not mutually exclusive. Lesson to adopt: per-core visual breakdown and instant readability. Lesson to improve on: terminal-bound, no responsive web or mobile reach.
- **Conky / Rainmeter** (https://github.com/brndnmtthws/conky, https://www.rainmeter.net/) — Prove a passionate audience exists for *themed, artistic* system readouts. Lesson to adopt: ambient, characterful presence. Lesson to improve on: desktop-only and fiddly; the Boiler Room is a portable web experience.
- **Glances** (https://nicolargo.github.io/glances/) — A `psutil`-based cross-platform monitor with a simple web mode. Lesson to adopt: one small agent, many metrics, easy to run. Lesson to improve on: plain UI with no story; the Boiler Room wraps the same honest data in a world.

## THEMES AND TONE

- **Theme — The Living Machine.** The computer is not a chart; it is a creature of iron and fire that breathes, strains, and rests. Everything animates with purpose.
- **Theme — Pressure and Release.** Load is pressure building in a sealed system; alerts are the relief valve venting. This frames warnings as the machine protecting itself, not nagging the user.
- **Theme — Heat as Effort.** Work is heat. The harder a component labours, the hotter and brighter it glows — an instantly intuitive mapping from idle simmer to rolling boil.
- **Theme — Honest Instrumentation.** Beauty never lies. Every gauge, flame, bubble, and particle is bound to a true measurement; decoration and data are the same thing.
- **Theme — Calm by Default.** The room is pleasant to leave running. It earns attention only when something genuinely matters, through physical events rather than constant red.

**Voice and register:** Confident, warm, and lightly Victorian-industrial — the tone of a seasoned chief engineer narrating their engine room. Labels are tactile and concrete ("Furnace", "Boiler", "Relief Valve") rather than abstract ("CPU Panel", "Memory Widget"). Microcopy is brief, plain, and reassuring; alarms are direct without being alarming. Never jargon-heavy in the visible UI; precise terminology lives in tooltips and detail views for those who want it.

## WORLD-BUILDING / CONCEPTS

- **The Boiler Room (mental model).** The entire machine is a single pressurised engine room observed from the operator's station. This implies a unified, non-scrolling scene where every subsystem is a fixture in one place — gauges, tanks, pipes, and a control panel — rather than separate pages.
- **Water Heating to a Boil (core metaphor).** Load maps to thermal state on a continuous scale: *simmer* at idle, *rolling boil* under load, *violent boil with venting* at critical. This model governs how every panel escalates — smoothly and physically — and anchors the memory panel literally.
- **The Furnace (CPU/GPU).** Compute is fire you feed; brighter, hotter, and faster-breathing under work, with the ever-present notion of overheating. Per-core "burner flames" make parallel load tangible.
- **The Pressure-Relief Valve (alerts).** Crossing a threshold pops a valve that vents steam with a hiss. Alerts are framed as safety mechanisms, giving warnings weight and physicality without resorting to sterile banners.
- **The Steam Pipe (network).** Throughput is energy carried out to the world as glowing particles flowing through a pipe — directional, dense when busy, quiet when idle.
- **The Operator's Station (the user).** The user is the engineer on watch: reading mood first, numbers on demand, and setting the pressures at which the machine should cry out.

---

GATE 3: PASS
