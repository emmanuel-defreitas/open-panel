const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright-core");
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const page = await browser.newPage({
  viewport: { width: 1360, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(process.env.DEMO_URL || "http://127.0.0.1:5314/");
await page.getByRole("heading", { name: "Open Panel", exact: true }).waitFor();
await page.getByRole("button", { name: "Moss", exact: true }).click();
assert.equal(
  await page
    .locator(".docs-workspace .open-panel")
    .evaluate((e) => getComputedStyle(e).getPropertyValue("--open-panel-panel").trim()),
  "#1c2925",
);
await page.getByLabel("Accent", { exact: true }).fill("#ffcc88");
assert.match(await page.locator(".docs-code").first().innerText(), /#ffcc88/);
await page.getByRole("button", { name: "Copy CSS · load after the package stylesheet", exact: true }).click();
assert.match(await page.evaluate(() => navigator.clipboard.readText()), /#ffcc88/);

await page.setViewportSize({ width: 390, height: 844 });
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
assert.equal(await page.locator(".docs-workspace [data-open-panel-part=panel][data-frame-only]").count(), 0);

await page.getByRole("link", { name: "Playground ↗", exact: true }).click();
await page.locator(".demo-workspace").waitFor();
await page.getByRole("link", { name: "Docs ↗", exact: true }).click();
await page.locator(".docs-page").waitFor();
assert.deepEqual(errors, []);
console.log(
  "Passed: live tokens, generated CSS, clipboard, 390px viewport, docs/playground navigation, no page errors.",
);
await browser.close();
