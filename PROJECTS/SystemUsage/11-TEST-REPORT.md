# Stage 11 Test Report — The Boiler Room

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-06-14
- **Run ID:** T-PIPELINE-SystemUsage-001
- **Author:** Tester
- **Build Under Test:** `10-BUILD/` (index.html + agent.py)
- **Execution Environment:** Visible (headed) Chromium 133 via Playwright 1.50.0 on Linux; live metrics agent on `http://127.0.0.1:8079` (24-core CPU, NVIDIA RTX 2070 SUPER, 2+ filesystems).
- **Specs:** `11-TESTS/specs/boiler.spec.mjs` · **Config:** `11-TESTS/playwright.config.mjs` · **Machine report:** `11-TESTS/results/full/report.json`
- **Current UC Status:** PASS
- **Current BR Status:** PASS

## Summary

All 16 test cases executed in a visible browser against the live agent and passed (16 passed, 0 failed, run time ~22s). Every acceptance criterion of UC-001..UC-013 and every business requirement (BR-001..BR-039 plus the three non-functional baselines) is exercised with captured screenshot evidence. The suite was updated for the Verdigris redesign (paired red/blue furnace flames, twin proportional RAM/VRAM boilers, steam-pipe network, green/amber theme). No defects were found; see `11-BUG-REPORT.md`.

## Results

| T-ID | Description | Result | Evidence |
|---|---|---|---|
| T-001 | All resources on one live page | **PASS** | `11-TESTS/results/full/screenshots/T-001.png` |
| T-002 | Real-time updates + connection indicator | **PASS** | `11-TESTS/results/full/screenshots/T-002.png` |
| T-003 | CPU furnace flame (red) | **PASS** | `11-TESTS/results/full/screenshots/T-003.png` |
| T-004 | GPU furnace flame (blue) + unavailable state | **PASS** | `11-TESTS/results/full/screenshots/T-004.png`, `T-004b.png` |
| T-005 | RAM and VRAM twin boilers | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| T-006 | Disk pressure tanks + I/O | **PASS** | `11-TESTS/results/full/screenshots/T-006.png` |
| T-007 | Network steam pipe + rolling chart | **PASS** | `11-TESTS/results/full/screenshots/T-007.png` |
| T-008 | Top process tables | **PASS** | `11-TESTS/results/full/screenshots/T-008.png` |
| T-009 | Set custom alert thresholds | **PASS** | `11-TESTS/results/full/screenshots/T-009.png` |
| T-010 | Alarm on threshold crossing | **PASS** | `11-TESTS/results/full/screenshots/T-010.png`, `T-010b.png` |
| T-011 | Mobile responsive reflow | **PASS** | `11-TESTS/results/full/screenshots/T-011.png` |
| T-012 | Tooltip detail on demand | **PASS** | `11-TESTS/results/full/screenshots/T-012.png` |
| T-013 | Reduce motion | **PASS** | `11-TESTS/results/full/screenshots/T-013.png` |
| T-014 | Security baseline | **PASS** | `11-TESTS/results/full/screenshots/T-014.png` |
| T-015 | Performance baseline | **PASS** | `11-TESTS/results/full/screenshots/T-015.png` |
| T-016 | Accessibility baseline | **PASS** | `11-TESTS/results/full/screenshots/T-016.png` |

## Business Requirement Coverage

