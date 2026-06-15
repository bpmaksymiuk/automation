# Brainstorm — The Boiler Room: A Living System Resources Dashboard

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Writer
- **SOURCE IDEA:** 0-IDEA.md (a steampunk, real-time system-resources dashboard where the computer is rendered as a Victorian boiler room and load is visualised through the water-heating-to-a-boil metaphor)

---

## ELEVATOR PITCH

The Boiler Room turns the cold telemetry of a running computer into a living Victorian machine you can stand in front of and *feel*. CPU is a roaring furnace, RAM is water rolling toward a boil, disks are pressure tanks, and the network is a steam pipe carrying glowing energy out to the world. Instead of reading numbers, you read the *temperament* of your machine — calm and simmering at idle, purposeful under load, and venting steam in alarm when something runs too hot. It is a monitoring tool that behaves like an instrument panel from a Jules Verne submarine, where every gauge, bubble, and hiss is mapped to a real metric you can trust.

## AUDIENCE & EMOTIONAL GOALS

- **The Tinkerer / Enthusiast PC builder** — runs benchmarks, overclocks, watches temperatures. Dominant emotion: **mastery** — a beautiful cockpit that rewards understanding their hardware.
- **The Developer / DevOps engineer** — keeps a second monitor full of system stats while building. Dominant emotion: **calm confidence** — ambient awareness without alarm fatigue.
- **The Content creator / Streamer** — wants an on-screen overlay that looks cinematic on stream. Dominant emotion: **delight / spectacle** — something viewers comment on.
- **The Curious generalist** — not technical, but wants to know "why is my laptop slow right now?". Dominant emotion: **understanding** — the metaphor makes invisible load legible.

## EXPERIENCE EXPLORATION

- **The first 30 seconds:** The page fades up from black like a furnace door opening. Pipes and rivets settle into place, gauges sweep once from zero to full and back (a self-test, like a car dashboard), filament lamps flicker on, and a low ambient hum of machinery establishes. Within two seconds the gauges snap to live values and the room "comes alive."
- **The peak moment of insight:** The user launches a heavy task (compile, game, render). The CPU furnace flares orange, steam thickens and rises faster, the RAM boiler begins to roll and bubble, and a network pipe lights with particle flow. The machine visibly *strains* — and the user instantly understands where the load is going without reading a single number.
- **A surprising, memorable detail:** When a metric crosses its alert threshold, a tiny brass pressure-relief valve on that panel pops and vents a puff of steam with a soft hiss — a physical, satisfying "warning" that never feels like a sterile red banner.
- **Ambient / idle behaviour:** At low load the room idles beautifully — gentle wisps of steam, a slow needle drift, the occasional lamp flicker, a far-off boiler rumble. It is pleasant to leave open on a second screen as living ambience.

## SCREEN & FLOW IDEAS

All primary data lives on **one cinematic, non-scrolling page** (per the idea). Secondary surfaces are overlays summoned in-place.

1. **Boiler Room (main view)** — The single full-viewport scene with all six panels (CPU Furnace, GPU Forge, Memory Boiler, Disk Pressure Tanks, Network Steam Pipes, Alert Control Panel). Key interaction: hover any component for an exact-value tooltip. Transitions: overlays animate *over* this scene; it never navigates away.
2. **Process Inspector (inline expansion)** — Clicking a process row in any panel's "top consumers" table expands it in place to reveal full command line and a mini history sparkline. Key interaction: expand/collapse. Transitions: accordion within the panel.
3. **History Modal (gauge detail)** — Clicking a gauge label opens a 30-minute historical line graph in a brass-framed modal over a dimmed room. Key interaction: scrub the timeline. Transitions: iris-open/iris-close over the main view.
4. **Alert Control Drawer** — A collapsible brass panel sliding up from the bottom-right with threshold valves and notification toggles. Key interaction: drag valve handles to set limits. Transitions: slides in/out; room stays live behind it.
5. **Shift Toggle (palette)** — Not a screen but a global state: "Night shift" (dim amber) vs "Day shift" (brighter brass). Transitions: cross-fade the whole scene's lighting.

```
                 ┌───────────────────────────────┐
   hover ───────▶│        BOILER ROOM (main)     │◀── live data (WS/SSE)
                 │  CPU  GPU  RAM  DISK  NET  ⚙   │
                 └──┬─────────┬──────────┬────────┘
        click row  │  click  │  click ⚙ │
                   ▼  label  ▼          ▼
            Process     History      Alert Control
            Inspector    Modal         Drawer
            (inline)   (overlay)     (overlay)
```

