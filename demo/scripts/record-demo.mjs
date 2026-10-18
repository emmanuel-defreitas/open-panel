// Requires existing playwright-core, Chromium, and ffmpeg. See docs/demo-recording.md.
import { mkdir, mkdtemp, copyFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright-core");
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = resolve(root, "docs/assets");
const frames = await mkdtemp(join(tmpdir(), "open-panel-demo-"));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
try {
  await mkdir(output, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1120, height: 700 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${process.env.DEMO_URL || "http://127.0.0.1:5314/"}#playground`);
  await page.locator('[role="tab"]').first().waitFor();
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.fonts.ready);
  // Captions describe real interactions; no UI state is simulated.
  await page.evaluate(() => {
    const caption = document.createElement("div");
    caption.id = "recording-caption";
    caption.style.cssText =
      "position:fixed;inset-block-end:50px;inset-inline-start:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;background:#101114;color:#fff;font:500 16px system-ui;z-index:99999;pointer-events:none;box-shadow:0 2px 14px #0005";
    document.body.append(caption);
  });
  let frame = 0;
  const shot = () => page.screenshot({ path: join(frames, `${String(frame++).padStart(4, "0")}.png`) });
  const hold = async (caption, count = 12) => {
    await page.locator("#recording-caption").evaluate((el, text) => (el.textContent = text), caption);
    for (let i = 0; i < count; i++) await shot();
  };
  await hold("One workspace. Independent views.");
  await copyFile(join(frames, "0000.png"), join(output, "demo-static.png"));
  await page.locator('[role="tab"][data-view="panel-3"]').click();
  await page.getByRole("button", { name: "Maximize", exact: true }).click();
  await page.waitForTimeout(400);
  await hold("Focus on a panel.");
  const scroller = page.locator('[data-open-panel-part="content"]:visible').first();
  await page
    .locator("#recording-caption")
    .evaluate((el) => (el.textContent = "Scroll content beneath a fixed header."));
  for (let i = 0; i < 16; i++) {
    await scroller.evaluate((el, y) => (el.scrollTop = y), i * 30);
    await shot();
  }
  await page.getByRole("button", { name: "Restore layout", exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Float / dock", exact: true }).click();
  await page.waitForTimeout(400);
  await hold("Float a view out of the layout.");
  await page.getByRole("button", { name: "Float / dock", exact: true }).click();
  await page.getByLabel("Color theme", { exact: true }).selectOption("light");
  await page.waitForTimeout(300);
  await hold("Choose a theme. Make it your own.", 16);
  await page.getByRole("button", { name: "Reset layout", exact: true }).click();
  await page.getByLabel("Color theme", { exact: true }).selectOption("dark");
  await page.waitForTimeout(300);
  await hold("One workspace. Independent views.", 8);
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      "8",
      "-i",
      join(frames, "%04d.png"),
      "-filter_complex",
      "[0:v]fps=4,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none",
      "-loop",
      "0",
      join(output, "demo.gif"),
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) throw Error(result.stderr || result.error?.message);
  console.log(`Recorded ${frame} frames at 8 fps to docs/assets/demo.gif`);
} finally {
  await browser.close();
  await rm(frames, { recursive: true, force: true });
}
