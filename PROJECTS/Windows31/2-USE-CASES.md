# Use Cases — Windows 3.1 Web Desktop

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Product Owner
- **APPROVED:** 2026-06-10

---

## UC-001 : Visitor - Start the retro desktop

- GOAL: The visitor wants to enter the Windows 3.1-inspired desktop and understand the shell immediately.
- STEPS:
  1. Open the website.
  2. Wait for or skip the boot sequence.
  3. Arrive at the main desktop or Program Manager-style shell.
- ACCEPTANCE CRITERIA:
  - AC1: The entry sequence reaches the main desktop without requiring any external setup.
  - AC2: The user can skip the boot sequence and reach the desktop from the initial screen.
- NOTES: The initial experience should establish the retro tone without blocking access to the shell.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-002 : Visitor - Open and close classic apps

- GOAL: The visitor wants to launch and dismiss bundled apps from the desktop shell.
- STEPS:
  1. Click or double-click an app icon.
  2. Interact with the opened window.
  3. Close the window and return to the desktop.
- ACCEPTANCE CRITERIA:
  - AC1: Each bundled app opens from a visible desktop entry point.
  - AC2: Each app can be closed without leaving the desktop unusable.
- NOTES: This use case covers the primary desktop loop for Notepad, Paint, Calculator, and Minesweeper.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-003 : Visitor - Use Notepad for plain text

- GOAL: The visitor wants to type and edit plain text in a simple retro text editor.
- STEPS:
  1. Open Notepad.
  2. Type text into the editor.
  3. Edit or replace text and keep working in the same window.
- ACCEPTANCE CRITERIA:
  - AC1: The editor accepts plain text input from the keyboard.
  - AC2: The editor supports basic editing actions such as selecting, typing, and clearing text.
- NOTES: The experience should feel lightweight and immediate rather than like a full word processor.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-004 : Visitor - Draw with Paint

- GOAL: The visitor wants to make a simple drawing in a retro paint app.
- STEPS:
  1. Open Paint.
  2. Draw with pointer or touch input.
  3. Modify the drawing with basic tools and colors.
- ACCEPTANCE CRITERIA:
  - AC1: The canvas accepts direct drawing input.
  - AC2: The user can choose at least one alternate color or tool and see the result immediately.
- NOTES: The app should evoke the original feel of a small, playful drawing program.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-005 : Visitor - Solve or play Minesweeper

- GOAL: The visitor wants to start a Minesweeper game and use the familiar tile logic.
- STEPS:
  1. Open Minesweeper.
  2. Reveal tiles and place or remove flags.
  3. Finish or restart a board.
- ACCEPTANCE CRITERIA:
  - AC1: The game presents a board with hidden tiles and a mine counter or equivalent status display.
  - AC2: The user can mark suspected mines and restart after a win or loss.
- NOTES: The game should preserve the classic one-click-to-begin flow and the recognizable puzzle loop.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-006 : Visitor - Explore the desktop for hidden details

- GOAL: The visitor wants to discover extras such as secret icons, screen saver behavior, or an easter egg.
- STEPS:
  1. Browse the desktop and related folders.
  2. Trigger a hidden interaction through a special click path or key sequence.
  3. Observe the secret response and return to the shell.
- ACCEPTANCE CRITERIA:
  - AC1: At least one hidden interaction exists that is not immediately obvious from the first screen.
  - AC2: The hidden interaction produces a distinct, visible response and then returns the user to the normal shell flow.
- NOTES: The easter egg should feel delightful but optional; it must not block core usage.
- RELATED: 0-IDEA, 1-BRAINSTORM

## UC-007 : Visitor - Use the desktop on mobile

- GOAL: The visitor wants the retro desktop to remain usable on a touch device.
- STEPS:
  1. Open the site on a small screen.
  2. Launch apps and interact with windows using touch-friendly controls.
  3. Continue using the shell without horizontal scrolling as the primary mode.
- ACCEPTANCE CRITERIA:
  - AC1: The interface remains readable and operable at mobile viewport sizes.
  - AC2: Primary actions can be performed without requiring a mouse.
- NOTES: The desktop may adapt its controls for touch, but it should keep the Windows 3.1 look and feel.
- RELATED: 0-IDEA, 1-BRAINSTORM

Approved: 2026-06-10
GATE 2: PASS
