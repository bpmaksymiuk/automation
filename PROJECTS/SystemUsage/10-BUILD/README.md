# The Boiler Room — Build

A real-time system-resources dashboard rendered as a Victorian steam engine.

## Run in demo mode (no install)
Open `index.html` directly in a modern browser. With no agent running it starts in **demo mode** and every panel animates from simulated load.

## Run live (real machine metrics)
Requirements: Python 3.8+ and `psutil` (`pip install psutil`). Optional GPU metrics need NVIDIA's `nvidia-smi`.

```
python3 agent.py
```

Then open `http://127.0.0.1:8077`. The connection indicator reads **live**.

Options:
```
python3 agent.py --host 127.0.0.1 --port 8077
```

The agent binds to `127.0.0.1` by default and only reads system data.
