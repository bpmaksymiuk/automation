# BrowserController — A Script-Based Browser Automation Tool

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-10

## Core Idea

A script-based browser automation tool that eliminates boilerplate and makes automation accessible through two complementary modes: **Recording** and **Running**. Users record workflows by navigating step-by-step through a browser, and the tool validates each action and generates a reusable, human-readable script. Scripts can then be run repeatedly against any website, with built-in intelligence to recover from failures by trying alternative selector strategies and correcting the script automatically.

The solution will be packaged as a reusable **SKILL.md** file that can be invoked by other projects in the pipeline, enabling any stage or agent to leverage browser automation capabilities without writing code.

## Two Operating Modes

### Mode 1: Recording
Users navigate through a website step-by-step in an interactive browser. The tool:
- Observes each action (click, fill, navigate, wait)
- Validates the action succeeded (element found, page loaded)
- Captures selectors, extracted data, and timing
- Generates a human-readable script as the user navigates
- Returns the script for storage and future runs

### Mode 2: Running
Execute a previously recorded script:
- Play back all recorded actions in sequence
- Capture results and screenshots
- **On failure:** Automatically try alternative selector strategies (CSS → XPath → role-based → fuzzy matching)
- **On recovery:** Correct the script with the working selector so future runs succeed
- Return extracted data and pass/fail status

## Key Capabilities

- **Recording:** Step-by-step interactive recording that generates validated automation scripts.
- **Running:** Reliable script execution with automatic failure recovery and self-correction.
- **Smart Failure Handling:** Try multiple selector strategies; update script when a new strategy works.
- **Selector Resilience:** Fallback from CSS to XPath to role-based queries to fuzzy matching.
- **Human-Readable Scripts:** Output scripts that users can read, edit, and version-control.
- **Configuration:** Support headless mode, custom user agents, and viewport settings.
- **Data Extraction:** Capture text, attributes, and structured data from pages during recording or running.
- **Simplicity:** No API, no coding—just navigate and run.

## Recording & Script Format Example

### Step 1: Recording Mode (Interactive)
User starts recording and manually navigates:
```
$ browsercontroller record
✓ Opened https://www.google.com
→ Click on search box (detected: input[name='q'])
✓ Clicked input[name='q']
→ Type "ukraine"
✓ Typed: "ukraine"
→ Press Enter
✓ Pressed Enter
→ Wait for page load
✓ Page loaded
→ Click on first news link (detected: a.newsLink:nth-child(1))
✓ Clicked first news link
→ Extract text from h3.headline
✓ Extracted: "Ukraine receives advanced weapons systems"
→ Extract text from div.summary
✓ Extracted: "NATO partners announce new military aid package..."
→ Back to search results
✓ Navigated back
→ Recording complete. Script generated.
```

### Step 2: Generated Script (Human-Readable)
```
# Browser automation script for: Ukraine news search
# Generated: 2026-06-10T14:32:00Z

open https://www.google.com
click selector "input[name='q']"
type "ukraine"
press Enter
wait 3000
click selector "a.newsLink:nth-child(1)"
extract text "h3.headline" as title
extract text "div.summary" as summary
log title summary
navigate back
```

### Step 3: Running Mode (Reliable Execution)
```
$ browsercontroller run ukraine-news-search.script
✓ Opened https://www.google.com
✓ Clicked search box
✓ Typed "ukraine"
✓ Pressed Enter
✓ Page loaded
✗ Failed to find selector "a.newsLink:nth-child(1)"
  → Trying alternative: "a[role='button']:nth-child(1)"... ✓ Found
  → Trying alternative: "a:contains('News')... ✓ Found and clicked
✓ Extracted title: "Ukraine receives advanced weapons systems"
✓ Extracted summary: "NATO partners announce..."
✓ Script corrected: a.newsLink:nth-child(1) → a[role='button']:nth-child(1)
✓ Run complete. All results captured.
```

The tool learns from failures and corrects the script so future runs succeed reliably.

## Target Use Cases

- **Automated Testing & QA:** Record test workflows interactively, store scripts, run them repeatedly with auto-correcting failure recovery.
- **Web Scraping:** Record a scraping workflow once (navigate, extract), run it daily against updated pages; script auto-corrects when page structure changes.
- **Monitoring & Periodic Tasks:** Record a login + data check workflow, run it hourly; if selectors break, the tool fixes them automatically.
- **Integration & Smoke Tests:** Record end-to-end workflows (checkout, form submission, etc.), run in CI/CD with intelligent failure handling.
- **Non-Technical User Automation:** QA and product managers can record workflows without writing code; scripts are human-readable and shareable.

GATE 1: PASS