# Graphic Artwork Authoring — SKILL.md

> Stage 9 — production-quality final graphic assets, proactive resource acquisition, and developer-ready asset packs from approved design instructions.

---

## When to Use

Invoke at Stage 9 (Graphic Artist). Use it when producing final production-quality graphic assets and supporting engineering diagrams for the Developer's reference, **and** when proactively acquiring all graphics-related resources the Developer will need. Produces `9-GRAPHIC-ASSETS.md`, final visual assets under `9-GRAPHIC-ASSETS/`, required diagrams under `9-DIAGRAMS/`, and a curated resource pack under `9-RESOURCES/`. Upstream input: `7-DESIGN-INSTRUCTIONS.md` plus every prior pipeline artifact. These are deliverable assets — not concept sketches. Concept work from Stage 4 is kept in `./4-CONCEPT/` and must not be overwritten.

**Proactive Resource Mission:** The Graphic Artist does not wait for the Developer to ask. After reading all pipeline artifacts the Artist identifies every graphics-related need implied by the design — not just what is explicitly listed — and pre-fetches, downloads, or creates everything required. Resources include: raster and vector images, SVG icon sets, photos, textures, tile sets, sprite sheets, 3D models, HDRI/skybox maps, animation clips (CSS, JS, Lottie, GSAP, Rive, sprite-based), JavaScript/CSS graphics libraries (Three.js, PIXI.js, GSAP, Anime.js, p5.js, Phaser, etc.), font files, colour palettes, design tokens, whole reference websites, and any other material that reduces the Developer's look-up burden. All acquired resources are placed under `9-RESOURCES/` and catalogued in `9-GRAPHIC-ASSETS.md`.

Before generating assets, the Graphic Artist does research online for visual inspiration, comparable examples, and relevant real-world details. When sourcing images from the internet, the Graphic Artist must document the source in the journal. Sourcing images is encouraged. Original artwork is not mandatory, but all assets must be fit for purpose, visually polished, and compliant with licensing requirements. The Graphic Artist may manipulate internet-sourced images to fit the project needs and this includes cropping parts of the image and saving them as new files, merging multiple images into a new composition, and applying filters or adjustments or anything else that needs to happen to an image.

---

## Target Files

- `9-GRAPHIC-ASSETS.md`
- `./9-GRAPHIC-ASSETS/**` (one file per GA record)
- `./9-DIAGRAMS/**` (data flow diagram and sequence diagrams)
- `./9-RESOURCES/**` (all proactively acquired resources: libraries, textures, models, animations, fonts, photos, icon sets, collections, etc.)

---

## Record Schema

Two record types are used in `9-GRAPHIC-ASSETS.md`:

### GA Record — Graphic Asset (bespoke or sourced image/diagram)

```
## GA-XXX : ASSET TITLE

- **SUMMARY:** One sentence describing what this asset illustrates or communicates.
- **FILE:** `./9-GRAPHIC-ASSETS/<filename>.svg` or `./9-DIAGRAMS/<filename>.svg` (or .png where appropriate)
- **FORMAT:** SVG preferred for diagrams; PNG for raster artwork. Specify dimensions.
- **SOURCING:** `original` | `internet-sourced` | `internet-sourced-manipulated`
- **ATTRIBUTION:** Source URL and licence identifier, or "N/A" if original.
- **STYLE NOTES:** Colour palette, typography, layout approach, and any conventions inherited from Stage 4 concepts.
- **FLAVORS:** List 2–3 candidate design directions if multiple were considered. State which was selected.
- **SELECTED FLAVOR:** The chosen direction and brief justification.
- **TRACEABILITY:** DI-IDs that required this asset.
- **RELATED:** CB-IDs (Stage 4 concepts) this asset evolved from; other GA-IDs in the same family.
```

### RES Record — Acquired Resource (library, collection, font, animation, model, etc.)

```
## RES-XXX : RESOURCE TITLE

- **TYPE:** `library` | `icon-set` | `texture-pack` | `3d-model` | `animation` | `font` | `photo` | `sprite-sheet` | `ui-kit` | `colour-palette` | `reference-website` | `other`
- **SUMMARY:** One sentence describing what this resource provides and why the Developer needs it.
- **PATH:** `./9-RESOURCES/<subdir>/<filename or folder>`
- **SOURCE URL:** Where the resource was obtained.
- **LICENCE:** Licence identifier (e.g. MIT, CC0, Apache-2.0, OFL) or "see LICENSE file".
- **VERSION:** Version number or download date.
- **INSTALL / USE:** CDN link, npm install command, or import path the Developer should use.
- **TRACEABILITY:** DI-IDs or pipeline context that motivated acquiring this resource.
```

## Image Sourcing

The Graphic Artist may source images using any of the following strategies:

