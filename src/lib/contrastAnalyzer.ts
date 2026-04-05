/**
 * Analyze and adjust image contrast/brightness.
 * Works primarily with luminance (brightness) in HSL space to preserve hue/saturation.
 */

function rgbToHsL(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = h * 6;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

interface LuminanceStats {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

/**
 * Calculate luminance stats from ImageData.
 */
export function analyzeLuminance(imageData: ImageData): LuminanceStats {
  const data = imageData.data;
  const luminances: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue; // skip transparent
    // Standard luminance formula (BT.709)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    luminances.push(lum / 255); // normalize to [0,1]
  }

  if (luminances.length === 0) {
    return { mean: 0.5, stdDev: 0.2, min: 0, max: 1 };
  }

  const mean = luminances.reduce((a, b) => a + b) / luminances.length;
  const variance = luminances.reduce((a, x) => a + Math.pow(x - mean, 2)) / luminances.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    stdDev: stdDev || 0.2, // prevent zero std dev
    min: Math.min(...luminances),
    max: Math.max(...luminances)
  };
}

/**
 * Adjust color palette to match target luminance distribution.
 * Preserves hue/saturation, scales lightness to match original image's stats.
 */
export function adjustColorsForContrast(
  colors: [number, number, number][],
  targetStats: LuminanceStats,
  brightnessOffset: number = 0
): [number, number, number][] {
  // Analyze current palette's luminance
  const currentLums = colors.map(([r, g, b]) => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }).map(l => l / 255);

  const currentMean = currentLums.reduce((a, b) => a + b) / currentLums.length;
  const currentVariance = currentLums.reduce((a, x) => a + Math.pow(x - currentMean, 2)) / currentLums.length;
  const currentStdDev = Math.sqrt(currentVariance) || 0.2;

  // Transform each color: map current luminance distribution to target
  return colors.map(([r, g, b]) => {
    const [h, s] = rgbToHsL(r, g, b);
    // Normalize current luminance to z-score
    const currentNorm = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const zScore = (currentNorm - currentMean) / currentStdDev;
    // Map to target distribution
    let newL = targetStats.mean + zScore * targetStats.stdDev;
    // Apply brightness offset
    newL += brightnessOffset;
    // Clamp to [0,1]
    newL = Math.max(0, Math.min(1, newL));
    // Convert back to RGB
    return hslToRgb(h, s, newL);
  });
}
