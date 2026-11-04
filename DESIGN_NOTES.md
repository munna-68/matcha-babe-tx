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

## 3. Design decisions
- **Palette.** Deep forest #053F1C as "ink" (never black), kelly #0A7037, matcha #8AAB4B, cream paper #F3EDE0, hot pink #D9436B for action, plus blush, lavender and blue as sprinkle accents only. *Why:* every value is lifted from her actual photos, so it reads as her brand rather than a generic "matcha green".
- **Typography.** *Bagel Fat One* (chunky, soft, like her logo) for display. *Instrument Serif* for editorial headlines, which matches the condensed serif on her flyers. *Caveat* script for "for the Babes" accents. *DM Mono* for tracked labels and dates, echoing the typewriter date lines in her posts. *DM Sans* for body. *Why:* her feed already mixes these four voices; I gave each one a single job.
- **Layout.** Editorial grid with arch frames, M/B heart stickers, checkerboard and tile textures, pink pill highlights, thin double rules with sparkles. *Why:* boutique-agency restraint, but every motif comes from her merch and photos.
- **Preloader: "Whisked to order"** (~2.9s, once per session). A line-art iced cup draws itself, fills with milk, then a wave of matcha rises while a counter runs to 100. The cup collapses into the green badge, the chunky MATCHA/BABE letters pop in, then the green floods the screen and pours away upward. The hero is already rising underneath the exit, not after it. *Why:* it's her bio ("handcrafted to order") told in three seconds.
- **Motion language.** One house ease (soft expo-out) and consistent durations, animating transform, opacity and clip-path only.
  - Text: headlines rise out of SplitText line masks, key words pop per character, script lines write on with a mask wipe, and labels open up from tight to tracked.
  - Images: clip-path reveals (arch opening upward, curtain, wipe, inset), inner scale 1.25 → 1, then soft parallax inside the frame.
  - Page features: velocity-reactive marquee, scroll-scrubbed statement fill, a pinned horizontal fall menu, sticky stacked "how it works" cards, magnetic buttons and a labelled cursor ("Order", "View").
  - Route changes: a pink "straw stripe" and a green pour sweep up the screen. Reduced motion gets simple fades, and content stays visible if JS fails.
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