- **Original:** Produced entirely from scratch (SVG markup, CSS, canvas). No attribution needed.
- **Internet-sourced:** No attribution needed for CC0/public domain; record URL and licence for all others.

## Resource Acquisition

Resources under `9-RESOURCES/` are organised by type:

```
9-RESOURCES/
  libs/          JS/CSS libraries (minified dist + source)
  fonts/         Web font files (woff2, woff)
  icons/         Icon sets and SVG collections
  textures/      Surface textures, HDRIs, normal maps
  models/        3D model files (glTF, glb, OBJ)
  animations/    Lottie JSON, Rive files, sprite sheets, CSS animation packs
  photos/        Sourced photographs and reference images
  ui-kits/       HTML/CSS UI component kits and themes
  tokens/        Colour palettes as CSS vars, SCSS vars, and JSON tokens
  references/    Screenshots and CSS snippets from reference websites
  audio-visual/  Video/audio placeholders
```
---

## Visual Style Standards

For dark-theme pipeline documentation assets:
- **Background:** `#0d1117` (deep) / `#161b22` (surface)
- **Body text:** `#e6edf3` (primary) / `#c9d1d9` (secondary)
- **Muted text / borders:** `#8b949e` / `#21262d` / `#3d444d`
- **Role colours:**
  - User / Analyst / Tech Lead: `#1f6feb` (border) / `#79c0ff` (text)
  - Writer / Tester: `#2ea043` (border) / `#3fb950` (text)
  - Graphic Artist / Manager: `#9e6a03` (border) / `#d29922` (text)
  - Architect / Developer: `#b91c1c` (border) / `#f78166` (text)
- **Typography:** `'Segoe UI', system-ui, sans-serif`
- **Corners:** `rx="8"` for large boxes, `rx="6"` for small boxes

---

## Constraints

- Do not overwrite or alter Stage 4 concept assets in `./4-CONCEPT/` when producing Stage 9 final assets.

---

## Procedure

### Phase 1 — Full Pipeline Read and Resource Audit

1. Read **every** upstream artifact in order: `1-BRAINSTORM.md`, `0-IDEA.md`, `2-USE-CASES.md`, `3-NARRATIVE-VISION.md`, `4-CONCEPT-STORYBOARD.md`, `5-REQUIREMENTS.md`, `6-ARCHITECTURE-RECOMMENDATIONS.md`, `6-PARTS LIST.md`, `7-DESIGN-INSTRUCTIONS.md`, `8-TEXT-CONTENT.md`, and all Stage 4 concept files in `./4-CONCEPT/`.
2. Read `7-DESIGN-INSTRUCTIONS.md` with particular care — this is the primary authority on what the Developer needs to implement. Extract:
   - Every image-bearing DI (screenshots, illustrations, backgrounds, icons, UI elements).
   - Every technology, library, or framework the Developer will use that has a visual or animation dimension.
   - Every screen, state, transition, and interaction described, and what visual asset supports it.
   - Any named third-party graphics resources, icon sets, UI kits, fonts, or animation libraries.
3. Compile a **Resource Acquisition Checklist** — a flat list of every graphic resource the Developer will need, inferred from the full pipeline context, not just what is explicitly listed. Think like a Developer: what would slow them down or require a search? Pre-solve those problems now.

### Phase 2 — Proactive Resource Acquisition

