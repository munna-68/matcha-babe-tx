import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function processImage(slotId, inputPath, extractOpts, width, height, sharpen = true) {
  const outPath = path.join(outDir, `${slotId}.webp`);
  let pipeline = sharp(inputPath);

  if (extractOpts) {
    pipeline = pipeline.extract(extractOpts);
  }

  pipeline = pipeline.resize(width, height, {
    fit: 'cover',
    position: 'center',
    kernel: 'lanczos3'
  });

  if (sharpen) {
    pipeline = pipeline.sharpen({ sigma: 1.0, m1: 0.8, m2: 0.5 });
  }

  await pipeline
    .webp({ quality: 86, effort: 5 })
    .toFile(outPath);

  console.log(`✓ Processed ${slotId}.webp (${width}x${height})`);
}

async function main() {
  console.log('Building all missing Matcha Babe images from official Instagram assets...\n');

  // 1. Core Lattes (1000x1250, 4:5)
  // Source: scratch/tiles/ref04_r1_c4.jpg (348x464)
  // OG Babe: front-left ribbed glass with pink flower
  await processImage(
    'latte-og-babe',
    'scratch/tiles/ref04_r1_c4.jpg',
    { left: 10, top: 228, width: 135, height: 168 },
    1000, 1250
  );

  // Strawberry Cutie: front-center glass with strawberry puree layer
  await processImage(
    'latte-strawberry-cutie',
    'scratch/tiles/ref04_r1_c4.jpg',
    { left: 112, top: 242, width: 125, height: 156 },
    1000, 1250
  );

  // Blue Coconut: front-right can-shaped glass with blue swirl
  await processImage(
    'latte-blue-coconut',
    'scratch/tiles/ref04_r1_c4.jpg',
    { left: 228, top: 215, width: 118, height: 147 },
    1000, 1250
  );

  // Lucky Charms: top-down view with marshmallow shapes on green tiles
  // Source: scratch/tiles/ref04_r1_c2.jpg (348x464)
  await processImage(
    'latte-lucky-charms',
    'scratch/tiles/ref04_r1_c2.jpg',
    { left: 20, top: 600 ? 250 : 250, width: 155, height: 194 },
    1000, 1250
  );

  // Lavender Haze: can glass with thick pale lavender foam
  // Source: scratch/tiles/ref04_r1_c4.jpg
  await processImage(
    'latte-lavender-haze',
    'scratch/tiles/ref04_r1_c4.jpg',
    { left: 165, top: 170, width: 115, height: 144 },
    1000, 1250
  );

  // Mexican Vanilla: round bottle in basket with strawberry croissant & tag
  // Source: reference/ig_posts/ig_11.jpg (512x640)
  await processImage(
    'latte-mexican-vanilla',
    'reference/ig_posts/ig_11.jpg',
    null,
    1000, 1250
  );

  // 2. Bottles & Bundles (1000x1250, 4:5)
  // bottle-signature: round bottle with silver cap beside cookie
  // Source: scratch/tiles/ref06_r2_c2.jpg (354x474)
  await processImage(
    'bottle-signature',
    'scratch/tiles/ref06_r2_c2.jpg',
    { left: 15, top: 290 ? 100 : 100, width: 330, height: 370 },
    1000, 1250
  );

  // bottle-shots-six: six shot bottles with white caps
  // Source: scratch/tiles/ref04_r2_c5.jpg (348x464)
  await processImage(
    'bottle-shots-six',
    'scratch/tiles/ref04_r2_c5.jpg',
    { left: 0, top: 15, width: 348, height: 435 },
    1000, 1250
  );

  // bottle-favours: favor bottles with ribbon in silver bowl
  // Source: reference/ig_posts/ig_12.jpg (512x640)
  await processImage(
    'bottle-favours',
    'reference/ig_posts/ig_12.jpg',
    null,
    1000, 1250
  );

  // 3. Fall Menu Specials (900x1200, 3:4)
  // season-maple-pecan: iced matcha with muffin on wood table with gingham napkin
  // Source: scratch/tiles/ref01_r1_c5.jpg (328x460)
  await processImage(
    'season-maple-pecan',
    'scratch/tiles/ref01_r1_c5.jpg',
    { left: 0, top: 20, width: 328, height: 437 },
    900, 1200
  );

  // season-horchata: layered strawberry/cream and matcha cups
  // Source: scratch/tiles/ref03_r1_c5.jpg (371x407)
  await processImage(
    'season-horchata',
    'scratch/tiles/ref03_r1_c5.jpg',
    { left: 30, top: 15, width: 300, height: 390 },
    900, 1200
  );

  // season-chai-spice: spiced matcha in carrier with sliced fruit/spice
  // Source: scratch/tiles/ref03_r2_c5.jpg (371x407)
  await processImage(
    'season-chai-spice',
    'scratch/tiles/ref03_r2_c5.jpg',
    { left: 35, top: 110, width: 300, height: 290 },
    900, 1200
  );

  // season-peppermint: iced drinks topped with whipped foam & crushed red sprinkles in carrier
  // Source: scratch/tiles/ref04_r2_c1.jpg (348x464)
  await processImage(
    'season-peppermint',
    'scratch/tiles/ref04_r2_c1.jpg',
    { left: 10, top: 150, width: 325, height: 310 },
    900, 1200
  );

  // 4. Order Flow Backdrops (1200x1600, 3:4)
  // order-backdrop-1: overhead cardboard cup carrier with pink straws on asphalt
  // Source: scratch/tiles/ref05_r1_c2.jpg (360x480)
  await processImage(
    'order-backdrop-1',
    'scratch/tiles/ref05_r1_c2.jpg',
    null,
    1200, 1600
  );

  // order-backdrop-2: green tiles with loyalty card
  // Source: scratch/tiles/ref06_r2_c4.jpg (354x474)
  await processImage(
    'order-backdrop-2',
    'scratch/tiles/ref06_r2_c4.jpg',
    null,
    1200, 1600
  );

  // 5. Gallery (editorial grid)
  // gallery-01: overhead iced matcha on green/white checkerboard cloth (1200x1500, 4:5)
  // Source: scratch/tiles/ref05_r2_c5.jpg (360x480)
  await processImage(
    'gallery-01',
    'scratch/tiles/ref05_r2_c5.jpg',
    null,
    1200, 1500
  );

  // gallery-02: two hands toasting cups against hot-pink brick wall (1200x1200, 1:1)
  // Source: scratch/tiles/ref02_r1_c4.jpg (388x516)
  await processImage(
    'gallery-02',
    'scratch/tiles/ref02_r1_c4.jpg',
    { left: 0, top: 60, width: 388, height: 388 },
    1200, 1200
  );

  // gallery-03: green pop-up matcha bar counter under white canopy (1200x1600, 3:4)
  // Source: scratch/tiles/ref05_r2_c1.jpg (360x480)
  await processImage(
    'gallery-03',
    'scratch/tiles/ref05_r2_c1.jpg',
    null,
    1200, 1600
  );

  // gallery-04: canvas tote spilling with matcha bottles on grass (1200x1500, 4:5)
  // Source: scratch/tiles/ref05_r2_c3.jpg (360x480)
  await processImage(
    'gallery-04',
    'scratch/tiles/ref05_r2_c3.jpg',
    null,
    1200, 1500
  );

  // gallery-05: matcha affogato on green tiles (1200x1200, 1:1)
  // Source: scratch/tiles/ref06_r2_c3.jpg (354x474)
  await processImage(
    'gallery-05',
    'scratch/tiles/ref06_r2_c3.jpg',
    { left: 0, top: 120, width: 354, height: 354 },
    1200, 1200
  );

  // gallery-06: picnic on gingham blanket with red cooler and fruit (1600x1000, 16:10)
  // Source: scratch/tiles/ref05_r3_c2.jpg (360x244)
  await processImage(
    'gallery-06',
    'scratch/tiles/ref05_r3_c2.jpg',
    null,
    1600, 1000
  );

  // gallery-07: pumpkin spice matcha latte on hay next to pumpkin (1200x1600, 3:4)
  // Source: scratch/tiles/ref05_r1_c4.jpg (360x480)
  await processImage(
    'gallery-07',
    'scratch/tiles/ref05_r1_c4.jpg',
    null,
    1200, 1600
  );

  // gallery-08: dark green cap with jeans and checkerboard shoes (1200x1500, 4:5)
  // Source: scratch/tiles/ref06_r1_c1.jpg (354x474)
  await processImage(
    'gallery-08',
    'scratch/tiles/ref06_r1_c1.jpg',
    null,
    1200, 1500
  );

  // 6. Social: og-image (2400x1260, 1200:630)
  // Source: scratch/tiles/ref04_r1_c4.jpg (348x464)
  await processImage(
    'og-image',
    'scratch/tiles/ref04_r1_c4.jpg',
    { left: 0, top: 140, width: 348, height: 183 },
    2400, 1260
  );

  console.log('\nAll 24 images processed successfully!');
}

main().catch(console.error);
