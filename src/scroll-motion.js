export function initializeScrollMotion() {
  if (!("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const treatments = {
    ".section-marker": "marker",
    ".section h2, .venue h3": "heading",
    ".auspicious, .family-symbol, .ceremony-art, .venue-art, .closing-ornament, .closing-rule": "ornament",
    ".family": "family",
    ".date-card": "card",
    ".countdown-block": "countdown",
    ".seal": "seal",
    ".venue-location, .venue address, .closing-date": "copy",
    ".section .button": "action",
  };
  Object.entries(treatments).forEach(([selector, treatment]) => {
    document.querySelectorAll(selector).forEach(element => {
      element.dataset.reveal = treatment;
    });
  });
  document.querySelectorAll('[data-reveal="ornament"] svg path').forEach(path => {
    path.setAttribute("pathLength", "1");
    path.classList.add("draw-path");
  });
  const targets = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add("is-revealed");
        observer.unobserve(target);
      }
    });
  }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
  targets.forEach(target => observer.observe(target));

  // Keyboard access reveals the whole group immediately, including nested details.
  document.addEventListener("focusin", event => {
    const target = event.target.closest("[data-reveal]");
    if (target) {
      target.classList.add("is-revealed", "is-focus-revealed");
      observer.unobserve(target);
    }
  });

  const ornaments = document.querySelectorAll(".section-illustration, .date-watermark");
  ornaments.forEach(element => element.classList.add("scroll-ornament"));
  let queued = false;
  function updateOrnaments() {
    queued = false;
    if (preference.matches || document.hidden) return;
    const viewport = window.innerHeight;
    const positions = [...ornaments].map(element => ({ element, bounds: element.getBoundingClientRect() }));
    positions.forEach(({ element, bounds }) => {
      if (bounds.bottom >= 0 && bounds.top <= viewport) {
        const progress = Math.max(0, Math.min(1, (bounds.top + bounds.height / 2) / viewport));
        element.style.setProperty("--scroll-shift", `${((progress - .5) * 18).toFixed(2)}px`);
      }
    });
  }
  function queueOrnaments() {
    if (!queued && !preference.matches) {
      queued = true;
      requestAnimationFrame(updateOrnaments);
    }
  }
  function applyPreference() {
    root.classList.toggle("motion-ready", !preference.matches);
    queueOrnaments();
  }
  window.addEventListener("scroll", queueOrnaments, { passive: true });
  window.addEventListener("resize", queueOrnaments);
  document.addEventListener("visibilitychange", queueOrnaments);
  preference.addEventListener("change", applyPreference);
  document.fonts.ready.then(queueOrnaments);
  applyPreference();
}
