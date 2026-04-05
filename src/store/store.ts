import { create } from 'zustand';
import { ImageSlice, createImageSlice } from './imageSlice';
import { PaletteSlice, createPaletteSlice } from './paletteSlice';
import { UISlice, createUISlice } from './uiSlice';
import { HistorySlice, createHistorySlice } from './historySlice';

export type BrickifyStore = ImageSlice & PaletteSlice & UISlice & HistorySlice;

export const useBrickifyStore = create<BrickifyStore>()((...a) => ({
  ...createImageSlice(...a),
  ...createPaletteSlice(...a),
  ...createUISlice(...a),
  ...createHistorySlice(...a),
}));
