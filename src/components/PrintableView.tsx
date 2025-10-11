import React, { useEffect, useState, useCallback } from 'react';
import { useBrickifyStore } from '@/store/store';
import { Color } from '@/store/paletteSlice';
import { colorCorrection } from '@/lib/utils';
import { Button } from './ui/button';
import { LoadingOverlay } from './ui/spinner';

interface ColorMapping {
  color: Color;
  number: number;
  count: number;
}

export const PrintableView: React.FC = () => {
  const image = useBrickifyStore((state) => state.image);
  const palette = useBrickifyStore((state) => state.palette);
  const gridBackgroundColor = useBrickifyStore((state) => state.gridBackgroundColor);
  const gridPixelShape = useBrickifyStore((state) => state.gridPixelShape);
  const gridCellSize = useBrickifyStore((state) => state.gridCellSize);
  const setGridBackgroundColor = useBrickifyStore((state) => state.setGridBackgroundColor);
  const setGridPixelShape = useBrickifyStore((state) => state.setGridPixelShape);
  const setGridCellSize = useBrickifyStore((state) => state.setGridCellSize);
  const [colorGrid, setColorGrid] = useState<number[][]>([]);
  const [colorMappings, setColorMappings] = useState<ColorMapping[]>([]);
  const [showNumbersOnly, setShowNumbersOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Calculate luminance to determine if text should be white or black
  const getTextColor = useCallback((rgb: number[]): string => {
    const [r, g, b] = rgb;
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Use white text on dark backgrounds, black on light
    return luminance > 0.5 ? 'black' : 'white';
  }, []);

  // Get grid background color value
  const getGridBackgroundColor = useCallback((color: string): string => {
    const colors: Record<string, string> = {
      white: '#FFFFFF',
      black: '#000000',
      peach: '#FFDAB9',
      darkgrey: '#4B5563',
    };
    return colors[color] || '#FFFFFF';
  }, []);

  // Calculate font size based on cell size
  const fontSize = Math.max(6, Math.floor(gridCellSize * 0.7));

  useEffect(() => {
    if (!image) return;

    const generateGrid = async () => {
      setIsGenerating(true);

      // Allow UI to update with loading state
      await new Promise(resolve => setTimeout(resolve, 0));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const grid: number[][] = [];
      const colorCount = new Map<string, number>();
      const colorToNumber = new Map<string, number>();

      // Create color to number mapping
      palette.forEach((color, index) => {
        const key = color.color.join(',');
        colorToNumber.set(key, index + 1);
        colorCount.set(key, 0);
      });

      for (let y = 0; y < canvas.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const [r, g, b] = colorCorrection(
            data[index],
            data[index + 1],
            data[index + 2]
          );

          const closestColor = findClosestColor(r, g, b);
          const colorKey = closestColor.color.join(',');
          const colorNumber = colorToNumber.get(colorKey) || 1;

          row.push(colorNumber);
          colorCount.set(colorKey, (colorCount.get(colorKey) || 0) + 1);
        }
        grid.push(row);
      }

      const mappings: ColorMapping[] = palette.map((color, index) => ({
        color,
        number: index + 1,
        count: colorCount.get(color.color.join(',')) || 0,
      })).filter(m => m.count > 0);

      setColorGrid(grid);
      setColorMappings(mappings);
      setIsGenerating(false);
    };

    generateGrid();
  }, [image, palette, findClosestColor]);

  const handlePrint = () => {
    window.print();
  };

  if (!image) {
    return null;
  }

  if (isGenerating || colorGrid.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Build Instructions</h3>
        <LoadingOverlay message="Generating building grid..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 print:hidden">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Build Instructions</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowNumbersOnly(!showNumbersOnly)}
              variant="outline"
            >
              {showNumbersOnly ? 'Show Colors' : 'Numbers Only'}
            </Button>
            <Button onClick={handlePrint}>
              Print Instructions
            </Button>
          </div>
        </div>

        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Grid Background:</label>
              <select
                value={gridBackgroundColor}
                onChange={(e) => setGridBackgroundColor(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="peach">Peach</option>
                <option value="darkgrey">Dark Grey</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Pixel Shape:</label>
              <select
                value={gridPixelShape}
                onChange={(e) => setGridPixelShape(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="round">Round (gaps in corners)</option>
                <option value="square">Square (full coverage)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium min-w-[80px]">Cell Size: {gridCellSize}px</label>
            <input
              type="range"
              min="5"
              max="25"
              value={gridCellSize}
              onChange={(e) => setGridCellSize(parseInt(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="printable-content">
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold mb-2">LEGO Brick Building Instructions</h1>
          <p className="text-lg">Size: {image.width}×{image.height} dots</p>
          <p className="text-sm text-gray-600">Follow the numbers to place the correct colored bricks</p>
        </div>

        {/* Color Legend */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-white">
          <h4 className="font-semibold mb-3 text-lg">Color Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorMappings.map((mapping) => (
              <div
                key={mapping.number}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-bold text-lg min-w-[24px]">{mapping.number}</span>
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-400 flex-shrink-0"
                    style={{ backgroundColor: `rgb(${mapping.color.color.join(',')})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mapping.color.name}</p>
                    <p className="text-xs text-gray-600">×{mapping.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Number Grid */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg print:text-base">Building Grid</h4>
            <p className="text-sm text-gray-600">
              {image.width} x {image.height} cells ({gridCellSize}px per cell)
            </p>
          </div>
          <div className="flex justify-center overflow-x-auto">
            <div
              className="plates-container"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.ceil(image.width / 16)}, auto)`,
                gap: '4px',
                margin: '0 auto',
                padding: '8px',
                backgroundColor: getGridBackgroundColor(gridBackgroundColor),
                borderRadius: '8px',
              }}
            >
              {Array.from({ length: Math.ceil(image.height / 16) }).map((_, plateY) =>
                Array.from({ length: Math.ceil(image.width / 16) }).map((_, plateX) => (
                  <div
                    key={`plate-${plateY}-${plateX}`}
                    className="plate-block"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(16, image.width - plateX * 16)}, ${gridCellSize}px)`,
                      gap: showNumbersOnly ? '0' : '1px',
                      gridAutoRows: `${gridCellSize}px`,
                    }}
                  >
                    {Array.from({ length: Math.min(16, image.height - plateY * 16) }).map((_, localY) =>
                      Array.from({ length: Math.min(16, image.width - plateX * 16) }).map((_, localX) => {
                        const y = plateY * 16 + localY;
                        const x = plateX * 16 + localX;
                        const colorNum = colorGrid[y]?.[x];
                        if (!colorNum) return null;

                        const colorMapping = colorMappings.find(m => m.number === colorNum);
                        const bgColor = showNumbersOnly
                          ? 'white'
                          : !colorMapping
                          ? 'white'
                          : `rgb(${colorMapping.color.color.join(',')})`;
                        const textColor = showNumbersOnly || !colorMapping
                          ? 'black'
                          : getTextColor(colorMapping.color.color);

                        return (
                          <div
                            key={`${y}-${x}`}
                            className={`grid-cell ${showNumbersOnly ? 'grid-cell-no-border' : ''} ${gridPixelShape === 'round' ? 'grid-cell-round' : 'grid-cell-square'}`}
                            style={{
                              width: `${gridCellSize}px`,
                              height: `${gridCellSize}px`,
                              fontSize: `${fontSize}px`,
                              backgroundColor: bgColor,
                              color: textColor,
                              textShadow: textColor === 'white'
                                ? '0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)'
                                : '0 0 3px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5)',
                            }}
                          >
                            {showNumbersOnly ? colorNum : ''}
                          </div>
                        );
                      })
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="border border-gray-300 rounded-lg p-4 mt-6 bg-white print:break-before-page">
          <h4 className="font-semibold mb-3 text-lg">Parts List Summary</h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Total Dots:</span> {image.width * image.height}
            </p>
            <p className="text-sm">
              <span className="font-medium">Total Colors:</span> {colorMappings.length}
            </p>
            <div className="mt-4">
              <p className="font-medium text-sm mb-2">Quantity by Color:</p>
              <ul className="space-y-1 text-sm">
                {colorMappings
                  .sort((a, b) => b.count - a.count)
                  .map((mapping) => (
                    <li key={mapping.number} className="flex justify-between">
                      <span>
                        <span className="font-semibold mr-2">{mapping.number}.</span>
                        {mapping.color.name}
                      </span>
                      <span className="font-medium">{mapping.count} dots</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Grid cell base styles */
        .grid-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .grid-cell-no-border {
          border: none !important;
        }

        .grid-cell-round {
          border-radius: 50%;
        }

        .grid-cell-square {
          border-radius: 0;
        }

        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }

          body * {
            visibility: hidden;
          }
          .printable-content, .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:text-base {
            font-size: 1rem;
          }

          /* Scale grid to fit page width */
          .plates-container {
            max-width: 100% !important;
            gap: 2px !important;
            padding: 4px !important;
          }

          .plate-block {
            gap: 1px !important;
          }

          /* Scale grid cells for print */
          .grid-cell {
            width: 8px !important;
            height: 8px !important;
            font-size: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};
