---
description: "Default non-functional baseline for Stage 5 requirements."
applyTo: "PROJECTS/**/5-REQUIREMENTS.md"
---

# Non-Functional Baseline (Simple Mode)

## Always Add (unless PO explicitly waives)
1. Accessibility: keyboard usage, labels, readable contrast.
2. Performance: reasonable load and interaction targets.
3. Security: no secrets in client files, validate inputs, no unsafe injection.

## Stage 5 Rule
If a baseline item applies, write a BR for it.
If it does not apply, write a short exclusion note with reason.

## Stage 10 Rule
Developer must check no secrets are exposed.

## Stage 11 Rule
Tester must verify baseline BRs with evidence.
