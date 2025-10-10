import { StateCreator } from 'zustand';

export interface Color {
  name: string;
  color: [number, number, number];
}

const defaultPalette: Color[] = [
  { name: "Dark Blue", color: [13, 43, 69] },
  { name: "Medium Blue", color: [32, 60, 86] },
  { name: "Dark Purple", color: [84, 78, 104] },
  { name: "Medium Purple", color: [141, 105, 122] },
  { name: "Dark Orange", color: [208, 129, 89] },
  { name: "Orange", color: [255, 170, 94] },
  { name: "Light Orange", color: [255, 212, 163] },
  { name: "Very Light Orange", color: [255, 236, 214] }
];

export interface PaletteSlice {
  palette: Color[];
  setPalette: (palette: Color[]) => void;
  resetPalette: () => void;
}

export const createPaletteSlice: StateCreator<PaletteSlice> = (set) => ({
  palette: defaultPalette,

  setPalette: (palette) => set({ palette }),

  resetPalette: () => set({ palette: defaultPalette }),
});
