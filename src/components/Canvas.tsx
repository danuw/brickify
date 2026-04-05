import React, { useRef, useEffect, useCallback, useState } from 'react';
import { colorCorrection } from '@/lib/utils';
import { useBrickifyStore } from '@/store/store';
import { Color } from '@/store/paletteSlice';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { LoadingOverlay } from './ui/spinner';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  const image = useBrickifyStore((state) => state.image);
  const showPixelView = useBrickifyStore((state) => state.showPixelView);
  const palette = useBrickifyStore((state) => state.palette);
  const addToHistory = useBrickifyStore((state) => state.addToHistory);
  const backgroundColor = useBrickifyStore((state) => state.backgroundColor);
  const pixelShape = useBrickifyStore((state) => state.pixelShape);
  const setBackgroundColor = useBrickifyStore((state) => state.setBackgroundColor);
  const setPixelShape = useBrickifyStore((state) => state.setPixelShape);

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

  const getBackgroundColorValue = useCallback((color: string): string => {
    const colors: Record<string, string> = {
      white: '#FFFFFF',
      black: '#000000',
      peach: '#FFDAB9',
      grey: '#808080',
    };
    return colors[color] || '#FFFFFF';
  }, []);

  const renderPixelView = useCallback(async () => {
    if (!canvasRef.current || !pixelCanvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const pixelCtx = pixelCanvasRef.current.getContext('2d');
    if (!ctx || !pixelCtx) return;

    setIsRendering(true);

    // Use setTimeout to allow UI to update with loading state
    await new Promise(resolve => setTimeout(resolve, 0));

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imageData.data;
    const dotSize = 8; // Increased to accommodate gap
    const blockSize = 7; // Actual block size (leaving 1px gap)

    pixelCanvasRef.current.width = canvasRef.current.width * dotSize;
    pixelCanvasRef.current.height = canvasRef.current.height * dotSize;

    // Fill background
    pixelCtx.fillStyle = getBackgroundColorValue(backgroundColor);
    pixelCtx.fillRect(0, 0, pixelCanvasRef.current.width, pixelCanvasRef.current.height);

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

        if (pixelShape === 'round') {
          // Draw round pixel
          pixelCtx.beginPath();
          pixelCtx.arc(
            x * dotSize + dotSize / 2,
            y * dotSize + dotSize / 2,
            blockSize / 2,
            0,
            Math.PI * 2
          );
          pixelCtx.fill();
        } else {
          // Draw square pixel with gap
          pixelCtx.fillRect(
            x * dotSize + 0.5,
            y * dotSize + 0.5,
            blockSize,
            blockSize
          );
        }
      }
    }

    setIsRendering(false);
  }, [findClosestColor, backgroundColor, pixelShape, getBackgroundColorValue]);

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

  const handleSaveToHistory = useCallback(() => {
    if (image) {
      addToHistory(image, palette);
    }
  }, [image, palette, addToHistory]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Original Image</h3>
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg max-w-full h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {showPixelView && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">LEGO Brick Preview</h3>
            <Button onClick={handleSaveToHistory} size="sm" disabled={isRendering}>
              Save to History
            </Button>
          </div>

          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Background:</label>
              <Select
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value as any)}
                className="w-32"
                disabled={isRendering}
              >
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="peach">Peach</option>
                <option value="grey">Grey</option>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Shape:</label>
              <Select
                value={pixelShape}
                onChange={(e) => setPixelShape(e.target.value as any)}
                className="w-32"
                disabled={isRendering}
              >
                <option value="round">Round</option>
                <option value="square">Square</option>
              </Select>
            </div>
          </div>

          {isRendering ? (
            <LoadingOverlay message="Rendering LEGO brick preview..." />
          ) : (
            <canvas
              ref={pixelCanvasRef}
              className="border border-gray-200 rounded-lg max-w-full h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
        </div>
      )}
    </div>
  );
};
