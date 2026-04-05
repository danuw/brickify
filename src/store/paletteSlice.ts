import { StateCreator } from 'zustand';

export interface Color {
  name: string;
  color: [number, number, number];
}

export interface PalettePreset {
  name: string;
  description: string;
  colors: Color[];
  /** Optional buy link shown alongside the palette (e.g. affiliate URL) */
  link?: string;
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

/**
 * All individually purchasable 1×1 round brick colors from the AliExpress listing.
 * RGB values match standard LEGO/BrickLink color equivalents.
 * Buy link: https://s.click.aliexpress.com/e/_c4Fl1IcF
 */
const aliExpressBricksPalette: Color[] = [
  { name: "White",              color: [255, 255, 255] },
  { name: "Light Gray",         color: [228, 228, 228] },
  { name: "Light Bluish Gray",  color: [175, 181, 199] },
  { name: "Dark Bluish Gray",   color: [89,  93,  96 ] },
  { name: "Dark Gray",          color: [61,  61,  61 ] },
  { name: "Black",              color: [0,   0,   0  ] },
  { name: "Light Royal Blue",   color: [75,  151, 220] },
  { name: "Slate Gray",         color: [105, 105, 105] },
  { name: "Skin White",         color: [252, 232, 210] },
  { name: "Flesh Pink",         color: [255, 185, 155] },
  { name: "Light Flesh",        color: [255, 214, 191] },
  { name: "Flesh Tan",          color: [222, 178, 144] },
  { name: "Flesh Red",          color: [193, 102, 65 ] },
  { name: "Nougat",             color: [208, 145, 104] },
  { name: "Medium Dark Flesh",  color: [167, 85,  50 ] },
  { name: "Dark Orange",        color: [169, 85,  40 ] },
  { name: "Brown",              color: [118, 77,  43 ] },
  { name: "Dark Brown",         color: [60,  35,  15 ] },
  { name: "Tan",                color: [222, 199, 144] },
  { name: "Dark Tan",           color: [150, 130, 91 ] },
  { name: "Bright Yellow",      color: [255, 214, 0  ] },
  { name: "Yellow",             color: [247, 209, 23 ] },
  { name: "Dark Yellow",        color: [213, 166, 0  ] },
  { name: "Bright Orange",      color: [255, 126, 20 ] },
  { name: "Orange",             color: [240, 120, 0  ] },
  { name: "Light Pink",         color: [255, 182, 193] },
  { name: "Bright Pink",        color: [255, 92,  168] },
  { name: "Dark Pink",          color: [212, 101, 147] },
  { name: "Magenta",            color: [213, 0,   107] },
  { name: "Red",                color: [196, 40,  28 ] },
  { name: "Dark Red",           color: [123, 28,  28 ] },
  { name: "Sand Red",           color: [194, 116, 92 ] },
  { name: "Medium Lavender",    color: [159, 143, 186] },
  { name: "Purple",             color: [125, 62,  182] },
  { name: "Dark Purple",        color: [65,  20,  117] },
  { name: "Medium Blue",        color: [85,  154, 193] },
  { name: "Medium Azure",       color: [66,  192, 251] },
  { name: "Navy Blue",          color: [0,   32,  108] },
  { name: "Dark Azure",         color: [0,   111, 192] },
  { name: "Bright Light Blue",  color: [159, 195, 233] },
  { name: "Blue",               color: [13,  105, 171] },
  { name: "Dark Blue",          color: [0,   32,  96 ] },
  { name: "Sand Blue",          color: [125, 156, 186] },
  { name: "Yellowish Green",    color: [215, 240, 0  ] },
  { name: "Lime",               color: [180, 210, 0  ] },
  { name: "Olive Green",        color: [124, 144, 0  ] },
  { name: "Sand Green",         color: [120, 163, 129] },
  { name: "Light Aqua",         color: [166, 218, 209] },
  { name: "Bright Green",       color: [75,  159, 74 ] },
  { name: "Green",              color: [37,  134, 72 ] },
  { name: "Dark Green",         color: [0,   100, 46 ] },
  { name: "Army Green",         color: [72,  89,  42 ] },
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
  },
  {
    name: "AliExpress Bricks",
    description: "All 52 individually buyable 1×1 round brick colors",
    colors: aliExpressBricksPalette,
    link: "https://s.click.aliexpress.com/e/_c4Fl1IcF"
  }
];

export interface PaletteSlice {
  palette: Color[];
  currentPresetIndex: number;  // -1 = "from image" custom palette
  customColorCount: number;
  setPalette: (palette: Color[]) => void;
  selectPreset: (index: number) => void;
  setCustomPaletteFromImage: (palette: Color[]) => void;
  setCustomColorCount: (count: number) => void;
}

export const createPaletteSlice: StateCreator<PaletteSlice> = (set) => ({
  palette: sunsetPalette,
  currentPresetIndex: 0,
  customColorCount: 8,

  setPalette: (palette) => set({ palette }),

  selectPreset: (index) => {
    if (index < 0 || index >= PALETTE_PRESETS.length) return;
    set({
      palette: PALETTE_PRESETS[index].colors,
      currentPresetIndex: index
    });
  },

  setCustomPaletteFromImage: (palette) => set({ palette, currentPresetIndex: -1 }),

  setCustomColorCount: (count) => set({ customColorCount: count }),
});
