# Matcha Babe: design notes

*Concept demo for a screen-recorded sales video. No backend; all data is placeholder.*

> **Brief note:** the brief I was given was written for a London bakery (KensalBakes). The repo, the Instagram link and every attached screenshot are **Matcha Babe (@matchababetx), McAllen, TX**. I kept the brief's structure, pages, animation direction and process, and applied them to Matcha Babe. That means US English, $, Texas locations, and drinks instead of cakes.

## 1. The problem, in three sentences
Matcha Babe sells organic ceremonial matcha at pop-ups and private events, and Instagram is her only storefront. Every pre-order or party booking turns into a DM thread to work out the drink, milk, date, pick-up spot and name. This site gives customers one tidy request flow and gives her a dashboard where those requests arrive complete.

## 2. What research found (and didn't)
Three Haiku agents worked from the six screenshots (`/reference`) and the open web. Findings are in `/research/*.md`.
- **Found (screenshots):** bio "For the Babes 💚 / organic ceremonial matcha, handcrafted to order ✨ / pop-ups • private events". Drink names: **OG Babe, Strawberry Cutie, Lavender Haze, Blue Coconut, Lucky Charms**, plus a Mexican vanilla oat-milk tag. "2 yrs of MB". The Casa Vibra weekend residency (Oct 3–4 & 10–11, 1105 W Tamarack Ave, McAllen). The Fall Events flyer, which lists Nov 7 at The Lakes Family Dental in Edinburg. "Scan 2 Pay". A loyalty card: *"Grab 9 iced matcha lattes and your 10th is on us!"* Round and shot bottles, favor bottles, caps, totes, M/B heart stickers, a cup mascot, checkerboard and green tiles.
- **Palette** was sampled from pixels: logo green #013E17, checker green #077034, brick-wall pink #CE4266, lavender #CBB6EA, blue #0C509E, latte greens #85A546–#A9C47F.
- **Couldn't get:** Instagram beyond the public preview (no captions or highlights), and any website, prices, policies or ordering process. No other web presence turned up. Everything in those gaps is invented and marked **demo**: prices, drink descriptions, the fall specials other than Birthday Cake and Pumpkin, the drops after Nov 7, customers, stats. DM-only ordering is an assumption based on the profile.

