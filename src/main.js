import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import couplePhoto from "./assets/nikhil-sravanthi.jpg";
import templeArtwork from "./assets/temple-opening.webp";
import templeDoor from "./assets/temple-door.webp";
import familyArtwork from "./assets/wedding-kalash.webp";
import ceremonyArtwork from "./assets/ceremony-lamps.webp";
import venueArtwork from "./assets/wedding-mandap.webp";
import closingArtwork from "./assets/lotus-blessing.webp";
import { initializeOpening } from "./opening.js";
import { initializeDockNavigation } from "./navigation.js";
import { initializeScrollMotion } from "./scroll-motion.js";
import "./style.css";

const pin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const calendar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16m-12 5h3m3 0h2"/></svg>`;
const lotus = `<svg class="lotus" viewBox="0 0 100 64" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M50 53C27 37 41 17 50 6c9 11 23 31 0 47Z"/><path d="M50 53C21 54 14 33 15 20c16 3 28 13 35 33Zm0 0c29 1 36-20 35-33-16 3-28 13-35 33Z"/><path d="M50 53C28 64 9 50 4 35c17-1 33 5 46 18Zm0 0c22 11 41-3 46-18-17-1-33 5-46 18ZM24 60h52"/></svg>`;
const ganesha = `<svg class="ganesha" viewBox="0 0 100 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m36 22 14-14 14 14M33 27h34M38 21h24M50 2v5M39 30c-9 3-13 12-10 22l8 8m24-30c9 3 13 12 10 22l-8 8M29 34c-19-12-25 16-11 22l10-4m43-18c19-12 25 16 11 22l-10-4M37 45l4 2m18-2-4 2M49 37v8m-5 13c-6 16 17 14 14 26-2 8-16 7-16-1M39 60c-6 4-8 14-4 22m27-22c8 10 4 23-2 30M27 66C9 71 11 93 29 93h9m35-27c18 5 16 27-2 27H60M33 96h35M42 102h18"/><path d="m19 69-6-8m68 8 6-8M47 27h6"/></svg>`;

