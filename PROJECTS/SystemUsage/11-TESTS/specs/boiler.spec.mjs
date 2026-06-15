// Stage 11 formal verification — The Boiler Room (SystemUsage)
// Visible (headed) Chromium. Each test captures a screenshot used as report evidence.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.resolve(__dirname, '..', 'results', 'full', 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

async function shot(page, id) {
  await page.screenshot({ path: path.join(SHOTS, `${id}.png`), fullPage: false });
}

// Inspect a flame canvas: whether it drew anything, its top-most painted row,
// and whether the painted colour is red-dominant (CPU) or blue-dominant (GPU).
async function flameStats(page, canvasId) {
  return page.evaluate((cid) => {
    const c = document.getElementById(cid); const ctx = c.getContext('2d');
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let topY = c.height, nonBlank = false, rSum = 0, gSum = 0, bSum = 0, n = 0;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        if (d[i + 3] > 20) { nonBlank = true; if (y < topY) topY = y; rSum += d[i]; gSum += d[i + 1]; bSum += d[i + 2]; n++; }
      }
    }
    return { topY, nonBlank, redDominant: n ? (rSum / n) > (bSum / n) : false };
  }, canvasId);
}
async function canvasNonBlank(page, canvasId) {
  return page.evaluate((cid) => {
    const c = document.getElementById(cid); if (!c) return false;
    const ctx = c.getContext('2d'); const d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return true;
    return false;
  }, canvasId);
}

// A schema-valid canonical snapshot; pass overrides for deterministic states.
function snap(over = {}) {
  const base = {
    ts: Date.now() / 1000,
    cpu: { overall: 30, cores: [20, 30, 25, 40, 35, 28, 32, 22], tempC: 48 },
    gpu: { available: true, util: 40, vramUsedMB: 3000, vramTotalMB: 8192, name: 'Test GPU' },
    mem: { totalB: 16e9, usedB: 8e9, availB: 8e9, cachedB: 2e9, percent: 50, swapTotalB: 4e9, swapUsedB: 4e8, swapPercent: 10 },
    disks: [
      { mount: '/', totalB: 5e11, usedB: 3.05e11, percent: 61 },
      { mount: '/home', totalB: 1e12, usedB: 7.8e11, percent: 78 },
    ],
    diskio: { readBps: 2e7, writeBps: 6e6 },
    net: { iface: 'eth0', txBps: 2.5e6, rxBps: 6e6 },
    procCpu: [
      { name: 'chrome', pid: 4001, cpu: 30 }, { name: 'node', pid: 4002, cpu: 20 },
      { name: 'code', pid: 4003, cpu: 12 }, { name: 'python3', pid: 4004, cpu: 8 },
      { name: 'gnome-shell', pid: 4005, cpu: 4 },
    ],
    procMem: [
      { name: 'chrome', pid: 4001, memB: 2e9, memPercent: 12 }, { name: 'node', pid: 4002, memB: 1e9, memPercent: 6 },
      { name: 'code', pid: 4003, memB: 8e8, memPercent: 5 }, { name: 'python3', pid: 4004, memB: 5e8, memPercent: 3 },
      { name: 'gnome-shell', pid: 4005, memB: 3e8, memPercent: 2 },
    ],
  };
  return { ...base, ...over };
}

// Stop the live data source so injected snapshots are not overwritten, then render.
async function freezeRender(page, s) {
  await page.evaluate((snapshot) => {
    if (typeof clearModes === 'function') clearModes();
    renderSnapshot(snapshot);
  }, s);
}

async function openAlerts(page) {
  const panel = page.locator('#panel-alerts');
  if (await panel.isHidden()) await page.click('#btn-alerts');
  await expect(panel).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Wait for the data source to produce the first snapshot (live agent).
  await expect(page.locator('#conn')).toHaveText(/live|demo/, { timeout: 8000 });
});

