import React, { useEffect, useState, useCallback } from 'react';
import { useBrickifyStore } from '@/store/store';
import { Color } from '@/store/paletteSlice';
import { colorCorrection } from '@/lib/utils';
import { Button } from './ui/button';

interface ColorMapping {
  color: Color;
  number: number;
  count: number;
}

export const PrintableView: React.FC = () => {
  const image = useBrickifyStore((state) => state.image);
  const palette = useBrickifyStore((state) => state.palette);
  const [colorGrid, setColorGrid] = useState<number[][]>([]);
  const [colorMappings, setColorMappings] = useState<ColorMapping[]>([]);

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

  useEffect(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
  }, [image, palette, findClosestColor]);

  const handlePrint = () => {
    window.print();
  };

  if (!image || colorGrid.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-lg font-semibold">Build Instructions</h3>
        <Button onClick={handlePrint}>
          Print Instructions
        </Button>
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
        <div className="border border-gray-300 rounded-lg p-4 bg-white overflow-x-auto">
          <h4 className="font-semibold mb-3 text-lg print:text-base">Building Grid</h4>
          <div className="inline-block">
            <table className="border-collapse">
              <tbody>
                {colorGrid.map((row, y) => (
                  <tr key={y}>
                    {row.map((colorNum, x) => (
                      <td
                        key={x}
                        className="border border-gray-400 w-8 h-8 text-center text-xs font-semibold print:w-6 print:h-6 print:text-[10px]"
                        style={{
                          backgroundColor: colorMappings.find(m => m.number === colorNum)
                            ? `rgb(${colorMappings.find(m => m.number === colorNum)!.color.color.join(',')})`
                            : 'white',
                          color: colorNum <= 3 ? 'white' : 'black',
                        }}
                      >
                        {colorNum}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
        @media print {
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
          .print\\:w-6 {
            width: 1.5rem;
          }
          .print\\:h-6 {
            height: 1.5rem;
          }
          .print\\:text-\\[10px\\] {
            font-size: 10px;
          }
          .print\\:text-base {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
