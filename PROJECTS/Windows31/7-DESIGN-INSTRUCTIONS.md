# Design Instructions — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Technical Lead
- **SOURCE:** 2-USE-CASES.md, 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md

---

## IMPLEMENTATION ORDER

1. DI-001 foundation scaffold
2. DI-002 visual system, text contract, asset contract
3. DI-003 shell state, app registry, and window model
4. DI-004 boot flow and hidden secret channel
5. DI-005 desktop surface, launcher, and window chrome
6. DI-006 Notepad module
7. DI-007 Paint module
8. DI-008 Minesweeper module
9. DI-009 Calculator module

---

## DI-001 : APPLICATION SCAFFOLD AND BUILD FOUNDATION

- **SUMMARY:** Create the static Vite/React/TypeScript application skeleton and the top-level runtime entry points required by every later feature.
- **IMPLEMENTATION STEPS:**
  1. Create `package.json` with npm scripts `dev`, `build`, `preview`, `lint`, and `typecheck`, and include only the dependencies implied by Stage 6: Vite, React 18, React DOM 18, TypeScript 5, and linting support.
  2. Create `tsconfig.json`, `tsconfig.node.json`, and `vite.config.ts` for a browser-only SPA build that emits static assets into `dist/` and does not assume SSR, routing, or backend APIs.
  3. Create `index.html` with a single root node `#root`, a viewport meta tag, and no additional HTML UI outside the React mount point.
  4. Create `src/main.tsx`, `src/App.tsx`, `src/shell/ShellRoot.tsx`, and `src/vite-env.d.ts`.
  5. Create the source directories `src/assets/`, `src/content/`, `src/features/`, `src/shell/`, `src/styles/`, `src/types/`, and `src/utils/`.
  6. Make `src/main.tsx` mount `<App />` inside `React.StrictMode`.
  7. Make `src/App.tsx` import the global styles and render this exact tree with no route switch: `<ShellProvider><ShellRoot /></ShellProvider>`.
  8. Create `src/utils/constants.ts` with shared constants `MOBILE_BREAKPOINT_PX = 768`, `SMALL_MOBILE_BREAKPOINT_PX = 480`, and `BOOT_DURATION_MS = 3200`.
  9. Create `src/types/runtime.ts` with reusable primitives `type ViewportMode = 'desktop' | 'mobile'` and `type Point = { x: number; y: number }`.
  10. Define the shell root so the app can render without Stage 9 assets by falling back to CSS colors and text labels instead of crashing on missing files.
  11. Verify that `npm run dev` can render a stable root application frame before any bundled app logic is added.
- **SKILLSET REQUIRED:** Vite, React 18, TypeScript 5, npm package management.
- **NOTES:** Definition of done: the project boots into a rendered React shell root with no unresolved imports, no router dependency, and a build path that is compatible with static hosting. Do not add backend calls, authentication, or persistence features in this DI.
- **RELATED:** BR-003, BR-015, BR-016, BR-017; AR-001, AR-008; PT-001, PT-002, PT-009, PT-010

## DI-002 : RETRO UI SYSTEM, TEXT CONTRACT, AND ASSET CONTRACT

