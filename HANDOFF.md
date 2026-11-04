# Handoff: Matcha Babe demo site (for the next agent / redesign)

**State:** redesigned (Nov 2026) from a reference hero mock-up: see DESIGN_NOTES.md section 3. Typecheck, lint and `next build` are clean. The redesign is not committed yet.

## Run
```bash
npm install
npm run dev            # http://localhost:3000
npm run images:check   # lists image slots still missing files (30/30 missing now)
```
Add `?labels=1` to any URL to see image slot IDs. To replay the preloader, clear sessionStorage (`mb-intro`).

## What it is
A sales-video demo for **Matcha Babe (@matchababetx)**, a pop-up matcha business in McAllen, TX. There's no backend; all state is in memory. The original brief was written for a London bakery ("KensalBakes"). The repo, link and screenshots are Matcha Babe, so the build adapts that brief: same pages and animation spec, US English, $.

Read first:
- `DESIGN_NOTES.md`: every design decision and why, plus what's real vs fake
- `IMAGE_BRIEF.md`: 30-slot photo brief for the image agent
- `research/`: `web.md` (web/IG access results), `screenshots.md` (transcribed facts), `palette.md` (sampled hex values)
- `reference/ref-01…06.webp`: her Instagram grid screenshots (the source of truth)

## Stack
Next.js **16.4** app router (note: `cacheComponents` is deliberately OFF in `next.config.ts`; it keeps old routes mounted and breaks GSAP cleanup), React 19, Tailwind v4 (tokens in `src/app/globals.css` `@theme`), GSAP 3.15 (ScrollTrigger, SplitText, CustomEase) + `@gsap/react`, Lenis.

## Map
| Area | Files |
|---|---|
| Tokens, fonts, global CSS | `src/app/globals.css` (tokens, `.puff`/`.display`/`.eyebrow`, `.btn` + `.roll`), `src/app/layout.tsx` (next/font: DynaPuff with the wdth axis, Figtree) |
| Providers | `src/app/providers.tsx`: store, image availability, route transition, Lenis, cursor |
| Mock data (single source) | `src/data/mock.ts`: menu, drops, gallery, enquiries, week, capacity, stats |
| Image system | `src/data/images.ts` (manifest), `src/components/image/{BrandImage,Placeholder,ImageProvider}.tsx`, `scripts/images-check.mjs` |
| Motion | `src/lib/gsap.ts` (house ease `babe`), `src/lib/stage.ts` (gate the preloader/transition use so entrances start underneath exits), `src/components/motion/*` (SplitReveal, primitives: ScriptWrite/ScrollFill/Marquee/CountUp/TrackedLabel/RevealImage/Stagger/Tilt, Preloader, PageTransition + `TransitionLink`, SmoothScroll; the custom cursor was removed) |
| Brand bits | `src/components/brand/{Brand,Button}.tsx`: `Wordmark` (jiggle letters, used by nav/hero/preloader/footer), doodles (hearts, speed dashes, brush underline), leaf shadows, icons, mascot, M/B stickers, pill buttons. `src/components/site/PageHeader.tsx`, `src/components/menu/DrinkCard.tsx` |
| Pages | `src/app/(site)/{page,menu,order,gallery}`, `src/app/dashboard` |
| Sections | `src/components/home/Hero.tsx`, `Sections.tsx` (Statement, Signatures, FallMenuScroller, HowItWorks, Loyalty, FindUs, Events, PhotoStrip), `menu/MenuView.tsx`, `gallery/GalleryView.tsx`, `order/{OrderFlow,model,Calendar,Confirmation}.tsx`, `dashboard/{Dashboard,Inbox,parts}.tsx` |
| State | `src/lib/store.tsx`: enquiries, `incomingId` (drives the dashboard arrival), menu toggles |

## Key mechanics to preserve in a redesign
- **Every image goes through `<BrandImage slot>`.** The frame is `[data-brand-img]` and the inner layer is `[data-img-inner]`, and the animations target those attributes. Dropping `/public/images/<slot>.webp` swaps in the real photo.
- **Use `TransitionLink`, not `Link`.** It plays the route transition. Entrance animations use `trigger="stage"` so they wait for the preloader or transition.
- **The heart of the video:** order submit → `submitEnquiry` → Confirmation "Watch it land in Babe HQ" → dashboard holds the new row about 1.1s, then FLIP-inserts it (`Inbox.tsx`) with a toast and counters ticking up.
- **Pre-hydration safety:** `[data-hero]`, `[data-fade]` and `[data-pop]` are hidden only while `.js:not(.motion-ready)`, and a CSS fallback reveals them anyway. The preloader is hidden via `.mb-seen` or `<noscript>`.
- **Preloader to hero hand-off:** the preloader calls `claimHeroWord()` (`lib/stage.ts`) when `[data-hero-word]` exists, then FLIPs its wordmark onto it. The hero skips its own word entrance when `introOwnsHeroWord()` is true. `[data-hero-word]` stays hidden by CSS until `.mb-seen` is set. Both use the same `Wordmark` with em-based sizing; change one and the other follows.
- **Reduced motion:** every primitive falls back to fades, and Lenis is disabled.
- **Dashboard menu toggles** hide items live on Menu, the Home fall scroller and the order form.

## Verified
Checked in the browser:
- Preloader, once per session.
- All Home sections at 1440px, including the pinned horizontal menu and stacked cards.
- The full order flow at desktop width, ending in the confirmation.
- The route transition into the dashboard and the arrival animation (row at the top, badge 3, All 7).
- Order step 1 at 375px with no horizontal overflow.

`tsc` and `eslint` are clean.

## Not verified / known gaps
- Menu and Gallery pages, plus the lightbox, haven't been looked at in a browser.
- Dashboard on mobile, the Calendar/Menu/Settings views and the drawer haven't been looked at.
- No `npm run build` yet, no production 60fps profiling, no reduced-motion pass in a browser.
- Prices, customers, stats, drops after Nov 7 and most fall specials are invented (marked "demo").
- The footer "BABE" row is justified across the full width; consider left-aligning it.
- Stacked-card dim overlay (`HowItWorks`, opacity 0.4) looks greyish on the paper card; lower it.
- The Next dev indicator shows bottom-left in dev only.

## Redesign check (Nov 2026)
- Verified in the browser at 1440×900 and 375×812: home (every section), menu, gallery, order steps 1–2, dashboard, the preloader (desktop and phone) and the arch route transition. No horizontal overflow at 375px.
- Not re-checked after the redesign: order steps 3–5, the confirmation and "watch it land" hand-off, dashboard drawer and the other views, the lightbox, and a reduced-motion pass.
- Dev console shows React's "script tag inside component" warning for the boot script in `layout.tsx`. It predates the redesign; the script still runs from the server HTML.

## Redesign suggestions (starting points)
- Swap the placeholders for real photos first (see IMAGE_BRIEF.md). Most of the remaining "premium" gap is imagery.
- The hero could go full-bleed and more cinematic once a real hero photo exists.
- Tokens and fonts all live in `globals.css` + `layout.tsx`, so a palette or type change is a two-file edit.
