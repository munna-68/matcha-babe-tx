import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('scratch/tiles');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// We will crop each ref into its individual tiles:
// Let's define the grid geometry for each ref based on our measurements:
// In a 5-column layout:
// colWidth is approx 349-388 depending on margins.
// Let's write a function to slice any ref into R{row}C{col}.

async function sliceRef(refId, options) {
  const { startX, colWidth, colGap, rows } = options;
  const file = `reference/${refId}.webp`;
  console.log(`Slicing ${file}...`);

  for (let r = 0; r < rows.length; r++) {
    const rowInfo = rows[r];
    for (let c = 0; c < 5; c++) {
      const left = Math.round(startX + c * (colWidth + colGap));
      const top = rowInfo.top;
      const width = Math.round(colWidth);
      const height = rowInfo.height;

      const outName = `${refId}_r${r + 1}c${c + 1}.png`;
      const outPath = path.join(outDir, outName);

      try {
        await sharp(file)
          .extract({ left, top, width, height })
          .toFile(outPath);
        console.log(`Saved ${outName} (${width}x${height})`);
      } catch (err) {
        console.error(`Failed ${outName}:`, err.message);
      }
    }
  }
}

async function main() {
  // ref-04:
  // startX: 147, colWidth: 349, colGap: 2
  // row 1: top: 34, height: 465
  // row 2: top: 500, height: 465
  await sliceRef('ref-04', {
    startX: 147,
    colWidth: 349,
    colGap: 2,
    rows: [
      { top: 34, height: 465 },
      { top: 500, height: 465 }
    ]
  });

  // ref-05:
  // Let's check startX and row tops for ref-05
}

main().catch(console.error);
