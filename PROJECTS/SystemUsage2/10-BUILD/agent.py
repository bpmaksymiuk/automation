#!/usr/bin/env python3
"""The Boiler Room — metrics agent.

Serves a self-contained dashboard client and exposes real system metrics as a
canonical JSON snapshot over HTTP (one-shot JSON and Server-Sent Events).

Run:  python3 agent.py [--host 127.0.0.1] [--port 8077]
"""
import argparse
import http.server
import json
import os
import subprocess
import time

try:
    import psutil
    PSUTIL_OK = True
except ImportError:
    PSUTIL_OK = False

# Previous counters for delta-based rate calculation.
_prev = {"t": None, "disk": None, "net": None}


def _safe_temp():
    try:
        temps = psutil.sensors_temperatures()
    except (AttributeError, NotImplementedError, OSError):
        return None
    if not temps:
        return None
    for entries in temps.values():
        if entries:
            return float(entries[0].current)
    return None


def _top_net_iface():
    try:
        pernic = psutil.net_io_counters(pernic=True)
    except (OSError, RuntimeError):
        return None
    best, best_total = None, -1
    for name, c in pernic.items():
        total = c.bytes_sent + c.bytes_recv
        if total > best_total:
            best, best_total = name, total
    return best


def collect_snapshot() -> dict:
    if not PSUTIL_OK:
        raise RuntimeError("psutil unavailable")

    now_t = time.time()

    overall = psutil.cpu_percent(interval=None)
    cores = psutil.cpu_percent(interval=None, percpu=True)

    vm = psutil.virtual_memory()
    sm = psutil.swap_memory()

    disks = []
    for part in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(part.mountpoint)
        except (PermissionError, OSError):
            continue
        disks.append({
            "mount": part.mountpoint,
            "totalB": usage.total,
            "usedB": usage.used,
            "percent": float(usage.percent),
        })

    disk_now = psutil.disk_io_counters()
    net_now = psutil.net_io_counters()

    prev_t = _prev["t"]
    if prev_t is None:
        dt = 0.0
    else:
        dt = now_t - prev_t

    def rate(now_val, prev_val):
        if not dt or dt <= 0 or prev_val is None:
            return 0.0
        return max(0.0, (now_val - prev_val) / dt)

    if _prev["disk"] is None or disk_now is None:
        read_bps = write_bps = 0.0
    else:
        read_bps = rate(disk_now.read_bytes, _prev["disk"].read_bytes)
        write_bps = rate(disk_now.write_bytes, _prev["disk"].write_bytes)

    if _prev["net"] is None or net_now is None:
        tx_bps = rx_bps = 0.0
    else:
        tx_bps = rate(net_now.bytes_sent, _prev["net"].bytes_sent)
        rx_bps = rate(net_now.bytes_recv, _prev["net"].bytes_recv)

    _prev["t"] = now_t
    _prev["disk"] = disk_now
    _prev["net"] = net_now

    proc_cpu = []
    proc_mem = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_info", "memory_percent"]):
        try:
            info = proc.info
            proc_cpu.append({
                "name": info.get("name") or "?",
                "pid": info.get("pid"),
                "cpu": float(info.get("cpu_percent") or 0.0),
            })
            mem_info = info.get("memory_info")
            proc_mem.append({
                "name": info.get("name") or "?",
                "pid": info.get("pid"),
                "memB": int(mem_info.rss) if mem_info else 0,
                "memPercent": float(info.get("memory_percent") or 0.0),
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    proc_cpu.sort(key=lambda p: p["cpu"], reverse=True)
    proc_mem.sort(key=lambda p: p["memPercent"], reverse=True)
    proc_cpu = proc_cpu[:5]
    proc_mem = proc_mem[:5]

    snapshot = {
        "ts": now_t,
        "cpu": {
            "overall": float(overall),
            "cores": [float(c) for c in cores],
            "tempC": _safe_temp(),
        },
        "gpu": collect_gpu(),
        "mem": {
            "totalB": vm.total,
            "usedB": vm.used,
            "availB": vm.available,
            "cachedB": int(getattr(vm, "cached", 0)),
            "percent": float(vm.percent),
            "swapTotalB": sm.total,
            "swapUsedB": sm.used,
            "swapPercent": float(sm.percent),
        },
        "disks": disks,
        "diskio": {"readBps": read_bps, "writeBps": write_bps},
        "net": {"iface": _top_net_iface(), "txBps": tx_bps, "rxBps": rx_bps},
        "procCpu": proc_cpu,
        "procMem": proc_mem,
    }
    return snapshot


def collect_gpu() -> dict:
    try:
        result = subprocess.run(
            ["nvidia-smi",
             "--query-gpu=utilization.gpu,memory.used,memory.total,name",
             "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=1.5,
        )
        if result.returncode != 0 or not result.stdout.strip():
            return {"available": False}
        first = result.stdout.strip().splitlines()[0]
        util, vram_used, vram_total, name = [p.strip() for p in first.split(",")]
        return {
            "available": True,
            "util": float(util),
            "vramUsedMB": float(vram_used),
            "vramTotalMB": float(vram_total),
            "name": name,
        }
    except (FileNotFoundError, subprocess.TimeoutExpired, ValueError, OSError):
        return {"available": False}


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):  # keep stdout clean
        return

    def _send_api_headers(self, status, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self._serve_index()
        elif self.path == "/api/metrics":
            self._serve_metrics()
        elif self.path == "/api/stream":
            self._serve_stream()
        else:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"not found")

    def _serve_index(self):
        index_path = os.path.join(os.path.dirname(__file__), "index.html")
        try:
            with open(index_path, "rb") as fh:
                body = fh.read()
        except OSError:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"index.html not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def _serve_metrics(self):
        try:
            snapshot = collect_snapshot()
        except RuntimeError:
            self._send_api_headers(503, "application/json")
            self.wfile.write(b'{"error":"psutil_unavailable"}')
            return
        self._send_api_headers(200, "application/json")
        self.wfile.write(json.dumps(snapshot).encode())

    def _serve_stream(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        try:
            while True:
                try:
                    snapshot = collect_snapshot()
                except RuntimeError:
                    payload = '{"error":"psutil_unavailable"}'
                else:
                    payload = json.dumps(snapshot)
                self.wfile.write(f"data: {payload}\n\n".encode())
                self.wfile.flush()
                time.sleep(1.0)
        except (BrokenPipeError, ConnectionResetError):
            return


def main():
    parser = argparse.ArgumentParser(description="The Boiler Room metrics agent")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8077)
    args = parser.parse_args()

    server = http.server.ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Boiler Room agent on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""The Boiler Room — metrics agent.

Serves a self-contained dashboard client and exposes real system metrics as a
canonical JSON snapshot over HTTP (one-shot JSON and Server-Sent Events).

Run:  python3 agent.py [--host 127.0.0.1] [--port 8077]
"""
import argparse
import http.server
import json
import os
import subprocess
import time

try:
    import psutil
    PSUTIL_OK = True
except ImportError:
    PSUTIL_OK = False

# Previous counters for delta-based rate calculation.
_prev = {"t": None, "disk": None, "net": None}


def _safe_temp():
    try:
        temps = psutil.sensors_temperatures()
    except (AttributeError, NotImplementedError, OSError):
        return None
    if not temps:
        return None
    for entries in temps.values():
        if entries:
            return float(entries[0].current)
    return None


def _top_net_iface():
    try:
        pernic = psutil.net_io_counters(pernic=True)
    except (OSError, RuntimeError):
        return None
    best, best_total = None, -1
    for name, c in pernic.items():
        total = c.bytes_sent + c.bytes_recv
        if total > best_total:
            best, best_total = name, total
    return best


def collect_snapshot() -> dict:
    if not PSUTIL_OK:
        raise RuntimeError("psutil unavailable")

    now_t = time.time()

    overall = psutil.cpu_percent(interval=None)
    cores = psutil.cpu_percent(interval=None, percpu=True)

    vm = psutil.virtual_memory()
    sm = psutil.swap_memory()

    disks = []
    for part in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(part.mountpoint)
        except (PermissionError, OSError):
            continue
        disks.append({
            "mount": part.mountpoint,
            "totalB": usage.total,
            "usedB": usage.used,
            "percent": float(usage.percent),
        })

    disk_now = psutil.disk_io_counters()
    net_now = psutil.net_io_counters()

    prev_t = _prev["t"]
    if prev_t is None:
        dt = 0.0
    else:
        dt = now_t - prev_t

    def rate(now_val, prev_val):
        if not dt or dt <= 0 or prev_val is None:
            return 0.0
        return max(0.0, (now_val - prev_val) / dt)

    if _prev["disk"] is None or disk_now is None:
        read_bps = write_bps = 0.0
    else:
        read_bps = rate(disk_now.read_bytes, _prev["disk"].read_bytes)
        write_bps = rate(disk_now.write_bytes, _prev["disk"].write_bytes)

    if _prev["net"] is None or net_now is None:
        tx_bps = rx_bps = 0.0
    else:
        tx_bps = rate(net_now.bytes_sent, _prev["net"].bytes_sent)
        rx_bps = rate(net_now.bytes_recv, _prev["net"].bytes_recv)

    _prev["t"] = now_t
    _prev["disk"] = disk_now
    _prev["net"] = net_now

    proc_cpu = []
    proc_mem = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_info", "memory_percent"]):
        try:
            info = proc.info
            proc_cpu.append({
                "name": info.get("name") or "?",
                "pid": info.get("pid"),
                "cpu": float(info.get("cpu_percent") or 0.0),
            })
            mem_info = info.get("memory_info")
            proc_mem.append({
                "name": info.get("name") or "?",
                "pid": info.get("pid"),
                "memB": int(mem_info.rss) if mem_info else 0,
                "memPercent": float(info.get("memory_percent") or 0.0),
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    proc_cpu.sort(key=lambda p: p["cpu"], reverse=True)
    proc_mem.sort(key=lambda p: p["memPercent"], reverse=True)
    proc_cpu = proc_cpu[:5]
    proc_mem = proc_mem[:5]

    snapshot = {
        "ts": now_t,
        "cpu": {
            "overall": float(overall),
            "cores": [float(c) for c in cores],
            "tempC": _safe_temp(),
        },
        "gpu": collect_gpu(),
        "mem": {
            "totalB": vm.total,
            "usedB": vm.used,
            "availB": vm.available,
            "cachedB": int(getattr(vm, "cached", 0)),
            "percent": float(vm.percent),
            "swapTotalB": sm.total,
            "swapUsedB": sm.used,
            "swapPercent": float(sm.percent),
        },
        "disks": disks,
        "diskio": {"readBps": read_bps, "writeBps": write_bps},
        "net": {"iface": _top_net_iface(), "txBps": tx_bps, "rxBps": rx_bps},
        "procCpu": proc_cpu,
        "procMem": proc_mem,
    }
    return snapshot


def collect_gpu() -> dict:
    try:
        result = subprocess.run(
            ["nvidia-smi",
             "--query-gpu=utilization.gpu,memory.used,memory.total,name",
             "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=1.5,
        )
        if result.returncode != 0 or not result.stdout.strip():
            return {"available": False}
        first = result.stdout.strip().splitlines()[0]
        util, vram_used, vram_total, name = [p.strip() for p in first.split(",")]
        return {
            "available": True,
            "util": float(util),
            "vramUsedMB": float(vram_used),
            "vramTotalMB": float(vram_total),
            "name": name,
        }
    except (FileNotFoundError, subprocess.TimeoutExpired, ValueError, OSError):
        return {"available": False}


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):  # keep stdout clean
        return

    def _send_api_headers(self, status, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self._serve_index()
        elif self.path == "/api/metrics":
            self._serve_metrics()
        elif self.path == "/api/stream":
            self._serve_stream()
        else:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"not found")

    def _serve_index(self):
        index_path = os.path.join(os.path.dirname(__file__), "index.html")
        try:
            with open(index_path, "rb") as fh:
                body = fh.read()
        except OSError:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"index.html not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def _serve_metrics(self):
        try:
            snapshot = collect_snapshot()
        except RuntimeError:
            self._send_api_headers(503, "application/json")
            self.wfile.write(b'{"error":"psutil_unavailable"}')
            return
        self._send_api_headers(200, "application/json")
        self.wfile.write(json.dumps(snapshot).encode())

    def _serve_stream(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        try:
            while True:
                try:
                    snapshot = collect_snapshot()
                except RuntimeError:
                    payload = '{"error":"psutil_unavailable"}'
                else:
                    payload = json.dumps(snapshot)
                self.wfile.write(f"data: {payload}\n\n".encode())
                self.wfile.flush()
                time.sleep(1.0)
        except (BrokenPipeError, ConnectionResetError):
            return


def main():
    parser = argparse.ArgumentParser(description="The Boiler Room metrics agent")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8077)
    args = parser.parse_args()

    server = http.server.ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Boiler Room agent on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
