# Concept Storyboard — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Graphic Artist
- **SOURCE:** 2-USE-CASES.md and 3-NARRATIVE-VISION.md (approved shell-first retro desktop, classic apps, hidden discovery, and mobile support)

---

## CB-001 : Screen Flow Diagram

- **SUMMARY:** Maps the main user path from boot sequence to desktop, apps, hidden discovery, and mobile-friendly interaction.
- **FILE:** ./4-CONCEPT/screen-flow-diagram.svg
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted against the ToastyTech Windows 3.1 gallery, Wikipedia Windows 3.1 screenshots, Windows93, PCjs, and v86; no single reusable asset captured the required end-to-end flow, so this diagram was created as an original SVG.
- **SCREENS COVERED:** Boot sequence, Program Manager-style desktop, app launch, secret room, mobile adaptation.
- **STYLE NOTES:** Dark background, boxed nodes, directional arrows, and terse annotations that make the product's flow readable at a glance.
- **TRACEABILITY:** UC-001, UC-002, UC-006, UC-007
- **RELATED:** CB-002, CB-003, CB-004, CB-005

## CB-002 : Boot and Desktop Shell

- **SUMMARY:** Shows the entry experience, including boot splash, desktop landing, and the main shell surface with program groups.
- **FILE:** ./4-CONCEPT/boot-program-manager-shell.svg
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted against the ToastyTech Windows 3.1 gallery, Wikipedia Windows 3.1 screenshots, Windows93, PCjs, and v86; no reusable image captured the exact shell-entry combination needed for this storyboard, so this board is original.
- **SCREENS COVERED:** Boot splash, main desktop, program groups, shell chrome.
- **STYLE NOTES:** Emphasize period-correct window chrome, icon groups, and the feeling of entering a small operating system.
- **TRACEABILITY:** UC-001, UC-002
- **RELATED:** CB-001, CB-003

## CB-003 : Classic App Windows

- **SUMMARY:** Visualizes the core bundled apps as overlapping retro windows: Notepad, Paint, and Calculator.
- **FILE:** ./4-CONCEPT/app-windows.svg
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted against the ToastyTech Windows 3.1 gallery, Wikipedia Windows 3.1 screenshots, Windows93, PCjs, and v86; no reusable asset balanced all three app surfaces, so the concept art is original.
- **SCREENS COVERED:** Notepad, Paint, Calculator.
- **STYLE NOTES:** Show each app with a distinct but related personality and enough interface detail to suggest real interaction.
- **TRACEABILITY:** UC-002, UC-003, UC-004
- **RELATED:** CB-001, CB-002, CB-004

## CB-004 : Minesweeper and Secret Room

- **SUMMARY:** Shows the puzzle loop, the hidden interaction, and the reward screen for discovery.
- **FILE:** ./4-CONCEPT/minesweeper-secret-room.svg
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted against the ToastyTech Windows 3.1 gallery, Wikipedia Windows 3.1 screenshots, Windows93, PCjs, and v86; no reusable asset conveyed both the game board and the easter egg transition, so this board is original.
- **SCREENS COVERED:** Minesweeper board, hidden interaction, secret room, return to desktop.
- **STYLE NOTES:** Balance recognizable game-grid logic with a surreal-but-safe hidden area that feels like a discovery reward.
- **TRACEABILITY:** UC-005, UC-006
- **RELATED:** CB-001, CB-003, CB-005

## CB-005 : Mobile Touch Shell

- **SUMMARY:** Visualizes how the retro desktop compresses onto a phone-sized screen while preserving the shell identity.
- **FILE:** ./4-CONCEPT/mobile-touch-shell.svg
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted against the ToastyTech Windows 3.1 gallery, Wikipedia Windows 3.1 screenshots, Windows93, PCjs, and v86; no reusable asset showed the exact responsive adaptation needed here, so this board is original.
- **SCREENS COVERED:** Mobile desktop, touch targets, stacked windows, touch navigation.
- **STYLE NOTES:** Preserve the desktop silhouette while enlarging controls and reducing friction for touch use.
- **TRACEABILITY:** UC-007
- **RELATED:** CB-001, CB-002, CB-004

---

## Exit Gate
- [ ] `4-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow.
- [ ] `./4-CONCEPT/screen-flow-diagram.svg` exists, is non-empty, and is documented by a CB record.
- [ ] Every CB record follows the schema (all fields present, including SOURCING and ATTRIBUTION).
- [ ] Every CB FILE path exists and is a non-empty SVG.
- [ ] Every internet-sourced asset has an ATTRIBUTION entry with source URL and licence.
- [ ] No internet-sourced asset uses a rights-reserved licence without documented project owner approval.
- [ ] For every `original` record, the CB record documents what web search was attempted and why no suitable internet-sourced asset was found.
- [ ] No CB file is a placeholder stub — each must contain meaningful visual structure.
- [ ] TRACEABILITY field references valid UC-IDs.
- [ ] SVG files are legible at standard screen resolution.
- [ ] `4-CONCEPT-STORYBOARD.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.

