export function initializeCountdown() {
  const weddingTime = new Date("2026-11-15T09:57:00+05:30").getTime();
  const countdownDigits = ["days", "hours", "minutes", "seconds"].map(id => document.getElementById(id));
  const countdownLabel = document.getElementById("countdown-label");
  const wedding = document.getElementById("wedding");
  let countdownTimer = null;
  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
    const values = [
      Math.floor(remaining / 86400),
      Math.floor(remaining / 3600) % 24,
      Math.floor(remaining / 60) % 60,
      remaining % 60,
    ];
    countdownDigits.forEach((element, index) => {
      const value = String(values[index]).padStart(2, "0");
      if (element.textContent !== value) element.textContent = value;
    });
    if (!remaining) {
      const message = "Our new journey has begun.";
      if (countdownLabel.textContent !== message) countdownLabel.textContent = message;
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    return remaining;
  }
  function syncCountdown() {
    clearInterval(countdownTimer);
    countdownTimer = null;
    // Hidden invitation content and background tabs do not need timer work.
    if (!wedding.hidden && !document.hidden && updateCountdown() > 0) {
      countdownTimer = setInterval(updateCountdown, 1000);
    }
  }
  new MutationObserver(syncCountdown).observe(wedding, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("visibilitychange", syncCountdown);
  syncCountdown();
}