const expand = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg>`;
const close = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`;
const heart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 20S3 14 3 8.5a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1C21 14 12 20 12 20Z"/></svg>`;
const seal = `<div class="seal" aria-hidden="true"><span class="seal-top" lang="en">WITH LOVE</span><span class="seal-monogram" lang="en" translate="no">N<i>&</i>S</span><span class="seal-bottom" lang="en">15 · 11 · 2026</span></div>`;

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#invitation">Skip to invitation</a>
  <section class="opening-card" id="opening" aria-labelledby="opening-title" data-opened="false">
    <div class="temple-scene">
      <div class="temple-artwork">
        <img class="temple-image" src="${templeArtwork}" alt="Ornate temple entrance with Lord Venkateswara, Lord Ganesha, flowers and brass lamps" width="941" height="1672" fetchpriority="high" decoding="async" />
        <div class="temple-plaque">
          <p>WEDDING INVITATION</p>
          <h2 id="opening-title" translate="no"><span>Nikhil <i>&</i></span><span>Sravanthi</span></h2>
        </div>
        <div class="lamp-glow lamp-glow-left" aria-hidden="true"></div>
        <div class="lamp-glow lamp-glow-right" aria-hidden="true"></div>
        <div class="door-glow" aria-hidden="true"></div>
        <div class="floor-shimmer" aria-hidden="true"></div>
        <a class="opening-door" id="enter-invitation" href="#wedding" aria-label="Tap to open">
          <span class="door-leaf door-leaf-left" aria-hidden="true"><img src="${templeDoor}" alt="" width="512" height="768" fetchpriority="high" decoding="async" /></span>
          <span class="door-leaf door-leaf-right" aria-hidden="true"><img src="${templeDoor}" alt="" width="512" height="768" fetchpriority="high" decoding="async" /></span>
        </a>
      </div>
    </div>
    <div class="petal-field" aria-hidden="true">${[8, 92, 18, 81, 5, 95].map((left, index) => `<span class="petal" style="--petal-left:${left}%;--petal-delay:-${index * 2.7}s;--petal-duration:${12 + index * 1.3}s;--petal-drift:${index % 2 ? -18 : 22}px"></span>`).join("")}</div>
    <div class="opening-flash" aria-hidden="true"></div>
    <div class="opening-ripple" aria-hidden="true"></div>
    <div class="opening-actions">
      <p class="opening-date">15 NOVEMBER 2026</p>
    </div>
  </section>
  <div id="wedding" hidden>
  <div class="rose-petal-field" aria-hidden="true">${[6, 91, 23, 76, 12, 86, 38, 64, 4, 95, 29, 71].map((left, index) => `<span class="rose-petal" style="--rose-left:${left}%;--rose-delay:-${index * 2.3 + 1}s;--rose-duration:${14 + index % 5 * 1.7}s;--rose-drift:${index % 2 ? -26 : 26}px;--rose-size:${9 + index % 4 * 1.5}px;--rose-flutter:${3 + index % 3 * 0.8}s"><span></span></span>`).join("")}</div>
  <div class="reading-progress" aria-hidden="true"><span></span></div>
  <main>
    <section class="hero" id="home" aria-labelledby="couple-name">
      <span class="hero-edition" lang="en">THE WEDDING OF</span>
      <div class="hero-portrait">
        <div class="portrait-aura" aria-hidden="true"></div>
        <figure class="hero-photo"><img src="${couplePhoto}" alt="Nikhil and Sravanthi together in traditional attire" lang="en" translate="no" width="891" height="1280" fetchpriority="low" decoding="async" /><div class="portrait-text-shade" aria-hidden="true"></div></figure>
        <div class="portrait-motes" aria-hidden="true">${[7, 94, 12, 88, 4, 96].map((left, index) => `<span style="--mote-left:${left}%;--mote-top:${14 + index * 12}%;--mote-delay:-${index * 1.8}s"></span>`).join("")}</div>
      <div class="hero-content">
        <p class="hero-eyebrow">A beautiful beginning</p>
        <h1 id="couple-name" lang="en" translate="no"><span>Nikhil</span><em>&</em><span class="bride-name">Sravanthi</span></h1>
        <div class="hero-date" lang="en"><span>15 NOVEMBER 2026</span><span>HYDERABAD, INDIA</span></div>
      </div>
        <button class="photo-expand" id="open-photo" type="button" aria-label="View full photograph">${expand}</button>
      </div>
      <a class="hero-cta" href="#invitation"><span>The invitation</span>${arrow}</a>
    </section>

    <section class="invitation section" id="invitation" aria-labelledby="invitation-heading">
      <div class="section-marker"><span lang="en">01 /</span><p>THE INVITATION</p><span class="marker-line"></span></div>
      <div class="auspicious" data-reveal>${ganesha}<p>With the blessings of Lord Ganesha</p></div>
      <h2 id="invitation-heading" data-reveal>Your presence, our joy.<br /><span>Your blessings, our gift.</span></h2>
      <p class="invitation-copy" data-reveal>Together with our families, we invite you to celebrate our wedding and bless the beginning of our life together.</p>
      <div class="families">
        <div class="family" data-reveal><p class="family-role"><span lang="en">THE GROOM</span></p><h3 lang="en" translate="no">Nikhil</h3><p class="parent-label" lang="en">Son of</p><p class="parents" lang="en" translate="no">Are Srinivas <span>&</span> Manjula</p></div>
        <div class="family-symbol" aria-hidden="true"><span class="union-line"></span><img class="section-illustration family-art" src="${familyArtwork}" alt="" width="768" height="512" loading="lazy" decoding="async" /><span class="union-line"></span></div>
        <div class="family" data-reveal><p class="family-role"><span lang="en">THE BRIDE</span></p><h3 lang="en" translate="no">Sravanthi</h3><p class="parent-label" lang="en">Daughter of</p><p class="parents" lang="en" translate="no">Pandula Narsimha <span>&</span> Madhavi</p></div>
      </div>
      <div class="invitation-signoff" data-reveal>${lotus}<p>Two hearts. One beautiful journey.</p></div>
    </section>

    <section class="muhurtham section" id="muhurtham" aria-labelledby="date-heading">
      <div class="section-marker"><span lang="en">02 /</span><p>THE CELEBRATION</p><span class="marker-line"></span></div>
      <h2 id="date-heading" data-reveal>Our wedding day</h2>
      <div class="date-card" data-reveal>
        <div class="date-card-crest" aria-hidden="true">${lotus}</div>
        <div class="date-card-day"><strong lang="en">15</strong><div class="date-month"><span lang="en">November</span><span lang="en">2026 · SUNDAY</span></div></div>
        <div class="date-card-time"><span class="ceremony-label">The ceremony</span><p class="time" lang="en">9:57 <span>AM</span></p><p class="time-caption">Morning <span lang="en">· INDIA STANDARD TIME</span></p></div>
      </div>
      <button class="button button-light" id="add-calendar" type="button">${calendar}<span>Add to calendar</span>${arrow}</button>
      <p class="calendar-status" id="calendar-status" role="status"></p>
      <div class="countdown-block" data-reveal><p class="countdown-label" id="countdown-label">Counting down to forever</p><div class="countdown" aria-label="Time until the wedding"><div><strong id="days" lang="en">—</strong><span>Days</span></div><div><strong id="hours" lang="en">—</strong><span>Hours</span></div><div><strong id="minutes" lang="en">—</strong><span>Minutes</span></div><div><strong id="seconds" lang="en">—</strong><span>Seconds</span></div></div></div>
      <div class="ceremony-art" aria-hidden="true"><img class="section-illustration" src="${ceremonyArtwork}" alt="" width="768" height="512" loading="lazy" decoding="async" /></div>
      <span class="date-watermark" lang="en" aria-hidden="true">a day to remember.</span>
    </section>

    <section class="venue section" id="venue" aria-labelledby="venue-heading">
      <div class="section-marker"><span lang="en">03 /</span><p>THE VENUE</p><span class="marker-line"></span></div>
      <div class="venue-location" lang="en">${pin}<span>HYDERABAD · TELANGANA</span></div>
      <h2 id="venue-heading" data-reveal>Join us at</h2>
      <h3 lang="en" translate="no" data-reveal><span>CBS</span> <span>Convention</span></h3>
      <address lang="en" translate="no">Narapally, Korremula Rd,<br />Sai Ram Nagar Colony, Venkatadri Twp,<br />Chowdhariguda, Majarguda,<br />Hyderabad, Telangana 500088</address>
      <a class="button button-dark directions-button" href="https://maps.app.goo.gl/dKanwQshRjnfzxzs5" target="_blank" rel="noopener noreferrer" aria-label="Get directions" aria-describedby="directions-note"><span class="directions-icon" aria-hidden="true">${pin}</span><span class="directions-copy"><span class="directions-title">Get directions</span><span class="directions-caption" id="directions-note">Open in Google Maps</span></span><span class="directions-arrow" aria-hidden="true">${arrow}</span></a>
      <div class="venue-art" aria-hidden="true"><img class="section-illustration" src="${venueArtwork}" alt="" width="768" height="512" loading="lazy" decoding="async" /><span lang="en">WHERE OUR FOREVER BEGINS</span></div>
    </section>

    <section class="closing section" id="closing" aria-labelledby="closing-heading">
      <div class="closing-ornament" aria-hidden="true"><img class="section-illustration" src="${closingArtwork}" alt="" width="768" height="384" loading="lazy" decoding="async" /></div><p class="closing-kicker">WE CAN'T WAIT TO CELEBRATE WITH YOU</p>
      <h2 id="closing-heading" data-reveal>With you beside us,<br />our forever begins.</h2>
      <div class="closing-names" lang="en" translate="no" data-reveal>Nikhil <span>&</span><br /><em>Sravanthi</em></div>
      <div class="closing-rule"><span></span>${heart}<span></span></div>
      ${seal}
      <p class="closing-date" lang="en">15 NOVEMBER 2026 · HYDERABAD</p>
    </section>
  </main>
  <footer><span class="footer-monogram" lang="en" translate="no">N & S</span><p>With love, always.</p><span lang="en">2026</span></footer>
  <nav class="invitation-dock" aria-label="Invitation navigation"><a href="#invitation">${heart}<span>Invitation</span></a><a href="#muhurtham">${calendar}<span>Ceremony</span></a><a href="#venue">${pin}<span>Venue</span></a></nav>
  <dialog class="photo-dialog" id="photo-dialog" aria-label="Nikhil and Sravanthi photograph" lang="en" translate="no"><button id="close-photo" type="button" aria-label="Close photograph">${close}</button><img src="${couplePhoto}" alt="Nikhil and Sravanthi, full portrait" width="891" height="1280" /><p lang="en">Nikhil & Sravanthi</p></dialog>
  </div>