## COMPETITIVE LANDSCAPE

- **Netdata** — gorgeous, dense real-time per-second metrics in the browser. *Does well:* breadth, granularity, zero-config auto-discovery. *Gap:* utilitarian dashboards; no emotional design or metaphor; overwhelming for non-experts.
  > Source: https://www.netdata.cloud/
- **Grafana** — the industry standard for dashboards over time-series data. *Does well:* flexibility, panels, alerting. *Gap:* requires setup and a data source; built for ops teams, not delight; aesthetics are corporate-neutral.
  > Source: https://grafana.com/
- **htop / btop++** — terminal system monitors; btop in particular is beloved for its colourful TUI. *Does well:* instant, lightweight, keyboard-driven. *Gap:* terminal-bound, no web access, no responsive/mobile, no thematic atmosphere.
  > Sources: https://htop.dev/ , https://github.com/aristocratos/btop
- **Conky / Rainmeter** — desktop system-stat widgets (Linux / Windows) prized by the customization community for skinned, artistic readouts. *Does well:* highly themeable, ambient desktop presence. *Gap:* desktop-only, not a web interface, not responsive, fiddly config.
  > Sources: https://github.com/brndnmtthws/conky , https://www.rainmeter.net/
- **Glances** — a cross-platform `psutil`-based monitor with a web mode. *Does well:* one tool, many platforms, simple web server. *Gap:* plain UI, no theming, no animation or storytelling.
  > Source: https://nicolargo.github.io/glances/

**Opportunity gap:** No mainstream tool combines *trustworthy real-time metrics* with *cinematic, emotionally legible design*. The Boiler Room owns the intersection of accurate monitoring and atmospheric spectacle — useful enough for a developer's second screen, beautiful enough for a stream overlay.

## TECHNOLOGY SIGNALS

- **Real-time / live-update requirement** — Sub-2-second refresh of many metrics; favours a push transport (WebSocket or Server-Sent Events) with a polling fallback. Architect should plan a lightweight local agent + browser client split.
- **Heavy graphics & continuous animation** — Steam, fire glow, bubbling liquid, particle pipe flow at 60 fps without jank. Signals Canvas/WebGL or carefully GPU-composited CSS/SVG; performance budgeting matters on low-power hardware.
- **Local system access** — Reading CPU/GPU/RAM/disk/network requires OS-level access (`/proc`, `sysfs`, NVML, `psutil`). Signals a server-side agent rather than a pure static page; raises a security/scope boundary (localhost-only by default).
- **Offline / self-contained delivery** — "No external CDN/fonts at runtime" means assets must be bundled or inlined; Architect should avoid runtime third-party dependencies.
- **Responsive across desktop → tablet → mobile** — One scene must reflow from a 1920×1080 cockpit to a vertical mobile stack; signals a layout strategy that degrades animation gracefully on small/low-power devices.
- **Optional notification egress** — Email/phone/browser alerts on threshold breach introduces an outbound integration point (webhook/SMTP) and associated configuration/secret handling.

## VISUAL DIRECTION

**Direction A — "Coal & Brass" (warm industrial), recommended.**
- References: Victorian boiler/engine rooms; the engine room of *20,000 Leagues Under the Sea*; brass diving-helmet instrument aesthetics; *BioShock*'s art-deco machinery.
- Mood adjectives: warm, weighty, glowing, mechanical, characterful.
- Palette: oil-black `#15110D`, iron `#2A2622`, aged brass `#B68A4E`, copper `#9C5B2E`, ember amber `#E8902A`, alarm red `#C5402B`.
- Typography: condensed engraved serif for numerals/labels (stamped-metal feel) + a clean monospace for raw values.

**Direction B — "Blueprint & Steam" (cool technical).**
- References: cyanotype engineering blueprints; patent drawings; cool-toned schematic overlays; teal-glass pressure gauges.
- Mood adjectives: precise, calm, schematic, luminous, cerebral.
- Palette: deep navy `#0E1A24`, steel `#274050`, blueprint cyan `#3FB4C4`, paper-white line `#DCE6EA`, warning amber `#E8B43A`, alarm coral `#E5604A`.
- Typography: technical monospace + a thin geometric sans for annotations.

