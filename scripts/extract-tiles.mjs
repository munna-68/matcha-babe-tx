import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('reference/tiles');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function detectGridAndSlice(refNum) {
  const file = `reference/ref-0${refNum}.webp`;
  const img = sharp(file);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Let's find vertical dividing lines (where column borders occur)
  // Usually borders are 1-4px lines of constant background color (around 12, 16, 19 or 0,0,0 or white)
  // Or let's test fixed column widths based on the known Instagram grid:
  // In a 5-column or 3-column layout, tiles are square.
  console.log(`\nAnalyzing ${file} (${w}x${h})...`);
}

async function main() {
  for (let i = 1; i <= 6; i++) {
    await detectGridAndSlice(i);
  }
}

main().catch(console.error);
