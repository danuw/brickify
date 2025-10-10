import { StateCreator } from 'zustand';

export type BackgroundColor = 'white' | 'black' | 'peach' | 'grey';
export type PixelShape = 'square' | 'round';
export type GridBackgroundColor = 'white' | 'black' | 'peach' | 'darkgrey';

export interface UISlice {
  showPixelView: boolean;
  backgroundColor: BackgroundColor;
  pixelShape: PixelShape;
  gridBackgroundColor: GridBackgroundColor;
  gridPixelShape: PixelShape;
  togglePixelView: () => void;
  setShowPixelView: (show: boolean) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setPixelShape: (shape: PixelShape) => void;
  setGridBackgroundColor: (color: GridBackgroundColor) => void;
  setGridPixelShape: (shape: PixelShape) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  showPixelView: false,
  backgroundColor: 'white',
  pixelShape: 'round',
  gridBackgroundColor: 'white',
  gridPixelShape: 'round',

  togglePixelView: () => set((state) => ({ showPixelView: !state.showPixelView })),

  setShowPixelView: (show) => set({ showPixelView: show }),

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  setPixelShape: (shape) => set({ pixelShape: shape }),

  setGridBackgroundColor: (color) => set({ gridBackgroundColor: color }),

  setGridPixelShape: (shape) => set({ gridPixelShape: shape }),
});
