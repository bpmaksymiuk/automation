# Text Content — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Writer
- **SOURCE:** 1-BRAINSTORM.md, 2-USE-CASES.md, 3-NARRATIVE-VISION.md, 4-CONCEPT-STORYBOARD.md, 5-REQUIREMENTS.md, 6-ARCHITECTURE-RECOMMENDATIONS.md, 6-PARTS LIST.md, 7-DESIGN-INSTRUCTIONS.md

---

## OVERVIEW

This package delivers final writer-owned copy for every Appendix A text key in `7-DESIGN-INSTRUCTIONS.md`. The language stays warm, clear, lightly reverent, playfully restrained, and historically legible so Stage 10 can paste strings directly into the approved component structure.

## TC RECORDS

## TC-001 : BOOT SEQUENCE COPY

- **SUMMARY:** Final startup copy for the boot ritual and immediate skip path.
- **FILE:** `./8-TEXT/boot-sequence.md`
- **CATEGORY:** `ui`
- **TONE NOTES:** Short, ceremonial, and readable at a glance; keeps the nostalgia without slowing the user down.
- **GLOSSARY REFERENCES:** GL-001, GL-008
- **TRACEABILITY:** DI-002, DI-004

## TC-002 : DESKTOP SHELL AND LAUNCHER COPY

- **SUMMARY:** Final shell labels for Program Manager, launcher groups, launcher icons, and the core interaction hint.
- **FILE:** `./8-TEXT/desktop-shell-and-launcher.md`
- **CATEGORY:** `ui`
- **TONE NOTES:** Familiar and period-correct first; concise enough for dense retro chrome and mobile reflow.
- **GLOSSARY REFERENCES:** GL-001, GL-002, GL-003, GL-004
- **TRACEABILITY:** DI-002, DI-005

## TC-003 : WINDOW FRAME SHARED COPY

- **SUMMARY:** Shared accessibility labels for common window chrome and the Program Manager title-bar icon button.
- **FILE:** `./8-TEXT/window-frame.md`
- **CATEGORY:** `ui`
- **TONE NOTES:** Functional, literal, and non-cute; accessibility labels should describe controls, not explain secrets.
- **GLOSSARY REFERENCES:** GL-001, GL-007
- **TRACEABILITY:** DI-002, DI-004, DI-005

## TC-004 : NOTEPAD WINDOW COPY

- **SUMMARY:** Final text and assistive labels for the Notepad editing window.
- **FILE:** `./8-TEXT/notepad-window.md`
- **CATEGORY:** `utility`
- **TONE NOTES:** Plainspoken and familiar; the clear action should feel obvious, not dramatic.
- **GLOSSARY REFERENCES:** GL-007
- **TRACEABILITY:** DI-002, DI-006

## TC-005 : PAINT WINDOW COPY

- **SUMMARY:** Final labels for the Paint drawing window, tools, palette, and canvas accessibility name.
- **FILE:** `./8-TEXT/paint-window.md`
- **CATEGORY:** `utility`
- **TONE NOTES:** Compact tool language with one historically legible nod to Paintbrush in the window title.
- **GLOSSARY REFERENCES:** GL-007, GL-009
- **TRACEABILITY:** DI-002, DI-007

## TC-006 : CALCULATOR WINDOW COPY

- **SUMMARY:** Final title and assistive label for the compact four-function calculator window.
- **FILE:** `./8-TEXT/calculator-window.md`
- **CATEGORY:** `utility`
- **TONE NOTES:** Minimal and literal; the calculator should feel dependable and untheatrical.
- **GLOSSARY REFERENCES:** GL-007
- **TRACEABILITY:** DI-002, DI-009

## TC-007 : MINESWEEPER WINDOW COPY

- **SUMMARY:** Final gameplay labels for Minesweeper status, restart, flag mode, and counter accessibility text.
- **FILE:** `./8-TEXT/minesweeper-window.md`
- **CATEGORY:** `utility`
- **TONE NOTES:** Crisp and game-like; status labels stay readable in tight space and avoid parody.
- **GLOSSARY REFERENCES:** GL-005, GL-007
- **TRACEABILITY:** DI-002, DI-008

## TC-008 : SECRET OVERLAY COPY

- **SUMMARY:** Final reveal copy for the hidden after-hours overlay and its dismissal path back to the desktop.
- **FILE:** `./8-TEXT/secret-overlay.md`
- **CATEGORY:** `narrative`
- **TONE NOTES:** Rewarding and gently magical, but still restrained enough to feel like part of the same system.
- **GLOSSARY REFERENCES:** GL-001, GL-002, GL-006
- **TRACEABILITY:** DI-002, DI-004

## APPENDIX A COVERAGE MAP

