import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = 'scratch/tiles/ref04_r1_c4.jpg';
const outDir = 'scratch/drink_crops';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function crop(name, { left, top, width, height }) {
  const outPath = path.join(outDir, `${name}.jpg`);
  await sharp(src)
    .extract({ left, top, width, height })
    .jpeg({ quality: 95 })
    .toFile(outPath);
  console.log(`Saved ${name}: ${width}x${height}`);
}

async function main() {
  // OG Babe: front-left
  await crop('latte-og-babe', { left: 0, top: 220, width: 140, height: 175 });
  // Strawberry Cutie: front-center
  await crop('latte-strawberry-cutie', { left: 110, top: 245, width: 130, height: 162 });
  // Blue Coconut: front-right
  await crop('latte-blue-coconut', { left: 225, top: 215, width: 123, height: 154 });
  // Lucky Charms: back-left
  await crop('latte-lucky-charms', { left: 65, top: 150, width: 115, height: 144 });
  // Lavender Haze: back-right
  await crop('latte-lavender-haze', { left: 165, top: 170, width: 115, height: 144 });
}

main().catch(console.error);