- **SUMMARY:** Define the global visual system plus the exact text and graphic contracts that Writer, Graphic Artist, and Developer must share.
- **IMPLEMENTATION STEPS:**
  1. Create `src/styles/reset.css`, `src/styles/tokens.css`, and `src/styles/global.css`.
  2. Put all shared visual tokens in `src/styles/tokens.css`, including the approved palette (`#C0C0C0`, `#808080`, `#FFFFFF`, `#000000`, `#008080`, `#000080`), border bevel sizes, spacing scale, z-index layers, and motion durations.
  3. Put the global shell rules in `src/styles/global.css`, including `html, body, #root { min-height: 100%; }`, a non-scrolling desktop root on large screens, and `overflow-x: hidden` on all viewports.
  4. Add responsive rules so the shell switches to mobile mode at `768px` and below, touch targets are at least `44px` square in mobile mode, launcher icons wrap into columns, and app windows open maximized instead of overlapping.
  5. Add reduced-motion rules with `@media (prefers-reduced-motion: reduce)` so the boot animation shortens to `300ms`, decorative motion stops, and no flashing loop remains active.
  6. Create `src/content/uiText.ts` exporting `interface UITextContract` and a default `uiText` object whose keys match Appendix A exactly.
  7. Create `src/assets/assetManifest.ts` exporting `type AssetKey = 'boot_logo' | 'desktop_wallpaper' | 'program_manager_icon' | 'icon_notepad' | 'icon_paint' | 'icon_calculator' | 'icon_minesweeper' | 'paint_tool_pencil' | 'paint_tool_eraser' | 'minesweeper_restart_icon' | 'secret_backdrop'`, `interface AssetSpec`, and an `assetManifest` object whose keys match Appendix B exactly.
  8. Make `AssetSpec` use this exact shape: `{ deliveryFileName: string; runtimeImportPath: string; format: 'svg' | 'png'; width: number; height: number; component: string; purpose: string; fallback: 'css-box' | 'text-label' | 'none' }`.
  9. Make every Stage 10 runtime import path use `src/assets/imported/<file-name>` so Stage 9 files can be copied into the app without renaming.
  10. Treat numeric keypad labels and mathematical operator glyphs as fixed symbols owned by development, and treat every other user-visible or assistive string in Appendix A as Writer-owned copy.
  11. Verify that the application still renders if `src/assets/imported/` is empty by using the fallback behavior declared in `assetManifest`.
- **SKILLSET REQUIRED:** CSS Modules or modular CSS organization, responsive UI systems, TypeScript interface design.
- **NOTES:** Definition of done: there is one authoritative text-key contract and one authoritative asset-key contract, and both match the appendices in this document exactly. Do not invent extra writer or asset fields during implementation; add them only by rerunning Stage 7.
- **RELATED:** BR-004, BR-013, BR-014, BR-015, BR-016, BR-017; AR-001, AR-005, AR-006, AR-007, AR-008; PT-004, PT-006, PT-007, PT-009

## DI-003 : SHELL STATE, APP REGISTRY, AND WINDOW MANAGER CONTRACT

- **SUMMARY:** Build the typed shell reducer, app registry, and window records that control boot, desktop, secret, and bundled app lifecycle.
- **IMPLEMENTATION STEPS:**
  1. Create `src/shell/types.ts` with these exact unions: `type ShellPhase = 'boot' | 'desktop' | 'secret'` and `type AppId = 'notepad' | 'paint' | 'calculator' | 'minesweeper'`.
  2. Define `interface WindowRecord` in `src/shell/types.ts` with required fields `{ windowId: string; appId: AppId; title: string; isOpen: boolean; isFocused: boolean; zIndex: number; position: Point; size: { width: number; height: number }; isMaximized: boolean; restorePosition: Point | null; restoreSize: { width: number; height: number } | null; }`.
  3. Define `interface AppDefinition` in `src/shell/types.ts` with required fields `{ appId: AppId; titleKey: keyof UITextContract; iconKey: AssetKey; defaultSize: { width: number; height: number }; defaultPosition: Point; desktopGroup: 'accessories' | 'games'; mobileStartsMaximized: true; renderWindow: (windowId: string) => React.ReactNode; }`.
  4. Create `src/shell/appRegistry.tsx` and set the registry defaults in that file to these sizes: Notepad `520x360`, Paint `700x540`, Calculator `260x320`, and Minesweeper `320x420`.
  5. Set the registry default positions in `src/shell/appRegistry.tsx` to these desktop coordinates: Notepad `(72, 72)`, Paint `(132, 96)`, Calculator `(192, 120)`, and Minesweeper `(252, 144)`.
  6. Create `src/shell/ShellContext.tsx` using `useReducer` and export `ShellProvider`, `useShellState()`, and `useShellActions()`.
  7. Use this exact action union in `src/shell/ShellContext.tsx`: `BOOT_COMPLETE`, `BOOT_SKIP`, `OPEN_APP`, `FOCUS_WINDOW`, `CLOSE_WINDOW`, `MOVE_WINDOW`, `SET_VIEWPORT_MODE`, `TRIGGER_SECRET`, and `DISMISS_SECRET`.
  8. Make `OPEN_APP` focus the existing window if that app is already open instead of creating duplicate windows.
  9. Make `CLOSE_WINDOW` remove focus from the closing window and return focus to the highest-z remaining window, or to the desktop surface if no app window remains open.
  10. Make `MOVE_WINDOW` clamp dragged window positions so the title bar always remains inside the viewport bounds.
  11. Make `SET_VIEWPORT_MODE` maximize all open windows when entering mobile mode and restore stored desktop positions and sizes when returning to desktop mode.
  12. Track the current focused app window ID and the last non-secret focus target so the secret overlay can return focus correctly after dismissal.
  13. Verify these edge cases in the reducer contract: rapid repeated launcher activation, closing the only open window, switching to mobile with multiple windows open, and skipping boot at the same moment the timer completes.
