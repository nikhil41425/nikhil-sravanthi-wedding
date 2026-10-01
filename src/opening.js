export function initializeOpening() {
  const opening = document.getElementById("opening");
  const enter = document.getElementById("enter-invitation");
  const wedding = document.getElementById("wedding");
  const dock = document.querySelector(".invitation-dock");
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let opened = false;
  let openingTimer = null;
  let visibilityQueued = false;

  function markOpened() {
    opened = true;
    opening.dataset.opened = "true";
    root.classList.add("invitation-entered");
  }

  function updateVisibility() {
    const bounds = opening.getBoundingClientRect();
    const atOpening = bounds.bottom > 80 && bounds.top < window.innerHeight;
    root.classList.toggle("is-at-opening", atOpening);
    dock.inert = atOpening;
    dock.setAttribute("aria-hidden", String(atOpening));
    if (!atOpening) markOpened();
    visibilityQueued = false;
  }

  function enterInvitation() {
    if (openingTimer !== null) window.clearTimeout(openingTimer);
    openingTimer = null;
    markOpened();
    opening.classList.remove("is-opening");
    enter.removeAttribute("aria-busy");
    enter.removeAttribute("aria-disabled");
    const destination = wedding.getBoundingClientRect().top + window.scrollY;
    // Respect a guest who swiped past the cover during the opening animation.
    if (window.scrollY <= destination + 8) {
      window.scrollTo({ top: destination, behavior: "instant" });
    }
    if (window.location.hash !== "#wedding") {
      window.history.pushState(null, "", "#wedding");
    }
    updateVisibility();
    const heading = document.getElementById("couple-name");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  enter.addEventListener("click", (event) => {
    event.preventDefault();
    if (openingTimer !== null) return;
    if (opened || reducedMotion.matches) {
      enterInvitation();
      return;
    }
    opening.classList.add("is-opening");
    enter.setAttribute("aria-busy", "true");
    enter.setAttribute("aria-disabled", "true");
    openingTimer = window.setTimeout(enterInvitation, 800);
  });

  window.addEventListener("scroll", () => {
    if (!visibilityQueued) {
      visibilityQueued = true;
      window.requestAnimationFrame(updateVisibility);
    }
  }, { passive: true });
  window.addEventListener("resize", updateVisibility);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && openingTimer !== null) enterInvitation();
  });

  updateVisibility();
  const directLinks = ["wedding", "home", "invitation", "muhurtham", "venue"];
  const destination = window.location.hash.slice(1);
  if (directLinks.includes(destination)) {
    markOpened();
    root.classList.remove("is-at-opening");
    dock.inert = false;
    dock.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      document.getElementById(destination).scrollIntoView({ behavior: "instant" });
      updateVisibility();
    });
  }
}
