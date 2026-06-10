# Parts List — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Architect
- **SOURCE:** 2-USE-CASES.md, 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md

---

## PT-001 : Front-end build pipeline

- **DESCRIPTION:** Builds the application, bundles static assets, and produces the deployable output for later stages.
- **TECHNOLOGY RECOMMENDATIONS:** Vite, Node.js LTS, npm, ESM build output.
- **NOTES:** Use hashed build assets and a static `dist/` output to support low-friction deployment and rollback.
- **RELATED:** AR-001, AR-008; BR-003, BR-015, BR-017

## PT-002 : React application runtime

- **DESCRIPTION:** Hosts the typed component tree, screen composition, and cross-app UI rendering model.
- **TECHNOLOGY RECOMMENDATIONS:** React 18, TypeScript 5.
- **NOTES:** Prefer function components and typed props/state boundaries. Avoid route-driven app switching for the shell.
- **RELATED:** AR-001; BR-003, BR-016

## PT-003 : Shell state and app registry

- **DESCRIPTION:** Owns shell phase, launcher configuration, open-window records, focus order, and app definitions.
- **TECHNOLOGY RECOMMENDATIONS:** React Context, useReducer, typed app-definition interfaces.
- **NOTES:** Keep one authoritative shell store for `boot`, `desktop`, and `secret` flow. Registry entries should cover Notepad, Paint, Calculator, and Minesweeper.
- **RELATED:** AR-002, AR-003; BR-001, BR-002, BR-003, BR-004, BR-005

## PT-004 : Boot and secret presentation layer

- **DESCRIPTION:** Renders the boot sequence, skip control, and temporary secret-response surface.
- **TECHNOLOGY RECOMMENDATIONS:** CSS animations, React effects/timers, semantic dialog or window component patterns.
- **NOTES:** Skip control must stay visible. Secret behavior must dismiss cleanly and return focus to the shell.
- **RELATED:** AR-002, AR-007; BR-001, BR-002, BR-013, BR-014

## PT-005 : Notepad editor module

- **DESCRIPTION:** Provides the plain-text editing window for typing, selecting, replacing, and clearing text.
- **TECHNOLOGY RECOMMENDATIONS:** Native HTML textarea, DOM selection APIs, React command handlers.
- **NOTES:** Do not introduce rich-text formatting. Keep behavior aligned to plain-text desktop editing.
- **RELATED:** AR-004; BR-006, BR-007, BR-008

## PT-006 : Paint drawing engine

- **DESCRIPTION:** Provides the retro drawing canvas and direct input pipeline for drawing, color changes, and tool changes.
- **TECHNOLOGY RECOMMENDATIONS:** Canvas 2D API, Pointer Events, device-pixel-ratio-aware canvas sizing.
- **NOTES:** Must support pointer and touch input. Include at least one alternate tool or color with immediate visual feedback.
- **RELATED:** AR-005, AR-008; BR-009, BR-010, BR-015, BR-016

## PT-007 : Minesweeper logic and board UI

- **DESCRIPTION:** Implements mine placement, reveal rules, flagging, counters, game-over logic, and restart behavior.
- **TECHNOLOGY RECOMMENDATIONS:** Pure TypeScript game engine, React presentation layer, CSS Grid, semantic buttons.
- **NOTES:** Include a visible mine-status display and a restart control. Provide a mobile-friendly flag mode instead of depending on right click.
- **RELATED:** AR-006, AR-008; BR-011, BR-012, BR-015, BR-016, BR-017

## PT-008 : Calculator module

- **DESCRIPTION:** Supplies the bundled calculator window required for shell launch-and-close parity.
- **TECHNOLOGY RECOMMENDATIONS:** React keypad/display component, JavaScript number operations.
- **NOTES:** Current approved scope only requires the calculator to be launchable and closable from the desktop shell; deeper calculator behavior can be expanded only if later stages add requirements.
- **RELATED:** AR-003; BR-004, BR-005

## PT-009 : Responsive retro UI system

- **DESCRIPTION:** Applies the Windows 3.1-inspired visual language while preserving reflow, keyboard access, and touch usability.
- **TECHNOLOGY RECOMMENDATIONS:** CSS Modules, CSS Grid, Flexbox, media queries, :focus-visible, prefers-reduced-motion.
- **NOTES:** On mobile breakpoints, windows should default to maximized layouts and icon grids should wrap without horizontal scrolling as the primary interaction mode.
- **RELATED:** AR-001, AR-005, AR-006, AR-007, AR-008; BR-004, BR-009, BR-011, BR-013, BR-014, BR-015, BR-016, BR-017

## PT-010 : Static deployment and browser telemetry hooks

- **DESCRIPTION:** Packages the built site for static hosting and captures lightweight runtime signals for later operational troubleshooting.
- **TECHNOLOGY RECOMMENDATIONS:** GitHub Actions, GitHub Pages or Cloudflare Pages, web-vitals, optional Sentry Browser SDK.
- **NOTES:** Keep telemetry lightweight and privacy-conscious. Rollback should be possible by redeploying a prior static artifact.
- **RELATED:** AR-001; BR-003, BR-015, BR-016, BR-017

GATE 6: PASS