| Field key | Component | TC | File |
|---|---|---|---|
| `boot_loading_label` | BootSequence | TC-001 | `./8-TEXT/boot-sequence.md` |
| `boot_status_line` | BootSequence | TC-001 | `./8-TEXT/boot-sequence.md` |
| `boot_skip_button_label` | BootSequence | TC-001 | `./8-TEXT/boot-sequence.md` |
| `desktop_window_title` | DesktopSurface | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `desktop_group_accessories_title` | DesktopSurface | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `desktop_group_games_title` | DesktopSurface | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `desktop_status_hint` | DesktopSurface | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `launcher_notepad_label` | LauncherIcon | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `launcher_paint_label` | LauncherIcon | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `launcher_calculator_label` | LauncherIcon | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `launcher_minesweeper_label` | LauncherIcon | TC-002 | `./8-TEXT/desktop-shell-and-launcher.md` |
| `window_close_button_label` | WindowFrame | TC-003 | `./8-TEXT/window-frame.md` |
| `window_title_icon_button_label` | WindowFrame | TC-003 | `./8-TEXT/window-frame.md` |
| `notepad_window_title` | NotepadWindow | TC-004 | `./8-TEXT/notepad-window.md` |
| `notepad_clear_button_label` | NotepadWindow | TC-004 | `./8-TEXT/notepad-window.md` |
| `notepad_editor_aria_label` | NotepadWindow | TC-004 | `./8-TEXT/notepad-window.md` |
| `paint_window_title` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `paint_tool_pencil_label` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `paint_tool_eraser_label` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `paint_tool_clear_label` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `paint_palette_group_label` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `paint_canvas_aria_label` | PaintWindow | TC-005 | `./8-TEXT/paint-window.md` |
| `calculator_window_title` | CalculatorWindow | TC-006 | `./8-TEXT/calculator-window.md` |
| `calculator_display_aria_label` | CalculatorWindow | TC-006 | `./8-TEXT/calculator-window.md` |
| `minesweeper_window_title` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_restart_button_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_flag_mode_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_counter_aria_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_status_ready_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_status_won_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `minesweeper_status_lost_label` | MinesweeperWindow | TC-007 | `./8-TEXT/minesweeper-window.md` |
| `secret_window_title` | SecretOverlay | TC-008 | `./8-TEXT/secret-overlay.md` |
| `secret_headline` | SecretOverlay | TC-008 | `./8-TEXT/secret-overlay.md` |
| `secret_body` | SecretOverlay | TC-008 | `./8-TEXT/secret-overlay.md` |
| `secret_dismiss_button_label` | SecretOverlay | TC-008 | `./8-TEXT/secret-overlay.md` |

## GLOSSARY

| GL-ID | Term | Definition |
|---|---|---|
| GL-001 | Program Manager | The main shell window that groups app launchers and anchors the desktop experience. |
| GL-002 | Desktop | The room-like background surface users return to after closing windows. |
| GL-003 | Accessories | The launcher group that contains Notepad, Paint, and Calculator. |
| GL-004 | Games | The launcher group reserved for Minesweeper. |
| GL-005 | Flag Mode | The Minesweeper interaction mode that makes tap or keyboard activation place and remove flags instead of revealing cells. |
| GL-006 | Secret Overlay | The temporary after-hours reward window that appears after the hidden Program Manager trigger. |
| GL-007 | Close | The shared window action that dismisses the current window and returns focus to the shell or remaining app window. |
| GL-008 | Boot Sequence | The short startup ritual shown before the desktop phase begins. |
| GL-009 | Paintbrush | The historically legible window title used for the drawing app while the launcher label stays the shorter word Paint. |

## PHRASEBOOK

| Category | Correct Phrasing | Incorrect Phrasing | Notes |
|---|---|---|---|
| Historical shell naming | Program Manager | Dashboard / Home | Preserve the Windows 3.1 frame of reference. |
| Shell actions | Open / Close | Enter / Exit out | Use app-window language, not web-page language. |
| Touch guidance | Tap once on touch screens | Single-click on mobile | Reserve click and double-click wording for pointer contexts. |
| Minesweeper controls | Flag Mode | Mark Mode | Match the approved DI key and familiar game language. |
| Secret tone | You found the after-hours room. | Congrats!!! You unlocked a crazy secret!!! | Keep delight gentle and in-world. |
| App naming | Paint launcher, Paintbrush window | MS Paint | Avoid later-era branding that breaks period clarity. |
| Accessibility labels | Calculator display / Mine counter | Decorative or whimsical aria labels | Assistive names should be functional and literal. |

## EXIT GATE CHECK

- [x] `8-TEXT-CONTENT.md` contains a GLOSSARY table and a PHRASEBOOK table.
- [x] Every text-bearing DI has a corresponding TC record.
- [x] Every TC record has a FILE path that exists in `./8-TEXT/`.
- [x] Every TC record includes TRACEABILITY to at least one DI-ID.
- [x] Every Appendix A writer-owned key is represented in `./8-TEXT/` and mapped above.
- [x] Glossary entries and phrasebook guidance are internally consistent.
- [x] `8-TEXT-CONTENT.md` is set to PASS with today's date.
- [x] `bash .github/skills/manager-pipeline-orchestration/automation/stage-precheck.sh PROJECTS/Windows31 8` passed before writing, and `bash .github/skills/manager-pipeline-orchestration/automation/stage-postcheck.sh PROJECTS/Windows31 8 8-TEXT-CONTENT.md` passed after writing.

GATE 8: PASS
