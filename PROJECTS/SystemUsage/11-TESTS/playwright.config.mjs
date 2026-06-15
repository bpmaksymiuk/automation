// Stage 11 Playwright configuration — The Boiler Room (SystemUsage)
// Runs a VISIBLE (headed) Chromium against the live metrics agent.
import { defineConfig } from '@playwright/test';

const AGENT = '/home/danio/PROJECTS/automation/PROJECTS/SystemUsage/10-BUILD/agent.py';
const PORT = 8079;

export default defineConfig({
  testDir: './specs',
  outputDir: './results/full/playwright-artifacts',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['list'],
    ['json', { outputFile: './results/full/report.json' }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `python3 ${AGENT} --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/api/metrics`,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
