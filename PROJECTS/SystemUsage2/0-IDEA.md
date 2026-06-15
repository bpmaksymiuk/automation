# The Boiler Room — A Living System Resources Dashboard

## The Analogy: Your Computer as a Steam Engine

Think of your computer as a Victorian-era boiler room. The **CPU** is the furnace — the hotter and harder it burns, the more work gets done, but push it too hard and the pipes crack. **RAM** is the water in the boiler — too little and the engine starves; too much steam pressure with nowhere to go and the whole system seizes. The **GPU** is a secondary furnace for heavy rendering labour. **Disk I/O** is the coal conveyor — the rate at which raw fuel (data) arrives for processing. **Network** is the steam pipe that carries energy out to the world — when it's flowing freely, things hum; when it backs up, everything stalls.

When your system is idle, the water barely simmers. Under moderate load it rolls to a gentle boil. Under full stress the boiler roars, pressure gauges spike into the red, and safety valves begin to hiss. The dashboard makes this metaphor literal and visual.

---

## Vision

A single, full-page web dashboard that immerses the viewer in an animated steampunk boiler room. Every system metric is expressed both numerically and through a physical metaphor — rising steam, spinning gauges, bubbling liquids, glowing furnace fire. The page never scrolls; all data lives in one cinematic viewport. Real-time updates breathe life into the scene; the room literally heats up as load increases.

---

## Visual & Atmospheric Design

### Aesthetic
- **Dark, oil-stained iron** background with riveted plate textures and aged brass fittings
- **Amber and copper accent palette** — glowing ember tones shift toward angry red as thresholds approach
- **Vintage serif + condensed sans typography** — stamped-metal numerals, engraved labels
- **Depth layering** — foreground pipes and gauges, mid-layer boiler tanks, background furnace glow bleeding through smoke

### Animations & Atmospheric Effects
- **Parallax steam clouds** — translucent wisps rise continuously from hot components; intensity scales with CPU/GPU load
- **Furnace fire glow** — a pulsing orange/red radiance behind the CPU gauge that breathes faster under high load
- **Bubbling liquid level** — RAM and disk tanks fill/drain with animated liquid; bubbles rise from the surface when utilisation crosses 60 %
- **Spinning pressure gauges** — analogue needle gauges for CPU and GPU with animated needle sweeps and a subtle mechanical vibration at high values
- **Pipe particle flow** — glowing particles travel along illustrated pipes to represent network TX/RX; more particles = more throughput
- **Pressure-valve hiss** — a small animated vent emits a steam burst when any metric crosses its alert threshold
- **Flickering filament lamps** — ambient lighting around each panel flickers subtly; more agitated near overloaded components
- **Riveted panel shake** — a brief mechanical shudder animation on any gauge that enters the critical (red) zone

---

## Dashboard Panels — All on One Page

### 1. CPU Furnace (top-left)
- Large circular analogue pressure gauge — needle sweeps 0–100 %
- Core-count breakdown shown as individual coal-burner flames (one per logical core), flame height = per-core load
- Animated ember glow behind the gauge brightens with temperature (derived from CPU temp sensor if available)
- Adjacent process table: top 5 CPU consumers — name, PID, % CPU, trend sparkline

### 2. GPU Forge (top-right)
- Mirror layout to CPU — second large gauge
- VRAM usage shown as a molten-metal fill level in a crucible graphic
- Shader/render load expressed as glowing coil brightness
- Adjacent process table: top 5 GPU consumers — name, VRAM MB, % GPU

### 3. Memory Boiler (centre-left)
- Tall cylindrical tank with animated liquid fill; liquid colour transitions blue → amber → red as utilisation rises
- Bubbles animate from surface at > 60 % fill; vigorous rolling boil at > 85 %
- Swap usage shown as a secondary darker-coloured layer at the bottom of the tank
- Breakdown donut: used / cached / free / swap — segments glow on hover with exact MB/GB tooltip
- Adjacent process table: top 5 RAM consumers

### 4. Disk Pressure Tanks (centre-right)
- One cylindrical tank per mounted filesystem, arranged in a rack
- Fill level = used / total; read/write activity shown as pipe valves animated open/closed
- Sequential read and write speeds shown as flow-rate dials
- Adjacent table: top 5 disk I/O processes — bytes/s read, bytes/s write

### 5. Network Steam Pipes (bottom strip, full width)
- Illustrated horizontal pipe running across the bottom of the viewport
- Glowing particle streams inside the pipe — left-to-right for TX, right-to-left for RX
- Particle density, speed, and colour (cyan TX / amber RX) encode bandwidth
- Rolling line graphs (last 60 s) float above the pipe for both TX and RX
- Interface selector: click to switch between NICs
- Tooltip on hover: current speed, total bytes transferred this session

### 6. Alert Control Panel (bottom-right corner, collapsible)
- Brass-panel overlay with toggle switches and threshold sliders for each resource
- Sliders styled as pressure-relief valve controls — drag the valve handle to set the limit
- Alert delivery options: browser notification, desktop notification, email webhook URL
- Current alert states shown as coloured indicator lamps (green / amber / red) with labels

---

## Interactivity

| Interaction | Behaviour |
|---|---|
| Hover any gauge or tank | Tooltip shows exact value, min/max over last 5 min, threshold setting |
| Click a process row | Expands inline to show full command line, CPU/memory history sparkline |
| Click a gauge label | Opens a 30-minute historical line graph in a modal overlay |
| Drag threshold slider | Immediately re-renders zone colouring across all affected components |
| Click alert lamp | Acknowledges/silences alert for 15 min |
| Toggle dark/light boiler room | Switches between night-shift (dim amber) and day-shift (brighter brass) palettes |

---

## Technical Requirements

- **Single HTML file** — self-contained; no build step required to view
- **Real-time updates** — WebSocket or SSE from a lightweight local agent (Python / Node); fallback polling at 2 s
- **Responsive layout** — scales from 1920 × 1080 down to 768 px tablet; mobile view collapses to vertical stack of panels
- **No external fonts or CDN at runtime** — all assets bundled or inlined to work offline
- **Smooth 60 fps animations** — CSS transitions and canvas/SVG; no jank on low-power hardware
- **Threshold persistence** — alert settings saved to `localStorage`; survive page refresh
- **Cross-platform agent** — reads `/proc`, `sysfs`, NVML (GPU), and `psutil`; works on Linux; graceful fallback for missing sensors

---

## Atmosphere Summary

> The dashboard should feel less like a monitoring tool and more like standing in front of a living machine — one that breathes, strains, glows, and occasionally vents its frustration in a hiss of steam. The metaphor of water heating to a boil is the emotional core: calm at rest, purposeful under load, dangerous when pushed past its limits.