`;

initializeOpening();
initializeDockNavigation();
initializeScrollMotion();

const heroMotionObserver = new IntersectionObserver(([entry]) => {
  entry.target.classList.toggle("is-visible", entry.isIntersecting);
});
heroMotionObserver.observe(document.getElementById("home"));

const photoDialog = document.getElementById("photo-dialog");
document
  .getElementById("open-photo")
  .addEventListener("click", () => photoDialog.showModal());
document
  .getElementById("close-photo")
  .addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) {
    const bounds = photoDialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      photoDialog.close();
  }
});

if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".invitation-dock a").forEach((link) => {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main > section[id]")
    .forEach((section) => navigationObserver.observe(section));
}

let progressQueued = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector(".reading-progress span").style.transform =
    `scaleX(${scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0})`;
  progressQueued = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!progressQueued) {
      progressQueued = true;
      requestAnimationFrame(updateProgress);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateProgress);
updateProgress();

const weddingTime = new Date("2026-11-15T09:57:00+05:30").getTime();
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
    document.getElementById(id).textContent = String(values[index]).padStart(
      2,
      "0",
    );
  });
  if (!remaining)
    document.getElementById("countdown-label").textContent =
      "Our new journey has begun.";
}
updateCountdown();
setInterval(updateCountdown, 1000);

function escapeCalendar(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
document.getElementById("add-calendar").addEventListener("click", () => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikhil and Sravanthi//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:nikhil-sravanthi-20261115@wedding-invitation",
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    "DTSTART:20261115T042700Z",
    "SUMMARY:Nikhil & Sravanthi Wedding",
    `LOCATION:${escapeCalendar("CBS Convention, Narapally, Korremula Rd, Sai Ram Nagar Colony, Venkatadri Twp, Chowdhariguda, Majarguda, Hyderabad, Telangana 500088")}`,
    `DESCRIPTION:${escapeCalendar("Wedding ceremony at 9:57 AM IST. Directions: https://maps.app.goo.gl/dKanwQshRjnfzxzs5")}`,
    "URL:https://maps.app.goo.gl/dKanwQshRjnfzxzs5",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];
  // Fold iCalendar content lines at 75 bytes; these event fields contain ASCII only.
  const content = lines
    .map((line) => line.match(/.{1,75}/g)?.join("\r\n ") ?? "")
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "Nikhil-and-Sravanthi-Wedding.ics";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById("calendar-status").textContent =
    "Your calendar file is ready. Open it in your calendar app.";
});
