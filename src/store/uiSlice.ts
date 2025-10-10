import { StateCreator } from 'zustand';

export type BackgroundColor = 'white' | 'black' | 'peach' | 'grey';
export type PixelShape = 'square' | 'round';

export interface UISlice {
  showPixelView: boolean;
  backgroundColor: BackgroundColor;
  pixelShape: PixelShape;
  togglePixelView: () => void;
  setShowPixelView: (show: boolean) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setPixelShape: (shape: PixelShape) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  showPixelView: false,
  backgroundColor: 'white',
  pixelShape: 'round',

  togglePixelView: () => set((state) => ({ showPixelView: !state.showPixelView })),

  setShowPixelView: (show) => set({ showPixelView: show }),

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  setPixelShape: (shape) => set({ pixelShape: shape }),
});
