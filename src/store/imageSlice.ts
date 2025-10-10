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
  image: HTMLImageElement | null;
  setImage: (image: HTMLImageElement | null) => void;
  cropImage: (dimensions: CropDimensions) => void;
  resizeImage: (dimensions: ResizeDimensions) => void;
}

export const createImageSlice: StateCreator<ImageSlice> = (set, get) => ({
  image: null,

  setImage: (image) => set({ image }),

  cropImage: (dimensions) => {
    const { image } = get();
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(
      image,
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
