# 9-RESOURCES/libs — Runtime Libraries

**None required.**

Per `6-ARCHITECTURE-RECOMMENDATIONS.md` (AR-005, AR-006) and `7-DESIGN-INSTRUCTIONS.md`,
The Boiler Room client is a single self-contained `index.html` using only platform
features — vanilla ES2020, Canvas 2D, inline SVG, CSS Grid, and `localStorage`. No
third-party JavaScript or CSS graphics library (Three.js, GSAP, Chart.js, etc.) is used,
so none is bundled here. This keeps the deliverable a zero-dependency, offline-capable
file and removes supply-chain and licensing burden from the Developer.

The agent (`agent.py`) depends only on Python 3.8+ stdlib plus `psutil` (a runtime
pip dependency, not a graphics resource), with optional `nvidia-smi` for GPU metrics.

Fonts: the design uses the system font stack (`'Segoe UI', system-ui, sans-serif`); no
web-font file download is needed.