- **SKILLSET REQUIRED:** React reducer patterns, TypeScript discriminated unions, UI state modeling.
- **NOTES:** Definition of done: the shell has one authoritative state source for phase, viewport mode, registry, and windows, and every later DI reads from this contract instead of storing duplicate shell truth. Do not add multi-instance apps in Stage 10; this DI fixes the model to one window per bundled app.
- **RELATED:** BR-001, BR-002, BR-003, BR-004, BR-005, BR-013, BR-014, BR-015, BR-016, BR-017; AR-002, AR-003, AR-008; PT-003, PT-004, PT-009

## DI-004 : BOOT SEQUENCE AND SECRET RESPONSE FLOW

- **SUMMARY:** Implement the entry boot experience, visible skip path, and the hidden secret overlay that safely returns to the shell.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/boot/BootSequence.tsx` and `src/features/boot/BootSequence.module.css`.
  2. Create `src/features/secret/SecretOverlay.tsx` and `src/features/secret/SecretOverlay.module.css`.
  3. Make the initial shell phase `boot` on first render and start a single `BOOT_DURATION_MS` timer that dispatches `BOOT_COMPLETE` once.
  4. Render the skip control from the first paint of `BootSequence` using `boot_skip_button_label`; do not delay or hide it behind animation progress.
  5. Make both `BOOT_SKIP` and `BOOT_COMPLETE` idempotent so only the first transition to `desktop` changes state and later duplicate events are ignored.
  6. Keep the boot content visually centered and non-interactive except for the skip button so users cannot open apps before the desktop phase.
  7. Add an accessible Program Manager title-bar icon button in the desktop shell and treat triple activation of that icon within `2500ms` as the only hidden trigger path.
  8. Dispatch `TRIGGER_SECRET` only when the shell is in `desktop`, no modal is already open, and the title-bar icon triple-activation counter completes within the `2500ms` window.
  9. Make `SecretOverlay` render as a modal retro window above all app windows, show the Appendix A secret copy, and use the Appendix B secret background asset if present.
  10. Trap keyboard focus inside `SecretOverlay` while it is open and close it through the dedicated dismiss button or the `Escape` key.
  11. On `DISMISS_SECRET`, restore focus to the last focused app window title bar if one exists; otherwise restore focus to the desktop surface.
  12. Verify these edge cases: skip clicked at the same frame as auto-complete, secret triggered while boot is active, secret trigger attempted while an app control has focus, and dismissing secret with no app windows open.
- **SKILLSET REQUIRED:** React effects, timer lifecycle handling, modal accessibility, focus management.
- **NOTES:** Definition of done: a visitor always sees a boot ritual, can always skip it immediately, can trigger one hidden interaction from the desktop shell, and always returns safely to normal shell flow after secret dismissal.
- **RELATED:** BR-001, BR-002, BR-003, BR-013, BR-014; AR-002, AR-007, AR-008; PT-004, PT-009

## DI-005 : DESKTOP SURFACE, PROGRAM MANAGER LAUNCHER, AND WINDOW CHROME

- **SUMMARY:** Build the Windows 3.1-style desktop shell, grouped launcher icons, and draggable or maximized retro windows that host bundled apps.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/desktop/DesktopSurface.tsx`, `src/features/desktop/DesktopSurface.module.css`, `src/features/desktop/LauncherGrid.tsx`, `src/features/desktop/LauncherIcon.tsx`, `src/features/windows/WindowFrame.tsx`, and `src/features/windows/WindowFrame.module.css`.
  2. Make `DesktopSurface` render a wallpaper-backed desktop plus one Program Manager-style shell window containing grouped launcher icons for `accessories` and `games`.
  3. Make the desktop groups use these exact assignments: `accessories` contains Notepad, Paint, and Calculator; `games` contains Minesweeper.
  4. Make each launcher icon a focusable button that uses double-click to open on pointer desktop interactions, single tap to open on touch interactions, and `Enter` or `Space` to open from the keyboard.
  5. Keep icon activation timing deterministic by treating two pointer clicks within `500ms` on the same icon as an open command and a single desktop pointer click as selection only.
  6. Make `WindowFrame` render a title bar, left icon slot, title text, close button, content region, and focus ring, and do not add minimize or maximize buttons in Stage 10.
  7. Make desktop-mode windows draggable only from the title bar and non-draggable in mobile mode.
  8. Make mobile-mode windows occupy the full usable viewport width and height beneath safe-area insets, and keep the close button visible without horizontal scrolling.
  9. Keep the Program Manager shell window always open and pinned below app windows so closing apps never removes the main launcher from view.
  10. Use the shared shell reducer for open, close, and focus behavior and do not create local window-order state inside `WindowFrame`.
  11. Verify these edge cases: repeated double-clicks on the same icon, drag attempts that would move a title bar off-screen, switching from desktop to mobile while a drag is in progress, and closing the focused topmost window.
