import { test, expect } from "@playwright/test";

test("temple card fills the landing screen and opens the invitation once", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#opening");
  const artwork = page.locator(".temple-image");
  await expect(artwork).toBeVisible();
  await expect.poll(() => artwork.evaluate(image => image.complete && image.naturalWidth === 941 && image.naturalHeight === 1672)).toBe(true);
  const cardBounds = await card.boundingBox();
  expect(cardBounds.y).toBe(0);
  expect(cardBounds.height).toBe(await page.evaluate(() => innerHeight));
  expect(cardBounds.width).toBeLessThanOrEqual(480);
  await expect(page.locator("#opening-title")).toContainText("Nikhil");
  await expect(page.locator("#opening-title")).toContainText("Sravanthi");
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".invitation-dock").evaluate(nav => nav.inert)).toBe(true);
  const enter = page.getByRole("link", { name: "Open our invitation" });
  await enter.click();
  await expect(enter).toHaveAttribute("aria-busy", "true");
  await expect(page).toHaveURL(/#wedding$/);
  await expect(card).toHaveAttribute("data-opened", "true");
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(enter).toBeInViewport();
  await enter.click();
  await expect(card).not.toHaveClass(/is-opening/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("reduced motion disables all opening effects and supports keyboard entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [".temple-artwork", ".petal", ".lamp-glow", ".floor-shimmer"]) {
    expect(await page.locator(selector).first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  }
  const enter = page.getByRole("link", { name: "Open our invitation" });
  await enter.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#wedding$/);
  await expect(page.locator("#opening")).not.toHaveClass(/is-opening/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("guests can scroll past the opening without tapping or being locked in", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  await page.mouse.wheel(0, 1150);
  await expect(page.locator("#opening")).toHaveAttribute("data-opened", "true");
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
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0C00-\u0C7F]/u);
});
