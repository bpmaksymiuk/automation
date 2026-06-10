#!/usr/bin/env bash
# verify-traceability.sh <project-root>
#
# Checks end-to-end traceability across pipeline artifacts:
#   UC (Stage 2) → Requirements (Stage 5)
#   UC (Stage 2) → Design Instructions (Stage 7)
#   UC (Stage 2) → Test Cases (Stage 11)
#   DI (Stage 7) → Release Notes (Stage 10)
#
# Reports all gaps and exits 1 if any are found.
# Skips checks for artifacts that don't exist yet (safe to run at any stage).

set -euo pipefail

PROJECT="${1:?Usage: verify-traceability.sh <project-root>}"

if [[ ! -d "$PROJECT" ]]; then
  echo "ERROR: Project directory not found: $PROJECT" >&2
  exit 1
fi

cd "$PROJECT"

FAIL=0
WARNINGS=0

# Colour codes (safe fallback if not a tty)
RED=""; GREEN=""; YELLOW=""; RESET=""
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RESET='\033[0m'
fi

pass()    { echo -e "  ${GREEN}OK${RESET}  : $1"; }
gap()     { echo -e "  ${RED}GAP${RESET} : $1"; FAIL=1; }
warn()    { echo -e "  ${YELLOW}WARN${RESET}: $1"; WARNINGS=$((WARNINGS+1)); }
skipped() { echo -e "       SKIP: $1 (artifact not present yet)"; }

# ── Guard: 2-USE-CASES.md is mandatory ────────────────────────────────────────
if [[ ! -f "2-USE-CASES.md" ]]; then
  echo "ABORT: 2-USE-CASES.md not found — cannot check traceability."
  exit 1
fi

# ── Extract UC-IDs ─────────────────────────────────────────────────────────────
mapfile -t UC_IDS < <(grep -oP 'UC-\d+' 2-USE-CASES.md | sort -u)

if [[ ${#UC_IDS[@]} -eq 0 ]]; then
  echo "ABORT: No UC-IDs found in 2-USE-CASES.md."
  exit 1
fi

echo ""
echo "Project : $PROJECT"
echo "UC-IDs  : ${UC_IDS[*]}"
echo ""

# ── 1. UC → Requirements (Stage 5) ────────────────────────────────────────────
echo "=== Stage 2 → Stage 5 : UC coverage in 5-REQUIREMENTS.md ==="
if [[ ! -f "5-REQUIREMENTS.md" ]]; then
  skipped "5-REQUIREMENTS.md"
else
  for uc in "${UC_IDS[@]}"; do
    if grep -q "$uc" 5-REQUIREMENTS.md; then
      pass "$uc referenced in 5-REQUIREMENTS.md"
    else
      gap "$uc has no requirement in 5-REQUIREMENTS.md"
    fi
  done
fi
echo ""

# ── 2. UC → Architecture (Stage 6) ────────────────────────────────────────────
echo "=== Stage 2 → Stage 6 : UC coverage in 6-ARCHITECTURE-RECOMMENDATIONS.md ==="
if [[ ! -f "6-ARCHITECTURE-RECOMMENDATIONS.md" ]]; then
  skipped "6-ARCHITECTURE-RECOMMENDATIONS.md"
else
  for uc in "${UC_IDS[@]}"; do
    if grep -q "$uc" 6-ARCHITECTURE-RECOMMENDATIONS.md; then
      pass "$uc referenced in 6-ARCHITECTURE-RECOMMENDATIONS.md"
    else
      warn "$uc not directly referenced in 6-ARCHITECTURE-RECOMMENDATIONS.md (may be addressed via BR)"
    fi
  done
fi
echo ""

# ── 3. UC → Design Instructions (Stage 7) ────────────────────────────────────
echo "=== Stage 2 → Stage 7 : UC coverage in 7-DESIGN-INSTRUCTIONS.md ==="
if [[ ! -f "7-DESIGN-INSTRUCTIONS.md" ]]; then
  skipped "7-DESIGN-INSTRUCTIONS.md"
else
  for uc in "${UC_IDS[@]}"; do
    if grep -q "$uc" 7-DESIGN-INSTRUCTIONS.md; then
      pass "$uc referenced in 7-DESIGN-INSTRUCTIONS.md"
    else
      gap "$uc has no design instruction in 7-DESIGN-INSTRUCTIONS.md"
    fi
  done
fi
echo ""

# ── 4. DI → Release Notes (Stage 10) ──────────────────────────────────────────
echo "=== Stage 7 → Stage 10 : DI coverage in 10-RELEASE-NOTES.md ==="
if [[ ! -f "7-DESIGN-INSTRUCTIONS.md" ]]; then
  skipped "7-DESIGN-INSTRUCTIONS.md (no DI-IDs to check)"
elif [[ ! -f "10-RELEASE-NOTES.md" ]]; then
  skipped "10-RELEASE-NOTES.md"
else
  mapfile -t DI_IDS < <(grep -oP 'DI-\d+' 7-DESIGN-INSTRUCTIONS.md | sort -u)
  if [[ ${#DI_IDS[@]} -eq 0 ]]; then
    warn "No DI-IDs found in 7-DESIGN-INSTRUCTIONS.md"
  else
    for di in "${DI_IDS[@]}"; do
      if grep -q "$di" 10-RELEASE-NOTES.md; then
        pass "$di referenced in 10-RELEASE-NOTES.md"
      else
        gap "$di not referenced in 10-RELEASE-NOTES.md — may be unimplemented or undocumented"
      fi
    done
  fi
fi
echo ""

# ── 5. UC → Test Cases (Stage 11) ────────────────────────────────────────────
echo "=== Stage 2 → Stage 11 : UC coverage in 11-TEST-CASES.md ==="
if [[ ! -f "11-TEST-CASES.md" ]]; then
  skipped "11-TEST-CASES.md"
else
  for uc in "${UC_IDS[@]}"; do
    if grep -q "$uc" 11-TEST-CASES.md; then
      pass "$uc referenced in 11-TEST-CASES.md"
    else
      gap "$uc has no test case in 11-TEST-CASES.md"
    fi
  done
fi
echo ""

# ── 6. UC → Test Report (Stage 11) ───────────────────────────────────────────
echo "=== Stage 2 → Stage 11 : UC coverage in 11-TEST-REPORT.md ==="
if [[ ! -f "11-TEST-REPORT.md" ]]; then
  skipped "11-TEST-REPORT.md"
else
  for uc in "${UC_IDS[@]}"; do
    if grep -q "$uc" 11-TEST-REPORT.md; then
      pass "$uc referenced in 11-TEST-REPORT.md"
    else
      gap "$uc has no test evidence in 11-TEST-REPORT.md"
    fi
  done
fi
echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
if [[ $FAIL -eq 0 && $WARNINGS -eq 0 ]]; then
  echo -e "${GREEN}RESULT: PASS — No traceability gaps found.${RESET}"
elif [[ $FAIL -eq 0 ]]; then
  echo -e "${YELLOW}RESULT: PASS with warnings — No hard gaps, but $WARNINGS warning(s) to review.${RESET}"
else
  echo -e "${RED}RESULT: FAIL — Traceability gaps detected. See GAP entries above.${RESET}"
fi

exit $FAIL
