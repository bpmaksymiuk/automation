# Architecture Recommendations — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Architect
- **SOURCE:** 2-USE-CASES.md, 5-REQUIREMENTS.md, .github/skills/architecture-and-parts-authoring/SKILL.md

---

## OVERALL ARCHITECTURE SUMMARY

The recommended architecture is a browser-only static single-page application built with Vite, React 18, TypeScript 5, and CSS Modules, then deployed as immutable static assets. This stack fits the approved scope because every required interaction is local to the visitor session, so the product does not need a backend, database, or account system to satisfy the current use cases. It also supports quick loading, straightforward deployment, and a low-friction maintenance path for later stages.

For UC-001 and UC-002, the system should center on a desktop shell boundary made of a boot-flow controller, a desktop surface, and a window manager. The boot controller handles BR-001 through BR-003 by showing an initial boot sequence, exposing a visible skip action, and transitioning to the main shell. The window manager and app registry handle BR-004 and BR-005 by giving each bundled app a visible launch point and predictable open, focus, and close behavior without breaking the desktop.

For UC-003, UC-004, and UC-005, each bundled app should be its own module behind a shared shell contract. Notepad is best implemented with a native textarea so typing, selection, replacement, and clearing remain simple and accessible. Paint should use the Canvas 2D API plus Pointer Events so drawing works with mouse, touch, or stylus input while still allowing at least one alternate tool or color. Minesweeper should separate a deterministic TypeScript game engine from its rendered board so hidden tiles, flagging, mine counting, and restart behavior remain testable and easy to reason about.

UC-006 should remain a shell-level optional behavior instead of becoming a separate navigation mode. A hidden key sequence or secret icon path can trigger a temporary retro response window, modal, or screen-saver-style overlay that clearly shows the easter egg, then returns the visitor to the normal shell flow. That keeps the discovery delightful without creating a dead end or interfering with the main app loop.

UC-007 is the main architecture stress case, so the shell must treat mobile adaptation as a first-class rule rather than a later polish item. On smaller screens, windows should open maximized by default, launcher icons should reflow into a readable grid, touch targets should enlarge, and app controls should avoid relying on hover or right click. This keeps the Windows 3.1 presentation recognizable while meeting BR-015 through BR-017 for readability, mouse-free access, and no primary horizontal scrolling.

The main boundaries are the shell controller, bundled app modules, UI styling system, and static deployment surface. The largest risks are touch interaction friction in Paint and Minesweeper, visual blur or scaling problems on canvas-based views, and accessibility regressions caused by retro styling choices. These risks are mitigated by Pointer Events, device-pixel-ratio-aware canvas sizing, semantic HTML controls where possible, responsive layout rules, and a narrow dependency set that keeps later implementation and testing work manageable.

## AR-001 : Static front-end platform

- **DECISION:** Build the product as a static SPA with Vite, React 18, TypeScript 5, and CSS Modules.
- **RATIONALE:** This directly supports the approved browser-only experience while keeping hosting, rollback, and maintenance simple. Source basis: Vite Guide (`https://vite.dev/guide/`) and React documentation on component composition and shared state (`https://react.dev/`). Alternative considered: Next.js with SSR, which adds server/runtime complexity without a Stage 2 or Stage 5 requirement for server rendering.
- **UC REFERENCES:** UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007
- **NOTES:** All approved behavior must run from static assets alone. Browser-local state may be used for session continuity, but no requirement currently justifies backend persistence.
- **RELATED:** BR-003, BR-015, BR-016, BR-017; PT-001, PT-002, PT-009, PT-010

## AR-002 : Shell flow and window manager

- **DECISION:** Implement a shell state machine with explicit `boot`, `desktop`, and `secret` phases plus a window manager for bundled apps.
- **RATIONALE:** A dedicated shell model is the cleanest way to satisfy the boot-to-desktop flow, visible skip action, and reliable return to desktop after closing windows. Source basis: React state management guidance (`https://react.dev/learn/scaling-up-with-reducer-and-context`). Alternative considered: route-based page navigation for each app, which would undermine the desktop metaphor and complicate close-and-return behavior.
- **UC REFERENCES:** UC-001, UC-002, UC-006
- **NOTES:** The boot screen must expose Skip immediately. Window records should track app ID, title, z-index, open state, and mobile presentation mode.
- **RELATED:** BR-001, BR-002, BR-003, BR-004, BR-005, BR-013, BR-014; PT-003, PT-004

## AR-003 : Central bundled-app registry

- **DECISION:** Define Notepad, Paint, Calculator, and Minesweeper through a shared app registry contract.
- **RATIONALE:** A registry keeps launcher icons, window titles, default sizes, and render entry points consistent across the shell. Source basis: React component composition guidance (`https://react.dev/`). Alternative considered: separate hard-coded launch logic per icon, which would duplicate state and increase inconsistency risk during Stage 10 implementation.
- **UC REFERENCES:** UC-002
- **NOTES:** The registry should include the app ID, user-facing label, icon asset, default window profile, and render function. Calculator is included for launch-and-close parity even though no deeper calculator feature BR currently exists.
- **RELATED:** BR-004, BR-005; PT-003, PT-008