GATE 4: PASS
# Concept Storyboard — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Graphic Artist
- **SOURCE:** 2-USE-CASES.md and 3-NARRATIVE-VISION.md (approved shell-first retro desktop with classic apps, hidden discovery, and mobile usability)

---

## CB-001 : SCREEN FLOW DIAGRAM

- **SUMMARY:** High-level flow showing how the visitor moves from boot to desktop to apps and the hidden easter egg.
- **FILE:** `./4-CONCEPT/screen-flow-diagram.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search was attempted for retro Windows 3.1 screenshots and browser-retro-OS references, but no single reusable image covered the approved multi-screen flow, so an original schematic SVG was created.
- **SCREENS COVERED:** Boot sequence, desktop shell, app windows, hidden easter egg, mobile-friendly shell behavior.
- **STYLE NOTES:** Dark background, boxed nodes, directional arrows, compact labels, and a clear left-to-right story arc.
- **TRACEABILITY:** UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007
- **RELATED:** CB-002, CB-003, CB-004

## CB-002 : SHELL ENTRY AND DESKTOP LAYOUT

- **SUMMARY:** Illustrates the boot splash, the Program Manager-style desktop, and the responsive shell layout that anchors the experience.
- **FILE:** `./4-CONCEPT/boot-shell-flow.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search reviewed Windows 3.1 screenshots and shell references, especially ToastyTech and Windows 3.1 documentation, but no internet-sourced image captured the specific boot-to-shell-to-touch adaptation story, so an original SVG was created.
- **SCREENS COVERED:** Boot splash, desktop shell, icon groups, taskbar/start-area analog, touch-friendly adaptation notes.
- **STYLE NOTES:** Emphasize the room-like shell, icon clusters, and the sense of entering a compact operating system.
- **TRACEABILITY:** UC-001, UC-002, UC-007
- **RELATED:** CB-001, CB-003

## CB-003 : CLASSIC APPS WINDOW SET

- **SUMMARY:** Shows the core bundled app experiences as separate but related windows: Notepad, Paint, Calculator, and Minesweeper.
- **FILE:** `./4-CONCEPT/classic-apps-board.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web research reviewed bundled Windows app references and historical screenshots, but the storyboard needed a multi-app comparison board rather than a single source image, so an original SVG was created.
- **SCREENS COVERED:** Notepad, Paint, Calculator, Minesweeper, app close/minimize patterns.
- **STYLE NOTES:** Use four window mockups in one board, each with a distinctive internal layout and label strip.
- **TRACEABILITY:** UC-002, UC-003, UC-004, UC-005
- **RELATED:** CB-002, CB-004

## CB-004 : SECRET ROOM AND EASTER EGG

- **SUMMARY:** Depicts the hidden discovery path and the surprise state that rewards exploration without blocking normal use.
- **FILE:** `./4-CONCEPT/secret-room-board.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** original
- **ATTRIBUTION:** N/A. Web search reviewed retro easter-egg patterns and Windows 3.1-era references, but no internet-sourced image captured the intended secret-room behavior, so an original SVG was created.
- **SCREENS COVERED:** Hidden icon path, secret screen, return to shell.
- **STYLE NOTES:** Make the hidden state feel a little off-register while still visually part of the same world.
- **TRACEABILITY:** UC-006
- **RELATED:** CB-001, CB-002, CB-003

## EXIT GATE

- [ ] `4-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow.
- [ ] `./4-CONCEPT/screen-flow-diagram.svg` exists, is non-empty, and is documented by a CB record.
- [ ] Every CB record follows the schema (all fields present, including SOURCING and ATTRIBUTION).
- [ ] Every CB FILE path exists and is a non-empty SVG.
- [ ] Every internet-sourced asset has an ATTRIBUTION entry with source URL and licence.
- [ ] No internet-sourced asset uses a rights-reserved licence without documented project owner approval.
- [ ] For every `original` record, the CB record documents what web search was attempted and why no suitable internet-sourced asset was found.
- [ ] No CB file is a placeholder stub — each must contain meaningful visual structure.
- [ ] TRACEABILITY field references valid UC-IDs.
- [ ] SVG files are legible at standard screen resolution.
- [ ] `4-CONCEPT-STORYBOARD.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.

GATE 4: PASS
