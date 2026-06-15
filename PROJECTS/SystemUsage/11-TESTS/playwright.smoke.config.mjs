// Stage 12 post-deploy smoke configuration — The Boiler Room (SystemUsage)
// Targets the LIVE deployed URL (no webServer is started here). DEPLOY_URL is
// sourced from the environment (set by deploy/run-smoke wrapper from .env.deploy).
import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPLOY_URL = process.env.DEPLOY_URL;

if (!DEPLOY_URL) {
  throw new Error('DEPLOY_URL is not set. Source .env.deploy (DEPLOY_URL=...) before running smoke tests.');
}

export default defineConfig({
  testDir: path.join(__dirname, 'specs'),
  testMatch: '**/smoke.spec.mjs',
  outputDir: path.join(__dirname, 'results', 'smoke', 'playwright-artifacts'),
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(__dirname, 'results', 'smoke', 'report.json') }],
  ],
  use: {
    baseURL: DEPLOY_URL,
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  // No webServer: the live deployed site is the target.
});