- **SKILLSET REQUIRED:** React component composition, pointer and keyboard interaction handling, responsive layout implementation.
- **NOTES:** Definition of done: every bundled app has a visible desktop entry point, every app window closes cleanly back to the shell, and the shell remains readable and operable on mobile without primary horizontal scrolling.
- **RELATED:** BR-004, BR-005, BR-015, BR-016, BR-017; AR-002, AR-003, AR-008; PT-003, PT-008, PT-009

## DI-006 : NOTEPAD PLAIN-TEXT MODULE

- **SUMMARY:** Deliver a plain-text Notepad window using a native textarea and explicit clear behavior.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/apps/notepad/NotepadWindow.tsx` and `src/features/apps/notepad/NotepadWindow.module.css`.
  2. Create `src/features/apps/notepad/notepadState.ts` exporting `interface NotepadState { content: string }` and `function clearNotepad(current: NotepadState): NotepadState`.
  3. Render one native `<textarea>` as the primary editor surface and make it fill the available window content area.
  4. Bind keyboard typing directly to the textarea so plain text entry, selection, deletion, and overwrite all use native browser text behavior instead of a custom editor layer.
  5. Add one visible clear command button using `notepad_clear_button_label` and wire it to replace the full editor content with an empty string in the same window.
  6. Keep the editor unformatted by disabling rich-text behavior, HTML parsing, and pasted markup rendering; all pasted content must resolve to plain text only.
  7. Preserve line breaks exactly as entered and do not trim leading or trailing whitespace on input or clear.
  8. Prevent shell-level secret activation from listening while the textarea is focused so normal typing never triggers shell shortcuts.
  9. Verify these edge cases: clearing an already empty document, replacing a selected range by typing, pasting multi-line text, and closing or reopening the app after edits within the same session.
- **SKILLSET REQUIRED:** React forms, textarea behavior, TypeScript state helpers, accessibility for form controls.
- **NOTES:** Definition of done: the user can type, select, replace, and clear plain text entirely within one Notepad window, and the editor behaves like a lightweight native text box rather than a word processor.
- **RELATED:** BR-006, BR-007, BR-008; AR-004; PT-005

## DI-007 : PAINT CANVAS MODULE

- **SUMMARY:** Deliver a retro Paint window with direct drawing, alternate tool selection, alternate color selection, and touch-safe pointer handling.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/apps/paint/PaintWindow.tsx`, `src/features/apps/paint/PaintCanvas.tsx`, `src/features/apps/paint/PaintWindow.module.css`, and `src/features/apps/paint/paintTypes.ts`.
  2. Define `type PaintTool = 'pencil' | 'eraser'` in `src/features/apps/paint/paintTypes.ts`.
  3. Define the default paint state in `src/features/apps/paint/paintTypes.ts` with `activeTool: 'pencil'`, `activeColor: '#000000'`, and the palette `['#000000', '#FFFFFF', '#808080', '#000080', '#008080', '#FF0000']`.
  4. Render the drawing surface with one `<canvas>` element whose backing store is multiplied by `window.devicePixelRatio` and whose CSS size remains stable in layout pixels.
  5. Implement drawing with Pointer Events only, capture the pointer on press, prevent page scrolling while drawing on touch, and stop the stroke on `pointerup`, `pointercancel`, or lost capture.
  6. Add visible controls for `paint_tool_pencil_label`, `paint_tool_eraser_label`, and `paint_tool_clear_label`.
  7. Add visible color swatches for the six palette values and update the next stroke immediately when the active color changes.
  8. Make the eraser draw in the desktop background canvas color rather than transparent pixels so the result remains visually consistent after resize and redraw.
  9. Preserve the current bitmap when the app window or viewport changes size by copying the previous canvas image into a resized backing canvas instead of clearing it implicitly.
  10. Verify these edge cases: dragging out of bounds while drawing, touch drawing on mobile without page pan, clearing the canvas while a stroke is active, and redrawing after resize on high-DPI screens.
