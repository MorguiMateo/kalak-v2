/**
 * Mobile Lighthouse against a freshly started production build, sequentially per route.
 * Install tools outside the app: npm install --prefix /tmp/kalak-audit lighthouse
 * Run: KALAK_AUDIT_TOOLS=/tmp/kalak-audit CHROME_PATH=/path/to/chrome node scripts/audit-lighthouse.mjs [devtools|simulate]
 * DevTools applies real network/CPU throttling; simulate is Lighthouse's default modeled score.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(resolve(process.env.KALAK_AUDIT_TOOLS ?? ".", "package.json"));
const { default: lighthouse } = await import(pathToFileURL(require.resolve("lighthouse")).href);
const { launch } = await import(pathToFileURL(require.resolve("chrome-launcher")).href);
const base = process.env.AUDIT_BASE_URL ?? "http://localhost:4402";
const throttlingMethod = process.argv[2] ?? "devtools";
assert(["devtools", "simulate"].includes(throttlingMethod));
const results = [];

for (const route of ["/", "/calcula-racion"]) {
  const chrome = await launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ["--headless", "--no-sandbox"] });
  try {
    const { lhr } = await lighthouse(base + route, {
      port: chrome.port,
      logLevel: "error",
      formFactor: "mobile",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      throttlingMethod,
    });
    assert(!lhr.runtimeError, lhr.runtimeError?.message);
    const metrics = {};
    for (const key of ["first-contentful-paint", "largest-contentful-paint", "speed-index", "total-blocking-time", "cumulative-layout-shift"]) {
      metrics[key] = lhr.audits[key].numericValue;
    }
    const requests = lhr.audits["network-requests"].details.items;
    results.push({
      route,
      auditedAt: lhr.fetchTime,
      lighthouseVersion: lhr.lighthouseVersion,
      browser: lhr.environment.hostUserAgent,
      settings: {
        formFactor: lhr.configSettings.formFactor,
        throttlingMethod: lhr.configSettings.throttlingMethod,
        throttling: lhr.configSettings.throttling,
        screenEmulation: lhr.configSettings.screenEmulation,
      },
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
      metrics,
      transferredBytes: requests.reduce((sum, request) => sum + request.transferSize, 0),
      scriptTransferredBytes: requests.filter((request) => request.resourceType === "Script").reduce((sum, request) => sum + request.transferSize, 0),
      failedRequests: requests.filter((request) => request.statusCode >= 400).map(({ url, statusCode }) => ({ url, statusCode })),
    });
  } finally {
    await chrome.kill();
  }
}
console.log(JSON.stringify({ base, results }, null, 2));