test('T-001 all resources on one live page', async ({ page }) => {
  for (const id of ['#panel-furnaces', '#panel-boilers', '#panel-pipes', '#panel-procs', '#panel-alerts']) {
    await expect(page.locator(id)).toHaveCount(1);
  }
  // No vertical page scroll at 1920x1080.
  const noScroll = await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 2);
  expect(noScroll).toBeTruthy();
  // Every resource readout shows a number within 3s.
  for (const id of ['#cpu-readout', '#gpu-readout', '#mem-readout', '#disk-io', '#net-readout']) {
    await expect(page.locator(id)).toHaveText(/\d/, { timeout: 3000 });
  }
  // BR-039 green-primary / yellow-amber theme.
  const theme = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const f = (v) => { v = v.trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16)); };
    return { brass: f(cs.getPropertyValue('--brass')), ember: f(cs.getPropertyValue('--ember')) };
  });
  expect(theme.brass[1]).toBeGreaterThan(theme.brass[0]); // green > red (green primary)
  expect(theme.brass[1]).toBeGreaterThan(theme.brass[2]); // green > blue
  expect(theme.ember[0]).toBeGreaterThan(150);
  expect(theme.ember[1]).toBeGreaterThan(150);
  expect(theme.ember[2]).toBeLessThan(140); // yellow accent (low blue)
  await shot(page, 'T-001');
});

test('T-002 real-time updates and connection indicator', async ({ page }) => {
  await expect(page.locator('#conn')).toHaveText('live', { timeout: 8000 });
  const first = await page.locator('#cpu-readout').textContent();
  await page.waitForTimeout(2200);
  const second = await page.locator('#cpu-readout').textContent();
  expect(second).not.toBe(first);
  // Demo fallback path produces a schema-valid snapshot.
  const ok = await page.evaluate(() => {
    const d = DemoSimulator.next();
    return d && typeof d.cpu.overall === 'number' && Array.isArray(d.cpu.cores) &&
      typeof d.mem.percent === 'number' && Array.isArray(d.disks) && typeof d.net.txBps === 'number';
  });
  expect(ok).toBeTruthy();
  await shot(page, 'T-002');
});

test('T-003 CPU furnace flame (red)', async ({ page }) => {
  await freezeRender(page, snap({ cpu: { overall: 90, cores: [88, 92, 86, 94, 90, 85, 91, 89], tempC: 72 } }));
  await page.waitForTimeout(280);
  await expect(page.locator('#cpu-readout')).toContainText('8 cores');
  const high = await flameStats(page, 'cpu-flame');
  expect(high.nonBlank).toBeTruthy();
  expect(high.redDominant).toBeTruthy(); // CPU flame is red
  expect(await canvasNonBlank(page, 'cpu-cores')).toBeTruthy(); // one flame per core
  await freezeRender(page, snap({ cpu: { overall: 12, cores: [10, 12, 8, 14, 11, 9, 13, 10], tempC: 45 } }));
  await page.waitForTimeout(280);
  const low = await flameStats(page, 'cpu-flame');
  expect(high.topY).toBeLessThan(low.topY); // flame is taller (reaches higher) at high CPU
  await freezeRender(page, snap({ cpu: { overall: 90, cores: [88, 92, 86, 94, 90, 85, 91, 89], tempC: 72 } }));
  await page.waitForTimeout(200);
  await shot(page, 'T-003');
});

test('T-004 GPU furnace flame (blue) and unavailable state', async ({ page }) => {
  await freezeRender(page, snap({ gpu: { available: true, util: 55, vramUsedMB: 4096, vramTotalMB: 8192, name: 'Test GPU' } }));
  await page.waitForTimeout(280);
  await expect(page.locator('#gpu-readout')).toContainText('55.0%');
  const g = await flameStats(page, 'gpu-flame');
  expect(g.nonBlank).toBeTruthy();
  expect(g.redDominant).toBeFalsy(); // GPU flame is blue, not red
  await shot(page, 'T-004');
  // Unavailable state must render cleanly.
  const threw = await page.evaluate((s) => { try { renderSnapshot(s); return false; } catch (e) { return true; } },
    snap({ gpu: { available: false } }));
  expect(threw).toBeFalsy();
  await expect(page.locator('#gpu-readout')).toHaveText('GPU not available');
  await shot(page, 'T-004b');
});

