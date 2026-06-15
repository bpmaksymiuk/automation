# Stage 9 Graphic Assets — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Graphic Artist
- **SOURCE INPUTS:** 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 8-TEXT-CONTENT.md, 4-CONCEPT/

> All bespoke assets below are original SVG and the pack contains no third-party graphics runtime. The visual family follows the Stage 4 concept direction into the green-primary / yellow-amber Verdigris Boiler palette (BR-039). The dial-style SVG reference assets are retained for documentation and design continuity; the live build uses canvas-drawn flames, tanks, and pipes.

> **REVISION v1.1 (2026-06-15):** The palette remains the Verdigris Boiler scheme. Frames and rivets are green (`--brass:#7bbf4a`); accents are yellow (`--ember:#e8d24a`). The CPU furnace renders as a red flame (`--cpu-flame:#e0492c`) and the GPU furnace as a blue flame (`--gpu-flame:#3a86e0`). RAM and VRAM are paired boilers sized proportionally to true capacity (BR-037); disk and network I/O render as a steam-pipe network running from the furnace manifold to inlets/outlets (BR-038).

---

## GA-001 : CPU Furnace gauge face

- **SUMMARY:** Brass circular gauge with green/amber/red arc zones and a rotatable needle used as a documentation asset for the CPU furnace motif.
- **FILE:** `./9-GRAPHIC-ASSETS/gauge-face.svg`
- **FORMAT:** SVG, 320x320.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Brass bezel, rivets, dark dial, zone arcs in ok/warn/crit colours. Needle and value/label text exposed for runtime control.
- **FLAVORS:** (a) skeuomorphic brass dial; (b) flat minimalist ring; (c) segmented LED bar. Selected (a).
- **SELECTED FLAVOR:** (a) - matches the chief-engineer voice and the Stage 4 concept style.
- **TRACEABILITY:** DI-004, DI-006
- **RELATED:** CB-002 (boiler-room-main)
- **WEB SEARCH ATTEMPTED:** "brass pressure gauge svg cc0", "steampunk dial gauge vector" - no downloadable asset was adopted.

## GA-002 : Memory Boiler tank

- **SUMMARY:** Vertical glass boiler tube with brass caps and a runtime-controlled water fill plus bubbles, representing RAM usage heating to a boil.
- **FILE:** `./9-GRAPHIC-ASSETS/boiler-tank.svg`
- **FORMAT:** SVG, 240x340.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Clipped boiler-water rect (height set at runtime), brass rims, water gradient from water to water-light.
- **FLAVORS:** (a) glass sight-tube; (b) opaque riveted tank with porthole. Selected (a).
- **SELECTED FLAVOR:** (a) - the visible water column reads as a fill level at a glance.
- **TRACEABILITY:** DI-004, DI-006, DI-007
- **RELATED:** CB-002
- **WEB SEARCH ATTEMPTED:** "glass boiler tube svg", "water tank fill level svg" - no suitable external asset was adopted.

## GA-003 : Indicator lamps (normal / warning / critical)

- **SUMMARY:** Three glass indicator lamps showing the alarm-state palette used by every panel's relief-valve lamp.
- **FILE:** `./9-GRAPHIC-ASSETS/indicator-lamps.svg`
- **FORMAT:** SVG, 360x120.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Radial-gradient lenses with specular highlight; colours map to ok/warn/crit.
- **FLAVORS:** (a) round glass lamps; (b) rectangular annunciator tiles. Selected (a).
- **SELECTED FLAVOR:** (a) - consistent with the dial/valve hardware theme.
- **TRACEABILITY:** DI-009
- **RELATED:** CB-003 (overlays-and-alerts)
- **WEB SEARCH ATTEMPTED:** "indicator lamp svg green amber red", "annunciator lamp vector" - no suitable external asset was adopted.

## GA-004 : Network Steam Pipe

- **SUMMARY:** Horizontal brass pipe with flanges and a glowing steam-flow group representing network throughput direction and intensity.
- **FILE:** `./9-GRAPHIC-ASSETS/steam-pipe.svg`
- **FORMAT:** SVG, 420x200.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** steam-flow group (opacity/scale animated at runtime), steam gradient.
- **FLAVORS:** (a) side-profile pipe; (b) coiled manifold. Selected (a).
- **SELECTED FLAVOR:** (a) - clean direction read for tx/rx.
- **TRACEABILITY:** DI-004, DI-007, DI-008
- **RELATED:** CB-002
- **WEB SEARCH ATTEMPTED:** "brass steam pipe svg", "glowing pipe flow vector" - no suitable external asset was adopted.

## GA-005 : Data-flow diagram

- **SUMMARY:** Engineering diagram of OS -> agent -> client data movement, endpoints, demo fallback, and notification path.
- **FILE:** `./9-DIAGRAMS/data-flow-diagram.svg`
- **FORMAT:** SVG, 1000x560.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Pipeline dark-theme role colours per Stage 9 visual standards.
- **FLAVORS:** N/A - single canonical engineering diagram.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-002, DI-003, DI-005
- **RELATED:** GA-006, GA-007

## GA-006 : Sequence - live update

- **SUMMARY:** Sequence diagram of SSE connection and ~1s snapshot rendering loop with fallback note (UC-002).
- **FILE:** `./9-DIAGRAMS/sequence-live-update.svg`
- **FORMAT:** SVG, 1000x520.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Lifelines + loop fragment, dark theme.
- **FLAVORS:** N/A.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-003, DI-005, DI-006
- **RELATED:** GA-005

## GA-007 : Sequence - threshold and alarm

- **SUMMARY:** Sequence diagram of setting a threshold, persisting it, and the evaluate -> lamp -> notify -> auto-clear cycle (UC-009/UC-010).
- **FILE:** `./9-DIAGRAMS/sequence-threshold-alarm.svg`
- **FORMAT:** SVG, 1000x520.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Lifelines + activation boxes, dark theme.
- **FLAVORS:** N/A.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-009
- **RELATED:** GA-005

---

## RES-001 : Design tokens (CSS + JSON)

- **TYPE:** colour-palette
- **SUMMARY:** The Verdigris Boiler palette and shape/type tokens as ready-to-use CSS custom properties and a JSON token file so the Developer can drop them into `:root` without re-deriving colours.
- **PATH:** `./9-RESOURCES/tokens/` (`palette.css`, `tokens.json`)
- **SOURCE URL:** Derived in-project from `4-CONCEPT-STORYBOARD.md` (no external source).
- **LICENCE:** Project-owned (no third-party licence).
- **VERSION:** 2026-06-15.
- **INSTALL / USE:** Paste `palette.css` `:root` block into `10-BUILD/index.html`, or read `tokens.json`. Reference via `var(--brass)`, `var(--crit-text)`, etc.
- **TRACEABILITY:** DI-004, DI-006, DI-007, DI-009

## RES-002 : Runtime libraries - none required (documented)

- **TYPE:** library
- **SUMMARY:** Explicit note that the product ships zero third-party JS/CSS graphics libraries and uses the system font stack, so no distributions or web-font files are bundled.
- **PATH:** `./9-RESOURCES/libs/README.md`
- **SOURCE URL:** N/A (decision recorded from AR-005/AR-006).
- **LICENCE:** N/A.
- **VERSION:** 2026-06-15.
- **INSTALL / USE:** No install. Client relies on Canvas 2D, inline SVG, CSS Grid, ES2020. Agent uses Python stdlib + `psutil`.
- **TRACEABILITY:** AR-005, AR-006, DI-001, DI-007

GATE 9: PASS
