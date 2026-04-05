import { StateCreator } from 'zustand';
import { Color } from './paletteSlice';

export interface HistoryEntry {
  id: string;
  imageDataUrl: string;
  width: number;
  height: number;
  palette: Color[];
  timestamp: number;
}

export interface HistorySlice {
  history: HistoryEntry[];
  addToHistory: (image: HTMLImageElement, palette: Color[]) => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<
  HistorySlice,
  [],
  [],
  HistorySlice
> = (set) => ({
  history: [],

  addToHistory: (image, palette) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      imageDataUrl: image.src,
      width: image.width,
      height: image.height,
      palette: JSON.parse(JSON.stringify(palette)), // Deep clone
      timestamp: Date.now(),
    };

    set((state) => ({
      history: [entry, ...state.history].slice(0, 10), // Keep last 10
    }));
  },

  loadFromHistory: (entry) => {
    const img = new Image();
    img.src = entry.imageDataUrl;
    img.onload = () => {
      // This will be called from components that have access to full store
      // We'll trigger the image and palette updates from the component
    };
  },

  clearHistory: () => set({ history: [] }),
});
