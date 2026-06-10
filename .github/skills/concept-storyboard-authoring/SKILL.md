---
name: concept-storyboard-authoring
description: Stage 4 concept storyboard authoring, including a required screen flow diagram.
---

# Concept Storyboard Authoring — SKILL.md

> Stage 4 — early visual concepts before requirements are locked.

---

## When to Use

Invoke at Stage 4 (Graphic Artist). Use it when translating approved use cases into visual concept boards that communicate the product's shape before any architecture or design work begins. Produces `4-CONCEPT-STORYBOARD.md` and SVG files under `4-CONCEPT/`, including a required screen flow diagram that maps the major screens and transitions. These are exploratory — they inform later stages but are not final assets. Final assets are produced at Stage 9. Upstream input: `2-USE-CASES.md`.

---

## Target Files

- `4-CONCEPT-STORYBOARD.md`
- `./4-CONCEPT/**` (one SVG per CB record, plus `./4-CONCEPT/screen-flow-diagram.svg`)

---

## Record Schema

```
## CB-XXX : STORYBOARD NAME

- **SUMMARY:** One sentence describing what this concept visualises.
- **FILE:** `./4-CONCEPT/<filename>.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SOURCING:** `original` | `internet-sourced` | `internet-sourced-manipulated`
- **ATTRIBUTION:** Source URL and licence, or "N/A" if original.
- **SCREENS COVERED:** List of screens or views this concept illustrates.
- **STYLE NOTES:** Mood, palette direction, layout approach, interaction hints.
- **TRACEABILITY:** UC-IDs this concept maps to.
- **RELATED:** Other CB-IDs this concept builds on or contrasts with.
```

## Image Sourcing

Concept assets may be original SVGs or internet-sourced images used as-is or manipulated. The same sourcing policy as Stage 9 applies: use permissive/public-domain sources (CC0, CC BY, Unsplash, Wikimedia Commons public domain), record the source URL and licence in the ATTRIBUTION field, and never use a rights-reserved image without documented project owner approval.

---

## Constraints

- Do not use a rights-reserved image without documented project owner approval.
- Do not omit the ATTRIBUTION field when using internet-sourced assets.

---

## Procedure

1. Read all upstream artifacts: `1-BRAINSTORM.md`, `2-USE-CASES.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`.
2. Identify the major screens or flows each UC implies.
3. **Web research before creating anything.** For every concept board the stage requires, search the web first:
   - Search for existing screenshots, UI mockups, mood boards, reference images, or comparable product examples that illustrate the intended look and feel.
   - Use sources such as Unsplash, Dribbble, Behance, Wikimedia Commons, Pinterest, and general image searches.
   - Download usable reference images to `./4-CONCEPT/` and incorporate them directly into concept boards where they communicate the vision better than an original SVG would.
   - Set SOURCING to `internet-sourced` or `internet-sourced-manipulated` and record the source URL and licence.
   - Only create original SVG artwork when a suitable reference or reusable image cannot be found.
4. Create a required high-level screen flow diagram at `./4-CONCEPT/screen-flow-diagram.svg` that maps the major screens and transitions across the approved use cases, and add a CB record for it in `4-CONCEPT-STORYBOARD.md`.
5. Group remaining screens into logical storyboard units — one CB record per major flow or view cluster.
6. For each CB:
   - Write the CB record in `4-CONCEPT-STORYBOARD.md`.
   - Create the SVG or image file at `./4-CONCEPT/<filename>.svg` (or `.png` for downloaded raster images).
   - SVG format requirements:
      - Dark background (`#0d1117` or `#161b22`)
      - Labelled regions with clear bounding boxes
      - Include a title bar and screen annotations
      - Use muted colours for exploration; no production polish needed at this stage
7. Add an exit gate section to `4-CONCEPT-STORYBOARD.md`.
8. Validate against the exit gate.

---

## Exit Gate

- [ ] `4-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow.
- [ ] `./4-CONCEPT/screen-flow-diagram.svg` exists, is non-empty, and is documented by a CB record.
- [ ] Every CB record follows the schema (all fields present, including SOURCING and ATTRIBUTION).
- [ ] Every CB FILE path exists and is a non-empty SVG.
- [ ] Every internet-sourced asset has an ATTRIBUTION entry with source URL and licence.
- [ ] No internet-sourced asset uses a rights-reserved licence without documented project owner approval.
- [ ] For every `original` record, the CB record documents what web search was attempted and why no suitable internet-sourced asset was found.
- [ ] No CB file is a placeholder stub — each must contain meaningful visual structure.
- [ ] TRACEABILITY field references valid UC-IDs.
- [ ] SVG files are legible at standard screen resolution.
- [ ] `4-CONCEPT-STORYBOARD.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
