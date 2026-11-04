import sharp from 'sharp';

async function measure(refNum) {
  const file = `reference/ref-0${refNum}.webp`;
  const img = sharp(file);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Let's find horizontal borders
  const hBorders = [];
  for (let y = 1; y < h - 1; y++) {
    // Check if y is a dark line across multiple columns
    let darkCount = 0;
    for (let x = 200; x < w - 200; x += 10) {
      const idx = (y * w + x) * 3;
      if (data[idx] < 30 && data[idx + 1] < 30 && data[idx + 2] < 30) darkCount++;
    }
    if (darkCount > (w - 400) / 10 * 0.8) {
      hBorders.push(y);
    }
  }

  // Let's find vertical borders
  const vBorders = [];
  for (let x = 1; x < w - 1; x++) {
    let darkCount = 0;
    for (let y = 200; y < h - 200; y += 10) {
      const idx = (y * w + x) * 3;
      if (data[idx] < 30 && data[idx + 1] < 30 && data[idx + 2] < 30) darkCount++;
    }
    if (darkCount > (h - 400) / 10 * 0.8) {
      vBorders.push(x);
    }
  }

  // Compress consecutive border indices
  const compress = (arr) => {
    const res = [];
    let start = arr[0], prev = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === prev + 1) {
        prev = arr[i];
      } else {
        res.push({ start, end: prev, mid: Math.round((start + prev) / 2) });
        start = arr[i];
        prev = arr[i];
      }
    }
    if (start !== undefined) res.push({ start, end: prev, mid: Math.round((start + prev) / 2) });
    return res;
  };

  console.log(`\n=== ref-0${refNum} ===`);
  console.log('Horizontal dividers:', compress(hBorders));
  console.log('Vertical dividers:', compress(vBorders));
}

for (let i = 1; i <= 6; i++) {
  await measure(i);
}