4. **Proactively download or acquire all resources on the checklist.** This is the central responsibility of Stage 9. Resources to acquire include but are not limited to:
   - **Images & Photos:** Background images, hero images, UI element photos, product shots, atmospheric reference photos. Sources: Unsplash, Pexels, Wikimedia Commons, Pixabay, OpenVerse, general image search.
   - **Textures & Materials:** Surface textures, tile maps, normal maps, metalness/roughness maps, HDRIs, skybox images. Sources: Poly Haven, Ambient CG, CC0 Textures, TextureCan.
   - **3D Models:** Scene objects, characters, props, architectural elements, any geometry referenced by design. Sources: Sketchfab (CC0/CC BY), Poly Haven, Open3DLab, Kenney.nl, Google Poly archive mirrors.
   - **Icon Sets & SVG Collections:** Matching icon families that cover all UI icons referenced in the design. Sources: Heroicons, Feather Icons, Phosphor Icons, Material Symbols, Tabler Icons, Lucide, Iconoir, game-icon.net, Font Awesome free tier, Simple Icons.
   - **Fonts & Typefaces:** Every font used by the design, downloaded as web-font files (woff2 preferred). Sources: Google Fonts, Font Squirrel, The League of Moveable Type, Bunny Fonts.
   - **Animation Libraries & Clips:** CSS animation libraries, JS animation engines, Lottie JSON files, Rive files, sprite sheets, GIF or WebM animation clips. Sources: LottieFiles (free), GSAP (free tier), Animate.css, Hover.css, Magic.css, CSShake, Animate On Scroll (AOS), Motion One, Rive community files.
   - **JavaScript/CSS Graphics Libraries:** Any rendering or graphics library implied by the tech stack (Three.js, PIXI.js, Babylon.js, GSAP, Anime.js, p5.js, Phaser, Konva, Fabric.js, EaselJS, Matter.js, Chart.js, D3.js, etc.). Download the distribution file (minified + source) and place under `9-RESOURCES/libs/`. Also save the CDN link and npm install command.
   - **UI Kits & Component Libraries:** HTML/CSS UI kits, Tailwind component packs, Bootstrap themes, or other UI starter kits referenced or implied by the design. Download the distribution package.
   - **Colour Palettes & Design Tokens:** Export the project's palette as a CSS custom-property file, a SCSS variables file, and a JSON tokens file placed under `9-RESOURCES/tokens/`.
   - **Reference Websites:** If the design references a visual style from an existing product or website, fetch the page and save a rendered screenshot plus key CSS/asset references for the Developer to study. Place under `9-RESOURCES/references/`.
   - **Sprite Sheets & Tile Sets:** Game assets, UI sprite sheets, icon sprite maps. Sources: Open Game Art, Kenney.nl, itch.io free assets.
   - **Audio-Visual Placeholders:** If the design calls for video backgrounds or audio cues, source a placeholder from Coverr, Mixkit, or Pixabay video/audio.
   - Use `run_in_terminal` with `curl`, `wget`, or `npm pack` to download files directly into the correct subdirectory under `9-RESOURCES/`.
   - For each acquired resource, record source URL, licence, version/date, and purpose in `X-Journal.md` and in the corresponding GA or RES record.

5. **Web research for each production asset.** For every image-bearing DI that requires a bespoke asset (not covered by a library or collection):
   - Search the web for existing images, textures, SVGs, or photos that match what is needed before attempting to create from scratch.
   - Prefer assets that can be used directly or with minimal modification.
   - If a usable asset is found, download it, record attribution, and mark SOURCING appropriately.
   - Only produce an original asset when a genuine search finds nothing suitable; in that case document the search terms tried.

### Phase 3 — Asset Production

6. Review Stage 4 concept files in `./4-CONCEPT/` for established visual direction and carry forward consistent style decisions.
7. Create the required Stage 9 engineering diagrams under `./9-DIAGRAMS/`:
   - `./9-DIAGRAMS/data-flow-diagram.svg` covering the major actors, interfaces, system boundaries, and data movement.
   - At least two `./9-DIAGRAMS/sequence-*.svg` files covering key approved use cases.
8. Produce all bespoke production assets not satisfied by acquired resources. Apply production-quality polish: gradients, filters where appropriate, consistent role colours, clean typography, proper viewport dimensions.
9. For each image-bearing DI, each required diagram, and each acquired resource collection, write a record in `9-GRAPHIC-ASSETS.md` using the schema below.
10. Validate each file is non-empty and renders or loads correctly.
11. Run the exit gate checklist.

---

## Exit Gate

- [ ] `./9-GRAPHIC-ASSETS/` contains final approved assets for all image-bearing DIs.
- [ ] `./9-DIAGRAMS/` contains `data-flow-diagram.svg` and at least two non-empty `sequence-*.svg` files for key use cases.
- [ ] `./9-RESOURCES/` is populated with all proactively acquired resources (libraries, fonts, icons, textures, models, animations, etc.) identified from the full pipeline read.
- [ ] `9-GRAPHIC-ASSETS.md` has one GA record per image-bearing DI, one GA record per required diagram, and one RES record per acquired resource collection.
- [ ] Every GA FILE path exists and is a non-empty SVG or PNG.
- [ ] Every RES PATH exists and is non-empty (file or populated folder).
- [ ] TRACEABILITY fields reference valid DI-IDs.
- [ ] FLAVORS and SELECTED FLAVOR fields are completed on GA records (or marked N/A with justification).
- [ ] Every internet-sourced GA record has an ATTRIBUTION field with source URL and licence.
- [ ] Every RES record has SOURCE URL, LICENCE, VERSION, and INSTALL / USE fields completed.
- [ ] No acquired resource uses a licence that prohibits the intended use without documented project owner approval.
- [ ] For every `original` GA record, the record documents what web search was attempted and why no suitable internet-sourced asset was found.
- [ ] Stage 4 concept files in `./4-CONCEPT/` are unmodified.
- [ ] All bespoke assets follow the visual style standards for colour, typography, and layout.
- [ ] `X-Journal.md` records the source, transformations applied, and purpose for every internet-sourced or manipulated asset and every acquired resource.
- [ ] `9-GRAPHIC-ASSETS.md` document `STATUS` field is set to `PASS` and `STATUS UPDATED` is set to today's date.