test('T-005 RAM and VRAM twin boilers', async ({ page }) => {
  await freezeRender(page, snap({ mem: { totalB: 16e9, usedB: 7.2e9, availB: 8.8e9, cachedB: 2e9, percent: 45, swapTotalB: 4e9, swapUsedB: 4e8, swapPercent: 10 },
    gpu: { available: true, util: 40, vramUsedMB: 3000, vramTotalMB: 8192, name: 'Test GPU' } }));
  await expect(page.locator('#mem-readout')).toContainText('45%');
  await expect(page.locator('#vram-readout')).toContainText('3000 / 8192 MB');
  // BR-037: vessel heights proportional to true capacity (RAM 16 GB > VRAM ~8.6 GB).
  const sizes = await page.evaluate(() => ({
    ram: document.getElementById('mem-tank').height,
    vram: document.getElementById('vram-tank').height,
  }));
  expect(sizes.ram).toBeGreaterThan(sizes.vram);
  // High-usage boil intensifies (RAM boiler bubbles spawn).
  await freezeRender(page, snap({ mem: { totalB: 16e9, usedB: 14.7e9, availB: 1.3e9, cachedB: 1e9, percent: 92, swapTotalB: 4e9, swapUsedB: 2.4e9, swapPercent: 60 } }));
  const memPct = await page.evaluate(() => state.memPercent);
  expect(memPct).toBe(92);
  await page.waitForTimeout(900); // let the boil engine spawn bubbles
  const bubbleCount = await page.evaluate(() => (typeof memBubbles !== 'undefined' ? memBubbles.length : 0));
  expect(bubbleCount).toBeGreaterThan(0);
  await expect(page.locator('#mem-readout')).toContainText('GB');
  await expect(page.locator('#mem-readout')).toContainText('swap');
  await shot(page, 'T-005');
});

test('T-006 disk pressure tanks and IO', async ({ page }) => {
  await freezeRender(page, snap());
  const tanks = page.locator('#disk-tanks .disk-tank');
  await expect(tanks).toHaveCount(2);
  const heights = await page.evaluate(() =>
    [...document.querySelectorAll('#disk-tanks .fill')].map((f) => f.style.height));
  expect(heights).toContain('61%');
  expect(heights).toContain('78%');
  await expect(page.locator('#disk-io')).toContainText('read');
  await expect(page.locator('#disk-io')).toContainText('write');
  // BR-038: disk read/write flows render in the steam-pipe network.
  await expect(page.locator('#pipe-canvas')).toHaveCount(1);
  await page.waitForTimeout(320);
  expect(await canvasNonBlank(page, 'pipe-canvas')).toBeTruthy();
  await shot(page, 'T-006');
});

test('T-007 network steam pipe and rolling chart', async ({ page }) => {
  await freezeRender(page, snap({ net: { iface: 'eth0', txBps: 1.2e6, rxBps: 3e6 } }));
  await page.evaluate(() => renderSnapshot((function () { const s = state.last; return { ...s, net: { iface: 'eth0', txBps: 5e6, rxBps: 9e6 } }; })()));
  await expect(page.locator('#net-readout')).toContainText('MB/s');
  const histLen = await page.evaluate(() => state.netHistory.length);
  expect(histLen).toBeGreaterThanOrEqual(2);
  const nonBlank = await page.evaluate(() => {
    const c = document.getElementById('net-chart');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < data.length; i += 4) if (data[i] !== 0) return true;
    return false;
  });
  expect(nonBlank).toBeTruthy();
  // BR-038: network TX/RX route through the steam-pipe network.
  expect(await canvasNonBlank(page, 'pipe-canvas')).toBeTruthy();
  await shot(page, 'T-007');
});

