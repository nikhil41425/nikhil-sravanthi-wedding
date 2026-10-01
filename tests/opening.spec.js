import { test, expect } from "@playwright/test";

test("edge-to-edge temple card plays its entrance animation and reveals the invitation", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#opening");
  const artwork = page.locator(".temple-image");
  await expect(artwork).toBeVisible();
  await expect.poll(() => artwork.evaluate(image => image.complete && image.naturalWidth === 941 && image.naturalHeight === 1672)).toBe(true);
  const cardBounds = await card.boundingBox();
  expect(cardBounds.y).toBe(0);
  expect(cardBounds.height).toBe(await page.evaluate(() => innerHeight));
  expect(cardBounds.width).toBeLessThanOrEqual(480);
  const imageBounds = await artwork.boundingBox();
  expect(imageBounds.x).toBeLessThanOrEqual(cardBounds.x);
  expect(imageBounds.x + imageBounds.width).toBeGreaterThanOrEqual(cardBounds.x + cardBounds.width);
  expect(imageBounds.y).toBeLessThanOrEqual(cardBounds.y);
  expect(imageBounds.y + imageBounds.height).toBeGreaterThanOrEqual(cardBounds.y + cardBounds.height);
  await expect(page.locator("#opening-title")).toContainText("Nikhil");
  await expect(page.locator("#opening-title")).toContainText("Sravanthi");
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".invitation-dock").evaluate(nav => nav.inert)).toBe(true);
  await expect(page.locator("#wedding")).toBeHidden();
  expect(await page.locator("body").innerText()).not.toMatch(/swipe|scroll/i);
  const enter = page.getByRole("link", { name: "Tap to open" });
  await enter.click();
  await expect(enter).toHaveAttribute("aria-busy", "true");
  expect(await page.locator('.temple-artwork').evaluate(element => getComputedStyle(element).animationName)).toBe('temple-enter');
  expect(await page.locator('.opening-ripple').evaluate(element => getComputedStyle(element).animationName)).toBe('entrance-ripple');
  await expect(page.locator("#wedding")).toBeHidden();
  await expect(page.locator(".opening-name-reveal")).toHaveCount(0);
  await expect(page.locator("#wedding")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(card).toHaveAttribute("data-opened", "true");
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(card).toBeHidden();
  await expect(page.locator("#wedding")).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
});

test("reduced motion disables all opening effects and supports keyboard and touch entry", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [".temple-artwork", ".petal", ".lamp-glow", ".floor-shimmer"]) {
    expect(await page.locator(selector).first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  }
  const enter = page.getByRole("link", { name: "Tap to open" });
  await enter.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#wedding")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#opening")).not.toHaveClass(/is-opening/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  if (isMobile) {
    await page.reload();
    await page.getByRole("link", { name: "Tap to open" }).tap();
    await expect(page.locator("#wedding")).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    expect((await page.locator("#home").boundingBox()).y).toBe(0);
  }
});

test("scrolling cannot bypass tap entry and works normally after opening", async ({ page, isMobile }) => {
  await page.goto("/");
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  await page.mouse.wheel(0, 1150);
  if (isMobile) {
    const client = await page.context().newCDPSession(page);
    const { width, height } = page.viewportSize();
    await client.send("Input.dispatchTouchEvent", {type:"touchStart", touchPoints:[{x:width / 2, y:height * .8}]});
    await client.send("Input.dispatchTouchEvent", {type:"touchMove", touchPoints:[{x:width / 2, y:height * .2}]});
    await client.send("Input.dispatchTouchEvent", {type:"touchEnd", touchPoints:[]});
  }
  await page.keyboard.press("PageDown");
  await page.evaluate(() => window.scrollTo({top: 1150, behavior: "instant"}));
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("#opening")).toHaveAttribute("data-opened", "false");
  await expect(page.locator("#wedding")).toBeHidden();
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
  const enter = page.getByRole("link", {name:"Tap to open"});
  if (isMobile) await enter.tap();
  else await enter.click();
  await expect(page.locator("#wedding")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  await page.mouse.wheel(0, 1150);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "false");
  expect(await page.locator(".invitation-dock").evaluate(nav => nav.inert)).toBe(false);
  await page.getByRole("navigation").getByRole("link", { name: "Venue", exact: true }).click();
  await expect(page).toHaveURL(/#venue$/);
  await expect(page.getByRole("link", { name: "Get directions" })).toBeInViewport();
});

test("a direct venue link bypasses the opening card", async ({ page }) => {
  await page.goto("/#venue");
  await expect(page.getByRole("link", { name: "Get directions" })).toBeInViewport();
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#opening")).toHaveAttribute("data-opened", "true");
  await expect(page.locator("#opening")).not.toHaveClass(/is-opening/);
  await expect(page.locator("#opening")).toBeHidden();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0C00-\u0C7F]/u);
});

test("old entry links and refreshes show the temple image again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const hash of ["#wedding", "#home"]) {
    await page.goto(`/${hash}`);
    await expect(page.locator("#opening")).toBeVisible();
    await expect(page.locator("#wedding")).toBeHidden();
    await expect.poll(() => page.locator(".temple-image").evaluate(image => image.complete && image.naturalWidth === 941)).toBe(true);
    await page.getByRole("link", { name: "Tap to open" }).click();
    await expect(page.locator("#wedding")).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await page.reload();
    await expect(page.locator("#opening")).toBeVisible();
    await expect(page.locator("#wedding")).toBeHidden();
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});