## AR-004 : Native-editor Notepad module

- **DECISION:** Implement Notepad with a native HTML textarea wrapped by React state and command handlers.
- **RATIONALE:** A textarea natively supports plain text entry, selection ranges, replacement flows, and clearing without the cost of a custom editor subsystem. Source basis: MDN textarea reference (`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea`). Alternative considered: a contenteditable-based editor, which adds browser-behavior variance without any approved rich-text requirement.
- **UC REFERENCES:** UC-003
- **NOTES:** The module should expose typed actions for replace-selection and clear-all behaviors so Stage 10 can map BR-006 through BR-008 directly to UI commands.
- **RELATED:** BR-006, BR-007, BR-008; PT-005

## AR-005 : Canvas-based Paint module

- **DECISION:** Implement Paint with the Canvas 2D API, Pointer Events, and a small tool/color state model.
- **RATIONALE:** Canvas 2D is the most direct fit for a retro drawing surface, while Pointer Events unify mouse and touch input for desktop and mobile. Source basis: MDN Canvas API (`https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API`) and Pointer Events (`https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events`). Alternative considered: SVG drawing, which is better for retained vector editing but is a poorer fit for freehand pixel-style painting in this scope.
- **UC REFERENCES:** UC-004, UC-007
- **NOTES:** The minimum viable toolset is pencil plus one alternate tool or color. The canvas should scale using device pixel ratio rules to preserve crispness.
- **RELATED:** BR-009, BR-010, BR-015, BR-016, BR-017; PT-006, PT-009

## AR-006 : Deterministic Minesweeper engine

- **DECISION:** Build Minesweeper as a pure TypeScript rules engine rendered through a semantic grid-based React UI.
- **RATIONALE:** Separating rules from presentation makes reveal, flag, loss, win, mine counting, and restart behavior deterministic and easier to test. A semantic button/grid rendering layer also helps keyboard and touch access. Source basis: WCAG keyboard and reflow guidance (`https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`). Alternative considered: a canvas-only board, which would reduce built-in semantics and complicate accessibility.
- **UC REFERENCES:** UC-005, UC-007
- **NOTES:** The mobile presentation should include an explicit Flag mode so right-click is never required for the core puzzle loop.
- **RELATED:** BR-011, BR-012, BR-015, BR-016, BR-017; PT-007, PT-009

## AR-007 : Optional secret interaction channel

- **DECISION:** Deliver the easter egg as a hidden desktop-level trigger that opens a temporary secret response layer and then returns to the shell.
- **RATIONALE:** This preserves the optional nature of the hidden detail while keeping the main desktop stable and recoverable. Source basis: WAI dialog and focus-management patterns (`https://www.w3.org/WAI/ARIA/apg/`). Alternative considered: a hidden full-page route, which creates a higher risk of trapping the visitor outside the normal shell flow.
- **UC REFERENCES:** UC-006
- **NOTES:** Recommended triggers are a hidden key sequence or a special icon interaction path. The response should be distinct, visible, dismissible, and non-blocking.
- **RELATED:** BR-013, BR-014; PT-004, PT-009

## AR-008 : Responsive accessibility foundation

- **DECISION:** Make responsive layout, keyboard support, touch targets, and reduced-motion handling mandatory shell-level architecture rules.
- **RATIONALE:** Mobile usability is an approved use case, so accessibility and reflow cannot be deferred to cosmetic polish. Source basis: WCAG 2.2 reflow and target size guidance (`https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`, `https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`). Alternative considered: preserving overlapping desktop windows unchanged on all breakpoints, which would better mimic the original desktop but fail small-screen operability requirements.
- **UC REFERENCES:** UC-001, UC-002, UC-004, UC-005, UC-007
- **NOTES:** On small screens, windows should open maximized, touch targets should be larger, and shell interaction should avoid horizontal scrolling as the primary mode.
- **RELATED:** BR-001, BR-004, BR-009, BR-011, BR-015, BR-016, BR-017; PT-006, PT-007, PT-009

## Research Notes

- **DATE CHECKED:** 2026-06-10
- **SOURCE URLS RECORDED:** `https://vite.dev/guide/`, `https://react.dev/`, `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea`, `https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API`, `https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events`, `https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`, `https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`, `https://www.w3.org/WAI/ARIA/apg/`
- **WHAT WAS USED:** Platform capability fit, state-management guidance, input-model guidance, and mobile accessibility constraints.
- **WHY IT WAS USED:** To anchor Stage 6 decisions in mainstream browser-platform and accessibility guidance that can be verified again during later stages.
- **LIMITATION:** The runner could not resolve external hosts during this session, so URLs were recorded for downstream verification rather than fetched live.

GATE 6: PASS
