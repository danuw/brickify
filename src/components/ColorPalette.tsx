import React, { useCallback, useState } from 'react';
import { useBrickifyStore } from '@/store/store';
import { PALETTE_PRESETS } from '@/store/paletteSlice';
import { quantizeColors } from '@/lib/colorQuantize';
import { Button } from './ui/button';

export const ColorPalette: React.FC = () => {
  const palette = useBrickifyStore((state) => state.palette);
  const currentPresetIndex = useBrickifyStore((state) => state.currentPresetIndex);
  const customColorCount = useBrickifyStore((state) => state.customColorCount);
  const selectPreset = useBrickifyStore((state) => state.selectPreset);
  const setCustomPaletteFromImage = useBrickifyStore((state) => state.setCustomPaletteFromImage);
  const setCustomColorCount = useBrickifyStore((state) => state.setCustomColorCount);
  const image = useBrickifyStore((state) => state.image);

  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractFromImage = useCallback(async () => {
    if (!image) return;
    setIsExtracting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgbColors = quantizeColors(imageData, customColorCount);
      const colors = rgbColors.map((rgb, i) => ({
        name: `Color ${i + 1}`,
        color: rgb as [number, number, number],
      }));
      setCustomPaletteFromImage(colors);
    } finally {
      setIsExtracting(false);
    }
  }, [image, customColorCount, setCustomPaletteFromImage]);

  const currentPreset = currentPresetIndex >= 0 ? PALETTE_PRESETS[currentPresetIndex] : null;

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Color Palette</h3>

        {/* Preset buttons */}
        <div className="flex gap-2 flex-wrap mb-3">
          {PALETTE_PRESETS.map((preset, index) => (
            <Button
              key={preset.name}
              onClick={() => selectPreset(index)}
              variant={currentPresetIndex === index ? 'default' : 'outline'}
              size="sm"
            >
              {preset.name}
            </Button>
          ))}
        </div>

        {/* Description + buy link for presets that have one */}
        {currentPreset && (
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            {currentPreset.description}
            {currentPreset.link && (
              <a
                href={currentPreset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 underline"
              >
                🛒 Buy these bricks
              </a>
            )}
          </p>
        )}
        {currentPresetIndex === -1 && (
          <p className="text-sm text-gray-600 mb-3">Custom palette extracted from your image</p>
        )}

        {/* From-image extractor */}
        {image && (
          <div className="flex items-center gap-3 mt-1 mb-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium">
                Extract from image
                <span className="ml-2 text-xs text-gray-500 font-normal">({customColorCount} colors)</span>
              </label>
              <input
                type="range"
                min={4}
                max={32}
                step={2}
                value={customColorCount}
                onChange={(e) => setCustomColorCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>4</span><span>32</span>
              </div>
            </div>
            <Button
              size="sm"
              variant={currentPresetIndex === -1 ? 'default' : 'outline'}
              onClick={handleExtractFromImage}
              disabled={isExtracting}
            >
              {isExtracting ? 'Extracting…' : currentPresetIndex === -1 ? '↺ Re-extract' : 'From Image'}
            </Button>
          </div>
        )}
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-4 gap-2">
        {palette.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: `rgb(${color.color.join(',')})` }}
            />
            <span className="text-xs mt-1 text-center leading-tight">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
