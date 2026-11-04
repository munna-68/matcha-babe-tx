# Matcha Babe: image generation brief

This brief is self-contained. It covers 30 photographs for a website for **Matcha Babe**, a small pop-up matcha business in McAllen, Texas (Rio Grande Valley). Her tagline is "organic ceremonial matcha, handcrafted to order". She serves iced matcha lattes in clear domed cups with pink straws, round glass bottles with silver caps, and small shot bottles, at markets, cafés and private events. The site is warm, playful and premium. All 30 images must look like **one cohesive photoshoot by the same photographer, on the same afternoon**.

---

## 1. Global style guide

**Overall look.** Natural, editorial food and drink photography with a modern Instagram feel: bright, fresh and a little playful, never glossy or stock-like. Think a boutique café's own photographer shooting on film-like digital.

**Lighting.** Soft, warm late-morning window light from the upper left. Gentle, natural shadows falling to the lower right. Light bounce fill so shadows stay open. Matcha should glow bright, grassy green, with visible ice-cube highlights and condensation. No hard flash, no ring light, no neon.

**Palette (match these hex values in props and surfaces).**
| Role | Hex |
|---|---|
| Deep forest green (brand primary) | #053F1C |
| Kelly green (checkerboard, tiles) | #0A7037 |
| Matcha latte green | #8AAB4B – #A9C47F |
| Cream / paper | #F3EDE0, #FBF8F1 |
| Oat / canvas | #E3D9C8 |
| Hot pink (straws, accents) | #D9436B |
| Blush pink | #F5C6D2 |
| Lavender (foam) | #CBB6EA |
| Ocean blue (blue coconut swirl) | #0C509E |

**Surfaces (reuse across the set).** Green-and-white checkerboard cloth, kelly-green square ceramic tiles with white grout, cream linen, warm cream card stock, light sun-warmed concrete or asphalt, fresh short grass, a dark wood café table.

**Props.**
- Clear plastic cups with domed lids and **hot pink straws**.
- Clear glass tumblers (ribbed or can-shaped).
- Round glass bottles with silver screw caps.
- Small 2 oz shot bottles with white caps.
- Kraft paper bags, cardboard cup carriers, a cream canvas tote.
- Cream satin ribbon, a bamboo matcha whisk (chasen), a ceramic matcha bowl.
- Small pumpkins (fall slots), rainbow star sprinkles, colorful cereal marshmallows.
- A dark green cap with **no visible text**.

**Depth of field & angles.** Three angles only, used consistently:
- **overhead flatlay** (90°)
- **three-quarter** (about 45°, slightly above the drink)
- **eye-level hero** (about 10°)

Shoot at a moderate aperture equivalent to f/2.8–f/4: the subject is sharp and the background softly blurred but recognisable.

**Mood.** Sunny, joyful, handmade, "treat yourself". Feminine but not saccharine. Clean compositions with breathing room.

**Never do.**
- No text, letters, logos, brand names, labels or watermarks anywhere, including cups, bottles, bags, caps and signs. Keep cups and bottles plain; the site adds branding.
- No real people and no faces. Hands are allowed only where a slot says so, and must be anatomically correct: five fingers, natural nails, no extra hands.
- Nothing plastic-looking, waxy or AI-glossy. No over-saturated neon green and no CGI liquid.
- No cluttered backgrounds, no busy patterns besides the listed checkerboard and tiles, no dark or moody low-key lighting.
- No hot steaming drinks unless stated. These are iced drinks with visible ice.

---

## 2. Reference images (`/reference/ref-01.webp` … `ref-06.webp`)
Use these as visual references to match her real brand and products. **Do not copy her logo or any text.**

