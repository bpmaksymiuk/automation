# Harden Pipeline Controls For Weaker Models

Use this prompt when you want concrete simplification and deterministic guardrails.

---

Harden the pipeline for weaker models in <TARGET_AREA>.

Goal:
- Reduce ambiguity.
- Reduce optional interpretation.
- Fail fast with explicit errors.

Required actions:
1. Identify the top 3 ambiguity sources in <TARGET_AREA>.
2. For each source, implement exactly one deterministic fix from this set:
   - Add a checklist template.
   - Add a strict linter assertion.
   - Add a runner hint field in text and JSON output.
   - Replace vague wording with testable requirements.
3. Keep changes minimal and local.
4. Add or update docs where command usage changed.
5. Run relevant validators and report PASS/FAIL.

Output format:
1. Ambiguity sources (3 bullets max).
2. Implemented fixes (mapped 1:1).
3. Commands run and results.
4. Exact files changed.
