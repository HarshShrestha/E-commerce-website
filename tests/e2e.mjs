import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const output = new URL("../test-results/", import.meta.url).pathname;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const results = [],
  errors = [];
let page;
async function snap(name) {
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((img) => {
      img.loading = "eager";
    });
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
  });
  await page.evaluate(() => document.fonts.ready);
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
          animation.playState === "finished" || animation.playState === "idle",
      ),
  );
  await page.screenshot({ path: output + name + ".png", fullPage: true });
  const layout = await page.evaluate(() => ({
    width: innerWidth,
    content: document.documentElement.scrollWidth,
    broken: [...document.images]
      .filter((x) => x.complete && x.naturalWidth === 0)
      .map((x) => x.src),
  }));
  assert.ok(
    layout.content <= layout.width + 1,
    `${name}: horizontal overflow ${JSON.stringify(layout)}`,
  );
  assert.equal(layout.broken.length, 0, `${name}: broken images`);
  results.push(name);
}
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      colorScheme: "light",
    });
    page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    const suffix = width === 390 ? "mobile" : "desktop";
    await page.goto("http://localhost:5173/");
    await page
      .getByRole("link", { name: "Women Round Neck Cotton Top", exact: false })
      .first()
      .waitFor();
    await snap(`home-${suffix}`);
    await page
      .getByRole("button", {
        name: "Save Women Round Neck Cotton Top to favorites",
        exact: true,
      })
      .first()
      .click();
    await page.getByRole("link", { name: /Favorites, 1 saved items/ }).click();
    await page.locator(".product-card").first().waitFor();
    await snap(`favorites-${suffix}`);
    await page.reload();
    await page
      .getByRole("button", {
        name: "Remove Women Round Neck Cotton Top from favorites",
        exact: true,
      })
      .first()
      .waitFor();
    await page
      .getByRole("button", {
        name: "Remove Women Round Neck Cotton Top from favorites",
        exact: true,
      })
      .first()
      .click();
    await page
      .getByRole("heading", { name: "Save something you love." })
      .waitFor();
    await snap(`favorites-empty-${suffix}`);

    for (const route of [
      "collection",
      "about",
      "contact",
      "login",
      "cart",
      "not-found",
    ]) {
      await page.goto(`http://localhost:5173/${route}`);
      await page.waitForTimeout(250);
      await snap(`${route}-${suffix}`);
    }
    await page.goto("http://localhost:5173/collection");
    await page
      .getByRole("searchbox", { name: "Search products" })
      .fill("Round Neck");
    await page.getByLabel("Sort by").selectOption("low");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".product-card").length > 0 &&
        document.querySelectorAll(".product-card").length < 52,
    );
    assert.equal(await page.getByRole("searchbox").inputValue(), "Round Neck");
    await page.waitForFunction(() => {
      const prices = [
        ...document.querySelectorAll(".product-meta > span:last-child"),
      ].map((x) => Number(x.textContent.replace(/[^0-9.]/g, "")));
      return (
        prices.length > 0 &&
        prices.every((n, i) => i === 0 || prices[i - 1] <= n)
      );
    });
    const prices = await page
      .locator(".product-meta > span:last-child")
      .allTextContents();
    const values = prices.map((x) => Number(x.replace(/[^0-9.]/g, "")));
    assert.deepEqual(
      values,
      [...values].sort((a, b) => a - b),
      "Price sorting must persist with search",
    );
    if (width === 390)
      await page.getByRole("button", { name: "Filters", exact: true }).click();
    await page.getByRole("radio", { name: "Women", exact: true }).click();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".product-meta > span:first-child")].every(
        (x) => x.textContent.startsWith("Women"),
      ),
    );
    await page.waitForFunction(
      () =>
        document.querySelector('input[type="search"]').value === "Round Neck" &&
        [...document.querySelectorAll(".product-card h3")].every((x) =>
          x.textContent.toLowerCase().includes("round neck"),
        ),
    );
    assert.ok(
      new URL(page.url()).searchParams.get("q") === "Round Neck",
      "Category changes must preserve the search",
    );
    await snap(`collection-filtered-${suffix}`);
    await page.getByRole("searchbox").fill("not-an-existing-product");
    await page
      .getByRole("heading", { name: "No matches this time." })
      .waitFor();
    await snap(`collection-empty-${suffix}`);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.locator(".product-card").first().click();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    await page.getByRole("alert").waitFor();
    await snap(`product-validation-${suffix}`);
    await page.getByRole("button", { name: "S", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    await page
      .getByRole("link", { name: "View your bag", exact: true })
      .click();
    await page.getByRole("heading", { name: "Shopping bag (1)" }).waitFor();
    await snap(`cart-filled-${suffix}`);
    await page.reload();
    await page.getByRole("heading", { name: "Shopping bag (1)" }).waitFor();
    assert.equal(await page.getByRole("spinbutton").inputValue(), "1");
    await page.getByRole("spinbutton").fill("2");
    await page.getByRole("link", { name: "Continue to checkout" }).click();
    await page.getByRole("button", { name: "Create an account" }).click();
    await page.getByLabel("Full name").fill("Demo Shopper");
    await page
      .getByLabel("Email address", { exact: true })
      .fill(`demo-${suffix}-${Date.now()}@example.com`);
    await page
      .getByLabel("Password", { exact: true })
      .fill("demo-shopper-password");
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await page.getByRole("heading", { name: "Make it yours." }).waitFor();
    await snap(`checkout-${suffix}`);
    for (const [label, value] of Object.entries({
      "First name": "Demo",
      "Last name": "Shopper",
      "Email address": "shopper@example.com",
      "Phone number": "+1 202 555 0199",
      "Street address": "123 Example Street",
      City: "Example City",
      "State / Province": "Example State",
      "ZIP / Postal code": "12345",
      Country: "US",
    }))
      await page.getByLabel(label, { exact: true }).fill(value);
    await page
      .getByRole("button", { name: "Place order", exact: true })
      .click();
    await page.getByRole("heading", { name: "Your orders." }).waitFor();
    await page.locator(".order-card").waitFor();
    await snap(`orders-${suffix}`);
    if (width === 390) {
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await snap("mobile-navigation");
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5174");
  await snap("admin-login-desktop");
  await page
    .getByLabel("Email address")
    .fill(process.env.TEST_ADMIN_EMAIL || "admin@example.com");
  await page
    .getByLabel("Password")
    .fill(
      process.env.TEST_ADMIN_PASSWORD || "replace-with-a-long-unique-password",
    );
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await page.getByRole("heading", { name: "Product collection" }).waitFor();
  await page.locator("tbody tr").first().waitFor();
  await snap("admin-products-desktop");
  await page.getByRole("link", { name: "Orders", exact: false }).click();
  await page.locator(".order").first().waitFor();
  await snap("admin-orders-desktop");
  await page
    .getByLabel(/Status for order/)
    .first()
    .selectOption("Shipped");
  await page.waitForTimeout(250);
  await page.getByRole("link", { name: "Add product", exact: false }).click();
  await snap("admin-add-desktop");
  await page.setViewportSize({ width: 390, height: 1000 });
  await snap("admin-add-mobile");
  await page.getByRole("link", { name: "Products", exact: false }).click();
  await page.locator("tbody tr").first().waitFor();
  await snap("admin-products-mobile");
  await page.getByRole("link", { name: "Orders", exact: false }).click();
  await page.locator(".order").first().waitFor();
  await snap("admin-orders-mobile");
  await context.close();
  const errorContext = await browser.newContext({
    viewport: { width: 390, height: 1000 },
  });
  page = await errorContext.newPage();
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("http://localhost:5173/collection");
  await page
    .getByRole("heading", { name: "We couldn’t load the collection." })
    .waitFor();
  await snap("collection-network-error-mobile");
  await errorContext.close();
  const dark = await browser.newContext({
    viewport: { width: 390, height: 1000 },
    colorScheme: "dark",
  });
  page = await dark.newPage();
  await page.goto("http://localhost:5173/");
  await page.locator(".product-card").first().waitFor();
  await snap("home-preferred-dark-mobile");
  await page.goto("http://localhost:5173/contact");
  await page.locator("summary").first().click();
  await snap("contact-expanded-dark-mobile");
  await dark.close();
  assert.deepEqual(errors, [], `Browser exceptions: ${errors.join("; ")}`);
  writeFileSync(
    output + "e2e-summary.json",
    JSON.stringify(
      { passed: true, screenshots: results, browserErrors: errors },
      null,
      2,
    ),
  );
  console.log(
    `PASS: shopping flows at 1440px and 390px; admin flows; ${results.length} screenshots; no browser exceptions or page overflow.`,
  );
} finally {
  await browser.close();
}
