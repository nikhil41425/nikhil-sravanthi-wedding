export function initializeOpening() {
  const opening = document.getElementById("opening");
  const enter = document.getElementById("enter-invitation");
  const wedding = document.getElementById("wedding");
  const dock = document.querySelector(".invitation-dock");
  const skip = document.querySelector(".skip-link");
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let openingTimer = null;
  let touchStart = null;
  let consumedTouch = null;

  function loadPortrait() {
    const portrait = document.querySelector(".hero-photo img");
    portrait.fetchPriority = "high";
    portrait.loading = "eager";
  }

  document.addEventListener("pointerdown", () => { consumedTouch = null; }, { capture: true });
  document.addEventListener("click", (event) => {
    const touch = consumedTouch;
    consumedTouch = null;
    if (touch && event.detail > 0 && performance.now() - touch.time < 500 &&
        Math.hypot(event.clientX - touch.x, event.clientY - touch.y) <= 16) {
      // A synthesized click must not hit the navigation revealed under this tap.
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });

  function revealInvitation() {
    loadPortrait();
    opening.dataset.opened = "true";
    opening.hidden = true;
    wedding.hidden = false;
    wedding.inert = false;
    skip.hidden = false;
    dock.inert = false;
    dock.setAttribute("aria-hidden", "false");
    root.classList.remove("is-at-opening", "is-opening-locked");
    root.classList.add("invitation-entered");
  }

  function enterInvitation() {
    if (openingTimer !== null) window.clearTimeout(openingTimer);
    openingTimer = null;
    revealInvitation();
    opening.classList.remove("is-opening");
    enter.removeAttribute("aria-busy");
    enter.removeAttribute("aria-disabled");
    window.scrollTo({ top: 0, behavior: "instant" });
    // Keep the shared URL clean so refreshing shows the opening card again.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    const heading = document.getElementById("couple-name");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  function startOpening(event) {
    event.preventDefault();
    if (openingTimer !== null) return;
    // Use the door transition to fetch the next screen without competing
    // with the opening artwork on initial load.
    loadPortrait();
    if (reducedMotion.matches) {
      enterInvitation();
      return;
    }
    opening.classList.add("is-opening");
    enter.setAttribute("aria-busy", "true");
    enter.setAttribute("aria-disabled", "true");
    openingTimer = window.setTimeout(enterInvitation, 1200);
  }

  enter.addEventListener("click", startOpening);
  // Handle a deliberate touch directly, including a tap immediately after a swipe.
  enter.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      touchStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
  });
  enter.addEventListener("pointerup", (event) => {
    const start = touchStart;
    touchStart = null;
    if (start?.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) <= 10) {
      consumedTouch = { x: event.clientX, y: event.clientY, time: performance.now() };
      startOpening(event);
    }
  });
  enter.addEventListener("pointercancel", () => { touchStart = null; });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && openingTimer !== null) enterInvitation();
  });

  const directLinks = ["invitation", "muhurtham", "venue"];
  const destination = window.location.hash.slice(1);
  const isReload = window.performance.getEntriesByType("navigation")[0]?.type === "reload";
  if (directLinks.includes(destination) && !isReload) {
    revealInvitation();
    window.requestAnimationFrame(() => {
      document.getElementById(destination).scrollIntoView({ behavior: "instant" });
    });
  } else {
    // Section anchors must not bypass the card or restore an old scroll on refresh.
    window.history.scrollRestoration = "manual";
    if (isReload) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    root.classList.add("is-at-opening", "is-opening-locked");
    wedding.inert = true;
    skip.hidden = true;
    dock.inert = true;
    dock.setAttribute("aria-hidden", "true");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