- **ref-01**: profile header and first rows.
  - Take: the deep forest-green circular logo color (#013E17) and the chunky, friendly brand feel.
  - Take: the "2 yrs of MB" sprinkle cup (rainbow star sprinkles on foam).
  - Take: the warm café interior with rattan chairs, plants and a muffin beside an iced latte on a checked tray.
- **ref-02**:
  - Take: iced lattes in domed clear cups held at a café table.
  - Take: a cup on a padel net (outdoor bright light).
  - Take: the hot-pink brick wall with two hands toasting cups (pink #CE4266, hand style).
  - Take: a strawberry croissant beside a matcha bottle in a basket with a gingham cloth.
  - Take: favor bottles in a silver bowl with a cream ribbon, and an overhead iced matcha on white bedding.
- **ref-03**:
  - Take: kraft bag full of round and shot bottles on concrete.
  - Take: a beach shot with a bottle.
  - Take: the green pop-up bar counter with a cream banner.
  - Take: layered strawberry-pink and matcha cups on a dark green table.
  - Take: a picnic latte on grass and a latte against a pink wall.
- **ref-04**:
  - **The drink line-up**, the key product reference: OG Babe (green, pink flower), Lucky Charms (marshmallow topping), Lavender Haze (lavender foam), Blue Coconut (blue swirl), Strawberry Cutie (red-pink bottom layer) on a mint-green table.
  - Take: the shot bottles flatlay, the canvas tote, the gym and studio scenes.
- **ref-05**:
  - Take: the cup carrier with pink straws on asphalt.
  - Take: the pumpkin-patch latte on hay.
  - Take: bottles stacked on a tiered stand.
  - Take: the green pop-up bar under a canopy.
  - Take: a cream tote full of bottles on grass, and the **green and white checkerboard** overhead shot.
- **ref-06**:
  - Take: the cap, cups with sticker lids, the shot-bottle huddle, and a matcha soft-serve cup.
  - Take: the affogato glass on green tiles.
  - Take: the green tiles with a dark loyalty card (texture only, no text), and bottles in a bucket at an event.

---

## 3. Slot table
Files go in `/public/images/<slot-id>.webp`. "Size" is the exact pixel size to generate (2× the display size). Each prompt is ready to paste; prepend the **style line** below to every prompt.

> **Style line:** *Natural editorial drink photography, soft warm window light from upper left, gentle shadows, bright grassy matcha green, realistic condensation and ice, cohesive with a single photoshoot, no text, no logos, no people's faces.*

### Home & features
| Slot / file | Where | Ratio · size | Prompt (subject, composition, background, light, mood) | Refs | Avoid | Alt text |
|---|---|---|---|---|---|---|
| `home-hero` → home-hero.webp | Home hero, tall arch frame (top of the image is cropped into a semicircle) | 3:4 · 1200×1600 | Eye-level hero of one iced ceremonial matcha latte in a clear domed cup with a hot pink straw, held up by one hand (fingers natural, only the hand and wrist visible) against a soft cream wall with a blurred window and a hint of green plant. Matcha layer floating over milk, visible ice, condensation. Keep the cup centered in the upper-middle so the arch crop frames it; generous space above the lid. Joyful, fresh. | ref-02, ref-04 | text on cup, face, extra fingers | An iced ceremonial matcha latte with a pink straw, held up in warm window light |
| `season-feature` → season-feature.webp | Home "Two years of Babe" feature, rounded rectangle | 4:5 · 1280×1600 | Three-quarter view of a celebration iced matcha latte topped with a dome of vanilla cold foam and rainbow star sprinkles, in a clear tumbler on a blush-pink linen surface; scattered sprinkles and a small cream ribbon loop nearby. Background soft blush and cream. Birthday mood, playful but elegant. | ref-01 ("2 yrs of MB" cup) | candles, text, cake | Birthday Cake Babe matcha topped with vanilla cold foam and rainbow sprinkles |
| `cat-events` → cat-events.webp | Home category "Private events"; order step 1 | 4:5 · 1200×1500 | Three-quarter view of a small deep-green wooden pop-up bar counter with a plain cream cloth banner, set with rows of iced matcha cups with pink straws, round matcha bottles, a jar of pink straws and a blank cream menu card in a wavy frame; leafy garden softly blurred behind. No people. | ref-03, ref-05 (green bar) | text on banner/menu, people | A green matcha bar set up for a private event with bottles, straws and a menu card |
| `packaging-bundle` → packaging-bundle.webp | Home "How it works" step 2 | 4:3 · 1600×1200 | Overhead flatlay on sunlit concrete: an open kraft paper bag packed with small matcha shot bottles (white caps) and two round bottles (silver caps), a blank cream loyalty card, two heart-shaped stickers (one pink, one forest green, no letters) and a pink straw. Crisp shadows to lower right. | ref-03 (kraft bag), ref-04 | text, logos on stickers | A kraft pick-up bag filled with matcha shot bottles, a loyalty card and stickers |

### Fall menu (seasonal, limited): shown as tall arch cards, keep the drink centered with space above
| Slot / file | Ratio · size | Prompt | Refs | Alt text |
|---|---|---|---|---|
| `season-birthday-cake` | 3:4 · 900×1200 | Three-quarter view, iced matcha in a clear domed cup topped with vanilla cold foam and rainbow star sprinkles, pink straw, on cream linen; a few sprinkles scattered. | ref-01 | Iced matcha latte crowned with vanilla cold foam and rainbow star sprinkles |
| `season-pumpkin-cream` | 3:4 · 900×1200 | Eye-level, iced matcha latte in a clear tumbler with pumpkin-spice cold foam and a cinnamon dusting, beside two small orange pumpkins on golden straw; soft autumn backlight. | ref-05 (pumpkin) | Matcha latte with pumpkin spice cold foam beside small pumpkins on straw |
| `season-maple-pecan` | 3:4 · 900×1200 | Three-quarter view, iced matcha over oat milk with a glossy maple drizzle on the foam and crushed toasted pecans, on a dark wood table with a few whole pecans. | ref-01 (café table) | Iced matcha with a maple drizzle and crushed pecans on top |
| `season-horchata` | 3:4 · 900×1200 | Eye-level, layered drink: creamy white horchata bottom, bright matcha top, cinnamon dusting, a cinnamon stick, clear glass on cream card stock. | ref-04 (layering) | Layered horchata matcha latte dusted with cinnamon |
| `season-chai-spice` | 3:4 · 900×1200 | Three-quarter view, iced chai-spiced matcha latte in a ribbed glass on kelly-green tiles with white grout, a cinnamon stick and star anise beside it. | ref-06 (tiles) | Chai-spiced matcha latte with a cinnamon stick on a linen napkin |
| `season-peppermint` | 3:4 · 900×1200 | Three-quarter view, matcha latte with white whipped foam and crushed red-and-white candy cane, clear domed cup with pink straw, cream linen with a small sprig of evergreen. Holiday but bright. | ref-02 | Peppermint white mocha matcha with crushed candy cane on whipped foam |

### Core lattes (menu cards, 4:5)
| Slot / file | Size | Prompt | Refs | Alt text |
|---|---|---|---|---|
| `latte-og-babe` | 1000×1250 | Eye-level, classic iced matcha latte in a ribbed clear tumbler, matcha clouding into milk, a single small pink flower on the ice, mint-green table. | ref-04 | The OG Babe: a classic iced ceremonial matcha latte in a clear cup |
| `latte-strawberry-cutie` | 1000×1250 | Eye-level, clear glass with a red-pink strawberry purée bottom layer, milk, and a bright matcha float on top, ice visible; mint-green table. | ref-04, ref-03 | Strawberry Cutie: strawberry purée layered under a matcha float |
| `latte-lavender-haze` | 1000×1250 | Eye-level, can-shaped glass: matcha latte topped with a thick pale lavender (#CBB6EA) cold foam; mint-green table. | ref-04 | Lavender Haze: matcha latte topped with pale lavender cold foam |
| `latte-blue-coconut` | 1000×1250 | Eye-level, can-shaped glass with ocean-blue (#0C509E) marbled swirls in coconut milk under bright matcha on top. | ref-04 | Blue Coconut: coconut milk with a blue swirl under bright green matcha |
| `latte-lucky-charms` | 1000×1250 | Three-quarter view, tall glass of matcha latte with white cold foam crowned with colorful cereal marshmallow shapes (no cereal box, no branding). | ref-04 | Lucky Charms: cereal-milk matcha with colorful marshmallow charms on top |
| `latte-mexican-vanilla` | 1000×1250 | Round glass bottle of creamy pale-green matcha with a blank handwritten-style kraft tag tied with string (no legible writing), resting in a woven basket with a gingham cloth. | ref-02 | Mexican vanilla oat milk matcha in a round bottle tied with a handwritten tag |

### Bottles & bundles (4:5 · 1000×1250)
| Slot / file | Prompt | Refs | Alt text |
|---|---|---|---|
| `bottle-signature` | Single round glass bottle of matcha latte with a silver screw cap on kelly-green tiles, ice cubes beside it, strong window light. | ref-06, ref-05 | A round glass bottle of matcha latte with a silver cap on a green tiled surface |
| `bottle-shots-six` | Overhead, six small 2 oz matcha shot bottles with white caps standing in an open kraft paper bag on concrete. | ref-03, ref-04 | Six small matcha shot bottles packed in a kraft paper bag |
| `bottle-favours` | Three-quarter view, a silver bowl filled with round matcha bottles each tied with cream satin ribbon and a blank round cream tag; elegant shower table, soft background. | ref-02, ref-06 | Round matcha favor bottles tied with cream ribbon in a silver bowl |

### Order flow (side panel, tall arch, 3:4 · 1200×1600)
| Slot / file | Prompt | Refs | Alt text |
|---|---|---|---|
| `order-backdrop-1` | Overhead flatlay, a cardboard cup carrier holding two iced matcha lattes with hot pink straws on warm asphalt, sunglasses and a pink lip balm tube beside it, crisp afternoon shadows. Leave the lower third calm (a summary card overlays it). | ref-05 | Overhead view of iced matcha lattes in a cardboard carrier with pink straws |
| `order-backdrop-2` | Overhead, a ceramic matcha bowl with frothy whisked matcha and a bamboo chasen on dark kelly-green tiles, a little matcha powder dusted on the grout. Lower third calm. | ref-06 | A ceremonial matcha bowl and bamboo whisk on dark green tiles |

### Gallery (editorial grid)
| Slot / file | Ratio · size | Prompt | Refs | Alt text |
|---|---|---|---|---|
| `gallery-01` | 4:5 · 1200×1500 | Overhead, iced matcha in a clear cup centered on a green-and-white checkerboard cloth. | ref-05 | Iced matcha seen from above on a green and white checkerboard cloth |
| `gallery-02` | 1:1 · 1200×1200 | One hand holding a cardboard carrier with two iced lattes, pink straws, over sunny asphalt (hand only). | ref-05 | Two iced matcha lattes with pink straws in a cardboard cup carrier on asphalt |
| `gallery-03` | 3:4 · 1200×1600 | A green pop-up matcha bar under a white canopy at an outdoor market, bottles and straw jar on the counter, no people. | ref-05 | A green pop-up matcha bar under a white canopy at an outdoor market |
| `gallery-04` | 4:5 · 1200×1500 | Overhead, a cream canvas tote spilling with matcha bottles on fresh short grass. | ref-05 | A canvas tote full of matcha bottles resting on fresh grass |
| `gallery-05` | 1:1 · 1200×1200 | Eye-level, matcha affogato: scoop of vanilla ice cream drowned in bright green matcha in a short glass on light-green tiles. | ref-06 | A matcha affogato in a short glass |
| `gallery-06` | 16:10 · 1600×1000 | Overhead picnic: green gingham blanket, iced matcha in a small red cooler with ice, a heart-shaped dish of sliced kiwi, grapes and cucumber. | ref-05 | A picnic blanket with an iced matcha in a red cooler, sliced kiwi and grapes |
| `gallery-07` | 3:4 · 1200×1600 | Eye-level, pumpkin spice matcha latte standing on hay next to a large orange pumpkin, golden sunset backlight. | ref-05 | A pumpkin spice matcha latte standing on hay next to a large orange pumpkin |
| `gallery-08` | 4:5 · 1200×1500 | Three-quarter view, a plain dark forest-green cap (no text) beside an iced matcha on green tiles. | ref-06 | A dark green cap and an iced matcha on a green tiled table |

### Social
| Slot / file | Ratio · size | Prompt | Alt text |
|---|---|---|---|
| `og-image` | 1.91:1 · 2400×1260 | Wide overhead flatlay on cream linen: five iced matcha drinks in a loose row (OG green, strawberry-layered, lavender foam, blue swirl, sprinkle-topped), pink straws, a few sprinkles. Keep the left 40% calm and lighter for an overlaid title. | Matcha Babe iced matcha lattes arranged on cream linen |

---

## 4. Generation order, consistency, format, hook-up
**Order:**
1. `home-hero`, then `season-feature` (these set the look; get approval first).
2. The five core lattes (establish the cup/glass and table language).
3. The six fall drinks.
4. Bottles and `packaging-bundle`.
5. Order backdrops and `cat-events`.
6. The gallery.
7. `og-image` last.

**Consistency tips.** Reuse the same three surfaces (cream linen, kelly-green tiles, checkerboard) and the same light direction (upper left) everywhere. The same clear domed cup and hot-pink straw appear in every cup shot. The matcha green stays in the #8AAB4B–#A9C47F range. Keep color grading identical: warm whites, slightly lifted shadows. If your tool supports it, use the first approved hero as a style reference for every later image.

**Format.** WebP, quality ~82, sRGB, exactly the pixel sizes above (2× display). Keep the main subject inside the central ~70%, because frames crop into arches and rounded rectangles.

**Hook-up checklist.**
1. Save each file as `/public/images/<slot-id>.webp` (for example `home-hero.webp`).
2. Run `npm run images:check` to see which slots are still missing.
3. Restart or refresh `npm run dev`. Real files replace the placeholders automatically, with no code changes. For a production build, re-run `npm run build`.
4. Visit any page with `?labels=1` to see slot IDs on every image (✓ = real file found).