## 3. Design decisions (redesign, Nov 2026)
Art direction comes from a reference hero mock-up: a sun-washed plaster wall with leaf shadows, a giant puffy wordmark, a light tracked tagline, one solid pill, three small promises with dividers, and the product on a big green arch.
- **Palette.** Sage-cream ground #EEE6CF (milk #F7F2E3 for cards, sand #E3D8BA for alternating bands), deep leaf ink #1F3A1F, field green #3D6A33 for arches and bands, latte green #8DB045. Her pink #E0507A appears only in tiny doses: heart stickers, straws, the next-drop dot. Old token names (`paper`, `kelly`, `oat`, `ink`) are mapped to the new values.
- **Typography.** Two families. *DynaPuff* (variable, width axis) is the display face: wdth 100 / 700 for the wordmark and giant page words, wdth 92 / 650 for headings, set in sentence case. *Figtree* for body and UI. The old serif, script and mono voices are retired, and their CSS variables now resolve to these two faces. The wordmark has a hand-set "jiggle": each letter is slightly rotated and offset, like the logo stamped on her cups (`Wordmark` in `Brand.tsx`, one component everywhere).
- **Layout.** The nav follows the reference: wordmark left, links centred, a round bag button right, and a hairline rule. Inner pages share `PageHeader`: a tracked line, one giant bouncy word, a sentence and a fact. Sections are centred where they make a single point (intro, loyalty, pop-ups) and split where they compare (signature grid, how-it-works).
- **Placeholders.** Until photos arrive, each drink is drawn on a flat tinted tile with its real layers (strawberry at the bottom, lavender foam, blue swirl), toppings, a straw and the stamped wordmark (`Placeholder.tsx`). Dropping a photo into `/public/images/<slot>.webp` still swaps it in.
- **Preloader: "Poured to order"** (~3s, once per session). The MATCHA / BABE wordmark rises in as an outline. A wavy latte-green fill rises through the letters while a counter runs 000 to 100. The fill settles into ink, the letters hop, then the word flies (FLIP) into its exact place in the hero while the wall fades. On pages without a hero word, the cover lifts away with a rounded edge.
- **Route transition: "the arch".** A field-green panel rises with a domed top (the hero disc's shape), the destination name pops in letter by letter, the route swaps, and the panel leaves upward with a rounded bottom edge.
- **Motion language.** One big move per section: hero entrance, intro words filling with photo pills popping inline, the pinned horizontal fall menu, sticky stacked steps, loyalty stamps filling one by one on scroll (pinned on desktop), the events photo window opening, a photo marquee, and the footer wordmark rising. The custom cursor and magnetic buttons were removed. Buttons use a rising-disc fill with a rolling label.
- **Loyalty card.** It is now a faithful replica of her real card (cream stamp side, dark front peeking out behind it), with nine cup stamps and a FREE tenth, and copy that explains how pre-orders earn and redeem stamps.
- **Order flow.** Five steps (type → order → when → details → review) with a live "ticket" that fills in as you go. *Why:* it asks exactly what she'd otherwise ask in DMs.
  - It understands her real formats: pick-up drops, bottles (favors in sets of 6, minimum 24), and events (guests, package, up to 3 flavors).
  - Dates: lead times, closed Mondays, a holiday cutoff of Dec 19 and a break from Dec 20 to Jan 3.
  - Extras: a loyalty-card redemption checkbox, a mobile sticky action bar, and a confirmation with a filling cup and a sprinkle burst.
- **Dashboard ("Babe HQ").** Inbox (new / quoted / confirmed / ready) with one-tap status changes and a drawer with a suggested reply. Also a week view, weekly cup-capacity meter, a 7-day requests chart, and live menu toggles that update the public site instantly. *Why:* small, believable numbers for a one-person business. **The money shot:** submit an order, tap "Watch it land in Babe HQ", the ticket flies off, the pour transition plays, and the new request drops into the top of the inbox. The other rows slide down, a pink highlight and sprinkles mark the new one, and the counters tick up.

## 4. Why a site + request flow beats DM-only (her side)
Every request arrives complete: items, milk, date, pick-up spot, contact. That removes the 5–10 message warm-up per order. She can see the week's cups against her capacity before saying yes, so no overbooking a market day. Menu, prices, drops and the holiday cutoff live in one place instead of being retyped in DMs and stories. Private events, her biggest tickets, get a proper intake form. Customers can pre-order at 11pm without waiting for a reply, and the loyalty card is tracked automatically.

## 5. Talking points for the video
1. "Her whole brand, rebuilt from her own feed: real colors, real drinks, her bio as the preloader."
2. "Five taps replace a twenty-message DM thread."
3. "Watch it land: the customer hits send and it's in her inbox, complete."
4. "She flips a drink off in her dashboard and it disappears from the site instantly."
5. "Built for the holiday rush: cutoffs, capacity and lead times are baked in."

## 6. What's fake, and what a real version needs
**Fake:** all prices, customers, stats, drops after Nov 7, drink descriptions, most fall specials, the reply-time metric. State lives in memory (it resets on reload and doesn't cross devices). No messages are sent; the images are placeholders.
**Real version needs:**
- a database and auth for her dashboard
- email/SMS notifications, plus Instagram DM deep-links
- payments or deposits (Square, which likely already powers her Scan 2 Pay)
- real menu and price management
- calendar sync and a real capacity rule
- spam protection on the form
- privacy policy and data retention
- hosting
- her real photography (see IMAGE_BRIEF.md)
