/**
 * Median-cut color quantization.
 * Extracts up to `maxColors` dominant colors from a canvas ImageData pixel array.
 */

interface Bucket {
  pixels: [number, number, number][];
}

function componentRange(pixels: [number, number, number][], ch: 0 | 1 | 2): number {
  let min = 255, max = 0;
  for (const p of pixels) {
    if (p[ch] < min) min = p[ch];
    if (p[ch] > max) max = p[ch];
  }
  return max - min;
}

function splitBucket(bucket: Bucket): [Bucket, Bucket] {
  const pixels = bucket.pixels;
  const rRange = componentRange(pixels, 0);
  const gRange = componentRange(pixels, 1);
  const bRange = componentRange(pixels, 2);
  const ch: 0 | 1 | 2 = rRange >= gRange && rRange >= bRange ? 0 : gRange >= bRange ? 1 : 2;

  const sorted = [...pixels].sort((a, b) => a[ch] - b[ch]);
  const mid = Math.floor(sorted.length / 2);
  return [
    { pixels: sorted.slice(0, mid) },
    { pixels: sorted.slice(mid) },
  ];
}

function bucketAverage(pixels: [number, number, number][]): [number, number, number] {
  let r = 0, g = 0, b = 0;
  for (const p of pixels) {
    r += p[0]; g += p[1]; b += p[2];
  }
  const n = pixels.length;
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/**
 * Sample pixel data from the array (stride to keep performance manageable).
 */
function samplePixels(data: Uint8ClampedArray, maxSamples = 8000): [number, number, number][] {
  const total = data.length / 4;
  const step = Math.max(1, Math.floor(total / maxSamples));
  const out: [number, number, number][] = [];
  for (let i = 0; i < total; i += step) {
    const idx = i * 4;
    const a = data[idx + 3];
    if (a < 128) continue; // skip transparent
    out.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  return out;
}

export function quantizeColors(
  imageData: ImageData,
  maxColors: number
): [number, number, number][] {
  const pixels = samplePixels(imageData.data);
  if (pixels.length === 0) return [];

  // eslint-disable-next-line prefer-const
  let buckets: Bucket[] = [{ pixels }];

  while (buckets.length < maxColors) {
    // Split the largest bucket
    let largest = 0;
    for (let i = 1; i < buckets.length; i++) {
      if (buckets[i].pixels.length > buckets[largest].pixels.length) largest = i;
    }
    if (buckets[largest].pixels.length < 2) break;

    const [a, b] = splitBucket(buckets[largest]);
    buckets.splice(largest, 1, a, b);
  }

  return buckets
    .filter(b => b.pixels.length > 0)
    .map(b => bucketAverage(b.pixels));
}
