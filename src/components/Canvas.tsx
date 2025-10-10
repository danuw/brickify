import React, { useRef, useEffect, useCallback } from 'react';
import { colorCorrection } from '@/lib/utils';
import { useBrickifyStore } from '@/store/store';
import { Color } from '@/store/paletteSlice';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);

  const image = useBrickifyStore((state) => state.image);
  const showPixelView = useBrickifyStore((state) => state.showPixelView);
  const palette = useBrickifyStore((state) => state.palette);

  const findClosestColor = useCallback((r: number, g: number, b: number): Color => {
    let minDistance = Infinity;
    let closestColor = palette[0];

    for (const color of palette) {
      const [pr, pg, pb] = color.color;
      const distance = Math.sqrt(
        Math.pow(r - pr, 2) +
        Math.pow(g - pg, 2) +
        Math.pow(b - pb, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    return closestColor;
  }, [palette]);

  const renderPixelView = useCallback(() => {
    if (!canvasRef.current || !pixelCanvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const pixelCtx = pixelCanvasRef.current.getContext('2d');
    if (!ctx || !pixelCtx) return;

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imageData.data;
    const dotSize = 5;

    pixelCanvasRef.current.width = canvasRef.current.width * dotSize;
    pixelCanvasRef.current.height = canvasRef.current.height * dotSize;

    for (let y = 0; y < canvasRef.current.height; y++) {
      for (let x = 0; x < canvasRef.current.width; x++) {
        const index = (y * canvasRef.current.width + x) * 4;
        const [r, g, b] = colorCorrection(
          data[index],
          data[index + 1],
          data[index + 2]
        );
        const a = data[index + 3] / 255;

        const { color: [closestR, closestG, closestB] } = findClosestColor(r, g, b);

        pixelCtx.fillStyle = `rgba(${closestR},${closestG},${closestB},${a})`;
        pixelCtx.beginPath();
        pixelCtx.arc(
          x * dotSize + dotSize / 2,
          y * dotSize + dotSize / 2,
          dotSize / 2,
          0,
          Math.PI * 2
        );
        pixelCtx.fill();
      }
    }
  }, [findClosestColor]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = image.width;
    canvasRef.current.height = image.height;
    ctx.drawImage(image, 0, 0);

    if (showPixelView && pixelCanvasRef.current) {
      renderPixelView();
    }
  }, [image, showPixelView, renderPixelView]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
      />
      {showPixelView && (
        <canvas
          ref={pixelCanvasRef}
          className="border border-gray-200 rounded-lg"
        />
      )}
    </div>
  );
};
