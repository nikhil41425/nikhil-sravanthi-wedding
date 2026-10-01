import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/noto-serif-telugu/telugu-400.css";
import "./style.css";

const pin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const calendar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16m-12 5h3m3 0h2"/></svg>`;
const lotus = `<svg class="lotus" viewBox="0 0 100 64" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M50 53C27 37 41 17 50 6c9 11 23 31 0 47Z"/><path d="M50 53C21 54 14 33 15 20c16 3 28 13 35 33Zm0 0c29 1 36-20 35-33-16 3-28 13-35 33Z"/><path d="M50 53C28 64 9 50 4 35c17-1 33 5 46 18Zm0 0c22 11 41-3 46-18-17-1-33 5-46 18ZM24 60h52"/></svg>`;
const ganesha = `<svg class="ganesha" viewBox="0 0 100 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m36 22 14-14 14 14M33 27h34M38 21h24M50 2v5M39 30c-9 3-13 12-10 22l8 8m24-30c9 3 13 12 10 22l-8 8M29 34c-19-12-25 16-11 22l10-4m43-18c19-12 25 16 11 22l-10-4M37 45l4 2m18-2-4 2M49 37v8m-5 13c-6 16 17 14 14 26-2 8-16 7-16-1M39 60c-6 4-8 14-4 22m27-22c8 10 4 23-2 30M27 66C9 71 11 93 29 93h9m35-27c18 5 16 27-2 27H60M33 96h35M42 102h18"/><path d="m19 69-6-8m68 8 6-8M47 27h6"/></svg>`;
const floral = `<svg class="floral" viewBox="0 0 280 560" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M29 540C149 445 65 328 149 255S233 114 203 15M78 494C36 443 24 413 8 395c61 9 85 47 70 99Zm16-69c49-12 77-48 81-86-53 13-72 51-81 86Zm12-104c-46-18-69-48-72-84 49 9 76 43 72 84Zm43-66c45-1 84-27 96-58-47-2-77 15-96 58Zm50-100c-44-14-64-40-66-69 47 8 64 30 66 69Zm18-73c29-12 49-35 48-59-31 6-45 27-48 59Z"/><path d="M77 491 11 398m82 27 79-83m-66-21-69-80m112 14 91-53m-41-47-62-65m80-8 44-55"/><g transform="translate(153 266)"><path d="M0-33C15-18 15 0 0 9c-15-9-15-27 0-42ZM0 9c-20 4-34-7-36-24C-18-18-5-8 0 9Zm0 0c20 4 34-7 36-24C18-18 5-8 0 9ZM-33 9C-20 27 20 27 33 9"/></g><g transform="translate(58 418) scale(.7)"><path d="M0-33C15-18 15 0 0 9c-15-9-15-27 0-42ZM0 9c-20 4-34-7-36-24C-18-18-5-8 0 9Zm0 0c20 4 34-7 36-24C18-18 5-8 0 9ZM-33 9C-20 27 20 27 33 9"/></g><circle cx="203" cy="15" r="4"/><circle cx="29" cy="540" r="4"/></svg>`;
const toran = `<svg class="toran" viewBox="0 0 1200 120" fill="none" aria-hidden="true"><path d="M0 15Q300 105 600 15Q900 105 1200 15" stroke="currentColor" stroke-width="1"/>${Array.from(
  { length: 25 },
  (_, i) => {
    const x = i * 50;
    const y = 15 + 40 * Math.sin(((x % 600) / 600) * Math.PI);
    return `<g transform="translate(${x} ${y})"><path d="M0 0C-18 15-11 40 0 51C11 40 18 15 0 0Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width=".8"/><path d="M0 4v39" stroke="currentColor" stroke-width=".7"/></g>`;
  },
).join("")}</svg>`;
const lamp = `<svg class="lamp" viewBox="0 0 90 150" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M45 9c-15 17-12 29 0 32 12-3 15-15 0-32Zm0 9v20M16 43c4 17 54 17 58 0H16Zm8 15h42M41 59v57m8-57v57M35 76h20M35 95h20M32 117h26l7 9H25l7-9Zm-12 15h50v7H20zM12 144h66"/><path d="M30 67c-11 13-13 33 1 43m29-43c11 13 13 33-1 43"/></svg>`;
const ritual = `<svg class="ritual" viewBox="0 0 170 100" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 59 36-20 21 6 17 15c5 5 0 10-5 7L63 58m-23 5 27 15c8 4 17 5 25 1l20-10m50-10-36-20-21 6-17 15c-5 5 0 10 5 7l14-9m23 5-22 12M5 52l9 22m151-22-9 22"/><path d="M70 38c0-9 15-19 15-19s15 10 15 19c0 12-30 12-30 0Z"/><path d="M77 35c0-4 8-10 8-10s8 6 8 10M85 4v7M63 12l6 6m38-6-6 6"/><circle cx="81" cy="41" r="1"/><circle cx="87" cy="38" r="1"/><circle cx="89" cy="44" r="1"/></svg>`;

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#invitation">ఆహ్వానానికి వెళ్ళండి</a>
  <header class="header">
    <a class="monogram" href="#home" aria-label="Nikhil and Sravanthi home"><span>N</span><i>&</i><span>S</span></a>
    <nav aria-label="ప్రధాన నావిగేషన్"><a href="#invitation">ఆహ్వానం</a><a href="#muhurtham">ముహూర్తం</a><a href="#venue">వేదిక</a></nav>
    <span class="header-date" lang="en">15.11.2026</span>
  </header>
  <main>
    <section class="hero" id="home" aria-labelledby="couple-name">
      ${toran}<div class="hero-frame" aria-hidden="true"></div>
      <div class="floral-left">${floral}</div><div class="floral-right">${floral}</div>
      <div class="hero-content">
        ${ganesha}
        <p class="blessing">శ్రీరస్తు <span>✦</span> శుభమస్తు <span>✦</span> అవిఘ్నమస్తు</p>
        <div class="section-label"><span></span><p>వివాహ ఆహ్వానం</p><span></span></div>
        <h1 id="couple-name" lang="en"><span>Nikhil</span><em>&</em><span>Sravanthi</span></h1>
        <p class="hero-subtitle">రెండు మనసులు <span>·</span> ఒక అందమైన ప్రయాణం</p>
        <div class="hero-date" lang="en"><span>15 NOVEMBER 2026</span><i>✦</i><span>SUNDAY · 9:57 AM</span></div>
        <a class="hero-cta" href="#invitation">మా శుభలేఖ ${arrow}</a>
      </div>
      <a class="scroll-cue" href="#invitation" aria-label="ఆహ్వానానికి వెళ్ళండి"><span></span></a>
    </section>

    <section class="invitation section" id="invitation" aria-labelledby="invitation-heading">
      <div class="section-inner">
        ${lotus}
        <p class="eyebrow">సప్రేమ ఆహ్వానం</p>
        <h2 id="invitation-heading">మీ రాక మాకు ఆనందం<br />మీ ఆశీస్సులు మాకు వరం</h2>
        <p class="invitation-copy">మా వివాహ మహోత్సవానికి విచ్చేసి,<br class="desktop-break" /> మీ ఆశీస్సులతో మా నూతన జీవితాన్ని దీవించగలరు.</p>
        <div class="families">
          <div class="family"><p class="family-role">వరుడు</p><h3 lang="en">Nikhil</h3><p class="parent-label" lang="en">Son of</p><p class="parents" lang="en">Are Srinivas <span>&</span> Manjula</p></div>
          <div class="family-symbol">${ritual}<span>శుభమస్తు</span></div>
          <div class="family"><p class="family-role">వధువు</p><h3 lang="en">Sravanthi</h3><p class="parent-label" lang="en">Daughter of</p><p class="parents" lang="en">Pandula Narsimha <span>&</span> Madhavi</p></div>
        </div>
      </div>
    </section>

    <section class="muhurtham section" id="muhurtham" aria-labelledby="date-heading">
      <div class="section-inner">
        <p class="eyebrow">ఒక మధురమైన ఆరంభం</p>
        <h2 id="date-heading">సుముహూర్తం</h2>
        <div class="date-card">
          <div class="date-card-day"><span class="small-caps" lang="en">NOVEMBER</span><strong lang="en">15</strong><span class="small-caps" lang="en">2026 · SUNDAY</span></div>
          <div class="date-card-time"><p>ఆదివారం</p><p class="time" lang="en">9:57 <span>AM</span></p><p>ఉదయం <span class="time-zone" lang="en">(IST)</span></p></div>
          <div class="date-card-note">${lotus}<p>జీవితాంతం తోడుగా…<br />ఈ క్షణం మొదలుగా.</p></div>
        </div>
        <button class="button button-outline" id="add-calendar" type="button">${calendar}<span>క్యాలెండర్‌లో చేర్చండి</span></button>
        <p class="calendar-status" id="calendar-status" role="status"></p>
        <div class="countdown-block"><p class="countdown-label" id="countdown-label">మా పెళ్లి వేడుకకు ఇంకా</p><div class="countdown" aria-label="Time until the wedding"><div><strong id="days" lang="en">—</strong><span>రోజులు</span></div><i>:</i><div><strong id="hours" lang="en">—</strong><span>గంటలు</span></div><i>:</i><div><strong id="minutes" lang="en">—</strong><span>నిమిషాలు</span></div><i>:</i><div><strong id="seconds" lang="en">—</strong><span>క్షణాలు</span></div></div></div>
      </div>
    </section>

    <section class="venue section" id="venue" aria-labelledby="venue-heading">
      <div class="section-inner venue-grid">
        <div class="venue-art" aria-hidden="true">
          <div class="arch"><div class="arch-inner"><span class="arch-star">✦</span>${toran}<div class="arch-lotus">${lotus}</div><div class="lamps">${lamp}${lamp}</div><div class="arch-steps"><span></span><span></span><span></span></div></div></div>
          <p>ఆనందాల వేడుకకు ఆహ్వానం</p>
        </div>
        <div class="venue-copy">
          <p class="eyebrow">కలుసుకుందాం</p><h2 id="venue-heading">వివాహ వేదిక</h2>
          <span class="venue-divider"></span>
          <h3 lang="en">CBS Convention</h3>
          <address lang="en">Narapally, Korremula Rd,<br />Sai Ram Nagar Colony, Venkatadri Twp,<br />Chowdhariguda, Majarguda,<br />Hyderabad, Telangana 500088</address>
          <a class="button button-solid" href="https://maps.app.goo.gl/dKanwQshRjnfzxzs5" target="_blank" rel="noopener noreferrer">${pin}<span>వేదికకు దారి</span>${arrow}</a>
          <p class="map-note" lang="en">Opens in Google Maps</p>
        </div>
      </div>
    </section>

    <section class="closing section" aria-labelledby="closing-heading">
      <div class="closing-lamp left-lamp">${lamp}</div><div class="closing-lamp right-lamp">${lamp}</div>
      ${lotus}<h2 id="closing-heading">మీ సమక్షంలో… మా శుభారంభం</h2><p>మీ రాక కోసం ప్రేమతో ఎదురుచూస్తూ</p><div class="closing-names" lang="en">Nikhil <span>&</span> Sravanthi</div><span class="closing-star" aria-hidden="true">✦</span>
    </section>
  </main>
  <footer><span lang="en">N & S</span><p>ప్రేమతో ఆహ్వానిస్తున్నాం</p><span lang="en">15 · 11 · 2026</span></footer>
`;

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
      "మా నూతన ప్రయాణం మొదలైంది";
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
    "క్యాలెండర్ ఫైల్ సిద్ధమైంది. మీ క్యాలెండర్‌లో తెరవండి.";
});
