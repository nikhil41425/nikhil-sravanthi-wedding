import { test } from "node:test";
import assert from "node:assert/strict";
import { initializeCountdown } from "../src/countdown.js";
import { initializeScrollMotion } from "../src/scroll-motion.js";

function stubGlobal(t, name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, name, original);
    else delete globalThis[name];
  });
}

test("countdown pauses while hidden, catches up when visible, and stops after the wedding", t => {
  const weddingTime = new Date("2026-11-15T09:57:00+05:30").getTime();
  let now = weddingTime - 86400_000;
  t.mock.method(Date, "now", () => now);
  const timers = new Map();
  let nextTimer = 0;
  t.mock.method(globalThis, "setInterval", callback => {
    timers.set(++nextTimer, callback);
    return nextTimer;
  });
  t.mock.method(globalThis, "clearInterval", id => timers.delete(id));
  const elements = Object.fromEntries(["days", "hours", "minutes", "seconds", "countdown-label"].map(id => [id, { textContent: "—" }]));
  const wedding = { hidden: true };
  const listeners = {};
  const document = {
    hidden: false,
    getElementById: id => id === "wedding" ? wedding : elements[id],
    addEventListener: (type, callback) => { listeners[type] = callback; },
  };
  let onInvitationChange;
  stubGlobal(t, "document", document);
  stubGlobal(t, "MutationObserver", class {
    constructor(callback) { onInvitationChange = callback; }
    observe() {}
  });

  initializeCountdown();
  assert.equal(timers.size, 0);
  assert.equal(elements.days.textContent, "—");
  wedding.hidden = false;
  onInvitationChange();
  assert.equal(elements.days.textContent, "01");
  assert.equal(elements.hours.textContent, "00");
  assert.equal(timers.size, 1);

  document.hidden = true;
  listeners.visibilitychange();
  assert.equal(timers.size, 0);
  now += 3600_000;
  document.hidden = false;
  listeners.visibilitychange();
  assert.equal(elements.days.textContent, "00");
  assert.equal(elements.hours.textContent, "23");
  assert.equal(timers.size, 1);

  now = weddingTime + 1000;
  [...timers.values()][0]();
  assert.equal(timers.size, 0);
  assert.equal(elements.seconds.textContent, "00");
  assert.equal(elements["countdown-label"].textContent, "Our new journey has begun.");
  listeners.visibilitychange();
  assert.equal(timers.size, 0);
});

test("countdown mutates only digits that change", t => {
  let now = new Date("2026-11-14T04:27:01Z").getTime();
  t.mock.method(Date, "now", () => now);
  let tick;
  t.mock.method(globalThis, "setInterval", callback => { tick = callback; return 1; });
  t.mock.method(globalThis, "clearInterval", () => {});
  let writes = 0;
  const digits = ["days", "hours", "minutes", "seconds"];
  const elements = Object.fromEntries(digits.map(id => {
    let value = "—";
    return [id, { get textContent() { return value; }, set textContent(next) { value = next; writes++; } }];
  }));
  stubGlobal(t, "document", {
    hidden: false,
    getElementById: id => id === "wedding" ? { hidden: false } : elements[id],
    addEventListener() {},
  });
  stubGlobal(t, "MutationObserver", class { observe() {} });
  initializeCountdown();
  assert.equal(writes, 4);
  tick();
  assert.equal(writes, 4);
  now += 1000;
  tick();
  assert.equal(writes, 5);
});

test("scroll effects read only nearby ornaments and skip reduced-motion and background work", t => {
  let reads = 0;
  const ornaments = Array.from({ length: 6 }, () => ({
    classList: { add() {} },
    getBoundingClientRect() { reads++; return { top: 100, bottom: 200, height: 100 }; },
    style: { setProperty() {} },
  }));
  const preference = { matches: false, addEventListener() {} };
  const listeners = {};
  const frames = [];
  const observers = [];
  const document = {
    hidden: false,
    documentElement: { classList: { toggle() {} } },
    querySelectorAll: selector => selector === ".section-illustration, .date-watermark" ? ornaments : [],
    addEventListener: (type, callback) => { listeners[type] = callback; },
    fonts: { ready: new Promise(() => {}) },
  };
  stubGlobal(t, "document", document);
  stubGlobal(t, "matchMedia", () => preference);
  stubGlobal(t, "requestAnimationFrame", callback => { frames.push(callback); });
  stubGlobal(t, "IntersectionObserver", class {
    constructor(callback) { observers.push(callback); }
    observe() {}
  });
  stubGlobal(t, "window", {
    IntersectionObserver: globalThis.IntersectionObserver,
    innerHeight: 844,
    addEventListener: (type, callback) => { listeners[type] = callback; },
  });
  const flush = () => { while (frames.length) frames.shift()(); };
  initializeScrollMotion();
  flush();
  assert.equal(reads, 0);
  observers[1]([{ target: ornaments[0], isIntersecting: true }]);
  flush();
  assert.equal(reads, 1);
  listeners.scroll();
  listeners.scroll();
  flush();
  assert.equal(reads, 2);
  preference.matches = true;
  listeners.scroll();
  flush();
  assert.equal(reads, 2);
  preference.matches = false;
  document.hidden = true;
  listeners.scroll();
  flush();
  assert.equal(reads, 2);
  document.hidden = false;
  observers[1]([{ target: ornaments[0], isIntersecting: false }]);
  flush();
  assert.equal(reads, 2);
});
