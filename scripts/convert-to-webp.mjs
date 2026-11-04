import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [,, inputPath, slotId, widthStr, heightStr] = process.argv;

if (!inputPath || !slotId) {
  console.error('Usage: node scripts/convert-to-webp.mjs <inputPath> <slotId> [width] [height]');
  process.exit(1);
}

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, `${slotId}.webp`);

let pipeline = sharp(inputPath);
if (widthStr && heightStr) {
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);
  pipeline = pipeline.resize(width, height, { fit: 'cover', position: 'center' });
}

await pipeline
  .webp({ quality: 84 })
  .toFile(outPath);

console.log(`Saved ${outPath}`);
