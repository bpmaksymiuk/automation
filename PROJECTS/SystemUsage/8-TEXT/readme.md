# The Boiler Room — Run Guide

The Boiler Room is a real-time system-resources dashboard that renders your computer as a Victorian steam engine. Load reads as heat: the CPU furnace roars, the memory boiler rolls toward a boil, disks hold pressure, and the network breathes glowing steam through its pipes.

## Quick look (no install)
Open `index.html` in any modern browser. With no agent running it starts in **demo mode** — every gauge animates from simulated load so you can see the room come alive. Click **Stoke the furnace** to drive the load up and watch the relief valves trip.

## Live mode (your real machine)
Requirements: Python 3.8+ and `psutil` (`pip install psutil`). Optional GPU readings need NVIDIA's `nvidia-smi`.

```
python3 agent.py            # serves on http://127.0.0.1:8077
```

Then open `http://127.0.0.1:8077`. The connection indicator should read **live**.

Options:
```
python3 agent.py --host 127.0.0.1 --port 8077
```

## Setting alarms
Open **Alert Control**, drag a valve to set the percentage at which each gauge sounds its alarm, and (optionally) allow desktop notifications. Your thresholds are remembered between visits.

## Notes
- The agent binds to localhost by default and only ever reads system data.
- Prefer calm? Toggle reduced motion to still the animation while the numbers keep updating.
