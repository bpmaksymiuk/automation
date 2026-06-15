# Concept Storyboard — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **AUTHOR:** Graphic Artist
- **SOURCE INPUTS:** 2-USE-CASES.md, 3-NARRATIVE-VISION.md, 1-BRAINSTORM.md

> Exploratory concepts only. Final assets are produced at Stage 9. All boards in this stage are original SVGs.
>
> **Web research note:** This environment has no outbound image-search access, so suitable internet-sourced reference images could not be retrieved or downloaded. All concept boards below are therefore `original` SVGs built to communicate layout, the Coal & Brass palette, and the boiler-room metaphor. Stage 9 should revisit sourcing of textures (rivets, brass, steam) from CC0/public-domain sources.

---

## CB-001 : Screen Flow Diagram

- **SUMMARY:** High-level map of the single main view and its three in-place overlays, plus the live-agent/demo data path and responsive reflow.
- **FILE:** `./4-CONCEPT/screen-flow-diagram.svg`
- **FORMAT:** SVG. Labelled boxes and directed arrows on a dark background.
- **SOURCING:** original
- **ATTRIBUTION:** N/A (original). Web image search unavailable in this environment; diagram is structural and best authored as original SVG.
- **SCREENS COVERED:** Boiler Room (main), Process Inspector, History Modal, Alert Control Drawer, Demo Mode, Mobile reflow.
- **STYLE NOTES:** Dark `#161b22`, brass `#b68a4e` for navigation paths, cyan `#3fb4c4` for data flow. Arrows show that overlays return to the live room (no dead ends).
- **TRACEABILITY:** UC-001, UC-002, UC-008, UC-009, UC-010, UC-011, UC-012
- **RELATED:** CB-002, CB-003, CB-004

## CB-002 : Boiler Room Main Layout

- **SUMMARY:** The single-viewport cockpit showing all six panels (CPU Furnace, GPU Forge, Memory Boiler, Disk Pressure Tanks, Network Steam Pipes, Alert Control) in the Coal & Brass direction.
- **FILE:** `./4-CONCEPT/boiler-room-main.svg`
- **FORMAT:** SVG. Bounded labelled regions with gauges, tanks, flames, pipes, and process tables.
- **SOURCING:** original
- **ATTRIBUTION:** N/A (original). No suitable internet-sourced mockup retrievable here; layout authored from scratch.
- **SCREENS COVERED:** Boiler Room (main).
- **STYLE NOTES:** Oil-black `#15110d` ground, iron `#2a2622` chrome, ember amber `#e8902a`, copper `#9c5b2e`. Circular gauges for CPU/GPU, liquid tank for RAM, pressure tanks for disks, particle pipe + rolling graph for network, valve sliders + indicator lamps for alerts.
- **TRACEABILITY:** UC-001, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009
- **RELATED:** CB-001, CB-003

## CB-003 : Overlays and Alarm States

- **SUMMARY:** Detail-on-demand surfaces — inline process inspector, 30-minute history modal, alert drawer — plus the hover tooltip and the critical relief-valve alarm state.
- **FILE:** `./4-CONCEPT/overlays-and-alerts.svg`
- **FORMAT:** SVG. Four labelled panels illustrating overlay behaviour and the alarm transition.
- **SOURCING:** original
- **ATTRIBUTION:** N/A (original). Interaction states are project-specific; no external image applicable.
- **SCREENS COVERED:** Process Inspector, History Modal, Alert Control Drawer, tooltip, alarm state.
- **STYLE NOTES:** Brass-framed overlays over a dimmed room; alarm panel switches to alarm-red `#c5402b` with vent steam and a critical indicator lamp.
- **TRACEABILITY:** UC-008, UC-009, UC-010, UC-012
- **RELATED:** CB-001, CB-002

## CB-004 : Mobile Reflow

- **SUMMARY:** Vertical single-column stack for viewports ≤768px, with reduced motion and touch-operable controls.
- **FILE:** `./4-CONCEPT/mobile-reflow.svg`
- **FORMAT:** SVG. Phone frame containing stacked panel summaries.
- **SOURCING:** original
- **ATTRIBUTION:** N/A (original). Responsive concept is layout-specific; authored as original SVG.
- **SCREENS COVERED:** Boiler Room (mobile reflow).
- **STYLE NOTES:** Same Coal & Brass palette; panels collapse to labelled bars retaining headline values; note that decorative animation is minimised on small/low-power devices.
- **TRACEABILITY:** UC-011, UC-013
- **RELATED:** CB-001, CB-002

---

## Exit Gate

- [x] At least one CB record per major UC flow (main view, overlays/alerts, mobile, flow map).
- [x] `./4-CONCEPT/screen-flow-diagram.svg` exists, is non-empty, and is documented by CB-001.
- [x] Every CB record follows the schema (all fields present incl. SOURCING and ATTRIBUTION).
- [x] Every CB FILE path exists and is a non-empty SVG.
- [x] No internet-sourced assets used; all `original`. Web-search unavailability documented per record.
- [x] No CB file is a placeholder stub — each contains meaningful visual structure.
- [x] TRACEABILITY references valid UC-IDs.
- [x] SVGs legible at standard screen resolution.
- [x] STATUS is PASS and STATUS UPDATED is today.

GATE 4: PASS
