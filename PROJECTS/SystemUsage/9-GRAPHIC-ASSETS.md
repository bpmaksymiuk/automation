# Stage 9 Graphic Assets — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Graphic Artist
- **SOURCE INPUTS:** 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 8-TEXT-CONTENT.md, 4-CONCEPT/

> Web image/asset search and external downloads were unavailable in this environment (no outbound network). Every bespoke asset below is therefore `original` SVG, produced to the Stage 4 "Coal & Brass" direction. The search terms that would have been used are recorded per record. Per AR-005/AR-006 the product ships zero runtime third-party graphics libraries, so the resource pack is intentionally limited to design tokens and a documented "no libs" note rather than downloaded distributions.

> **REVISION v1.1 (2026-06-14):** The palette was re-keyed to the green-primary / yellow-amber "Verdigris Boiler" scheme (BR-039) — see updated `9-RESOURCES/tokens/palette.css` and `tokens.json`. Frames/rivets are now green (`--brass:#7bbf4a`); accents are yellow (`--ember:#e8d24a`). The CPU furnace renders as a **red flame** (`--cpu-flame:#e0492c`) and the GPU furnace as a **blue flame** (`--gpu-flame:#3a86e0`) rather than dial gauges. RAM and VRAM are paired boilers sized proportionally to true capacity (BR-037); disk and network I/O render as a steam-pipe network running from the furnace manifold to inlets/outlets (BR-038). The dial-style SVG records below (GA-001 gauge face) are retained as historical reference assets but are superseded by the canvas-drawn flames in the live build.

---

## GA-001 : CPU Furnace gauge face

- **SUMMARY:** Brass circular gauge with green/amber/red arc zones and a rotatable needle used for the CPU furnace and as the base template for all dial-style panels.
- **FILE:** `./9-GRAPHIC-ASSETS/gauge-face.svg`
- **FORMAT:** SVG, 320×320.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Brass bezel (`--brass` radial), rivets, dark dial (`--bg-panel`), zone arcs in `--ok`/`--warn-text`/`--crit-text`. `#needle` and `#gauge-value`/`#gauge-label` exposed for runtime control.
- **FLAVORS:** (a) Skeuomorphic brass dial; (b) flat minimalist ring; (c) segmented LED bar. Selected (a).
- **SELECTED FLAVOR:** (a) — matches Coal & Brass concept and the chief-engineer voice; honest analog read.
- **TRACEABILITY:** DI-004, DI-006
- **RELATED:** CB-002 (boiler-room-main)
- **WEB SEARCH ATTEMPTED:** "brass pressure gauge svg cc0", "steampunk dial gauge vector" — network unavailable.

## GA-002 : Memory Boiler tank

- **SUMMARY:** Vertical glass boiler tube with brass caps and a runtime-controlled water fill plus bubbles, representing RAM usage heating to a boil.
- **FILE:** `./9-GRAPHIC-ASSETS/boiler-tank.svg`
- **FORMAT:** SVG, 240×340.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Clipped `#boiler-water` rect (height set at runtime), brass rims, water gradient `--water`→`--water-light`.
- **FLAVORS:** (a) Glass sight-tube; (b) opaque riveted tank with porthole. Selected (a).
- **SELECTED FLAVOR:** (a) — the visible water column reads as a fill level at a glance.
- **TRACEABILITY:** DI-004, DI-006, DI-007
- **RELATED:** CB-002
- **WEB SEARCH ATTEMPTED:** "glass boiler tube svg", "water tank fill level svg" — network unavailable.

## GA-003 : Indicator lamps (normal / warning / critical)

- **SUMMARY:** Three glass indicator lamps showing the alarm-state palette used by every panel's relief-valve lamp.
- **FILE:** `./9-GRAPHIC-ASSETS/indicator-lamps.svg`
- **FORMAT:** SVG, 360×120.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Radial-gradient lenses with specular highlight; colours map to `--ok`/`--warn`/`--crit`.
- **FLAVORS:** (a) Round glass lamps; (b) rectangular annunciator tiles. Selected (a).
- **SELECTED FLAVOR:** (a) — consistent with the dial/valve hardware theme.
- **TRACEABILITY:** DI-009
- **RELATED:** CB-003 (overlays-and-alerts)
- **WEB SEARCH ATTEMPTED:** "indicator lamp svg green amber red", "annunciator lamp vector" — network unavailable.

