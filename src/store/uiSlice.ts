import { StateCreator } from 'zustand';

export interface UISlice {
  showPixelView: boolean;
  togglePixelView: () => void;
  setShowPixelView: (show: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  showPixelView: false,

  togglePixelView: () => set((state) => ({ showPixelView: !state.showPixelView })),

  setShowPixelView: (show) => set({ showPixelView: show }),
});
