import fs from "node:fs";
import path from "node:path";

export function ensureResultsDir(resultsDir) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

export function writeEvidence(resultsDir, testId, message) {
  const name = `${testId}-${message.slug}.txt`;
  const fullPath = path.join(resultsDir, name);
  const body = [
    `TEST ID: ${testId}`,
    `TIMESTAMP: ${new Date().toISOString()}`,
    `RESULT: PASS`,
    `DETAIL: ${message.detail}`
  ].join("\n");
  fs.writeFileSync(fullPath, body, "utf8");
  return fullPath;
}
