# Requirements — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Business Analyst
- **SOURCE:** 2-USE-CASES.md, 3-NARRATIVE-VISION.md, 4-CONCEPT-STORYBOARD.md

---

## UC-001 : Start the retro desktop

> Sources:
> - https://en.wikipedia.org/wiki/Windows_3.1
> - http://toastytech.com/guis/win31.html

## BR-001 : Boot sequence before desktop
- **TESTABLE CONDITION:** On first load, the visitor sees a boot sequence before the desktop shell appears.
- The system shall display a boot sequence before the desktop shell is shown.
- **NOTES:** The sequence may be skippable, but the entry ritual must exist.
- **RELATED:** UC-001

## BR-002 : Skip boot sequence
- **TESTABLE CONDITION:** From the initial screen, the visitor can skip the boot sequence and reach the desktop shell.
- The system shall allow the visitor to skip the boot sequence from the initial screen.
- **NOTES:** Skipping must not require any external setup.
- **RELATED:** UC-001

## BR-003 : Show the main shell
- **TESTABLE CONDITION:** After boot completes or is skipped, the visitor lands on the main desktop shell.
- The system shall show the main desktop shell after the boot sequence completes or is skipped.
- **NOTES:** The shell may be Program Manager-style or an equivalent retro desktop surface.
- **RELATED:** UC-001

## UC-002 : Open and close classic apps

> Sources:
> - https://en.wikipedia.org/wiki/Windows_3.1
> - http://toastytech.com/guis/win31.html

## BR-004 : Visible app entry points
- **TESTABLE CONDITION:** Each bundled app can be opened from a visible desktop entry point.
- The system shall expose each bundled app from a visible desktop entry point.
- **NOTES:** Bundled apps include Notepad, Paint, Calculator, and Minesweeper.
- **RELATED:** UC-002

## BR-005 : Return to desktop on close
- **TESTABLE CONDITION:** Closing a bundled app returns the visitor to the desktop shell.
- The system shall allow each bundled app window to be closed and return the visitor to the desktop shell.
- **NOTES:** Closing an app must not leave the shell unusable.
- **RELATED:** UC-002

## UC-003 : Use Notepad for plain text

> Sources:
> - https://en.wikipedia.org/wiki/Windows_Notepad
> - https://en.wikipedia.org/wiki/Windows_3.1

## BR-006 : Plain text keyboard input
- **TESTABLE CONDITION:** The visitor can type plain text into Notepad using the keyboard.
- Notepad shall accept plain text input from the keyboard.
- **NOTES:** The editor is limited to plain text, not rich text formatting.
- **RELATED:** UC-003

## BR-007 : Select and replace text
- **TESTABLE CONDITION:** The visitor can select existing text in Notepad and replace it with new text.
- Notepad shall support selecting text and replacing it with new input within the same window.
- **NOTES:** This requirement covers the basic edit-and-overwrite flow.
- **RELATED:** UC-003

## BR-008 : Clear Notepad content
- **TESTABLE CONDITION:** The visitor can clear the current Notepad content without leaving the app.
- Notepad shall allow the current text content to be cleared in the same window.
- **NOTES:** Clearing content must not require closing and reopening the editor.
- **RELATED:** UC-003

## UC-004 : Draw with Paint

> Sources:
> - https://en.wikipedia.org/wiki/Windows_3.1
> - https://w3.org/TR/WCAG22#keyboard

## BR-009 : Canvas drawing input
- **TESTABLE CONDITION:** The visitor can draw on the Paint canvas with pointer or touch input.
- Paint shall accept direct drawing input on its canvas.
- **NOTES:** Path-dependent drawing is expected to remain freeform.
- **RELATED:** UC-004

## BR-010 : Alternate tool or color
- **TESTABLE CONDITION:** The visitor can switch to at least one different tool or color and immediately see the result in Paint.
- Paint shall let the visitor switch to at least one alternate tool or color and immediately see the result.
- **NOTES:** The interaction may be simple, but it must feel like a real drawing program.
- **RELATED:** UC-004

## UC-005 : Solve or play Minesweeper

> Sources:
> - https://en.wikipedia.org/wiki/Minesweeper_(video_game)
> - https://en.wikipedia.org/wiki/Windows_3.1

## BR-011 : Playable hidden-tile board
- **TESTABLE CONDITION:** Minesweeper shows a playable board with hidden tiles and a visible mine-status display.
- Minesweeper shall present a playable board with hidden tiles and a mine-status display.
- **NOTES:** The status display may be a counter, icon, or equivalent indicator.
- **RELATED:** UC-005

## BR-012 : Flag and restart Minesweeper
- **TESTABLE CONDITION:** The visitor can mark suspected mines and restart after a completed board or a loss.
- Minesweeper shall allow the visitor to mark suspected mines and restart after a completed board or loss.
- **NOTES:** The recognizable puzzle loop is part of the requirement.
- **RELATED:** UC-005

## UC-006 : Explore hidden details

> Sources:
> - https://en.wikipedia.org/wiki/Windows_3.1
> - http://toastytech.com/guis/win31.html

## BR-013 : Hidden interaction exists
- **TESTABLE CONDITION:** There is at least one interaction that is not obvious from the first screen and can be discovered by the visitor.
- The system shall include at least one hidden interaction that is not obvious from the first screen.
- **NOTES:** The hidden interaction may be a special icon path, key sequence, or equivalent discovery path.
- **RELATED:** UC-006

## BR-014 : Visible secret response
- **TESTABLE CONDITION:** Triggering the hidden interaction produces a distinct visible response and then returns the visitor to the normal shell flow.
- The hidden interaction shall produce a distinct visible response and return the visitor to the normal shell flow.
- **NOTES:** The secret behavior must remain optional and must not block core usage.
- **RELATED:** UC-006

## UC-007 : Use the desktop on mobile

> Sources:
> - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
> - https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
> - https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html

## BR-015 : Mobile readability and operation
- **TESTABLE CONDITION:** On a mobile viewport, the interface remains readable and usable.
- The system shall remain readable and operable at mobile viewport sizes.
- **NOTES:** This requirement covers the shell, windows, and labels that appear on small screens.
- **RELATED:** UC-007

## BR-016 : Mouse-free primary actions
- **TESTABLE CONDITION:** The visitor can perform primary shell actions without using a mouse.
- The system shall allow the visitor to perform primary shell actions without a mouse.
- **NOTES:** Keyboard and touch access both satisfy this requirement.
- **RELATED:** UC-007

## BR-017 : No primary horizontal scrolling
- **TESTABLE CONDITION:** On a small screen, the visitor can use the shell without horizontal scrolling as the primary navigation mode.
- The system shall avoid requiring horizontal scrolling as the primary way to use the shell on a small screen.
- **NOTES:** Horizontal scrolling may appear in excepted content, but not as the default shell experience.
- **RELATED:** UC-007

GATE 5: PASS
