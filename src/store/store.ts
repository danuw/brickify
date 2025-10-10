import { create } from 'zustand';
import { ImageSlice, createImageSlice } from './imageSlice';
import { PaletteSlice, createPaletteSlice } from './paletteSlice';
import { UISlice, createUISlice } from './uiSlice';

export type BrickifyStore = ImageSlice & PaletteSlice & UISlice;

export const useBrickifyStore = create<BrickifyStore>()((...a) => ({
  ...createImageSlice(...a),
  ...createPaletteSlice(...a),
  ...createUISlice(...a),
}));
