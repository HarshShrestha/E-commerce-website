import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
const output = new URL("../test-results/", import.meta.url).pathname;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const checks = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    await page.goto("http://localhost:5173/");
    await page.locator(".home-grid .product-card").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.locator(".home-grid").first().locator(".product-card").count(),
      10,
    );
    assert.equal(await page.locator(".bestsellers .product-card").count(), 5);
    assert.match(
      await page.locator(".site-header .brand-art").getAttribute("src"),
      /original-logo/,
    );
    assert.equal(
      await page.getByRole("heading", { name: "Latest Arrivals" }).count(),
      1,
    );
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState === "finished" ||
            animation.playState === "idle",
        ),
    );
    await page
      .locator(".bestsellers .reveal-card")
      .first()
      .scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const animated = await page.evaluate(() =>
      document.getAnimations().map((animation) => animation.effect.getTiming()),
    );
    assert.ok(
      animated.every((timing) => timing.iterations === 1),
      "No looping animations",
    );
    assert.ok(
      animated.every((timing) => Number(timing.duration) <= 1100),
      "All motion is short and bounded",
    );
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState === "finished" ||
            animation.playState === "idle",
        ),
    );
    await page.locator(".our-policy").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState === "finished" ||
            animation.playState === "idle",
        ),
    );
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState === "finished" ||
            animation.playState === "idle",
        ),
    );
    // Scrolling back to a revealed section must not trigger repeated reveals.
    await page.locator(".bestsellers").scrollIntoViewIfNeeded();
    const cards = await page
      .locator(".bestsellers .reveal-card")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          opacity: getComputedStyle(node).opacity,
          active: node.getAnimations().length,
        })),
      );
    assert.ok(cards.every((card) => card.opacity === "1" && card.active === 0));
    await page.evaluate(() => {
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
    });
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      ),
    );
    assert.equal(
      await page
        .locator(".home-grid")
        .first()
        .evaluate(
          (node) =>
            getComputedStyle(node).gridTemplateColumns.split(" ").length,
        ),
      width === 1440 ? 5 : 2,
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState === "finished" ||
            animation.playState === "idle",
        ),
    );
    await page.screenshot({
      path: output + `restored-home-${width}.png`,
      fullPage: true,
    });
    checks.push(
      `${width}px: original structure, 10 latest/5 bestsellers, finite once-only reveals`,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await page.locator(".home-grid .product-card").first().waitFor();
    const reduced = await page.evaluate(() => ({
      active: document.getAnimations().length,
      hidden: [...document.querySelectorAll("[data-reveal]")].filter(
        (node) =>
          getComputedStyle(node).opacity !== "1" ||
          getComputedStyle(node).visibility === "hidden",
      ).length,
      scrollWidth: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    assert.equal(reduced.active, 0, "Reduced motion disables all animation");
    assert.equal(reduced.hidden, 0, "Reduced motion never hides content");
    assert.ok(reduced.scrollWidth <= reduced.width + 1);
    checks.push(
      `${width}px: reduced motion has no active animations, hidden content or page overflow`,
    );
    await context.close();
  }
  writeFileSync(
    output + "motion-summary.json",
    JSON.stringify({ passed: true, checks }, null, 2),
  );
  console.log("PASS: " + checks.join("; "));
} finally {
  await browser.close();
}
