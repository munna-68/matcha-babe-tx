import sharp from 'sharp';

async function inspect(refNum) {
  const file = `reference/ref-0${refNum}.webp`;
  const img = sharp(file);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Instagram dark theme background is around rgb(18, 18, 18) or (12, 16, 19)
  // Let us find the columns
  const colScores = [];
  for (let x = 0; x < w; x++) {
    let darkCount = 0;
    for (let y = 100; y < h - 100; y += 15) {
      const idx = (y * w + x) * 3;
      if (data[idx] < 30 && data[idx + 1] < 30 && data[idx + 2] < 30) {
        darkCount++;
      }
    }
    colScores.push(darkCount / ((h - 200) / 15));
  }

  // Find continuous content segments
  const cols = [];
  let inContent = false, start = 0;
  for (let x = 0; x < w; x++) {
    if (colScores[x] < 0.6 && !inContent) {
      inContent = true;
      start = x;
    } else if (colScores[x] >= 0.6 && inContent) {
      inContent = false;
      if (x - start > 100) cols.push({ start, end: x - 1, w: x - start });
    }
  }
  if (inContent && w - start > 100) cols.push({ start, end: w - 1, w: w - start });

  console.log(`Ref 0${refNum} (${w}x${h}):`, cols);
}

for (let i = 1; i <= 6; i++) {
  await inspect(i);
}
