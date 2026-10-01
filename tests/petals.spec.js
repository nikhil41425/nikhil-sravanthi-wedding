import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";

// Exercise actual WebGL rendering on cloud workers without a physical GPU.
test.use({
  launchOptions: {
    executablePath: process.env.BROWSER_EXECUTABLE_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  },
});

test("3D petals load after entry, animate, pause for the photo, and survive context loss", async ({ page }) => {
  const errors = [];
  const sceneRequests = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.url().includes("petal-scene")) sceneRequests.push(request.url()); });
  await page.goto("/");
  const field = page.locator(".rose-petal-field");
  await expect(field.locator("canvas")).toHaveCount(0);
  expect(sceneRequests).toEqual([]);
  await page.getByRole("link", { name: "Tap to open" }).click();
  await expect(field).toHaveAttribute("data-renderer", "three", { timeout: 10000 });
  await expect(field).toHaveAttribute("data-motion", "running");
  expect(sceneRequests.length).toBeGreaterThan(0);
  const canvas = field.locator("canvas");
  const graphics = await canvas.evaluate(element => {
    const gl = element.getContext("webgl2");
    return { version: gl.getParameter(gl.VERSION), program: Boolean(gl.getParameter(gl.CURRENT_PROGRAM)), width: element.width, height: element.height };
  });
  expect(graphics.version).toContain("WebGL 2.0");
  expect(graphics.program).toBe(true);
  expect(graphics.width).toBeLessThanOrEqual(720);
  expect(await canvas.evaluate(element => getComputedStyle(element).pointerEvents)).toBe("none");
  await expect(field.locator(".rose-petal").first()).toBeHidden();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".hero-photo img,.hero-portrait,.hero-content,.hero h1 span,.hero h1 em{animation:none!important}.portrait-aura,.portrait-motes{display:none}" });
  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(450);
  expect(firstFrame.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole("button", { name: "View full photograph" }).click();
  await expect(field).toHaveAttribute("data-motion", "paused");
  await page.keyboard.press("Escape");
  await expect(field).toHaveAttribute("data-motion", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toHaveAttribute("data-motion", "paused");
  await expect(field).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(field).toHaveAttribute("data-motion", "running");
  await canvas.evaluate(element => element.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext());
  await expect(field).toHaveAttribute("data-renderer", "css");
  await expect(canvas).toHaveCount(0);
  expect(await field.locator(".rose-petal").first().evaluate(element => getComputedStyle(element).animationName)).toBe("rose-fall");
  expect(errors).toEqual([]);
});

test("unsupported WebGL keeps CSS petals and never loads the 3D bundle", async ({ page }) => {
  const sceneRequests = [];
  const errors = [];
  page.on("request", request => { if (request.url().includes("petal-scene")) sceneRequests.push(request.url()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type === "webgl2" ? null : getContext.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Tap to open" }).click();
  const field = page.locator(".rose-petal-field");
  await expect(field).toHaveAttribute("data-renderer", "css");
  await expect(field.locator("canvas")).toHaveCount(0);
  expect(await field.locator(".rose-petal").first().evaluate(element => getComputedStyle(element).animationName)).toBe("rose-fall");
  await page.getByRole("navigation").getByRole("link", { name: "Venue", exact: true }).click();
  await expect(page.getByRole("link", { name: "Get directions" })).toBeInViewport();
  expect(sceneRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("reduced motion avoids 3D loading until the preference changes", async ({ page }) => {
  const sceneRequests = [];
  page.on("request", request => { if (request.url().includes("petal-scene")) sceneRequests.push(request.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Tap to open" }).click();
  await expect(page.locator("#wedding")).toBeVisible();
  const field = page.locator(".rose-petal-field");
  await expect(field).toBeHidden();
  await expect(field.locator("canvas")).toHaveCount(0);
  expect(sceneRequests).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(field).toHaveAttribute("data-renderer", "three", { timeout: 10000 });
  await expect(field).toHaveAttribute("data-motion", "running");
});
