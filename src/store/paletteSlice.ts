import { StateCreator } from 'zustand';

export interface Color {
  name: string;
  color: [number, number, number];
}

export interface PalettePreset {
  name: string;
  description: string;
  colors: Color[];
}

const sunsetPalette: Color[] = [
  { name: "Dark Blue", color: [13, 43, 69] },
  { name: "Medium Blue", color: [32, 60, 86] },
  { name: "Dark Purple", color: [84, 78, 104] },
  { name: "Medium Purple", color: [141, 105, 122] },
  { name: "Dark Orange", color: [208, 129, 89] },
  { name: "Orange", color: [255, 170, 94] },
  { name: "Light Orange", color: [255, 212, 163] },
  { name: "Very Light Orange", color: [255, 236, 214] }
];

const monochromePalette: Color[] = [
  { name: "Black", color: [0, 0, 0] },
  { name: "Dark Gray", color: [64, 64, 64] },
  { name: "Medium Gray", color: [128, 128, 128] },
  { name: "Light Gray", color: [192, 192, 192] },
  { name: "Very Light Gray", color: [224, 224, 224] },
  { name: "White", color: [255, 255, 255] }
];

const vibrantPalette: Color[] = [
  { name: "Red", color: [255, 0, 0] },
  { name: "Orange", color: [255, 165, 0] },
  { name: "Yellow", color: [255, 255, 0] },
  { name: "Green", color: [0, 255, 0] },
  { name: "Blue", color: [0, 0, 255] },
  { name: "Purple", color: [128, 0, 128] },
  { name: "Pink", color: [255, 192, 203] },
  { name: "White", color: [255, 255, 255] }
];

const pastelPalette: Color[] = [
  { name: "Pastel Pink", color: [255, 209, 220] },
  { name: "Pastel Blue", color: [174, 198, 207] },
  { name: "Pastel Mint", color: [189, 224, 214] },
  { name: "Pastel Lavender", color: [200, 191, 231] },
  { name: "Pastel Yellow", color: [255, 253, 208] },
  { name: "Pastel Peach", color: [255, 218, 185] }
];

const earthTonesPalette: Color[] = [
  { name: "Dark Brown", color: [101, 67, 33] },
  { name: "Brown", color: [150, 107, 72] },
  { name: "Tan", color: [210, 180, 140] },
  { name: "Olive", color: [128, 128, 0] },
  { name: "Moss Green", color: [138, 154, 91] },
  { name: "Sand", color: [238, 214, 175] },
  { name: "Terracotta", color: [204, 78, 92] }
];

const oceanPalette: Color[] = [
  { name: "Deep Ocean", color: [3, 54, 73] },
  { name: "Ocean Blue", color: [0, 119, 182] },
  { name: "Sea Blue", color: [0, 180, 216] },
  { name: "Aqua", color: [72, 202, 228] },
  { name: "Seafoam", color: [150, 222, 209] },
  { name: "Light Cyan", color: [221, 244, 247] }
];

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    name: "Sunset",
    description: "Warm sunset gradient",
    colors: sunsetPalette
  },
  {
    name: "Monochrome",
    description: "Black to white grayscale",
    colors: monochromePalette
  },
  {
    name: "Vibrant",
    description: "Bright rainbow colors",
    colors: vibrantPalette
  },
  {
    name: "Pastel",
    description: "Soft pastel tones",
    colors: pastelPalette
  },
  {
    name: "Earth Tones",
    description: "Natural earthy colors",
    colors: earthTonesPalette
  },
  {
    name: "Ocean",
    description: "Deep sea to light cyan",
    colors: oceanPalette
  }
];

export interface PaletteSlice {
  palette: Color[];
  currentPresetIndex: number;
  setPalette: (palette: Color[]) => void;
  selectPreset: (index: number) => void;
}

export const createPaletteSlice: StateCreator<PaletteSlice> = (set) => ({
  palette: sunsetPalette,
  currentPresetIndex: 0,

  setPalette: (palette) => set({ palette }),

  selectPreset: (index) => {
    if (index < 0 || index >= PALETTE_PRESETS.length) return;
    set({
      palette: PALETTE_PRESETS[index].colors,
      currentPresetIndex: index
    });
  },
});