| BR-ID | Covering Test(s) | Result | Evidence |
|---|---|---|---|
| BR-001 | T-001 | **PASS** | `11-TESTS/results/full/screenshots/T-001.png` |
| BR-002 | T-002 | **PASS** | `11-TESTS/results/full/screenshots/T-002.png` |
| BR-003 | T-002 | **PASS** | `11-TESTS/results/full/screenshots/T-002.png` |
| BR-004 | T-002 | **PASS** | `11-TESTS/results/full/screenshots/T-002.png` |
| BR-005 | T-001, T-002 | **PASS** | `11-TESTS/results/full/screenshots/T-001.png` |
| BR-006 | T-003 | **PASS** | `11-TESTS/results/full/screenshots/T-003.png` |
| BR-007 | T-003 | **PASS** | `11-TESTS/results/full/screenshots/T-003.png` |
| BR-008 | T-003 | **PASS** | `11-TESTS/results/full/screenshots/T-003.png` |
| BR-009 | T-004 | **PASS** | `11-TESTS/results/full/screenshots/T-004.png` |
| BR-010 | T-005 | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| BR-011 | T-004 | **PASS** | `11-TESTS/results/full/screenshots/T-004b.png` |
| BR-012 | T-005 | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| BR-013 | T-005 | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| BR-014 | T-005 | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| BR-015 | T-006 | **PASS** | `11-TESTS/results/full/screenshots/T-006.png` |
| BR-016 | T-006 | **PASS** | `11-TESTS/results/full/screenshots/T-006.png` |
| BR-017 | T-006 | **PASS** | `11-TESTS/results/full/screenshots/T-006.png` |
| BR-018 | T-007 | **PASS** | `11-TESTS/results/full/screenshots/T-007.png` |
| BR-019 | T-007 | **PASS** | `11-TESTS/results/full/screenshots/T-007.png` |
| BR-020 | T-007 | **PASS** | `11-TESTS/results/full/screenshots/T-007.png` |
| BR-021 | T-008 | **PASS** | `11-TESTS/results/full/screenshots/T-008.png` |
| BR-022 | T-008 | **PASS** | `11-TESTS/results/full/screenshots/T-008.png` |
| BR-023 | T-008 | **PASS** | `11-TESTS/results/full/screenshots/T-008.png` |
| BR-024 | T-008 | **PASS** | `11-TESTS/results/full/screenshots/T-008.png` |
| BR-025 | T-009 | **PASS** | `11-TESTS/results/full/screenshots/T-009.png` |
| BR-026 | T-009 | **PASS** | `11-TESTS/results/full/screenshots/T-009.png` |
| BR-027 | T-009 | **PASS** | `11-TESTS/results/full/screenshots/T-009.png` |
| BR-028 | T-010 | **PASS** | `11-TESTS/results/full/screenshots/T-010.png` |
| BR-029 | T-010 | **PASS** | `11-TESTS/results/full/screenshots/T-010.png` |
| BR-030 | T-010 | **PASS** | `11-TESTS/results/full/screenshots/T-010.png` |
| BR-031 | T-010 | **PASS** | `11-TESTS/results/full/screenshots/T-010b.png` |
| BR-032 | T-011 | **PASS** | `11-TESTS/results/full/screenshots/T-011.png` |
| BR-033 | T-009, T-011 | **PASS** | `11-TESTS/results/full/screenshots/T-011.png` |
| BR-034 | T-012 | **PASS** | `11-TESTS/results/full/screenshots/T-012.png` |
| BR-035 | T-013 | **PASS** | `11-TESTS/results/full/screenshots/T-013.png` |
| BR-036 | T-013 | **PASS** | `11-TESTS/results/full/screenshots/T-013.png` |
| BR-037 | T-005 | **PASS** | `11-TESTS/results/full/screenshots/T-005.png` |
| BR-038 | T-006, T-007 | **PASS** | `11-TESTS/results/full/screenshots/T-006.png`, `T-007.png` |
| BR-039 | T-001 | **PASS** | `11-TESTS/results/full/screenshots/T-001.png` |
| BR-NF-ACCESSIBILITY | T-016 | **PASS** | `11-TESTS/results/full/screenshots/T-016.png` |
| BR-NF-PERFORMANCE | T-015 | **PASS** | `11-TESTS/results/full/screenshots/T-015.png` |
| BR-NF-SECURITY | T-014 | **PASS** | `11-TESTS/results/full/screenshots/T-014.png` |

## Recommendation

**PASS** — The Boiler Room build satisfies every use-case acceptance criterion and every business requirement with reproducible, screenshot-backed evidence in a visible browser. Recommended to proceed to Stage 12 (Deployment).

**GATE 11:** PASS
