# Nikhil & Sravanthi — Wedding invitation

A mobile-only Telugu wedding invitation with a portrait cover, English names, original SVG illustrations, locally bundled fonts, a live countdown, Google Maps directions, and an iCalendar download. Includes a full-photo viewer, section navigation, scroll reveals, and reduced-motion support.

Wedding: **15 November 2026, Sunday, 9:57 AM IST**, at **CBS Convention, Hyderabad**.

## Development

Requires Node.js 22.12+ (Node.js 24 is available in the cloud environment).

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static hosting provider. There is no backend, no credential requirement, and no external font request.

## Browser checks

```sh
npx playwright install chromium
npm test
```

The invitation stays in a single column, filling phone screens and remaining phone-sized on larger displays.

Tests cover phone layouts and the width constraint on larger screens, invitation details, navigation, directions, calendar date/time, the countdown, the photo viewer, and reduced-motion support.
The cloud environment uses its preinstalled `/usr/bin/chromium`, so the browser install step can be skipped there. Set `BROWSER_EXECUTABLE_PATH` to use another installed Chromium browser.

Edit invitation content in `src/main.js` and styling in `src/style.css`. The ceremony time is explicitly stored with the `+05:30` India timezone; the calendar export uses the equivalent `04:27 UTC`.
