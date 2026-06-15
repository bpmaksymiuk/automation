// Stage 12 post-deploy smoke spec — The Boiler Room (SystemUsage)
// Lightweight checks runnable against the LIVE deployed URL in either live or
// demo data mode. Captures screenshot evidence for the deployment record.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.resolve(__dirname, '..', 'results', 'smoke', 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

test('S-001 deployed dashboard loads and renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Boiler Room/i);
  await expect(page.locator('h1')).toHaveText(/THE BOILER ROOM/i);
  // All resource panels present (Verdigris redesign layout).
  for (const id of ['#panel-furnaces', '#panel-boilers', '#panel-pipes', '#panel-procs', '#panel-alerts']) {
    await expect(page.locator(id)).toHaveCount(1);
  }
  await page.screenshot({ path: path.join(SHOTS, 'S-001.png') });
});

test('S-002 deployed dashboard shows live data', async ({ page }) => {
  await page.goto('/');
  // Connection indicator reaches a real state (live or demo), not the dash placeholder.
  await expect(page.locator('#conn')).toHaveText(/live|demo/, { timeout: 8000 });
  // Resource readouts populate with numbers.
  for (const id of ['#cpu-readout', '#mem-readout', '#disk-io', '#net-readout']) {
    await expect(page.locator(id)).toHaveText(/\d/, { timeout: 5000 });
  }
  // Process tables fill.
  await expect(page.locator('#cpu-procs tbody tr')).toHaveCount(5, { timeout: 5000 });
  await page.screenshot({ path: path.join(SHOTS, 'S-002.png') });
});

test('S-003 deployed dashboard alert control is operable', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-alerts');
  await expect(page.locator('#panel-alerts')).toBeVisible();
  await expect(page.locator('#thr-cpu')).toHaveAttribute('type', 'range');
  await page.screenshot({ path: path.join(SHOTS, 'S-003.png') });
});