test('T-008 top process tables', async ({ page }) => {
  await expect(page.locator('#cpu-procs tbody tr')).toHaveCount(5, { timeout: 5000 });
  await expect(page.locator('#mem-procs tbody tr')).toHaveCount(5);
  // Each row exposes name, PID and value.
  const firstRow = page.locator('#cpu-procs tbody tr').first().locator('td');
  await expect(firstRow).toHaveCount(3);
  // Re-rank update.
  await freezeRender(page, snap({ procCpu: [
    { name: 'ffmpeg', pid: 7001, cpu: 88 }, { name: 'chrome', pid: 4001, cpu: 30 },
    { name: 'node', pid: 4002, cpu: 20 }, { name: 'code', pid: 4003, cpu: 12 },
    { name: 'python3', pid: 4004, cpu: 8 } ] }));
  await expect(page.locator('#cpu-procs tbody tr').first().locator('td').first()).toHaveText('ffmpeg');
  await shot(page, 'T-008');
});

test('T-009 set custom alert thresholds', async ({ page }) => {
  await openAlerts(page);
  for (const res of ['cpu', 'gpu', 'mem', 'disk', 'net']) {
    await expect(page.locator(`#thr-${res}`)).toHaveAttribute('type', 'range');
  }
  await freezeRender(page, snap({ cpu: { overall: 50, cores: [50, 50, 50, 50, 50, 50, 50, 50], tempC: 60 } }));
  await page.evaluate(() => {
    const i = document.getElementById('thr-cpu');
    i.value = '1'; i.dispatchEvent(new Event('input'));
  });
  await expect(page.locator('#card-cpu')).toHaveClass(/alarm/);
  // Persisted to localStorage.
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('boiler.thresholds')).cpu);
  expect(stored).toBe(1);
  await page.reload();
  await page.click('#btn-alerts');
  await expect(page.locator('#thr-cpu')).toHaveValue('1');
  await shot(page, 'T-009');
  // restore default for later tests within this page context is unnecessary (fresh context per test)
});

test('T-010 alarm on threshold crossing', async ({ page }) => {
  await openAlerts(page);
  await freezeRender(page, snap({ cpu: { overall: 50, cores: [50, 50, 50, 50, 50, 50, 50, 50], tempC: 60 } }));
  await page.evaluate(() => { const i = document.getElementById('thr-cpu'); i.value = '1'; i.dispatchEvent(new Event('input')); });
  await expect(page.locator('#card-cpu')).toHaveClass(/alarm/);
  await expect(page.locator('#lamp-cpu')).toHaveAttribute('data-state', 'critical');
  await shot(page, 'T-010');
  // Auto-clear below threshold.
  await page.evaluate(() => { const i = document.getElementById('thr-cpu'); i.value = '85'; i.dispatchEvent(new Event('input')); });
  await expect(page.locator('#card-cpu')).not.toHaveClass(/alarm/);
  await expect(page.locator('#lamp-cpu')).toHaveAttribute('data-state', 'normal');
  await shot(page, 'T-010b');
});

test('T-011 mobile responsive reflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const furnBox = await page.locator('#panel-furnaces').boundingBox();
  const boilBox = await page.locator('#panel-boilers').boundingBox();
  // Stacked single column: same x, boilers below furnaces.
  expect(Math.abs(furnBox.x - boilBox.x)).toBeLessThan(4);
  expect(boilBox.y).toBeGreaterThan(furnBox.y);
  const noHOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2);
  expect(noHOverflow).toBeTruthy();
  // Keyboard-operable control.
  await openAlerts(page);
  await page.focus('#thr-cpu');
  const before = await page.locator('#thr-cpu').inputValue();
  await page.keyboard.press('ArrowRight');
  const after = await page.locator('#thr-cpu').inputValue();
  expect(after).not.toBe(before);
  await shot(page, 'T-011');
});

test('T-012 tooltip detail on demand', async ({ page }) => {
  await freezeRender(page, snap({ cpu: { overall: 42, cores: [40, 42, 44, 41, 43, 40, 42, 41], tempC: 55 } }));
  const urlBefore = page.url();
  await page.locator('#cpu-flame').hover();
  await expect(page.locator('#tooltip')).toBeVisible();
  await expect(page.locator('#tooltip')).toContainText('42.0%');
  expect(page.url()).toBe(urlBefore); // no navigation
  await shot(page, 'T-012');
  // Move pointer away -> hides.
  await page.mouse.move(5, 5);
  await page.locator('#cpu-flame').dispatchEvent('pointerleave');
  await expect(page.locator('#tooltip')).toBeHidden();
});

