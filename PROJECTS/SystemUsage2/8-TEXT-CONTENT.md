# Stage 8 Text Content — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-15
- **AUTHOR:** Writer
- **SOURCE INPUTS:** 2-USE-CASES.md, 7-DESIGN-INSTRUCTIONS.md, 3-NARRATIVE-VISION.md

> Voice: a seasoned Victorian chief engineer — warm, confident, tactile. Labels name physical fixtures (Furnace, Boiler, Valve), not abstract widgets. Microcopy is brief and reassuring; alarms are direct without panic.

## TC-001 : UI labels and microcopy

- **SUMMARY:** All visible labels, panel titles, button text, connection states, and empty states for the dashboard chrome.
- **FILE:** ./8-TEXT/ui-strings.md
- **CATEGORY:** ui
- **TONE NOTES:** Tactile, metaphor-led, ALL-CAPS for panel titles; sentence case for helper text; concise.
- **GLOSSARY REFERENCES:** GL-001, GL-002, GL-003, GL-004, GL-005, GL-006, GL-007, GL-009
- **TRACEABILITY:** DI-004, DI-005, DI-006, DI-011

## TC-002 : Alert and notification copy

- **SUMMARY:** Indicator lamp state names, desktop notification title/body, threshold control labels, and notification settings copy.
- **FILE:** ./8-TEXT/alerts.md
- **CATEGORY:** ui
- **TONE NOTES:** Pressure/relief framing; calm authority; never alarmist. Placeholders {RESOURCE}, {VALUE}.
- **GLOSSARY REFERENCES:** GL-005, GL-008, GL-009, GL-010
- **TRACEABILITY:** DI-009

## TC-003 : Tooltip and help copy

- **SUMMARY:** Hover/tap tooltip value patterns, history modal labels, and the first-run hint.
- **FILE:** ./8-TEXT/tooltips.md
- **CATEGORY:** ui
- **TONE NOTES:** Terse, data-forward; one line; placeholders for live values.
- **GLOSSARY REFERENCES:** GL-001, GL-002, GL-003, GL-004, GL-010
- **TRACEABILITY:** DI-011, DI-006

## TC-004 : Run guide / README

- **SUMMARY:** End-user instructions for demo mode, live mode, alarms, and security notes.
- **FILE:** ./8-TEXT/readme.md
- **CATEGORY:** utility
- **TONE NOTES:** Practical and friendly; short code blocks; reassuring on privacy.
- **GLOSSARY REFERENCES:** GL-007, GL-009, GL-010
- **TRACEABILITY:** DI-001, DI-003

## TC-005 : About / narrative blurb

- **SUMMARY:** Short evocative description of the product's philosophy for an About surface or landing copy.
- **FILE:** ./8-TEXT/about.md
- **CATEGORY:** narrative
- **TONE NOTES:** Lyrical but grounded; embodies honest-instrumentation and calm-by-default themes.
- **GLOSSARY REFERENCES:** GL-001, GL-003, GL-005, GL-006, GL-008
- **TRACEABILITY:** DI-004, DI-006

## GLOSSARY

| GL-ID | Term | Definition |
|---|---|---|
| GL-001 | Furnace | The CPU panel; compute load rendered as fire that brightens with utilisation. |
| GL-002 | Forge | The GPU panel; GPU utilisation and VRAM rendered as a second furnace/crucible. |
| GL-003 | Boiler | The memory panel; RAM usage rendered as water heating toward a boil. |
| GL-004 | Pressure Tank | A disk panel vessel; one per filesystem, fill level = used capacity. |
| GL-005 | Relief Valve | The alert mechanism; vents (alarm state) when a metric passes its threshold. |
| GL-006 | Steam Pipe | The network panel; throughput rendered as glowing particles flowing through a pipe. |
| GL-007 | Agent | The local Python process that reads system metrics and serves them to the page. |
| GL-008 | Stoke | A demo action that raises simulated load to show the room under strain. |
| GL-009 | Live / Demo | Connection states: live = real agent data; demo = built-in simulated data. |
| GL-010 | Threshold | The percentage at which a gauge enters its alarm state; user-set, remembered between visits. |

## PHRASEBOOK

| Category | Correct Phrasing | Incorrect Phrasing | Notes |
|---|---|---|---|
| Panel names | CPU FURNACE | CPU Panel / CPU Widget | Use tactile fixture names. |
| Alarms | Relief valve venting | Error / Failure | Frame as the machine protecting itself. |
| Load | Building pressure | High usage warning | Pressure/heat metaphor over generic terms. |
| Data source | live / demo | online / offline | Match the connection indicator vocabulary. |
| Memory | the boiler is at a rolling boil | RAM is almost full | Prefer metaphor in narrative copy; exact % in tooltips. |
| Privacy | reads system data only | collects your data | Reassure; the agent is read-only and local. |
| Reduced motion | Calm the room / Wake the room | Disable animations | Stay in-world for toggles. |

GATE 8: PASS
