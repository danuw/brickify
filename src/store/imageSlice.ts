import { StateCreator } from 'zustand';

export interface CropDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeDimensions {
  width: number;
  height: number;
}

export interface ImageSlice {
  originalImage: HTMLImageElement | null;
  image: HTMLImageElement | null;
  setImage: (image: HTMLImageElement | null) => void;
  cropImage: (dimensions: CropDimensions) => void;
  resizeImage: (dimensions: ResizeDimensions) => void;
}

export const createImageSlice: StateCreator<ImageSlice> = (set, get) => ({
  originalImage: null,
  image: null,

  setImage: (image) => {
    set({ image, originalImage: image });

    // Auto-resize to 48x48 when a new image is loaded
    if (image) {
      setTimeout(() => {
        const { resizeImage } = get();
        resizeImage({ width: 48, height: 48 });
      }, 0);
    }
  },

  cropImage: (dimensions) => {
    const { originalImage } = get();
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(
      originalImage,
      dimensions.x,
      dimensions.y,
      dimensions.width,
      dimensions.height,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.onload = () => set({ image: newImage });
  },

  resizeImage: (dimensions) => {
    const { image } = get();
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.onload = () => set({ image: newImage });
  },
});
