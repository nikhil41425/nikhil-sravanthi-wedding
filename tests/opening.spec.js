import { test, expect } from "@playwright/test";

test("full-screen envelope card plays its opening animation and reveals the invitation", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#opening");
  const envelope = page.locator(".envelope");
  await expect(envelope).toBeVisible();
  await expect(page.locator(".envelope-seal")).toContainText("N&S");
  const cardBounds = await card.boundingBox();
  expect(cardBounds.y).toBe(0);
  expect(cardBounds.height).toBe(await page.evaluate(() => innerHeight));
  expect(cardBounds.width).toBeLessThanOrEqual(480);
  const envelopeBounds = await envelope.boundingBox();
  expect(envelopeBounds.x).toBeGreaterThanOrEqual(cardBounds.x);
  expect(envelopeBounds.x + envelopeBounds.width).toBeLessThanOrEqual(cardBounds.x + cardBounds.width);
  await expect(page.locator("#opening-title")).toContainText("Nikhil");
  await expect(page.locator("#opening-title")).toContainText("Sravanthi");
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".invitation-dock").evaluate(nav => nav.inert)).toBe(true);
  await expect(page.locator("#wedding")).toBeHidden();
  const halo = page.locator(".seal-halo");
  expect(await halo.evaluate(element => getComputedStyle(element).animationIterationCount)).toBe("infinite");
  expect(await halo.evaluate(element => getComputedStyle(element).animationPlayState)).toBe("running");
  expect(await page.locator("body").innerText()).not.toMatch(/swipe|scroll/i);
  const enter = page.getByRole("link", { name: "Tap to open" });
  await expect(enter).toBeInViewport({ ratio: 1 });
  await expect(page.locator(".opening-actions a")).toHaveCount(0);
  await enter.click();
  await expect(enter).toHaveAttribute("aria-busy", "true");
  expect(await page.locator(".envelope-seal").evaluate(element => getComputedStyle(element).animationName)).toBe("envelope-seal-break");
  expect(await page.locator(".envelope-flap").evaluate(element => getComputedStyle(element).animationName)).toBe("envelope-flap-open");
  expect(await page.locator(".envelope-card").evaluate(element => getComputedStyle(element).animationName)).toBe("envelope-card-rise");
  expect(await page.locator(".opening-flash").evaluate(element => getComputedStyle(element).animationName)).toBe("opening-to-paper");
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
  for (const selector of [".envelope", ".envelope-seal", ".envelope-flap", ".envelope-card", ".seal-halo", ".petal"]) {
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
  await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".invitation-dock").evaluate(nav => nav.inert)).toBe(true);
  await page.mouse.wheel(0, -120);
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

test("refreshing any invitation section returns to tap-only entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Tap to open" }).click();
  for (const [label, hash] of [["Invitation", "invitation"], ["Ceremony", "muhurtham"], ["Venue", "venue"]]) {
    await page.getByRole("navigation").getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    if (hash === "invitation") expect(await page.evaluate(() => scrollY)).toBe(0);
    else await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await page.reload();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#opening")).toBeVisible();
    await expect(page.locator("#wedding")).toBeHidden();
    await expect(page.locator(".invitation-dock")).toHaveAttribute("aria-hidden", "true");
    expect(await page.evaluate(() => scrollY)).toBe(0);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.getByRole("link", { name: "Tap to open" }).click();
    await expect(page.locator("#wedding")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});

test("old entry links and refreshes show the envelope card again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const hash of ["#wedding", "#home"]) {
    await page.goto(`/${hash}`);
    await expect(page.locator("#opening")).toBeVisible();
    await expect(page.locator("#wedding")).toBeHidden();
    await expect(page.locator(".envelope")).toBeVisible();
    await page.getByRole("link", { name: "Tap to open" }).click();
    await expect(page.locator("#wedding")).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await page.reload();
    await expect(page.locator("#opening")).toBeVisible();
    await expect(page.locator("#wedding")).toBeHidden();
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});