Both directions keep the boiler-room metaphor; A leans spectacle, B leans instrument. The Graphic Artist will choose or blend later.

## MOOD & ATMOSPHERE

Imagine a slow, deep machine-room drone underpinning everything — the breathing of a great engine. Idle state: distant boiler rumble, occasional valve tick, a faint electrical hum from filament lamps. Under load: the drone rises in pitch and density, steam *whooshes*, and threshold breaches punctuate with a brass valve *hiss*. Motion is the soundtrack made visible — steam rising, needles trembling, liquid rolling. Even muted, the scene should *read* as audible: you can almost hear the hiss when the valve pops.

## UI & INTERACTION PRINCIPLES

- **Every pixel maps to a real metric.** No decorative-only data; the metaphor must always be honest.
- **Read the mood before the number.** A glance should convey system state; exact figures are one hover away.
- **No screen is a dead end.** Overlays return you to the live room; nothing navigates into a cul-de-sac.
- **Calm by default, loud only when it matters.** Alerts earn attention through physical events (a vent, a shudder), not constant red.
- **Degrade gracefully.** On weak hardware or small screens, drop particles before dropping data.

## METAPHORS & MENTAL MODELS

- **The boiler room** — the whole machine as a pressurised engine; implies gauges, valves, pipes, and the ever-present risk of "too much pressure."
- **Water heating to a boil** — the core load metaphor: simmer (idle) → rolling boil (load) → violent boil + venting (critical). Implies smooth, continuous, physically-intuitive state changes.
- **The furnace** — CPU/GPU as fire you feed; brighter and hotter under work. Implies temperature, glow, and the danger of overheating.
- **The pressure-relief valve** — the alert system as a safety mechanism that *vents*, framing warnings as the machine protecting itself rather than scolding the user.

## "WHAT IF" PROVOCATIONS

1. What if the ambient soundscape were real audio synthesised from live load (procedural engine hum that rises with CPU)? *(exploratory)*
2. What if users could "stoke the furnace" — a playful stress-test button that loads the CPU to demo the visuals?
3. What if multiple machines appeared as multiple boilers in one large engine hall (fleet view)? *(exploratory, out of initial scope)*
4. What if a "history replay" let you scrub the last hour and watch the room re-enact the load like a recording?
5. What if thresholds could trigger physical smart-home effects (a real lamp turning red via webhook)? *(exploratory)*
6. What if the theme were swappable (steampunk, blueprint, nuclear-reactor control room)?
7. What if an "engineer's logbook" auto-noted notable events ("furnace hit 95% for 4 min at 14:03")?
8. What if it shipped as a screensaver / OBS browser-source preset for streamers? *(exploratory)*

## OPEN QUESTIONS FOR PRODUCT OWNER

1. **Platform scope:** Is the initial target Linux-only (per the idea's `/proc`/`sysfs` mention), or must Windows/macOS be first-class from v1?
2. **Notification scope:** Must email/phone alerts ship in v1, or is in-browser/desktop notification sufficient for the first release (with email as a later enhancement)?
3. **GPU support:** Is GPU monitoring required for v1 even on machines without a discrete GPU, or should it degrade gracefully / be optional?
4. **Architecture boundary:** Is a local server-side agent acceptable, or does the user expect a single static HTML file with no backend (which would limit real system access)?
5. **Single vs multi-machine:** Is v1 strictly the local machine, with fleet/multi-host explicitly out of scope?
6. **Animation vs accessibility:** How should we handle "reduce motion" users — a calm static variant, and is that a v1 requirement?

## REFERENCES

- **Competitive landscape:**
  - Netdata — https://www.netdata.cloud/
  - Grafana — https://grafana.com/
  - htop — https://htop.dev/
  - btop++ — https://github.com/aristocratos/btop
  - Conky — https://github.com/brndnmtthws/conky
  - Rainmeter — https://www.rainmeter.net/
  - Glances — https://nicolargo.github.io/glances/
- **Technology:**
  - psutil (cross-platform process/system utilities) — https://github.com/giampaolo/psutil
  - Server-Sent Events (MDN) — https://developer.mozilla.org/docs/Web/API/Server-sent_events
- **Visual direction:**
  - BioShock art direction (art-deco machinery) — https://bioshock.fandom.com/
  - Cyanotype / blueprint aesthetic (overview) — https://en.wikipedia.org/wiki/Cyanotype

---

GATE 1: PASS
