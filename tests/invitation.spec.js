import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function openInvitation(page) {
  await page.goto("/");
  await page.getByRole("link", { name: "Tap to open" }).click();
  await expect(page.locator("#wedding")).toBeVisible();
}

test("every invitation section uses the supplied background with readable ceremony text", async ({ page }) => {
  await openInvitation(page);
  const sections = page.locator("main > section, footer");
  expect(await sections.count()).toBe(6);
  for (const section of await sections.all()) {
    expect(await section.evaluate(element => getComputedStyle(element).backgroundImage)).toContain("invitation-background");
  }
  const imageLoaded = await page.locator(".invitation").evaluate(async element => {
    const urls = [...getComputedStyle(element).backgroundImage.matchAll(/url\("?([^"\)]+)"?\)/g)];
    const image = new Image();
    image.src = urls[0][1];
    await image.decode();
    return image.naturalWidth === 720 && image.naturalHeight === 1280;
  });
  expect(imageLoaded).toBe(true);
  const contrast = await page.locator(".muhurtham").evaluate(element => {
    function luminance(color) {
      const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(value => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return r * 0.2126 + g * 0.7152 + b * 0.0722;
    }
    const style = getComputedStyle(element);
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => innerWidth));
});

test("invitation renders the approved details without page errors or horizontal overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failedRequests = [];
  page.on("requestfailed", (request) => failedRequests.push(request.url()));
  await openInvitation(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle("Nikhil & Sravanthi | Wedding Invitation");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0C00-\u0C7F]/u);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nikhil&Sravanthi",
  );
  await expect(page.locator(".parents").first()).toHaveText(
    "Are Srinivas & Manjula",
  );
  await expect(page.locator(".parents").last()).toHaveText(
    "Pandula Narsimha & Madhavi",
  );
  await expect(page.locator(".date-card")).toContainText("2026 · SUNDAY");
  await expect(page.locator(".date-card")).toContainText("9:57 AM");
  await expect(
    page.getByRole("heading", { name: "CBS Convention" }),
  ).toBeVisible();
  await expect(page.locator("address")).toContainText(
    "Hyderabad, Telangana 500088",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
  const invitation = await page.locator("#app").boundingBox();
  expect(invitation.width).toBeLessThanOrEqual(480);
  const groom = await page.locator(".family h3").first().boundingBox();
  const bride = await page.locator(".family h3").last().boundingBox();
  expect(bride.y).toBeGreaterThan(groom.y + groom.height);
  expect(
    await page.evaluate(() => document.fonts.check('16px "Manrope"')),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("navigation reaches the venue and directions use the supplied map", async ({
  page,
}) => {
  await openInvitation(page);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Venue", exact: true })
    .click();
  await expect(page).toHaveURL(/#venue$/);
  const directions = page.getByRole("link", { name: "Get directions" });
  await expect(directions).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/dKanwQshRjnfzxzs5",
  );
  await expect(directions).toHaveAttribute("target", "_blank");
  await expect(directions).toHaveAttribute("rel", "noopener noreferrer");
  await expect(directions).toBeInViewport();
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Venue", exact: true }),
  ).toHaveAttribute("aria-current", "location");
});

test("navigation returns for keyboard use and stays visible during section jumps", async ({ page, isMobile }) => {
  await openInvitation(page);
  const dock = page.locator(".invitation-dock");
  if (isMobile) {
    const client = await page.context().newCDPSession(page);
    const { width, height } = page.viewportSize();
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: width / 2, y: height * .7 }] });
    for (const fraction of [.6, .5, .4, .3]) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: width / 2, y: height * fraction }] });
      await page.waitForTimeout(40);
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.mouse.wheel(0, 500);
  }
  await expect(dock).toHaveAttribute("aria-hidden", "true");
  expect(await dock.evaluate(element => element.inert)).toBe(true);
  await page.keyboard.press("Tab");
  await expect(dock).toHaveAttribute("aria-hidden", "false");
  expect(await dock.evaluate(element => element.inert)).toBe(false);
  await dock.getByRole("link", { name: "Venue", exact: true }).click();
  await expect(page.getByRole("link", { name: "Get directions" })).toBeInViewport();
  await expect(dock).toHaveAttribute("aria-hidden", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await dock.evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");
});

test("full-photo viewer shows the original portrait and returns keyboard focus when dismissed", async ({
  page,
}) => {
  await openInvitation(page);
  const openPhoto = page.getByRole("button", { name: "View full photograph" });
  const names = await page.locator("#couple-name").boundingBox();
  const photo = await page.locator(".hero-photo").boundingBox();
  expect(names.y).toBeGreaterThan(photo.y);
  expect(names.y + names.height).toBeLessThan(photo.y + photo.height);
  expect(names.x).toBeGreaterThanOrEqual(photo.x);
  expect(names.x + names.width).toBeLessThanOrEqual(photo.x + photo.width);
  await openPhoto.click();
  const dialog = page.getByRole("dialog", {
    name: "Nikhil and Sravanthi photograph",
  });
  await expect(dialog).toBeVisible();
  const portrait = dialog.getByRole("img", {
    name: "Nikhil and Sravanthi, full portrait",
  });
  await expect
    .poll(() =>
      portrait.evaluate(
        (image) =>
          image.complete &&
          image.naturalWidth === 891 &&
          image.naturalHeight === 1280,
      ),
    )
    .toBe(true);
  expect(
    await portrait.evaluate((image) => getComputedStyle(image).objectFit),
  ).toBe("contain");
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(openPhoto).toBeFocused();
  await openPhoto.click();
  await page.getByRole("button", { name: "Close photograph" }).click();
  await expect(dialog).not.toBeVisible();
});

test("reduced-motion preference keeps content visible without entrance animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openInvitation(page);
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains("motion-ready"),
    ),
  ).toBe(false);
  expect(
    await page
      .locator(".hero-content")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Invitation", exact: true })
    .click();
  const invitation = page.getByRole("heading", {
    name: "Your presence, our joy. Your blessings, our gift.",
  });
  await expect(invitation).toBeInViewport();
  expect(
    await invitation.evaluate((element) => getComputedStyle(element).opacity),
  ).toBe("1");
});

test("calendar download contains the ceremony time in India and complete venue", async ({
  page,
}) => {
  await openInvitation(page);
  const pendingDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add to calendar" }).click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("Nikhil-and-Sravanthi-Wedding.ics");
  const content = await readFile(await download.path(), "utf8");
  const unfolded = content.replace(/\r\n /g, "");
  expect(unfolded).toContain("DTSTART:20261115T042700Z");
  expect(unfolded).toContain("SUMMARY:Nikhil & Sravanthi Wedding");
  expect(unfolded).toContain("LOCATION:CBS Convention");
  expect(unfolded).toContain("Hyderabad\\, Telangana 500088");
  expect(unfolded).toContain("END:VCALENDAR");
  expect(
    content.split("\r\n").every((line) => Buffer.byteLength(line) <= 75),
  ).toBe(true);
  await expect(page.getByRole("status")).toContainText(
    "Your calendar file is ready",
  );
});

test("countdown follows the India ceremony time and remains valid after the wedding", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-11-14T04:27:00Z"));
  await openInvitation(page);
  await expect(page.locator("#days")).toHaveText("01");
  await expect(page.locator("#hours")).toHaveText("00");
  await expect(page.locator("#minutes")).toHaveText("00");
  await page.clock.setFixedTime(new Date("2026-11-16T04:27:00Z"));
  await expect(page.locator("#days")).toHaveText("00");
  await expect(page.locator("#countdown-label")).toHaveText(
    "Our new journey has begun.",
  );
});
