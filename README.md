# Nikhil & Sravanthi — Wedding invitation

A mobile-only, English-language wedding invitation with an animated envelope opening, a portrait cover, English names, original SVG illustrations, locally bundled fonts, a live countdown, Google Maps directions, and an iCalendar download. Includes section navigation, scroll reveals, and reduced-motion support.

The opening fills the phone viewport with deep maroon silk, a faint gold mandala pattern, and a fine gold double frame around a Ganesha emblem, the couple's names, and an ivory envelope sealed with an N&S wax seal. The envelope floats gently, the seal pulses, and petals drift; everything is drawn in CSS and inline SVG with no image downloads. **Tap to open** breaks the seal, swings the flap open, and raises the card before a warm cream glow leads directly into the portrait, all within about 1.6 seconds. There is no separate name screen. The opening prevents scrolling until entry; the invitation scrolls normally afterward. Reduced-motion settings skip these effects. Refreshing or opening an old `/#wedding` link shows the envelope card again; direct section links such as `/#venue` still work. There is no autoplay audio. Sharing the link on WhatsApp or other apps shows a 1200×630 maroon-and-gold invitation banner (thoranam, Ganesha emblem, names, date, venue and brass lamps) from `public/og-invitation.jpg`, referenced by its full production URL in the Open Graph tags.

After the envelope, the invitation has exactly three main sections:

1. **The invitation** (`#invitation`): the edge-to-edge couple portrait, equal-sized names on one line, wedding date, Ganesha blessing, family invitation message, and a link to the celebration. The portrait and invitation message share a continuous cream background, without a separate cover or repeated family-name panel.
2. **The celebration** (`#muhurtham`): the ceremony date and time, iCalendar download, live countdown, and lamp illustration, in a soft green and gold palette.
3. **The venue** (`#venue`): the complete venue address, Google Maps directions, mandap illustration, and a compact wedding seal and sign-off. The closing is part of the venue rather than a separate section.

Numbered markers and the three-link navigation follow these same sections. The supplied banana-leaf and temple artwork remains bundled locally as `src/assets/invitation-background.jpg`, with soft washes and cream transitions between sections. The first section keeps the portrait background quiet, and the final section has enough bottom space for the fixed navigation. Names, the venue, date, time, and all guest actions remain available.

The portrait uses CSS masks to soften its edges without cropping either face or changing the original image. Continuous portrait effects pause when it is offscreen. Rose petals drift beneath the navigation and never intercept taps. Scroll reveals unfold content once; headings, dividers, ornaments, countdown numbers, and the closing seal animate with CSS and browser observers. Keyboard focus reveals controls immediately, and reduced motion removes decorative movement.

The navigation tucks away on deliberate downward scrolling and returns on upward scrolling, keyboard focus, or reaching the end of the page. Section-link jumps keep it visible. Hidden navigation is inert and excluded from assistive navigation. Direct links to all three sections work, while refresh returns to the envelope.

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

The 15 browser checks, each run at three screen sizes, cover phone layouts and the width constraint on larger screens, edge-to-edge artwork, the opening transition, keyboard entry, scrolling disabled before entry and restored afterward, landing visibility after refresh, direct links, the three-section structure, section backgrounds, invitation details, navigation, directions, calendar date/time, the countdown, the share banner, and reduced-motion support. Navigation checks include real touch scrolling, hiding and returning on scroll direction, keyboard recovery, and visibility during section-link jumps.
The cloud environment uses its preinstalled `/usr/bin/chromium`, so the browser install step can be skipped there. Set `BROWSER_EXECUTABLE_PATH` to use another installed Chromium browser.

Edit invitation content in `src/main.js` and styling in `src/style.css`. The ceremony time is explicitly stored with the `+05:30` India timezone; the calendar export uses the equivalent `04:27 UTC`.
