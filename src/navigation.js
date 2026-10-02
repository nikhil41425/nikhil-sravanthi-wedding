export function initializeDockNavigation() {
  const dock = document.querySelector(".invitation-dock");
  const wedding = document.getElementById("wedding");
  let lastY = window.scrollY;
  let distance = 0;
  let direction = 0;
  let manualScrolling = false;
  let scrollTimer;

  function showDock() {
    if (wedding.hidden) return;
    if (!dock.inert && dock.getAttribute("aria-hidden") === "false" && !dock.classList.contains("is-scroll-hidden")) return;
    dock.classList.remove("is-scroll-hidden");
    dock.inert = false;
    dock.setAttribute("aria-hidden", "false");
  }

  function resetScroll() {
    manualScrolling = false;
    distance = 0;
    direction = 0;
    lastY = window.scrollY;
    clearTimeout(scrollTimer);
  }

  function beginManualScroll() {
    if (wedding.hidden) return;
    manualScrolling = true;
  }

  window.addEventListener("wheel", beginManualScroll, { passive: true });
  window.addEventListener("touchmove", beginManualScroll, { passive: true });
  window.addEventListener("scroll", () => {
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    lastY = y;
    if (wedding.hidden || !manualScrolling) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(resetScroll, 200);

    const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 16;
    if (y <= 32 || atEnd || dock.querySelector(":focus-visible")) {
      showDock();
      distance = 0;
      return;
    }
    if (Math.abs(delta) < 1) return;
    const nextDirection = Math.sign(delta);
    distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (direction < 0 && distance >= 12) showDock();
    if (direction > 0 && distance >= 48 && !dock.classList.contains("is-scroll-hidden")) {
      dock.classList.add("is-scroll-hidden");
      dock.inert = true;
      dock.setAttribute("aria-hidden", "true");
    }
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      resetScroll();
      showDock();
    } else if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
      beginManualScroll();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="#"]')) {
      resetScroll();
      showDock();
    }
  });
  document.addEventListener("focusin", () => {
    resetScroll();
    showDock();
  });
  window.addEventListener("resize", () => {
    resetScroll();
    showDock();
  });
}
