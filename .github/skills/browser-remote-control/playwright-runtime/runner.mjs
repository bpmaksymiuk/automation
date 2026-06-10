import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

function parseArg(name, fallback = undefined) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= process.argv.length) {
    return fallback;
  }
  return process.argv[idx + 1];
}

function asBool(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  return value === "true" || value === "1";
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

const scenarioPath = parseArg("scenario");
if (!scenarioPath) {
  console.error("Missing required argument: --scenario <path>");
  process.exit(1);
}

const headed = asBool(parseArg("headed"), false);
const timeoutMs = Number.parseInt(parseArg("timeoutMs", "10000"), 10);
const input = fs.readFileSync(path.resolve(scenarioPath), "utf8");
const scenario = JSON.parse(input);

if (!Array.isArray(scenario.steps)) {
  console.error("Scenario must include an array: steps");
  process.exit(1);
}

const cliBaseUrl = parseArg("baseUrl");
const baseUrl = cliBaseUrl || scenario.baseUrl || "http://localhost:3000";
const artifactsDir = path.resolve(parseArg("artifactsDir", "./artifacts"));
ensureDir(artifactsDir);

const browser = await chromium.launch({ headless: !headed });
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(timeoutMs);

function normalizeUrl(rawUrl) {
  if (!rawUrl) {
    throw new Error("goto action requires url");
  }
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  return `${baseUrl.replace(/\/$/, "")}/${rawUrl.replace(/^\//, "")}`;
}

try {
  console.log(`Scenario: ${scenario.name || "unnamed"}`);
  console.log(`Base URL: ${baseUrl}`);
  for (let i = 0; i < scenario.steps.length; i += 1) {
    const step = scenario.steps[i];
    const label = `step ${i + 1}/${scenario.steps.length}`;
    console.log(`${label}: ${step.action}`);

    switch (step.action) {
      case "goto": {
        await page.goto(normalizeUrl(step.url), { waitUntil: "domcontentloaded" });
        break;
      }
      case "click": {
        await page.click(step.selector);
        break;
      }
      case "type": {
        await page.fill(step.selector, step.text || "");
        break;
      }
      case "press": {
        await page.keyboard.press(step.key || "Enter");
        break;
      }
      case "waitForSelector": {
        await page.waitForSelector(step.selector);
        break;
      }
      case "waitForTimeout": {
        await page.waitForTimeout(Number(step.ms || 0));
        break;
      }
      case "assertText": {
        const bodyText = await page.locator("body").innerText();
        if (!bodyText.includes(step.text || "")) {
          throw new Error(`assertText failed: '${step.text}' not found`);
        }
        break;
      }
      case "screenshot": {
        const safeName = step.path || `shot-${timestamp()}.png`;
        const outPath = path.resolve(artifactsDir, safeName);
        ensureDir(path.dirname(outPath));
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  wrote: ${outPath}`);
        break;
      }
      default:
        throw new Error(`Unsupported action: ${step.action}`);
    }
  }

  console.log("Scenario finished: PASS");
  await browser.close();
  process.exit(0);
} catch (err) {
  console.error(`Scenario failed: ${err.message}`);
  const failPath = path.resolve(artifactsDir, `failure-${timestamp()}.png`);
  try {
    await page.screenshot({ path: failPath, fullPage: true });
    console.error(`Failure screenshot: ${failPath}`);
  } catch {
    // no-op
  }
  await browser.close();
  process.exit(1);
}
