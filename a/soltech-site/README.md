# SolTech — Marketing Site

The SolTech (Sollenberger Technologies, LLC) landing page, rebuilt in **Angular 21 + TypeScript**.
Static single-page marketing site — no backend, no contact form, no captcha. Visitors
reach out by copying / clicking the contact email.

## Quick start

```bash
npm install
npm start          # ng serve -> http://localhost:4200
```

Build for production (outputs static files to `dist/soltech-site/browser/`):

```bash
npm run build
```

The build output is fully static — drop it on any static host (Netlify, Vercel,
Cloudflare Pages, GitHub Pages, S3, nginx). No Node server required at runtime.

## ✏️ Change the contact email (the one thing you'll want first)

It lives in **exactly one place**:

```
src/app/core/site.config.ts   ->   email: 'contact@soltech.example'
```

Change that string. The clickable address, the copy button, and the `mailto:` link
all read from it. (It's currently a placeholder on the reserved `.example` domain.)

## Editing content without touching markup

All page copy is data-driven. Edit the arrays in:

```
src/app/core/site.content.ts
```

- `NAV_LINKS`   — the top-nav items
- `SERVICES`    — the three "What We Build" cards (add/remove freely)
- `ABOUT_POINTS`— the "SolTech Difference" bullet points

Company name / brand / tagline live in `site.config.ts`.

## Project structure

```
src/
  styles.css                       global design system: tokens, shared
                                    utilities (.btn-glow, section headers),
                                    all @keyframes, base responsive rules
  index.html                       <head>: title, SEO/OG meta, font links
  app/
    app.ts / app.html              root shell: background + nav + page + footer
    app.routes.ts                  routes ('' -> Home; add lazy routes here)
    core/
      site.config.ts               brand + EMAIL (single source of truth)
      site.content.ts              editable page copy (typed arrays)
    shared/
      background/                  3-canvas animated cosmos (stars/nebula/fog)
      nav/                         fixed nav + mobile hamburger menu
      footer/
      email-link/                  click-to-copy email + copy icon  ← the new feature
    pages/
      home/                        composes the four sections
    sections/
      hero/  services/  about/  contact/
```

Each section is its own component, so the layout is easy to reorder, edit, or
extend. New pages (e.g. a client portal) slot into `app.routes.ts` without
touching the shell.

## How the contact email behaves

`shared/email-link` implements the brief:

- **Desktop** (fine pointer): clicking the address **copies it** to the clipboard.
- **Mobile** (touch): clicking the address **opens the mail app** via `mailto:`.
- The **copy icon** copies on every device, with a brief "Copied!" confirmation.
- The `mailto:` href is always present, so if JS ever fails the link still works.

## Responsiveness & motion

- One responsive CSS layout (breakpoints at 980 / 860 / 640 px) — no duplicated
  mobile/desktop markup. The nav collapses to a hamburger under 860 px.
- The background animations honor `prefers-reduced-motion` (static frame, no loop)
  and use lighter particle counts on small screens so phones stay smooth.

## Notes / easy upgrades

- **Logo:** the hero orb currently shows an "ST" lettermark. To use your real logo,
  drop `hero-logo.svg` into `public/` and follow the comment in
  `sections/hero/hero.html` (swap the `<span class="orb-letters">` for the `<img>`).
- **Fonts:** loaded at runtime from Google Fonts via the `<link>` in `index.html`.
  Build-time font inlining is disabled in `angular.json`
  (`optimization.fonts.inline = false`) so builds don't depend on network access.
  Flip it to `true` for the inlining perf optimization, or self-host the fonts for
  best performance/privacy.
- **SSR / prerendering:** for better SEO and first-paint, you can add it later with
  `ng add @angular/ssr`. The background code already guards browser-only work via
  `afterNextRender`, so it's SSR-safe.