## GA-004 : Network Steam Pipe

- **SUMMARY:** Horizontal brass pipe with flanges and a glowing steam-flow group representing network throughput direction and intensity.
- **FILE:** `./9-GRAPHIC-ASSETS/steam-pipe.svg`
- **FORMAT:** SVG, 420×200.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** `#steam-flow` group (opacity/scale animated at runtime), steam gradient `--steam`.
- **FLAVORS:** (a) Side-profile pipe; (b) coiled manifold. Selected (a).
- **SELECTED FLAVOR:** (a) — clean direction read for tx/rx.
- **TRACEABILITY:** DI-004, DI-007, DI-008
- **RELATED:** CB-002
- **WEB SEARCH ATTEMPTED:** "brass steam pipe svg", "glowing pipe flow vector" — network unavailable.

## GA-005 : Data-flow diagram

- **SUMMARY:** Engineering diagram of OS → agent → client data movement, endpoints, demo fallback, and notification path.
- **FILE:** `./9-DIAGRAMS/data-flow-diagram.svg`
- **FORMAT:** SVG, 1000×560.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Pipeline dark-theme role colours per Stage 9 visual standards.
- **FLAVORS:** N/A — single canonical engineering diagram.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-002, DI-003, DI-005
- **RELATED:** GA-006, GA-007

## GA-006 : Sequence — live update

- **SUMMARY:** Sequence diagram of SSE connection and ~1s snapshot rendering loop with fallback note (UC-002).
- **FILE:** `./9-DIAGRAMS/sequence-live-update.svg`
- **FORMAT:** SVG, 1000×520.
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **STYLE NOTES:** Lifelines + loop fragment, dark theme.
- **FLAVORS:** N/A.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-003, DI-005, DI-006
- **RELATED:** GA-005

## GA-007 : Sequence — threshold & alarm

- **SUMMARY:** Sequence diagram of setting a threshold, persisting it, and the evaluate→lamp→notify→auto-clear cycle (UC-009/UC-010).
- **FILE:** `./9-DIAGRAMS/sequence-threshold-alarm.svg`
- **FORMAT:** SVG, 1000×520.
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
- **SUMMARY:** The Coal & Brass palette and shape/type tokens as ready-to-use CSS custom properties and a JSON token file so the Developer can drop them into `:root` without re-deriving colours.
- **PATH:** `./9-RESOURCES/tokens/` (`palette.css`, `tokens.json`)
- **SOURCE URL:** Derived in-project from `4-CONCEPT-STORYBOARD.md` (no external source).
- **LICENCE:** Project-owned (no third-party licence).
- **VERSION:** 2026-06-14.
- **INSTALL / USE:** Paste `palette.css` `:root` block into `10-BUILD/index.html`, or read `tokens.json`. Reference via `var(--brass)`, `var(--crit-text)`, etc.
- **TRACEABILITY:** DI-004, DI-006, DI-007, DI-009

## RES-002 : Runtime libraries — none required (documented)

- **TYPE:** library
- **SUMMARY:** Explicit note that the product ships zero third-party JS/CSS graphics libraries and uses the system font stack, so no distributions or web-font files are bundled.
- **PATH:** `./9-RESOURCES/libs/README.md`
- **SOURCE URL:** N/A (decision recorded from AR-005/AR-006).
- **LICENCE:** N/A.
- **VERSION:** 2026-06-14.
- **INSTALL / USE:** No install. Client relies on Canvas 2D, inline SVG, CSS Grid, ES2020. Agent uses Python stdlib + `psutil`.
- **TRACEABILITY:** AR-005, AR-006, DI-001, DI-007

GATE 9: PASS
