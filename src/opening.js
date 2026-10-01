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

  function revealInvitation() {
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
    window.history.pushState(null, "", "#wedding");
    const heading = document.getElementById("couple-name");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  function startOpening(event) {
    event.preventDefault();
    if (openingTimer !== null) return;
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
      startOpening(event);
    }
  });
  enter.addEventListener("pointercancel", () => { touchStart = null; });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && openingTimer !== null) enterInvitation();
  });

  const directLinks = ["wedding", "home", "invitation", "muhurtham", "venue"];
  const destination = window.location.hash.slice(1);
  if (directLinks.includes(destination)) {
    revealInvitation();
    window.requestAnimationFrame(() => {
      document.getElementById(destination).scrollIntoView({ behavior: "instant" });
    });
  } else {
    root.classList.add("is-at-opening", "is-opening-locked");
    wedding.inert = true;
    skip.hidden = true;
    dock.inert = true;
    dock.setAttribute("aria-hidden", "true");
  }
}
