# Concept Storyboard — BrowserController

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10
- **AUTHOR:** Graphic Artist

---

## CB-001 : Screen Flow Diagram

- **SUMMARY:** High-level user journey mapping the two operating modes (Recording and Running) and the flow between screens.
- **FILE:** `./4-CONCEPT/screen-flow-diagram.svg`
- **FORMAT:** SVG with labeled screens, decision points, and transitions
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **SCREENS COVERED:** Main Menu, Recording Mode, Script Generated, Save Workflow, Running Mode, Failure Recovery, Results Dashboard, Export/Schedule
- **STYLE NOTES:** Dark background (#0d1117) with colour-coded paths: green for recording flow, blue for running flow, red for failure recovery. Clear decision diamond for "Record or Run?" and "Selector Found?" branches. Arrows show user progression through both modes.
- **TRACEABILITY:** UC-001 (recording), UC-002 (running), UC-004 (failure recovery), UC-005 (non-technical access), UC-006 (monitoring), UC-007 (integration testing)
- **RELATED:** CB-002, CB-003, CB-004, CB-005

---

## CB-002 : Recording Mode Interface

- **SUMMARY:** Interactive browser recording experience showing the user navigating a website while the tool captures and validates each step in real-time.
- **FILE:** `./4-CONCEPT/recording-mode.svg`
- **FORMAT:** SVG wireframe with two-pane layout
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **SCREENS COVERED:** Recording Mode, Live Browser Preview, Step Capture List, Action Buttons (Done/Cancel)
- **STYLE NOTES:** Left pane shows live browser preview with highlighted actionable elements. Right pane shows a chronological list of recorded steps, each with a coloured circle indicator (green for completed, yellow for next pending action). Step details include selector and timing information. Action buttons are large and accessible (green for "Done", orange for "Cancel").
- **TRACEABILITY:** UC-001 (recording workflow), UC-005 (non-technical user access)
- **RELATED:** CB-001, CB-003

---

## CB-003 : Running Mode with Real-Time Execution

- **SUMMARY:** Script execution view showing live progress on the left with execution log and statistics, and the active browser window on the right with extracted data highlighted.
- **FILE:** `./4-CONCEPT/running-mode.svg`
- **FORMAT:** SVG wireframe with two-pane execution dashboard
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **SCREENS COVERED:** Running Mode, Execution Log, Progress Indicator, Run Statistics, Live Browser View, Extracted Data Highlight
- **STYLE NOTES:** Left pane is a monospace execution log in dark theme with checkmarks for successful steps (green), warnings for recovered steps (orange), and arrows for attempts. Right pane shows the live browser rendering the page with extracted data highlighted in a dashed yellow box. Progress bar shows percentage completion. Statistics box displays duration, action count, recovery count, and current status.
- **TRACEABILITY:** UC-002 (running scripts), UC-006 (monitoring workflows), UC-007 (integration testing)
- **RELATED:** CB-001, CB-004, CB-005

---

## CB-004 : Failure Recovery & Intelligent Selector Correction

- **SUMMARY:** Diagnostic view showing the failure, all selector recovery attempts (CSS, XPath, role-based), the successful alternative found, and the script correction applied.
- **FILE:** `./4-CONCEPT/failure-recovery.svg`
- **FORMAT:** SVG wireframe with recovery diagnostics and page inspector
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **SCREENS COVERED:** Recovery Attempts, Failed Selector, Fallback Strategies, Success Indicator, Script Correction Detail, Page Inspector, Selector Recommendations
- **STYLE NOTES:** Left side shows a stack of selector attempts: original in red, failed alternatives in orange/grey, and the successful strategy in green. Each attempt is annotated with status and reason. Right side shows a simplified page inspector with the matching element highlighted and HTML structure visible. User can accept the correction, review manually, or provide a custom selector.
- **TRACEABILITY:** UC-004 (smart failure recovery), UC-002 (running reliability)
- **RELATED:** CB-001, CB-003, CB-005

---

## CB-005 : Results Dashboard & Data Export

- **SUMMARY:** Comprehensive results view displaying the run summary, extracted data in a sortable table with inline screenshots, and export/action buttons for further analysis.
- **FILE:** `./4-CONCEPT/results-dashboard.svg`
- **FORMAT:** SVG wireframe with summary cards and data table
- **SOURCING:** original
- **ATTRIBUTION:** N/A
- **SCREENS COVERED:** Run Summary (status, duration, actions, recoveries, data extracted), Extracted Data Table, Action Buttons (Export, View Logs, View Script)
- **STYLE NOTES:** Summary section at top with status badge (green checkmark for PASS), key metrics in separate boxes (duration, step count, recovery count, item count). Table below displays all extracted records with columns for item number, title, summary, and screenshot thumbnail. Rows are easily scannable. Action buttons at bottom provide quick access to export data, review logs, or inspect the script that was executed.
- **TRACEABILITY:** UC-002 (running), UC-003 (scraping), UC-006 (monitoring), UC-007 (integration testing)
- **RELATED:** CB-001, CB-003

---

## Exit Gate

- [x] `4-CONCEPT-STORYBOARD.md` contains five CB records covering all major flows
- [x] `./4-CONCEPT/screen-flow-diagram.svg` exists and is documented by CB-001
- [x] All CB records follow the schema (SUMMARY, FILE, FORMAT, SOURCING, ATTRIBUTION, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED)
- [x] All CB FILE paths exist and contain meaningful visual structure (5 SVG files created)
- [x] Internet-sourced assets would include ATTRIBUTION; all current assets are original (N/A)
- [x] Original assets documented with design rationale and style notes
- [x] All CB files are legible and non-empty
- [x] TRACEABILITY field references valid UC-IDs (UC-001 through UC-007)
- [x] SVG files use dark background (#0d1117) with clear labeling and muted colours for exploration
- [x] STATUS field set to PASS and STATUS UPDATED set to 2026-06-10

---

GATE 4: PASS