test('T-013 reduce motion', async ({ page }) => {
  await page.click('#btn-motion');
  expect(await page.evaluate(() => state.reducedMotion)).toBeTruthy();
  await expect(page.locator('body')).toHaveClass(/reduced-motion/);
  // Data still updates while reduced motion is on.
  await page.evaluate(() => renderSnapshot((function () { const s = DemoSimulator.next(); s.cpu.overall = 63.0; return s; })()));
  await expect(page.locator('#cpu-readout')).toContainText('63.0%');
  // Persisted.
  expect(await page.evaluate(() => localStorage.getItem('boiler.reducedMotion'))).toBe('1');
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/reduced-motion/);
  await shot(page, 'T-013');
});

test('T-014 security baseline', async ({ page }) => {
  // (1) No embedded secrets in client/agent files.
  const build = path.resolve(__dirname, '..', '..', '10-BUILD');
  const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  const agent = fs.readFileSync(path.join(build, 'agent.py'), 'utf8');
  const secretRe = /(password|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]{6,}['"]/i;
  expect(secretRe.test(html)).toBeFalsy();
  expect(secretRe.test(agent)).toBeFalsy();
  // (2) Agent default bind is loopback.
  expect(agent).toMatch(/127\.0\.0\.1/);
  expect(/default\s*=\s*['"]127\.0\.0\.1['"]/.test(agent)).toBeTruthy();
  // (3) Dynamic process names are not HTML-injected.
  await freezeRender(page, snap({ procCpu: [
    { name: '<img src=x onerror=window.__xss=1>', pid: 9999, cpu: 50 },
    { name: 'node', pid: 4002, cpu: 20 }, { name: 'code', pid: 4003, cpu: 12 },
    { name: 'python3', pid: 4004, cpu: 8 }, { name: 'sh', pid: 4005, cpu: 4 } ] }));
  const xss = await page.evaluate(() => window.__xss === 1);
  expect(xss).toBeFalsy();
  const cellText = await page.locator('#cpu-procs tbody tr').first().locator('td').first().textContent();
  expect(cellText).toContain('<img');
  await shot(page, 'T-014');
});

test('T-015 performance baseline', async ({ page }) => {
  // Fresh navigation timing: first populated readout < 3s.
  const start = Date.now();
  await page.goto('/');
  await expect(page.locator('#cpu-readout')).toHaveText(/\d/, { timeout: 3000 });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(3000);
  // Animation pools stay bounded.
  await page.waitForTimeout(2000);
  const caps = await page.evaluate(() => ({
    bubbles: (typeof memBubbles !== 'undefined') ? memBubbles.length : 0,
    vram: (typeof vramBubbles !== 'undefined') ? vramBubbles.length : 0,
    pipes: (typeof pipeParticles !== 'undefined') ? pipeParticles.length : 0,
  }));
  expect(caps.bubbles).toBeLessThanOrEqual(120);
  expect(caps.vram).toBeLessThanOrEqual(120);
  expect(caps.pipes).toBeLessThanOrEqual(120);
  await shot(page, 'T-015');
});

test('T-016 accessibility baseline', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.locator('h2').count()).toBeGreaterThanOrEqual(5);
  // Keyboard focus reaches a control.
  await openAlerts(page);
  await page.focus('#thr-cpu');
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
  expect(focused).toBe('thr-cpu');
  // Body text contrast >= 4.5:1 (--text on --oil).
  const ratio = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const hex = (v) => v.trim().replace('#', '');
    function lum(h) {
      const c = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) / 255)
        .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }
    const L1 = lum(hex(cs.getPropertyValue('--text')));
    const L2 = lum(hex(cs.getPropertyValue('--oil')));
    const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
  await shot(page, 'T-016');
});
