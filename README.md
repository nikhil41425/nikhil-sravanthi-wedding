# Nikhil & Sravanthi — Wedding invitation

A mobile-only, English-language wedding invitation with an animated envelope opening, a portrait cover, English names, original SVG illustrations, locally bundled fonts, a live countdown, Google Maps directions, and an iCalendar download. Includes a full-photo viewer, section navigation, scroll reveals, and reduced-motion support.

The opening fills the phone viewport with deep maroon silk, a faint gold mandala pattern, and a fine gold double frame around a Ganesha emblem, the couple's names, and an ivory envelope sealed with an N&S wax seal. The envelope floats gently, the seal pulses, and petals drift; everything is drawn in CSS and inline SVG with no image downloads. **Tap to open** breaks the seal, swings the flap open, and raises the card before a warm cream glow leads directly into the portrait, all within about 1.6 seconds. There is no separate name screen. The opening prevents scrolling until entry; the invitation scrolls normally afterward. Reduced-motion settings skip these effects. Refreshing or opening an old `/#wedding` link shows the envelope card again; direct section links such as `/#venue` still work. There is no autoplay audio. Sharing the link on WhatsApp or other apps shows a 1200×630 maroon-and-gold invitation banner (thoranam, Ganesha emblem, names, date, venue and brass lamps) from `public/og-invitation.jpg`, referenced by its full production URL in the Open Graph tags.

All invitation sections use the supplied banana-leaf and temple artwork, bundled locally as `src/assets/invitation-background.jpg`. The traditional invitation styling uses centred maroon headings, fine gold dividers, a soft cream reading area, and locally bundled Cormorant Garamond serif lettering. The cover fills the phone screen with the borderless couple photograph shown at its natural shape, so neither face is cropped; both names share the same size and weight and animate in kumkum lettering just beneath the photo as it fades into the cream background. CSS masks fade all four photo edges into the artwork without changing the original image; the full-photo viewer preserves the entire original portrait. The portrait fades in with subtle movement, a soft gold glow, and floating accents; continuous portrait effects pause when it is offscreen. A lotus crest tops the ceremony card, the venue has a larger two-line heading and readable address, and the closing carries the wedding seal. Supporting text stays readable on small phones, and the compact section navigation uses a single active highlight. Rose petals drift across every section beneath the navigation, with softer opacity through the central reading area. Petals never intercept taps and disappear when reduced motion is requested.

The background treatment varies by section: softened leaves behind family details, a quiet cream wash behind the ceremony, and more temple scenery at the venue. Shared gold accents and illustration strokes tie the sections together. Each section fades into a shared cream at its edges, so the coloured palettes meet without hard seams, and the footer continues the closing section's lotus palette. Dates, the ceremony time, and the countdown use lining numerals, the countdown sits in arched tiles that echo the date card, and the venue address rests in a soft framed card. Each section keeps a single accent colour for its headings and names, with numerals in kumkum red and ornaments in gold; small labels share one 11px tracked style, headings balance their line breaks, and the calendar and directions actions share one framed card design. The navigation tucks away on deliberate downward scrolling and returns on upward scrolling, keyboard focus, or reaching the end of the page. Section-link jumps keep it visible. Hidden navigation is inert and excluded from assistive navigation, and reduced-motion settings remove the slide transition.

Scroll reveals unfold each section once: headings fade upward, gold dividers extend, line illustrations draw in, family details and countdown numbers stagger, and the ceremony card and closing seal gently settle into place. Venue and closing ornaments drift by at most nine pixels with scrolling. Already revealed content stays visible when scrolling back. Keyboard focus reveals a control immediately, and changing the reduced-motion preference makes all content visible and removes the decorative movement. These effects use CSS and browser observers without an animation library.

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

The 39 browser checks cover phone layouts and the width constraint on larger screens, edge-to-edge artwork, the opening transition, keyboard entry, scrolling disabled before entry and restored afterward, landing visibility after refresh, direct links, section backgrounds, invitation details, navigation, directions, calendar date/time, the countdown, the photo viewer, and reduced-motion support. Navigation checks include real touch scrolling, hiding and returning on scroll direction, keyboard recovery, and visibility during section-link jumps.
The cloud environment uses its preinstalled `/usr/bin/chromium`, so the browser install step can be skipped there. Set `BROWSER_EXECUTABLE_PATH` to use another installed Chromium browser.

Edit invitation content in `src/main.js` and styling in `src/style.css`. The ceremony time is explicitly stored with the `+05:30` India timezone; the calendar export uses the equivalent `04:27 UTC`.