- **SKILLSET REQUIRED:** Canvas 2D API, Pointer Events, React refs, responsive graphics handling.
- **NOTES:** Definition of done: the user can draw directly, switch to at least one alternate tool and one alternate color, and see immediate visual results on desktop and mobile.
- **RELATED:** BR-009, BR-010, BR-015, BR-016, BR-017; AR-005, AR-008; PT-006, PT-009

## DI-008 : MINESWEEPER ENGINE AND BOARD UI

- **SUMMARY:** Deliver a deterministic beginner-size Minesweeper game with reveal, flag, counter, win/loss, and restart behavior that works on touch and keyboard.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/apps/minesweeper/engine.ts`, `src/features/apps/minesweeper/types.ts`, `src/features/apps/minesweeper/MinesweeperWindow.tsx`, and `src/features/apps/minesweeper/MinesweeperWindow.module.css`.
  2. Define `interface BoardConfig { rows: 9; cols: 9; mines: 10 }`, `type GameStatus = 'ready' | 'playing' | 'won' | 'lost'`, and `interface Cell { row: number; col: number; isMine: boolean; adjacentCount: number; revealed: boolean; flagged: boolean; }` in `src/features/apps/minesweeper/types.ts`.
  3. Initialize every new game with a `9x9` board and `10` mines.
  4. Make the first reveal action guaranteed safe by relocating a mine if the first chosen cell contains one before adjacent counts are finalized.
  5. Implement zero-cell flood reveal so revealing a cell with `adjacentCount === 0` recursively reveals its connected empty region and bordering numbered cells.
  6. Render the board as a semantic grid of buttons and keep keyboard focus visible for every unrevealed cell.
  7. Add a visible mine counter, a visible restart button using `minesweeper_restart_button_label`, and a visible flag-mode toggle using `minesweeper_flag_mode_label`.
  8. Make desktop right-click toggle a flag without opening the browser context menu, and make the visible flag-mode toggle control reveal-versus-flag tap behavior for touch and keyboard users.
  9. Freeze all board mutations after `won` or `lost` except the restart action.
  10. Format the counter from `totalMines - flaggedCount` and allow negative values if the user places extra flags; do not silently clamp the logic result.
  11. Verify these edge cases: revealing a flagged cell, toggling flag mode mid-game, losing on a non-first reveal, winning by revealing all non-mine cells, and restarting immediately after a loss or win.
- **SKILLSET REQUIRED:** TypeScript game logic, React state wiring, CSS Grid, keyboard and touch accessibility.
- **NOTES:** Definition of done: the board feels like classic beginner Minesweeper, never requires right-click to be playable, and cleanly supports restart after either outcome.
- **RELATED:** BR-011, BR-012, BR-015, BR-016, BR-017; AR-006, AR-008; PT-007, PT-009

## DI-009 : CALCULATOR WINDOW FOR SHELL PARITY

- **SUMMARY:** Deliver a compact four-function Calculator window so the shell includes all approved bundled apps and launch/close behavior remains consistent.
- **IMPLEMENTATION STEPS:**
  1. Create `src/features/apps/calculator/CalculatorWindow.tsx` and `src/features/apps/calculator/CalculatorWindow.module.css`.
  2. Render a display region plus a keypad with digits `0-9`, decimal point, operators `+`, `-`, `×`, `÷`, equals, and clear.
  3. Keep the calculation model local to the calculator window and do not add shell-level persistence.
  4. Make the display start at `0`, prevent duplicate decimal points in one operand, and replace the current operand when a digit is typed after an error state.
  5. Show `Error` on divide-by-zero and require the clear action to return to a normal numeric state.
  6. Make repeated `=` with no new pending operator leave the displayed result unchanged.
  7. Keep keyboard support limited to digits, decimal, Enter, Backspace, Escape, and the four operators so the app remains usable without a mouse.
  8. Verify these edge cases: divide by zero, chained operations, repeated equals, leading zero entry, and closing or reopening the app after using it.
- **SKILLSET REQUIRED:** React component state, keyboard event handling, basic arithmetic logic.
- **NOTES:** Definition of done: Calculator is a real, launchable, closable utility window that behaves consistently with the rest of the shell and does not expand beyond a compact four-function scope.
- **RELATED:** BR-004, BR-005, BR-016; AR-003; PT-008

---

## APPENDIX A — TEXT FIELD INVENTORY

All keys below must exist in `src/content/uiText.ts` exactly as written.

| Component | Field key | Character limit | Purpose |
|---|---|---:|---|
| BootSequence | `boot_loading_label` | 28 | Primary centered boot label shown during startup. |
| BootSequence | `boot_status_line` | 48 | Secondary one-line status text under the boot label. |
| BootSequence | `boot_skip_button_label` | 12 | Visible skip control label. |
| DesktopSurface | `desktop_window_title` | 24 | Program Manager-style shell window title. |
| DesktopSurface | `desktop_group_accessories_title` | 18 | Group label above Notepad, Paint, and Calculator. |
| DesktopSurface | `desktop_group_games_title` | 18 | Group label above Minesweeper. |
| DesktopSurface | `desktop_status_hint` | 56 | One-line shell hint for opening apps or discovering controls. |
| LauncherIcon | `launcher_notepad_label` | 16 | Visible desktop launcher label for Notepad. |
| LauncherIcon | `launcher_paint_label` | 16 | Visible desktop launcher label for Paint. |
| LauncherIcon | `launcher_calculator_label` | 16 | Visible desktop launcher label for Calculator. |
| LauncherIcon | `launcher_minesweeper_label` | 16 | Visible desktop launcher label for Minesweeper. |
| WindowFrame | `window_close_button_label` | 10 | Accessible label for the common close button. |
| WindowFrame | `window_title_icon_button_label` | 28 | Accessible label for the Program Manager title-bar icon button. |
| NotepadWindow | `notepad_window_title` | 24 | Notepad window title text. |
| NotepadWindow | `notepad_clear_button_label` | 12 | Visible clear command button label. |
| NotepadWindow | `notepad_editor_aria_label` | 48 | Accessible name for the textarea. |
| PaintWindow | `paint_window_title` | 24 | Paint window title text. |
| PaintWindow | `paint_tool_pencil_label` | 12 | Visible pencil tool button label. |
| PaintWindow | `paint_tool_eraser_label` | 12 | Visible eraser tool button label. |
| PaintWindow | `paint_tool_clear_label` | 12 | Visible clear canvas button label. |
| PaintWindow | `paint_palette_group_label` | 18 | Visible label for the color swatch group. |
| PaintWindow | `paint_canvas_aria_label` | 56 | Accessible name for the drawing canvas. |
| CalculatorWindow | `calculator_window_title` | 24 | Calculator window title text. |
| CalculatorWindow | `calculator_display_aria_label` | 32 | Accessible name for the calculator display. |
| MinesweeperWindow | `minesweeper_window_title` | 24 | Minesweeper window title text. |
| MinesweeperWindow | `minesweeper_restart_button_label` | 14 | Visible restart control label. |
| MinesweeperWindow | `minesweeper_flag_mode_label` | 14 | Visible toggle label for flag mode. |
| MinesweeperWindow | `minesweeper_counter_aria_label` | 32 | Accessible name for the mine counter readout. |
| MinesweeperWindow | `minesweeper_status_ready_label` | 16 | Visible status label before first move. |
| MinesweeperWindow | `minesweeper_status_won_label` | 16 | Visible status label on win. |
| MinesweeperWindow | `minesweeper_status_lost_label` | 16 | Visible status label on loss. |
| SecretOverlay | `secret_window_title` | 24 | Secret overlay window title. |
| SecretOverlay | `secret_headline` | 40 | Main visible secret reward heading. |
| SecretOverlay | `secret_body` | 180 | Body copy explaining the secret and inviting dismissal. |
| SecretOverlay | `secret_dismiss_button_label` | 20 | Visible button label used to return to the desktop. |

---

## APPENDIX B — GRAPHIC ASSET INVENTORY

Stage 9 must deliver each file under `9-GRAPHIC-ASSETS/` with the exact `deliveryFileName` below. Stage 10 must copy each delivered file into the exact `runtimeImportPath` below without renaming it.

Naming convention: `win31-{group}-{slug}-{size}.{ext}`

| Asset key | Component | Intended use | Format | Dimensions | deliveryFileName | runtimeImportPath |
|---|---|---|---|---|---|---|
| `boot_logo` | BootSequence | Centered startup graphic above boot text. | SVG | 320x160 | `win31-surface-boot-logo-320x160.svg` | `src/assets/imported/win31-surface-boot-logo-320x160.svg` |
| `desktop_wallpaper` | DesktopSurface | Shell wallpaper or repeating desktop background. | PNG | 1024x768 | `win31-surface-wallpaper-1024x768.png` | `src/assets/imported/win31-surface-wallpaper-1024x768.png` |
| `program_manager_icon` | WindowFrame/DesktopSurface | Title-bar icon for the Program Manager shell window and hidden secret trigger target. | PNG | 32x32 | `win31-icon-program-manager-32x32.png` | `src/assets/imported/win31-icon-program-manager-32x32.png` |
| `icon_notepad` | LauncherIcon | Desktop icon for Notepad. | PNG | 32x32 | `win31-icon-notepad-32x32.png` | `src/assets/imported/win31-icon-notepad-32x32.png` |
| `icon_paint` | LauncherIcon | Desktop icon for Paint. | PNG | 32x32 | `win31-icon-paint-32x32.png` | `src/assets/imported/win31-icon-paint-32x32.png` |
| `icon_calculator` | LauncherIcon | Desktop icon for Calculator. | PNG | 32x32 | `win31-icon-calculator-32x32.png` | `src/assets/imported/win31-icon-calculator-32x32.png` |
| `icon_minesweeper` | LauncherIcon | Desktop icon for Minesweeper. | PNG | 32x32 | `win31-icon-minesweeper-32x32.png` | `src/assets/imported/win31-icon-minesweeper-32x32.png` |
| `paint_tool_pencil` | PaintWindow | Toolbar icon paired with the pencil control. | SVG | 16x16 | `win31-tool-pencil-16x16.svg` | `src/assets/imported/win31-tool-pencil-16x16.svg` |
| `paint_tool_eraser` | PaintWindow | Toolbar icon paired with the eraser control. | SVG | 16x16 | `win31-tool-eraser-16x16.svg` | `src/assets/imported/win31-tool-eraser-16x16.svg` |
| `minesweeper_restart_icon` | MinesweeperWindow | Optional icon paired with the restart control. | SVG | 16x16 | `win31-tool-restart-16x16.svg` | `src/assets/imported/win31-tool-restart-16x16.svg` |
| `secret_backdrop` | SecretOverlay | Distinct secret-response background art inside the overlay content area. | SVG | 640x400 | `win31-secret-after-hours-640x400.svg` | `src/assets/imported/win31-secret-after-hours-640x400.svg` |

Fallback rules for `src/assets/assetManifest.ts`:

| Asset key | Fallback |
|---|---|
| `boot_logo` | `text-label` |
| `desktop_wallpaper` | `css-box` |
| `program_manager_icon` | `css-box` |
| `icon_notepad` | `text-label` |
| `icon_paint` | `text-label` |
| `icon_calculator` | `text-label` |
| `icon_minesweeper` | `text-label` |
| `paint_tool_pencil` | `text-label` |
| `paint_tool_eraser` | `text-label` |
| `minesweeper_restart_icon` | `none` |
| `secret_backdrop` | `css-box` |

---

## APPENDIX C — TRACEABILITY COVERAGE

| Requirement / architecture / part | Implementing DIs |
|---|---|
| BR-001, BR-002, BR-003 | DI-003, DI-004 |
| BR-004, BR-005 | DI-003, DI-005, DI-009 |
| BR-006, BR-007, BR-008 | DI-006 |
| BR-009, BR-010 | DI-007 |
| BR-011, BR-012 | DI-008 |
| BR-013, BR-014 | DI-003, DI-004 |
| BR-015, BR-016, BR-017 | DI-001, DI-002, DI-003, DI-005, DI-007, DI-008, DI-009 |
| AR-001 | DI-001, DI-002 |
| AR-002 | DI-003, DI-004, DI-005 |
| AR-003 | DI-003, DI-005, DI-009 |
| AR-004 | DI-006 |
| AR-005 | DI-002, DI-007 |
| AR-006 | DI-002, DI-008 |
| AR-007 | DI-004 |
| AR-008 | DI-001, DI-002, DI-003, DI-004, DI-005, DI-007, DI-008 |
| PT-001, PT-002 | DI-001 |
| PT-003 | DI-003, DI-005 |
| PT-004 | DI-002, DI-004 |
| PT-005 | DI-006 |
| PT-006 | DI-002, DI-007 |
| PT-007 | DI-002, DI-008 |
| PT-008 | DI-005, DI-009 |
| PT-009 | DI-001, DI-002, DI-003, DI-004, DI-005, DI-007, DI-008 |
| PT-010 | DI-001 |

---

## EXIT GATE CHECK

- [x] Every BR/AR pair has at least one DI.
- [x] Every DI has all five schema sections.
- [x] No DI contains placeholder text or vague delegation.
- [x] Every file path in implementation steps is complete and relative.
- [x] DI IDs are sequential and non-reused.
- [x] RELATED fields reference valid BR-IDs, AR-IDs, and PT-IDs.
- [x] `7-DESIGN-INSTRUCTIONS.md` is set to PASS with today's date.

GATE 7: PASS
